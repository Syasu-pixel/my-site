"""Prepare approved service/navigation on the review branch; never publish or change the API."""
from pathlib import Path
import hashlib, http.server, json, re, threading, urllib.request
from playwright.sync_api import sync_playwright

SERVICE='services/gxworks2-online-support.html'
LIVE='articles/_preview-gxworks2-online-support-live.html'
WRAPPER='articles/_preview-gxworks2-online-support.html'
API='https://gxworks2-support-api.syasuta0819.workers.dev'
PROD='https://denkicontrol.com'
REPORT=Path('tmp/gxworks2-release-check');REPORT.mkdir(parents=True,exist_ok=True)
TARGETS=['index.html','categories/control-basics.html','categories/circuit-basics.html','articles/plc-io-unit-basic.html','articles/ladder-reading.html']
ASSETS={'assets/images/services/gxworks2-online-support-hero.webp':'600bfc6de86d743927779e62ea1b0bbeb761198f','assets/images/services/gxworks2-online-support-ogp.webp':'4ee7282af23b937d6359578e10651bfea9592cde'}
for name,expected in ASSETS.items():
    raw=Path(name).read_bytes()
    assert hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==expected, name
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8765),Quiet)
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:8765'
with sync_playwright() as p:
    browser=p.chromium.launch()
    context=browser.new_context(viewport={'width':1440,'height':1000})
    context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
    page=context.new_page();page.goto(base+'/'+LIVE,wait_until='networkidle')
    page.frame_locator('#previewShell').frame_locator('#previewFrame').locator('#password-submit-live').wait_for(state='attached')
    frame=next(f for f in page.frames if f.url.endswith('/'+SERVICE))
    frame.wait_for_function("document.querySelector('#plc')?.tagName==='SELECT'")
    frame.evaluate("""({prod,service})=>{
      const set=(selector,attribute,name,value)=>{let x=document.querySelector(selector);if(!x){x=document.createElement('meta');x.setAttribute(attribute,name);document.head.appendChild(x);}x.content=value;};
      set('meta[name="robots"]','name','robots','index,follow');
      set('meta[property="og:url"]','property','og:url',prod+'/'+service);
      set('meta[property="og:image"]','property','og:image',prod+'/assets/images/services/gxworks2-online-support-ogp.webp');
      set('meta[property="og:image:type"]','property','og:image:type','image/webp');
      set('meta[property="og:image:alt"]','property','og:image:alt','GX Works2 オンライン相談');
      set('meta[name="twitter:image"]','name','twitter:image',prod+'/assets/images/services/gxworks2-online-support-ogp.webp');
      set('meta[name="twitter:image:alt"]','name','twitter:image:alt','GX Works2 オンライン相談');
      document.querySelector('link[rel="canonical"]').href=prod+'/'+service;
      document.querySelector('#preview-case-code').textContent='';
      document.querySelector('#preview-complete').classList.remove('is-visible');
      document.querySelectorAll('.zip-paste-btn').forEach(x=>x.remove());
      document.querySelectorAll('input:not([type="checkbox"]),textarea').forEach(x=>{x.value='';x.removeAttribute('value');});
      const s=document.createElement('script');s.src='../assets/js/gxworks2-online-support.js';s.defer=true;document.head.appendChild(s);
      const ns=document.createElement('noscript');ns.textContent='相談フォームの送信にはJavaScriptを有効にしてください。';document.querySelector('#consultation').prepend(ns);
    }""",{'prod':PROD,'service':SERVICE})
    html=frame.evaluate("'<!DOCTYPE html>\\n'+document.documentElement.outerHTML")
    context.close()
    live=re.search(r'<script>([\s\S]*?)</script>',Path(LIVE).read_text()).group(1)
    assert "const shell=document.getElementById('previewShell');" in live
    live=live.replace("  const shell=document.getElementById('previewShell');\n",'')
    live,n=re.subn(r'  function doc\(\)\{[\s\S]*?\n  \}','  function doc(){return document;}',live,count=1);assert n==1
    old="  shell.addEventListener('load',()=>{let n=0;const t=setInterval(()=>{n++;wire();if(wired||n>80)clearInterval(t);},250);});"
    assert old in live
    live=live.replace(old,"  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();")
    live=live.replace('gxw-preview-idempotency-','gxw-production-idempotency-')
    extra=r'''
(()=>{
 const bind=()=>{
  const d=document,drop=d.getElementById('zip-drop'),input=d.getElementById('zip-input'),selected=d.getElementById('zip-selected'),error=d.getElementById('zip-error');
  const show=f=>{error.textContent='';error.classList.remove('is-visible');if(!f){selected.classList.remove('is-visible');return;}if(!f.name.toLowerCase().endsWith('.zip')){selected.classList.remove('is-visible');error.textContent='ZIPファイルのみ選択できます。';error.classList.add('is-visible');return;}d.getElementById('zip-file-name').textContent=f.name;d.getElementById('zip-file-size').textContent=(f.size/1048576).toFixed(2)+' MB';selected.classList.add('is-visible');};
  input.addEventListener('click',e=>e.stopPropagation());drop.addEventListener('click',()=>input.click());drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}});input.addEventListener('change',()=>show(input.files?.[0]));
  ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();e.stopPropagation();drop.classList.add('is-dragover');}));['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();e.stopPropagation();drop.classList.remove('is-dragover');}));drop.addEventListener('drop',e=>{input.value='';show(e.dataTransfer?.files?.[0]);});d.getElementById('zip-remove').addEventListener('click',e=>{e.stopPropagation();input.value='';show(null);});
  const copy=d.getElementById('preview-copy-case');copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(d.getElementById('preview-case-code').textContent);copy.textContent='コピーしました';}catch{copy.textContent='番号を選択してコピー';}});d.getElementById('send-status').setAttribute('aria-live','polite');
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
'''
    Path('assets/js').mkdir(parents=True,exist_ok=True)
    Path('assets/js/gxworks2-online-support.js').write_text(live+'\n'+extra,encoding='utf-8')
    Path(SERVICE).write_text(html,encoding='utf-8')
    Path(LIVE).unlink();Path(WRAPPER).unlink()
    assert 'previewFrame' not in html and 'previewShell' not in html
    assert 'denkicontrol-preview.pages.dev' not in html
    assert 'GXW-20260916-001' not in html+live
    css='.gxw-service-entry{display:grid;grid-template-columns:minmax(180px,280px) minmax(0,1fr);align-items:center;gap:24px;grid-column:1/-1;width:100%;margin:28px 0;padding:24px;border:1px solid #c9dcf5;border-radius:22px;background:linear-gradient(125deg,#f0f7ff,#fff);box-sizing:border-box;color:#1e293b;text-decoration:none!important;box-shadow:0 8px 22px rgba(15,23,42,.05)}.gxw-service-entry img{display:block;width:100%;height:auto;object-fit:contain;border-radius:12px}.gxw-service-entry .gxw-entry-label{display:block;color:#1d4ed8;font-size:12px;font-weight:800}.gxw-service-entry h2{margin:6px 0 10px!important;font-size:clamp(18px,2.2vw,24px)!important;line-height:1.5!important;color:#0f172a}.gxw-service-entry p{margin:0 0 14px!important;font-size:14px!important;line-height:1.8!important;color:#475569}.gxw-service-entry .gxw-entry-link{display:inline-flex;align-items:center;min-height:44px;padding:8px 16px;border-radius:11px;background:#2563eb;color:#fff;font-size:14px;font-weight:800}.gxw-service-entry:hover{border-color:#2563eb}.gxw-service-entry:focus-visible{outline:3px solid #2563eb;outline-offset:4px}@media(max-width:640px){.gxw-service-entry{grid-template-columns:1fr;gap:16px;padding:18px}.gxw-service-entry img{max-width:360px;justify-self:center}.gxw-service-entry .gxw-entry-link{display:flex;justify-content:center}}\n'
    Path('assets/css').mkdir(parents=True,exist_ok=True);Path('assets/css/gxworks2-service-entry.css').write_text(css)
    for name in TARGETS:
        path=Path(name);original=path.read_text(encoding='utf-8');assert 'id="gxworks2-service-entry"' not in original,name
        prefix='./' if name=='index.html' else '../'
        card=f'''\n<!-- GX Works2 service entry: existing learning/support links remain unchanged -->
<a class="gxw-service-entry" id="gxworks2-service-entry" href="{prefix}{SERVICE}">
  <img src="{prefix}assets/images/services/gxworks2-online-support-hero.webp" width="1672" height="941" loading="lazy" decoding="async" alt="GX Works2オンライン相談の案内">
  <div><span class="gxw-entry-label">GX Works2をご利用の方へ</span><h2>GX Works2 設備制御・ラダー変更のオンライン相談</h2><p>既設設備の制御について個別に相談したい方へ。対応範囲・必要な資料・料金の目安を、相談ページでご確認いただけます。</p><span class="gxw-entry-link">対応内容・料金・相談方法を見る →</span></div>
</a>\n'''
        if name.startswith('articles/'):
            related=re.search(r'<section\b[^>]*(?:\bid=["\']related[^"\']*["\']|\bclass=["\'][^"\']*\brelated[^"\']*["\'])[^>]*>',original,re.I)
            anchor=related.start() if related else original.rfind('</article>')
        else: anchor=-1
        if anchor<0: anchor=original.rfind('</main>')
        assert anchor>=0,f'No safe insertion point: {name}'
        updated=original[:anchor]+card+original[anchor:]
        assert updated.count('</head>')==1
        updated=updated.replace('</head>',f'  <link rel="stylesheet" href="{prefix}assets/css/gxworks2-service-entry.css">\n</head>',1)
        path.write_text(updated,encoding='utf-8')
    sitemap=Path('sitemap.xml')
    if sitemap.exists():
        s=sitemap.read_text()
        if '<urlset' in s and PROD+'/'+SERVICE not in s:
            sitemap.write_text(s.replace('</urlset>',f'  <url><loc>{PROD}/{SERVICE}</loc><lastmod>2026-09-17</lastmod></url>\n</urlset>'))
    for name in ['assets/data/search-index.json','search-index.json']:
        path=Path(name)
        if not path.exists(): continue
        data=json.loads(path.read_text());items=data if isinstance(data,list) else data.get('items')
        if not isinstance(items,list): continue
        if not any(SERVICE in str(x.get('url',x.get('href',''))) for x in items):
            items.append({'title':'GX Works2 設備制御・ラダー変更 オンライン相談','url':'/'+SERVICE,'description':'GX Works2を使用する既設設備のオンライン相談。対応範囲・必要資料・料金の目安。','keywords':'GX Works2 PLC ラダー オンライン相談'})
            path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    ctx=browser.new_context(viewport={'width':1440,'height':1000})
    state={'found':False,'zipUploaded':False,'completed':False,'passwordReceived':False,'caseNumber':'GXW-TEST-0001','creates':0}
    def mock(route):
        def reply(status=200,data=None):
            route.fulfill(status=status,json=data or {},headers={'Access-Control-Allow-Origin':base,'Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'content-type,x-gxw-idempotency-key,x-gxw-file-size'})
        if route.request.method=='OPTIONS': reply();return
        endpoint=route.request.url.removeprefix(API)
        if endpoint=='/consultations/status': reply(status=200 if state['found'] else 404,data={'ok':True,**state})
        elif endpoint=='/consultations/zip': state['zipUploaded']=True;reply(data={'ok':True})
        elif endpoint=='/consultations/password': state['passwordReceived']=True;reply(data={'ok':True})
        elif endpoint=='/consultations':
            if not state['found']: state['creates']+=1
            state['found']=True;state['completed']=state['zipUploaded'];reply(data={'ok':True,**state})
        else: reply(status=404,data={'ok':False})
    ctx.route(API+'/**',mock)
    page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'/'+SERVICE,wait_until='networkidle')
    assert page.locator('iframe').count()==0
    assert page.locator('meta[property="og:image"]').get_attribute('content')==PROD+'/assets/images/services/gxworks2-online-support-ogp.webp'
    assert page.locator('meta[name="twitter:card"]').get_attribute('content')=='summary_large_image'
    assert 'contain' in page.locator('.article-hero').evaluate('(x)=>getComputedStyle(x).backgroundSize')
    for width,label in [(1440,'desktop'),(768,'tablet'),(390,'mobile')]:
        page.set_viewport_size({'width':width,'height':1000})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' overflow'
        page.screenshot(path=str(REPORT/(label+'.png')),full_page=True)
    page.set_viewport_size({'width':1440,'height':1000})
    for key,val in {'name':'Test','email':'test@example.com','problem':'UI validation only','desired':'UI validation only'}.items(): page.locator('#'+key).fill(val)
    page.locator('#zip-input').set_input_files({'name':'test.zip','mimeType':'application/zip','buffer':b'PK\x03\x04ui-test'})
    page.locator('#preview-submit-demo').click();page.locator('#preview-complete.is-visible').wait_for()
    assert page.locator('#case-number').input_value()==state['caseNumber']
    page.locator('#zip-password').fill('ui-test-only');page.locator('#password-submit-live').click();page.locator('.password-send-ok').wait_for()
    page.reload(wait_until='networkidle');page.locator('#preview-complete.is-visible').wait_for()
    assert state['creates']==1 and state['passwordReceived']
    assert not errors,errors
    for name in TARGETS:
        page.goto(base+'/'+name,wait_until='domcontentloaded');link=page.locator('#gxworks2-service-entry')
        assert link.count()==1
        assert link.evaluate('(x)=>new URL(x.href).pathname')=='/'+SERVICE
        page.set_viewport_size({'width':390,'height':900});assert link.bounding_box()['width']<=390
    ctx.close();browser.close()
readiness={'checkedAt':'2026-09-17','checks':{},'ready':False}
try:
    req=urllib.request.Request(API+'/',headers={'Origin':PROD})
    with urllib.request.urlopen(req,timeout=25) as r: health=json.load(r)
    readiness['checks']['health']={k:health.get(k) for k in ['ok','r2','db','passwordStorage']}
    for method,path in [('POST','/consultations'),('PUT','/consultations/zip'),('POST','/consultations/password')]:
        req=urllib.request.Request(API+path,method='OPTIONS',headers={'Origin':PROD,'Access-Control-Request-Method':method,'Access-Control-Request-Headers':'content-type,x-gxw-idempotency-key,x-gxw-file-size'})
        with urllib.request.urlopen(req,timeout=25) as r: readiness['checks'][path]={'status':r.status,'origin':r.headers.get('Access-Control-Allow-Origin'),'methods':r.headers.get('Access-Control-Allow-Methods')}
    readiness['ready']=all(health.get(k) is True for k in ['ok','r2','db','passwordStorage']) and all(v['origin']==PROD for k,v in readiness['checks'].items() if k!='health')
except Exception as e: readiness['error']=str(e)
(REPORT/'readiness.json').write_text(json.dumps(readiness,ensure_ascii=False,indent=2)+'\n')
(REPORT/'service.html').write_text(Path(SERVICE).read_text())
(REPORT/'report.json').write_text(json.dumps({'uiChecks':'passed','entryPages':TARGETS,'imageBlobs':ASSETS,'mockSubmission':'passed','liveWrites':0,'readiness':readiness},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'uiChecks':'passed','entryPages':TARGETS,'readiness':readiness},ensure_ascii=False,indent=2))
server.shutdown()
