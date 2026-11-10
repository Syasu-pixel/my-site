import {readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
import {unpublishedPaths} from './site-health-publication-scope.mjs';

const sourceRoot=resolve(process.argv[2]||'.');
const out=resolve(process.argv[3]||'site-production-http.json');
const origin=(process.env.SITE_HEALTH_ORIGIN||'https://denkicontrol.com').replace(/\/$/,'');
const concurrency=Math.max(1,Math.min(6,Number(process.env.SITE_HEALTH_HTTP_CONCURRENCY||3)));
const timeoutMs=Math.max(3000,Number(process.env.SITE_HEALTH_HTTP_TIMEOUT_MS||10000));
const files=[];
const unpublished=await unpublishedPaths(sourceRoot);

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
  if(p==='404.html'||p.startsWith('admin/')||unpublished.has(p))return null;
  if(p==='index.html')return '/';
  return '/'+p;
}
// Probe paused URLs even when their source has been removed. Only an explicit
// 404/410 proves absence; redirects, successful responses and failures stay visible.
const urls=[...new Set([...files.map(publicPath).filter(Boolean),...Array.from(unpublished,p=>'/'+p)])].sort();
const results=new Array(urls.length);
let next=0;
async function worker(){
  while(true){
    const i=next++; if(i>=urls.length)return;
    const path=urls[i],url=origin+path,expectedUnpublished=unpublished.has(path.slice(1));
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
    const started=Date.now();
    try{
      const r=await fetch(url,{method:'GET',redirect:expectedUnpublished?'manual':'follow',signal:controller.signal,headers:{'user-agent':'Denkicontrol-Site-Health/1.0'}});
      results[i]={path,url,status:r.status,expectedUnpublished,ok:expectedUnpublished?[404,410].includes(r.status):r.status>=200&&r.status<400,finalUrl:r.url,durationMs:Date.now()-started};
      try{await r.body?.cancel()}catch{}
    }catch(e){
      results[i]={path,url,status:null,expectedUnpublished,ok:false,error:e?.name==='AbortError'?'timeout':String(e?.message||e),durationMs:Date.now()-started};
    }finally{clearTimeout(timer)}
    await new Promise(r=>setTimeout(r,80));
  }
}
await Promise.all(Array.from({length:concurrency},worker));
const issues=results.filter(x=>!x.ok).map(x=>({type:x.expectedUnpublished?(x.status>=200&&x.status<400?'http-unpublished-exposed':'http-unpublished-unverified'):'http-unreachable',path:x.path,status:x.status,error:x.error||null,url:x.url,finalUrl:x.finalUrl||null,durationMs:x.durationMs}));
const payload={checkedAt:new Date().toISOString(),origin,urlsChecked:results.length,issues,results};
await mkdir(dirname(out),{recursive:true});
await writeFile(out,JSON.stringify(payload,null,2)+'\n');
console.log(JSON.stringify({urlsChecked:results.length,httpIssues:issues.length}));

