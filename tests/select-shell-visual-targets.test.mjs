import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
const original = process.cwd();
const script = join(original, 'scripts/select-shell-visual-targets.mjs');
function git(root, ...args) { return execFileSync('git', args, { cwd:root, encoding:'utf8' }).trim(); }
function trial(changes) {
  const root=mkdtempSync(join(tmpdir(),'visual-scope-'));
  for(const p of ['.github/site-shell-visual.json','articles/first.html','articles/second.html']) {
    mkdirSync(dirname(join(root,p)),{recursive:true});
    writeFileSync(join(root,p),'initial');
  }
  git(root,'init','-q');git(root,'config','user.email','ci@example.invalid');git(root,'config','user.name','CI');
  git(root,'add','.');git(root,'commit','-qm','base');
  const base=git(root,'rev-parse','HEAD');
  for(const [p,v] of Object.entries(changes)) {
    mkdirSync(dirname(join(root,p)),{recursive:true});
    writeFileSync(join(root,p),v);
  }
  git(root,'add','-A');git(root,'commit','-qm','change');
  const head=git(root,'rev-parse','HEAD');
  const out=join(root,'selection.json');
  const result=execFileSync(process.execPath,[script,base,head,out],{cwd:root,encoding:'utf8'});
  return JSON.parse(result);
}
test('single existing article updates only its screenshot scope',()=>{
  const result=trial({'articles/first.html':'modified'});
  assert.equal(result.mode,'changed-articles');
  assert.deepEqual(result.targets,['articles/first.html']);
});
test('shared CSS and article changes force full visual audit',()=>{
  assert.equal(trial({'articles/first.html':'modified','assets/css/site.css':'new'}).mode,'all');
});
test('shared template changes force full visual audit',()=>{
  assert.equal(trial({'.github/site-shells/components/header.njk':'new'}).mode,'all');
});
test('new article requires full audit',()=>{
  assert.equal(trial({'articles/new.html':'new'}).mode,'all');
});
