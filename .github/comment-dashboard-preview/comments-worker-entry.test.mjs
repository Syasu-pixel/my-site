import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildCommentsEntrypoint as build} from './comments-worker-entry.mjs';
const origin='https://local.example';
const enabled={COMMENTS_ENABLED:'true'};
const endpoint=(part,opts)=>new Request(origin+'/api/article-comments/'+part,opts);
const response=data=>({rows:[{data}]});
test('configuration is disabled by default and no adapter connects until allowed',async()=>{
 let n=0;const h=build({origin,openAdapters:async()=>{n++;throw Error('secret');}});
 assert.equal((await h(endpoint('public'))).status,503);
 assert.equal((await h(endpoint('public'),{COMMENTS_ENABLED:true})).status,503);
 assert.equal((await h(new Request('https://else.example/api/article-comments/public'),enabled)).status,404);
 assert.equal((await h(endpoint('unknown'),enabled)).status,404);
 assert.equal((await h(endpoint('public',{headers:{Origin:'https://else.example'}}),enabled)).status,403);
 assert.equal(n,0);
 const err=await h(endpoint('public'),enabled);
 assert.equal(err.status,503);
 assert.match(err.headers.get('cache-control'),/no-store/);
 assert.doesNotMatch(await err.text(),/secret/);
});
test('public selection and signed session use separate adapter boundaries',async()=>{
 let gateway=0;
 const h=build({origin,openAdapters:async()=>({
 keyBytes:new Uint8Array(32).fill(14),
 gatewayQuery:async(sql,args)=>{gateway++;assert.match(sql,/gateway_eligible/);assert.deepEqual(args,['/articles/example.html']);return response(true);},
 publicQuery:async(sql,args)=>{assert.match(sql,/public_list/);assert.deepEqual(args,['/articles/example.html']);return response([]);}
 })});
 const query='?article=/articles/example.html';
 const result=await h(endpoint('public'+query,{headers:{Cookie:'__Host-dc_comment=irrelevant'}}),enabled);
 assert.equal(result.status,200);assert.deepEqual(await result.json(),{rows:[]});assert.equal(result.headers.get('set-cookie'),null);assert.equal(gateway,0);
 const form=await h(endpoint('session'+query,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),enabled);
 assert.equal(form.status,200);assert.match(form.headers.get('set-cookie'),/^__Host-dc_comment=.*; Secure; HttpOnly; SameSite=Strict$/);assert.equal(gateway,1);
});
test('an unverified moderator cannot reach private data when reader bindings are absent',async()=>{
 let n=0;const h=build({origin,openAdapters:async()=>({
 authClient:{auth:{getUser:async()=>({data:{user:null}})}},
 createActorClient:async()=>{n++;throw Error('must not run');}
 })});
 assert.equal((await h(endpoint('moderation'),enabled)).status,401);
 assert.equal((await h(endpoint('moderation',{headers:{Authorization:'Bearer synthetic'}}),enabled)).status,403);
 assert.equal(n,0);
});

const site='https://denkicontrol.com', api='https://comments.denkicontrol.com';
const direct=(part,{from=site,method='GET',headers={},body}={})=>new Request(api+'/api/article-comments/'+part,{
 method,headers:{...(from===null?{}:{Origin:from}),...headers},body
});
test('dedicated host authorizes only exact site and route-specific browser preflights, without opening storage',async()=>{
 let opened=0;
 const h=build({origin:site,apiOrigin:api,openAdapters:async()=>{opened++;throw Error('secret');}});
 for(const from of [null,'null','https://another.denkicontrol.com','https://denkicontrol.com.invalid']){
  const r=await h(direct('public',{from}),enabled);
  assert.equal(r.status,403);assert.equal(r.headers.get('access-control-allow-origin'),null);
 }
 const options=(part,method,requested)=>direct(part,{method:'OPTIONS',
  headers:{'Access-Control-Request-Method':method,'Access-Control-Request-Headers':requested}});
 const allowed=await h(options('moderation','POST','authorization, content-type'),enabled);
 assert.equal(allowed.status,204);assert.equal(allowed.headers.get('access-control-allow-origin'),site);
 assert.equal(allowed.headers.get('access-control-allow-credentials'),null);
 assert.match(allowed.headers.get('vary'),/Origin/);
 const session=await h(options('session','POST','Content-Type'),enabled);
 assert.equal(session.status,204);assert.equal(session.headers.get('access-control-allow-credentials'),'true');
 assert.equal((await h(options('session','POST','authorization'),enabled)).status,403);
 assert.equal((await h(options('public','POST','content-type'),enabled)).status,403);
 assert.equal((await h(options('moderation','POST','authorization'),{})).status,503);
 assert.equal((await h(direct('session'),enabled)).status,405);
 assert.equal((await h(new Request(site+'/api/article-comments/public'),enabled)).status,404);
 assert.equal((await build({origin:site,apiOrigin:'https://other.example',openAdapters:()=>{opened++;}})(direct('public'),enabled)).status,404);
 assert.equal(opened,0);
});

