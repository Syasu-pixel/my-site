# Cloudflare Pages PR Preview migration

Status: ACTIVE / GitHub integration connected

## Goal
Use Cloudflare Pages for interactive pre-merge review while keeping Canonical Production on GitHub Pages (`https://denkicontrol.com/`).

## Production boundary
- Production remains GitHub Pages.
- `main` remains the production branch.
- `.github/workflows/indexnow.yml` remains unchanged and only runs on pushes to `main`.
- Cloudflare Pages is review-only. Do not attach `denkicontrol.com` or another production custom domain to this Pages project.

## Cloudflare Pages project setup
GitHub repository `Syasu-pixel/my-site` is connected to Cloudflare Pages through the Cloudflare GitHub App.

Current intended setup:
- Framework preset: None
- Production branch: `main`
- Build command: `exit 0` (blank is also valid for a no-build static site, but `exit 0` makes intent explicit)
- Build output directory: `.` (repository root; the site is static HTML rooted at `index.html`)
- Root directory: repository root

Branch control:
- Automatic production branch deployments: OFF
- Preview branch deployments: Custom branches
- Include preview branches: `ai-editorial/*`, `preview-*`, `pilot-*`
- Exclude preview branches: leave empty unless a later rule requires it

This keeps Cloudflare from rebuilding `main` as a second production surface and limits automatic previews to review branches.

## Preview URL source of truth
**Do not construct or guess a Cloudflare Preview hostname from the Git branch name.**

Cloudflare may shorten or transform branch aliases, so a hostname generated from the full branch name is not authoritative. The source of truth is the successful deployment comment posted on the PR by:

`cloudflare-workers-and-pages[bot]`

The comment contains both:
- `Preview URL`: deployment-specific URL such as `https://b8a4fa0d.denkicontrol-preview.pages.dev`
- `Branch Preview URL`: stable branch URL chosen by Cloudflare

For administrator review, prefer the deployment-specific `Preview URL` because it points to the exact deployed revision.

### Standard Preview retrieval procedure
1. Open/fetch the target PR conversation comments.
2. Find the latest comment authored by `cloudflare-workers-and-pages[bot]` whose `Latest commit` matches the PR head commit being reviewed.
3. Require `Status: Deploy successful!` before presenting a public Preview.
4. Read the `Preview URL` directly from that comment. Never synthesize it from the branch name.
5. Append the article path to that deployment root. For human-facing review links, the clean article path without `.html` may be used when confirmed to resolve; otherwise use the exact repository article path.
6. Verify the resulting article URL is actually reachable before presenting it as the administrator Preview.
7. If the deployment-specific URL is unavailable, use the `Branch Preview URL` from the same Cloudflare bot comment. Do not guess the branch alias.
8. If no matching successful Cloudflare comment exists yet, report `Preview deployment pending` and re-check later. Do not substitute a guessed URL.

Example:
- Cloudflare bot `Preview URL`: `https://b8a4fa0d.denkicontrol-preview.pages.dev`
- Article: `articles/control-panel-wire-color-basic.html`
- Review URL after verification: `https://b8a4fa0d.denkicontrol-preview.pages.dev/articles/control-panel-wire-color-basic`

## GitHub Actions Preview capture boundary
`.github/workflows/ai-editorial-preview-capture.yml` captures desktop/mobile evidence from the checked-out PR head using a local render server. It must not advertise a guessed public Cloudflare URL.

The public clickable Preview and the local screenshot evidence are separate responsibilities:
- Cloudflare GitHub App: deploys and posts the authoritative public Preview URL on the PR.
- GitHub Actions Preview Capture: validates/renders the PR head locally and uploads screenshot/HTML evidence.

## Search isolation
The repository root `_headers` file applies `X-Robots-Tag: noindex, noarchive` to `*.pages.dev` review surfaces. Cloudflare Pages also sends `X-Robots-Tag: noindex` on preview URLs by default.

Do not add Cloudflare Preview URLs to sitemap, search-index, IndexNow, canonical URLs, or production navigation.

## Build budget
Cloudflare Pages Free currently permits 500 builds/month. Intermediate commits should use a Cloudflare build-skip prefix such as `[CF-Pages-Skip]` when a clickable Preview is not needed. Generate/update a Preview mainly at the administrator-review boundary rather than for every internal revision.

## Netlify retirement
`netlify.toml` contains `ignore = "exit 0"` so automatic Git-triggered Netlify builds stop and do not resume consuming monthly credits after the quota resets. Existing Netlify noindex headers remain only as a safety fallback for old URLs.
