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
