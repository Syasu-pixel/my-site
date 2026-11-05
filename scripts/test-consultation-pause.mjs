import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const workerSource=await readFile(new URL('.github/workers/gxworks2-support-api/worker.js',root),'utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'))).default;

const origin='https://denkicontrol.com';
for(const [method,path] of [['POST','/consultations'],['PUT','/consultations/zip'],['POST','/general-consultations']]){
  const res=await worker.fetch(new Request('https://worker.example'+path,{method,headers:{Origin:origin}}),{});
  assert.equal(res.status,503,method+' '+path);
  const body=await res.json();
  assert.equal(body.code,'CONSULTATION_PAUSED');
}
const status=await worker.fetch(new Request('https://worker.example/consultations/status',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}),{});
assert.notEqual(status.status,503,'existing consultation status route must not be paused');
for(const path of ['contact/index.html','services/gxworks2-online-support.html']){
  const html=await readFile(new URL(path,root),'utf8');
  assert.match(html,/現在更新中です/);
  assert.match(html,/mailto:kds_kurata@hm\.aitai\.ne\.jp/);
  assert.doesNotMatch(html,/id="generalConsultationForm"|id="consultationForm"|id="zip-input"/);
}
console.log('Consultation pause: 3 public write endpoints blocked; existing status route preserved; both notices present.');
