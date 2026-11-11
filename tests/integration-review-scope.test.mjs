import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {integrationScope,integrationWidths,integrationSuffix} from '../scripts/integration-review-scope.mjs';
const config={targets:['articles/a.html','articles/b.html'],representatives:['articles/a.html']};
test('absent scope retains full audit and original widths',()=>{
 assert.deepEqual(integrationScope(config),{scope:'all',targets:config.targets});
 assert.deepEqual(integrationWidths(config,'articles/b.html','all'),[390,768,1440]);
});
test('selected scope has full boundary widths and stable registered order',()=>{
 const r=integrationScope(config,{scope:'selected',affectedTargets:['articles/b.html','articles/a.html']});
 assert.deepEqual(r.targets,config.targets);
 assert.deepEqual(integrationWidths(config,'articles/b.html','selected'),[320,390,768,1024,1440]);
});
test('empty, duplicate, unknown, partial-full and unrecognized scopes fail closed',()=>{
 for(const impact of [{scope:'selected',affectedTargets:[]},{scope:'selected',affectedTargets:['articles/a.html','articles/a.html']},{scope:'selected',affectedTargets:['articles/c.html']},{scope:'all',affectedTargets:['articles/a.html']},{scope:'none',affectedTargets:config.targets},{}])assert.throws(()=>integrationScope(config,impact));
});
test('explicit single shard retains artifact suffix; legacy local default preserved',()=>{
 assert.equal(integrationSuffix(0,1,true),'-shard-0');
 assert.equal(integrationSuffix(0,1,false),'');
 assert.equal(integrationSuffix(2,6,false),'-shard-2');
});
function fixture(mutate=()=>{}){
 const dir=mkdtempSync(join(tmpdir(),'integration-scope-'));
 const full=JSON.parse(readFileSync('.github/article-components/integration.json','utf8'));
 const target=(full.targets||full.representatives).find(p=>p.startsWith('articles/'));
 const service='services/gxworks2-online-support.html';
 const impact={scope:'selected',affectedTargets:[target]};
 const images=Array.from({length:20},(_,i)=>({key:'fixture',part:'part'+i,file:'fixture-'+i+'.png'}));
 const layout={scope:'selected',shardIndex:0,shardCount:1,targets:[target],results:[...[320,390,768,1024,1440].map(width=>({path:target,width,status:'passed'})),...[390,768,1440].map(width=>({path:service,width,status:'paused-service'}))],votes:[{path:target,mode:'success/reload'},...['duplicate','error','no-storage'].map(mode=>({mode}))],images,failures:[]};
 const dark={scope:'selected',shardIndex:0,shardCount:1,targets:[target],results:[390,1440].map(width=>({path:target,width,status:'passed'})),failures:[]};
 mutate({layout,dark,impact});
 mkdirSync(join(dir,'evidence-shard-0'));
 for(const im of images)writeFileSync(join(dir,'evidence-shard-0',im.file),'fixture');
 const data={'article-impact.json':impact,'browser-checks-shard-0.json':layout,'article-dark-checks-shard-0.json':dark,'boundary-checks.json':{failures:[]},'risk-checks.json':{failures:[]},'link-resource-audit.json':{introduced:[]},'regeneration-checks.json':{status:'passed'},'coverage-ledger.json':{pages:[{path:target,state:'レビュー・画面検査待ち'},{path:'articles/other.html',state:'レビュー・画面検査待ち'}]}};
 for(const [name,json] of Object.entries(data))writeFileSync(join(dir,name),JSON.stringify(json));
 const result=spawnSync(process.execPath,['scripts/merge-integration-checks.mjs',dir,'1'],{encoding:'utf8',env:{...process.env,ARTICLE_IMPACT_FILE:join(dir,'article-impact.json')}});
 return {dir,result};
}
test('selected one-shard reconciliation records only tested article',()=>{
 const {dir,result}=fixture();try{
 assert.equal(result.status,0,result.stderr);
 const ledger=JSON.parse(readFileSync(join(dir,'coverage-ledger.json')));
 assert.equal(ledger.browserScope,'selected');assert.equal(ledger.browserVerifiedArticles,1);
 assert.ok(ledger.pages[0].state.includes('検査済み'));assert.ok(ledger.pages[1].state.includes('検査待ち'));
 assert.equal(JSON.parse(readFileSync(join(dir,'article-dark-checks.json'))).results.length,2);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
for(const [name,mutate] of [
 ['missing layout boundary',({layout})=>layout.results.shift()],
 ['missing dark case',({dark})=>dark.results.pop()],
 ['duplicate dark case',({dark})=>dark.results[1]={...dark.results[0]}],
 ['wrong dark shard',({dark})=>dark.shardIndex=1],
 ['dark failure',({dark})=>dark.failures.push({error:'unreadable'})],
 ['missing screenshot',({layout})=>layout.images.pop()],
 ['wrong layout scope',({layout})=>layout.scope='all'],
 ['missing service case',({layout})=>layout.results.pop()],
 ['missing isolated vote edge',({layout})=>layout.votes.pop()]
])test('reconciliation rejects '+name,()=>{const {dir,result}=fixture(mutate);try{assert.notEqual(result.status,0);}finally{rmSync(dir,{recursive:true,force:true});}});
test('six-shard all-article reconciliation retains complete coverage',()=>{
 const dir=mkdtempSync(join(tmpdir(),'integration-full-'));
 try{
  const config=JSON.parse(readFileSync('.github/article-components/integration.json','utf8'));
  const targets=config.targets||config.representatives;
  const put=(name,data)=>writeFileSync(join(dir,name),JSON.stringify(data));
  put('article-impact.json',{scope:'all',affectedTargets:targets});
  for(let i=0;i<6;i++){
   const local=targets.filter((_,n)=>n%6===i),images=[];
   mkdirSync(join(dir,'evidence-shard-'+i));
   for(let n=0;n<local.length*14+(i===0?6:0);n++){
    const file=`shard-${i}-${n}.png`;images.push({key:file,part:'fixture',file});writeFileSync(join(dir,'evidence-shard-'+i,file),'fixture');
   }
   const results=local.flatMap(path=>integrationWidths(config,path,'all').map(width=>({path,width,status:'passed'})));
   const votes=local.filter(p=>!p.startsWith('en/')).map(path=>({path,mode:'success/reload'}));
   if(i===0){results.push(...[390,768,1440].map(width=>({path:'services/gxworks2-online-support.html',width,status:'paused-service'})));votes.push(...['duplicate','error','no-storage'].map(mode=>({mode})));}
   put(`browser-checks-shard-${i}.json`,{scope:'all',shardIndex:i,shardCount:6,targets:local,results,votes,images,failures:[]});
   put(`article-dark-checks-shard-${i}.json`,{scope:'all',shardIndex:i,shardCount:6,targets:local,results:local.flatMap(path=>[390,1440].map(width=>({path,width,status:'passed'}))),failures:[]});
  }
  for(const name of ['boundary-checks.json','risk-checks.json'])put(name,{failures:[]});
  put('link-resource-audit.json',{introduced:[]});put('regeneration-checks.json',{status:'passed'});
  put('coverage-ledger.json',{pages:targets.map(path=>({path,state:'レビュー・画面検査待ち'}))});
  const result=spawnSync(process.execPath,['scripts/merge-integration-checks.mjs',dir,'6'],{encoding:'utf8',env:{...process.env,ARTICLE_IMPACT_FILE:join(dir,'article-impact.json')}});
  assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.parse(readFileSync(join(dir,'coverage-ledger.json'))).browserVerifiedArticles,targets.length);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
