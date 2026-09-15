from pathlib import Path
import re

article = Path('articles/plc-io-unit-basic.html')
backlog = Path('docs/existing-article-improvement-backlog.md')
s = article.read_text(encoding='utf-8')

# Related-card thumbnails using existing assets only.
if '.related-card-thumb{' not in s:
    s, n = re.subn(
        r'(\.related-card p\{[^}]+\})',
        r'\1.related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}.related-card-thumb img{width:100%;height:100%;object-fit:cover}',
        s,
        count=1
    )
    if n != 1:
        raise SystemExit('related-card CSS marker not found')

# Make X/Y wording manufacturer-neutral.
s = s.replace(
    'たとえば、押しボタンがX0、リミットスイッチがX1、センサーがX2のように、端子番号とラダー上の番号が関係します。',
    'たとえば三菱PLCでは、押しボタンがX0、リミットスイッチがX1、センサーがX2のように入力デバイスへ割り付けられる例があります。デバイス表記やアドレスの考え方はメーカー・シリーズで異なるため、対象PLCの資料とI/O割付を確認します。'
)
s = s.replace(
    'たとえば、表示灯がY0、リレーがY1、電磁弁がY2のように割り付けられます。',
    'たとえば三菱PLCでは、表示灯がY0、リレーがY1、電磁弁がY2のように出力デバイスへ割り付けられる例があります。ほかのメーカーでは表記方法が異なるため、X/YをすべてのPLC共通記号とは考えないことが大切です。'
)
s = s.replace('<td>Xとして扱うことが多い</td>', '<td>三菱PLCではXを使う例が多い（メーカーで異なる）</td>')
s = s.replace('<td>Yとして扱うことが多い</td>', '<td>三菱PLCではYを使う例が多い（メーカーで異なる）</td>')

# Add a practical reading-order section before field checks.
if 'id="reading-order"' not in s:
    block = '''
        <section class="section-card" id="reading-order">
          <h2>PLC I/Oで迷ったら「5つ」を分けて読む</h2>
          <p>入力・出力のトラブルや配線図を読む時は、PLC端子だけを見るよりも、<strong>現場機器・端子台・I/O端子・PLC内部デバイス・負荷側</strong>を分けると信号の位置を整理しやすくなります。</p>
          <div class="check-grid">
            <div class="check-item check-item--blue"><h3>1. 現場機器</h3><p>押しボタン、センサー、リミットスイッチなど、信号の出発点を確認します。</p></div>
            <div class="check-item check-item--green"><h3>2. 端子台・線番</h3><p>外部配線がどの端子を経由し、どのI/O端子へつながるかを図面で追います。</p></div>
            <div class="check-item check-item--orange"><h3>3. I/O端子とCOM</h3><p>入力か出力か、どのCOMグループか、対象ユニットの仕様と配線方式を確認します。</p></div>
            <div class="check-item"><h3>4. PLC内部デバイス</h3><p>端子とプログラム上の入力・出力デバイスがどう対応しているかをI/O割付で確認します。</p></div>
            <div class="check-item check-item--warning"><h3>5. 出力先の機器</h3><p>出力側では、リレー、表示灯、電磁弁など、最終的にどの負荷へつながるかまで確認します。</p></div>
          </div>
          <div class="key-highlight"><h3>端子番号とデバイス番号は同じとは限らない</h3><p>PLCの物理端子番号、I/Oアドレス、プログラム上のデバイス表記は役割が違います。対象機種のI/O割付表や図面と照合して整理します。</p></div>
        </section>
'''
    marker = '        <section class="section-card" id="field">'
    if marker not in s:
        raise SystemExit('field section marker not found')
    s = s.replace(marker, block + '\n' + marker, 1)

# Add TOC link when the TOC exists.
if '<a href="#reading-order">I/Oの読み方</a>' not in s:
    s = s.replace('<a href="#field">現場で見るポイント</a>', '<a href="#reading-order">I/Oの読み方</a>\n        <a href="#field">現場で見るポイント</a>', 1)

