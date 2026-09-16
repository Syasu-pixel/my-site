"""Branch-only release tests. Customer submissions are mocked, never sent."""
from pathlib import Path
import json
import hashlib
import io
import uuid
import zipfile
import xml.etree.ElementTree as ET
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / 'gxw-release-evidence'
OUT.mkdir(exist_ok=True)
BASE = 'http://127.0.0.1:8765'
API = 'https://gxworks2-support-api.syasuta0819.workers.dev'
PROD = 'https://denkicontrol.com'
SERVICE = '/services/gxworks2-online-support.html'
report = {'live_consultations_created': 0, 'checks': []}


def passed(name):
    report['checks'].append(name)
    print('PASS:', name)


def http(method, path, body=None, headers=None):
    req = Request(API + path, data=None if body is None else json.dumps(body).encode(), method=method, headers={'Origin': PROD, **(headers or {})})
    try:
        response = urlopen(req, timeout=30)
    except HTTPError as error:
        response = error
    data = response.read()
    return response.status, response.headers, json.loads(data) if data else None

# Read-only checks against the already deployed Worker. Never call live create/ZIP/password routes.
status, headers, health = http('GET', '/')
assert status == 200 and health.get('ok')
assert all(health.get(k) for k in ('r2', 'db', 'passwordStorage')), 'Existing API binding not ready'
assert health.get('adminZipAttachmentMaxBytes') == 20 * 1024 * 1024
passed('Existing Worker health and R2/D1/password bindings')
for path, method, request_headers in [('/consultations', 'POST', 'content-type'), ('/consultations/zip', 'PUT', 'content-type,x-gxw-idempotency-key,x-gxw-file-size'), ('/consultations/password', 'POST', 'content-type')]:
    status, headers, data = http('OPTIONS', path, headers={'Access-Control-Request-Method': method, 'Access-Control-Request-Headers': request_headers})
    assert status == 204
    assert headers.get('Access-Control-Allow-Origin') == PROD, 'Production CORS origin rejected'
    allowed = headers.get('Access-Control-Allow-Headers', '').lower()
    assert all(h in allowed for h in request_headers.split(','))
passed('Production-origin CORS for both form steps and ZIP upload')
status, headers, state = http('POST', '/consultations/status', {'idempotencyKey': 'gxw_release_readonly_' + uuid.uuid4().hex}, {'Content-Type': 'application/json'})
assert status == 404 and not state.get('found'), 'Unexpected status probe result'
assert headers.get('Access-Control-Allow-Origin') == PROD
passed('Read-only production-origin receipt status probe')

html = (ROOT / SERVICE.lstrip('/')).read_text(encoding='utf-8')
assert '<iframe' not in html and 'GXW-20260916-001' not in html and '.pages.dev' not in html
assert '公開前Preview' not in html and '株式会社ケイディエス' in html
assert 'background-size:100% 100%,contain!important' in html
assert not (ROOT / 'articles/_preview-gxworks2-online-support.html').exists()
assert not (ROOT / 'articles/_preview-gxworks2-online-support-live.html').exists()
passed('Standalone production HTML, no demo receipt or wrapper dependency')
entries = json.loads((ROOT / 'assets/data/search-index.json').read_text(encoding='utf-8'))
assert sum(e.get('url') == SERVICE for e in entries) == 1
root = ET.fromstring((ROOT / 'sitemap.xml').read_text(encoding='utf-8'))
assert sum(e.text == PROD + SERVICE for e in root.iter() if e.tag.endswith('loc')) == 1
passed('Single Japanese search entry and canonical sitemap entry')

buf = io.BytesIO()
with zipfile.ZipFile(buf, 'w') as z:
    z.writestr('test.txt', 'Mock-only intake test. No customer project data.')
