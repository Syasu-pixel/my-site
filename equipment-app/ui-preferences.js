(()=> {
  const KEY='dc-eq-font-scale';
  const root=document.documentElement;
  const BASE_SCALE=1.12;
  const clamp=v=>Math.max(80,Math.min(150,Math.round(Number(v)||100)));
  const read=()=>{try{return clamp(localStorage.getItem(KEY)||100)}catch{return 100}};
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
  const navAlerts={equipment:{count:3,match:'equipment.html'},inspection:{count:2,match:'inspection.html'},calendar:{count:1,match:'calendar.html'}};
  const readAlerts=()=>{try{return JSON.parse(localStorage.getItem(ALERT_KEY))||{}}catch{return {}}};
  const writeAlerts=v=>{try{localStorage.setItem(ALERT_KEY,JSON.stringify(v))}catch{}};
  const currentPath=()=>location.pathname.split('/').pop()||'';
  const markCurrentSectionRead=()=>{
    const p=currentPath(),read=readAlerts();
    for(const [key,meta] of Object.entries(navAlerts)){if(p===meta.match)read[key]=true}
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
      a.querySelectorAll('.nav-alert,.mobile-alert').forEach(x=>x.remove());
      if(!key||read[key])return;
      const meta=navAlerts[key];
      const badge=document.createElement('span');
      if(a.closest('.mobile-nav')){badge.className='mobile-alert'+(key==='calendar'?' subtle':'');badge.textContent=meta.count;a.classList.add('has-alert');a.insertBefore(badge,a.querySelector('br'))}
      else{badge.className='nav-alert'+(key==='calendar'?' subtle':'');badge.textContent=meta.count;a.appendChild(badge)}
    });
  };
  const ensureAppMenu=()=>{
    const top=document.querySelector('.topbar'); if(!top)return;
    if(document.querySelector('#appMenuToggle'))return;
    const wrap=document.createElement('div');wrap.className='app-menu-wrap';
    wrap.innerHTML='<button class="app-menu-toggle" id="appMenuToggle" type="button" aria-expanded="false" aria-controls="appMenu" aria-label="アプリメニュー"><span></span><span></span><span></span></button><div class="app-menu" id="appMenu" hidden><div class="app-menu-user"><strong>Preview User</strong><small>設備管理アカウント</small></div><a href="./dashboard.html">マイページ</a><a href="./settings.html">組織・設定</a><button type="button" id="languageMenu">言語 <span>日本語</span></button><div class="app-menu-font"><div class="app-menu-font-head"><strong>文字・数字の大きさ</strong><output id="fontScaleValue">100%</output></div><div class="font-preset-row"><button type="button" data-font-preset="90">小さめ</button><button type="button" data-font-preset="100">標準</button><button type="button" data-font-preset="115">大きめ</button></div><div class="font-scale-row"><button type="button" id="fontScaleDown">−</button><input id="fontScaleRange" type="range" min="80" max="150" step="2" value="100"><button type="button" id="fontScaleUp">＋</button></div><button type="button" class="font-reset" id="fontScaleReset">100%に戻す</button></div><a href="../">電気コントロールへ戻る</a><div class="app-menu-sep"></div><button type="button" id="logoutMenu">ログアウト</button></div>';
    top.appendChild(wrap);
    const toggle=wrap.querySelector('#appMenuToggle'),menu=wrap.querySelector('#appMenu');
    const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false')};
    toggle.onclick=e=>{e.stopPropagation();const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open))};
    document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.app-menu-wrap'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    wrap.querySelector('#logoutMenu').onclick=()=>location.href='./login.html';
    wrap.querySelector('#languageMenu').onclick=()=>alert('Preview: 多言語設定は今後ここから切り替えます');
  };
  const normalizeAppLinks=()=>{
    document.querySelectorAll('a[href="#"]').forEach(a=>{
      const t=a.textContent.trim();
      if(t.includes('カレンダー')||t.includes('予定'))a.setAttribute('href','./calendar.html');
    });
  };
  const initControls=()=>{
    ensureAppMenu();
    normalizeAppLinks();
    markCurrentSectionRead();
    decorateNavAlerts();
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
  window.addEventListener('storage',e=>{if(e.key===KEY)apply(read())});
})();