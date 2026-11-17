// Conservative PR visual scope and independently verified commit inventories.
// Added pages have no main baseline: callers must capture their head source BEFORE
// generation, separately from the immutable base of every existing article.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [baseRef, headRef, output = '.visual-targets.json'] = process.argv.slice(2);
if (!baseRef || !headRef) throw Error('Usage: select-shell-visual-targets.mjs BASE HEAD OUTPUT');
const git = (...args) => execFileSync('git', args, {encoding:'utf8'});
const resolveCommit = ref => git('rev-parse', '--verify', `${ref}^{commit}`).trim();
const baseSha = resolveCommit(baseRef), headSha = resolveCommit(headRef);
const article = /^(?:articles|en\/articles)\/[^/]+\.html$/;
function inventory(sha, label) {
  const configSource = git('show', `${sha}:.github/site-shell-visual.json`);
  const config = JSON.parse(configSource);
  const entries = git('ls-tree', '-rz', sha).split('\0').filter(Boolean).map(entry => {
    const tab = entry.indexOf('\t');
    const [mode,type] = entry.slice(0,tab).split(' ');
    return {mode,type,path:entry.slice(tab+1)};
  }).filter(entry => article.test(entry.path));
  if (entries.some(entry => entry.type !== 'blob' || !['100644','100755'].includes(entry.mode))) {
    throw Error(`${label} inventory contains a non-regular article`);
  }
  const pages = entries.map(entry => entry.path).sort();
  if (!Number.isSafeInteger(config.articleCount) || config.articleCount < 1 || config.articleCount !== pages.length) {
    throw Error(`${label} article inventory/config mismatch: tree ${pages.length}, config ${config.articleCount}`);
  }
  if (!Array.isArray(config.representatives) || new Set(config.representatives).size !== config.representatives.length || config.representatives.some(path => !pages.includes(path))) {
    throw Error(`${label} representatives are invalid or absent from its own inventory`);
  }
  return {pages,count:config.articleCount,configSha256:createHash('sha256').update(configSource).digest('hex')};
}
const before = inventory(baseSha,'base'), after = inventory(headSha,'head');
const removedTargets = before.pages.filter(path => !after.pages.includes(path));
if (removedTargets.length) throw Error(`Article deletion/rename requires an explicit migration audit: ${removedTargets.join(', ')}`);
const addedTargets = after.pages.filter(path => !before.pages.includes(path));
// NUL delimiters prevent whitespace and quoting from hiding changed paths.
const raw = git('diff', '--name-status', '-z', '--find-renames', baseSha, headSha).split('\0');
const entries = [];
for (let i=0; i<raw.length && raw[i];) {
  const status = raw[i++], paths = [raw[i++]];
  if (/^[RC]/.test(status)) paths.push(raw[i++]);
  if (paths.some(path => typeof path !== 'string')) throw Error('Malformed git name-status output');
  entries.push([status,...paths]);
}
if (entries.some(([status,...paths]) => status.startsWith('R') && paths.some(path => article.test(path)))) {
  throw Error('Article rename requires an explicit migration audit');
}
const changed = [...new Set(entries.flatMap(parts => parts.slice(1)))].sort();
const onlyArticleHtml = entries.length > 0 && entries.every(([status,file]) => status === 'M' && article.test(file) && before.pages.includes(file) && after.pages.includes(file));
const mode = onlyArticleHtml ? 'changed-articles' : 'all';
const existingTargets = mode === 'all' ? before.pages : changed;
const result = {
  formatVersion:2, baseSha, headSha, mode,
  targets:mode==='all'?null:existingTargets,
  inventories:{base:before.pages,head:after.pages},
  articleCounts:{base:before.count,head:after.count},
  configSha256:{base:before.configSha256,head:after.configSha256},
  existingTargets, addedTargets, removedTargets,
  additionBaseline:addedTargets.length?'head-before-generation':null,
  changed,
  reason:mode==='all'?'Shared, non-article, addition, or unrecognized changes require full existing-article audit plus separate added-page verification':'Only existing article HTML changed'
};
writeFileSync(output, JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
