import test from 'node:test';
import assert from 'node:assert/strict';
import {selectUiProposalTargets} from '../scripts/select-ui-proposal-targets.mjs';
const a='articles/thermal-relay-basic.html',b='en/articles/thermal-relay-basic.html',other='articles/plc-basic.html';
function fixture(mode='changed-articles'){
  const targets=[a,b];
  return {scope:{mode,baseSha:'base',headSha:'head',existingTargets:targets,addedTargets:['articles/new.html']},baseline:{baseSha:'base',headSha:'head',sourceSha:'base',cohort:'existing',targets,environment:{viewports:{desktop:{},mobile:{}}},images:targets.flatMap(target=>['desktop','mobile'].map(device=>({target,device,region:'header',path:'before/'+target+device+'.png',sha256:'a'.repeat(64)})))}};
}
test('focused audit uses affected baseline pages, not unrelated fixed representatives',()=>{
  const {scope,baseline}=fixture();assert.deepEqual(selectUiProposalTargets(scope,baseline,[other]).targets,[a,b]);
});
test('full audit retains representative sample without reducing primary targets',()=>{
  const {scope,baseline}=fixture('all');const before=JSON.stringify({scope,baseline});
  assert.deepEqual(selectUiProposalTargets(scope,baseline,[a]).targets,[a]);assert.equal(JSON.stringify({scope,baseline}),before);
});
test('missing, duplicate and altered evidence are rejected instead of skipped',()=>{
  for(const mutate of [x=>x.baseline.images.pop(),x=>x.baseline.images.push(x.baseline.images[0]),x=>x.baseline.images[0].sha256='bad',x=>x.baseline.targets=[a],x=>x.baseline.headSha='other',x=>x.baseline.sourceSha='head',x=>x.baseline.cohort='added',x=>x.baseline.environment.viewports={},x=>x.scope.existingTargets=[a,a]]){
    const x=fixture();mutate(x);assert.throws(()=>selectUiProposalTargets(x.scope,x.baseline,[a]));
  }
});
test('new or unrelated representatives cannot claim old-main evidence',()=>{
  const {scope,baseline}=fixture('all');assert.throws(()=>selectUiProposalTargets(scope,baseline,[other]));assert.throws(()=>selectUiProposalTargets(scope,baseline,['articles/new.html']));
});
