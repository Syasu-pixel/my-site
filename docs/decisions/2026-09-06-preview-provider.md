# Decision: Preview provider v0.1

- Date: 2026-09-06
- Status: PROPOSED / PILOT
- Risk: MEDIUM
- Human approval: Required before external Netlify connection and before production merge of later content PRs

## Proposal
Use Netlify Deploy Previews as the first PR preview environment while keeping GitHub Pages as the Canonical Production host.

## Evidence
- Current Production workflow deploys only on `main` push through GitHub Pages.
- Current IndexNow workflow also runs only on `main` push.
- Netlify supports PR-specific Deploy Preview URLs for connected GitHub repositories.
- Netlify automatically sends `X-Robots-Tag: noindex` for Deploy Previews.
- Denkicontrol is currently a static HTML site and does not require a framework build for preview.

## Counterarguments
- This adds one external hosting provider and one GitHub integration.
- Connecting the repository creates a Netlify-hosted main deployment URL in addition to GitHub Pages.
- Deploy Preview URLs are public to anyone who knows the URL; noindex is not access control.
- `publish = "."` treats the repository root as the preview publishing surface.
- External provider behavior/pricing can change.

## Mitigations
- `netlify.toml` adds `X-Robots-Tag: noindex, noarchive` to all Netlify-served pages, including its duplicate main deployment.
- No custom Denkicontrol domain is attached to Netlify.
- GitHub Pages / `https://denkicontrol.com/` remains the only Canonical Production destination.
- Netlify main deployment is treated only as a duplicate non-indexed staging surface.
- Preview PRs must not contain secrets, personal data, contract data, private customer information or other content that requires access control.
- Netlify can be disconnected without changing the GitHub Pages production workflow.
- If internal-only repository content grows, introduce a dedicated preview build directory that excludes operations files from the published artifact.

## Alternatives considered
### Cloudflare Pages
Also supports GitHub PR preview deployments and is technically suitable. Not selected for the first pilot because Netlify documents automatic `X-Robots-Tag: noindex` behavior specifically for Deploy Previews, which directly matches the governance isolation requirement.

### GitHub Pages-only preview
Avoids another provider but complicates isolation because the repository already uses the single GitHub Pages production deployment from `main`. A second preview publication path could interfere with or share the production Pages surface.

## Challenger result
Initial CHALLENGER verdict: REVISE.

Required revisions were:
- state clearly that Preview is a public review surface, not a private environment;
- avoid using `nofollow` as a required indexing control;
- distinguish Canonical Production from Netlify's duplicate main deployment;
- separate repository config merge from the external-service connection Human Gate;
- record the repository-root publishing limitation and future build-directory trigger.

These revisions were applied before final REVIEWER adjudication.

## Verdict
Pilot Netlify Deploy Previews. The repository configuration/docs PR may merge after governance review because it does not alter the existing GitHub Pages or IndexNow workflows. The one-time Netlify GitHub connection remains a separate Human Gate.

## Confidence
0.88

## Reconsideration triggers
- Netlify preview behavior or pricing materially changes.
- Preview isolation cannot be verified.
- Static asset paths do not render faithfully.
- Public Preview URLs become unsuitable for the kinds of content under review.
- Internal repository material requires a dedicated publish artifact.
- Another provider gives materially better security, cost, reliability, or AI automation.
- Denkicontrol moves away from static hosting.
