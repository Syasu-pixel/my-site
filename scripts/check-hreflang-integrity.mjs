import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
const root=resolve(process.argv[2]||'.');
const out=resolve(process.argv[3]||'site-hreflang-health.json');
const origin='https://denkicontrol.com';
const files=[],issues=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,e.name);if(e.isDirectory()&&!e.name.startsWith('.')&&e.name!=='node_modules')await walk(p);else if(e.isFile()&&e.name.endsWith('.html'))files.push(p)}}
await walk(root);
const attr=(tag,name)=>{const m=tag.match(new RegExp(name+'\\s*=\\s*"([^"]*)"','i'));return m?m[1]:''};
const pages=new Map();
for(const file of files){
 const path=relative(root,file).replaceAll('\\','/');
 if(path==='404.html'||path==='common-article-header.html'||path.startsWith('admin/')||path.startsWith('preview/')||path.startsWith('ai-editorial-dashboard/'))continue;
 const html=await readFile(file,'utf8');
 if(/name="robots"[^>]*content="[^"]*noindex/i.test(html))continue;
 const url=origin+(path==='index.html'?'/':path.endsWith('/index.html')?'/'+path.slice(0,-10):'/'+path);
 const links=(html.match(/<link\b[^>]*>/gi)||[]).filter(t=>attr(t,'rel').toLowerCase()==='alternate'&&attr(t,'hreflang')).map(t=>({lang:attr(t,'hreflang').toLowerCase(),href:attr(t,'href')}));
 pages.set(url,{path,links});
}
for(const [url,page] of pages){
 const seen=new Set();
 for(const link of page.links){
  if(seen.has(link.lang))issues.push({type:'hreflang-duplicate',path:page.path,source:link.lang});
  seen.add(link.lang);
  let target;try{target=new URL(link.href)}catch{issues.push({type:'hreflang-invalid',path:page.path,source:link.href});continue}
  if(target.origin!==origin||target.search||target.hash){issues.push({type:'hreflang-invalid',path:page.path,source:link.href});continue}
  const dest=pages.get(target.href);
  if(!dest){issues.push({type:'hreflang-target-missing',path:page.path,source:link.href});continue}
  if(link.lang==='x-default')continue;
  if(!['ja','en'].includes(link.lang)){issues.push({type:'hreflang-language-invalid',path:page.path,source:link.lang});continue}
  if((link.lang==='en')!==target.pathname.startsWith('/en/'))issues.push({type:'hreflang-language-mismatch',path:page.path,source:link.href});
  if(target.href!==url&&!dest.links.some(x=>x.lang!=='x-default'&&x.href===url))issues.push({type:'hreflang-not-reciprocal',path:page.path,source:link.href});
 }
}
const result={checkedAt:new Date().toISOString(),pagesChecked:pages.size,linksChecked:[...pages.values()].reduce((n,p)=>n+p.links.length,0),issues};
await mkdir(dirname(out),{recursive:true});
await writeFile(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({pagesChecked:result.pagesChecked,linksChecked:result.linksChecked,issues:issues.length}));
