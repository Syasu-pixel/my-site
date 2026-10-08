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
{id:'device',name:'時計・端末情報',desc:'現在時刻・日付・端末状態・対応端末ではバッテリー残量を表示',tier:'free',cat:'端末',size:'',href:'./device-status.html'},
{id:'deadline',name:'期限アラート',desc:'交換・点検・法定期限を近い順に表示',tier:'free',cat:'予定',size:'',href:'./calendar.html'},
{id:'recent',name:'最近の作業',desc:'直近の点検・修理・変更履歴を表示',tier:'free',cat:'履歴',size:'',href:'./equipment.html'},
{id:'assigned',name:'担当設備',desc:'自分の担当設備だけをすばやく確認',tier:'free',cat:'設備',size:'',href:'./equipment.html'},
{id:'sync',name:'同期・接続状態',desc:'オンライン状態・最終同期・外部連携状態を確認',tier:'free',cat:'端末',size:'',href:'./settings.html'},
{id:'quick',name:'クイック操作',desc:'点検開始・設備追加・メモ追加などをすぐ実行',tier:'free',cat:'操作',size:'',href:'./dashboard.html'},
{id:'timer',name:'タイマー・ストップウォッチ',desc:'現場作業用の簡易タイマーと経過時間計測',tier:'free',cat:'端末',size:'',href:'./timer.html'},
{id:'smart',name:'スマート提案',desc:'期限・担当・異常から今優先したい操作を提案',tier:'free',cat:'スマート',size:'wide',href:'./dashboard.html'},
{id:'handover',name:'引継ぎ',desc:'前勤務からの申し送り・未完了事項をまとめて確認',tier:'free',cat:'共有',size:'wide',href:'./handover.html'},
{id:'workorders',name:'作業依頼',desc:'修理・点検・改善依頼を受付から完了まで管理',tier:'free',cat:'保全',size:'wide',href:'./work-orders.html'},
{id:'downtime',name:'停止時間',desc:'設備停止の発生・復旧・累計時間を記録',tier:'free',cat:'設備',size:'',href:'./downtime.html'},
{id:'docs',name:'図面・取説',desc:'設備ごとの図面・取説・仕様書への入口',tier:'free',cat:'資料',size:'',href:'./documents.html'},
{id:'kpi',name:'保全KPI',desc:'点検実施率・未完了・平均対応時間などを可視化',tier:'paid',cat:'分析',size:'wide',href:'./kpi.html'},
{id:'vehicle',name:'車両・法定期限',desc:'車検・法定点検・社用車の日常点検を管理',tier:'free',cat:'車両',size:'',href:'./vehicle.html'},
{id:'favorites',name:'お気に入り',desc:'よく使う設備・画面・資料を固定してすぐ開く',tier:'free',cat:'操作',size:'',href:'./favorites.html'},
{id:'safety',name:'安全チェック',desc:'始業前確認・ロックアウト・安全項目を簡単チェック',tier:'free',cat:'安全',size:'',href:'./safety-check.html'},
{id:'trends',name:'異常トレンド',desc:'点検NG・故障・IoTしきい値超過の傾向を比較',tier:'paid',cat:'分析',size:'wide',href:'./trends.html'},
{id:'reports',name:'レポート',desc:'期間別の保全実績や設備状況をレポート化',tier:'paid',cat:'分析',size:'',href:'./reports.html'},
{id:'shift',name:'シフト・当番',desc:'保全当番・夜勤・休日当番を確認',tier:'free',cat:'予定',size:'',href:'./shift.html'},
{id:'readings',name:'点検値・メーター',desc:'圧力・流量・温度・電流などの直近値を表示',tier:'free',cat:'点検',size:'wide',href:'./readings.html'},
{id:'calibration',name:'校正期限',desc:'計測器・センサ・トルクレンチなどの校正期限を管理',tier:'free',cat:'期限',size:'',href:'./calibration.html'},
{id:'energy',name:'電力・エネルギー',desc:'設備やラインの電力・使用量・ピークを確認',tier:'paid',cat:'IoT',size:'wide',href:'./energy.html'},
{id:'qr',name:'QR・バーコード',desc:'QRやバーコードから設備・部品・資料をすぐ開く',tier:'free',cat:'操作',size:'',href:'./qr.html'},
{id:'contacts',name:'緊急連絡先',desc:'保全・管理者・メーカー・協力会社の連絡先をすぐ確認',tier:'free',cat:'共有',size:'',href:'./contacts.html'},
{id:'contractors',name:'業者・工事予定',desc:'外部業者の入場・工事・立会予定をまとめて表示',tier:'free',cat:'予定',size:'wide',href:'./contractors.html'},
{id:'backup',name:'バックアップ状態',desc:'PLC・HMI・設定ファイルなどの最終バックアップ状況を確認',tier:'paid',cat:'設備',size:'',href:'./backup.html'},
{id:'photos',name:'点検写真',desc:'最近の点検写真・異常写真・添付記録への入口',tier:'free',cat:'履歴',size:'wide',href:'./photos.html'},
{id:'incident',name:'異常・故障報告',desc:'現場からの異常・故障報告を受付し進捗を管理',tier:'free',cat:'保全',size:'wide',href:'./incidents.html'},
{id:'kaizen',name:'改善提案',desc:'現場の改善案・気づき・対策案を共有',tier:'free',cat:'共有',size:'',href:'./kaizen.html'},
{id:'lending',name:'工具・鍵貸出',desc:'共用工具・測定器・鍵の持出しと返却を管理',tier:'free',cat:'資産',size:'',href:'./lending.html'},
{id:'reorder',name:'発注・補充',desc:'最低在庫を下回った部品や発注待ちを確認',tier:'free',cat:'在庫',size:'',href:'./reorder.html'},
{id:'environment',name:'温湿度・環境',desc:'温度・湿度・CO2など作業環境の状態を表示',tier:'paid',cat:'IoT',size:'',href:'./environment.html'},
{id:'spares-life',name:'寿命部品',desc:'電池・フィルタ・ベルト・ランプなどの交換寿命を管理',tier:'free',cat:'保全',size:'',href:'./life-parts.html'},
{id:'lubrication',name:'給油・グリス',desc:'給油箇所・周期・次回予定を設備ごとに管理',tier:'free',cat:'保全',size:'',href:'./lubrication.html'},
{id:'permits',name:'作業許可',desc:'火気・高所・停電などの作業許可と承認状況を確認',tier:'paid',cat:'安全',size:'',href:'./permits.html'},
{id:'lockout',name:'LOTO',desc:'ロックアウト・タグアウトの実施状況を確認',tier:'paid',cat:'安全',size:'',href:'./lockout.html'},
{id:'training',name:'教育・資格期限',desc:'技能講習・特別教育・資格更新期限を管理',tier:'free',cat:'人員',size:'',href:'./training.html'},
{id:'attendance',name:'保全当番出勤',desc:'保全メンバーの出勤・当番・不在状況を確認',tier:'free',cat:'人員',size:'',href:'./attendance.html'},
{id:'weather',name:'天候・外気',desc:'屋外作業や設備に関係する天候・外気情報の表示枠',tier:'free',cat:'環境',size:'',href:'./weather.html'},
{id:'network',name:'ネットワーク機器',desc:'PLC・HMI・ゲートウェイ等の接続状態を一覧表示',tier:'paid',cat:'設備',size:'wide',href:'./network.html'},
{id:'firmware',name:'ファーム更新',desc:'PLC・HMI・IoT機器の更新確認と対応状況を管理',tier:'paid',cat:'設備',size:'',href:'./firmware.html'},
{id:'license',name:'ソフト・ライセンス',desc:'ソフトウェア契約・ライセンス・保守期限を管理',tier:'paid',cat:'期限',size:'',href:'./licenses.html'},
{id:'cost',name:'保全コスト',desc:'部品費・外注費・修理費などの保全コストを可視化',tier:'paid',cat:'分析',size:'wide',href:'./costs.html'},
{id:'mtbf',name:'MTBF・MTTR',desc:'故障間隔と平均修復時間を設備別に分析',tier:'paid',cat:'分析',size:'wide',href:'./reliability.html'},
{id:'checklist',name:'定型チェックリスト',desc:'清掃・締付・始業・終業など定型作業をすぐ実行',tier:'free',cat:'点検',size:'',href:'./checklists.html'},
{id:'spare-location',name:'保管場所マップ',desc:'予備品・工具・消耗品の保管場所をすばやく確認',tier:'free',cat:'在庫',size:'',href:'./storage-map.html'},
{id:'external-links',name:'外部リンク',desc:'メーカーサイト・社内システム・マニュアルへのショートカット',tier:'free',cat:'操作',size:'',href:'./links.html'},
{id:'alarm-history',name:'アラーム履歴',desc:'設備アラーム・警報・復旧の履歴をまとめて確認',tier:'free',cat:'設備',size:'wide',href:'./alarm-history.html'},
{id:'downtime-reason',name:'停止理由ランキング',desc:'設備停止理由を件数・時間で集計して表示',tier:'paid',cat:'分析',size:'wide',href:'./downtime-reasons.html'},
{id:'compatibility',name:'部品互換・代替品',desc:'既存部品の互換候補・代替品・後継機種を管理',tier:'free',cat:'在庫',size:'wide',href:'./compatibility.html'},
{id:'warranty',name:'保証・保守期限',desc:'設備・機器の保証期間や保守契約期限を管理',tier:'free',cat:'期限',size:'',href:'./warranty.html'},
{id:'support',name:'メーカーサポート',desc:'メーカー窓口・受付時間・サポート情報への入口',tier:'free',cat:'共有',size:'',href:'./manufacturer-support.html'},
{id:'approval-history',name:'承認履歴',desc:'点検・設定変更・設備削除などの承認履歴を確認',tier:'paid',cat:'法人',size:'',href:'./approval-history.html'},
{id:'worktime',name:'作業時間',desc:'設備別・担当者別の作業時間や停止対応時間を集計',tier:'paid',cat:'分析',size:'wide',href:'./worktime.html'},
{id:'templates',name:'点検テンプレート',desc:'日常・月次・法定点検のテンプレートをすぐ呼び出す',tier:'free',cat:'点検',size:'wide',href:'./templates.html'},
{id:'consumables',name:'消耗品',desc:'フィルタ・ヒューズ・ランプ・電池など消耗品を管理',tier:'free',cat:'在庫',size:'',href:'./consumables.html'},
{id:'service-contracts',name:'保守契約',desc:'メーカー・業者との保守契約内容と更新期限を管理',tier:'paid',cat:'期限',size:'',href:'./service-contracts.html'},
{id:'audit',name:'監査ログ',desc:'ログイン・設定変更・削除・出力など重要操作を確認',tier:'paid',cat:'法人',size:'wide',href:'./audit-log.html'},
{id:'bookmarks',name:'最近開いた項目',desc:'直近で見た設備・資料・点検画面をすぐ再表示',tier:'free',cat:'操作',size:'',href:'./recent-items.html'},
{id:'annual-plan',name:'年間保全計画',desc:'年間の点検・交換・法定検査・工事計画を俯瞰',tier:'free',cat:'予定',size:'wide',href:'./annual-plan.html'},
{id:'renewal-plan',name:'設備更新計画',desc:'老朽設備・更新候補・更新予定年度を管理',tier:'paid',cat:'設備',size:'wide',href:'./renewal-plan.html'},
{id:'preventive',name:'予防保全候補',desc:'故障履歴・期限・使用年数から予防保全候補を整理',tier:'paid',cat:'分析',size:'wide',href:'./preventive.html'},
{id:'shutdown-plan',name:'停止予定',desc:'設備停止・停電・工事停止の予定を一覧化',tier:'free',cat:'予定',size:'wide',href:'./shutdown-plan.html'},
{id:'project-progress',name:'工事進捗',desc:'改造・更新・工事案件の進捗と次工程を確認',tier:'free',cat:'工事',size:'wide',href:'./project-progress.html'},
{id:'inventory-count',name:'棚卸',desc:'予備品・工具・資産の棚卸進捗と差異を確認',tier:'free',cat:'在庫',size:'',href:'./inventory-count.html'},
{id:'receiving',name:'検収待ち',desc:'購入部品・外注工事・設備の検収待ちを管理',tier:'free',cat:'購買',size:'',href:'./receiving.html'},
{id:'purchase-history',name:'購入履歴',desc:'部品・工具・設備の購入履歴と単価を確認',tier:'paid',cat:'購買',size:'wide',href:'./purchase-history.html'},
{id:'relocation',name:'設備移設履歴',desc:'設備の移設・ライン変更・設置場所変更を記録',tier:'free',cat:'設備',size:'',href:'./relocation.html'},
{id:'disposal',name:'廃棄・撤去予定',desc:'廃棄予定設備・撤去工事・データ退避状況を管理',tier:'free',cat:'設備',size:'',href:'./disposal.html'},
{id:'portal-links',name:'ポータルリンク',desc:'検索・天気・ニュース・社内ページなど、よく使う外部サービスへのショートカット',tier:'free',cat:'操作',size:''}
];
const DEFAULT=['today','calendar','equipment','notice','memo','versions','iot'];
const WORKSPACE_PRESETS={
 personal:['today','calendar','equipment','notice','memo','device','weather','portal-links','favorites'],
 equipment:['equipment','assigned','deadline','recent','versions','docs','alarm-history','downtime','spares-life','lubrication','network'],
 inspection:['today','checklist','readings','safety','deadline','calendar','photos','handover','templates'],
 field:['today','assigned','handover','safety','quick','deadline','docs'],
 manager:['equipment','downtime','workorders','incident','reorder','annual-plan','notice','audit'],
 monitor:['equipment','alarm-history','iot','readings','network','deadline']
};
const WORKSPACE_LABELS={personal:'マイページ',equipment:'設備',inspection:'点検',field:'現場用',manager:'管理者用',monitor:'大型モニタ'};
const CUSTOM_DASHBOARD_KEY='dc-eq-custom-dashboards-v1';
const getCustomDashboards=()=>{try{return JSON.parse(localStorage.getItem(CUSTOM_DASHBOARD_KEY))||{}}catch{return {}}};
const setCustomDashboards=v=>{try{localStorage.setItem(CUSTOM_DASHBOARD_KEY,JSON.stringify(v))}catch{}};
let customDashboards=getCustomDashboards();
function workspaceLabel(id){return customDashboards[id]?.title||WORKSPACE_LABELS[id]||'ダッシュボード'}
function workspacePreset(id){return customDashboards[id]?.layout||WORKSPACE_PRESETS[id]||DEFAULT}
let currentWorkspace=(()=>{
 try{
  const url=new URL(location.href),q=url.searchParams.get('view');
  if(q&&(WORKSPACE_PRESETS[q]||getCustomDashboards()[q]))return q;
  const saved=localStorage.getItem('dc-eq-workspace')||'personal';
  return WORKSPACE_PRESETS[saved]||getCustomDashboards()[saved]?saved:'personal';
 }catch{return 'personal'}
})();
const WIDGET_ALERTS={
 today:{items:[{source:'widget',count:2}],type:'danger',label:'未実施'},
 calendar:{items:[{source:'widget',count:1}],type:'info',label:'更新'},
 equipment:{items:[{source:'widget',count:3}],type:'danger',label:'要確認'},
 notice:{items:[{source:'admin',count:1},{source:'operations',count:1}],type:'danger',label:'未確認'},
 memo:{items:[{source:'widget',count:1}],type:'info',label:'新着'},
 deadline:{items:[{source:'widget',count:5}],type:'warning',label:'期限'},
 incident:{items:[{source:'widget',count:3}],type:'danger',label:'未完了'},
 workorders:{items:[{source:'widget',count:6}],type:'warning',label:'未完了'},
 reorder:{items:[{source:'widget',count:4}],type:'warning',label:'補充'},
 'alarm-history':{items:[{source:'widget',count:1}],type:'danger',label:'未復旧'},
 permits:{items:[{source:'admin',count:1}],type:'danger',label:'承認待ち'},
 audit:{items:[{source:'operations',count:2}],type:'danger',label:'重要'}
};
function visibleWidgetAlert(id){
 const a=WIDGET_ALERTS[id];if(!a)return null;
 const read=getAlertReads();
 let count=0,mandatory=false;
 for(const item of a.items||[]){
   if(read[id])continue;
   if(MANDATORY_NOTIFICATION_SOURCES.has(item.source)){count+=item.count;mandatory=true}
   else if(widgetNotifyEnabled(id))count+=item.count;
 }
 return count>0?{...a,count,mandatory}:null;
}
const device=()=>innerWidth<700?'mobile':innerWidth<1050?'tablet':'pc';
const storageKey=()=> 'dc-eq-layout:'+currentWorkspace+':'+device();
const sizeKey=()=> 'dc-eq-widget-sizes:'+currentWorkspace+':'+device();
const viewKey=()=> 'dc-eq-widget-views:'+currentWorkspace+':'+device();
const notifyKey=()=> 'dc-eq-widget-notify:'+currentWorkspace+':'+device();
const filterKey=()=> 'dc-eq-widget-filters:'+currentWorkspace+':'+device();
const periodKey=()=> 'dc-eq-widget-periods:'+currentWorkspace+':'+device();
const displayKey=()=> 'dc-eq-widget-display:'+currentWorkspace+':'+device();
const gridPosKey=()=> 'dc-eq-grid-positions:'+currentWorkspace+':'+device();
const getLayout=()=>{
 try{
  const saved=localStorage.getItem(storageKey());
  if(saved)return JSON.parse(saved);
  if(currentWorkspace==='personal'){
    const legacy=localStorage.getItem('dc-eq-layout:'+device());
    if(legacy)return JSON.parse(legacy);
  }
  return [...workspacePreset(currentWorkspace)];
 }catch{return [...workspacePreset(currentWorkspace)]}
};
const setLayout=v=>{localStorage.setItem(storageKey(),JSON.stringify(v));if(customDashboards[currentWorkspace]){customDashboards[currentWorkspace].layout=[...v];setCustomDashboards(customDashboards)}};
const getSizes=()=>{try{return JSON.parse(localStorage.getItem(sizeKey()))||{}}catch{return {}}};
const setSizes=v=>localStorage.setItem(sizeKey(),JSON.stringify(v));
const getViews=()=>{try{return JSON.parse(localStorage.getItem(viewKey()))||{}}catch{return {}}};
const setViews=v=>localStorage.setItem(viewKey(),JSON.stringify(v));
const getNotifyPrefs=()=>{try{return JSON.parse(localStorage.getItem(notifyKey()))||{}}catch{return {}}};
const setNotifyPrefs=v=>localStorage.setItem(notifyKey(),JSON.stringify(v));
const getWidgetFilters=()=>{try{return JSON.parse(localStorage.getItem(filterKey()))||{}}catch{return {}}};
const setWidgetFilters=v=>localStorage.setItem(filterKey(),JSON.stringify(v));
const getWidgetPeriods=()=>{try{return JSON.parse(localStorage.getItem(periodKey()))||{}}catch{return {}}};
const setWidgetPeriods=v=>localStorage.setItem(periodKey(),JSON.stringify(v));
const getWidgetDisplays=()=>{try{return JSON.parse(localStorage.getItem(displayKey()))||{}}catch{return {}}};
const setWidgetDisplays=v=>localStorage.setItem(displayKey(),JSON.stringify(v));
const getGridPositions=()=>{try{return JSON.parse(localStorage.getItem(gridPosKey()))||{}}catch{return {}}};
const setGridPositions=v=>localStorage.setItem(gridPosKey(),JSON.stringify(v));
const gridCompactMigrationKey=()=> 'dc-eq-grid-compact-v1:'+currentWorkspace+':'+device();
function migrateUtilityGridSizes(){
  if(device()!=='pc')return;
  const migrationKey=gridCompactMigrationKey();
  try{if(localStorage.getItem(migrationKey)==='1')return}catch{}
  let changed=false;
  for(const id of ['device','favorites','portal-links','quick','weather','sync','contacts']){
    if(!gridPositions[id])continue;
    gridPositions[id].w=Math.min(gridPositions[id].w||3,3);
    gridPositions[id].h=Math.min(gridPositions[id].h||5,5);
    sizes[id]={span:3,minHeight:220};
    changed=true;
  }
  if(changed){setGridPositions(gridPositions);setSizes(sizes)}
  try{localStorage.setItem(migrationKey,'1')}catch{}
}

