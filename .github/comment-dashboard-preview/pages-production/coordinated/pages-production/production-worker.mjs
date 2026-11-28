// Candidate only. The exact production API hostname, and the disabled-by-default
// flag are deliberate. Do not deploy on the existing site or on staging.
import {buildPagesCommentAdapters,buildPagesCommentsOnRequest} from '../comments-worker-entry.mjs';
const site='https://denkicontrol.com', origin='https://comments.denkicontrol.com';
const eligible=`select public.dc_comment_gateway_eligible($1) as data, coalesce(has_function_privilege(current_user,to_regprocedure('public.dc_comment_gateway_write(text,uuid,uuid,uuid,uuid,integer,text,text,boolean)'),'EXECUTE'),false) and coalesce(has_function_privilege(current_user,to_regprocedure('dc_comment_private.dc_comment_gateway_write(text,uuid,uuid,uuid,uuid,integer,text,text,boolean)'),'EXECUTE'),false) as can_write`;
const list='select public.dc_comment_public_list($1) as data';
export const expectedRole='dc_comment_production_gateway';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
const articlePattern=/^\/articles\/[a-z0-9-]{1,120}\.html$/;
const deny=(status)=>new Response(null,{status,headers});

// The deploy entrypoint supplies the same generated, sorted paths as the article build.
export function makeProductionWorker({connect, fetcher, releasePaths}={}){
 const canonical = Array.isArray(releasePaths) && releasePaths.length > 0 && releasePaths.length <= 5000 &&
   releasePaths.every((p,i) => typeof p === 'string' && articlePattern.test(p) && (i === 0 || releasePaths[i-1] < p));
 const paths = new Set(canonical ? releasePaths : []);
 const digest = canonical ? crypto.subtle.digest('SHA-256',new TextEncoder().encode('denkicontrol-comments/v1\n'+releasePaths.join('\n')+'\n'))
   .then(b => Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('')) : Promise.resolve(null);
 const operations=new Set(['readiness','public','own','session','post','moderation']);
 const openDatabase=async(connectionString)=>{
   if(typeof connect!=='function')throw Error('Expected dedicated database client');
   const client=await connect(connectionString);
   try{
     const identity=await client.query('select current_user as role',[]);
     if(identity.rows?.[0]?.role!==expectedRole)throw Error('Unexpected database role');
     return client;
   }catch(e){try{await client.close();}catch{}throw e;}
 };
 const openAdapters=buildPagesCommentAdapters({openDatabase,fetcher});
 const onRequest=buildPagesCommentsOnRequest({openAdapters});
 return async (request,env)=>{
   const u=new URL(request.url);
   if(u.origin!==origin || !u.pathname.startsWith('/api/article-comments/'))return deny(404);
   const part=u.pathname.slice('/api/article-comments/'.length);
   if(!operations.has(part))return deny(404);
   if(request.headers.get('Origin')!==site)return deny(403);
   const hdr={...headers,'Access-Control-Allow-Origin':site,'Vary':'Origin'};
   const reply=(body,status)=>new Response(JSON.stringify(body),{status,headers:hdr});
   const activeDigest=await digest;
   if(env?.COMMENTS_ENABLED!=='true'||!activeDigest||env.COMMENTS_RELEASE_SHA256!==activeDigest)
     return reply({ready:false},503);
   const article=u.searchParams.get('article');
   if(part!=='moderation'&&(!paths.has(article)||u.searchParams.getAll('article').length!==1))
     return reply({ready:false},404);
   if(part!=='moderation'&&(u.searchParams.getAll('release').length!==1||u.searchParams.get('release')!==activeDigest))
     return reply({ready:false},409);
   if(part==='readiness'){
     if(request.method!=='GET')return reply({ready:false},405);
     try{
       const a=await openAdapters(env);
       const gate=await a.gatewayQuery(eligible,[article]);
       if(gate.rows?.[0]?.data!==true)return reply({ready:false},404);
       if(gate.rows[0].can_write!==true)return reply({ready:false},503);
       const result=await a.publicQuery(list,[article]);
       if(!Array.isArray(result.rows?.[0]?.data))return reply({ready:false},503);
       return reply({ready:true,release:activeDigest},200);
     }catch{return reply({ready:false},503);}
   }
   return onRequest({request,env});
 };
}

