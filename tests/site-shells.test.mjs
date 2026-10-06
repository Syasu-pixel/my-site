import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { root, sourceDir, renderShells, buildShells, replaceShells } from '../scripts/build-site-shells.mjs';
test('registered pages preserve every byte outside header/footer',async()=>{
  const {results}=await renderShells();
  for(const [path,bytes]of results){
    const original=await readFile(resolve(root,path),'utf8');
    const strip=s=>s.replace(/<header\b[^>]*>[\s\S]*?<\/header>/,'HEADER').replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/,'FOOTER');
    assert.equal(strip(bytes.toString()),strip(original),path);
  }
});
async function fixture(fn){
  const dir=await mkdtemp(resolve(root,'shell-test-'));
  try{
    const engine=resolve(dir,sourceDir);await cp(resolve(root,sourceDir),engine,{recursive:true});
    const manifest=JSON.parse(await readFile(resolve(engine,'manifest.json'),'utf8'));manifest.scope='pilot';
    const first=manifest.pages[0],second=manifest.pages.find(p=>p.output!==first.output&&p.headerTemplate===first.headerTemplate),other=manifest.pages.find(p=>p.headerTemplate!==first.headerTemplate);
    assert.ok(second&&other);manifest.pages=[first,second,other];await writeFile(resolve(engine,'manifest.json'),JSON.stringify(manifest));
    for(const page of manifest.pages){await mkdir(dirname(resolve(dir,page.output)),{recursive:true});await cp(resolve(root,page.output),resolve(dir,page.output));}
    await fn(dir,engine,manifest);
  }finally{await rm(dir,{recursive:true,force:true});}
}
test('shared edit reaches its users only; stale output fails check',async()=>fixture(async(dir,engine,manifest)=>{
  const first=manifest.pages[0],component=resolve(engine,first.headerTemplate);const original=await readFile(component,'utf8');
  await writeFile(component,original.replace('<header ','<header data-shared-test="yes" '));const {results}=await renderShells(dir);
  assert.ok(results.get(first.output).toString().includes('data-shared-test'));
  assert.ok(results.get(manifest.pages[1].output).toString().includes('data-shared-test'));
  assert.ok(!results.get(manifest.pages[2].output).toString().includes('data-shared-test'));
  await assert.rejects(buildShells({base:dir,check:true}),/stale/);
}));
test('undefined values, missing includes and duplicate URLs fail before writes',async()=>fixture(async(dir,engine,manifest)=>{
  const source=resolve(engine,manifest.pages[0].headerTemplate),original=await readFile(source,'utf8'),before=await readFile(resolve(dir,manifest.pages[0].output));
  await writeFile(source,original+'{{ missing.requiredValue }}');await assert.rejects(buildShells({base:dir}));
  assert.deepEqual(await readFile(resolve(dir,manifest.pages[0].output)),before);
  await writeFile(source,'{% include "missing-component.njk" %}');await assert.rejects(buildShells({base:dir}));await writeFile(source,original);
  manifest.pages.push(manifest.pages[0]);await writeFile(resolve(engine,'manifest.json'),JSON.stringify(manifest));await assert.rejects(renderShells(dir),/Duplicate/);
}));
test('unregistered articles and path escape fail',async()=>fixture(async(dir,engine,manifest)=>{
  manifest.scope='all-articles';await writeFile(resolve(engine,'manifest.json'),JSON.stringify(manifest));
  await mkdir(resolve(dir,'en/articles'),{recursive:true});await mkdir(resolve(dir,'articles'),{recursive:true});await writeFile(resolve(dir,'articles/unregistered.html'),'test');
  await assert.rejects(renderShells(dir),/inventory/);
  manifest.pages[0].output='../escape.html';await writeFile(resolve(engine,'manifest.json'),JSON.stringify(manifest));await assert.rejects(renderShells(dir),/Invalid article/);
}));
test('malformed or ambiguous markup fails',()=>{
  assert.throws(()=>replaceShells('<header></header><footer></footer>','<header></header>','<footer></footer>'));
  assert.throws(()=>replaceShells('<header class="site-header"></header><header></header><footer class="site-footer"></footer>','<header></header>','<footer></footer>'));
});
