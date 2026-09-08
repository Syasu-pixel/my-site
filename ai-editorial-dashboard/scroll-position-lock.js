(()=>{
  const el=document.querySelector('#events');
  if(!el)return;

  let manualLock=false;
  let manualTop=el.scrollTop||0;
  let restoring=false;
  let lastJob=el.dataset.job||'';
  let userIntentUntil=0;

  function distanceFromBottom(){return Math.max(0,el.scrollHeight-el.scrollTop-el.clientHeight)}
  function markUserIntent(){userIntentUntil=Date.now()+800}
  function isUserScroll(){return Date.now()<=userIntentUntil}

  function handleScroll(){
    if(restoring||!isUserScroll())return;
    const currentJob=el.dataset.job||'';
    if(currentJob!==lastJob){
      lastJob=currentJob;
      manualLock=false;
      manualTop=el.scrollTop||0;
      return;
    }
    if(distanceFromBottom()>140){
      manualLock=true;
      manualTop=el.scrollTop||0;
    }else{
      manualLock=false;
      manualTop=el.scrollTop||0;
    }
  }

  el.addEventListener('wheel',markUserIntent,{passive:true});
  el.addEventListener('touchstart',markUserIntent,{passive:true});
  el.addEventListener('touchmove',markUserIntent,{passive:true});
  el.addEventListener('pointerdown',markUserIntent,{passive:true});
  el.addEventListener('keydown',e=>{
    if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))markUserIntent();
  });
  el.addEventListener('scroll',handleScroll,{passive:true});

  const observer=new MutationObserver(()=>{
    const currentJob=el.dataset.job||'';
    if(currentJob!==lastJob){
      lastJob=currentJob;
      manualLock=false;
      manualTop=el.scrollTop||0;
      return;
    }
    if(!manualLock)return;
    const target=manualTop;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(!manualLock)return;
      restoring=true;
      el.scrollTop=Math.min(target,Math.max(0,el.scrollHeight-el.clientHeight));
      requestAnimationFrame(()=>{restoring=false});
    }));
  });
  observer.observe(el,{childList:true,subtree:true,characterData:true});
})();
