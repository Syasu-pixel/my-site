import assert from 'node:assert/strict';
import {Miniflare} from 'miniflare';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const worker=fileURLToPath(new URL('../comments-worker-entry.mjs',import.meta.url));
const script=(await build({stdin:{contents:`
import {buildPagesCommentAdapters,buildPagesCommentsOnRequest} from '${worker}';
const openAdapters=buildPagesCommentAdapters({openDatabase(){throw Error('DB not required')}});
const onRequest=buildPagesCommentsOnRequest({openAdapters});
export default { fetch(request,env){return onRequest({request,env})} };
`,resolveDir:process.cwd()},bundle:true,write:false,format:'esm',platform:'neutral',external:['node:*']})).outputFiles[0].text;
let calls=[];
let redirect=null;
const mf=new Miniflare({modules:true,script,compatibilityDate:'2026-07-15',compatibilityFlags:['nodejs_compat'],
 bindings:{COMMENTS_ENABLED:'true',COMMENTS_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture_testing',
 COMMENTS_SIGNING_KEY:Buffer.alloc(32,9).toString('base64url'),COMMENTS_GATEWAY_DB:{connectionString:'synthetic'}},
 outboundService:async req=>{
  const url=new URL(req.url);
  assert.equal(url.origin,'https://pavitnsnmoaiospswiys.supabase.co');
  calls.push(url.pathname);
  assert.equal(req.headers.get('apikey'),'sb_publishable_fixture_testing');
  assert.equal(req.headers.get('authorization'),url.pathname.endsWith('public_list')?null:'Bearer fixture-token');
  if(url.pathname===redirect)return new Response(null,{status:302,headers:{Location:'https://outside.invalid/'}});
  if(url.pathname==='/auth/v1/user')return Response.json({id:'449c2ebb-06b1-4d39-b793-4f01ebb43ecb',is_anonymous:false});
  return Response.json(url.pathname.endsWith('_self')?true:[]);
 }});
try{
 const root='https://comments.denkicontrol.com/api/article-comments/';
 const request=(p,auth)=>mf.dispatchFetch(root+p,{headers:{Origin:'https://denkicontrol.com',...(auth?{Authorization:'Bearer fixture-token'}:{})}});
 const pub='public?article=/articles/example.html';
 const rpc='/rest/v1/rpc/dc_comment_public_list', auth='/auth/v1/user';
 const self='/rest/v1/rpc/dc_comment_moderator_self', list='/rest/v1/rpc/dc_comment_moderation_list';
 let r=await request(pub);assert.equal(r.status,200);assert.deepEqual(await r.json(),{rows:[]});
 assert.equal((await request('moderation',true)).status,200);
 assert.deepEqual(calls,[rpc,auth,self,list]);
 for(const [path,route,bearer,expectedCalls] of [[rpc,pub,false,[rpc]],[auth,'moderation',true,[auth]],[self,'moderation',true,[auth,self]],[list,'moderation',true,[auth,self,list]]]){
   redirect=path;calls=[];
   assert.ok((await request(route,bearer)).status>=400);
   assert.deepEqual(calls,expectedCalls);
 }
 console.log('workerd: production candidate public read and moderator auth/list succeed; four simulated upstream redirects stop without contacting destination.');
}finally{await mf.dispose();}
