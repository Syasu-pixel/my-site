from pathlib import Path
import re

article = Path('articles/plc-xymd-device-basic.html')
backlog = Path('docs/existing-article-improvement-backlog.md')
s = article.read_text(encoding='utf-8')

# Make the scope explicit: X/Y/M/D are common Mitsubishi PLC device labels, not universal PLC notation.
s = s.replace(
    'PLCのX・Y・M・Dは、ラダーを読むための基本的な目印です。最初は細かな仕様を覚えるよりも、Xは入力、Yは出力、Mは内部リレー、Dは数値データとして整理すると、ラダーの流れを追いやすくなります。',
    'X・Y・M・Dは、特に三菱PLCでよく使われる代表的なデバイス表記です。ラダーを読む入口として、Xは入力、Yは出力、Mは内部リレー、Dは数値データとして整理すると流れを追いやすくなります。ほかのメーカーでは表記やアドレス体系が異なるため、対象PLCのマニュアルとデバイス一覧を確認します。'
)

# Add manufacturer-scope note after overview section if absent.
if 'id="manufacturer-note"' not in s:
    block = '''
        <section class="section-card" id="manufacturer-note">
          <h2>3. X・Y・M・DはすべてのPLCで共通ではない</h2>
          <p><strong>X・Y・M・Dという呼び方は、三菱PLCでよく見るデバイス表記</strong>です。PLCという機器全体で世界共通の記号ではありません。</p>
          <p>メーカーやシリーズが変わると、入力・出力・内部ビット・データ領域の名前やアドレス表現も変わります。そのため、他社PLCを読む時は「Xだから入力」と機械的に当てはめず、対象機種のデバイス一覧やI/O割付を確認します。</p>
          <div class="key-highlight"><h3>この記事の読み方</h3><p>この記事では三菱PLCでよく使うX・Y・M・Dを例に、<strong>外部入力・外部出力・内部状態・数値データ</strong>という4つの役割を理解することを目的にします。</p></div>
        </section>
'''
    marker = '        <section class="section-card" id="m-device">'
    if marker not in s:
        raise SystemExit('m-device marker not found')
    s = s.replace(marker, block + '\n' + marker, 1)

# Renumber headings following the inserted section.
s = s.replace('<h2>4. MデバイスはPLC内部で使うON/OFFメモ</h2>', '<h2>4. MデバイスはPLC内部で使うON/OFFメモ</h2>')
s = s.replace('<h2>5. Dデバイスは数値を扱う場所</h2>', '<h2>5. Dデバイスは数値を扱う場所</h2>')

# Improve field-check phrasing: monitor display is evidence, not the whole answer.
s = s.replace(
    'X・Y・M・Dを読む時は、デバイス名だけで決めつけないことが大切です。特に、実機のトラブル確認では、画面上のON/OFFや数値だけでなく、現場の状態、図面、I/O表、コメントを合わせて見ます。',
    'X・Y・M・Dを読む時は、デバイス名やモニタ表示だけで決めつけないことが大切です。実機では、現場機器の状態、図面、I/O表、デバイスコメント、対象PLCの仕様を合わせて見ると、信号や数値の意味を取り違えにくくなります。'
)

# Add thumbnail styles if missing.
if '.related-card-thumb{' not in s:
    s, n = re.subn(
        r'(\.related-card p\{[^}]+\})',
        r'\1.related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}.related-card-thumb img{width:100%;height:100%;object-fit:cover}',
        s,
        count=1
    )
    if n != 1:
        raise SystemExit('related-card CSS marker not found')

# Add menu links for the manufacturer note.
if '<a href="#manufacturer-note">メーカー差</a>' not in s:
    s = s.replace('<a href="#xy">XとY</a>', '<a href="#xy">XとY</a><a href="#manufacturer-note">メーカー差</a>', 1)
if '<li><a href="#manufacturer-note">メーカー差</a></li>' not in s:
    s = s.replace('<li><a href="#xy">XとY</a></li>', '<li><a href="#xy">XとY</a></li><li><a href="#manufacturer-note">メーカー差</a></li>', 1)

# Rebuild related cards using existing article imagery only.
related = '''        <section class="section-card" aria-labelledby="related-title">
          <h2 id="related-title">あわせて読みたい記事</h2>
          <p>X・Y・M・Dを理解したら、PLC全体、I/O、スキャン、I/O割付へ進むと、デバイスが実機とプログラムのどこに位置するか整理しやすくなります。</p>
          <div class="related-grid">
            <a class="related-card" href="plc-basic.html"><div class="related-card-thumb"><img src="../assets/images/plc-basic/plc-basic-ogp.png" alt="PLCの基本記事" loading="lazy" decoding="async"></div><h3>PLCとは？</h3><p>CPU・入力・出力・プログラムというPLC全体の役割から整理します。</p></a>
            <a class="related-card" href="plc-io-unit-basic.html"><div class="related-card-thumb"><img src="../assets/images/plc-io-unit-basic/plc-io-unit-basic-ogp.png" alt="PLC入出力ユニットの基本記事" loading="lazy" decoding="async"></div><h3>PLC入出力ユニットとは？</h3><p>X/Yと実際の端子、COM、入力・出力機器のつながりを確認できます。</p></a>
            <a class="related-card" href="plc-scan-basic.html"><div class="related-card-thumb"><img src="../assets/images/plc-scan-basic/plc-scan-basic-ogp.png" alt="PLCスキャンの基本記事" loading="lazy" decoding="async"></div><h3>PLCのスキャンとは？</h3><p>入力を読み、プログラムを処理し、出力へ反映する基本サイクルを整理します。</p></a>
            <a class="related-card" href="plc-io-allocation-basic.html"><div class="related-card-thumb"><img src="../assets/images/plc-io-allocation-basic/plc-io-allocation-basic-ogp.png" alt="PLCのI/O割付の基本記事" loading="lazy" decoding="async"></div><h3>PLCのI/O割付とは？</h3><p>現場機器・端子・I/Oアドレス・ラダー上のデバイスを結びつけて見る基本です。</p></a>
          </div>
        </section>'''
s, n = re.subn(r'        <section class="section-card" aria-labelledby="related-title">.*?</section>', related, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('related section not found')

article.write_text(s, encoding='utf-8')

md = backlog.read_text(encoding='utf-8')
repls = {
    '- [ ] `articles/dc24v-common-basic.html` — DC24Vコモン': '- [ ] `articles/dc24v-common-basic.html` — DC24Vコモン — 作業中（PR #1454 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
    '- [ ] `articles/no-nc-basic.html` — NO・NC': '- [ ] `articles/no-nc-basic.html` — NO・NC — 作業中（PR #1456 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
    '- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット': '- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット — 作業中（PR #1458 / 本文見直し / 関連記事画像カード化 / 追加画像は保留）',
    '- [ ] `articles/plc-xymd-device-basic.html` — PLC X/Y/M/Dデバイス': '- [ ] `articles/plc-xymd-device-basic.html` — PLC X/Y/M/Dデバイス — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
}
for old, new in repls.items():
    if old in md and new not in md:
        md = md.replace(old, new, 1)
if '画像生成が利用できない期間は' not in md:
    anchor = '- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。\n'
    md = md.replace(anchor, anchor + '- 画像生成が利用できない期間は、本文・構成・内部リンク・既存画像を使った関連記事カードを先行改善し、追加画像だけ保留として記録する。\n', 1)
md = re.sub(r'次の改善対象は `articles/dc24v-common-basic.html`。', '現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/one-shot-circuit-basic.html`。', md)
backlog.write_text(md, encoding='utf-8')
