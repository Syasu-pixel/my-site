import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {PNG} from 'pngjs';
const out=resolve(process.argv[2]),origin='http://127.0.0.1:'+(process.env.HERO_REVIEW_PORT||18876);
const modes={default:[],fixed:['--disable-skia-runtime-opts','--disable-partial-raster','--run-all-compositor-stages-before-draw']};
const rows=[];
function difference(a,b){const x=PNG.sync.read(a),y=PNG.sync.read(b);if(x.width!==y.width||x.height!==y.height)throw Error('Probe dimensions differ');let pixels=0,maxDelta=0;for(let n=0;n<x.data.length;n+=4){const d=Math.max(...[0,1,2,3].map(c=>Math.abs(x.data[n+c]-y.data[n+c])));pixels+=Number(d>0);maxDelta=Math.max(maxDelta,d);}return {pixels,maxDelta};}
for(const [mode,args] of Object.entries(modes)){
 const browser=await chromium.launch({headless:true,args});
 try{for(const width of [320,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},locale:'ja-JP',timezoneId:'Asia/Tokyo',reducedMotion:'reduce',serviceWorkers:'block'});
  await context.route('**/*',r=>r.request().url().startsWith(origin+'/')||r.request().url().startsWith('data:')?r.continue():r.abort());
  const page=await context.newPage();
  for(const path of ['articles/crimping-hydraulic-vs-electric.html','articles/flicker-circuit-basic.html','articles/noise-filter-basic.html']){
   let baseline;
   for(let repeat=0;repeat<6;repeat++){
    await page.goto(origin+'/before/'+path,{waitUntil:'networkidle'});await page.mouse.move(0,0);
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight).map(i=>i.decode().catch(()=>{})));});
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}'});
    const shot=await page.screenshot({animations:'disabled'});
    if(baseline)rows.push({mode,width,path,repeat,...difference(baseline,shot)});else baseline=shot;
   }
  }
  await context.close();
 }}finally{await browser.close();}
}
await mkdir(out,{recursive:true});
const summary={modes,rows,defaultUnstablePairs:rows.filter(r=>r.mode==='default'&&r.pixels).length,fixedUnstablePairs:rows.filter(r=>r.mode==='fixed'&&r.pixels).length,pixelTolerance:0};
await writeFile(resolve(out,'hero-raster-control.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
if(summary.fixedUnstablePairs)throw Error('Fixed renderer still varies on identical input');
