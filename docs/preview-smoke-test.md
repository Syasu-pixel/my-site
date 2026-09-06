# Netlify Deploy Preview smoke test

Temporary non-production marker used to verify that a GitHub pull request automatically receives a Netlify Deploy Preview.

Expected behavior:
- PR triggers a Netlify Deploy Preview.
- Preview uses the PR branch contents.
- Preview responses remain noindex.
- Production publishing and IndexNow are not triggered by this PR.

This file should be removed or the test PR closed after verification.
