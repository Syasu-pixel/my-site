// Fail-closed semantic scope for article-only changes, including per-page ledgers.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {basename} from 'node:path';
export function articleImpact(base, head='HEAD', full=false) {
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});
 const json=(ref,path)=>JSON.parse(git('show',`${ref}:${path}`));
 const all=json(head,'.github/article-components/integration.json').targets;
 if(!Array.isArray(all)||!all.length||new Set(all).size!==all.length)throw Error('Invalid integration targets');
 const registered=new Set(all), affected=new Set(), categories=new Set();
 const entries=git('diff','--name-status','--no-renames','-z',base,head).split('\0');entries.pop();
 const changed=[];for(let i=0;i<entries.length;i+=2)changed.push({status:entries[i],path:entries[i+1]});
 const registries=new Map([
 ['.github/site-shells/manifest.json',['pages','output',['baselineSha256']]],
 ['.github/article-components/site-inventory.json',['files','path',['gitBlob']]],
 ['.github/article-components/end/all-preservation-oracle.json',['pages','path',['sourceSha256','cards']]],
 ['.github/article-components/sidebar/all-pages.json',['pages','path',['cardsBefore','tocReference']]],
 ['.github/article-components/hero/css-bindings.json',null]]);
 let reason=full?'Explicit full audit':null;
 function ledger(path){
  const before=json(base,path),after=json(head,path),rule=registries.get(path);
  if(!rule){if(!isDeepStrictEqual(Object.keys(before),Object.keys(after)))return false;
   for(const key of Object.keys(before))if(!isDeepStrictEqual(before[key],after[key])){if(!registered.has(key))return false;affected.add(key);}return true;}
  const [group,key,fields]=rule,{[group]:a,...as}=before,{[group]:b,...bs}=after;
  if(!Array.isArray(a)||!Array.isArray(b)||!isDeepStrictEqual(as,bs)||a.length!==b.length)return false;
  for(let i=0;i<a.length;i++){if(isDeepStrictEqual(a[i],b[i]))continue;
   if(!registered.has(a[i][key])||a[i][key]!==b[i][key])return false;
   const x={...a[i]},y={...b[i]};for(const f of fields){delete x[f];delete y[f];}
   if(!isDeepStrictEqual(x,y))return false;affected.add(a[i][key]);}return true;
 }
 function image(path){
  // Only article-owned images qualify. Shared directories and unknown consumers are full.
  const m=path.match(/^assets\/images\/([^/]+)\/[^/]+\.(png|webp|jpe?g|gif|avif)$/i);
  if(!m)return false;
  const owner=`articles/${m[1]}.html`;if(!registered.has(owner))return false;
  const users=new Set();let found=false;
  for(const ref of [base,head]){
   let matches;try{matches=git('grep','-lzIF','-e',basename(path),ref,'--');}
   catch(e){if(e.status===1)continue;throw e;}
   for(const raw of matches.split('\0').filter(Boolean)){
    const consumer=raw.slice(ref.length+1);if(registries.has(consumer)||/^docs\/.+\.md$/.test(consumer))continue;
    const category=/^(en\/)?categories\/[\w-]+\.html$/.test(consumer);
    if(category){const additional=json(ref,'.github/site-shells/additional/manifest.json');if(!additional.pages.some(p=>p.path===consumer))return false;categories.add(consumer);}
    if(!category&&!registered.has(consumer))return false;
    // Non-owner usage must be an OGP/related-card thumbnail, never a shared Hero/body image.
    if(consumer!==owner){const html=git('show',`${ref}:${consumer}`),name=basename(path);
     const tags=[...html.matchAll(/<[^>]+>/g)].map(m=>m[0]).filter(tag=>tag.includes(name));
     if(!tags.length||tags.some(tag=>!(/^<img\b/i.test(tag)&&/class\s*=\s*["'][^"']*\b(?:related-card-thumb|article-end-related-media)\b/i.test(tag))&&!( /^<meta\b/i.test(tag)&&/property\s*=\s*["']og:image["']/i.test(tag))))return false;
     // Reject CSS/scripts and other references outside the recognized HTML tags.
     if(html.replace(/<[^>]+>/g,'').includes(name))return false;
    }
    if(!category)users.add(consumer);found=true;
   }
  }
  for(const p of users)affected.add(p);return found;
 }
 for(const {status,path} of changed){
  if(reason)break;
  if(status!=='M'&&status!=='A'){reason=`Deletion or unrecognized status: ${path}`;break;}
  if(registered.has(path)){if(status!=='M'){reason=`New article: ${path}`;break;}affected.add(path);continue;}
  if(/^docs\/.+\.md$/.test(path)||path==='docs/rules/catalog.json')continue;
  if(registries.has(path)&&status==='M'&&ledger(path))continue;
  if(/^assets\/images\//.test(path)&&image(path))continue;
  reason=`Shared or unrecognized change: ${path}`;
 }
 if(!affected.size&&!reason)reason='No verifiable affected articles';
 return {base,head:git('rev-parse',head).trim(),scope:reason?'all':'selected',reason:reason||'Verified article-owned changes',affectedTargets:reason?all:all.filter(x=>affected.has(x)),categoryConsumers:[...categories].sort(),changedFiles:changed.map(x=>x.path)};
}
if(process.argv[1]&&import.meta.url===new URL(`file://${process.argv[1]}`).href){
 const [base,head,out]=process.argv.slice(2);if(!base||!head||!out)throw Error('Usage: report-article-impact BASE HEAD OUTPUT');
 const result=articleImpact(base,head,process.env.FULL_ARTICLE_AUDIT==='1');writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}
