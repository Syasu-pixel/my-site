import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../.github/workers/gxworks2-support-api/worker.js',import.meta.url),'utf8');
const mod=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const worker=mod.default;
const originalFetch=globalThis.fetch;

class FakeDB {
  constructor(){
    this.case={
      case_number:'WEB-20260920-TEST0001',
      source:'general',
      source_id:null,
      accepted_at:'2026-09-20T10:00:00.000Z',
      customer_name:'テスト相談者',
      customer_email:'customer@example.com',
      company:'テスト会社',
      category:'技術相談',
      subject:'PLC更新相談',
      summary:'テスト相談',
      status:'deposit_wait',
      assignee:'',
      due_date:null,
      next_action:'',
      estimate_total:100000,
      deposit_amount:30000,
      balance_amount:70000,
      deposit_confirmed_at:null,
      deposit_confirmed_by:null,
      delivered_at:null,
      followup_due_at:null,
      followup_status:'not_scheduled',
      followup_sent_at:null,
      followup_result:'',
      customer_requests:'',
      handoff_note:'',
      created_at:'2026-09-20T10:00:00.000Z',
      updated_at:'2026-09-20T10:00:00.000Z',
      updated_by:'',
    };
    this.events=[];
  }
  prepare(sql){
    const db=this;
    return {
      args:[],
      bind(...args){this.args=args;return this;},
      async run(){
        if(sql.startsWith('CREATE TABLE')||sql.startsWith('CREATE INDEX')) return {meta:{changes:0}};
        if(sql.startsWith('INSERT OR IGNORE INTO admin_cases')) return {meta:{changes:0}};
        if(sql.startsWith('INSERT INTO admin_case_events')){
          const [caseNumber,eventType,fromStatus,toStatus,detail,actor,createdAt]=this.args;
          db.events.push({case_number:caseNumber,event_type:eventType,from_status:fromStatus,to_status:toStatus,detail,actor,created_at:createdAt});
          return {meta:{changes:1}};
        }
        if(sql.startsWith('UPDATE admin_cases SET deposit_confirmed_at=')){
          const [caseNumber,at,by,status]=this.args;
          assert.equal(caseNumber,db.case.case_number);
          Object.assign(db.case,{deposit_confirmed_at:at,deposit_confirmed_by:by,status,updated_at:at,updated_by:by});
          return {meta:{changes:1}};
        }
        if(sql.startsWith('UPDATE admin_cases SET ')){
          const assignments=sql.slice('UPDATE admin_cases SET '.length,sql.indexOf(' WHERE case_number=?1')).split(', ');
          const [caseNumber,...rest]=this.args;
          assert.equal(caseNumber,db.case.case_number);
          for(const assignment of assignments){
            const [field,placeholder]=assignment.split('=');
            const idx=Number(placeholder.slice(1))-2;
            db.case[field]=rest[idx];
          }
          return {meta:{changes:1}};
        }
        throw new Error('Unexpected run SQL: '+sql);
      },
      async first(){
        if(sql.startsWith('SELECT * FROM admin_cases WHERE case_number=')){
          return this.args[0]===db.case.case_number?{...db.case}:null;
        }
        if(sql.startsWith('SELECT case_number,state,accepted_at,updated_at,name,email,company,plc,problem,desired,photo,gxdata,zip_name,zip_size,zip_storage_mode,admin_mail_status,customer_mail_status FROM consultations')){
          return null;
        }
        throw new Error('Unexpected first SQL: '+sql);
      },
      async all(){
        if(sql.startsWith('SELECT * FROM admin_cases ORDER BY')) return {results:[{...db.case}]};
        if(sql.startsWith('SELECT event_type, from_status, to_status, detail, actor, created_at FROM admin_case_events')){
          return {results:[...db.events].reverse()};
        }
        throw new Error('Unexpected all SQL: '+sql);
      },
    };
  }
}

const payload=Buffer.from(JSON.stringify({email:'admin@example.com'})).toString('base64url');
const token='eyJhbGciOiJub25lIn0.'+payload+'.x';
const authHeaders={Origin:'https://denkicontrol.com',Authorization:'Bearer '+token};

let supabaseCalls=0;
globalThis.fetch=async (url,init={})=>{
  const href=String(url);
  if(href==='https://pavitnsnmoaiospswiys.supabase.co/rest/v1/rpc/admin_article_feedback_dashboard'){
    supabaseCalls++;
    const headers=new Headers(init.headers||{});
    assert.equal(headers.get('Authorization'),'Bearer '+token);
    return new Response(JSON.stringify({summary:{}}),{status:200,headers:{'Content-Type':'application/json'}});
  }
  throw new Error('Unexpected fetch URL: '+href);
};

try{
  const env={DB:new FakeDB()};

  const preflight=await worker.fetch(new Request('https://worker.example/admin/cases',{
    method:'OPTIONS',
    headers:{Origin:'https://denkicontrol.com'},
  }),env);
  assert.equal(preflight.status,204);
  assert.match(preflight.headers.get('Access-Control-Allow-Methods')||'',/PATCH/);

  const unauthorized=await worker.fetch(new Request('https://worker.example/admin/cases',{
    method:'GET',
    headers:{Origin:'https://denkicontrol.com'},
  }),env);
  assert.equal(unauthorized.status,401);

  const list=await worker.fetch(new Request('https://worker.example/admin/cases',{
    method:'GET',
    headers:authHeaders,
  }),env);
  assert.equal(list.status,200);
  const listJson=await list.json();
  assert.equal(listJson.ok,true);
  assert.equal(listJson.cases.length,1);
  assert.equal(listJson.cases[0].case_number,env.DB.case.case_number);

  const detail=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'GET',
    headers:authHeaders,
  }),env);
  assert.equal(detail.status,200);
  const detailJson=await detail.json();
  assert.equal(detailJson.case.status,'deposit_wait');

  const invalid=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',
    headers:{...authHeaders,'Content-Type':'application/json'},
    body:JSON.stringify({status:'not-a-status'}),
  }),env);
  assert.equal(invalid.status,400);

  const patched=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',
    headers:{...authHeaders,'Content-Type':'application/json'},
    body:JSON.stringify({status:'estimating',assignee:'中村',next_action:'見積書を作成'}),
  }),env);
  assert.equal(patched.status,200);
  const patchedJson=await patched.json();
  assert.equal(patchedJson.case.status,'estimating');
  assert.equal(patchedJson.case.assignee,'中村');
  assert.equal(patchedJson.case.next_action,'見積書を作成');
  assert.equal(patchedJson.case.updated_by,'admin@example.com');
  assert.ok(env.DB.events.some(e=>e.event_type==='status_changed'));

  env.DB.case.status='deposit_wait';
  const deposit=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/deposit-confirm',{
    method:'POST',
    headers:{...authHeaders,'Content-Type':'application/json'},
    body:'{}',
  }),env);
  assert.equal(deposit.status,200);
  const depositJson=await deposit.json();
  assert.equal(depositJson.case.status,'working');
  assert.equal(depositJson.case.deposit_confirmed_by,'admin@example.com');
  assert.ok(depositJson.case.deposit_confirmed_at);
  assert.ok(env.DB.events.some(e=>e.event_type==='deposit_confirmed'));

  assert.ok(supabaseCalls>=5);

  console.log(JSON.stringify({
    ok:true,
    checks:[
      'PATCH preflight',
      'unauthorized rejection',
      'admin authorization',
      'case list',
      'case detail route',
      'invalid status rejection',
      'case patch and audit event',
      'deposit confirmation transition'
    ]
  }));
} finally {
  globalThis.fetch=originalFetch;
}
