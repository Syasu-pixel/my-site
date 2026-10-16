import {readFile} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.resolve('@11ty/eleventy'));
const nunjucks=require('nunjucks');
const digest=s=>createHash('sha256').update(s).digest('hex');
export async function loadHeroRenderer(planFile,base=root){
 const pkg=resolve(base,'.github/article-components/hero');
 const env=new nunjucks.Environment(new nunjucks.FileSystemLoader(pkg,{noCache:true}),{autoescape:true,throwOnUndefined:true});
 const plan=JSON.parse(await readFile(planFile,'utf8')),pages=new Map();
 for(const page of plan.pages){
  if(pages.has(page.path)||!plan.targets.includes(page.path))throw Error('Duplicate/unregistered hero');
  if(digest(await readFile(resolve(base,page.path)))!==page.sourceSha256)throw Error('Source changed since hero extraction: '+page.path);
  for(const style of page.styles)for(const slot of style.slots){
   if(!/^css\/[a-f0-9]{64}\.css\.njk$/.test(slot.template))throw Error('Invalid CSS profile');
   if(digest(style.raw.slice(slot.start,slot.end))!==slot.sourceSha256)throw Error('Invalid CSS source span');
  }
  pages.set(page.path,page);
 }
 if(pages.size!==plan.targets.length)throw Error('Missing hero data');
 const once=(s,from,to)=>{if(!from||s.indexOf(from)<0||s.indexOf(from)!==s.lastIndexOf(from))throw Error('Ambiguous/stale hero boundary');return s.replace(from,()=>to);};
 return {targets:plan.targets,apply(html,path){
  const page=pages.get(path);if(!page)return html;
  // Template whitespace control preserves authored formatting exactly.
  const rendered=env.render('hero.njk',{h:page.hero.data}).replace(/\n$/,'');
  html=once(html,page.hero.raw,rendered);
  for(const style of page.styles){
   let css=style.raw;
   for(const slot of [...style.slots].reverse())css=css.slice(0,slot.start)+env.render(slot.template,{urls:slot.urls})+css.slice(slot.end);
   html=once(html,style.raw,css);
  }
  return html;
 }};
}
