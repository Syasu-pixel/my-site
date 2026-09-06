import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "ai-artifacts";
const MAX_BYTES = 5 * 1024 * 1024;
const DOWNLOAD_TTL_SECONDS = 10 * 60;
const ALLOWED_MIME = new Set(["image/webp", "image/png", "image/jpeg"]);
const ALLOWED_EXT = new Map([
  ["image/webp", ".webp"],
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
]);

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aa = enc.encode(a);
  const bb = enc.encode(b);
  let diff = aa.length ^ bb.length;
  const len = Math.max(aa.length, bb.length);
  for (let i = 0; i < len; i++) diff |= (aa[i % aa.length] ?? 0) ^ (bb[i % bb.length] ?? 0);
  return diff === 0;
}

function requireBrokerAuth(req: Request): boolean {
  const configured = Deno.env.get("ARTIFACT_BROKER_TOKEN") ?? "";
  const supplied = req.headers.get("x-artifact-broker-token") ?? "";
  return configured.length >= 32 && supplied.length > 0 && safeEqual(configured, supplied);
}

function normalizeFileName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$/.test(name)) return null;
  if (name.includes("..")) return null;
  return name;
}

function normalizeMime(value: unknown): string | null {
  return typeof value === "string" && ALLOWED_MIME.has(value) ? value : null;
}

function extensionMatches(name: string, mime: string): boolean {
  const lower = name.toLowerCase();
  if (mime === "image/jpeg") return lower.endsWith(".jpg") || lower.endsWith(".jpeg");
  return lower.endsWith(ALLOWED_EXT.get(mime) ?? "");
}

function validObjectPath(value: unknown): value is string {
  return typeof value === "string" && /^incoming\/[0-9]{4}-[0-9]{2}-[0-9]{2}\/[0-9a-f-]{36}\/[A-Za-z0-9][A-Za-z0-9._-]{0,119}$/.test(value);
}

function detectMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  if (bytes.length >= 8 &&
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  return null;
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "POST required" });
  if (!requireBrokerAuth(req)) return json(401, { error: "unauthorized" });

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json(500, { error: "broker storage configuration missing" });

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid JSON" });
  }

  const action = body.action;

  if (action === "create_upload") {
    const fileName = normalizeFileName(body.file_name);
    const mimeType = normalizeMime(body.mime_type);
    if (!fileName || !mimeType || !extensionMatches(fileName, mimeType)) {
      return json(400, { error: "invalid file name or MIME type" });
    }

    const day = new Date().toISOString().slice(0, 10);
    const objectPath = `incoming/${day}/${crypto.randomUUID()}/${fileName}`;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(objectPath, { upsert: false });
    if (error || !data?.signedUrl) return json(502, { error: "could not create upload URL" });

    return json(200, {
      object_path: objectPath,
      upload_url: data.signedUrl,
      expires_in_seconds: 7200,
      max_bytes: MAX_BYTES,
      mime_type: mimeType,
    });
  }

  if (action === "prepare_download") {
    const objectPath = body.object_path;
    const expectedSha = typeof body.sha256 === "string" ? body.sha256.toLowerCase() : "";
    if (!validObjectPath(objectPath) || !/^[0-9a-f]{64}$/.test(expectedSha)) {
      return json(400, { error: "invalid object path or SHA-256" });
    }

    const { data: blob, error: downloadError } = await supabase.storage.from(BUCKET).download(objectPath);
    if (downloadError || !blob) return json(404, { error: "artifact not found" });
    if (blob.size < 1 || blob.size > MAX_BYTES) return json(400, { error: "artifact size rejected" });

    const bytes = new Uint8Array(await blob.arrayBuffer());
    const detectedMime = detectMime(bytes);
    if (!detectedMime) return json(400, { error: "artifact signature rejected" });

    const fileName = objectPath.split("/").at(-1) ?? "";
    if (!extensionMatches(fileName, detectedMime)) return json(400, { error: "extension does not match content" });

    const actualSha = await sha256Hex(bytes);
    if (!safeEqual(actualSha, expectedSha)) return json(400, { error: "SHA-256 mismatch" });

    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(objectPath, DOWNLOAD_TTL_SECONDS, { download: false });
    if (error || !data?.signedUrl) return json(502, { error: "could not create download URL" });

    return json(200, {
      object_path: objectPath,
      download_url: data.signedUrl,
      expires_in_seconds: DOWNLOAD_TTL_SECONDS,
      sha256: actualSha,
      size_bytes: blob.size,
      mime_type: detectedMime,
    });
  }

  if (action === "delete") {
    const objectPath = body.object_path;
    if (!validObjectPath(objectPath)) return json(400, { error: "invalid object path" });
    const { error } = await supabase.storage.from(BUCKET).remove([objectPath]);
    if (error) return json(502, { error: "delete failed" });
    return json(200, { deleted: true, object_path: objectPath });
  }

  return json(400, { error: "unknown action" });
});
