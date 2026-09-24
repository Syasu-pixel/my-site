import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {loadHeroRenderer} from './build-article-heroes.mjs';
const root=resolve(import.meta.dirname,'..'),out=resolve(process.argv[2]||'../hero-build');
const plan=JSON.parse(await readFile(resolve(out,'hero-pages.json'),'utf8')),render=await loadHeroRenderer(resolve(out,'hero-pages.json'));
const hash=s=>createHash('sha256').update(s).digest('hex'),rows=[];
for(const page of plan.pages){
 const original=await readFile(resolve(root,page.path),'utf8'),rendered=render.apply(original,page.path);
 if(original!==rendered)throw Error('Hero/CSS migration changed bytes: '+page.path);
 const candidate=await readFile(resolve(out,'candidate',page.path),'utf8');
 if(!candidate.includes(page.hero.raw)||page.styles.some(s=>!candidate.includes(s.raw)))throw Error('Integrated hero/CSS differs: '+page.path);
 const before=await readFile(resolve(out,'before',page.path)),after=await readFile(resolve(out,'review',page.path));
 if(!before.equals(after))throw Error('Isolated before/after document bytes differ: '+page.path);
 rows.push({isolatedDocumentBytesExact:true,beforeSha256:hash(before),afterSha256:hash(after),path:page.path,sourceSha256:hash(original),reconstructedSha256:hash(rendered),htmlByteIdentical:true,integratedHeroAndStylesExact:true,cssSlots:page.styles.reduce((n,s)=>n+s.slots.length,0)});
}
await writeFile(resolve(out,'hero-preservation.json'),JSON.stringify({state:'PREVIEW_ONLY',pages:rows,productionPublished:false},null,2));
console.log(JSON.stringify({heroes:rows.length,byteIdentical:true}));
