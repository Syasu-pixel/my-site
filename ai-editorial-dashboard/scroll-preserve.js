(()=>{
  const box=document.querySelector('#events');
  if(!box||typeof window.render!=='function')return;
  const baseRender=window.render;
  let lastJob=null;
  window.render=function(){
    const sameJob=lastJob===selectedJob;
    const oldTop=box.scrollTop;
    const wasNearBottom=box.scrollHeight-box.scrollTop-box.clientHeight<120;
    baseRender();
    const currentJob=selectedJob;
    requestAnimationFrame(()=>{
      if(sameJob&&!wasNearBottom)box.scrollTop=oldTop;
      lastJob=currentJob;
    });
  };
})();
