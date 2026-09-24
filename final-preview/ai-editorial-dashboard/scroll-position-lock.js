(()=>{
  const el=document.querySelector('#events');
  if(!el)return;

  let manualLock=false;
  let manualTop=el.scrollTop||0;
  let restoring=false;
  let lastJob=el.dataset.job||'';
  let userIntentUntil=0;

  const keyFor=job=>'ai-editorial-scroll:'+String(job||'none');
  function save(job,top){
    try{sessionStorage.setItem(keyFor(job),String(Math.max(0,Math.round(top||0))))}catch(_){ }
  }
  function load(job){
    try{const v=Number(sessionStorage.getItem(keyFor(job)));return Number.isFinite(v)&&v>=0?v:null}catch(_){return null}
  }
  function distanceFromBottom(){return Math.max(0,el.scrollHeight-el.scrollTop-el.clientHeight)}
  function markUserIntent(){userIntentUntil=Date.now()+1000}
  function isUserScroll(){return Date.now()<=userIntentUntil}
  function restore(top){
    restoring=true;
    const target=Math.min(Math.max(0,top||0),Math.max(0,el.scrollHeight-el.clientHeight));
    el.scrollTop=target;
    requestAnimationFrame(()=>{
      el.scrollTop=Math.min(target,Math.max(0,el.scrollHeight-el.clientHeight));
      requestAnimationFrame(()=>{restoring=false});
    });
  }

  function handleScroll(){
    if(restoring||!isUserScroll())return;
    const currentJob=el.dataset.job||'';
    if(currentJob!==lastJob){lastJob=currentJob;manualLock=false;manualTop=el.scrollTop||0;return}
    manualTop=el.scrollTop||0;
    save(currentJob,manualTop);
    manualLock=distanceFromBottom()>140;
  }

  el.addEventListener('wheel',markUserIntent,{passive:true});
  el.addEventListener('touchstart',markUserIntent,{passive:true});
  el.addEventListener('touchmove',markUserIntent,{passive:true});
  el.addEventListener('pointerdown',markUserIntent,{passive:true});
  el.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))markUserIntent()});
  el.addEventListener('scroll',handleScroll,{passive:true});

  /* render() itself replaces the message DOM on every feed refresh. Preserve the
     user's reading position around that replacement instead of trying to repair it later. */
  const priorRender=window.render;
  if(typeof priorRender==='function'&&!priorRender.__aiScrollWrapped){
    const wrapped=function(...args){
      const beforeJob=el.dataset.job||'';
      const beforeTop=manualLock?manualTop:el.scrollTop||0;
      const keep=manualLock;
      const out=priorRender.apply(this,args);
      const afterJob=el.dataset.job||'';
      if(keep&&beforeJob&&beforeJob===afterJob)restore(beforeTop);
      return out;
    };
    wrapped.__aiScrollWrapped=true;
    window.render=wrapped;
  }

  /* If another script replaces the DOM (including transient feed errors), restore
     only from a position captured by a real user scroll. Never learn scrollTop=0
     from an automatic redraw. */
  const observer=new MutationObserver(()=>{
    const currentJob=el.dataset.job||'';
    if(currentJob!==lastJob){
      lastJob=currentJob;
      const saved=load(currentJob);
      manualLock=false;
      manualTop=saved??(el.scrollTop||0);
      return;
    }
    if(!manualLock)return;
    restore(manualTop);
  });
  observer.observe(el,{childList:true,subtree:true,characterData:true});

  window.__aiEditorialScrollState={
    get(job=el.dataset.job||''){const saved=load(job);return saved??manualTop},
    isLocked(){return manualLock},
    restore(job=el.dataset.job||''){const saved=load(job);if(saved!=null)restore(saved)}
  };
})();
