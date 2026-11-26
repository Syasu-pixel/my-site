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
