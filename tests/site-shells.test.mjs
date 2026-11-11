import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { root, sourceDir, renderShells, buildShells, replaceShells } from '../scripts/build-site-shells.mjs';
import { playwright155EnclosingRect, collectShellGeometry } from '../scripts/site-shell-geometry.mjs';
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

test('geometry diagnostics expose fractional origin without changing element height',()=>{
  const a={x:0,y:1000.25,width:390,height:207.46875};
  const b={...a,y:1000.75};
  assert.equal(playwright155EnclosingRect(a).height,208);
  assert.equal(playwright155EnclosingRect(b).height,209);
  assert.equal(a.height,b.height);
  assert.deepEqual(playwright155EnclosingRect({x:0.0001,y:10.0001,width:390,height:208}),{x:0,y:10,width:390,height:208});
});

test('geometry diagnostics match the installed pinned Playwright rounding',async()=>{
  const { createRequire }=await import('node:module');
  const require=createRequire(import.meta.url);
  const playwrightRequire=createRequire(require.resolve('playwright/package.json'));
  const packagePath=playwrightRequire.resolve('playwright-core/package.json');
  assert.equal(playwrightRequire(packagePath).version,'1.55.0');
  const {helper}=playwrightRequire(resolve(dirname(packagePath),'lib/server/helper.js'));
  for(let i=0;i<128;i++){
    const rect={x:i/64,y:1000+i/64,width:390,height:207.46875};
    assert.deepEqual(playwright155EnclosingRect(rect),helper.enclosingIntRect(rect));
  }
});

test('geometry collector adds scroll offset and records read-only measurements',async()=>{
  const measured={rect:{x:0,y:636.25,width:390,height:207.46875},scroll:{x:0,y:12345},viewport:{width:390,height:844,devicePixelRatio:1},boxes:[]};
  const original=JSON.stringify(measured);
  const page={locator(selector){assert.equal(selector,'footer.site-footer');return {async evaluate(){return measured;}};}};
  const result=await collectShellGeometry(page,'footer.site-footer');
  assert.equal(result.status,'measured');
  assert.equal(result.documentRect.y,12981.25);
  assert.equal(result.predictedPlaywright155Clip.height,208);
  assert.equal(JSON.stringify(measured),original);
});

test('unavailable or invalid diagnostic measurements do not alter the audit verdict',async()=>{
  for(const evaluate of [async()=>{throw Error('measurement unavailable');},async()=>({rect:{x:NaN,y:0,width:390,height:208},scroll:{x:0,y:0}})]){
    const result=await collectShellGeometry({locator:()=>({evaluate})},'footer.site-footer');
    assert.equal(result.status,'unavailable');
    assert.equal('pixels' in result,false);
    assert.equal('approvedChange' in result,false);
  }
});