let layout=getLayout(),sizes=getSizes(),views=getViews(),notifyPrefs=getNotifyPrefs(),widgetFilters=getWidgetFilters(),widgetPeriods=getWidgetPeriods(),widgetDisplays=getWidgetDisplays(),gridPositions=getGridPositions(),dragId=null,currentFilter='all',currentCategory='all',catalogQuery='',editMode=false,pointerDrag=null,longPressTimer=null;
const FILTER_CYCLE=['全設備','担当設備','第1工場','第2工場'];
const PERIOD_CYCLE=['今日','7日','30日','90日','1年'];
const DEFAULT_DISPLAY_CYCLE=['自動','リスト','タイル','グラフ','ゲージ'];
const DISPLAY_OPTIONS={
 calendar:['月表示','予定一覧','週表示','タイムライン'],
 today:['リスト','タイムライン','カード','サマリー'],
 equipment:['一覧','タイル','ドーナツ','ゲージ']
};
function widgetFilterLabel(id){return widgetFilters[id]||'全設備'}
function nextWidgetFilter(id){const cur=widgetFilterLabel(id),i=FILTER_CYCLE.indexOf(cur);widgetFilters[id]=FILTER_CYCLE[(i+1)%FILTER_CYCLE.length];setWidgetFilters(widgetFilters);render()}
function widgetPeriodLabel(id){return widgetPeriods[id]||'30日'}
function nextWidgetPeriod(id){const cur=widgetPeriodLabel(id),i=PERIOD_CYCLE.indexOf(cur);widgetPeriods[id]=PERIOD_CYCLE[(i+1)%PERIOD_CYCLE.length];setWidgetPeriods(widgetPeriods);render()}
function widgetDisplayOptions(id){return DISPLAY_OPTIONS[id]||DEFAULT_DISPLAY_CYCLE}
function widgetDisplayLabel(id){const opts=widgetDisplayOptions(id);const saved=widgetDisplays[id];return opts.includes(saved)?saved:opts[0]}
function nextWidgetDisplay(id){const opts=widgetDisplayOptions(id),cur=widgetDisplayLabel(id),i=opts.indexOf(cur);widgetDisplays[id]=opts[(i+1)%opts.length];setWidgetDisplays(widgetDisplays);render()}
const MANDATORY_NOTIFICATION_SOURCES=new Set(['admin','operations']);
const ALERT_READ_KEY='dc-eq-widget-alerts-read-v1';
const getAlertReads=()=>{try{return JSON.parse(localStorage.getItem(ALERT_READ_KEY))||{}}catch{return {}}};
const setAlertReads=v=>{try{localStorage.setItem(ALERT_READ_KEY,JSON.stringify(v))}catch{}};
function markWidgetAlertRead(id){
 const a=WIDGET_ALERTS[id];if(!a)return;
 const read=getAlertReads();read[id]=true;setAlertReads(read);
}
function widgetNotifyEnabled(id){return notifyPrefs[id]!==false}
function setWidgetNotify(id,on){notifyPrefs[id]=!!on;setNotifyPrefs(notifyPrefs);render();renderCatalog()}
function canMuteWidget(id){return !['notice'].includes(id)}

const VIEW_MODES=['auto','compact','standard','summary'];
function widgetView(id){return views[id]||'auto'}
function nextWidgetView(id){
 const current=widgetView(id),i=VIEW_MODES.indexOf(current);
 views[id]=VIEW_MODES[(i+1)%VIEW_MODES.length];
 setViews(views);render();
}
function viewLabel(v){return v==='auto'?'自動':v==='compact'?'コンパクト':v==='summary'?'サマリー':'標準'}
function widgetMinGrid(id){
 if(['device','weather','portal-links','favorites','quick','sync','contacts'].includes(id))return {w:3,h:5};
 if(['calendar','today','iot','workorders','annual-plan','readings'].includes(id))return {w:4,h:7};
 return {w:3,h:6};
}
function autoDensityForBox(id,width,height){
 if(width<285||height<205)return 'micro';
 if(width<430||height<285)return 'compact';
 if(width>720&&height>360)return 'expanded';
 return 'standard';
}
function adaptiveWidgetBody(id,density){
 const base=density==='micro'?'micro':density==='compact'?'compact':density==='expanded'?'standard':density;
 let html=widgetBody(id,base);
 if(density==='expanded'){
   const w=WIDGETS.find(x=>x.id===id);
   if(w)html+='<div class="expanded-widget-context"><strong>'+esc(w.name)+'</strong><span>'+esc(w.desc)+'</span><em>'+esc(widgetFilterLabel(id))+' / '+esc(widgetPeriodLabel(id))+'</em></div>';
 }
 return html;
}
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
 editMode=!!on;
 if(editMode&&document.body.classList.contains('widget-overview-mode')){
   document.body.classList.remove('widget-overview-mode');
   document.body.classList.add('overview-paused-for-edit');
   document.body.classList.toggle('widget-2d-grid-mode',device()==='pc');
   overviewRemoveHoverPreview?.(true);
   render();
 }
 if(!editMode&&document.body.classList.contains('overview-paused-for-edit')){
   document.body.classList.remove('overview-paused-for-edit');
   let restore=false;try{restore=localStorage.getItem('dc-eq-overview-mode')==='1'}catch{}
   document.body.classList.toggle('widget-overview-mode',restore&&device()==='pc');
   document.body.classList.toggle('widget-2d-grid-mode',device()==='pc'&&!restore);
   render();
 }
 document.body.classList.toggle('widget-edit-mode',editMode);
 let done=document.querySelector('#widgetEditDone');
 let trash=document.querySelector('#widgetTrashZone');
 if(editMode&&!done){done=document.createElement('button');done.id='widgetEditDone';done.className='widget-edit-done';done.textContent='完了';done.onclick=()=>setEditMode(false);document.body.appendChild(done)}
 if(editMode&&!trash){trash=document.createElement('div');trash.id='widgetTrashZone';trash.className='widget-trash-zone';trash.innerHTML='<span class="trash-icon">⌫</span><strong>ここに持ってきて外す</strong>';document.body.appendChild(trash)}
 if(!editMode&&done)done.remove();
 if(!editMode&&trash)trash.remove();
 document.querySelector('#editWidgets')?.classList.toggle('active',editMode);
}

