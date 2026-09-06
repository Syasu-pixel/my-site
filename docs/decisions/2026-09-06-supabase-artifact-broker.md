# Decision: Supabase temporary artifact broker

Date: 2026-09-06
Status: proposed in v0.1 implementation

## Decision

Use the existing Supabase Free project and private `ai-artifacts` bucket as a temporary transport layer between AI artifact producers and the constrained GitHub artifact writer.

Use a Supabase Edge Function as a narrow broker that creates signed upload URLs, validates stored artifacts before download, creates short-lived signed download URLs, and deletes temporary objects after confirmed transfer.

## Rationale

- Keeps GitHub as the durable source of truth.
- Avoids giving producer AIs the Supabase service-role key or S3 credentials.
- Keeps the Storage bucket private.
- Reuses the provider-neutral GitHub writer already merged in PR #1295.
- Supports model/provider replacement without changing the repository write boundary.
- Can remain within the Supabase Free tier for the intended low-volume temporary image-transfer workload, subject to Free-plan quotas.

## Evidence

Supabase Storage supports private buckets, signed upload URLs, time-limited signed download URLs, and API-based object deletion. Signed upload URLs are currently documented as valid for two hours. The broker adds its own validation before a download URL is handed to GitHub Writer.

## Counterarguments considered

1. **Direct S3 credentials per AI** — rejected because credentials are broad and difficult to rotate safely across many providers.
2. **Public temporary bucket** — rejected because public access is unnecessary and widens exposure.
3. **Direct GitHub binary writes from every AI** — rejected because it duplicates repository credentials/permissions and weakens the single constrained writer boundary.
4. **Cloudflare R2** — technically viable, but the current setup path introduced a billing-enabled subscription step; Supabase Free was preferred for the initial pilot.
5. **Permanent storage in Supabase** — rejected because GitHub should remain the final asset store and temporary storage should be cleaned up.

## Risks / open items

- A broker credential still exists and must be scoped/rotated as an operational secret.
- A deployed endpoint can be abused if its broker token leaks; request rate limits and replay/nonce controls may be added after the pilot.
- Automatic deletion should happen only after confirmed GitHub transfer; stale-object cleanup needs a safe age threshold.
- Current ChatGPT sessions do not inherently have a generic authenticated binary-upload transport to arbitrary endpoints. A provider-neutral connector/plugin/orchestrator adapter is still needed to invoke the broker from each AI environment.
- Free-tier quotas can change; monitor usage and reassess before scale.

## Reconsideration triggers

Reconsider this choice if any of the following occurs:

- Supabase Free quotas/pricing materially change.
- Signed URL behavior or Edge Function limitations no longer fit the workflow.
- A safer provider-neutral file-ingress mechanism becomes natively available.
- Transfer volume or operational reliability requires a dedicated object-store/broker service.
- Internal benchmark data shows material latency, failure-rate, or maintenance problems.
