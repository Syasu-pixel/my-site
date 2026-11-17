import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {resolve,dirname} from 'node:path';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
const sha=s=>createHash('sha256').update(s).digest('hex');
const script=resolve('scripts/check-donation-main-diff.mjs');
const homeCss='<style data-donation-hidden="home">.support-card{display:none!important}</style>';
const categoryCss='\n/* Reversible donation-card visibility for category pages. */\n.support-card{display:none!important}\n';
const footer='<footer><nav class="dc-footer-profile-link" aria-label="サイト運営情報">\n    <a href="/profile/">運営者・編集方針</a>\n  </nav>\n  </footer>';
for(const variant of ['unchanged','reviewed navigation','missing approval','wrong source','wrong candidate','header change','footer change','donation removed','donation doubled','article css change','category css change','unreviewed service','inventory change','duplicate approval','duplicate fragment','gx positive','gx candidate extra','gx duplicate old','unchanged candidate extra'])test('real CLI '+variant,async()=>{
 const oldLink='<a href="mailto:kds_kurata@hm.aitai.ne.jp" style="color:#1d4ed8;font-weight:800;overflow-wrap:anywhere">通常のお問い合わせ（メール）</a>';
 const newLink='<a href="/contact/" style="color:#1d4ed8;font-weight:800;overflow-wrap:anywhere">通常のお問い合わせ</a>';
 const gxAfter=await readFile('services/gxworks2-online-support.html','utf8');
 const dir=await mkdtemp(resolve(tmpdir(),'donation-check-')),roots=['base','base-out','head','head-out'].map(x=>resolve(dir,x));
 const paths=['index.html','categories/control-basics.html','services/gxworks2-online-support.html'];
 const sources=Object.fromEntries(paths.map(p=>[p,'<html><header>header</header><main>'+ (p==='index.html'?'OLD LATEST':p.includes('categories')?'OLD CATEGORY':'UNCHANGED SERVICE')+'</main>'+footer+'</html>']));
 const contract={version:1,changes:paths.slice(0,2).map(p=>({path:p,beforeSourceSha256:sha(sources[p]),afterSourceSha256:sha(sources[p].replace('OLD ','NEW ')),before:p==='index.html'?'OLD LATEST':'OLD CATEGORY',after:p==='index.html'?'NEW LATEST':'NEW CATEGORY'}))};
 const put=async(root,p,s)=>{await mkdir(dirname(resolve(root,p)),{recursive:true});await writeFile(resolve(root,p),s);};
 for(const [i,root] of roots.entries()){
  const head=i>=2,out=i%2===1;
  if(!out){await put(root,'.github/site-shells/additional/manifest.json',JSON.stringify({pages:paths.map(path=>({path}))}));await put(root,'.github/article-components/integration-compat.css','stable article donation');await put(root,'.github/site-shells/additional/category.css',categoryCss);await put(root,'.github/site-shells/additional/reviewed-navigation-deltas.json',JSON.stringify(contract));}
  for(const path of paths){let s=sources[path];if(head&&!['unchanged','unchanged candidate extra'].includes(variant)&&path!=='services/gxworks2-online-support.html')s=s.replace('OLD ','NEW ');if(variant.startsWith('gx ')&&path==='services/gxworks2-online-support.html')s=out?'<html><header>header</header><main id="consultation-paused-title">'+(head?newLink:oldLink)+'</main>'+footer+'</html>':head?gxAfter:gxAfter.replace(newLink,oldLink);if(out)s+=(path==='index.html'?homeCss:path.includes('categories')?categoryCss:'');await put(root,(out?'candidate/':'')+path,s);}
 }
 const alter=async(root,path,fn)=>{const {readFile}=await import('node:fs/promises');await put(root,path,fn(await readFile(resolve(root,path),'utf8')));};
 if(variant==='duplicate approval')await put(roots[2],'.github/site-shells/additional/reviewed-navigation-deltas.json',JSON.stringify({version:1,changes:[...contract.changes,contract.changes[0]]}));
 if(variant==='duplicate fragment')await alter(roots[1],'candidate/index.html',s=>s+'OLD LATEST');
 if(variant==='gx candidate extra')await alter(roots[3],'candidate/services/gxworks2-online-support.html',s=>s+'bad');
 if(variant==='gx duplicate old')await alter(roots[1],'candidate/services/gxworks2-online-support.html',s=>s+oldLink);
 if(variant==='missing approval')await put(roots[2],'.github/site-shells/additional/reviewed-navigation-deltas.json',JSON.stringify({version:1,changes:[]}));
 if(variant==='wrong source')await alter(roots[2],'index.html',s=>s+'bad');
 if(variant==='unchanged candidate extra')await alter(roots[3],'candidate/index.html',s=>s+'bad');
 if(variant==='wrong candidate')await alter(roots[3],'candidate/index.html',s=>s+'bad');
 if(variant==='header change')await alter(roots[3],'candidate/index.html',s=>s.replace('header</header>','changed</header>'));
 if(variant==='footer change')await alter(roots[3],'candidate/index.html',s=>s.replace('</footer>','bad</footer>'));
 if(variant==='donation removed')await alter(roots[3],'candidate/index.html',s=>s.replace(homeCss,''));
 if(variant==='donation doubled')await alter(roots[3],'candidate/index.html',s=>s+homeCss);
 if(variant==='article css change')await put(roots[2],'.github/article-components/integration-compat.css','changed');
 if(variant==='category css change')await put(roots[2],'.github/site-shells/additional/category.css',categoryCss+'changed');
 if(variant==='unreviewed service')await alter(roots[2],'services/gxworks2-online-support.html',s=>s+'changed');
 if(variant==='inventory change')await put(roots[2],'.github/site-shells/additional/manifest.json',JSON.stringify({pages:paths.slice(0,2).map(path=>({path}))}));
 const r=spawnSync(process.execPath,[script,...roots],{encoding:'utf8'});assert.equal(r.status,['unchanged','reviewed navigation','gx positive'].includes(variant)?0:1,r.stdout+r.stderr);if(r.status===0)assert.equal(JSON.parse(r.stdout).updatedServiceLinks,variant==='gx positive'?1:0);await rm(dir,{recursive:true});
});
