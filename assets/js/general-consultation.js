// denkicontrol.com general online consultation -> Cloudflare Worker + Turnstile.
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
  const turnstileHost=d.getElementById('consultation-turnstile');
  let turnstileWidgetId=null;
  let turnstileToken='';

  function newKey(){
    const now=new Date();
    const y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,'0'),day=String(now.getDate()).padStart(2,'0');
    const date=`${y}${m}${day}`;
    if(globalThis.crypto?.randomUUID)return `web_${date}_${crypto.randomUUID()}`;
    const b=new Uint8Array(24);crypto.getRandomValues(b);
    return `web_${date}_${Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')}`;
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

  function resetTurnstile(){
    turnstileToken='';
    button.disabled=true;
    if(globalThis.turnstile&&turnstileWidgetId!==null){
      try{turnstile.reset(turnstileWidgetId);}catch{}
    }
  }

  async function waitForTurnstile(timeoutMs=10000){
    const started=Date.now();
    while(!globalThis.turnstile){
      if(Date.now()-started>timeoutMs)throw new Error('Turnstile script timeout');
      await new Promise(r=>setTimeout(r,100));
    }
  }

  async function initTurnstile(){
    button.disabled=true;
    showStatus('迷惑送信防止の確認を準備しています。');
    try{
      const [configRes]=await Promise.all([
        fetch(API+'/general-consultations/config',{method:'GET'}),
        waitForTurnstile(),
      ]);
      const config=await configRes.json().catch(()=>({}));
      if(!configRes.ok||!config.ok||!config.turnstileSiteKey)throw new Error(config.error||'Turnstile config unavailable');
      turnstileWidgetId=turnstile.render(turnstileHost,{
        sitekey:config.turnstileSiteKey,
        action:'general_consultation',
        callback:token=>{turnstileToken=token;button.disabled=false;showStatus('');},
        'expired-callback':()=>{turnstileToken='';button.disabled=true;showStatus('確認の有効期限が切れました。もう一度確認してください。','error');},
        'error-callback':()=>{turnstileToken='';button.disabled=true;showStatus('迷惑送信防止の確認に失敗しました。再読み込みしてください。','error');},
      });
    }catch(error){
      console.error(error);
      showStatus('迷惑送信防止の確認を読み込めませんでした。時間をおいて再読み込みしてください。','error');
      button.disabled=true;
    }
  }

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(button.disabled)return;
    const p=payload();

    if(!p.name||!p.email||!p.category||!p.message||!p.privacyAccepted){
      showStatus('必須項目とプライバシーポリシーへの同意を確認してください。','error');
      return;
    }
    if(p.message.length>8000){
      showStatus('相談内容は8,000文字以内で入力してください。','error');
      return;
    }
    if(!turnstileToken){
      showStatus('迷惑送信防止の確認を完了してください。','error');
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
        body:JSON.stringify({...p,requestKey:key,turnstileToken}),
      });
      const data=await res.json().catch(()=>({}));

      if(!res.ok||!data.ok){
        if(data.ownerSent&&data.caseNumber){
          successCode.textContent=data.caseNumber;
          showStatus('相談内容は受付済みですが、受付確認メールの送信に失敗しました。もう一度送信すると確認メールを再試行します。','error');
        }else{
          showStatus(
            res.status===429
              ? '短時間に送信回数が多いため、しばらく待ってからお試しください。'
              : '送信できませんでした。入力内容と通信状態を確認して、もう一度お試しください。',
            'error'
          );
        }
        resetTurnstile();
        button.textContent='オンライン相談を送信する';
        return;
      }

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
      resetTurnstile();
      button.textContent='オンライン相談を送信する';
    }
  });

  initTurnstile();
})();