fixture = {'name': 'intake-fixture.zip', 'mimeType': 'application/zip', 'buffer': buf.getvalue()}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for retry in (False, True):
        context = browser.new_context(viewport={'width': 1440, 'height': 1000})
        records = {}
        calls = {'create': 0, 'zip': 0, 'password': 0}
        failures = {'zip': retry, 'password': retry}
        errors = []

        def route_handler(route):
            req = route.request
            if req.url.startswith(BASE + '/'):
                return route.continue_()
            if not req.url.startswith(API + '/'):
                return route.abort()
            cors = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS'}
            def answer(data, status=200):
                route.fulfill(status=status, headers=cors, content_type='application/json', body=json.dumps(data))
            if req.method == 'OPTIONS':
                return route.fulfill(status=204, headers=cors)
            path = req.url[len(API):]
            if path == '/consultations/status':
                key = req.post_data_json['idempotencyKey']
                if key not in records:
                    return answer({'ok': False, 'found': False}, 404)
                return answer({'ok': True, 'found': True, **records[key]})
            if path == '/consultations':
                calls['create'] += 1
                body = req.post_data_json
                assert 'password' not in body and 'zip_secret' not in body
                key = body['idempotencyKey']
                row = records.setdefault(key, {'caseNumber': 'GXW-20990101-00000001', 'zipUploaded': False, 'completed': False, 'passwordReceived': False})
                if row['zipUploaded']:
                    row['completed'] = True
                return answer({'ok': True, 'uploadRequired': not row['zipUploaded'], **row})
            if path == '/consultations/zip':
                calls['zip'] += 1
                key = req.headers['x-gxw-idempotency-key']
                assert key in records
                assert req.headers['content-type'] == 'application/zip'
                if failures['zip']:
                    failures['zip'] = False
                    return answer({'ok': False, 'error': 'Mock transient ZIP error'}, 503)
                records[key]['zipUploaded'] = True
                return answer({'ok': True})
            if path == '/consultations/password':
                calls['password'] += 1
                body = req.post_data_json
                assert set(body) == {'idempotencyKey', 'caseNumber', 'password'}
                key = body['idempotencyKey']
                assert records[key]['completed'] and body['password'] == 'mock-password-not-sent'
                if failures['password']:
                    failures['password'] = False
                    return answer({'ok': False, 'error': 'Mock transient password error'}, 503)
                records[key]['passwordReceived'] = True
                return answer({'ok': True})
            raise AssertionError('Unexpected API route: ' + path)

        context.route('**/*', route_handler)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE + SERVICE, wait_until='networkidle')
        page.wait_for_function("() => !document.getElementById('preview-submit-demo').disabled")
        assert page.locator('#case-number').evaluate('(e)=>e.readOnly')
        assert page.locator('#case-number').input_value() == ''
        assert page.locator('#password-submit-live').is_disabled()
        page.locator('#preview-submit-demo').click()
        assert not records
        for name, value in {'name': '受付検証', 'email': 'intake-test@example.com', 'company': '送信しない検証', 'problem': 'フォームの動作確認', 'desired': '本番には送信しないテスト'}.items():
            page.locator('#' + name).fill(value)
        page.locator('#plc').select_option(label='FX3U')
        page.locator('#zip-input').set_input_files(fixture)
        assert page.locator('#zip-file-name').inner_text() == fixture['name']
        page.evaluate("() => {const b=document.getElementById('preview-submit-demo');b.click();b.click();}")
        if retry:
            page.wait_for_function("() => document.getElementById('send-status').textContent.includes('送信に失敗しました')")
            assert not page.locator('#preview-submit-demo').is_disabled()
            page.locator('#preview-submit-demo').click()
        page.wait_for_selector('#preview-complete.is-visible')
        assert page.locator('#preview-submit-demo').is_disabled()
        assert page.locator('#case-number').input_value() == 'GXW-20990101-00000001'
        assert len(records) == 1
        page.locator('#zip-password').fill('mock-password-not-sent')
        page.locator('#password-eye').click()
        assert page.locator('#zip-password').get_attribute('type') == 'text'
        page.locator('#password-eye').click()
        assert page.locator('#zip-password').get_attribute('type') == 'password'
        page.evaluate("() => {const b=document.getElementById('password-submit-live');b.click();b.click();}")
        if retry:
            page.wait_for_selector('.password-send-error')
            page.locator('#password-submit-live').click()
        page.wait_for_selector('.password-send-ok')
        assert '原則2営業日以内' in page.locator('.password-send-ok').inner_text()
        assert page.locator('#password-submit-live').is_disabled()
        assert page.locator('#zip-password').input_value() == ''
        assert calls['zip'] == (2 if retry else 1)
        assert calls['password'] == (2 if retry else 1)
        page.reload(wait_until='networkidle')
        page.wait_for_function("() => document.getElementById('password-submit-live').dataset.sent==='1'")
        assert page.locator('#preview-submit-demo').is_disabled()
        assert len(records) == 1 and not errors, errors
        context.close()
        passed('Mock-only two-step intake, readonly receipt, no double-submit, reload restoration' + (' with ZIP/password failure recovery' if retry else ''))

    # Fresh contexts: static OGP and visual checks must not show any test receipt.
    for label, width, height in [('desktop', 1440, 1000), ('tablet', 820, 1180), ('mobile', 390, 844)]:
        context = browser.new_context(viewport={'width': width, 'height': height})
        context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(BASE + '/') else route.abort())
        page = context.new_page()
        page.goto(BASE + SERVICE, wait_until='networkidle')
        assert page.locator('iframe').count() == 0
        assert page.locator('meta[property="og:image"]').get_attribute('content') == PROD + '/assets/images/services/gxworks2-online-support-ogp.webp'
        assert page.locator('meta[name="twitter:card"]').get_attribute('content') == 'summary_large_image'
        assert 'noindex' not in page.locator('meta[name="robots"]').get_attribute('content')
        assert 'contain' in page.locator('.article-hero').evaluate('(e)=>getComputedStyle(e).backgroundSize')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), label + ': horizontal overflow'
        for kind, expected in [('hero', [1672, 941]), ('ogp', [1536, 1024])]:
            size = page.evaluate("""async kind => {const i=new Image();i.src='/assets/images/services/gxworks2-online-support-'+kind+'.webp';await i.decode();return [i.naturalWidth,i.naturalHeight];}""", kind)
            assert size == expected
        page.screenshot(path=str(OUT / (label + '.png')))
        page.locator('.article-hero').screenshot(path=str(OUT / (label + '-hero.png')))
        if label == 'desktop':
            page.locator('#consultation').screenshot(path=str(OUT / 'form.png'))
            public_text = page.locator('main').inner_text()
            expected_text = (OUT / 'approved-main-text.txt').read_text(encoding='utf-8')
            assert public_text == expected_text, 'Visible approved service copy changed unexpectedly'
        for file in ('index.html', 'categories/control-basics.html'):
            page.goto(BASE + '/' + file, wait_until='networkidle')
            card = page.locator('.gxw-service-entry')
            assert card.count() == 1 and card.get_attribute('href') == SERVICE
            box = card.bounding_box()
            assert box and box['x'] >= -1 and box['x'] + box['width'] <= width + 1
            assert card.locator('img').evaluate('(e)=>e.complete && e.naturalWidth===1536')
            card.screenshot(path=str(OUT / (label + '-' + ('home' if file == 'index.html' else 'category') + '-entry.png')))
        context.close()
        passed(label + ': hero contain, full-resolution assets, static metadata, entry links')
    browser.close()

report['all_passed'] = True
(OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
