import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
const script=join(process.cwd(),'scripts/report-article-impact.mjs');
const a='articles/first.html',b='articles/second.html',img='assets/images/first/hero.png';
const ledger='.github/site-shells/manifest.json';
function trial(changes,{initial={},full=false}={}){
 const root=mkdtempSync(join(tmpdir(),'article-scope-'));const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 const files={'.github/site-shells/additional/manifest.json':JSON.stringify({pages:[{path:'categories/basic.html'}]}),'.github/article-components/integration.json':JSON.stringify({targets:[a,b]}),[a]:`<img src="../${img}">`,[b]:'second',[img]:'image',[ledger]:JSON.stringify({pages:[{output:a,baselineSha256:'old',kind:'article'}]}),...initial};
 const write=(p,v)=>{mkdirSync(dirname(join(root,p)),{recursive:true});writeFileSync(join(root,p),v);};
 try{for(const [p,v] of Object.entries(files))write(p,v);git('init','-q');git('config','user.email','ci@example.invalid');git('config','user.name','CI');git('add','.');git('commit','-qm','base');const base=git('rev-parse','HEAD');
 for(const [p,v] of Object.entries(changes))v===null?rmSync(join(root,p)):write(p,v);git('add','-A');git('commit','-qm','change');
 return JSON.parse(execFileSync(process.execPath,[script,base,'HEAD',join(root,'report.json')],{cwd:root,encoding:'utf8',env:{...process.env,FULL_ARTICLE_AUDIT:full?'1':'0'}}));
 }finally{rmSync(root,{recursive:true,force:true});}
}
test('article and owned image plus ledger stay focused',()=>{const r=trial({[a]:`new <img src="../${img}">`,[img]:'new image',[ledger]:JSON.stringify({pages:[{output:a,baselineSha256:'new',kind:'article'}]})});assert.equal(r.scope,'selected');assert.deepEqual(r.affectedTargets,[a]);});
test('OGP related-card consumers included',()=>{const r=trial({[img]:'new'},{initial:{[b]:`<img class="related-card-thumb" src="../${img}">`}});assert.equal(r.scope,'selected');assert.deepEqual(r.affectedTargets,[a,b]);});
test('shared body images force full',()=>assert.equal(trial({[img]:'new'},{initial:{[b]:`<img src="../${img}">`}}).scope,'all'));
test('image basename collision in unknown consumer forces full',()=>assert.equal(trial({[img]:'new'},{initial:{'assets/css/shared.css':'url(hero.png)'}}).scope,'all'));
test('unreferenced owned image forces full',()=>assert.equal(trial({'assets/images/first/unused.png':'x'}).scope,'all'));
test('deleted article forces full',()=>assert.equal(trial({[a]:null}).scope,'all'));
test('deleted image forces full',()=>assert.equal(trial({[img]:null}).scope,'all'));
test('new article forces full',()=>assert.equal(trial({'articles/new.html':'x'}).scope,'all'));
test('shared CSS forces full',()=>assert.equal(trial({'assets/css/global.css':'x'}).scope,'all'));
test('unknown changes force full',()=>assert.equal(trial({'unknown.txt':'x'}).scope,'all'));
test('shared ledger field forces full',()=>assert.equal(trial({[ledger]:JSON.stringify({pages:[{output:a,baselineSha256:'new',kind:'changed'}]})}).scope,'all'));
test('explicit periodic/manual full overrides focused selection',()=>assert.equal(trial({[a]:'new'},{full:true}).scope,'all'));
test('docs-only is conservative full',()=>assert.equal(trial({'docs/note.md':'new'}).scope,'all'));
test('category OGP consumer recorded',()=>{const r=trial({[img]:'new'},{initial:{'categories/basic.html':`<img class="related-card-thumb" src="../${img}">`}});assert.deepEqual(r.categoryConsumers,['categories/basic.html']);});

test('unknown TypeScript consumer forces full',()=>assert.equal(trial({[img]:'new'},{initial:{'assets/render.ts':`const image='${img}';`}}).scope,'all'));
test('unregistered category forces full',()=>assert.equal(trial({[img]:'new'},{initial:{'categories/unknown.html':`<img class="related-card-thumb" src="../${img}">`}}).scope,'all'));
test('mixed minified thumbnail and shared body image forces full',()=>assert.equal(trial({[img]:'new'},{initial:{[b]:`<img class="related-card-thumb" src="../${img}"><img src="../${img}">`}}).scope,'all'));

const cssName='a'.repeat(64)+'.css.njk';
const cssPath='.github/article-components/hero/css/'+cssName;
const bindingsPath='.github/article-components/hero/css-bindings.json';
const slot={template:'css/'+cssName,sourceSha256:'source',urls:[]};
const bindings=(owners=[a])=>JSON.stringify(Object.fromEntries(owners.map(p=>[p,[slot]])));
const cssInitial={[cssPath]:'.article-hero { display:block; }',[bindingsPath]:bindings()};
test('static single-owner hero CSS stays focused',()=>{const r=trial({[cssPath]:'.article-hero { display:grid; }'},{initial:cssInitial});assert.equal(r.scope,'selected');assert.deepEqual(r.affectedTargets,[a]);});
test('added bound static hero CSS stays focused',()=>{const r=trial({[cssPath]:'.article-hero { display:block; }',[bindingsPath]:bindings()},{initial:{[bindingsPath]:JSON.stringify({[a]:[]})}});assert.equal(r.scope,'selected');assert.deepEqual(r.affectedTargets,[a]);});
test('shared hero CSS stays full',()=>assert.equal(trial({[cssPath]:'x'},{initial:{...cssInitial,[bindingsPath]:bindings([a,b])}}).scope,'all'));
test('removed shared owner cannot hide impact',()=>assert.equal(trial({[cssPath]:'x',[bindingsPath]:JSON.stringify({[a]:[slot],[b]:[]})},{initial:{...cssInitial,[bindingsPath]:bindings([a,b])}}).scope,'all'));
test('unknown hero owner stays full',()=>assert.equal(trial({[cssPath]:'x'},{initial:{...cssInitial,[bindingsPath]:bindings(['other.html'])}}).scope,'all'));
test('unbound added hero CSS stays full',()=>assert.equal(trial({[cssPath]:'x'},{initial:{[bindingsPath]:JSON.stringify({[a]:[]})}}).scope,'all'));
test('unknown template consumer stays full',()=>assert.equal(trial({[cssPath]:'x'},{initial:{...cssInitial,'other.njk':cssName}}).scope,'all'));
test('deleted hero CSS stays full',()=>assert.equal(trial({[cssPath]:null},{initial:cssInitial}).scope,'all'));
for(const [label,css] of Object.entries({dynamic:'{{ urls[0] | safe }}',include:'{% include "other.njk" %}',import:'@IMPORT "shared.css";',url:'x { background:URL(shared.png); }',escaped:'x { color:\\72 ed; }'}))test(label+' hero CSS stays full',()=>assert.equal(trial({[cssPath]:css},{initial:cssInitial}).scope,'all'));
test('malformed bindings stay full',()=>assert.equal(trial({[cssPath]:'x'},{initial:{...cssInitial,[bindingsPath]:JSON.stringify({[a]:null})}}).scope,'all'));
test('manual full retains all for owned CSS',()=>assert.equal(trial({[cssPath]:'x'},{initial:cssInitial,full:true}).scope,'all'));

