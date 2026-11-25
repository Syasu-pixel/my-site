'use strict';
const SUPABASE_URL='https://pavitnsnmoaiospswiys.supabase.co',SUPABASE_KEY='sb_publishable_J3Muz4RVr7sqDsSTen1LNA_y_mgKAyG';
const shell=document.getElementById('commentShell'),statusLine=document.getElementById('commentLoginCheck');
const goLogin=()=>{shell.hidden=true;location.replace('./login.html');};
const showUnavailable=()=>{shell.hidden=true;statusLine.hidden=false;statusLine.textContent='ログインを確認できませんでした。時間をおいて開き直してください。';};
document.getElementById('commentTheme').addEventListener('click',()=>{
 const root=document.documentElement,v=root.dataset.dcTheme==='dark'?'light':'dark';
 root.dataset.dcTheme=v;try{localStorage.setItem('dc-theme',v);}catch{}
});
(async()=>{
 if(!window.supabase?.createClient){showUnavailable();return;}
 const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
 let invalidated=false;
 sb.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){invalidated=true;goLogin();}});
 const {data,error}=await sb.auth.getSession();
 if(invalidated)return;
 if(error){showUnavailable();return;}
 if(!data?.session){goLogin();return;}
 const verified=await sb.auth.getUser();
 if(invalidated)return;
 if(verified.error||!verified.data?.user||verified.data.user.is_anonymous){showUnavailable();return;}
 document.getElementById('commentLogout').addEventListener('click',async()=>{
  const {error}=await sb.auth.signOut();if(error)showUnavailable();else if(!invalidated)goLogin();
 });
 statusLine.hidden=true;shell.hidden=false;
})().catch(showUnavailable);
