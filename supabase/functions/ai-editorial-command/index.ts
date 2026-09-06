import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

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

  const options = input.options && typeof input.options === "object" && !Array.isArray(input.options) ? input.options : {};

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
    let body: unknown = {};
    try { body = text ? JSON.parse(text) : {}; } catch { body = { error: "invalid upstream response" }; }

    if (!rpc.ok) {
      const status = rpc.status === 401 ? 401 : rpc.status === 403 ? 403 : 500;
      return json({ error: "command submit failed", upstream_status: rpc.status, detail: body }, status);
    }
    return json(body, 201);
  } catch (error) {
    return json({ error: "unexpected failure", detail: error instanceof Error ? error.message : String(error) }, 500);
  }
});
