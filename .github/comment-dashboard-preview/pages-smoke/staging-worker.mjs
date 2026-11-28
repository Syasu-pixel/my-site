import {createRemoteJWKSet,jwtVerify,customFetch} from 'jose';
import pg from 'pg';
import {buildPagesStagingCommentAdapters} from '../comments-worker-entry.mjs';
import {buildPagesStagingOnRequest} from '../pages-staging-smoke.mjs';

export function makePreviewAccessVerifier({fetcher=(...args)=>globalThis.fetch(...args)}={}) {
 let remote, priorIssuer;
 return async (request,env)=>{
  const team=env.COMMENTS_STAGING_ACCESS_TEAM;
  const audience=env.COMMENTS_STAGING_ACCESS_AUDIENCE;
  const token=request.headers.get('Cf-Access-Jwt-Assertion');
  if(typeof team!=='string'||!/^[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?$/.test(team)||
    typeof audience!=='string'||!/^[a-f0-9]{64}$/.test(audience)||!token||token.length>8192)return false;
  const issuer='https://'+team+'.cloudflareaccess.com';
  if(!remote||priorIssuer!==issuer){
   remote=createRemoteJWKSet(new URL(issuer+'/cdn-cgi/access/certs'),{
    timeoutDuration:3000,[customFetch]:async (url,opts)=>{
     const result=await fetcher(url,{...opts,redirect:'manual'});
     if(result.status>=300&&result.status<400)throw Error('Access signing key redirect rejected');
     return result;
    }
   });
   priorIssuer=issuer;
  }
  const {payload}=await jwtVerify(token,remote,{
   algorithms:['RS256'],issuer,audience,requiredClaims:['exp','sub']
  });
  return typeof payload.sub==='string'&&payload.sub.length>0;
 };
}
async function openDatabase(connectionString){
 const client=new pg.Client({connectionString,connectionTimeoutMillis:4000});
 try{await client.connect();}
 catch(error){await client.end().catch(()=>{});throw error;}
 return {query:(sql,params)=>client.query(sql,params),close:()=>client.end()};
}
export const verifyPreviewAccess=makePreviewAccessVerifier();
export const onRequest=buildPagesStagingOnRequest({
 verifyPreviewAccess,
 openAdapters:buildPagesStagingCommentAdapters({openDatabase})
});

// Protected, read-only staging diagnostic. Do not emit configuration values,
// provider response bodies, exception details, hostnames, or connection strings.
export function makeStagingConnectionCheck({verify, open, fetcher=(...args)=>globalThis.fetch(...args)}){
 return async (request,env)=>{
  const h={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'};
  if(request.method!=='GET')return new Response(null,{status:405,headers:h});
  try{if(await verify(request,env)!==true)return new Response(null,{status:403,headers:h});}
  catch{return new Response(null,{status:403,headers:h});}
  const refOK=env?.COMMENTS_STAGING_SUPABASE_PROJECT_REF==='dtqwnhmpieruiufbodnz';
  const key=env?.COMMENTS_STAGING_SUPABASE_PUBLISHABLE_KEY;
  const apiKeyOK=typeof key==='string'&&/^sb_publishable_[a-zA-Z0-9_-]{12,128}$/.test(key);
  const signing=env?.COMMENTS_STAGING_SIGNING_KEY;
  const signingOK=typeof signing==='string'&&/^[a-zA-Z0-9_-]{43}$/.test(signing);
  let connectionString;
  try{connectionString=env?.COMMENTS_STAGING_GATEWAY_DB?.connectionString;}catch{}
  const bindingOK=typeof connectionString==='string'&&Boolean(connectionString);
  const state={enabled:env?.COMMENTS_STAGING_ENABLED==='true',project:refOK,publicKeyFormat:apiKeyOK,signingKeyFormat:signingOK,
   databaseBinding:bindingOK,publicRead:'not_checked',databaseLogin:'not_checked'};
  if(state.enabled&&refOK&&apiKeyOK){
   try{
    const response=await fetcher('https://dtqwnhmpieruiufbodnz.supabase.co/rest/v1/rpc/dc_comment_public_list',{
     method:'POST',headers:{apikey:key,'Content-Type':'application/json'},credentials:'omit',redirect:'manual',cache:'no-store',
     body:JSON.stringify({p_path:'/articles/staging-comment-smoke.html'}),signal:AbortSignal.timeout(5000)
    });
    state.publicRead=response.ok?(Array.isArray(await response.json())?'ok':'unexpected_shape'):'http_'+response.status;
   }catch{state.publicRead='unavailable';}
  }
  if(state.enabled&&refOK&&bindingOK){
   let db;
   try{
    db=await open(connectionString);
    const who=await db.query('select current_user as role',[]);
    state.databaseLogin=who.rows?.[0]?.role==='dc_comment_staging_dtqwnhmpieruiufbodnz'?'ok':'wrong_role';
   }catch{state.databaseLogin='unavailable';}
   finally{if(db)await db.close().catch(()=>{});}
  }
  return new Response(JSON.stringify(state),{headers:h});
 };
}
export const checkConnection=makeStagingConnectionCheck({verify:verifyPreviewAccess,open:openDatabase});
