// Staged shared-template adapter. A deployment must supply the reviewed
// publication registry and independently verify writes and moderation before
// setting enabled=true. Nothing is enabled by importing this module.
import {makeArticleClient,mountArticleComments} from './article-client.mjs';

const pathShape=/^\/articles\/[a-z0-9-]+\.html$/;
export function eligibleCommentPaths({manifestPaths,sitemapPaths,unpublishedPaths}){
 const sitemap=new Set(sitemapPaths), unpublished=new Set(unpublishedPaths);
 return [...new Set(manifestPaths)].filter(path=>pathShape.test(path)&&sitemap.has(path)&&!unpublished.has(path)).sort();
}

export async function attachArticleComments({
 enabled=false, location, allowedPaths, doc, apiOrigin,
 fetcher=fetch, makeClient=makeArticleClient, mount=mountArticleComments
}={}){
 const path=location?.pathname;
 if(enabled!==true||location?.origin!=='https://denkicontrol.com'||typeof path!=='string'
    ||!pathShape.test(path)||!allowedPaths?.has(path))return null;
 const slots=doc?.querySelectorAll('[data-article-comments-slot]');
 if(slots?.length!==1)return null;
 const slot=slots[0];
 const templates=slot.querySelectorAll('template[data-article-comments-template]');
 if(templates.length!==1||slot.querySelector('[data-comments]'))return null;
 const root=templates[0].content.firstElementChild?.cloneNode(true);
 if(!root?.matches('[data-comments]'))return null;
 // Probe with a safe read. No session creation or post is part of readiness.
 // An unavailable endpoint leaves the slot hidden instead of presenting a dead form.
 try{
  const client=makeClient({path,fetcher,apiOrigin});
  let first=await client.publicRows();
  if(!Array.isArray(first)||!slot.isConnected||slot.querySelector('[data-comments]'))return null;
  const reused={...client,publicRows:()=>{if(first===null)return client.publicRows();const rows=first;first=null;return Promise.resolve(rows);}};
  const ui=mount({root,client:reused,doc});
  await ui.refresh();
  if(!slot.isConnected||slot.querySelector('[data-comments]'))return null;
  slot.append(root);slot.hidden=false;
  return ui;
 }catch{return null;}
}
