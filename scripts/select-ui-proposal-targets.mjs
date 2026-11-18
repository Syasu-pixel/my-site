// Supplemental UI proposals must use the immutable evidence actually captured.
// This does not change the primary shell comparison scope or acceptance criteria.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const assert=(condition,message)=>{if(!condition)throw Error(message);};
const validPaths=values=>Array.isArray(values)&&values.length>0&&new Set(values).size===values.length&&values.every(p=>typeof p==='string'&&/^(en\/)?articles\/[a-z0-9-]+\.html$/.test(p));
export function selectUiProposalTargets(scope,baseline,representatives){
  assert(['all','changed-articles'].includes(scope.mode),'Unknown shell audit mode');
  assert(validPaths(scope.existingTargets)&&validPaths(baseline.targets),'Invalid existing baseline targets');
  assert(scope.baseSha===baseline.baseSha&&scope.headSha===baseline.headSha&&baseline.cohort==='existing'&&baseline.sourceSha===scope.baseSha,'UI baseline provenance mismatch');
  assert(JSON.stringify([...scope.existingTargets].sort())===JSON.stringify([...baseline.targets].sort()),'UI baseline coverage mismatch');
  // Full audits retain the established representative UI sample; focused audits
  // exercise every affected existing page, rather than unrelated fixed samples.
  const targets=scope.mode==='all'?representatives:scope.existingTargets;
  assert(validPaths(targets),'Invalid UI proposal targets');
  const devices=Object.keys(baseline.environment?.viewports||{});
  assert(devices.length>0&&Array.isArray(baseline.images),'Missing UI baseline evidence');
  for(const target of targets){
    assert(scope.existingTargets.includes(target),'UI target absent from existing baseline: '+target);
    for(const device of devices){
      const images=baseline.images.filter(i=>i.target===target&&i.device===device&&i.region==='header');
      assert(images.length===1&&typeof images[0].path==='string'&&/^[a-f0-9]{64}$/.test(images[0].sha256),'Missing or duplicate UI before evidence: '+target+' '+device);
    }
  }
  return {targets:[...targets],baseSha:scope.baseSha,headSha:scope.headSha,stage:'supplemental-ui-proposal',primaryAuditUnchanged:true};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const [scopePath,baselinePath,outPath]=process.argv.slice(2);
  assert(scopePath&&baselinePath&&outPath,'Usage: select-ui-proposal-targets.mjs scope.json baseline.json output.json');
  const read=p=>JSON.parse(readFileSync(p,'utf8'));
  const result=selectUiProposalTargets(read(scopePath),read(baselinePath),read('.github/site-shell-visual.json').representatives);
  writeFileSync(outPath,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
}
