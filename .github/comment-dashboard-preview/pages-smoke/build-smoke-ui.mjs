// Build only the isolated Pages comments harness. No network operations.
import {mkdir, readFile, writeFile, copyFile} from 'node:fs/promises';
const here = new URL('./', import.meta.url);
const staging = new URL('../', here);
const dist = new URL('dist/', here);
const project = 'https://dtqwnhmpieruiufbodnz.supabase.co';
const smoke = 'https://smoke.denkicontrol-comments-staging.pages.dev';
const key = process.env.COMMENTS_STAGING_SUPABASE_PUBLISHABLE_KEY || '';
if (key && !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) throw new Error('Expected staging publishable key (never a secret or service role)');
const read = (name) => readFile(new URL(name, staging), 'utf8');
const put = (name, value) => writeFile(new URL(name, dist), value);
const inject = (html, js) => {
  if (!html.trimEnd().endsWith('</body></html>')) throw new Error('Unexpected template ending');
  return html.replace('</body></html>', '<script type="module" src="./'+js+'"></script></body></html>');
};
await mkdir(dist,{recursive:true});
for (const name of ['dashboard.css','article-client.mjs','dashboard-client.mjs']) {
  await copyFile(new URL(name,staging),new URL(name,dist));
}
const serverSource=await read('pages-staging-smoke.mjs');
const transport=serverSource.slice(serverSource.indexOf('export function makeStagingFetch'));
if (!transport.startsWith('export function makeStagingFetch') || /\bimport\b/.test(transport)) throw new Error('Staging transport must be browser-only');
await put('smoke-transport.mjs',transport);
const article=(await read('article-preview.html')).replace('ラチェットレンチ（検証用）','コメント投稿（検証用）').replace('本番とはつながっていません。テスト文章のみを使います。','本番とは別の検証環境です。テスト文章のみを使います。');
await put('index.html',inject(article.replace('<form','<form hidden method="post"'),'smoke-article.mjs'));
const dashboard=(await read('dashboard.html')).match(/<main\b[\s\S]*?<\/main>/)?.[0];
if(!dashboard) throw Error('Missing moderation template');
await put('operator.html',inject(`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>試験コメント管理</title><link rel="stylesheet" href="./dashboard.css"></head><body><main class="comment-dashboard" data-signin>
<h1>検証用管理者でログイン</h1><p>この環境専用の試験アカウントだけを使ってください。</p>
<form class="comment-edit" hidden method="post"><label>試験アカウントのメール<input name="email" type="email" autocomplete="off" required></label><label>試験パスワード<input name="password" type="password" autocomplete="off" required></label><button type="submit">ログイン</button></form><p role="status"></p><button type="button" data-signout hidden>ログアウト</button></main>${dashboard.replace('data-comments-dashboard>', 'data-comments-dashboard hidden>')}</body></html>`,'smoke-operator.mjs'));
await put('_headers',`/*
  Cache-Control: private, no-store
  X-Robots-Tag: noindex, nofollow
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' ${project}; frame-ancestors 'none'; base-uri 'none'; form-action 'none'
`);
await put('smoke-article.mjs',`import {makeArticleClient,mountArticleComments} from './article-client.mjs';
import {makeStagingFetch} from './smoke-transport.mjs';
const root=document.querySelector('[data-comments]');
if (location.origin===${JSON.stringify(smoke)}) {
  root.querySelector('form').hidden=false;
  mountArticleComments({root,client:makeArticleClient({path:'/articles/staging-comment-smoke.html',fetcher:makeStagingFetch()})});
} else {
  root.querySelector('form').hidden=true;
  root.querySelector('[role=status]').textContent='検証用ホストではありません。接続と投稿は無効です。';
}
`);
await put('smoke-operator.mjs',`import {makeClient,mountDashboard} from './dashboard-client.mjs';
import {makeStagingFetch} from './smoke-transport.mjs';
const login=document.querySelector('[data-signin]');
const form=login.querySelector('form'),status=login.querySelector('[role=status]'),signout=login.querySelector('[data-signout]');
const root=document.querySelector('[data-comments-dashboard]');
const target=${JSON.stringify(project)},key=${JSON.stringify(key)};
if(location.origin!==${JSON.stringify(smoke)}||!key){
  form.hidden=true;
  status.textContent='検証用ホストまたは接続先が設定されていません。';
}else{
 form.hidden=false;
 let token=null,expiry=0;
 const authFetch=path=>target+'/auth/v1/'+path;
 const password=form.elements.password,email=form.elements.email;
 const submit=form.querySelector('button');
 const mount=()=>mountDashboard({root,client:makeClient({
  getToken:()=>Date.now()<expiry?token:null,fetcher:makeStagingFetch()
 })});
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(submit.disabled||token)return;
  submit.disabled=true;
  status.textContent='試験ログインを確認しています。';
  const body=JSON.stringify({email:email.value.trim(),password:password.value});
  password.value='';
  try{
    const result=await fetch(authFetch('token?grant_type=password'),{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body,cache:'no-store',redirect:'error',credentials:'omit',signal:AbortSignal.timeout(8000)});
    if(!result.ok)throw Error();
    const {access_token,expires_in}=await result.json();
    if(typeof access_token!=='string'||!Number.isFinite(expires_in)||expires_in<=0)throw Error();
    token=access_token;
    expiry=Date.now()+Math.min(expires_in,900)*1000;
    form.reset();form.hidden=true;signout.hidden=false;root.hidden=false;
    status.textContent='試験アカウントで認証しました。権限は一覧取得時に確認します。';
    mount();
  }catch{
    status.textContent='試験ログインに失敗しました。この環境専用の試験アカウントを確認してください。';
  }finally{submit.disabled=false;}
 });
 signout.addEventListener('click',async()=>{
  const current=token;token=null;expiry=0;root.hidden=true;signout.disabled=true;
  try{if(current)await fetch(authFetch('logout?scope=local'),{method:'POST',headers:{apikey:key,Authorization:'Bearer '+current},cache:'no-store',redirect:'error',credentials:'omit',signal:AbortSignal.timeout(3000)});}
  catch{} finally {location.reload();}
 });
}
`);
