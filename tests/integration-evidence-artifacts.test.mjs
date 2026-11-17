import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,cp,readdir} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {expectedIntegrationImages} from '../scripts/integration-image-contract.mjs';
import {stageEvidence,assembleEvidence,verifyEvidence,validateDarkReports,MAX_GROUP_BYTES} from '../scripts/integration-evidence-artifacts.mjs';
const targets=['articles/a.html'];
function dark(){return [{shardIndex:0,shardCount:1,targets,widths:[390,1440],failures:[],results:[390,1440].map(width=>({path:targets[0],width,status:'passed',screenshot:`articles__a--${width}--dark-full.png`}))}];}
async function setup(){
 const temp=await mkdtemp(join(tmpdir(),'split-evidence-')),source=join(temp,'source'),stage=join(temp,'stage'),downloads=join(temp,'downloads'),output=join(temp,'output');
 await mkdir(join(source,'evidence-shard-0'),{recursive:true});await mkdir(downloads);await mkdir(output);
 const light={shardIndex:0,shardCount:1,targets,images:expectedIntegrationImages(targets,{includeService:true})},d=dark()[0];
 for(const file of [...light.images.map(x=>x.file),...d.results.map(x=>x.screenshot)])await writeFile(join(source,'evidence-shard-0',file),'PNG bytes '+file);
 await writeFile(join(source,'browser-checks-shard-0.json'),JSON.stringify(light));await writeFile(join(source,'article-dark-checks-shard-0.json'),JSON.stringify(d));
 const summary=await stageEvidence(source,stage,0,1);
 for(const group of ['normal','light','dark'])await cp(join(stage,group),join(downloads,`integrated-shard-0-${group}-123`),{recursive:true});
 return {temp,source,stage,downloads,output,summary};
}
async function trial(fn){const f=await setup();try{await fn(f);}finally{await rm(f.temp,{recursive:true,force:true});}}
test('all three groups round trip without deleting source, with separate light/dark contracts',()=>trial(async f=>{
 const before=await readdir(join(f.source,'evidence-shard-0'));
 await assembleEvidence(f.downloads,f.output,1);const result=await verifyEvidence(f.output,targets,1);
 assert.equal(result.status,'passed');assert.equal(result.screenshots,24);assert.equal(result.groups.length,3);
 assert.ok(f.summary.groups.every(g=>g.rawBytes<MAX_GROUP_BYTES));assert.deepEqual(await readdir(join(f.source,'evidence-shard-0')),before);
 for(const file of before)assert.deepEqual(await readFile(join(f.output,'evidence-shard-0',file)),await readFile(join(f.source,'evidence-shard-0',file)));
}));
test('missing complete group rejected before assembly',()=>trial(async f=>{await rm(join(f.downloads,'integrated-shard-0-dark-123'),{recursive:true});await assert.rejects(assembleEvidence(f.downloads,f.output,1),/Missing\/extra/);}));
test('unknown duplicate physical file in another group rejected before overwrite',()=>trial(async f=>{const group=join(f.downloads,'integrated-shard-0-dark-123','evidence-shard-0');await writeFile(join(group,'service--390--header.png'),'duplicate');await assert.rejects(assembleEvidence(f.downloads,f.output,1),/payload differs/);}));
test('missing physical screenshot rejected before assembly',()=>trial(async f=>{await rm(join(f.downloads,'integrated-shard-0-light-123/evidence-shard-0/articles__a--390--light-full.png'));await assert.rejects(assembleEvidence(f.downloads,f.output,1),/payload differs/);}));
test('tampered image detected by SHA not just size',()=>trial(async f=>{const path=join(f.downloads,'integrated-shard-0-light-123/evidence-shard-0/articles__a--390--light-full.png'),b=await readFile(path);b[0]^=1;await writeFile(path,b);await assembleEvidence(f.downloads,f.output,1);await assert.rejects(verifyEvidence(f.output,targets,1),/hash mismatch/);}));
test('tampered receipt manifest identity rejected',()=>trial(async f=>{await assembleEvidence(f.downloads,f.output,1);const p=join(f.output,'evidence-shard-0-dark-receipt.json'),r=JSON.parse(await readFile(p));r.manifestSha256='0'.repeat(64);await writeFile(p,JSON.stringify(r));await assert.rejects(verifyEvidence(f.output,targets,1),/receipt mismatch/);}));
test('same output cannot overwrite an earlier assembly',()=>trial(async f=>{await assembleEvidence(f.downloads,f.output,1);await assert.rejects(assembleEvidence(f.downloads,f.output,1),/EEXIST/);}));
test('unexpected unmanifested payload detected after download',()=>trial(async f=>{await assembleEvidence(f.downloads,f.output,1);await writeFile(join(f.output,'evidence-shard-0/extra.png'),'extra');await assert.rejects(verifyEvidence(f.output,targets,1),/Undeclared/);}));
test('incomplete light report cannot pass split integrity alone',()=>trial(async f=>{const p=join(f.source,'browser-checks-shard-0.json'),r=JSON.parse(await readFile(p));r.images.pop();await writeFile(p,JSON.stringify(r));await rm(f.stage,{recursive:true});await rm(f.downloads,{recursive:true});await mkdir(f.downloads);await stageEvidence(f.source,f.stage,0,1);for(const g of ['normal','light','dark'])await cp(join(f.stage,g),join(f.downloads,`integrated-shard-0-${g}-123`),{recursive:true});await assembleEvidence(f.downloads,f.output,1);await assert.rejects(verifyEvidence(f.output,targets,1),/Missing screenshot/);}));
test('dark coverage is separate and exact',()=>{assert.equal(validateDarkReports(targets,dark(),1).length,2);for(const mutate of [r=>r[0].results.pop(),r=>r[0].results.push(r[0].results[0]),r=>r[0].widths=[390],r=>r[0].failures.push({error:'failed'}),r=>r[0].results[0].screenshot='wrong.png',r=>r[0].targets=[]]){const r=dark();mutate(r);assert.throws(()=>validateDarkReports(targets,r,1));}});
test('raw group size contract stays below ZIP transport ceiling',()=>assert.ok(MAX_GROUP_BYTES<512*1024*1024));
test('declared duplicate across groups is rejected before overwrite',()=>trial(async f=>{const dir=join(f.downloads,'integrated-shard-0-dark-123'),receipt=join(dir,'evidence-shard-0-dark-receipt.json'),r=JSON.parse(await readFile(receipt));const source=join(f.downloads,'integrated-shard-0-light-123'),light=JSON.parse(await readFile(join(source,'evidence-shard-0-light-receipt.json'))),entry=light.files[0];r.files.push(entry);await writeFile(receipt,JSON.stringify(r));await cp(join(source,entry.path),join(dir,entry.path));await assert.rejects(assembleEvidence(f.downloads,f.output,1),/Duplicate payload/);}));
test('declared over-limit group is rejected independently of payload hashes',()=>trial(async f=>{await assembleEvidence(f.downloads,f.output,1);const {createHash}=await import('node:crypto'),p=join(f.output,'evidence-shard-0-manifest.json'),m=JSON.parse(await readFile(p));m.files.find(x=>x.group==='light').size=MAX_GROUP_BYTES;const bytes=Buffer.from(JSON.stringify(m));await writeFile(p,bytes);for(const g of ['normal','light','dark']){const q=join(f.output,`evidence-shard-0-${g}-receipt.json`),r=JSON.parse(await readFile(q));r.manifestSha256=createHash('sha256').update(bytes).digest('hex');r.files=m.files.filter(x=>x.group===g);await writeFile(q,JSON.stringify(r));}await assert.rejects(verifyEvidence(f.output,targets,1),/size contract/);}));
