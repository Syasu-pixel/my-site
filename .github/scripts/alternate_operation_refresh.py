from pathlib import Path
import re

p=Path('articles/alternate-operation-circuit-basic.html')
b=Path('docs/existing-article-improvement-backlog.md')
s=p.read_text(encoding='utf-8')

if '.related-card-thumb{' not in s:
    s,n=re.subn(r'(\.related-card p\{[^}]+\})',r'\1\n    .related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}\n    .related-card-thumb img{width:100%;height:100%;object-fit:cover}',s,count=1)
    if n!=1: raise SystemExit('related css not found')

clarify='''
        <div class="section-card" id="meaning">
          <h2>「交互運転」は文脈で意味が変わる</h2>
          <p>この記事では、<strong>1つの操作をするたびに同じ出力のON/OFF状態を切り替える回路</strong>を「交互運転回路」として説明しています。</p>
          <p>一方で、ポンプやファンなどの設備では「交互運転」が、<strong>2台以上の機器を1号機→2号機のように順番に切り替えて運転する方式</strong>を指すこともあります。名称だけで判断せず、対象設備の図面・仕様書・PLCコメントで意味を確認することが大切です。</p>
          <div class="note-box"><h3>この記事で扱うのは「押すたびに状態が反転する」考え方</h3><p>ラダーを見るときは、切替用の内部フラグがどの条件でON/OFFされるかを追うと整理しやすくなります。</p></div>
        </div>
'''
if 'id="meaning"' not in s:
    marker='<div class="section-card" id="check">'
    if marker not in s: raise SystemExit('check section not found')
    s=s.replace(marker,clarify+'\n        '+marker,1)

# Add thumbnails to the existing related cards without changing their text.
thumbs={
    'self-hold-circuit.html':'../assets/images/self-hold-circuit/self-hold-circuit-ogp.png',
    'one-shot-circuit-basic.html':'../assets/images/one-shot-circuit-basic/one-shot-circuit-basic-ogp.png',
    'timer-circuit-basic.html':'../assets/images/timer-circuit-basic/timer-circuit-basic-ogp.png',
}
for href,img in thumbs.items():
    anchor=f'<a class="related-card" href="{href}">'
    if anchor in s and f'src="{img}"' not in s:
        label={'self-hold-circuit.html':'自己保持回路','one-shot-circuit-basic.html':'ワンショット回路','timer-circuit-basic.html':'タイマー回路'}[href]
        s=s.replace(anchor,anchor+f'\n              <div class="related-card-thumb"><img src="{img}" alt="{label}の記事イメージ" loading="lazy" decoding="async"></div>',1)

p.write_text(s,encoding='utf-8')

md=b.read_text(encoding='utf-8')
old='- [ ] `articles/alternate-operation-circuit-basic.html` — 交互運転回路'
new='- [ ] `articles/alternate-operation-circuit-basic.html` — 交互運転回路 — 作業中（本文見直し / 関連記事画像カード化 / 追加画像は保留）'
if old in md: md=md.replace(old,new,1)
elif new not in md: raise SystemExit('backlog row not found')
note='- 画像生成が利用できない期間は、本文・構成・内部リンク・既存画像を使った関連記事カードを先行改善し、追加画像だけ保留として記録する。\n'
anchor='- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。\n'
if note not in md and anchor in md: md=md.replace(anchor,anchor+note,1)
md=re.sub(r'次の改善対象は `articles/dc24v-common-basic\.html`。','現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/control-transformer-basic.html`。',md)
b.write_text(md,encoding='utf-8')
