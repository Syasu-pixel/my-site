(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .logout{display:none!important}
    .mobileTools{display:flex!important;gap:6px;margin-left:0;align-items:center}
    .mobileMenuWrap{display:block!important;position:relative}
    #openQueue,#openSide{display:none}
    .version{margin-left:auto!important;font-size:10px!important;opacity:.66!important;font-weight:700;letter-spacing:.02em;white-space:nowrap}
    .menuButton{border-radius:10px!important;background:rgba(255,255,255,.08)!important}
    @media(min-width:1061px){
      .attendance{display:grid!important;grid-template-columns:1fr!important;gap:0!important;border:1px solid #e1e7ef;border-radius:12px;background:#fbfcfe;padding:3px 9px}
      .member{display:grid!important;grid-template-columns:20px minmax(0,1fr) auto;align-items:center;gap:7px;min-width:0;padding:7px 2px!important;border:0!important;border-bottom:1px solid #edf1f5!important;border-radius:0!important;background:transparent!important}
      .member:last-child{border-bottom:0!important}
      .memberTop{display:contents!important}
      .memberIcon{font-size:14px!important;line-height:1}
      .memberName{font-size:10px!important;font-weight:800!important;color:#344156;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .memberRole{display:none!important}
      .memberStatus{margin:0!important;font-size:0!important;width:8px;height:8px;border-radius:999px;background:#a8b0bc;box-shadow:0 0 0 3px rgba(168,176,188,.12)}
      .memberStatus.ok{background:#2d8a5b;box-shadow:0 0 0 3px rgba(45,138,91,.12)}
      .memberStatus.bad{background:#c65353;box-shadow:0 0 0 3px rgba(198,83,83,.12)}
      .memberStatus.idle{background:#a8b0bc}
    }
    @media(max-width:760px){
      #openQueue,#openSide{display:inline-flex!important}
      .version{position:absolute!important;left:42px!important;bottom:4px!important;margin:0!important;font-size:9px!important}
    }
  `;
  document.head.appendChild(style);
  // Version text is owned only by connection-stability.js.
  // This visual helper must never overwrite the system build label.
  const attendance=document.querySelector('#attendance');
  const heading=attendance?.previousElementSibling;
  if(heading?.tagName==='H2')heading.textContent='👥 チーム稼働';
  const menu=document.querySelector('#mobileMenu');
  if(menu){const logout=document.querySelector('#mobileLogout');if(logout)logout.textContent='ログアウト'}
  const deltaFeed=document.createElement('script');deltaFeed.src='./feed-delta-client.js?v=0.7.10-feed1';document.body.appendChild(deltaFeed);
  const scrollFix=document.createElement('script');scrollFix.src='./scroll-position-lock.js?v=0.7.10-scroll3';document.body.appendChild(scrollFix);
  const builder=document.createElement('script');builder.src='./builder-autostart.js?v=0.7.10-builder2';document.body.appendChild(builder);
})();
