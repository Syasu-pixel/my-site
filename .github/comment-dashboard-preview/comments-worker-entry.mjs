// Unpublished deployment boundary. No routing, secret, database, or production activation.
import {COMMENT_API_ORIGIN} from './article-client.mjs';
import {createArticleRoute} from './article-route.mjs';
import {makeArticleSessions} from './article-session.mjs';
import {makeArticlePostgresStore} from './article-postgres-store.mjs';
import {createBoundModeration} from './moderation-supabase-boundary.mjs';

const paths=new Set(['public','own','session','post','moderation'].map(k=>'/api/article-comments/'+k));
const error=(status)=>new Response('{"error":"コメントには現在接続できません。"}',{
 status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store',
 'X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}
});
function httpsOrigin(value) {
 try { const u=new URL(value); if(u.protocol==='https:'&&value===u.origin) return value; } catch {}
 return null;
}
// Dedicated-host mode is explicitly selected and only permits the production pair.
const allowedPreflight={
 public:{GET:[]},own:{GET:[]},session:{POST:['content-type']},post:{POST:['content-type']},
 moderation:{GET:['authorization'],POST:['authorization','content-type']}
};
function withCors(response,origin,part) {
 const headers=new Headers(response.headers);
 headers.append('Vary','Origin');
 headers.set('Access-Control-Allow-Origin',origin);
 if(part==='own'||part==='session'||part==='post')headers.set('Access-Control-Allow-Credentials','true');
 return new Response(response.body,{status:response.status,headers});
}
function preflight(request,part) {
 const method=request.headers.get('Access-Control-Request-Method');
 const headers=(request.headers.get('Access-Control-Request-Headers')??'').toLowerCase().split(',').map(h=>h.trim()).filter(Boolean);
 const policy=allowedPreflight[part];
 if(!Object.hasOwn(policy,method)||headers.some(h=>!policy[method].includes(h)))return error(403);
 return new Response(null,{status:204,headers:{
  'Access-Control-Allow-Methods':method,
  ...(headers.length?{'Access-Control-Allow-Headers':policy[method].join(', ')}:{}),
  'Vary':'Access-Control-Request-Method, Access-Control-Request-Headers',
  'Cache-Control':'private, no-store'
 }});
}
export function buildCommentsEntrypoint({origin,apiOrigin=origin,openAdapters}={}) {
 const canonical=httpsOrigin(origin), requestOrigin=httpsOrigin(apiOrigin);
 const separate=canonical!==requestOrigin;
 const valid=canonical&&requestOrigin&&(!separate||
  (canonical==='https://denkicontrol.com'&&requestOrigin===COMMENT_API_ORIGIN));
 return async (request,env={})=>{
  const u=new URL(request.url);
  if(!valid||u.origin!==requestOrigin||!paths.has(u.pathname))return error(404);
  const supplied=request.headers.get('Origin');
  if((separate||supplied!==null)&&supplied!==canonical)return error(403);
  const part=u.pathname.split('/').at(-1);
  const respond=r=>separate?withCors(r,canonical,part):r;
  try {
   if(env.COMMENTS_ENABLED!=='true'||typeof openAdapters!=='function')return respond(error(503));
   if(separate&&request.method==='OPTIONS')return respond(preflight(request,part));
   if(!Object.hasOwn(allowedPreflight[part],request.method))return respond(error(405));
   const a=await openAdapters(env);
   if(part==='moderation')return respond(await createBoundModeration({origin:canonical,requestOrigin,authClient:a.authClient,createActorClient:a.createActorClient})(request));
   const sessions=await makeArticleSessions({keyBytes:a.keyBytes,previousKeyBytes:a.previousKeyBytes});
   const store=makeArticlePostgresStore({gatewayQuery:a.gatewayQuery,publicQuery:a.publicQuery});
   return respond(await createArticleRoute({origin:canonical,requestOrigin,sessions,store})(request));
  }catch { return respond(error(503)); }
 };
}

// Pages Functions adapter: wire up onRequest in a separate project only after
// supplying reviewed server bindings. There is deliberately no auto-mounted
// export, test mode switch or fallback to a fixture database.
export function buildPagesCommentsOnRequest({openAdapters}={}) {
 const handle=buildCommentsEntrypoint({
  origin:'https://denkicontrol.com',apiOrigin:COMMENT_API_ORIGIN,openAdapters
 });
 return ({request,env}={})=>request instanceof Request?handle(request,env):error(503);
}

