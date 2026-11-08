import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const out=process.argv[2];
if(!out)throw Error('Usage: node scripts/report-hero-impact.mjs <output.json>');
const manifest=JSON.parse(await readFile('.github/article-components/hero/manifest.json','utf8'));
const base=process.env.BASE_SHA;
if(!/^[a-f0-9]{40}$/.test(base||''))throw Error('BASE_SHA must be a 40-character commit SHA');
const changed=execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const shared=changed.some(p=>p.startsWith('.github/article-components/hero/')||p.startsWith('.github/site-shells/')||p.startsWith('scripts/build-integrated-review.')||p==='scripts/check-article-hero-browser.mjs');
const affected=shared?manifest.targets:manifest.targets.filter(p=>changed.includes(p)||changed.some(f=>f.startsWith('assets/images/')&&p.includes(f.split('/').at(-1).replace(/\.(png|jpe?g|webp)$/i,''))));
const result={base,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sharedChange:shared,changedFiles:changed,affectedTargets:affected,unaffectedTargets:manifest.targets.length-affected.length,decision:'INFORMATIONAL_ONLY',note:'This report does not override required all-site CI or validate unrelated CTA failures.'};
await writeFile(out,JSON.stringify(result,null,2)+'\n');
if(process.env.GITHUB_OUTPUT){const {appendFile}=await import('node:fs/promises');await appendFile(process.env.GITHUB_OUTPUT,'targets='+affected.join(',')+'\n'+'shards='+(shared?'[0,1,2,3,4,5]':'[0]')+'\n'+'shard_count='+(shared?'6':'1')+'\n');}
console.log(JSON.stringify({affected:affected.length,shared,decision:result.decision}));
