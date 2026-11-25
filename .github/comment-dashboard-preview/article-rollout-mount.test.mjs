import test from 'node:test';
import assert from 'node:assert/strict';
import {attachArticleComments,eligibleCommentPaths} from './article-rollout-mount.mjs';
const eligible='/articles/ratchet-wrench.html', paused='/articles/plc-design-01.html';
const origin='https://denkicontrol.com';
test('intersection excludes stopped, outside sitemap, english, categories and top',()=>{
 const rows=[eligible,eligible,paused,'/articles/not-live.html','/en/articles/ratchet-wrench.html','/basics/','/'];
 assert.deepEqual(eligibleCommentPaths({manifestPaths:rows,sitemapPaths:rows.filter(p=>p!=='/articles/not-live.html'),unpublishedPaths:[paused]}),[eligible]);
});
test('default, foreign origin and unapproved routes do not touch DOM or API',async()=>{
 for(const opts of [{},{enabled:true,location:{origin:'https://example.com',pathname:eligible}},{enabled:true,location:{origin,pathname:paused}},{enabled:true,location:{origin,pathname:'/'}}]){
  assert.equal(await attachArticleComments({allowedPaths:new Set([eligible]),location:{origin,pathname:eligible},doc:{querySelectorAll(){assert.fail('DOM accessed');}},...opts}),null);
 }
});
function fixture(){
 const roots=[],root={matches:()=>true};
 const slot={hidden:true,isConnected:true,append:v=>roots.push(v),querySelector:()=>roots[0],
  querySelectorAll:()=>[{content:{firstElementChild:{cloneNode:()=>root}}}]};
 return {slot,roots,input:{enabled:true,allowedPaths:new Set([eligible]),location:{origin,pathname:eligible},doc:{querySelectorAll:()=>[slot]}}};
}
test('missing/invalid live response leaves enrolment hidden',async()=>{
 for(const publicRows of [async()=>{throw new Error('unavailable');},async()=>({items:[]})]){
  const {slot,roots,input}=fixture();
  assert.equal(await attachArticleComments({...input,makeClient:()=>({publicRows}),mount:()=>assert.fail('mounted')}),null);
  assert.equal(slot.hidden,true);assert.equal(roots.length,0);
 }
});
test('registered page mounts once and uses the already-verified public rows',async()=>{
 const {slot,roots,input}=fixture();
 let reads=0;
 const makeClient=()=>({publicRows:async()=>{reads++;return [];},submit:()=>assert.fail('wrote during mount')});
 const mount=({client})=>({refresh:async()=>assert.deepEqual(await client.publicRows(),[])});
 assert.ok(await attachArticleComments({...input,makeClient,mount}));
 assert.equal(slot.hidden,false);assert.equal(roots.length,1);assert.equal(reads,1);
 assert.equal(await attachArticleComments({...input,makeClient,mount}),null);
 assert.equal(reads,1);
});
