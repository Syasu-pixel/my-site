(()=>{
  const STALE_MS=24*60*60*1000;
  const terminal=new Set(['COMPLETED','CANCELLED','CLOSED','REJECTED','PUBLISHED','MERGED','DONE']);
  const attention=new Set(['FAILED','ESCALATED','ERROR']);
  const human=new Set(['HUMAN_GATE','NEEDS_HUMAN']);
  const style=document.createElement('style');
  style.textContent=`.queueBuckets{display:grid;gap:10px}.queueBucket{border-top:1px solid #e4e9f1;padding-top:8px}.queueBucket:first-child{border-top:0;padding-top:0}.queueBucketTitle{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:800;color:#596579;margin:2px 2px 6px}.queueBucketCount{font-size:9px;background:#edf1f6;border-radius:999px;padding:2px 6px}.queueBucketDone>summary{cursor:pointer;list-style:none}.queueBucketDone>summary::-webkit-details-marker{display:none}.job.stale{border-color:#d8a64a;background:#fff9e9}.job.stale .state{color:#a36b00}.queueStale{font-size:9px;font-weight:800;color:#a36b00;margin-left:5px}.queueDeliverable{margin-top:8px;padding-top:7px;border-top:1px solid #e4e9f1;display:flex;align-items:center;gap:6px;min-width:0}.queueDeliverableStatus{font-size:9px;font-weight:800;color:#697386;white-space:nowrap}.queueDeliverableStatus.ready{color:#25744a}.queueDeliverableStatus.waiting{color:#8a6a18}.queueDeliverableLink{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px;font-weight:800;color:#304a9a;text-decoration:none}.queueDeliverableLink:hover{text-decoration:underline}.weeklyRoutine{grid-column:1/-1}.weeklyRoutineHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 3px 6px;font-size:11px;font-weight:800;color:#526176}.weeklyRoutineHint{font-size:9px;font-weight:600;color:#7b879b}.weeklyButtons{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.weeklyButton{border:1px solid #d6deea;background:#f8faff;color:#3e4b60;border-radius:10px;padding:7px 4px;font-size:10px;font-weight:800;cursor:pointer;line-height:1.25}.weeklyButton:hover{background:#eef2ff;border-color:#9eadef}.weeklyButton.today{background:#172033;color:#fff;border-color:#172033}.weeklyButton.selected{box-shadow:0 0 0 2px rgba(93,120,255,.18);border-color:#5d78ff}.weeklyButton span{display:block;font-size:8px;font-weight:600;opacity:.78;margin-top:2px}.stallRecovery{display:none!important}@media(max-width:760px){.queueBuckets{gap:8px}.queueBucketTitle{font-size:10px}.queueBucketDone .job{opacity:.88}.weeklyButtons{grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.weeklyButton{padding:6px 3px;font-size:9px}.weeklyRoutineHead{font-size:10px}}`;
  document.head.appendChild(style);
  function feedRows(){try{return typeof rows!=='undefined'&&Array.isArray(rows)?rows:[]}catch(_){return []}}
  function rootPolicy(id){const exact=feedRows().filter(r=>String(r.job_id||'')===id);for(const r of exact){const d=r&&r.discussion&&typeof r.discussion==='object'?r.discussion:null;if(!d)continue;const count=Number(d.deliverable_count??d.requested_count??0);if(d.queue_policy==='one-deliverable-one-queue'||count>0)return{count:Number.isFinite(count)&&count>0?count:1,queuePolicy:d.queue_policy||''}}return null}
  function eventsFor(id){const p=rootPolicy(id);return feedRows().filter(r=>{const job=String(r.job_id||'');if(job===id)return true;if(p&&p.count===1){const m=job.match(/^(command-[0-9a-f-]{36})-(\d{2})$/i);return Boolean(m&&m[1]===id)}return false}).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at))}
  function lastFor(id){const ev=eventsFor(id);return ev[ev.length-1]||null}

  const originalGroupedJobs=typeof window.groupedJobs==='function'?window.groupedJobs:null;
  if(originalGroupedJobs){
    window.groupedJobs=function(){
      const groups=originalGroupedJobs();
      const byId=new Map(groups.map(g=>[String(g.id),g]));
      const handled=new Set();
      const out=[];
      for(const g of groups){
        const id=String(g.id);
        if(handled.has(id))continue;
        const rootMatch=id.match(/^command-[0-9a-f-]{36}$/i);
        if(rootMatch){
          const policy=rootPolicy(id);
          const children=groups.filter(x=>new RegExp('^'+id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'-\\d{2}$','i').test(String(x.id)));
          if(policy&&policy.count===1){
            const ev=[...(g.ev||[])];
            handled.add(id);
            for(const child of children){ev.push(...(child.ev||[]));handled.add(String(child.id))}
            ev.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
            out.push({id,ev,first:g.first||ev[0],last:ev[ev.length-1]||g.last});
            continue;
          }
          if(policy&&policy.count>1&&children.length){
            handled.add(id);
            for(const child of children){
              handled.add(String(child.id));
              const ev=[...(g.ev||[]),...(child.ev||[])].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
              out.push({id:String(child.id),ev,first:child.first||child.ev?.[0]||g.first,last:ev[ev.length-1]||child.last});
            }
            continue;
          }
        }
        const childMatch=id.match(/^(command-[0-9a-f-]{36})-(\d{2})$/i);
        if(childMatch){
          const parent=byId.get(childMatch[1]);
          const policy=parent?rootPolicy(childMatch[1]):null;
          if(parent&&policy&&policy.count===1)continue;
        }
        handled.add(id);out.push(g);
      }
      return out.sort((a,b)=>new Date(b.last?.created_at||0)-new Date(a.last?.created_at||0));
    };
    setTimeout(()=>{try{if(typeof render==='function')render()}catch(e){console.warn('[AI編集部] queue regroup failed',e)}},0);
  }

  function collectUrls(value,out=new Set(),depth=0){if(depth>5||value==null)return out;if(typeof value==='string'){(value.match(/https:\/\/[^\s"'<>]+/g)||[]).forEach(u=>out.add(u.replace(/[),.;]+$/,'')));return out}if(Array.isArray(value)){value.forEach(v=>collectUrls(v,out,depth+1));return out}if(typeof value==='object')Object.values(value).forEach(v=>collectUrls(v,out,depth+1));return out}
  function artifactUrl(id){const urls=[...collectUrls(eventsFor(id))].filter(u=>{try{const x=new URL(u);return x.protocol==='https:'&&(x.hostname.includes('netlify')||x.hostname==='denkicontrol-preview.pages.dev'||x.hostname.endsWith('.denkicontrol-preview.pages.dev')||x.hostname==='denkicontrol.com'||(x.hostname==='github.com'&&x.pathname.includes('/pull/')))}catch{return false}});return urls.find(u=>{try{const h=new URL(u).hostname;return h==='denkicontrol-preview.pages.dev'||h.endsWith('.denkicontrol-preview.pages.dev')}catch{return false}})||urls.find(u=>{try{return new URL(u).hostname.includes('netlify')}catch{return false}})||urls.find(u=>{try{return new URL(u).hostname==='denkicontrol.com'}catch{return false}})||urls[0]||''}
  function decorateDeliverable(el,id){let box=el.querySelector('.queueDeliverable');if(!box){box=document.createElement('div');box.className='queueDeliverable';el.appendChild(box)}const url=artifactUrl(id);if(url){let label='成果物URL';try{const h=new URL(url).hostname;if(h.includes('netlify')||h==='denkicontrol-preview.pages.dev'||h.endsWith('.denkicontrol-preview.pages.dev'))label='Preview';else if(h==='denkicontrol.com')label='公開URL';else if(h==='github.com')label='PR'}catch{}box.innerHTML=`<span class="queueDeliverableStatus ready">✓ ${label}</span><a class="queueDeliverableLink" href="${url.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" target="_blank" rel="noopener noreferrer">開く ↗</a>`}else{box.innerHTML='<span class="queueDeliverableStatus waiting">成果物URL：未生成</span>'}}
  function bucketFor(row){const state=String(row?.state||'').toUpperCase();if(human.has(state))return'human';if(attention.has(state))return'attention';if(terminal.has(state))return'done';if(!row)return'active';const age=Date.now()-new Date(row.created_at).getTime();if(Number.isFinite(age)&&age>STALE_MS)return'attention';return'active'}
  function section(title,key,count){const wrap=document.createElement('section');wrap.className='queueBucket queueBucket-'+key;const h=document.createElement('div');h.className='queueBucketTitle';h.innerHTML=`<span>${title}</span><span class="queueBucketCount">${count}</span>`;wrap.appendChild(h);return wrap}
  function organize(){const root=document.querySelector('#jobs');if(!root||root.dataset.organizing==='1')return;const jobs=[...root.querySelectorAll(':scope > .job')];if(!jobs.length)return;root.dataset.organizing='1';const groups={active:[],human:[],attention:[],done:[]};for(const el of jobs){const id=String(el.dataset.job||'');const row=lastFor(id);decorateDeliverable(el,id);const key=bucketFor(row);groups[key].push(el);if(key==='attention'&&row&&!attention.has(String(row.state||'').toUpperCase())){el.classList.add('stale');const st=el.querySelector('.state');if(st&&!st.querySelector('.queueStale'))st.insertAdjacentHTML('beforeend','<span class="queueStale">⏸ 24時間以上更新なし</span>')}}root.textContent='';const holder=document.createElement('div');holder.className='queueBuckets';const defs=[['進行中','active'],['管理者確認','human'],['要確認','attention']];for(const[title,key]of defs){if(!groups[key].length)continue;const s=section(title,key,groups[key].length);groups[key].forEach(x=>s.appendChild(x));holder.appendChild(s)}if(groups.done.length){const d=document.createElement('details');d.className='queueBucket queueBucketDone';const sum=document.createElement('summary');sum.className='queueBucketTitle';sum.innerHTML=`<span>完了済み</span><span class="queueBucketCount">${groups.done.length}</span>`;d.appendChild(sum);groups.done.forEach(x=>d.appendChild(x));holder.appendChild(d)}root.appendChild(holder);delete root.dataset.organizing}
  const root=document.querySelector('#jobs');if(root)new MutationObserver(()=>requestAnimationFrame(organize)).observe(root,{childList:true});setTimeout(organize,400);setInterval(organize,3000);

  // v0.7.0: browser-side supervisor/auto-resume removed.
  // Queue policy: one deliverable = one queue. Retries stay in the same queue.
  // ChatGPT is the working editor-in-chief; Supabase remains the control plane.

  const routines=[
    {day:1,label:'月',short:'調査・企画',text:'月曜の定例を開始。サイト全体・既存記事・カテゴリ・検索状況を確認し、今週優先すべき新記事候補、更新候補、内部リンクの不足を調査してください。メーカー公式の最新資料を優先し、効果と重要度で順位付けしてください。今回は調査・企画を成果物としてまとめ、見つけた候補から新しい制作案件を自動生成しないでください。実制作は管理者が別途指示した件数だけ案件化してください。'},
    {day:2,label:'火',short:'新記事',text:'火曜の新記事制作を開始。調査済み候補と現在のサイト構成から、管理者が指定した件数の新記事を制作してください。件数指定がない場合は1記事のみ制作してください。公式資料確認から記事制作、必要画像、技術確認、Gemini検証、最終監査、GitHub PR、Cloudflare Pages Previewまで既定ルールで進め、管理者確認が必要な段階ではPreviewを提示して停止してください。1記事につき1案件キューとし、修正・再試行で新しい案件を生成しないでください。'},
    {day:3,label:'水',short:'記事改善',text:'水曜の既存記事改善を開始。既存記事から技術情報の古さ、説明不足、検索意図とのずれ、初心者が理解しにくい箇所を調査し、管理者が指定した件数を改善してください。件数指定がない場合は優先度が最も高い1件を対象にしてください。機種固有情報は最新のメーカー公式資料で再確認し、意味が変わる修正は既定のPreview承認フローに従ってください。修正・再試行は同じ案件内で行ってください。'},
    {day:4,label:'木',short:'導線',text:'木曜の導線改善を開始。トップ、カテゴリ、関連記事、記事間の学習順序、必要な言語導線を監査し、孤立記事や不足している内部リンクを改善してください。読者が次に読むべき内容へ自然に進めることを優先し、不要なSEO目的リンクは追加しないでください。今回の導線改善は1案件として扱い、修正箇所ごとに新しい案件を生成しないでください。'},
    {day:5,label:'金',short:'SEO',text:'金曜のSEO・検索確認を開始。Search Consoleなど確認可能な実データを使い、表示回数、クリック、掲載順位、インデックス状態、伸びているページと改善候補を確認してください。根拠のある改善だけを整理し、公開済みURLの未インデックスや異常も確認してください。今回は分析結果を成果物としてまとめ、見つけた改善候補から新しい制作・改修案件を自動生成しないでください。'},
    {day:6,label:'土',short:'UX・画像',text:'土曜のUX・画像品質確認を開始。スマートフォン表示を重視し、読みやすさ、図解、画像、カード、ナビゲーション、レイアウト崩れを監査してください。改善効果の高い箇所を優先し、技術図解を変更する場合は記事本文と公式資料との整合性も再監査してください。今回のUX監査は1案件として扱い、修正・再試行や発見箇所ごとに新しい案件を生成しないでください。'},
    {day:0,label:'日',short:'週次監査',text:'日曜の週次監査を開始。今週の完了・未完了・管理者確認待ち・停滞案件・公開後の検索追跡状態を整理し、ルール違反や取りこぼしがないか監査してください。未解決事項を重要度順にまとめ、次週月曜の調査・企画へ引き継いでください。引継ぎ項目から新しい案件を自動生成しないでください。'}
  ];
  function setupWeeklyRoutine(){const form=document.querySelector('#commandForm'),input=document.querySelector('#commandInput');if(!form||!input||form.querySelector('.weeklyRoutine'))return false;input.placeholder='やってほしいことを入力。曜日テンプレートから選ぶこともできます。';input.setAttribute('aria-label','編集部に今日の仕事を伝える');const wrap=document.createElement('div');wrap.className='weeklyRoutine';wrap.innerHTML='<div class="weeklyRoutineHead"><span>📅 編集部に今日の仕事を伝える</span><span class="weeklyRoutineHint">曜日テンプレートを選択 → 内容確認 → 実行</span></div><div class="weeklyButtons"></div>';const buttons=wrap.querySelector('.weeklyButtons'),today=new Date().getDay();for(const r of routines){const b=document.createElement('button');b.type='button';b.className='weeklyButton'+(r.day===today?' today':'');b.innerHTML=`${r.label}<span>${r.short}</span>`;b.title=`${r.label}曜日：${r.short}`;b.addEventListener('click',()=>{if(input.value.trim()&&!confirm('入力中の内容を曜日テンプレートに置き換えますか？'))return;input.value=r.text;input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();buttons.querySelectorAll('.weeklyButton').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});buttons.appendChild(b)}form.prepend(wrap);return true}
  if(!setupWeeklyRoutine()){let tries=0;const timer=setInterval(()=>{tries++;if(setupWeeklyRoutine()||tries>20)clearInterval(timer)},250)}
  import('./queue-preview-media.js?v=0.7.15').catch(e=>console.warn('[AI編集部] queue preview media load failed',e));
})();