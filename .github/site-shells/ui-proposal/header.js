(() => {
  const header=document.querySelector('.dc-shell');if(!header)return;
  const root=document.documentElement,themeButton=document.getElementById('dc-theme-toggle'),themeKey='dc-theme';
  const themeMeta=document.querySelector('meta[name="theme-color"]'),lightThemeColor=themeMeta?.getAttribute('content')||null;
  const readTheme=()=>{try{return localStorage.getItem(themeKey)==='dark'?'dark':'light';}catch{return root.dataset.dcTheme==='dark'?'dark':'light';}};
  const applyTheme=(theme,persist=true)=>{
    const dark=theme==='dark';root.dataset.dcTheme=dark?'dark':'light';
    if(themeButton)themeButton.setAttribute('aria-checked',String(dark));
    if(themeMeta){if(dark)themeMeta.setAttribute('content','#0d1621');else if(lightThemeColor)themeMeta.setAttribute('content',lightThemeColor);else themeMeta.removeAttribute('content');}
    if(persist)try{localStorage.setItem(themeKey,dark?'dark':'light');}catch{}
  };
  applyTheme(root.dataset.dcTheme==='dark'?'dark':readTheme(),false);
  themeButton?.addEventListener('click',()=>applyTheme(root.dataset.dcTheme==='dark'?'light':'dark'));
  const pairs=['search','menu'].map(name=>({button:document.getElementById(`dc-${name}-toggle`),panel:document.getElementById(`dc-${name}-drawer`),name}));
  function close(pair,focus=false){pair.button.setAttribute('aria-expanded','false');pair.panel.hidden=true;if(focus)pair.button.focus();}
  for(const pair of pairs)pair.button.addEventListener('click',()=>{const open=pair.panel.hidden;pairs.forEach(p=>close(p));if(open){pair.panel.hidden=false;pair.button.setAttribute('aria-expanded','true');if(pair.name==='search')setTimeout(()=>{if(!pair.panel.hidden)document.getElementById('site-search-input').focus();},0);}});
  document.addEventListener('click',event=>{if(!header.contains(event.target))pairs.forEach(p=>close(p));});
  header.addEventListener('keydown',event=>{if(event.key==='Escape'){const open=pairs.find(p=>!p.panel.hidden);if(open){event.preventDefault();close(open,true);}}});
})();