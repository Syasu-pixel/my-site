(()=>{
  const FN='/functions/v1/ai-editorial-article-builder';
  const COOLDOWN=5*60*1000;
  let busy=false;

  function currentCommand(){
    const job=document.querySelector('#events')?.dataset?.job||'';
    const m=job.match(/^command-([0-9a-f-]{36})$/i);
    return m?.[1]||'';
  }
  function isBuilding(){
    const s=(document.querySelector('#state')?.textContent||'').trim();
    return s==='制作中'||s==='BUILDING';
  }
  function locked(id){
    const n=Number(localStorage.getItem('ai-editorial-builder:'+id)||0);
    return n&&Date.now()-n<COOLDOWN;
  }
  async function tick(){
    if(busy||!isBuilding())return;
    const id=currentCommand();
    if(!id||locked(id))return;
    busy=true;
    localStorage.setItem('ai-editorial-builder:'+id,String(Date.now()));
    try{
      const {data:{session}}=await sb.auth.getSession();
      if(!session)return;
      const r=await fetch(SUPABASE_URL+FN,{method:'POST',cache:'no-store',headers:{Authorization:'Bearer '+session.access_token,apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({command_id:id})});
      const text=await r.text();
      let body={};try{body=text?JSON.parse(text):{}}catch{body={raw:text}}
      if(!r.ok){
        console.warn('[AI編集部] article builder',r.status,body);
        if(r.status>=500)localStorage.setItem('ai-editorial-builder:'+id,String(Date.now()-COOLDOWN+60000));
      }else{
        console.info('[AI編集部] article builder started/completed',body);
      }
    }catch(e){
      console.warn('[AI編集部] article builder request failed',e);
      localStorage.setItem('ai-editorial-builder:'+id,String(Date.now()-COOLDOWN+60000));
    }finally{busy=false}
  }
  setInterval(tick,7000);
  setTimeout(tick,1800);
})();
