(()=>{
  if(window.__aiEditorialDeltaFeedInstalled)return;
  window.__aiEditorialDeltaFeedInstalled=true;

  const nativeFetch=window.fetch.bind(window);
  let cache=[];
  let cursor='';

  const isFeed=input=>{
    try{
      const u=new URL(typeof input==='string'?input:input.url,location.href);
      return u.pathname.endsWith('/functions/v1/ai-editorial-secure-feed');
    }catch{return false}
  };
  const eventKey=(e,i)=>String(e?.event_id||e?.id||`${e?.job_id||''}|${e?.created_at||''}|${e?.event_type||''}|${i}`);
  const newestCursor=events=>events.reduce((max,e)=>{
    const t=Date.parse(e?.created_at||'');
    return Number.isFinite(t)&&t>max.t?{t,iso:new Date(t).toISOString()}:max;
  },{t:0,iso:''}).iso;
  const merge=(base,delta)=>{
    const m=new Map();
    base.forEach((e,i)=>m.set(eventKey(e,i),e));
    delta.forEach((e,i)=>m.set(eventKey(e,base.length+i),e));
    return [...m.values()].sort((a,b)=>Date.parse(a?.created_at||0)-Date.parse(b?.created_at||0));
  };

  window.fetch=async function(input,init){
    if(!isFeed(input))return nativeFetch(input,init);

    let requestInput=input;
    try{
      const source=typeof input==='string'?input:input.url;
      const u=new URL(source,location.href);
      if(cursor&&cache.length){
        // 2-second overlap prevents missing events that share nearly identical timestamps.
        const overlap=new Date(Math.max(0,Date.parse(cursor)-2000)).toISOString();
        u.searchParams.set('since',overlap);
        u.searchParams.set('delta','1');
        requestInput=typeof input==='string'?u.toString():new Request(u.toString(),input);
      }
    }catch{}

    const response=await nativeFetch(requestInput,init);
    if(!response.ok)return response;

    let data;
    try{data=await response.clone().json()}catch{return response}
    if(!Array.isArray(data?.events))return response;

    if(data.delta===true&&cache.length){
      cache=merge(cache,data.events);
    }else{
      cache=data.events.slice();
    }

    const next=data.cursor||newestCursor(cache);
    if(next)cursor=next;

    const merged={...data,events:cache,client_delta_cache:true};
    return new Response(JSON.stringify(merged),{
      status:response.status,
      statusText:response.statusText,
      headers:response.headers
    });
  };
})();
