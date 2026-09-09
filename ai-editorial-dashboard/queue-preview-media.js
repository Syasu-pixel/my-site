(()=>{
  const MEDIA_TTL_MS=48*60*60*1000;
  const IMAGE_EXT=/\.(?:png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i;
  const IMAGE_PATH_RE=/(?:assets|images|uploads)\/[A-Za-z0-9_./%+\-]+?\.(?:png|jpe?g|webp|gif|avif)(?:[?#][^\s"'<>]*)?/gi;
  const style=document.createElement('style');
  style.textContent=`
    .queuePreviewPanel{margin:20px auto 4px;max-width:920px;background:#fff;border:1px solid #cfd9e7;border-radius:18px;padding:14px;box-shadow:0 2px 8px rgba(23,32,51,.06)}
    .queuePreviewHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.queuePreviewHead b{font-size:13px}.queuePreviewOpen{font-size:10px;font-weight:900;color:#304a9a;text-decoration:none;border:1px solid #cbd6e4;background:#f8faff;border-radius:9px;padding:7px 9px}.queuePreviewOpen:hover{background:#eef2ff}
    .queuePreviewFrame{width:100%;height:420px;border:1px solid #dce3ee;border-radius:13px;background:#f7f9fc}.queuePreviewMedia{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:10px}.queuePreviewMediaCard{min-width:0;border:1px solid #dce3ee;border-radius:12px;padding:7px;background:#f9fbff}.queuePreviewMediaCard.ogp{grid-column:span 2}.queuePreviewMediaCard img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;background:#edf1f6}.queuePreviewMediaCard.ogp img{aspect-ratio:1.91/1}.queuePreviewMediaLabel{display:flex;justify-content:space-between;gap:6px;margin-top:6px;font-size:9px;font-weight:800;color:#526176}.queuePreviewEmpty{font-size:10px;color:#7b879b;margin-top:8px}
    .queueMediaEvent{justify-content:center}.queueMediaEvent .queueMediaBubble{width:min(520px,88vw);background:#fff;border:1px solid #d7e0eb;border-radius:15px;padding:9px;box-shadow:0 1px 2px rgba(24,32,51,.07)}.queueMediaEventTitle{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;font-weight:900;color:#41506a;margin-bottom:7px}.queueMediaEventAge{font-size:9px;color:#7b879b;font-weight:700}.queueMediaThumb{display:block;width:100%;max-height:290px;object-fit:contain;border-radius:10px;background:#eef2f7}.queueMediaEventMeta{margin-top:6px;font-size:9px;color:#7b879b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .queueMediaLightbox{position:fixed;inset:0;z-index:100;background:rgba(17,24,39,.82);display:none;align-items:center;justify-content:center;padding:20px}.queueMediaLightbox.open{display:flex}.queueMediaLightbox img{max-width:min(1200px,95vw);max-height:90vh;border-radius:14px;background:#fff}.queueMediaLightbox button{position:absolute;top:16px;right:18px;border:0;border-radius:999px;width:38px;height:38px;background:#fff;color:#172033;font-size:22px;cursor:pointer}
    #artifacts.queuePreviewMoved{display:none!important}#artifacts.queuePreviewMoved+*{display:none!important}
    @media(max-width:760px){.queuePreviewPanel{margin:14px 0 2px;padding:10px}.queuePreviewFrame{height:320px}.queuePreviewMedia{grid-template-columns:1fr 1fr}.queuePreviewMediaCard.ogp{grid-column:1/-1}.queueMediaEvent .queueMediaBubble{width:92vw}.queueMediaThumb{max-height:230px}}
  `;
  document.head.appendChild(style);

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function feedRows(){try{return typeof rows!=='undefined'&&Array.isArray(rows)?rows:[]}catch{return[]}}
  function currentJob(){try{return typeof selectedJob!=='undefined'?String(selectedJob||''):''}catch{return''}}
  function grouped(){try{return typeof groupedJobs==='function'?groupedJobs():[]}catch{return[]}}
  function eventsForSelected(){const id=currentJob();if(!id)return[];const g=grouped().find(x=>String(x.id)===id);return g?.ev||feedRows().filter(r=>String(r.job_id||'')===id)}
  function allStrings(v,out=[],depth=0){if(depth>7||v==null)return out;if(typeof v==='string'){out.push(v);return out}if(Array.isArray(v)){v.forEach(x=>allStrings(x,out,depth+1));return out}if(typeof v==='object')Object.values(v).forEach(x=>allStrings(x,out,depth+1));return out}
  function absoluteUrls(v,out=new Set(),depth=0){if(depth>7||v==null)return out;if(typeof v==='string'){(v.match(/https:\/\/[^\s"'<>]+/g)||[]).forEach(u=>out.add(u.replace(/[),.;]+$/,'')));return out}if(Array.isArray(v)){v.forEach(x=>absoluteUrls(x,out,depth+1));return out}if(typeof v==='object')Object.values(v).forEach(x=>absoluteUrls(x,out,depth+1));return out}
  function previewUrl(){const urls=[...absoluteUrls(eventsForSelected())];return urls.find(u=>{try{const h=new URL(u).hostname.toLowerCase();return h==='denkicontrol-preview.pages.dev'||h.endsWith('.denkicontrol-preview.pages.dev')}catch{return false}})||''}
  function mediaLabel(url){const s=String(url).toLowerCase();if(s.includes('ogp'))return'OGP';if(s.includes('hero'))return'hero';if(s.includes('overview'))return'overview';if(s.includes('comparison'))return'comparison';if(s.includes('flow'))return'flow';return'生成画像'}
  function mediaItems(){
    const base=previewUrl();const found=[];const seen=new Set();
    for(const ev of eventsForSelected()){
      const createdAt=ev?.created_at||new Date().toISOString();
      for(const u of absoluteUrls(ev)){
        if(!IMAGE_EXT.test(u))continue;
        const key=u.split('#')[0];if(seen.has(key))continue;seen.add(key);found.push({url:u,label:mediaLabel(u),createdAt});
      }
      for(const text of allStrings(ev)){
        const matches=text.match(IMAGE_PATH_RE)||[];
        for(const p0 of matches){
          if(!base)continue;
          try{const clean=p0.replace(/^\/+/, '');const u=new URL('/'+clean,base).href;const key=u.split('#')[0];if(seen.has(key))continue;seen.add(key);found.push({url:u,label:mediaLabel(u),createdAt})}catch{}
        }
      }
    }
    return found.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
  }
  function ageText(date){const ms=Date.now()-new Date(date).getTime();if(!Number.isFinite(ms)||ms<0)return'生成直後';const h=Math.floor(ms/3600000);if(h<1)return'1時間以内';if(h<24)return`${h}時間前`;return`${Math.floor(h/24)}日前`}
  function ensureLightbox(){let box=document.querySelector('#queueMediaLightbox');if(box)return box;box=document.createElement('div');box.id='queueMediaLightbox';box.className='queueMediaLightbox';box.innerHTML='<button type="button" aria-label="閉じる">×</button><img alt="拡大プレビュー">';box.onclick=e=>{if(e.target===box||e.target.tagName==='BUTTON')box.classList.remove('open')};document.body.appendChild(box);return box}
  function openImage(url){const box=ensureLightbox();box.querySelector('img').src=url;box.classList.add('open')}
  function moveArtifactsOut(){const a=document.querySelector('#artifacts');if(!a)return;a.classList.add('queuePreviewMoved');const h=[...document.querySelectorAll('#sidePane h2')].find(x=>x.textContent.includes('この案件の成果物'));if(h)h.style.display='none'}
  function renderMediaEvents(root,items){
    root.querySelectorAll('.queueMediaEvent').forEach(x=>x.remove());
    const live=items.filter(x=>{const t=new Date(x.createdAt).getTime();return Number.isFinite(t)&&Date.now()-t<MEDIA_TTL_MS});
    for(const item of live){
      const wrap=document.createElement('div');wrap.className='msg system queueMediaEvent';
      wrap.innerHTML=`<div class="queueMediaBubble"><div class="queueMediaEventTitle"><span>🖼 ${esc(item.label)} を生成しました</span><span class="queueMediaEventAge">${esc(ageText(item.createdAt))}</span></div><img class="queueMediaThumb" loading="lazy" src="${esc(item.url)}" alt="${esc(item.label)} プレビュー"><div class="queueMediaEventMeta">クリックで拡大</div></div>`;
      wrap.querySelector('img').onclick=()=>openImage(item.url);root.appendChild(wrap);
    }
  }
  function renderFinalPreview(root,items){
    root.querySelectorAll('.queuePreviewPanel').forEach(x=>x.remove());
    const preview=previewUrl();if(!preview&&!items.length)return;
    const ogp=[...items].reverse().find(x=>x.label==='OGP');const hero=[...items].reverse().find(x=>x.label==='hero');const others=[...items].reverse().filter(x=>x!==ogp&&x!==hero).slice(0,4);
    const media=[ogp,hero,...others].filter(Boolean);
    const panel=document.createElement('section');panel.className='queuePreviewPanel';
    panel.innerHTML=`<div class="queuePreviewHead"><b>🔎 最終Preview</b>${preview?`<a class="queuePreviewOpen" href="${esc(preview)}" target="_blank" rel="noopener noreferrer">別タブで開く ↗</a>`:''}</div>${preview?`<iframe class="queuePreviewFrame" loading="lazy" src="${esc(preview)}" title="選択中案件のPreview"></iframe>`:'<div class="queuePreviewEmpty">Preview URLはまだ生成されていません。</div>'}${media.length?`<div class="queuePreviewMedia">${media.map(x=>`<div class="queuePreviewMediaCard ${x.label==='OGP'?'ogp':''}"><img loading="lazy" src="${esc(x.url)}" alt="${esc(x.label)}"><div class="queuePreviewMediaLabel"><span>${esc(x.label)}</span><span>${esc(ageText(x.createdAt))}</span></div></div>`).join('')}</div>`:'<div class="queuePreviewEmpty">OGP / hero / 本文画像は、生成ログに画像URLまたは画像パスが記録されるとここに表示されます。</div>'}`;
    panel.querySelectorAll('.queuePreviewMediaCard img').forEach((img,i)=>img.onclick=()=>openImage(media[i].url));root.appendChild(panel);
  }
  let lastSignature='';
  function renderEnhancements(){
    moveArtifactsOut();const root=document.querySelector('#events');const id=currentJob();if(!root||!id||id==='__home__')return;
    const items=mediaItems();const sig=JSON.stringify([id,previewUrl(),items.map(x=>[x.url,x.createdAt])]);
    if(sig===lastSignature&&root.querySelector('.queuePreviewPanel'))return;lastSignature=sig;
    renderMediaEvents(root,items);renderFinalPreview(root,items);
  }
  const events=document.querySelector('#events');if(events)new MutationObserver(()=>requestAnimationFrame(renderEnhancements)).observe(events,{childList:true});
  setTimeout(renderEnhancements,500);setInterval(renderEnhancements,5000);setInterval(()=>{lastSignature='';renderEnhancements()},60000);
})();