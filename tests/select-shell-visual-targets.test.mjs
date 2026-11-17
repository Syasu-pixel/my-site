import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
const script = join(process.cwd(), 'scripts/select-shell-visual-targets.mjs');
const configPath = '.github/site-shell-visual.json';
const config = (articleCount=2, representatives=['articles/first.html']) => JSON.stringify({articleCount,representatives});
function git(root, ...args) { return execFileSync('git', args, { cwd:root, encoding:'utf8' }).trim(); }
function trial(changes, {baseConfig=config(), dirty={}}={}) {
  const root=mkdtempSync(join(tmpdir(),'visual-scope-'));
  const put=(p,v)=>{
    if(v===null) return rmSync(join(root,p));
    mkdirSync(dirname(join(root,p)),{recursive:true});writeFileSync(join(root,p),v);
  };
  try {
    put(configPath,baseConfig);put('articles/first.html','initial first');put('articles/second.html','initial second');
    git(root,'init','-q');git(root,'config','user.email','ci@example.invalid');git(root,'config','user.name','CI');
    git(root,'add','.');git(root,'commit','-qm','base');
    const base=git(root,'rev-parse','HEAD');
    for(const [p,v] of Object.entries(changes)) put(p,v);
    git(root,'add','-A');git(root,'commit','-qm','change');
    const head=git(root,'rev-parse','HEAD');
    for(const [p,v] of Object.entries(dirty)) put(p,v);
    const result=execFileSync(process.execPath,[script,base,head,join(root,'selection.json')],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']});
    return JSON.parse(result);
  } finally { rmSync(root,{recursive:true,force:true}); }
}
test('single existing article updates only its screenshot scope',()=>{
  const result=trial({'articles/first.html':'modified'});
  assert.equal(result.mode,'changed-articles');
  assert.deepEqual(result.targets,['articles/first.html']);
  assert.deepEqual(result.existingTargets,result.targets);
  assert.deepEqual(result.addedTargets,[]);
  assert.equal(result.additionBaseline,null);
});
test('shared CSS and article changes force full existing visual audit',()=>{
  const result=trial({'articles/first.html':'modified','assets/css/site.css':'new'});
  assert.equal(result.mode,'all');
  assert.deepEqual(result.existingTargets,['articles/first.html','articles/second.html']);
});
test('shared template changes force full visual audit',()=>{
  assert.equal(trial({'.github/site-shells/components/header.njk':'new'}).mode,'all');
});
test('new article validates separate base/head counts and keeps all existing targets',()=>{
  const result=trial({'articles/new.html':'new',[configPath]:config(3)});
  assert.equal(result.mode,'all');
  assert.deepEqual(result.articleCounts,{base:2,head:3});
  assert.deepEqual(result.existingTargets,['articles/first.html','articles/second.html']);
  assert.deepEqual(result.addedTargets,['articles/new.html']);
  assert.deepEqual(result.removedTargets,[]);
  assert.equal(result.additionBaseline,'head-before-generation');
  assert.equal(result.inventories.head.length,3);
  assert.notEqual(result.configSha256.base,result.configSha256.head);
});
test('new article with stale head count fails rather than reducing coverage',()=>{
  assert.throws(()=>trial({'articles/new.html':'new'}),/head article inventory\/config mismatch/);
});
test('candidate count cannot substitute for invalid base count',()=>{
  assert.throws(()=>trial({'articles/new.html':'new',[configPath]:config(3)},{baseConfig:config(3)}),/base article inventory\/config mismatch/);
});
test('config count reduced without deleting an article fails',()=>{
  assert.throws(()=>trial({[configPath]:config(1)}),/head article inventory\/config mismatch/);
});
test('deleting an article still fails when candidate count matches smaller tree',()=>{
  assert.throws(()=>trial({'articles/second.html':null,[configPath]:config(1)}),/Article deletion\/rename requires/);
});
test('rename fails despite unchanged total count',()=>{
  assert.throws(()=>trial({'articles/second.html':null,'articles/renamed.html':'initial second'}),/Article deletion\/rename requires/);
});
test('replace existing article with new one cannot disguise deletion with equal count',()=>{
  assert.throws(()=>trial({'articles/second.html':null,'articles/new.html':'different new content'}),/Article deletion\/rename requires/);
});
test('uncommitted config or articles cannot change commit coverage',()=>{
  const result=trial({'articles/first.html':'modified'},{dirty:{[configPath]:config(100),'articles/second.html':null,'articles/untracked.html':'untracked'}});
  assert.deepEqual(result.inventories.base,['articles/first.html','articles/second.html']);
  assert.deepEqual(result.inventories.head,result.inventories.base);
  assert.deepEqual(result.articleCounts,{base:2,head:2});
});
test('representative outside its commit inventory fails',()=>{
  assert.throws(()=>trial({[configPath]:config(2,['articles/missing.html'])}),/head representatives are invalid/);
});
test('noninteger or missing count is invalid',()=>{
  for(const count of [2.5,'2',null]) assert.throws(()=>trial({[configPath]:config(count)}),/head article inventory\/config mismatch/);
});
test('English article additions receive separate head-only evidence scope',()=>{
  const result=trial({'en/articles/new.html':'new English',[configPath]:config(3)});
  assert.deepEqual(result.addedTargets,['en/articles/new.html']);
  assert.equal(result.existingTargets.length,2);
});
