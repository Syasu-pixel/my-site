from pathlib import Path

path = Path('articles/dc24v-power-supply-basic.html')
text = path.read_text(encoding='utf-8')

def swap(old, new):
    global text
    if old not in text:
        raise SystemExit('missing target: ' + old[:120])
    text = text.replace(old, new, 1)

swap('<h2>まだ不要な人</h2>\n        <ul>\n          <li>まず端子台やサーキットプロテクタの見方が不安な人</li>\n          <li>電源装置の細かい型式選定だけを先に知りたい人</li>\n          <li>高圧・動力盤の電源設計を深く知りたい人</li>\n        </ul>', '<h2>この記事だけで決めないこと</h2>\n        <ul>\n          <li>交換品の型式・容量をこの記事だけで選定しない</li>\n          <li>通電状態での測定や配線変更を自己判断で行わない</li>\n          <li>実機では図面・銘板・メーカー資料・設備手順を優先する</li>\n        </ul>')

swap('''<h3>パワーサプライを見る時は「入力」と「出力」を分ける</h3>\n            <p>\n              入力側にはAC100VやAC200V、出力側にはDC24Vが出ます。\n              電源トラブル時は、入力が来ているか、出力DC24Vが出ているかを分けて確認します。\n            </p>''', '''<h3>パワーサプライを見る時は「入力系統」と「出力系統」を分ける</h3>\n            <p>\n              入力側とDC24V出力側は役割が違います。まず図面・銘板・端子表示・DC OKなどの状態表示を照合し、どの電源系統を見ているのかを分けると切り分けしやすくなります。\n            </p>''')

swap('''<h3>まず「DC24Vが出ているか」を見る</h3>\n            <p>\n              PLCやセンサーが動かない時は、プログラムや機器本体を見る前に、\n              パワーサプライの出力DC24Vが正常かを確認すると切り分けしやすくなります。\n            </p>''', '''<h3>まず電源系統と状態表示を確認する</h3>\n            <p>\n              PLCやセンサーが動かない時は、プログラムや機器本体だけに原因を決めつけず、図面上の電源系統、パワーサプライの表示、保護機器、PLCや機器側の状態表示を順に照合すると切り分けしやすくなります。\n            </p>''')

swap('<td>+24V、0V、信号線を分けて確認します。</td>', '<td>図面・端子表示・センサー仕様で+24V、0V、信号線の役割を分けて確認します。</td>')
swap('<td>コイル電圧が来ているか、接点側と分けて見ます。</td>', '<td>コイル回路の電源系統と状態表示を、接点側の回路と分けて見ます。</td>')

swap('''<h2>入力端子と出力端子の見方</h2>\n          <p>\n            パワーサプライを見る時は、入力側と出力側を分けて確認します。\n            入力側にはAC100VやAC200V、出力側には+V、-VなどのDC24V端子があります。\n          </p>''', '''<h2>入力端子と出力端子の見方</h2>\n          <p>\n            パワーサプライを見る時は、まず銘板・図面・端子記号で入力側と出力側を分けます。L/NなどのAC入力端子、+V/-VなどのDC出力端子、FGなどの接地端子は役割が違うため、記号だけで判断せず機種の取扱説明書も合わせて確認します。\n          </p>''')

swap('<p>AC入力側の端子です。AC100VやAC200Vが入力されているか確認します。</p>', '<p>AC入力側でよく使われる表記です。実際の入力仕様と端子の意味は銘板・結線図・メーカー資料で確認します。</p>')
swap('<p>DC出力側の端子です。DC24Vが正常に出ているか測定します。</p>', '<p>DC出力側でよく使われる表記です。機種によって端子数や表記が異なるため、図面と取扱説明書を照合します。</p>')

swap('''<h3>入力が正常でも、出力が出ていないことがある</h3>\n            <p>\n              AC入力が来ていても、過負荷、短絡、本体不良、保護回路動作などでDC24Vが出ないことがあります。\n              入力側と出力側を両方確認するのがポイントです。\n            </p>''', '''<h3>表示だけで原因を1つに決めつけない</h3>\n            <p>\n              DC OK消灯や機器停止には、入力側・保護機器・負荷側・本体など複数の原因候補があります。図面、状態表示、アラーム、設備履歴を合わせて範囲を絞ります。\n            </p>''')

swap('''<h2>電源が出ない時の確認ポイント</h2>\n          <p>\n            パワーサプライからDC24Vが出ていない時は、本体不良と決めつける前に、入力電源、出力電圧、保護回路、端子ゆるみ、負荷側の短絡などを順番に確認します。\n          </p>''', '''<h2>DC24V系統が動かない時の確認ポイント</h2>\n          <p>\n            PLCやセンサーなどDC24V系統が動かない時は、パワーサプライ本体だけに原因を決めつけません。図面上の電源経路、パワーサプライの状態表示、保護機器、端子表示、負荷側のアラームや状態を順に照合して範囲を絞ります。\n          </p>''')

