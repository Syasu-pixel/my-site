// Capture the immutable base first, then compare the candidate in the same browser.
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import os from 'node:os';

const args = Object.fromEntries(process.argv.slice(2).map(s => { const i=s.indexOf('='); return [s.slice(0,i),s.slice(i+1)]; }));
const phase = args['--phase'];
if (!['baseline','compare'].includes(phase)) throw Error('Use --phase=baseline or --phase=compare');
const base = resolve(args['--root'] || '.');
const out = resolve(args['--out'] || '.visual-evidence');
const config = JSON.parse(await readFile(new URL('../.github/site-shell-visual.json', import.meta.url), 'utf8'));
const baseSha = config.baselineCommit;
if (!/^[a-f0-9]{40}$/.test(baseSha)) throw Error('Invalid pinned baseline');
const scope = args['--scope'] || 'all';
if (!['all','pilot'].includes(scope)) throw Error('Invalid scope');
const pages = [];
for (const dir of ['articles','en/articles']) for (const name of (await readdir(resolve(base,dir))).sort()) {
  if (name.endsWith('.html')) pages.push(`${dir}/${name}`);
}
const targets = scope === 'pilot' ? config.representatives : pages;
if (scope==='all' && pages.length!==config.articleCount) throw Error(`Article inventory changed: ${pages.length}; review config explicitly`);
const hash = value => createHash('sha256').update(value).digest('hex');
const manifestFile = resolve(out, 'baseline.json');
let baseline;
if (phase === 'baseline') {
  try { await stat(manifestFile); throw Error('Baseline exists; refusing overwrite. Choose a new run directory.'); }
  catch (e) { if(e.code!=='ENOENT') throw e; }
} else {
  baseline=JSON.parse(await readFile(manifestFile,'utf8'));
  if(baseline.baseSha!==baseSha || baseline.scope!==scope || JSON.stringify(baseline.targets)!==JSON.stringify(targets)) throw Error('Baseline provenance/coverage mismatch');
}
await mkdir(out,{recursive:true});
const errors=[]; const external=new Set();
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.jpg':'image/jpeg'};
const server=createServer(async(req,res)=>{
  try {
    let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'');
    if(!path || path.endsWith('/')) path+='index.html';
    const full=resolve(base,path);
    if(!full.startsWith(base+sep)) {res.writeHead(403).end();return;}
    const bytes=await readFile(full);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
  }catch {res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const environment={browser:browser.version(),platform:os.platform(),arch:os.arch(),node:process.version,viewports:config.viewports,pixelThreshold:0.1,includeAntialiasing:false,captureVersion:3,parallelContexts:4};
if(baseline && JSON.stringify(environment)!==JSON.stringify(baseline.environment)) throw Error('Baseline/candidate environments differ');
const images=[];const results=[];const htmlHashes={};const probes=[];
try {
  async function captureTarget(target) {
    const body=await readFile(resolve(base,target));htmlHashes[target]=hash(body);
    for(const [device,viewport] of Object.entries(config.viewports)) {
      const context=await browser.newContext({viewport,deviceScaleFactor:1,locale:target.startsWith('en/')?'en-US':'ja-JP',timezoneId:'Asia/Tokyo',reducedMotion:'reduce'});
      await context.route('**/*', route=>{
        const url=route.request().url();
        if(url.startsWith(origin+'/')||url.startsWith('data:'))return route.continue();
        external.add(url.split('?')[0]);return route.abort();
      });
      const page=await context.newPage();
      await page.addInitScript(()=>{const Original=Date;globalThis.Date=class extends Original {constructor(...a){super(...(a.length?a:['2026-09-18T00:00:00Z']));}static now(){return 1789689600000;}};});
      page.on('pageerror',error=>errors.push({target,device,error:error.message}));
      const response=await page.goto(`${origin}/${target}`,{waitUntil:'networkidle',timeout:60000});
      if(!response?.ok()) throw Error(`Render failed: ${target}`);
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}'});
      await page.evaluate(async()=>{
        await document.fonts.ready;
        for(const image of document.images)image.loading='eager';
        await Promise.all([...document.images].map(async image=>{
          if(!image.complete)await new Promise(done=>{image.addEventListener('load',done,{once:true});image.addEventListener('error',done,{once:true});setTimeout(done,5000);});
          await image.decode().catch(()=>{});
        }));
      });
      const key=target.replace(/\.html$/,'').replaceAll('/','__')+'--'+device;
      async function capture(region,fullPage=false){
        const rel=`${phase==='baseline'?'before':'after'}/${key}--${region}.png`;
        await mkdir(dirname(resolve(out,rel)),{recursive:true});
        const bytes=await page.screenshot({path:resolve(out,rel),fullPage,animations:'disabled'});
        images.push({target,device,region,path:rel,sha256:hash(bytes)});
        if(phase==='compare') {
          const beforePath=rel.replace(/^after\//,'before/');
          const recorded=baseline.images.find(x=>x.path===beforePath);
          const beforeBytes=await readFile(resolve(out,beforePath));
          if(!recorded || hash(beforeBytes)!==recorded.sha256) throw Error(`Baseline tampered: ${beforePath}`);
          const a=PNG.sync.read(beforeBytes),b=PNG.sync.read(bytes);
          const w=Math.max(a.width,b.width),h=Math.max(a.height,b.height),diff=new PNG({width:w,height:h});
          let pixels,exactPixels;
          if(a.width!==b.width||a.height!==b.height){pixels=w*h;exactPixels=pixels;diff.data.fill(255);}
          else {
            exactPixels=pixelmatch(a.data,b.data,null,w,h,{threshold:0,includeAA:true});
            pixels=pixelmatch(a.data,b.data,diff.data,w,h,{threshold:environment.pixelThreshold,includeAA:environment.includeAntialiasing});
          }
          const diffPath=`diff/${key}--${region}.png`;await mkdir(dirname(resolve(out,diffPath)),{recursive:true});
          await writeFile(resolve(out,diffPath),PNG.sync.write(diff));
          results.push({target,device,region,before:beforePath,after:rel,diff:diffPath,pixels,exactPixels,width:w,height:h});
        }
      }
      await capture('header');
      await page.locator('footer.site-footer').scrollIntoViewIfNeeded();
      await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
      await page.waitForTimeout(100);
      await capture('footer');
      if(config.representatives.includes(target)) {await page.evaluate(()=>window.scrollTo(0,0));await capture('full',true);}
      // Exercise existing controls without submitting forms or recording votes.
      const button=page.locator('.language-menu-button');
      let language=null;
      if(await button.count()===1){
        await page.evaluate(()=>window.scrollTo(0,0));
        if(await button.isVisible()){
          try{await button.click({timeout:3000});language=await button.getAttribute('aria-expanded');await page.keyboard.press('Escape');}
          catch(error){language='not-actionable';errors.push({target,device,error:'Existing language button is not actionable'});}
        }else language='hidden';
      }
      const links=await page.locator('header a,footer a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})));
      probes.push({target,device,languageOpened:language,links});
      await context.close();
    }
    console.log(`${phase}: ${target} (${images.length} images)`);
  }
  const queue=[...targets];
  await Promise.all(Array.from({length:environment.parallelContexts},async()=>{
    while(queue.length)await captureTarget(queue.shift());
  }));
}finally {await browser.close();await new Promise(r=>server.close(r));}
probes.sort((a,b)=>(a.target+a.device).localeCompare(b.target+b.device));
const common={baseSha,headSha:process.env.HEAD_SHA||'local',scope,targets,environment,images,htmlHashes,probes,errors,externalRequestsBlocked:[...external].sort()};
if(phase==='baseline') {
  await writeFile(manifestFile,JSON.stringify(common,null,2),{flag:'wx'});
  console.log(`Baseline saved: ${images.length} images. No overwrite permitted.`);
}else {
  const differences=results.filter(x=>x.pixels>0);
  const interactionChanged=JSON.stringify(probes)!==JSON.stringify(baseline.probes);
  const newErrors=errors.filter(x=>!baseline.errors.some(y=>JSON.stringify(y)===JSON.stringify(x)));
  const report={...common,results,differences: differences.length,interactionChanged,newErrors};
  await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  await writeFile(resolve(out,'index.html'),`<!doctype html><meta charset="utf-8"><title>Header/footer comparison</title><style>body{font:16px sans-serif;margin:24px}section{border-top:1px solid #999;padding:20px 0}figure{display:inline-block;width:30%;vertical-align:top;margin:1%}img{width:100%}summary{cursor:pointer}</style><h1>Header/footer comparison</h1><p>Base ${esc(baseSha)} / Head ${esc(common.headSha)}</p><p>${targets.length} pages; ${images.length} captures; ${differences.length} image differences. Before/after: same Chromium ${esc(environment.browser)}.</p><p>External requests are blocked identically; inspect report.json for existing console errors and excluded external resources. Do not treat this as a complete content/form/backend audit.</p>${results.map(r=>`<section><details ${r.pixels?'open':''}><summary>${esc(r.target)} — ${r.device} / ${r.region} — ${r.pixels} changed pixels</summary>${['before','after','diff'].map(k=>`<figure><figcaption>${k}</figcaption><a href="${r[k]}"><img loading="lazy" src="${r[k]}"></a></figure>`).join('')}</details></section>`).join('')}`);
  console.log(JSON.stringify({pages:targets.length,images:images.length,differences:differences.length,interactionChanged,newErrors:newErrors.length,differenceDetails:differences.map(({target,device,region,pixels,exactPixels,width,height})=>({target,device,region,pixels,exactPixels,width,height}))}));
  if(differences.length||interactionChanged||newErrors.length)process.exitCode=1;
}