function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function widgetBody(id,view='standard'){
 const display=widgetDisplayLabel(id);
 if(id==='today'){
  if(view==='micro')return '<div class="micro-widget"><strong>次 09:30</strong><span>CV-04 月次点検</span><em>未実施 2 / 要対応 1</em></div>';
  if(display==='タイムライン')return '<div class="today-timeline"><div><time>09:30</time><i class="yellow"></i><span><strong>CV-04 月次点検</strong><small>第1工場 / 搬送ライン</small></span></div><div><time>11:00</time><i class="green"></i><span><strong>ホイスト 日常点検</strong><small>組立エリア</small></span></div><div><time>14:00</time><i class="red"></i><span><strong>サーボバッテリー交換</strong><small>期限まで3日</small></span></div></div>';
  if(display==='カード')return '<div class="today-card-grid"><article><small>09:30</small><strong>CV-04 月次点検</strong><span>予定</span></article><article><small>11:00</small><strong>ホイスト 日常点検</strong><span>未実施</span></article><article><small>14:00</small><strong>電池交換</strong><span>要対応</span></article></div>';
  if(display==='サマリー'||view==='summary')return '<div class="summary-hero"><strong>3件</strong><span>今日の点検</span><em>未実施 2 / 要対応 1</em></div><div class="summary-progress"><i style="width:33%"></i></div>';
  if(view==='compact')return '<div class="compact-status-row"><span><b>3</b><small>今日</small></span><span><b>2</b><small>未実施</small></span><span><b>1</b><small>要対応</small></span></div><div class="compact-next"><strong>次：CV-04 月次点検</strong><span>09:30</span></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>CV-04 月次点検</strong><small>第1工場 / 搬送ライン</small></div><div class="list-side">09:30</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>ホイスト 日常点検</strong><small>組立エリア / 担当: 自分</small></div><div class="list-side">未実施</div></div><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>サーボバッテリー交換</strong><small>設備A / 期限まで3日</small></div><div class="list-side">要対応</div></div></div>';
 }
 if(id==='calendar'){
  if(view==='micro')return '<div class="micro-agenda"><div><b>10/08</b><span>月次点検</span></div><div><b>10/11</b><span>電池交換</span></div></div>';
  if(display==='予定一覧'||view==='compact')return '<div class="compact-agenda"><div><b>10/08</b><span>CV-04 月次点検</span></div><div><b>10/11</b><span>サーボ電池交換</span></div><div><b>10/12</b><span>停電点検</span></div><div><b>10/18</b><span>CV-04 改造停止</span></div></div>';
  if(display==='週表示')return '<div class="calendar-week"><div><small>月 7</small><span>点検2</span></div><div><small>火 8</small><b>月次点検</b></div><div><small>水 9</small><span>—</span></div><div><small>木 10</small><span>—</span></div><div><small>金 11</small><b>交換</b></div><div><small>土 12</small><b>停電点検</b></div><div><small>日 13</small><span>—</span></div></div>';
  if(display==='タイムライン')return '<div class="calendar-timeline"><div><b>10/08</b><span><strong>CV-04 月次点検</strong><small>09:30 / 第1工場</small></span></div><div><b>10/11</b><span><strong>サーボ電池交換</strong><small>設備A</small></span></div><div><b>10/12</b><span><strong>停電点検</strong><small>09:00〜13:00</small></span></div><div><b>10/18</b><span><strong>CV-04 改造停止</strong><small>13:00〜15:00</small></span></div></div>';
  if(view==='summary')return '<div class="summary-hero"><strong>5件</strong><span>30日以内の予定</span><em>次回 10/08 月次点検</em></div>';
  let days='';for(let i=0;i<21;i++){days+='<div class="day '+(i===6?'today':'')+'"><b>'+(i+1)+'</b>'+(i===6?'<em>点検 2件</em>':i===10?'<em>交換予定</em>':'')+'</div>'}
  return '<div class="calendar"><div class="cal-head">月</div><div class="cal-head">火</div><div class="cal-head">水</div><div class="cal-head">木</div><div class="cal-head">金</div><div class="cal-head">土</div><div class="cal-head">日</div>'+days+'</div><div style="margin-top:9px;color:#708ca0;font-size:calc(9px * var(--dc-font-scale,1))">祝日表示・Google / Outlook同期はアカウント単位で設定予定</div>';
 }
 if(id==='equipment'){
  if(view==='micro')return '<div class="micro-status"><span><b>18</b><small>正常</small></span><span><b>2</b><small>要確認</small></span><span><b>1</b><small>超過</small></span></div>';
  if(display==='タイル')return '<div class="equipment-tile-grid"><article><i class="green"></i><strong>18</strong><span>稼働中</span></article><article><i class="yellow"></i><strong>2</strong><span>要確認</span></article><article><i class="red"></i><strong>1</strong><span>期限超過</span></article></div>';
  if(display==='ドーナツ')return '<div class="equipment-donut-wrap"><div class="equipment-donut"><span><strong>20</strong><small>設備</small></span></div><div class="equipment-donut-legend"><span><i class="green"></i>稼働中 18</span><span><i class="yellow"></i>要確認 2</span><span><i class="red"></i>期限超過 1</span></div></div>';
  if(display==='ゲージ'||view==='summary')return '<div class="equipment-gauge"><div class="gauge-ring"><span><strong>85%</strong><small>正常</small></span></div><div><b>正常 18</b><b>要確認 2</b><b>期限超過 1</b></div></div>';
  if(view==='compact')return '<div class="compact-status-row"><span><b>18</b><small>稼働中</small></span><span><b>2</b><small>要確認</small></span><span><b>1</b><small>期限超過</small></span></div>';
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
  if(view==='micro')return '<div class="device-widget micro-device"><strong data-live-clock>--:--</strong><span data-live-date>----</span></div>';
  if(view==='compact')return '<div class="device-widget compact-device"><strong data-live-clock>--:--</strong><span data-live-date>----</span><span data-live-battery>Battery --</span></div>';
  if(view==='summary')return '<div class="device-widget summary-device"><strong data-live-clock>--:--</strong><span data-live-date>----</span><em data-live-battery>Battery --</em></div>';
  return '<div class="device-widget"><div class="device-time"><strong data-live-clock>--:--</strong><span data-live-seconds>:--</span></div><div class="device-date" data-live-date>----</div><div class="device-meta"><span data-live-zone>Local time</span><span data-live-battery>Battery --</span></div></div>';
 }
 if(id==='deadline'){
  if(view==='summary')return '<div class="summary-hero"><strong>5</strong><span>30日以内の期限</span><em>最短 あと3日</em></div>';
  if(view==='compact')return '<div class="compact-line"><strong>サーボ電池交換</strong><span>あと3日</span></div><div class="compact-line"><strong>月次点検</strong><span>10/12</span></div>';
  return '<div class="list"><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>設備A サーボ電池交換</strong><small>交換期限まで3日</small></div><div class="list-side">10/11</div></div><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>CV-04 月次点検</strong><small>第1工場</small></div><div class="list-side">10/12</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>法定点検</strong><small>ホイスト01</small></div><div class="list-side">10/28</div></div></div>';
 }
 if(id==='recent'){
  if(view==='summary')return '<div class="summary-hero"><strong>8</strong><span>今週の作業</span><em>点検 5 / 修理 2 / 変更 1</em></div>';
  return '<div class="list"><div class="list-item"><div class="list-main"><strong>CV3 センサ位置調整</strong><small>10:24 / 保全班</small></div><div class="list-side">変更</div></div><div class="list-item"><div class="list-main"><strong>コンプレッサ 圧力確認</strong><small>09:10 / 中村</small></div><div class="list-side">完了</div></div><div class="list-item"><div class="list-main"><strong>MR-J4 電池確認</strong><small>昨日 / 保全班</small></div><div class="list-side">点検</div></div></div>';
 }
 if(id==='assigned'){
  if(view==='summary')return '<div class="summary-hero"><strong>6</strong><span>担当設備</span><em>要確認 1件</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>CV-04 搬送コンベア</strong><small>第1工場</small></div><div class="list-side">正常</div></div><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>設備A サーボ搬送軸</strong><small>加工ステーション</small></div><div class="list-side">要確認</div></div></div>';
 }
 if(id==='sync'){
  return '<div class="sync-grid"><span><i class="dot green"></i><b>オンライン</b><small>接続中</small></span><span><i class="dot green"></i><b>データ同期</b><small>12:04</small></span><span><i class="dot yellow"></i><b>Calendar</b><small>未接続</small></span><span><i class="dot green"></i><b>通知</b><small>許可済み</small></span></div>';
 }
 if(id==='quick'){
  return '<div class="quick-grid"><a href="./inspection.html">✓<span>点検開始</span></a><a href="./equipment.html">＋<span>設備追加</span></a><a href="./memo.html">≡<span>メモ追加</span></a><a href="./calendar.html">◫<span>予定追加</span></a></div>';
 }
 if(id==='timer'){
  return '<div class="timer-widget"><strong data-timer-display>00:00:00</strong><div><button class="btn ghost" data-timer-start>開始</button><button class="btn ghost" data-timer-stop>停止</button><button class="btn ghost" data-timer-reset>リセット</button></div></div>';
 }
 if(id==='smart'){
  if(view==='summary')return '<div class="summary-hero"><strong>3</strong><span>今優先したいこと</span><em>期限 / 未実施 / 在庫</em></div>';
  return '<div class="smart-list"><div><b>1</b><span><strong>サーボ電池交換を確認</strong><small>期限まで3日</small></span><a href="./equipment-detail.html">開く</a></div><div><b>2</b><span><strong>未実施点検が2件</strong><small>今日中の対応を推奨</small></span><a href="./inspection.html">開く</a></div><div><b>3</b><span><strong>MR-J4予備電池 残り2個</strong><small>最低在庫に近づいています</small></span><a href="./parts.html">開く</a></div></div>';
 }
 if(id==='handover'){
  if(view==='summary')return '<div class="summary-hero"><strong>4</strong><span>未確認の引継ぎ</span><em>重要 1件</em></div>';
  return '<div class="handover-list"><div class="important"><b>重要</b><span><strong>CV4 搬出センサ再確認</strong><small>夜勤 → 日勤 / 未完了</small></span></div><div><b>共有</b><span><strong>第2ライン 異音なし</strong><small>夜勤 / 06:10</small></span></div><div><b>部品</b><span><strong>MR-J4予備電池 残り2</strong><small>発注確認待ち</small></span></div></div>';
 }
 if(id==='workorders'){
  if(view==='summary')return '<div class="summary-hero"><strong>6</strong><span>未完了の作業依頼</span><em>緊急 1 / 通常 5</em></div>';
  return '<div class="workorder-list"><div><span class="dot red"></span><p><strong>搬送コンベア 異音調査</strong><small>緊急 / 第1工場</small></p><em>対応中</em></div><div><span class="dot yellow"></span><p><strong>照明交換</strong><small>組立エリア</small></p><em>未着手</em></div><div><span class="dot green"></span><p><strong>センサ清掃</strong><small>CV3 / 本日</small></p><em>予定</em></div></div>';
 }
 if(id==='downtime'){
  if(view==='summary')return '<div class="summary-hero"><strong>42分</strong><span>今月の停止時間</span><em>前月比 -18%</em></div>';
  return '<div class="downtime-metrics"><span><small>今月</small><b>42分</b></span><span><small>件数</small><b>3件</b></span><span><small>最長</small><b>21分</b></span></div><div class="compact-next"><strong>直近：CV-04 センサ調整</strong><span>12分</span></div>';
 }
 if(id==='docs'){
  return '<div class="doc-links"><a href="./documents.html"><b>PDF</b><span><strong>取扱説明書</strong><small>CV-04 / 最新版</small></span></a><a href="./documents.html"><b>DWG</b><span><strong>電気図面</strong><small>Rev.05</small></span></a><a href="./documents.html"><b>SPEC</b><span><strong>運転仕様書</strong><small>2026-10-07</small></span></a></div>';
 }
 if(id==='kpi'){
  if(view==='summary')return '<div class="summary-hero"><strong>94%</strong><span>点検実施率</span><em>未完了 6件</em></div>';
  return '<div class="kpi-grid"><span><small>点検実施率</small><b>94%</b><i><em style="width:94%"></em></i></span><span><small>平均対応時間</small><b>2.4h</b><i><em style="width:62%"></em></i></span><span><small>期限内完了</small><b>91%</b><i><em style="width:91%"></em></i></span></div>';
 }
 if(id==='vehicle'){
  if(view==='summary')return '<div class="summary-hero"><strong>2</strong><span>60日以内の期限</span><em>車検 1 / 点検 1</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>N-VAN 車検</strong><small>社用車01</small></div><div class="list-side">11/18</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>フォークリフト定期点検</strong><small>物流エリア</small></div><div class="list-side">12/02</div></div></div>';
 }
 if(id==='favorites'){
  return '<div class="favorite-grid"><a href="./equipment-detail.html"><b>CV</b><span>CV-04</span></a><a href="./inspection.html"><b>✓</b><span>今日の点検</span></a><a href="./documents.html"><b>PDF</b><span>電気図面</span></a><a href="./parts.html"><b>▦</b><span>予備品</span></a></div>';
 }
 if(id==='safety'){
  if(view==='summary')return '<div class="summary-hero"><strong>2/3</strong><span>始業前チェック</span><em>残り1項目</em></div>';
  return '<div class="safety-list"><label><input type="checkbox" checked> 保護具・工具確認</label><label><input type="checkbox" checked> 非常停止・安全装置確認</label><label><input type="checkbox"> 作業前KY・危険箇所確認</label></div>';
 }
 if(id==='trends'){
  if(view==='summary')return '<div class="summary-hero"><strong>+12%</strong><span>要確認件数</span><em>過去30日比較</em></div>';
  return '<div class="trend-bars"><span><small>点検NG</small><i style="--v:72%"></i><b>12</b></span><span><small>故障</small><i style="--v:38%"></i><b>4</b></span><span><small>IoT超過</small><i style="--v:54%"></i><b>7</b></span></div>';
 }
 if(id==='reports'){
  return '<div class="report-list"><a href="./reports.html"><span>月次</span><strong>9月 保全レポート</strong><em>PDF</em></a><a href="./reports.html"><span>設備</span><strong>CV-04 履歴レポート</strong><em>PDF</em></a><a href="./reports.html"><span>点検</span><strong>未完了一覧</strong><em>CSV</em></a></div>';
 }
 if(id==='shift'){
  return '<div class="shift-grid"><span><small>今日</small><b>日勤</b><em>保全A</em></span><span><small>夜勤</small><b>保全B</b><em>18:00〜</em></span><span><small>休日当番</small><b>田中</b><em>10/11</em></span></div>';
 }
 if(id==='readings'){
  if(view==='summary')return '<div class="summary-hero"><strong>4</strong><span>監視中の点検値</span><em>全て基準内</em></div>';
  return '<div class="reading-grid"><span><small>エア圧</small><b>0.52</b><em>MPa</em></span><span><small>温度</small><b>42.6</b><em>℃</em></span><span><small>電流</small><b>8.4</b><em>A</em></span><span><small>流量</small><b>18.2</b><em>L/min</em></span></div>';
 }
 if(id==='calibration'){
  if(view==='summary')return '<div class="summary-hero"><strong>3</strong><span>90日以内の校正期限</span><em>最短 18日</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>トルクレンチ TW-04</strong><small>校正期限まで18日</small></div><div class="list-side">10/26</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>圧力計 PG-12</strong><small>計測器室</small></div><div class="list-side">11/18</div></div></div>';
 }
 if(id==='energy'){
  if(view==='summary')return '<div class="summary-hero"><strong>128kWh</strong><span>本日の使用量</span><em>昨日比 -6%</em></div>';
  return '<div class="energy-grid"><span><small>現在</small><b>18.4kW</b></span><span><small>本日</small><b>128kWh</b></span><span><small>ピーク</small><b>24.1kW</b></span></div><div class="summary-progress"><i style="width:64%"></i></div>';
 }
 if(id==='qr'){
  return '<div class="qr-widget"><div class="qr-mark">▦</div><div><strong>設備・部品をスキャン</strong><small>QR / Barcode</small></div><button class="btn primary">スキャン</button></div>';
 }
 if(id==='contacts'){
  return '<div class="contact-mini"><a href="./contacts.html"><b>保全</b><span>内線 2301</span></a><a href="./contacts.html"><b>設備メーカー</b><span>サポート窓口</span></a><a href="./contacts.html"><b>緊急</b><span>管理責任者</span></a></div>';
 }
 if(id==='contractors'){
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>10/09 電気工事</strong><small>第1工場 / 13:00〜</small></div><div class="list-side">立会</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>10/12 法定点検</strong><small>クレーン業者</small></div><div class="list-side">予定</div></div></div>';
 }
 if(id==='backup'){
  if(view==='summary')return '<div class="summary-hero"><strong>86%</strong><span>バックアップ確認済み</span><em>未確認 3設備</em></div>';
  return '<div class="backup-list"><div><span class="dot green"></span><strong>CV-04 PLC</strong><small>2026/10/07 18:42</small></div><div><span class="dot green"></span><strong>設備A HMI</strong><small>2026/10/06 09:12</small></div><div><span class="dot yellow"></span><strong>設備B Servo</strong><small>90日以上未更新</small></div></div>';
 }
 if(id==='photos'){
  return '<div class="photo-grid"><div><span>CV-04</span><b>点検写真</b></div><div><span>設備A</span><b>異常写真</b></div><div><span>コンプレッサ</span><b>メーター</b></div><div><span>第2ライン</span><b>修理後</b></div></div>';
 }
 if(id==='incident'){
  if(view==='summary')return '<div class="summary-hero"><strong>3</strong><span>未完了の異常報告</span><em>緊急 1件</em></div>';
  return '<div class="workorder-list"><div><span class="dot red"></span><p><strong>搬送ライン異音</strong><small>第1工場 / 12:20</small></p><em>調査中</em></div><div><span class="dot yellow"></span><p><strong>圧力低下</strong><small>コンプレッサ01</small></p><em>確認待ち</em></div></div>';
 }
 if(id==='kaizen'){
  return '<div class="compact-line"><strong>改善案 12件</strong><span>今月 +3</span></div><div class="compact-line"><strong>採用済み</strong><span>5件</span></div><button class="btn ghost" style="width:100%;margin-top:8px">＋ 改善案を追加</button>';
 }
 if(id==='lending'){
  return '<div class="lending-list"><div><strong>絶縁抵抗計</strong><span>貸出中 / 田中</span></div><div><strong>制御盤キー A</strong><span>貸出中 / 佐藤</span></div><div><strong>クランプメータ</strong><span>返却済み</span></div></div>';
 }
 if(id==='reorder'){
  if(view==='summary')return '<div class="summary-hero"><strong>4</strong><span>補充が必要</span><em>発注待ち 2件</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>MR-J4 バッテリー</strong><small>最低在庫 3 / 現在 2</small></div><div class="list-side">発注</div></div><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>光電センサ</strong><small>最低在庫 5 / 現在 4</small></div><div class="list-side">補充</div></div></div>';
 }
 if(id==='environment'){
  if(view==='summary')return '<div class="summary-hero"><strong>良好</strong><span>作業環境</span><em>異常なし</em></div>';
  return '<div class="reading-grid"><span><small>温度</small><b>24.8</b><em>℃</em></span><span><small>湿度</small><b>48</b><em>%</em></span><span><small>CO2</small><b>612</b><em>ppm</em></span><span><small>騒音</small><b>68</b><em>dB</em></span></div>';
 }
 if(id==='spares-life'){
  if(view==='summary')return '<div class="summary-hero"><strong>4</strong><span>90日以内の寿命部品</span><em>最短 12日</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>MR-J4 バッテリー</strong><small>設備A / 交換目安まで12日</small></div><div class="list-side">要準備</div></div><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>制御盤フィルタ</strong><small>第2ライン</small></div><div class="list-side">35日</div></div></div>';
 }
 if(id==='lubrication'){
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>CV-04 軸受給脂</strong><small>次回 10/15</small></div><div class="list-side">7日</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>チェーン給油</strong><small>第1ライン</small></div><div class="list-side">10/28</div></div></div>';
 }
 if(id==='permits'){
  if(view==='summary')return '<div class="summary-hero"><strong>2</strong><span>有効な作業許可</span><em>承認待ち 1件</em></div>';
  return '<div class="workorder-list"><div><span class="dot yellow"></span><p><strong>停電作業許可</strong><small>第1工場 / 13:00〜</small></p><em>承認済</em></div><div><span class="dot red"></span><p><strong>高所作業許可</strong><small>組立エリア</small></p><em>承認待ち</em></div></div>';
 }
 if(id==='lockout'){
  return '<div class="compact-status-row"><span><b>3</b><small>LOTO中</small></span><span><b>2</b><small>確認済</small></span><span><b>1</b><small>解除待ち</small></span></div><div class="compact-next"><strong>設備A 電源遮断</strong><span>保全班</span></div>';
 }
 if(id==='training'){
  if(view==='summary')return '<div class="summary-hero"><strong>3</strong><span>90日以内の資格期限</span><em>最短 21日</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>高所作業車 特別教育</strong><small>田中 / 更新確認</small></div><div class="list-side">21日</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>低圧電気取扱</strong><small>佐藤</small></div><div class="list-side">12/08</div></div></div>';
 }
 if(id==='attendance'){
  return '<div class="compact-status-row"><span><b>4</b><small>日勤</small></span><span><b>2</b><small>夜勤</small></span><span><b>1</b><small>不在</small></span></div><div class="compact-next"><strong>休日当番</strong><span>田中</span></div>';
 }
 if(id==='weather'){
  return '<div class="weather-mini"><strong>24℃</strong><span>くもり</span><small>外気湿度 58% / 降水 20%</small></div>';
 }
 if(id==='network'){
  if(view==='summary')return '<div class="summary-hero"><strong>18/19</strong><span>オンライン</span><em>1機器 要確認</em></div>';
  return '<div class="sync-grid"><span><i class="dot green"></i><b>PLC-01</b><small>Online</small></span><span><i class="dot green"></i><b>HMI-01</b><small>Online</small></span><span><i class="dot red"></i><b>GW-03</b><small>Offline</small></span><span><i class="dot green"></i><b>Servo-04</b><small>Online</small></span></div>';
 }
 if(id==='firmware'){
  return '<div class="compact-line"><strong>更新確認済み</strong><span>14機器</span></div><div class="compact-line"><strong>確認待ち</strong><span>3機器</span></div><div class="compact-line"><strong>更新候補</strong><span>1機器</span></div>';
 }
 if(id==='license'){
  if(view==='summary')return '<div class="summary-hero"><strong>2</strong><span>60日以内の契約期限</span><em>GX系 / CAD</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>GX Works ライセンス</strong><small>保全部共有</small></div><div class="list-side">11/30</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>CAD保守</strong><small>電気設計</small></div><div class="list-side">12/20</div></div></div>';
 }
 if(id==='cost'){
  if(view==='summary')return '<div class="summary-hero"><strong>¥184k</strong><span>今月の保全コスト</span><em>前月比 +4%</em></div>';
  return '<div class="kpi-grid"><span><small>部品費</small><b>¥92k</b><i><em style="width:68%"></em></i></span><span><small>外注費</small><b>¥71k</b><i><em style="width:53%"></em></i></span><span><small>その他</small><b>¥21k</b><i><em style="width:25%"></em></i></span></div>';
 }
 if(id==='mtbf'){
  return '<div class="reliability-grid"><span><small>MTBF</small><b>42.8日</b><em>+8%</em></span><span><small>MTTR</small><b>1.7h</b><em>-12%</em></span></div>';
 }
 if(id==='checklist'){
  return '<div class="safety-list"><label><input type="checkbox" checked> 始業前清掃</label><label><input type="checkbox"> 増締め確認</label><label><input type="checkbox"> 終業時エア抜き</label></div>';
 }
 if(id==='spare-location'){
  return '<div class="location-list"><div><b>A-03</b><span><strong>MR-J4 バッテリー</strong><small>電装品棚 / 上段</small></span></div><div><b>B-12</b><span><strong>光電センサ</strong><small>センサ棚 / 中段</small></span></div></div>';
 }
 if(id==='external-links'){
  return '<div class="favorite-grid"><a href="#"><b>WEB</b><span>三菱FA</span></a><a href="#"><b>SYS</b><span>社内申請</span></a><a href="#"><b>PDF</b><span>標準手順書</span></a><a href="#"><b>HELP</b><span>サポート</span></a></div>';
 }
 if(id==='alarm-history'){
  if(view==='summary')return '<div class="summary-hero"><strong>7</strong><span>24時間のアラーム</span><em>未復旧 1件</em></div>';
  return '<div class="workorder-list"><div><span class="dot red"></span><p><strong>Servo AL.9F</strong><small>設備A / 12:42</small></p><em>未復旧</em></div><div><span class="dot yellow"></span><p><strong>INV 過負荷警報</strong><small>CV-04 / 10:18</small></p><em>復旧</em></div><div><span class="dot green"></span><p><strong>センサ検出異常</strong><small>CV3 / 08:05</small></p><em>復旧</em></div></div>';
 }
 if(id==='downtime-reason'){
  if(view==='summary')return '<div class="summary-hero"><strong>42分</strong><span>今月の停止</span><em>最多：センサ調整</em></div>';
  return '<div class="trend-bars"><span><small>センサ調整</small><i style="--v:76%"></i><b>18分</b></span><span><small>部品交換</small><i style="--v:50%"></i><b>12分</b></span><span><small>復旧確認</small><i style="--v:36%"></i><b>8分</b></span></div>';
 }
 if(id==='compatibility'){
  return '<div class="doc-links"><a href="./compatibility.html"><b>ALT</b><span><strong>MR-J4BAT → 後継候補</strong><small>互換確認済み</small></span></a><a href="./compatibility.html"><b>ALT</b><span><strong>光電センサ E3Z系</strong><small>代替候補 2件</small></span></a></div>';
 }
 if(id==='warranty'){
  if(view==='summary')return '<div class="summary-hero"><strong>2</strong><span>90日以内の保証期限</span><em>最短 32日</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>設備A サーボ</strong><small>メーカー保証</small></div><div class="list-side">11/09</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>IoT Gateway-03</strong><small>保守契約</small></div><div class="list-side">12/20</div></div></div>';
 }
 if(id==='support'){
  return '<div class="contact-mini"><a href="./manufacturer-support.html"><b>三菱電機</b><span>FAサポート</span></a><a href="./manufacturer-support.html"><b>OMRON</b><span>技術相談</span></a><a href="./manufacturer-support.html"><b>KEYENCE</b><span>担当窓口</span></a></div>';
 }
 if(id==='approval-history'){
  return '<div class="report-list"><a href="./approval-history.html"><span>承認</span><strong>点検報告 #248</strong><em>10:14</em></a><a href="./approval-history.html"><span>変更</span><strong>通知設定変更</strong><em>昨日</em></a><a href="./approval-history.html"><span>設備</span><strong>設備削除申請</strong><em>10/05</em></a></div>';
 }
 if(id==='worktime'){
  if(view==='summary')return '<div class="summary-hero"><strong>18.6h</strong><span>今週の保全作業</span><em>停止対応 4.2h</em></div>';
  return '<div class="kpi-grid"><span><small>点検</small><b>8.4h</b><i><em style="width:75%"></em></i></span><span><small>修理</small><b>6.0h</b><i><em style="width:54%"></em></i></span><span><small>改善</small><b>4.2h</b><i><em style="width:38%"></em></i></span></div>';
 }
 if(id==='templates'){
  return '<div class="favorite-grid"><a href="./templates.html"><b>日</b><span>日常点検</span></a><a href="./templates.html"><b>月</b><span>月次点検</span></a><a href="./templates.html"><b>法</b><span>法定点検</span></a><a href="./templates.html"><b>＋</b><span>新規作成</span></a></div>';
 }
 if(id==='consumables'){
  if(view==='summary')return '<div class="summary-hero"><strong>4</strong><span>補充対象の消耗品</span><em>電池 / フィルタ / ヒューズ</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot red"></span><div class="list-main"><strong>MR-J4 バッテリー</strong><small>現在2 / 最低3</small></div><div class="list-side">不足</div></div><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>盤用フィルタ</strong><small>現在5 / 最低6</small></div><div class="list-side">補充</div></div></div>';
 }
 if(id==='service-contracts'){
  return '<div class="compact-line"><strong>設備メーカー保守</strong><span>11/30</span></div><div class="compact-line"><strong>クレーン年次契約</strong><span>12/15</span></div><div class="compact-line"><strong>IoTクラウド</strong><span>01/31</span></div>';
 }
 if(id==='audit'){
  if(view==='summary')return '<div class="summary-hero"><strong>24</strong><span>今日の監査イベント</span><em>重要 2件</em></div>';
  return '<div class="report-list"><a href="./audit-log.html"><span>LOGIN</span><strong>管理者ログイン</strong><em>12:01</em></a><a href="./audit-log.html"><span>EDIT</span><strong>設備A 設定変更</strong><em>11:24</em></a><a href="./audit-log.html"><span>EXPORT</span><strong>設備台帳 CSV出力</strong><em>09:18</em></a></div>';
 }
 if(id==='bookmarks'){
  return '<div class="doc-links"><a href="./equipment-detail.html"><b>EQ</b><span><strong>CV-04 搬送コンベア</strong><small>2分前</small></span></a><a href="./documents.html"><b>PDF</b><span><strong>運転仕様書</strong><small>14分前</small></span></a><a href="./inspection.html"><b>✓</b><span><strong>月次点検</strong><small>32分前</small></span></a></div>';
 }
 if(id==='annual-plan'){
  if(view==='summary')return '<div class="summary-hero"><strong>42</strong><span>年間予定</span><em>今月 6件</em></div>';
  return '<div class="plan-months"><span><b>10月</b><small>点検 4 / 工事 2</small></span><span><b>11月</b><small>交換 3 / 法定 1</small></span><span><b>12月</b><small>停止 2 / 工事 1</small></span></div>';
 }
 if(id==='renewal-plan'){
  if(view==='summary')return '<div class="summary-hero"><strong>5</strong><span>更新候補設備</span><em>優先度A 2件</em></div>';
  return '<div class="workorder-list"><div><span class="dot red"></span><p><strong>制御盤 CP-01</strong><small>使用16年 / 優先度A</small></p><em>2027</em></div><div><span class="dot yellow"></span><p><strong>Servo設備B</strong><small>使用12年</small></p><em>2028</em></div></div>';
 }
 if(id==='preventive'){
  if(view==='summary')return '<div class="summary-hero"><strong>3</strong><span>予防保全候補</span><em>高優先 1件</em></div>';
  return '<div class="smart-list"><div><b>1</b><span><strong>CV-04 軸受交換</strong><small>異音履歴 3回 / 使用時間増加</small></span><a href="./preventive.html">確認</a></div><div><b>2</b><span><strong>盤内ファン交換</strong><small>使用年数 6年</small></span><a href="./preventive.html">確認</a></div></div>';
 }
 if(id==='shutdown-plan'){
  if(view==='summary')return '<div class="summary-hero"><strong>3</strong><span>30日以内の停止予定</span><em>最長 4時間</em></div>';
  return '<div class="list"><div class="list-item"><span class="dot yellow"></span><div class="list-main"><strong>第1工場 停電点検</strong><small>10/12 09:00〜13:00</small></div><div class="list-side">4h</div></div><div class="list-item"><span class="dot green"></span><div class="list-main"><strong>CV-04 改造停止</strong><small>10/18 13:00〜15:00</small></div><div class="list-side">2h</div></div></div>';
 }
 if(id==='project-progress'){
  if(view==='summary')return '<div class="summary-hero"><strong>4</strong><span>進行中工事</span><em>遅延 1件</em></div>';
  return '<div class="project-list"><div><span><strong>CV5 加工ステーション</strong><small>機械製作 → 電気配線</small></span><b>65%</b></div><div><span><strong>盤更新工事</strong><small>設計 → 部品手配</small></span><b>35%</b></div></div>';
 }
 if(id==='inventory-count'){
  if(view==='summary')return '<div class="summary-hero"><strong>78%</strong><span>棚卸進捗</span><em>差異 3件</em></div>';
  return '<div class="compact-status-row"><span><b>124</b><small>確認済</small></span><span><b>32</b><small>未確認</small></span><span><b>3</b><small>差異</small></span></div>';
 }
 if(id==='receiving'){
  if(view==='summary')return '<div class="summary-hero"><strong>4</strong><span>検収待ち</span><em>本日 2件</em></div>';
  return '<div class="report-list"><a href="./receiving.html"><span>部品</span><strong>MR-J4 バッテリー ×10</strong><em>本日</em></a><a href="./receiving.html"><span>工事</span><strong>盤改造工事</strong><em>確認待ち</em></a></div>';
 }
 if(id==='purchase-history'){
  if(view==='summary')return '<div class="summary-hero"><strong>¥428k</strong><span>今月の購入額</span><em>前月比 -8%</em></div>';
  return '<div class="report-list"><a href="./purchase-history.html"><span>10/07</span><strong>光電センサ ×4</strong><em>¥48k</em></a><a href="./purchase-history.html"><span>10/04</span><strong>24V電源 ×2</strong><em>¥36k</em></a></div>';
 }
 if(id==='relocation'){
  return '<div class="report-list"><a href="./relocation.html"><span>10/02</span><strong>設備A 第1→第2工場</strong><em>完了</em></a><a href="./relocation.html"><span>09/18</span><strong>CV-03 ライン番号変更</strong><em>記録</em></a></div>';
 }
 if(id==='disposal'){
  if(view==='summary')return '<div class="summary-hero"><strong>2</strong><span>撤去予定設備</span><em>データ退避待ち 1件</em></div>';
  return '<div class="workorder-list"><div><span class="dot yellow"></span><p><strong>旧制御盤 CP-OLD1</strong><small>撤去予定 11/05</small></p><em>退避待ち</em></div><div><span class="dot green"></span><p><strong>旧HMI GT15</strong><small>廃棄予定 11/20</small></p><em>準備済</em></div></div>';
 }
 if(id==='portal-links'){
  return '<div class="portal-link-grid"><a href="https://www.google.com/" target="_blank" rel="noopener"><b>G</b><span>Google検索</span></a><a href="https://www.google.com/search?q=weather" target="_blank" rel="noopener"><b>☁</b><span>天気</span></a><a href="https://news.google.com/" target="_blank" rel="noopener"><b>N</b><span>ニュース</span></a><a href="../"><b>DC</b><span>電気コントロール</span></a></div>';
 }
 return '';
}
function dashboardAlertCount(id){
 const items=workspacePreset(id);let total=0;
 for(const wid of items){const a=visibleWidgetAlert(wid);if(a)total+=a.count}
 return total;
}
function renderDashboardNavigation(){
 const order=['personal','equipment','inspection','manager','monitor'];
 const customIds=Object.keys(customDashboards);
 const ids=[...order,...customIds];
 const list=document.querySelector('#dashboardNavList');
 const tabs=document.querySelector('#dashboardWorkspaceTabs');
 const makeButton=(id,compact=false)=>{
   const count=dashboardAlertCount(id),active=id===currentWorkspace;
   const tag=compact?'button':'a';
   if(compact)return '<button class="workspace-tab '+(active?'active':'')+'" data-workspace="'+id+'">'+esc(workspaceLabel(id))+(count?'<span class="workspace-alert">'+count+'</span>':'')+'</button>';
   return '<a class="dashboard-nav-item '+(active?'active':'')+'" href="./dashboard.html?view='+encodeURIComponent(id)+'" data-workspace-link="'+id+'"><span class="icon">◈</span><span>'+esc(workspaceLabel(id))+'</span>'+(count?'<span class="nav-alert">'+count+'</span>':'')+'</a>';
 };
 if(list)list.innerHTML=ids.map(id=>makeButton(id,false)).join('');
 if(tabs)tabs.innerHTML=ids.map(id=>makeButton(id,true)).join('')+'<button class="workspace-add" id="workspaceAdd" type="button">＋</button>';
 const title=document.querySelector('#dashboardTitle');if(title)title.textContent=workspaceLabel(currentWorkspace);
 const topTitle=document.querySelector('.topbar h1');if(topTitle)topTitle.textContent=workspaceLabel(currentWorkspace);
 document.querySelectorAll('[data-workspace]').forEach(b=>b.onclick=()=>switchWorkspace(b.dataset.workspace));
 document.querySelector('#workspaceAdd')?.addEventListener('click',createCustomDashboard);
 document.querySelector('#dashboardNavAdd')?.addEventListener('click',createCustomDashboard);
}
function switchWorkspace(id){
 if(!(WORKSPACE_PRESETS[id]||customDashboards[id]))return;
 currentWorkspace=id;
 try{localStorage.setItem('dc-eq-workspace',id)}catch{}
 try{const url=new URL(location.href);url.searchParams.set('view',id);history.replaceState(null,'',url)}catch{}
 layout=getLayout();sizes=getSizes();views=getViews();notifyPrefs=getNotifyPrefs();widgetFilters=getWidgetFilters();widgetPeriods=getWidgetPeriods();widgetDisplays=getWidgetDisplays();gridPositions=getGridPositions();
 migrateUtilityGridSizes();
 render();renderDashboardNavigation();
}
function createCustomDashboard(){
 const title=prompt('新しいダッシュボード名','日常点検');if(!title?.trim())return;
 const id='custom-'+Date.now();
 customDashboards[id]={title:title.trim(),layout:['today','calendar','equipment'],initialLayout:['today','calendar','equipment']};
 setCustomDashboards(customDashboards);
 switchWorkspace(id);
}
function renameCurrentDashboard(){
 const old=workspaceLabel(currentWorkspace);
 const title=prompt('ダッシュボード名を変更',old);if(!title?.trim())return;
 if(!customDashboards[currentWorkspace]){
   const id='custom-'+Date.now();
   customDashboards[id]={title:title.trim(),layout:[...layout],initialLayout:[...layout]};
   setCustomDashboards(customDashboards);
   currentWorkspace=id;
   try{localStorage.setItem('dc-eq-workspace',id)}catch{}
   setLayout(layout);
 }else{
   customDashboards[currentWorkspace].title=title.trim();customDashboards[currentWorkspace].layout=[...layout];setCustomDashboards(customDashboards);
 }
 renderDashboardNavigation();
}
let overviewHoverPreview=null,overviewHoverHideTimer=null,overviewHoverSwitchTimer=null,overviewHoverCurrentId=null;
function overviewEnsureHoverPreview(){
  if(overviewHoverPreview&&overviewHoverPreview.isConnected)return overviewHoverPreview;
  overviewHoverPreview=document.createElement('div');
  overviewHoverPreview.id='widgetHoverPreview';
  overviewHoverPreview.className='widget-hover-preview';
  overviewHoverPreview.innerHTML='<div class="widget-hover-shell"><div class="widget-hover-head"></div><div class="widget-hover-body"></div><div class="widget-hover-foot"></div></div>';
  overviewHoverPreview.style.width=Math.min(560,Math.max(400,innerWidth*.34))+'px';
  overviewHoverPreview.style.left='50%';overviewHoverPreview.style.top='50%';
  overviewHoverPreview.addEventListener('mouseenter',()=>clearTimeout(overviewHoverHideTimer));
  overviewHoverPreview.addEventListener('mouseleave',()=>overviewScheduleHoverHide(45));
  overviewHoverPreview.addEventListener('click',()=>{
    const w=WIDGETS.find(x=>x.id===overviewHoverCurrentId);if(!w)return;
    markWidgetAlertRead(w.id);if(w.href)location.href=w.href;
  });
  document.body.appendChild(overviewHoverPreview);
  return overviewHoverPreview;
}
function overviewRemoveHoverPreview(immediate=false){
  clearTimeout(overviewHoverHideTimer);clearTimeout(overviewHoverSwitchTimer);
  if(!overviewHoverPreview||!overviewHoverPreview.isConnected)return;
  if(immediate){overviewHoverPreview.remove();overviewHoverPreview=null;overviewHoverCurrentId=null;return}
  overviewHoverPreview.classList.remove('show');
  overviewHoverPreview.classList.add('is-hiding');
  const p=overviewHoverPreview;
  setTimeout(()=>{if(p===overviewHoverPreview&&!p.classList.contains('show')){p.remove();overviewHoverPreview=null;overviewHoverCurrentId=null}},150);
}
function overviewScheduleHoverHide(delay=45){
  clearTimeout(overviewHoverHideTimer);
  overviewHoverHideTimer=setTimeout(()=>{
    const active=document.querySelector('.widget-overview-mode .widget:hover');
    if(!active&&!overviewHoverPreview?.matches(':hover'))overviewRemoveHoverPreview();
  },delay);
}
function overviewUpdateHoverContent(preview,w){
  const view=widgetView(w.id),alert=visibleWidgetAlert(w.id);
  preview.querySelector('.widget-hover-head').innerHTML='<h3>'+esc(w.name)+'</h3>'+(alert?'<span class="widget-alert '+alert.type+'">'+alert.count+'</span>':'')+'<span class="badge '+w.tier+'">'+(w.tier==='free'?'FREE':'PRO')+'</span>';
  preview.querySelector('.widget-hover-body').innerHTML=widgetBody(w.id,view);
  preview.querySelector('.widget-hover-foot').innerHTML='<span>'+esc(widgetFilterLabel(w.id))+' / '+esc(widgetPeriodLabel(w.id))+'</span><strong>クリックで開く →</strong>';
}
function overviewShowHoverPreview(el){
  if(!document.body.classList.contains('widget-overview-mode')||editMode||device()!=='pc')return;
  const w=WIDGETS.find(x=>x.id===el.dataset.id);if(!w)return;
  clearTimeout(overviewHoverHideTimer);clearTimeout(overviewHoverSwitchTimer);
  if(overviewHoverCurrentId===w.id&&overviewHoverPreview?.classList.contains('show'))return;
  overviewHoverSwitchTimer=setTimeout(()=>{
    const preview=overviewEnsureHoverPreview();
    const switching=overviewHoverCurrentId&&overviewHoverCurrentId!==w.id&&preview.classList.contains('show');
    overviewHoverCurrentId=w.id;preview.dataset.id=w.id;preview.classList.remove('is-hiding');
    overviewUpdateHoverContent(preview,w);
    if(switching){
      preview.classList.add('is-switching');
      requestAnimationFrame(()=>preview.classList.remove('is-switching'));
    }else{
      requestAnimationFrame(()=>preview.classList.add('show'));
    }
  },20);
}

