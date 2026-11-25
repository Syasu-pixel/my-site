// Run with PGLITE_ENTRY pointing to @electric-sql/pglite 0.3.15 (dist/index.js).
// Local real PostgreSQL engine, synthetic auth claims and rows only. No network.
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createBoundModeration} from './moderation-supabase-boundary.mjs';

const {PGlite}=await import(process.env.PGLITE_ENTRY??'@electric-sql/pglite');
const dir=await mkdtemp(join(tmpdir(),'dc-comment-postgres-'));
const path='/articles/sample.html',otherPath='/articles/disabled.html',origin='https://localhost.invalid';
const actors={admin:'50000001-aaaa-4311-8222-000000000001',reader:'50000002-aaaa-4311-8222-000000000002',anonymous:'50000003-aaaa-4311-8222-000000000003'};
const ids={post:'60000001-aaaa-4311-8222-000000000001',reply:'60000002-aaaa-4311-8222-000000000002',disabled:'60000003-aaaa-4311-8222-000000000003'};
const checks=[];const ok=name=>checks.push(name);
let db=new PGlite(dir);
const data=(body)=>JSON.stringify({body,nickname:'合成',editor:'投稿者',consent:true});
const statements={
 dc_comment_moderator_self:['select public.dc_comment_moderator_self() as data',[]],
 dc_comment_moderation_list:['select public.dc_comment_moderation_list($1,$2,$3) as data',['p_state','p_limit','p_after']],
 dc_comment_moderation_apply:['select public.dc_comment_moderation_apply($1,$2,$3,$4,$5,$6) as data',['p_path','p_id','p_action','p_rev','p_body','p_nickname']],
};
const claims=async (tx,token,role='authenticated')=>{
 assert(['anon','authenticated'].includes(role));
 await tx.exec('set local role '+role);
 await tx.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:actors[token],is_anonymous:token==='anonymous'})]);
};
const endpoint=origin+'/api/article-comments/moderation';
function handler(){
 return createBoundModeration({origin,authClient:{auth:{getUser:async token=>actors[token]?{data:{user:{id:actors[token],is_anonymous:token==='anonymous'}}}:{error:{code:'expired'}}}},createActorClient:async ({accessToken})=>({
  rpc:async(name,args={})=>{
   try{return await db.transaction(async tx=>{
    await claims(tx,accessToken);
    const [sql,keys]=statements[name];
    const {rows}=await tx.query(sql,keys.map(k=>args[k]));
    return {data:rows[0].data};
   })}catch(error){return {error};}
  }
 })});
}
function request(token,op,state,after=null){
 return new Request(endpoint+(state?'?state='+state+(after?'&after='+encodeURIComponent(after):''):''),{method:op?'POST':'GET',headers:{...(token?{authorization:'Bearer '+token}:{}),...(op?{origin,'content-type':'application/json'}:{})},body:op?JSON.stringify(op):undefined});
}
const readPublic=async(article=path)=>db.transaction(async tx=>{
 await claims(tx,undefined,'anon');
 const {rows}=await tx.query('select public.dc_comment_public_list($1) as data',[article]);
 return rows[0].data;
});
const act=(action,id,rev,fields={})=>handler()(request('admin',{path,id,action,rev,...fields}));
const list=async(token,state)=>{const r=await handler()(request(token,null,state));assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'private, no-store');return (await r.json()).rows;};

