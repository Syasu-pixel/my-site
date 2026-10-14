import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createServer} from 'node:http';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
const baseline=resolve(process.argv[2]||'../baseline-main'),candidate=resolve(process.argv[3]||'.'),out=resolve(process.argv[4]||'../donation-diff');
const paths=['articles/plc-basic.html','en/articles/plc-basic.html','index.html','en/index.html','categories/control-basics.html','en/categories/control-basics.html'];
const cssFiles=['.github/article-components/integration-compat.css','.github/site-shells/additional/category.css'];
const expected='section.side-card.support-card{display:none!important}';
const articleCss=await readFile(resolve(candidate,cssFiles[0]),'utf8');
if(!articleCss.includes(expected))throw Error('Donation CSS missing');
const categoryCss=await readFile(resolve(candidate,cssFiles[1]),'utf8');
if(!categoryCss.includes('.support-card{display:none!important}'))throw Error('Category donation CSS missing');
await mkdir(out,{recursive:true});
const results=[];
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');const root=u.pathname.startsWith('/base/')?baseline:candidate;const path=u.pathname.replace(/^\/(base|candidate)\//,'');const file=resolve(root,path);if(!file.startsWith(root+'/'))throw Error('Traversal');const bytes=await readFile(file);res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html;charset=utf-8':'application/octet-stream'}).end(bytes)}catch{res.writeHead(404).end()}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});
try{for(const path of paths){
 const old=await readFile(resolve(baseline,path),'utf8'),now=await readFile(resolve(candidate,path),'utf8');
 if(old!==now)throw Error('Page source differs from main: '+path);
 for(const width of [390,1440])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},colorScheme:theme,reducedMotion:'reduce'});
  await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const key=path.replaceAll('/','__').replace('.html','')+'--'+width+'--'+theme;
  await page.goto(origin+'/base/'+path,{waitUntil:'domcontentloaded'});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
  const baselineCard=await page.locator('.support-card').count();
  const beforeWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
  const before=await page.screenshot({path:resolve(out,key+'--before.png'),fullPage:true});
  await page.goto(origin+'/candidate/'+path,{waitUntil:'domcontentloaded'});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
  // The live integrated publication injects the corresponding shared CSS.
  // This isolated test applies only the donation policy to identical raw HTML.
  await page.addStyleTag({content:'.support-card{display:none!important}'});
  const afterCard=await page.locator('.support-card').count();
  const visible=await page.locator('.support-card').evaluateAll(es=>es.filter(e=>getComputedStyle(e).display!=='none').length);
  const afterWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
  const after=await page.screenshot({path:resolve(out,key+'--after.png'),fullPage:true});
  if(baselineCard!==afterCard||visible!==0||afterWidth>Math.max(width,beforeWidth))throw Error('Donation visibility/overflow regression '+key);
  const a=PNG.sync.read(before),b=PNG.sync.read(after);
  let pixels=null;if(a.width===b.width&&a.height===b.height)pixels=pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0.1});
  results.push({path,width,theme,cards:afterCard,hidden:visible===0,beforeHeight:a.height,afterHeight:b.height,diffPixels:pixels,errors});
  await context.close();
 }
}}
finally{await browser.close();await new Promise(ok=>server.close(ok))}
await writeFile(resolve(out,'report.json'),JSON.stringify({basis:'current main checked out by workflow',method:'same raw HTML, donation-only CSS overlay; not final publication',results},null,2));
console.log(JSON.stringify({checks:results.length,allHidden:results.every(x=>x.hidden),pages:paths.length}));