test('dedicated host: reader posts, separate reader cannot see it, existing operator path approves',async t=>{
 const {openPreviewStore}=await import('./sqlite-preview-store.mjs');
 const {makeArticleClient}=await import('./article-client.mjs');
 const {makeClient}=await import('./dashboard-client.mjs');
 const path='/articles/example.html', adminId='449c2ebb-06b1-4d39-b793-4f01ebb43ecb';
 const db=openPreviewStore({file:':memory:',eligible:[path],operatorIds:[adminId]});t.after(()=>db.close());
 const h=build({origin:site,apiOrigin:api,openAdapters:async()=>({
  keyBytes:new Uint8Array(32).fill(14),
  publicQuery:async(sql,[p])=>response(db.publicFor(p)),
  gatewayQuery:async(sql,args)=>{
   if(sql.includes('gateway_eligible'))return response(args[0]===path);
   if(sql.includes('gateway_own'))return response(db.ownFor(...args));
   const [p,actor,requestId,,parent,,body,nickname,consent]=args;
   return response(db.post(p,actor,{requestId,parent,body,nickname,consent}));
  },
  authClient:{auth:{getUser:async token=>({data:{user:token==='fixture-only'?{id:adminId,is_anonymous:false}:null}})}},
  createActorClient:async()=>({rpc:async(name,a)=>{
   if(name.endsWith('_self'))return {data:true};
   if(name.endsWith('_list'))return {data:db.list({adminId,state:a.p_state,limit:a.p_limit,after:a.p_after})};
   db.apply({adminId,path:a.p_path,id:a.p_id,rev:a.p_rev,action:a.p_action});return {data:true};
  }})
 })});
 const browser=()=>{let cookie='';return async(url,opts)=>{
  assert.equal(new URL(url).origin,api);
  assert.equal(opts.redirect,'error');
  const part=new URL(url).pathname.split('/').at(-1), headers=new Headers(opts.headers);
  headers.set('Origin',site);
  const separate=part==='public'||part==='moderation';
  assert.equal(opts.credentials,separate?'omit':'include');
  if(!separate&&cookie)headers.set('Cookie',cookie);
  const r=await h(new Request(url,{...opts,headers}),enabled);
  assert.equal(r.headers.get('access-control-allow-origin'),site);
  assert.equal(r.headers.get('access-control-allow-credentials'),separate?null:'true');
  assert.match(r.headers.get('cache-control'),/no-store/);
  const content=r.headers.get('set-cookie');
  if(content){assert.equal(part,'session');assert(!/Domain=/i.test(content));cookie=content.split(';')[0];}
  return r;
 };};
 assert.throws(()=>makeClient({apiOrigin:'https://else.invalid'}),/接続先/);
 assert.throws(()=>makeArticleClient({path,apiOrigin:'https://else.invalid'}),/接続先/);
 const author=makeArticleClient({path,apiOrigin:api,fetcher:browser()});
 const stranger=makeArticleClient({path,apiOrigin:api,fetcher:browser()});
 const pending=await author.submit({action:'post',requestId:'demo-1',body:'合成コメント',nickname:''});
 assert.equal(pending[0].body,'合成コメント');
 assert.deepEqual(await stranger.pendingRows(),[]);assert.deepEqual(await stranger.publicRows(),[]);
 const dashboard=makeClient({apiOrigin:api,fetcher:browser(),getToken:async()=>'fixture-only'});
 const [row]=await dashboard.list('pending');
 assert.equal(row.body,'合成コメント');assert.equal(row.path,path);
 await dashboard.apply({id:row.id,path,rev:row.rev,action:'approve'});
 assert.equal((await stranger.publicRows())[0].body,'合成コメント');
});