function gridModeEnabled(){return device()==='pc'&&!document.body.classList.contains('widget-overview-mode')}
function defaultGridRows(id){
  if(['calendar','today','iot','workorders','annual-plan','readings'].includes(id))return 9;
  if(['device','favorites','portal-links','quick','weather','sync','contacts'].includes(id))return 5;
  if(['notice','memo','equipment','versions'].includes(id))return 7;
  return 7;
}
function defaultGridCols(id){
  if(['device','favorites','portal-links','quick','weather','sync','contacts'].includes(id))return 3;
  const w=WIDGETS.find(z=>z.id===id);
  return w?.size==='wide'?8:4;
}
function ensureGridPositions(){
  let changed=false,x=1,y=1,rowH=0;
  for(const id of layout){
    if(gridPositions[id])continue;
    const savedSpan=widgetGeometry(WIDGETS.find(z=>z.id===id)).span;
    const w=Math.max(3,Math.min(12,(sizes[id]?.span||defaultGridCols(id)||savedSpan||4)));
    const h=defaultGridRows(id);
    if(x+w-1>12){y+=rowH;x=1;rowH=0}
    gridPositions[id]={x,y,w,h};changed=true;
    x+=w;rowH=Math.max(rowH,h);
  }
  if(changed)setGridPositions(gridPositions);
}
function gridOverlap(a,b){
  return !(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);
}
function gridCandidateIsFree(id,cand){
  return layout.every(otherId=>{
    if(otherId===id)return true;
    const p=gridPositions[otherId];return !p||!gridOverlap(cand,p);
  });
}
function autoFitGridCandidate(id,cand){
  const mins=widgetMinGrid(id);
  cand={...cand,w:Math.max(mins.w,cand.w),h:Math.max(mins.h,cand.h)};
  if(gridCandidateIsFree(id,cand))return {...cand,autoFit:false};
  const minW=mins.w,minH=mins.h;
  const widths=[cand.w,cand.w-1,cand.w-2].filter((v,i,a)=>v>=minW&&a.indexOf(v)===i);
  const heights=[cand.h,cand.h-1,cand.h-2].filter((v,i,a)=>v>=minH&&a.indexOf(v)===i);
  let best=null,bestPenalty=Infinity;
  for(const w of widths){
    for(const h of heights){
      const x=Math.max(1,Math.min(13-w,cand.x));
      const test={x,y:cand.y,w,h};
      if(!gridCandidateIsFree(id,test))continue;
      const penalty=(cand.w-w)*2+(cand.h-h);
      if(penalty<bestPenalty){best={...test,autoFit:true};bestPenalty=penalty}
    }
  }
  return best||{...cand,autoFit:false};
}
function resolveGridPositions(movedId,candidate){
  const next=JSON.parse(JSON.stringify(gridPositions||{}));
  next[movedId]={...candidate};
  const placed=[{id:movedId,...candidate}];
  const others=layout.filter(id=>id!==movedId).sort((a,b)=>{
    const pa=next[a]||{x:1,y:999},pb=next[b]||{x:1,y:999};return pa.y-pb.y||pa.x-pb.x
  });
  for(const id of others){
    let p={...(next[id]||{x:1,y:1,w:4,h:7})};
    p.x=Math.max(1,Math.min(13-p.w,p.x));
    let guard=0;
    while(guard++<80){
      const hits=placed.filter(q=>gridOverlap(p,q));
      if(!hits.length)break;
      p.y=Math.max(...hits.map(q=>q.y+q.h));
    }
    next[id]=p;placed.push({id,...p});
  }
  return next;
}
function applyGridStyles(){
  const grid=document.querySelector('#widgetGrid');if(!grid||!gridModeEnabled())return;
  ensureGridPositions();
  let maxRow=1;
  document.querySelectorAll('#widgetGrid .widget').forEach(el=>{
    const p=gridPositions[el.dataset.id];if(!p)return;
    el.style.gridColumn=p.x+' / span '+p.w;
    el.style.gridRow=p.y+' / span '+p.h;
    el.style.minHeight='0';
    maxRow=Math.max(maxRow,p.y+p.h);
  });
  grid.style.setProperty('--grid-max-row',String(maxRow));
}
function ensureGridDropPlaceholder(){
  let p=document.querySelector('#gridDropPlaceholder');
  if(!p){p=document.createElement('div');p.id='gridDropPlaceholder';p.className='grid-drop-placeholder';document.querySelector('#widgetGrid')?.appendChild(p)}
  return p;
}
function clearGridDropPlaceholder(){document.querySelector('#gridDropPlaceholder')?.remove()}
function updateGridDropCandidate(clientX,clientY){
  if(!gridModeEnabled()||!pointerDrag)return false;
  const grid=document.querySelector('#widgetGrid');if(!grid)return false;
  ensureGridPositions();
  const gr=grid.getBoundingClientRect();
  const gap=parseFloat(getComputedStyle(grid).columnGap)||12;
  const rowH=parseFloat(getComputedStyle(grid).gridAutoRows)||34;
  const colW=(gr.width-gap*11)/12;
  const p0=gridPositions[pointerDrag.id]||{x:1,y:1,w:4,h:7};
  const col=Math.max(1,Math.min(13-p0.w,Math.round((clientX-gr.left)/(colW+gap))+1));
  const row=Math.max(1,Math.round((clientY-gr.top+scrollY*0)/(rowH+gap))+1);
  const raw={x:col,y:row,w:p0.w,h:p0.h};
  const cand=autoFitGridCandidate(pointerDrag.id,raw);
  pointerDrag.gridCandidate=cand;
  const ph=ensureGridDropPlaceholder();
  ph.style.gridColumn=cand.x+' / span '+cand.w;
  ph.style.gridRow=cand.y+' / span '+cand.h;
  ph.classList.toggle('auto-fit',!!cand.autoFit);
  ph.dataset.label=cand.autoFit?'隙間に合わせて自動調整':'ここに配置';
  return true;
}

