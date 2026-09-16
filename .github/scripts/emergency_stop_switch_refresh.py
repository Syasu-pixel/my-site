from pathlib import Path
import re

p = Path('articles/emergency-stop-switch-basic.html')
b = Path('docs/existing-article-improvement-backlog.md')
s = p.read_text(encoding='utf-8')

if '.related-card-thumb{' not in s:
    s, n = re.subn(
        r'(\.related-card p\{[^}]+\})',
        r'\1\n    .related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}\n    .related-card-thumb img{width:100%;height:100%;object-fit:cover}',
        s,
        count=1
    )
    if n != 1:
        raise SystemExit('related card css not found')

clarify = '''
        <section class="section-card" id="design-scope">
          <h2>b接点を使うことと、安全回路全体の性能は別に考える</h2>
          <p>非常停止でNC（b接点）を使う考え方は重要ですが、<strong>b接点を1個入れれば安全回路が完成するわけではありません</strong>。必要な安全性能や停止方法は、設備の危険源、リスクアセスメント、適用規格、安全機器の仕様によって決まります。</p>
          <div class="check-grid">
            <div class="check-item check-item--important"><h3>入力</h3><p>非常停止スイッチの接点構成や直接開路動作など、使用する機器の安全仕様を確認します。</p></div>
            <div class="check-item check-item--field"><h3>判断</h3><p>安全リレーや安全PLCなど、設備で採用している安全制御の構成を図面と仕様書で確認します。</p></div>
            <div class="check-item check-item--warning"><h3>出力</h3><p>コンタクタ遮断やSTOなど、危険源をどの方法で停止させる設計なのかを分けて見ます。</p></div>
            <div class="check-item"><h3>復帰</h3><p>非常停止の解除、安全回路のリセット、通常運転の起動は同じ操作とは限りません。設備仕様どおりに確認します。</p></div>
          </div>
          <div class="danger-box"><h3>非常停止回路の変更・バイパスは別の専門作業</h3><p>安全回路の配線変更、無効化、バイパス、通電状態での測定や試験は、この記事の範囲では扱いません。実機では資格・権限・設備の安全手順・メーカー資料に従ってください。</p></div>
        </section>
'''
if 'id="design-scope"' not in s:
    marker = '<section class="section-card" id="reset">'
    if marker not in s:
        marker = '<section class="section-card" id="caution">'
    if marker not in s:
        raise SystemExit('insert marker not found')
    s = s.replace(marker, clarify + '\n        ' + marker, 1)

if '<a href="#design-scope">安全回路全体の見方</a>' not in s:
    s = s.replace('<a href="#reset">復帰前確認</a>', '<a href="#design-scope">安全回路全体の見方</a>\n        <a href="#reset">復帰前確認</a>', 1)

# Avoid implying that one fixed architecture applies to every machine.
s = s.replace('非常停止は、PLCの通常プログラムだけで止めるのではなく、安全リレーや安全回路を使ってハード側で運転準備条件を落とす考え方が基本です。', '非常停止は、通常制御だけに依存せず、設備で定められた安全制御によって危険源を安全側へ移行させる考え方が基本です。安全リレー、安全PLC、コンタクタ、STOなど、実際の構成は設備によって異なります。')
s = s.replace('現場で重要なのは、非常停止を押すことで<span class="mark">運転準備や運転許可の条件をハード側で落とし、コンタクタやSTOなどの停止側へ反映させる</span>という見方です。', '現場で重要なのは、非常停止を押したときに<span class="mark">設備で設計された安全機能が働き、危険源を所定の停止状態へ移行させる</span>という見方です。')

related = '''<section class="section-card" id="related">
          <h2>関連記事</h2>
          <p>非常停止を理解したら、安全制御全体と接点表記を続けて見ると、図面上の役割を整理しやすくなります。</p>
          <div class="related-grid">
            <a class="related-card" href="safety-control-basic.html"><div class="related-card-thumb"><img src="../assets/images/safety-control-basic/safety-control-basic-ogp.png" alt="安全制御の基本記事" loading="lazy" decoding="async"></div><h3>安全制御とは？</h3><p>非常停止・安全リレー・安全PLC・STOなど、安全入力から危険源までの全体像を整理します。</p></a>
            <a class="related-card" href="a-contact-b-contact-basic.html"><div class="related-card-thumb"><img src="../assets/images/a-contact-b-contact-basic/a-contact-b-contact-basic-ogp.webp" alt="a接点・b接点の基本記事" loading="lazy" decoding="async"></div><h3>a接点・b接点とは？</h3><p>非常停止で出てくるb接点を、通常時と動作時の違いから確認できます。</p></a>
            <a class="related-card" href="no-nc-basic.html"><div class="related-card-thumb"><img src="../assets/images/no-nc-basic/no-nc-basic-hero.png" alt="NO・NCの基本記事" loading="lazy" decoding="async"></div><h3>NO / NC の違い</h3><p>NC表記とb接点の関係を整理し、図面・機器表示を読みやすくします。</p></a>
          </div>
        </section>'''

# Existing related section may be id-less. Prefer section containing related-grid near the end.
if 'id="related"' in s:
    s, n = re.subn(r'<section class="section-card" id="related">.*?</section>', related, s, count=1, flags=re.S)
else:
    pattern = r'<section class="section-card"(?: aria-labelledby="[^"]+")?>\s*<h2[^>]*>(?:関連記事|あわせて読みたい記事)</h2>.*?</section>'
    s, n = re.subn(pattern, related, s, count=1, flags=re.S)
    if n != 1:
        # fallback: inject before side rail
        marker = '</div>\n\n      <aside class="side-rail"'
        if marker not in s:
            raise SystemExit('related section marker not found')
        s = s.replace(marker, related + '\n      </div>\n\n      <aside class="side-rail"', 1)

p.write_text(s, encoding='utf-8')

md = b.read_text(encoding='utf-8')
old = '- [ ] `articles/emergency-stop-switch-basic.html` — 非常停止スイッチ'
new = '- [ ] `articles/emergency-stop-switch-basic.html` — 非常停止スイッチ — 作業中（本文見直し / 安全表現整理 / 関連記事画像カード化 / 追加画像は保留）'
if old in md:
    md = md.replace(old, new, 1)
elif new not in md:
    raise SystemExit('backlog emergency stop row not found')
md = re.sub(r'次の改善対象は `articles/dc24v-common-basic\.html`。', '現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/signal-tower-light-basic.html`。', md)
b.write_text(md, encoding='utf-8')
