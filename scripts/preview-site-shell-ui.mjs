// Review-only output. Does not rewrite the source articles or publishing tree.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import Eleventy from '@11ty/eleventy';
import { root, replaceShells } from './build-site-shells.mjs';
const out=resolve(process.argv[2]||'.ui-proposal');
if(out===root||out.startsWith(resolve(root,'articles'))||out.startsWith(resolve(root,'en')))throw Error('Preview must use a separate output directory');
const input=resolve(root,'.github/site-shells/ui-proposal');
const config=JSON.parse(await readFile(resolve(root,'.github/site-shell-visual.json'),'utf8'));
const proposals=[];
for(const output of config.representatives){
  const en=output.startsWith('en/'),name=output.split('/').at(-1),other=en?`articles/${name}`:`en/articles/${name}`;
  let counterpart=null;try{await access(resolve(root,other));counterpart='/'+other;}catch{}
  proposals.push({output,counterpart,lang:en?'en':'ja',otherLang:en?'ja':'en',home:en?'/en/':'/',assetRoot:'/assets/',homeLabel:en?'English home':'トップページへ',title:en?'Denki Control Lab':'電気と制御の実務メモ',subtitle:en?'Practical electrical control notes':'現場で使える考え方と制御の基礎をわかりやすく解説',consult:en?'':'オンライン相談',search:en?'Search this site':'サイト内検索',searchShort:en?'Search':'検索',menu:en?'Menu':'メニュー',placeholder:en?'Search by keyword':'キーワードで検索',noResults:en?'No matching articles found.':'該当する記事がありません',contactUrl:en?'/en/contact/index.html':'/contact/index.html',contact:en?'Contact':'お問い合わせ',languageLabel:en?'ARTICLE LANGUAGE':'記事の言語',currentLanguage:en?'English':'日本語',currentLabel:en?'Current':'現在の言語',otherLanguage:en?'日本語':'English'});
}
const eleventy=new Eleventy(resolve(input,'preview.njk'),resolve(input,'.preview-render'),{configPath:false,quietMode:true,config:c=>{c.addGlobalData('proposals',proposals);c.setNunjucksEnvironmentOptions({throwOnUndefined:true,autoescape:true});}});
const rendered=await eleventy.toJSON();
if(rendered.length!==proposals.length)throw Error('Incomplete UI proposal rendering');
const css=await readFile(resolve(input,'header.css'),'utf8'),js=await readFile(resolve(input,'header.js'),'utf8');
for(const result of rendered){
  const shell=JSON.parse(result.content),proposal=proposals.find(p=>p.output===shell.output);if(!proposal)throw Error('Unexpected proposal');
  const original=await readFile(resolve(root,shell.output),'utf8'),footer=original.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)[0];
  let html=replaceShells(original,shell.header.trim().replace('class="site-header dc-shell"',`class="site-header dc-shell" data-lang="${proposal.lang}"`),footer);
  html=html.replace('</head>',`<style data-ui-proposal="header">${css}</style></head>`).replace('</body>',`<script data-ui-proposal="header">${js}</script></body>`);
  const path=resolve(out,shell.output);await mkdir(dirname(path),{recursive:true});await writeFile(path,html);
}
await writeFile(resolve(out,'proposal.json'),JSON.stringify({status:'review-only',sourceArticlesUnmodified:true,pages:proposals},null,2));
console.log(`Review-only header proposal: ${proposals.length} pages in ${out}`);
