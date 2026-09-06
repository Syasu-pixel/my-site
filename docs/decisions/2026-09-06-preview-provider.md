# Decision: Preview provider v0.1

- Date: 2026-09-06
- Status: PROPOSED / PILOT
- Risk: MEDIUM
- Human approval: Required before production merge

## Proposal
Use Netlify Deploy Previews as the first PR preview environment while keeping GitHub Pages as the production host.

## Evidence
- Current Production workflow deploys only on `main` push through GitHub Pages.
- Current IndexNow workflow also runs only on `main` push.
- Netlify supports PR-specific Deploy Preview URLs for connected GitHub repositories.
- Netlify automatically sends `X-Robots-Tag: noindex` for Deploy Previews.
- Denkicontrol is currently a static HTML site and does not require a framework build for preview.

## Counterarguments
- This adds one external hosting provider and one GitHub integration.
- Connecting the repository creates a Netlify-hosted production-style URL in addition to GitHub Pages.
- External provider behavior/pricing can change.

## Mitigations
- `netlify.toml` adds `X-Robots-Tag: noindex, nofollow, noarchive` to all Netlify-served pages, including its duplicate main deployment.
- No custom Denkicontrol domain is attached to Netlify.
- GitHub Pages remains the only production destination.
- Netlify can be disconnected without changing the GitHub Pages production workflow.

## Alternatives considered
### Cloudflare Pages
Also supports GitHub PR preview deployments and is technically suitable. Not selected for the first pilot because Netlify documents automatic `X-Robots-Tag: noindex` behavior specifically for Deploy Previews, which directly matches the governance isolation requirement.

### GitHub Pages-only preview
Avoids another provider but complicates isolation because the repository already uses the single GitHub Pages production deployment from `main`. A second preview publication path could interfere with or share the production Pages surface.

## Verdict
Pilot Netlify Deploy Previews. Do not merge until repository-side configuration is reviewed and the user accepts the one-time external GitHub connection step.

## Confidence
0.86

## Reconsideration triggers
- Netlify preview behavior or pricing materially changes.
- Preview isolation cannot be verified.
- Static asset paths do not render faithfully.
- Another provider gives materially better security, cost, reliability, or AI automation.
- Denkicontrol moves away from static hosting.
