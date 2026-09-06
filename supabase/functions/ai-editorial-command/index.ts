import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const EDITOR_MODEL = Deno.env.get("OPENAI_EDITOR_MODEL") ?? "gpt-5.6-luna";
const RESEARCH_MODEL = Deno.env.get("OPENAI_RESEARCH_MODEL") ?? "gpt-5.6-luna";

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

function extractWebSourceUrls(body: any): Set<string> {
  const urls = new Set<string>();
  for (const item of Array.isArray(body?.output) ? body.output : []) {
    if (item?.type !== "web_search_call") continue;
    const sources = Array.isArray(item?.action?.sources) ? item.action.sources : [];
    for (const source of sources) {
      if (source?.type === "url" && typeof source.url === "string" && source.url.startsWith("https://")) {
        urls.add(source.url);
      }
    }
    if (item?.action?.type === "open_page" && typeof item?.action?.url === "string") urls.add(item.action.url);
  }
  return urls;
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

async function openAIResponse(payload: Record<string, unknown>) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const raw = await response.text();
  let body: any = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch { body = { raw }; }
  if (!response.ok) throw new Error(`OpenAI response ${response.status}: ${raw.slice(0, 800)}`);
  return body;
}

async function planWithGPT(params: {
  commandId: string;
  jobId: string;
  instruction: string;
  requestedCount: number | null;
  options: Record<string, unknown>;
}) {
  if (!OPENAI_API_KEY) {
    await patchCommand(params.commandId, { status: "queued", last_error: "OPENAI_API_KEY is not configured" });
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

  await patchCommand(params.commandId, { status: "planning", started_at: new Date().toISOString(), last_error: null });

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

  const body = await openAIResponse({
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
  });

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
  await patchCommand(params.commandId, { status: anyResearch ? "needs_research" : "running", last_error: null });

  return { planned: true, model: EDITOR_MODEL, job_count: plan.jobs.length, needs_research: anyResearch, plan };
}

async function researchWithWebSearch(params: {
  commandId: string;
  parentJobId: string;
  plan: any;
}) {
  const targets = params.plan.jobs
    .map((job: any, index: number) => ({ ...job, child_index: index + 1 }))
    .filter((job: any) => job.needs_research);
  if (!targets.length) return { researched: false, reason: "not-needed", results: [] };

  await patchCommand(params.commandId, { status: "needs_research", last_error: null });
  const prompt = [
    "あなたはdenkicontrol.comの技術資料調査担当です。必ずWeb検索を使い、各案件について一次情報を調査してください。",
    "最優先はメーカー公式サイト、メーカー公式マニュアル、公式FAQ、公式技術資料です。販売店・まとめサイト・掲示板は一次根拠として採用しません。",
    "最新版・改訂版を優先し、対象機種、資料名、資料番号、公開日または改訂情報を確認してください。確認できない情報は推測せず『確認できない』としてください。",
    "検索結果のURLをsourcesに入れてください。技術記事に使う具体的な端子番号、パラメータ番号、初期値、安全機能は対象機種が確認できた場合のみ要点へ含めてください。",
    "各案件を別々に整理してください。",
    JSON.stringify(targets.map((job: any) => ({ child_index: job.child_index, title: job.title, goal: job.goal, research_brief: job.research_brief })))
  ].join("\n");

  const body = await openAIResponse({
    model: RESEARCH_MODEL,
    store: false,
    reasoning: { effort: "low" },
    tools: [{ type: "web_search", search_context_size: "medium" }],
    tool_choice: "required",
    include: ["web_search_call.action.sources"],
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "technical_research",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["results"],
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["child_index", "summary", "key_points", "sources", "confidence"],
                properties: {
                  child_index: { type: "integer" },
                  summary: { type: "string" },
                  key_points: { type: "array", items: { type: "string" } },
                  sources: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      required: ["title", "url", "published_or_revised", "notes"],
                      properties: {
                        title: { type: "string" },
                        url: { type: "string" },
                        published_or_revised: { type: "string" },
                        notes: { type: "string" }
                      }
                    }
                  },
                  confidence: { type: "number", minimum: 0, maximum: 1 }
                }
              }
            }
          }
        }
      }
    }
  });

  const outputText = extractOutputText(body);
  if (!outputText) throw new Error("Web research returned no structured output");
  const research = JSON.parse(outputText);
  const observedUrls = extractWebSourceUrls(body);
  const events: Record<string, unknown>[] = [];
  const sanitizedResults: any[] = [];
  const now = new Date().toISOString();

  for (const result of Array.isArray(research.results) ? research.results : []) {
    const index = Number(result.child_index);
    const target = targets.find((x: any) => x.child_index === index);
    if (!target) continue;
    const verifiedSources = (Array.isArray(result.sources) ? result.sources : []).filter((s: any) => {
      const url = String(s?.url || "");
      return url.startsWith("https://") && observedUrls.has(url);
    }).slice(0, 12);
    const evidence = verifiedSources.map((s: any) => ({ kind: "official-web-source", ref: String(s.url).slice(0, 1500), title: String(s.title || "").slice(0, 300) }));
    const keyPoints = (Array.isArray(result.key_points) ? result.key_points : []).map((x: any) => String(x)).slice(0, 12);
    const summary = [String(result.summary || ""), ...keyPoints.map((x: string) => `・${x}`)].join("\n").slice(0, 2000);
    const childJobId = `${params.parentJobId}-${String(index).padStart(2, "0")}`;
    events.push({
      event_id: crypto.randomUUID(),
      job_id: childJobId,
      role: "editor",
      provider: "openai-web-research",
      event_type: "research",
      summary,
      evidence,
      severity: verifiedSources.length ? "info" : "medium",
      state: "PLANNING",
      created_at: now,
      discussion: {
        command_id: params.commandId,
        parent_job_id: params.parentJobId,
        child_index: index,
        stage: "official-web-research",
        model: RESEARCH_MODEL,
        confidence: Number(result.confidence || 0),
        source_count: verifiedSources.length,
        sources: verifiedSources
      },
      availability: { primary_provider: "openai-web-research", status: "online", model: RESEARCH_MODEL, web_search: true }
    });
    sanitizedResults.push({ ...result, sources: verifiedSources });
  }

  if (!events.length) throw new Error("Web research returned no matching child results");
  await insertEvents(events);
  await patchCommand(params.commandId, { status: "running", last_error: null });
  await insertEvents([{
    event_id: crypto.randomUUID(),
    job_id: params.parentJobId,
    role: "system",
    provider: "orchestrator",
    event_type: "status",
    summary: `公式Web調査が完了しました。${events.length}件の案件へ調査結果を追加しました。`,
    evidence: [],
    severity: "info",
    state: "PLANNING",
    created_at: new Date().toISOString(),
    discussion: { command_id: params.commandId, stage: "research-complete", researched_jobs: events.length },
    availability: { primary_provider: "openai-web-research", status: "online", model: RESEARCH_MODEL }
  }]);
  return { researched: true, model: RESEARCH_MODEL, job_count: events.length, results: sanitizedResults };
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
      if (!planning.planned) return json({ ...body, planning }, 202);
      let research: any = { researched: false, reason: "not-needed" };
      if (planning.needs_research) {
        try {
          research = await researchWithWebSearch({ commandId, parentJobId: jobId, plan: planning.plan });
        } catch (researchError) {
          const researchMessage = researchError instanceof Error ? researchError.message : String(researchError);
          await patchCommand(commandId, { status: "needs_research", last_error: researchMessage.slice(0, 2000) });
          await insertEvents([{
            event_id: crypto.randomUUID(),
            job_id: jobId,
            role: "system",
            provider: "orchestrator",
            event_type: "error",
            summary: `公式Web調査に失敗しました。案件は調査待ちとして保持します: ${researchMessage}`.slice(0, 2000),
            evidence: [{ kind: "command", ref: commandId }],
            severity: "high",
            state: "PLANNING",
            created_at: new Date().toISOString(),
            discussion: { command_id: commandId, stage: "official-web-research", model: RESEARCH_MODEL },
            availability: { primary_provider: "openai-web-research", status: "error", model: RESEARCH_MODEL }
          }]);
          research = { researched: false, error: researchMessage, model: RESEARCH_MODEL };
        }
      }
      return json({ ...body, planning, research }, 201);
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
