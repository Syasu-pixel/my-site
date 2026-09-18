import {readFile,writeFile} from 'node:fs/promises';import {resolve} from 'node:path';
const out=resolve(process.argv[2]),count=Number(process.argv[3]);
const manifest=JSON.parse(await readFile('.github/article-components/hero/manifest.json','utf8')),results=[],actions=[],coverage=new Set();
for(let index=0;index<count;index++){
 const part=JSON.parse(await readFile(resolve(out,'hero-browser-shard-'+index+'.json'),'utf8'));
 const expected=manifest.targets.filter((_,i)=>i%count===index);
 if(part.index!==index||part.count!==count||JSON.stringify(part.targets)!==JSON.stringify(expected)||part.failures.length)throw Error('Incomplete/failed hero shard');
 for(const row of part.results){const key=row.path+'@'+row.width;if(coverage.has(key)||!expected.includes(row.path)||![320,390,768,1440].includes(row.width)||row.topPixels||row.heroPixels||!row.metricsExact)throw Error('Invalid hero result');coverage.add(key);results.push(row);}
 actions.push(...part.actions);
}
for(const path of manifest.targets)for(const width of [320,390,768,1440])if(!coverage.has(path+'@'+width))throw Error('Missing hero case');
for(const row of results.filter(r=>r.width===390))for(const mode of ['before','after'])for(let n=0;n<row.ctaCount;n++){
 const found=actions.filter(a=>a.path===row.path&&a.mode===mode&&a.n===n);if(found.length!==1||!found[0].targetExists||found[0].destination!==row.ctaTargets[n].destination)throw Error('Missing/duplicate CTA check');
}
const expectedActions=results.filter(r=>r.width===390).reduce((n,r)=>n+r.ctaCount*2,0);if(actions.length!==expectedActions)throw Error('Unexpected CTA results');
const summary={status:'passed',articles:manifest.targets.length,viewportPairs:results.length,comparedImagePairs:results.length*2,ctaClicks:actions.length,topAndCompleteHeroPixelDifferences:0,metricsDifferences:0,cssExceptions:manifest.cssExceptions,variants:manifest.variants,results,actions,productionPublished:false};
await writeFile(resolve(out,'hero-browser-complete.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({articles:summary.articles,viewportPairs:summary.viewportPairs,comparedImagePairs:summary.comparedImagePairs,ctaClicks:summary.ctaClicks,status:'passed'}));
