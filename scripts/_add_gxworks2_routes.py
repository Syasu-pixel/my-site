from pathlib import Path

ROOT = Path('.')
SERVICE = '/services/gxworks2-online-support.html'
CSS = '/assets/css/gxworks2-service-entry.css'

CARD = '''
      <a class="gxw-service-entry" href="/services/gxworks2-online-support.html" aria-label="GX Works2 オンライン相談サービスを見る">
        <img src="/assets/images/services/gxworks2-online-support-ogp.webp" width="1536" height="1024" alt="GX Works2 オンライン相談サービス" loading="lazy" decoding="async">
        <div class="gxw-service-entry-copy">
          <strong>実際のGX Works2変更でお困りなら</strong>
          <p>既設設備のラダー変更・動作変更は、プロジェクトデータを確認してオンラインで対応します。</p>
          <small>会員登録不要｜データ確認後にお見積り</small>
        </div>
        <span class="gxw-service-entry-arrow" aria-hidden="true">→</span>
      </a>
'''


def add_css(text):
    if CSS in text:
        return text
    marker = '</head>'
    assert text.count(marker) == 1
    return text.replace(marker, f'  <link rel="stylesheet" href="{CSS}">\n{marker}', 1)


def add_before_related(path):
    text = path.read_text(encoding='utf-8')
    assert 'class="gxw-service-entry"' not in text, f'{path}: route already exists'
    text = add_css(text)
    marker = '<section class="section-card" id="related"'
    assert text.count(marker) == 1, f'{path}: related anchor count={text.count(marker)}'
    text = text.replace(marker, CARD + '\n      ' + marker, 1)
    path.write_text(text, encoding='utf-8')


def add_after_breadcrumb(path):
    text = path.read_text(encoding='utf-8')
    assert 'class="gxw-service-entry"' not in text, f'{path}: route already exists'
    text = add_css(text)
    start = text.index('<nav class="breadcrumb"')
    end = text.index('</nav>', start) + len('</nav>')
    text = text[:end] + '\n' + CARD + text[end:]
    path.write_text(text, encoding='utf-8')

add_after_breadcrumb(ROOT / 'categories/circuit-basics.html')
for rel in [
    'articles/plc-io-unit-basic.html',
    'articles/plc-drilling-line-design-project-01.html',
    'articles/plc-drilling-line-design-project-02.html',
]:
    add_before_related(ROOT / rel)

# Static validation: only one route, stylesheet and service URL per target.
for rel in [
    'categories/circuit-basics.html',
    'articles/plc-io-unit-basic.html',
    'articles/plc-drilling-line-design-project-01.html',
    'articles/plc-drilling-line-design-project-02.html',
]:
    text = (ROOT / rel).read_text(encoding='utf-8')
    assert text.count('class="gxw-service-entry"') == 1, rel
    assert text.count(CSS) == 1, rel
    assert SERVICE in text, rel

print('GX Works2 routes added to 4 scoped Japanese pages.')
