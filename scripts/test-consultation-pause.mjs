import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const workerSource=await readFile(new URL('.github/workers/gxworks2-support-api/worker.js',root),'utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'))).default;

const origin='https://denkicontrol.com';
for(const [method,path] of [['POST','/consultations'],['PUT','/consultations/zip']]){
  const res=await worker.fetch(new Request('https://worker.example'+path,{method,headers:{Origin:origin}}),{});
  assert.equal(res.status,503,method+' '+path);
  assert.equal((await res.json()).code,'CONSULTATION_PAUSED');
}
// Ordinary contact requests remain routed to their own handler: without
// test bindings the handler returns 500, never the consultation pause code.
const contact=await worker.fetch(new Request('https://worker.example/general-consultations',{
  method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'
}),{});
assert.notEqual(contact.status,503,'ordinary contact endpoint must not be paused');
const status=await worker.fetch(new Request('https://worker.example/consultations/status',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),{});
assert.notEqual(status.status,503,'existing consultation status route must not be paused');
const general=await readFile(new URL('contact/index.html',root),'utf8');
assert.match(general,/id="generalConsultationForm"/);
assert.match(general,/contact-confidentiality-notice/);
assert.doesNotMatch(general,/id="zip-input"|name="file"/);
assert.match(general,/お問い合わせを送信する/);
const service=await readFile(new URL('services/gxworks2-online-support.html',root),'utf8');
assert.match(service,/現在更新中です/);
assert.doesNotMatch(service,/id="consultationForm"|id="zip-input"/);
console.log('GX Works2 paused, ordinary contact enabled, existing status preserved.');
