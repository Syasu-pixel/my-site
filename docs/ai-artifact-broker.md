# AI Artifact Broker v0.2

## Purpose

`ai-artifacts` is a private, temporary Supabase Storage bucket used only to move reviewed image artifacts from AI systems to the constrained GitHub artifact writer.

The durable source of truth remains GitHub. Supabase is not an image archive and is not part of the public site delivery path.

## Architecture

```text
AI / image generator
  -> common orchestrator / adapter
  -> either signed upload or temporary ingress adapter
  -> private Supabase bucket: ai-artifacts
  -> SHA-256 / size / signature / extension validation
  -> 10-minute signed download URL
  -> GitHub AI Artifact Writer
       - branch/path/host checks
       - SHA-256 verification again
       - image signature verification again
  -> preview branch
  -> delete temporary Supabase object
  -> Netlify Deploy Preview
  -> human final review
  -> production only after the existing publication gate
```

## Security boundary

- Bucket: `ai-artifacts`
- Bucket remains private.
- Bucket UI limits uploads to 5 MiB and MIME types `image/webp`, `image/png`, `image/jpeg`.
- No Supabase service-role key is given to GPT, Claude, Gemini, image models, or other producer agents.
- The Edge Function alone uses `SUPABASE_SERVICE_ROLE_KEY` to operate the private bucket.
- Producer/orchestrator calls use `ARTIFACT_BROKER_TOKEN`.
- When a dedicated `ARTIFACT_CLEANUP_TOKEN` exists, `delete` prefers it. During the v0.2 pilot, `delete` may fall back to `ARTIFACT_BROKER_TOKEN` so the already-configured GitHub cleanup secret can complete cleanup without exposing a new secret in chat.
- Broker accepts only generated object paths under `incoming/YYYY-MM-DD/<uuid>/...`.
- Object names are restricted to simple ASCII filenames.
- GitHub Writer independently verifies SHA-256, actual file signature, branch prefix, repository path, and allowed host.
- `main` remains forbidden to the artifact writer.
- The broker is a transport/security boundary, not proof that editorial/image review happened. Upstream orchestration must invoke it only for an artifact that passed the image/content quality gate.

## Edge Function authentication

`verify_jwt = false` is intentional because the broker uses its own narrowly scoped token rather than Supabase user credentials. Every supported action checks `x-artifact-broker-token` before Storage access occurs.

## Broker actions

### `create_upload`

Creates a Supabase signed upload URL for a validated image filename/MIME combination.

Credential: `ARTIFACT_BROKER_TOKEN`.

### `prepare_download`

Downloads a private object, checks size/signature/extension/SHA-256, then returns a 10-minute signed download URL.

Credential: `ARTIFACT_BROKER_TOKEN`.

### `import_firestorage`

Temporary v0.2 ingress adapter used because the current ChatGPT file-upload plugin can place a reviewed local artifact on firestorage.ai but does not directly expose the file bytes to the Supabase plugin.

Input includes:

- `share_id`
- `file_id`
- exact `file_name`
- expected `sha256`

The broker:

1. reads firestorage metadata,
2. verifies exact file ID/name and 5 MiB limit,
3. requests the provider's short-lived download URL,
4. downloads over HTTPS,
5. validates actual WebP/PNG/JPEG signature, filename extension, byte size and SHA-256,
6. stores the validated bytes in the private `ai-artifacts` bucket,
7. returns a 10-minute Supabase signed download URL.

Credential: `ARTIFACT_BROKER_TOKEN`.

This adapter is transitional, not the long-term trust anchor. Reconsider/remove it when a provider-neutral file-input connector can upload directly to the broker or a signed Supabase upload URL.

### `delete`

Deletes an exact validated temporary object path only after the repository transfer succeeds.

Credential preference:

1. `ARTIFACT_CLEANUP_TOKEN`, when configured;
2. otherwise `ARTIFACT_BROKER_TOKEN` during the v0.2 pilot.

Long-term target remains a separate cleanup credential.

## Required secrets

The function requires:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ARTIFACT_BROKER_TOKEN`

Optional but recommended after the pilot:

- `ARTIFACT_CLEANUP_TOKEN`

Custom tokens must be random secrets of at least 32 characters and must never be committed to the repository, pasted into documentation, PR comments, preview pages, or AI prompts.

## GitHub Writer connection

The existing `.github/workflows/ai-artifact-writer.yml` uses:

- variable `AI_ARTIFACT_ALLOWED_HOSTS`: exact Supabase signed-download hostname
- variable `ARTIFACT_BROKER_URL`: exact Edge Function HTTPS URL
- secret `ARTIFACT_CLEANUP_TOKEN`: value accepted by the broker for cleanup

The writer receives an artifact URL, expected SHA-256, existing preview branch, target path under `assets/images/`, commit message, and optionally a cleanup object path.

## Cleanup policy

Normal flow deletes the Supabase temporary object only after successful validation and repository transfer. Failed transfers retain the temporary object for retry. A later stale-object cleanup may be added with a safe age threshold.

## Pilot result

The first end-to-end Hero transfer proved:

- ChatGPT local file -> firestorage temporary share
- firestorage -> Supabase broker import
- SHA-256 / signature / size validation
- Supabase signed download -> constrained GitHub writer
- commit to `pilot-control-panel-noise-guide`

The initial cleanup attempt failed because the deployed broker expected a dedicated cleanup secret that had not been configured in Supabase. v0.2 added the broker-token fallback for the pilot, and the cleanup retry succeeded. This compatibility fallback should be removed once a distinct Supabase cleanup secret is configured.
