import {chromium} from 'playwright';import {readFile,writeFile,mkdir} from 'node:fs/promises';import {resolve} from 'node:path';import {PNG} from 'pngjs';import pixelmatch from 'pixelmatch';
const build=resolve(process.argv[2]||'../integration-build'),shardCount=Number(process.env.REVIEW_SHARD_COUNT||1),shardIndex=Number(process.env.REVIEW_SHARD_INDEX||0),suffix=shardCount>1?'-shard-'+shardIndex:'',evidence=resolve(build,'evidence'+suffix);await mkdir(evidence,{recursive:true});
if(!Number.isInteger(shardCount)||shardCount<1||!Number.isInteger(shardIndex)||shardIndex<0||shardIndex>=shardCount)throw Error('Invalid shard');
const config=JSON.parse(await readFile('.github/article-components/integration.json','utf8'));
let specs;try{specs=JSON.parse(await readFile('.github/article-components/sidebar/all-pages.json','utf8')).pages;}catch{specs=[...JSON.parse(await readFile('.github/article-components/sidebar/pages.json','utf8')).pages,...JSON.parse(await readFile('.github/article-components/sidebar/additional-pages.json','utf8')).pages];}
const targets=(config.targets||config.representatives).filter((p,i)=>i%shardCount===shardIndex);
const browser=await chromium.launch({headless:true});const results=[],votes=[],failures=[],images=[];const origin='http://127.0.0.1:'+(process.env.REVIEW_PORT||8768),beforeOrigin='http://127.0.0.1:'+(process.env.REVIEW_BEFORE_PORT||8769);
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const intersects=(a,b)=>a&&b&&a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
async function ready(page){await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}'});}
async function context(viewport){const c=await browser.newContext({viewport,locale:'ja-JP',timezoneId:'Asia/Tokyo',reducedMotion:'reduce',serviceWorkers:'block'});await c.route('**/*',r=>{const u=r.request().url();return u.startsWith(origin+'/')||u.startsWith(beforeOrigin+'/')||u.startsWith('data:')?r.continue():r.abort();});return c;}
async function shot(page,key,part){const file=key+'--'+part+'.png';await page.screenshot({path:resolve(evidence,file),animations:'disabled'});images.push({key,part,file});return file;}
try{
for(const path of targets)for(const width of (config.representatives.includes(path)?[320,390,768,1024,1440]:[390,768,1440])){
 const height=width===320?568:width<700?844:1000,key=path.replaceAll('/','__').replace('.html','')+'--'+width,c=await context({width,height}),page=await c.newPage();
 try{
  await page.goto(origin+'/'+path,{waitUntil:'networkidle'});await ready(page);const spec=specs.find(s=>s.path===path),compact=width<=spec.compactMaxWidth;
  assert(await page.locator('.dc-shell').count()===1,'header count');assert(await page.locator('.dc-toc-button').count()===1,'TOC duplicate');
  const en=path.startsWith('en/');assert(await page.locator('header .dc-consult').count()===(en?0:1),'language consultation condition');
  const headerOverflow=await page.locator('.dc-bar').evaluate(e=>[...e.querySelectorAll('*')].some(n=>{const r=n.getBoundingClientRect();return r.width&&(r.left<0||r.right>innerWidth+1)}));assert(!headerOverflow,'header overflow');
  if([390,1440].includes(width))await shot(page,key,'after-header');
  await page.locator('#dc-search-toggle').click();await page.locator('#site-search-input').fill('PLC');await page.locator('#site-search-results li').first().waitFor({state:'visible'});
  await page.waitForTimeout(50);assert(!intersects(await page.locator('.dc-toc-button').boundingBox(),await page.locator('#dc-search-drawer').boundingBox()),'TOC overlaps search drawer');
  await page.keyboard.press('Escape');await page.locator('#dc-menu-toggle').click();
  assert(await page.locator('.dc-current a').count()===0,'current language link');
  const counterpart=(en?'articles/':'en/articles/')+path.split('/').at(-1);let exists=true;try{await readFile(counterpart);}catch{exists=false;}
  assert(await page.locator('.dc-alternative').count()===(exists?1:0),'counterpart presence');if(exists)assert(await page.locator('.dc-alternative').getAttribute('href')==='/'+counterpart,'counterpart destination');
  await page.waitForTimeout(50);assert(!intersects(await page.locator('.dc-toc-button').boundingBox(),await page.locator('#dc-menu-drawer').boundingBox()),'TOC overlaps menu drawer');await page.keyboard.press('Escape');
  await page.locator('.dc-toc-button').click();assert(await page.locator('#dc-toc-dialog').evaluate(e=>e.open),'TOC open');assert(await page.locator('.dc-toc-button').getAttribute('aria-expanded')==='true','TOC aria');
  assert(await page.locator('.dc-toc-button').evaluate(e=>e.parentElement.tagName==='DIALOG')===compact,'TOC mode');
  const panel=await page.locator('.dc-toc-panel').boundingBox(),button=await page.locator('.dc-toc-button').boundingBox();assert(panel.x>=-1&&panel.x+panel.width<=width+1&&panel.y>=-1&&panel.y+panel.height<=height+1,'TOC panel outside viewport');
  if(compact)assert(!intersects(panel,button),'compact button overlaps list');
  if([390,1440].includes(width))await shot(page,key,'toc-open');
  await page.keyboard.press('Escape');assert(await page.locator('.dc-toc-button').evaluate(e=>e===document.activeElement),'TOC focus return');
  await page.locator('.dc-toc-button').click();const anchor=page.locator('.dc-toc-list a').last(),id=decodeURIComponent((await anchor.getAttribute('href')).slice(1));await anchor.click();
  assert(!await page.locator('#dc-toc-dialog').evaluate(e=>e.open),'TOC close on jump');
  const jump=await page.evaluate(id=>{const t=document.getElementById(id),h=t.matches('h2,h3')?t:t.querySelector('h2,h3')||t;return{focus:document.activeElement===h,clearance:h.getBoundingClientRect().top-document.querySelector('header').getBoundingClientRect().bottom};},id);assert(jump.focus&&jump.clearance>=15,'TOC heading hidden or not focused');
  const badImages=await page.locator('.article-end-related-media img').evaluateAll(es=>es.filter(e=>!e.complete||!e.naturalWidth||getComputedStyle(e).objectFit!=='contain').map(e=>e.src));assert(!badImages.length,'OGP image failure '+badImages.join(','));
  const clipped=await page.locator('.article-end-related-copy').evaluateAll(es=>es.some(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1));assert(!clipped,'related text clipped');
  const failedLocalImages=await page.locator('img').evaluateAll(es=>es.filter(e=>e.currentSrc.startsWith(location.origin+'/')&&(!e.complete||!e.naturalWidth)).map(e=>e.currentSrc));assert(!failedLocalImages.length,'local image decode failure '+failedLocalImages.join(','));
  const retainedThumbs=await page.locator('.article-end-related-grid .related-card-thumb,.article-end-related-grid .related-card-media').count();assert(retainedThumbs===0,'Old related image wrapper remains');
  const afterDocumentWidth=await page.evaluate(()=>document.documentElement.scrollWidth);let baselineDocumentWidth=null;
  const grid=page.locator('.article-end-related-grid');assert(await grid.count()===1,'related grid count');const gr=await grid.boundingBox();assert(gr.x>=-1&&gr.x+gr.width<=width+1,'related grid overflow');
  assert(await page.locator('#articleFeedbackCard').count()===(en?0:1),'feedback language/count');
  if(!en){const order=await grid.evaluate(g=>{const block=g.closest('section,.section-card,.article-card');return block.previousElementSibling?.id==='articleFeedbackCard';});assert(order,'feedback not immediately before related block');}
  if(path.includes('plc-drilling-line-design-project-'))assert(await page.locator('aside').count()===0,'design series acquired sidebar');
  if([390,1440].includes(width)){
   await page.locator(en?'.article-end-related-grid':'#articleFeedbackCard').scrollIntoViewIfNeeded();await shot(page,key,'after-end');
   await page.goto(beforeOrigin+'/'+path,{waitUntil:'networkidle'});await ready(page);baselineDocumentWidth=await page.evaluate(()=>document.documentElement.scrollWidth);await shot(page,key,'before-header');
   const end=page.locator(en?'.related-grid,.internal-grid':'#articleFeedbackCard');await end.last().scrollIntoViewIfNeeded();await shot(page,key,'before-end');
   for(const part of ['header','end']){const a=PNG.sync.read(await readFile(resolve(evidence,key+'--before-'+part+'.png'))),b=PNG.sync.read(await readFile(resolve(evidence,key+'--after-'+part+'.png'))),diff=new PNG({width:a.width,height:a.height});const pixels=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:.1,includeAA:false});const file=key+'--intentional-diff-'+part+'.png';await writeFile(resolve(evidence,file),PNG.sync.write(diff));images.push({key,part:'intentional-diff-'+part,file,pixels});}
  }
  if(afterDocumentWidth>width+1){if(baselineDocumentWidth===null){await page.goto(beforeOrigin+'/'+path,{waitUntil:'networkidle'});await ready(page);baselineDocumentWidth=await page.evaluate(()=>document.documentElement.scrollWidth);}assert(afterDocumentWidth<=baselineDocumentWidth+1,'new page horizontal overflow');}
  results.push({path,width,height,status:'passed',compact,documentWidth:afterDocumentWidth,existingHorizontalOverflow:afterDocumentWidth>width+1});console.log('PASS',path,width);
 }catch(error){failures.push({path,width,error:error.message});console.log('FAIL',path,width,error.message);await shot(page,key,'failure').catch(()=>{});}finally{await c.close();}
}
// Real existing vote logic, with local mock only. No request reaches the production endpoint.
for(const path of targets.filter(p=>!p.startsWith('en/'))){
 const c=await context({width:390,height:844}),page=await c.newPage();try{
  await page.goto(origin+'/'+path,{waitUntil:'networkidle'});await page.locator('[data-feedback-vote=helpful]').click();await page.waitForFunction(()=>document.querySelector('[data-feedback-vote=helpful]')?.getAttribute('aria-pressed')==='true');
  const sent=await page.evaluate(()=>window.__reviewVotes);assert(sent.length===1&&sent[0].article_slug===path.split('/').at(-1).replace('.html',''),'vote slug/count');assert(await page.locator('[data-feedback-vote]:disabled').count()===2,'vote lock');
  await page.reload({waitUntil:'networkidle'});assert(await page.locator('[data-feedback-vote]:disabled').count()===2,'reload lock');assert(await page.evaluate(()=>window.__reviewVotes.length)===0,'reload duplicate send');votes.push({path,mode:'success/reload',status:'passed',slug:sent[0].article_slug});
 }catch(error){failures.push({path,test:'vote',error:error.message});}finally{await c.close();}
}
for(const mode of (shardIndex===0?['duplicate','error','no-storage']:[])){const c=await context({width:390,height:844}),page=await c.newPage();try{
 await page.goto(origin+'/articles/control-panel-outlet-basic.html?'+(mode==='no-storage'?'no-storage=1':'mode='+mode),{waitUntil:'networkidle'});await page.locator('[data-feedback-vote=helpful]').click();await page.waitForTimeout(300);
 if(mode==='error'){assert(await page.locator('[data-feedback-vote]:disabled').count()===0,'error retry not enabled');assert((await page.locator('#articleFeedbackStatus').innerText()).includes('送信できません'),'error status');}
 else{assert(await page.locator('[data-feedback-vote]:disabled').count()===2,'edge mode not locked');if(mode==='duplicate')assert(await page.locator('[data-feedback-vote=not_helpful]').getAttribute('aria-pressed')==='true','409 selection');}
 votes.push({mode,status:'passed'});
 }catch(error){failures.push({test:'vote-'+mode,error:error.message});}finally{await c.close();}}
