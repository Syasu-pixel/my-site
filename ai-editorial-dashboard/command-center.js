(()=>{
  const COMMAND_ENDPOINT=SUPABASE_URL+'/functions/v1/ai-editorial-command';
  const terminalStates=new Set(['COMPLETED','CANCELLED','CLOSED','REJECTED','PUBLISHED','MERGED','DONE']);
  const style=document.createElement('style');
  style.textContent=`
    .commandComposer{flex:0 0 auto;background:rgba(255,255,255,.96);border-top:1px solid #d4dde9;padding:10px 14px calc(10px + env(safe-area-inset-bottom));position:relative;z-index:3}.commandForm{display:grid;grid-template-columns:1fr auto;gap:8px;max-width:920px;margin:0 auto}.commandInput{width:100%;min-width:0;resize:none;min-height:44px;max-height:120px;padding:11px 12px;border:1px solid #bdc9d8;border-radius:13px;background:#fff;color:#172033;font:inherit;line-height:1.45;outline:none}.commandInput:focus{border-color:#6f83e8;box-shadow:0 0 0 3px rgba(93,120,255,.12)}.commandSend{align-self:end;height:44px;border:0;border-radius:12px;padding:0 18px;background:#172033;color:#fff;font-weight:800;cursor:pointer;white-space:nowrap}.commandSend:disabled{opacity:.55;cursor:not-allowed}.commandMeta{grid-column:1/-1;display:flex;justify-content:space-between;gap:10px;font-size:10px;color:#697386;padding:0 3px;min-height:14px}.commandMeta.error{color:#a13b3b}.commandMeta.ok{color:#25744a}.commandLock{grid-column:1/-1;border:1px solid #ead17a;background:#fff8dc;color:#6d5817;border-radius:10px;padding:7px 9px;font-size:10px;font-weight:800;line-height:1.45}.commandLock[hidden]{display:none}.weeklyButton:disabled{opacity:.45;cursor:not-allowed;background:#f1f3f7!important;border-color:#d6deea!important;color:#7b879b!important;box-shadow:none!important}.roomHead{min-height:58px!important;padding:6px 12px!important;grid-template-columns:minmax(0,1fr) minmax(180px,255px) auto!important;gap:8px!important}.roomHead h1{font-size:13px!important;line-height:1.3!important}.roomSub{font-size:9px!important}.closeCase{border:1px solid #d9a3a3;background:#fff5f5;color:#9b3030;border-radius:9px;padding:5px 9px;font-size:10px;font-weight:800;cursor:pointer;margin-left:6px}.closeCase:hover{background:#ffe8e8}.closeCase:disabled{opacity:.5;cursor:wait}.stallRecovery{display:none!important}@media(max-width:760px){.commandComposer{padding:8px}.commandInput{font-size:13px}.commandMeta{font-size:9px}.commandLock{font-size:9px}.roomHead{min-height:82px!important}.closeCase{padding:4px 7px;font-size:9px}}
  `;document.head.appendChild(style);
  const version=document.querySelector('.version');if(version)version.textContent='chat v0.7.3';

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

  window.renderArtifacts=function(ev){
    const root=document.querySelector('#artifacts');if(!root)return;
    const items=[],seen=new Set();
    const addLink=(url,label,hint)=>{if(!url||seen.has(url))return;try{const u=new URL(url);if(u.protocol!=='https:')return;seen.add(url);items.push(`<a class="artifactLink" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}<div class="artifactHint">${esc(hint)}</div></a>`)}catch(_){}};
    for(const e of Array.isArray(ev)?ev:[]){
      const stage=String(e?.discussion?.stage||''),type=String(e?.type||e?.event_type||'');
      if(stage==='weekly-plan-saved'||type==='weekly-plan-saved'){
        if(!seen.has('weekly-plan')){seen.add('weekly-plan');items.push('<div class="card"><b>📌 今週の編集方針を保存済み</b><div class="artifactHint">火〜日はこの方針を自動参照します。</div></div>')}
        continue;
      }
      const evidence=Array.isArray(e?.evidence)?e.evidence:[];
      for(const x of evidence){
        const kind=String(x?.kind||''),ref=String(x?.ref||'');
        if(kind==='github-pr')addLink(ref,'🔧 変更内容を見る','GitHub');
        else if(kind==='preview'||kind==='artifact')addLink(ref,'🌐 確認用ページを開く','記事プレビュー');
        else if(kind==='published-url'||kind==='public-url')addLink(ref,'🌐 公開ページを見る','公開ページ');
        else if(kind==='image')addLink(ref,'🖼️ 画像を確認','画像');
      }
      if(['preview-ready','publish-complete','published','pr-created'].includes(stage)||['preview','published','publication','artifact'].includes(type)){
        const urls=[...collectUrls(e)];
        for(const url of urls){try{const u=new URL(url),p=u.pathname.toLowerCase();if(u.hostname.includes('netlify'))addLink(url,'🌐 確認用ページを開く','記事プレビュー');else if(u.hostname==='github.com'&&p.includes('/pull/'))addLink(url,'🔧 変更内容を見る','GitHub');else if(/\.(webp|png|jpe?g)$/.test(p))addLink(url,'🖼️ 画像を確認','画像');else if(u.hostname.includes('denkicontrol.com'))addLink(url,'🌐 公開ページを見る','公開ページ')}catch(_){}}
      }
    }
    root.innerHTML=items.length?items.slice(0,6).join(''):'<div class="card empty">確認できるものはまだありません。</div>';
  };

  function commandIdFromJob(id){const m=String(id||'').match(/^command-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:-|$)/i);return m?m[1]:null}
  const badge=document.querySelector('#roomState');
  if(badge){const close=document.createElement('button');close.id='closeCase';close.className='closeCase';close.type='button';close.textContent='案件を閉じる';badge.insertAdjacentElement('afterend',close);close.addEventListener('click',async()=>{const commandId=commandIdFromJob(selectedJob);if(!commandId){alert('この旧案件は新しい案件管理IDに紐づいていないため、画面から閉じられません。');return}if(!confirm('この案件を閉じますか？\n履歴は削除せず、案件キューの完了側へ移します。'))return;close.disabled=true;close.textContent='終了中…';try{const{data,error}=await sb.rpc('ai_editorial_close_command',{p_command_id:commandId});if(error)throw error;manualSelection=false;await refresh()}catch(err){console.error('[AI編集部] close command failed',err);alert('案件を閉じられませんでした。もう一度お試しください。')}finally{close.disabled=false;close.textContent='案件を閉じる'}})}

  const main=document.querySelector('.chat');if(!main)return;
  const composer=document.createElement('div');composer.className='commandComposer';
  composer.innerHTML=`<form id="commandForm" class="commandForm"><textarea id="commandInput" class="commandInput" maxlength="4000" rows="1" placeholder="AI編集部に指示する（例：月曜定例を開始。公式資料を優先して今週の記事候補を整理）"></textarea><button id="commandSend" class="commandSend" type="submit">登録</button><div id="commandLock" class="commandLock" hidden></div><div id="commandMeta" class="commandMeta"><span>管理者 → AI編集部 → ChatGPT編集長 → Web調査 / Gemini検証 → GitHub → Preview</span><span id="commandCount">0 / 4000</span></div></form>`;
  main.appendChild(composer);
  const form=document.querySelector('#commandForm'),input=document.querySelector('#commandInput'),send=document.querySelector('#commandSend'),lock=document.querySelector('#commandLock'),meta=document.querySelector('#commandMeta'),count=document.querySelector('#commandCount');
  let sending=false;
  function setMeta(text,kind=''){meta.classList.remove('error','ok');if(kind)meta.classList.add(kind);meta.firstElementChild.textContent=text}
  function resize(){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,120)+'px'}
  function requestedCount(text){const m=text.match(/(?:新記事|記事|案件)?\s*(\d{1,2})\s*(?:本|件|個)/);if(!m)return null;const n=Number(m[1]);return Number.isInteger(n)&&n>=1&&n<=50?n:null}
  function activeCommand(){let groups=[];try{groups=typeof groupedJobs==='function'?groupedJobs():[]}catch(_){groups=[]}return groups.find(g=>{const id=String(g?.id||'');if(!commandIdFromJob(id))return false;const state=String(g?.last?.state||'').toUpperCase();return !terminalStates.has(state)})||null}
  function syncComposerLock(){
    const active=activeCommand(),locked=Boolean(active)||sending;send.disabled=locked;
    document.querySelectorAll('.weeklyButton').forEach(b=>{if(!b.dataset.unlockedTitle)b.dataset.unlockedTitle=b.title||'';b.disabled=locked;b.title=active?'現在の案件が完了または終了するまで新しい曜日案件は開始できません。':b.dataset.unlockedTitle});
    if(active){const state=String(active.last?.state||'進行中').toUpperCase(),title=String(active.first?.summary||'現在の案件').replace(/^提案[:：]\s*/,'').slice(0,60);lock.hidden=false;lock.textContent=`🔒 現在の案件が${state}です。「${title}」が完了するか、管理者が案件を閉じるまで新しい案件は登録できません。`;if(!sending)send.textContent='処理中'}else if(sending){lock.hidden=false;lock.textContent='案件を登録しています。重複登録を防ぐため一時的に操作をロックしています。'}else{lock.hidden=true;send.textContent='登録'}
  }
  input.addEventListener('input',()=>{count.textContent=input.value.length+' / 4000';resize()});
  input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')form.requestSubmit()});
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(activeCommand()){syncComposerLock();setMeta('現在の案件が完了または終了してから次の案件を登録してください。','error');return}
    const instruction=input.value.trim();if(!instruction){setMeta('指示を入力してください。','error');return}
    const {data:{session},error:sessionError}=await sb.auth.getSession();if(sessionError||!session){setMeta('ログイン状態を確認できません。','error');return}
    sending=true;send.textContent='登録中…';syncComposerLock();setMeta('案件キューへ登録しています…');
    try{const r=await fetch(COMMAND_ENDPOINT,{method:'POST',headers:{Authorization:'Bearer '+session.access_token,apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({instruction,requested_count:requestedCount(instruction),options:{source:'dashboard-v0.7.3',execution_model:'chatgpt-editor-in-chief',auto_process:false}})});const raw=await r.text();let d={};try{d=raw?JSON.parse(raw):{}}catch{d={raw}};if(r.status===401){lockApp('ログインの有効期限が切れました。もう一度ログインしてください。');return}if(r.status===403)throw new Error('このアカウントには指示権限がありません。');if(!r.ok)throw new Error(d?.message||d?.detail?.message||d?.detail?.detail?.message||d?.error||'指示の登録に失敗しました。');input.value='';resize();count.textContent='0 / 4000';setMeta('案件を登録しました。完了または終了するまで新規登録はロックされます。','ok');manualSelection=false;await refresh()}catch(err){console.error('[AI編集部] command submit failed',err);setMeta(err instanceof Error?err.message:'指示の登録に失敗しました。','error')}finally{sending=false;syncComposerLock()}
  });
  setTimeout(syncComposerLock,300);setInterval(syncComposerLock,1000);
})();