// Loaded only in the local/CI review copy, never in the production candidate.
(() => {
  const originalFetch=window.fetch.bind(window),mode=new URLSearchParams(location.search),endpoint='https://pavitnsnmoaiospswiys.supabase.co/functions/v1/article-feedback';
  window.__reviewVotes=[];window.__reviewBlocked=[];
  window.fetch=async(input,init={})=>{
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(url.href===endpoint){
      if(init.method!=='POST')throw Error('Unexpected feedback method');
      const payload=JSON.parse(init.body);window.__reviewVotes.push(payload);
      await new Promise(r=>setTimeout(r,100));
      if(mode.get('mode')==='error')return new Response('{}',{status:503});
      if(mode.get('mode')==='duplicate')return new Response(JSON.stringify({error:'already_voted',vote:'not_helpful'}),{status:409});
      return new Response(JSON.stringify({ok:true}),{status:200});
    }
    if(url.origin===location.origin&&(!init.method||init.method==='GET'))return originalFetch(input,init);
    window.__reviewBlocked.push(url.href);throw Error('Review blocks external requests');
  };
  navigator.sendBeacon=()=>false;
  if(mode.has('no-storage'))Object.defineProperty(window,'localStorage',{get(){throw Error('Review storage unavailable');}});
})();
