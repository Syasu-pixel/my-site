import assert from 'node:assert/strict';
import {attachProductionArticleComments} from './article-production-mount.mjs';
const origin='https://denkicontrol.com', pathname='/articles/synthetic-example.html', sha='7'.repeat(64);
const location={origin,pathname};
const listeners={}, requests=[];
const node={matches:()=>true,draft:'合成テストの未送信メモ'};
let attached=false, mountCount=0, restoreResult=true;
const refreshes=[];
const slot={hidden:true,isConnected:true,querySelector:()=>attached?node:null,
 querySelectorAll:()=>[{content:{childElementCount:1,firstElementChild:{cloneNode:()=>node}}}],
 append(root){assert.equal(root,node);attached=true}};
const doc={defaultView:{addEventListener:(name,fn)=>(listeners[name]=fn),removeEventListener:(name,fn)=>{if(listeners[name]===fn)delete listeners[name];}},documentElement:{lang:'ja'},
 querySelectorAll:s=>s==='link[rel=canonical]'?[{getAttribute:()=>origin+pathname}]:[slot]};
const reply=(url,release=sha,status=200)=>({status,url,redirected:false,headers:new Headers({'Content-Type':'application/json'}),json:async()=>({ready:true,release})});
let first=true;
await attachProductionArticleComments({enabled:true,location,doc,allowedPaths:new Set([pathname]),releaseSha:sha,
 fetcher:async (url,{signal})=>first?(first=false,reply(url)):new Promise(resolve=>requests.push({signal,send:(release,status)=>resolve(reply(url,release,status))})),
 makeClient:()=>({publicRows:async()=>[]}),mount:()=>{mountCount++;return {refresh:async opt=>{if(opt)refreshes.push(opt);return opt?restoreResult:true}}}
});
assert.equal(slot.hidden,false);
listeners.pagehide({persisted:true});
assert.equal(slot.hidden,true);
await listeners.pageshow({persisted:false});
assert.equal(requests.length,0);
const off=listeners.pageshow({persisted:true});
assert.equal(slot.hidden,true);
requests.shift().send(sha,503); await off;
assert.equal(slot.hidden,true);
const on=listeners.pageshow({persisted:true});
requests.shift().send(); await on;
assert.equal(slot.hidden,false);
assert.equal(node.draft,'合成テストの未送信メモ');
assert.equal(refreshes.length,1);
restoreResult=false;
listeners.pagehide({persisted:true});
const degraded=listeners.pageshow({persisted:true});
requests.shift().send();await degraded;
assert.equal(slot.hidden,true,'do not redisplay old comments when list refresh fails');
assert.equal(refreshes.length,2);
assert.equal(refreshes[0].allow(),false,'old list response can no longer render');
assert.equal(node.draft,'合成テストの未送信メモ');
restoreResult=true;
const stale=listeners.pageshow({persisted:true});
const raced=requests.shift();
listeners.pagehide({persisted:true});
assert.equal(raced.signal.aborted,true);
const newer=listeners.pageshow({persisted:true});
requests.shift().send(sha,503); await newer;
raced.send(); await stale;
assert.equal(slot.hidden,true);
const wrong=listeners.pageshow({persisted:true});
requests.shift().send('8'.repeat(64)); await wrong;
assert.equal(slot.hidden,true);
assert.equal(mountCount,1);
console.log('pagehide/persisted-restore/no-op/OFF/ON/draft/race/Wrong release checks passed (synthetic events)');
