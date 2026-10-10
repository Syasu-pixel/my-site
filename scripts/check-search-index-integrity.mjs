import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'site-search-index-health.json');
const entries=JSON.parse(await readFile(resolve(root,'assets/data/search-index.json'),'utf8'));
const issues=[],indexed=new Set(),articleFiles=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules','vendor'].includes(e.name))continue;const p=resolve(dir,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html')&&/^(?:en\/)?articles\//.test(relative(root,p).replaceAll('\\','/')))articleFiles.push(p)}}await walk(root);
const attr=(tag,name)=>tag.match(new RegExp('\\b'+name+'\\s*=\\s*(["\\x27])([^"\\x27]*)\\1','i'))?.[2]||'';
const noindex=html=>(html.match(/<meta\b[^>]*>/gi)||[]).some(tag=>attr(tag,'name').toLowerCase()==='robots'&&/(^|[,\s])noindex([,\s]|$)/i.test(attr(tag,'content')));
for(const e of entries){const url=e.url;if(typeof url!=='string'||!/^\/(?:en\/)?articles\/[^?#]+\.html$/.test(url)){issues.push({type:'search-index-invalid',path:'assets/data/search-index.json',source:String(url)});continue}if(indexed.has(url))issues.push({type:'search-index-duplicate',path:'assets/data/search-index.json',source:url});indexed.add(url);try{await readFile(resolve(root,url.slice(1)),'utf8')}catch{issues.push({type:'search-index-orphan',path:'assets/data/search-index.json',source:url})}}
let eligibleArticles=0;for(const file of articleFiles){const path=relative(root,file).replaceAll('\\','/');const html=await readFile(file,'utf8');if(noindex(html))continue;eligibleArticles++;if(!indexed.has('/'+path))issues.push({type:'search-index-unlisted',path,source:'/'+path})}
const result={checkedAt:new Date().toISOString(),indexedEntries:entries.length,eligibleArticles,issues};await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({indexedEntries:entries.length,eligibleArticles,issues:issues.length}));
