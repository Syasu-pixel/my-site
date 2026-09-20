import {createRequire} from 'node:module';import {mkdir,writeFile} from 'node:fs/promises';import {resolve} from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const out=resolve(process.argv[2]||'../additional-shell-build'),pages=['index.html','en/index.html','services/gxworks2-online-support.html','categories/career.html'],results=[],failures=[];await mkdir(resolve(out,'screenshots'),{recursive:true});
const browser=await chromium.launch({headless:true});let blockedWrites=0;
const assert=(v,msg)=>{if(!v)throw Error(msg)};
const footerData=page=>page.locator('footer').evaluate(e=>({text:[...e.childNodes].filter(n=>!(n.nodeType===1&&n.classList.contains('dc-affiliate-disclosure'))).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim(),links:[...e.querySelectorAll('a')].map(a=>({text:a.textContent.trim(),href:new URL(a.getAttribute('href'),'https://denkicontrol.com'+location.pathname).href}))}));
for(const path of pages)for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:width<768?844:1000},serviceWorkers:'block',reducedMotion:'reduce'});await context.route('**/*',r=>{if(!['GET','HEAD'].includes(r.request().method())){blockedWrites++;return r.abort()}const u=new URL(r.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)||u.protocol==='data:'?r.continue():r.abort()});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:'+(process.env.REVIEW_BEFORE_PORT||8791)+'/'+path,{waitUntil:'networkidle'});const beforeFooter=await footerData(page),beforeWidth=await page.evaluate(()=>document.documentElement.scrollWidth),beforeForms=await page.locator('form:not(#siteSearch)').evaluateAll(es=>es.map(e=>e.outerHTML)),beforeErrors=[...errors];errors.length=0;
  await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--before.png'),animations:'disabled'});
  await page.goto('http://127.0.0.1:'+(process.env.REVIEW_PORT||8790)+'/'+path,{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
  const afterWidth=await page.evaluate(()=>document.documentElement.scrollWidth);assert(afterWidth<=Math.max(width,beforeWidth),'New horizontal overflow '+afterWidth+'/'+beforeWidth);
  assert(await page.locator('.dc-shell').count()===1,'Header count');assert(await page.locator('.dc-shared-footer').count()===1,'Shared footer');assert(await page.locator('.dc-toc-button,#articleFeedbackCard').count()===0,'Article-only controls');
  assert(await page.locator('footer .dc-affiliate-disclosure').count()===1,'Affiliate disclosure count');
   assert((await page.locator('footer .dc-affiliate-disclosure').innerText())===(path.startsWith('en/')?'This site uses affiliate links and may earn a commission from purchases.':'当サイトはアフィリエイト広告を利用しています。'),'Affiliate disclosure language');
   const footer=await footerData(page);assert(JSON.stringify(footer)===JSON.stringify(beforeFooter),'Footer text/links changed');
  assert(JSON.stringify(await page.locator('form:not(#siteSearch)').evaluateAll(es=>es.map(e=>e.outerHTML)))===JSON.stringify(beforeForms),'Service/body forms changed');
  const en=path.startsWith('en/'),service=path.startsWith('services/'),home=path.endsWith('index.html');assert(await page.locator('.dc-consult').count()===(en?0:1),'Consult language');if(service)assert(await page.locator('a.dc-consult').count()===0,'Self consultation link');
  for(const selector of ['#dc-search-toggle','#dc-menu-toggle']){const r=await page.locator(selector).boundingBox();assert(r.x>=0&&r.x+r.width<=width,'Header button clipped')}
  await page.locator('#dc-menu-toggle').click();assert(await page.locator('.dc-alternative').count()===(home?1:0),'Invented/missing translation');if(home)assert(await page.locator('.dc-alternative').getAttribute('href')===(en?'/':'/en/'),'Top translation target');
  await page.locator('#dc-theme-toggle').click();await page.waitForFunction(()=>document.documentElement.dataset.dcTheme==='dark');if(home){for(const sel of ['.feature-main','.featured-mini-card'])if(await page.locator(sel).count()){const bad=await page.locator(sel).evaluateAll(es=>es.some(e=>{const c=getComputedStyle(e).backgroundColor.match(/\\d+/g);return c&&c.length>=3&&((+c[0])+(+c[1])+(+c[2]))/3>150}));assert(!bad,'Top dark surface remains light: '+sel)}}await page.locator('#dc-theme-toggle').click();await page.waitForFunction(()=>document.documentElement.dataset.dcTheme==='light');await page.keyboard.press('Escape');
  await page.locator('#dc-search-toggle').click();await page.locator('#site-search-input').fill('PLC');await page.locator('#site-search-results li').first().waitFor({state:'visible'});await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--search.png'),animations:'disabled'});await page.keyboard.press('Escape');
  assert(await page.locator('#dc-search-toggle').evaluate(e=>e===document.activeElement),'Search focus return');
  if(service){assert(!await page.locator('#consultationForm').evaluate(e=>e.checkValidity()),'Empty form validation');assert(await page.locator('#case-number').getAttribute('readonly')!==null,'Case number readonly')}
  assert(errors.every(e=>beforeErrors.includes(e)),'New script errors: '+errors.join('; '));
  await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--after.png'),animations:'disabled'});await page.locator('footer').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--footer.png'),animations:'disabled'});
  results.push({path,width,status:'passed',beforeWidth,afterWidth,footerPreserved:true,formsPreserved:true,scriptErrors:errors});
 }catch(e){failures.push({path,width,error:e.message});}finally{await context.close()}
}
await browser.close();await writeFile(resolve(out,'browser-checks.json'),JSON.stringify({results,failures,blockedWrites,liveVotesSent:0,liveFormsSubmitted:0},null,2));console.log(JSON.stringify({checks:results.length,failures,blockedWrites}));if(failures.length)process.exitCode=1;
