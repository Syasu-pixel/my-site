from pathlib import Path
import sys

root = Path(sys.argv[1])
p = root / 'articles/selector-switch-basic.html'
s = p.read_text(encoding='utf-8')

def one(old, new):
    global s
    n = s.count(old)
    if n != 1:
        raise SystemExit(f'expected 1 match, got {n}: {old[:100]}')
    s = s.replace(old, new, 1)

one('そのため、今どのモードが選ばれているかを見た目で確認しやすいのが特徴です。',
    'ただし、自動復帰型もあるため、保持方式は機種ごとに確認します。保持型では現在の選択位置を見た目で確認しやすいのが特徴です。')
one('選んだ位置が残るため、試運転・調整・通常運転の切替でよく使われます。',
    '保持型では選んだ位置が残りますが、自動復帰型もあるため、用途と機種仕様を確認して使い分けます。')
one('2ノッチは切替位置が2つ、3ノッチは切替位置が3つのセレクタスイッチです。ON/OFFや手動/停止/自動など、用途に合わせて使い分けます。',
    '2ノッチは切替位置が2つ、3ノッチは切替位置が3つのセレクタスイッチです。ON/OFFや手動/停止/自動などは代表例で、表示・接点構成・復帰方式は機種によって異なります。')
one('<td>停止位置を含むモード選択</td>', '<td>3つの位置を使うモード選択（中央が停止とは限りません）</td>')
one('<h3>保持タイプでは、選んだ位置がそのまま残ります</h3>', '<h3>保持型と自動復帰型があります</h3>')
one('セレクタスイッチは、つまみから手を離しても選択した位置が残る保持タイプがよく使われます。\n              電源を切って再投入したときも、同じ位置のままになっていることがあるため、作業前の確認が大切です。',
    '保持型は、つまみから手を離しても選択した位置が残ります。一方で、操作後に元の位置へ戻る自動復帰型もあります。\n              ノッチ数だけでは保持・復帰の方式や接点構成は決まらないため、型式・カタログ・接点構成図を確認します。')
one('保持タイプ、復帰タイプなどがあり、手を離した後の状態が変わります。', '手動復帰（保持）や自動復帰などがあり、手を離した後の状態が変わります。')
one('押しボタンのように一瞬だけ操作する部品ではなく、選んだ位置を保持して使う場面が多いです。', '選んだ位置を保持して使う場面が多い一方、自動復帰型もあるため、復帰方式は機種仕様で確認します。')
one('手動・停止・自動のように停止位置を含めたい場合は、3ノッチのセレクタスイッチが使われることがあります。', '手動・停止・自動のような3位置の使い方は代表例です。3ノッチでも中央位置の意味や接点構成は機種・回路によって異なります。')

old_related = '''        <section class="section-card" id="related">
          <h2>あわせて読みたい記事</h2>
          <div class="related-grid">
            <a class="related-card" href="push-button-switch-basic.html">
              <h3>押しボタンスイッチとは？</h3>
              <p>セレクタスイッチと同じく、操作盤でよく使う基本部品です。a接点・b接点も整理できます。</p>
            </a>

            <a class="related-card" href="plc-io-unit-basic.html">
              <h3>入力と出力の違いとは？</h3>
              <p>セレクタスイッチがPLC入力や制御回路でどう扱われるかを理解しやすくなります。</p>
            </a>

            <a class="related-card" href="relay-basic.html">
              <h3>リレーとは？</h3>
              <p>セレクタスイッチで選んだ信号を、リレー回路でどう使うかを整理できます。</p>
            </a>
          </div>
        </section>'''
new_related = '''        <section class="section-card" id="sources">
          <h2>参考にした公式資料</h2>
          <ul class="simple-list">
            <li><a href="https://www.fa.omron.co.jp/products/family/3444/specification/" target="_blank" rel="noopener noreferrer">オムロン A22NS / A22NW セレクタスイッチ 定格/性能</a></li>
            <li><a href="https://www.fa.omron.co.jp/data_pdf/cat/a22n_m22n_a30n_sgfs-338_4_20.pdf?id=3449" target="_blank" rel="noopener noreferrer">オムロン A22N / M22N / A30N 商品カタログ</a></li>
          </ul>
          <div class="note-box">
            <h3>ノッチ数だけで接点構成や復帰方式を決めつけない</h3>
            <p>同じ2ノッチ・3ノッチでも、保持・自動復帰や接点構成には機種差があります。実機では型式、カタログ、接点構成図を優先して確認します。</p>
          </div>
        </section>

        <section class="section-card" id="related">
          <h2>あわせて読みたい記事</h2>
          <div class="related-grid">
            <a class="related-card" href="push-button-switch-basic.html">
              <span class="related-card-media"><img src="../assets/images/push-button-switch-basic/push-button-switch-overview.png" alt="押しボタンスイッチの基本記事" loading="lazy" decoding="async"></span>
              <span class="related-card-body"><h3>押しボタンスイッチとは？</h3><p>操作盤でよく使う基本部品。セレクタスイッチとの違いも整理しやすくなります。</p></span>
            </a>
            <a class="related-card" href="plc-io-unit-basic.html">
              <span class="related-card-media"><img src="../assets/images/plc-io-unit-basic/plc-io-unit-basic-hero.png" alt="PLC入出力ユニットの基本記事" loading="lazy" decoding="async"></span>
              <span class="related-card-body"><h3>PLC入出力ユニットとは？</h3><p>セレクタスイッチの信号がPLC入力でどう扱われるかを理解しやすくなります。</p></span>
            </a>
            <a class="related-card" href="relay-basic.html">
              <span class="related-card-media"><img src="../assets/images/relay-basic/relay-overview.png" alt="リレーの基本記事" loading="lazy" decoding="async"></span>
              <span class="related-card-body"><h3>リレーとは？</h3><p>選択した信号をリレー回路でどう扱うかを整理できます。</p></span>
            </a>
          </div>
        </section>'''
one(old_related, new_related)

anchor = '''    .related-card:hover{
      text-decoration:none;
      border-color:#bfd4ec;
      background:#fbfdff;
    }
'''
extra = '''    .related-card-media{display:block;overflow:hidden;border-radius:14px;aspect-ratio:1200 / 630;margin-bottom:12px;background:#eef4ff;}
    .related-card-media img{width:100%;height:100%;object-fit:cover;}
    .related-card-body{display:block;}
'''
one(anchor, anchor + extra)
p.write_text(s, encoding='utf-8')
