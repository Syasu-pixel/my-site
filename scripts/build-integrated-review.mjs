// Three ordered source transformations; previous generated article copies are never inputs.
import {readFile,writeFile,mkdir,copyFile,access} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import Eleventy from '@11ty/eleventy';
import {root,buildShells} from './build-site-shells.mjs';
import {loadHeroRenderer} from './build-article-heroes.mjs';
const out=resolve(process.argv[2]||'../integration-build'),pkg=resolve(root,'.github/article-components');
if(out===root||out.startsWith(root+sep)||root.startsWith(out+sep))throw Error('Use a separate review output tree');
await mkdir(out,{recursive:true});
const config=JSON.parse(await readFile(resolve(pkg,'integration.json'),'utf8'));
const targets=config.targets||config.representatives;
if(new Set(targets).size!==targets.length)throw Error('Duplicate target URL');
const run=(program,args)=>{const result=spawnSync(program,args,{cwd:root,encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'}});if(result.stdout)process.stdout.write(result.stdout);if(result.status!==0)throw Error(result.stderr||'Build failed');};
await buildShells({check:true,verifyBaseline:true});
run(process.env.PYTHON_EXECUTABLE||(process.platform==='win32'?'python':'python3'),['scripts/prepare-article-heroes.py','--out',resolve(out,'hero-pages.json')]);
const heroes=await loadHeroRenderer(resolve(out,'hero-pages.json'));
if(heroes.targets.some(path=>!targets.includes(path)))throw Error('Hero target is not registered in the integrated build');
run(process.execPath,['scripts/preview-site-shell-ui.mjs',resolve(out,'headers'),resolve(pkg,'integration.json')]);
run(process.env.PYTHON_EXECUTABLE||(process.platform==='win32'?'python':'python3'),['scripts/prepare-article-components.py','--headers',resolve(out,'headers'),'--out',out]);
const pages=JSON.parse(await readFile(resolve(out,'pages.json'),'utf8'));
const eleventy=new Eleventy(resolve(pkg,'end/page.njk'),resolve(out,'.render'),{configPath:false,quietMode:true,config:c=>{c.addGlobalData('integratedPages',pages);c.setNunjucksEnvironmentOptions({throwOnUndefined:true,autoescape:true});}});
// Japanese individual articles only. A dormant placeholder has no form action,
// submission script, API link, cookie handling, or live-activation flag.
const commentOrigin='https://denkicontrol.com';
const commentPath=/^articles\/[a-z0-9-]+\.html$/;
const assert=(ok,message)=>{if(!ok)throw Error(message)};
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

function makeCommentRelease(scope){
 const paths=scope.map(path=>'/'+path);
 assert(paths.length>0&&paths.length<=5000&&paths.every((path,i)=>/^\/articles\/[a-z0-9-]{1,120}\.html$/.test(path)&&(i===0||paths[i-1]<path)),'Invalid comment release scope');
 const protocol='denkicontrol-comments/v1';
 const digest=createHash('sha256').update(protocol+'\n'+paths.join('\n')+'\n','utf8').digest('hex');
 return {protocol,digest,paths};
}
const commentRelease=makeCommentRelease(scope);

const commentMarkup=await readFile(resolve(pkg,'end/comments-intake-off.html'),'utf8');
const scopeSet=new Set(scope);
function addInertComments(path, original){
 const clean = !/data-(?:dc-article-comments-off|article-comments-slot|article-comments-template)|dc-comments-off-(?:title|status)/i.test(original);
 assert(clean,'Existing comment component: '+path);
 if(!scopeSet.has(path))return original;
 const canonical=[...original.matchAll(/<link\b(?=[^>]*\srel=["']canonical["'])(?=[^>]*\shref=["']([^"']+)["'])[^>]*>/gi)];
 assert(canonical.length===1&&canonical[0][1]===commentOrigin+'/'+path&&/<html\b[^>]*\blang=["']ja["']/i.test(original),'Invalid comment article language or canonical: '+path);
 const footer=[...original.matchAll(/<footer\b[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>/gi)];
 assert(footer.length===1,'Missing or ambiguous comment placement: '+path);
 const idx=footer[0].index;
 const updated=original.slice(0,idx)+commentMarkup+original.slice(idx);
 assert(updated.replace(commentMarkup,'')===original&&(updated.split(commentMarker).length===2),'Non-comment bytes changed: '+path);
 return updated;
}
const rendered=await eleventy.toJSON();if(rendered.length!==pages.length)throw Error('Incomplete integrated render');
const candidate=resolve(out,'candidate'),review=resolve(out,'review'),pending=[],before=new Map();
for(const result of rendered){
  const path=result.url.replace(/^\//,'');if(!targets.includes(path))throw Error('Unexpected output: '+path);
  let html=result.content;
  // One source career page lacks the shared search loader. The common header
  // requires it; the original feedback loader has its own duplicate guard.
  if(!/<script\b[^>]*src=["'][^"']*site-search\.js/i.test(html))html=html.replace('</body>','<script src="/assets/js/site-search.js" defer data-integration-added="search"></script></body>');
  if(!html.includes('data-site-analytics="metricool"'))html=html.replace('</body>','<script src="/assets/js/site-analytics.js" defer data-site-analytics="metricool"></script></body>');
  html=html.replace('</head>','<link rel="stylesheet" href="/assets/css/article-end-related.css">'+(!path.startsWith('en/')?'<link rel="stylesheet" href="/assets/css/article-end-feedback.css">':'')+'<link rel="stylesheet" href="/assets/css/article-integration-compat.css"></head>').replace('</body>','<script src="/assets/js/article-integration-compat.js" defer></script></body>');
  if(!path.startsWith('en/')&&(html.match(/id="articleFeedbackCard"/g)||[]).length!==1)throw Error('Japanese feedback count invalid');
  if(path.startsWith('en/')&&html.includes('id="articleFeedbackCard"'))throw Error('English feedback forbidden');
  // The paired evidence isolates only the hero renderer; apply the same independent
  // non-hero transformation to both inputs, while retaining the original hero on the left.
  before.set(path,addInertComments(path,html));
  pending.push([path,addInertComments(path,heroes.apply(html,path))]);
}
const isolation=await readFile(resolve(pkg,'review-isolation.js'),'utf8');
const reviewHead=`<meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="default-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'none'; object-src 'none'; base-uri 'none'; worker-src 'none'"><script data-review-only="isolation">${isolation}</script>`;
const assets=new Set(['assets/js/site-search.js','assets/js/article-feedback.js','assets/data/search-index.json']);
// Service-specific layout is an explicit exception: copy it byte-for-byte, never template it as an article.
const service='services/gxworks2-online-support.html';
pending.push([service,await readFile(resolve(root,service),'utf8')]);
for(const [path,html]of pending){
  for(const folder of [candidate,review])await mkdir(dirname(resolve(folder,path)),{recursive:true});
  await writeFile(resolve(candidate,path),html);
  await writeFile(resolve(review,path),html.replace(/<head\b[^>]*>/,m=>m+reviewHead));
  const beforePath=resolve(out,'before',path);await mkdir(dirname(beforePath),{recursive:true});
  await writeFile(beforePath,(before.get(path)||html).replace(/<head\b[^>]*>/,m=>m+reviewHead));
  for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']|url\(["']?([^\)"']+)/g)){
    const href=match[1]||match[2];if(href.startsWith('data:'))continue;
    const u=new URL(href,'https://denkicontrol.com/'+path);if(u.origin==='https://denkicontrol.com'&&u.pathname.startsWith('/assets/'))assets.add(decodeURIComponent(u.pathname.slice(1)));
  }
}
const generatedAssets=[['sidebar/toc.css','assets/css/article-toc-v2.css'],['sidebar/toc.js','assets/js/article-toc-v2.js'],['end/related.css','assets/css/article-end-related.css'],['end/feedback.css','assets/css/article-end-feedback.css'],['integration-compat.css','assets/css/article-integration-compat.css'],['integration-compat.js','assets/js/article-integration-compat.js']];
for(const [from,to]of generatedAssets)for(const folder of [candidate,review]){await mkdir(dirname(resolve(folder,to)),{recursive:true});await copyFile(resolve(pkg,from),resolve(folder,to));assets.delete(to);}
const missing=[];
for(const path of assets){try{await access(resolve(root,path));if(process.env.REVIEW_COPY_ASSETS!=='0')for(const folder of [candidate,review]){await mkdir(dirname(resolve(folder,path)),{recursive:true});await copyFile(resolve(root,path),resolve(folder,path));}}catch{missing.push(path);}}
await writeFile(resolve(out,'required-assets.json'),JSON.stringify([...assets].sort(),null,2));
await writeFile(resolve(out,'missing-assets.json'),JSON.stringify(missing,null,2));
// Behavior remains off. A shared manifest is emitted beside, not inside, either web tree.
await writeFile(resolve(out,'article-comment-release.json'),JSON.stringify({...commentRelease,intake:'disabled'},null,2)+'\n');
await writeFile(resolve(out,'article-comment-release.mjs'),'export const releaseProtocol='+JSON.stringify(commentRelease.protocol)+';\n'+
 'export const releaseSha='+JSON.stringify(commentRelease.digest)+';\n'+
 'export const releasePaths=Object.freeze('+JSON.stringify(commentRelease.paths)+');\n');
await writeFile(resolve(out,'build.json'),JSON.stringify({version:config.version,sourceCommit:config.sourceCommit,mainCommit:config.mainCommit,representatives:config.representatives,targets,assetMode:process.env.REVIEW_COPY_ASSETS==='0'?'source-fallback':'copied',sourceModified:false,productionPublished:false,articleComments:{intake:'disabled',rendered:false,paths:scope,digest:commentRelease.digest},missingAssets:missing},null,2));
console.log(JSON.stringify({pages:pending.length,candidate,review,missingAssets:missing.length}));
