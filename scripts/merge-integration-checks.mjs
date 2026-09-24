import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';import {resolve} from 'node:path';
const out=resolve(process.argv[2]||'../integration-build'),config=JSON.parse(await readFile('.github/article-components/integration.json','utf8')),targets=config.targets||config.representatives,shards=Number(process.argv[3]||6),reports=[];
for(let i=0;i<shards;i++){const r=JSON.parse(await readFile(resolve(out,'browser-checks-shard-'+i+'.json'),'utf8'));if(r.shardIndex!==i||r.shardCount!==shards)throw Error('Shard identity mismatch');reports.push(r);}
const targetsSeen=reports.flatMap(r=>r.targets),results=reports.flatMap(r=>r.results),votes=reports.flatMap(r=>r.votes),images=reports.flatMap(r=>r.images),failures=reports.flatMap(r=>r.failures);
if(targetsSeen.length!==targets.length||new Set(targetsSeen).size!==targets.length||targets.some(p=>!targetsSeen.includes(p)))throw Error('Incomplete or duplicated article coverage');
const pairs=new Set(results.map(r=>r.path+'|'+r.width));if(pairs.size!==results.length)throw Error('Duplicated layout case');
if(images.length!==targets.length*14+6||new Set(images.map(i=>i.file)).size!==images.length)throw Error('Incomplete or duplicated screenshot evidence');
for(const p of targets)for(const width of (config.representatives.includes(p)?[320,390,768,1024,1440]:[390,768,1440]))if(!pairs.has(p+'|'+width))failures.push({path:p,width,error:'Missing layout case'});
for(const p of targets.filter(p=>!p.startsWith('en/')))if(!votes.some(v=>v.path===p&&v.mode==='success/reload'))failures.push({path:p,error:'Missing isolated vote case'});
for(const mode of ['duplicate','error','no-storage'])if(!votes.some(v=>v.mode===mode))failures.push({mode,error:'Missing vote edge case'});
for(const width of [390,768,1440])if(!pairs.has('services/gxworks2-online-support.html|'+width))failures.push({width,error:'Missing dedicated service case'});
for(const name of ['boundary-checks.json','risk-checks.json']){const r=JSON.parse(await readFile(resolve(out,name),'utf8'));failures.push(...r.failures);}
const staticAudit=JSON.parse(await readFile(resolve(out,'link-resource-audit.json'),'utf8'));if(staticAudit.introduced.length)failures.push({error:'New link/resource issues'});
const regeneration=JSON.parse(await readFile(resolve(out,'regeneration-checks.json'),'utf8'));if(regeneration.status!=='passed')failures.push({error:'Regeneration failure'});
await mkdir(resolve(out,'evidence'),{recursive:true});for(const r of reports)for(const img of r.images)await copyFile(resolve(out,'evidence-shard-'+r.shardIndex,img.file),resolve(out,'evidence',img.file));
await writeFile(resolve(out,'browser-checks.json'),JSON.stringify({targets,results,votes,images,failures,externalVotesSent:0,productionPublished:false},null,2));
if(failures.length)throw Error('Incomplete/failed full integration checks: '+JSON.stringify(failures));
const ledger=JSON.parse(await readFile(resolve(out,'coverage-ledger.json'),'utf8'));
for(const p of ledger.pages){if(targets.includes(p.path)){p.state=p.state.replace('・画面検査待ち','・画面検査済み');p.verifiedWidths=config.representatives.includes(p.path)?[320,390,768,1024,1440]:[390,768,1440];p.verification='本文/SEO/リンク等の保全、ローカル資源、ブラウザ操作を検査済み';}}
ledger.counts={};for(const p of ledger.pages)ledger.counts[p.state]=(ledger.counts[p.state]||0)+1;ledger.browserVerifiedArticles=targets.length;
await writeFile(resolve(out,'coverage-ledger.json'),JSON.stringify(ledger,null,2));const cols=['path','article','state','kind','strategy','productionApplied','verification','verifiedWidths'];const quote=x=>'"'+String(x??'').replaceAll('"','""')+'"';await writeFile(resolve(out,'coverage-ledger.csv'),'\ufeff'+cols.join(',')+'\n'+ledger.pages.map(p=>cols.map(k=>quote(p[k])).join(',')).join('\n')+'\n');
console.log(JSON.stringify({articles:targets.length,layoutCases:results.length,voteCases:votes.length,images:images.length,failures:0}));
