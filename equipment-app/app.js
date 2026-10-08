const WIDGETS=[
{id:'today',name:'今日の点検',desc:'今日の点検・期限・担当設備をまとめて確認',tier:'free',cat:'点検',size:'wide',href:'./inspection.html'},
{id:'calendar',name:'保全カレンダー',desc:'設備点検・交換予定・祝日・外部カレンダー連携を想定',tier:'free',cat:'予定',size:'wide',href:'./calendar.html'},
{id:'equipment',name:'設備ステータス',desc:'登録設備の状態と直近の対応予定',tier:'free',cat:'設備',size:'',href:'./equipment.html'},
{id:'notice',name:'社内通知',desc:'法人管理者からの周知と確認済みチェック',tier:'free',cat:'共有',size:'',href:'./notifications.html'},
{id:'memo',name:'共有メモ',desc:'法人内で自由に使える共有メモ',tier:'free',cat:'共有',size:'',href:'./memo.html'},
{id:'versions',name:'制御機器バージョン',desc:'PLC・HMI・サーボ・インバータの版数管理',tier:'free',cat:'設備',size:'',href:'./versions.html'},
{id:'ai',name:'写真AIアシスタント',desc:'銘板写真からメーカー・型式候補を提案',tier:'paid',cat:'AI',size:'',href:'./ai-assist.html'},
{id:'iot',name:'IoTモニタ',desc:'温度・圧力・振動などの時系列収集・グラフ化',tier:'paid',cat:'IoT',size:'wide',href:'./iot.html'},
{id:'parts',name:'予備品・在庫',desc:'予備品の在庫・保管場所・交換履歴を管理',tier:'paid',cat:'保全',size:'',href:'./parts.html'},
{id:'approval',name:'承認待ち',desc:'点検報告や変更申請の承認フロー',tier:'paid',cat:'法人',size:'',href:'./approval.html'},
{id:'device',name:'時計・端末情報',desc:'現在時刻・日付・端末状態・対応端末ではバッテリー残量を表示',tier:'free',cat:'端末',size:'',href:'./device-status.html'}
];
const DEFAULT=['today','calendar','equipment','notice','memo','versions','iot'];
const device=()=>innerWidth<700?'mobile':innerWidth<1050?'tablet':'pc';
const storageKey=()=> 'dc-eq-layout:'+device();
const sizeKey=()=> 'dc-eq-widget-sizes:'+device();
const viewKey=()=> 'dc-eq-widget-views:'+device();
const getLayout=()=>{try{return JSON.parse(localStorage.getItem(storageKey()))||DEFAULT}catch{return DEFAULT}};
const setLayout=v=>localStorage.setItem(storageKey(),JSON.stringify(v));
const getSizes=()=>{try{return JSON.parse(localStorage.getItem(sizeKey()))||{}}catch{return {}}};
const setSizes=v=>localStorage.setItem(sizeKey(),JSON.stringify(v));
const getViews=()=>{try{return JSON.parse(localStorage.getItem(viewKey()))||{}}catch{return {}}};
const setViews=v=>localStorage.setItem(viewKey(),JSON.stringify(v));
let layout=getLayout(),sizes=getSizes(),views=getViews(),dragId=null,currentFilter='all',editMode=false,pointerDrag=null,longPressTimer=null;
const VIEW_MODES=['standard','compact','summary'];
function widgetView(id){return views[id]||'standard'}
function nextWidgetView(id){
 const current=widgetView(id),i=VIEW_MODES.indexOf(current);
 views[id]=VIEW_MODES[(i+1)%VIEW_MODES.length];
 setViews(views);render();
}
function viewLabel(v){return v==='compact'?'コンパクト':v==='summary'?'サマリー':'標準'}
function defaultWidgetGeometry(w){
 const d=device();
 if(d==='mobile')return {span:12,minHeight:0};
 if(d==='tablet')return {span:w.size==='wide'?12:6,minHeight:0};
 return {span:w.size==='wide'?8:4,minHeight:0};
}
function widgetGeometry(w){
 const base=defaultWidgetGeometry(w),saved=sizes[w.id]||{};
 return {span:Number(saved.span)||base.span,minHeight:Number(saved.minHeight)||base.minHeight};
}
function clampSpan(span){
 const d=device();
 if(d==='mobile')return 12;
 if(d==='tablet')return span<=6?6:12;
 return Math.max(3,Math.min(12,Math.round(span)));
}
function saveGeometry(id,geom){
 sizes[id]={span:clampSpan(geom.span),minHeight:Math.max(0,Math.round(geom.minHeight||0))};
 setSizes(sizes);
}
function setEditMode(on){
 editMode=!!on;document.body.classList.toggle('widget-edit-mode',editMode);
 let done=document.querySelector('#widgetEditDone');
 if(editMode&&!done){done=document.createElement('button');done.id='widgetEditDone';done.className='widget-edit-done';done.textContent='完了';done.onclick=()=>setEditMode(false);document.body.appendChild(done)}
 if(!editMode&&done)done.remove();
 document.querySelector('#editWidgets')?.classList.toggle('active',editMode);
}

