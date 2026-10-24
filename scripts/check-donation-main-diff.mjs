import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';

// Strictly compare production-style generated additional pages from the same builder.
// This does NOT replace screenshot / browser interaction reviews.
const [baseRoot,baseOut,headRoot,headOut]=process.argv.slice(2);
if([baseRoot,baseOut,headRoot,headOut].some(x=>!x))throw Error('Usage: node scripts/check-donation-main-diff.mjs BASE_ROOT BASE_OUT HEAD_ROOT HEAD_OUT');
const file=(root,path)=>readFile(resolve(root,path),'utf8');
const baseManifest=JSON.parse(await file(baseRoot,'.github/site-shells/additional/manifest.json'));
const headManifest=JSON.parse(await file(headRoot,'.github/site-shells/additional/manifest.json'));
const basePaths=baseManifest.pages.map(x=>x.path);
assert.deepEqual(headManifest.pages.map(x=>x.path),basePaths,'Page inventory must remain unchanged');
const homeCss='<style data-donation-hidden="home">.support-card{display:none!important}</style>';
const categoryCss='\n/* Reversible donation-card visibility for category pages. */\n.support-card{display:none!important}\n';
let homes=0,categories=0,other=0;
for(const path of basePaths){
  const before=await file(resolve(baseOut,'candidate'),path);
  const after=await file(resolve(headOut,'candidate'),path);
  const home=path==='index.html'||path==='en/index.html';
  const category=path.startsWith('categories/')||path.startsWith('en/categories/');
  assert.equal(await file(baseRoot,path),await file(headRoot,path),'Source page unexpectedly changed: '+path);
  if(home){assert.equal(after.split(homeCss).length,2,'Expected one home donation CSS block: '+path);homes++;}
  if(category){assert.equal(after.split(categoryCss).length,2,'Expected one category donation CSS block: '+path);categories++;}
  if(!home&&!category)other++;
  assert.equal(after.includes(homeCss),before.includes(homeCss),'Home donation visibility changed: '+path);
  assert.equal(after.includes(categoryCss),before.includes(categoryCss),'Category donation visibility changed: '+path);
  const profileLink='<nav class="dc-footer-profile-link" aria-label="'+(path.startsWith('en/')?'About this site':'サイト運営情報')+'">\n    <a href="/profile/">'+(path.startsWith('en/')?'About the operator &amp; editorial policy':'運営者・編集方針')+'</a>\n  </nav>\n  ';
  assert.equal(after.split(profileLink).length,2,'Expected exactly one profile footer link: '+path);
  assert.equal(after.replace(profileLink,''),before,'Unexpected generated HTML change beyond profile footer link: '+path);
}
const articlePath='.github/article-components/integration-compat.css';
const beforeArticle=await file(baseRoot,articlePath),afterArticle=await file(headRoot,articlePath);
assert.equal(afterArticle,beforeArticle,'Article donation visibility CSS must remain unchanged');
const beforeCategory=await file(baseRoot,'.github/site-shells/additional/category.css');
const afterCategory=await file(headRoot,'.github/site-shells/additional/category.css');
assert.equal(afterCategory,beforeCategory,'Category donation visibility CSS must remain unchanged');
console.log(JSON.stringify({result:'PASS',mainVsPr:'generated pages identical except one approved profile footer link; donation hiding preserved',pages:basePaths.length,homes,categories,unchangedOtherPages:other,articleCss:'approved append only',categoryCss:'approved append only',screenshots:'not covered'},null,2));
