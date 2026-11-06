import {createHash} from 'node:crypto';
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
// Only the ordinary contact page is allowed to change in this PR.
// Keep the GX Works2 pause and all unrelated generated pages byte-identical;
// keep the footer and donation policy exact. The source blob is pinned.
const approvedContactSourceBlob='a372492d9ebb9e9ef1b0dbe1f9203ca0f7163b68';
const gitBlob=text=>createHash('sha1').update('blob '+Buffer.byteLength(text)+'\0').update(text).digest('hex');
const sha256=text=>createHash('sha256').update(text).digest('hex');
const firstElement=(html,tag)=>(html.match(new RegExp('<'+tag+'\\b[^>]*>[\\s\\S]*?<\\/'+tag+'>'))||[])[0]||'';
let homes=0,categories=0,other=0,restoredContact=0;
for(const path of basePaths){
  const before=await file(resolve(baseOut,'candidate'),path);
  const after=await file(resolve(headOut,'candidate'),path);
  const beforeSource=await file(baseRoot,path);
  const afterSource=await file(headRoot,path);
  const home=path==='index.html'||path==='en/index.html';
  const category=path.startsWith('categories/')||path.startsWith('en/categories/');
  if(home){assert.equal(after.split(homeCss).length,2,'Expected one home donation CSS block: '+path);homes++;}
  if(category){assert.equal(after.split(categoryCss).length,2,'Expected one category donation CSS block: '+path);categories++;}
  if(!home&&!category)other++;
  assert.equal(after.includes(homeCss),before.includes(homeCss),'Home donation visibility changed: '+path);
  assert.equal(after.includes(categoryCss),before.includes(categoryCss),'Category donation visibility changed: '+path);
  const profileLink='<nav class="dc-footer-profile-link" aria-label="'+(path.startsWith('en/')?'About this site':'サイト運営情報')+'">\n    <a href="/profile/">'+(path.startsWith('en/')?'About the operator &amp; editorial policy':'運営者・編集方針')+'</a>\n  </nav>\n  ';
  assert.equal(after.split(profileLink).length,2,'Expected exactly one profile footer link: '+path);
  if(beforeSource!==afterSource){
    assert.equal(path,'contact/index.html','Unexpected page source changed: '+path);
    assert.equal(gitBlob(afterSource),approvedContactSourceBlob,'Ordinary contact source diverged from reviewed change');
    assert.equal(firstElement(after,'header'),firstElement(before,'header'),'Shared header changed');
    assert.equal(firstElement(after,'footer'),firstElement(before,'footer'),'Footer inquiry link changed');
    assert.match(after,/id="generalConsultationForm"/,'Ordinary contact form absent');
    assert.match(after,/id="contact-confidentiality-notice"/,'Confidentiality notice absent');
    assert.match(after,/お問い合わせを送信する/,'Ordinary contact submit control absent');
    assert.doesNotMatch(after,/id="(?:consultationForm|zip-input|consultation-paused-title)"/,'GX Works2 intake leaked into ordinary contact');
    restoredContact++;
  }else{
    assert.equal(after,before,'Unrelated generated HTML changed: '+path);
  }
}
assert.equal(restoredContact,1,'Exactly the ordinary contact page should change');

const articlePath='.github/article-components/integration-compat.css';
const beforeArticle=await file(baseRoot,articlePath),afterArticle=await file(headRoot,articlePath);
assert.equal(afterArticle,beforeArticle,'Article donation visibility CSS must remain unchanged');
const beforeCategory=await file(baseRoot,'.github/site-shells/additional/category.css');
const afterCategory=await file(headRoot,'.github/site-shells/additional/category.css');
assert.equal(afterCategory,beforeCategory,'Category donation visibility CSS must remain unchanged');
console.log(JSON.stringify({result:'PASS',mainVsPr:'only pinned ordinary contact page changes; footer, GX Works2 pause, donation preserved',pages:basePaths.length,homes,categories,unchangedOtherPages:other,restoredContactPages:restoredContact,articleCss:'approved append only',categoryCss:'approved append only',screenshots:'not covered'},null,2));
