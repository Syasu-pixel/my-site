const WIDGETS=[
{id:'today',name:'今日の点検',desc:'今日の点検・期限・担当設備をまとめて確認',tier:'free',cat:'点検',size:'wide'},
{id:'calendar',name:'保全カレンダー',desc:'設備点検・交換予定・祝日・外部カレンダー連携を想定',tier:'free',cat:'予定',size:'wide'},
{id:'equipment',name:'設備ステータス',desc:'登録設備の状態と直近の対応予定',tier:'free',cat:'設備',size:''},
{id:'notice',name:'社内通知',desc:'法人管理者からの周知と確認済みチェック',tier:'free',cat:'共有',size:''},
{id:'memo',name:'共有メモ',desc:'法人内で自由に使える共有メモ',tier:'free',cat:'共有',size:''},
{id:'versions',name:'制御機器バージョン',desc:'PLC・HMI・サーボ・インバータの版数管理',tier:'free',cat:'設備',size:''},
{id:'ai',name:'写真AIアシスタント',desc:'銘板写真からメーカー・型式候補を提案',tier:'paid',cat:'AI',size:''},
{id:'iot',name:'IoTモニタ',desc:'温度・圧力・振動などの時系列収集・グラフ化',tier:'paid',cat:'IoT',size:'wide'},
{id:'parts',name:'予備品・在庫',desc:'予備品の在庫・保管場所・交換履歴を管理',tier:'paid',cat:'保全',size:''},
{id:'approval',name:'承認待ち',desc:'点検報告や変更申請の承認フロー',tier:'paid',cat:'法人',size:''}
];
const DEFAULT=['today','calendar','equipment','notice','memo','versions','iot'];
const device=()=>innerWidth<700?'mobile':innerWidth<1050?'tablet':'pc';
const storageKey=()=> 'dc-eq-layout:'+device();
const getLayout=()=>{try{return JSON.parse(localStorage.getItem(storageKey()))||DEFAULT}catch{return DEFAULT}};
const setLayout=v=>localStorage.setItem(storageKey(),JSON.stringify(v));
let layout=getLayout(),dragId=null,currentFilter='all';

