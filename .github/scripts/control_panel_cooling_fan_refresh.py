from pathlib import Path
import re

p = Path('articles/control-panel-cooling-fan-basic.html')
b = Path('docs/existing-article-improvement-backlog.md')
s = p.read_text(encoding='utf-8')

if '.related-card-thumb{' not in s:
    s, n = re.subn(
        r'(\.related-card p\{[^}]+\})',
        r'\1\n    .related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}\n    .related-card-thumb img{width:100%;height:100%;object-fit:cover}',
        s,
        count=1,
    )
    if n != 1:
        raise SystemExit('related card css not found')

decision = '''
        <section class="section-card" id="selection">
          <h2>放熱ファンを付ければ必ず解決、ではない</h2>
          <p>ファンは盤内温度対策の代表的な方法ですが、どの盤でも同じように使えるわけではありません。必要な冷却量、周囲温度、盤の大きさ、発熱する機器、設置環境、要求される防塵・防水性能などによって、適した方法は変わります。</p>
          <div class="check-grid">
            <div class="check-item check-item--blue"><h3>発熱量を見る</h3><p>インバータや電源など、どの機器がどれだけ熱を出すかで必要な対策が変わります。</p></div>
            <div class="check-item check-item--green"><h3>周囲温度を見る</h3><p>外気自体が高温なら、換気だけでは十分に温度を下げられない場合があります。</p></div>
            <div class="check-item check-item--orange"><h3>盤の保護性能を見る</h3><p>粉じん・油・水分がある環境では、単純な外気導入が適さない場合があります。</p></div>
            <div class="check-item check-item--red"><h3>メーカー条件を見る</h3><p>機器の許容周囲温度や必要な離隔、盤用冷却機器の選定条件はメーカー資料で確認します。</p></div>
          </div>
          <div class="note-box"><h3>実務では「ファンの有無」より「温度条件を満たせるか」で判断する</h3><p>換気扇、循環ファン、熱交換器、盤用クーラーなどは役割が異なります。設備仕様やメーカー資料に基づいて、必要な盤内温度と設置環境に合う方式を選びます。</p></div>
        </section>
'''
if 'id="selection"' not in s:
    marker = '<section class="section-card" id="field">'
    if marker not in s:
        raise SystemExit('field section not found')
    s = s.replace(marker, decision + '\n        ' + marker, 1)

if '<a href="#selection">選定の考え方</a>' not in s:
    s = s.replace('<a href="#field">現場で見るポイント</a>', '<a href="#selection">選定の考え方</a>\n        <a href="#field">現場で見るポイント</a>', 1)

related = '''<section class="section-card" id="related">
          <h2>関連記事</h2>
          <p>制御盤の温度対策は、発熱する機器と結露対策まで合わせて見ると全体像を整理しやすくなります。</p>
          <div class="related-grid">
            <a class="related-card" href="inverter-basic.html"><div class="related-card-thumb"><img src="../assets/images/inverter-basic/inverter-basic-hero.png" alt="インバータの基本記事" loading="lazy" decoding="async"></div><h3>インバータとは？</h3><p>盤内で発熱源になりやすい機器の代表例として、役割と基本を確認できます。</p></a>
            <a class="related-card" href="dc24v-power-supply-basic.html"><div class="related-card-thumb"><img src="../assets/images/dc24v-power-supply-basic/dc24v-power-supply-hero.png" alt="DC24V電源の基本記事" loading="lazy" decoding="async"></div><h3>DC24V電源とは？</h3><p>制御盤内の電源機器と発熱の関係を理解する入口になります。</p></a>
            <a class="related-card" href="panel-heater-basic.html"><div class="related-card-thumb"><img src="../assets/images/panel-heater-basic/panel-heater-basic-ogp.png" alt="盤用ヒーターの基本記事" loading="lazy" decoding="async"></div><h3>盤用ヒーターとは？</h3><p>冷却とは反対に、結露を防ぐために加温する考え方を比較できます。</p></a>
          </div>
        </section>'''
s, n = re.subn(r'<section class="section-card" id="related">.*?</section>', related, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('related section replacement failed')

p.write_text(s, encoding='utf-8')

md = b.read_text(encoding='utf-8')
old = '- [ ] `articles/control-panel-cooling-fan-basic.html` — 制御盤冷却ファン'
new = '- [ ] `articles/control-panel-cooling-fan-basic.html` — 制御盤冷却ファン — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
if old in md:
    md = md.replace(old, new, 1)
elif new not in md:
    raise SystemExit('backlog cooling fan row not found')

note = '- 画像生成が利用できない期間は、本文・構成・内部リンク・既存画像を使った関連記事カードを先行改善し、追加画像だけ保留として記録する。\n'
anchor = '- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。\n'
if note not in md and anchor in md:
    md = md.replace(anchor, anchor + note, 1)
md = re.sub(r'次の改善対象は `articles/dc24v-common-basic\.html`。', '現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/power-signal-wiring-separation-basic.html`。', md)
b.write_text(md, encoding='utf-8')
