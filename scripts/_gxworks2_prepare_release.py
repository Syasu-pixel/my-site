"""One-time, branch-only migration of the approved GX Works2 Preview.
No uploads, consultation writes, mail sending, or image recompression.
Remove this preparation script and its workflow before production merge.
"""
from pathlib import Path
import hashlib
import json
import re
from datetime import datetime, timezone, timedelta
from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
EVIDENCE = ROOT / 'gxw-release-evidence'
EVIDENCE.mkdir(exist_ok=True)
BASE = 'http://127.0.0.1:8765'
PUBLIC = 'https://denkicontrol.com'
SERVICE = '/services/gxworks2-online-support.html'
WRAPPER = ROOT / 'articles/_preview-gxworks2-online-support.html'
LIVE = ROOT / 'articles/_preview-gxworks2-online-support-live.html'


def once(text, old, new):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'Expected one migration anchor, got {count}: {old[:100]}')
    return text.replace(old, new, 1)


def between(text, start, end):
    if text.count(start) != 1 or text.count(end) != 1:
        raise RuntimeError('Source block anchors are not unique')
    a = text.index(start)
    b = text.index(end, a)
    return text[a:b]


assert WRAPPER.exists() and LIVE.exists(), 'Approved Preview sources required'
wrapper = WRAPPER.read_text(encoding='utf-8')
live = LIVE.read_text(encoding='utf-8')
assert 'background-size:100% 100%,contain!important' in wrapper
assets = {
    'hero': ('b0c09ad7faf0e77f08aef4524859bace0e5f3bb91de1ba48646855bacad58ccf', [1672, 941]),
    'ogp': ('3504b6ade8d8227a1e25a65a1de20875529492f7a92a2972dfeb580954dad855', [1536, 1024]),
}
for kind, (expected, dimensions) in assets.items():
    data = (ROOT / f'assets/images/services/gxworks2-online-support-{kind}.webp').read_bytes()
    assert hashlib.sha256(data).hexdigest() == expected, kind + ': approved image mismatch'
    assert data[:4] == b'RIFF' and data[8:12] == b'WEBP'

