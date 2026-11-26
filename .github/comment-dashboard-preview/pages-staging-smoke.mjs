// Review-only boundary for a dedicated same-origin, Access-protected deployment.
// This is separate from the live site's exact-host entrypoint.
import {buildCommentsEntrypoint} from './comments-worker-entry.mjs';
export const STAGING_ORIGIN='https://smoke.denkicontrol-comments-staging.pages.dev';
const denied=status=>new Response(null,{status,headers:{
 'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'
}});
export function buildPagesStagingOnRequest({verifyPreviewAccess,openAdapters}={}) {
 const handle=buildCommentsEntrypoint({origin:STAGING_ORIGIN,openAdapters});
 return async ({request,env}={})=>{
  if(!(request instanceof Request)||new URL(request.url).origin!==STAGING_ORIGIN)return denied(404);
  if(env?.COMMENTS_STAGING_ENABLED!=='true'||typeof verifyPreviewAccess!=='function'||typeof openAdapters!=='function')return denied(503);
  try {if(await verifyPreviewAccess(request,env)!==true)return denied(403);}
  catch {return denied(403);}
  return handle(request,{...env,COMMENTS_ENABLED:'true'});
 };
}
// The Access session cookie stays on this one host. Normal production clients
// keep their existing credential policies (and never import this module).
export function makeStagingFetch(fetcher=fetch) {
 return (path,init)=>{
  if(typeof path!=='string'||!/^\/api\/article-comments\/(?:public|own|session|post|moderation)(?:\?|$)/.test(path))
   throw Error('Invalid staging API path');
  return fetcher(path,{...init,credentials:'same-origin',redirect:'error',cache:'no-store'});
 };
}