// Production-shaped wiring, not activated by this module. Keep Hyperdrive
// caching disabled on the dedicated gateway binding. The DB login must have
// EXECUTE on the three reader-owned gateway functions, never table/admin grants.
const supabaseOrigin='https://pavitnsnmoaiospswiys.supabase.co';
const publicSql='select public.dc_comment_public_list($1) as data';
const gatewaySql=new Set([
 'select public.dc_comment_gateway_eligible($1) as data',
 'select public.dc_comment_gateway_own($1,$2) as data',
 'select public.dc_comment_gateway_write($1,$2,$3,$4,$5,$6,$7,$8,$9) as data'
]);
const moderatorRpc=new Set(['dc_comment_moderator_self','dc_comment_moderation_list','dc_comment_moderation_apply']);
function sessionKey(value){
 if(typeof value!=='string'||!/^[a-zA-Z0-9_-]{43}$/.test(value))throw Error('Invalid signing key');
 const bytes=Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')+'='),c=>c.charCodeAt(0));
 if(bytes.length!==32)throw Error('Invalid signing key');
 return bytes;
}
// The two profiles have disjoint bindings. The staging database role is
// named for the staging project ref and checked on every database connection.
// No production bindings or URL are used as a fallback.
export function buildPagesStagingCommentAdapters(options={}) {
 return makePagesCommentAdapters(options,true);
}
export function buildPagesCommentAdapters(options={}) {
 return makePagesCommentAdapters(options,false);
}
function makePagesCommentAdapters({openDatabase,fetcher=fetch},staging) {
 return async env=>{
  const prefix=staging?'COMMENTS_STAGING_':'COMMENTS_';
  const ref=env?.COMMENTS_STAGING_SUPABASE_PROJECT_REF;
  if(staging&&(typeof ref!=='string'||!/^[a-z0-9]{20}$/.test(ref)||'https://'+ref+'.supabase.co'===supabaseOrigin))
   throw Error('Missing isolated staging project');
  const apiOrigin=staging?'https://'+ref+'.supabase.co':supabaseOrigin;
  const publishable=env?.[prefix+'SUPABASE_PUBLISHABLE_KEY'];
  const db=env?.[prefix+'GATEWAY_DB'];
  if(typeof publishable!=='string'||!/^sb_publishable_[a-zA-Z0-9_-]{12,128}$/.test(publishable)
    ||typeof openDatabase!=='function'||typeof db?.connectionString!=='string'||!db.connectionString)
   throw Error('Missing restricted bindings');
  const keyBytes=sessionKey(env[prefix+'SIGNING_KEY']);
  const previousKeyBytes=env[prefix+'PREVIOUS_SIGNING_KEY']?sessionKey(env[prefix+'PREVIOUS_SIGNING_KEY']):undefined;
  async function api(path,{token,args}={}){
   const headers={apikey:publishable,Accept:'application/json'};
   if(token)headers.Authorization='Bearer '+token;
   if(args!==undefined)headers['Content-Type']='application/json';
   const response=await fetcher(apiOrigin+path,{
    method:args===undefined?'GET':'POST',headers,
    ...(args===undefined?{}:{body:JSON.stringify(args)}),
    credentials:'omit',redirect:staging?'manual':'error',cache:'no-store',signal:AbortSignal.timeout(5000)
   });
   if(staging&&response.status>=300&&response.status<400)throw Error('Staging API redirect rejected');
   const result=await response.json().catch(()=>null);
   if(!response.ok)return {error:{code:typeof result?.code==='string'?result.code:'unavailable'}};
   if(result===null&&path==='/auth/v1/user')throw Error('Missing verified identity');
   return {data:result};
  }
  return {
   keyBytes,previousKeyBytes,
   authClient:{auth:{getUser:async token=>{
    const r=await api('/auth/v1/user',{token});
    return r.error?r:{data:{user:r.data}};
   }}},
   createActorClient:({accessToken})=>({rpc:(name,args={})=>{
    if(!moderatorRpc.has(name))throw Error('Unregistered moderator operation');
    return api('/rest/v1/rpc/'+name,{token:accessToken,args});
   }}),
   publicQuery:async(sql,[article])=>{
    if(sql!==publicSql)throw Error('Unregistered public operation');
    const r=await api('/rest/v1/rpc/dc_comment_public_list',{args:{p_path:article}});
    if(r.error||!Array.isArray(r.data))throw Error('Public query unavailable');
    return {rows:[{data:r.data}]};
   },
   gatewayQuery:async(sql,params)=>{
    if(!gatewaySql.has(sql))throw Error('Unregistered private operation');
    const client=await openDatabase(db.connectionString);
    try{
     if(staging){
      const identity=await client.query('select current_user as role',[]);
      if(identity?.rows?.[0]?.role!=='dc_comment_staging_'+ref)throw Error('Wrong staging gateway role');
     }
     return await client.query(sql,params);
    }finally{await client.close();}
   }
  };
 };
}