# Reuse only real intake code, plus ZIP/clipboard UI code. Never copy the demo handler.
blocks = re.findall(r'<script>\s*([\s\S]*?)</script>', live)
assert len(blocks) == 1
logic = blocks[0]
logic = once(logic, "  const shell=document.getElementById('previewShell');\n", '')
start = logic.index('  function doc(){')
end = logic.index('  function newKey(){', start)
logic = logic[:start] + '  function doc(){return document;}\n' + logic[end:]
logic = once(logic, "  shell.addEventListener('load',()=>{let n=0;const t=setInterval(()=>{n++;wire();if(wired||n>80)clearInterval(t);},250);});", '  wire();')
logic = logic.replace('gxw-preview-idempotency-key', 'gxw-consultation-idempotency-key-v1')
logic = logic.replace('gxw-preview-idempotency-payload', 'gxw-consultation-idempotency-payload-v1')
logic = once(logic, 'const main=old.cloneNode(true);', 'const main=old.cloneNode(true);main.disabled=false;')
logic = once(logic, "const pl=payload(),key=submission(pl);main.disabled=true;", "if(!fields.email.checkValidity()){sendStatus.textContent='返信用メールアドレスをご確認ください。';fields.email.focus();return;}\n      if(f.size<1){sendStatus.textContent='空のZIPファイルは送信できません。';return;}\n      const pl=payload(),key=submission(pl);main.disabled=true;")
zip_ui = between(wrapper, '        let selectedZip=null;', '        const demoButton=')
copy_ui = between(wrapper, "        const copy=d.getElementById('preview-copy-case');", '        const faq=')
zip_ui = once(zip_ui, "drop.addEventListener('click',()=>input.click());", "drop.addEventListener('click',e=>{if(e.target!==input)input.click();});")
js = '// GX Works2 public intake: approved two-step API flow, no demo handlers.\n' + '(()=>{const d=document;\n' + zip_ui + copy_ui + '\n})();\n' + logic + '\n'
assert 'const sample=' not in js and 'GXW-20260916-001' not in js
assert 'contentDocument' not in js and 'previewShell' not in js
(ROOT / 'assets/js').mkdir(parents=True, exist_ok=True)
(ROOT / 'assets/js/gxworks2-consultation.js').write_text(js, encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    # Do not send anything to the live API while rendering the source Preview.
    context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(BASE + '/') else route.abort())
    page = context.new_page()
    page.goto(BASE + '/articles/_preview-gxworks2-online-support-live.html', wait_until='networkidle')
    page.wait_for_function("""() => {
      const outer=document.getElementById('previewShell')?.contentDocument;
      const d=outer?.getElementById('previewFrame')?.contentDocument;
      return d?.getElementById('case-number')?.readOnly && d?.getElementById('password-submit-live');
    }""", timeout=30000)
    doc = page.frames[-1]
    assert doc.locator('#consultationForm').count() == 1
    approved_text = doc.locator('main').inner_text()
    (EVIDENCE / 'approved-main-text.txt').write_text(approved_text, encoding='utf-8')
    doc.locator('.article-hero').screenshot(path=str(EVIDENCE / 'approved-hero.png'))
    html = doc.evaluate("""({publicOrigin, service}) => {
      const meta=(key,value,attr='property')=>{
        let e=document.head.querySelector(`meta[${attr}="${key}"]`);
        if(!e){e=document.createElement('meta');e.setAttribute(attr,key);document.head.appendChild(e);}
        e.content=value;
      };
      meta('robots','index,follow','name');
      meta('og:url',publicOrigin+service);
      meta('og:image',publicOrigin+'/assets/images/services/gxworks2-online-support-ogp.webp');
      meta('og:image:width','1536');meta('og:image:height','1024');meta('og:image:type','image/webp');
      meta('og:image:alt','GX Works2 オンライン相談サービス。先輩と後輩のイラスト。');
      meta('twitter:card','summary_large_image','name');
      meta('twitter:image',publicOrigin+'/assets/images/services/gxworks2-online-support-ogp.webp','name');
      meta('twitter:image:alt','GX Works2 オンライン相談サービス','name');
      document.querySelector('link[rel="canonical"]').href=publicOrigin+service;
      document.getElementById('preview-case-code').textContent='';
      document.getElementById('case-number').value='';
      document.getElementById('preview-submit-demo').disabled=true;
      document.getElementById('password-submit-live').disabled=true;
      document.getElementById('send-status').setAttribute('role','status');
      document.getElementById('send-status').setAttribute('aria-live','polite');
      ['name','email','problem','desired'].forEach(id=>document.getElementById(id).required=true);
      document.getElementById('zip-password').setAttribute('aria-label','ZIPパスワード');
      const operator=document.createElement('p');operator.textContent='サービス提供：株式会社ケイディエス';
      document.querySelector('.site-footer .container').prepend(operator);
      const noscript=document.createElement('noscript');noscript.textContent='相談フォームをご利用になるにはJavaScriptを有効にしてください。';
      document.getElementById('consultation').prepend(noscript);
      const script=document.createElement('script');script.src='/assets/js/gxworks2-consultation.js';script.defer=true;document.body.appendChild(script);
      return '<!DOCTYPE html>\\n'+document.documentElement.outerHTML+'\\n';
    }""", {'publicOrigin': PUBLIC, 'service': SERVICE})
    assert '<iframe' not in html
    assert 'GXW-20260916-001' not in html
    assert '.pages.dev' not in html
    assert '公開前Preview' not in html
    (ROOT / SERVICE.lstrip('/')).write_text(html, encoding='utf-8')
    browser.close()

