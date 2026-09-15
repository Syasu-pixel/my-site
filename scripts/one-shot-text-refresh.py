from pathlib import Path
import re

article = Path('articles/one-shot-circuit-basic.html')
backlog = Path('docs/existing-article-improvement-backlog.md')
s = article.read_text(encoding='utf-8')

# Related-card thumbnails using existing assets only.
if '.related-card-thumb{' not in s:
    marker = '''    .related-card p{\n      margin:0;\n      font-size:13px;\n      color:var(--muted);\n      line-height:1.75;\n    }'''
    css = marker + '''\n\n    .related-card-thumb{\n      margin:-16px -16px 14px;\n      aspect-ratio:16/9;\n      overflow:hidden;\n      border-radius:19px 19px 12px 12px;\n      background:#eaf1f8;\n      border-bottom:1px solid #d7e4f3;\n    }\n\n    .related-card-thumb img{\n      width:100%;\n      height:100%;\n      object-fit:cover;\n    }'''
    if marker not in s:
        raise SystemExit('related card CSS marker not found')
    s = s.replace(marker, css, 1)

# Clarify that a one-shot is typically one PLC scan, not an arbitrary timed pulse.
s = s.replace(
'''          <p>\n            ワンショット回路は、入力条件がONになった瞬間だけ、\n            <span class="mark">短い信号を1回だけ出す</span>ために使います。\n          </p>''',
'''          <p>\n            ワンショット回路は、入力条件がOFFからONへ変化した瞬間をとらえ、\n            <span class="mark">PLCプログラム上で1回だけ成立する信号</span>を作るために使います。一般的なPLCでは、立ち上がり検出の結果は1スキャンだけONになる考え方です。\n          </p>''', 1)

s = s.replace(
'''              ワンショットの命令名は、PLC機種や書き方によって異なります。ONS、PLS、DIFUなど表記が違っても、基本は「立ち上がりの瞬間だけ信号を出す」と考えると追いやすいです。''',
'''              ワンショットや立ち上がり検出の命令名・記号・動作仕様はメーカーやPLCシリーズで異なります。特定メーカーの命令名を他社PLCへそのまま当てはめず、対象機種の命令リファレンスで確認してください。基本の考え方は「OFF→ONの変化を1回だけ拾う」です。''', 1)

# Add a conceptual reading section; no live-work or force-output procedure.
if 'id="read-order"' not in s:
    section = '''\n\n        <div class="section-card" id="read-order">\n          <h2>ワンショットは「入力状態」と「変化」を分けて読む</h2>\n          <p>ラダーを読むときは、入力が現在ONかどうかと、今回OFFからONへ変わったかどうかを分けて考えると理解しやすくなります。通常接点はONしている間条件が成立しますが、立ち上がり検出は変化したタイミングだけ成立します。</p>\n          <div class="check-grid">\n            <div class="check-item check-item--important"><h3>通常接点</h3><p>入力がONしている間、条件が成立し続ける考え方です。</p></div>\n            <div class="check-item check-item--field"><h3>立ち上がり検出</h3><p>OFF→ONへ変わったタイミングを1回だけ拾う考え方です。</p></div>\n            <div class="check-item"><h3>後段の処理</h3><p>カウンタ、内部状態、処理開始など、ワンショットを何のきっかけに使っているかを追います。</p></div>\n            <div class="check-item check-item--warning"><h3>メーカー差</h3><p>命令名や細かな仕様は対象PLCの公式資料で確認します。</p></div>\n          </div>\n        </div>'''
    marker = '        <div class="section-card" id="field">'
    if marker not in s:
        raise SystemExit('field section marker not found')
    s = s.replace(marker, section + '\n\n' + marker, 1)

# Add TOC entries for the new conceptual section.
if '<a href="#read-order">状態と変化の読み方</a>' not in s:
    s = s.replace('<a href="#ladder">簡略ラダー例</a>', '<a href="#ladder">簡略ラダー例</a>\n        <a href="#read-order">状態と変化の読み方</a>', 1)

