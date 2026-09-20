import {createRequire} from 'node:module';import {mkdir,writeFile,readFile} from 'node:fs/promises';import {resolve} from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const out=resolve(process.argv[2]||'../additional-shell-build'),manifest=JSON.parse(await readFile(resolve('.github/site-shells/additional/manifest.json'),'utf8')),pages=manifest.pages.map(p=>p.path),counterparts=new Map(manifest.pages.map(p=>[p.path,p.realCounterpart])),results=[],failures=[];await mkdir(resolve(out,'screenshots'),{recursive:true});
const browser=await chromium.launch({headless:true});let blockedWrites=0;
const assert=(v,msg)=>{if(!v)throw Error(msg)};
const footerData=page=>page.locator('footer').evaluate(e=>({text:[...e.childNodes].filter(n=>!(n.nodeType===1&&n.classList.contains('dc-affiliate-disclosure'))).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim(),links:[...e.querySelectorAll('a')].map(a=>({text:a.textContent.trim(),href:new URL(a.getAttribute('href'),'https://denkicontrol.com'+location.pathname).href}))}));
for(const path of pages)for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:width<768?844:1000},serviceWorkers:'block',reducedMotion:'reduce',colorScheme:'light'});await context.route('**/*',r=>{if(!['GET','HEAD'].includes(r.request().method())){blockedWrites++;return r.abort()}const u=new URL(r.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)||u.protocol==='data:'?r.continue():r.abort()});
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
  const en=path.startsWith('en/'),service=path.startsWith('services/'),counterpart=counterparts.get(path);assert(await page.locator('.dc-consult').count()===(en?0:1),'Consult language');if(service)assert(await page.locator('a.dc-consult').count()===0,'Self consultation link');
  for(const selector of ['#dc-search-toggle','#dc-menu-toggle']){const r=await page.locator(selector).boundingBox();assert(r.x>=0&&r.x+r.width<=width,'Header button clipped')}
  await page.locator('#dc-menu-toggle').click();assert(await page.locator('.dc-alternative').count()===(counterpart?1:0),'Invented/missing translation');if(counterpart)assert(await page.locator('.dc-alternative').getAttribute('href')===counterpart,'Translation target');await page.keyboard.press('Escape');
  await page.locator('#dc-search-toggle').click();await page.locator('#site-search-input').fill('PLC');await page.locator('#site-search-results li').first().waitFor({state:'visible'});await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--search.png'),animations:'disabled'});await page.keyboard.press('Escape');
  assert(await page.locator('#dc-search-toggle').evaluate(e=>e===document.activeElement),'Search focus return');
  if(service){assert(!await page.locator('#consultationForm').evaluate(e=>e.checkValidity()),'Empty form validation');assert(await page.locator('#case-number').getAttribute('readonly')!==null,'Case number readonly')}
  await page.evaluate(()=>localStorage.removeItem('dc-theme'));await page.emulateMedia({colorScheme:'dark'});await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>document.documentElement.dataset.dcTheme==='dark');
  await page.locator('#dc-menu-toggle').click();assert(await page.locator('#dc-theme-toggle').getAttribute('aria-checked')==='true','System dark switch state');await page.keyboard.press('Escape');
  const darkAudit=await page.evaluate(()=>{
    const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};
    const rgb=s=>{const m=s.match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);return m?[+m[1],+m[2],+m[3]]:null};
    const avg=v=>v?(v[0]+v[1]+v[2])/3:null;
    const surfaceSelectors=['.info-box','.bookmark-help-panel','.shelf-row','.shelf-links','.category-modal__panel','.side-box','.intro-box','.featured-article','.article-row','.air-feature-card','.notice-box','.troubleshooting-hub','.hub-note','.tool-task-card','.tool-article-card','.featured-tool-card','.tool-group','.category-block','.compare-group','.topic-block','.bottom-nav a','.feature','.side-pill-list li'];
    const textSelectors=['.hero-text','.category-lead','.section-lead','.support-card-text','.mobile-shortcut span','.shelf-summary p','.support-category-card__description','.storefront-guide-card__note','.category-modal__description','.intro-box p','.featured-article p','.article-row-body p','.troubleshooting-hub p','.hub-note','.tool-task-card p','.tool-group ul','.side-category-card span','.side-note','.category-block p','.compare-group p','.topic-block p','.bottom-nav p','.feature p','.side-pill-list li'];
    const lightSurfaces=[],darkTexts=[];
    for(const sel of surfaceSelectors)for(const e of document.querySelectorAll(sel)){if(!visible(e))continue;const a=avg(rgb(getComputedStyle(e).backgroundColor));if(a!==null&&a>145)lightSurfaces.push(sel+':'+Math.round(a));}
    for(const sel of textSelectors)for(const e of document.querySelectorAll(sel)){if(!visible(e)||!e.textContent.trim())continue;const a=avg(rgb(getComputedStyle(e).color));if(a!==null&&a<115)darkTexts.push(sel+':'+Math.round(a));}
    const body=avg(rgb(getComputedStyle(document.body).backgroundColor));
    return {lightSurfaces:[...new Set(lightSurfaces)].slice(0,20),darkTexts:[...new Set(darkTexts)].slice(0,20),body};
  });
  assert(darkAudit.body!==null&&darkAudit.body<100,'Dark body background missing');
  assert(darkAudit.lightSurfaces.length===0,'Light surfaces remain in dark mode: '+darkAudit.lightSurfaces.join(', '));
  assert(darkAudit.darkTexts.length===0,'Dark text remains in dark mode: '+darkAudit.darkTexts.join(', '));
  await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--dark.png'),animations:'disabled',fullPage:true});
  assert(errors.every(e=>beforeErrors.includes(e)),'New script errors: '+errors.join('; '));
  await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--after.png'),animations:'disabled'});await page.locator('footer').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(out,'screenshots',path.replaceAll('/','__')+'--'+width+'--footer.png'),animations:'disabled'});
  results.push({path,width,status:'passed',beforeWidth,afterWidth,footerPreserved:true,formsPreserved:true,scriptErrors:errors});
 }catch(e){failures.push({path,width,error:e.message});}finally{await context.close()}
}
await browser.close();await writeFile(resolve(out,'browser-checks.json'),JSON.stringify({results,failures,blockedWrites,liveVotesSent:0,liveFormsSubmitted:0},null,2));console.log(JSON.stringify({checks:results.length,failures,blockedWrites}));if(failures.length)process.exitCode=1;
