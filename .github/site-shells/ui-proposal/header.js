(() => {
  const header=document.querySelector('.dc-shell');if(!header)return;
  const pairs=['search','menu'].map(name=>({button:document.getElementById(`dc-${name}-toggle`),panel:document.getElementById(`dc-${name}-drawer`),name}));
  function close(pair,focus=false){pair.button.setAttribute('aria-expanded','false');pair.panel.hidden=true;if(focus)pair.button.focus();}
  for(const pair of pairs)pair.button.addEventListener('click',()=>{const open=pair.panel.hidden;pairs.forEach(p=>close(p));if(open){pair.panel.hidden=false;pair.button.setAttribute('aria-expanded','true');if(pair.name==='search')document.getElementById('site-search-input').focus();}});
  document.addEventListener('click',event=>{if(!header.contains(event.target))pairs.forEach(p=>close(p));});
  header.addEventListener('keydown',event=>{if(event.key==='Escape'){const open=pairs.find(p=>!p.panel.hidden);if(open){event.preventDefault();close(open,true);}}});
})();
