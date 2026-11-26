const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const pageUrl='https://denkicontrol.com/admin/comments.html', endpoint='https://comments.denkicontrol.com/api/article-comments/moderation';
const html=fs.readFileSync('candidate/admin/comments.html','utf8');
const stub=(kind)=>`window.supabase={createClient:()=>({auth:{
 onAuthStateChange:cb=>{window.simulateSignout=()=>cb('SIGNED_OUT',null)},
 getSession:async()=>({data:{session:${kind==='anonymous'?'null':JSON.stringify({user:{id:'verified'},access_token:'synthetic-token'})}},error:null}),
 getUser:async()=>({data:{user:{id:'verified',is_anonymous:${kind==='anonymousAccount'}}},error:null}),
 signOut:async()=>({error:null})
}})}`;
(async()=>{

 for(const item of [{kind:'off',w:1440},{kind:'anonymous',w:320},{kind:'anonymousAccount',w:390},{kind:'unauthorized',w:390},{kind:'bad',w:390},{kind:'ok',w:320},{kind:'ok',w:390},{kind:'ok',w:1440}]){
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||undefined,args:['--no-sandbox','--no-zygote','--single-process','--in-process-gpu','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const c=await b.newContext({viewport:{width:item.w,height:900}}); const page=await c.newPage();
 page.setDefaultTimeout(4000); page.on('pageerror', e=>console.error('pageerror',e.message)); page.on('requestfailed', r=>console.error('requestfail',r.url(),r.failure())); console.log('running',item);
 let calls=0,mut=0,phase='pending';
 await page.route('**/*',async r=>{
 const u=r.request().url();const url=new URL(u);
 if(u===pageUrl)return r.fulfill({contentType:'text/html',body:(item.kind==='off'?html:html.replace('data-connection="off"','data-connection="on"'))});
 if(url.hostname==='cdn.jsdelivr.net')return r.fulfill({contentType:'application/javascript',body:stub(item.kind)});
 if(u.startsWith(endpoint)){
  calls++;assert.equal(r.request().headers().authorization,'Bearer synthetic-token');
  assert.equal(r.request().headers().cookie,undefined);
  if(item.kind==='unauthorized')return r.fulfill({status:403,json:{}});
  if(r.request().method()==='POST'){const d=r.request().postDataJSON();assert.equal(d.id,'test-1');mut++;phase=d.action==='approve'?'published':'hidden';return r.fulfill({json:{ok:true}});}
  const state=url.searchParams.get('state');
  const row={id:'test-1',rev:1,path:item.kind==='bad'?'javascript:alert(1)':'/articles/fixture.html',nickname:'テスト',body:'確認テスト',state:phase};
  return r.fulfill({json:{rows:phase===state?[row]:[],next:null}});
 }
 if(url.hostname==='denkicontrol.com'&&url.pathname==='/admin/login.html')return r.fulfill({contentType:'text/html',body:'login'});
 if(url.hostname==='denkicontrol.com'&&url.pathname.startsWith('/admin/')){
  const f=path.basename(url.pathname);const p=[`candidate/admin/${f}`,path.join(process.env.ADMIN_BASELINE_DIR||'baseline/admin',f)].find(p=>fs.existsSync(p));
  if(p)return r.fulfill({contentType:f.endsWith('css')?'text/css':'application/javascript',body:fs.readFileSync(p,'utf8')});
 }
 return r.fulfill({status:404});
 });
 await page.goto(pageUrl);
 if(item.kind==='anonymous'){await page.waitForURL('**/admin/login.html');assert.equal(calls,0);}
 else if(item.kind==='anonymousAccount'){await page.getByText('ログインを確認できませんでした。').waitFor();assert.equal(calls,0);}
 else if(item.kind==='off'){await page.getByText('コメント管理は準備中です').waitFor();assert.equal(calls,0);}
 else if(item.kind==='unauthorized'){await page.getByText('コメント管理の権限がありません。').first().waitFor();assert.equal(calls,1);}
 else if(item.kind==='bad'){await page.getByText('一覧を確認できませんでした。').waitFor();assert.equal(calls,1);assert.equal(await page.getByText('確認テスト',{exact:true}).count(),0);}
 else{
  await page.getByText('確認テスト',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.getByRole('button',{name:'承認して公開',exact:true}).click();
  await page.getByRole('button',{name:'承認して公開',exact:true}).last().click();
  await page.getByText('承認しました。',{exact:false}).waitFor();
  await page.getByLabel('状態').selectOption('published');await page.getByText('確認テスト',{exact:true}).waitFor();
  await page.getByRole('button',{name:'非表示にする',exact:true}).click();
  await page.getByRole('button',{name:'非表示にする',exact:true}).last().click();
  await page.getByText('非表示にしました。',{exact:false}).waitFor();
  assert.equal(await page.getByText('確認テスト',{exact:true}).count(),0);assert.equal(mut,2);
  await page.evaluate(()=>window.simulateSignout());await page.waitForURL('**/admin/login.html');
 }
 console.log('PASS',item.kind,item.w,calls,mut);
 }finally{await b.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
