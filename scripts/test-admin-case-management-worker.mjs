import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {planCaseAutomation, NEXT_ACTION_DEFAULTS, addCalendarDays, isCalendarDate, tokyoDate, isJapanBusinessDay, addJapanBusinessDays} from '../admin/case-automation.mjs';

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
      assignee_email:'',
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
        if(sql.startsWith('CREATE TABLE')||sql.startsWith('CREATE INDEX')||sql.startsWith('ALTER TABLE')) return {meta:{changes:0}};
        if(sql.startsWith('INSERT OR IGNORE INTO admin_cases')) return {meta:{changes:0}};
        if(sql.startsWith('INSERT INTO admin_case_events')){
          const [caseNumber,eventType,fromStatus,toStatus,detail,actor,createdAt]=this.args;
          db.events.push({case_number:caseNumber,event_type:eventType,from_status:fromStatus,to_status:toStatus,detail,actor,created_at:createdAt});
          return {meta:{changes:1}};
        }
        if(sql.startsWith('UPDATE admin_cases SET assignee=?2 WHERE LOWER(TRIM(assignee_email))=?1')){
          const [email,name]=this.args;
          const current=String(db.case.assignee_email||'').trim().toLowerCase();
          if(current===email&&db.case.assignee!==name){db.case.assignee=name;return {meta:{changes:1}}}
          return {meta:{changes:0}};
        }
        if(sql.startsWith('UPDATE admin_cases SET ')){
          const assignments=sql.slice('UPDATE admin_cases SET '.length,sql.indexOf(' WHERE case_number=?1')).split(/,\s*/);
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
        if(sql.startsWith('SELECT case_number,accepted_at,due_date FROM admin_cases WHERE')){
          return {results:db.case.due_date?[]:[{case_number:db.case.case_number,accepted_at:db.case.accepted_at,due_date:db.case.due_date}]};
        }
        if(sql.startsWith('SELECT event_type, from_status, to_status, detail, actor, created_at FROM admin_case_events')){
          return {results:[...db.events].reverse()};
        }
        throw new Error('Unexpected all SQL: '+sql);
      },
    };
  }
}

const payload=Buffer.from(JSON.stringify({email:'admin@example.com',user_metadata:{full_name:'担当A'}})).toString('base64url');
const token='eyJhbGciOiJub25lIn0.'+payload+'.x';
const payload2=Buffer.from(JSON.stringify({email:'admin2@example.com',user_metadata:{full_name:'担当B'}})).toString('base64url');
const token2='eyJhbGciOiJub25lIn0.'+payload2+'.x';
const payload3=Buffer.from(JSON.stringify({email:'admin@example.com',user_metadata:{full_name:'中村 宏樹'}})).toString('base64url');
const token3='eyJhbGciOiJub25lIn0.'+payload3+'.x';
const authHeaders={Origin:'https://denkicontrol.com',Authorization:'Bearer '+token};
const authHeaders2={Origin:'https://denkicontrol.com',Authorization:'Bearer '+token2};
const authHeaders3={Origin:'https://denkicontrol.com',Authorization:'Bearer '+token3};
const validTokens=new Set([token,token2,token3]);

let supabaseCalls=0;
let estimateSheetCalls=0;
let lastEstimatePayload=null;
globalThis.fetch=async (url,init={})=>{
  const href=String(url);
  if(href==='https://pavitnsnmoaiospswiys.supabase.co/rest/v1/rpc/admin_article_feedback_dashboard'){
    supabaseCalls++;
    const headers=new Headers(init.headers||{});
    assert.ok(validTokens.has(String(headers.get('Authorization')||'').replace(/^Bearer\s+/,'')));
    return new Response(JSON.stringify({summary:{}}),{status:200,headers:{'Content-Type':'application/json'}});
  }
  if(href==='https://script.google.com/macros/s/test-estimate/exec'){
    estimateSheetCalls++;
    lastEstimatePayload=JSON.parse(String(init.body||'{}'));
    assert.equal(lastEstimatePayload.secret,'estimate-secret');
    assert.equal(init.method,'POST');
    return new Response(JSON.stringify({
      ok:true,
      created:estimateSheetCalls===1,
      url:'https://docs.google.com/spreadsheets/d/test-estimate-sheet/edit',
      title:'見積書_'+lastEstimatePayload.case_number
    }),{status:200,headers:{'Content-Type':'application/json'}});
  }
  throw new Error('Unexpected fetch URL: '+href);
};

