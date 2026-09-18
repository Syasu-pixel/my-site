// Three ordered source transformations; previous generated article copies are never inputs.
import {readFile,writeFile,mkdir,copyFile,access} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import Eleventy from '@11ty/eleventy';
import {root,buildShells} from './build-site-shells.mjs';
const out=resolve(process.argv[2]||'../integration-build'),pkg=resolve(root,'.github/article-components');
if(out===root||out.startsWith(root+sep)||root.startsWith(out+sep))throw Error('Use a separate review output tree');
await mkdir(out,{recursive:true});
const config=JSON.parse(await readFile(resolve(pkg,'integration.json'),'utf8'));
const targets=config.targets||config.representatives;
if(new Set(targets).size!==targets.length)throw Error('Duplicate target URL');
const run=(program,args)=>{const result=spawnSync(program,args,{cwd:root,encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'}});if(result.stdout)process.stdout.write(result.stdout);if(result.status!==0)throw Error(result.stderr||'Build failed');};
await buildShells({check:true,verifyBaseline:true});
run(process.execPath,['scripts/preview-site-shell-ui.mjs',resolve(out,'headers'),resolve(pkg,'integration.json')]);
run(process.env.PYTHON_EXECUTABLE||(process.platform==='win32'?'python':'python3'),['scripts/prepare-article-components.py','--headers',resolve(out,'headers'),'--out',out]);
const pages=JSON.parse(await readFile(resolve(out,'pages.json'),'utf8'));
const eleventy=new Eleventy(resolve(pkg,'end/page.njk'),resolve(out,'.render'),{configPath:false,quietMode:true,config:c=>{c.addGlobalData('integratedPages',pages);c.setNunjucksEnvironmentOptions({throwOnUndefined:true,autoescape:true});}});
const rendered=await eleventy.toJSON();if(rendered.length!==pages.length)throw Error('Incomplete integrated render');
const candidate=resolve(out,'candidate'),review=resolve(out,'review'),pending=[];
for(const result of rendered){
  const path=result.url.replace(/^\//,'');if(!targets.includes(path))throw Error('Unexpected output: '+path);
  let html=result.content;
  // One source career page lacks the shared search loader. The common header
  // requires it; the original feedback loader has its own duplicate guard.
  if(!/<script\b[^>]*src=["'][^"']*site-search\.js/i.test(html))html=html.replace('</body>','<script src="/assets/js/site-search.js" defer data-integration-added="search"></script></body>');
  html=html.replace('</head>','<link rel="stylesheet" href="/assets/css/article-end-related.css">'+(!path.startsWith('en/')?'<link rel="stylesheet" href="/assets/css/article-end-feedback.css">':'')+'<link rel="stylesheet" href="/assets/css/article-integration-compat.css"></head>').replace('</body>','<script src="/assets/js/article-integration-compat.js" defer></script></body>');
  if(!path.startsWith('en/')&&(html.match(/id="articleFeedbackCard"/g)||[]).length!==1)throw Error('Japanese feedback count invalid');
  if(path.startsWith('en/')&&html.includes('id="articleFeedbackCard"'))throw Error('English feedback forbidden');
  pending.push([path,html]);
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
await writeFile(resolve(out,'build.json'),JSON.stringify({version:config.version,sourceCommit:config.sourceCommit,mainCommit:config.mainCommit,representatives:config.representatives,targets,assetMode:process.env.REVIEW_COPY_ASSETS==='0'?'source-fallback':'copied',sourceModified:false,productionPublished:false,missingAssets:missing},null,2));
console.log(JSON.stringify({pages:pending.length,candidate,review,missingAssets:missing.length}));
