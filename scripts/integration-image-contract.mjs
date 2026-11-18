// Light-mode browser evidence only. Dark-mode reports have a separate contract.
import {lstat} from 'node:fs/promises';
import {resolve} from 'node:path';
export const ARTICLE_IMAGE_PARTS=Object.freeze(['light-full','after-header','toc-open','after-end','before-header','before-end','intentional-diff-header','intentional-diff-end']);
const articlePath=/^(?:articles|en\/articles)\/[^/]+\.html$/;
export function expectedIntegrationImages(targets,{includeService=false}={}) {
  if(!Array.isArray(targets)||new Set(targets).size!==targets.length||targets.some(p=>typeof p!=='string'||!articlePath.test(p)||p.includes('..')||/[\x00-\x1f\\]/.test(p)))throw Error('Invalid screenshot article inventory');
  const expected=[];
  const add=(key,part)=>expected.push({key,part,file:`${key}--${part}.png`});
  for(const path of targets)for(const width of [390,1440]){
    const key=path.replaceAll('/','__').replace('.html','')+'--'+width;
    for(const part of ARTICLE_IMAGE_PARTS)add(key,part);
  }
  if(includeService)for(const width of [390,768,1440])for(const part of ['header','pause'])add('service--'+width,part);
  if(new Set(expected.map(x=>x.file)).size!==expected.length)throw Error('Ambiguous screenshot filenames');
  return expected;
}
export function validateIntegrationImages(targets,reports,shardCount) {
  if(!Number.isSafeInteger(shardCount)||shardCount<1||!Array.isArray(reports)||reports.length!==shardCount)throw Error('Invalid screenshot shard coverage');
  expectedIntegrationImages(targets); // Validate global inventory, even if shards omit it.
  const seenFiles=new Set();
  let count=0;
  for(let index=0;index<shardCount;index++){
    const report=reports[index];
    if(report?.shardIndex!==index||report.shardCount!==shardCount)throw Error('Screenshot shard identity mismatch');
    const assigned=targets.filter((_,i)=>i%shardCount===index);
    if(!Array.isArray(report.targets)||report.targets.length!==assigned.length||new Set(report.targets).size!==assigned.length||assigned.some(p=>!report.targets.includes(p)))throw Error('Screenshot shard article coverage mismatch');
    const expected=expectedIntegrationImages(assigned,{includeService:index===0});
    const byCase=new Map(expected.map(x=>[`${x.key}|${x.part}`,x]));
    const seenCases=new Set();
    if(!Array.isArray(report.images))throw Error('Missing screenshot list');
    for(const image of report.images){
      if(!image||typeof image.key!=='string'||typeof image.part!=='string'||typeof image.file!=='string')throw Error('Malformed screenshot evidence');
      const caseKey=`${image.key}|${image.part}`,required=byCase.get(caseKey);
      if(!required)throw Error(`Unexpected screenshot case in shard ${index}: ${caseKey}`);
      if(image.file!==required.file)throw Error(`Screenshot filename mismatch: ${caseKey}`);
      if(seenCases.has(caseKey)||seenFiles.has(image.file))throw Error(`Duplicated screenshot evidence: ${caseKey}`);
      seenCases.add(caseKey);seenFiles.add(image.file);count++;
    }
    const missing=expected.filter(x=>!seenCases.has(`${x.key}|${x.part}`));
    if(missing.length)throw Error(`Missing screenshot evidence in shard ${index}: ${missing.map(x=>x.file).join(', ')}`);
  }
  return {articles:targets.length,articleImages:targets.length*ARTICLE_IMAGE_PARTS.length*2,serviceImages:6,images:count};
}
export async function validateIntegrationImageFiles(root,reports) {
  // Call only after metadata validation: filenames must be exact expected basenames.
  for(const report of reports)for(const image of report.images){
    const path=resolve(root,'evidence-shard-'+report.shardIndex,image.file);
    const info=await lstat(path);
    if(!info.isFile()||info.size===0)throw Error(`Missing/non-regular screenshot file: ${image.file}`);
  }
}
