import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeStagingConnectionCheck} from './staging-worker.mjs';
import {buildPreviewFetch} from './advanced-wrapper.mjs';
const origin='https://smoke.denkicontrol-comments-staging.pages.dev';
const req=(base=origin,method='GET')=>new Request(base+'/api/staging-connection-check',{method});
test('diagnostic is host and Access fenced, read-only, and omits inputs',async()=>{
 let f=0,d=0,c=0;
 const check=makeStagingConnectionCheck({verify:async(q,e)=>e.authorized===true,open:async(s)=>{
   assert.equal(s,'synthetic-connection');d++;return {query:async(sql)=>{assert.equal(sql,'select current_user as role');
     return {rows:[{role:'dc_comment_staging_dtqwnhmpieruiufbodnz'}]};},close:async()=>{c++;}};
  },fetcher:async(url,opts)=>{f++;assert.equal(opts.redirect,'manual');assert.equal(opts.headers.apikey,'sb_publishable_synthetic_only');return Response.json([]);}});
 const fn=buildPreviewFetch({check});
 const env={authorized:true,COMMENTS_STAGING_ENABLED:'true',COMMENTS_STAGING_SUPABASE_PROJECT_REF:'dtqwnhmpieruiufbodnz',
  COMMENTS_STAGING_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic_only',COMMENTS_STAGING_SIGNING_KEY:'b'.repeat(43),
  COMMENTS_STAGING_GATEWAY_DB:{connectionString:'synthetic-connection'}};
 assert.equal((await fn(req('https://other.invalid'),env)).status,404);
 assert.equal((await fn(req(),{...env,authorized:false})).status,403);
 assert.equal((await fn(req(origin,'POST'),env)).status,405);
 assert.deepEqual([f,d,c],[0,0,0]);
 const disabled=await fn(req(),{...env,COMMENTS_STAGING_ENABLED:'false'});
 assert.equal((await disabled.json()).publicRead,'not_checked');
 assert.deepEqual([f,d,c],[0,0,0]);
 const result=await fn(req(),env);assert.equal(result.status,200);assert.match(result.headers.get('cache-control'),/no-store/);
 const body=await result.text();assert.doesNotMatch(body,/synthetic|staging_dtq|b{43}/);
 assert.deepEqual(JSON.parse(body),{enabled:true,project:true,publicKeyFormat:true,signingKeyFormat:true,databaseBinding:true,publicRead:'ok',databaseLogin:'ok'});
 assert.deepEqual([f,d,c],[1,1,1]);
});
