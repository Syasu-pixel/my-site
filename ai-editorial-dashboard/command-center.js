(()=>{
  const COMMAND_ENDPOINT=SUPABASE_URL+'/functions/v1/ai-editorial-command';
  const style=document.createElement('style');
  style.textContent=`
    .commandComposer{flex:0 0 auto;background:rgba(255,255,255,.96);border-top:1px solid #d4dde9;padding:10px 14px calc(10px + env(safe-area-inset-bottom));position:relative;z-index:3}
    .commandForm{display:grid;grid-template-columns:1fr auto;gap:8px;max-width:920px;margin:0 auto}
    .commandInput{width:100%;min-width:0;resize:none;min-height:44px;max-height:120px;padding:11px 12px;border:1px solid #bdc9d8;border-radius:13px;background:#fff;color:#172033;font:inherit;line-height:1.45;outline:none}
    .commandInput:focus{border-color:#6f83e8;box-shadow:0 0 0 3px rgba(93,120,255,.12)}
    .commandSend{align-self:end;height:44px;border:0;border-radius:12px;padding:0 18px;background:#172033;color:#fff;font-weight:800;cursor:pointer;white-space:nowrap}
    .commandSend:disabled{opacity:.55;cursor:wait}
    .commandMeta{grid-column:1/-1;display:flex;justify-content:space-between;gap:10px;font-size:10px;color:#697386;padding:0 3px;min-height:14px}
    .commandMeta.error{color:#a13b3b}.commandMeta.ok{color:#25744a}
    @media(max-width:760px){.commandComposer{padding:8px 8px calc(8px + env(safe-area-inset-bottom))}.commandForm{grid-template-columns:1fr auto;gap:6px}.commandInput{min-height:42px;font-size:13px;padding:10px}.commandSend{height:42px;padding:0 13px;font-size:12px}.commandMeta{font-size:9px}}
  `;
  document.head.appendChild(style);

  const main=document.querySelector('.chat');
  if(!main)return;
  const composer=document.createElement('div');
  composer.className='commandComposer';
  composer.innerHTML=`<form id="commandForm" class="commandForm"><textarea id="commandInput" class="commandInput" maxlength="4000" rows="1" placeholder="AI編集部に指示する（例：今日は初心者向けの新記事を10本作って。メーカー公式資料を優先）"></textarea><button id="commandSend" class="commandSend" type="submit">実行</button><div id="commandMeta" class="commandMeta"><span>管理者指示 → 案件キュー</span><span id="commandCount">0 / 4000</span></div></form>`;
  main.appendChild(composer);

  const form=document.querySelector('#commandForm');
  const input=document.querySelector('#commandInput');
  const send=document.querySelector('#commandSend');
  const meta=document.querySelector('#commandMeta');
  const count=document.querySelector('#commandCount');

  function setMeta(text,kind=''){
    meta.classList.remove('error','ok');
    if(kind)meta.classList.add(kind);
    meta.firstElementChild.textContent=text;
  }
  function resize(){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,120)+'px'}
  function requestedCount(text){
    const m=text.match(/(?:新記事|記事|案件)?\s*(\d{1,2})\s*(?:本|件|個)/);
    if(!m)return null;
    const n=Number(m[1]);
    return Number.isInteger(n)&&n>=1&&n<=50?n:null;
  }

  input.addEventListener('input',()=>{count.textContent=input.value.length+' / 4000';resize();if(meta.classList.contains('error')||meta.classList.contains('ok'))setMeta('管理者指示 → 案件キュー')});
  input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')form.requestSubmit()});

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const instruction=input.value.trim();
    if(!instruction){setMeta('指示を入力してください。','error');input.focus();return}
    const {data:{session},error:sessionError}=await sb.auth.getSession();
    if(sessionError||!session){setMeta('ログイン状態を確認できません。','error');return}
    send.disabled=true;send.textContent='送信中…';setMeta('案件キューへ登録しています…');
    try{
      const r=await fetch(COMMAND_ENDPOINT,{method:'POST',headers:{Authorization:'Bearer '+session.access_token,apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({instruction,requested_count:requestedCount(instruction),options:{source:'dashboard-v0.6'}})});
      const raw=await r.text();let d={};try{d=raw?JSON.parse(raw):{}}catch{d={raw}};
      if(r.status===401){lockApp('ログインの有効期限が切れました。もう一度ログインしてください。');return}
      if(r.status===403)throw new Error('このアカウントには指示権限がありません。');
      if(!r.ok)throw new Error(d?.detail?.message||d?.error||'指示の登録に失敗しました。');
      input.value='';resize();count.textContent='0 / 4000';setMeta('案件キューへ登録しました。編集長の処理待ちです。','ok');manualSelection=false;await refresh();
    }catch(err){console.error('[AI編集部] command submit failed',err);setMeta(err instanceof Error?err.message:'指示の登録に失敗しました。','error')}
    finally{send.disabled=false;send.textContent='実行'}
  });
})();
