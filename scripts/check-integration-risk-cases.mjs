import {chromium} from 'playwright';import {readFile,writeFile,mkdir} from 'node:fs/promises';import {resolve} from 'node:path';
const out=resolve(process.argv[2]||'../integration-build'),selection=JSON.parse(await readFile('.github/article-components/sidebar/browser-test-selection.json','utf8')),origin='http://127.0.0.1:'+(process.env.REVIEW_PORT||8768);
await mkdir(resolve(out,'risk-evidence'),{recursive:true});const browser=await chromium.launch(),checks=[],failures=[];
const assert=(v,m)=>{if(!v)throw Error(m)},overlap=(a,b)=>a&&b&&a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
async function open(path,width,height=1000){const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',serviceWorkers:'block'});await c.route('**/*',r=>r.request().url().startsWith(origin+'/')||r.request().url().startsWith('data:')?r.continue():r.abort());const p=await c.newPage();await p.goto(origin+'/'+path,{waitUntil:'networkidle'});return{c,p};}
try{
 for(const spec of selection.recommendedAdditionalPages)for(const width of spec.boundaryWidths){let c,p;try{
  ({c,p}=await open(spec.path,width));await p.locator('.dc-toc-button').click();assert(await p.locator('.dc-toc-button').evaluate(e=>e.parentElement.tagName==='DIALOG')===(width<=spec.compactMaxWidth),'incorrect breakpoint');
  for(const key of ['Shift+Tab','Tab']){await p.keyboard.press(key);assert(await p.locator('#dc-toc-dialog').evaluate(e=>e.contains(document.activeElement)),'focus escaped dialog');}
  await p.keyboard.press('Escape');assert(await p.locator('.dc-toc-button').evaluate(e=>document.activeElement===e),'Escape focus return');checks.push({test:'additional-breakpoint',path:spec.path,width,status:'passed'});
 }catch(e){failures.push({test:'additional-breakpoint',path:spec.path,width,error:e.message});}finally{await c?.close();}}
 const risks=new Map();for(const key of ['longestToc','generatedAnchorCases','fixedBottomControls','fixedSearchPanels'])for(const p of selection[key])risks.set(p.path,p);
 for(const spec of risks.values()){let c,p;try{
  ({c,p}=await open(spec.path,320,568));await p.locator('#dc-search-toggle').click();await p.locator('#site-search-input').fill('PLC');await p.locator('#site-search-results li').first().waitFor();await p.waitForTimeout(80);assert(!overlap(await p.locator('.dc-toc-button').boundingBox(),await p.locator('#site-search-panel').boundingBox()),'small-screen search overlap');
  await p.locator('#dc-menu-toggle').click();assert(await p.locator('#dc-search-drawer').isHidden(),'search/menu both open');await p.waitForTimeout(50);assert(!overlap(await p.locator('.dc-toc-button').boundingBox(),await p.locator('#dc-menu-drawer').boundingBox()),'small-screen menu overlap');await p.keyboard.press('Escape');
  await p.locator('.dc-toc-button').click();const links=p.locator('.dc-toc-list a'),n=await links.count();assert(n===spec.tocCount,'TOC items lost');
  const unresolved=await links.evaluateAll(es=>es.filter(a=>!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash));assert(!unresolved.length,'TOC target missing');
  for(let i=0;i<n+3;i++){await p.keyboard.press('Tab');assert(await p.locator('#dc-toc-dialog').evaluate(e=>e.contains(document.activeElement)),'long TOC Tab escaped');}
  await links.last().scrollIntoViewIfNeeded();const visible=await links.last().boundingBox();assert(visible.y>=0&&visible.y+visible.height<=568,'last TOC entry not reachable');
  const id=decodeURIComponent((await links.last().getAttribute('href')).slice(1));await links.last().click();assert(!await p.locator('#dc-toc-dialog').evaluate(e=>e.open),'jump failed to close');
  const target=await p.evaluate(id=>{const t=document.getElementById(id),h=t.matches('h2,h3')?t:t.querySelector('h2,h3')||t;return{focus:document.activeElement===h,clearance:h.getBoundingClientRect().top-document.querySelector('header').getBoundingClientRect().bottom};},id);assert(target.focus&&target.clearance>=15,'jump focus/header occlusion');
  await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await p.waitForTimeout(150);
  const intersections=await p.evaluate(()=>{const b=document.querySelector('.dc-toc-button').getBoundingClientRect();return [...document.querySelectorAll('a,button')].filter(e=>!e.closest('.dc-shell,#dc-toc-dialog')&&!e.classList.contains('dc-toc-button')&&getComputedStyle(e).position==='fixed').filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden'&&Number(getComputedStyle(e).opacity)>0&&r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top;}).map(e=>e.id||e.className);});assert(!intersections.length,'fixed controls overlap '+intersections.join(','));
  if(selection.recommendedAdditionalPages.some(x=>x.path===spec.path))await p.screenshot({path:resolve(out,'risk-evidence',spec.path.replaceAll('/','__')+'--320.png')});
  checks.push({test:'long-generated-fixed-small-screen',path:spec.path,width:320,tocItems:n,status:'passed'});
 }catch(e){failures.push({test:'risk-small-screen',path:spec.path,error:e.message});if(p)await p.screenshot({path:resolve(out,'risk-evidence',spec.path.replaceAll('/','__')+'--failure.png')});}finally{await c?.close();}}
}finally{await browser.close();}
await writeFile(resolve(out,'risk-checks.json'),JSON.stringify({checks,failures,productionRequestsSent:0},null,2));console.log(JSON.stringify({riskCases:checks.length,failures}));if(failures.length)process.exitCode=1;
