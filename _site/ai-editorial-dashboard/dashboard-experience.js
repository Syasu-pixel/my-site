(()=>{
  const TERMINAL=new Set(['COMPLETED','CANCELLED','CLOSED','REJECTED','PUBLISHED','MERGED','DONE']);
  const style=document.createElement('style');
  style.textContent=`
    .editorialHome{padding:22px;max-width:920px;margin:0 auto;width:100%;display:grid;gap:14px}.homeHero{background:#fff;border:1px solid #d7e0eb;border-radius:18px;padding:18px}.homeHero h2{font-size:18px;margin:0 0 5px}.homeHero p{font-size:12px;color:#697386;margin:0;line-height:1.6}.homeGrid{display:grid;grid-template-columns:1.2fr .8fr;gap:12px}.homeCard{background:#fff;border:1px solid #d7e0eb;border-radius:15px;padding:14px}.homeCard h3{font-size:12px;margin:0 0 9px;color:#526176}.homePlanText{font-size:12px;line-height:1.65;color:#25324a}.homeWeek{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.homeDay{border:1px solid #dce3ee;border-radius:9px;padding:7px 3px;text-align:center;font-size:10px;font-weight:800;background:#f8faff}.homeDay.done{background:#eef9f2;border-color:#a9d9bb;color:#25744a}.homeDay.next{box-shadow:0 0 0 2px rgba(93,120,255,.16);border-color:#7187e8}.homeNext{margin-top:8px;font-size:11px;font-weight:800;color:#4157a8}.homeRecent{display:grid;gap:7px}.homeRecentButton{border:1px solid #dce3ee;background:#f9fbff;border-radius:10px;padding:9px 10px;text-align:left;cursor:pointer;color:#25324a}.homeRecentButton:hover{background:#eef2ff}.homeRecentButton b{display:block;font-size:11px}.homeRecentButton span{font-size:9px;color:#7b879b}.queueHomeButton{width:100%;margin:0 0 9px;border:1px solid #cbd6e4;background:#f8faff;color:#304a9a;border-radius:10px;padding:8px 9px;font-size:10px;font-weight:900;cursor:pointer}.queueHomeButton:hover{background:#eef2ff}.queueHomeStatus{margin:0 0 9px;padding:9px 10px;border:1px solid #dce3ee;border-radius:10px;background:#fff;font-size:10px;color:#697386;line-height:1.55}.queueHomeStatus b{color:#25324a}.queueHomeStatus .doneCount{margin-left:8px;color:#25744a;font-weight:800}.humanDecision{display:grid;gap:8px}.humanDecisionSummary{font-size:11px;line-height:1.55;color:#4a5568}.humanDecisionPreview{display:block;text-decoration:none;border:1px solid #b8c6e8;background:#f7f9ff;color:#304a9a;border-radius:9px;padding:8px 9px;font-size:10px;font-weight:900}.humanDecisionButtons{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.humanDecisionButtons button{border:0;border-radius:9px;padding:8px 5px;font-size:10px;font-weight:900;cursor:pointer}.humanApprove{background:#e8f7ee;color:#236b43}.humanRevise{background:#fff4d8;color:#806015}.humanReject{background:#fff0f0;color:#963c3c}.humanDecisionEditor{display:none;gap:6px}.humanDecisionEditor.open{display:grid}.humanDecisionEditor textarea{width:100%;min-height:72px;resize:vertical;border:1px solid #cbd6e4;border-radius:9px;padding:8px;font:inherit;font-size:11px}.humanDecisionEditor .row{display:flex;gap:6px}.humanDecisionEditor .row button{flex:1;border:0;border-radius:8px;padding:7px;font-size:10px;font-weight:900;cursor:pointer}.humanDecisionNote{font-size:9px;color:#7b879b;line-height:1.45}.humanDecisionBusy{opacity:.6;pointer-events:none}
    @media(max-width:760px){.editorialHome{padding:12px}.homeGrid{grid-template-columns:1fr}.homeWeek{grid-template-columns:repeat(4,1fr)}.humanDecisionButtons{grid-template-columns:1fr}.homeHero h2{font-size:16px}}
  `;
  document.head.appendChild(style);
  const version=document.querySelector('.version');if(version)version.textContent='chat v0.7.8';

  let homePlan=null;
  let homePlanLoadedAt=0;
  let homeMode=false;
  let homeSignature='';
  const escHome=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function groups(){try{return typeof groupedJobs==='function'?groupedJobs():[]}catch{return[]}}
  function isTerminal(g){return TERMINAL.has(String(g?.last?.state||'').toUpperCase())}
  function liveGroups(){return groups().filter(g=>!isTerminal(g))}
  function jstYmd(d=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}
  function weekStartYmd(){const now=new Date();const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',weekday:'short',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const obj=Object.fromEntries(parts.map(p=>[p.type,p.value]));const iso={Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:7}[obj.weekday]||1;const base=new Date(`${obj.year}-${obj.month}-${obj.day}T12:00:00+09:00`);base.setUTCDate(base.getUTCDate()-(iso-1));return jstYmd(base)}
  function currentIsoDay(){const w=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',weekday:'short'}).format(new Date());return {Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:7}[w]||1}
  function routineDay(g){for(const e of g?.ev||[]){const n=Number(e?.discussion?.routine_day||0);if(n>=1&&n<=7)return n}return 0}
  function isThisWeek(g){const first=(g?.ev||[])[0];if(!first?.created_at)return false;const d=new Date(first.created_at),ymd=jstYmd(d),ws=weekStartYmd(),end=new Date(`${ws}T12:00:00+09:00`);end.setUTCDate(end.getUTCDate()+6);return ymd>=ws&&ymd<=jstYmd(end)}
  function completedDays(){const out=new Set();for(const g of groups()){if(!isTerminal(g)||!isThisWeek(g))continue;const d=routineDay(g);if(d)out.add(d)}return out}
  function titleOf(g){try{return typeof queueTitle==='function'?queueTitle(g):String(g?.first?.summary||'完了案件')}catch{return String(g?.first?.summary||'完了案件')}}
  async function loadHomePlan(){if(Date.now()-homePlanLoadedAt<20000)return;homePlanLoadedAt=Date.now();try{const {data,error}=await sb.rpc('ai_editorial_get_current_weekly_plan');if(error)throw error;homePlan=data||null}catch(e){console.warn('[AI編集部] home weekly plan load failed',e)}}
  function ensureHomeButton(show){const root=document.querySelector('#jobs');if(!root)return;let b=document.querySelector('#queueHomeButton');if(!b){b=document.createElement('button');b.id='queueHomeButton';b.className='queueHomeButton';b.type='button';b.textContent='🏠 編集部ホーム';b.onclick=()=>{manualSelection=false;try{render()}catch{}};root.parentElement?.insertBefore(b,root)}b.hidden=!show;let st=document.querySelector('#queueHomeStatus');if(!st){st=document.createElement('div');st.id='queueHomeStatus';st.className='queueHomeStatus';b.insertAdjacentElement('afterend',st)}st.hidden=!show;if(show){const all=groups(),done=all.filter(isTerminal).length;st.innerHTML='<b>進行中の案件はありません</b><span class="doneCount">完了済み '+done+'</span>'}}
  async function renderHome(){const box=document.querySelector('#events');if(!box)return;const done=completedDays(),today=currentIsoDay();let next=0;for(let d=Math.max(1,today);d<=7;d++){if(!done.has(d)){next=d;break}}if(!next)for(let d=1;d<=7;d++){if(!done.has(d)){next=d;break}}
    const labels=['月','火','水','木','金','土','日'];
    const recent=groups().filter(isTerminal).slice(0,3);
    const signature=JSON.stringify({plan:homePlan?.summary||'',available:Boolean(homePlan?.available),done:[...done],next,recent:recent.map(g=>[g.id,g.last?.state,g.last?.created_at])});
    document.querySelector('#topic').textContent='編集部ホーム';
    document.querySelector('#jobmeta').textContent='今週の方針と進捗を確認できます';
    document.querySelector('#roomState').textContent='待機中';
    document.querySelector('#progressMain').textContent='✅ 現在、進行中の案件はありません';
    document.querySelector('#progressFlow').textContent=next?`次の定例：${labels[next-1]}曜日`:'今週の定例はすべて実施済みです';
    const warn=document.querySelector('#progressWarn');if(warn)warn.hidden=true;
    const ps=document.querySelector('#progressStatus');if(ps)ps.className='progressStatus done';
    const planAvailable=Boolean(homePlan?.available);
    const planText=planAvailable?String(homePlan.summary||'今週の編集方針を保存済みです。'):'今週の編集方針はまだ保存されていません。月曜定例を実施するとここに表示されます。';
    if(homeSignature!==signature||box.dataset.job!=='__home__'){
      box.innerHTML=`<div class="editorialHome"><section class="homeHero"><h2>⚡ AI編集部</h2><p>現在、進行中の案件はありません。曜日定例を開始するか、完了済み案件を選ぶと会話履歴を確認できます。</p></section><div class="homeGrid"><section class="homeCard"><h3>📌 今週の編集方針</h3><div class="homePlanText">${escHome(planText)}</div></section><section class="homeCard"><h3>今週の進捗</h3><div class="homeWeek">${labels.map((l,i)=>`<div class="homeDay ${done.has(i+1)?'done':''} ${next===i+1?'next':''}">${l}<br>${done.has(i+1)?'✓':'—'}</div>`).join('')}</div><div class="homeNext">${next?`次：${labels[next-1]}曜日の定例`:'今週は完了'}</div></section></div><section class="homeCard"><h3>最近完了した案件</h3><div class="homeRecent">${recent.length?recent.map(g=>`<button class="homeRecentButton" type="button" data-home-job="${escHome(g.id)}"><b>${escHome(titleOf(g))}</b><span>${escHome(String(g.last?.state||'完了'))}</span></button>`).join(''):'<div class="empty">完了済み案件はまだありません。</div>'}</div></section></div>`;
      box.dataset.job='__home__';
      homeSignature=signature;
      box.querySelectorAll('[data-home-job]').forEach(b=>b.onclick=()=>{selectedJob=b.dataset.homeJob;manualSelection=true;render()});
    }
    document.querySelector('#state').textContent='待機中';document.querySelector('#role').textContent='担当：AI編集部';
    const gate=document.querySelector('#gate');if(gate)gate.textContent='現在、管理者確認はありません。';
    const gateCard=document.querySelector('#gateCard');if(gateCard)gateCard.classList.remove('alert');
    if(typeof renderArtifacts==='function')renderArtifacts([]);
  }

  function commandId(){const m=String(selectedJob||'').match(/^command-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:-|$)/i);return m?m[1]:null}
  function urls(v,out=new Set(),depth=0){if(depth>5||v==null)return out;if(typeof v==='string'){(v.match(/https:\/\/[^\s"'<>]+/g)||[]).forEach(x=>out.add(x.replace(/[),.;]+$/,'')));return out}if(Array.isArray(v)){v.forEach(x=>urls(x,out,depth+1));return out}if(typeof v==='object')Object.values(v).forEach(x=>urls(x,out,depth+1));return out}
  function previewUrl(ev){return [...urls(ev)].find(u=>{try{const h=new URL(u).hostname;return h.includes('pages.dev')||h.includes('netlify')}catch{return false}})||''}
  async function decide(decision,note=''){
    const id=commandId();if(!id)return alert('この案件は管理者判断APIに紐づいていません。');
    const card=document.querySelector('#gateCard');card?.classList.add('humanDecisionBusy');
    try{const {data,error}=await sb.rpc('ai_editorial_human_decision',{p_command_id:id,p_decision:decision,p_note:note||null});if(error)throw error;await refresh();return data}catch(e){console.error('[AI編集部] human decision failed',e);alert('管理者判断を保存できませんでした。もう一度お試しください。')}finally{card?.classList.remove('humanDecisionBusy')}
  }
  function renderHumanDecision(){const g=groups().find(x=>x.id===selectedJob),last=g?.last||{},state=String(last.state||'').toUpperCase(),card=document.querySelector('#gateCard');if(!card)return;const ev=g?.ev||[];if(!['HUMAN_GATE','NEEDS_HUMAN'].includes(state)){card.classList.remove('alert');if(!TERMINAL.has(state)){card.innerHTML='<div class="humanDecision"><div class="humanDecisionSummary"><b>再調整中</b><br>自動修正・再監査を続けています。最終Previewが再度合格するまで操作は不要です。</div></div>';}return;}const finalEvent=[...ev].reverse().find(e=>String(e?.discussion?.stage||'')==='gpt-preview-audit'&&String(e?.state||'').toUpperCase()==='NEEDS_HUMAN');const finalReady=Boolean(finalEvent)&&finalEvent?.discussion?.preview_verified===true&&finalEvent?.discussion?.human_gate_policy==='final-preview-only';if(!finalReady){card.classList.remove('alert');card.innerHTML='<div class="humanDecision"><div class="humanDecisionSummary"><b>再調整中</b><br>最終Previewの配信確認と再監査を続けています。合格するまで操作は不要です。</div></div>';return;}const preview=previewUrl(ev),summary=String(last.summary||'管理者の判断を待っています。');card.classList.add('alert');card.innerHTML=`<div class="humanDecision"><div class="humanDecisionSummary">${escHome(summary)}</div>${preview?`<a class="humanDecisionPreview" href="${escHome(preview)}" target="_blank" rel="noopener noreferrer">🌐 Previewを確認 ↗</a>`:''}<div class="humanDecisionButtons"><button class="humanApprove" type="button">✅ 採用</button><button class="humanRevise" type="button">✏️ 修正を指示</button><button class="humanReject" type="button">❌ 不採用</button></div><div id="humanDecisionEditor" class="humanDecisionEditor"><textarea id="humanDecisionText" maxlength="2000" placeholder="修正内容または不採用理由を入力"></textarea><div class="row"><button id="humanDecisionSubmit" type="button">送信</button><button id="humanDecisionCancel" type="button">キャンセル</button></div><div class="humanDecisionNote">修正指示は同じ案件キューに保存され、次の制作工程で参照されます。</div></div></div>`;
    const editor=card.querySelector('#humanDecisionEditor'),text=card.querySelector('#humanDecisionText');let mode='revise';
    card.querySelector('.humanApprove').onclick=async()=>{if(confirm(preview?'このPreviewを採用して次工程へ進めますか？':'この内容を採用して次工程へ進めますか？'))await decide('approve','')};
    card.querySelector('.humanRevise').onclick=()=>{mode='revise';editor.classList.add('open');text.placeholder='どこをどう直すか具体的に入力してください';text.focus()};
    card.querySelector('.humanReject').onclick=()=>{mode='reject';editor.classList.add('open');text.placeholder='不採用理由（任意）';text.focus()};
    card.querySelector('#humanDecisionCancel').onclick=()=>{editor.classList.remove('open');text.value=''};
    card.querySelector('#humanDecisionSubmit').onclick=async()=>{const note=text.value.trim();if(mode==='revise'&&!note)return alert('修正内容を入力してください。');if(mode==='reject'&&!confirm('この案件を不採用として終了しますか？'))return;await decide(mode,note)};
  }

  const baseRender=window.render;
  if(typeof baseRender==='function')window.render=function(){
    const live=liveGroups(),home=!live.length&&!manualSelection;
    ensureHomeButton(!live.length);
    if(home){
      if(!homeMode){baseRender();homeMode=true;homeSignature=''}
      renderHome();
      if(Date.now()-homePlanLoadedAt>=20000)loadHomePlan().then(()=>renderHome());
      return;
    }
    homeMode=false;homeSignature='';baseRender();renderHumanDecision();
  };
  setTimeout(()=>{try{window.render()}catch{}},300);
})();