# Small, static entry cards. Existing article shelves and English entries stay intact.
css = '''.gxw-service-entry{display:flex;align-items:center;gap:18px;margin:18px 0;padding:16px 20px;border:1px solid #bfdbfe;border-radius:20px;background:#f8fbff;color:#0f172a;text-decoration:none;line-height:1.6}.gxw-service-entry:hover{border-color:#2563eb;text-decoration:none}.gxw-service-entry img{display:block;width:144px;max-width:28%;height:auto!important;object-fit:contain!important;flex:0 0 auto}.gxw-service-entry-copy{flex:1;min-width:0}.gxw-service-entry strong{display:block;font-size:18px;color:#1d4ed8}.gxw-service-entry p{margin:4px 0;font-size:13px;color:#475569}.gxw-service-entry small{font-size:12px;color:#475569}.gxw-service-entry-arrow{flex:0 0 auto;font-size:22px;color:#1d4ed8}@media(max-width:640px){.gxw-service-entry{gap:12px;padding:14px;margin:14px 0}.gxw-service-entry img{width:90px;max-width:25%}.gxw-service-entry strong{font-size:15px}.gxw-service-entry p{font-size:12px}.gxw-service-entry-arrow{display:none}}
'''
(ROOT / 'assets/css').mkdir(parents=True, exist_ok=True)
(ROOT / 'assets/css/gxworks2-service-entry.css').write_text(css, encoding='utf-8')
card = '''
      <a class="gxw-service-entry" href="/services/gxworks2-online-support.html" aria-label="GX Works2 オンライン相談サービスを見る">
        <img src="/assets/images/services/gxworks2-online-support-ogp.webp" width="1536" height="1024" alt="GX Works2 オンライン相談サービス" loading="lazy" decoding="async">
        <div class="gxw-service-entry-copy"><strong>GX Works2 オンライン相談</strong><p>既設設備の回路変更・動作変更について、まずはご相談ください。</p><small>会員登録不要｜データ確認後にお見積り</small></div><span class="gxw-service-entry-arrow" aria-hidden="true">→</span>
      </a>
'''
for file in ('index.html', 'categories/control-basics.html'):
    path = ROOT / file
    text = path.read_text(encoding='utf-8')
    assert 'class="gxw-service-entry"' not in text
    text = once(text, '</head>', '  <link rel="stylesheet" href="/assets/css/gxworks2-service-entry.css">\n</head>')
    if file == 'index.html':
        text = once(text, '<main class="top-main-layout">', card + '\n      <main class="top-main-layout">')
    else:
        # Keep the existing category hero untouched; place the entry after its breadcrumb.
        match = re.search(r'<nav\b[^>]*class="breadcrumb"[^>]*>[\s\S]*?</nav>', text)
        assert match, 'Category breadcrumb anchor missing'
        pos = match.end()
        text = text[:pos] + '\n' + card + text[pos:]
    path.write_text(text, encoding='utf-8')

path = ROOT / 'assets/data/search-index.json'
text = path.read_text(encoding='utf-8')
entries = json.loads(text)
assert isinstance(entries, list) and entries
assert not any(e.get('url') == SERVICE for e in entries)
entry = {'title': 'GX Works2 設備制御・ラダー変更 オンライン相談', 'url': SERVICE, 'lang': 'ja', 'category': 'オンライン相談', 'description': '株式会社ケイディエスがGX Works2の既設設備変更をオンラインで受付。会員登録不要。データ確認後にお見積りし、お支払いは銀行振込です。', 'keywords': ['GX Works2', 'GXWorks2', 'PLC', 'ラダー変更', '既設設備', 'オンライン相談', 'ケイディエス'], 'synonyms': ['GX Works2 相談', 'GXWorks2 変更', 'PLC オンライン相談']}
tail = text.rstrip()
assert tail.endswith(']')
updated = tail[:-1].rstrip() + ',\n' + '\n'.join('  ' + line for line in json.dumps(entry, ensure_ascii=False, indent=2).splitlines()) + '\n]\n'
assert json.loads(updated)[:-1] == entries
path.write_text(updated, encoding='utf-8')

path = ROOT / 'sitemap.xml'
text = path.read_text(encoding='utf-8')
assert PUBLIC + SERVICE not in text
lastmod = datetime.now(timezone(timedelta(hours=9))).date().isoformat()
text = once(text, '</urlset>', f'  <url><loc>{PUBLIC}{SERVICE}</loc><lastmod>{lastmod}</lastmod></url>\n</urlset>')
path.write_text(text, encoding='utf-8')

# The production page must not depend on either temporary wrapper.
WRAPPER.unlink()
LIVE.unlink()
(EVIDENCE / 'production.html').write_text(html, encoding='utf-8')
(EVIDENCE / 'asset-checks.json').write_text(json.dumps(assets, indent=2), encoding='utf-8')
print('Prepared standalone page, unchanged approved images, static OGP, two navigation entries, search and sitemap.')
