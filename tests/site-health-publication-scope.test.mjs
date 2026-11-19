import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
import {createServer} from 'node:http';
import {unpublishedPaths} from '../scripts/site-health-publication-scope.mjs';

const exec=promisify(execFile),repo=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const paused=[1,2,3].map(n=>`articles/plc-drilling-line-design-project-0${n}.html`);
const inventory={version:1,unpublished:paused.map(path=>({path,reason:'Intentional publication pause'}))};
async function put(root,path,value){const file=resolve(root,path);await mkdir(dirname(file),{recursive:true});await writeFile(file,typeof value==='string'?value:JSON.stringify(value));}
async function fixture(t){const root=await mkdtemp(resolve(tmpdir(),'publication-scope-'));t.after(()=>rm(root,{recursive:true,force:true}));await put(root,'assets/data/site-health-unpublished.json',inventory);return root;}
async function run(root,script,env={}){const out=resolve(root,`${script}.json`);await exec(process.execPath,[resolve(repo,`scripts/${script}.mjs`),root,out],{env:{...process.env,...env}});return JSON.parse(await readFile(out,'utf8'));}
async function server(t,handler){const s=createServer(handler);await new Promise(r=>s.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>{s.closeAllConnections();s.close(r);}));return `http://127.0.0.1:${s.address().port}`;}

test('inventory is exact, validates entries and fails closed on invalid/missing data',async t=>{
 const root=await fixture(t);assert.deepEqual([...await unpublishedPaths(root)],paused);
 for(const value of [null,{}, {version:2,unpublished:[]},{version:1,unpublished:[null]}, {version:1,unpublished:[{path:'articles/*.html',reason:'x'}]}, {version:1,unpublished:[{path:'../private.html',reason:'x'}]}, {version:1,unpublished:[{path:paused[0],reason:' '}]}, {version:1,unpublished:[{path:paused[0],reason:true}]}, {version:1,unpublished:[inventory.unpublished[0],inventory.unpublished[0]]}]){await put(root,'assets/data/site-health-unpublished.json',value);await assert.rejects(unpublishedPaths(root));}
 await put(root,'assets/data/site-health-unpublished.json','not json');await assert.rejects(unpublishedPaths(root));await rm(resolve(root,'assets/data/site-health-unpublished.json'));await assert.rejects(unpublishedPaths(root));
});

test('HTTP accepts only direct 404/410 for paused URLs, even without source HTML',async t=>{
 const root=await fixture(t);await put(root,'articles/public.html','public');await put(root,'articles/other-plc.html','public');
 let statuses=[404,410,404];const requests=[];
 const origin=await server(t,(req,res)=>{requests.push(req.url);const i=paused.indexOf(req.url.slice(1));if(i>=0){if(statuses[i]==='disconnect'){req.socket.destroy();return;}res.writeHead(statuses[i],statuses[i]===302?{location:'/missing'}:{}).end();return;}res.writeHead(req.url==='/articles/public.html'?200:404).end();});
 let result=await run(root,'check-production-http',{SITE_HEALTH_ORIGIN:origin});assert.equal(result.urlsChecked,5);assert.deepEqual(result.issues.map(x=>x.path),['/articles/other-plc.html']);assert.ok(paused.every(p=>requests.includes('/'+p)));
 statuses=[200,302,503];requests.length=0;result=await run(root,'check-production-http',{SITE_HEALTH_ORIGIN:origin});assert.equal(result.issues.filter(x=>x.type==='http-unpublished-exposed').length,2);assert.equal(result.issues.filter(x=>x.type==='http-unpublished-unverified').length,1);assert.ok(!requests.includes('/missing'));
 statuses=['disconnect',404,410];result=await run(root,'check-production-http',{SITE_HEALTH_ORIGIN:origin});assert.ok(result.issues.some(x=>x.type==='http-unpublished-unverified'&&x.status===null));
});

test('static monitors exclude only listed pages and retain public-page defects and leakage',async t=>{
 const root=await fixture(t);for(const p of [...paused,'articles/other-plc.html'])await put(root,p,'<html><head></head></html>');await put(root,'sitemap.xml','<urlset></urlset>');await put(root,'assets/data/search-index.json',[]);
 let result=await run(root,'check-canonical-integrity');assert.equal(result.pagesChecked,1);assert.deepEqual(result.issues.map(x=>x.path),['articles/other-plc.html']);
 result=await run(root,'check-sitemap-integrity');assert.equal(result.eligiblePages,1);assert.deepEqual(result.issues.map(x=>x.type),['sitemap-unlisted']);
 result=await run(root,'check-search-index-integrity');assert.equal(result.eligibleArticles,1);assert.deepEqual(result.issues.map(x=>x.type),['search-index-unlisted']);
 await put(root,'sitemap.xml',`<urlset><url><loc>https://denkicontrol.com/${paused[0]}</loc></url></urlset>`);result=await run(root,'check-sitemap-integrity');assert.ok(result.issues.some(x=>x.type==='sitemap-unpublished'));assert.ok(result.issues.some(x=>x.type==='sitemap-unlisted'));
 await put(root,'assets/data/search-index.json',[{url:'/'+paused[0]}]);result=await run(root,'check-search-index-integrity');assert.ok(result.issues.some(x=>x.type==='search-index-unpublished'));assert.ok(result.issues.some(x=>x.type==='search-index-unlisted'));
});

test('OGP skips expected missing paused pages but still reports a public image defect',async t=>{
 const root=await fixture(t);for(const p of [...paused,'articles/public.html'])await put(root,p,'html');const requests=[];
 const origin=await server(t,(req,res)=>{requests.push(req.url);res.writeHead(200,{'content-type':'text/html'}).end('<html></html>');});
 const result=await run(root,'check-ogp-images',{SITE_HEALTH_ORIGIN:origin});assert.equal(result.pagesChecked,1);assert.deepEqual(requests,['/articles/public.html']);assert.deepEqual(result.issues.map(x=>x.type),['ogp-image-missing']);
});

test('production inventory remains restricted to the three paused PLC articles',async()=>{
 assert.deepEqual([...await unpublishedPaths(repo)].sort(),paused);
});
