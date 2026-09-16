from pathlib import Path
import re

p=Path('articles/signal-tower-light-basic.html')
b=Path('docs/existing-article-improvement-backlog.md')
s=p.read_text(encoding='utf-8')

if '.related-card-thumb{' not in s:
    s,n=re.subn(r'(\.related-card p\{[^}]+\})',r'\1\n    .related-card-thumb{margin:-16px -16px 14px;aspect-ratio:16/9;overflow:hidden;border-radius:19px 19px 12px 12px;background:#eaf1f8;border-bottom:1px solid #d7e4f3}\n    .related-card-thumb img{width:100%;height:100%;object-fit:cover}',s,count=1)
    if n!=1: raise SystemExit('related css not found')

if 'id="color-rules"' not in s:
    sec='''
        <section class="section-card" id="color-rules">
          <h2>色の意味は「一般例」と「設備ルール」を分けて見る</h2>
          <p>赤・黄・緑にはよく使われる意味がありますが、<strong>色だけで設備状態を断定しない</strong>ことが大切です。同じ色でも、設備や工程によって「停止」「異常」「材料待ち」「呼び出し」など割り当てが異なる場合があります。</p>
          <div class="check-grid">
            <div class="check-item check-item--green"><h3>表示仕様</h3><p>設備仕様書や表示一覧で、その設備が各色に何を割り当てているか確認します。</p></div>
            <div class="check-item check-item--blue"><h3>PLC・制御条件</h3><p>図面やPLCコメント、保全画面などから、点灯・点滅条件を確認します。</p></div>
            <div class="check-item check-item--orange"><h3>点灯と点滅</h3><p>同じ色でも点灯・点滅で意味を分ける設計があるため、表示方法まで含めて見ます。</p></div>
            <div class="check-item check-item--red"><h3>ブザー</h3><p>色表示とは別に、ブザーの鳴動条件や停止方法が設定されている場合があります。</p></div>
          </div>
          <div class="note-box"><h3>積層信号灯は「安全装置そのもの」とは限らない</h3><p>積層信号灯は主に状態を知らせる表示機器です。非常停止や安全機能の成立は、別の安全回路・安全制御の仕様で判断します。</p></div>
        </section>
'''
    marker='<section class="section-card" id="comparison">'
    if marker not in s: raise SystemExit('comparison marker not found')
    s=s.replace(marker,sec+'\n        '+marker,1)
    s=s.replace('<a href="#comparison">表示灯との違い</a>','<a href="#color-rules">色の意味と設備ルール</a>\n        <a href="#comparison">表示灯との違い</a>',1)

s=s.replace('点灯しない場合は、PLC出力がONしているか、出力電源があるか、端子台や線番が合っているか、ランプユニットが故障していないかを順番に見ます。','点灯しない場合は、まず設備の表示仕様と図面、PLCの状態表示や保全画面など、非接触で確認できる情報から切り分けます。そのうえで、端子台・線番・機器仕様との対応を確認します。')
s=s.replace('<h3>2. PLC出力を見る</h3>\n              <p>該当するY出力やリレー出力がONしているか確認します。</p>','<h3>2. PLC状態を見る</h3>\n              <p>設備の定められた手順に従い、PLC状態表示や保全画面で該当出力の状態を確認します。</p>')

related='''<section class="section-card" id="related">
          <h2>関連記事</h2>
          <p>積層信号灯は、表示灯・PLC出力・非常停止表示との関係まで続けて見ると理解しやすくなります。</p>
          <div class="related-grid">
            <a class="related-card" href="pilot-lamp-basic.html"><div class="related-card-thumb"><img src="../assets/images/pilot-lamp-basic/pilot-lamp-basic-ogp.webp" alt="パイロットランプ・表示灯の基本記事" loading="lazy" decoding="async"></div><h3>パイロットランプ・表示灯とは？</h3><p>操作盤上の表示灯と積層信号灯の役割の違いを整理できます。</p></a>
            <a class="related-card" href="plc-io-unit-basic.html"><div class="related-card-thumb"><img src="../assets/images/plc-io-unit-basic/plc-io-unit-basic-ogp.png" alt="PLC I/Oユニットの基本記事" loading="lazy" decoding="async"></div><h3>PLC I/Oユニットとは？</h3><p>PLC出力から表示機器へ信号が渡る考え方を確認できます。</p></a>
            <a class="related-card" href="emergency-stop-switch-basic.html"><div class="related-card-thumb"><img src="../assets/images/emergency-stop-switch-basic/emergency-stop-switch-hero.png" alt="非常停止スイッチの基本記事" loading="lazy" decoding="async"></div><h3>非常停止スイッチとは？</h3><p>赤表示と安全機能そのものを混同しないために、非常停止の役割を整理します。</p></a>
          </div>
        </section>'''
s,n=re.subn(r'<section class="section-card" id="related">.*?</section>',related,s,count=1,flags=re.S)
if n!=1: raise SystemExit('related section replacement failed')

p.write_text(s,encoding='utf-8')
md=b.read_text(encoding='utf-8')
old='- [ ] `articles/signal-tower-light-basic.html` — タワーライト'
new='- [ ] `articles/signal-tower-light-basic.html` — タワーライト — 作業中（本文見直し / 色表示の意味を整理 / 関連記事画像カード化 / 追加画像は保留）'
if old in md: md=md.replace(old,new,1)
elif new not in md: raise SystemExit('backlog row not found')
md=re.sub(r'次の改善対象は `articles/dc24v-common-basic\.html`。','現在は本文先行で複数記事をPreview中。次の新規着手候補は `articles/dc24v-power-supply-basic.html`。',md)
b.write_text(md,encoding='utf-8')
