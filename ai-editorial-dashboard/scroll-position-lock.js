(()=>{
  const el=document.querySelector('#events');
  if(!el)return;

  let manualLock=false;
  let manualTop=el.scrollTop||0;
  let restoring=false;
  let lastJob=el.dataset.job||'';

  function distanceFromBottom(){return Math.max(0,el.scrollHeight-el.scrollTop-el.clientHeight)}
  function updateFromUser(){
    if(restoring)return;
    const currentJob=el.dataset.job||'';
    if(currentJob!==lastJob){lastJob=currentJob;manualLock=false;manualTop=el.scrollTop||0;return}
    if(distanceFromBottom()>140){manualLock=true;manualTop=el.scrollTop||0}else{manualLock=false}
  }

  el.addEventListener('scroll',updateFromUser,{passive:true});
  el.addEventListener('wheel',()=>{if(distanceFromBottom()>80){manualLock=true;manualTop=el.scrollTop||0}},{passive:true});
  el.addEventListener('touchmove',()=>{if(distanceFromBottom()>80){manualLock=true;manualTop=el.scrollTop||0}},{passive:true});

  const observer=new MutationObserver(()=>{
    const currentJob=el.dataset.job||'';
    if(currentJob!==lastJob){lastJob=currentJob;manualLock=false;manualTop=el.scrollTop||0;return}
    if(!manualLock)return;
    const target=manualTop;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(!manualLock)return;
      restoring=true;
      el.scrollTop=Math.min(target,Math.max(0,el.scrollHeight-el.clientHeight));
      requestAnimationFrame(()=>{restoring=false});
    }));
  });
  observer.observe(el,{childList:true,subtree:true});
})();
