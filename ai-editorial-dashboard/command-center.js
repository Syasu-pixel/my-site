(()=>{
  const COMMAND_ENDPOINT=SUPABASE_URL+'/functions/v1/ai-editorial-command';
  const style=document.createElement('style');
  style.textContent=`
    .commandComposer{flex:0 0 auto;background:rgba(255,255,255,.96);border-top:1px solid #d4dde9;padding:10px 14px calc(10px + env(safe-area-inset-bottom));position:relative;z-index:3}.commandForm{display:grid;grid-template-columns:1fr auto;gap:8px;max-width:920px;margin:0 auto}.commandInput{width:100%;min-width:0;resize:none;min-height:44px;max-height:120px;padding:11px 12px;border:1px solid #bdc9d8;border-radius:13px;background:#fff;color:#172033;font:inherit;line-height:1.45;outline:none}.commandInput:focus{border-color:#6f83e8;box-shadow:0 0 0 3px rgba(93,120,255,.12)}.commandSend{align-self:end;height:44px;border:0;border-radius:12px;padding:0 18px;background:#172033;color:#fff;font-weight:800;cursor:pointer;white-space:nowrap}.commandSend:disabled{opacity:.55;cursor:wait}.commandMeta{grid-column:1/-1;display:flex;justify-content:space-between;gap:10px;font-size:10px;color:#697386;padding:0 3px;min-height:14px}.commandMeta.error{color:#a13b3b}.commandMeta.ok{color:#25744a}.roomHead{min-height:58px!important;padding:6px 12px!important;grid-template-columns:minmax(0,1fr) minmax(180px,255px) auto!important;gap:8px!important}.roomHead h1{font-size:13px!important;line-height:1.3!important}.roomSub{font-size:9px!important}.closeCase{border:1px solid #d9a3a3;background:#fff5f5;color:#9b3030;border-radius:9px;padding:5px 9px;font-size:10px;font-weight:800;cursor:pointer;margin-left:6px}.closeCase:hover{background:#ffe8e8}.closeCase:disabled{opacity:.5;cursor:wait}.stallRecovery{display:none!important}@media(max-width:760px){.commandComposer{padding:8px}.commandInput{font-size:13px}.commandMeta{font-size:9px}.roomHead{min-height:82px!important}.closeCase{padding:4px 7px;font-size:9px}}
  `;document.head.appendChild(style);
  const version=document.querySelector('.version');if(version)version.textContent='chat v0.7.1';

  window.attendanceData=function(){
    const gem=latestProvider('google-gemini');
    const research=latestProvider('openai-web-research');
    return [
      {icon:'🧠',name:'ChatGPT編集長',role:'企画・執筆・統括・GitHub/Preview',status:'🟢 主担当',cls:'ok'},
      {icon:'🌐',name:'Web調査',role:'メーカー公式・一次資料調査',status:research?'🟢 調査記録あり':'⚪ 必要時',cls:research?'ok':'idle'},
      {icon:'🔍',name:'Gemini',role:'反対・検証担当',status:gem?'🟢 検証記録あり':'⚪ 必要時',cls:gem?'ok':'idle'},
      {icon:'⚖️',name:'最終監査',role:'根拠・構成・公開前チェック',status:'⚪ Preview前',cls:'idle'},
      {icon:'🗂️',name:'Supabase',role:'案件・状態・履歴管理',status:'🟢 管理中',cls:'ok'}
    ];
  };

  function commandIdFromJob(id){const m=String(id||'').match(/^command-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:-|$)/i);return m?m[1]:null}
  const badge=document.querySelector('#roomState');
  if(badge){const close=document.createElement('button');close.id='closeCase';close.className='closeCase';close.type='button';close.textContent='案件を閉じる';badge.insertAdjacentElement('afterend',close);close.addEventListener('click',async()=>{const commandId=commandIdFromJob(selectedJob);if(!commandId){alert('この旧案件は新しい案件管理IDに紐づいていないため、画面から閉じられません。');return}if(!confirm('この案件を閉じますか？\n履歴は削除せず、案件キューの完了側へ移します。'))return;close.disabled=true;close.textContent='終了中…';try{const{data,error}=await sb.rpc('ai_editorial_close_command',{p_command_id:commandId});if(error)throw error;manualSelection=false;await refresh()}catch(err){console.error('[AI編集部] close command failed',err);alert('案件を閉じられませんでした。もう一度お試しください。')}finally{close.disabled=false;close.textContent='案件を閉じる'}})}

  const main=document.querySelector('.chat');if(!main)return;
  const composer=document.createElement('div');composer.className='commandComposer';
  composer.innerHTML=`<form id="commandForm" class="commandForm"><textarea id="commandInput" class="commandInput" maxlength="4000" rows="1" placeholder="AI編集部に指示する（例：月曜定例を開始。公式資料を優先して今週の記事候補を整理）"></textarea><button id="commandSend" class="commandSend" type="submit">登録</button><div id="commandMeta" class="commandMeta"><span>管理者 → AI編集部 → ChatGPT編集長 → Web調査 / Gemini検証 → GitHub → Preview</span><span id="commandCount">0 / 4000</span></div></form>`;
  main.appendChild(composer);
  const form=document.querySelector('#commandForm'),input=document.querySelector('#commandInput'),send=document.querySelector('#commandSend'),meta=document.querySelector('#commandMeta'),count=document.querySelector('#commandCount');
  function setMeta(text,kind=''){meta.classList.remove('error','ok');if(kind)meta.classList.add(kind);meta.firstElementChild.textContent=text}
  function resize(){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,120)+'px'}
  function requestedCount(text){const m=text.match(/(?:新記事|記事|案件)?\s*(\d{1,2})\s*(?:本|件|個)/);if(!m)return null;const n=Number(m[1]);return Number.isInteger(n)&&n>=1&&n<=50?n:null}
  input.addEventListener('input',()=>{count.textContent=input.value.length+' / 4000';resize()});
  input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')form.requestSubmit()});
  form.addEventListener('submit',async e=>{
    e.preventDefault();const instruction=input.value.trim();if(!instruction){setMeta('指示を入力してください。','error');return}
    const {data:{session},error:sessionError}=await sb.auth.getSession();if(sessionError||!session){setMeta('ログイン状態を確認できません。','error');return}
    send.disabled=true;send.textContent='登録中…';setMeta('案件キューへ登録しています…');
    try{
      const r=await fetch(COMMAND_ENDPOINT,{method:'POST',headers:{Authorization:'Bearer '+session.access_token,apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({instruction,requested_count:requestedCount(instruction),options:{source:'dashboard-v0.7.1',execution_model:'chatgpt-editor-in-chief',auto_process:false}})});
      const raw=await r.text();let d={};try{d=raw?JSON.parse(raw):{}}catch{d={raw}};
      if(r.status===401){lockApp('ログインの有効期限が切れました。もう一度ログインしてください。');return}
      if(r.status===403)throw new Error('このアカウントには指示権限がありません。');if(!r.ok)throw new Error(d?.detail?.message||d?.error||'指示の登録に失敗しました。');
      input.value='';resize();count.textContent='0 / 4000';setMeta('案件を登録しました。ChatGPT編集長が実作業を担当する運用です。','ok');manualSelection=false;await refresh();
    }catch(err){console.error('[AI編集部] command submit failed',err);setMeta(err instanceof Error?err.message:'指示の登録に失敗しました。','error')}
    finally{send.disabled=false;send.textContent='登録'}
  });
})();