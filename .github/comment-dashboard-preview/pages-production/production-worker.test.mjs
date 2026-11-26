import {test} from 'node:test';
import assert from 'node:assert/strict';
import {expectedRole,makeProductionWorker} from './production-worker.mjs';
const site='https://denkicontrol.com',api='https://comments.denkicontrol.com';
const valid='/articles/example.html';
const settings={COMMENTS_ENABLED:'true',COMMENTS_PILOT_ARTICLE:valid,COMMENTS_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic_value',
 COMMENTS_SIGNING_KEY:Buffer.alloc(32,8).toString('base64url'),COMMENTS_GATEWAY_DB:{connectionString:'synthetic-placeholder'}};
const url=(p,host=api)=>host+'/api/article-comments/'+p;
const request=(p,from=site,host)=>new Request(url(p,host),{headers:from?{Origin:from}:{}});
const check=(article=valid)=>'readiness?article='+encodeURIComponent(article);
test('disabled, alternate hosts or Origins, and excluded paths never touch backend',async()=>{
 let calls=0;const h=makeProductionWorker({connect:async()=>{calls++;},fetcher:async()=>{calls++;}});
 assert.equal((await h(request(check()),{})).status,503);
 assert.equal((await h(request(check(),site,'https://wrong.pages.dev'),settings)).status,404);
 assert.equal((await h(request(check(),'https://sub.denkicontrol.com'),settings)).status,403);
 assert.equal((await h(request(check(),null),settings)).status,403);
 for(const article of ['/','/en/articles/example.html','/category/a','/articles/../index.html'])
  assert.equal((await h(request(check(article)),settings)).status,404);
 assert.equal(calls,0);
});
test('strict role first, then DB eligibility, then public read for marked pages',async()=>{
 let role='postgres', isEligible=true, healthy=true, queries=[], closed=0, reads=0;
 const h=makeProductionWorker({connect:async()=>({
  query:async(sql,args)=>{
   queries.push(sql);
   if(sql.includes('current_user'))return {rows:[{role}]};
   assert.deepEqual(args,[valid]);return {rows:[{data:isEligible}]};
  },close:async()=>{closed++;}
 }),fetcher:async(url,init)=>{
  reads++;assert.equal(init.redirect,'manual');assert.equal(init.headers.Authorization,undefined);
  assert.equal(new URL(url).pathname,'/rest/v1/rpc/dc_comment_public_list');
  return healthy?Response.json([]):new Response('synthetic secret error',{status:503});
 }});
 assert.equal((await h(request(check('/articles/not-in-pilot.html')),settings)).status,404);
 assert.equal((await h(request('public?article=/articles/not-in-pilot.html'),settings)).status,404);
 assert.equal(reads,0);
 const probe=()=>h(request(check()),settings);
 let r=await probe();
 assert.equal(r.status,503);assert.deepEqual(queries,['select current_user as role']);assert.equal(closed,1);assert.equal(reads,0);
 role=expectedRole;isEligible=false;
 r=await probe();assert.equal(r.status,404);assert.equal(reads,0);
 isEligible=true;healthy=false;
 r=await probe();assert.equal(r.status,503);assert.deepEqual(await r.json(),{ready:false});
 healthy=true;r=await probe();
 assert.equal(r.status,200);assert.deepEqual(await r.json(),{ready:true});
 assert.equal(r.headers.get('Access-Control-Allow-Origin'),site);
 assert.equal(r.headers.get('Access-Control-Allow-Credentials'),null);assert.equal(closed,4);assert.equal(reads,2);
});
