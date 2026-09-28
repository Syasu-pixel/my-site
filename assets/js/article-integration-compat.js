(() => {
 const header=document.querySelector('.dc-shell'),panel=document.getElementById('site-search-panel'),button=document.querySelector('.dc-toc-button');if(!header||!panel||!button)return;
 let frame=0;
 function place(){frame=0;if(!document.documentElement.classList.contains('dc-toc-compact')||panel.hidden)return;const p=panel.getBoundingClientRect(),b=button.getBoundingClientRect(),viewport=window.visualViewport;const bottom=Math.min(b.top-12,viewport?viewport.height+viewport.offsetTop-12:innerHeight-12);const value=Math.max(80,bottom-p.top)+'px';if(document.documentElement.style.getPropertyValue('--dc-integrated-search-height')!==value)document.documentElement.style.setProperty('--dc-integrated-search-height',value);}
 function schedule(){if(!frame)frame=requestAnimationFrame(place);}
 new MutationObserver(schedule).observe(header,{attributes:true,childList:true,subtree:true});new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 const observer=new ResizeObserver(schedule);observer.observe(header);observer.observe(button);window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.visualViewport?.addEventListener('resize',schedule,{passive:true});schedule();
})();
