# Cloudflare Pages PR Preview migration

Status: PREPARED / external connection pending

## Goal
Replace Netlify Deploy Preview with Cloudflare Pages for interactive pre-merge review while keeping Canonical Production on GitHub Pages (`https://denkicontrol.com/`).

## Production boundary
- Production remains GitHub Pages.
- `main` remains the production branch.
- `.github/workflows/indexnow.yml` remains unchanged and only runs on pushes to `main`.
- Cloudflare Pages is review-only. Do not attach `denkicontrol.com` or another production custom domain to this Pages project.

## Cloudflare Pages project setup
Connect GitHub repository `Syasu-pixel/my-site` using Cloudflare Pages Git integration.

Recommended setup:
- Framework preset: None
- Production branch: `main`
- Build command: `exit 0` (blank is also valid for a no-build static site, but `exit 0` makes intent explicit)
- Build output directory: `.` (repository root; the site is static HTML rooted at `index.html`)
- Root directory: repository root

After the first deployment, open Pages project settings and configure Branch control:
- Automatic production branch deployments: OFF
- Preview branch deployments: Custom branches
- Include preview branches: `ai-editorial/*`, `preview-*`, `pilot-*`
- Exclude preview branches: leave empty unless a later rule requires it

This keeps Cloudflare from rebuilding `main` as a second production surface and limits automatic previews to review branches.

## Search isolation
The repository root `_headers` file applies `X-Robots-Tag: noindex, noarchive` to `*.pages.dev` review surfaces. Cloudflare Pages also sends `X-Robots-Tag: noindex` on preview URLs by default.

Do not add Cloudflare Preview URLs to sitemap, search-index, IndexNow, canonical URLs, or production navigation.

## Build budget
Cloudflare Pages Free currently permits 500 builds/month. Intermediate commits should use a Cloudflare build-skip prefix such as `[CF-Pages-Skip]` when a clickable Preview is not needed. Generate/update a Preview mainly at the administrator-review boundary rather than for every internal revision.

## AI editorial integration work after external connection
The active Supabase `ai-editorial-article-builder` currently imports the repository `ai-editorial-article-builder-v4` implementation, which still constructs a Netlify `deploy-preview-<PR>` URL. After the Cloudflare Pages project name/URL is known:
1. remove Netlify URL construction from the active Builder implementation;
2. obtain/store the real Cloudflare Pages Preview URL instead of guessing it;
3. update preview probe / visual audit consumers to accept `*.pages.dev` URLs;
4. update dashboard artifact labels from Netlify-specific to provider-neutral Preview;
5. run one PR end-to-end before making Cloudflare the documented standard.

## Netlify retirement
`netlify.toml` contains `ignore = "exit 0"` so automatic Git-triggered Netlify builds stop and do not resume consuming monthly credits after the quota resets. Existing Netlify noindex headers remain only as a safety fallback for old URLs.