swap('電源が出ない時は、入力電源、出力DC24V、サーキットプロテクタやヒューズ、端子ゆるみ、過負荷・短絡、本体不良の順で確認します。', 'DC24V系統が動かない時は、図面上の電源経路、状態表示、保護機器、端子・配線の外観、負荷側の状態、本体の順に原因候補を整理します。')
swap('<h3>入力電源が来ているか</h3>\n              <p>AC100VやAC200Vが入力端子に来ているか確認します。</p>', '<h3>入力側の条件</h3>\n              <p>図面・銘板・上流保護機器・設備状態から、入力側の電源経路と条件を確認します。</p>')
swap('<h3>出力DC24Vを測定する</h3>\n              <p>+Vと-V間でDC24Vが出ているか、テスターで確認します。</p>', '<h3>出力側の状態表示</h3>\n              <p>DC OKなどの表示、PLCや接続機器の電源表示・アラームを確認し、出力側のどこまで状態が成立しているかを整理します。</p>')
swap('<h3>端子ゆるみを見る</h3>\n              <p>入力側、出力側の端子ゆるみや配線外れを確認します。</p>', '<h3>端子・配線の外観</h3>\n              <p>線番、端子表示、明らかな外れ・変色・損傷の有無を、設備の安全手順に従って確認します。</p>')
swap('<h3>過負荷・短絡を見る</h3>\n              <p>負荷側の機器や配線で短絡していないか、接続機器が増えすぎていないか見ます。</p>', '<h3>負荷側の状態を見る</h3>\n              <p>接続機器の追加履歴、アラーム、保護機器動作などから、過負荷や負荷側異常の可能性を整理します。</p>')

needle = '<div class="talk-thread">\n            <div class="talk-row talk-row--right">\n              <div class="talk-avatar">\n                <img src="../assets/images/guide-characters/cheerful_medic_ready_for_action.png" alt="新人">'
swap(needle, '<div class="danger-box">\n            <h3>通電測定・配線変更・交換は別作業として扱う</h3>\n            <p>活線状態での測定、端子への接触、配線変更、電源装置の交換は、この記事の確認フローとは別の作業です。実機では資格・社内ルール・設備の安全手順・メーカー資料に従い、必要な場合は管理者や有資格者へ引き継いでください。</p>\n          </div>\n\n          ' + needle)

swap('交換前に、入力電源、出力側の短絡、サーキットプロテクタ、端子ゆるみを確認しよう。本体以外が原因のこともあるよ。', 'すぐ交換と決めず、図面、状態表示、保護機器、負荷側の履歴を見て原因の範囲を絞ろう。本体以外が原因のこともあるよ。')
swap('電源が出ない時は、入力電源、出力DC24V、サーキットプロテクタ、端子ゆるみ、過負荷・短絡、本体不良の順に確認します。\n            いきなり交換ではなく、どこで止まっているかを切り分けることが大切です。', 'DC24V系統が動かない時は、図面上の電源経路、状態表示、保護機器、端子・配線の外観、負荷側の状態、本体の順に原因候補を整理します。\n            いきなり交換ではなく、どの系統・どの機器まで状態が成立しているかを切り分けることが大切です。')

css_old = '.related-card p{margin:0;font-size:13px;color:var(--muted);line-height:1.75}'
css_new = css_old + '\n    .related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:20px 20px 0 0;border-bottom:1px solid #d7e4f3;background:#eef4ff}\n    .related-card-thumb img{width:100%;height:100%;object-fit:cover}'
swap(css_old, css_new)

start = text.index('          <div class="related-grid">', text.index('<section class="section-card" id="related">'))
end = text.index('          </div>', start) + len('          </div>')
old_block = text[start:end]
new_block = '''          <div class="related-grid">\n            <a class="related-card" href="voltage-current-resistance-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/voltage-current-resistance-basic/voltage-current-resistance-basic-hero.png" alt="電圧・電流・抵抗の基本記事" loading="lazy" decoding="async"></div>\n              <h3>電圧・電流・抵抗とは？</h3><p>V・A・Ωと電源・負荷の関係を基本から整理します。</p>\n            </a>\n            <a class="related-card" href="circuit-protector-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/circuit-protector-basic/circuit-protector-hero.png" alt="サーキットプロテクタの基本記事" loading="lazy" decoding="async"></div>\n              <h3>サーキットプロテクタとは？</h3><p>DC24Vの分岐保護と保護機器の役割を確認できます。</p>\n            </a>\n            <a class="related-card" href="terminal-block-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/terminal-block-basic/terminal-block-hero.png" alt="端子台の基本記事" loading="lazy" decoding="async"></div>\n              <h3>端子台とは？</h3><p>DC24Vを盤内へ分配するときの端子・線番の見方につながります。</p>\n            </a>\n            <a class="related-card" href="dc24v-common-basic.html">\n              <div class="related-card-thumb"><img src="../assets/images/dc24v-common-basic/dc24v-common-basic-ogp.png" alt="DC24Vコモンの基本記事" loading="lazy" decoding="async"></div>\n              <h3>DC24Vのプラスコモン・マイナスコモンとは？</h3><p>COM・+24V・0Vを分けて読む考え方を整理します。</p>\n            </a>\n          </div>'''
text = text[:start] + new_block + text[end:]
path.write_text(text, encoding='utf-8')

backlog = Path('docs/existing-article-improvement-backlog.md')
b = backlog.read_text(encoding='utf-8')
old = '- [ ] `articles/dc24v-power-supply-basic.html` — DC24V電源'
new = '- [ ] `articles/dc24v-power-supply-basic.html` — DC24V電源 — 作業中（本文見直し / 安全表現整理 / 関連記事画像カード化 / 追加画像は保留）'
if old not in b:
    raise SystemExit('backlog target missing')
b = b.replace(old, new, 1)
backlog.write_text(b, encoding='utf-8')
