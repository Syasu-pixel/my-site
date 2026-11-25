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
export function mountDashboard({root,client,doc=document}){
 const list=root.querySelector('[data-comments-list]'),status=root.querySelector('[data-comments-status]'),choose=root.querySelector('select'),refresh=root.querySelector('[data-comments-refresh]');
 let busy=false, state='pending', generation=0;
 const el=(tag,text)=>{const x=doc.createElement(tag); if(text)x.textContent=text;return x;};
 const button=(label,fn)=>{const b=el('button',label);b.type='button';b.addEventListener('click',fn);return b;};
 const controls=off=>{choose.disabled=off;refresh.disabled=off;for(const x of list.querySelectorAll('button'))x.disabled=off;list.setAttribute('aria-busy',String(off));};
 async function reload(notice,stamp){
  list.replaceChildren();
  const rows=await client.list(state);
  if(stamp!==generation)return;
  if(!Array.isArray(rows))throw new Error('一覧を取得できません。');
  for(const row of rows){
   const card=el('article');card.className='comment-card';
   card.append(el('h2',row.nickname),el('p',row.isReply?'返信':'コメント'));
   const path=el('a',row.path);path.href=row.path;card.append(path);
   if(row.editedByOperator)card.append(el('p','運営が編集'));
   if(row.mayFeature)card.append(el('p','本文への匿名紹介：同意あり（掲載前に別途確認）'));
   const text=el('p',row.body);text.className='comment-text';card.append(text);
   const group=el('div');group.className='comment-actions';card.append(group);
   const op=(action,data={})=>operate({action,path:row.path,id:row.id,...data});
   if(row.state==='pending')group.append(button('承認して公開',()=>op('approve',{rev:row.rev})),button('見送る',()=>op('decline',{rev:row.rev})));
   if(row.state==='published')group.append(button('非表示にする',()=>op('hide')));
   group.append(button('編集する',()=>{
    if(card.querySelector('form'))return;
    const form=el('form');form.className='comment-edit';
    const l=el('label','ニックネーム'),name=el('input');name.maxLength=24;name.value=row.nickname;l.append(name);
    const t=el('label','コメント本文'),body=el('textarea');body.maxLength=500;body.required=true;body.value=row.body;t.append(body);
    const submit=el('button','編集内容を保存');submit.type='submit';
    form.append(l,t,submit,button('キャンセル',()=>form.remove()));
    let composing=false;
    form.addEventListener('compositionstart',()=>{composing=true;});
    form.addEventListener('compositionend',()=>{composing=false;});
    form.addEventListener('submit',e=>{e.preventDefault();if(!composing&&!e.isComposing&&form.reportValidity())op('edit',{body:body.value,nickname:name.value});});
    card.append(form);name.focus();
   }));
   list.append(card);
  }
  status.textContent=notice??(rows.length?'表示中：'+rows.length+'件':state==='pending'?'承認待ちのコメントはありません。':'公開中のコメントはありません。');
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
   if(e.status===401||e.status===403||e.status===409)list.replaceChildren();
   status.textContent=e.message;
  }finally{busy=false;controls(false);}
 }
 choose.addEventListener('change',()=>{state=choose.value;operate();});
 refresh.addEventListener('click',()=>operate());
 return {refresh:()=>operate(),clear:()=>{generation++;list.replaceChildren();status.textContent='ログインしてください。';}};
}
