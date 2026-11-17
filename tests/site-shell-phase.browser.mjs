import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
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
 await page.close();
});
test.after(()=>browser.close());
