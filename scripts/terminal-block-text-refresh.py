from pathlib import Path
import re

article = Path('articles/terminal-block-basic.html')
backlog = Path('docs/existing-article-improvement-backlog.md')
s = article.read_text(encoding='utf-8')

# Make measurement-related wording safety-first and non-procedural.
s = s.replace('<li>端子ゆるみ・線番・電圧・導通確認が大事</li>', '<li>端子状態・線番・図面・配線先を照合することが大切</li>', 1)
s = s.replace('<li>端子ゆるみ・電圧・導通確認が大事</li>', '<li>端子状態・線番・図面・配線先を照合する</li>', 1)
s = s.replace(
'''              <h3>4. 電圧や導通を見る</h3>\n              <p>必要に応じてテスターで電圧や導通を確認し、信号が来ているかを見ます。</p>''',
'''              <h3>4. 必要なら測定結果を照合する</h3>\n              <p>測定が必要な場合は、資格・設備の安全条件・社内手順・メーカー資料に従って実施し、その結果を図面や端子番号と照合します。</p>''', 1)
s = s.replace(
'''            トラブル時は、端子台を境目にして盤外側と盤内側を分けて確認すると、原因を切り分けやすくなります。\n            端子ゆるみ、電圧、導通、配線先を順番に見ることで、落ち着いて確認できます。''',
'''            トラブル時は、端子台を境目にして盤外側と盤内側を分けて考えると、原因領域を整理しやすくなります。\n            端子状態、線番、端子番号、配線先、図面を照合し、測定が必要な場合は資格・安全条件・定められた手順に従います。''', 1)

# Replace the task-safety table with non-procedural safety guidance.
s = s.replace(
'''                <tr>\n                  <th>増し締め</th>\n                  <td class="cell-blue">電源を切れる場合は切ってから行い、締めすぎにも注意します。</td>\n                </tr>\n                <tr>\n                  <th>電圧測定</th>\n                  <td class="cell-green">通電状態で行うため、短絡や感電に注意して測定します。</td>\n                </tr>\n                <tr>\n                  <th>導通確認</th>\n                  <td class="cell-orange">基本的に電源を切った状態で行い、残電圧がないか確認します。</td>\n                </tr>\n                <tr>\n                  <th>配線変更</th>\n                  <td>元の線番、端子番号、写真、図面を確認してから変更します。</td>\n                </tr>''',
'''                <tr>\n                  <th>端子の締結確認</th>\n                  <td class="cell-blue">設備を安全な状態にしたうえで、対象端子台のメーカー指定や社内保全手順に従って確認します。</td>\n                </tr>\n                <tr>\n                  <th>電気的な測定</th>\n                  <td class="cell-green">測定が必要な場合は、必要な資格・保護措置・対象設備の定められた手順に従います。この記事では通電測定の手順は扱いません。</td>\n                </tr>\n                <tr>\n                  <th>配線の識別</th>\n                  <td class="cell-orange">線番、端子番号、図面、機器名を照合し、見た目だけで判断しません。</td>\n                </tr>\n                <tr>\n                  <th>配線変更</th>\n                  <td>変更作業は承認された図面・作業手順・設備ルールに従い、変更前後の記録を残します。</td>\n                </tr>''', 1)

# Add a clearer reading-order section before checks.
if 'id="read-order"' not in s:
    section = '''\n\n        <section class="section-card" id="read-order">\n          <h2>端子台は「端子番号 → 線番 → 配線先 → 図面」の順で照合する</h2>\n          <p>端子台は単体で見るより、識別情報をつなげて見ると理解しやすくなります。まず端子番号を基準点にし、そこへ入る線番、配線先、図面上の信号名を対応させます。</p>\n          <div class="check-grid">\n            <div class="check-item check-item--important"><h3>端子番号</h3><p>図面と実物を結ぶ基準点として確認します。</p></div>\n            <div class="check-item check-item--field"><h3>線番</h3><p>同じ電線・信号を図面や機器側まで追うための識別情報として見ます。</p></div>\n            <div class="check-item"><h3>配線先</h3><p>PLC、リレー、操作機器、センサーなど、どこへつながる信号かを確認します。</p></div>\n            <div class="check-item check-item--warning"><h3>図面・変更履歴</h3><p>現物と図面が一致しているかを確認し、改造履歴がある場合は最新版を基準にします。</p></div>\n          </div>\n        </section>'''
    marker = '        <section class="section-card" id="check">'
    if marker not in s:
        raise SystemExit('check section marker not found')
    s = s.replace(marker, section + '\n\n' + marker, 1)

