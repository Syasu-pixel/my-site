// Preview transport. Requires a server-owned session adapter and eligible-article store.
import {parseJSON} from './moderation-route.mjs';
const routes=new Set(['/api/article-comments/public','/api/article-comments/own','/api/article-comments/post','/api/article-comments/session']);
const guard=/^\/articles\/[a-z0-9-]+\.html$/;
function output(status,data,privateData=true,cookie=null){
 const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':privateData?'private, no-store':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'};
 if(privateData)headers.Vary='Cookie';
 if(cookie)headers['Set-Cookie']=cookie;
 return new Response(JSON.stringify(data),{status,headers});
}
export function createArticleRoute({origin,sessions,store}={}){
 return async request=>{
  try{
   if(!origin||!sessions?.read||!sessions?.ensure||!store?.publicFor||!store?.ownFor||!store?.post||!store?.editOwn||!store?.isEligible)throw 503;
   const u=new URL(request.url),path=u.searchParams.get('article');
   if(u.origin!==origin||!routes.has(u.pathname)||typeof path!=='string'||!guard.test(path))throw 404;
   if(u.pathname==='/api/article-comments/public'){
    if(request.method!=='GET')throw 405;
    return output(200,{rows:await store.publicFor(path)},false); // Never resolve cookie.
   }
   if(u.pathname==='/api/article-comments/own'){
    if(request.method!=='GET')throw 405;
    const actor=await sessions.read(request);
    return output(200,{rows:actor?await store.ownFor(path,actor):[]});
   }
   if(request.method!=='POST')throw 405;
   if(request.headers.get('origin')!==origin||!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')??''))throw 403;
   if(u.pathname==='/api/article-comments/session'){
    if(!await store.isEligible(path))throw 404;
    const input=await parseJSON(request);
    if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==0)throw 400;
    // Establish the browser session in a separate round trip before any storage mutation.
    // If the response is lost, retrying session setup cannot duplicate a submitted comment.
    const {actor,cookie}=await sessions.ensure(request);
    if(!actor)throw 503;
    return output(200,{ready:true},true,cookie);
   }
   const d=await parseJSON(request);
   if(!d||!['post','edit'].includes(d.action))throw 400;
   const actor=await sessions.read(request);
   if(!actor)throw 401;
   if(d.action==='post')await store.post(path,actor,d);
   else await store.editOwn(path,d.id,actor,d);
   return output(200,{rows:await store.ownFor(path,actor)});
  }catch(e){
   const code=[400,401,403,404,405,409,413,429].includes(e?.status??e)?e?.status??e:503;
   return output(code,{error:code===409?'内容が変わりました。もう一度確認してください。':'コメントを処理できませんでした。'});
  }
 };
}
