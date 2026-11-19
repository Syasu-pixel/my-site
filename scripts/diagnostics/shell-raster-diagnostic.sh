#!/usr/bin/env bash
# Diagnostic only. Neither this script nor its artifacts can satisfy a release gate.
set -euo pipefail
root=$(git rev-parse --show-toplevel)
tmp=$(mktemp -d "${RUNNER_TEMP:?}/shell-raster.XXXXXX")
artifact="$RUNNER_TEMP/shell-raster-public-evidence"
mkdir -p "$artifact"
df -Pk "$tmp" > "$artifact/disk-before.txt"
trap 'rm -rf -- "$tmp"' EXIT

base=d05ba287b0d273e89976638e651d56de55063b1f
crimp=5818be924cadfe0e64d4e6d4e4546393f507e386
clean=e4f406d5afb09115317c9f7aec193722822f97bf
# Brand new runner. Public repository, no persisted authentication. Only immutable
# exact Git objects are needed; neither a branch tip nor a PR payload is executed.
for commit in "$base" "$crimp" "$clean"; do
  git -C "$root" fetch --no-tags --depth=1 origin "$commit"
  test "$(git -C "$root" rev-parse --verify "$commit^{commit}")" = "$commit"
done
for fixture in base crimp clean; do
  commit=${!fixture}
  mkdir -p "$tmp/$fixture"
  git -C "$root" archive "$commit" | tar -x -C "$tmp/$fixture"
done
# Check probe, source and dependency parity with the historical failing run.
for p in package.json pnpm-lock.yaml scripts/site-shell-visual.mjs scripts/site-shell-phase.mjs scripts/site-shell-geometry.mjs scripts/select-shell-visual-targets.mjs scripts/report-article-impact.mjs; do
  cmp -- "$root/$p" "$tmp/crimp/$p"
done
if ! git -C "$root" diff --quiet -- scripts/site-shell-visual.mjs scripts/site-shell-phase.mjs; then
  echo 'Worktree production comparator was altered'; exit 1
fi

for mode in default grayscale; do
  runtime="$tmp/$mode-runtime"
  mkdir -p "$runtime"
  cp -R "$tmp/crimp/scripts" "$tmp/crimp/tests" "$runtime/"
  cp "$tmp/crimp/package.json" "$runtime/"
  ln -s "$root/node_modules" "$runtime/node_modules"
done

# Reuse the exact historical selector and its v2 Git inventory/config proof.
(
  cd "$root"
  node "$tmp/crimp/scripts/select-shell-visual-targets.mjs" "$base" "$crimp" "$tmp/crimp-targets.json" > "$tmp/crimp-targets.log"
)
node --input-type=module - "$tmp/crimp-targets.json" "$base" "$crimp" "$artifact/crimp-selection.json" <<'NODE'
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const [file,base,head,receipt]=process.argv.slice(2);
const s=JSON.parse(readFileSync(file,'utf8'));
assert.equal(s.formatVersion,2);assert.equal(s.baseSha,base);assert.equal(s.headSha,head);
assert.equal(s.mode,'all');assert.equal(s.targets,null);
assert.deepEqual(s.articleCounts,{base:289,head:289});
assert.deepEqual(s.existingTargets,s.inventories.base);
assert.deepEqual(s.inventories.base,s.inventories.head);
assert.deepEqual(s.addedTargets,[]);assert.deepEqual(s.removedTargets,[]);
writeFileSync(receipt,JSON.stringify({formatVersion:s.formatVersion,baseSha:s.baseSha,headSha:s.headSha,
 mode:s.mode,articleCounts:s.articleCounts,configSha256:s.configSha256,reason:s.reason},null,2)+'\n');
NODE

# Identical before/after flag controlled by separate scratch comparator copy.
# Do not change capture thresholds, geometry, contract or source.
node --input-type=module - "$tmp/grayscale-runtime" <<'NODE'
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const dir=process.argv[2];
function edit(path,old,replacement){
 const file=join(dir,path),text=readFileSync(file,'utf8');
 if(text.split(old).length!==2)throw Error('Unexpected launch/fixture in '+path);
 writeFileSync(file,text.replace(old,replacement));
}
const launch="chromium.launch({headless:true,args:['--disable-lcd-text']})";
for(const file of ['scripts/site-shell-visual.mjs','tests/site-shell-phase.browser.mjs'])
 edit(file,'chromium.launch({headless:true})',launch);
edit('tests/site-shell-fixed-overlay.browser.mjs','chromium.launch()',launch);
// Extra mutation cases exercised through the existing real-process exit gate.
edit('tests/site-shell-phase.browser.mjs',
 "['positive',''],['color','footer{color:red}'],['position','footer p{position:relative;left:1px}'],",
 "['positive',''],['font-size','footer{font-size:21px}'],['font-weight','footer{font-weight:900}'],['color','footer{color:red}'],['position','footer p{position:relative;left:1px}'],");
NODE
# Independently query Chromium's actual launched command line in each mode.
# Neither probe visits a site. Capture code uses the same Playwright options.
for mode in default grayscale; do
  (
    cd "$tmp/$mode-runtime"
    node --input-type=module - "$mode" <<'NODE'
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const mode=process.argv[2];
const args=mode==='grayscale'?['--disable-lcd-text']:[];
const browser=await chromium.launch({headless:true,args});
try{
  const session=await browser.newBrowserCDPSession();
  const {arguments:actual}=await session.send('Browser.getBrowserCommandLine');
  const count=actual.filter(x=>x==='--disable-lcd-text').length;
  assert.equal(count,args.length);
  assert.equal(browser.version(),'140.0.7339.16');
  console.log(JSON.stringify({mode,actualLcdFlagCount:count,browser:browser.version(),node:process.version}));
}finally{await browser.close();}
NODE
  ) > "$artifact/$mode-browser-receipt.json"
