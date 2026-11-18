import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
import {mkdir,writeFile} from 'node:fs/promises';
import {capturePhaseStableFooter} from '../scripts/site-shell-phase.mjs';
const browser=await chromium.launch({headless:true});
const html=(height,extra='')=>`<!doctype html><style>body{margin:0}main{height:${height}px}footer{padding:30px 20px;background:#f4f4f4;color:#333;font:17px/1.3 Arial;border-top:1px solid #ddd}p{margin:0 0 12px}a{color:#247} ${extra}</style><main></main><footer class="site-footer"><p>Footer contract 日本語の確認</p><a href="/profile/">About this site</a><p>Affiliate disclosure and policy</p></footer>`;
function pixels(a,b){a=PNG.sync.read(a);b=PNG.sync.read(b);if(a.width!==b.width||a.height!==b.height)return Infinity;return pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0.1,includeAA:false});}
for(const width of [390,1440]) test(`phase stabilization ${width}px keeps page-length-only changes and rejects real defects`,async()=>{
 const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
 async function capture(height,css='',mutate){
   await page.setContent(html(height,css));await page.evaluate(()=>document.fonts.ready);
   if(mutate)await page.evaluate(mutate);
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
   const raw=await page.locator('footer').screenshot();
   const stable=await capturePhaseStableFooter(page);
   return {raw,...stable};
 }
 const before=await capture(8219.8125),after=await capture(6809.5);
 await mkdir('.visual-phase-tests',{recursive:true});
 for(const [label,c] of [['before',before],['after',after]]){await writeFile(`.visual-phase-tests/${width}-${label}-raw.png`,c.raw);await writeFile(`.visual-phase-tests/${width}-${label}-stable.png`,c.bytes);}
 assert.deepEqual(after.contract,before.contract,'unmodified original contracts');
 assert.equal(pixels(before.bytes,after.bytes),0,'stable before/after pixels');
 assert.notEqual(pixels(before.raw,after.raw),0,'fixture exercises raw subpixel difference');
 for(const [name,css,mutate] of [
  ['color','footer{color:red}'],['position','footer p{position:relative;left:1px}'],
  ['spacing','footer{padding-top:31px}'],['clipping','footer{height:25px;overflow:hidden}'],
  ['overflow','footer p{width:2000px}'],['text','',()=>document.querySelector('p').textContent='Wrong text'],
  ['link','',()=>document.querySelector('a').href='/wrong/']
 ]){
   const changed=await capture(6809.5,css,mutate);
   assert.notDeepEqual(changed.contract,before.contract,`${name} contract must fail`);
   if(!['link','overflow'].includes(name))assert.notEqual(pixels(before.bytes,changed.bytes),0,`${name} image must fail`);
 }
 for(const [name,css,mutate] of [
  ['outside overlay','',()=>{const e=document.createElement('div');e.textContent='overlay';e.style.cssText='position:fixed;bottom:0;left:0;width:100%;height:80px;background:red;z-index:999';document.body.append(e)}],
  ['fixed descendant','footer p{position:fixed;bottom:0}'],
  ['existing transform','footer{transform:translateX(1px)}'],
  ['ancestor clip','body{clip-path:inset(1px)}'],
  ['ancestor filter','body{filter:opacity(.9)}'],
  ['ancestor transform','body{transform:translateX(1px)}'],
  ['margin collapse side effect','main{margin-top:20px}'],
  ['direct text overflow','',()=>{const e=document.createElement('div');e.textContent='overflow text';e.style.cssText='position:fixed;bottom:30px;left:0;width:1px;height:0;white-space:nowrap';document.body.append(e)}],
  ['relative z descendant','footer p{position:relative;z-index:10000}'],
  ['absolute pseudo','footer p::before{content:"x";position:absolute}'],
  ['pointerless overlay','',()=>{const e=document.createElement('div');e.style.cssText='position:fixed;bottom:0;left:0;width:100%;height:80px;background:red;pointer-events:none';document.body.append(e)}],
  ['unbounded pseudo','body::before{content:"x";position:absolute;top:6809px}'],
  ['nested negative context','aside{position:relative;z-index:-1}header{position:fixed;z-index:999;top:0}header::after{content:"x"}',()=>{const e=document.createElement('aside');e.innerHTML='<header>Header</header>';document.body.append(e)}]
 ]){
   await assert.rejects(capture(6809.5,css,mutate),undefined,name+' must fail closed');
 }
 const independentHeader=await capture(6809.5,'header{position:fixed;z-index:999;top:0;height:30px}header::after{content:"";position:absolute;width:7px;height:2px;right:-5px;bottom:-2px;transform:rotate(45deg)}',()=>{const e=document.createElement('header');e.textContent='Header';document.body.prepend(e)});
 assert.equal(pixels(before.bytes,independentHeader.bytes),0,'bounded external pseudo cannot reach footer paint');
 const weakCSS='main{margin-bottom:48px;box-shadow:0 12px 30px rgba(0,0,0,.8)}footer{background:transparent}body{background:white}';
 const weakA=await capture(6809.5,weakCSS),weakB=await capture(6809.5,weakCSS+'main{box-shadow:0 12px 30px rgba(255,0,0,.8)}');
 const weakReceipt={rawPixels:pixels(weakA.raw,weakB.raw),stablePixels:pixels(weakA.bytes,weakB.bytes),contractChanged:JSON.stringify(weakA.contract)!==JSON.stringify(weakB.contract)};
 for(const [label,c] of [['gray',weakA],['red',weakB]]){await writeFile(`.visual-phase-tests/${width}-weak-shadow-${label}-raw.png`,c.raw);await writeFile(`.visual-phase-tests/${width}-weak-shadow-${label}-stable.png`,c.bytes);}
 await writeFile(`.visual-phase-tests/${width}-weak-shadow.json`,JSON.stringify(weakReceipt,null,2));
 assert.ok(weakReceipt.contractChanged,'near-footer shadow color contract must preserve even weak paint changes');
 assert.ok(weakReceipt.rawPixels===0||weakReceipt.stablePixels>0||weakReceipt.contractChanged,'a real raw shadow difference must not escape both gates');
 const shadowCSS='main{margin-bottom:48px;box-shadow:0 48px 30px rgba(0,0,0,.8)}footer{background:transparent}body{background:white}';
 const shadowBefore=await capture(8219.8125,shadowCSS),shadowAfter=await capture(6809.5,shadowCSS);
 assert.equal(pixels(shadowBefore.bytes,shadowAfter.bytes),0,'flow shadow remains in equal comparison images');
 assert.ok(shadowAfter.eligibility.flowShadows.length,'shadow guard must record its proof scope');
 const coloredShadow=await capture(6809.5,shadowCSS+'main{box-shadow:0 48px 30px rgba(255,0,0,.8)}');
 for(const [label,c] of [['gray',shadowAfter],['red',coloredShadow]]){await writeFile(`.visual-phase-tests/${width}-visible-shadow-${label}-raw.png`,c.raw);await writeFile(`.visual-phase-tests/${width}-visible-shadow-${label}-stable.png`,c.bytes);}
 assert.notEqual(pixels(shadowAfter.raw,coloredShadow.raw),0,'negative fixture must have a visible same-height raw color difference');
 assert.notEqual(pixels(shadowAfter.bytes,coloredShadow.bytes),0,'visible shadow paint must not be masked');
 await assert.rejects(capture(6809.5,'',()=>{
   const e=document.createElement('div');e.style.cssText='position:sticky;top:780px;height:20px;box-shadow:0 48px 30px rgba(0,0,0,.8)';document.body.insertBefore(e,document.querySelector('main'));
 }),/normal flow did not move by exact dy/,'nontracking sticky must be rejected by the translation proof');
 await page.close();
});
test.after(()=>browser.close());

