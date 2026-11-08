import {appendFile,writeFile} from 'node:fs/promises';
import {basename} from 'node:path';
import {execFileSync} from 'node:child_process';
import {isDeepStrictEqual} from 'node:util';
const out=process.argv[2];
if(!out)throw Error('Usage: node scripts/report-hero-impact.mjs <output.json>');
const readJson=(ref,path)=>JSON.parse(execFileSync('git',['show',ref+':'+path],{encoding:'utf8',maxBuffer:16*1024*1024}));
const manifest=readJson('HEAD','.github/article-components/hero/manifest.json');
const base=process.env.BASE_SHA;
if(!/^[a-f0-9]{40}$/.test(base||''))throw Error('BASE_SHA must be a 40-character commit SHA');
const changed=execFileSync('git',['diff','--name-only','--no-renames','-z',base,'HEAD'],{encoding:'utf8'}).split('\0').filter(Boolean);
const registered=new Set(manifest.targets);
const affected=new Set(changed.filter(path=>registered.has(path)));
const categoryConsumers=new Set();
const registries=new Map([
 ['.github/site-shells/manifest.json',['pages','output',['baselineSha256']]],
 ['.github/article-components/site-inventory.json',['files','path',['gitBlob']]],
 ['.github/article-components/end/all-preservation-oracle.json',['pages','path',['sourceSha256','cards']]],
 ['.github/article-components/sidebar/all-pages.json',['pages','path',['cardsBefore','tocReference']]],
 ['.github/article-components/hero/css-bindings.json',null],
]);

function registryImpact(path){
 const before=readJson(base,path);
 const after=readJson('HEAD',path);
 const rule=registries.get(path);
 if(!rule){
  const keys=Object.keys(before);
  if(!isDeepStrictEqual(keys,Object.keys(after)))return false;
  for(const key of keys){
   if(isDeepStrictEqual(before[key],after[key]))continue;
   if(!registered.has(key))return false;
   affected.add(key);
  }
  return true;
 }
 const [group,key,fields]=rule;
 const {[group]:previous,...previousShared}=before;
 const {[group]:current,...currentShared}=after;
 if(!isDeepStrictEqual(previousShared,currentShared)||previous.length!==current.length)return false;
 for(let i=0;i<previous.length;i++){
  const oldEntry=previous[i];
  const newEntry=current[i];
  if(isDeepStrictEqual(oldEntry,newEntry))continue;
  if(!registered.has(oldEntry[key])||oldEntry[key]!==newEntry[key])return false;
  const oldShared={...oldEntry};
  const newShared={...newEntry};
  for(const field of fields){delete oldShared[field];delete newShared[field];}
  if(!isDeepStrictEqual(oldShared,newShared))return false;
  affected.add(oldEntry[key]);
 }
 return true;
}

function imageImpact(path){
 // Search both revisions so that replaced, deleted and newly shared references
 // are covered. Unknown or shared consumers keep the full audit.
 let found=false;
 for(const ref of [base,'HEAD']){
  let matches;
  try{
   matches=execFileSync('git',['grep','-lzIF','-e',basename(path),ref,'--',
    '*.html','*.css','*.js','*.mjs','*.njk','*.json','*.svg','*.xml'],{encoding:'utf8',maxBuffer:16*1024*1024});
  }catch(error){
   if(error.status===1)continue;
   throw error;
  }
  for(const match of matches.split('\0').filter(Boolean)){
   const consumer=match.slice(ref.length+1);
   if(registries.has(consumer))continue;
   if(/^(?:en\/)?categories\/[a-z0-9-]+\.html$/.test(consumer)){
    categoryConsumers.add(consumer);
    continue;
   }
   if(!registered.has(consumer))return false;
   affected.add(consumer);
   found=true;
  }
 }
 return found;
}

const sharedPath=changed.find(path=>{
 if(registered.has(path)||path==='docs/rules/catalog.json'||/^docs\/.+\.md$/.test(path))return false;
 if(registries.has(path))return !registryImpact(path);
 if(/^assets\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:png|webp|jpe?g|gif|avif)$/i.test(path))return !imageImpact(path);
 return true;
});
const shared=Boolean(sharedPath);
const full=process.env.FULL_HERO_AUDIT==='1'||shared||affected.size===0;
const affectedTargets=full?manifest.targets:manifest.targets.filter(path=>affected.has(path));
const shards=full?[0,1,2,3,4,5]:[0];
const result={base,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sharedChange:shared,sharedPath,categoryConsumers:[...categoryConsumers].sort(),changedFiles:changed,affectedTargets,unaffectedTargets:manifest.targets.length-affectedTargets.length,scope:full?'all':'selected',shards};
await writeFile(out,JSON.stringify(result,null,2)+'\n');
if(process.env.GITHUB_OUTPUT){
 const {appendFile}=await import('node:fs/promises');
 await appendFile(process.env.GITHUB_OUTPUT,'targets='+(full?'':affectedTargets.join(','))+'\n'+'shards='+JSON.stringify(shards)+'\n'+'shard_count='+shards.length+'\n');
}
console.log(JSON.stringify({affected:affectedTargets.length,scope:result.scope}));
