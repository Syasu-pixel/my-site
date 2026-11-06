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
// Allow exactly one link target change in the paused GX Works2 page.
// All other source/candidate pages, common header/footer and donation CSS
// must remain identical to the latest main publication.
const approvedServiceSourceBlob='2b0c7902bfd1c813bbb8c3b0d014dfe0c010ea0c';
const previousLink="<a href=\"mailto:kds_kurata@hm.aitai.ne.jp\" style=\"color:#1d4ed8;font-weight:800;overflow-wrap:anywhere\">通常のお問い合わせ（メール）</a>";
const updatedLink="<a href=\"/contact/\" style=\"color:#1d4ed8;font-weight:800;overflow-wrap:anywhere\">通常のお問い合わせ</a>";
const gitBlob=text=>createHash('sha1').update('blob '+Buffer.byteLength(text)+'\0').update(text).digest('hex');
const sha256=text=>createHash('sha256').update(text).digest('hex');
const firstElement=(html,tag)=>(html.match(new RegExp('<'+tag+'\\b[^>]*>[\\s\\S]*?<\\/'+tag+'>'))||[])[0]||'';
let homes=0,categories=0,other=0,updatedServiceLinks=0;
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
    assert.equal(path,'services/gxworks2-online-support.html','Unapproved source change: '+path);
    assert.equal(gitBlob(afterSource),approvedServiceSourceBlob,'GX Works2 source differs from reviewed link change');
    assert.equal(beforeSource.split(previousLink).length,2,'Previous contact link not unique in main');
    assert.equal(afterSource,beforeSource.replace(previousLink,updatedLink),'Unexpected change beyond the GX Works2 contact link');
    assert.equal(before.split(previousLink).length,2,'Previous candidate contact link not unique');
    assert.equal(after,before.replace(previousLink,updatedLink),'Unexpected generated HTML change beyond the contact link');
    assert.equal(firstElement(after,'header'),firstElement(before,'header'),'Shared header changed');
    assert.equal(firstElement(after,'footer'),firstElement(before,'footer'),'Shared footer changed');
    assert.match(after,/id="consultation-paused-title"/,'GX Works2 pause notice absent');
    assert.doesNotMatch(after,/id="(?:generalConsultationForm|consultationForm|zip-input)"/,'Public upload or contact form unexpectedly visible');
    updatedServiceLinks++;
  }else{
    assert.equal(after,before,'Unrelated generated HTML changed: '+path);
  }
}
assert.equal(updatedServiceLinks,1,'Exactly the GX Works2 link must change');

const articlePath='.github/article-components/integration-compat.css';
const beforeArticle=await file(baseRoot,articlePath),afterArticle=await file(headRoot,articlePath);
assert.equal(afterArticle,beforeArticle,'Article donation visibility CSS must remain unchanged');
const beforeCategory=await file(baseRoot,'.github/site-shells/additional/category.css');
const afterCategory=await file(headRoot,'.github/site-shells/additional/category.css');
assert.equal(afterCategory,beforeCategory,'Category donation visibility CSS must remain unchanged');
console.log(JSON.stringify({result:'PASS',mainVsPr:'only the GX Works2 contact link changed; ordinary contact and footer remain preserved',pages:basePaths.length,homes,categories,unchangedOtherPages:other,updatedServiceLinks,articleCss:'approved append only',categoryCss:'approved append only',screenshots:'not covered'},null,2));
