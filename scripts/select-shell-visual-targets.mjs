// Conservative PR visual scope: only changed article HTML may use a focused capture.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const [base, head, output = '.visual-targets.json'] = process.argv.slice(2);
if (!base || !head) throw Error('Usage: select-shell-visual-targets.mjs BASE HEAD OUTPUT');
const config = JSON.parse(readFileSync('.github/site-shell-visual.json', 'utf8'));
const raw = execFileSync('git', ['diff', '--name-status', base, head], {encoding:'utf8'});
const entries = raw.trim().split('\n').filter(Boolean).map(line => line.split('\t')); 
const changed = [...new Set(entries.flatMap(parts => parts.slice(1)))];
const article = /^(?:articles|en\/articles)\/[^/]+\.html$/;
const onlyArticleHtml = entries.length > 0 && entries.every(([status, file]) => status === 'M' && article.test(file));
const targets = onlyArticleHtml ? changed.filter(file => {
  try { readFileSync(file); return true; } catch { return false; }
}).sort() : [];
// Removal or rename of any article requires the full audit.
const mode = onlyArticleHtml && targets.length === changed.length ? 'changed-articles' : 'all';
const result = {mode, targets:mode==='all'?null:targets, changed, reason:mode==='all'?'Shared, non-article, deletion, or unrecognized changes require full audit':'Only article HTML changed'};
writeFileSync(output, JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
