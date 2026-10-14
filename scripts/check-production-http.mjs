import {readdir,access,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';

const sourceRoot=resolve(process.argv[2]||'.');
const out=resolve(process.argv[3]||'site-production-http.json');
const origin=(process.env.SITE_HEALTH_ORIGIN||'https://denkicontrol.com').replace(/\/$/,'');
const concurrency=Math.max(1,Math.min(6,Number(process.env.SITE_HEALTH_HTTP_CONCURRENCY||3)));
const timeoutMs=Math.max(3000,Number(process.env.SITE_HEALTH_HTTP_TIMEOUT_MS||10000));
const files=[];

async function walk(dir){
  for(const e of await readdir(dir,{withFileTypes:true})){
    if(e.name.startsWith('.')||['node_modules','vendor'].includes(e.name))continue;
    const p=resolve(dir,e.name);
    if(e.isDirectory())await walk(p);
    else if(e.name.endsWith('.html'))files.push(p);
  }
}
await walk(sourceRoot);

function publicPath(file){
  const p=relative(sourceRoot,file).replaceAll('\\','/');
  if(p==='404.html'||p.startsWith('admin/'))return null;
  if(p==='index.html')return '/';
  return '/'+p;
}
const urls=[...new Set(files.map(publicPath).filter(Boolean))].sort();
const results=new Array(urls.length);
let next=0;
async function worker(){
  while(true){
    const i=next++; if(i>=urls.length)return;
    const path=urls[i],url=origin+path;
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
    const started=Date.now();
    try{
      const r=await fetch(url,{method:'GET',redirect:'follow',signal:controller.signal,headers:{'user-agent':'Denkicontrol-Site-Health/1.0'}});
      results[i]={path,url,status:r.status,ok:r.status>=200&&r.status<400,finalUrl:r.url,durationMs:Date.now()-started};
      try{await r.body?.cancel()}catch{}
    }catch(e){
      results[i]={path,url,status:null,ok:false,error:e?.name==='AbortError'?'timeout':String(e?.message||e),durationMs:Date.now()-started};
    }finally{clearTimeout(timer)}
    await new Promise(r=>setTimeout(r,80));
  }
}
await Promise.all(Array.from({length:concurrency},worker));
const issues=results.filter(x=>!x.ok).map(x=>({type:'http-unreachable',path:x.path,status:x.status,error:x.error||null,url:x.url,finalUrl:x.finalUrl||null,durationMs:x.durationMs}));
const payload={checkedAt:new Date().toISOString(),origin,urlsChecked:results.length,issues,results};
await mkdir(dirname(out),{recursive:true});
await writeFile(out,JSON.stringify(payload,null,2)+'\n');
console.log(JSON.stringify({urlsChecked:results.length,httpIssues:issues.length}));
