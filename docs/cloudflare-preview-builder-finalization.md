# Cloudflare Pages Preview Builder finalization

- Cloudflare Pages is the active external Preview provider for article review.
- Preview provider project: `denkicontrol-preview.pages.dev`.
- The authoritative public Preview URL is the deployment-specific `Preview URL` posted on the PR by `cloudflare-workers-and-pages[bot]` after a successful deployment.
- Do not generate a public Preview hostname by transforming the Git branch name. Cloudflare may shorten or otherwise transform branch aliases.
- `Branch Preview URL` is also valid only when read from the same Cloudflare bot deployment comment; never guess it.
- When several Cloudflare deployment comments exist, use the latest successful comment whose `Latest commit` matches the PR head commit being reviewed.
- Append the target article path to the authoritative deployment root and verify it resolves before showing it to the administrator.
- If no matching successful Cloudflare deployment comment exists yet, treat the Preview as pending instead of inventing a URL.
- GitHub Actions Preview Capture remains responsible for local PR-head rendering and screenshot/HTML evidence. It is not the source of truth for the public Cloudflare URL.
- Preview evidence kind remains provider-neutral `preview`.
- Production GitHub Pages and IndexNow remain unchanged.
