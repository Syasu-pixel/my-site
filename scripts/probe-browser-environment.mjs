// Diagnostic only. Does not change publication gates, baselines or tolerances.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
export const widths=[320,390,768,1440];
export const themes=['light','dark'];
export function compareReports(a,b){
 const errors=[];
 const hash=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
 const selectors=['h1','#jp','#en','button','code'];
 for(const [name,r] of [['reference',a],['candidate',b]]){
  if(r.playwright!=='1.55.0'||typeof r.browser!=='string'||!r.browser||!hash(r.fixtureHash))errors.push(`Invalid ${name} metadata`);
  for(const c of r.cases||[]){
   const boxes=Array.isArray(c.geometry)&&c.geometry.length===6&&c.geometry.every(g=>g&&['x','y','width','height'].every(k=>Number.isFinite(g[k]))&&g.width>0&&g.height>0&&typeof g.text==='string'&&g.text&&typeof g.font==='string'&&g.font);
   const fonts=c.fonts&&typeof c.fonts==='object'&&Object.keys(c.fonts).length===selectors.length&&selectors.every(k=>Array.isArray(c.fonts[k])&&c.fonts[k].length&&c.fonts[k].every(f=>f&&typeof f.familyName==='string'&&f.familyName&&typeof f.postScriptName==='string'&&f.postScriptName&&typeof f.isCustomFont==='boolean'&&Number.isInteger(f.glyphCount)&&f.glyphCount>0));
   if(!hash(c.pixelHash)||!boxes||!fonts)errors.push(`Incomplete ${name} case evidence`);
  }
 }
 for(const key of ['playwright','browser','fixtureHash'])if(a[key]!==b[key])errors.push(`Mismatch: ${key}`);
 const expected=widths.flatMap(width=>themes.map(theme=>`${width}-${theme}`));
 for(const [name,r] of [['reference',a],['candidate',b]]){
  if(!Array.isArray(r.cases)||r.cases.length!==expected.length||new Set(r.cases.map(c=>c.key)).size!==expected.length||expected.some(k=>!r.cases.some(c=>c.key===k)))errors.push(`Incomplete ${name} cases`);
 }
 for(const key of expected){
  const x=a.cases?.find(c=>c.key===key),y=b.cases?.find(c=>c.key===key);
  if(!x||!y)continue;
  for(const prop of ['pixelHash','geometry','fonts'])if(JSON.stringify(x[prop])!==JSON.stringify(y[prop]))errors.push(`${key}: ${prop}`);
 }
 return errors;
}
const html=`<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;padding:16px;font:16px/1.8 system-ui,-apple-system,"Segoe UI",sans-serif;background:#f5f8fc;color:#182539}h1{font-size:26px;line-height:1.4}p{margin:12px 0}.card{padding:16px;border:1px solid #b7c2d0;border-radius:12px}body.dark{background:#152031;color:#e6edf6}button{font:inherit}code{font-family:monospace}table{width:100%;border-collapse:collapse}td{border:1px solid #8c99ab;padding:8px}</style>
<h1>電磁接触器と電磁開閉器の違い</h1><section class="card"><p id="jp">サーマルリレーは過負荷を検知します。接点・コイル・端子台。漢字、かな、カナ、①②③、±、Ω、℃。</p><p id="en">Magnetic contactor / overload relay: 0123456789 ABC xyz.</p><table><tr><td>主接点</td><td>モーターの入切</td></tr></table><button>関連記事を確認</button><code>MC1 → TH1</code></section>`;
async function capture(out){
 const {chromium}=await import('playwright'); const {PNG}=await import('pngjs');
 const version=JSON.parse(readFileSync('node_modules/playwright/package.json','utf8')).version;
 if(version!=='1.55.0')throw Error('This trial requires the existing Playwright 1.55.0 exactly');
 mkdirSync(out,{recursive:true});
 const browser=await chromium.launch();
 const report={playwright:version,browser:browser.version(),fixtureHash:createHash('sha256').update(html).digest('hex'),node:process.version,os:readFileSync('/etc/os-release','utf8'),fontInventory:execFileSync('fc-list',['--format','%{family}|%{style}|%{file}\n'],{encoding:'utf8'}).split('\n').filter(Boolean).sort(),cases:[]};
 try{
  for(const width of widths)for(const theme of themes){
   const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,locale:'ja-JP',timezoneId:'Asia/Tokyo',colorScheme:theme,reducedMotion:'reduce'});
   const page=await context.newPage(); await page.route('**/*',route=>route.abort());
   await page.setContent(html);await page.evaluate(t=>document.body.className=t,theme);await page.evaluate(()=>document.fonts.ready);
   const geometry=await page.locator('h1,#jp,#en,table,button,code').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {text:n.textContent,x:r.x,y:r.y,width:r.width,height:r.height,font:getComputedStyle(n).fontFamily};}));
   const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument');const fonts={};
   for(const selector of ['h1','#jp','#en','button','code']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});const r=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});fonts[selector]=r.fonts.map(({familyName,postScriptName,isCustomFont,glyphCount})=>({familyName,postScriptName,isCustomFont,glyphCount})).sort((a,b)=>a.familyName.localeCompare(b.familyName));}
   const key=`${width}-${theme}`;const png=await page.screenshot({path:`${out}/${key}.png`,animations:'disabled'});const raw=PNG.sync.read(png);
   report.cases.push({key,geometry,fonts,pixelHash:createHash('sha256').update(raw.data).digest('hex')});await context.close();
  }
 }finally{await browser.close();}
 writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const [mode,a,b]=process.argv.slice(2);
 if(mode==='capture'&&a)await capture(a);
 else if(mode==='compare'&&a&&b){const errors=compareReports(JSON.parse(readFileSync(a)),JSON.parse(readFileSync(b)));console.log(JSON.stringify({status:errors.length?'different':'fixture-equivalent',errors,note:'A fixture pass is not full-site equivalence or permission to publish.'},null,2));if(errors.length)process.exitCode=1;}
 else throw Error('Usage: capture OUTPUT_DIR | compare REFERENCE_JSON CANDIDATE_JSON');
}
