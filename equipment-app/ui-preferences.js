// Shared Preview notification data: dashboard and specialist screens use one source.
window.DCEquipmentAlerts=(()=>{
 const presets={
 personal:['today','calendar','equipment','notice','memo','device','weather','portal-links','favorites'],
 equipment:['equipment','assigned','deadline','recent','versions','docs','alarm-history','downtime','spares-life','lubrication','network'],
 inspection:['today','checklist','readings','safety','deadline','calendar','photos','handover','templates'],
 field:['today','assigned','handover','safety','quick','deadline','docs'],
 manager:['equipment','downtime','workorders','incident','reorder','annual-plan','notice','audit'],
 monitor:['equipment','alarm-history','iot','readings','network','deadline']
};
 const alerts={
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
 const readKey='dc-eq-widget-alerts-read-v1';
 const read=()=>{try{return JSON.parse(localStorage.getItem(readKey))||{}}catch{return {}}};
 const visible=(id,prefs={})=>{
   const a=alerts[id];if(!a||read()[id])return null;
   let count=0,mandatory=false;
   for(const item of a.items||[]){
     if(item.source==='admin'||item.source==='operations'){count+=item.count;mandatory=true}
     else if(prefs[id]!==false)count+=item.count;
   }
   return count>0?{...a,count,mandatory}:null;
 };
 const dashboardCount=(id)=>{
   let custom={},prefs={};
   const device=innerWidth<700?'mobile':innerWidth<1050?'tablet':'pc';
   try{custom=JSON.parse(localStorage.getItem('dc-eq-custom-dashboards-v1'))||{}}catch{}
   try{prefs=JSON.parse(localStorage.getItem('dc-eq-widget-notify:'+id+':'+device))||{}}catch{}
   return (custom[id]?.layout||presets[id]||[]).reduce((n,w)=>n+(visible(w,prefs)?.count||0),0);
 };
 return {presets,alerts,visible,dashboardCount,readKey};
})();
(()=> {
  const KEY='dc-eq-font-scale';
  const THEME_KEY='dc-eq-theme';
  const THEMES={
    'control-dark':'Control Dark',
    'industrial':'Industrial',
    'blueprint':'Blueprint',
    'neon':'Neon PRO'
  };
  const root=document.documentElement;
  const BASE_SCALE=1.12;
  const clamp=v=>Math.max(80,Math.min(150,Math.round(Number(v)||100)));
  const read=()=>{try{return clamp(localStorage.getItem(KEY)||100)}catch{return 100}};
  const readTheme=()=>{try{const t=localStorage.getItem(THEME_KEY)||'control-dark';return THEMES[t]?t:'control-dark'}catch{return 'control-dark'}};
  const applyTheme=t=>{
    const theme=THEMES[t]?t:'control-dark';
    root.dataset.eqTheme=theme;
    try{localStorage.setItem(THEME_KEY,theme)}catch{}
    const name=document.querySelector('#themeName');if(name)name.textContent=THEMES[theme];
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.classList.toggle('active',b.dataset.themeChoice===theme));
    return theme;
  };
  applyTheme(readTheme());
  const apply=value=>{
    const v=clamp(value);
    root.style.setProperty('--dc-font-scale',String(BASE_SCALE*(v/100)));
    root.dataset.dcFontScale=String(v);
    try{localStorage.setItem(KEY,String(v))}catch{}
    const range=document.querySelector('#fontScaleRange');
    const out=document.querySelector('#fontScaleValue');
    if(range)range.value=String(v);
    if(out)out.textContent=v+'%';
    document.querySelectorAll('[data-font-preset]').forEach(b=>b.classList.toggle('active',Number(b.dataset.fontPreset)===v));
    return v;
  };
  const ALERT_KEY='dc-eq-nav-alerts-read-v1';
  const navAlerts={
    equipment:{count:3,matches:['equipment','equipment.html']},
    inspection:{count:2,matches:['inspection','inspection.html']},
    calendar:{count:1,matches:['calendar','calendar.html']}
  };
  const readAlerts=()=>{try{return JSON.parse(localStorage.getItem(ALERT_KEY))||{}}catch{return {}}};
  const writeAlerts=v=>{try{localStorage.setItem(ALERT_KEY,JSON.stringify(v))}catch{}};
  const currentPath=()=>decodeURIComponent(location.pathname.split('/').filter(Boolean).pop()||'').toLowerCase();
  const markAlertRead=key=>{const read=readAlerts();read[key]=true;writeAlerts(read)};
  const markCurrentSectionRead=()=>{
    const p=currentPath(),read=readAlerts();
    for(const [key,meta] of Object.entries(navAlerts)){if(meta.matches.includes(p))read[key]=true}
    writeAlerts(read);
  };
  const decorateNavAlerts=()=>{
    const read=readAlerts();
    document.querySelectorAll('.nav a,.mobile-nav a').forEach(a=>{
      const href=a.getAttribute('href')||'';
      let key=null;
      if(href.includes('equipment.html'))key='equipment';
      else if(href.includes('inspection.html'))key='inspection';
      else if(href.includes('calendar.html'))key='calendar';
      if(!key)return;
      a.querySelectorAll('.nav-alert,.mobile-alert').forEach(x=>x.remove());
      a.classList.remove('has-alert');
      if(read[key])return;
      const meta=navAlerts[key];
      const badge=document.createElement('span');
      if(a.closest('.mobile-nav')){badge.className='mobile-alert'+(key==='calendar'?' subtle':'');badge.textContent=meta.count;a.classList.add('has-alert');a.insertBefore(badge,a.querySelector('br'))}
      else{badge.className='nav-alert'+(key==='calendar'?' subtle':'');badge.textContent=meta.count;a.appendChild(badge)}
      if(!a.dataset.alertClearBound){
        a.dataset.alertClearBound='1';
        a.addEventListener('click',()=>{markAlertRead(key);a.querySelectorAll('.nav-alert,.mobile-alert').forEach(x=>x.remove());a.classList.remove('has-alert')});
      }
    });
  };
  const ensureAppMenu=()=>{
    const top=document.querySelector('.topbar'); if(!top)return;
    if(document.querySelector('#appMenuToggle'))return;
    const wrap=document.createElement('div');wrap.className='app-menu-wrap';
    wrap.innerHTML='<button class="app-menu-toggle" id="appMenuToggle" type="button" aria-expanded="false" aria-controls="appMenu" aria-label="アプリメニュー"><span></span><span></span><span></span></button><div class="app-menu" id="appMenu" hidden><div class="app-menu-user"><strong>Preview User</strong><small>設備管理アカウント</small></div><a href="./dashboard.html">マイページ</a><a href="./settings.html">組織・設定</a><button type="button" id="languageMenu">言語 <span>日本語</span></button><div class="app-menu-theme"><div class="app-menu-theme-head"><strong>テーマ</strong><span id="themeName">Control Dark</span></div><div class="theme-grid"><button type="button" data-theme-choice="control-dark"><i></i><span>Control Dark</span></button><button type="button" data-theme-choice="industrial"><i></i><span>Industrial</span></button><button type="button" data-theme-choice="blueprint"><i></i><span>Blueprint</span></button><button type="button" data-theme-choice="neon"><i></i><span>Neon PRO</span></button></div></div><div class="app-menu-font"><div class="app-menu-font-head"><strong>文字・数字の大きさ</strong><output id="fontScaleValue">100%</output></div><div class="font-preset-row"><button type="button" data-font-preset="90">小さめ</button><button type="button" data-font-preset="100">標準</button><button type="button" data-font-preset="115">大きめ</button></div><div class="font-scale-row"><button type="button" id="fontScaleDown">−</button><input id="fontScaleRange" type="range" min="80" max="150" step="2" value="100"><button type="button" id="fontScaleUp">＋</button></div><button type="button" class="font-reset" id="fontScaleReset">100%に戻す</button></div><a href="../">電気コントロールへ戻る</a><div class="app-menu-sep"></div><button type="button" id="logoutMenu">ログアウト</button></div>';
    top.appendChild(wrap);
    const toggle=wrap.querySelector('#appMenuToggle'),menu=wrap.querySelector('#appMenu');
    const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false')};
    toggle.onclick=e=>{e.stopPropagation();const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open))};
    document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.app-menu-wrap'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    wrap.querySelector('#logoutMenu').onclick=()=>location.href='./login.html';
    wrap.querySelector('#languageMenu').onclick=()=>alert('Preview: 多言語設定は今後ここから切り替えます');
  };
  const DASHBOARD_CUSTOM_KEY='dc-eq-custom-dashboards-v1';
  const BUILTIN_DASHBOARDS=[
    ['personal','マイページ'],
    ['equipment','設備'],
    ['inspection','点検'],
    ['manager','管理者用'],
    ['monitor','大型モニタ']
  ];
  const readCustomDashboards=()=>{try{return JSON.parse(localStorage.getItem(DASHBOARD_CUSTOM_KEY))||{}}catch{return {}}};
  const ensureUnifiedSidebar=()=>{
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar)return;
    const nav=sidebar.querySelector('.nav');
    if(!nav)return;
    if(document.body.classList.contains('dashboard-page'))return;

    const current=(location.pathname.split('/').pop()||'').toLowerCase();
    const custom=readCustomDashboards();
    const dashboards=[
      ...BUILTIN_DASHBOARDS,
      ...Object.entries(custom).map(([id,v])=>[id,v?.title||'カスタム'])
    ];

    const dashboardLinks=dashboards.map(([id,label])=>{
      const href='./dashboard.html?view='+encodeURIComponent(id);
      const count=window.DCEquipmentAlerts.dashboardCount(id);
      const safeLabel=String(label).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      return '<a class="dashboard-nav-item" href="'+href+'"><span class="icon">◈</span><span>'+safeLabel+'</span>'+(count?'<span class="nav-alert">'+count+'</span>':'')+'</a>';
    }).join('');

    const appLinks=[
      ['equipment.html','▦','設備一覧'],
      ['inspection.html','✓','点検実行'],
      ['calendar.html','◫','カレンダー'],
      ['documents.html','▤','図面・取説'],
      ['settings.html','⚙','組織・設定']
    ].map(([href,icon,label])=>{
      const active=current===href?' active':'';
      return '<a class="'+active.trim()+'" href="./'+href+'"><span class="icon">'+icon+'</span>'+label+'</a>';
    }).join('');

    nav.className='nav dashboard-side-nav';
    nav.innerHTML=
      '<div class="nav-section-label">ダッシュボード</div>'+
      '<div class="dashboard-nav-list">'+dashboardLinks+'</div>'+
      '<a class="dashboard-nav-add" href="./dashboard.html?create=1"><span class="icon">＋</span>ダッシュボード追加</a>'+
      '<div class="nav-section-label nav-section-label-app">アプリ</div>'+
      appLinks+
      '<button data-open-widgets type="button"><span class="icon">＋</span>ウィジェット</button>';

    decorateNavAlerts();
  };
  const normalizeAppLinks=()=>{
    document.querySelectorAll('a[href="#"]').forEach(a=>{
      const t=a.textContent.trim();
      if(t.includes('カレンダー')||t.includes('予定'))a.setAttribute('href','./calendar.html');
    });
  };
  const initControls=()=>{
    ensureAppMenu();
    ensureUnifiedSidebar();
    normalizeAppLinks();
    markCurrentSectionRead();
    decorateNavAlerts();
    let currentTheme=applyTheme(readTheme());
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{currentTheme=applyTheme(b.dataset.themeChoice)}));
    let current=read(); apply(current);
    const range=document.querySelector('#fontScaleRange');
    range?.addEventListener('input',e=>{current=apply(e.target.value)});
    document.querySelector('#fontScaleDown')?.addEventListener('click',()=>{current=apply(current-2)});
    document.querySelector('#fontScaleUp')?.addEventListener('click',()=>{current=apply(current+2)});
    document.querySelector('#fontScaleReset')?.addEventListener('click',()=>{current=apply(100)});
    document.querySelectorAll('[data-font-preset]').forEach(b=>b.addEventListener('click',()=>{current=apply(b.dataset.fontPreset)}));
  };
  apply(read());
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initControls,{once:true});else initControls();
  window.addEventListener('pageshow',e=>{if(e.persisted){ensureUnifiedSidebar();markCurrentSectionRead();decorateNavAlerts()}});
  window.addEventListener('storage',e=>{if(e.key===KEY)apply(read());if(e.key===THEME_KEY)applyTheme(readTheme());if(e.key===window.DCEquipmentAlerts.readKey||e.key===DASHBOARD_CUSTOM_KEY||e.key?.startsWith('dc-eq-widget-notify:'))ensureUnifiedSidebar()});
})();