function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function widgetBody(id,view='standard'){
 if(id==='today'){
  if(view==='compact')return '<div class="compact-status-row"><span><b>3</b><small>今日</small></span><span><b>2</b><small>未実施</small></span><span><b>1</b><small>要対応</small></span></div><div class="compact-next"><strong>次：CV-04 月次点検</strong><span>09:30</span></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>3件</strong><span>今日の点検</span><em>未実施 2 / 要対応 1</em></div><div class="summary-progress"><i style="width:33%"></i></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>CV-04 月次点検</strong><small>第1工場 / 搬送ライン</small></div><div class="list-side">09:30</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>ホイスト 日常点検</strong><small>組立エリア / 担当: 自分</small></div><div class="list-side">未実施</div></div><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>サーボバッテリー交換</strong><small>設備A / 期限まで3日</small></div><div class="list-side">要対応</div></div></div>';
 }
 if(id==='calendar'){
  if(view==='compact')return '<div class="compact-agenda"><div><b>10/08</b><span>CV-04 月次点検</span></div><div><b>10/11</b><span>サーボ電池交換</span></div><div><b>10/12</b><span>停電点検</span></div></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>5件</strong><span>30日以内の予定</span><em>次回 10/08 月次点検</em></div>';
  let days='';for(let i=0;i<21;i++){days+='<div class="day '+(i===6?'today':'')+'"><b>'+(i+1)+'</b>'+(i===6?'<em>点検 2件</em>':i===10?'<em>交換予定</em>':'')+'</div>'}
  return '<div class="calendar"><div class="cal-head">月</div><div class="cal-head">火</div><div class="cal-head">水</div><div class="cal-head">木</div><div class="cal-head">金</div><div class="cal-head">土</div><div class="cal-head">日</div>'+days+'</div><div style="margin-top:9px;color:#708ca0;font-size:calc(9px * var(--dc-font-scale,1))">祝日表示・Google / Outlook同期はアカウント単位で設定予定</div>';
 }
 if(id==='equipment'){
  if(view==='compact')return '<div class="compact-status-row"><span><b>18</b><small>稼働中</small></span><span><b>2</b><small>要確認</small></span><span><b>1</b><small>期限超過</small></span></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>20</strong><span>登録設備</span><em>正常 85%</em></div><div class="summary-progress"><i style="width:85%"></i></div>';
  return '<div class="list"><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>稼働中</strong><small>18設備</small></div></div><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>要確認</strong><small>2設備</small></div></div><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>期限超過</strong><small>1設備</small></div></div></div>';
 }
 if(id==='notice'){
  if(view==='compact')return '<div class="compact-line"><strong>安全手順書を更新</strong><span>未確認</span></div><div class="compact-line"><strong>10/12 停電点検</strong><span>予定</span></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>2</strong><span>未確認通知</span><em>重要 1件</em></div>';
  return '<div class="notice"><strong>安全手順書を更新しました</strong><p>PDFを確認後「確認しました」を押してください。</p></div><div class="notice"><strong>10/12 停電点検</strong><p>対象ラインの担当者は予定を確認してください。</p></div><button class="btn ghost" style="width:100%">通知一覧を開く</button>';
 }
 if(id==='memo'){
  if(view==='compact')return '<div class="compact-line"><strong>第2ライン</strong><span>センサ位置を微調整</span></div><div class="compact-line"><strong>保全部</strong><span>予備電池 残り2個</span></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>2件</strong><span>新しい共有メモ</span><em>第2ライン / 保全部</em></div>';
  return '<div class="notice"><strong>第2ライン共有メモ</strong><p>CV3のセンサ位置を微調整。次回点検時に再確認。</p></div><div class="notice"><strong>保全部</strong><p>MR-J4予備バッテリー 残り2個。</p></div><button class="btn ghost" style="width:100%">メモを追加</button>';
 }
 if(id==='versions'){
  if(view==='compact')return '<div class="version-chips"><span>MR-J4-70B <b>v1.24</b></span><span>GX Works2 <b>1.620W</b></span><span>GT Designer3 <b>1.300N</b></span></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>3</strong><span>管理中の版数情報</span><em>更新差分なし</em></div>';
  return '<div class="list"><div class="list-item"><div class="list-main"><strong>MR-J4-70B</strong><small>設備A / Servo amplifier</small></div><div class="list-side">v1.24</div></div><div class="list-item"><div class="list-main"><strong>GX Works2</strong><small>設備A / Project</small></div><div class="list-side">1.620W</div></div><div class="list-item"><div class="list-main"><strong>GT Designer3</strong><small>設備B / HMI</small></div><div class="list-side">1.300N</div></div></div>';
 }
 if(id==='iot'){
  if(view==='compact')return '<div class="iot-compact"><span><small>温度</small><b>42.6℃</b></span><span><small>振動</small><b>2.1mm/s</b></span></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>正常</strong><span>IoTモニタ</span><em>しきい値超過 0件</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>温度</strong><small>Compressor-01 / 直近24h</small><div class="meter"><i style="width:58%"></i></div></div><div class="list-side">42.6 ℃</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>振動</strong><small>Motor-02 / 直近24h</small><div class="meter"><i style="width:32%"></i></div></div><div class="list-side">2.1 mm/s</div></div></div>';
 }
 if(id==='ai')return '<div class="widget-empty">写真を撮影すると、メーカー・シリーズ・型式候補を照合して提案します。AIは確定せず、ユーザーが正式型式を選択します。</div>';
 if(id==='parts')return '<div class="widget-empty">予備品の残数、保管場所、最低在庫、使用履歴を設備と紐付けて管理します。</div>';
 if(id==='approval')return '<div class="widget-empty">点検報告・変更申請など、法人ごとの承認フローを管理します。</div>';
 if(id==='device'){
  if(view==='compact')return '<div class="device-widget compact-device"><strong data-live-clock>--:--</strong><span data-live-date>----</span><span data-live-battery>Battery --</span></div>';
  if(view==='summary')return '<div class="device-widget summary-device"><strong data-live-clock>--:--</strong><span data-live-date>----</span><em data-live-battery>Battery --</em></div>';
  return '<div class="device-widget"><div class="device-time"><strong data-live-clock>--:--</strong><span data-live-seconds>:--</span></div><div class="device-date" data-live-date>----</div><div class="device-meta"><span data-live-zone>Local time</span><span data-live-battery>Battery --</span></div></div>';
 }
 return '';
}
function render(){
 const grid=document.querySelector('#widgetGrid'); if(!grid)return;
 let html='';
 layout.forEach(id=>{
   const w=WIDGETS.find(x=>x.id===id); if(!w)return;
   const locked=w.tier==='paid',geom=widgetGeometry(w),view=widgetView(w.id);
   html+='<section class="widget view-'+view+'" draggable="'+(editMode?'true':'false')+'" data-id="'+w.id+'" style="--widget-span:'+geom.span+';--widget-min-height:'+geom.minHeight+'px"><div class="widget-head"><span class="drag" title="長押しして移動">⠿</span><h3>'+esc(w.name)+'</h3><div class="spacer"></div><button class="widget-view-toggle" data-view="'+w.id+'" title="表示パターンを変更">表示 '+viewLabel(view)+'</button><span class="badge '+w.tier+'">'+(w.tier==='free'?'FREE':'PRO')+'</span><button class="btn ghost remove-widget" data-remove="'+w.id+'" style="padding:5px 8px;font-size:calc(9px * var(--dc-font-scale,1))">×</button></div><div class="widget-body">'+widgetBody(w.id,view)+'</div><span class="resize-handle resize-right" data-resize="right" aria-hidden="true"></span><span class="resize-handle resize-bottom" data-resize="bottom" aria-hidden="true"></span><span class="resize-handle resize-corner" data-resize="corner" aria-hidden="true"></span>'+(locked?'<div class="locked"><div class="locked-card"><strong>PRO ウィジェット</strong><small>有料機能のPreviewです。現在はダミーデータ表示のみ。</small><button class="btn">詳細を見る</button></div></div>':'')+'</section>';
 });
 grid.innerHTML=html;
 bindDrag();
 document.body.classList.toggle('widget-edit-mode',editMode);
 const dl=document.querySelector('#deviceLabel'); if(dl)dl.textContent=device()==='pc'?'PCレイアウト':device()==='tablet'?'タブレットレイアウト':'スマホレイアウト';
 updateLiveDeviceWidget();
}
function moveWidget(fromId,toId){
 if(!fromId||!toId||fromId===toId)return;
 const a=layout.indexOf(fromId),b=layout.indexOf(toId);if(a<0||b<0)return;
 layout.splice(a,1);layout.splice(b,0,fromId);setLayout(layout);render();
}
function animateWidgetReorder(moving,target,after){
 const widgets=[...document.querySelectorAll('#widgetGrid .widget')];
 const before=new Map(widgets.map(w=>[w.dataset.id,w.getBoundingClientRect()]));
 if(after)target.after(moving);else target.before(moving);
 requestAnimationFrame(()=>{
  widgets.forEach(w=>{
   if(w===moving)return;
   const a=before.get(w.dataset.id),b=w.getBoundingClientRect();
   if(!a)return;
   const dx=a.left-b.left,dy=a.top-b.top;
   if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
   w.animate([{transform:'translate3d('+dx+'px,'+dy+'px,0)'},{transform:'translate3d(0,0,0)'}],{duration:190,easing:'cubic-bezier(.2,.8,.2,1)'});
  });
 });
}
function beginPointerWidgetDrag(el,e,startX,startY,id){
 const rect=el.getBoundingClientRect();
 const ghost=el.cloneNode(true);
 ghost.classList.add('widget-drag-ghost');
 ghost.classList.remove('pointer-dragging','dragging');
 ghost.removeAttribute('draggable');
 ghost.style.width=rect.width+'px';ghost.style.height=rect.height+'px';
 ghost.style.left=rect.left+'px';ghost.style.top=rect.top+'px';
 document.body.appendChild(ghost);
 el.classList.add('drag-origin');
 pointerDrag={id,startX,startY,lastTarget:id,pointerId:e.pointerId,ghost,origin:el,targetX:0,targetY:0,currentX:0,currentY:0,raf:0,lastSwapAt:0};
 try{el.setPointerCapture(e.pointerId)}catch{}
 navigator.vibrate?.(18);
}
function runGhostFollow(){
 if(!pointerDrag)return;
 const d=pointerDrag;
 d.currentX+=(d.targetX-d.currentX)*.34;
 d.currentY+=(d.targetY-d.currentY)*.34;
 d.ghost.style.transform='translate3d('+d.currentX+'px,'+d.currentY+'px,0) scale(1.015)';
 const moving=Math.abs(d.targetX-d.currentX)>.25||Math.abs(d.targetY-d.currentY)>.25;
 if(moving)d.raf=requestAnimationFrame(runGhostFollow);else d.raf=0;
}
function updateGhostPosition(e){
 if(!pointerDrag)return;
 pointerDrag.targetX=e.clientX-pointerDrag.startX;
 pointerDrag.targetY=e.clientY-pointerDrag.startY;
 if(!pointerDrag.raf)pointerDrag.raf=requestAnimationFrame(runGhostFollow);
}
function cleanupWidgetDragVisuals(){
 document.querySelectorAll('.widget-drag-ghost').forEach(x=>x.remove());
 document.querySelectorAll('.drag-origin,.pointer-dragging,.dragging').forEach(x=>x.classList.remove('drag-origin','pointer-dragging','dragging'));
}
function finishPointerWidgetDrag(){
 if(!pointerDrag){cleanupWidgetDragVisuals();return;}
 const d=pointerDrag;pointerDrag=null;
 if(d.raf)cancelAnimationFrame(d.raf);
 const finalEl=document.querySelector('.widget[data-id="'+d.id+'"]');
 const cleanup=()=>{d.ghost?.remove();finalEl?.classList.remove('drag-origin');cleanupWidgetDragVisuals();};
 if(finalEl&&d.ghost){
  const gr=d.ghost.getBoundingClientRect(),fr=finalEl.getBoundingClientRect();
  const tx=fr.left-gr.left,ty=fr.top-gr.top;
  const anim=d.ghost.animate([
   {transform:getComputedStyle(d.ghost).transform,opacity:.96},
   {transform:'translate3d('+(d.currentX+tx)+'px,'+(d.currentY+ty)+'px,0) scale(1)',opacity:.5}
  ],{duration:150,easing:'cubic-bezier(.2,.8,.2,1)'});
  anim.onfinish=cleanup;anim.oncancel=cleanup;
 }else cleanup();
}
function bindDrag(){
 document.querySelectorAll('.widget').forEach(el=>{
  let downAt=null,dragStarted=false;
  el.addEventListener('click',e=>{
    if(editMode||dragStarted||e.target.closest('button,a,input,select,textarea,label,[data-resize]'))return;
    const w=WIDGETS.find(x=>x.id===el.dataset.id);
    if(w?.href)location.href=w.href;
  });
  el.addEventListener('dragstart',e=>e.preventDefault());

  el.addEventListener('pointerdown',e=>{
    if(e.button!=null&&e.button!==0)return;
    if(e.target.closest('button,a,input,select,textarea,label,[data-resize]'))return;
    const startX=e.clientX,startY=e.clientY,id=el.dataset.id;downAt={x:startX,y:startY,time:performance.now()};dragStarted=false;
    clearTimeout(longPressTimer);
    const delay=editMode&&e.pointerType==='mouse'?60:520;
    longPressTimer=setTimeout(()=>{
      if(!editMode)setEditMode(true);
      dragStarted=true;beginPointerWidgetDrag(el,e,startX,startY,id);
    },delay);
  });
  el.addEventListener('pointermove',e=>{
    if(!pointerDrag||pointerDrag.pointerId!==e.pointerId)return;
    e.preventDefault();
    updateGhostPosition(e);
    const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.widget:not(.widget-drag-ghost)');
    if(hit&&hit.dataset.id!==pointerDrag.lastTarget&&hit.dataset.id!==pointerDrag.id){
      const now=performance.now();
      const r=hit.getBoundingClientRect();
      const cx=r.left+r.width/2,cy=r.top+r.height/2;
      const nx=Math.abs(e.clientX-cx)/(r.width/2),ny=Math.abs(e.clientY-cy)/(r.height/2);
      const deepEnough=nx<.82&&ny<.82;
      if(deepEnough&&now-pointerDrag.lastSwapAt>80){
        const fromId=pointerDrag.id,toId=hit.dataset.id;
        const a=layout.indexOf(fromId),b=layout.indexOf(toId);
        if(a>=0&&b>=0){
          layout.splice(a,1);layout.splice(b,0,fromId);setLayout(layout);
          const moving=document.querySelector('.widget[data-id="'+fromId+'"]');
          const target=document.querySelector('.widget[data-id="'+toId+'"]');
          if(moving&&target)animateWidgetReorder(moving,target,a<b);
        }
        pointerDrag.lastTarget=toId;
        pointerDrag.lastSwapAt=now;
      }
    }
  },{passive:false});
  const stopPointer=e=>{
    clearTimeout(longPressTimer);
    if(pointerDrag&&pointerDrag.pointerId===e.pointerId)finishPointerWidgetDrag();
  };
  el.addEventListener('pointerup',stopPointer);el.addEventListener('pointercancel',stopPointer);
 });
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{layout=layout.filter(x=>x!==b.dataset.remove);setLayout(layout);render()});
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=e=>{e.stopPropagation();nextWidgetView(b.dataset.view)});
 bindResize();
}

