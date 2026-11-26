import {makeClient,mountDashboard,validPage} from './comments-dashboard-client.mjs';
// Existing project's browser-publishable configuration; no service key.
const SUPABASE_URL='https://pavitnsnmoaiospswiys.supabase.co',SUPABASE_KEY='sb_publishable_J3Muz4RVr7sqDsSTen1LNA_y_mgKAyG';
const shell=document.getElementById('commentShell'),statusLine=document.getElementById('commentLoginCheck');
const root=document.querySelector('[data-comments-dashboard]'),connection=document.getElementById('commentConnection');
const apiOrigin='https://comments.denkicontrol.com';
let invalidated=false, mount, verifiedId, controller;
const clear=()=>{controller?.abort();mount?.clear();if(root)root.hidden=true;};
window.addEventListener('pagehide',()=>{invalidated=true;clear();});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
const goLogin=()=>{invalidated=true;clear();shell.hidden=true;location.replace('./login.html');};
const showUnavailable=()=>{invalidated=true;clear();shell.hidden=true;statusLine.hidden=false;statusLine.textContent='ログインを確認できませんでした。時間をおいて開き直してください。';};
document.getElementById('commentTheme').addEventListener('click',()=>{
 const html=document.documentElement,v=html.dataset.dcTheme==='dark'?'light':'dark';
 html.dataset.dcTheme=v;try{localStorage.setItem('dc-theme',v);}catch{}
});
(async()=>{
 if(!window.supabase?.createClient){showUnavailable();return;}
 const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
 sb.auth.onAuthStateChange((event,session)=>{
  if(event==='SIGNED_OUT'||(verifiedId&&session?.user?.id!==verifiedId&&['SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED'].includes(event)))goLogin();
 });
 const {data,error}=await sb.auth.getSession();
 if(invalidated)return;
 if(error){showUnavailable();return;}
 if(!data?.session){goLogin();return;}
 const verified=await sb.auth.getUser();
 if(invalidated)return;
 if(verified.error||!verified.data?.user||verified.data.user.is_anonymous||verified.data.user.id!==data.session.user?.id){showUnavailable();return;}
 verifiedId=verified.data.user.id;
 document.getElementById('commentLogout').addEventListener('click',async()=>{
  invalidated=true;clear();shell.hidden=true;
  const {error}=await sb.auth.signOut();if(error)showUnavailable();else goLogin();
 });
 statusLine.hidden=true;shell.hidden=false;
 // Ship disabled. Activation is a separate, reviewed production deployment.
 if(root?.dataset.connection!=='on'||location.origin!=='https://denkicontrol.com')return;
 controller=new AbortController();
 const getToken=async()=>{
  const {data,error}=await sb.auth.getSession();
  if(invalidated||error||data?.session?.user?.id!==verifiedId||!data.session.access_token){if(!invalidated)goLogin();return null;}
  return data.session.access_token;
 };
 const fetcher=async(url,request)=>{
  const u=new URL(url);if(invalidated||u.origin!==apiOrigin||u.pathname!=='/api/article-comments/moderation')
   throw new Error('コメント管理に接続できません。');
  const response=await fetch(url,{...request,signal:AbortSignal.any([controller.signal,AbortSignal.timeout(10000)])});
  if(invalidated)throw new Error('コメント管理のログインが終了しました。');
  if(response.status===401||response.status===403){
   clear(); connection.hidden=false;connection.parentElement.hidden=false;
   connection.textContent=response.status===403?'コメント管理の権限がありません。':'コメント管理のログインを確認できませんでした。';
  }
  return response;
 };
 const client=makeClient({getToken,fetcher,apiOrigin});
 let first;
 try{first=await client.listPage('pending');}
 catch{if(!invalidated&&connection.querySelector('strong'))connection.textContent='コメント管理に接続できません。時間をおいて開き直してください。';return;}
 if(invalidated)return;
 if(!validPage(first,'pending')){connection.textContent='一覧を確認できませんでした。時間をおいて開き直してください。';return;}
 const listPage=client.listPage;let initial=first;
 client.listPage=(state,after)=>{
  if(invalidated||controller.signal.aborted)return Promise.reject(new Error('コメント管理の接続が終了しました。'));
  if(initial&&state==='pending'&&!after){const result=initial;initial=null;return Promise.resolve(result);}
  return listPage(state,after);
 };
 mount=mountDashboard({root,client});
 connection.parentElement.hidden=true;root.hidden=false;
 await mount.refresh();
})().catch(showUnavailable);
