import test from 'node:test';
import assert from 'node:assert/strict';
import {compareReports,widths,themes} from '../scripts/probe-browser-environment.mjs';
const fixture=()=>({playwright:'1.55.0',browser:'139.0',fixtureHash:'a'.repeat(64),cases:widths.flatMap(w=>themes.map(t=>({key:`${w}-${t}`,pixelHash:'b'.repeat(64),geometry:Array.from({length:6},()=>({text:'test',x:0,y:0,width:10,height:20,font:'sans-serif'})),fonts:Object.fromEntries(['h1','#jp','#en','button','code'].map(k=>[k,[{familyName:'IPA Gothic',postScriptName:'IPAGothic',isCustomFont:false,glyphCount:5}]]))})))});
test('identical complete fixture reports pass',()=>assert.deepEqual(compareReports(fixture(),fixture()),[]));
for(const key of ['playwright','browser','fixtureHash'])test(`${key} change fails`,()=>{const b=fixture();b[key]='changed';assert.ok(compareReports(fixture(),b).length);});
for(const key of ['pixelHash','geometry','fonts'])test(`${key} change fails without threshold`,()=>{const b=fixture();b.cases[0][key]='changed';assert.ok(compareReports(fixture(),b).length);});
test('missing, duplicate and unknown cases fail',()=>{for(const mutate of [b=>b.cases.pop(),b=>b.cases[0]=b.cases[1],b=>b.cases[0].key='unknown']){const b=fixture();mutate(b);assert.ok(compareReports(fixture(),b).length);}});

test('both reports missing evidence must fail',()=>{for(const key of ['pixelHash','geometry','fonts']){const a=fixture(),b=fixture();delete a.cases[0][key];delete b.cases[0][key];assert.ok(compareReports(a,b).length);}});

test('malformed or empty nested evidence cannot pass in both reports',()=>{for(const mutate of [r=>r.playwright='1.56.0',r=>r.fixtureHash='fake',r=>r.cases[0].pixelHash='same',r=>r.cases[0].geometry=[{}],r=>r.cases[0].geometry[0].width=NaN,r=>r.cases[0].fonts={h1:[]},r=>r.cases[0].fonts['#jp'][0].glyphCount=0]){const a=fixture(),b=fixture();mutate(a);mutate(b);assert.ok(compareReports(a,b).length);}});
