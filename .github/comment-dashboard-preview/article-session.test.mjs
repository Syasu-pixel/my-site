import assert from 'node:assert/strict';
import test from 'node:test';
import {makeArticleSessions} from './article-session.mjs';
const oldKey=new Uint8Array(32).fill(1),nextKey=new Uint8Array(32).fill(2), req=cookie=>new Request('https://fixture.invalid',{headers:cookie?{cookie}:{}});
const header=r=>r.cookie.split(';')[0];
test('restricted article cookie is stable, signed and separate from account login',async()=>{
 let now=1700000000;
 const store=await makeArticleSessions({keyBytes:oldKey,clock:()=>now});
 const a=await store.ensure(req(null)), b=await store.ensure(req(null)), cookie=header(a);
 assert.notEqual(a.actor,b.actor);
 assert.match(a.cookie,/; Path=\/; Max-Age=15552000; Secure; HttpOnly; SameSite=Strict$/);
 assert.equal(await store.read(req(cookie)),a.actor);
 assert.deepEqual(await store.ensure(req(cookie)),{actor:a.actor,cookie:null});
 assert.equal(await store.read(req('another='+cookie)),null);
 assert.equal(await store.read(req(cookie+'; '+cookie)),null);
 assert.equal(await store.read(req(cookie.replace(a.actor,b.actor))),null);
 assert.equal(await store.read(req(cookie.slice(0,-2)+(cookie.at(-2)==='A'?'B':'A')+cookie.at(-1))),null);
 now+=15552000;assert.equal(await store.read(req(cookie)),null);
 assert.notEqual((await store.ensure(req(cookie))).actor,a.actor);
});
test('a signing key rotation preserves ownership only when previous key is supplied',async()=>{
 const old=await makeArticleSessions({keyBytes:oldKey}),current=await makeArticleSessions({keyBytes:nextKey,previousKeyBytes:[oldKey]}),fresh=await makeArticleSessions({keyBytes:nextKey});
 const first=await old.ensure(req(''));
 assert.equal(await fresh.read(req(header(first))),null);
 const renewed=await current.ensure(req(header(first)));
 assert.equal(renewed.actor,first.actor);
 assert.equal(await fresh.read(req(header(renewed))),first.actor);
 await assert.rejects(makeArticleSessions({keyBytes:new Uint8Array(10)}),TypeError);
});