function render(){
 const grid=document.querySelector('#widgetGrid'); if(!grid)return;
 let html='';
 layout.forEach(id=>{
   const w=WIDGETS.find(x=>x.id===id); if(!w)return;
   const locked=w.tier==='paid',geom=widgetGeometry(w),view=widgetView(w.id),renderView=view==='auto'?'standard':view,alert=visibleWidgetAlert(w.id);
   html+='<section class="widget view-'+view+(alert?' has-widget-alert':'')+'" draggable="'+(editMode?'true':'false')+'" data-id="'+w.id+'" style="--widget-span:'+geom.span+';--widget-min-height:'+geom.minHeight+'px"><div class="widget-head"><span class="drag" title="長押しして移動">⠿</span><h3>'+esc(w.name)+'</h3>'+(alert?'<span class="widget-alert '+alert.type+'" title="'+esc(alert.label)+'">'+alert.count+'</span>':'')+'<div class="spacer"></div><span class="badge '+w.tier+'">'+(w.tier==='free'?'FREE':'PRO')+'</span></div><div class="widget-edit-tools"><button class="widget-filter-toggle" data-widget-filter="'+w.id+'" title="表示対象を切り替え">'+esc(widgetFilterLabel(w.id))+'</button><button class="widget-period-toggle" data-widget-period="'+w.id+'" title="期間を切り替え">'+esc(widgetPeriodLabel(w.id))+'</button><button class="widget-display-toggle" data-widget-display="'+w.id+'" title="表示形式を切り替え">'+esc(widgetDisplayLabel(w.id))+'</button><button class="widget-view-toggle" data-view="'+w.id+'" title="情報密度を変更">密度 '+viewLabel(view)+'</button></div><div class="widget-body" data-auto-density="'+(view==='auto'?'1':'0')+'">'+adaptiveWidgetBody(w.id,renderView)+'</div><div class="widget-meta"><span>'+esc(widgetFilterLabel(w.id))+' / '+esc(widgetPeriodLabel(w.id))+'</span><span data-widget-updated="'+w.id+'">更新 --:--</span></div><span class="resize-handle resize-top" data-resize="top" aria-hidden="true"></span><span class="resize-handle resize-right" data-resize="right" aria-hidden="true"></span><span class="resize-handle resize-bottom" data-resize="bottom" aria-hidden="true"></span><span class="resize-handle resize-left" data-resize="left" aria-hidden="true"></span><span class="resize-handle resize-corner resize-tl" data-resize="top-left" aria-hidden="true"></span><span class="resize-handle resize-corner resize-tr" data-resize="top-right" aria-hidden="true"></span><span class="resize-handle resize-corner resize-bl" data-resize="bottom-left" aria-hidden="true"></span><span class="resize-handle resize-corner resize-br" data-resize="bottom-right" aria-hidden="true"></span>'+(locked?'<div class="locked"><div class="locked-card"><strong>PRO ウィジェット</strong><small>有料機能のPreviewです。現在はダミーデータ表示のみ。</small><button class="btn">詳細を見る</button></div></div>':'')+'</section>';
 });
 grid.innerHTML=html;
 bindDrag();
 document.querySelectorAll('.widget').forEach(el=>{
   el.addEventListener('mouseenter',()=>{if(!document.body.classList.contains('widget-overview-mode'))return;clearTimeout(overviewHoverHideTimer);overviewShowHoverPreview(el)});
   el.addEventListener('mouseleave',()=>overviewScheduleHoverHide(45));
 });
 document.body.classList.toggle('widget-edit-mode',editMode);
 const dl=document.querySelector('#deviceLabel'); if(dl)dl.textContent=device()==='pc'?'PCレイアウト':device()==='tablet'?'タブレットレイアウト':'スマホレイアウト';
 updateLiveDeviceWidget();
 initTimerWidget();
 applyGridStyles();
 bindAutoDensity();
}
let autoDensityObserver=null;
function bindAutoDensity(){
 if(autoDensityObserver)autoDensityObserver.disconnect();
 autoDensityObserver=new ResizeObserver(entries=>{
   for(const entry of entries){
     const el=entry.target;
     const id=el.dataset.id;
     if(widgetView(id)!=='auto')continue;
     const density=autoDensityForBox(id,entry.contentRect.width,entry.contentRect.height);
     if(el.dataset.autoDensity===density)continue;
     el.dataset.autoDensity=density;
     const body=el.querySelector('.widget-body');
     if(!body)continue;
     body.innerHTML=adaptiveWidgetBody(id,density);
   }
   updateLiveDeviceWidget();
   initTimerWidget();
 });
 document.querySelectorAll('#widgetGrid .widget').forEach(el=>{
   if(widgetView(el.dataset.id)==='auto')autoDensityObserver.observe(el);
 });
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
 pointerDrag={id,startX,startY,lastTarget:id,pointerId:e.pointerId,ghost,origin:el,targetX:0,targetY:0,currentX:0,currentY:0,raf:0,lastSwapAt:0,overTrash:false,lastClientX:startX,lastClientY:startY,scrollRaf:0,autoScrollRaf:0};
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
 if(d.autoScrollRaf)cancelAnimationFrame(d.autoScrollRaf);
 if(d.scrollRaf)cancelAnimationFrame(d.scrollRaf);
 document.querySelector('#widgetTrashZone')?.classList.remove('is-over');
 if(d.overTrash){
   d.ghost?.remove();
   layout=layout.filter(x=>x!==d.id);
   delete gridPositions[d.id];setGridPositions(gridPositions);
   setLayout(layout);
   clearGridDropPlaceholder();
   cleanupWidgetDragVisuals();
   render();renderDashboardNavigation();
   return;
 }
 if(gridModeEnabled()&&d.gridCandidate){
   const cand={...d.gridCandidate};delete cand.autoFit;
   gridPositions=resolveGridPositions(d.id,cand);
   setGridPositions(gridPositions);
   const grid=document.querySelector('#widgetGrid');
   const cs=grid?getComputedStyle(grid):null;
   const rowH=cs?parseFloat(cs.gridAutoRows)||34:34;
   const rowGap=cs?parseFloat(cs.rowGap)||12:12;
   sizes[d.id]={span:cand.w,minHeight:Math.max(140,cand.h*(rowH+rowGap)-rowGap)};
   setSizes(sizes);
   clearGridDropPlaceholder();
   d.ghost?.remove();
   cleanupWidgetDragVisuals();
   render();
   return;
 }
 clearGridDropPlaceholder();
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
function processWidgetDragPoint(clientX,clientY){
 if(!pointerDrag)return;
 pointerDrag.lastClientX=clientX;pointerDrag.lastClientY=clientY;
 const trash=document.querySelector('#widgetTrashZone');
 if(trash){
   const r=trash.getBoundingClientRect();
   pointerDrag.overTrash=clientX>=r.left&&clientX<=r.right&&clientY>=r.top&&clientY<=r.bottom;
   trash.classList.toggle('is-over',pointerDrag.overTrash);
 }
 if(gridModeEnabled()){
   updateGridDropCandidate(clientX,clientY);
   return;
 }
 let hit=document.elementFromPoint(clientX,clientY)?.closest('.widget:not(.widget-drag-ghost)');
 const grid=document.querySelector('#widgetGrid');
 let dropAtEnd=false;
 if(!hit&&grid){
   const gr=grid.getBoundingClientRect();
   const inside=clientX>=gr.left&&clientX<=gr.right&&clientY>=gr.top&&clientY<=gr.bottom;
   if(inside){
     const others=[...document.querySelectorAll('#widgetGrid .widget:not(.drag-origin)')];
     const maxBottom=others.length?Math.max(...others.map(w=>w.getBoundingClientRect().bottom)):gr.top;
     if(clientY>maxBottom+18){
       dropAtEnd=true;
     }else{
       let best=null,bestScore=Infinity;
       others.forEach(w=>{
         const r=w.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
         const score=Math.hypot((clientX-cx)*.78,(clientY-cy)*1.05);
         if(score<bestScore){bestScore=score;best=w}
       });
       if(best&&bestScore<420)hit=best;
     }
   }
 }
 if(dropAtEnd&&pointerDrag.lastTarget!=='__end__'){
   const fromId=pointerDrag.id,a=layout.indexOf(fromId);
   if(a>=0){
     layout.splice(a,1);layout.push(fromId);setLayout(layout);
     const moving=document.querySelector('.widget[data-id="'+fromId+'"]');
     if(moving)grid.appendChild(moving);
   }
   pointerDrag.lastTarget='__end__';
   pointerDrag.lastSwapAt=performance.now();
 }
 if(hit&&hit.dataset.id!==pointerDrag.lastTarget&&hit.dataset.id!==pointerDrag.id){
   const now=performance.now();
   const r=hit.getBoundingClientRect();
   const cx=r.left+r.width/2,cy=r.top+r.height/2;
   const nx=Math.abs(clientX-cx)/(r.width/2),ny=Math.abs(clientY-cy)/(r.height/2);
   const deepEnough=nx<.94&&ny<.94;
   if(deepEnough&&now-pointerDrag.lastSwapAt>65){
     const fromId=pointerDrag.id,toId=hit.dataset.id;
     const a=layout.indexOf(fromId),b=layout.indexOf(toId);
     if(a>=0&&b>=0){
       layout.splice(a,1);layout.splice(b,0,fromId);setLayout(layout);
       const moving=document.querySelector('.widget[data-id="'+fromId+'"]');
       const target=document.querySelector('.widget[data-id="'+toId+'"]');
       if(moving&&target){
         const placeAfter=clientY>cy || (Math.abs(clientY-cy)<r.height*.28 && clientX>cx);
         animateWidgetReorder(moving,target,placeAfter);
       }
     }
     pointerDrag.lastTarget=toId;
     pointerDrag.lastSwapAt=now;
   }
 }
}
function runDragAutoScroll(){
 if(!pointerDrag)return;
 const y=pointerDrag.lastClientY;
 const edge=Math.min(120,Math.max(72,innerHeight*.11));
 let speed=0;
 if(y<edge)speed=-Math.min(22,(edge-y)*.22);
 else if(y>innerHeight-edge)speed=Math.min(22,(y-(innerHeight-edge))*.22);
 if(speed){
   scrollBy(0,speed);
   processWidgetDragPoint(pointerDrag.lastClientX,pointerDrag.lastClientY);
   pointerDrag.autoScrollRaf=requestAnimationFrame(runDragAutoScroll);
 }else pointerDrag.autoScrollRaf=0;
}
function ensureDragAutoScroll(){
 if(pointerDrag&&!pointerDrag.autoScrollRaf)pointerDrag.autoScrollRaf=requestAnimationFrame(runDragAutoScroll);
}

function bindDrag(){
 document.querySelectorAll('.widget').forEach(el=>{
  let downAt=null,dragStarted=false;
  el.addEventListener('click',e=>{
    if(editMode||dragStarted||e.target.closest('button,a,input,select,textarea,label,[data-resize]'))return;
    const w=WIDGETS.find(x=>x.id===el.dataset.id);
    markWidgetAlertRead(el.dataset.id);
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
    processWidgetDragPoint(e.clientX,e.clientY);
    ensureDragAutoScroll();
  },{passive:false});
  const stopPointer=e=>{
    clearTimeout(longPressTimer);
    if(pointerDrag&&pointerDrag.pointerId===e.pointerId)finishPointerWidgetDrag();
  };
  el.addEventListener('pointerup',stopPointer);el.addEventListener('pointercancel',stopPointer);
 });
 if(!document.body.dataset.dragWheelBound){
   document.body.dataset.dragWheelBound='1';
   window.addEventListener('wheel',()=>{
     if(!pointerDrag)return;
     cancelAnimationFrame(pointerDrag.scrollRaf);
     pointerDrag.scrollRaf=requestAnimationFrame(()=>{
       if(pointerDrag)processWidgetDragPoint(pointerDrag.lastClientX,pointerDrag.lastClientY);
     });
   },{passive:true});
   window.addEventListener('scroll',()=>{
     if(!pointerDrag)return;
     cancelAnimationFrame(pointerDrag.scrollRaf);
     pointerDrag.scrollRaf=requestAnimationFrame(()=>{
       if(pointerDrag)processWidgetDragPoint(pointerDrag.lastClientX,pointerDrag.lastClientY);
     });
   },{passive:true});
 }
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=e=>{e.stopPropagation();nextWidgetView(b.dataset.view)});
 document.querySelectorAll('[data-widget-filter]').forEach(b=>b.onclick=e=>{e.stopPropagation();nextWidgetFilter(b.dataset.widgetFilter)});
 document.querySelectorAll('[data-widget-period]').forEach(b=>b.onclick=e=>{e.stopPropagation();nextWidgetPeriod(b.dataset.widgetPeriod)});
 document.querySelectorAll('[data-widget-display]').forEach(b=>b.onclick=e=>{e.stopPropagation();nextWidgetDisplay(b.dataset.widgetDisplay)});
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
   const gridStyle=getComputedStyle(grid);
   const colGap=parseFloat(gridStyle.columnGap)||gap;
   const rowGap=parseFloat(gridStyle.rowGap)||gap;
   const colW=(gridRect.width-colGap*11)/12;
   const rowH=parseFloat(gridStyle.gridAutoRows)||34;
   const startX=e.clientX,startY=e.clientY,startW=rect.width,startH=rect.height;
   const startPos=gridModeEnabled()?{...(gridPositions[id]||{x:1,y:1,w:4,h:7})}:null;
   const move=ev=>{
    const dx=ev.clientX-startX,dy=ev.clientY-startY;

    if(gridModeEnabled()&&startPos){
      let next={...startPos};
      const mins=widgetMinGrid(id);
      const leftEdge=startPos.x;
      const rightEdge=startPos.x+startPos.w;
      const topEdge=startPos.y;
      const bottomEdge=startPos.y+startPos.h;
      const colDelta=Math.round(dx/(colW+colGap));
      const rowDelta=Math.round(dy/(rowH+rowGap));
      const fromLeft=mode==='left'||mode==='top-left'||mode==='bottom-left';
      const fromRight=mode==='right'||mode==='top-right'||mode==='bottom-right';
      const fromTop=mode==='top'||mode==='top-left'||mode==='top-right';
      const fromBottom=mode==='bottom'||mode==='bottom-left'||mode==='bottom-right';

      if(fromRight){
        next.w=Math.max(mins.w,Math.min(13-next.x,startPos.w+colDelta));
      }
      if(fromLeft){
        const newX=Math.max(1,Math.min(rightEdge-mins.w,leftEdge+colDelta));
        next.x=newX;
        next.w=Math.max(mins.w,rightEdge-newX);
      }
      if(fromBottom){
        next.h=Math.max(mins.h,startPos.h+rowDelta);
      }
      if(fromTop){
        const newY=Math.max(1,Math.min(bottomEdge-mins.h,topEdge+rowDelta));
        next.y=newY;
        next.h=Math.max(mins.h,bottomEdge-newY);
        el.classList.add('resizing-from-top');
      }
      const resolved=resolveGridPositions(id,next);
      gridPositions=resolved;
      setGridPositions(gridPositions);
      const p=gridPositions[id];
      el.style.gridColumn=p.x+' / span '+p.w;
      el.style.gridRow=p.y+' / span '+p.h;

      sizes[id]={
        span:p.w,
        minHeight:Math.max(140,p.h*(rowH+rowGap)-rowGap)
      };
      setSizes(sizes);

      document.querySelectorAll('#widgetGrid .widget').forEach(node=>{
        const gp=gridPositions[node.dataset.id];if(!gp)return;
        node.style.gridColumn=gp.x+' / span '+gp.w;
        node.style.gridRow=gp.y+' / span '+gp.h;
      });
      return;
    }

    const geom=widgetGeometry(WIDGETS.find(w=>w.id===id));
    const fromLeft=mode==='left'||mode==='top-left'||mode==='bottom-left';
    const fromRight=mode==='right'||mode==='top-right'||mode==='bottom-right';
    const fromTop=mode==='top'||mode==='top-left'||mode==='top-right';
    const fromBottom=mode==='bottom'||mode==='bottom-left'||mode==='bottom-right';

    if(fromRight){
      const desired=Math.max(colW*3,startW+dx);
      geom.span=clampSpan(Math.round((desired+colGap)/(colW+colGap)));
      el.style.setProperty('--widget-span',geom.span);
    }
    if(fromLeft){
      const desired=Math.max(colW*3,startW-dx);
      geom.span=clampSpan(Math.round((desired+colGap)/(colW+colGap)));
      el.style.setProperty('--widget-span',geom.span);
    }
    if(fromBottom){
      geom.minHeight=Math.max(140,startH+dy);
      el.style.setProperty('--widget-min-height',Math.round(geom.minHeight)+'px');
    }
    if(fromTop){
      geom.minHeight=Math.max(140,startH-dy);
      el.style.setProperty('--widget-min-height',Math.round(geom.minHeight)+'px');
      el.classList.add('resizing-from-top');
    }
    saveGeometry(id,geom);
   };
   const up=()=>{el.classList.remove('resizing-from-top');window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};
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
function openCatalog(){
 const modal=document.querySelector('#widgetModal');modal.classList.remove('hidden');
 const cat=document.querySelector('#catalogCategory');
 if(cat&&cat.options.length<=1){
  [...new Set(WIDGETS.map(w=>w.cat))].sort((a,b)=>a.localeCompare(b,'ja')).forEach(name=>{
   const o=document.createElement('option');o.value=name;o.textContent=name;cat.appendChild(o);
  });
 }
 renderCatalog()
}
function closeCatalog(){document.querySelector('#widgetModal')?.classList.add('hidden')}
function renderCatalog(){
 const area=document.querySelector('#catalog'); if(!area)return;
 const q=catalogQuery.trim().toLowerCase();
 const list=WIDGETS.filter(w=>{
   const tierOk=currentFilter==='all'||currentFilter===w.tier||(currentFilter==='active'&&layout.includes(w.id));
   const catOk=currentCategory==='all'||w.cat===currentCategory;
   const queryOk=!q||(w.name+' '+w.desc+' '+w.cat).toLowerCase().includes(q);
   return tierOk&&catOk&&queryOk;
 });
 let html='';
 list.forEach(w=>{
   const alert=visibleWidgetAlert(w.id),muteAllowed=canMuteWidget(w.id),notifyOn=widgetNotifyEnabled(w.id);
   html+='<article class="catalog-card"><div class="row"><h3>'+esc(w.name)+'</h3><div class="spacer"></div><span class="badge '+w.tier+'">'+(w.tier==='free'?'FREE':'PRO')+'</span></div><p>'+esc(w.desc)+'</p><div class="catalog-notify-row"><span>通知バッジ</span>'+(muteAllowed?'<button class="notify-toggle '+(notifyOn?'on':'off')+'" data-notify="'+w.id+'" aria-pressed="'+notifyOn+'">'+(notifyOn?'ON':'OFF')+'</button>':'<span class="notify-locked">必須</span>')+(alert?.mandatory?'<small>管理者/運営通知を含む</small>':'')+'</div><div class="row"><span class="badge">'+esc(w.cat)+'</span><div class="spacer"></div><button class="btn '+(layout.includes(w.id)?'ghost':'primary')+'" data-add="'+w.id+'" '+(layout.includes(w.id)?'disabled':'')+'>'+(layout.includes(w.id)?'追加済み':'追加')+'</button></div></article>';
 });
 if(!html){
   html='<div class="catalog-empty"><strong>該当するウィジェットはありません</strong><span>カテゴリや検索条件を変更してください。</span></div>';
 }
 area.innerHTML=html;
 document.querySelector('#catalogCount')?.replaceChildren(document.createTextNode(list.length+'件'));
 area.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{if(!layout.includes(b.dataset.add)){layout.push(b.dataset.add);setLayout(layout);render();renderCatalog()}});
 area.querySelectorAll('[data-notify]').forEach(b=>b.onclick=()=>setWidgetNotify(b.dataset.notify,!widgetNotifyEnabled(b.dataset.notify)));
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
let timerSeconds=0,timerRunning=false,timerTick=null;
function renderTimer(){
 const h=String(Math.floor(timerSeconds/3600)).padStart(2,'0');
 const m=String(Math.floor((timerSeconds%3600)/60)).padStart(2,'0');
 const s=String(timerSeconds%60).padStart(2,'0');
 document.querySelectorAll('[data-timer-display]').forEach(x=>x.textContent=h+':'+m+':'+s);
}
function initTimerWidget(){
 document.querySelectorAll('[data-timer-start]').forEach(b=>b.onclick=e=>{e.stopPropagation();if(timerRunning)return;timerRunning=true;timerTick=setInterval(()=>{timerSeconds++;renderTimer()},1000)});
 document.querySelectorAll('[data-timer-stop]').forEach(b=>b.onclick=e=>{e.stopPropagation();timerRunning=false;clearInterval(timerTick)});
 document.querySelectorAll('[data-timer-reset]').forEach(b=>b.onclick=e=>{e.stopPropagation();timerRunning=false;clearInterval(timerTick);timerSeconds=0;renderTimer()});
 renderTimer();
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
function stampWidgetUpdates(){
 const t=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
 document.querySelectorAll('[data-widget-updated]').forEach(x=>x.textContent='更新 '+t);
}
const REFRESH_PREF_KEY='dc-eq-refresh-interval-v1';
const REFRESH_INTERVALS={
  off:0,
  '15s':15000,
  '60s':60000,
  '10m':600000,
  '1h':3600000,
  '24h':86400000
};
let refreshTimer=null;
function readRefreshMode(){try{return localStorage.getItem(REFRESH_PREF_KEY)||'smart'}catch{return 'smart'}}
function refreshModeLabel(mode){
  return mode==='smart'?'スマート':mode==='off'?'更新しない':mode==='15s'?'15秒':mode==='60s'?'1分':mode==='10m'?'10分':mode==='1h'?'1時間':mode==='24h'?'24時間':mode;
}
function smartRefreshMs(){
  const hasFast=layout.some(id=>['iot','readings','environment','energy','network','equipment','today'].includes(id));
  return hasFast?30000:600000;
}
function refreshVisibleWidgets(reason='timer'){
  if(document.visibilityState!=='visible')return;
  stampWidgetUpdates();
  document.querySelectorAll('#widgetGrid .widget').forEach(el=>{
    el.classList.add('widget-refresh-pulse');
    setTimeout(()=>el.classList.remove('widget-refresh-pulse'),420);
  });
  // Preview: backend data fetch hooks will be connected here.
}
function scheduleRefresh(){
  clearInterval(refreshTimer);refreshTimer=null;
  const mode=readRefreshMode();
  const ms=mode==='smart'?smartRefreshMs():(REFRESH_INTERVALS[mode]||0);
  const select=document.querySelector('#refreshIntervalSelect');
  const label=document.querySelector('#refreshModeLabel');
  if(select)select.value=mode;if(label)label.textContent=refreshModeLabel(mode);
  if(ms>0)refreshTimer=setInterval(()=>refreshVisibleWidgets('timer'),ms);
}

document.addEventListener('DOMContentLoaded',()=>{
 migrateUtilityGridSizes();
 render();
 initDeviceStatus();
 stampWidgetUpdates();
 setInterval(stampWidgetUpdates,60000);
 renderDashboardNavigation();
 document.querySelector('#renameDashboard')?.addEventListener('click',renameCurrentDashboard);
 const globalSearchData=[
  {type:'設備',title:'CV-04 搬送コンベア',meta:'第1工場 / FX5U-32MR',href:'./equipment-detail.html'},
  {type:'設備',title:'設備A サーボ搬送軸',meta:'MR-J4-70B',href:'./equipment-detail.html'},
  {type:'部品',title:'MR-J4 バッテリー',meta:'在庫 2 / A-03',href:'./parts.html'},
  {type:'作業',title:'CV-04 月次点検',meta:'本日 09:30',href:'./inspection.html'},
  {type:'資料',title:'CV-04 運転仕様書',meta:'最新版 2026-10-07',href:'./documents.html'},
  {type:'メモ',title:'CV3 センサ位置調整',meta:'第2ライン共有メモ',href:'./memo.html'}
 ];
 const searchModal=document.querySelector('#globalSearchModal'),searchInput=document.querySelector('#globalSearchInput'),searchResults=document.querySelector('#globalSearchResults');
 const renderGlobalSearch=q=>{
   if(!searchResults)return;
   const s=(q||'').trim().toLowerCase();
   const list=globalSearchData.filter(x=>!s||(x.title+' '+x.meta+' '+x.type).toLowerCase().includes(s));
   searchResults.innerHTML=list.length?list.map(x=>'<a href="'+x.href+'"><span>'+x.type+'</span><div><strong>'+esc(x.title)+'</strong><small>'+esc(x.meta)+'</small></div><b>→</b></a>').join(''):'<div class="global-search-empty">該当する項目はありません</div>';
 };
 document.querySelector('#globalSearchOpen')?.addEventListener('click',()=>{searchModal?.classList.remove('hidden');renderGlobalSearch('');setTimeout(()=>searchInput?.focus(),0)});
 document.querySelector('#globalSearchClose')?.addEventListener('click',()=>searchModal?.classList.add('hidden'));
 searchModal?.addEventListener('click',e=>{if(e.target===searchModal)searchModal.classList.add('hidden')});
 searchInput?.addEventListener('input',e=>renderGlobalSearch(e.target.value));
 document.querySelectorAll('[data-open-widgets]').forEach(b=>b.addEventListener('click',openCatalog));
 document.querySelector('#closeWidgets')?.addEventListener('click',closeCatalog);
 const modalOverlay=document.querySelector('#widgetModal');
 modalOverlay?.addEventListener('click',e=>{if(e.target===modalOverlay)closeCatalog()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modalOverlay?.classList.contains('hidden'))closeCatalog()});
 document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{currentFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCatalog()});
 document.querySelector('#catalogSearch')?.addEventListener('input',e=>{catalogQuery=e.target.value;renderCatalog()});
 document.querySelector('#catalogCategory')?.addEventListener('change',e=>{currentCategory=e.target.value;renderCatalog()});
 document.querySelector('#resetLayout')?.addEventListener('click',()=>{
 const baseline=customDashboards[currentWorkspace]?.initialLayout||WORKSPACE_PRESETS[currentWorkspace]||DEFAULT;
 layout=[...baseline];sizes={};views={};widgetFilters={};widgetPeriods={};widgetDisplays={};
 setLayout(layout);setSizes(sizes);setViews(views);setWidgetFilters(widgetFilters);setWidgetPeriods(widgetPeriods);setWidgetDisplays(widgetDisplays);
 render();renderDashboardNavigation();
});
 const hardCleanup=()=>{clearTimeout(longPressTimer);if(pointerDrag)finishPointerWidgetDrag();else cleanupWidgetDragVisuals()};
 window.addEventListener('blur',hardCleanup);
 window.addEventListener('pagehide',hardCleanup);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')hardCleanup()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pointerDrag)hardCleanup()});
 document.addEventListener('pointerup',e=>{if(pointerDrag&&pointerDrag.pointerId===e.pointerId)finishPointerWidgetDrag()},{capture:true});
 document.addEventListener('pointercancel',e=>{if(pointerDrag&&pointerDrag.pointerId===e.pointerId)finishPointerWidgetDrag()},{capture:true});
 document.querySelector('#editWidgets')?.addEventListener('click',()=>setEditMode(!editMode));
 let lastDevice=device();
 addEventListener('resize',()=>{const d=device();if(d!==lastDevice){lastDevice=d;layout=getLayout();sizes=getSizes();views=getViews();notifyPrefs=getNotifyPrefs();widgetFilters=getWidgetFilters();widgetPeriods=getWidgetPeriods();widgetDisplays=getWidgetDisplays();applyOverviewMode(overviewOn);document.body.classList.toggle('widget-2d-grid-mode',d==='pc'&&!document.body.classList.contains('widget-overview-mode'));render()}});
 const menuToggle=document.querySelector('#appMenuToggle'),menu=document.querySelector('#appMenu');
 const closeAppMenu=()=>{if(!menu)return;menu.hidden=true;menuToggle?.setAttribute('aria-expanded','false')};
 menuToggle?.addEventListener('click',e=>{e.stopPropagation();const open=menu.hidden;menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open))});
 document.addEventListener('click',e=>{if(menu&&!menu.hidden&&!e.target.closest('.app-menu-wrap'))closeAppMenu()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAppMenu()});
 document.querySelector('#logoutMenu')?.addEventListener('click',()=>{location.href='./login.html'});
 document.querySelector('#languageMenu')?.addEventListener('click',()=>{alert('Preview: 多言語設定は今後ここから切り替えます')});
 const refreshSelect=document.querySelector('#refreshIntervalSelect');
 refreshSelect?.addEventListener('change',()=>{
   try{localStorage.setItem(REFRESH_PREF_KEY,refreshSelect.value)}catch{}
   scheduleRefresh();
   refreshVisibleWidgets('setting-change');
 });
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){refreshVisibleWidgets('resume');scheduleRefresh()}});
 scheduleRefresh();

 const overviewKey='dc-eq-overview-mode';
 const applyOverviewMode=on=>{
   const enabled=!!on&&device()==='pc';
   document.body.classList.toggle('widget-overview-mode',enabled);
   document.body.classList.toggle('widget-2d-grid-mode',device()==='pc'&&!enabled);
   try{localStorage.setItem(overviewKey,enabled?'1':'0')}catch{}
   const b=document.querySelector('#overviewModeToggle');
   if(b){const s=b.querySelector('span');if(s)s.textContent=enabled?'ON':'OFF';b.classList.toggle('active',enabled)}
   if(!enabled)document.querySelector('#widgetHoverPreview')?.remove();
   if(document.querySelector('#widgetGrid'))render();
 };
 let overviewOn=false;try{overviewOn=localStorage.getItem(overviewKey)==='1'}catch{}
 applyOverviewMode(overviewOn);
 document.querySelector('#overviewModeToggle')?.addEventListener('click',()=>{overviewOn=!overviewOn;applyOverviewMode(overviewOn);closeAppMenu()});

 let hoverPreview=null,hoverPreviewHideTimer=null,hoverPreviewSwitchTimer=null,hoverPreviewCurrentId=null;
 function ensureHoverPreview(){
   if(hoverPreview&&hoverPreview.isConnected)return hoverPreview;
   hoverPreview=document.createElement('div');
   hoverPreview.id='widgetHoverPreview';
   hoverPreview.className='widget-hover-preview';
   hoverPreview.innerHTML='<div class="widget-hover-shell"><div class="widget-hover-head"></div><div class="widget-hover-body"></div><div class="widget-hover-foot"></div></div>';
   hoverPreview.style.width=Math.min(560,Math.max(400,innerWidth*.34))+'px';
   hoverPreview.style.left='50%';hoverPreview.style.top='50%';
   hoverPreview.addEventListener('mouseenter',()=>clearTimeout(hoverPreviewHideTimer));
   hoverPreview.addEventListener('mouseleave',()=>scheduleHoverPreviewHide(45));
   hoverPreview.addEventListener('click',()=>{
     const w=WIDGETS.find(x=>x.id===hoverPreviewCurrentId);if(!w)return;
     markWidgetAlertRead(w.id);if(w.href)location.href=w.href;
   });
   document.body.appendChild(hoverPreview);
   return hoverPreview;
 }
 function removeHoverPreview(immediate=false){
   clearTimeout(hoverPreviewHideTimer);clearTimeout(hoverPreviewSwitchTimer);
   if(!hoverPreview||!hoverPreview.isConnected)return;
   if(immediate){hoverPreview.remove();hoverPreview=null;hoverPreviewCurrentId=null;return}
   hoverPreview.classList.remove('show');
   hoverPreview.classList.add('is-hiding');
   const p=hoverPreview;
   setTimeout(()=>{if(p===hoverPreview&&!p.classList.contains('show')){p.remove();hoverPreview=null;hoverPreviewCurrentId=null}},170);
 }
 function scheduleHoverPreviewHide(delay=45){
   clearTimeout(hoverPreviewHideTimer);
   hoverPreviewHideTimer=setTimeout(()=>{
     const active=document.querySelector('.widget-overview-mode .widget:hover');
     if(!active&&!hoverPreview?.matches(':hover'))removeHoverPreview();
   },delay);
 }
 function updateHoverPreviewContent(preview,w){
   const view=widgetView(w.id),alert=visibleWidgetAlert(w.id);
   const head=preview.querySelector('.widget-hover-head');
   const body=preview.querySelector('.widget-hover-body');
   const foot=preview.querySelector('.widget-hover-foot');
   head.innerHTML='<h3>'+esc(w.name)+'</h3>'+(alert?'<span class="widget-alert '+alert.type+'">'+alert.count+'</span>':'')+'<span class="badge '+w.tier+'">'+(w.tier==='free'?'FREE':'PRO')+'</span>';
   body.innerHTML=widgetBody(w.id,view);
   foot.innerHTML='<span>'+esc(widgetFilterLabel(w.id))+' / '+esc(widgetPeriodLabel(w.id))+'</span><strong>クリックで開く →</strong>';
 }
 function showHoverPreview(el){
   if(!document.body.classList.contains('widget-overview-mode')||editMode||device()!=='pc')return;
   const w=WIDGETS.find(x=>x.id===el.dataset.id);if(!w)return;
   clearTimeout(hoverPreviewHideTimer);clearTimeout(hoverPreviewSwitchTimer);
   if(hoverPreviewCurrentId===w.id&&hoverPreview?.classList.contains('show'))return;
   hoverPreviewSwitchTimer=setTimeout(()=>{
     const preview=ensureHoverPreview();
     const switching=hoverPreviewCurrentId&&hoverPreviewCurrentId!==w.id&&preview.classList.contains('show');
     hoverPreviewCurrentId=w.id;
     preview.dataset.id=w.id;
     preview.classList.remove('is-hiding');
     if(switching){
       preview.classList.add('is-switching');
       updateHoverPreviewContent(preview,w);
       requestAnimationFrame(()=>preview.classList.remove('is-switching'));
     }else{
       updateHoverPreviewContent(preview,w);
       requestAnimationFrame(()=>preview.classList.add('show'));
     }
   },35);
 }
 document.body.classList.toggle('widget-2d-grid-mode',device()==='pc'&&!document.body.classList.contains('widget-overview-mode'));
 ensureGridPositions();
 setTimeout(()=>applyGridStyles(),0);

 const focusKey='dc-eq-focus-mode';
 const applyFocusMode=on=>{
   document.body.classList.toggle('widget-focus-mode',!!on);
   try{localStorage.setItem(focusKey,on?'1':'0')}catch{}
   const b=document.querySelector('#focusModeToggle');
   if(b){const s=b.querySelector('span');if(s)s.textContent=on?'ON':'OFF';b.classList.toggle('active',!!on)}
 };
 let focusOn=false;try{focusOn=localStorage.getItem(focusKey)==='1'}catch{}
 applyFocusMode(focusOn);
 document.querySelector('#focusModeToggle')?.addEventListener('click',()=>{focusOn=!focusOn;applyFocusMode(focusOn);closeAppMenu()});

 const shareModal=document.querySelector('#dashboardShareModal');
 document.querySelector('#dashboardExport')?.addEventListener('click',()=>window.print());
 document.querySelector('#dashboardShare')?.addEventListener('click',()=>{
   const label=workspaceLabel(currentWorkspace);
   const n=document.querySelector('#shareWorkspaceName');if(n)n.textContent=label+'ダッシュボード';
   shareModal?.classList.remove('hidden');
 });
 document.querySelector('#dashboardShareClose')?.addEventListener('click',()=>shareModal?.classList.add('hidden'));
 shareModal?.addEventListener('click',e=>{if(e.target===shareModal)shareModal.classList.add('hidden')});
 document.querySelector('#dashboardShareSend')?.addEventListener('click',()=>{
   alert('Preview: PDFスナップショットを生成し、選択した対象へ配布するフローです。確認状況は社内通知で追跡します。');
   shareModal?.classList.add('hidden');
 });
 const tutorialModal=document.querySelector('#tutorialModal');
 const tutorialSteps=[
  {title:'左側からダッシュボードを切り替える',text:'マイページ・設備・点検など、目的別ダッシュボードを左側から切り替えます。自分専用のダッシュボードも追加できます。',mode:'sidebar'},
  {title:'長押しで編集モード',text:'ウィジェットを長押しすると、配置変更とサイズ変更ができる編集モードに切り替わります。',mode:'hold'},
  {title:'ドラッグして並べ替え',text:'浮いたウィジェットをそのまま動かすと、周りのカードが滑らかに避けて新しい位置へ入れ替わります。',mode:'move'},
  {title:'端をつかんでサイズ変更',text:'PCでは端や右下をドラッグ。タブレット・スマホでは編集モード中に2本指操作で大きさを調整できます。',mode:'resize'},
  {title:'＋から必要な機能を追加',text:'ウィジェット一覧から必要な機能だけ追加できます。テーマや表示形式もあとから変更できます。',mode:'add'},
  {title:'検索で設備・資料・作業を探す',text:'上部の検索から、設備・型式・部品・作業・資料・メモを横断して探せます。',mode:'search'},
  {title:'メニューから表示を整える',text:'3本線メニューからテーマ、文字サイズ、組織設定、ログアウトなどを操作できます。',mode:'menu'}
 ];
 let tutorialIndex=0;
 const renderTutorial=()=>{
   const s=tutorialSteps[tutorialIndex];
   document.querySelector('#tutorialStepLabel').textContent='STEP '+(tutorialIndex+1)+' / '+tutorialSteps.length;
   document.querySelector('#tutorialTitle').textContent=s.title;
   document.querySelector('#tutorialText').textContent=s.text;
   const demo=document.querySelector('#tutorialDemo');demo.dataset.mode=s.mode;
   const dots=document.querySelector('#tutorialDots');dots.innerHTML=tutorialSteps.map((_,i)=>'<i class="'+(i===tutorialIndex?'active':'')+'"></i>').join('');
   document.querySelector('#tutorialPrev').disabled=tutorialIndex===0;
   document.querySelector('#tutorialNext').textContent=tutorialIndex===tutorialSteps.length-1?'完了':'次へ';
 };
 const openTutorial=()=>{
   tutorialIndex=0;renderTutorial();tutorialModal?.classList.remove('hidden');
 };
 document.querySelector('#tutorialOpen')?.addEventListener('click',()=>{openTutorial();closeAppMenu()});
 document.querySelector('#tutorialClose')?.addEventListener('click',()=>tutorialModal?.classList.add('hidden'));
 document.querySelector('#tutorialPrev')?.addEventListener('click',()=>{if(tutorialIndex>0){tutorialIndex--;renderTutorial()}});
 document.querySelector('#tutorialNext')?.addEventListener('click',()=>{if(tutorialIndex<tutorialSteps.length-1){tutorialIndex++;renderTutorial()}else tutorialModal?.classList.add('hidden')});
 tutorialModal?.addEventListener('click',e=>{if(e.target===tutorialModal)tutorialModal.classList.add('hidden')});
 try{
   if(sessionStorage.getItem('dc-eq-tutorial-seen')!=='1'){
     setTimeout(()=>{openTutorial();sessionStorage.setItem('dc-eq-tutorial-seen','1')},900);
   }
 }catch{}
 const greeting=document.querySelector('#topbarGreeting');
 if(greeting){
   let shouldShow=true;
   try{shouldShow=sessionStorage.getItem('dc-eq-greeted')!=='1'}catch{}
   if(shouldShow){
     const hour=new Date().getHours();
     const hello=hour<11?'おはようございます':hour<18?'こんにちは':'こんばんは';
     greeting.textContent=hello+'、Preview User さん';
     greeting.classList.add('show');
     try{sessionStorage.setItem('dc-eq-greeted','1')}catch{}
     greeting.addEventListener('animationend',()=>greeting.classList.remove('show'),{once:true});
   }
 }
});