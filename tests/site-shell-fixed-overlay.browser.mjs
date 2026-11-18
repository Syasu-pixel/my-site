import test from 'node:test';import assert from 'node:assert/strict';
import {chromium} from 'playwright';import {PNG} from 'pngjs';import pixelmatch from 'pixelmatch';
import {capturePhaseStableFooter} from '../scripts/site-shell-phase.mjs';
const browser=await chromium.launch();test.after(()=>browser.close());
const pixels=(a,b)=>{a=PNG.sync.read(a);b=PNG.sync.read(b);return a.width===b.width&&a.height===b.height?pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:.1,includeAA:false}):Infinity;};
for(const width of [390,1440])test(`fixed overlay stays visible and guarded at ${width}`,async()=>{
 const page=await browser.newPage({viewport:{width,height:900}});
 const capture=async(height,css='',mutate=null)=>{
 await page.setContent(`<style>body{margin:0}main{height:${height}px}footer{padding:30px 20px;background:#eee;font:17px/1.3 Arial}button{position:fixed;bottom:16px;right:16px;background:blue;color:white;padding:12px;border:0;border-radius:8px}${css}</style><main></main><footer class="site-footer"><p>Footer text 日本語</p><p>Affiliate disclosure</p></footer><button id="scrollTopBtn">↑ Top</button>`);
 if(mutate)await page.evaluate(mutate);
 const raw=await page.locator('footer').screenshot();const c=await capturePhaseStableFooter(page);return {...c,raw};
 };
 const a=await capture(6809.125),b=await capture(9101.765625);
 assert.deepEqual(a.contract,b.contract);assert.equal(pixels(a.bytes,b.bytes),0);assert.notEqual(pixels(a.raw,b.raw),0);
 assert.ok(a.contract.fixedOverlay);assert.equal(a.contract.fixedOverlay.rect.y,860);
 for(const css of ['button{bottom:17px}','button{right:17px}','button{padding:13px}','button{background:red}','button{opacity:.5}','button{pointer-events:none}','button{box-shadow:0 2px 3px red}','button{outline:2px solid red}','body{opacity:.9}','main{margin-bottom:1px}','footer{padding-top:31px}','footer{color:red}']){
 const changed=await capture(9101.765625,css);assert.notDeepEqual(changed.contract,a.contract,css);
 }
 for(const [css,mutate] of [['',()=>document.querySelector('button').textContent='Different'],['',()=>document.querySelector('footer p').textContent='Changed']])assert.notDeepEqual((await capture(9101.765625,css,mutate)).contract,a.contract);
 for(const css of ['button{transform:translateY(1px)}','button{filter:blur(1px)}','button::before{content:"x"}','button{position:absolute}','button{width:1px;height:1px;padding:0;font-size:40px;white-space:nowrap;overflow:visible}'])await assert.rejects(capture(9101.765625,css),undefined,css);
 await assert.rejects(capture(9101.765625,'',()=>{let e=document.createElement('div');e.style='position:fixed;bottom:0;width:100%;height:30px;background:red;pointer-events:none';document.body.append(e)}));
 await page.close();
});
