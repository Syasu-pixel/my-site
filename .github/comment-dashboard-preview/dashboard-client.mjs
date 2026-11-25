const endpoint='/api/article-comments/moderation';
export function makeClient({getToken,fetcher=fetch}){
 async function run(url,request={}){
  const token=await getToken();
  if(!token)throw Object.assign(new Error('ログインしてください。'),{status:401});
  const r=await fetcher(url,{...request,redirect:'error',cache:'no-store',credentials:'same-origin',headers:{...request.headers,Authorization:'Bearer '+token}});
  if(!r.ok){
   const copy={401:'管理者アカウントでログインしてください。',403:'コメント管理の権限がありません。',409:'投稿が変更されました。一覧を更新してから確認してください。'};
   throw Object.assign(new Error(copy[r.status]??'コメント管理に接続できません。'),{status:r.status});
  }
  return r.json();
 }
 return {list:async state=>(await run(endpoint+'?state='+encodeURIComponent(state))).rows,apply:async op=>run(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(op)})};
}
export function mountDashboard({root,client,doc=document,articleTitle=()=>null}){
 const list=root.querySelector('[data-comments-list]'),status=root.querySelector('[data-comments-status]'),choose=root.querySelector('select'),refresh=root.querySelector('[data-comments-refresh]');
 const filter=root.querySelector('[data-comments-filter]'), heading=root.querySelector('[data-comments-heading]');
 let busy=false, state='pending', generation=0, rows=[], opened=null;
 const stateLabel=()=>state==='pending'?'承認待ち':'公開中';
 const titleFor=path=>articleTitle(path)||path.slice('/articles/'.length).replace(/\.html$/,'');
 const el=(tag,text)=>{const x=doc.createElement(tag); if(text)x.textContent=text;return x;};
 const button=(label,fn)=>{const b=el('button',label);b.type='button';b.addEventListener('click',fn);return b;};
 const controls=off=>{
  choose.disabled=off||Boolean(opened);refresh.disabled=off||Boolean(opened);
  if(filter)filter.disabled=off||Boolean(opened);
  for(const x of list.querySelectorAll('button'))x.disabled=off||Boolean(opened&&!opened.contains(x));
  list.setAttribute('aria-busy',String(off));
 };
 const openPanel=(card,panel,focus)=>{card.append(panel);opened=panel;controls(false);focus.focus();};
 const closePanel=(panel,trigger)=>{panel.remove();opened=null;controls(false);trigger.focus();};
 function render(notice){
  list.replaceChildren();if(heading)heading.textContent=stateLabel();
  const q=filter?.value?.normalize('NFKC').toLocaleLowerCase('ja').trim()??'';
  const matching=rows.filter(r=>!q||[titleFor(r.path),r.path,r.nickname,r.body].some(s=>s.normalize('NFKC').toLocaleLowerCase('ja').includes(q)));
  for(const row of matching){
   const card=el('article');card.className='comment-card';
   const article=el('h4'), link=el('a',titleFor(row.path));link.href=row.path;article.append(link);card.append(article);
   const info=el('p');info.className='comment-meta';
   const badge=el('span',row.state==='pending'?'承認待ち':'公開中');badge.className='comment-badge';info.append(badge,el('span',row.nickname),el('span',row.isReply?'返信':'コメント'));
   if(row.editedByOperator)info.append(el('span','運営が編集'));
   card.append(info);
   if(row.mayFeature){const hint=el('p','本文への匿名紹介：同意あり（掲載前に別途確認）');hint.className='comment-consent-note';card.append(hint);}
   const text=el('p',row.body);text.className='comment-text';card.append(text);
   const group=el('div');group.className='comment-actions';card.append(group);
   const confirmAction=(trigger,label,question,fn)=>{
    if(opened)return;
    const panel=el('div');panel.className='comment-confirm';
    const cancel=button('戻る',()=>closePanel(panel,trigger));
    panel.append(el('p',question),cancel,button(label,fn));openPanel(card,panel,cancel);
   };
   const reviewButton=(label,question,fn)=>{
    const trigger=button(label,()=>confirmAction(trigger,label,question,fn));return trigger;
   };
   const op=(action,data={})=>operate({action,path:row.path,id:row.id,...data});
   if(row.state==='pending'){
    const approve=reviewButton('承認して公開','このコメントが記事ページで全読者に表示されます。個人情報や危険な作業の案内が含まれていないか確認してください。',()=>op('approve',{rev:row.rev}));
    approve.className='comment-primary';
    group.append(approve,reviewButton('見送る','この版を見送りします。記事には表示されません。',()=>op('decline',{rev:row.rev})));
   }
   if(row.state==='published')group.append(reviewButton('非表示にする','この投稿を記事から非表示にします。親コメントの場合、返信も表示されなくなります。',()=>op('hide')));
   const edit=button('編集する',()=>{
    if(opened)return;
    const form=el('form');form.className='comment-edit';
    const l=el('label','ニックネーム'),name=el('input');name.maxLength=24;name.value=row.nickname;l.append(name);
    const t=el('label','コメント本文'),body=el('textarea');body.maxLength=500;body.required=true;body.value=row.body;t.append(body);
    const submit=el('button','編集内容を保存');submit.type='submit';
    form.append(l,t,submit,button('キャンセル',()=>closePanel(form,edit)));
    let composing=false;
    form.addEventListener('compositionstart',()=>{composing=true;});
    form.addEventListener('compositionend',()=>{composing=false;});
    form.addEventListener('submit',e=>{e.preventDefault();if(!composing&&!e.isComposing&&form.reportValidity())op('edit',{body:body.value,nickname:name.value});});
    openPanel(card,form,name);
   });group.append(edit);
   list.append(card);
  }
  const summary=matching.length?'表示 '+matching.length+'件'+(rows.length===50?'（取得上限50件）':''):q?'表示中の投稿に一致するものがありません。':stateLabel()+'のコメントはありません。';
  status.textContent=notice?notice+' '+summary:summary;
 }
 async function reload(notice,stamp){
  if(heading)heading.textContent=stateLabel();
  opened=null;rows=[];list.replaceChildren();status.textContent='一覧を取得中です。';
  const result=await client.list(state);
  if(stamp!==generation)return;
  if(!Array.isArray(result))throw new Error('一覧を取得できません。');
  rows=result;render(notice);
 }
 async function operate(action){
  if(busy)return;busy=true;controls(true);const stamp=generation;
  try{
   if(action){
    await client.apply(action);
    if(stamp!==generation)return;
    const labels={approve:'承認しました。',decline:'見送りました。',hide:'非表示にしました。',edit:'修正版を承認待ちに保存しました。'};
    try{await reload(labels[action.action],stamp);}
    catch{if(stamp===generation)status.textContent=labels[action.action]+' 一覧を更新できません。';}
   }else await reload(undefined,stamp);
  }catch(e){
   if(stamp!==generation)return;
   if(e.status===401||e.status===403||e.status===409){opened=null;rows=[];list.replaceChildren();}
   status.textContent=e.message;
  }finally{busy=false;controls(false);}
 }
 choose.addEventListener('change',()=>{state=choose.value;operate();});
 refresh.addEventListener('click',()=>operate());
 filter?.addEventListener('input',()=>{if(!busy&&!opened&&rows.length)render();});
 return {refresh:()=>{if(!opened)return operate();},clear:()=>{generation++;opened=null;rows=[];if(filter)filter.value='';list.replaceChildren();controls(busy);status.textContent='ログインしてください。';}};
}
