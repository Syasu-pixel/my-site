import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(new URL('../.github/workers/gxworks2-support-api/worker.js',import.meta.url),'utf8');
const mod=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const worker=mod.default;
const originalFetch=globalThis.fetch;

class FakeDB {
  constructor(){this.rate=new Map();}
  prepare(sql){
    const db=this;
    return {
      args:[],
      bind(...args){this.args=args;return this;},
      async run(){
        if(sql.includes('CREATE TABLE IF NOT EXISTS general_consultation_rate_limits'))return {meta:{changes:0}};
        if(sql.includes('INSERT INTO general_consultation_rate_limits')){
          const [key,now,iso,windowMs]=this.args;
          const old=db.rate.get(key);
          const next=!old||now-old.window_start>=windowMs
            ? {window_start:now,count:1,updated_at:iso}
            : {window_start:old.window_start,count:old.count+1,updated_at:iso};
          db.rate.set(key,next);
          return {meta:{changes:1}};
        }
        if(sql.includes('DELETE FROM general_consultation_rate_limits')){
          const [cutoff]=this.args;
          for(const [key,row] of db.rate)if(row.window_start<cutoff)db.rate.delete(key);
          return {meta:{changes:0}};
        }
        throw new Error('Unexpected run SQL: '+sql);
      },
      async first(){
        if(sql.includes('SELECT window_start, count FROM general_consultation_rate_limits')){
          return db.rate.get(this.args[0])||null;
        }
        throw new Error('Unexpected first SQL: '+sql);
      },
    };
  }
}

const sent=[];
let turnstileSuccess=true;
let failCustomer=false;
globalThis.fetch=async (url,init={})=>{
  const href=String(url);
  if(href==='https://challenges.cloudflare.com/turnstile/v0/siteverify'){
    const body=JSON.parse(String(init.body||'{}'));
    assert.equal(body.secret,'turnstile-secret');
    assert.ok(body.response);
    return new Response(JSON.stringify(
      turnstileSuccess
        ? {success:true,hostname:'preview-general-online-consu-iuxo.denkicontrol-preview.pages.dev',action:'general_consultation'}
        : {success:false,'error-codes':['invalid-input-response']}
    ),{status:200,headers:{'Content-Type':'application/json'}});
  }
  if(href==='https://api.resend.com/emails'){
    const headers=new Headers(init.headers||{});
    const payload=JSON.parse(String(init.body||'{}'));
    sent.push({headers,payload});
    if(failCustomer&&payload.to?.includes('fail@example.com')){
      return new Response(JSON.stringify({message:'simulated customer failure'}),{status:500,headers:{'Content-Type':'application/json'}});
    }
    return new Response(JSON.stringify({id:`mail-${sent.length}`}),{status:200,headers:{'Content-Type':'application/json'}});
  }
  throw new Error('Unexpected fetch URL: '+href);
};

try{
  const env={
    RESEND_API_KEY:'test-key',
    NOTIFY_TO_EMAIL:'owner@gmail.example',
    TURNSTILE_SECRET_KEY:'turnstile-secret',
    TURNSTILE_SITE_KEY:'turnstile-site',
    DB:new FakeDB(),
  };
  const requestKey='web_20260919_12345678-1234-4234-8234-123456789abc';
  const baseBody={
    requestKey,
    turnstileToken:'turnstile-token-1',
    name:'テスト相談者',
    email:'customer@example.com',
    company:'テスト会社',
    category:'技術相談',
    relatedUrl:'https://denkicontrol.com/articles/test.html',
    message:'テスト相談です。',
    replyWanted:true,
    privacyAccepted:true,
  };
  const call=(body=baseBody,origin='https://preview-general-online-consu-iuxo.denkicontrol-preview.pages.dev',ip='203.0.113.10')=>
    worker.fetch(new Request('https://worker.example/general-consultations',{
      method:'POST',
      headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':ip},
      body:JSON.stringify(body),
    }),env);

  const config=await worker.fetch(new Request('https://worker.example/general-consultations/config',{
    method:'GET',headers:{Origin:'https://denkicontrol.com'},
  }),env);
  assert.equal(config.status,200);
  assert.equal((await config.json()).turnstileSiteKey,'turnstile-site');

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
  assert.deepEqual(sent[1].payload.to,['customer@example.com']);
  assert.equal(sent[0].headers.get('Idempotency-Key'),requestKey+'-admin');
  assert.equal(sent[1].headers.get('Idempotency-Key'),requestKey+'-customer');

  const second=await call({...baseBody,turnstileToken:'turnstile-token-2'});
  const secondJson=await second.json();
  assert.equal(second.status,200);
  assert.equal(secondJson.caseNumber,firstJson.caseNumber);

  const denied=await call(baseBody,'https://example.com');
  assert.equal(denied.status,403);

  const invalid=await call({...baseBody,requestKey:'web_20260919_invalid-privacy-1234567890',privacyAccepted:false,turnstileToken:'turnstile-token-3'},'https://denkicontrol.com','203.0.113.11');
  assert.equal(invalid.status,400);

  const oversized=await call({...baseBody,requestKey:'web_20260919_oversized-123456789012345',email:'long@example.com',message:'x'.repeat(8001),turnstileToken:'turnstile-token-4'},'https://denkicontrol.com','203.0.113.12');
  assert.equal(oversized.status,400);

  turnstileSuccess=false;
  const bot=await call({...baseBody,requestKey:'web_20260919_bot-check-1234567890123456',email:'bot@example.com',turnstileToken:'bad-token'},'https://denkicontrol.com','203.0.113.13');
  assert.equal(bot.status,403);
  turnstileSuccess=true;

  failCustomer=true;
  const partial=await call({...baseBody,requestKey:'web_20260919_partial-1234567890123456',email:'fail@example.com',turnstileToken:'turnstile-token-5'},'https://denkicontrol.com','203.0.113.14');
  const partialJson=await partial.json();
  assert.equal(partial.status,502);
  assert.equal(partialJson.ok,false);
  assert.equal(partialJson.ownerSent,true);
  assert.equal(partialJson.confirmationSent,false);
  assert.match(partialJson.caseNumber,/^WEB-20260919-[A-F0-9]{8}$/);
  failCustomer=false;

  const rateEmail='rate@example.com';
  for(let i=0;i<3;i++){
    const res=await call({...baseBody,requestKey:`web_20260919_rate-${i}-12345678901234567890`,email:rateEmail,turnstileToken:`rate-token-${i}`},'https://denkicontrol.com','203.0.113.15');
    assert.equal(res.status,200);
  }
  const limited=await call({...baseBody,requestKey:'web_20260919_rate-3-12345678901234567890',email:rateEmail,turnstileToken:'rate-token-3'},'https://denkicontrol.com','203.0.113.15');
  assert.equal(limited.status,429);

  console.log(JSON.stringify({
    ok:true,
    caseNumber:firstJson.caseNumber,
    mailCalls:sent.length,
    checks:[
      'config site key','turnstile validation','owner mail','reply-to','customer confirmation',
      'retry idempotency keys','origin rejection','privacy validation','oversize rejection',
      'partial confirmation failure','rate limiting'
    ]
  }));
} finally {
  globalThis.fetch=originalFetch;
}
