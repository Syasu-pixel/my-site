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
// A one-time, byte-pinned exception for the two explicitly paused consultation pages.
// All other pages, generated shell output, donation CSS and public footers remain exact.
// This is not a general exception for arbitrary source changes.
const pausedPages=new Map([
  ['contact/index.html',{
    sourceBlob:'40937d209a61138b599f27d813e3bf44c18b49f0',
    candidateSha256:'77ba799f20b4531be851bb7cd00e1e0686d4039ed653487da9c9c143af499106'
  }],
  ['services/gxworks2-online-support.html',{
    sourceBlob:'0d2bba93e9179955c283e99a53d5790b50985ae6',
    candidateSha256:'1d31456a3cf1ac2bcfc3504417f20ebc14888096d586e2e1d5e9933049f3eab0'
  }]
]);
const gitBlob=text=>createHash('sha1').update('blob '+Buffer.byteLength(text)+'\0').update(text).digest('hex');
const sha256=text=>createHash('sha256').update(text).digest('hex');
const firstElement=(html,tag)=>(html.match(new RegExp('<'+tag+'\\b[^>]*>[\\s\\S]*?<\\/'+tag+'>'))||[])[0]||'';
let homes=0,categories=0,other=0,paused=0;
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
    const approved=pausedPages.get(path);
    assert.ok(approved,'Unapproved source page changed: '+path);
    assert.equal(gitBlob(afterSource),approved.sourceBlob,'Paused source differs from reviewed commit: '+path);
    assert.equal(sha256(after),approved.candidateSha256,'Generated pause page differs from reviewed candidate: '+path);
    assert.equal(firstElement(after,'header'),firstElement(before,'header'),'Shared header changed: '+path);
    assert.equal(firstElement(after,'footer'),firstElement(before,'footer'),'Shared footer changed: '+path);
    assert.match(after,/id="consultation-paused-title"/,'Missing pause notice: '+path);
    assert.match(after,/mailto:kds_kurata@hm\.aitai\.ne\.jp/,'Missing ordinary contact: '+path);
    assert.doesNotMatch(after,/id="(?:consultationForm|generalConsultationForm|zip-input)"/,'Live intake form remains: '+path);
    paused++;
  }else{
    // The profile link has been in main since a previous PR. A one-time link
    // insertion is acceptable only for older bases that lack it.
    assert.equal(before.includes(profileLink)?after:after.replace(profileLink,''),before,
      'Unexpected generated HTML change: '+path);
  }
}
assert.equal(paused===0||paused===2,true,'Both consultation pages must be paused together');

const articlePath='.github/article-components/integration-compat.css';
const beforeArticle=await file(baseRoot,articlePath),afterArticle=await file(headRoot,articlePath);
assert.equal(afterArticle,beforeArticle,'Article donation visibility CSS must remain unchanged');
const beforeCategory=await file(baseRoot,'.github/site-shells/additional/category.css');
const afterCategory=await file(headRoot,'.github/site-shells/additional/category.css');
assert.equal(afterCategory,beforeCategory,'Category donation visibility CSS must remain unchanged');
console.log(JSON.stringify({result:'PASS',mainVsPr:'unchanged pages byte-identical; only pinned consultation pause pages permitted; donation and profile footer preserved',pages:basePaths.length,homes,categories,unchangedOtherPages:other,pausedConsultationPages:paused,articleCss:'approved append only',categoryCss:'approved append only',screenshots:'not covered'},null,2));
