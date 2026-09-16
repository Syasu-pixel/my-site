from pathlib import Path
import re

p = Path('articles/control-transformer-basic.html')
b = Path('docs/existing-article-improvement-backlog.md')
s = p.read_text(encoding='utf-8')

if '.related-card-thumb{' not in s:
    s, n = re.subn(
        r'(\.related-card p \{[^}]+\})',
        r'\1\n\n    .related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}\n    .related-card-thumb img{width:100%;height:100%;object-fit:cover}',
        s,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit('related card css not found')

s = s.replace(
    '<li>確認時は<span class="mark">一次電圧・二次電圧・保護機器</span>の順で見ます。</li>',
    '<li>確認時は<span class="mark">図面・銘板・保護機器・メーカー資料</span>を照合して電源系統を整理します。</li>',
    1,
)

s = s.replace(
    '<p>不具合時もこの見方は有効です。<strong>一次側に電圧が来ているか</strong>、<strong>二次側に電圧が出ているか</strong>を分けて確認すると、原因の範囲を絞りやすくなります。</p>',
    '<p>不具合時もこの見方は有効です。まず図面・端子表示・保護機器・機器銘板を照合して、一次側と二次側のどちらに問題の範囲があるかを整理します。通電状態での確認が必要な場合は、設備の安全手順とメーカー手順に従える適切な作業者が行います。</p>',
    1,
)

s = s.replace(
    '<td>一次側に電圧が来ているか、二次側に電圧が出ているかを見る</td>',
    '<td>一次側／二次側の系統、保護機器、銘板条件を図面・メーカー資料と照合する</td>',
    1,
)

old_check = '''          <ul class="simple-list">\n            <li><strong>一次側</strong>に指定電圧が来ているか</li>\n            <li><strong>二次側電圧</strong>を実測して、指定値が出ているか</li>\n            <li>一次側／二次側の<strong>ヒューズ</strong>やサーキットプロテクタが落ちていないか</li>\n            <li>負荷側で短絡や過負荷が起きていないか</li>\n            <li>端子のゆるみ、焼け、変色がないか</li>\n            <li>図面上の電源系統と実機の配線・端子表示が一致しているか</li>\n          </ul>'''
new_check = '''          <ul class="simple-list">\n            <li><strong>図面</strong>で一次側・二次側の系統と端子番号を確認する</li>\n            <li><strong>機器銘板・メーカー資料</strong>で定格一次／二次電圧、容量、周波数などの条件を確認する</li>\n            <li>一次側／二次側の<strong>ヒューズ</strong>やサーキットプロテクタなど保護機器の状態を確認する</li>\n            <li>負荷側に異常履歴、焼損跡、変色など明らかな異常がないかを安全な範囲で確認する</li>\n            <li>図面上の電源系統と実機の端子表示・配線表示が一致しているか確認する</li>\n            <li>通電状態での測定が必要な場合は、社内ルール・設備仕様・メーカー手順に従える適切な作業者へ引き継ぐ</li>\n          </ul>'''
if old_check in s:
    s = s.replace(old_check, new_check, 1)

s = s.replace(
    '<li><strong>二次側電圧は必ず測って確認する</strong></li>',
    '<li><strong>二次側の条件は銘板・図面・メーカー資料で確認し、必要な測定は定められた安全手順で行う</strong></li>',
    1,
)

nuance = '''\n        <section class="section-card" id="isolation-note">\n          <h2>「制御用トランス＝安全電圧・保護分離」とは限らない</h2>\n          <p>制御用トランスは一次側と二次側を分けて制御回路へ電源を供給しますが、<strong>名称だけで安全電圧や保護分離の用途だと判断することはできません</strong>。製品ごとの絶縁仕様、二次電圧、接地方式、適用規格を確認する必要があります。</p>\n          <div class="check-grid">\n            <div class="check-item check-item--important"><h3>二次電圧</h3><p>100V、24Vなど構成は設備ごとに異なります。名称だけで電圧を決めつけません。</p></div>\n            <div class="check-item check-item--field"><h3>絶縁・接地条件</h3><p>一次／二次の絶縁仕様や二次側の接地方式は、図面とメーカー資料を優先します。</p></div>\n          </div>\n          <div class="note-box"><h3>交換時は容量だけでなく仕様全体を見る</h3><p>定格一次／二次電圧、VA容量、周波数、端子構成、絶縁仕様、取付条件などを既設品と照合します。</p></div>\n        </section>\n'''
if 'id="isolation-note"' not in s:
    marker = '<section class="section-card" id="check">'
    if marker not in s:
        raise SystemExit('check section marker not found')
    s = s.replace(marker, nuance + '\n        ' + marker, 1)

if '<a href="#isolation-note">絶縁・安全上の注意</a>' not in s:
    s = s.replace(
        '<a href="#comparison">DC24V電源との違い</a>',
        '<a href="#comparison">DC24V電源との違い</a>\n        <a href="#isolation-note">絶縁・安全上の注意</a>',
        1,
    )

related = '''<section class="section-card" aria-labelledby="related-title">\n          <h2 id="related-title">あわせて読みたい記事</h2>\n          <div class="related-grid">\n            <a class="related-card" href="dc24v-power-supply-basic.html"><div class="related-card-thumb"><img src="../assets/images/dc24v-power-supply-basic/dc24v-power-supply-hero.png" alt="DC24V電源の基本記事" loading="lazy" decoding="async"></div><h3>DC24V電源とは？</h3><p>交流の制御用トランスと、直流24Vを作る電源の役割の違いを整理できます。</p></a>\n            <a class="related-card" href="fuse-holder-basic.html"><div class="related-card-thumb"><img src="../assets/images/fuse-holder-basic/fuse-holder-basic-hero.png" alt="ヒューズホルダの基本記事" loading="lazy" decoding="async"></div><h3>ヒューズホルダとは？</h3><p>制御電源系統で使う保護機器の役割を続けて確認できます。</p></a>\n            <a class="related-card" href="control-panel-grounding-basic.html"><div class="related-card-thumb"><img src="../assets/images/control-panel-grounding-basic/control-panel-grounding-basic-hero.png" alt="制御盤の接地とアースの基本記事" loading="lazy" decoding="async"></div><h3>制御盤のアース・接地とは？</h3><p>二次側の扱いを考える時にも重要な、接地と盤内保護の基本を整理します。</p></a>\n          </div>\n        </section>'''
s, n = re.subn(r'<section class="section-card" aria-labelledby="related-title">.*?</section>', related, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('related section replacement failed')

p.write_text(s, encoding='utf-8')

md = b.read_text(encoding='utf-8')
old = '- [ ] `articles/control-transformer-basic.html` — 制御トランス'
new = '- [ ] `articles/control-transformer-basic.html` — 制御トランス — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
if old in md:
    md = md.replace(old, new, 1)
elif new not in md:
    raise SystemExit('backlog control transformer row not found')
md = md.replace('次の改善対象は `articles/dc24v-common-basic.html`。', '現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/emergency-stop-switch-basic.html`。', 1)
b.write_text(md, encoding='utf-8')