try {
 await db.exec(`create role anon nologin; create role authenticated nologin;
 create schema auth;
 create function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb
 $$;
 create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
 create table public.ai_editorial_admins (user_id uuid primary key);`);
 await db.exec(await readFile(new URL('./moderation-postgres.review.sql',import.meta.url),'utf8'));
 await db.exec(await readFile(new URL('./public-comments-postgres.review.sql',import.meta.url),'utf8'));
 await db.query('insert into public.ai_editorial_admins values($1),($2)',[actors.admin,actors.anonymous]);
 await db.query('insert into dc_comment_private.article(path,enabled) values($1,true),($2,false)',[path,otherPath]);
 for(const [id,p,parent,body] of [[ids.post,path,null,'合成の親'],[ids.reply,path,ids.post,'合成の返信'],[ids.disabled,otherPath,null,'非表示記事']]){
  await db.query('insert into dc_comment_private.entry(id,path,parent,author_id,pending) values($1,$2,$3,$4,$5)',[id,p,parent,actors.reader,data(body)]);
 }
 for(const [token,status] of [[null,401],['unknown',403],['reader',403],['anonymous',403]]){
  const r=await handler()(request(token,null,'pending'));assert.equal(r.status,status);assert(!JSON.stringify(await r.json()).includes('合成'));
 }
 await assert.rejects(db.transaction(async t=>{await claims(t,'admin','anon');return t.query('select public.dc_comment_moderator_self()');}),{code:'42501'});
 await assert.rejects(db.transaction(async t=>{await claims(t,'reader');return t.query('select * from dc_comment_private.entry');}),{code:'42501'});
 ok('非管理者・匿名ログイン・未ログイン・直接テーブル参照を拒否');

 const initial=await list('admin','pending');assert.equal(initial.length,2);assert(!JSON.stringify(initial).includes(actors.reader));
 assert.deepEqual(await list('admin','published'),[]);
 assert.deepEqual(await readPublic(),[]);
 assert.equal(initial.find(row=>row.id===ids.reply).parentUnavailable,true);
 assert.equal((await act('approve',ids.reply,1)).status,409);
 assert.equal((await act('approve',ids.post,1)).status,200);
 assert.equal((await act('approve',ids.reply,1)).status,200);
 const publicAfter=await readPublic();
 assert.deepEqual(publicAfter.map(x=>[x.id,x.parent,x.body]),[[ids.post,null,'合成の親'],[ids.reply,ids.post,'合成の返信']]);
 assert(publicAfter.every(x=>Object.keys(x).sort().join(',')==='body,editor,id,nickname,parent'));
 await db.query('update dc_comment_private.entry set published=pending where id=$1',[ids.disabled]);
 assert.deepEqual(await readPublic(otherPath),[]);
 assert.deepEqual(await readPublic('/categories/sample.html'),[]);
 ok('承認前は非公開、親の承認後のみ返信承認、無効な記事は除外');
 const [parent]= (await list('admin','published')).filter(r=>r.id===ids.post);assert.equal(parent.mayFeature,true);
 await db.query('update dc_comment_private.entry set pending=$1,rev=rev+1 where id=$2',[data('投稿者の新しい修正版'),ids.post]);
 assert.equal((await act('edit',ids.post,parent.rev,{body:'管理者の旧案',nickname:''})).status,409);
 assert.equal((await act('hide',ids.post,parent.rev)).status,409);
 assert.equal((await act('approve',ids.post,parent.rev)).status,409);
 assert.equal((await readPublic())[0].body,'合成の親');
 let [current]=(await list('admin','published')).filter(r=>r.id===ids.post);
 assert.equal(current.body,'合成の親');assert.equal(current.hasPendingEdit,true);assert.equal(current.mayFeature,false);
 assert.equal((await act('edit',ids.post,current.rev,{body:'運営の修正',nickname:''})).status,200);
 const [pending]=await list('admin','pending');assert.equal(pending.nickname,'匿名');
 assert.equal((await list('admin','published')).find(r=>r.id===ids.post).body,'合成の親');
 assert.equal((await act('approve',ids.post,pending.rev)).status,200);
 [current]=(await list('admin','published')).filter(r=>r.id===ids.post);
 assert.equal((await readPublic())[0].body,'運営の修正');
 assert.equal(current.body,'運営の修正');assert.equal(current.mayFeature,false);
 ok('古い画面からの操作を拒否、編集は再承認、運営編集は本文紹介同意を引き継がない');

 await db.close();db=new PGlite(dir);
 assert.equal((await list('admin','published')).find(r=>r.id===ids.post).body,'運営の修正');
 assert.equal((await act('hide',ids.post,current.rev)).status,200);
 assert.deepEqual(await list('admin','published'),[]);
 assert.deepEqual(await readPublic(),[]);
 ok('記事側は承認済みの版だけを表示し、個人識別子・同意・保留版を返さない');
 const {rows}=await db.query('select action,from_rev from dc_comment_private.moderation_event order by id');
 assert.deepEqual(rows.map(x=>x.action),['approve','approve','edit','approve','hide']);
 ok('データベースを開き直しても承認が残る、親の非表示で返信も非表示、操作履歴が残る');

 await db.query(`insert into dc_comment_private.entry(id,path,author_id,pending,created_at)
   select ('70000001-aaaa-4311-8222-'||lpad(n::text,12,'0'))::uuid,$1,$2,$3,'2026-11-25T13:00:00Z'
   from generate_series(1,51) n`,[path,actors.reader,data('一覧ページの合成')]);
 const r1=await handler()(request('admin',null,'pending'));
 assert.equal(r1.status,200);
 const first=await r1.json();
 assert.equal(first.rows.length,50);
 assert.equal(first.next,'70000001-aaaa-4311-8222-000000000050');
 assert.equal((await act('decline',first.next,1)).status,200);
 const older=await handler()(request('admin',null,'pending',first.next));
 assert.equal(older.status,200);
 const last=await older.json();
 assert.deepEqual(last.rows.map(row=>row.id),['70000001-aaaa-4311-8222-000000000051']);
 assert.equal(last.next,null);
 assert.equal((await handler()(request('reader',null,'pending',first.next))).status,403);
 ok('同時刻の51件を安定順でページ送り、最後の表示行が見送り後も移動可・非管理者は拒否');

 await db.query('delete from public.ai_editorial_admins where user_id=$1',[actors.admin]);
 assert.equal((await handler()(request('admin',null,'pending'))).status,403);
 await assert.rejects(db.transaction(async t=>{await claims(t,'admin');return t.query("select public.dc_comment_moderation_apply($1,$2,'hide',2,null,null)",[path,ids.reply]);}),{code:'42501'});
 ok('権限を取り消した後は一覧・保存とも拒否');
 console.log(JSON.stringify({checks,engine:'PGlite/PostgreSQL',localOnly:true},null,2));
} finally {
 await db.close();
 await rm(dir,{force:true,recursive:true});
}