if '<a href="#read-order">端子台の読み順</a>' not in s:
    s = s.replace('<a href="#wiring">配線の追い方</a>', '<a href="#wiring">配線の追い方</a>\n        <a href="#read-order">端子台の読み順</a>', 1)

# Related card thumbnail CSS.
if '.related-card-thumb{' not in s:
    marker = '''    .related-card p{\n      margin:0;\n      font-size:13px;\n      color:var(--muted);\n      line-height:1.75;\n    }'''
    if marker not in s:
        raise SystemExit('related CSS marker not found')
    s = s.replace(marker, marker + '''\n\n    .related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}.related-card-thumb img{width:100%;height:100%;object-fit:cover}''', 1)

# Upgrade existing related cards with existing images and stronger cluster links.
related = '''        <section class="section-card" id="related">\n          <h2>あわせて読みたい記事</h2>\n          <p>端子台は、線番・ジャンパ・PLC I/O・盤面機器と一緒に見ると、図面から実配線までのつながりを整理しやすくなります。</p>\n          <div class="related-grid">\n            <a class="related-card" href="terminal-block-jumper-basic.html"><div class="related-card-thumb"><img src="../assets/images/terminal-block-jumper-basic/terminal-block-jumper-basic-ogp.png" alt="端子台ジャンパの基本記事" loading="lazy" decoding="async"></div><h3>端子台ジャンパとは？</h3><p>端子間で共通線を分配する考え方を、端子台の基本から一歩進めて整理します。</p></a>\n            <a class="related-card" href="plc-io-unit-basic.html"><div class="related-card-thumb"><img src="../assets/images/plc-io-unit-basic/plc-io-unit-basic-ogp.png" alt="PLC入出力ユニットの基本記事" loading="lazy" decoding="async"></div><h3>PLC入力・出力ユニットとは？</h3><p>端子台からPLC端子、I/Oデバイスへ信号がつながる流れを確認できます。</p></a>\n            <a class="related-card" href="push-button-switch-basic.html"><div class="related-card-thumb"><img src="../assets/images/push-button-switch-basic/push-button-switch-overview.png" alt="押しボタンスイッチの基本記事" loading="lazy" decoding="async"></div><h3>押しボタンスイッチとは？</h3><p>盤面操作機器から端子台を通って入力信号へつながる代表例として整理できます。</p></a>\n            <a class="related-card" href="selector-switch-basic.html"><div class="related-card-thumb"><img src="../assets/images/selector-switch-basic/selector-switch-basic-ogp.png" alt="セレクタスイッチの基本記事" loading="lazy" decoding="async"></div><h3>セレクタスイッチとは？</h3><p>手動・自動などの切替信号と端子台の関係をイメージしやすくなります。</p></a>\n            <a class="related-card" href="pilot-lamp-basic.html"><div class="related-card-thumb"><img src="../assets/images/pilot-lamp-basic/pilot-lamp-basic-ogp.webp" alt="パイロットランプの基本記事" loading="lazy" decoding="async"></div><h3>パイロットランプ・表示灯とは？</h3><p>出力信号が端子台を経由して盤面表示へつながる例を確認できます。</p></a>\n            <a class="related-card" href="wire-number-marker-basic.html"><div class="related-card-thumb"><img src="../assets/images/wire-number-marker-basic/wire-number-marker-basic-ogp.png" alt="線番マーカーの基本記事" loading="lazy" decoding="async"></div><h3>線番マーカーとは？</h3><p>端子番号と線番をセットで追うための識別ルールを整理できます。</p></a>\n          </div>\n        </section>'''
s, n = re.subn(r'        <section class="section-card" id="related">.*?</section>', related, s, count=1, flags=re.S)
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
'- [ ] `articles/one-shot-circuit-basic.html` — ワンショット回路':'- [ ] `articles/one-shot-circuit-basic.html` — ワンショット回路 — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）',
'- [ ] `articles/terminal-block-basic.html` — 端子台':'- [ ] `articles/terminal-block-basic.html` — 端子台 — 作業中（本文見直し / 関連記事画像カード化 / 安全文言整理 / 追加画像は保留）'
}
for old,new in repls.items():
    if old in md and new not in md:
        md = md.replace(old,new,1)
md = re.sub(r'## 現在位置\n\n.*?\n\n最終更新:', '## 現在位置\n\n現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/control-panel-cooling-fan-basic.html`。\n\n最終更新:', md, flags=re.S)
backlog.write_text(md, encoding='utf-8')
