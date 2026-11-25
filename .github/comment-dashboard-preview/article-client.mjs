// Reader transport, mounted only on a registered Japanese article page.
export function makeArticleClient({path,fetcher=fetch,newId=()=>crypto.randomUUID()}){
 if(!/^\/articles\/[a-z0-9-]+\.html$/.test(path))throw new Error('対象外の記事です。');
 const url=name=>'/api/article-comments/'+name+'?article='+encodeURIComponent(path);
 async function request(name,body){
  let response;
  try {response=await fetcher(url(name),{credentials:'same-origin',cache:'no-store',redirect:'error',...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});}
  catch {throw new Error('通信できませんでした。入力は残っています。');}
  if(!response.ok)throw Object.assign(new Error(response.status===409?'内容が変わりました。入力を確認してください。':response.status===429?'続けて投稿できません。少し時間をおいてお試しください。入力は残っています。':'コメントを処理できませんでした。入力は残っています。'),{status:response.status});
  return response.json();
 }
 let bootstrap;
 const establish=()=>bootstrap??=(request('session',{}).then(r=>{if(r.ready!==true)throw new Error('投稿の準備ができませんでした。');}).finally(()=>{bootstrap=null;}));
 return {
  nextId:newId,
  publicRows:async()=> (await request('public')).rows,
  pendingRows:async()=> (await request('own')).rows,
  submit:async data=>{
   // Establish the author before writing. Retries after uncertainty reuse the caller's request ID.
   await establish();
   return (await request('post',data)).rows;
  }
 };
}
export function mountArticleComments({root,client,doc=document}){
 const publicList=root.querySelector('[data-public]'),pending=root.querySelector('[data-pending]');
 const form=root.querySelector('form'),status=root.querySelector('[role=status]');
 const text=form.querySelector('textarea'),nick=form.querySelector('input[name=nickname]'),consent=form.querySelector('input[name=consent]'),send=form.querySelector('[type=submit]');
 const mode=form.querySelector('[data-mode]'),cancel=form.querySelector('[data-cancel]');
 let requestId, draftMode=null, busy=false, composing=false;
 const el=(tag,value)=>{const n=doc.createElement(tag);if(value)n.textContent=value;return n;};
 const targetKey=m=>m?.edit?'edit:'+m.id:m?.parent?'reply:'+m.parent:'new';
 const fields=()=>[text.value,nick.value,consent.checked];
 let baseline=fields();
 const dirty=()=>fields().some((value,index)=>value!==baseline[index]);
 function setMode(next,{discard=false}={}){
  if(busy)return;
  if(!discard&&targetKey(next)===targetKey(draftMode)){text.focus();return;}
  if(!discard&&dirty()){
   cancel.hidden=false;
   status.textContent='入力中の内容は元のコメントに残しています。別のコメントへ移るには、先に投稿するか、キャンセルしてください。';
   text.focus();return;
  }
  draftMode=next;requestId=undefined;form.reset();
  cancel.hidden=!next;mode.textContent=next?.edit?'コメントを修正する':next?'返信を書く':'コメントを書く';
  if(next?.edit){text.value=next.body;nick.value=next.nickname==='匿名'?'':next.nickname;}
  consent.checked=false; baseline=fields();
  status.textContent='';text.focus();
 }
 function render(where,rows,isPending){
  where.replaceChildren();
  if(!Array.isArray(rows))throw new Error('コメントを読み込めませんでした。');
  if(!rows.length&&!isPending)where.append(el('p','まだコメントはありません。'));
  if(rows.length&&isPending)where.append(el('h3',rows.some(r=>r.state==='published')?'あなたのコメント':'あなたの承認待ち'));
  const ordered=isPending?rows:rows.filter(r=>!r.parent).flatMap(parent=>[parent,...rows.filter(r=>r.parent===parent.id)]);
  for(const row of ordered){
   const card=el('article'); card.className=row.parent?'reader-card reader-reply':'reader-card';
   card.append(el('strong',row.nickname),el('p',row.body));
   if(isPending)card.append(el('small',row.state==='published'?'公開中':'承認待ち'));
   if(row.editor==='運営')card.append(el('small','運営が編集'));
   if(isPending||!row.parent){
    const b=el('button',isPending?'修正する':'返信する');b.type='button';
    b.addEventListener('click',()=>setMode(isPending?{...row,edit:true}:{parent:row.id}));card.append(b);
   }
   where.append(card);
  }
 }
 const refresh=()=>Promise.all([
  client.publicRows().then(rows=>render(publicList,rows,false)).catch(()=>publicList.replaceChildren(el('p','コメントを読み込めませんでした。'))),
  client.pendingRows().then(rows=>render(pending,rows,true)).catch(()=>pending.replaceChildren(el('p','自分の承認待ちを読み込めませんでした。')))
 ]);
 form.addEventListener('input',()=>{requestId=undefined;cancel.hidden=!draftMode&&!dirty();});
 form.addEventListener('compositionstart',()=>{composing=true;});
 form.addEventListener('compositionend',()=>{composing=false;});
 cancel.addEventListener('click',()=>setMode(null,{discard:true}));
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(busy||composing||e.isComposing||!form.reportValidity())return;
  busy=true; send.disabled=true;
  [text,nick,consent,cancel].forEach(input=>{input.disabled=true;});
  const data={body:text.value,nickname:nick.value,consent:consent.checked};
  const edit=draftMode?.edit;
  try{
   const rows=await client.submit(edit?{...data,action:'edit',id:draftMode.id,rev:draftMode.rev,requestId:requestId??=client.nextId()}:{...data,action:'post',requestId:requestId??=client.nextId(),parent:draftMode?.parent});
   render(pending,rows,true);form.reset();baseline=fields();requestId=undefined;draftMode=null;cancel.hidden=true;mode.textContent='コメントを書く';
   status.textContent='受け付けました。運営の承認後に公開されます。';
  }catch(e){status.textContent=e.message;}
  finally{[text,nick,consent,cancel,send].forEach(input=>{input.disabled=false;});busy=false;}
 });
 return {refresh};
}
