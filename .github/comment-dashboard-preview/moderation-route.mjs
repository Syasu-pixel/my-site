// Transport boundary only. Register on a same-origin server with real auth and a transactional store.
// Leaving dependencies missing denies access, and this file never enables a deployed route.
const H={'Cache-Control':'private, no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'};
const reply=(status,value)=>new Response(JSON.stringify(value),{status,headers:H});
const article=/^\/articles\/[a-z0-9-]+\.html$/;
const key=/^[a-zA-Z0-9_-]{1,80}$/;
export async function parseJSON(request){
 const rd=request.body?.getReader(); if(!rd)throw 400;
 let size=0, content='';
 const decoder=new TextDecoder('utf-8',{fatal:true});
 try{
  for(;;){const {done,value}=await rd.read();if(done)break;size+=value.byteLength;
   if(size>8192){await rd.cancel();throw 413;} content+=decoder.decode(value,{stream:true});
  }
  return JSON.parse(content+decoder.decode());
 }catch(e){throw e===413?413:400;}finally{rd.releaseLock();}
}
function present(r){
 if(!r || !article.test(r.path) || typeof r.id!=='string' || !key.test(r.id) || typeof r.body!=='string' || typeof r.nickname!=='string' || !['pending','published'].includes(r.state) ||
 (!Number.isSafeInteger(r.rev)||r.rev<1))throw 503;
 return {id:r.id,path:r.path,state:r.state,body:r.body,nickname:r.nickname,
  rev:r.rev, hasPendingEdit:r.state==='published'&&r.hasPendingEdit===true, isReply:Boolean(r.parent), parentUnavailable:r.state==='pending'&&Boolean(r.parent)&&r.parentUnavailable===true, editedByOperator:r.editor==='運営',
  mayFeature:r.state==='published'&&r.mayFeature===true};
}
export function createModerationRoute({origin,identity,moderators,store}={}){
 return async request=>{
  try {
   if(!origin||!identity?.authenticate||!moderators?.has||!store?.list||!store?.apply)return reply(503,{error:'コメント管理は現在利用できません。'});
   const u=new URL(request.url);
   if(u.origin!==origin||u.pathname!=='/api/article-comments/moderation')return reply(404,{error:'見つかりません。'});
   if(!['GET','POST'].includes(request.method))return reply(405,{error:'利用できない操作です。'});
   if(request.method==='POST'&&(request.headers.get('origin')!==origin||!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')??'')))return reply(403,{error:'操作を確認できません。'});
   const token=/^Bearer ([A-Za-z0-9._~-]{1,8192})$/.exec(request.headers.get('authorization')??'')?.[1];
   if(!token)return reply(401,{error:'ログインしてください。'});
   const actor=await identity.authenticate(token);
   if(!actor||typeof actor.id!=='string'||actor.anonymous!==false||!await moderators.has(actor.id))return reply(403,{error:'管理者のみ利用できます。'});
   if(request.method==='GET'){
    const state=u.searchParams.get('state')??'pending';
    if(!['pending','published'].includes(state))throw 400;
    const after=u.searchParams.get('after');
    if(u.searchParams.getAll('after').length>1||after!==null&&!key.test(after))throw 400;
    const batch=await store.list({adminId:actor.id,state,limit:51,after});
    if(!Array.isArray(batch)||batch.length>51||batch.some(r=>r.state!==state||r.id===after)||new Set(batch.map(r=>r.id)).size!==batch.length)throw 503;
    const rows=batch.slice(0,50).map(present);
    return reply(200,{rows,next:batch.length>50?rows.at(-1).id:null});
   }
   const d=await parseJSON(request);
   if(!d||typeof d.path!=='string'||!article.test(d.path)||typeof d.id!=='string'||!key.test(d.id)||!['approve','decline','hide','edit'].includes(d.action))throw 400;
   const action={path:d.path,id:d.id,action:d.action,adminId:actor.id};
   if(!Number.isSafeInteger(d.rev)||d.rev<1)throw 400;action.rev=d.rev;
   if(d.action==='edit'){
    if(typeof d.body!=='string'||![...d.body.trim()].length||[...d.body.trim()].length>500||typeof d.nickname!=='string'||[...d.nickname.trim()].length>24)throw 400;
    action.body=d.body.trim();action.nickname=d.nickname.trim();
   }
   await store.apply(action); // Adapter must re-check role within mutation and compare-and-swap revision.
   return reply(200,{ok:true});
  }catch(e){
   const status=[400,403,404,409,413].includes(e?.status??e)?e?.status??e:503;
   return reply(status,{error:({400:'入力を確認してください。',403:'操作が許可されていません。',404:'対象が見つかりません。',409:'内容が変わりました。更新して確認してください。',413:'入力が長すぎます。',503:'コメント管理に接続できません。'})[status]});
  }
 };
}
