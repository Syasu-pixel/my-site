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
REVIEW_COPY_ASSETS=0 node scripts/build-integrated-review.mjs "$BUILD_ROOT/integration"
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
# Keep WebP conversion aligned with the main GitHub Pages workflow.
export SITE_ROOT BUILD_ROOT
sudo apt-get update -qq
sudo apt-get install -y -qq webp
export IMAGE_COLLISION_SKIP="$BUILD_ROOT/integration/image-collision-skip.txt"

# Convert PNG/JPEG assets in the publish copy only. The repository originals
# remain untouched until the optimized deployment has been verified.
find "$SITE_ROOT/assets/images" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0 \
  | xargs -0 -r -P 4 -I{} bash -c '
      src="$1"
      grep -Fxq "$src" "$IMAGE_COLLISION_SKIP" && exit 0
      dst="${src%.*}.webp"
      [ -e "$dst" ] && exit 0
      cwebp -quiet -mt -q 82 -m 4 "$src" -o "$dst"
    ' _ {}

python3 - <<'PY'
from pathlib import Path
import re, json, os

root = Path(os.environ['SITE_ROOT'])
image_root = root / 'assets' / 'images'
mapping = {}
build = Path(os.environ['BUILD_ROOT']) / 'integration'
keep_originals = set(json.loads((build/'image-collision-plan.json').read_text())['keepOriginals'])
for src in image_root.rglob('*'):
    if not src.is_file() or src.suffix.lower() not in {'.png', '.jpg', '.jpeg'}:
        continue
    if src.relative_to(root).as_posix() in keep_originals:
        continue
    dst = src.with_suffix('.webp')
    if dst.exists() and dst.stat().st_size > 0:
        rel_src = src.relative_to(root).as_posix()
        rel_dst = dst.relative_to(root).as_posix()
        mapping[rel_src] = rel_dst
(build/'published-image-mapping.json').write_text(json.dumps(mapping), encoding='utf-8')

# Only rewrite files that can affect the published site. Internal Markdown/TXT
# docs contain example placeholders such as {slug} and must not be treated as
# live asset references.
text_exts = {'.html', '.css', '.js', '.json', '.xml'}
changed = 0
for path in root.rglob('*'):
    if not path.is_file() or path.suffix.lower() not in text_exts:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    new = text
    for old, replacement in mapping.items():
        new = new.replace('/' + old, '/' + replacement)
        new = new.replace(old, replacement)
    if new != text:
        path.write_text(new, encoding='utf-8')
        changed += 1

# Remove originals only from the generated publish copy and only when a
# valid WebP counterpart exists.
removed = 0
for old in mapping:
    src = root / old
    if src.exists():
        src.unlink()
        removed += 1

# Guard against stale references in actual published web files only.
stale = []
pattern = re.compile(r'assets/images/[^\s"\'<>?#]+\.(?:png|jpe?g)', re.I)
for path in root.rglob('*'):
    if not path.is_file() or path.suffix.lower() not in text_exts:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    for match in pattern.findall(text):
        candidate = root / match.lstrip('/')
        if not candidate.exists():
            stale.append(f'{path}: {match}')

print(f'Converted images: {len(mapping)}')
print(f'Updated published files: {changed}')
print(f'Removed publish-copy originals: {removed}')
if stale:
    print('Stale image references detected in published files:')
    print('\n'.join(stale[:100]))
    raise SystemExit(1)
PY

echo 'After image optimization:'
du -sh "$SITE_ROOT" "$SITE_ROOT/assets/images"

# GitHub Pages published sites must remain below 1 GB. Keep headroom so
# future articles cannot silently cross the limit.
bytes=$(du -sb "$SITE_ROOT" | cut -f1)
limit=$((900 * 1024 * 1024))
echo "Published artifact bytes: $bytes"
if [ "$bytes" -ge "$limit" ]; then
  echo "ERROR: optimized Pages artifact is still >= 900 MiB; refusing oversized deploy."
  exit 1
fi

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
