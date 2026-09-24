import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const INGEST_TOKEN = Deno.env.get("ARTIFACT_CLEANUP_TOKEN") ?? "";
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
const ROLES = new Set(["editor","builder","challenger","reviewer","system","human","image-reviewer"]);
const SEVERITIES = new Set(["info","low","medium","high","blocker"]);
const TYPES = new Set(["status","proposal","build","finding","review","revision","heartbeat","preview","gate","decision","error"]);
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-ingest-token",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};
function json(body: unknown, status=200) { return new Response(JSON.stringify(body), { status, headers: cors }); }
function cleanString(v: unknown, max: number) {
  if (typeof v !== "string") throw new Error("expected string");
  const s = v.trim(); if (!s || s.length > max) throw new Error("invalid string"); return s;
}
function sanitizeEvent(raw: any) {
  const event_id = cleanString(raw.event_id, 80);
  if (!/^[0-9a-fA-F-]{36}$/.test(event_id)) throw new Error("invalid event_id");
  const job_id = cleanString(raw.job_id, 160);
  const role = cleanString(raw.role, 40); if (!ROLES.has(role)) throw new Error("invalid role");
  const provider = cleanString(raw.provider, 100); if (/(key=|token=|secret=)/i.test(provider)) throw new Error("unsafe provider");
  const event_type = cleanString(raw.type, 40); if (!TYPES.has(event_type)) throw new Error("invalid type");
  const summary = cleanString(raw.summary, 2000);
  const severity = cleanString(raw.severity ?? "info", 20); if (!SEVERITIES.has(severity)) throw new Error("invalid severity");
  const state = cleanString(raw.state, 40);
  const created_at = new Date(cleanString(raw.created_at, 80)); if (Number.isNaN(created_at.getTime())) throw new Error("invalid created_at");
  const evidence = Array.isArray(raw.evidence) ? raw.evidence.slice(0,20).map((e:any)=>({kind:"reference",ref:cleanString(e?.ref,500)})) : [];
  return { event_id, job_id, role, provider, event_type, summary, evidence, severity, state, created_at: created_at.toISOString() };
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method === "GET") {
    const url = new URL(req.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "200") || 200, 1), 500);
    const job = url.searchParams.get("job_id");
    let q = supabase.from("orchestrator_events").select("event_id,job_id,role,provider,event_type,summary,evidence,severity,state,created_at").order("created_at", { ascending: true }).limit(limit);
    if (job) q = q.eq("job_id", job.slice(0,160));
    const { data, error } = await q; if (error) return json({ error: "feed unavailable" }, 500);
    return json({ events: (data ?? []).map((x:any)=>({ ...x, type:x.event_type, event_type:undefined })) });
  }
  if (req.method === "POST") {
    if (!INGEST_TOKEN) return json({ error: "ingest disabled" }, 503);
    const token = req.headers.get("x-ingest-token") ?? "";
    if (token.length !== INGEST_TOKEN.length || token !== INGEST_TOKEN) return json({ error: "unauthorized" }, 401);
    const text = await req.text(); if (text.length > 200_000) return json({ error: "payload too large" }, 413);
    let body:any; try { body = JSON.parse(text); } catch { return json({ error: "invalid json" }, 400); }
    const incoming = Array.isArray(body?.events) ? body.events : [body];
    if (incoming.length < 1 || incoming.length > 100) return json({ error: "invalid event count" }, 400);
    let rows; try { rows = incoming.map(sanitizeEvent); } catch (e) { return json({ error: String(e?.message ?? e) }, 400); }
    const { error } = await supabase.from("orchestrator_events").upsert(rows, { onConflict: "event_id", ignoreDuplicates: true });
    if (error) return json({ error: "ingest failed" }, 500);
    return json({ accepted: rows.length }, 202);
  }
  return json({ error: "method not allowed" }, 405);
});