function bindResize(){
 const grid=document.querySelector('#widgetGrid'); if(!grid)return;
 const gap=parseFloat(getComputedStyle(grid).gap)||14;
 document.querySelectorAll('.widget').forEach(el=>{
  const id=el.dataset.id;
  const startResize=(e,mode)=>{
   if(!editMode||device()==='mobile')return;
   e.preventDefault();e.stopPropagation();
   const rect=el.getBoundingClientRect(),gridRect=grid.getBoundingClientRect();
   const colW=(gridRect.width-gap*11)/12;
   const startX=e.clientX,startY=e.clientY,startW=rect.width,startH=rect.height;
   const move=ev=>{
    const dx=ev.clientX-startX,dy=ev.clientY-startY;
    const geom=widgetGeometry(WIDGETS.find(w=>w.id===id));
    if(mode==='right'||mode==='corner'){
      const desired=Math.max(colW*3,startW+dx);
      geom.span=clampSpan(Math.round((desired+gap)/(colW+gap)));
      el.style.setProperty('--widget-span',geom.span);
    }
    if(mode==='bottom'||mode==='corner'){
      geom.minHeight=Math.max(140,startH+dy);
      el.style.setProperty('--widget-min-height',Math.round(geom.minHeight)+'px');
    }
    saveGeometry(id,geom);
   };
   const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};
   window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  };
  el.querySelectorAll('[data-resize]').forEach(h=>h.addEventListener('pointerdown',e=>startResize(e,h.dataset.resize)));

  let pinch=null;
  const active=new Map();
  el.addEventListener('pointerdown',e=>{
    if(!editMode||e.pointerType==='mouse')return;
    active.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(active.size===2){
      const pts=[...active.values()];
      const dist=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
      const rect=el.getBoundingClientRect();
      const w=WIDGETS.find(x=>x.id===id);
      pinch={dist,startSpan:widgetGeometry(w).span,startHeight:rect.height};
      try{el.setPointerCapture(e.pointerId)}catch{}
    }
  });
  el.addEventListener('pointermove',e=>{
    if(!active.has(e.pointerId))return;
    active.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(!pinch||active.size<2)return;
    e.preventDefault();
    const pts=[...active.values()];
    const dist=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
    const scale=Math.max(.7,Math.min(1.6,dist/pinch.dist));
    const w=WIDGETS.find(x=>x.id===id);
    const geom=widgetGeometry(w);
    geom.span=clampSpan(pinch.startSpan*scale);
    geom.minHeight=Math.max(140,pinch.startHeight*scale);
    saveGeometry(id,geom);
    el.style.setProperty('--widget-span',geom.span);
    el.style.setProperty('--widget-min-height',Math.round(geom.minHeight)+'px');
  },{passive:false});
  const end=e=>{active.delete(e.pointerId);if(active.size<2)pinch=null};
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 });
}
function openCatalog(){document.querySelector('#widgetModal').classList.remove('hidden');renderCatalog()}
function closeCatalog(){document.querySelector('#widgetModal')?.classList.add('hidden')}
function renderCatalog(){
 const area=document.querySelector('#catalog'); if(!area)return;
 const list=WIDGETS.filter(w=>currentFilter==='all'||currentFilter===w.tier||(currentFilter==='active'&&layout.includes(w.id)));
 let html='';
 list.forEach(w=>{
   html+='<article class="catalog-card"><div class="row"><h3>'+esc(w.name)+'</h3><div class="spacer"></div><span class="badge '+w.tier+'">'+(w.tier==='free'?'FREE':'PRO')+'</span></div><p>'+esc(w.desc)+'</p><div class="row"><span class="badge">'+esc(w.cat)+'</span><div class="spacer"></div><button class="btn '+(layout.includes(w.id)?'ghost':'primary')+'" data-add="'+w.id+'" '+(layout.includes(w.id)?'disabled':'')+'>'+(layout.includes(w.id)?'追加済み':'追加')+'</button></div></article>';
 });
 area.innerHTML=html;
 area.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{if(!layout.includes(b.dataset.add)){layout.push(b.dataset.add);setLayout(layout);render();renderCatalog()}});
}
let batteryManager=null,clockTimer=null;
function updateLiveDeviceWidget(){
 const now=new Date();
 const clock=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:false});
 const sec=now.toLocaleTimeString([], {second:'2-digit'}).slice(-2);
 const date=now.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric',weekday:'short'});
 document.querySelectorAll('[data-live-clock]').forEach(x=>x.textContent=clock);
 document.querySelectorAll('[data-live-seconds]').forEach(x=>x.textContent=':'+sec);
 document.querySelectorAll('[data-live-date]').forEach(x=>x.textContent=date);
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'Local time';
 document.querySelectorAll('[data-live-zone]').forEach(x=>x.textContent=zone);
 let batteryText='Battery: 非対応';
 if(batteryManager){
  batteryText='Battery '+Math.round(batteryManager.level*100)+'%'+(batteryManager.charging?' ⚡':'');
 }
 document.querySelectorAll('[data-live-battery]').forEach(x=>x.textContent=batteryText);
}
async function initDeviceStatus(){
 try{
  if('getBattery' in navigator){
   batteryManager=await navigator.getBattery();
   ['levelchange','chargingchange'].forEach(ev=>batteryManager.addEventListener(ev,updateLiveDeviceWidget));
  }
 }catch{}
 updateLiveDeviceWidget();
 if(clockTimer)clearInterval(clockTimer);
 clockTimer=setInterval(updateLiveDeviceWidget,1000);
}
document.addEventListener('DOMContentLoaded',()=>{
 render();
 initDeviceStatus();
 document.querySelectorAll('[data-open-widgets]').forEach(b=>b.addEventListener('click',openCatalog));
 document.querySelector('#closeWidgets')?.addEventListener('click',closeCatalog);
 const modalOverlay=document.querySelector('#widgetModal');
 modalOverlay?.addEventListener('click',e=>{if(e.target===modalOverlay)closeCatalog()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modalOverlay?.classList.contains('hidden'))closeCatalog()});
 document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{currentFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCatalog()});
 document.querySelector('#resetLayout')?.addEventListener('click',()=>{layout=[...DEFAULT];sizes={};views={};setLayout(layout);setSizes(sizes);setViews(views);render()});
 const hardCleanup=()=>{clearTimeout(longPressTimer);if(pointerDrag)finishPointerWidgetDrag();else cleanupWidgetDragVisuals()};
 window.addEventListener('blur',hardCleanup);
 window.addEventListener('pagehide',hardCleanup);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')hardCleanup()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pointerDrag)hardCleanup()});
 document.addEventListener('pointerup',e=>{if(pointerDrag&&pointerDrag.pointerId===e.pointerId)finishPointerWidgetDrag()},{capture:true});
 document.addEventListener('pointercancel',e=>{if(pointerDrag&&pointerDrag.pointerId===e.pointerId)finishPointerWidgetDrag()},{capture:true});
 document.querySelector('#editWidgets')?.addEventListener('click',()=>setEditMode(!editMode));
 let lastDevice=device();
 addEventListener('resize',()=>{const d=device();if(d!==lastDevice){lastDevice=d;layout=getLayout();sizes=getSizes();views=getViews();render()}});
 const menuToggle=document.querySelector('#appMenuToggle'),menu=document.querySelector('#appMenu');
 const closeAppMenu=()=>{if(!menu)return;menu.hidden=true;menuToggle?.setAttribute('aria-expanded','false')};
 menuToggle?.addEventListener('click',e=>{e.stopPropagation();const open=menu.hidden;menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open))});
 document.addEventListener('click',e=>{if(menu&&!menu.hidden&&!e.target.closest('.app-menu-wrap'))closeAppMenu()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAppMenu()});
 document.querySelector('#logoutMenu')?.addEventListener('click',()=>{location.href='./login.html'});
 document.querySelector('#languageMenu')?.addEventListener('click',()=>{alert('Preview: 多言語設定は今後ここから切り替えます')});
});