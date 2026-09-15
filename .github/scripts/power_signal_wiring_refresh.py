from pathlib import Path
import re

p = Path('articles/power-signal-wiring-separation-basic.html')
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

extra = '''
        <section class="section-card" id="distance-rule">
          <h2>離隔距離は「何cm」と一律に決めつけない</h2>
          <p>動力線と信号線は分けて配線するのが基本ですが、必要な離隔や配線方法は、電圧・電流・ケーブル種別・信号種別・インバータなどのノイズ源・使用機器によって変わります。</p>
          <div class="check-grid">
            <div class="check-item check-item--blue"><h3>メーカー資料を優先</h3><p>PLC、インバータ、サーボ、センサーなどの取扱説明書に配線分離やシールド処理の指定がある場合は、その条件を優先します。</p></div>
            <div class="check-item check-item--green"><h3>並走を減らす</h3><p>ノイズの影響を受けやすい信号線は、動力線と長い距離を並走させないよう配線ルートを検討します。</p></div>
            <div class="check-item check-item--orange"><h3>交差するなら短く</h3><p>ルート上どうしても交差する場合は、並走区間を増やさず、できるだけ影響を受けにくい取り回しを検討します。</p></div>
            <div class="check-item check-item--red"><h3>信号の種類も見る</h3><p>デジタルI/O、アナログ、通信、エンコーダなどではノイズへの影響度が異なるため、同じ扱いにしません。</p></div>
          </div>
          <div class="note-box"><h3>数字だけを覚えるより、配線条件を確認する</h3><p>現場では「必ず○cm」という単純なルールにせず、設備図面・社内標準・使用機器のメーカー資料を合わせて判断するのが確実です。</p></div>
        </section>
'''
if 'id="distance-rule"' not in s:
    marker = '<section class="section-card" id="field">'
    if marker not in s:
        marker = '<section class="section-card" id="check">'
    if marker not in s:
        raise SystemExit('insertion marker not found')
    s = s.replace(marker, extra + '\n        ' + marker, 1)

for label in ('現場で見るポイント','確認ポイント'):
    target = f'<a href="#field">{label}</a>' if label == '現場で見るポイント' else f'<a href="#check">{label}</a>'
    if target in s and '<a href="#distance-rule">離隔の考え方</a>' not in s:
        s = s.replace(target, '<a href="#distance-rule">離隔の考え方</a>\n        ' + target, 1)
        break

related = '''<section class="section-card" id="related">
          <h2>関連記事</h2>
          <p>配線分離だけでなく、シールド・接地・フィルタを組み合わせてノイズの経路全体を見ると理解しやすくなります。</p>
          <div class="related-grid">
            <a class="related-card" href="shielded-cable-basic.html"><div class="related-card-thumb"><img src="../assets/images/shielded-cable-basic/shielded-cable-basic-hero.png" alt="シールド線の基本記事" loading="lazy" decoding="async"></div><h3>シールド線とは？</h3><p>信号線を外来ノイズから守るシールドの役割と基本を整理します。</p></a>
            <a class="related-card" href="control-panel-grounding-basic.html"><div class="related-card-thumb"><img src="../assets/images/control-panel-grounding-basic/control-panel-grounding-basic-ogp.png" alt="制御盤の接地の基本記事" loading="lazy" decoding="async"></div><h3>制御盤の接地・アース</h3><p>ノイズ対策と安全の両面から、接地の基本的な考え方を確認できます。</p></a>
            <a class="related-card" href="noise-filter-basic.html"><div class="related-card-thumb"><img src="../assets/images/noise-filter-basic/noise-filter-basic-ogp.png" alt="ノイズフィルタの基本記事" loading="lazy" decoding="async"></div><h3>ノイズフィルタとは？</h3><p>電源ラインを伝わるノイズを抑える部品の役割を整理できます。</p></a>
          </div>
        </section>'''
s, n = re.subn(r'<section class="section-card" id="related">.*?</section>', related, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('related section replacement failed')

p.write_text(s, encoding='utf-8')

md = b.read_text(encoding='utf-8')
old = '- [ ] `articles/power-signal-wiring-separation-basic.html` — 動力線・信号線の分離'
new = '- [ ] `articles/power-signal-wiring-separation-basic.html` — 動力線・信号線の分離 — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
if old in md:
    md = md.replace(old, new, 1)
elif new not in md:
    raise SystemExit('backlog row not found')
note = '- 画像生成が利用できない期間は、本文・構成・内部リンク・既存画像を使った関連記事カードを先行改善し、追加画像だけ保留として記録する。\n'
anchor = '- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。\n'
if note not in md and anchor in md:
    md = md.replace(anchor, anchor + note, 1)
md = re.sub(r'次の改善対象は `articles/dc24v-common-basic\.html`。', '現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/solenoid-valve-troubleshooting-basic.html`。', md)
b.write_text(md, encoding='utf-8')
