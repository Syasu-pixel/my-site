// Isolated integration candidate; not a deployed route or a migration.
// createActorClient must return a new server-side client using the verified user's
// JWT, with a publishable key and session persistence disabled. Never use service_role.
import {createModerationRoute} from './moderation-route.mjs';
import {makeVerifiedIdentity} from './deployment-boundary.mjs';
const ops=new Set(['approve','decline','edit','hide']);
const unavailable=()=>new Response('{"error":"コメント管理は現在利用できません。"}',{
 status:503,headers:{'Cache-Control':'private, no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}
});
function failure(status){return Object.assign(new Error('moderation boundary refused'),{status});}
async function rpc(client,name,args={}){
 const result=await client.rpc(name,args);
 if(!result||result.error){
  const code=result?.error?.code;
  // Never relay database detail, constraints, stack traces or tokens.
  throw failure({42501:403,P0002:404,DC409:409,'22023':400}[code]??503);
 }
 return result.data;
}
export function createBoundModeration({origin,authClient,createActorClient}={}){
 return async request=>{
  if(!origin||!authClient?.auth?.getUser||typeof createActorClient!=='function')return unavailable();
  const auth=makeVerifiedIdentity({supabase:authClient});
  // Isolated closure per request: a failed or simultaneous request cannot use
  // another request's verified identity or client.
  let verified=null, userClient=null;
  const bound=adminId=>{
   if(!verified||verified.id!==adminId||!userClient?.rpc)throw failure(403);
   return userClient;
  };
  const identity={authenticate:async token=>{
   verified=await auth.authenticate(token);
   if(!verified)return null;
   userClient=await createActorClient({accessToken:token});
   if(!userClient?.rpc)throw failure(503);
   return verified;
  }};
  const moderators={has:async id=>await rpc(bound(id),'dc_comment_moderator_self')===true};
  const store={
   list:async({adminId,state,limit})=>rpc(bound(adminId),'dc_comment_moderation_list',{p_state:state,p_limit:limit}),
   apply:async d=>{
    if(!ops.has(d.action))throw failure(400);
    // The DB function derives identity from auth.uid(), never from adminId.
    // It must re-check operator membership and revision inside the write transaction.
    const args={p_path:d.path,p_id:d.id,p_action:d.action,p_rev:d.rev??null,p_body:d.body??null,p_nickname:d.nickname??null};
    if(await rpc(bound(d.adminId),'dc_comment_moderation_apply',args)!==true)throw failure(503);
   }
  };
  return createModerationRoute({origin,identity,moderators,store})(request);
 };
}
