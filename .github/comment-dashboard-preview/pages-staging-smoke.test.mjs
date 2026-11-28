import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildPagesStagingOnRequest,makeStagingFetch,STAGING_ORIGIN} from './pages-staging-smoke.mjs';
const path='/api/article-comments/public?article=/articles/staging-comment-smoke.html';
const req=(origin=STAGING_ORIGIN)=>new Request(origin+path);
const env={COMMENTS_STAGING_ENABLED:'true'};
test('staging does not read storage without an exact host, explicit enable and verified Access',async()=>{
 let connected=0;
 const openAdapters=async()=>{connected++;return {keyBytes:new Uint8Array(32).fill(2),publicQuery:async()=>({rows:[{data:[]}]}),gatewayQuery:async()=>{throw Error('unexpected');}};};
 const h=buildPagesStagingOnRequest({openAdapters,verifyPreviewAccess:async(_req,b)=>b.fixture===true});
 for(const origin of ['https://denkicontrol.com','https://comments.denkicontrol.com','https://denkicontrol-comments-staging.pages.dev','https://else.pages.dev'])
  assert.equal((await h({request:req(origin),env})).status,404);
 assert.equal((await h({request:req(),env:{COMMENTS_ENABLED:'true'}})).status,503);
 assert.equal((await h({request:req(),env})).status,403);
 assert.equal((await buildPagesStagingOnRequest({openAdapters})({request:req(),env})).status,503);
 assert.equal(connected,0);
 const r=await h({request:req(),env:{...env,fixture:true}});
 assert.equal(r.status,200);assert.deepEqual(await r.json(),{rows:[]});assert.equal(connected,1);
});
test('staging client retains Access cookies only on the same host',async()=>{
 let n=0;
 const f=makeStagingFetch(async(p,o)=>{n++;assert.equal(p,path);assert.equal(o.credentials,'same-origin');assert.equal(o.redirect,'error');});
 await f(path,{credentials:'omit'});
 for(const p of ['https://bad.test'+path,'//bad.test'+path,'/api/article-comments/other'])
  assert.throws(()=>f(p,{}),/Invalid/);
 assert.equal(n,1);
});
