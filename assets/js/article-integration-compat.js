(() => {
 const header=document.querySelector('.dc-shell'),panel=document.getElementById('site-search-panel'),button=document.querySelector('.dc-toc-button');if(!header||!panel||!button)return;
 let frame=0;
 function place(){frame=0;if(!document.documentElement.classList.contains('dc-toc-compact')||panel.hidden)return;const p=panel.getBoundingClientRect(),b=button.getBoundingClientRect(),viewport=window.visualViewport;const bottom=Math.min(b.top-12,viewport?viewport.height+viewport.offsetTop-12:innerHeight-12);const value=Math.max(80,bottom-p.top)+'px';if(document.documentElement.style.getPropertyValue('--dc-integrated-search-height')!==value)document.documentElement.style.setProperty('--dc-integrated-search-height',value);}
 function schedule(){if(!frame)frame=requestAnimationFrame(place);}
 new MutationObserver(schedule).observe(header,{attributes:true,childList:true,subtree:true});new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 const observer=new ResizeObserver(schedule);observer.observe(header);observer.observe(button);window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.visualViewport?.addEventListener('resize',schedule,{passive:true});schedule();
})();

(() => {
 const images=[...document.querySelectorAll('.article-figure img')];
 if(!images.length)return;
 const isJa=(document.documentElement.lang||'').toLowerCase().startsWith('ja');
 const hintText=isJa?'画像をクリック／タップすると拡大表示できます':'Click or tap the image to enlarge.';
 const closeText=isJa?'拡大表示を閉じる':'Close enlarged image';
 const style=document.createElement('style');
 style.dataset.dcImageLightbox='';
 style.textContent=`
 .article-figure .dc-zoomable-image{cursor:zoom-in}
 .dc-image-zoom-hint{margin:8px 14px 12px!important;color:#5f7288;font-size:12px!important;line-height:1.6;text-align:center}
 .dc-image-lightbox{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:54px 18px 24px;background:rgba(4,10,18,.9);overflow:auto;overscroll-behavior:contain}
 .dc-image-lightbox[hidden]{display:none!important}
 .dc-image-lightbox__image{display:block;width:auto;height:auto;max-width:min(96vw,1800px);max-height:calc(100dvh - 82px);object-fit:contain;border-radius:10px;box-shadow:0 18px 60px rgba(0,0,0,.45);background:#fff;cursor:zoom-out}
 .dc-image-lightbox__close{position:fixed;top:max(12px,env(safe-area-inset-top));right:max(12px,env(safe-area-inset-right));z-index:1;display:grid;place-items:center;width:42px;height:42px;border:1px solid rgba(255,255,255,.55);border-radius:999px;background:rgba(15,23,42,.82);color:#fff;font:700 24px/1 system-ui,sans-serif;cursor:pointer}
 .dc-image-lightbox__close:focus-visible,.article-figure .dc-zoomable-image:focus-visible{outline:3px solid #60a5fa;outline-offset:3px}
 body.dc-image-lightbox-open{overflow:hidden}
 html[data-dc-theme=dark] .dc-image-zoom-hint{color:#c2ceda}
 @media (max-width:640px){.dc-image-lightbox{padding:48px 8px 14px}.dc-image-lightbox__image{max-width:98vw;max-height:calc(100dvh - 66px);border-radius:6px}}
 `;
 document.head.append(style);
 const overlay=document.createElement('div');
 overlay.className='dc-image-lightbox';
 overlay.hidden=true;
 overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label',isJa?'画像の拡大表示':'Enlarged image');
 overlay.innerHTML=`<button type="button" class="dc-image-lightbox__close" aria-label="${closeText}">×</button><img class="dc-image-lightbox__image" alt="">`;
 document.body.append(overlay);
 const closeButton=overlay.querySelector('.dc-image-lightbox__close');
 const enlarged=overlay.querySelector('.dc-image-lightbox__image');
 let lastFocus=null;
 function close(){if(overlay.hidden)return;overlay.hidden=true;document.body.classList.remove('dc-image-lightbox-open');enlarged.removeAttribute('src');if(lastFocus&&document.contains(lastFocus))lastFocus.focus();}
 function open(img){lastFocus=document.activeElement;enlarged.src=img.currentSrc||img.src;enlarged.alt=img.alt||'';overlay.hidden=false;document.body.classList.add('dc-image-lightbox-open');closeButton.focus({preventScroll:true});}
 closeButton.addEventListener('click',close);
 overlay.addEventListener('click',event=>{if(event.target===overlay)close();});
 enlarged.addEventListener('click',event=>event.stopPropagation());
 document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
 for(const img of images){
  if(img.dataset.dcLightboxReady==='true')continue;
  img.dataset.dcLightboxReady='true';
  img.classList.add('dc-zoomable-image');
  img.tabIndex=0;
  img.setAttribute('role','button');
  img.setAttribute('aria-label',`${img.alt||''}${img.alt?'。':''}${hintText}`);
  img.addEventListener('click',()=>open(img));
  img.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open(img);}});
  const figure=img.closest('.article-figure');
  if(figure&&!figure.querySelector('.dc-image-zoom-hint')){const hint=document.createElement('p');hint.className='dc-image-zoom-hint';hint.textContent=hintText;const caption=figure.querySelector('figcaption');if(caption)figure.insertBefore(hint,caption);else figure.append(hint);}
 }
})();

(() => {
 const selector='.table-wrap,.ladder-box,[data-horizontal-scroll]';
 const targets=[...document.querySelectorAll(selector)];
 if(!targets.length)return;
 const isJa=(document.documentElement.lang||'').toLowerCase().startsWith('ja');
 const text=isJa?'横にスクロールできます':'Scroll horizontally';
 const states=new WeakMap();
 let frame=0;

 function getState(target){
  let state=states.get(target);
  if(state)return state;
  const hint=document.createElement('p');
  hint.className='dc-horizontal-scroll-hint';
  hint.hidden=true;
  hint.setAttribute('role','status');
  hint.setAttribute('aria-live','polite');
  hint.innerHTML='<span class="dc-horizontal-scroll-hint__icon" aria-hidden="true">↔</span><span></span>';
  hint.querySelector('span:last-child').textContent=text;
  target.parentNode.insertBefore(hint,target);
  state={hint,used:false};
  states.set(target,state);
  target.addEventListener('scroll',()=>{
   if(target.scrollLeft<=0)return;
   state.used=true;
   state.hint.hidden=true;
  },{passive:true});
  return state;
 }

 function needsScroll(target){return target.scrollWidth>target.clientWidth+2;}

 function refresh(){
  frame=0;
  for(const target of targets){
   const state=getState(target);
   const needed=needsScroll(target);
   state.hint.hidden=!needed||state.used;
   state.hint.setAttribute('aria-hidden',state.hint.hidden?'true':'false');
  }
 }

 function schedule(){if(!frame)frame=requestAnimationFrame(refresh);}
 const observer=new ResizeObserver(schedule);
 for(const target of targets){observer.observe(target);for(const child of target.children)observer.observe(child);}
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('orientationchange',schedule,{passive:true});
 if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
 schedule();
})();

