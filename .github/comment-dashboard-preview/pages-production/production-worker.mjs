// Candidate only. The exact production API hostname, and the disabled-by-default
// flag are deliberate. Do not deploy on the existing site or on staging.
import {buildPagesCommentAdapters,buildPagesCommentsOnRequest} from '../comments-worker-entry.mjs';
const site='https://denkicontrol.com', origin='https://comments.denkicontrol.com';
const eligible='select public.dc_comment_gateway_eligible($1) as data';
const list='select public.dc_comment_public_list($1) as data';
export const expectedRole='dc_comment_production_gateway';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
const articlePattern=/^\/articles\/[a-z0-9-]{1,200}\.html$/;
const deny=(status)=>new Response(null,{status,headers});

export function makeProductionWorker({connect, fetcher}={}){
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
   if(u.origin!==origin)return deny(404);
   if(u.pathname==='/api/article-comments/readiness'){
     if(request.method!=='GET')return deny(405);
     if(request.headers.get('Origin')!==site)return deny(403);
     const hdr={...headers,'Access-Control-Allow-Origin':site,'Vary':'Origin'};
     const reply=(body,status)=>new Response(JSON.stringify(body),{status,headers:hdr});
     const article=u.searchParams.get('article');
     if(!article||!articlePattern.test(article)||u.searchParams.getAll('article').length!==1)
       return reply({ready:false},404);
     if(env?.COMMENTS_ENABLED!=='true'||!articlePattern.test(env?.COMMENTS_PILOT_ARTICLE??''))return reply({ready:false},503);
     if(env.COMMENTS_PILOT_ARTICLE!==article)return reply({ready:false},404);
     try{
       const a=await openAdapters(env);
       const gate=await a.gatewayQuery(eligible,[article]);
       if(gate.rows?.[0]?.data!==true)return reply({ready:false},404);
       const result=await a.publicQuery(list,[article]);
       if(!Array.isArray(result.rows?.[0]?.data))return reply({ready:false},503);
       return reply({ready:true},200);
     }catch{return reply({ready:false},503);}
   }
   if(!u.pathname.startsWith('/api/article-comments/'))return deny(404);
   const part=u.pathname.split('/').at(-1);
   if(env?.COMMENTS_ENABLED==='true'&&(!articlePattern.test(env?.COMMENTS_PILOT_ARTICLE??'')||
       (part!=='moderation'&&(u.searchParams.get('article')!==env.COMMENTS_PILOT_ARTICLE||u.searchParams.getAll('article').length!==1))))return deny(404);
   return onRequest({request,env});
 };
}
