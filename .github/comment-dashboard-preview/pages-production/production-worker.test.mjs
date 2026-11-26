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

test('full stop blocks public, session, write and moderation without a backend call',async()=>{
 let invoked=0;
 const h=makeProductionWorker({connect:async()=>{invoked++;},fetcher:async()=>{invoked++;}});
 const query='?article='+encodeURIComponent(valid);
 for(const [route,method] of [['public'+query,'GET'],['own'+query,'GET'],['session'+query,'POST'],
  ['post'+query,'POST'],['moderation','GET'],['moderation','POST'],['moderation','OPTIONS']]){
   const req=new Request(url(route),{method,headers:{Origin:site,'Content-Type':'application/json'}});
   const r=await h(req,{...settings,COMMENTS_ENABLED:'false'});
   assert.equal(r.status,503);assert.match(r.headers.get('Cache-Control'),/no-store/);
 }
 assert.equal(invoked,0);
});


test('rotation keeps an existing anonymous author and renews its cookie',async()=>{
 const nextKey=Buffer.alloc(32,9).toString('base64url');
 const query='?article='+encodeURIComponent(valid);
 const actors=[];
 const h=makeProductionWorker({connect:async()=>({
  query:async(sql,args)=>{
   if(sql.includes('current_user'))return {rows:[{role:expectedRole}]};
   assert.equal(args[0],valid);
   if(sql.includes('gateway_eligible'))return {rows:[{data:true}]};
   assert.match(sql,/gateway_own/);actors.push(args[1]);return {rows:[{data:[]}]};
  },close:async()=>{}
 }),fetcher:async()=>assert.fail('session should not need external fetch')});
 const call=(part,env,cookie)=>h(new Request(url(part+query),{
  method:part==='session'?'POST':'GET',
  headers:{Origin:site,...(part==='session'?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},
  ...(part==='session'?{body:'{}'}:{})
 }),env);
 const issued=await call('session',settings);
 assert.equal(issued.status,200);
 const old=issued.headers.get('Set-Cookie').split(';')[0];
 const actor=old.split('.')[1];
 const rotated={...settings,COMMENTS_SIGNING_KEY:nextKey,COMMENTS_PREVIOUS_SIGNING_KEY:settings.COMMENTS_SIGNING_KEY};
 assert.equal((await call('own',rotated,old)).status,200);
 assert.deepEqual(actors,[actor]);
 const renewed=await call('session',rotated,old);
 assert.equal(renewed.status,200);
 const fresh=renewed.headers.get('Set-Cookie').split(';')[0];
 assert.notEqual(fresh,old);
 assert.equal(fresh.split('.')[1],actor);
 const retired={...settings,COMMENTS_SIGNING_KEY:nextKey};
 assert.equal((await call('own',retired,old)).status,200);
 assert.deepEqual(actors,[actor]);
 assert.equal((await call('own',retired,fresh)).status,200);
 assert.deepEqual(actors,[actor,actor]);
});
