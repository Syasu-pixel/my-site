(()=>{
  const FAILURE_TEXT='安全なイベントfeedへ接続できません。自動で再接続します。';
  let lastGoodHtml='';
  let lastGoodJob='';
  let restoring=false;

  function box(){return document.querySelector('#events')}
  function conn(){return document.querySelector('#conn')}
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
  function loadDesktopPolish(){
    if(document.querySelector('script[data-ai-editorial-polish]'))return;
    const s=document.createElement('script');
    s.src='./desktop-polish.js?v=0.7.11';
    s.dataset.aiEditorialPolish='1';
    document.body.appendChild(s);
  }
  function install(){
    const el=box();if(!el)return setTimeout(install,200);
    rememberHtml(el);
    const observer=new MutationObserver(()=>{
      restoreIfTransient(el);
      /* DOM redraws can temporarily force scrollTop to 0. Never record scroll
         state here; only remember the last good HTML. Scroll position is owned by
         scroll-position-lock.js and is updated only by real user interaction. */
      if(!restoring)rememberHtml(el);
      softenConnectionLabel();
    });
    observer.observe(el,{childList:true,subtree:true,characterData:true});
    const c=conn();if(c)new MutationObserver(softenConnectionLabel).observe(c,{childList:true,subtree:true,characterData:true});
    window.addEventListener('offline',()=>{const x=conn();if(x){x.classList.add('off');x.textContent='オフライン（表示保持）'}});
    window.addEventListener('online',()=>{const x=conn();if(x){x.classList.add('off');x.textContent='再接続中…'};try{if(typeof refresh==='function')refresh()}catch{}});
    const v=document.querySelector('.version');if(v){v.textContent='system v0.7.10';v.title='AI編集部 system v0.7.10';v.dataset.build='0.7.10'}
    loadDesktopPolish();
  }
  install();
})();
