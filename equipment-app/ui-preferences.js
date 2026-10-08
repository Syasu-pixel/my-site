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
  const initControls=()=>{
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