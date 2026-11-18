// Storage-only splitting: preserve every source file and verify all groups after download.
import {readFile,writeFile,mkdir,readdir,lstat,copyFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {createHash} from 'node:crypto';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
import {loadIntegrationScope} from './integration-review-scope.mjs';
import {validateIntegrationImages} from './integration-image-contract.mjs';
const GROUPS=['normal','light','dark'];
export const MAX_GROUP_BYTES=480*1024*1024; // Raw-byte cap leaves room under the 512 MiB ZIP transport ceiling.
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const manifestName=i=>`evidence-shard-${i}-manifest.json`;
const receiptName=(i,g)=>`evidence-shard-${i}-${g}-receipt.json`;
const groupFor=p=>p.endsWith('--light-full.png')?'light':/--dark-(?:full|failure)\.png$/.test(p)?'dark':'normal';
export async function stageEvidence(root,stageRoot,index,shardCount) {
  if(!Number.isSafeInteger(index)||index<0||!Number.isSafeInteger(shardCount)||index>=shardCount)throw Error('Invalid artifact shard');
  const paths=[];
  const dir=`evidence-shard-${index}`;
  for(const name of (await readdir(resolve(root,dir))).sort())paths.push(`${dir}/${name}`);
  for(const name of [`browser-checks-shard-${index}.json`,`article-dark-checks-shard-${index}.json`]){
    try{await lstat(resolve(root,name));paths.push(name);}catch(e){if(e.code!=='ENOENT')throw e;}
  }
  const files=[];
  for(const path of paths){
    const info=await lstat(resolve(root,path));if(!info.isFile())throw Error('Non-regular artifact source: '+path);
    const bytes=await readFile(resolve(root,path));
    files.push({path,group:groupFor(path),size:bytes.length,sha256:digest(bytes)});
  }
  const manifest={version:1,shardIndex:index,shardCount,groups:GROUPS,files};
  const manifestBytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n'),manifestSha256=digest(manifestBytes),summaries=[];
  for(const group of GROUPS){
    const target=resolve(stageRoot,group);await mkdir(target,{recursive:true});
    const selected=files.filter(f=>f.group===group);
    for(const f of selected){await mkdir(dirname(resolve(target,f.path)),{recursive:true});await copyFile(resolve(root,f.path),resolve(target,f.path));}
    if(group==='normal')await writeFile(resolve(target,manifestName(index)),manifestBytes);
    const receipt={version:1,shardIndex:index,shardCount,group,manifestSha256,files:selected};
    const receiptBytes=Buffer.from(JSON.stringify(receipt,null,2)+'\n');
    await writeFile(resolve(target,receiptName(index,group)),receiptBytes);
    const rawBytes=selected.reduce((sum,f)=>sum+f.size,0)+receiptBytes.length+(group==='normal'?manifestBytes.length:0);
    summaries.push({group,files:selected.length,rawBytes,limitBytes:MAX_GROUP_BYTES});
  }
  await writeFile(resolve(stageRoot,'split-summary.json'),JSON.stringify({shardIndex:index,groups:summaries},null,2));
  if(summaries.some(x=>x.rawBytes>=MAX_GROUP_BYTES))throw Error('Artifact group exceeds conservative 480 MiB cap: '+JSON.stringify(summaries));
  return {shardIndex:index,groups:summaries};
}
export async function assembleEvidence(downloadRoot,root,shardCount) {
  const folders=await readdir(downloadRoot),groups=new Map(),filesSeen=new Set(),copies=[];
  if(folders.length!==shardCount*3)throw Error('Missing/extra artifact group directories');
  let runId=null;
  async function listFiles(dir,prefix=''){
    const list=[];
    for(const name of await readdir(resolve(dir,prefix))){
      const path=prefix?prefix+'/'+name:name,info=await lstat(resolve(dir,path));
      if(info.isSymbolicLink())throw Error('Symlink in artifact');
      if(info.isDirectory())list.push(...await listFiles(dir,path));
      else if(info.isFile())list.push(path);else throw Error('Non-regular artifact entry');
    }
    return list.sort();
  }
  for(const folder of folders){
    const match=/^integrated-shard-(\d+)-(normal|light|dark)-(\d+)$/.exec(folder);
    if(!match||Number(match[1])>=shardCount)throw Error('Invalid artifact directory: '+folder);
    const index=Number(match[1]),group=match[2],key=index+'|'+group;
    if(groups.has(key)||(runId!==null&&runId!==match[3]))throw Error('Duplicate/mixed-run artifact group');
    runId=match[3];groups.set(key,folder);
    const dir=resolve(downloadRoot,folder),receipt=JSON.parse(await readFile(resolve(dir,receiptName(index,group)),'utf8'));
    if(receipt.shardIndex!==index||receipt.shardCount!==shardCount||receipt.group!==group||!Array.isArray(receipt.files))throw Error('Artifact group identity mismatch');
    const expected=[receiptName(index,group),...receipt.files.map(f=>f.path),...(group==='normal'?[manifestName(index)]:[])].sort();
    const actual=await listFiles(dir);
    if(!equal(expected,actual)||new Set(expected).size!==expected.length)throw Error('Group payload differs from receipt');
    for(const path of actual){if(filesSeen.has(path))throw Error('Duplicate payload across artifact groups: '+path);filesSeen.add(path);copies.push({from:resolve(dir,path),to:resolve(root,path)});}
  }
  for(let i=0;i<shardCount;i++)for(const group of GROUPS)if(!groups.has(i+'|'+group))throw Error('Missing artifact group');
  // Never merge by overwriting: group inventories are checked before materialization.
  for(const file of copies){await mkdir(dirname(file.to),{recursive:true});await copyFile(file.from,file.to,constants.COPYFILE_EXCL);}
  return {groups:groups.size,files:copies.length,runId};
}
export function validateDarkReports(targets,reports,shardCount) {
  if(reports.length!==shardCount)throw Error('Missing dark report shard');
  const files=[];
  for(let i=0;i<shardCount;i++){
    const r=reports[i],assigned=targets.filter((_,j)=>j%shardCount===i);
    if(r?.shardIndex!==i||r.shardCount!==shardCount||!equal([...r.targets].sort(),[...assigned].sort())||!equal(r.widths,[390,1440])||!Array.isArray(r.failures)||r.failures.length||!Array.isArray(r.results))throw Error('Invalid/incomplete dark report shard '+i);
    const expected=new Map(assigned.flatMap(p=>[390,1440].map(width=>[`${p}|${width}`,p.replaceAll('/','__').replace('.html','')+`--${width}--dark-full.png`]))),seen=new Set();
    for(const result of r.results){const key=`${result.path}|${result.width}`,file=expected.get(key);if(!file||result.status!=='passed'||result.screenshot!==file||seen.has(key))throw Error('Invalid/duplicate dark screenshot case: '+key);seen.add(key);files.push(`evidence-shard-${i}/${file}`);}
    if(seen.size!==expected.size)throw Error('Missing dark screenshot cases in shard '+i);
  }
  return files;
}
export async function verifyEvidence(root,targets,shardCount) {
  const allFiles=new Map(),lightReports=[],darkReports=[],summaries=[];
  for(let i=0;i<shardCount;i++){
    const bytes=await readFile(resolve(root,manifestName(i))),m=JSON.parse(bytes);
    if(m.version!==1||m.shardIndex!==i||m.shardCount!==shardCount||!equal(m.groups,GROUPS)||!Array.isArray(m.files))throw Error('Artifact manifest identity mismatch');
    for(const group of GROUPS){
      const receiptBytes=await readFile(resolve(root,receiptName(i,group))),r=JSON.parse(receiptBytes),selected=m.files.filter(f=>f.group===group);
      if(r.version!==1||r.shardIndex!==i||r.shardCount!==shardCount||r.group!==group||r.manifestSha256!==digest(bytes)||!equal(r.files,selected))throw Error('Artifact group receipt mismatch');
      const rawBytes=selected.reduce((n,f)=>n+f.size,0)+receiptBytes.length+(group==='normal'?bytes.length:0);
      if(rawBytes>=MAX_GROUP_BYTES)throw Error('Artifact group exceeds size contract');
      summaries.push({shardIndex:i,group,rawBytes,files:selected.length});
    }
    for(const f of m.files){
      const valid=f.path===`browser-checks-shard-${i}.json`||f.path===`article-dark-checks-shard-${i}.json`||new RegExp(`^evidence-shard-${i}/[^/\\\\]+\\.png$`).test(f.path);
      if(!valid||f.path.includes('..')||!GROUPS.includes(f.group)||f.group!==groupFor(f.path)||!Number.isSafeInteger(f.size)||f.size<1||!/^[a-f0-9]{64}$/.test(f.sha256)||allFiles.has(f.path))throw Error('Invalid/duplicate artifact entry: '+f.path);
      const info=await lstat(resolve(root,f.path));if(!info.isFile())throw Error('Non-regular artifact payload');
      const content=await readFile(resolve(root,f.path));if(content.length!==f.size||digest(content)!==f.sha256)throw Error('Artifact payload hash mismatch: '+f.path);
      allFiles.set(f.path,f);
    }
    const actual=(await readdir(resolve(root,`evidence-shard-${i}`))).map(f=>`evidence-shard-${i}/${f}`).sort();
    const declared=m.files.filter(f=>f.path.startsWith(`evidence-shard-${i}/`)).map(f=>f.path).sort();
    if(!equal(actual,declared))throw Error('Undeclared/missing artifact payload');
    for(const name of [`browser-checks-shard-${i}.json`,`article-dark-checks-shard-${i}.json`])if(!allFiles.has(name))throw Error('Missing declared report: '+name);
    lightReports.push(JSON.parse(await readFile(resolve(root,`browser-checks-shard-${i}.json`),'utf8')));
    darkReports.push(JSON.parse(await readFile(resolve(root,`article-dark-checks-shard-${i}.json`),'utf8')));
  }
  validateIntegrationImages(targets,lightReports,shardCount);
  const expected=[...validateDarkReports(targets,darkReports,shardCount),...lightReports.flatMap(r=>r.images.map(image=>`evidence-shard-${r.shardIndex}/${image.file}`))].sort();
  const actual=[...allFiles.keys()].filter(p=>p.endsWith('.png')).sort();
  if(!equal(expected,actual)||new Set(expected).size!==expected.length)throw Error('Screenshot report/file coverage mismatch');
  return {status:'passed',shards:shardCount,groups:summaries,files:allFiles.size,screenshots:expected.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const [mode,root,arg,count]=process.argv.slice(2);
  if(mode==='stage')console.log(JSON.stringify(await stageEvidence(resolve(root),resolve(arg),Number(process.env.REVIEW_SHARD_INDEX),Number(process.env.REVIEW_SHARD_COUNT))));
  else if(mode==='verify'||mode==='assemble'){
    const config=JSON.parse(await readFile('.github/article-components/integration.json','utf8'));
    const build=mode==='assemble'?resolve(arg):resolve(root),shards=Number(mode==='assemble'?count||6:arg||6);
    if(mode==='assemble')await assembleEvidence(resolve(root),build,shards);
    const scope=await loadIntegrationScope(config);
    const result=await verifyEvidence(build,scope.targets,shards);
    await writeFile(resolve(build,'evidence-artifact-checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
  }else throw Error('Use stage BUILD STAGING, verify BUILD SHARDS, or assemble DOWNLOADS BUILD SHARDS');
}
