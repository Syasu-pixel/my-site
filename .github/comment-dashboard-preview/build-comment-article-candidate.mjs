// Review-only. Reads the generated Pages copy, never writes to it.
import {readFile,writeFile,mkdir,realpath} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {eligibleCommentPaths} from './article-rollout-mount.mjs';

const source=dirname(fileURLToPath(import.meta.url));
const canonical='https://denkicontrol.com';
const marker='data-article-comments-slot';
export function overlayArticle(html,slot){
 if(html.includes(marker))throw Error('Comments slot already present');
 const anchors=[...html.matchAll(/<footer\b[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>/gi)];
 if(anchors.length!==1)throw Error('Expected exactly one shared site footer');
 const pos=anchors[0].index;
 return html.slice(0,pos)+slot+html.slice(pos);
}
const parse=async p=>JSON.parse(await readFile(p,'utf8'));
export async function assemble({site,manifestPath,out}){
 site=await realpath(site);
 out=resolve(out);if(out===site||out.startsWith(site+sep)||site.startsWith(out+sep))throw Error('Review directory must be separate from Pages copy');
 const manifest=await parse(manifestPath), inventory=await parse(resolve(site,'assets/data/site-health-unpublished.json'));
 if(!Array.isArray(manifest.pages)||!Array.isArray(inventory.unpublished))throw Error('Invalid publication registry');
 const paths=manifest.pages.map(p=>'/'+p.output);
 const unpublished=inventory.unpublished.map(p=>'/'+p.path);
 const sitemapText=await readFile(resolve(site,'sitemap.xml'),'utf8');
 const sitemapPaths=[...sitemapText.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([,u])=>new URL(u)).filter(u=>u.origin===canonical&&!u.search&&!u.hash).map(u=>u.pathname);
 const allow=eligibleCommentPaths({manifestPaths:paths,sitemapPaths,unpublishedPaths:unpublished});
 if(!allow.length||(new Set(paths)).size!==paths.length||sitemapPaths.some(p=>/^\/articles\/[a-z0-9-]+\.html$/.test(p)&&(!paths.includes(p)||unpublished.includes(p))))throw Error('Invalid or incomplete Japanese comments scope');
 const template=await readFile(resolve(source,'article-preview.html'),'utf8');
 const markup=template.match(/<section data-comments [\s\S]*?<\/section>/)?.[0];
 if(!markup)throw Error('Missing approved-form candidate');
 const slot='<div hidden '+marker+'><template data-article-comments-template>'+markup+'</template></div>\n';
 // Check every input before creating a candidate; output contains only supported Japanese articles.
 const candidates=[];
 for(const path of allow){
  const from=resolve(site,'.'+path), into=resolve(out,'.'+path);
  if(await realpath(from)!==from)throw Error('Article is not a plain publication path');
  const html=await readFile(from,'utf8');
  try {const candidate=overlayArticle(html,slot);
   if(candidate.replace(slot,'')!==html)throw Error('Original bytes would change');
   candidates.push([into,candidate]);
  } catch(error){throw Error(path+': '+error.message);}
 }
 await mkdir(out);
 await mkdir(resolve(out,'articles'));
 for(const [into,html] of candidates)await writeFile(into,html,{flag:'wx'});
 await writeFile(resolve(out,'review-report.json'),JSON.stringify({reviewOnly:true,activated:false,japaneseArticles:allow.length,unchangedOutsideCandidate:true,paths:allow},null,2)+'\n',{flag:'wx'});
 return allow.length;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [site,manifestPath,out]=process.argv.slice(2);
 if(!site||!manifestPath||!out)throw Error('Supply Pages directory, canonical shell manifest and new review directory');
 console.log('Inert comment template verified on '+await assemble({site,manifestPath,out})+' Japanese article copies; Pages copy unchanged');
}
