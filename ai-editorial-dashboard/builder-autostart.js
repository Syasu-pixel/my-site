(()=>{
  const FN='/functions/v1/ai-editorial-article-builder';
  const COOLDOWN=5*60*1000;
  let busy=false;

  function commandFrom(value){
    const m=String(value||'').match(/command-([0-9a-f-]{36})(?:-\d{2})?/i);
    return m?.[1]||'';
  }
  function currentCommand(){
    const candidates=[
      document.querySelector('#events')?.dataset?.job,
      document.querySelector('#jobs .job.active')?.dataset?.job,
      document.querySelector('.job.active')?.dataset?.job
    ];
    for(const v of candidates){const id=commandFrom(v);if(id)return id}
    const text=document.querySelector('#events')?.textContent||'';
    return commandFrom(text);
  }
  function isBuilding(){
    const s=(document.querySelector('#state')?.textContent||'').trim().toUpperCase();
    const badge=(document.querySelector('.roomHead .pill,.roomHead [class*=state]')?.textContent||'').trim().toUpperCase();
    return s.includes('制作中')||s.includes('BUILDING')||badge.includes('制作中')||badge.includes('BUILDING');
  }
  function locked(id){
    const n=Number(localStorage.getItem('ai-editorial-builder:'+id)||0);
    return Boolean(n&&Date.now()-n<COOLDOWN);
  }
  async function tick(){
    if(busy||!isBuilding())return;
    const id=currentCommand();
    if(!id||locked(id))return;
    busy=true;
    localStorage.setItem('ai-editorial-builder:'+id,String(Date.now()));
    try{
      if(typeof sb==='undefined'||typeof SUPABASE_URL==='undefined'||typeof SUPABASE_KEY==='undefined')throw new Error('dashboard auth globals unavailable');
      const {data:{session}}=await sb.auth.getSession();
      if(!session){localStorage.removeItem('ai-editorial-builder:'+id);return}
      const r=await fetch(SUPABASE_URL+FN,{method:'POST',cache:'no-store',headers:{Authorization:'Bearer '+session.access_token,apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({command_id:id})});
      const text=await r.text();
      let body={};try{body=text?JSON.parse(text):{}}catch{body={raw:text}}
      if(!r.ok){
        console.warn('[AI編集部] article builder',r.status,body);
        localStorage.setItem('ai-editorial-builder:'+id,String(Date.now()-COOLDOWN+30000));
      }else console.info('[AI編集部] article builder started/completed',body);
    }catch(e){
      console.warn('[AI編集部] article builder request failed',e);
      localStorage.setItem('ai-editorial-builder:'+id,String(Date.now()-COOLDOWN+30000));
    }finally{busy=false}
  }
  window.__aiEditorialBuilderTick=tick;
  setInterval(tick,7000);
  setTimeout(tick,1200);
})();
