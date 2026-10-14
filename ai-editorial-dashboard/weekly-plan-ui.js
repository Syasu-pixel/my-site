(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .weeklyButton.weekCompleted{background:#eceff3!important;border-color:#cfd6df!important;color:#8b95a3!important;box-shadow:none!important;cursor:not-allowed!important;opacity:.75!important}
    .weeklyButton.weekCompleted span{font-weight:800;color:#687386;opacity:1}
    .weeklyPlanCard{border:1px solid #cbd8ee;border-radius:12px;background:#f7faff;padding:11px 12px;margin:8px 0}
    .weeklyPlanCardTitle{font-size:12px;font-weight:900;color:#25324a;display:flex;align-items:center;justify-content:space-between;gap:8px}
    .weeklyPlanCardPeriod{font-size:9px;color:#718096;font-weight:700;margin-top:4px}
    .weeklyPlanCardSummary{font-size:10px;color:#536074;line-height:1.55;margin-top:7px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .weeklyPlanOpen{margin-top:8px;width:100%;border:1px solid #9eb0df;background:#fff;color:#304a9a;border-radius:9px;padding:7px 9px;font-size:10px;font-weight:900;cursor:pointer}
    .weeklyPlanOpen:hover{background:#eef3ff}
    .weeklyPlanOverlay{position:fixed;inset:0;z-index:90;background:rgba(17,24,39,.48);display:none;align-items:center;justify-content:center;padding:20px}
    .weeklyPlanOverlay.open{display:flex}
    .weeklyPlanModal{width:min(760px,96vw);max-height:min(82vh,820px);overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.28);padding:20px}
    .weeklyPlanModalHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:sticky;top:-20px;background:#fff;padding:2px 0 12px;z-index:2;border-bottom:1px solid #e2e8f0}
    .weeklyPlanModal h3{font-size:18px;margin:0}.weeklyPlanClose{border:0;background:#eef2f7;color:#526176;border-radius:999px;width:34px;height:34px;font-size:20px;cursor:pointer}
    .weeklyPlanSection{margin-top:16px}.weeklyPlanSection h4{font-size:12px;color:#526176;margin:0 0 8px}.weeklyPlanBody{font-size:13px;line-height:1.75;white-space:pre-wrap;color:#25324a}
    .weeklyPriority{border:1px solid #e0e6ef;border-radius:11px;padding:10px 11px;margin:7px 0;background:#fafcff}.weeklyPriority b{display:block;font-size:12px}.weeklyPriority p{font-size:11px;line-height:1.6;color:#596579;margin:5px 0 0}
    @media(max-width:760px){.weeklyPlanOverlay{padding:8px}.weeklyPlanModal{max-height:92vh;padding:15px}.weeklyPlanModalHead{top:-15px}.weeklyPlanModal h3{font-size:16px}}
  `;
  document.head.appendChild(style);

  let currentPlan=null;
  function escPlan(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function fmtDate(v){if(!v)return'—';const d=new Date(String(v)+'T00:00:00');return Number.isNaN(d.getTime())?String(v):`${d.getMonth()+1}/${d.getDate()}`}

  function ensureModal(){
    let overlay=document.querySelector('#weeklyPlanOverlay');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.id='weeklyPlanOverlay';overlay.className='weeklyPlanOverlay';
    overlay.innerHTML='<div class="weeklyPlanModal" role="dialog" aria-modal="true" aria-labelledby="weeklyPlanTitle"><div class="weeklyPlanModalHead"><div><h3 id="weeklyPlanTitle">📌 今週の編集方針</h3><div id="weeklyPlanModalPeriod" class="weeklyPlanCardPeriod"></div></div><button id="weeklyPlanClose" class="weeklyPlanClose" type="button" aria-label="閉じる">×</button></div><div id="weeklyPlanModalContent"></div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')});
    overlay.querySelector('#weeklyPlanClose').onclick=()=>overlay.classList.remove('open');
    document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open')});
    return overlay;
  }

  function openPlan(){
    if(!currentPlan?.available)return;
    const overlay=ensureModal(),plan=currentPlan.plan||{},priorities=Array.isArray(plan.priorities)?plan.priorities:[];
    overlay.querySelector('#weeklyPlanModalPeriod').textContent=`${fmtDate(currentPlan.week_start)}〜${fmtDate(currentPlan.week_end)} の方針`;
    const priorityHtml=priorities.length?priorities.map((p,i)=>`<div class="weeklyPriority"><b>${i+1}. ${escPlan(p.title||'優先項目')}</b><p>${escPlan(p.goal||'')}</p></div>`).join(''):'<div class="weeklyPlanBody">優先項目の個別一覧はありません。</div>';
    overlay.querySelector('#weeklyPlanModalContent').innerHTML=`<section class="weeklyPlanSection"><h4>今週の方針</h4><div class="weeklyPlanBody">${escPlan(currentPlan.summary||'')}</div></section><section class="weeklyPlanSection"><h4>優先項目</h4>${priorityHtml}</section>`;
    overlay.classList.add('open');
  }

  function renderSideCard(){
    const side=document.querySelector('#sidePane');if(!side||!currentPlan?.available)return;
    let card=document.querySelector('#weeklyPlanCard');
    if(!card){
      const headings=[...side.querySelectorAll('h2')];const artifactsHead=headings.find(h=>h.textContent.includes('この案件の成果物')||h.textContent.includes('完成したもの'));
      const h=document.createElement('h2');h.id='weeklyPlanHeading';h.textContent='📌 今週の編集方針';
      card=document.createElement('div');card.id='weeklyPlanCard';card.className='weeklyPlanCard';
      if(artifactsHead){side.insertBefore(h,artifactsHead);side.insertBefore(card,artifactsHead)}else{side.appendChild(h);side.appendChild(card)}
    }
    card.innerHTML=`<div class="weeklyPlanCardTitle"><span>今週の方針を保存済み</span><span>✓</span></div><div class="weeklyPlanCardPeriod">${fmtDate(currentPlan.week_start)}〜${fmtDate(currentPlan.week_end)}</div><div class="weeklyPlanCardSummary">${escPlan(currentPlan.summary||'')}</div><button class="weeklyPlanOpen" type="button">方針の中身を見る</button>`;
    card.querySelector('.weeklyPlanOpen').onclick=openPlan;
  }

  function markMondayDone(){
    if(!currentPlan?.available)return;
    const buttons=[...document.querySelectorAll('.weeklyButtons .weeklyButton')];
    const monday=buttons.find(b=>b.firstChild&&String(b.firstChild.textContent||'').trim()==='月')||buttons[0];
    if(!monday)return;
    monday.dataset.weekCompleted='1';monday.disabled=true;monday.classList.add('weekCompleted','selected');monday.classList.remove('today');
    const sub=monday.querySelector('span');if(sub)sub.textContent='今週実施済み';
    monday.title='今週の月曜定例は実施済みです。翌週に自動で再び使用できます。';
  }

  async function loadPlan(){
    try{
      const {data,error}=await sb.rpc('ai_editorial_get_current_weekly_plan');
      if(error)throw error;
      currentPlan=data||null;
      if(currentPlan?.available){markMondayDone();renderSideCard()}
    }catch(err){console.warn('[AI編集部] weekly plan UI load failed',err)}
  }

  let tries=0;const ready=setInterval(()=>{tries++;if(document.querySelector('.weeklyButtons')){clearInterval(ready);loadPlan()}else if(tries>40)clearInterval(ready)},250);
  setInterval(()=>{if(currentPlan?.available)markMondayDone()},800);
  setInterval(loadPlan,30000);

  const stability=document.createElement('script');
  stability.src='./connection-stability.js?v=0.7.13';
  document.body.appendChild(stability);
})();
