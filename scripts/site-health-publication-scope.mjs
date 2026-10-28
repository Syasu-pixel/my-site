import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
export async function unpublishedPaths(root){
 const data=JSON.parse(await readFile(resolve(root,'assets/data/site-health-unpublished.json'),'utf8'));
 if(data.version!==1||!Array.isArray(data.unpublished))throw Error('Invalid unpublished inventory');
 const paths=new Set();
 for(const row of data.unpublished){
  const p=row.path;
  if(typeof p!=='string'||! /^(?:en\/)?articles\/[a-z0-9-]+\.html$/.test(p)||paths.has(p)||!row.reason)throw Error('Invalid unpublished entry: '+String(p));
  paths.add(p);
 }
 return paths;
}
