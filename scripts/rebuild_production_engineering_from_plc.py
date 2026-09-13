from pathlib import Path
import re

repo = Path('.')
tpl = (repo/'articles/plc-control-engineer-career.html').read_text(encoding='utf-8')
cur = (repo/'articles/production-engineering-career.html').read_text(encoding='utf-8')

# Start from the approved PLC career article itself.
s = tpl

# Head/meta and slug-only replacements. CSS/layout remain the PLC template verbatim.
repls = {
    'plc-control-engineer-career': 'production-engineering-career',
    'PLC・制御設計エンジニアとは？仕事内容・必要スキル・キャリアを解説 | 電気と制御の実務メモ': '生産技術とは？仕事内容・必要スキル・キャリアを現場目線で解説 | 電気と制御の実務メモ',
    'PLC・制御設計エンジニアの仕事内容、必要な電気知識・PLCスキル、向いている人、キャリアの広げ方、転職時に確認したいポイントを現場目線で整理します。': '生産技術の仕事内容、工程設計・設備導入・立上げ・改善、必要な電気・機械・制御の基礎、未経験からの学び方、キャリアの広げ方を現場目線で整理します。',
    'PLC・制御設計エンジニアとは？仕事内容・必要スキル・キャリアを解説': '生産技術とは？仕事内容・必要スキル・キャリアを現場目線で解説',
    'PLC・制御設計の仕事を、仕事内容・必要スキル・キャリア・転職の順に整理します。': '生産技術の仕事を、仕事内容・必要スキル・設備導入・改善・キャリアの順に整理します。',
    'PLC・制御設計エンジニアとは？仕事内容・必要スキル・キャリア': '生産技術とは？仕事内容・必要スキル・キャリア',
    '<span>PLC・制御設計エンジニアとは？</span>': '<span>生産技術とは？</span>',
}
for a,b in repls.items():
    s = s.replace(a,b)

# Helper: extract approved draft content section, then place it into the copied PLC structure.
def section(html, sid):
    m = re.search(rf'<section class="article-card" id="{re.escape(sid)}">.*?</section>', html, re.S)
    if not m:
        raise RuntimeError(f'missing section: {sid}')
    return m.group(0)

def between(html, start_marker, end_marker):
    a = html.find(start_marker)
    if a < 0:
        raise RuntimeError(f'missing start marker: {start_marker}')
    b = html.find(end_marker, a)
    if b < 0:
        raise RuntimeError(f'missing end marker: {end_marker}')
    return html[a:b], a, b

# Hero: keep PLC outer structure/id exactly, use production-engineering copy only for the inner copy.
hero_cur = re.search(r'<section class="article-hero"[^>]*>\s*<div class="article-hero-copy">(.*?)</div>\s*</section>', cur, re.S)
if not hero_cur:
    raise RuntimeError('missing production hero')
hero = '<section class="article-hero" id="top">\n      <div class="article-hero-copy">' + hero_cur.group(1) + '</div>\n    </section>'
s, n = re.subn(r'<section class="article-hero" id="top">.*?</section>', hero, s, count=1, flags=re.S)
if n != 1:
    raise RuntimeError('hero replace failed')

# Summary contains nested <section> tags, so replace by the stable layout marker instead of regex nesting.
cur_summary_block, _, _ = between(cur, '<section class="top-summary"', '<div class="layout">')
inner_start = cur_summary_block.find('>') + 1
inner_end = cur_summary_block.rfind('</section>')
if inner_start <= 0 or inner_end < 0:
    raise RuntimeError('missing production summary inner content')
summary = '<section class="top-summary" aria-label="この記事の要点">' + cur_summary_block[inner_start:inner_end] + '</section>\n\n    '
tpl_summary_block, a, b = between(s, '<section class="top-summary"', '<div class="layout">')
s = s[:a] + summary + s[b:]

for sid in ['overview','work','skills','beginner','career','job-check','service','summary']:
    new = section(cur, sid)
    s, n = re.subn(rf'<section class="article-card" id="{re.escape(sid)}">.*?</section>', lambda m,new=new:new, s, count=1, flags=re.S)
    if n != 1:
        raise RuntimeError(f'replace failed: {sid}')

# Keep PLC dialogue placement: kouhai on right/pink, senpai on left/blue.
overview = section(s, 'overview')
overview = overview.replace('<div class="talk-row"><div class="talk-avatar"><img src="../assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png"', '<div class="talk-row talk-row--right"><div class="talk-avatar"><img src="../assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png"', 1)
overview = overview.replace('<div class="talk-row talk-row--right"><div class="talk-avatar"><img src="../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png"', '<div class="talk-row"><div class="talk-avatar"><img src="../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png"', 1)
s = re.sub(r'<section class="article-card" id="overview">.*?</section>', overview, s, count=1, flags=re.S)

# PLC figure markup convention: fixed 1200x900 body figures, lazy loading.
for name in ['overview','skills','career']:
    pattern = rf'<img src="\.\./assets/images/production-engineering-career/production-engineering-career-{name}\.webp"([^>]*)>'
    def fix_img(m):
        attrs = re.sub(r'\s+(?:width|height|loading|decoding)="[^"]*"', '', m.group(1))
        return f'<img src="../assets/images/production-engineering-career/production-engineering-career-{name}.webp"{attrs} width="1200" height="900" loading="lazy">'
    s, n = re.subn(pattern, fix_img, s, count=1)
    if n != 1:
        raise RuntimeError(f'figure replace failed: {name}')

# Side content can change, but the aside structure remains PLC.
aside_cur = re.search(r'<aside class="side" aria-label="補足情報">(.*?)</aside>', cur, re.S)
if aside_cur:
    s = re.sub(r'<aside class="side" aria-label="補足情報">.*?</aside>', '<aside class="side" aria-label="補足情報">'+aside_cur.group(1)+'</aside>', s, count=1, flags=re.S)

# Production breadcrumb label.
s = s.replace('PLC・制御設計エンジニアとは？</span></nav>', '生産技術とは？</span></nav>')

(repo/'articles/production-engineering-career.html').write_text(s, encoding='utf-8')
print('rebuilt from plc-control-engineer-career.html')
