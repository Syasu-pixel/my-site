from pathlib import Path
import re

p = Path('articles/solenoid-valve-troubleshooting-basic.html')
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

split = '''
        <section class="section-card" id="split-check">
          <h2>「電気側」と「空圧側」を分けると原因を追いやすい</h2>
          <p>電磁弁が動かない時は、最初から部品故障と決めつけず、<strong>電気信号が届いていないのか、電磁弁以降の空圧側で止まっているのか</strong>を分けて考えると整理しやすくなります。</p>
          <div class="check-grid">
            <div class="check-item check-item--blue"><h3>電気側</h3><p>PLC出力の状態、電源条件、コイル仕様、配線・端子・コネクタの状態などを図面とメーカー資料で確認します。</p></div>
            <div class="check-item check-item--green"><h3>空圧側</h3><p>元圧、レギュレータ、配管、排気側、シリンダーや負荷側など、空気が流れる経路を確認します。</p></div>
          </div>
          <div class="note-box"><h3>確認の基準は設備図面とメーカー資料</h3><p>電圧・圧力・手動操作などの確認は、対象設備の安全条件と定められた手順を優先します。特に手動操作は機械が意図せず動く可能性があるため、安易に試すのではなく、設備側の安全条件を満たしていることを前提に判断します。</p></div>
        </section>
'''
if 'id="split-check"' not in s:
    marker = '<section class="section-card" id="common-mistakes">'
    if marker not in s:
        marker = '<section class="section-card" id="related">'
    if marker not in s:
        raise SystemExit('insert marker not found')
    s = s.replace(marker, split + '\n        ' + marker, 1)

if '<a href="#split-check">電気側/空圧側の切り分け</a>' not in s:
    s = s.replace('<a href="#common-mistakes">よくある原因</a>', '<a href="#split-check">電気側/空圧側の切り分け</a>\n          <a href="#common-mistakes">よくある原因</a>', 1)

related = '''<section class="section-card" id="related">
          <h2>関連記事</h2>
          <p>電磁弁単体だけでなく、手動操作の考え方、エアシリンダ、空圧系全体の確認順を続けて見ると原因を整理しやすくなります。</p>
          <div class="related-grid">
            <a class="related-card" href="solenoid-valve-manual-override-basic.html"><div class="related-card-thumb"><img src="../assets/images/solenoid-valve-manual-override-basic/solenoid-valve-manual-override-basic-hero.png" alt="電磁弁の手動操作の基本記事" loading="lazy" decoding="async"></div><h3>電磁弁の手動操作とは？</h3><p>手動操作の役割と、機械が動く可能性を含めて安全面から整理します。</p></a>
            <a class="related-card" href="air-cylinder-basic.html"><div class="related-card-thumb"><img src="../assets/images/air-cylinder-basic/air-cylinder-basic-hero.webp" alt="エアシリンダの基本記事" loading="lazy" decoding="async"></div><h3>エアシリンダとは？</h3><p>電磁弁の先で実際に動くアクチュエータ側の基本を確認できます。</p></a>
            <a class="related-card" href="air-pneumatic-troubleshooting-guide.html"><div class="related-card-thumb"><img src="../assets/images/air-pneumatic-troubleshooting-guide/air-pneumatic-troubleshooting-guide-ogp.png" alt="空圧トラブルの確認順記事" loading="lazy" decoding="async"></div><h3>空圧トラブルの確認順</h3><p>元圧・レギュレータ・電磁弁・配管・排気・信号を全体で切り分けます。</p></a>
          </div>
        </section>'''
s, n = re.subn(r'<section class="section-card" id="related">.*?</section>', related, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('related section replacement failed')

p.write_text(s, encoding='utf-8')

md = b.read_text(encoding='utf-8')
old = '- [ ] `articles/solenoid-valve-troubleshooting-basic.html` — 電磁弁トラブルシューティング'
new = '- [ ] `articles/solenoid-valve-troubleshooting-basic.html` — 電磁弁トラブルシューティング — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
if old in md:
    md = md.replace(old, new, 1)
elif new not in md:
    raise SystemExit('backlog solenoid row not found')
note = '- 画像生成が利用できない期間は、本文・構成・内部リンク・既存画像を使った関連記事カードを先行改善し、追加画像だけ保留として記録する。\n'
anchor = '- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。\n'
if note not in md and anchor in md:
    md = md.replace(anchor, anchor + note, 1)
md = re.sub(r'次の改善対象は `articles/dc24v-common-basic\.html`。', '現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/din-rail-basic.html`。', md)
b.write_text(md, encoding='utf-8')
