import {readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';

const root=resolve(process.argv[2]||'.');
const out=resolve(process.argv[3]||'site-ogp-health.json');
const origin=(process.env.SITE_HEALTH_ORIGIN||'https://denkicontrol.com').replace(/\/$/,'');
const files=[];
async function walk(d){for(const e of await readdir(d,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules','vendor'].includes(e.name))continue;const p=resolve(d,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html'))files.push(p)}}
await walk(root);

function pagePath(file){return relative(root,file).replaceAll('\\','/')}
function publicPage(path){return path!=='404.html'&&!path.startsWith('admin/')}
function meta(html,property){
  const tags=html.match(/<meta\b[^>]*>/gi)||[];
  for(const tag of tags){
    const prop=tag.match(/\bproperty=["']([^"']+)["']/i)?.[1]||tag.match(/\bname=["']([^"']+)["']/i)?.[1];
    if(prop?.toLowerCase()!==property.toLowerCase())continue;
    return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1]||'';
  }
  return '';
}
const issues=[];let pagesChecked=0,imagesChecked=0;
for(const file of files){
  const path=pagePath(file);if(!publicPage(path))continue;
  pagesChecked++;
  const liveUrl=origin+(path==='index.html'?'/':'/'+path);
  let html;
  try{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),10000);try{const r=await fetch(liveUrl,{signal:controller.signal});if(!r.ok){issues.push({type:'ogp-page-http',path,source:liveUrl,status:r.status});continue}html=await r.text()}finally{clearTimeout(timer)}}catch(e){issues.push({type:'ogp-page-http',path,source:liveUrl,error:String(e?.message||e)});continue}
  const raw=meta(html,'og:image');
  if(!raw){issues.push({type:'ogp-image-missing',path,source:null});continue}
  let url;
  try{url=new URL(raw,liveUrl)}catch{issues.push({type:'ogp-image-invalid',path,source:raw});continue}
  if(!/^https?:$/.test(url.protocol)){issues.push({type:'ogp-image-invalid',path,source:raw});continue}
  imagesChecked++;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try{
    const r=await fetch(url,{method:'GET',redirect:'follow',signal:controller.signal,headers:{'user-agent':'Denkicontrol-Site-Health/1.0'}});
    const ct=(r.headers.get('content-type')||'').toLowerCase();
    if(!r.ok||!ct.startsWith('image/'))issues.push({type:'ogp-image-http',path,source:raw,status:r.status,contentType:ct||null});
    try{await r.body?.cancel()}catch{}
  }catch(e){issues.push({type:'ogp-image-http',path,source:raw,status:null,error:e?.name==='AbortError'?'timeout':String(e?.message||e)})}
  finally{clearTimeout(timer)}
  await new Promise(r=>setTimeout(r,60));
}
const result={checkedAt:new Date().toISOString(),pagesChecked,imagesChecked,issues};
await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({pagesChecked,imagesChecked,ogpIssues:issues.length}));
