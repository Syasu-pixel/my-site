(()=>{
  const SYSTEM_BUILD='0.7.13';
  const FAILURE_TEXT='安全なイベントfeedへ接続できません。自動で再接続します。';
  let lastGoodHtml='';
  let lastGoodJob='';
  let restoring=false;
  let renderGuardInstalled=false;

  function box(){return document.querySelector('#events')}
  function conn(){return document.querySelector('#conn')}
  function setSystemBuild(){
    const v=document.querySelector('.version');
    if(!v)return;
    v.textContent='system v'+SYSTEM_BUILD;
    v.title='AI編集部 system v'+SYSTEM_BUILD;
    v.dataset.build=SYSTEM_BUILD;
  }
  function hasUsableView(el){
    if(!el)return false;
    if(el.textContent?.includes(FAILURE_TEXT))return false;
    return Boolean(el.dataset?.job);
  }
  function rememberHtml(el){
    if(!hasUsableView(el))return;
    lastGoodHtml=el.innerHTML;
    lastGoodJob=el.dataset.job||'';
  }
  function softenConnectionLabel(){
    const c=conn();
    if(!c)return;
    if(c.textContent==='接続できません')c.textContent=navigator.onLine?'再接続中…':'オフライン（表示保持）';
  }
  function restoreIfTransient(el){
    if(!el||restoring||!el.textContent?.includes(FAILURE_TEXT)||!lastGoodHtml)return;
    restoring=true;
    el.innerHTML=lastGoodHtml;
    el.dataset.job=lastGoodJob;
    requestAnimationFrame(()=>{
      try{window.__aiEditorialScrollState?.restore?.(lastGoodJob)}catch(_){ }
      restoring=false;
    });
    softenConnectionLabel();
  }
  function latestVisibleGroup(){
    try{
      if(typeof window.groupedJobs!=='function')return null;
      const groups=window.groupedJobs();
      if(!Array.isArray(groups)||!groups.length)return null;
      const activeId=document.querySelector('.job.active')?.dataset?.job||'';
      return groups.find(g=>String(g?.id||'')===activeId)||groups[0]||null;
    }catch{return null}
  }
  function applyMinimalState(){
    const g=latestVisibleGroup();
    const last=g?.last||null;
    if(!last)return;
    const state=String(last.state||'').toUpperCase();
    const human=state==='HUMAN_GATE'||state==='NEEDS_HUMAN';
    const room=document.querySelector('#roomState');if(room)room.textContent=human?'管理者確認':state||'—';
    const current=document.querySelector('#state');if(current)current.textContent=human?'管理者確認待ち':state||'—';
    const ps=document.querySelector('#progressStatus');
    const pm=document.querySelector('#progressMain');
    const pf=document.querySelector('#progressFlow');
    const pw=document.querySelector('#progressWarn');
    if(human){
      if(ps)ps.className='progressStatus human';
      if(pm)pm.textContent='🟠 管理者確認待ち';
      if(pf)pf.textContent='現在：管理者確認 → 次：判断後に再開';
      if(pw)pw.hidden=true;
      const gate=document.querySelector('#gate');if(gate)gate.textContent=String(last.summary||'管理者の確認を待っています。');
      const gateCard=document.querySelector('#gateCard');if(gateCard)gateCard.classList.add('alert');
    }
  }
  function installRenderGuard(){
    if(renderGuardInstalled)return true;
    const original=window.render;
    if(typeof original!=='function')return false;
    window.render=function(...args){
      try{
        const result=original.apply(this,args);
        const c=conn();if(c&&c.textContent==='ライブ接続中')c.title='';
        return result;
      }catch(err){
        console.error('[AI編集部] dashboard render failed but feed is still available',err);
        const c=conn();
        if(c){
          c.classList.remove('off');
          c.textContent='ライブ接続中';
          c.title='データ取得済み / 表示更新の一部でエラー';
        }
        try{applyMinimalState()}catch(_){ }
        return undefined;
      }
    };
    renderGuardInstalled=true;
    return true;
  }
  function loadDesktopPolish(){
    if(document.querySelector('script[data-ai-editorial-polish]'))return;
    const s=document.createElement('script');
    s.src='./desktop-polish.js?v=0.7.13';
    s.dataset.aiEditorialPolish='1';
    document.body.appendChild(s);
  }
  function install(){
    const el=box();if(!el)return setTimeout(install,200);
    rememberHtml(el);
    setSystemBuild();
    if(!installRenderGuard()){
      let tries=0;const timer=setInterval(()=>{tries++;if(installRenderGuard()||tries>20)clearInterval(timer)},200);
    }
    const observer=new MutationObserver(()=>{
      restoreIfTransient(el);
      if(!restoring)rememberHtml(el);
      softenConnectionLabel();
    });
    observer.observe(el,{childList:true,subtree:true,characterData:true});
    const c=conn();if(c)new MutationObserver(softenConnectionLabel).observe(c,{childList:true,subtree:true,characterData:true});
    window.addEventListener('offline',()=>{const x=conn();if(x){x.classList.add('off');x.textContent='オフライン（表示保持）'}});
    window.addEventListener('online',()=>{const x=conn();if(x){x.classList.add('off');x.textContent='再接続中…'};try{if(typeof refresh==='function')refresh()}catch{}});
    loadDesktopPolish();
  }
  install();
})();
