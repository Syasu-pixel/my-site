import test from 'node:test';
import assert from 'node:assert/strict';
import {makeArticleClient,mountArticleComments} from './article-client.mjs';
const path='/articles/ratchet-wrench.html';
test('reader transport establishes browser session before write and does not discard caller retry ID',async()=>{
 const requests=[];
 const c=makeArticleClient({path,newId:()=> 'exact-operation-id',fetcher:async(url,options)=>{
  requests.push({name:new URL(url,'https://fixture.invalid').pathname.split('/').pop(),...options});
  if(requests.at(-1).name==='session')return Response.json({ready:true});
  if(requests.length===2)throw new Error('response lost');
  return Response.json({rows:[{body:'合成テスト'}]});
 }});
 const data={action:'post',requestId:c.nextId(),body:'合成テスト',nickname:''};
 await assert.rejects(c.submit(data),/入力は残っています/);
 assert.deepEqual(await c.submit(data),[{body:'合成テスト'}]);
 assert.deepEqual(requests.map(r=>r.name),['session','post','session','post']);
 assert.equal(requests[1].body,requests[3].body);
 assert(requests.every(r=>r.credentials==='same-origin'&&r.redirect==='error'));
 assert.throws(()=>makeArticleClient({path:'/en/articles/x.html'}),/対象外/);
});
test('form displays acceptance instantly, preserves draft after a failure, and does not submit during conversion',async()=>{
 function el(tag){
  return {tag,value:'',checked:false,textContent:'',children:[],events:{},append(...x){this.children.push(...x);},replaceChildren(...x){this.children=x;},addEventListener(name,fn){this.events[name]=fn;},focus(){},reportValidity(){return true;}};
 }
 const parts=Object.fromEntries(['form','textarea','input[name=nickname]','input[name=consent]','[type=submit]','[data-mode]','[data-cancel]','[data-public]','[data-pending]','[role=status]'].map(k=>[k,el(k)]));
 const by=k=>parts[k],form=by('form'),textarea=by('textarea');
 form.querySelector=by; form.reset=()=>{textarea.value='';};
 const sent=[];
 const client={nextId:()=> 'fixture-1',publicRows:async()=>[],pendingRows:async()=>[],submit:async data=>{
  sent.push(data);if(sent.length===1)throw new Error('入力は残っています。');
  return [{id:'1',body:data.body,nickname:'匿名'}];
 }};
 const ui=mountArticleComments({doc:{createElement:el},root:{querySelector:by},client});
 await ui.refresh();
 assert.equal(by('[data-public]').children[0].textContent,'まだコメントはありません。');
 textarea.value='合成のコツ';
 form.events.compositionstart();
 await form.events.submit({preventDefault(){}});assert.equal(sent.length,0);
 form.events.compositionend();
 await form.events.submit({preventDefault(){}});
 assert.equal(textarea.value,'合成のコツ');assert.equal(by('[role=status]').textContent,'入力は残っています。');
 await form.events.submit({preventDefault(){}});
 assert.equal(sent[0].requestId,sent[1].requestId);
 assert.equal(by('[data-pending]').children[0].textContent,'あなたの承認待ち');
 assert.equal(by('[data-pending]').children[1].children[1].textContent,'合成のコツ');
 assert.equal(by('[data-public]').children[0].textContent,'まだコメントはありません。');
 assert.match(by('[role=status]').textContent,/受け付けました/);
});
test('reply drafts and consent stay with the selected parent; another edit cannot take them',async()=>{
 function el(tag){return {tag,value:'',checked:false,textContent:'',children:[],events:{},append(...x){this.children.push(...x);},replaceChildren(...x){this.children=x;},addEventListener(name,fn){this.events[name]=fn;},focus(){},reportValidity(){return true;}};}
 const parts=Object.fromEntries(['form','textarea','input[name=nickname]','input[name=consent]','[type=submit]','[data-mode]','[data-cancel]','[data-public]','[data-pending]','[role=status]'].map(k=>[k,el(k)]));
 const by=k=>parts[k],form=by('form'),textarea=by('textarea'),nickname=by('input[name=nickname]'),consent=by('input[name=consent]');
 form.querySelector=by;form.reset=()=>{textarea.value=nickname.value='';consent.checked=false;};
 const submitted=[];
 const ui=mountArticleComments({doc:{createElement:el},root:{querySelector:by},client:{
  nextId:()=> 'fixture-bind',publicRows:async()=>[{id:'A',nickname:'A',body:'コメントA'},{id:'B',nickname:'B',body:'コメントB'}],
  pendingRows:async()=>[{id:'E',nickname:'編集元',body:'既存の編集本文'}],
  submit:async data=>{submitted.push(data);return [];}
 }});
 await ui.refresh();
 const reply=i=>by('[data-public]').children[i].children.at(-1).events.click();
 const edit=()=>by('[data-pending]').children[1].children.at(-1).events.click();
 reply(0);textarea.value='Aだけの下書き';nickname.value='A用';consent.checked=true;
 reply(1);edit();reply(0);
 assert.equal(textarea.value,'Aだけの下書き');assert.equal(nickname.value,'A用');assert.equal(consent.checked,true);
 const submit=()=>form.events.submit({preventDefault(){}});
 await submit();assert.equal(submitted[0].parent,'A');assert.equal(submitted[0].consent,true);
 await ui.refresh();reply(0);textarea.value='別の下書き';nickname.value='A用';consent.checked=true;reply(1);
 assert.match(by('[role=status]').textContent,/先に/);
 by('[data-cancel]').events.click();reply(1);
 assert.equal(textarea.value,'');assert.equal(nickname.value,'');assert.equal(consent.checked,false);
 by('[data-cancel]').events.click();await ui.refresh();edit();
 assert.equal(textarea.value,'既存の編集本文');textarea.value='Eだけの修正';consent.checked=true;reply(1);
 assert.equal(textarea.value,'Eだけの修正');await submit();
 assert.equal(submitted[1].action,'edit');assert.equal(submitted[1].id,'E');
 await ui.refresh();edit();textarea.value='取り消す修正';consent.checked=true;
 by('[data-cancel]').events.click();reply(1);
 assert.equal(textarea.value,'');assert.equal(nickname.value,'');assert.equal(consent.checked,false);
 textarea.value='Bへの別の返信';await submit();
 assert.equal(submitted[2].parent,'B');assert.equal(submitted[2].consent,false);
});
