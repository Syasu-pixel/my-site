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
const server=createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');let side=url.pathname.split('/')[1],name=decodeURIComponent(url.pathname.split('/').slice(2).join('/'));
 if(!roots[side]){side=new URL(req.headers.referer||'http://localhost').pathname.split('/')[1];name=decodeURIComponent(url.pathname.slice(1));}
 if(!roots[side])throw Error('Unknown root');const file=resolve(roots[side],name);if(!file.startsWith(roots[side]+'/'))throw Error('Outside root');
 const bytes=await readFile(file);res.writeHead(200,{'Content-Type':({'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'})[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const report={diagnosticOnly:true,base:'d05ba287b0d273e89976638e651d56de55063b1f',head:process.env.DIAGNOSTIC_HEAD,slug,captures:[],comparisons:[]};
const browser=await chromium.launch();report.browser=browser.version();
async function metrics(page){return page.locator('footer.site-footer').evaluate(e=>{const r=e.getBoundingClientRect(),w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),texts=[];let n;while(n=w.nextNode()){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);texts.push({text:n.textContent,rects:[...range.getClientRects()].map(x=>({x:x.x-r.x,y:x.y-r.y,width:x.width,height:x.height}))});}return{documentY:r.y+scrollY,viewportY:r.y,scrollY,width:r.width,height:r.height,fontsStatus:document.fonts.status,texts};});}
try{
 // Fresh contexts, and reversed A/B order: repeatability versus renderer/cache order.
 for(const order of [['A','B'],['B','A']])for(const side of order)for(const experiment of ['natural','common-origin']){
  const repeat=order[0]==='A'?1:2,name=`${side}-${repeat}-${experiment}`;
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,locale:'ja-JP',timezoneId:'Asia/Tokyo',reducedMotion:'reduce'});
  await context.route('**/*',r=>r.request().url().startsWith(origin+'/')||r.request().url().startsWith('data:')?r.continue():r.abort());
  const page=await context.newPage();await page.addInitScript(()=>{const D=Date;globalThis.Date=class extends D{constructor(...a){super(...(a.length?a:['2026-09-18T00:00:00Z']))}static now(){return 1789689600000;}}});
  await page.goto(`${origin}/${side}/articles/${slug}.html`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);
  const original=await shellContract(page,'footer.site-footer'),before=await metrics(page),entry={name,side,repeat,experiment,before};
  // CDP reports actual fonts, not just declared CSS font-family.
  const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');const {root}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'footer.site-footer'});await cdp.send('CSS.enable');entry.platformFonts=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;
  let saved;
  try{
   if(experiment==='common-origin')saved=await page.evaluate(()=>{const b=document.body,r=document.querySelector('footer.site-footer').getBoundingClientRect(),y=r.y+scrollY,target=32768;if(y>target)throw Error('Diagnostic origin too small');const style=b.getAttribute('style');b.style.setProperty('padding-top',`${parseFloat(getComputedStyle(b).paddingTop)+target-y}px`,'important');return style;});
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);entry.captureGeometry=await metrics(page);
   await page.locator('footer.site-footer').screenshot({path:resolve(out,name+'-raw.png'),animations:'disabled'});
   const phase=await capturePhaseStableFooter(page,{path:resolve(out,name+'-phase.png')});entry.phase={translationY:phase.translationY,contract:phase.contract,eligibility:phase.eligibility,hash:createHash('sha256').update(phase.bytes).digest('hex')};
  }catch(error){entry.diagnosticError=String(error.message);}
  finally{if(experiment==='common-origin'&&saved!==undefined)await page.evaluate(s=>s===null?document.body.removeAttribute('style'):document.body.setAttribute('style',s),saved);await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);entry.restored=JSON.stringify(original)===JSON.stringify(await shellContract(page,'footer.site-footer'));}
  report.captures.push(entry);await context.close();
 }
 for(const experiment of ['natural','common-origin'])for(const [a,b]of [['A-1','A-2'],['B-1','B-2'],['A-1','B-1'],['A-2','B-2']]){
  const names=[a+'-'+experiment,b+'-'+experiment],entries=names.map(n=>report.captures.find(e=>e.name===n));
  const comparison={experiment,a,b};if(entries.some(e=>!e.phase)){comparison.unavailable=true;report.comparisons.push(comparison);continue;}
  const [x,y]=await Promise.all(names.map(async n=>PNG.sync.read(await readFile(resolve(out,n+'-phase.png')))));
  comparison.sameDimensions=x.width===y.width&&x.height===y.height;comparison.contractEqual=JSON.stringify(entries[0].phase.contract)===JSON.stringify(entries[1].phase.contract);
  if(comparison.sameDimensions){const diff=new PNG({width:x.width,height:x.height});comparison.pixels=pixelmatch(x.data,y.data,diff.data,x.width,x.height,{threshold:.1,includeAA:false});comparison.exactPixels=0;for(let i=0;i<x.data.length;i+=4)if(x.data.slice(i,i+4).some((v,j)=>v!==y.data[i+j]))comparison.exactPixels++;await writeFile(resolve(out,a+'-'+b+'-'+experiment+'-diff.png'),PNG.sync.write(diff));}
  report.comparisons.push(comparison);
 }
}finally{await browser.close();server.close();await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({diagnosticOnly:true,comparisons:report.comparisons,errors:report.captures.filter(e=>e.diagnosticError).map(e=>({name:e.name,error:e.diagnosticError})),restorationPassed:report.captures.every(e=>e.restored)}));
if(!report.captures.every(e=>e.restored)||report.captures.some(e=>e.diagnosticError))process.exitCode=1;
