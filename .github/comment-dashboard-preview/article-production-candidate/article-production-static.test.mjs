import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,mkdir,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {assemble, computeScope, overlayArticle} from './build-article-comment-candidate.mjs';
const url='https://denkicontrol.com';
const java='/articles/usable.html', paused='/articles/plc-drilling-line-design-project-01.html';
const exceptions=['/','/categories/tools.html','/en/articles/usable.html',paused];
const html='<!doctype html><html lang="ja"><head><link rel="canonical" href="'+url+java+'"></head><body><main>変更しない</main><footer class="site-footer"><a href="/">戻る</a></footer></body></html>';
const make=async(t, sitemap=[java,...exceptions.slice(0,3)])=>{
 const dir=await mkdtemp(resolve(tmpdir(),'comment-build-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const site=resolve(dir,'site'), manifestPath=resolve(dir,'manifest.json');
 const configPath=resolve(dir,'config.json'), out=resolve(dir,'review');
 const input=resolve(site,'.'+java);
 await mkdir(resolve(site,'assets/data'),{recursive:true});
 await mkdir(resolve(site,'articles'),{recursive:true});
 await writeFile(input,html);
 await writeFile(resolve(site,'sitemap.xml'),'<urlset>'+sitemap.map(p=>'<url><loc>'+url+p+'</loc></url>').join('')+'</urlset>');
 await writeFile(resolve(site,'assets/data/site-health-unpublished.json'),JSON.stringify({unpublished:[{path:paused.slice(1)}]}));
 await writeFile(manifestPath,JSON.stringify({pages:[java,...exceptions.slice(1)].map(p=>({output:p.slice(1)}))}));
 return {site,manifestPath,configPath,out,input,config:c=>writeFile(configPath,JSON.stringify(c))};
};
test('release defaults disabled and emits no deployable file',async t=>{
 const f=await make(t);
 await f.config({enabled:false,paths:[]});const r=await assemble(f);
 assert.equal(r.stagedArticles,0);assert.equal(r.eligibleCount,1);
 assert.deepEqual(await readdir(f.out),['review-report.json']);
 assert.equal(await readFile(f.input,'utf8'),html);
});
test('explicit listed article stages reversible additive slot and four scoped assets only',async t=>{
 const f=await make(t);
 await f.config({enabled:true,paths:[java]});const r=await assemble(f);
 assert.equal(r.stagedArticles,1);assert.equal(r.eligibleCount,1);
 const candidate=await readFile(resolve(f.out,'.'+java),'utf8');
 assert.match(candidate,/<div hidden data-article-comments-slot><template data-article-comments-template>/);
 assert.equal(candidate.replace(/<link rel="stylesheet" href="\/assets\/js\/article-comments\/article-comments.css">[\s\S]*?<\/script>\n/,''),html);
 assert.equal(await readFile(f.input,'utf8'),html);
 assert.deepEqual(await readdir(f.out),['articles','assets','review-report.json']);
 assert.deepEqual(await readdir(resolve(f.out,'assets/js/article-comments')),['article-client.mjs','article-comments.css','article-production-mount.mjs','entry.mjs']);
});
test('top, category, English, paused, absent path, bad toggles cannot stage anything',async t=>{
 for(const path of [...exceptions,'/articles/not-registered.html']){
  const f=await make(t);
  await f.config({enabled:true,paths:[path]});
  await assert.rejects(assemble(f),/scope/);await assert.rejects(readdir(f.out),{code:'ENOENT'});
 }
 for(const config of [
  {enabled:'true',paths:[java]}, {enabled:true,paths:[]},{enabled:false,paths:[java]},
  {enabled:true,paths:[java,java]},
 ]){
  const f=await make(t);await f.config(config);
  await assert.rejects(assemble(f));await assert.rejects(readdir(f.out),{code:'ENOENT'});
 }
});
test('disagreement, duplicates, noncanonical preview input or shell fail closed',async t=>{
 assert.throws(()=>computeScope({manifest:[java],sitemap:[java,java],unpublished:[]}),/duplicate/);
 assert.throws(()=>computeScope({manifest:[java],sitemap:[java,paused],unpublished:[paused]}),/disagree/);
 assert.throws(()=>overlayArticle(html.replace('<footer','<footer data-article-comments-slot'),''),/already/);
 assert.throws(()=>overlayArticle(html.replace('site-footer','else'),''),/exactly one/);
 const f=await make(t);await f.config({enabled:true,paths:[java]});
 await writeFile(f.input,html.replace('<head>','<head><meta name="robots" content="noindex">'));
 await assert.rejects(assemble(f),/Not a published/);
 await assert.rejects(readdir(f.out),{code:'ENOENT'});
});
