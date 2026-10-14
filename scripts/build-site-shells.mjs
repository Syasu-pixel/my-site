import { readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import Eleventy from '@11ty/eleventy';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const sourceDir = '.github/site-shells';
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');
function articlePath(base,path) {
  if(typeof path!=='string'||!/^(en\/)?articles\/[a-z0-9-]+\.html$/.test(path))throw Error(`Invalid article URL: ${path}`);
  return resolve(base,path);
}
export function replaceShells(original,header,footer) {
  const matches={};
  for(const tag of ['header','footer']){
    const found=[...original.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`,'g'))];
    if(found.length!==1||!new RegExp(`class=["'][^"']*\\bsite-${tag}\\b`).test(found[0][0]))throw Error(`Expected one site ${tag}`);
    matches[tag]=found[0];
  }
  if(matches.header.index>=matches.footer.index)throw Error('Footer precedes header');
  for(const [tag,value]of [['header',header],['footer',footer]]){
    if(typeof value!=='string'||!value.startsWith(`<${tag}`)||!value.endsWith(`</${tag}>`)||(value.match(new RegExp(`<${tag}\\b`,'g'))||[]).length!==1||/\{%|\{\{/.test(value))throw Error(`Invalid rendered ${tag}`);
  }
  return original.slice(0,matches.header.index)+header+original.slice(matches.header.index+matches.header[0].length,matches.footer.index)+footer+original.slice(matches.footer.index+matches.footer[0].length);
}
export async function renderShells(base=root){
  base=await realpath(base);const input=resolve(base,sourceDir);
  const manifest=JSON.parse(await readFile(resolve(input,'manifest.json'),'utf8'));
  if(!['pilot','all-articles'].includes(manifest.scope)||!Array.isArray(manifest.pages)||!manifest.pages.length)throw Error('Invalid scope/manifest');
  const targets=new Map();
  for(const page of manifest.pages){
    const path=articlePath(base,page.output);
    if(targets.has(page.output))throw Error('Duplicate output URL');
    if(!/^[a-z0-9-]+\.html$/.test(page.articleFile)||page.articleFile!==page.output.split('/').at(-1))throw Error('Invalid articleFile');
    for(const name of [page.headerTemplate,page.footerTemplate]){
      if(typeof name!=='string'||!/^components\/[a-z0-9-]+\.njk$/.test(name))throw Error('Invalid component reference');
      if(!(await realpath(resolve(input,name))).startsWith(input+sep))throw Error('Component escapes source directory');
    }
    if(!(await realpath(path)).startsWith(base+sep))throw Error('Article escapes repository');
    targets.set(page.output,await readFile(path));
  }
  if(manifest.scope==='all-articles'){
    const articles=[];
    for(const dir of ['articles','en/articles'])for(const entry of await readdir(resolve(base,dir),{withFileTypes:true})){
      if(entry.name.endsWith('.html')){if(!entry.isFile())throw Error('Article cannot be symlink/directory');articles.push(`${dir}/${entry.name}`);}
    }
    if(articles.length!==targets.size||articles.some(p=>!targets.has(p)))throw Error('Article inventory and manifest differ; register each new article explicitly');
  }
  const eleventy=new Eleventy(input,resolve(input,'.render-output'),{configPath:resolve(input,'eleventy.config.cjs'),quietMode:true});
  const rendered=await eleventy.toJSON();const results=new Map();
  for(const result of rendered){
    const shell=JSON.parse(result.content);
    if(!targets.has(shell.output)||results.has(shell.output))throw Error('Unexpected or duplicate rendered URL');
    results.set(shell.output,Buffer.from(replaceShells(targets.get(shell.output).toString('utf8'),shell.header,shell.footer)));
  }
  if(results.size!==targets.size)throw Error('Missing rendered shell');
  return {results,manifest};
}
export async function buildShells({check=false,verifyBaseline=false,base=root}={}){
  const {results,manifest}=await renderShells(base);const stale=[];
  for(const [path,content]of results){
    if(!(await readFile(articlePath(base,path))).equals(content))stale.push(path);
    if(verifyBaseline&&sha256(content)!==manifest.pages.find(p=>p.output===path).baselineSha256)throw Error(`Migration changes baseline HTML: ${path}`);
  }
  // Validate the entire plan before writing. CI and publishing use check mode.
  if(check&&stale.length)throw Error(`Generated header/footer is stale. Edit shared components, then run pnpm build:shells:\n${stale.join('\n')}`);
  if(!check)for(const path of stale)await writeFile(articlePath(base,path),results.get(path));
  return {pages:results.size,changed:stale};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2);
  if(args.some(a=>!['--check','--verify-baseline'].includes(a)))throw Error('Usage: build-site-shells.mjs [--check] [--verify-baseline]');
  console.log(await buildShells({check:args.includes('--check'),verifyBaseline:args.includes('--verify-baseline')}));
}