try{
  const env={
    DB:new FakeDB(),
    ESTIMATE_SHEET_WEBAPP_URL:'https://script.google.com/macros/s/test-estimate/exec',
    ESTIMATE_SHEET_WEBHOOK_SECRET:'estimate-secret'
  };

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
  assert.equal(listJson.cases[0].due_date,'2026-09-25');
  assert.ok(env.DB.events.some(e=>e.event_type==='due_date_auto_set'));

  const detail=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'GET',
    headers:authHeaders,
  }),env);
  assert.equal(detail.status,200);
  const detailJson=await detail.json();
  assert.equal(detailJson.case.status,'deposit_wait');
  assert.equal(detailJson.permissions.canEdit,true);
  assert.equal(detailJson.permissions.assigned,false);
  assert.equal(detailJson.viewer.name,'担当A');

  const invalid=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',
    headers:{...authHeaders,'Content-Type':'application/json'},
    body:JSON.stringify({status:'not-a-status'}),
  }),env);
  assert.equal(invalid.status,400);

  const manualAssignee=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',
    headers:{...authHeaders,'Content-Type':'application/json'},
    body:JSON.stringify({assignee:'中村'}),
  }),env);
  assert.equal(manualAssignee.status,400);

  const patched=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',
    headers:{...authHeaders,'Content-Type':'application/json'},
    body:JSON.stringify({due_date:'2026-09-24',next_action:'見積書を作成'}),
  }),env);
  assert.equal(patched.status,200);
  const patchedJson=await patched.json();
  assert.equal(patchedJson.case.due_date,'2026-09-24');
  assert.equal(patchedJson.case.next_action,'見積書を作成');
  assert.equal(patchedJson.case.updated_by,'admin@example.com');

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
  assert.equal(depositJson.case.assignee,'担当A');
  assert.equal(depositJson.case.assignee_email,'admin@example.com');
  assert.ok(depositJson.case.deposit_confirmed_at);
  assert.ok(env.DB.events.some(e=>e.event_type==='deposit_confirmed'));
  assert.equal(depositJson.case.next_action,'合意した作業範囲に沿って作業を進める');

  env.DB.case={...env.DB.case,status:'received',assignee:'',assignee_email:'',next_action:'',estimate_total:null,deposit_amount:null,balance_amount:null,deposit_confirmed_at:null,deposit_confirmed_by:null,delivered_at:null,followup_due_at:null,followup_status:'not_scheduled',followup_sent_at:null};
  const startEstimate=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/action',{
    method:'POST',headers:{...authHeaders,'Content-Type':'application/json'},body:JSON.stringify({action:'start_estimate'}),
  }),env);
  assert.equal(startEstimate.status,200);
  const startEstimateJson=await startEstimate.clone().json();
  assert.equal(startEstimateJson.case.status,'estimating');
  assert.equal(startEstimateJson.case.assignee,'担当A');
  assert.equal(startEstimateJson.case.assignee_email,'admin@example.com');
  assert.equal(env.DB.case.next_action,'作業範囲・金額・納期を確認して見積を作成する');
  assert.ok(env.DB.events.some(e=>e.event_type==='assignee_assigned'));

  const renamedList=await worker.fetch(new Request('https://worker.example/admin/cases',{
    method:'GET',headers:authHeaders3,
  }),env);
  assert.equal(renamedList.status,200);
  const renamedListJson=await renamedList.json();
  assert.equal(renamedListJson.cases[0].assignee,'中村 宏樹');
  assert.equal(env.DB.case.assignee,'中村 宏樹');

  env.DB.case.estimate_total=110000;env.DB.case.deposit_amount=40000;env.DB.case.balance_amount=70000;

  const estimateSheet=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/estimate-sheet',{
    method:'POST',headers:{...authHeaders3,'Content-Type':'application/json'},body:'{}',
  }),env);
  assert.equal(estimateSheet.status,200);
  const estimateSheetJson=await estimateSheet.json();
  assert.equal(estimateSheetJson.created,true);
  assert.equal(estimateSheetJson.url,'https://docs.google.com/spreadsheets/d/test-estimate-sheet/edit');
  assert.equal(lastEstimatePayload.case_number,env.DB.case.case_number);
  assert.equal(lastEstimatePayload.company,env.DB.case.company);
  assert.equal(lastEstimatePayload.customer_name,env.DB.case.customer_name);
  assert.equal(lastEstimatePayload.estimate_total,110000);
  assert.equal(lastEstimatePayload.deposit_amount,40000);
  assert.equal(lastEstimatePayload.assignee,'中村 宏樹');
  assert.ok(env.DB.events.some(e=>e.event_type==='estimate_sheet_opened'));

  const estimateSheetAgain=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/estimate-sheet',{
    method:'POST',headers:{...authHeaders3,'Content-Type':'application/json'},body:'{}',
  }),env);
  assert.equal(estimateSheetAgain.status,200);
  assert.equal((await estimateSheetAgain.json()).created,false);
  assert.equal(estimateSheetCalls,2);

  const estimateSent=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/action',{
    method:'POST',headers:{...authHeaders,'Content-Type':'application/json'},body:JSON.stringify({action:'record_estimate_sent'}),
  }),env);
  assert.equal(estimateSent.status,200);
  assert.equal((await estimateSent.clone().json()).case.status,'estimate_sent');

  const accepted=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/action',{
    method:'POST',headers:{...authHeaders,'Content-Type':'application/json'},body:JSON.stringify({action:'record_acceptance'}),
  }),env);
  assert.equal(accepted.status,200);
  assert.equal((await accepted.clone().json()).case.status,'deposit_wait');

  const deposit2=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/deposit-confirm',{
    method:'POST',headers:{...authHeaders,'Content-Type':'application/json'},body:'{}',
  }),env);
  assert.equal(deposit2.status,200);
  assert.equal((await deposit2.clone().json()).case.status,'working');

  const delivered=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/action',{
    method:'POST',headers:{...authHeaders,'Content-Type':'application/json'},body:JSON.stringify({action:'record_delivery',delivered_at:'2026-09-20'}),
  }),env);
  assert.equal(delivered.status,200);
  const deliveredJson=await delivered.json();
  assert.equal(deliveredJson.case.status,'delivered');
  assert.equal(deliveredJson.case.delivered_at,'2026-09-20');
  assert.equal(deliveredJson.case.followup_due_at,'2026-09-27');
  assert.equal(deliveredJson.case.followup_status,'scheduled');

  const followup=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/action',{
    method:'POST',headers:{...authHeaders,'Content-Type':'application/json'},body:JSON.stringify({action:'record_followup_sent',followup_sent_at:'2026-09-20'}),
  }),env);
  assert.equal(followup.status,200);
  const followupJson=await followup.json();
  assert.equal(followupJson.case.followup_status,'sent');
  assert.equal(followupJson.case.next_action,'フォローへの返信・追加要望を確認する');
  assert.ok(env.DB.events.some(e=>e.event_type==='estimate_started'));
  assert.ok(env.DB.events.some(e=>e.event_type==='estimate_sent'));
  assert.ok(env.DB.events.some(e=>e.event_type==='estimate_accepted'));
  assert.ok(env.DB.events.some(e=>e.event_type==='delivered'));
  assert.ok(env.DB.events.some(e=>e.event_type==='followup_sent'));

  const otherDetail=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'GET',headers:authHeaders2,
  }),env);
  assert.equal(otherDetail.status,200);
  const otherDetailJson=await otherDetail.json();
  assert.equal(otherDetailJson.permissions.canEdit,false);
  assert.equal(otherDetailJson.permissions.isAssignee,false);

  const blockedEstimateSheet=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/estimate-sheet',{
    method:'POST',headers:{...authHeaders2,'Content-Type':'application/json'},body:'{}',
  }),env);
  assert.equal(blockedEstimateSheet.status,403);

  const blockedPatch=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',headers:{...authHeaders2,'Content-Type':'application/json'},body:JSON.stringify({handoff_note:'勝手に変更'}),
  }),env);
  assert.equal(blockedPatch.status,403);

  const blockedAction=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/action',{
    method:'POST',headers:{...authHeaders2,'Content-Type':'application/json'},body:JSON.stringify({action:'record_followup_sent'}),
  }),env);
  assert.equal(blockedAction.status,403);

  const reassigned=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number+'/reassign',{
    method:'POST',headers:{...authHeaders2,'Content-Type':'application/json'},body:'{}',
  }),env);
  assert.equal(reassigned.status,200);
  const reassignedJson=await reassigned.json();
  assert.equal(reassignedJson.case.assignee,'担当B');
  assert.equal(reassignedJson.case.assignee_email,'admin2@example.com');
  assert.equal(reassignedJson.permissions.canEdit,true);
  assert.ok(env.DB.events.some(e=>e.event_type==='assignee_changed'));

  const oldOwnerBlocked=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',headers:{...authHeaders,'Content-Type':'application/json'},body:JSON.stringify({handoff_note:'旧担当'}),
  }),env);
  assert.equal(oldOwnerBlocked.status,403);

  const newOwnerPatch=await worker.fetch(new Request('https://worker.example/admin/cases/'+env.DB.case.case_number,{
    method:'PATCH',headers:{...authHeaders2,'Content-Type':'application/json'},body:JSON.stringify({handoff_note:'新担当へ引き継ぎ'}),
  }),env);
  assert.equal(newOwnerPatch.status,200);
  assert.equal((await newOwnerPatch.json()).case.handoff_note,'新担当へ引き継ぎ');

  assert.ok(supabaseCalls>=16);

  console.log(JSON.stringify({
    ok:true,
    checks:[
      'PATCH preflight',
      'unauthorized rejection',
      'admin authorization',
      'case list and due-date backfill',
      'case detail route',
      'invalid status rejection',
      'case patch and manual assignee rejection',
      'deposit confirmation transition and auto assignment',
      'start estimate action',
      'assignee display-name profile sync',
      'estimate sheet creation and reuse',
      'estimate sent action',
      'estimate acceptance action',
      'delivery action and follow-up schedule',
      'follow-up sent action',
      'assigned case read-only enforcement including estimate sheet',
      'explicit assignee takeover and audit'
    ]
  }));
} finally {
  globalThis.fetch=originalFetch;
}

