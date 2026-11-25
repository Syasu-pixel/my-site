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
