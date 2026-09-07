import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };

const U = Deno.env.get("SUPABASE_URL") ?? "";
const K = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const H = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-supabase-api-version",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};
const J = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: H });

async function rpc(raw: string, name: string, args: Record<string, unknown>) {
  const r = await fetch(`${U}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { Authorization: raw, apikey: K, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(args)
  });
  const text = await r.text();
  let body: any = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!r.ok) throw new Error(`${name} failed ${r.status}: ${text.slice(0, 500)}`);
  return body;
}

function queued(body: any) {
  const es = Array.isArray(body?.events) ? body.events : [];
  const m = new Map<string, any>();
  for (const e of es) {
    const x = String(e?.job_id ?? "").match(/^command-([0-9a-f-]{36})$/i);
    if (!x) continue;
    const p = m.get(x[1]);
    if (!p || new Date(e?.created_at ?? 0) > new Date(p?.created_at ?? 0)) m.set(x[1], e);
  }
  return [...m.entries()]
    .filter(([, e]) => String(e?.state) === "QUEUED")
    .map(([id]) => id)
    .slice(0, 1);
}

function normalizeSingleDeliverable(body: any) {
  const es = Array.isArray(body?.events) ? body.events : null;
  if (!es) return body;

  const roots = new Map<string, number>();
  for (const e of es) {
    const job = String(e?.job_id ?? "");
    if (!/^command-[0-9a-f-]{36}$/i.test(job)) continue;
    const d = e?.discussion && typeof e.discussion === "object" ? e.discussion : {};
    const count = Number(d.deliverable_count ?? d.requested_count ?? 0);
    if (d.queue_policy === "one-deliverable-one-queue" || count > 0) {
      roots.set(job, Number.isFinite(count) && count > 0 ? count : 1);
    }
  }
  if (!roots.size) return body;

  const events = es.map((e: any) => {
    const job = String(e?.job_id ?? "");
    const m = job.match(/^(command-[0-9a-f-]{36})-(\d{2})$/i);
    if (!m || roots.get(m[1]) !== 1) return e;
    const discussion = e?.discussion && typeof e.discussion === "object"
      ? { ...e.discussion, original_job_id: job, collapsed_to_parent: true }
      : e?.discussion;
    return { ...e, job_id: m[1], discussion };
  });

  return { ...body, events };
}

async function run(raw: string, id: string) {
  try {
    const r = await fetch(`${U}/functions/v1/ai-editorial-process-command`, {
      method: "POST",
      headers: { Authorization: raw, apikey: K, "Content-Type": "application/json" },
      body: JSON.stringify({ command_id: id })
    });
    if (!r.ok) console.error("queue process failed", id, r.status, (await r.text()).slice(0, 500));
  } catch (e) {
    console.error("queue process exception", id, e);
  }
}

async function addRetryEvent(raw: string, id: string, retryAt: string | null) {
  await rpc(raw, "ai_editorial_command_add_events", {
    p_command_id: id,
    p_events: [{
      event_id: crypto.randomUUID(),
      job_id: `command-${id}`,
      role: "system",
      provider: "orchestrator",
      event_type: "status",
      summary: "OpenAI APIの利用上限が回復予定時刻に達したため、同じ案件を自動再開します。",
      evidence: [],
      severity: "info",
      state: "PLANNING",
      created_at: new Date().toISOString(),
      discussion: { command_id: id, stage: "auto-retry", retry_at: retryAt, retry_policy: "same-queue" },
      availability: { primary_provider: "orchestrator", status: "online" }
    }]
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  if (req.method !== "GET") return J({ error: "method not allowed" }, 405);

  try {
    const raw = req.headers.get("authorization") ?? "";
    if (!raw.toLowerCase().startsWith("bearer ")) return J({ error: "authentication required" }, 401);

    const url = new URL(req.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "1000") || 1000, 1), 1000);
    const job = url.searchParams.get("job_id");

    const r = await fetch(`${U}/rest/v1/rpc/ai_editorial_secure_feed`, {
      method: "POST",
      headers: { Authorization: raw, apikey: K, "Content-Type": "application/json" },
      body: JSON.stringify({ p_limit: limit, p_job_id: job })
    });

    const text = await r.text();
    let body: any;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { raw: text };
    }

    if (!r.ok) return J({ error: "rpc feed failed", status: r.status, detail: body }, r.status);

    if (!job) {
      let autoRetry: any = null;
      try {
        autoRetry = await rpc(raw, "ai_editorial_claim_retry", {});
      } catch (e) {
        console.error("auto retry claim failed", e);
      }

      if (autoRetry?.claimed && autoRetry?.command_id) {
        const id = String(autoRetry.command_id);
        try {
          await addRetryEvent(raw, id, autoRetry.retry_at ? String(autoRetry.retry_at) : null);
        } catch (e) {
          console.error("auto retry event failed", id, e);
        }
        const task = run(raw, id);
        try {
          EdgeRuntime.waitUntil(task);
        } catch {
          task.catch(console.error);
        }
      } else {
        const ids = queued(body);
        if (ids.length) {
          const task = run(raw, ids[0]);
          try {
            EdgeRuntime.waitUntil(task);
          } catch {
            task.catch(console.error);
          }
        }
      }

      body = normalizeSingleDeliverable(body);
      body = { ...body, auto_retry: autoRetry };
    }

    return J(body);
  } catch (e) {
    return J({ error: "unexpected failure", detail: e instanceof Error ? e.message : String(e) }, 500);
  }
});