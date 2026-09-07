(()=>{
  const FAILURE_TEXT='安全なイベントfeedへ接続できません。自動で再接続します。';
  let lastGoodHtml='';
  let lastGoodJob='';
  let lastGoodScroll=0;
  let restoring=false;

  function box(){return document.querySelector('#events')}
  function conn(){return document.querySelector('#conn')}
  function hasUsableView(el){
    if(!el)return false;
    if(el.textContent?.includes(FAILURE_TEXT))return false;
    return Boolean(el.dataset?.job);
  }
  function remember(el){
    if(!hasUsableView(el))return;
    lastGoodHtml=el.innerHTML;
    lastGoodJob=el.dataset.job||'';
    lastGoodScroll=el.scrollTop||0;
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
    requestAnimationFrame(()=>{el.scrollTop=lastGoodScroll;restoring=false});
    softenConnectionLabel();
  }
  function install(){
    const el=box();if(!el)return setTimeout(install,200);
    remember(el);
    const observer=new MutationObserver(()=>{
      restoreIfTransient(el);
      if(!restoring)remember(el);
      softenConnectionLabel();
    });
    observer.observe(el,{childList:true,subtree:true,characterData:true});
    const c=conn();if(c)new MutationObserver(softenConnectionLabel).observe(c,{childList:true,subtree:true,characterData:true});
    window.addEventListener('offline',()=>{const x=conn();if(x){x.classList.add('off');x.textContent='オフライン（表示保持）'}});
    window.addEventListener('online',()=>{const x=conn();if(x){x.classList.add('off');x.textContent='再接続中…'};try{if(typeof refresh==='function')refresh()}catch{}});
    const v=document.querySelector('.version');if(v)v.textContent='chat v0.7.9';
  }
  install();
})();
