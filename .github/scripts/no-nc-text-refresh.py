from pathlib import Path

article_path = Path('articles/no-nc-basic.html')
backlog_path = Path('docs/existing-article-improvement-backlog.md')
html = article_path.read_text(encoding='utf-8')

# Related-card thumbnails using existing site images only.
css_old = '''    .related-card p{
      margin:0;
      font-size:13px;
      color:var(--muted);
      line-height:1.75;
    }
'''
css_new = css_old + '''
    .related-card-thumb{
      margin:-16px -16px 14px;
      aspect-ratio:16/9;
      overflow:hidden;
      border-radius:19px 19px 12px 12px;
      background:#eaf1f8;
      border-bottom:1px solid #d7e4f3;
    }

    .related-card-thumb img{
      width:100%;
      height:100%;
      object-fit:cover;
    }
'''
if '.related-card-thumb{' not in html:
    if css_old not in html:
        raise SystemExit('related card CSS marker not found')
    html = html.replace(css_old, css_new, 1)

# Add a practical reading-order section before common mistakes.
if 'id="read-order"' not in html:
    marker = '          <section class="section-card" id="mistakes">'
    section = '''          <section class="section-card" id="read-order">
            <h2>現場では「表記 → 通常状態 → 動作後」の順で読む</h2>
            <p>
              NO / NC を見た時は、略語だけで判断するよりも、<strong>機器の端子表示や図面記号 → その機器の通常状態 → 動作した時の変化</strong>の順で確認すると混乱しにくくなります。
            </p>
            <div class="check-grid">
              <div class="check-item check-item--important">
                <h3>1. 表記を確認</h3>
                <p>端子表示、接点記号、メーカー資料にNO / NCやa / bの表記があるか確認します。</p>
              </div>
              <div class="check-item check-item--field">
                <h3>2. 通常状態を決める</h3>
                <p>押しボタンなら押していない時、リレーならコイル非励磁時など、基準となる状態を先に決めます。</p>
              </div>
              <div class="check-item check-item--warning">
                <h3>3. 動作後の変化を見る</h3>
                <p>動作で閉じるのか、開くのかを見て、NO / NCの意味と一致しているか整理します。</p>
              </div>
              <div class="check-item">
                <h3>4. PLC表示は最後に照合</h3>
                <p>PLC入力のON/OFFは配線方式でも変わるため、接点種別を決める根拠ではなく照合材料として使います。</p>
              </div>
            </div>
            <div class="key-highlight">
              <h3>接点名とPLC入力状態は別物</h3>
              <p>NO / NCは接点の通常状態を表す言葉です。PLC側でONに見えるかOFFに見えるかは、電源や配線構成も含めて決まるため、同じ意味として扱わないのがポイントです。</p>
            </div>
          </section>

'''
    if marker not in html:
        raise SystemExit('mistakes section marker not found')
    html = html.replace(marker, section + marker, 1)

# Clarify PLC table wording to avoid implying that monitor state alone identifies contact type.
html = html.replace('<td class="cell-blue">NOっぽい動き</td>', '<td class="cell-blue">NO接点を使った構成で見られる例</td>')
html = html.replace('<td class="cell-orange">NCっぽい動き</td>', '<td class="cell-orange">NC接点を使った構成で見られる例</td>')

# TOC and side navigation.
if '<a href="#read-order">現場で読む順番</a>' not in html:
    html = html.replace('          <a href="#mistakes">間違えやすいポイント</a>', '          <a href="#read-order">現場で読む順番</a>\n          <a href="#mistakes">間違えやすいポイント</a>', 1)
if '<li><a href="#read-order">現場で読む順番</a></li>' not in html:
    html = html.replace('              <li><a href="#mistakes">間違えやすいポイント</a></li>', '              <li><a href="#read-order">現場で読む順番</a></li>\n              <li><a href="#mistakes">間違えやすいポイント</a></li>', 1)

# Replace related cards with existing-image visual cards.
start = html.find('          <section class="section-card" aria-labelledby="related-title">')
if start == -1:
    raise SystemExit('related section start not found')
end = html.find('          </section>', start)
if end == -1:
    raise SystemExit('related section end not found')
end += len('          </section>')
related = '''          <section class="section-card" aria-labelledby="related-title">
            <h2 id="related-title">関連記事</h2>
            <p>NO / NCの次は、a接点・b接点、リレー、PLC入出力、押しボタンへつなげて読むと、接点の意味を機器と回路の両方から整理できます。</p>
            <div class="related-grid">
              <a class="related-card" href="./a-contact-b-contact-basic.html">
                <div class="related-card-thumb"><img src="../assets/images/a-contact-b-contact-basic/a-contact-b-contact-basic-ogp.webp" alt="a接点・b接点の基本記事" loading="lazy" decoding="async"></div>
                <h3>a接点・b接点とは？</h3>
                <p>NO / NCと同じ考え方を、日本語のa接点・b接点表記で整理します。</p>
              </a>
              <a class="related-card" href="./relay-basic.html">
                <div class="related-card-thumb"><img src="../assets/images/relay-basic/relay-overview.png" alt="リレーの基本記事" loading="lazy" decoding="async"></div>
                <h3>リレーとは？</h3>
                <p>コイルが動作した時にNO / NC接点がどう切り替わるかを機器側から確認できます。</p>
              </a>
              <a class="related-card" href="./plc-io-unit-basic.html">
                <div class="related-card-thumb"><img src="../assets/images/plc-io-unit-basic/plc-io-unit-basic-ogp.png" alt="PLC入出力ユニットの基本記事" loading="lazy" decoding="async"></div>
                <h3>PLC入出力ユニットとは？</h3>
                <p>接点から入った信号をPLC入力がどう受けるか、COMや端子と合わせて整理します。</p>
              </a>
              <a class="related-card" href="./push-button-switch-basic.html">
                <div class="related-card-thumb"><img src="../assets/images/push-button-switch-basic/push-button-switch-overview.png" alt="押しボタンスイッチの基本記事" loading="lazy" decoding="async"></div>
                <h3>押しボタンスイッチとは？</h3>
                <p>NO / NC接点を実際の押しボタンでどう見るかを、モーメンタリ動作と合わせて整理します。</p>
              </a>
            </div>
            <div class="article-footer-nav">
              <a class="btn btn-primary" href="../index.html#category">カテゴリ一覧へ</a>
              <a class="btn btn-secondary" href="../index.html">トップページへ戻る</a>
            </div>
          </section>'''
html = html[:start] + related + html[end:]

article_path.write_text(html, encoding='utf-8')

md = backlog_path.read_text(encoding='utf-8')
old = '- [ ] `articles/no-nc-basic.html` — NO・NC'
new = '- [ ] `articles/no-nc-basic.html` — NO・NC — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
if old in md:
    md = md.replace(old, new, 1)
elif new not in md:
    raise SystemExit('NO/NC backlog row not found')
md = md.replace('作業中: `articles/dc24v-common-basic.html`', '作業中: `articles/dc24v-common-basic.html` / `articles/no-nc-basic.html`')
backlog_path.write_text(md, encoding='utf-8')
