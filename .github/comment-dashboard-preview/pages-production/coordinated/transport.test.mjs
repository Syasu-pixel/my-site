import assert from 'node:assert/strict';
import {makeProductionWorker} from './pages-production/production-worker.mjs';
import {releasePaths,releaseSha} from './pages-production/comment-release.mjs';
let calls=0;
const h=makeProductionWorker({releasePaths,connect:async()=>{calls++;throw Error('offline test')},fetcher:async()=>{calls++;throw Error('offline test')}});
const base='https://comments.denkicontrol.com/api/article-comments/', site='https://denkicontrol.com';
const env={COMMENTS_ENABLED:'true',COMMENTS_RELEASE_SHA256:releaseSha};
const send=(part,method,headers={},override={})=>h(new Request(base+part+'?article='+encodeURIComponent(releasePaths[0])+'&release='+releaseSha,{
 method:'OPTIONS',headers:{Origin:site,'Access-Control-Request-Method':method,...headers}
}),{...env,...override});
for(const [part,method,allow,cred] of [['session','POST','content-type',true],['post','POST','content-type',true],['moderation','GET','authorization',false],['moderation','POST','authorization, content-type',false]]) {
 const ok=await send(part,method,{'Access-Control-Request-Headers':allow});
 assert.equal(ok.status,204); assert.equal(ok.headers.get('access-control-allow-origin'),site);
 assert.equal(ok.headers.get('access-control-allow-methods'),method);
 assert.equal(ok.headers.get('access-control-allow-headers'),allow);
 assert.equal(ok.headers.get('access-control-allow-credentials'),cred?'true':null);
 assert.match(ok.headers.get('vary'),/origin/i); assert.match(ok.headers.get('cache-control'),/no-store/);
 const stopped=await send(part,method,{'Access-Control-Request-Headers':allow},{COMMENTS_ENABLED:'false'});
 assert.equal(stopped.status,503);
}
assert.equal((await send('post','GET')).status,403);
assert.equal((await send('post','POST',{'Access-Control-Request-Headers':'x-custom'})).status,403);
assert.equal((await send('moderation','POST',{Origin:'https://unrelated.invalid'})).status,403);
assert.equal((await send('readiness','GET')).status,405);
assert.equal(calls,0);
console.log('12 transport and stop checks passed against the actual 178-article assembled API; zero backend calls.');

// Readiness must not expose a form if the write lane is unavailable, even if
// the gateway is present, the article is eligible and the database is up.
const configured={...env,COMMENTS_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic_value',COMMENTS_GATEWAY_DB:{connectionString:'isolated-fixture'},COMMENTS_SIGNING_KEY:Buffer.alloc(32,2).toString('base64url')};
const readReq=()=>new Request(base+'readiness?article='+encodeURIComponent(releasePaths[0])+'&release='+releaseSha,{headers:{Origin:site}});
for(const flag of [false,undefined,true]){
 let reads=0, queried=0;
 const handler=makeProductionWorker({releasePaths,connect:async()=>({
  query:async sql=>{if(sql==='select current_user as role')return {rows:[{role:'dc_comment_production_gateway'}]}; queried++;assert.match(sql,/has_function_privilege/);return {rows:[{data:true,can_write:flag}]}},
  close:async()=>{}
 }),fetcher:async()=>{reads++;return Response.json([])}});
 const response=await handler(readReq(),configured);
 assert.equal(response.status,flag===true?200:503);
 assert.equal((await response.json()).ready,flag===true);
 assert.equal(queried,1);assert.equal(reads,flag===true?1:0);
}
console.log('3 additional readiness cases: missing write grant, missing proof, valid configuration.');
