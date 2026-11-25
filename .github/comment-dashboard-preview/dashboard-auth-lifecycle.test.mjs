import test from 'node:test';
import assert from 'node:assert/strict';
import {mountWithDashboardAuth} from './deployment-boundary.mjs';
function element(tag){
 return {tag,children:[],textContent:'',events:{},append(...x){this.children.push(...x);},
  replaceChildren(...x){this.children=x;},setAttribute(){},addEventListener(n,f){this.events[n]=f;},
  querySelectorAll(q){return this.children.flatMap(x=>[...(x.tag===q?[x]:[]),...x.querySelectorAll(q)]);}};
}
function setup(){
 const list=element('div'),status=element('p'),filter=element('input');
 const slots={'[data-comments-list]':list,'[data-comments-status]':status,'[data-comments-filter]':filter,'select':element('select'),'[data-comments-refresh]':element('button')};
 let event,token='a-test-token',settle,start,unsubscribed=false;
 const started=new Promise(r=>{start=r});
 const supabase={auth:{getSession:async()=>({data:{session:{access_token:token}}}),onAuthStateChange:fn=>(event=fn,{data:{subscription:{unsubscribe(){unsubscribed=true;}}}})}};
 const root={querySelector:x=>slots[x]};
 const panel=mountWithDashboardAuth({root,supabase,doc:{createElement:element},fetcher:()=>new Promise(r=>{settle=r;start();})});
 const change=(code,user)=>{token=user?'synthetic-'+user:null;event(code,user?{user:{id:user}}:null);};
 const fake=()=>settle(new Response(JSON.stringify({rows:[{id:'synthetic',path:'/articles/example.html',state:'pending',nickname:'合成読者',body:'合成の承認待ち'}]})));
 return {list,status,filter,panel,change,started,fake,removed:()=>unsubscribed};
}
test('account switch drops a previously authorized response before it reaches view',async()=>{
 const f=setup();f.change('INITIAL_SESSION','A');const loading=f.panel.refresh();await f.started;
 f.filter.value='合成';f.change('SIGNED_IN','B');f.fake();await loading;
 assert.deepEqual(f.list.children,[]);assert.equal(f.status.textContent,'ログインしてください。');assert.equal(f.filter.value,'');
});
test('same-account token refresh retains the queue, while sign-out clears it',async()=>{
 const f=setup();f.change('INITIAL_SESSION','A');const loading=f.panel.refresh();await f.started;
 f.change('TOKEN_REFRESHED','A');f.fake();await loading;assert.equal(f.list.children.length,1);
 f.change('SIGNED_OUT',null);assert.deepEqual(f.list.children,[]);f.panel.dispose();assert(f.removed());
});
