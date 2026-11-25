// Local synthetic reference from the reviewed HTML; not a production store.
const deny=(status,message)=>{throw Object.assign(new Error(message),{status});};
export function trial({paths,owner}) {
 const eligible=new Set(paths), rows=new Map(), requests=new Map();let rev=0;
 const admin=a=>a===owner;
 const article=p=>{if(!/^\/articles\/[a-z0-9-]+\.html$/.test(p)||!eligible.has(p))deny(404,'対象外の記事です。');};
 const row=(p,id)=>{article(p);const r=rows.get(id);if(!r||r.path!==p)deny(404,'見つかりません。');return r;};
 const draft=(d,editor)=>{const body=d.body?.trim(), nickname=d.nickname?.trim()||'匿名';if(!body||[...body].length>500||[...nickname].length>24)deny(400,'投稿内容を確認してください。');return {body,nickname,consent:d.consent===true,rev:++rev,editor};};
 const canEdit=(r,a)=>a===r.author||admin(a);
 const hasPublic=(r)=>!r.hidden&&!!r.published&&(!r.parent||hasPublic(rows.get(r.parent)));
 const details=(r,v)=>({id:r.id,parent:r.parent,...{body:v.body,nickname:v.nickname,editor:v.editor}});
 return {
  read(p,a){article(p);return [...rows.values()].filter(r=>p===r.path).flatMap(r=>[
   ...(hasPublic(r)?[{...details(r,r.published),canEdit:canEdit(r,a),reply:!r.parent}]:[]),
   ...(r.pending&&canEdit(r,a)&&!r.hidden?[{...details(r,r.pending),pending:true,rev:r.pending.rev,consent:r.pending.consent,canEdit:true}]:[])
  ]);},
  post(p,a,d){article(p);if(!a||!d.requestId)deny(400,'送信を確認できません。');
   const slot=JSON.stringify([p,a,d.requestId]), fp=JSON.stringify([d.body,d.nickname,d.parent,d.consent]);
   if(requests.has(slot)){const old=requests.get(slot);if(old.fp!==fp)deny(409,'送信内容が異なります。');return old.id;}
   if(d.parent){const parent=row(p,d.parent);if(!hasPublic(parent)||parent.parent)deny(409,'この投稿には返信できません。');}
   const pending=draft(d,'投稿者'), id=String(rows.size+1);
   rows.set(id,{id,path:p,author:a,parent:d.parent||null,pending,published:null,hidden:false});requests.set(slot,{id,fp});return id;
  },
  edit(p,id,a,d){const r=row(p,id);if(!canEdit(r,a)||r.hidden)deny(403,'編集できません。');r.pending=draft({...d,consent:admin(a)?false:d.consent},admin(a)?'運営':'投稿者');},
  review(p,id,a,revision,decision){if(!admin(a))deny(403,'管理者のみ操作できます。');
   const r=row(p,id);if(!r.pending||r.pending.rev!==revision||r.hidden)deny(409,'投稿が変更されました。内容を確認し直してください。');
   if(decision==='approve'){if(r.parent&&!hasPublic(rows.get(r.parent)))deny(409,'親コメントが非公開です。');r.published=r.pending;}
   else if(decision!=='decline')deny(400,'操作を確認してください。');
   r.pending=null;
  },
  hide(p,id,a){if(!admin(a))deny(403,'管理者のみ操作できます。');row(p,id).hidden=true;},
  mayFeature(p,id,a,revision){if(!admin(a))return false;const r=row(p,id);return hasPublic(r)&&!r.pending&&r.published.rev===revision&&r.published.consent;}
 };
}
