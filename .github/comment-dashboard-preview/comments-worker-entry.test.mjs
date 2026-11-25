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
