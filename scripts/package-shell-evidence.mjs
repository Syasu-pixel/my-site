// Package existing successful evidence; never capture or update baseline images.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
const source=resolve(process.argv[2]||'.downloaded-evidence'),out=resolve(process.argv[3]||'.review-evidence');
const report=JSON.parse(await readFile(resolve(source,'report.json'),'utf8'));
const baseline=JSON.parse(await readFile(resolve(source,'baseline.json'),'utf8'));
if(report.differences!==0||report.interactionChanged||report.newErrors.length)throw Error('Only successful comparison evidence can be packaged');
const config=JSON.parse(await readFile('.github/site-shell-visual.json','utf8'));
if(report.baseSha!==config.baselineCommit||report.targets.length!==config.articleCount)throw Error('Unexpected evidence coverage/baseline');
const selected=report.results.filter(r=>config.representatives.includes(r.target));
await mkdir(out,{recursive:true});
for(const r of selected)for(const key of ['before','after','diff']){
 const name=r[key],from=resolve(source,name),to=resolve(out,name);if(!from.startsWith(source+sep)||!to.startsWith(out+sep))throw Error('Invalid image path');
 await mkdir(dirname(to),{recursive:true});await copyFile(from,to);
}
await writeFile(resolve(out,'report-all-articles.json'),JSON.stringify(report,null,2));
await writeFile(resolve(out,'baseline-all-articles.json'),JSON.stringify(baseline,null,2));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
await writeFile(resolve(out,'index.html'),`<!doctype html><html lang="ja"><meta charset="utf-8"><title>全記事共通化の確認資料</title><style>body{font:16px sans-serif;margin:24px;color:#16324c}section{border-top:1px solid #ddd;padding:18px 0}.row{display:flex;gap:12px}figure{width:32%;margin:0}img{width:100%}summary{cursor:pointer}</style><h1>全記事の共通化 — 確認資料</h1><p>全${report.targets.length}記事・${report.results.length}組を比較。視覚差分0・操作差分0・新規エラー0。これは追加UI案を含まない共通化の検証です。</p><p>画像は代表6記事分、JSONレポートは全記事分を収録しています。全画像は元runのshell-comparison artifactを参照してください。</p><p>基準 ${esc(report.baseSha)} / 検証 ${esc(report.headSha)}</p>${selected.map(r=>`<section><details><summary>${esc(r.target)} / ${r.device} / ${r.region} — 視覚差分${r.pixels}、生ピクセル差${r.exactPixels}</summary><div class="row">${['before','after','diff'].map(k=>`<figure><figcaption>${k}</figcaption><a href="${r[k]}"><img src="${r[k]}" loading="lazy"></a></figure>`).join('')}</div></details></section>`).join('')}</html>`);
console.log(JSON.stringify({pages:report.targets.length,comparisons:report.results.length,packagedImages:selected.length*3,headSha:report.headSha,differences:report.differences}));
