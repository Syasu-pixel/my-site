const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const canonical = 'https://denkicontrol.com';
const api = 'https://comments.denkicontrol.com';
const active = '/articles/ratchet-wrench.html';
const output = resolve(process.env.COMMENTS_CANDIDATE_DIR || 'one-article-test');
const json = data => JSON.stringify(data);

async function testScenario(browser, scenario) {
 const ctx = await browser.newContext({ viewport: { width: scenario.width || 320, height: 900 } });
 const page = await ctx.newPage();
 const calls = [];
 const html = await readFile(resolve(output, '.'+active),'utf8');
 await ctx.route('**/*', async route => {
  const req = route.request(), url = new URL(req.url());
  if (url.origin === api) {
   const part = url.pathname.split('/').at(-1);
   calls.push([part,req.method()]);
   const headers = {'access-control-allow-origin':canonical,'access-control-allow-credentials':'true',
    'access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type'};
   if(req.method()==='OPTIONS') return route.fulfill({status:204,headers});
   if (part==='readiness') {
    assert.equal(req.method(),'GET');assert.equal(url.searchParams.get('article'),active);
    assert.equal(await req.headerValue('origin'),canonical);
    assert.equal(await req.headerValue('cookie'),null);
    if (scenario.stall) return new Promise(resolve=>setTimeout(()=>{route.abort().catch(()=>{});resolve();}, 6400));
    if (scenario.networkDown) return route.abort('failed');
    if (scenario.redirect) return route.fulfill({status:302,headers:{...headers,location:api+'/redirected'}});
    return route.fulfill({status:scenario.status ?? 200,headers,json:scenario.readiness ?? {ready:true}});
   }
   if (part==='public') return route.fulfill({status:scenario.publicStatus??200,headers,json:scenario.public ?? {rows:[]}});
   if (part==='own') return route.fulfill({headers,json:{rows:[]}});
   if (part==='session') return route.fulfill({headers,json:{ready:true}});
   if (part==='post') {
    const d=req.postDataJSON();
    assert.equal(d.body,'合成の接続試験');assert.equal(d.action,'post');assert.equal(d.consent,false);
    assert.ok(d.requestId);return route.fulfill({headers,json:{rows:[{id:'one',body:d.body,nickname:'匿名',state:'pending'}]}});
   }
   throw Error('Unexpected network route: '+url.pathname);
  }
  if ((url.origin === canonical || url.origin === 'https://preview.invalid') && url.pathname.startsWith('/assets/js/article-comments/')) {
   const body=await readFile(resolve(output,'.'+url.pathname));
   return route.fulfill({body,contentType:url.pathname.endsWith('.css')?'text/css':'text/javascript'});
  }
  if (req.isNavigationRequest()) {
   const body=scenario.mutate?scenario.mutate(html):html;
   return route.fulfill({body,contentType:'text/html'});
  }
  return route.fulfill({status:404});
 });
 try{
  await ctx.addCookies([{name:'fixture-author',value:'local-only',url:api}]);
  await page.goto((scenario.origin??canonical)+(scenario.path??active),{waitUntil:'domcontentloaded'});
  const slot=page.locator('[data-article-comments-slot]');
  if(scenario.visible){
    await page.locator('[data-article-comments-slot]:not([hidden]) form').waitFor();
    assert.deepEqual(calls,[['readiness','GET'],['public','GET'],['own','GET']]);
    assert.equal(await page.locator('[data-public]').innerText(),'まだコメントはありません。');
    const dimensions=await slot.evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,button:el.querySelector('button[type=submit]').getBoundingClientRect().height}));
    assert.ok(dimensions.left>=0&&dimensions.right<=(scenario.width||320)&&dimensions.button>=44);
    if(scenario.submit){
     await page.locator('[data-article-comments-slot] textarea').fill('合成の接続試験');
     await page.locator('[data-article-comments-slot] button[type=submit]').click();
     await page.locator('[data-pending]').getByText('合成の接続試験').waitFor();
     assert.equal(await page.locator('[data-public]').innerText(),'まだコメントはありません。');
     assert.deepEqual(calls.slice(3).filter(([,method])=>method!=='OPTIONS'),[['session','POST'],['post','POST']]);
    }
  }else{
    await page.waitForTimeout(scenario.stall?6200:250);
    assert.equal(await slot.locator('form').count(),0);
    assert.equal(await slot.evaluate(el=>getComputedStyle(el).display),'none');
    assert.deepEqual(calls,scenario.calls??[]);
  }
 }finally{ await ctx.close(); }
 console.log('PASS',scenario.name);
}

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const read=[['readiness','GET']];
 try{
  for (const scenario of [
   {name:'eligible mobile, no reload post, author-only pending',visible:true,submit:true},
   {name:'eligible desktop',visible:true,width:1280},
   {name:'eligible dark mobile',visible:true,width:390,mutate:x=>x.replace('<html lang="ja"','<html lang="ja" data-dc-theme="dark"')},
   {name:'wrong host',origin:'https://preview.invalid'},
   {name:'top',path:'/'},{name:'category',path:'/categories/tools-guide.html'},
   {name:'English article',path:'/en/articles/ratchet-wrench.html'},
   {name:'paused article',path:'/articles/plc-drilling-line-design-project-01.html'},
   {name:'canonical mismatch',mutate:x=>x.replace('href="'+canonical+active+'"','href="'+canonical+'/articles/else.html"')},
   {name:'wrong language',mutate:x=>x.replace('<html lang="ja"','<html lang="en"')},
   {name:'control refused',status:503,calls:read},
   {name:'not ready',readiness:{ready:false},calls:read},
   {name:'malformed extra fields',readiness:{ready:true,data:'ignore'},calls:read},
   {name:'network failure aborts',networkDown:true,calls:read},
   {name:'redirect denied',redirect:true,calls:read},
   {name:'anonymous listing failure',publicStatus:503,calls:[...read,['public','GET']]},
   {name:'timeout then stale success must not reveal',stall:true,calls:read},
  ]) await testScenario(browser,scenario);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
