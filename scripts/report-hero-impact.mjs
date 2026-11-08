import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const out=process.argv[2];
if(!out)throw Error('Usage: node scripts/report-hero-impact.mjs <output.json>');
const manifest=JSON.parse(await readFile('.github/article-components/hero/manifest.json','utf8'));
const base=process.env.BASE_SHA;
if(!/^[a-f0-9]{40}$/.test(base||''))throw Error('BASE_SHA must be a 40-character commit SHA');
const changed=execFileSync('git',['diff','--name-only','--no-renames','-z',base,'HEAD'],{encoding:'utf8'}).split('\0').filter(Boolean);
const changedTargets=manifest.targets.filter(path=>changed.includes(path));
const shared=changed.some(path=>!manifest.targets.includes(path)&&!/^docs\/.+\.md$/.test(path));
const full=process.env.FULL_HERO_AUDIT==='1'||shared||changedTargets.length===0;
const affectedTargets=full?manifest.targets:changedTargets;
const shards=full?[0,1,2,3,4,5]:[0];
const result={base,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sharedChange:shared,changedFiles:changed,affectedTargets,unaffectedTargets:manifest.targets.length-affectedTargets.length,scope:full?'all':'selected',shards};
await writeFile(out,JSON.stringify(result,null,2)+'\n');
if(process.env.GITHUB_OUTPUT){
 const {appendFile}=await import('node:fs/promises');
 await appendFile(process.env.GITHUB_OUTPUT,'targets='+(full?'':affectedTargets.join(','))+'\n'+'shards='+JSON.stringify(shards)+'\n'+'shard_count='+shards.length+'\n');
}
console.log(JSON.stringify({affected:affectedTargets.length,scope:result.scope}));
