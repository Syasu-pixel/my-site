export function validPage(result,state,after=null){
return !(!Array.isArray(result?.rows)||result.rows.some(row=>!row||typeof row.id!=='string'||typeof row.path!=='string'||!/^\/articles\/[a-z0-9-]+\.html$/.test(row.path)||typeof row.body!=='string'||typeof row.nickname!=='string'||row.state!==state)||result.next&&(
    result.next===after||result.next!==result.rows.at(-1)?.id));
}
const COMMENT_API_ORIGIN='https://comments.denkicontrol.com';
function commentApiBase(origin){
 if(origin!==COMMENT_API_ORIGIN)throw new Error('コメントの接続先を確認できません。');
 return origin+'/api/article-comments/';
}
export function makeClient({getToken,fetcher=fetch,apiOrigin=''}){
 const endpoint=commentApiBase(apiOrigin)+'moderation';
 async function run(url,request={}){
  const token=await getToken();
  if(!token)throw Object.assign(new Error('ログインしてください。'),{status:401});
  const r=await fetcher(url,{...request,redirect:'error',cache:'no-store',credentials:'omit',headers:{...request.headers,Authorization:'Bearer '+token}});
  if(!r.ok){
   const copy={401:'管理者アカウントでログインしてください。',403:'コメント管理の権限がありません。',409:'投稿が変更されました。一覧を更新してから確認してください。'};
   throw Object.assign(new Error(copy[r.status]??'コメント管理に接続できません。'),{status:r.status});
  }
  return r.json();
 }
 const listPage=async(state,after=null)=>{
  const params=new URLSearchParams({state});if(after)params.set('after',after);
  return run(endpoint+'?'+params);
 };
 return {listPage,list:async state=>(await listPage(state)).rows,apply:async op=>run(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(op)})};
}
export function mountDashboard({root,client,doc=document,articleTitle=()=>null}){
 const list=root.querySelector('[data-comments-list]'),status=root.querySelector('[data-comments-status]'),choose=root.querySelector('select'),refresh=root.querySelector('[data-comments-refresh]');
 const filter=root.querySelector('[data-comments-filter]'), heading=root.querySelector('[data-comments-heading]');
 const reset=root.querySelector('[data-comments-reset]'),count=root.querySelector('[data-comments-count]');
 let busy=false, state='pending', generation=0, rows=[], next=null, opened=null, loaded=false;
 const stateLabel=()=>state==='pending'?'承認待ち':'公開中';
 const titleFor=path=>articleTitle(path)||path.slice('/articles/'.length).replace(/\.html$/,'');
 const el=(tag,text)=>{const x=doc.createElement(tag); if(text)x.textContent=text;return x;};
 const button=(label,fn)=>{const b=el('button',label);b.type='button';b.addEventListener('click',fn);return b;};
 const controls=off=>{
  choose.disabled=off||Boolean(opened);refresh.disabled=off||Boolean(opened);
  if(filter)filter.disabled=off||Boolean(opened);
  if(reset)reset.disabled=off||Boolean(opened);
  for(const x of list.querySelectorAll('button'))x.disabled=off||Boolean(opened&&!opened.contains(x));
  list.setAttribute('aria-busy',String(off));
 };
 const openPanel=(card,panel,focus)=>{card.append(panel);opened=panel;controls(false);focus.focus();};
 const closePanel=(panel,trigger)=>{panel.remove();opened=null;controls(false);trigger.focus();};
 function render(notice){
  loaded=true;
  list.replaceChildren();if(heading)heading.textContent=stateLabel();
  const q=filter?.value?.normalize('NFKC').toLocaleLowerCase('ja').trim()??'';
  const matching=rows.filter(r=>!q||[titleFor(r.path),r.path,r.nickname,r.body].some(s=>s.normalize('NFKC').toLocaleLowerCase('ja').includes(q)));
  if(reset)reset.hidden=!q;
  if(count){count.hidden=false;count.textContent=q?`${matching.length}件表示 / ${rows.length}件読み込み済み`:`${rows.length}件読み込み済み`;}
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
    panel.setAttribute('role','group');panel.setAttribute('aria-label',label+'の確認');
    const confirm=button(label,fn);if(label==='承認して公開')confirm.className='comment-primary';
    panel.append(el('p',question),cancel,confirm);
    panel.addEventListener('keydown',e=>{if(e.key==='Escape'&&!busy){e.preventDefault();closePanel(panel,trigger);}});
    openPanel(card,panel,cancel);
   };
   const reviewButton=(label,question,fn)=>{
    const trigger=button(label,()=>confirmAction(trigger,label,question,fn));return trigger;
   };
   const op=(action,data={})=>operate({action,path:row.path,id:row.id,rev:row.rev,...data});
   if(row.state==='pending'){
    const approve=reviewButton('承認して公開','このコメントが記事ページで全読者に表示されます。個人情報や危険な作業の案内が含まれていないか確認してください。',()=>op('approve',{rev:row.rev}));
    approve.className='comment-primary';
    if(row.parentUnavailable)group.append(el('p','親コメントが公開されていないため、この返信は承認できません。'));
    else group.append(approve);
    group.append(reviewButton('見送る','この版を見送りします。記事には表示されません。',()=>op('decline',{rev:row.rev})));
   }
   if(row.state==='published')group.append(reviewButton('非表示にする','この投稿を記事から非表示にします。親コメントの場合、返信も表示されなくなります。投稿の削除ではありません。',()=>op('hide')));
   const edit=button('編集する',()=>{
    if(opened)return;
    const form=el('form');form.className='comment-edit';
    const l=el('label','ニックネーム'),name=el('input');name.maxLength=24;name.value=row.nickname;l.append(name);
    const t=el('label','コメント本文'),body=el('textarea');body.maxLength=500;body.required=true;body.value=row.body;t.append(body);
    const submit=el('button','編集内容を保存');submit.type='submit';
    form.append(l,t,submit,button('キャンセル',()=>closePanel(form,edit)));
    let composing=false;
    form.addEventListener('keydown',e=>{if(e.key==='Escape'&&!busy&&!composing&&!e.isComposing){e.preventDefault();closePanel(form,edit);}});
    form.addEventListener('compositionstart',()=>{composing=true;});
    form.addEventListener('compositionend',()=>{composing=false;});
    form.addEventListener('submit',e=>{e.preventDefault();if(!composing&&!e.isComposing&&form.reportValidity())op('edit',{body:body.value,nickname:name.value});});
    openPanel(card,form,name);
   });if(!row.hasPendingEdit)group.append(edit);
   else card.append(el('p','修正版があります。編集する場合は承認待ち一覧で内容を確認してください。'));
   list.append(card);
  }
  if(next)list.append(button('さらに前のコメントを表示',()=>operate(null,true)));
  const summary=matching.length?'表示 '+matching.length+'件':q?'読み込んだ投稿に一致するものがありません。':stateLabel()+'のコメントはありません。';
  const scope=next?' 現在は'+rows.length+'件まで読み込み済みです。検索は読み込んだ投稿が対象です。':'';
  status.textContent=(notice?notice+' '+summary:summary)+scope;
 }
 async function reload(notice,stamp,append=false){
  if(heading)heading.textContent=stateLabel();
  const after=append?next:null;
  if(append&&!after)return;
  if(!append){opened=null;rows=[];next=null;loaded=false;list.replaceChildren();if(count)count.hidden=true;}
  status.textContent='一覧を取得中です。';
  const result=client.listPage?await client.listPage(state,after):{rows:await client.list(state),next:null};
  if(stamp!==generation)return;
  if(!validPage(result,state,after))throw new Error('一覧を取得できません。');
  const known=new Set(rows.map(row=>row.id));
  rows=[...rows,...result.rows.filter(row=>!known.has(row.id))];next=result.next??null;render(notice);
 }
 async function operate(action,append=false){
  if(busy)return;busy=true;controls(true);const stamp=generation;
  try{
   if(action){
    await client.apply(action);
    if(stamp!==generation)return;
    const labels={approve:'承認しました。',decline:'見送りました。',hide:'非表示にしました。',edit:'修正版を承認待ちに保存しました。'};
    try{await reload(labels[action.action],stamp);if(stamp===generation)heading?.focus();}
    catch{if(stamp===generation)status.textContent=labels[action.action]+' 一覧を更新できません。';}
   }else await reload(undefined,stamp,append);
  }catch(e){
   if(stamp!==generation)return;
   if(e.status===401||e.status===403||e.status===409){opened=null;rows=[];next=null;loaded=false;list.replaceChildren();if(count)count.hidden=true;if(reset)reset.hidden=true;}
   status.textContent=e.message;
  }finally{busy=false;controls(false);}
 }
 choose.addEventListener('change',()=>{state=choose.value;operate();});
 refresh.addEventListener('click',()=>operate());
 filter?.addEventListener('input',()=>{if(!busy&&!opened&&loaded)render();});
 reset?.addEventListener('click',()=>{if(busy||opened||!filter)return;filter.value='';render();filter.focus();});
 return {refresh:()=>{if(!opened)return operate();},clear:()=>{generation++;opened=null;rows=[];next=null;loaded=false;if(filter)filter.value='';if(count)count.hidden=true;if(reset)reset.hidden=true;list.replaceChildren();controls(busy);status.textContent='ログインしてください。';}};
}