function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function widgetBody(id){
 if(id==='today')return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>CV-04 月次点検</strong><small>第1工場 / 搬送ライン</small></div><div class="list-side">09:30</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>ホイスト 日常点検</strong><small>組立エリア / 担当: 自分</small></div><div class="list-side">未実施</div></div><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>サーボバッテリー交換</strong><small>設備A / 期限まで3日</small></div><div class="list-side">要対応</div></div></div>';
 if(id==='calendar'){
   let days='';
   for(let i=0;i<21;i++){days+='<div class="day '+(i===6?'today':'')+'"><b>'+(i+1)+'</b>'+(i===6?'<em>点検 2件</em>':i===10?'<em>交換予定</em>':'')+'</div>'}
   return '<div class="calendar"><div class="cal-head">月</div><div class="cal-head">火</div><div class="cal-head">水</div><div class="cal-head">木</div><div class="cal-head">金</div><div class="cal-head">土</div><div class="cal-head">日</div>'+days+'</div><div style="margin-top:9px;color:#708ca0;font-size:9px">祝日表示・Google / Outlook同期はアカウント単位で設定予定</div>';
 }
 if(id==='equipment')return '<div class="list"><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>稼働中</strong><small>18設備</small></div></div><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>要確認</strong><small>2設備</small></div></div><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>期限超過</strong><small>1設備</small></div></div></div>';
 if(id==='notice')return '<div class="notice"><strong>安全手順書を更新しました</strong><p>PDFを確認後「確認しました」を押してください。</p></div><div class="notice"><strong>10/12 停電点検</strong><p>対象ラインの担当者は予定を確認してください。</p></div><button class="btn ghost" style="width:100%">通知一覧を開く</button>';
 if(id==='memo')return '<div class="notice"><strong>第2ライン共有メモ</strong><p>CV3のセンサ位置を微調整。次回点検時に再確認。</p></div><div class="notice"><strong>保全部</strong><p>MR-J4予備バッテリー 残り2個。</p></div><button class="btn ghost" style="width:100%">メモを追加</button>';
 if(id==='versions')return '<div class="list"><div class="list-item"><div class="list-main"><strong>MR-J4-70B</strong><small>設備A / Servo amplifier</small></div><div class="list-side">v1.24</div></div><div class="list-item"><div class="list-main"><strong>GX Works2</strong><small>設備A / Project</small></div><div class="list-side">1.620W</div></div><div class="list-item"><div class="list-main"><strong>GT Designer3</strong><small>設備B / HMI</small></div><div class="list-side">1.300N</div></div></div>';
 if(id==='ai')return '<div class="widget-empty">写真を撮影すると、メーカー・シリーズ・型式候補を照合して提案します。AIは確定せず、ユーザーが正式型式を選択します。</div>';
 if(id==='iot')return '<div class="list"><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>温度</strong><small>Compressor-01 / 直近24h</small><div class="meter"><i style="width:58%"></i></div></div><div class="list-side">42.6 ℃</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>振動</strong><small>Motor-02 / 直近24h</small><div class="meter"><i style="width:32%"></i></div></div><div class="list-side">2.1 mm/s</div></div></div>';
 if(id==='parts')return '<div class="widget-empty">予備品の残数、保管場所、最低在庫、使用履歴を設備と紐付けて管理します。</div>';
 if(id==='approval')return '<div class="widget-empty">点検報告・変更申請など、法人ごとの承認フローを管理します。</div>';
 return '';
}
function render(){
 const grid=document.querySelector('#widgetGrid'); if(!grid)return;
 let html='';
 layout.forEach(id=>{
   const w=WIDGETS.find(x=>x.id===id); if(!w)return;
   const locked=w.tier==='paid';
   html+='<section class="widget '+w.size+'" draggable="true" data-id="'+w.id+'"><div class="widget-head"><span class="drag">⠿</span><h3>'+esc(w.name)+'</h3><div class="spacer"></div><span class="badge '+w.tier+'">'+(w.tier==='free'?'FREE':'PRO')+'</span><button class="btn ghost remove-widget" data-remove="'+w.id+'" style="padding:5px 8px;font-size:9px">×</button></div><div class="widget-body">'+widgetBody(w.id)+'</div>'+(locked?'<div class="locked"><div class="locked-card"><strong>PRO ウィジェット</strong><small>有料機能のPreviewです。現在はダミーデータ表示のみ。</small><button class="btn">詳細を見る</button></div></div>':'')+'</section>';
 });
 grid.innerHTML=html;
 bindDrag();
 const dl=document.querySelector('#deviceLabel'); if(dl)dl.textContent=device()==='pc'?'PCレイアウト':device()==='tablet'?'タブレットレイアウト':'スマホレイアウト';
}
function bindDrag(){
 document.querySelectorAll('.widget').forEach(el=>{
  el.addEventListener('dragstart',()=>{dragId=el.dataset.id;el.classList.add('dragging')});
  el.addEventListener('dragend',()=>{el.classList.remove('dragging');dragId=null});
  el.addEventListener('dragover',e=>e.preventDefault());
  el.addEventListener('drop',e=>{e.preventDefault();const to=el.dataset.id;if(!dragId||dragId===to)return;const a=layout.indexOf(dragId),b=layout.indexOf(to);layout.splice(a,1);layout.splice(b,0,dragId);setLayout(layout);render()});
 });
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{layout=layout.filter(x=>x!==b.dataset.remove);setLayout(layout);render()});
}
function openCatalog(){document.querySelector('#widgetModal').classList.remove('hidden');renderCatalog()}
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
document.addEventListener('DOMContentLoaded',()=>{
 render();
 document.querySelectorAll('[data-open-widgets]').forEach(b=>b.addEventListener('click',openCatalog));
 document.querySelector('#closeWidgets')?.addEventListener('click',()=>document.querySelector('#widgetModal').classList.add('hidden'));
 document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{currentFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCatalog()});
 document.querySelector('#resetLayout')?.addEventListener('click',()=>{layout=[...DEFAULT];setLayout(layout);render()});
 let lastDevice=device();
 addEventListener('resize',()=>{const d=device();if(d!==lastDevice){lastDevice=d;layout=getLayout();render()}});
});