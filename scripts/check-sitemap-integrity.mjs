import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'site-sitemap-health.json'),origin='https://denkicontrol.com';
const xml=await readFile(resolve(root,'sitemap.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(x=>x[1].trim().replaceAll('&amp;','&'));
const listed=new Set(),issues=[];
for(const raw of urls){try{const u=new URL(raw);if(u.origin!==origin){issues.push({type:'sitemap-foreign-url',path:'sitemap.xml',source:raw});continue}if(listed.has(u.pathname)){issues.push({type:'sitemap-duplicate',path:'sitemap.xml',source:raw});continue}listed.add(u.pathname)}catch{issues.push({type:'sitemap-invalid-url',path:'sitemap.xml',source:raw})}}
const pages=[];async function walk(d){for(const e of await readdir(d,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules','vendor'].includes(e.name))continue;const p=resolve(d,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html'))pages.push(p)}}await walk(root);
let eligible=0;const paths=new Set();
for(const file of pages){const path=relative(root,file).replaceAll('\\','/');if(path==='404.html'||path.startsWith('admin/')||path.startsWith('ai-editorial-dashboard/')||path.startsWith('preview/')||path==='common-article-header.html')continue;const html=await readFile(file,'utf8');if(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)||/<meta\b[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots/i.test(html))continue;const urlPath=path.endsWith('/index.html')?'/'+path.slice(0,-10):path==='index.html'?'/':'/'+path;paths.add(urlPath);eligible++;if(!listed.has(urlPath))issues.push({type:'sitemap-unlisted',path,source:origin+urlPath})}
for(const urlPath of listed){if(!paths.has(urlPath))issues.push({type:'sitemap-orphan',path:'sitemap.xml',source:origin+urlPath})}
const result={checkedAt:new Date().toISOString(),listedUrls:listed.size,eligiblePages:eligible,issues};await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({listedUrls:listed.size,eligiblePages:eligible,issues:issues.length}));
