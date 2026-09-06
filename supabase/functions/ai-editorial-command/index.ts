import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const EDITOR_MODEL = Deno.env.get("OPENAI_EDITOR_MODEL") ?? "gpt-5.6-luna";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-supabase-api-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function extractOutputText(body: any): string {
  if (typeof body?.output_text === "string") return body.output_text;
  for (const item of Array.isArray(body?.output) ? body.output : []) {
    if (item?.type !== "message") continue;
    for (const part of Array.isArray(item?.content) ? item.content : []) {
      if (part?.type === "output_text" && typeof part.text === "string") return part.text;
    }
  }
  return "";
}

async function serviceFetch(path: string, init: RequestInit = {}) {
  if (!SERVICE_ROLE) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE}`,
      "apikey": SERVICE_ROLE,
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(init.headers ?? {})
    }
  });
}

async function patchCommand(commandId: string, patch: Record<string, unknown>) {
  const r = await serviceFetch(`ai_editorial_commands?id=eq.${encodeURIComponent(commandId)}`, {
    method: "PATCH",
    headers: { "Prefer": "return=minimal" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() })
  });
  if (!r.ok) throw new Error(`command update failed: ${r.status} ${await r.text()}`);
}

async function insertEvents(events: Record<string, unknown>[]) {
  if (!events.length) return;
  const r = await serviceFetch("orchestrator_events", {
    method: "POST",
    headers: { "Prefer": "return=minimal" },
    body: JSON.stringify(events)
  });
  if (!r.ok) throw new Error(`event insert failed: ${r.status} ${await r.text()}`);
}

async function planWithGPT(params: {
  commandId: string;
  jobId: string;
  instruction: string;
  requestedCount: number | null;
  options: Record<string, unknown>;
}) {
  if (!OPENAI_API_KEY) {
    await patchCommand(params.commandId, {
      status: "queued",
      last_error: "OPENAI_API_KEY is not configured"
    });
    await insertEvents([{
      event_id: crypto.randomUUID(),
      job_id: params.jobId,
      role: "system",
      provider: "orchestrator",
      event_type: "status",
      summary: "GPT編集長のAPIキーが未設定のため、案件は受付済みのまま待機しています。",
      evidence: [{ kind: "command", ref: params.commandId }],
      severity: "medium",
      state: "QUEUED",
      created_at: new Date().toISOString(),
      discussion: { command_id: params.commandId, stage: "editor-waiting-for-api-key" },
      availability: { primary_provider: "openai-editor", status: "unavailable", reason: "missing-api-key" }
    }]);
    return { planned: false, waiting_for_key: true, model: EDITOR_MODEL };
  }

  await patchCommand(params.commandId, {
    status: "planning",
    started_at: new Date().toISOString(),
    last_error: null
  });

  const targetCount = params.requestedCount ?? 0;
  const plannerPrompt = [
    "あなたはdenkicontrol.comのAI編集部の編集長です。管理者の指示を、実行可能な案件キューへ分解してください。",
    "既存サイトの品質、安全性、重複回避、一次情報重視を優先します。",
    "メーカー仕様、型式、パラメータ、規格、安全、最新情報に関係する案件は needs_research=true にしてください。",
    "research_brief には調査担当が検索すべきメーカー公式資料、確認項目、最新版確認の条件を具体的に書いてください。",
    "requested_count が指定されている場合は jobs の件数を必ず一致させてください。指定がない場合は指示から妥当な件数を決め、最大10件にしてください。",
    "各jobのtitleは日本語で短く、goalは制作担当へ渡せる具体性を持たせてください。",
    `管理者指示: ${params.instruction}`,
    `requested_count: ${targetCount || "未指定"}`,
    `options: ${JSON.stringify(params.options)}`
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: EDITOR_MODEL,
      store: false,
      reasoning: { effort: "low" },
      input: plannerPrompt,
      text: {
        format: {
          type: "json_schema",
          name: "editorial_plan",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["summary", "needs_research", "research_brief", "jobs"],
            properties: {
              summary: { type: "string" },
              needs_research: { type: "boolean" },
              research_brief: { type: "string" },
              jobs: {
                type: "array",
                minItems: 1,
                maxItems: 50,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["title", "goal", "content_type", "priority", "needs_research", "research_brief"],
                  properties: {
                    title: { type: "string" },
                    goal: { type: "string" },
                    content_type: { type: "string", enum: ["new_article", "article_update", "site_improvement", "research", "other"] },
                    priority: { type: "string", enum: ["high", "medium", "low"] },
                    needs_research: { type: "boolean" },
                    research_brief: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    })
  });

  const raw = await response.text();
  let body: any = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = { raw }; }
  if (!response.ok) throw new Error(`OpenAI response ${response.status}: ${raw.slice(0, 800)}`);

  const outputText = extractOutputText(body);
  if (!outputText) throw new Error("OpenAI returned no structured output");
  const plan = JSON.parse(outputText);
  if (!Array.isArray(plan.jobs) || !plan.jobs.length) throw new Error("GPT editor returned no jobs");
  if (params.requestedCount && plan.jobs.length !== params.requestedCount) {
    throw new Error(`GPT editor returned ${plan.jobs.length} jobs; expected ${params.requestedCount}`);
  }

  const now = new Date().toISOString();
  const anyResearch = Boolean(plan.needs_research || plan.jobs.some((j: any) => j.needs_research));
  const events: Record<string, unknown>[] = [{
    event_id: crypto.randomUUID(),
    job_id: params.jobId,
    role: "editor",
    provider: "openai-editor",
    event_type: "proposal",
    summary: String(plan.summary).slice(0, 2000),
    evidence: [{ kind: "command", ref: params.commandId }],
    severity: "info",
    state: "PLANNING",
    created_at: now,
    discussion: {
      command_id: params.commandId,
      model: EDITOR_MODEL,
      job_count: plan.jobs.length,
      needs_research: anyResearch,
      research_brief: String(plan.research_brief || "").slice(0, 3000),
      stage: "editor-plan"
    },
    availability: { primary_provider: "openai-editor", status: "online", model: EDITOR_MODEL }
  }];

  plan.jobs.forEach((job: any, index: number) => {
    const childJobId = `${params.jobId}-${String(index + 1).padStart(2, "0")}`;
    events.push({
      event_id: crypto.randomUUID(),
      job_id: childJobId,
      role: "editor",
      provider: "openai-editor",
      event_type: "proposal",
      summary: `${String(job.title).slice(0, 300)}\n${String(job.goal).slice(0, 1500)}`.slice(0, 2000),
      evidence: [{ kind: "parent-command", ref: params.commandId }],
      severity: job.priority === "high" ? "medium" : "info",
      state: "PLANNING",
      created_at: now,
      discussion: {
        command_id: params.commandId,
        parent_job_id: params.jobId,
        child_index: index + 1,
        content_type: job.content_type,
        priority: job.priority,
        needs_research: Boolean(job.needs_research),
        research_brief: String(job.research_brief || "").slice(0, 3000),
        model: EDITOR_MODEL,
        stage: "editor-child-job"
      },
      availability: { primary_provider: "openai-editor", status: "online", model: EDITOR_MODEL }
    });
  });

  await insertEvents(events);
  await patchCommand(params.commandId, {
    status: anyResearch ? "needs_research" : "running",
    last_error: null
  });

  return {
    planned: true,
    model: EDITOR_MODEL,
    job_count: plan.jobs.length,
    needs_research: anyResearch,
    plan
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const raw = req.headers.get("authorization") ?? "";
  const token = raw.toLowerCase().startsWith("bearer ") ? raw.slice(7).trim() : "";
  if (!token) return json({ error: "authentication required" }, 401);

  let input: { instruction?: unknown; requested_count?: unknown; options?: unknown } = {};
  try { input = await req.json(); } catch { return json({ error: "invalid json" }, 400); }

  const instruction = typeof input.instruction === "string" ? input.instruction.trim() : "";
  if (!instruction || instruction.length > 4000) return json({ error: "instruction must be 1..4000 characters" }, 400);

  let requestedCount: number | null = null;
  if (input.requested_count !== undefined && input.requested_count !== null && input.requested_count !== "") {
    const n = Number(input.requested_count);
    if (!Number.isInteger(n) || n < 1 || n > 50) return json({ error: "requested_count must be 1..50" }, 400);
    requestedCount = n;
  }

  const options = input.options && typeof input.options === "object" && !Array.isArray(input.options)
    ? input.options as Record<string, unknown>
    : {};

  try {
    const rpc = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ai_editorial_submit_command`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": ANON_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ p_instruction: instruction, p_requested_count: requestedCount, p_options: options })
    });

    const text = await rpc.text();
    let body: any = {};
    try { body = text ? JSON.parse(text) : {}; } catch { body = { error: "invalid upstream response" }; }

    if (!rpc.ok) {
      const status = rpc.status === 401 ? 401 : rpc.status === 403 ? 403 : 500;
      return json({ error: "command submit failed", upstream_status: rpc.status, detail: body }, status);
    }

    const commandId = String(body?.command_id ?? "");
    const jobId = String(body?.job_id ?? "");
    if (!commandId || !jobId) return json({ error: "command submit returned invalid identifiers" }, 500);

    try {
      const planning = await planWithGPT({ commandId, jobId, instruction, requestedCount, options });
      return json({ ...body, planning }, planning.planned ? 201 : 202);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      try {
        await patchCommand(commandId, { status: "failed", last_error: message.slice(0, 2000) });
        await insertEvents([{
          event_id: crypto.randomUUID(),
          job_id: jobId,
          role: "system",
          provider: "orchestrator",
          event_type: "error",
          summary: `GPT編集長の企画処理に失敗しました: ${message}`.slice(0, 2000),
          evidence: [{ kind: "command", ref: commandId }],
          severity: "high",
          state: "FAILED",
          created_at: new Date().toISOString(),
          discussion: { command_id: commandId, stage: "editor-plan", model: EDITOR_MODEL },
          availability: { primary_provider: "openai-editor", status: "error", model: EDITOR_MODEL }
        }]);
      } catch (recordError) {
        console.error("failed to record GPT editor error", recordError);
      }
      return json({ ...body, planning: { planned: false, error: message, model: EDITOR_MODEL } }, 201);
    }
  } catch (error) {
    return json({ error: "unexpected failure", detail: error instanceof Error ? error.message : String(error) }, 500);
  }
});
