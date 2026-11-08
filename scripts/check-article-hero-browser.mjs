import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {checkHeroCta} from './article-hero-cta.mjs';
const out=resolve(process.argv[2]||'../hero-all-build');
const manifest=JSON.parse(await readFile('.github/article-components/hero/manifest.json','utf8'));
const count=Number(process.env.HERO_SHARD_COUNT||1),index=Number(process.env.HERO_SHARD_INDEX||0);
if(!Number.isInteger(count)||count<1||!Number.isInteger(index)||index<0||index>=count)throw Error('Invalid shard');
const requested=(process.env.HERO_TARGETS||'').split(',').map(s=>s.trim()).filter(Boolean);
const unknown=requested.filter(p=>!manifest.targets.includes(p));
if(unknown.length)throw Error('Unknown HERO_TARGETS: '+unknown.join(', '));
const selected=requested.length?manifest.targets.filter(p=>requested.includes(p)):manifest.targets;
const targets=selected.filter((_,i)=>i%count===index),origin='http://127.0.0.1:'+(process.env.HERO_REVIEW_PORT||18876);
const evidence=resolve(out,'hero-browser-'+index);await mkdir(evidence,{recursive:true});
const keep=new Set([...manifest.pilotTargets,...Object.keys(manifest.cssExceptions),...manifest.targets.filter(p=>manifest.pageVariants[p]==='design-series')]);
const browser=await chromium.launch({headless:true,args:['--disable-skia-runtime-opts','--disable-partial-raster','--run-all-compositor-stages-before-draw']}),results=[],actions=[],failures=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
function compare(a,b){const x=PNG.sync.read(a),y=PNG.sync.read(b);if(x.width!==y.width||x.height!==y.height)throw Error('Image dimensions differ');let rawPixels=0,maxChannelDelta=0;for(let i=0;i<x.data.length;i+=4){const delta=Math.max(...[0,1,2,3].map(c=>Math.abs(x.data[i+c]-y.data[i+c])));if(delta)rawPixels++;maxChannelDelta=Math.max(maxChannelDelta,delta);}return {pixels:rawPixels,rawPixels,maxChannelDelta};}
async function stableScreenshot(target){let previous;for(let n=0;n<6;n++){const shot=await target.screenshot({animations:'disabled',timeout:15000});if(previous&&compare(previous,shot).pixels===0)return shot;previous=shot;}throw Error('Screenshot did not stabilize');}
async function ready(page){
 await page.mouse.move(0,0);
 await page.evaluate(()=>scrollTo(0,0));
 await page.evaluate(async()=>{
  async function bounded(promise,label){
   let timer;
   try{
    return await Promise.race([promise,new Promise((_,reject)=>{
     timer=setTimeout(()=>reject(Error('Timed out preparing '+label)),10000);
    })]);
   }finally{clearTimeout(timer);}
  }
  await bounded(document.fonts.ready,'fonts');
  const visible=[...document.images].filter(image=>{
   const rect=image.getBoundingClientRect();
   return rect.width>0&&rect.height>0&&rect.bottom>0&&rect.top<innerHeight;
  });
  await bounded(Promise.all(visible.map(image=>image.decode().catch(()=>{}))),'viewport images');
  const bg=getComputedStyle(document.querySelector('.article-hero'),'::before').backgroundImage;
  await bounded(Promise.all([...bg.matchAll(/url\(["']?(.*?)["']?\)/g)].map(match=>new Promise(resolve=>{
   const image=new Image();
   image.onload=image.onerror=resolve;
   image.src=match[1];
  }))),'Hero background');
 });
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}'});
}
async function measure(page){return page.evaluate(()=>{const normalize=s=>s.replaceAll(location.origin+'/before/',location.origin+'/').replaceAll(location.origin+'/after/',location.origin+'/');const h=document.querySelector('.article-hero'),metric=(e,pseudo)=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e,pseudo);return {tag:e.tagName,cls:e.className,rect:[r.x,r.y,r.width,r.height],css:Object.fromEntries([...s].map(k=>[k,normalize(s.getPropertyValue(k))]))}};return {hero:h.outerHTML,headerBottom:document.querySelector('header').getBoundingClientRect().bottom,elements:[h,...h.querySelectorAll('*')].map(e=>metric(e)),pseudo:['::before','::after'].map(p=>metric(h,p)),documentWidth:document.documentElement.scrollWidth,links:[...h.querySelectorAll('.hero-actions a')].map(a=>({href:a.getAttribute('href'),destination:normalize(a.href).slice(location.origin.length),text:a.textContent,idExists:a.hash?!!document.getElementById(decodeURIComponent(a.hash.slice(1))):null}))};});}
try{for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},locale:'ja-JP',timezoneId:'Asia/Tokyo',reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route('**/*',r=>r.request().url().startsWith(origin+'/')||r.request().url().startsWith('data:')?r.continue():r.abort());
 // Use one renderer process for both versions; avoid cross-tab raster variance.
 const before=await context.newPage(),after=before;
 for(const path of targets){let shots={},stage='start';try{
  const measurements={};
  for(const [mode,page] of [['before',before],['after',after]]){
   stage=mode+' navigation';
   await page.goto(origin+'/'+mode+'/'+path,{waitUntil:'networkidle'});
   stage=mode+' resource readiness';
   await ready(page);measurements[mode]=await measure(page);
   stage=mode+' screenshots';
   shots[mode+'Top']=await stableScreenshot(page);shots[mode+'Hero']=await stableScreenshot(page.locator('.article-hero'));
   if(width===390){stage=mode+' CTA';const links=measurements[mode].links;for(let n=0;n<links.length;n++){
    if(page.url().split('#')[0]!==origin+'/'+mode+'/'+path){await page.goto(origin+'/'+mode+'/'+path,{waitUntil:'networkidle'});await ready(page);}
    const state=await checkHeroCta(page,page.locator('.hero-actions a').nth(n),links[n].destination);
    actions.push({path,mode,n,...state});
   }}
  }
  const top=compare(shots.beforeTop,shots.afterTop),hero=compare(shots.beforeHero,shots.afterHero),topPixels=top.pixels,heroPixels=hero.pixels,metricsExact=JSON.stringify(measurements.before)===JSON.stringify(measurements.after);
  const maxChannelDelta=Math.max(top.maxChannelDelta,hero.maxChannelDelta);
  if(maxChannelDelta>1||!metricsExact)throw Error('Hero display changed: '+JSON.stringify({top,hero,metricsExact}));
  const rasterWarning=maxChannelDelta===1;
  if(rasterWarning)console.log('RASTER_WARNING',JSON.stringify({path,width,topPixels,heroPixels,maxChannelDelta}));
  const files={};if(keep.has(path)||rasterWarning)for(const [part,data] of Object.entries(shots)){const name=path.replaceAll('/','__')+'--'+width+'--'+part+'.png';await writeFile(resolve(evidence,name),data);files[part]=name;}
  results.push({path,variant:manifest.pageVariants[path],width,height:1000,topPixels,heroPixels,topRawPixels:top.rawPixels,heroRawPixels:hero.rawPixels,maxChannelDelta,metricsExact,rasterWarning,ctaCount:measurements.after.links.length,ctaTargets:measurements.after.links,hashes:Object.fromEntries(Object.entries(shots).map(([k,v])=>[k,hash(v)])),files});
 }catch(error){
  // Diagnostic A/A and B/B controls never turn an A/B failure into a pass.
  console.log('CASE_ERROR',JSON.stringify({path,width,stage,error:error.message}));
  const repeat={};
  try{for(const mode of ['before','after']){
   const pairs=[];for(let n=0;n<2;n++){await before.goto(origin+'/'+mode+'/'+path,{waitUntil:'networkidle'});await ready(before);const top=await before.screenshot({animations:'disabled',timeout:15000}),hero=await before.locator('.article-hero').screenshot({animations:'disabled',timeout:15000});pairs.push({top,hero});shots[mode+'Repeat'+n+'Top']=top;shots[mode+'Repeat'+n+'Hero']=hero;}
   repeat[mode]={top:compare(pairs[0].top,pairs[1].top),hero:compare(pairs[0].hero,pairs[1].hero)};
  }}catch(diagnosticError){repeat.error=diagnosticError.message;}
  failures.push({path,width,stage,error:error.message,repeat,triage:'BLOCK_OR_INVESTIGATE'});console.log('DIAGNOSTIC',JSON.stringify(failures.at(-1)));for(const [part,data] of Object.entries(shots))await writeFile(resolve(evidence,path.replaceAll('/','__')+'--'+width+'--failure-'+part+'.png'),data);}
 console.log(path,width,failures.at(-1)?.path===path&&failures.at(-1)?.width===width?'FAIL':'PASS');
 }
 await context.close();
}}finally{await browser.close();}
await writeFile(resolve(out,'hero-browser-shard-'+index+'.json'),JSON.stringify({index,count,targets,results,actions,failures,productionPublished:false,realDeviceSafari:false},null,2));
console.log(JSON.stringify({cases:results.length,ctaClicks:actions.length,failures:failures.length}));if(failures.length)process.exitCode=1;
