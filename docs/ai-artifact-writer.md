# AI Artifact Writer v0.1

## Purpose

Provide one constrained, provider-agnostic path for reviewed AI-generated image files to reach a non-production GitHub branch. GPT, Claude, Gemini, Codex, image models, or future agents may produce artifacts, but they do not need direct write authority to the repository.

The Writer is an execution layer only. It must not decide technical correctness, image adoption, SEO value, or publication approval.

## Target flow

1. Producer AI creates an artifact.
2. Producer records filename, intended article/path, MIME/extension, size, and SHA-256.
3. IMAGE REVIEWER / REVIEWER passes the artifact according to `docs/image-quality-gate.md`.
4. The orchestrator places the binary in an approved artifact store and obtains an HTTPS URL.
5. The orchestrator triggers `AI Artifact Writer` with URL, SHA-256, target preview branch, and target path.
6. Writer validates request constraints, downloads, verifies SHA-256, and commits only to the specified non-production branch.
7. Netlify Deploy Preview rebuilds from the PR branch.
8. Human reviews the final Preview when required by governance.
9. Production publication remains a separate gate.

## Security boundary

The Writer intentionally refuses to operate when `AI_ARTIFACT_ALLOWED_HOSTS` is empty.

Required repository variable:

`AI_ARTIFACT_ALLOWED_HOSTS`

Value format: comma-separated lowercase hostnames, for example `artifacts.example.com,storage.example.net`. Do not add a host until its access model, retention, privacy, and URL behavior have been reviewed.

The Writer also enforces:

- HTTPS only.
- No credentials embedded in URLs.
- Redirect destinations must stay on the host allowlist.
- Maximum artifact size: 5 MiB.
- SHA-256 is mandatory and must match exactly.
- Only `.webp`, `.png`, `.jpg`, `.jpeg` are accepted in v0.1.
- Target path must be under `assets/images/`.
- Target branch must start with `ai-`, `preview-`, or `pilot-`.
- `main` is rejected explicitly.
- The Writer does not update sitemap, search index, categories, IndexNow, or publication metadata.

## Provider-neutral request contract

The same fields are used whether the request originates from OpenAI, Anthropic, Google, Codex, another image service, or a future orchestrator:

```json
{
  "artifact_url": "https://approved-host.example/path/file.webp",
  "sha256": "64-lowercase-hex-characters",
  "target_branch": "pilot-example-article",
  "target_path": "assets/images/example-article/example-hero.webp",
  "commit_message": "Add reviewed example hero image"
}
```

For automated callers, use the GitHub `repository_dispatch` event type `ai-artifact-ready`. A manual `workflow_dispatch` entry remains available for controlled testing and recovery.

## What v0.1 does not solve

v0.1 does not provide the artifact store itself. The store is a separate boundary so that the site is not permanently tied to one AI provider. Selection criteria for that store are:

- API upload from multiple agents/orchestrators.
- Short-lived or access-controlled artifact URLs where practical.
- Stable direct-download HTTPS URLs usable by GitHub Actions.
- Predictable cost and retention controls.
- No requirement to grant each AI direct repository write access.

Until an artifact store is approved and `AI_ARTIFACT_ALLOWED_HOSTS` is configured, the workflow is deliberately disabled at the download step.

## Human gates

This Writer does not change the existing governance gates. Final image adoption and production Preview approval remain human gates unless governance is explicitly revised later.

## Reconsideration triggers

Revisit this design if GitHub adds a native secure artifact-ingress mechanism usable by all participating agents, if the orchestrator can stream files directly into an authenticated GitHub App without broad repository permissions, or if the selected artifact store becomes a cost/security/reliability bottleneck.
