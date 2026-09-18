import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..'),build=resolve(process.argv[2]||'../hero-build');
const manifest=JSON.parse(await readFile(resolve(root,'.github/article-components/hero/manifest.json'),'utf8'));
const options=manifest.targets.map(p=>`<option value="${p}">${p}</option>`).join('');
const portal=`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ヒーローひな形・比較プレビュー</title><style>body{margin:0;background:#eef2f7;color:#182b43;font:16px system-ui}header{padding:20px;background:white;border-bottom:1px solid #ccd5df}h1{font-size:22px;margin:0 0 10px}p{margin:8px 0;line-height:1.6}nav{display:flex;flex-wrap:wrap;gap:8px;align-items:center}select,button,a{font:inherit;padding:8px}button{cursor:pointer}#status{font-weight:bold}.stage{overflow:auto;padding:16px}iframe{display:block;height:85vh;border:1px solid #abbacc;background:white;margin:auto;max-width:none}</style><header><h1>ヒーローひな形・比較プレビュー</h1><p>代表8記事。本文・見た目を保ち、生成方法だけを変更した確認用です。本番未反映。</p><nav><select id="page">${options}</select><select id="width"><option value="390">スマホ幅 390px</option><option value="320">小さい画面 320px</option><option value="768">タブレット幅 768px</option><option value="1440" selected>PC幅 1440px</option></select><button id="old">変更前</button><button id="new">ひな形版</button><a id="open" target="_blank" rel="noopener">記事を開く</a><span id="status"></span></nav><p>このURLは、このPC内だけで開けます。スマホから127.0.0.1を開いても表示されません。上の幅切替でスマホ幅を確認できます。送信・投票・外部計測は隔離しています。</p></header><div class="stage"><iframe id="view" title="記事の比較プレビュー"></iframe></div><script>const page=document.querySelector('#page'),width=document.querySelector('#width'),view=document.querySelector('#view'),openLink=document.querySelector('#open'),status=document.querySelector('#status');let mode='after';function show(){const url='/'+mode+'/'+page.value;view.style.width=width.value+'px';view.src=url;openLink.href=url;status.textContent=mode==='after'?'ひな形版':'変更前';}page.onchange=show;width.onchange=show;document.querySelector('#old').onclick=()=>{mode='before';show()};document.querySelector('#new').onclick=()=>{mode='after';show()};show();</script></html>`;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
 try{
  const path=decodeURIComponent(new URL(req.url,'http://local').pathname);let data,type;
  if(path==='/'){data=portal;type=mime['.html'];}
  else{
   let relative=path.slice(1),folder;
   if(relative.startsWith('before/')){folder=resolve(build,'before');relative=relative.slice(7);}
   else if(relative.startsWith('after/')){folder=resolve(build,'review');relative=relative.slice(6);}
   else if(relative.startsWith('assets/'))folder=resolve(build,'review');
   else throw Error('Unknown route');
   if(!resolve(folder,relative).startsWith(folder+sep)||(!/^(en\/)?articles\/[a-z0-9-]+\.html$/.test(relative)&&!relative.startsWith('assets/')))throw Error('Invalid preview path');
   try{data=await readFile(resolve(folder,relative));}catch{
    if(!relative.startsWith('assets/'))throw Error('Missing page');
    try{data=await readFile(resolve(build,'review',relative));}catch{data=await readFile(resolve(root,relative));}
   }
   type=mime[extname(relative)]||'application/octet-stream';
  }
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow'}).end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'X-Robots-Tag':'noindex,nofollow'}).end('この比較プレビューの対象外です。');}
});
server.listen(Number(process.env.HERO_REVIEW_PORT||18876),'127.0.0.1',()=>console.log('Hero preview: http://127.0.0.1:'+(process.env.HERO_REVIEW_PORT||18876)+'/'));
