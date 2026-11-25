// Unpublished deployment boundary. No routing, secret, database, or production activation.
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
export function buildCommentsEntrypoint({origin,openAdapters}={}) {
 const canonical=httpsOrigin(origin);
 return async (request,env={})=>{
  try {
   const u=new URL(request.url);
   if(!canonical||u.origin!==canonical||!paths.has(u.pathname))return error(404);
   if(env.COMMENTS_ENABLED!=='true'||typeof openAdapters!=='function')return error(503);
   if(request.headers.has('Origin')&&request.headers.get('Origin')!==canonical)return error(403);
   const a=await openAdapters(env);
   if(u.pathname.endsWith('/moderation'))return createBoundModeration({origin:canonical,authClient:a.authClient,createActorClient:a.createActorClient})(request);
   const sessions=await makeArticleSessions({keyBytes:a.keyBytes,previousKeyBytes:a.previousKeyBytes});
   const store=makeArticlePostgresStore({gatewayQuery:a.gatewayQuery,publicQuery:a.publicQuery});
   return createArticleRoute({origin:canonical,sessions,store})(request);
  }catch { return error(503); }
 };
}