test('Pages event boundary keeps production host exact, defaults to off and never passes unknown paths through',async()=>{
 const {buildPagesCommentsOnRequest}=await import('./comments-worker-entry.mjs');
 let opened=0;
 const onRequest=buildPagesCommentsOnRequest({openAdapters:env=>{
  opened++;assert.equal(env.COMMENTS_ENABLED,'true');
  return {keyBytes:new Uint8Array(32).fill(14),gatewayQuery:async()=>response(false),publicQuery:async()=>response([])};
 }});
 const part='public?article=/articles/example.html';
 assert.equal((await onRequest()).status,503);
 assert.equal((await onRequest({request:direct(part)})).status,503);
 const preview=new Request('https://fixture.pages.dev/api/article-comments/'+part,{headers:{Origin:site}});
 assert.equal((await onRequest({request:preview,env:enabled})).status,404);
 assert.equal((await onRequest({request:direct('unrelated'),env:enabled})).status,404);
 assert.equal(opened,0);
 const r=await onRequest({request:direct(part),env:enabled});assert.equal(r.status,200);
 assert.equal(r.headers.get('access-control-allow-origin'),site);
 assert.equal(r.headers.get('set-cookie'),null);
 assert.equal(opened,1);
 assert.equal((await buildPagesCommentsOnRequest()({request:direct(part),env:enabled})).status,503);
});

