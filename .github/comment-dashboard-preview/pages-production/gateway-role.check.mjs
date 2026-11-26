import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const {PGlite}=await import(process.env.PGLITE_ENTRY??'@electric-sql/pglite');
const db=new PGlite();
const load=path=>readFile(new URL(path,import.meta.url),'utf8');
const entry=(await load('./gateway-role.review.sql'));
try{
 await db.exec(`create role anon nologin; create role authenticated nologin;
 create schema auth;
 create function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
 create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
 create table public.ai_editorial_admins (user_id uuid primary key);`);
 await db.exec(entry);
 for(const f of ['moderation-postgres','public-comments-postgres','article-write-postgres'])
  await db.exec(await load('../'+f+'.review.sql'));
 const who='dc_comment_production_gateway';
 const {rows:[r]}=await db.query(`
 select rolcanlogin,rolsuper,rolcreatedb,rolcreaterole,rolreplication,rolbypassrls,
 has_table_privilege(rolname,'public.ai_editorial_admins','SELECT') as admin_table,
 has_schema_privilege(rolname,'dc_comment_private','USAGE') as private_schema,
 has_function_privilege('anon','public.dc_comment_gateway_eligible(text)','EXECUTE') as anon_gateway,
 has_function_privilege(rolname,'public.dc_comment_gateway_eligible(text)','EXECUTE') as can_check,
 has_function_privilege(rolname,'public.dc_comment_gateway_own(text,uuid)','EXECUTE') as can_read_own,
 has_function_privilege(rolname,'public.dc_comment_gateway_write(text,uuid,uuid,uuid,uuid,integer,text,text,boolean)','EXECUTE') as can_write,
 has_function_privilege(rolname,'public.dc_comment_moderator_self()','EXECUTE') as admin_rpc
 from pg_roles where rolname=$1`,[who]);
 assert.deepEqual(r,{rolcanlogin:false,rolsuper:false,rolcreatedb:false,rolcreaterole:false,rolreplication:false,
  rolbypassrls:false,admin_table:false,private_schema:false,anon_gateway:false,can_check:true,can_read_own:true,can_write:true,admin_rpc:false});
 const result=await db.transaction(async t=>{
  await t.exec('set local role dc_comment_production_gateway');
  return (await t.query("select public.dc_comment_gateway_eligible('/articles/example.html') as eligible")).rows[0];
 });
 assert.deepEqual(result,{eligible:false});
 console.log('Isolated PostgreSQL verified: no login/privileged access; only gateway role can use the private comment RPC; no articles enabled.');
}finally{await db.close();}
