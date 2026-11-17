import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const out=[];
for(const slug of ['plc-basic','safety-control-basic'])for(const width of [1440,390])for(const theme of ['light','dark']){
 const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 await p.route('**/*',r=>{const u=new URL(r.request().url());return ['GET','HEAD'].includes(r.request().method())&&['localhost','127.0.0.1'].includes(u.hostname)?r.continue():r.abort()});
 await p.addInitScript(t=>{localStorage.setItem('dc-theme',t);localStorage.setItem('dc-theme-explicit-v2','1')},theme);
 await p.goto('http://127.0.0.1:8890/',{waitUntil:'networkidle'});
 const slide=p.locator(`.instagram-comic-slide[href="articles/${slug}.html"]`);const vp=p.locator('.instagram-comic-viewport');
 await vp.scrollIntoViewIfNeeded();await vp.focus();
 for(let i=0;i<34&&!await slide.evaluate(e=>e.classList.contains('is-current'));i++)await vp.press('ArrowDown');
 if(!await slide.evaluate(e=>e.classList.contains('is-current')))throw Error('not reached');
 await slide.locator('img').evaluate(e=>e.decode());await p.screenshot({path:`../comic-input/preview-${slug}-${width}-${theme}.png`});
 await slide.click();await p.locator('#comicLightboxImage').evaluate(e=>e.decode());
 const href=await p.locator('#comicLightboxArticle').getAttribute('href');if(!href.endsWith(`/articles/${slug}.html`))throw Error(href);
 await p.screenshot({path:`../comic-input/expanded-${slug}-${width}-${theme}.png`});await p.keyboard.press('Escape');
 if(!await p.locator('#comicLightbox').evaluate(e=>e.hidden))throw Error('close failed');
 const row=await p.evaluate(()=>({count:document.querySelectorAll('.instagram-comic-slide').length,current:document.querySelectorAll('.instagram-comic-slide.is-current').length,overflow:document.documentElement.scrollWidth>innerWidth,theme:document.documentElement.dataset.dcTheme}));if(row.count!==33||row.current!==1||row.overflow||row.theme!==theme)throw Error(JSON.stringify(row));out.push({slug,width,theme,normal:true,expanded:true,articleHref:href,escapeClosed:true,...row});await p.close();
}console.log(JSON.stringify(out));await fs.writeFile('../comic-input/browser-check.json',JSON.stringify(out,null,2));await browser.close();
