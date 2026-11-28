import test from 'node:test';
import assert from 'node:assert/strict';
import {mountDashboard,makeClient} from './dashboard-client.mjs';
import {createModerationRoute} from './moderation-route.mjs';
import {openPreviewStore} from './sqlite-preview-store.mjs';

function el(tag){
 return {tag,children:[],value:'',textContent:'',events:{},append(...x){this.children.push(...x);},
  replaceChildren(...x){this.children=x;},setAttribute(){},addEventListener(n,f){this.events[n]=f;},
  querySelectorAll(q){return this.children.flatMap(x=>[...(x.tag===q?[x]:[]),...x.querySelectorAll(q)]);}};
}
test('51 pending rows: only previous page matches; cursor works after boundary declines',async()=>{
 const origin='https://localhost.invalid',path='/articles/example.html';
 const db=openPreviewStore({file:':memory:',eligible:[path],operatorIds:['operator']});
 try{
  const ids=Array.from({length:51},(_,i)=>db.post(path,'author',{requestId:'op-'+i,nickname:'合成',body:i===0?'古い一件だけ':'新しい投稿'+i}));
  const route=createModerationRoute({origin,identity:{authenticate:async()=>({id:'operator',anonymous:false})},moderators:{has:async()=>true},store:db});
  const client=makeClient({getToken:async()=>'synthetic',fetcher:(url,opt)=>route(new Request(origin+url,opt))});
  const first=await client.listPage('pending');
  assert.equal(first.rows.length,50);assert.equal(first.next,ids[1]);
  db.apply({adminId:'operator',path,id:ids[1],rev:1,action:'decline'});
  assert.deepEqual((await client.listPage('pending',first.next)).rows.map(r=>r.id),[ids[0]]);
  db.post(path,'author',{requestId:'newest',nickname:'合成',body:'更新分'});
  const list=el('div'),status=el('p'),filter=el('input');
  const slots={'[data-comments-list]':list,'[data-comments-status]':status,'[data-comments-filter]':filter,'select':el('select'),'[data-comments-refresh]':el('button')};
  const ui=mountDashboard({root:{querySelector:k=>slots[k]},doc:{createElement:el},client});
  await ui.refresh();
  filter.value='古い一件';filter.events.input();
  assert.match(status.textContent,/検索は読み込んだ投稿が対象/);
  const next=list.children.find(x=>x.textContent==='さらに前のコメントを表示');
  assert.ok(next);
  await next.events.click();
  assert.equal(list.children.length,1);assert.equal(list.children[0].tag,'article');
  assert.ok(list.children[0].children.some(x=>x.textContent==='古い一件だけ'));
  assert.equal(status.textContent,'表示 1件');
  const bad=await route(new Request(origin+'/api/article-comments/moderation?state=pending&after=not-found',{headers:{authorization:'Bearer synthetic'}}));
  assert.equal(bad.status,400);
 }finally{db.close();}
});

test('production candidate queue supports safe keyboard cancellation, filter reset, and focus after approval',async()=>{
 const {mountDashboard:mountCandidate}=await import('./dashboard-production-candidate/candidate/admin/comments-dashboard-client.mjs');
 let active, calls=0, approved=false;
 function node(tag){
  const e=el(tag);
  e.append=(...items)=>{for(const child of items){child.parent=e;e.children.push(child);}};
  e.replaceChildren=(...items)=>{e.children=[];e.append(...items);};
  e.remove=()=>{e.parent.children=e.parent.children.filter(x=>x!==e);};
  e.focus=()=>{active=e;};
  e.contains=x=>x===e||e.children.some(y=>y.contains(x));
  return e;
 }
 const slots=Object.fromEntries(['list','status','filter','heading','refresh','reset','count'].map(key=>['[data-comments-'+key+']',node(key)]));
 slots.select=node('select');
 const get=key=>slots['[data-comments-'+key+']'];
 const ui=mountCandidate({root:{querySelector:key=>slots[key]},doc:{createElement:node},client:{
  async listPage(state){return {rows:state==='pending'&&!approved?[{id:'a',path:'/articles/example.html',rev:1,body:'ポンプの確認',nickname:'合成',state}]:[],next:null};},
  async apply(op){calls++;assert.deepEqual(op,{action:'approve',path:'/articles/example.html',id:'a',rev:1});approved=true;}
 }});
 await ui.refresh();
 assert.equal(get('count').textContent,'1件読み込み済み');
 get('filter').value='一致なし';get('filter').events.input();
 assert.equal(get('count').textContent,'0件表示 / 1件読み込み済み');assert.equal(get('list').children.length,0);
 get('reset').events.click();assert.equal(active,get('filter'));assert.equal(get('list').children.length,1);
 const find=label=>get('list').querySelectorAll('button').filter(x=>x.textContent===label);
 const trigger=find('承認して公開')[0];trigger.events.click();
 const panel=active.parent;panel.events.keydown({key:'Escape',preventDefault(){}});
 assert.equal(active,trigger);assert.equal(calls,0);assert.equal(find('承認して公開').length,1);
 trigger.events.click();await find('承認して公開')[1].events.click();
 assert.equal(calls,1);assert.equal(active,get('heading'));assert.equal(get('count').textContent,'0件読み込み済み');
 ui.clear();assert.equal(get('count').hidden,true);assert.equal(get('reset').hidden,true);
});
