// Inspect the exact publication locally or at a verified provider URL. Never submit forms.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {createHash} from 'node:crypto';
const target=process.argv[2],out=resolve(process.argv[3]||'../preview-smoke');
if(!target)throw Error('Publication directory or provider origin required');
await mkdir(out,{recursive:true});
const remote=/^https:\/\//.test(target);
let server,origin;
if(remote){
  const u=new URL(target);
  if(!u.hostname.endsWith('.denkicontrol-preview.pages.dev')||u.pathname!=='/'||u.search||u.hash)throw Error('Only a Cloudflare Preview origin is permitted');
  origin=u.origin;
}else{
  const root=resolve(target),mime={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
  server=createServer(async(req,res)=>{try{
    if(!['GET','HEAD'].includes(req.method))throw Error('Read-only');
    let path=decodeURIComponent(new URL(req.url,'http://local').pathname).slice(1);if(!path||path.endsWith('/'))path+='index.html';
    const file=resolve(root,path);if(!file.startsWith(root+sep))throw Error('Invalid path');
    const bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','X-Robots-Tag':'noindex, noarchive'}).end(bytes);
  }catch{res.writeHead(404).end()}});
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));origin='http://127.0.0.1:'+server.address().port;
}
const paths=['index.html','en/index.html','articles/plc-basic.html','en/articles/plc-basic.html','categories/control-basics.html','en/categories/control-basics.html'];
const browser=await chromium.launch({headless:true}),results=[],failures=[];
try{
  const response=await fetch(origin+'/preview-source.json');
  if(!response.ok)throw Error('No verified source manifest');
  const manifest=await response.json();
  if(!/^[a-f0-9]{40}$/.test(manifest.sourceCommit))throw Error('Missing source commit');
  for(const path of paths){
    const r=await fetch(origin+'/'+path);if(!r.ok)throw Error('HTTP '+r.status+' '+path);
    const hash=createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');
    if(hash!==manifest.files[path])throw Error('Deployment differs from validated publication: '+path);
    if(remote&&!/noindex/.test(r.headers.get('x-robots-tag')||''))throw Error('Preview noindex missing');
    for(const width of [390,1440])for(const theme of ['light','dark']){
      const context=await browser.newContext({viewport:{width,height:width===390?844:1000},colorScheme:theme,reducedMotion:'reduce',serviceWorkers:'block'});
      // Only provider-hosted resources are allowed; feedback/forms/analytics cannot write.
      await context.route('**/*',r=>['GET','HEAD'].includes(r.request().method())&&(r.request().url().startsWith(origin+'/')||r.request().url().startsWith('data:'))?r.continue():r.abort());
      const page=await context.newPage(),key=path.replaceAll('/','__')+'--'+width+'--'+theme;
      try{
        await page.goto(origin+'/'+path,{waitUntil:'networkidle'});
        await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
        await page.waitForFunction(t=>document.documentElement.dataset.dcTheme===t,theme);
        if(await page.locator('header.dc-shell').count()!==1)throw Error('Integrated header missing/duplicated');
        const cards=await page.locator('.support-card').evaluateAll(es=>({total:es.length,visible:es.filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none').length}));
        if(cards.visible)throw Error('Donation card visible');
        const images=await page.locator('img').evaluateAll(es=>es.filter(e=>e.currentSrc.startsWith(location.origin+'/')&&!e.naturalWidth).map(e=>e.currentSrc));
        if(images.length)throw Error('Broken local images: '+images.join(','));
        const header=await page.locator('.dc-bar').boundingBox();if(header.x< -1||header.x+header.width>width+1)throw Error('Header overflow');
        await page.screenshot({path:resolve(out,key+'.png'),fullPage:true});
        await page.locator('#dc-menu-toggle').click();
        if(await page.locator('#dc-theme-toggle').getAttribute('aria-checked')!==(theme==='dark'?'true':'false'))throw Error('Theme switch state');
        await page.keyboard.press('Escape');
        results.push({path,width,theme,hash,cards,status:'passed'});
      }catch(e){failures.push({path,width,theme,error:e.message});await page.screenshot({path:resolve(out,key+'--failure.png')}).catch(()=>{});}
      finally{await context.close();}
    }
  }
  await writeFile(resolve(out,'report.json'),JSON.stringify({origin,sourceCommit:manifest.sourceCommit,sourceBranch:manifest.sourceBranch,results,failures,externalWrites:0},null,2));
}finally{await browser.close();if(server)await new Promise(ok=>server.close(ok));}
console.log(JSON.stringify({cases:results.length,failures}));if(failures.length)process.exitCode=1;