test('Pages adapters separate public lookup, existing moderator token and restricted private SQL',async()=>{
 const {buildPagesCommentAdapters,buildPagesCommentsOnRequest}=await import('./comments-worker-entry.mjs');
 const network=[], db=[];
 const bindings={...enabled,COMMENTS_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic_only',
  COMMENTS_SIGNING_KEY:Buffer.alloc(32,17).toString('base64url'),
  COMMENTS_GATEWAY_DB:{connectionString:'synthetic-database-binding'}};
 const openAdapters=buildPagesCommentAdapters({
  openDatabase:async binding=>{
   db.push(['open',binding]);return {query:async(sql,params)=>{
    db.push([sql,params]);return response(true);
   },close:()=>{db.push(['close']);}};
  },
  fetcher:async(url,init)=>{
   const u=new URL(url);
   assert.equal(u.origin,'https://pavitnsnmoaiospswiys.supabase.co');
   assert.equal(init.redirect,'error');assert.equal(init.credentials,'omit');assert.equal(init.cache,'no-store');
   assert.equal(init.headers.apikey,bindings.COMMENTS_SUPABASE_PUBLISHABLE_KEY);
   network.push([u.pathname,init.headers.Authorization,init.body]);
   if(u.pathname==='/auth/v1/user')return Response.json({id:'449c2ebb-06b1-4d39-b793-4f01ebb43ecb',is_anonymous:false});
   if(u.pathname.endsWith('_self'))return Response.json(true);
   return Response.json([]);
  }
 });
 const onRequest=buildPagesCommentsOnRequest({openAdapters});
 const article='?article=/articles/example.html';
 const request=(part,opts,env=bindings)=>onRequest({request:direct(part,opts),env});
 assert.equal((await request('public'+article,{}, {...bindings,COMMENTS_SIGNING_KEY:'invalid'})).status,503);
 assert.equal((await request('public'+article,{}, {...bindings,COMMENTS_SUPABASE_PUBLISHABLE_KEY:'sb_secret_never_use_this'})).status,503);
 assert.equal(network.length,0);assert.equal(db.length,0);
 assert.equal((await request('public'+article,{headers:{Cookie:'ignored-fixture'}})).status,200);
 assert.deepEqual(network[0],['/rest/v1/rpc/dc_comment_public_list',undefined,'{"p_path":"/articles/example.html"}']);
 assert.equal(db.length,0);
 const session=await request('session'+article,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
 assert.equal(session.status,200);assert(session.headers.has('set-cookie'));
 assert.deepEqual(db.map(x=>x[0]),['open','select public.dc_comment_gateway_eligible($1) as data','close']);
 assert.equal((await request('moderation',{headers:{Authorization:'Bearer fixture-operator'}})).status,200);
 assert.deepEqual(network.slice(1).map(v=>v.slice(0,2)),[
  ['/auth/v1/user','Bearer fixture-operator'],
  ['/rest/v1/rpc/dc_comment_moderator_self','Bearer fixture-operator'],
  ['/rest/v1/rpc/dc_comment_moderation_list','Bearer fixture-operator']
 ]);
 const a=await openAdapters(bindings);
 await assert.rejects(a.gatewayQuery('select 1',[]),/Unregistered/);
 assert.throws(()=>a.createActorClient({accessToken:'fixture-operator'}).rpc('other'),/Unregistered/);
 assert.equal(network.length,4);assert.equal(db.length,3);
});

test('restricted database is closed even if its operation fails',async()=>{
 const {buildPagesCommentAdapters}=await import('./comments-worker-entry.mjs');
 let closed=0;
 const open=buildPagesCommentAdapters({openDatabase:async()=>({query:async()=>{throw Error('fixture unavailable');},close:async()=>{closed++;}})});
 const a=await open({COMMENTS_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic_only',
  COMMENTS_SIGNING_KEY:Buffer.alloc(32,17).toString('base64url'),COMMENTS_GATEWAY_DB:{connectionString:'synthetic'}});
 await assert.rejects(a.gatewayQuery('select public.dc_comment_gateway_eligible($1) as data',['/articles/example.html']),/fixture unavailable/);
 assert.equal(closed,1);
});

test('staging requires distinct bindings; public, auth and operator APIs only reach the staging project',async()=>{
 const {buildPagesStagingCommentAdapters}=await import('./comments-worker-entry.mjs');
 const ref='abcdefghijklmnopqrst';
 const env={COMMENTS_STAGING_SUPABASE_PROJECT_REF:ref,
  COMMENTS_STAGING_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_staging_fixture',
  COMMENTS_STAGING_SIGNING_KEY:Buffer.alloc(32,19).toString('base64url'),
  COMMENTS_STAGING_GATEWAY_DB:{connectionString:'staging-only'}};
 const urls=[],queries=[];
 let role='dc_comment_staging_'+ref;
 const open=buildPagesStagingCommentAdapters({
  fetcher:async(url,opts)=>{
   assert.equal(new URL(url).origin,'https://'+ref+'.supabase.co');
   assert.equal(opts.headers.apikey,env.COMMENTS_STAGING_SUPABASE_PUBLISHABLE_KEY);
   urls.push(new URL(url).pathname);
   return Response.json(url.endsWith('/user')?{id:'449c2ebb-06b1-4d39-b793-4f01ebb43ecb'}:[]);
  },
  openDatabase:async connection=>{
   assert.equal(connection,'staging-only');
   return {query:async(sql,args)=>{
    queries.push(sql);
    return sql==='select current_user as role'?{rows:[{role}]}:response(true);
   },close:async()=>queries.push('close')};
  }
 });
 await assert.rejects(open({...env,COMMENTS_STAGING_SUPABASE_PROJECT_REF:'pavitnsnmoaiospswiys'}),/isolated staging project/);
 await assert.rejects(open({...env,COMMENTS_STAGING_SUPABASE_PROJECT_REF:'url.invalid'}),/isolated staging project/);
 await assert.rejects(open({...env,COMMENTS_STAGING_GATEWAY_DB:null,COMMENTS_GATEWAY_DB:{connectionString:'production'}}),/restricted bindings/);
 await assert.rejects(open({...env,COMMENTS_STAGING_SUPABASE_PUBLISHABLE_KEY:null,COMMENTS_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_production_fixture'}),/restricted bindings/);
 assert.deepEqual(urls,[]);assert.deepEqual(queries,[]);
 const adapter=await open(env);
 await adapter.publicQuery('select public.dc_comment_public_list($1) as data',['/articles/example.html']);
 await adapter.authClient.auth.getUser('fixture-only');
 await adapter.createActorClient({accessToken:'fixture-only'}).rpc('dc_comment_moderation_list');
 assert.deepEqual(urls,['/rest/v1/rpc/dc_comment_public_list','/auth/v1/user','/rest/v1/rpc/dc_comment_moderation_list']);
 const sql='select public.dc_comment_gateway_eligible($1) as data';
 await adapter.gatewayQuery(sql,['/articles/example.html']);
 role='dc_comment_production';
 await assert.rejects(adapter.gatewayQuery(sql,['/articles/example.html']),/Wrong staging gateway role/);
 assert.deepEqual(queries,['select current_user as role',sql,'close','select current_user as role','close']);
});
