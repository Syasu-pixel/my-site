// Verification-only Pages advanced mode wrapper. Deploy only to the isolated preview.
import {STAGING_ORIGIN} from '../pages-staging-smoke.mjs';
const paths=new Set(['/','/index','/index.html','/operator','/operator.html','/dashboard.css','/article-client.mjs','/dashboard-client.mjs','/smoke-transport.mjs','/smoke-article.mjs','/smoke-operator.mjs']);
const noCache={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'};
export function buildPreviewFetch({verify,api,check}){
 return async (request,env)=>{
  const {origin,pathname}=new URL(request.url);
  if(origin!==STAGING_ORIGIN)return new Response(null,{status:404,headers:noCache});
  if(pathname==='/api/staging-connection-check'&&typeof check==='function')return check(request,env);
  if(pathname.startsWith('/api/article-comments/'))return api({request,env});
  if(!paths.has(pathname)||!['GET','HEAD'].includes(request.method))return new Response(null,{status:404,headers:noCache});
  try{
   if(await verify(request,env)!==true)return new Response(null,{status:403,headers:noCache});
   const response=await env.ASSETS.fetch(request);
   const headers=new Headers(response.headers);
   for(const [k,v] of Object.entries(noCache))headers.set(k,v);
   headers.set('X-Content-Type-Options','nosniff');
   headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self' https://dtqwnhmpieruiufbodnz.supabase.co; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
   return new Response(response.body,{status:response.status,headers});
  }catch{return new Response(null,{status:503,headers:noCache});}
 };
}