// Pure workflow-planner tests. No live mail, bank, authentication or D1 calls.
const fixtures = () => ({
  case_number:'GXW-TEST', status:'received', assignee:'', next_action:'',
  estimate_total:null, deposit_amount:null, balance_amount:null,
  delivered_at:null, followup_due_at:null, followup_status:'not_scheduled',
  followup_sent_at:null, handoff_note:'', customer_requests:'',
});
const context={today:'2026-09-21',actorName:'担当者テスト'};
const apply=(before,input={},options={})=>planCaseAutomation(before,input,{...context,...options});
const checks=[];
function check(name, fn){fn();checks.push(name);}
function rejected(fn, code){assert.throws(fn,error=>error.code===code);}

check('receipt sets a next action without guessing an assignee',()=>{
  const p=apply(fixtures(),{}, {event:'received'}).patch;
  assert.deepEqual(p,{next_action:NEXT_ACTION_DEFAULTS.received});
});
check('starting an estimate advances status and fills an unassigned owner',()=>{
  const p=apply(fixtures(),{}, {event:'start_estimate'}).patch;
  assert.equal(p.status,'estimating');assert.equal(p.assignee,context.actorName);
  assert.equal(p.next_action,NEXT_ACTION_DEFAULTS.estimating);
});
check('existing assignee and handwritten next action survive automation',()=>{
  const before={...fixtures(),assignee:'既存担当',next_action:'先に図面を確認',handoff_note:'お客様への注意点'};
  const p=apply(before,{}, {event:'start_estimate'}).patch;
  assert.deepEqual(p,{status:'estimating'});assert.equal(before.handoff_note,'お客様への注意点');
});
check('an explicitly changed next action is not overwritten',()=>{
  const p=apply(fixtures(),{next_action:'先に折り返す'}, {event:'start_estimate'}).patch;
  assert.equal(p.next_action,'先に折り返す');
});
check('an explicitly cleared assignee is not reassigned',()=>{
  const p=apply({...fixtures(),assignee:'以前の担当'}, {assignee:''}, {event:'start_estimate'}).patch;
  assert.equal(p.assignee,'');
});
check('unchanged auto-generated next action follows the new phase',()=>{
  const p=apply({...fixtures(),next_action:NEXT_ACTION_DEFAULTS.received},{next_action:NEXT_ACTION_DEFAULTS.received},{event:'start_estimate'}).patch;
  assert.equal(p.next_action,NEXT_ACTION_DEFAULTS.estimating);
});
check('amount entry alone does not mark an estimate sent',()=>{
  const p=apply({...fixtures(),status:'estimating'},{estimate_total:'110000',deposit_amount:'40000'}).patch;
  assert.equal(p.balance_amount,70000);assert.equal(p.status,undefined);
});
check('blank amounts are unknown, not zero',()=>{
  const p=apply(fixtures(),{estimate_total:'',deposit_amount:'',balance_amount:''}).patch;
  assert.deepEqual(p,{});
});
check('zero yen is an actual amount',()=>{
  const p=apply(fixtures(),{estimate_total:'0',deposit_amount:'0'}).patch;
  assert.equal(p.balance_amount,0);assert.equal(p.estimate_total,0);
});
check('a mismatched manually edited balance is rejected',()=>{
  rejected(()=>apply(fixtures(),{estimate_total:110000,deposit_amount:40000,balance_amount:1}),'BALANCE_MISMATCH');
});
check('deposit cannot exceed total',()=>rejected(()=>apply(fixtures(),{estimate_total:100,deposit_amount:101}),'DEPOSIT_EXCEEDS_TOTAL'));
check('fractional, infinite, boolean and negative amounts are rejected',()=>{
  for(const amount of [1.5,Infinity,-1,true,'1e5','100.5','-1','foo',1000000000]) rejected(()=>apply(fixtures(),{estimate_total:amount}),'INVALID_AMOUNT');
});
check('estimate sent needs explicit confirmation of actual sending',()=>{
  const before={...fixtures(),status:'estimating',estimate_total:110000};
  rejected(()=>apply(before,{}, {event:'record_estimate_sent'}),'EVIDENCE_REQUIRED');
  assert.equal(apply(before,{}, {event:'record_estimate_sent',evidence:{estimateSent:true}}).patch.status,'estimate_sent');
});
check('recorded estimate sending does not imply customer agreement',()=>{
  const p=apply({...fixtures(),status:'estimating',estimate_total:110000,deposit_amount:40000},{},{event:'record_estimate_sent',evidence:{estimateSent:true}}).patch;
  assert.equal(p.status,'estimate_sent');assert.equal(p.deposit_confirmed_at,undefined);
});
check('estimate acceptance requires agreement and a specified deposit',()=>{
  const before={...fixtures(),status:'estimate_sent',estimate_total:110000,deposit_amount:40000};
  rejected(()=>apply(before,{}, {event:'record_acceptance'}),'EVIDENCE_REQUIRED');
  assert.equal(apply(before,{}, {event:'record_acceptance',evidence:{estimateAccepted:true}}).patch.status,'deposit_wait');
  rejected(()=>apply({...before,deposit_amount:null},{},{event:'record_acceptance',evidence:{estimateAccepted:true}}),'DEPOSIT_REQUIRED');
});
check('bank deposit is never inferred from dates, money or a client flag',()=>{
  const before={...fixtures(),status:'deposit_wait',deposit_amount:40000};
  rejected(()=>apply(before,{}, {event:'after_deposit_confirmation',evidence:{bankConfirmed:true}}),'BANK_CONFIRMATION_REQUIRED');
  rejected(()=>apply(before,{status:'working'}),'BANK_CONFIRMATION_REQUIRED');
  assert.equal(apply(before,{due_date:'2026-09-01'}).patch.status,undefined);
});
check('already persisted bank confirmation allows working state and next action',()=>{
  const before={...fixtures(),status:'deposit_wait',deposit_confirmed_at:'2026-09-21T00:00:00.000Z',next_action:NEXT_ACTION_DEFAULTS.deposit_wait};
  const p=apply(before,{}, {event:'after_deposit_confirmation'}).patch;
  assert.equal(p.status,'working');assert.equal(p.next_action,NEXT_ACTION_DEFAULTS.working);
  assert.equal(p.deposit_confirmed_at,undefined);
});
check('delivery date updates status and seven-day follow-up together',()=>{
  const p=apply({...fixtures(),status:'working'},{delivered_at:'2026-09-20'}).patch;
  assert.equal(p.status,'delivered');assert.equal(p.followup_due_at,'2026-09-27');assert.equal(p.followup_status,'scheduled');
});
check('recording actual delivery defaults to today, without sending email',()=>{
  const p=apply({...fixtures(),status:'working'}, {}, {event:'record_delivery',evidence:{delivered:true}}).patch;
  assert.equal(p.delivered_at,'2026-09-21');assert.equal(p.followup_due_at,'2026-09-28');assert.equal(p.followup_sent_at,undefined);
});
check('unrelated saves do not reset completed follow-up or rewrite delivery dates',()=>{
  const before={...fixtures(),status:'delivered',delivered_at:'2026-09-20',followup_due_at:'2026-09-27',followup_status:'closed'};
  const p=apply(before,{delivered_at:'2026-09-20',followup_status:'closed',handoff_note:'記録を追加'}).patch;
  assert.deepEqual(p,{handoff_note:'記録を追加'});
});
check('future delivery dates are rejected rather than treated as a plan',()=>{
  rejected(()=>apply({...fixtures(),status:'working'},{delivered_at:'2026-09-22'}),'INVALID_EVENT_DATE');
});
check('invalid dates and leap days are validated',()=>{
  for(const date of ['2026-02-29','2026-02-30','2026-13-01','2026-9-1']) rejected(()=>apply(fixtures(),{due_date:date}),'INVALID_DATE');
  assert.equal(isCalendarDate('2028-02-29'),true);assert.equal(addCalendarDays('2028-02-26',7),'2028-03-04');
  assert.equal(addCalendarDays('2026-12-28',7),'2027-01-04');
});
check('Japan day boundaries are deterministic',()=>{
  assert.equal(tokyoDate(new Date('2026-09-20T15:01:00Z')),'2026-09-21');
});
check('Japan business days exclude weekends and official holiday clusters',()=>{
  assert.equal(isJapanBusinessDay('2026-09-21'),false);
  assert.equal(isJapanBusinessDay('2026-09-22'),false);
  assert.equal(isJapanBusinessDay('2026-09-23'),false);
  assert.equal(isJapanBusinessDay('2026-09-24'),true);
  assert.equal(addJapanBusinessDays('2026-09-18',2),'2026-09-25');
  assert.equal(addJapanBusinessDays('2026-05-01',2),'2026-05-08');
  assert.equal(addJapanBusinessDays('2027-03-19',2),'2027-03-24');
});
check('two business-day deadline counts from the day after receipt',()=>{
  assert.equal(addJapanBusinessDays('2026-09-14',2),'2026-09-16');
  assert.equal(addJapanBusinessDays('2026-09-25',2),'2026-09-29');
});
check('sending a follow-up requires actual sending to be recorded',()=>{
  const before={...fixtures(),status:'delivered',delivered_at:'2026-09-20',followup_status:'scheduled'};
  rejected(()=>apply(before,{}, {event:'record_followup_sent'}),'EVIDENCE_REQUIRED');
  const p=apply(before,{}, {event:'record_followup_sent',evidence:{followupSent:true}}).patch;
  assert.equal(p.followup_status,'sent');assert.equal(p.followup_sent_at,'2026-09-21');assert.equal(p.status,undefined);
});
check('elapsed follow-up date never means sent or complete',()=>{
  const before={...fixtures(),status:'delivered',delivered_at:'2026-08-20',followup_due_at:'2026-08-27',followup_status:'scheduled'};
  assert.deepEqual(apply(before).patch,{});
});
check('completion cannot be inferred or bulk-saved',()=>rejected(()=>apply({...fixtures(),status:'delivered'},{status:'completed'}),'COMPLETION_REVIEW_REQUIRED'));
check('stopped cases do not restart from an automation event',()=>{
  for(const status of ['on_hold','completed','cancelled']) rejected(()=>apply({...fixtures(),status},{},{event:'start_estimate'}),'INACTIVE_CASE');
});
check('advanced cases cannot regress on a repeated old event',()=>rejected(()=>apply({...fixtures(),status:'working'},{},{event:'start_estimate'}),'INVALID_TRANSITION'));
check('repeating the same action yields no changed fields',()=>{
  const before=fixtures();const opt={event:'start_estimate'};const first=apply(before,{},opt).patch;
  assert.deepEqual(apply({...before,...first},{},opt).patch,{});
  const delivered={...fixtures(),status:'working'};const dopt={event:'record_delivery',evidence:{delivered:true}};
  const d=apply(delivered,{},dopt).patch;
  assert.deepEqual(apply({...delivered,...d},{},dopt).patch,{});
});
check('raw status edits cannot pretend sending, acceptance or delivery happened',()=>{
  rejected(()=>apply({...fixtures(),status:'estimating'},{status:'estimate_sent'}),'EVIDENCE_REQUIRED');
  rejected(()=>apply({...fixtures(),status:'estimate_sent'},{status:'deposit_wait'}),'EVIDENCE_REQUIRED');
  rejected(()=>apply({...fixtures(),status:'working'},{status:'delivered'}),'DELIVERY_REQUIRED');
});
check('invalid payloads and unapproved fields are rejected',()=>{
  for(const input of [null,[],3]) rejected(()=>apply(fixtures(),input),'INVALID_INPUT');
  for(const field of ['deposit_confirmed_at','updated_by','balance_paid','__proto__']) {
    const payload=JSON.parse('{"'+field+'":"forged"}');
    rejected(()=>apply(fixtures(),payload),'UNKNOWN_FIELD');
  }
  rejected(()=>apply(fixtures(),{status:'__proto__'}),'INVALID_STATUS');
});
check('planning does not mutate either input',()=>{
  const before=fixtures(),input={next_action:'手動メモ'};const b=structuredClone(before),i=structuredClone(input);
  apply(before,input,{event:'start_estimate'});assert.deepEqual(before,b);assert.deepEqual(input,i);
});
console.log(JSON.stringify({ok:true,automationChecks:checks.length,checks},null,2));