done
df -Pk "$tmp" > "$artifact/disk-after-fixtures.txt"
for fixture in crimp clean; do
  ln -s "$root/node_modules" "$tmp/$fixture/node_modules"
  node "$tmp/$fixture/scripts/build-site-shells.mjs" --check
  node "$tmp/$fixture/scripts/build-site-shells.mjs"
done

write_summary() {
  node --input-type=module - "$1" "$2" "$3" "$4" <<'NODE'
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const [evidence,output,mode,code]=process.argv.slice(2);
const r=JSON.parse(readFileSync(join(evidence,'report.json'),'utf8'));
const item=r.results.find(x=>x.target==='articles/crimping-tips.html'&&x.device==='mobile'&&x.region==='footer');
if(!item)throw Error('Missing exact footer comparison');
writeFileSync(output,JSON.stringify({mode,actualCompareExit:Number(code),node:process.version,baseSha:r.baseSha,headSha:r.headSha,environment:r.environment,
 pages:r.targets.length,images:r.images.length,differences:r.differences,
 failedRegions:r.results.filter(x=>x.pixels>0).map(({target,device,region,pixels,exactPixels})=>({target,device,region,pixels,exactPixels})),
 contractDifferences:r.contractDifferences,interactionChanged:r.interactionChanged,newErrors:r.newErrors.length,
 approvedChange:r.approvedChange,testedFooter:item},null,2)+'\n');
NODE
}

capture() {
  local fixture="$1" mode="$2" scope="$3" expected="$4" tip="$5"
  local out="$tmp/${fixture}-${mode}" cmp_code=0
  local runtime="$tmp/$mode-runtime" label="${fixture}-${mode}"
  local args=("--targets-file=$tmp/crimp-targets.json")
  if [[ "$scope" = focused ]]; then
    printf '%s\n' '{"mode":"changed-articles","targets":["articles/crimping-tips.html","articles/tool-belt.html","articles/tester.html"]}' > "$tmp/targets.json"
    args=(--scope=pilot "--targets-file=$tmp/targets.json")
  fi
  BASE_SHA="$base" HEAD_SHA="$tip" node "$runtime/scripts/site-shell-visual.mjs" --phase=baseline "--root=$tmp/base" "--out=$out" "${args[@]}"
  BASE_SHA="$base" HEAD_SHA="$tip" node "$runtime/scripts/site-shell-visual.mjs" --phase=compare "--root=$tmp/$fixture" "--out=$out" "${args[@]}" || cmp_code=$?
  write_summary "$out" "$artifact/$label.json" "$mode" "$cmp_code"
  mkdir -p "$artifact/$label"
  for stage in before after diff; do
    mkdir -p "$artifact/$label/$stage"
    cp "$out/$stage"/articles__{crimping-tips,tool-belt,tester}--mobile--footer*.png "$artifact/$label/$stage/"
  done
  node --input-type=module - "$artifact/$label.json" "$cmp_code" "$expected" "$scope" <<'NODE'
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const [file,code,expected,scope]=process.argv.slice(2);
const r=JSON.parse(readFileSync(file,'utf8'));
assert.equal(r.environment.browser,'140.0.7339.16');
assert.equal(r.actualCompareExit,Number(code));
assert.equal(r.node,'v22.16.0');
assert.deepEqual(r.environment.viewports.mobile,{width:390,height:844});
assert.equal(r.testedFooter.width,390);assert.equal(r.testedFooter.height,208);
assert.equal(r.pages,scope==='full'?289:3);
assert.equal(r.newErrors,0);
assert.deepEqual(r.contractDifferences,[]);
assert.equal(r.interactionChanged,false);
assert.equal(r.approvedChange,null);
if(expected==='historical-fail'){
 assert.equal(code,'1');
 assert.deepEqual(r.failedRegions,[{target:'articles/crimping-tips.html',device:'mobile',region:'footer',pixels:751,exactPixels:12165}]);
}else{
 assert.equal(code,'0');
 assert.deepEqual(r.failedRegions,[]);
}
NODE
}

# Preserve real browser regression tests and original browser output.
result=0
# Execute subshells with errexit still enabled by capturing exit status outside
# of a conditional-command context.
run_capture() {
  set +e
  (set -e; capture "$@")
  local rc=$?
  set -e
  rm -rf -- "$tmp/$1-$2"
  df -Pk "$tmp" > "$artifact/disk-after-$1-$2.txt"
  if (( rc != 0 )); then result=1; fi
}
run_capture crimp default full historical-fail "$crimp"
run_capture crimp grayscale full clean "$crimp"
run_capture clean default focused clean "$clean"
run_capture clean grayscale focused clean "$clean"
for mode in default grayscale; do
  status=0
  (cd "$tmp/$mode-runtime"; node --test tests/site-shell-phase.browser.mjs tests/site-shell-fixed-overlay.browser.mjs) | tee "$artifact/$mode-regression-controls.log" || status=$?
  if (( status != 0 )); then result=1; fi
done
exit "$result"
