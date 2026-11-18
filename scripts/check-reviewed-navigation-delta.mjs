import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha=s=>createHash('sha256').update(s).digest('hex');
// An approval is a pinned transition, not a general permission to edit this page.
export function checkReviewedNavigationDelta(path,beforeSource,afterSource,beforeCandidate,afterCandidate,contract){
 const matches=contract.changes.filter(x=>x.path===path&&x.beforeSourceSha256===sha(beforeSource)&&x.afterSourceSha256===sha(afterSource));
 assert.equal(matches.length,1,'No unique reviewed navigation transition: '+path);
 const c=matches[0];
 assert.ok(['index.html','categories/control-basics.html'].includes(path),'Navigation path outside reviewed scope');
 assert.ok(c.before&&c.after&&c.before!==c.after,'Invalid navigation replacement');
 for(const [before,after,label] of [[beforeSource,afterSource,'source'],[beforeCandidate,afterCandidate,'candidate']]){
  assert.equal(before.split(c.before).length,2,'Reviewed fragment must be unique in '+label);
  assert.equal(after,before.replace(c.before,c.after),'Unexpected bytes beyond reviewed navigation '+label);
 }
 return true;
}
