#!/usr/bin/env bash
# Build the same integrated static publication used by .github/workflows/pages.yml
# for Cloudflare Pages review. This runs only on a Preview branch and writes _site.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
BUILD_ROOT="${RUNNER_TEMP:-$(mktemp -d)}/cloudflare-preview-build"
SITE_ROOT="$ROOT/_site"

rm -rf "$BUILD_ROOT" "$SITE_ROOT"
mkdir -p "$BUILD_ROOT" "$SITE_ROOT"

# Match the pinned package manager used by the GitHub Pages publication workflow.
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile --ignore-scripts
pnpm check:shells

python -m pip install lxml==6.1.1
node scripts/build-integrated-review.mjs "$BUILD_ROOT/integration"
node scripts/build-additional-shells.mjs "$BUILD_ROOT/integration/additional-shells"
python scripts/verify-integrated-source.py "$BUILD_ROOT/integration"
python scripts/audit-integrated-links.py "$BUILD_ROOT/integration"
python scripts/verify-article-end-preservation.py \
  --oracle .github/article-components/end/all-preservation-oracle.json \
  --candidate "$BUILD_ROOT/integration/candidate" \
  --assets-source . \
  --output "$BUILD_ROOT/integration/end-independent-checks.json"

python scripts/build-admin-article-catalog.py
rsync -a ./ "$SITE_ROOT/" \
  --exclude '_site/' \
  --exclude '.git/' \
  --exclude '.github/' \
  --exclude '/docs/rules/catalog.json' \
  --exclude 'node_modules/' \
  --exclude '.netlify/' \
  --exclude '.wrangler/' \
  --exclude '.cache/' \
  --exclude 'tmp/' \
  --exclude 'temp/' \
  --exclude '*.zip' \
  --exclude '*.tar' \
  --exclude '*.tar.gz' \
  --exclude '*.7z' \
  --exclude '*.psd' \
  --exclude '*.ai'

node scripts/prepare-integrated-publication.mjs "$BUILD_ROOT/integration" "$SITE_ROOT"
python scripts/verify-publication-artifact.py snapshot "$SITE_ROOT" "$BUILD_ROOT/integration"
python scripts/verify-publication-artifact.py verify "$SITE_ROOT" "$BUILD_ROOT/integration"

# The source articles and full integrity checks stay intact. Only the deploy copy
# omits the three paused URLs so Cloudflare returns a real 404 for each one.
for episode in 01 02 03; do
  page="$SITE_ROOT/articles/plc-drilling-line-design-project-${episode}.html"
  test -f "$page" || { echo "Missing expected pre-exclusion article: $page" >&2; exit 1; }
  rm "$page"
  test ! -e "$page"
done

echo "Cloudflare Preview publication ready: $SITE_ROOT"
