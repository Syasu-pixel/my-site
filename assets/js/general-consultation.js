// denkicontrol.com general online consultation -> existing Cloudflare mail worker.
(()=>{
  const d=document;
  const form=d.getElementById('generalConsultationForm');
  if(!form)return;

  const API='https://gxworks2-support-api.syasuta0819.workers.dev';
  const STORAGE_KEY='dc-general-consultation-key-v1';
  const STORAGE_PAYLOAD='dc-general-consultation-payload-v1';
  const button=d.getElementById('consultation-submit');
  const status=d.getElementById('consultation-status');
  const success=d.getElementById('consultation-success');
  const successCode=d.getElementById('consultation-success-code');

  function newKey(){
    if(globalThis.crypto?.randomUUID)return `web_${crypto.randomUUID()}`;
    const b=new Uint8Array(24);crypto.getRandomValues(b);
    return `web_${Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')}`;
  }

  function payload(){
    const fd=new FormData(form);
    return {
      name:String(fd.get('name')||'').trim(),
      email:String(fd.get('email')||'').trim(),
      company:String(fd.get('company')||'').trim(),
      category:String(fd.get('category')||'').trim(),
      relatedUrl:String(fd.get('relatedUrl')||'').trim(),
      message:String(fd.get('message')||'').trim(),
      replyWanted:String(fd.get('replyWanted')||'yes')!=='no',
      privacyAccepted:fd.get('privacyAccepted')==='on',
    };
  }

  function requestKey(p){
    const snapshot=JSON.stringify(p);
    const oldKey=sessionStorage.getItem(STORAGE_KEY)||'';
    const oldPayload=sessionStorage.getItem(STORAGE_PAYLOAD)||'';
    if(oldKey&&oldPayload===snapshot)return oldKey;
    const key=newKey();
    sessionStorage.setItem(STORAGE_KEY,key);
    sessionStorage.setItem(STORAGE_PAYLOAD,snapshot);
    return key;
  }

  function showStatus(message,type=''){
    status.textContent=message;
    status.className='consultation-status'+(type?` is-${type}`:'');
  }

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(button.disabled)return;
    const p=payload();

    if(!p.name||!p.email||!p.category||!p.message||!p.privacyAccepted){
      showStatus('必須項目とプライバシーポリシーへの同意を確認してください。','error');
      return;
    }

    const key=requestKey(p);
    button.disabled=true;
    button.textContent='送信しています…';
    showStatus('相談内容を送信しています。');

    try{
      const res=await fetch(API+'/general-consultations',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...p,requestKey:key}),
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok||!data.ok)throw new Error(data.error||`HTTP ${res.status}`);

      successCode.textContent=data.caseNumber||'受付済み';
      success.hidden=false;
      form.hidden=true;
      showStatus('');
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_PAYLOAD);
      success.scrollIntoView({behavior:'smooth',block:'center'});
    }catch(error){
      console.error(error);
      showStatus('送信できませんでした。通信状態を確認して、もう一度お試しください。','error');
      button.disabled=false;
      button.textContent='オンライン相談を送信する';
    }
  });
})();
