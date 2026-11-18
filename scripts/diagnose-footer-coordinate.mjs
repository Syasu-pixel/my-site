// Temporary diagnostic only. Do not merge. Never changes the official visual gate.
import {chromium} from 'playwright';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {capturePhaseStableFooter,shellContract} from './site-shell-phase.mjs';
const slug=process.env.DIAGNOSTIC_SLUG;
if(!['crimping-tips','home-return-circuit-basic'].includes(slug))throw Error('Unapproved diagnostic target');
const roots={A:resolve('.diagnostic-base'),B:resolve('.diagnostic-head')};
const out=resolve('.coordinate-evidence');await mkdir(out,{recursive:true});
const servers={},origins={};
for(const side of ['A','B']){
 const server=createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://localhost'),file=resolve(roots[side],decodeURIComponent(url.pathname.slice(1)));
  if(!file.startsWith(roots[side]+'/'))throw Error('Outside root');
  const bytes=await readFile(file);res.writeHead(200,{'Content-Type':({'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'})[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404).end();}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));servers[side]=server;origins[side]='http://127.0.0.1:'+server.address().port;
}
const report={diagnosticOnly:true,base:'d05ba287b0d273e89976638e651d56de55063b1f',head:process.env.DIAGNOSTIC_HEAD,slug,captures:[],comparisons:[]};
const browser=await chromium.launch();report.browser=browser.version();
async function metrics(page){return page.locator('footer.site-footer').evaluate(e=>{const r=e.getBoundingClientRect(),w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),texts=[];let n;while(n=w.nextNode()){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);texts.push({text:n.textContent,rects:[...range.getClientRects()].map(x=>({x:x.x-r.x,y:x.y-r.y,width:x.width,height:x.height}))});}return{documentY:r.y+scrollY,viewportY:r.y,scrollY,width:r.width,height:r.height,fontsStatus:document.fonts.status,texts};});}
try{
 // Fresh contexts, and reversed A/B order: repeatability versus renderer/cache order.
 for(const order of [['A','B'],['B','A']])for(const side of order)for(const experiment of ['natural','common-origin']){
  const origin=origins[side];const repeat=order[0]==='A'?1:2,name=`${side}-${repeat}-${experiment}`;
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,locale:'ja-JP',timezoneId:'Asia/Tokyo',reducedMotion:'reduce'});
  await context.route('**/*',r=>r.request().url().startsWith(origin+'/')||r.request().url().startsWith('data:')?r.continue():r.abort());
  const page=await context.newPage();await page.addInitScript(()=>{const D=Date;globalThis.Date=class extends D{constructor(...a){super(...(a.length?a:['2026-09-18T00:00:00Z']))}static now(){return 1789689600000;}}});
  const response=await page.goto(`${origin}/articles/${slug}.html`,{waitUntil:'networkidle',timeout:60000});if(!response?.ok())throw Error('Diagnostic page unavailable');
  // Match the official visual runner preparation exactly.
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}'});
  await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(async image=>{if(!image.complete)await new Promise(done=>{image.addEventListener('load',done,{once:true});image.addEventListener('error',done,{once:true});setTimeout(done,5000);});await image.decode().catch(()=>{});}));});
  await page.locator('header.site-header').screenshot({animations:'disabled'});
  await page.locator('footer.site-footer').scrollIntoViewIfNeeded();
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(100);
  const original=await shellContract(page,'footer.site-footer'),before=await metrics(page),entry={name,side,repeat,experiment,before};
  // CDP reports actual fonts, not just declared CSS font-family.
  const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument');const {nodeIds}=await cdp.send('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'footer.site-footer,footer.site-footer *'});
  entry.platformFonts=[];for(const nodeId of nodeIds){const {node}=await cdp.send('DOM.describeNode',{nodeId});entry.platformFonts.push({tag:node.nodeName,fonts:(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts});}
  entry.originalBodyStyle=await page.locator('body').getAttribute('style');
  let saved;
  try{
   if(experiment==='common-origin')saved=await page.evaluate(()=>{const b=document.body,r=document.querySelector('footer.site-footer').getBoundingClientRect(),y=r.y+scrollY,target=32768;if(y>target)throw Error('Diagnostic origin too small');const style=b.getAttribute('style');b.style.setProperty('padding-top',`${parseFloat(getComputedStyle(b).paddingTop)+target-y}px`,'important');return style;});
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);entry.captureGeometry=await metrics(page);if(experiment==='common-origin'&&Math.abs(entry.captureGeometry.documentY-32768)>1e-6)throw Error('Common document origin not reached');
   await page.locator('footer.site-footer').screenshot({path:resolve(out,name+'-raw.png'),animations:'disabled'});
   const phase=await capturePhaseStableFooter(page,{path:resolve(out,name+'-phase.png')});entry.phase={translationY:phase.translationY,contract:phase.contract,eligibility:phase.eligibility,hash:createHash('sha256').update(phase.bytes).digest('hex')};
  }catch(error){entry.diagnosticError=String(error.message);}
  finally{if(experiment==='common-origin'&&saved!==undefined)await page.evaluate(s=>s===null?document.body.removeAttribute('style'):document.body.setAttribute('style',s),saved);await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);entry.restored=JSON.stringify(original)===JSON.stringify(await shellContract(page,'footer.site-footer'))&&entry.originalBodyStyle===await page.locator('body').getAttribute('style');}
  report.captures.push(entry);await context.close();
 }
 for(const experiment of ['natural','common-origin'])for(const [a,b]of [['A-1','A-2'],['B-1','B-2'],['A-1','B-1'],['A-2','B-2']]){
  const names=[a+'-'+experiment,b+'-'+experiment],entries=names.map(n=>report.captures.find(e=>e.name===n));
  const comparison={experiment,a,b};if(entries.some(e=>!e.phase)){comparison.unavailable=true;report.comparisons.push(comparison);continue;}
  const [x,y]=await Promise.all(names.map(async n=>PNG.sync.read(await readFile(resolve(out,n+'-phase.png')))));
  comparison.sameDimensions=x.width===y.width&&x.height===y.height;comparison.rawContractEqual=JSON.stringify(entries[0].phase.contract)===JSON.stringify(entries[1].phase.contract);const normalize=c=>{const copy=structuredClone(c);if(experiment==='common-origin')for(const a of copy.ancestors)if(a.tag==='BODY'){delete a.styles['padding-top'];delete a.styles['padding-block-start'];}return copy;};comparison.diagnosticContractEqual=JSON.stringify(normalize(entries[0].phase.contract))===JSON.stringify(normalize(entries[1].phase.contract));
  if(comparison.sameDimensions){const diff=new PNG({width:x.width,height:x.height});comparison.pixels=pixelmatch(x.data,y.data,diff.data,x.width,x.height,{threshold:.1,includeAA:false});comparison.exactPixels=0;for(let i=0;i<x.data.length;i+=4)if(x.data.slice(i,i+4).some((v,j)=>v!==y.data[i+j]))comparison.exactPixels++;await writeFile(resolve(out,a+'-'+b+'-'+experiment+'-diff.png'),PNG.sync.write(diff));}
  report.comparisons.push(comparison);
 }
}finally{await browser.close();Object.values(servers).forEach(s=>s.close());await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({diagnosticOnly:true,comparisons:report.comparisons,errors:report.captures.filter(e=>e.diagnosticError).map(e=>({name:e.name,error:e.diagnosticError})),restorationPassed:report.captures.every(e=>e.restored)}));
if(!report.captures.every(e=>e.restored)||report.captures.some(e=>e.diagnosticError))process.exitCode=1;
