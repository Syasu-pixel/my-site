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
