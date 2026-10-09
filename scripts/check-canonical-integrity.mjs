import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'site-canonical-health.json'),origin='https://denkicontrol.com',files=[],issues=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules','vendor'].includes(e.name))continue;const p=resolve(dir,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html'))files.push(p)}}await walk(root);
const attr=(tag,name)=>tag.match(new RegExp('\\b'+name+'\\s*=\\s*(["\\x27])([^"\\x27]*)\\1','i'))?.[2]||'';
const canonical=html=>(html.match(/<link\b[^>]*>/gi)||[]).filter(tag=>attr(tag,'rel').toLowerCase().split(/\s+/).includes('canonical')).map(tag=>attr(tag,'href'));
const noindex=html=>(html.match(/<meta\b[^>]*>/gi)||[]).some(tag=>attr(tag,'name').toLowerCase()==='robots'&&/(^|[,\s])noindex([,\s]|$)/i.test(attr(tag,'content')));
let pagesChecked=0;
for(const file of files){const path=relative(root,file).replaceAll('\\','/');if(path==='404.html'||path.startsWith('admin/')||path.startsWith('ai-editorial-dashboard/')||path.startsWith('preview/')||path==='common-article-header.html')continue;
const html=await readFile(file,'utf8');if(noindex(html))continue;pagesChecked++;
const expected=origin+(path==='index.html'?'/':path.endsWith('/index.html')?'/'+path.slice(0,-10):'/'+path),values=canonical(html);
if(!values.length){issues.push({type:'canonical-missing',path,source:expected});continue}
if(values.length!==1){issues.push({type:'canonical-duplicate',path,source:values.join(', ')});continue}
let url;try{url=new URL(values[0])}catch{issues.push({type:'canonical-invalid',path,source:values[0]});continue}
if(url.href!==expected)issues.push({type:'canonical-mismatch',path,source:values[0],target:expected});
}
const result={checkedAt:new Date().toISOString(),pagesChecked,issues};await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({pagesChecked,issues:issues.length}));