# Replace related section with image cards that reuse existing site assets.
related = '''        <section class="section-card" id="related">
          <h2>関連記事</h2>
          <p>PLC I/Oの次は、COM、NPN/PNP、PLC内部デバイス、I/Oトラブルの順で見ると、配線からプログラムまでつながりやすくなります。</p>
          <div class="related-grid">
            <a class="related-card" href="dc24v-common-basic.html">
              <div class="related-card-thumb"><img src="../assets/images/dc24v-common-basic/dc24v-common-basic-hero.png" alt="DC24Vコモンの基本記事" loading="lazy" decoding="async"></div>
              <h3>DC24VのCOMとは？</h3>
              <p>入力ユニットのCOMと+24V・0Vの関係を、配線の考え方から整理します。</p>
            </a>
            <a class="related-card" href="npn-pnp-basic.html">
              <div class="related-card-thumb"><img src="../assets/images/npn-pnp-basic/npn-pnp-basic-ogp.png" alt="NPNとPNPの基本記事" loading="lazy" decoding="async"></div>
              <h3>NPN / PNP の違いとは？</h3>
              <p>センサー出力とPLC入力の組み合わせを理解するための基礎を整理します。</p>
            </a>
            <a class="related-card" href="plc-xymd-device-basic.html">
              <div class="related-card-thumb"><img src="../assets/images/plc-xymd-device-basic/plc-xymd-device-basic-ogp.png" alt="PLCのX・Y・M・Dデバイスの基本記事" loading="lazy" decoding="async"></div>
              <h3>PLCのX・Y・M・Dとは？</h3>
              <p>物理I/OからPLC内部のデバイスへ進み、ラダー上の信号の扱いを整理します。</p>
            </a>
            <a class="related-card" href="plc-io-troubleshooting-guide.html">
              <div class="related-card-thumb"><img src="../assets/images/plc-io-troubleshooting-guide/plc-io-troubleshooting-guide-ogp.png" alt="PLC入出力トラブルシューティングの記事" loading="lazy" decoding="async"></div>
              <h3>PLC入出力トラブルシューティング</h3>
              <p>入力・PLC内部・出力・電源・COMを分けて、原因領域を整理する考え方へ進みます。</p>
            </a>
          </div>
          <div class="article-footer-nav">
            <a class="btn btn-primary" href="../index.html#category">カテゴリ一覧へ</a>
            <a class="btn btn-secondary" href="../index.html">トップページへ戻る</a>
          </div>
        </section>'''
s, n = re.subn(r'        <section class="section-card" id="related">.*?</section>', related, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('related section not found')

article.write_text(s, encoding='utf-8')

md = backlog.read_text(encoding='utf-8')
# Keep pending work visible even though each article has a separate branch/PR.
repls = {
    '- [ ] `articles/dc24v-common-basic.html` — DC24Vコモン': '- [ ] `articles/dc24v-common-basic.html` — DC24Vコモン — 作業中（PR #1454 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
    '- [ ] `articles/no-nc-basic.html` — NO・NC': '- [ ] `articles/no-nc-basic.html` — NO・NC — 作業中（PR #1456 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
    '- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット': '- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
}
for old, new in repls.items():
    if old in md and new not in md:
        md = md.replace(old, new, 1)
if '画像生成が利用できない期間は' not in md:
    anchor = '- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。\n'
    note = '- 画像生成が利用できない期間は、本文・構成・内部リンク・既存画像を使った関連記事カードを先行改善し、追加画像だけ保留として記録する。\n'
    md = md.replace(anchor, anchor + note, 1)
md = re.sub(r'次の改善対象は `articles/dc24v-common-basic.html`。', '現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/plc-xymd-device-basic.html`。', md)
backlog.write_text(md, encoding='utf-8')
