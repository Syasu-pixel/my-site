import assert from 'node:assert/strict';
import test from 'node:test';
import {once} from 'node:events';
import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {makeClient} from './dashboard-client.mjs';
import {createModerationRoute} from './moderation-route.mjs';
import {makeVerifiedIdentity} from './deployment-boundary.mjs';
import {trial} from './fixture-model.mjs';
const path='/articles/ratchet-wrench.html';
test('isolated HTTP: author and unrelated browser, moderation, approval, and hide',async()=>{
 const keys=Object.fromEntries(['operator','outsider','anonymous','author','reader'].map(x=>[x,randomBytes(18).toString('hex')]));
 const model=trial({paths:[path],owner:'operator'});
 let base,route;
 const s=createServer(async(req,res)=>{
  try {
   const request=new Request(base+req.url,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:req,duplex:'half'}:{})});
   if(req.url.startsWith('/api/article-comments/moderation')){
    const r=await route(request);res.writeHead(r.status,Object.fromEntries(r.headers));return res.end(await r.text());
   }
   let actor=null;
   const cookie=req.headers.cookie??'';
   for(const k of ['author','reader'])if(cookie==='fixture='+keys[k])actor=k;
   if(req.method==='POST' && req.url==='/fixture-post' && actor){
    const b=[];for await(const x of req)b.push(x);
    model.post(path,actor,JSON.parse(Buffer.concat(b)));
   }else if(req.url!=='/fixture-public'&&req.url!=='/fixture-own'){
    res.writeHead(404);return res.end();
   }
   res.writeHead(200,{'cache-control':'private, no-store','content-type':'application/json'});
   res.end(JSON.stringify(model.read(path,req.url==='/fixture-public'?null:actor)));
  }catch{res.writeHead(500);res.end();}
 });
 s.listen(0,'127.0.0.1');await once(s,'listening');
 base='http://127.0.0.1:'+s.address().port;
 const supabase={auth:{getUser:async token=>{
  const id=Object.keys(keys).find(k=>keys[k]===token);
  return id?{data:{user:{id,is_anonymous:id==='anonymous'}}}:{error:'not valid'};
 }}};
 route=createModerationRoute({origin:base,identity:makeVerifiedIdentity({supabase}),moderators:{has:async id=>id==='operator'},store:{
  list:async({state})=>model.read(path,'operator').filter(r=>r.pending===(state==='pending')||!r.pending&&state==='published').map(r=>({...r,path,state})),
  apply:async a=>{
   if(a.action==='hide')return model.hide(a.path,a.id,a.adminId);
   if(a.action==='edit')return model.edit(a.path,a.id,a.adminId,a);
   return model.review(a.path,a.id,a.adminId,a.rev,a.action);
  }
 }});
 const headers=k=>({cookie:'fixture='+keys[k]});
 const via=(key)=>makeClient({getToken:async()=>keys[key],fetcher:(url,opt)=>fetch(base+url,{...opt,headers:{...opt.headers,...(opt.method==='POST'?{Origin:base}:{})}})});
 try{
  const first={body:'承認前は見えない合成コメント',nickname:'合成A',requestId:'alpha'};
  const post=await fetch(base+'/fixture-post',{method:'POST',headers:headers('author'),body:JSON.stringify(first)});
  assert.equal((await post.json())[0].body,first.body);
  const own=await fetch(base+'/fixture-own',{headers:headers('author')});
  assert.equal(own.headers.get('cache-control'),'private, no-store');assert.equal((await own.json())[0].nickname,first.nickname);
  const moderation=await fetch(base+'/api/article-comments/moderation',{headers:{Authorization:'Bearer '+keys.operator}});
  assert.equal(moderation.headers.get('cache-control'),'private, no-store');
  for(const k of ['outsider','anonymous'])await assert.rejects(via(k).list('pending'),{status:403});
  await assert.rejects(via('missing').list('pending'),{status:401});
  const raw=await fetch(base+'/fixture-own',{headers:headers('reader')}).then(r=>r.text());
  assert(!raw.includes(first.body)&&!raw.includes(first.nickname));
  const pub=async key=>(await fetch(base+'/fixture-public',{headers:headers(key)})).json();
  assert.deepEqual(await pub('author'),[]);assert.deepEqual(await pub('reader'),[]);
  const operator=via('operator');
  const [r]=await operator.list('pending');assert.equal(r.body,first.body);
  await assert.rejects(operator.apply({action:'approve',path,id:r.id,rev:r.rev+1}),{status:409});
  await operator.apply({action:'approve',path,id:r.id,rev:r.rev});
  const after=await pub('reader');assert.equal(after[0].body,first.body);
  assert.deepEqual(await pub('author'),after);
  assert.deepEqual(await operator.list('pending'),[]);
  await operator.apply({action:'edit',path,id:r.id,nickname:'合成A',body:'運営による修正案'});
  assert.equal((await pub('reader'))[0].body,first.body);
  const [edit]=await operator.list('pending');assert.equal(edit.editedByOperator,true);
  await operator.apply({action:'decline',path,id:edit.id,rev:edit.rev});
  await operator.apply({action:'hide',path,id:r.id});
  assert.deepEqual(await pub('reader'),[]);assert.deepEqual(await operator.list('published'),[]);
 }finally{const closed=once(s,'close');s.close();await closed;}
});
test('missing adapters and unexpected origin fail closed, before storage',async()=>{
 const url='https://comments.invalid/api/article-comments/moderation';
 const closed=await createModerationRoute()(new Request(url));assert.equal(closed.status,503);
 let calls=0;
 const route=createModerationRoute({origin:'https://comments.invalid',identity:{authenticate:async()=>{calls++;return {id:'admin',anonymous:false};}},moderators:{has:async()=>true},store:{list:async()=>[],apply:async()=>assert.fail('unexpected mutation')}});
 const r=await route(new Request(url,{method:'POST',headers:{origin:'https://other.invalid',authorization:'Bearer test','content-type':'application/json'},body:'{}'}));
 assert.equal(r.status,403);assert.equal(calls,0);assert.equal(r.headers.get('cache-control'),'private, no-store');
});
test('responsive shell has 6 matching destinations and a single selected tab in each nav',async()=>{
 const {readFile}=await import('node:fs/promises');
 const html=await readFile(new URL('./dashboard.html',import.meta.url),'utf8');
 const css=await readFile(new URL('./dashboard.css',import.meta.url),'utf8');
 const nav=[...html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)].map(x=>x[1]);
 assert.equal(nav.length,2);
 assert.deepEqual(nav.map(n=>[...n.matchAll(/href="([^"]+)"/g)].map(x=>x[1])),Array(2).fill(['./','./cases.html','./search.html','./articles.html','./health.html','./comments.html']));
 assert(nav.every(n=>n.match(/aria-current="page"/g)?.length===1));
 assert.match(css,/@media\(max-width:900px\)\s*{\s*\.main>\.mobile-admin-nav\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
 assert.match(css,/\.main>\.mobile-admin-nav a\{[^}]*min-height:44px/);
 assert.match(css,/@media\(max-width:400px\)\s*{\s*\.comment-actions,\.comment-controls\{display:grid;grid-template-columns:minmax\(0,1fr\)/);
});
test('the dashboard clears old queues even if a pending fetch resolves after sign-out',async()=>{
 const {mountDashboard}=await import('./dashboard-client.mjs');
 function makeElement(tag){
  return {tag,textContent:'',children:[],events:{},append(...args){this.children.push(...args);},replaceChildren(...args){this.children=args;},addEventListener(name,fn){this.events[name]=fn;},querySelectorAll(q){return this.children.flatMap(e=>[...(e.tag===q?[e]:[]),...e.querySelectorAll(q)]);},setAttribute(){}};
 }
 const list=makeElement('div'),status=makeElement('p'),select=makeElement('select'),refresh=makeElement('button');
 const slots={'[data-comments-list]':list,'[data-comments-status]':status,'select':select,'[data-comments-refresh]':refresh};
 let finish;
 const dashboard=mountDashboard({root:{querySelector:key=>slots[key]},doc:{createElement:makeElement},client:{list:()=>new Promise(res=>{finish=res;})}});
 const inflight=dashboard.refresh();dashboard.clear();
 finish([{nickname:'合成A',body:'ログアウト後に表示しない',path,state:'pending',id:'1',rev:1}]);
 await inflight;
 assert.deepEqual(list.children,[]);
 assert.equal(status.textContent,'ログインしてください。');
});
test('operator registry takes only the verified identity and refuses unknown entries and backend errors',async()=>{
 const {makeEditorialModeratorRegistry}=await import('./deployment-boundary.mjs');
 const id='711874f9-cc35-471d-b3a2-47badecfcab5';
 let rows, calls=0;
 const registryClient={from(name){calls++;assert.equal(name,'ai_editorial_admins');return {select(cols){assert.equal(cols,'user_id');return {eq(k,v){assert.equal(k,'user_id');assert.equal(v,id);return {maybeSingle:async()=>rows};}};}};}};
 const registry=makeEditorialModeratorRegistry({registryClient});
 assert.equal(await registry.has('operator'),false);assert.equal(calls,0);
 rows={data:null};assert.equal(await registry.has(id),false);
 rows={data:{user_id:id}};assert.equal(await registry.has(id),true);
 rows={error:'unavailable'};await assert.rejects(registry.has(id),/registry-unavailable/);
});