// Exercise the real process exit gate, not just helper comparisons. A negative
// case must make the actual baseline/compare CLI exit non-zero.
test('complete visual audit rejects defects and preserves the positive control',async()=>{
 const {mkdtemp,cp}=await import('node:fs/promises');
 const {tmpdir}=await import('node:os');
 const {join,resolve}=await import('node:path');
 const {spawnSync}=await import('node:child_process');
 const {rmSync,readFileSync}=await import('node:fs');
 const dir=await mkdtemp(join(tmpdir(),'shell-phase-gate-'));
 const base=join(dir,'base'),head=join(dir,'head'),out=join(dir,'evidence');
 const env={...process.env,BASE_SHA:'a'.repeat(40),HEAD_SHA:'b'.repeat(40)};
 const config={baselineCommit:env.BASE_SHA,articleCount:1,representatives:[],viewports:{desktop:{width:1440,height:1000},mobile:{width:390,height:1000}}};
 for(const root of [base,head]){
  await mkdir(join(root,'articles'),{recursive:true});await mkdir(join(root,'en/articles'),{recursive:true});await mkdir(join(root,'.github'),{recursive:true});
  await writeFile(join(root,'.github/site-shell-visual.json'),JSON.stringify(config));
 }
 const fixture=(height,css='',replace)=>{let s=html(height,css).replace('<main>','<header class="site-header"><a href="/">Home</a></header><main>');return replace?replace(s):s;};
 await writeFile(join(base,'articles/fixture.html'),fixture(8219.8125));
 const run=(phase,root,evidenceOut=out)=>{
   if(phase==='compare')rmSync(join(evidenceOut,'report.json'),{force:true});
   const result=spawnSync(process.execPath,[resolve('scripts/site-shell-visual.mjs'),`--phase=${phase}`,`--root=${root}`,`--out=${evidenceOut}`],{env,encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024});
   if(phase==='compare')try{const r=JSON.parse(readFileSync(join(evidenceOut,'report.json'),'utf8'));result.audit={differences:r.differences,contractDifferences:r.contractDifferences,interactionChanged:r.interactionChanged,newErrors:r.newErrors,changedImages:r.results.filter(x=>x.pixels>0),footers:r.images.filter(x=>x.region==='footer').map(x=>({device:x.device,method:x.phase.method,eligibility:x.phase.eligibility}))};}catch{}
   return result;
 };
 const initial=run('baseline',base);assert.equal(initial.status,0,initial.stderr+initial.stdout);
 const receipts=[];
 for(const [name,css,replace] of [
  ['positive',''],['color','footer{color:red}'],['position','footer p{position:relative;left:1px}'],
  ['overflow','footer p{width:2000px}'],['clip','footer{height:25px;overflow:hidden}'],
  ['text','',s=>s.replace('Footer contract','Wrong contract')],['link','',s=>s.replace('href="/profile/"','href="/wrong/"')],
  ['outside spacing','main{margin-bottom:1px}'],['ancestor clip','body{clip-path:inset(0 0 50px)}'],
  ['external text','',s=>s+'<div style="position:fixed;bottom:50px;left:0;width:1px;height:0;white-space:nowrap">VISIBLE OVERFLOW</div>'],
  ['overlay','',s=>s+'<div style="position:fixed;bottom:0;left:0;width:100%;height:80px;background:red;pointer-events:none"></div>'],
  ['capture style side effect','body[style] footer{color:blue}']
 ]){
   await writeFile(join(head,'articles/fixture.html'),fixture(6809.5,css,replace));
   const result=run('compare',head);receipts.push({name,status:result.status,signal:result.signal,audit:result.audit,stdout:result.stdout,stderr:result.stderr});
   await mkdir('.visual-phase-tests',{recursive:true});await writeFile('.visual-phase-tests/cli-results.json',JSON.stringify(receipts,null,2));
   await cp(out,'.visual-phase-tests/cases/'+name.replace(/[^a-z0-9]+/gi,'-'),{recursive:true});
   assert.ok(result.audit,name+' must produce an actual comparison report');
   if(name==='positive')assert.equal(result.status,0,result.stderr+result.stdout);
   else assert.ok(Number.isInteger(result.status)&&result.status!==0,`${name} must fail the real CLI gate: ${result.stdout}`);
 }
 // An ancestor-only paint regression must remain visible even when adding a
 // style attribute for capture would otherwise make both versions white.
 const paintOut=join(dir,'ancestor-paint');
 const paintCSS='footer{background:transparent}header{background:white}body[style]{background:white}';
 await writeFile(join(base,'articles/fixture.html'),fixture(8219.8125,paintCSS+'body{background:black}'));
 await writeFile(join(head,'articles/fixture.html'),fixture(6809.5,paintCSS+'body{background:red}'));
 const paintBase=run('baseline',base,paintOut);assert.equal(paintBase.status,0,paintBase.stderr+paintBase.stdout);
 const paintHead=run('compare',head,paintOut);
 receipts.push({name:'ancestor-only paint hidden by capture attribute',status:paintHead.status,audit:paintHead.audit,stdout:paintHead.stdout,stderr:paintHead.stderr});
 await writeFile('.visual-phase-tests/cli-results.json',JSON.stringify(receipts,null,2));
 assert.ok(paintHead.audit,'ancestor-paint counterexample must produce comparison report');
 assert.ok(Number.isInteger(paintHead.status)&&paintHead.status!==0,'ancestor paint regression must fail real CLI');
 await cp(paintOut,'.visual-phase-tests/ancestor-paint-evidence',{recursive:true});
 const shadowOut=join(dir,'flow-shadow');
 const shadowCSS='main{margin-bottom:48px;box-shadow:0 48px 30px rgba(0,0,0,.8)}footer{background:transparent}body{background:white}';
 await writeFile(join(base,'articles/fixture.html'),fixture(8219.8125,shadowCSS));
 const shadowBase=run('baseline',base,shadowOut);assert.equal(shadowBase.status,0,shadowBase.stderr+shadowBase.stdout);
 for(const [name,change] of [['shadow positive',''],['shadow color','main{box-shadow:0 48px 30px rgba(255,0,0,.8)}'],['shadow radius','main{border-radius:24px}'],['shadow width','main{width:calc(100% - 4px)}'],['shadow horizontal position','main{position:relative;left:2px}'],['shadow position','main{position:relative;top:1px}'],['shadow real overlap','main{margin-bottom:-10px}']]){
   await writeFile(join(head,'articles/fixture.html'),fixture(6809.5,shadowCSS+change));
   const result=run('compare',head,shadowOut);receipts.push({name,status:result.status,audit:result.audit,stdout:result.stdout,stderr:result.stderr});
   await writeFile('.visual-phase-tests/cli-results.json',JSON.stringify(receipts,null,2));
   await cp(shadowOut,'.visual-phase-tests/cases/'+name.replace(/[^a-z0-9]+/gi,'-'),{recursive:true});
   assert.ok(result.audit,name+' must produce an actual comparison report');
   if(name==='shadow positive')assert.equal(result.status,0,result.stderr+result.stdout);
   else assert.ok(Number.isInteger(result.status)&&result.status!==0,name+' must fail real CLI');
 }
 await cp(shadowOut,'.visual-phase-tests/flow-shadow-evidence',{recursive:true});
 const stickyOut=join(dir,'nontracking-sticky');
 const stickyMarkup='<div style="position:sticky;top:780px;height:20px;box-shadow:0 48px 30px rgba(0,0,0,.8)"></div><main>';
 await writeFile(join(base,'articles/fixture.html'),fixture(8219.8125).replace('<main>',stickyMarkup));
 await writeFile(join(head,'articles/fixture.html'),fixture(6809.5).replace('<main>',stickyMarkup));
 const stickyBase=run('baseline',base,stickyOut);assert.equal(stickyBase.status,0,stickyBase.stderr+stickyBase.stdout);
 const stickyHead=run('compare',head,stickyOut);
 const {readFile}=await import('node:fs/promises');
 const stickyReport=JSON.parse(await readFile(join(stickyOut,'report.json'),'utf8'));
 const stickyFooters=stickyReport.images.filter(x=>x.region==='footer');
 assert.equal(stickyFooters.length,2);
 assert.ok(stickyHead.audit,'sticky fallback must produce a comparison report');
 assert.ok(stickyReport.differences>0,'raw fallback must retain the fixture subpixel difference');
 assert.ok(Number.isInteger(stickyHead.status)&&stickyHead.status!==0,'raw fallback differences must fail the actual CLI');
 for(const image of stickyFooters){assert.equal(image.phase.method,'raw-only');assert.match(image.phase.eligibility.reason,/normal flow did not move by exact dy/);}
 receipts.push({name:'nontracking sticky preserves raw comparison',status:stickyHead.status,methods:stickyFooters.map(x=>({device:x.device,method:x.phase.method,reason:x.phase.eligibility.reason})),audit:stickyHead.audit,stdout:stickyHead.stdout,stderr:stickyHead.stderr});
 await writeFile('.visual-phase-tests/cli-results.json',JSON.stringify(receipts,null,2));
 await cp(stickyOut,'.visual-phase-tests/nontracking-sticky-evidence',{recursive:true});
 await cp(out,'.visual-phase-tests/cli-evidence',{recursive:true});
});
