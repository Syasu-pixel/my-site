import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {root} from './build-site-shells.mjs';
const build=resolve(process.argv[2]||'../integration-build'),review=resolve(build,'review');
const isolation=await readFile(resolve(root,'.github/article-components/review-isolation.js'),'utf8');
const head=`<meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="default-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'none'; object-src 'none'; base-uri 'none'; worker-src 'none'"><script>${isolation}</script>`;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.csv':'text/csv; charset=utf-8'};
export function server(before=false){return createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end('Review is read-only');return;}
 try{
  let path=decodeURIComponent(new URL(req.url,'http://local').pathname).replace(/^\//,'');if(!path||path.endsWith('/'))path+='index.html';
  if(!resolve(root,path).startsWith(root+sep))throw Error('Invalid path');
  let data,fromSource=false;
  if(!before){try{data=await readFile(resolve(review,path));}catch{}}
  if(!data){data=await readFile(resolve(root,path));fromSource=true;}
  if(fromSource&&path.endsWith('.html'))data=Buffer.from(data.toString('utf8').replace(/<head\b[^>]*>/,m=>m+head));
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404).end('Review file not found');}
});}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1').replaceAll('/',sep)){
 const port=Number(process.env.REVIEW_PORT||8768),beforePort=Number(process.env.REVIEW_BEFORE_PORT||8769);
 server().listen(port,'127.0.0.1',()=>console.log('Integrated review: http://127.0.0.1:'+port+'/'));
 server(true).listen(beforePort,'127.0.0.1',()=>console.log('Isolated source comparison: http://127.0.0.1:'+beforePort+'/'));
}
