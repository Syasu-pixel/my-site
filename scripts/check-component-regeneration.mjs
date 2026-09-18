// Mutate isolated copies only. Prove exactly which pages a shared edit reaches.
import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {resolve,dirname,basename} from 'node:path';
import Eleventy from '@11ty/eleventy';
import {root,renderShells} from './build-site-shells.mjs';
const out=resolve(process.argv[2]||'../integration-build'),fixture=resolve(out,'regeneration-fixture-v2');
const config=JSON.parse(await readFile(resolve(root,'.github/article-components/integration.json'),'utf8')),targets=config.targets||config.representatives;
await mkdir(fixture,{recursive:true});
const marker=' data-regeneration-probe="review-only"';
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};const checks=[];
// The existing footer variants deliberately reach only their registered pages.
await cp(resolve(root,'.github/site-shells'),resolve(fixture,'.github/site-shells'),{recursive:true,filter:source=>!source.startsWith(resolve(root,'.github/site-shells/ui-proposal'))});
for(const path of targets){await mkdir(dirname(resolve(fixture,path)),{recursive:true});await cp(resolve(root,path),resolve(fixture,path));}
const manifest=JSON.parse(await readFile(resolve(fixture,'.github/site-shells/manifest.json'),'utf8'));
const counts=new Map();for(const p of manifest.pages)counts.set(p.footerTemplate,(counts.get(p.footerTemplate)||0)+1);
const template=[...counts].sort((a,b)=>b[1]-a[1])[0][0],footerPath=resolve(fixture,'.github/site-shells',template);
const originalFooter=await readFile(footerPath,'utf8');await writeFile(footerPath,originalFooter.replace('<footer','<footer'+marker));
const footers=await renderShells(fixture);let changed=0,untouched=0;
for(const p of manifest.pages){const source=await readFile(resolve(root,p.output),'utf8'),generated=footers.results.get(p.output).toString('utf8');if(p.footerTemplate===template){assert(generated.includes(marker),'Footer edit not propagated');assert(generated.replace(marker,'')===source,'Footer edit changed unrelated content');changed++;}else{assert(generated===source,'Footer edit escaped its registered group');untouched++;}}
checks.push({component:'registered-footer-variant',template,expected:counts.get(template),changed,untouched});
// Header proposal uses one shared header and retains per-page language and links.
const headerOriginal=resolve(root,'.github/site-shells/ui-proposal'),headerFixture=resolve(fixture,'header');await cp(headerOriginal,headerFixture,{recursive:true});
const hp=resolve(headerFixture,'header.njk');await writeFile(hp,(await readFile(hp,'utf8')).replace('<header','<header'+marker));
const proposals=JSON.parse(await readFile(resolve(out,'headers/proposal.json'),'utf8')).pages;
async function render(input,dataName,data){const previous=process.cwd();try{process.chdir(dirname(input));const e=new Eleventy(basename(input),resolve(fixture,'.unused-render'),{configPath:false,quietMode:true,config:c=>{c.addGlobalData(dataName,data);c.setNunjucksEnvironmentOptions({throwOnUndefined:true,autoescape:true});}});return await e.toJSON();}finally{process.chdir(previous);}}
const headerBase=await render(resolve(headerOriginal,'preview.njk'),'proposals',proposals),headerChanged=await render(resolve(headerFixture,'preview.njk'),'proposals',proposals);const hb=new Map(headerBase.map(x=>{const p=JSON.parse(x.content);return[p.output,p.header]}));
for(const x of headerChanged){const p=JSON.parse(x.content);assert(p.header.includes(marker)&&p.header.replace(marker,'')===hb.get(p.output),'Header propagation changed wrong content');}
assert(headerChanged.length===targets.length,'Header target count');checks.push({component:'shared-header',expected:targets.length,changed:headerChanged.length});
// Shared related/feedback templates render from the latest prepared page data.
const endOriginal=resolve(root,'.github/article-components/end'),endFixture=resolve(fixture,'end');await cp(endOriginal,endFixture,{recursive:true});
const data=JSON.parse(await readFile(resolve(out,'pages.json'),'utf8')),before=await render(resolve(endOriginal,'page.njk'),'integratedPages',data),bm=new Map(before.map(x=>[x.url,x.content]));
const rp=resolve(endFixture,'components/related.njk');await writeFile(rp,(await readFile(rp,'utf8')).replace('<div','<div'+marker));
const related=await render(resolve(endFixture,'page.njk'),'integratedPages',data);
for(const x of related)assert(x.content.includes(marker)&&x.content.replace(marker,'')===bm.get(x.url),'Related edit changed unrelated data');
checks.push({component:'shared-related-card-grid',expected:targets.length,changed:related.length});
await cp(resolve(endOriginal,'components/related.njk'),rp);
const fp=resolve(endFixture,'components/feedback.njk');await writeFile(fp,(await readFile(fp,'utf8')).replace('<section','<section'+marker));
const feedback=await render(resolve(endFixture,'page.njk'),'integratedPages',data);let ja=0,en=0;
for(const x of feedback){if(x.url.startsWith('/en/')){assert(x.content===bm.get(x.url),'Feedback propagated to English');en++;}else{assert(x.content.includes(marker)&&x.content.replace(marker,'')===bm.get(x.url),'Feedback edit changed unrelated content');ja++;}}
assert(ja===targets.filter(p=>!p.startsWith('en/')).length&&en===targets.filter(p=>p.startsWith('en/')).length,'Feedback language count');checks.push({component:'shared-feedback',expected:ja,changed:ja,englishUntouched:en});
await writeFile(resolve(out,'regeneration-checks.json'),JSON.stringify({status:'passed',sourceModified:false,fixtureOnly:true,checks},null,2));console.log(JSON.stringify({regenerationChecks:checks}));
