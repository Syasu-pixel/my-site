// Isolated transport candidate. Inject a server-only restricted query client.
// The actor comes exclusively from createArticleRoute's validated session adapter.
const statusByCode={DC409:409,DC429:429,'22023':400,P0002:404,'22P02':400,'42501':403};
const fail=status=>{throw Object.assign(new Error('comments storage unavailable'),{status});};
export function makeArticlePostgresStore({gatewayQuery,publicQuery}={}){
 if(typeof gatewayQuery!=='function'||typeof publicQuery!=='function')throw new TypeError('restricted comment clients are required');
 const run=async(query,sql,parameters)=>{
  try{
   const result=await query(sql,parameters);
   if(!result||!Object.hasOwn(result.rows?.[0]??{},'data'))fail(503);
   return result.rows[0].data;
  }catch(error){fail(statusByCode[error?.code]??503);}
 };
 const change=(path,actor,d,entry=null)=>run(gatewayQuery,'select public.dc_comment_gateway_write($1,$2,$3,$4,$5,$6,$7,$8,$9) as data',
 [path,actor,d.requestId??null,entry,entry?null:d.parent??null,entry?d.rev??null:null,d.body??null,d.nickname??null,d.consent===true]);
 return {
  isEligible:path=>run(gatewayQuery,'select public.dc_comment_gateway_eligible($1) as data',[path]),
  publicFor:path=>run(publicQuery,'select public.dc_comment_public_list($1) as data',[path]),
  ownFor:(path,actor)=>run(gatewayQuery,'select public.dc_comment_gateway_own($1,$2) as data',[path,actor]),
  post:(path,actor,d)=>change(path,actor,d),
  editOwn:(path,id,actor,d)=>change(path,actor,d,id)
 };
}