for(const width of (shardIndex===0?[390,768,1440]:[])){const c=await context({width,height:1000}),page=await c.newPage();try{
 await page.goto(origin+'/services/gxworks2-online-support.html',{waitUntil:'networkidle'});await ready(page);assert(await page.locator('.dc-toc-button').count()===0,'service wrongly acquired article TOC');assert(await page.locator('#consultationForm').count()===1,'service form missing');assert(!await page.locator('#consultationForm').evaluate(e=>e.checkValidity()),'empty service validation');await page.locator('#email').fill('invalid');assert(!await page.locator('#email').evaluate(e=>e.checkValidity()),'email validation');assert(await page.locator('#case-number').getAttribute('readonly')!==null,'case number must stay readonly');await shot(page,'service--'+width,'header');await page.locator('#consultationForm').scrollIntoViewIfNeeded();await shot(page,'service--'+width,'form');assert(await page.evaluate(()=>window.__reviewVotes.length)===0,'service submitted vote');results.push({path:'services/gxworks2-online-support.html',width,status:'preserved-exception',liveSubmission:false});
 }catch(error){failures.push({test:'service',width,error:error.message});}finally{await c.close();}}
}finally{await browser.close();}
await writeFile(resolve(build,'browser-checks'+suffix+'.json'),JSON.stringify({shardIndex,shardCount,targets,results,votes,failures,images,externalVotesSent:0,productionPublished:false},null,2));
console.log(JSON.stringify({layoutCases:results.length,voteCases:votes.length,failures:failures.length,images:images.length}));if(failures.length)process.exitCode=1;
