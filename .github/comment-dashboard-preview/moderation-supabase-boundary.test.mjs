import test from 'node:test';
import assert from 'node:assert/strict';
import {createBoundModeration} from './moderation-supabase-boundary.mjs';
import {openPreviewStore} from './sqlite-preview-store.mjs';
const origin='https://preview.invalid';
const path='/articles/synthetic-example.html';
const url=origin+'/api/article-comments/moderation';
const ids={admin:'449c2ebb-06b1-4d39-b793-4f01ebb43ecb',other:'5c389ec2-f2b5-4225-90e0-ecd3f07effbe',anon:'47334ee4-b096-4097-86c9-c80c75f9cc81'};
const req=(token,{payload,from=origin}={})=>new Request(url+(payload?'':'?state=pending'),{
 method:payload?'POST':'GET',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(payload?{Origin:from,'Content-Type':'application/json'}:{})},...(payload?{body:JSON.stringify(payload)}:{})
});
const capture=(t,configure={})=>{
 const sqlite=openPreviewStore({file:':memory:',eligible:[path],operatorIds:[ids.admin]});t.after(()=>sqlite.close());
 const id=sqlite.post(path,'synthetic_reader',{body:'合成の確認待ち本文',nickname:'合成読者',requestId:'sample-1'});
 let active=true;
 const trace=[];
 const handle=createBoundModeration({
   origin,authClient:{auth:{getUser:async value=>{
    trace.push(['auth',value]);return ids[value]?{data:{user:{id:ids[value],is_anonymous:value==='anon'}}}:{error:{code:'expired'}};
   }}},
   createActorClient:async({accessToken})=>({rpc:async(name,a)=>{
    trace.push([name,accessToken,a]);
    const adminId=ids[accessToken],isAdmin=active&&adminId===ids.admin;
    if(name==='dc_comment_moderator_self')return {data:isAdmin};
    if(configure.error)return {error:configure.error};
    if(!isAdmin||name.endsWith('apply')&&configure.revokeOnApply)return {error:{code:'42501'}};
    try{
     if(name.endsWith('list'))return {data:sqlite.list({adminId,state:a.p_state,limit:a.p_limit}).map(row=>({...row,author:'never-expose-me'}))};
     if(name.endsWith('apply')){
      sqlite.apply({adminId,path:a.p_path,id:a.p_id,action:a.p_action,rev:a.p_rev,body:a.p_body,nickname:a.p_nickname});
      return {data:true};
     }
    }catch(e){return {error:{code:{400:'22023',403:'42501',404:'P0002',409:'DC409'}[e.status],message:'not for response'}};}
   }})
 });
 return {handle,trace,sqlite,id,revoke:()=>{active=false;}};
};
test('verified operator lists and approves in one bound flow; public projection has no author identifier',async t=>{
 const {handle,trace,sqlite,id}=capture(t);
 const r=await handle(req('admin'));assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/private, no-store/);
 const list=await r.json();assert.equal(list.rows[0].body,'合成の確認待ち本文');assert(!('author' in list.rows[0]));
 assert.equal(sqlite.publicFor(path).length,0);
 const p=await handle(req('admin',{payload:{id,path,rev:list.rows[0].rev,action:'approve',adminId:ids.other}}));
 assert.equal(p.status,200);assert.equal(sqlite.publicFor(path)[0].body,list.rows[0].body);
 const rpc=trace.find(row=>row[0].endsWith('apply'));assert.equal(rpc[1],'admin');assert(!Object.keys(rpc[2]).some(k=>/admin|actor|user/.test(k)));
});
test('expired, anonymous, unsigned, and a signed-in nonoperator do not touch protected storage',async t=>{
 const {handle,trace}=capture(t);
 for(const [token,status] of [[null,401],['expired',403],['anon',403],['other',403]]){
  const r=await handle(req(token));assert.equal(r.status,status);assert(!JSON.stringify(await r.json()).includes('合成'));
 }
 assert.equal(trace.filter(e=>e[0]==='dc_comment_moderator_self').length,1);
 assert(!trace.some(e=>e[0].endsWith('list')||e[0].endsWith('apply')));
});
test('parallel denied and operator requests cannot share credentials',async t=>{
 const {handle,trace}=capture(t);
 const rr=await Promise.all([handle(req('other')),handle(req('admin')),handle(req('expired')),handle(req('anon'))]);
 assert.deepEqual(rr.map(r=>r.status),[403,200,403,403]);
 assert.deepEqual(trace.filter(e=>e[0].endsWith('list')).map(e=>e[1]),['admin']);
});
test('authorization lost at the write boundary leaves the comment unpublished',async t=>{
 const {handle,sqlite,id}=capture(t,{revokeOnApply:true});
 const r=await handle(req('admin',{payload:{path,id,rev:1,action:'approve'}}));
 assert.equal(r.status,403);assert.equal(sqlite.publicFor(path).length,0);
});
test('stale revision or a different origin does not approve',async t=>{
 const {handle,sqlite,id,trace}=capture(t);
 sqlite.editOwn(path,id,'synthetic_reader',{body:'変更した版',nickname:'合成読者'});
 const payload={path,id,rev:1,action:'approve'};
 assert.equal((await handle(req('admin',{payload,from:'https://elsewhere.invalid'}))).status,403);
 assert.equal(trace.length,0);
 assert.equal((await handle(req('admin',{payload}))).status,409);
 assert.equal(sqlite.publicFor(path).length,0);
});
test('unavailable connector and database errors fail closed without details',async t=>{
 const unavailable=await createBoundModeration()(req('admin'));assert.equal(unavailable.status,503);
 const {handle}=capture(t,{error:{code:'XX000',details:'private-details'}});
 const response=await handle(req('admin'));assert.equal(response.status,503);
 assert(!JSON.stringify(await response.json()).includes('private-details'));
});
