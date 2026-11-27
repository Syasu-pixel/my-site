// Overlay only the approved candidate pages and generated assets onto the Pages copy.
import {readFile,writeFile,copyFile,mkdir,realpath} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {root} from './build-site-shells.mjs';
const build=resolve(process.argv[2]||'../integration-build'),site=resolve(process.argv[3]||'_site');
if(site===root||root.startsWith(site+sep)||build===root||site===build||build.startsWith(site+sep)||site.startsWith(build+sep))throw Error('Publication and build must be separate from the source and each other');
assertSafeSite: { const actual=await realpath(site); if(actual!==site||actual===root)throw Error('Publication destination must not be a symlink or the source'); }
const config=JSON.parse(await readFile(resolve(root,'.github/article-components/integration.json'),'utf8'));
const targets=config.targets||config.representatives;
const assets=['assets/css/article-toc-v2.css','assets/js/article-toc-v2.js','assets/css/article-end-related.css','assets/css/article-end-feedback.css','assets/css/article-integration-compat.css','assets/js/article-integration-compat.js'];
const service='services/gxworks2-online-support.html',candidate=resolve(build,'candidate');
const additionalConfig=JSON.parse(await readFile(resolve(root,'.github/site-shells/additional/manifest.json'),'utf8'));
const additionalPaths=additionalConfig.pages.map(p=>p.path),additionalBuild=resolve(build,'additional-shells');
const additionalProof=JSON.parse(await readFile(resolve(additionalBuild,'preservation.json'),'utf8'));
const assert=(ok,message)=>{if(!ok)throw Error(message)};
const sha=b=>createHash('sha256').update(b).digest('hex');
const pending=[];
const allowedAdditional=['index.html','en/index.html',service,'contact/index.html','en/contact/index.html','privacy-policy/index.html','en/privacy-policy/index.html','categories/career.html','categories/air-pneumatic.html','categories/circuit-basics.html','categories/comparison-guide.html','categories/control-basics.html','categories/tools-guide.html','en/categories/circuit-basics.html','en/categories/control-basics.html','profile/index.html'];
assert(additionalPaths.length===allowedAdditional.length&&new Set(additionalPaths).size===allowedAdditional.length&&additionalPaths.every(p=>allowedAdditional.includes(p)),'Unexpected additional shell scope');
for(const path of [...targets,...additionalPaths,...assets]){
  assert(additionalPaths.includes(path)||/^(?:(?:en\/)?articles\/[a-z0-9-]+\.html|assets\/(?:css|js)\/[a-z0-9.-]+)$/.test(path),'Unexpected publication path');
  const sourceFolder=additionalPaths.includes(path)?resolve(additionalBuild,'candidate'):candidate;
  const source=resolve(sourceFolder,path);assert((await realpath(source)).startsWith(await realpath(sourceFolder)+sep),'Candidate path escapes build');
  const bytes=await readFile(source),html=bytes.toString('utf8');
  assert(!/data-review-only|data-preview-isolation|__reviewVotes|__reviewMode|review-isolation\.js/.test(html),'Review isolation leaked into candidate: '+path);
  if(path.endsWith('.html')){
    assert(!/<meta\b[^>]*\bnoindex\b/i.test(html),'Review noindex leaked into candidate: '+path);
    assert(!/<meta\b[^>]*http-equiv=["']Content-Security-Policy/i.test(html),'Review CSP leaked into candidate: '+path);
    if(additionalPaths.includes(path)){
      const proof=additionalProof.pages.find(p=>p.path===path);
      assert(proof&&proof.nonShellBytesPreserved&&proof.footerInnerBytesPreserved&&proof.originalScriptsPreserved,'Missing additional preservation proof: '+path);
      assert(proof.sourceSha256===sha(await readFile(resolve(root,path)))&&proof.candidateSha256===sha(bytes),'Stale additional generation: '+path);
      assert((html.match(/<header\b[^>]*class="[^"]*\bdc-shell\b[^"]*"/g)||[]).length===1,'Additional header count');
      assert(!/id="articleFeedbackCard"|class="dc-toc-button"/.test(html),'Article controls on non-article page');
    }else{
      assert((html.match(/<header\b[^>]*class="[^"]*\bdc-shell\b[^"]*"/g)||[]).length===1,'Missing/duplicate approved header: '+path);
      assert((html.match(/id="articleFeedbackCard"/g)||[]).length===(path.startsWith('en/')?0:1),'Feedback language mismatch: '+path);
    }
  }
  pending.push({path,bytes});
}
// Preflight all target data before altering the publish copy. Root sources remain untouched.
const inventory=JSON.parse(await readFile(resolve(build,'coverage-ledger.json'),'utf8')).pages;
assert(inventory.length===315&&targets.length===292&&new Set(targets).size===292,'Incomplete approved inventory');
for(const p of inventory.filter(p=>!targets.includes(p.path)))assert((await readFile(resolve(site,p.path))).equals(await readFile(resolve(root,p.path))),'Non-article page changed before overlay: '+p.path);
for(const {path,bytes} of pending){await mkdir(dirname(resolve(site,path)),{recursive:true});await writeFile(resolve(site,path),bytes);assert((await readFile(resolve(site,path))).equals(bytes),'Publication copy differs from candidate');}
assert((await readFile(resolve(site,'assets/js/article-feedback.js'))).equals(await readFile(resolve(root,'assets/js/article-feedback.js'))),'Original vote script changed');
// Japanese individual articles only. A dormant placeholder has no form action,
// submission script, API link, cookie handling, or live-activation flag.
const commentOrigin='https://denkicontrol.com';
const commentPath=/^articles\/[a-z0-9-]+\.html$/;
const commentMarker='data-dc-article-comments-off';
const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');
const sitemapPaths=[...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([,loc])=>{
 const url=new URL(loc);
 assert(url.origin===commentOrigin&&url.href===loc&&!url.username&&!url.password&&!url.search&&!url.hash,'Invalid sitemap canonical: '+loc);
 return url.pathname.slice(1);
});
assert(sitemapPaths.length>0&&new Set(sitemapPaths).size===sitemapPaths.length,'Missing or ambiguous sitemap paths');
const registered=JSON.parse(await readFile(resolve(root,'.github/site-shells/manifest.json'),'utf8')).pages;
const offline=JSON.parse(await readFile(resolve(root,'assets/data/site-health-unpublished.json'),'utf8')).unpublished;
assert(Array.isArray(registered)&&registered.every(p=>typeof p?.output==='string')&&new Set(registered.map(p=>p.output)).size===registered.length,'Invalid article registry');
assert(Array.isArray(offline)&&offline.every(p=>commentPath.test(p?.path??''))&&new Set(offline.map(p=>p.path)).size===offline.length,'Invalid unpublished registry');
const registeredPaths=new Set(registered.map(p=>p.output)),offlinePaths=new Set(offline.map(p=>p.path));
const scope=sitemapPaths.filter(path=>commentPath.test(path)).sort();
assert(scope.length>0&&scope.every(path=>registeredPaths.has(path)&&targets.includes(path)&&!offlinePaths.has(path)),'Comment scope disagrees with publication registries');

const commentMarkup=`<template data-article-comments-template><section class="dc-article-comments-off" data-dc-article-comments-off aria-labelledby="dc-comments-off-title">
  <h2 id="dc-comments-off-title">コメント</h2>
  <p>現場で役立ったコツや失敗談をお寄せいただく欄です。現在は投稿を受け付けていません。</p>
  <details>
    <summary>準備中のコメント入力欄を見る</summary>
    <fieldset disabled aria-describedby="dc-comments-off-status">
      <legend>コメントを書く</legend>
      <label>ニックネーム（任意）<input type="text" maxlength="24"></label>
      <label>コメント<textarea maxlength="500" rows="3"></textarea></label>
      <button type="button">コメントを投稿</button>
    </fieldset>
    <p id="dc-comments-off-status">受付準備中のため、入力・送信はできません。</p>
  </details>
</section></template>
`;
const commentsPending=[];
for(const path of scope){
 const dest=resolve(site,path), source=pending.find(p=>p.path===path)?.bytes;
 assert(source&&(await realpath(dest))===dest,'Missing or unsafe comments destination: '+path);
 const original=source.toString('utf8');
 const canonical=[...original.matchAll(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi)];
 assert(canonical.length===1&&canonical[0][1]===commentOrigin+'/'+path&&/<html\b[^>]*\blang=["']ja["']/i.test(original),'Invalid comment article language or canonical: '+path);
 assert(!original.includes(commentMarker)&&!original.includes('data-article-comments-slot')&&!original.includes('dc-comments-off-title')&&!original.includes('dc-comments-off-status')&&!original.includes('data-dc-comments-off-style'),'Existing comment component: '+path);
 const footer=[...original.matchAll(/<footer\b[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>/gi)];
 const head=[...original.matchAll(/<\/head\s*>/gi)];
 assert(footer.length===1&&head.length===1&&head[0].index<footer[0].index,'Missing or ambiguous comment placement: '+path);
 const markupAt=footer[0].index;
 const updated=original.slice(0,markupAt)+commentMarkup+original.slice(markupAt);
 assert(Buffer.from(updated.replace(commentMarkup,'')).equals(source)
  &&(updated.match(/data-dc-article-comments-off/g)||[]).length===1,'Non-comment bytes changed: '+path);
 commentsPending.push({path,dest,bytes:Buffer.from(updated),before:sha(source)});
}
for(const {dest,bytes,path} of commentsPending){
 await writeFile(dest,bytes);
 assert((await readFile(dest)).equals(bytes),'Comment artifact verification failed: '+path);
}
const articleCommentsOff={intake:'disabled',rendered:false,networkRequests:0,articles:commentsPending.length,pages:commentsPending.map(p=>({path:p.path,preOverlaySha256:p.before,sha256:sha(p.bytes)}))};
const report={articleCommentsOff,sourceCommit:process.env.GITHUB_SHA||null,articles:targets.length,additionalShellPages:additionalPaths,serviceNonShellBytesPreserved:true,nonArticlePagesPreserved:inventory.length-targets.length-additionalPaths.length,reviewIsolationPublished:false,stage:'before-existing-image-optimization',pages:pending.filter(p=>p.path.endsWith('.html')).map(p=>({path:p.path,sha256:sha(commentsPending.find(c=>c.path===p.path)?.bytes??p.bytes),sourceComponent:additionalPaths.includes(p.path)?'additional-shells':'article-components'})),assets:assets.map(path=>({path,sha256:sha(pending.find(p=>p.path===path).bytes)}))};
await writeFile(resolve(build,'publication-checks.json'),JSON.stringify(report,null,2));
await copyFile(resolve(build,'publication-checks.json'),resolve(site,'site-build-manifest.json'));
console.log(JSON.stringify({articleCommentsOff:articleCommentsOff.articles,articles:report.articles,additionalShellPages:additionalPaths.length,serviceNonShellBytesPreserved:true,nonArticlePagesPreserved:report.nonArticlePagesPreserved,reviewIsolationPublished:false}));
