import {readFile,readdir,access,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,relative,extname} from 'node:path';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'site-static-integrity.json');
const files=[];async function walk(d){for(const e of await readdir(d,{withFileTypes:true})){if(e.name.startsWith('.')||['node_modules'].includes(e.name))continue;const p=resolve(d,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html'))files.push(p)}}await walk(root);
const issues=[];let images=0,links=0;
function local(page,raw){if(!raw||/^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(raw))return null;try{const u=new URL(raw,'https://denkicontrol.com/'+page);if(u.origin!=='https://denkicontrol.com')return null;let p=decodeURIComponent(u.pathname).replace(/^\//,'');if(!p)return 'index.html';if(p.endsWith('/'))p+='index.html';return p}catch{return null}}
for(const file of files){const page=relative(root,file).replaceAll('\\','/'),html=await readFile(file,'utf8');
 for(const m of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)){images++;const target=local(page,m[1]);if(target)try{await access(resolve(root,target))}catch{issues.push({type:'broken-image',path:page,target,source:m[1]})}}
 for(const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)){links++;const target=local(page,m[1]);if(!target)continue;try{await access(resolve(root,target))}catch{issues.push({type:'broken-link',path:page,target,source:m[1]})}}
}
const result={checkedAt:new Date().toISOString(),htmlFiles:files.length,imagesChecked:images,linksChecked:links,issues};await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({htmlFiles:files.length,imagesChecked:images,linksChecked:links,issues:issues.length}));
