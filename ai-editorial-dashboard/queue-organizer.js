(()=>{
  const STALE_MS=24*60*60*1000;
  const terminal=new Set(['COMPLETED','CANCELLED','CLOSED','PUBLISHED','MERGED','DONE']);
  const attention=new Set(['FAILED','ESCALATED','ERROR']);
  const human=new Set(['HUMAN_GATE','NEEDS_HUMAN']);
  const style=document.createElement('style');
  style.textContent=`.queueBuckets{display:grid;gap:10px}.queueBucket{border-top:1px solid #e4e9f1;padding-top:8px}.queueBucket:first-child{border-top:0;padding-top:0}.queueBucketTitle{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:800;color:#596579;margin:2px 2px 6px}.queueBucketCount{font-size:9px;background:#edf1f6;border-radius:999px;padding:2px 6px}.queueBucketDone>summary{cursor:pointer;list-style:none}.queueBucketDone>summary::-webkit-details-marker{display:none}.job.stale{border-color:#d8a64a;background:#fff9e9}.job.stale .state{color:#a36b00}.queueStale{font-size:9px;font-weight:800;color:#a36b00;margin-left:5px}@media(max-width:760px){.queueBuckets{gap:8px}.queueBucketTitle{font-size:10px}.queueBucketDone .job{opacity:.88}}`;
  document.head.appendChild(style);

  function lastFor(id){
    if(!Array.isArray(window.rows))return null;
    return window.rows.filter(r=>String(r.job_id||'')===id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0]||null;
  }
  function bucketFor(row){
    const state=String(row?.state||'').toUpperCase();
    if(human.has(state))return 'human';
    if(attention.has(state))return 'attention';
    if(terminal.has(state))return 'done';
    const age=Date.now()-new Date(row?.created_at||0).getTime();
    if(Number.isFinite(age)&&age>STALE_MS)return 'attention';
    return 'active';
  }
  function section(title,key,count){
    const wrap=document.createElement('section');wrap.className='queueBucket queueBucket-'+key;
    const h=document.createElement('div');h.className='queueBucketTitle';h.innerHTML=`<span>${title}</span><span class="queueBucketCount">${count}</span>`;wrap.appendChild(h);return wrap;
  }
  function organize(){
    const root=document.querySelector('#jobs');if(!root||root.dataset.organizing==='1')return;
    const jobs=[...root.querySelectorAll(':scope > .job')];if(!jobs.length)return;
    root.dataset.organizing='1';
    const groups={active:[],human:[],attention:[],done:[]};
    for(const el of jobs){
      const row=lastFor(String(el.dataset.job||''));const key=bucketFor(row);groups[key].push(el);
      if(key==='attention'&&!attention.has(String(row?.state||'').toUpperCase())){el.classList.add('stale');const st=el.querySelector('.state');if(st&&!st.querySelector('.queueStale'))st.insertAdjacentHTML('beforeend','<span class="queueStale">⏸ 24時間以上更新なし</span>')}
    }
    root.textContent='';const holder=document.createElement('div');holder.className='queueBuckets';
    const defs=[['進行中','active'],['管理者確認','human'],['要確認','attention']];
    for(const [title,key] of defs){if(!groups[key].length)continue;const s=section(title,key,groups[key].length);groups[key].forEach(x=>s.appendChild(x));holder.appendChild(s)}
    if(groups.done.length){const d=document.createElement('details');d.className='queueBucket queueBucketDone';const sum=document.createElement('summary');sum.className='queueBucketTitle';sum.innerHTML=`<span>完了済み</span><span class="queueBucketCount">${groups.done.length}</span>`;d.appendChild(sum);groups.done.forEach(x=>d.appendChild(x));holder.appendChild(d)}
    root.appendChild(holder);delete root.dataset.organizing;
  }
  const root=document.querySelector('#jobs');if(root)new MutationObserver(()=>requestAnimationFrame(organize)).observe(root,{childList:true});
  setTimeout(organize,400);setInterval(organize,3000);
})();
