import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../.github/workers/gxworks2-support-api/worker.js',import.meta.url),'utf8');
const mod=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const worker=mod.default;
const originalFetch=globalThis.fetch;
const sent=[];
globalThis.fetch=async (url,init={})=>{
  assert.equal(String(url),'https://api.resend.com/emails');
  const headers=new Headers(init.headers||{});
  const payload=JSON.parse(String(init.body||'{}'));
  sent.push({headers,payload});
  return new Response(JSON.stringify({id:`mail-${sent.length}`}),{status:200,headers:{'Content-Type':'application/json'}});
};

try{
  const env={RESEND_API_KEY:'test-key',NOTIFY_TO_EMAIL:'owner@gmail.example'};
  const requestKey='web_20260919_12345678-1234-4234-8234-123456789abc';
  const body={
    requestKey,
    name:'テスト相談者',
    email:'customer@example.com',
    company:'テスト会社',
    category:'技術相談',
    relatedUrl:'https://denkicontrol.com/articles/test.html',
    message:'テスト相談です。',
    replyWanted:true,
    privacyAccepted:true,
  };
  const call=()=>worker.fetch(new Request('https://worker.example/general-consultations',{
    method:'POST',
    headers:{Origin:'https://preview-general-online-consu.denkicontrol-preview.pages.dev','Content-Type':'application/json'},
    body:JSON.stringify(body),
  }),env);

  const first=await call();
  assert.equal(first.status,200);
  const firstJson=await first.json();
  assert.equal(firstJson.ok,true);
  assert.match(firstJson.caseNumber,/^WEB-20260919-[A-F0-9]{8}$/);
  assert.equal(firstJson.ownerSent,true);
  assert.equal(firstJson.confirmationSent,true);
  assert.equal(sent.length,2);

  assert.deepEqual(sent[0].payload.to,['owner@gmail.example']);
  assert.equal(sent[0].payload.reply_to,'customer@example.com');
  assert.match(sent[0].payload.subject,/オンライン相談/);
  assert.deepEqual(sent[1].payload.to,['customer@example.com']);
  assert.equal(sent[0].headers.get('Idempotency-Key'),requestKey+'-admin');
  assert.equal(sent[1].headers.get('Idempotency-Key'),requestKey+'-customer');

  const second=await call();
  const secondJson=await second.json();
  assert.equal(secondJson.caseNumber,firstJson.caseNumber);
  assert.equal(sent.length,4);
  assert.equal(sent[2].headers.get('Idempotency-Key'),requestKey+'-admin');
  assert.equal(sent[3].headers.get('Idempotency-Key'),requestKey+'-customer');

  const denied=await worker.fetch(new Request('https://worker.example/general-consultations',{
    method:'POST',
    headers:{Origin:'https://example.com','Content-Type':'application/json'},
    body:JSON.stringify(body),
  }),env);
  assert.equal(denied.status,403);

  const invalid=await worker.fetch(new Request('https://worker.example/general-consultations',{
    method:'POST',
    headers:{Origin:'https://denkicontrol.com','Content-Type':'application/json'},
    body:JSON.stringify({...body,privacyAccepted:false}),
  }),env);
  assert.equal(invalid.status,400);

  console.log(JSON.stringify({ok:true,caseNumber:firstJson.caseNumber,mailCalls:sent.length,checks:['owner mail','reply-to','customer confirmation','retry idempotency keys','origin rejection','privacy validation']}));
} finally {
  globalThis.fetch=originalFetch;
}