# Replace related section with existing image-backed cards.
old_pattern = re.compile(r'''        <div class="section-card">\n          <h2>関連記事</h2>.*?          <div class="article-footer-nav">''', re.S)
new_related = '''        <div class="section-card">\n          <h2>関連記事</h2>\n          <p>ワンショット回路は、タイマー・カウンタ・自己保持・PLCスキャンとつなげて読むと、「状態」と「変化」の違いを整理しやすくなります。</p>\n\n          <div class="related-grid">\n            <a class="related-card" href="counter-circuit-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/counter-circuit-basic/counter-circuit-basic-ogp.png" alt="カウンタ回路の基本記事" loading="lazy" decoding="async"></div>\n              <h3>カウンタ回路の基本</h3>\n              <p>ワンショットで作った1回分の信号を、回数として数える考え方につなげます。</p>\n            </a>\n            <a class="related-card" href="timer-circuit-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/timer-circuit-basic/timer-circuit-basic-ogp.png" alt="タイマー回路の基本記事" loading="lazy" decoding="async"></div>\n              <h3>タイマー回路とは？</h3>\n              <p>「1回だけ成立する信号」と「一定時間成立させる処理」の違いを整理できます。</p>\n            </a>\n            <a class="related-card" href="self-hold-circuit.html">\n              <div class="related-card-thumb"><img src="../assets/images/self-hold-circuit/self-hold-circuit-ogp.png" alt="自己保持回路の基本記事" loading="lazy" decoding="async"></div>\n              <h3>自己保持回路とは？</h3>\n              <p>一瞬のきっかけを受けた後に、状態を保持する考え方を確認できます。</p>\n            </a>\n            <a class="related-card" href="plc-scan-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/plc-scan-basic/plc-scan-basic-ogp.png" alt="PLCスキャンの基本記事" loading="lazy" decoding="async"></div>\n              <h3>PLCのスキャンとは？</h3>\n              <p>ワンショットが「1スキャンだけ成立する」という考え方を理解する土台になります。</p>\n            </a>\n            <a class="related-card" href="interlock-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/interlock-basic/interlock-basic-ogp.png" alt="インターロック回路の基本記事" loading="lazy" decoding="async"></div>\n              <h3>インターロック回路の基本</h3>\n              <p>きっかけ信号の後で、許可条件や禁止条件をどう考えるかにつなげます。</p>\n            </a>\n            <a class="related-card" href="plc-io-unit-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/plc-io-unit-basic/plc-io-unit-basic-ogp.png" alt="PLC入出力ユニットの基本記事" loading="lazy" decoding="async"></div>\n              <h3>PLC入力・出力ユニットとは？</h3>\n              <p>ワンショットの元になる入力信号と、処理後の出力先をI/Oの流れから整理します。</p>\n            </a>\n          </div>\n\n          <div class="article-footer-nav">'''
s, n = old_pattern.subn(new_related, s, count=1)
if n != 1:
    raise SystemExit('related section replacement failed')

article.write_text(s, encoding='utf-8')

md = backlog.read_text(encoding='utf-8')
rule = '- 画像生成が利用できない期間は、本文・構成・内部リンク・既存画像を使った関連記事カードを先行改善し、追加画像だけ保留として記録する。\n'
anchor = '- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。\n'
if rule not in md and anchor in md:
    md = md.replace(anchor, anchor + rule, 1)
repls = {
'- [ ] `articles/dc24v-common-basic.html` — DC24Vコモン':'- [ ] `articles/dc24v-common-basic.html` — DC24Vコモン — 作業中（PR #1454 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
'- [ ] `articles/no-nc-basic.html` — NO・NC':'- [ ] `articles/no-nc-basic.html` — NO・NC — 作業中（PR #1456 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
'- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット':'- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット — 作業中（PR #1458 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
'- [ ] `articles/plc-xymd-device-basic.html` — PLC X/Y/M/Dデバイス':'- [ ] `articles/plc-xymd-device-basic.html` — PLC X/Y/M/Dデバイス — 作業中（PR #1459 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
'- [ ] `articles/one-shot-circuit-basic.html` — ワンショット回路':'- [ ] `articles/one-shot-circuit-basic.html` — ワンショット回路 — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
}
for old,new in repls.items():
    if old in md and new not in md:
        md = md.replace(old,new,1)
md = re.sub(r'## 現在位置\n\n.*?\n\n最終更新:', '## 現在位置\n\n現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/terminal-block-basic.html`。\n\n最終更新:', md, flags=re.S)
backlog.write_text(md, encoding='utf-8')
