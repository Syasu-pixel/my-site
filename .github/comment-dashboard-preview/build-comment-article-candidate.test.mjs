import test from 'node:test';
import assert from 'node:assert/strict';
import {overlayArticle} from './build-comment-article-candidate.mjs';
const doc='<main><article>本文</article></main>\n<footer id="bottom" class="one site-footer second">案内</footer>';
test('candidate preserves original bytes and places hidden form before shared footer',()=>{
 const slot='<div hidden data-article-comments-slot></div>\n';
 const result=overlayArticle(doc,slot);
 assert.ok(result.endsWith(slot+'<footer id="bottom" class="one site-footer second">案内</footer>'));
 assert.equal(result.replace(slot,''),doc);
 assert.throws(()=>overlayArticle(result,slot));
});
test('unknown or duplicate shared footer cannot produce review HTML',()=>{
 for(const html of ['<main>no footer</main>',doc+doc])assert.throws(()=>overlayArticle(html,'hidden'));
});

import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {assemble} from './build-comment-article-candidate.mjs';

test('review assembly writes only eligible Japanese pages and never mutates staging',async()=>{
 const base=await mkdtemp(join(tmpdir(),'dc-comment-sidecar-'));
 try{
  const site=join(base,'site'), out=join(base,'sidecar'), manifestPath=join(base,'manifest.json');
  const committed=['articles/live.html','articles/stopped.html','en/articles/live.html'];
  for(const d of ['articles','en/articles','assets/data'])await mkdir(join(site,d),{recursive:true});
  for(const f of [...committed,'index.html'])await writeFile(join(site,f),doc);
  await writeFile(join(site,'assets/data/site-health-unpublished.json'),JSON.stringify({unpublished:[{path:committed[1]}]}));
  await writeFile(manifestPath,JSON.stringify({pages:committed.map(output=>({output}))}));
  const xml=(...paths)=>'<urlset>'+paths.map(path=>'<url><loc>https://denkicontrol.com/'+path+'</loc></url>').join('')+'</urlset>';
  await writeFile(join(site,'sitemap.xml'),xml('index.html',committed[0],committed[2]));
  await assert.rejects(assemble({site,manifestPath,out:join(site,'bad')}));
  assert.equal(await assemble({site,manifestPath,out}),1);
  assert.deepEqual(await readdir(out),['articles','review-report.json']);
  assert.deepEqual(await readdir(join(out,'articles')),['live.html']);
  assert.match(await readFile(join(out,committed[0]),'utf8'),/<div hidden data-article-comments-slot><template data-article-comments-template>/);
  for(const f of [...committed,'index.html'])assert.equal(await readFile(join(site,f),'utf8'),doc);
  await writeFile(join(site,'sitemap.xml'),xml(committed[0],committed[1]));
  await assert.rejects(assemble({site,manifestPath,out:join(base,'invalid')}),/incomplete/);
 }finally{await rm(base,{force:true,recursive:true});}
});
