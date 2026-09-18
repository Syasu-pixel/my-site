import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,mkdir,cp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,dirname,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {loadHeroRenderer} from '../scripts/build-article-heroes.mjs';
const root=resolve(import.meta.dirname,'..'),pkg='.github/article-components/hero';
const python=process.env.PYTHON_EXECUTABLE||(process.platform==='win32'?'python':'python3');
async function fixture(){
 const dir=await mkdtemp(resolve(tmpdir(),'dc-hero-')),base=resolve(dir,'source'),plan=resolve(dir,'plan.json');
 await mkdir(base);await cp(resolve(root,pkg),resolve(base,pkg),{recursive:true});
 for(const file of ['scripts/prepare-article-heroes.py','.github/article-components/sidebar/html_spans.py']){await mkdir(dirname(resolve(base,file)),{recursive:true});await cp(resolve(root,file),resolve(base,file));}
 const manifest=JSON.parse(await readFile(resolve(base,pkg,'manifest.json'),'utf8'));
 for(const path of manifest.targets){await mkdir(dirname(resolve(base,path)),{recursive:true});await cp(resolve(root,path),resolve(base,path));}
 const extract=()=>{const r=spawnSync(python,[resolve(base,'scripts/prepare-article-heroes.py'),'--out',plan],{encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'}});return r;};
 assert.equal(extract().status,0);return {dir,base,plan,manifest,extract};
}
test('lossless extraction/render, shared propagation and fail-closed boundaries',async()=>{
 const f=await fixture();try{
  const renderer=await loadHeroRenderer(f.plan,f.base);const originals=new Map();
  for(const path of f.manifest.targets){const old=await readFile(resolve(f.base,path),'utf8');originals.set(path,old);assert.equal(renderer.apply(old,path),old,path);}
  assert.equal(renderer.apply('<html>unregistered</html>','index.html'),'<html>unregistered</html>');
  const template=resolve(f.base,pkg,'hero.njk'),oldTemplate=await readFile(template,'utf8');
  await writeFile(template,oldTemplate.replace('{{ h.open | safe }}','{{ h.open | safe }}<!--hero-propagation-probe-->'));
  const changed=await loadHeroRenderer(f.plan,f.base);
  for(const [path,old]of originals){const result=changed.apply(old,path);assert.equal((result.match(/hero-propagation-probe/g)||[]).length,1);assert.equal(result.replace('<!--hero-propagation-probe-->',''),old);}
  assert.equal(changed.apply('outside','articles/plc-drilling-line-design-project-03.html'),'outside');
  await writeFile(template,oldTemplate);
  const data=JSON.parse(await readFile(f.plan,'utf8'));
  const users=new Map();for(const p of data.pages)for(const s of p.styles)for(const slot of s.slots){if(!users.has(slot.template))users.set(slot.template,new Set());users.get(slot.template).add(p.path);}
  const [profile,affected]=[...users].find(([,paths])=>paths.size>1);assert.ok(profile);
  const cssFile=resolve(f.base,pkg,profile),css=await readFile(cssFile,'utf8');await writeFile(cssFile,css+'/*shared-css-probe*/');
  const cssRenderer=await loadHeroRenderer(f.plan,f.base);
  for(const [path,old]of originals){const result=cssRenderer.apply(old,path);assert.equal(result.includes('shared-css-probe'),affected.has(path));assert.equal(result.replaceAll('/*shared-css-probe*/',''),old);}
  await writeFile(cssFile,css);
  const first=f.manifest.targets[0],source=resolve(f.base,first),old=originals.get(first);
  await writeFile(source,old.replace('class="hero-lead"','class="unsupported-lead"'));assert.notEqual(f.extract().status,0);
  await writeFile(source,old.replace('.article-hero{','.article-hero{outline:0;'));assert.notEqual(f.extract().status,0);
  await writeFile(source,old+'\n');await assert.rejects(()=>loadHeroRenderer(f.plan,f.base),/Source changed/);
  await writeFile(source,old);assert.equal(f.extract().status,0);
  const duplicate={...f.manifest,targets:[...f.manifest.targets,first]};await writeFile(resolve(f.base,pkg,'manifest.json'),JSON.stringify(duplicate));assert.notEqual(f.extract().status,0);
  console.log(JSON.stringify({pages:originals.size,htmlExact:true,sharedTemplatePropagation:originals.size,sharedCssAffected:[...affected],outsideScopeUnchanged:true,negativeChecks:['unknown-field','stale-css','stale-source','duplicate-target']}));
 }finally{assert.ok(resolve(f.dir).startsWith(resolve(tmpdir())+sep+'dc-hero-'));await rm(f.dir,{recursive:true,force:true});}
});
