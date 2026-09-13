from pathlib import Path

src=Path('articles/plc-control-engineer-career.html')
dst=Path('articles/equipment-maintenance-career.html')
s=src.read_text(encoding='utf-8')

replacements={
    'PLC・制御設計エンジニアとは？仕事内容・必要スキル・キャリアを解説 | 電気と制御の実務メモ':'設備保全とは？仕事内容・必要スキル・キャリアを現場目線で解説 | 電気と制御の実務メモ',
    'PLC・制御設計エンジニアの仕事内容、必要な電気知識・PLCスキル、向いている人、キャリアの広げ方、転職時に確認したいポイントを現場目線で整理します。':'設備保全の仕事内容、日常点検・予防保全・故障対応、必要な電気・機械・PLCの基礎、向いている人、キャリアの広げ方を現場目線で整理します。',
    'https://denkicontrol.com/articles/plc-control-engineer-career.html':'https://denkicontrol.com/articles/equipment-maintenance-career.html',
    'PLC・制御設計エンジニアとは？仕事内容・必要スキル・キャリアを解説':'設備保全とは？仕事内容・必要スキル・キャリアを現場目線で解説',
    'PLC・制御設計の仕事を、仕事内容・必要スキル・キャリア・転職の順に整理します。':'設備保全の仕事を、仕事内容・必要スキル・故障対応・キャリアの順に整理します。',
    'PLC・制御設計エンジニアとは？仕事内容・必要スキル・キャリア':'設備保全とは？仕事内容・必要スキル・キャリア',
    './plc-control-engineer-career.html':'./equipment-maintenance-career.html',
}
for a,b in replacements.items():
    s=s.replace(a,b)

hero_start=s.index('<section class="article-hero"')
layout_start=s.index('<div class="layout">', hero_start)
top_block='''<section class="article-hero" aria-labelledby="page-title">
      <div class="article-hero-copy">
        <span class="hero-label">キャリア・転職</span>
        <h1 id="page-title">設備保全とは？<br>仕事内容・必要スキル・キャリアを解説</h1>
        <p class="hero-lead">設備を安定して動かすために、点検・予防保全・故障対応・再発防止までを担う設備保全の仕事を、現場目線で整理します。</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#work">仕事内容を見る</a>
          <a class="btn btn-secondary" href="#skills">必要スキルを見る</a>
        </div>
      </div>
    </section>

    <section class="top-summary" aria-label="記事の導入まとめ">
      <section class="summary-card">
        <strong>仕事の中心</strong>
        <span>設備を止めないための点検・予防保全と、止まったときに原因を切り分けて復旧する対応です。</span>
      </section>
      <section class="summary-card">
        <strong>必要な力</strong>
        <span>電気・機械・空圧・PLCの基礎に加えて、現象から原因候補を絞る切り分け力が重要です。</span>
      </section>
      <section class="summary-card">
        <strong>キャリア</strong>
        <span>保全経験を土台に、改善、予防保全、生産技術、制御、設備導入などへ担当範囲を広げられます。</span>
      </section>
    </section>

    <!-- Preview段階では完成済みPLCキャリア記事の画像をレイアウト確認用に一時流用。採用後に設備保全専用画像へ差し替える。 -->
    '''
s=s[:hero_start]+top_block+s[layout_start:]

main_start=s.index('<div class="main">', s.index('<div class="layout">'))
aside_start=s.index('<aside class="side">', main_start)
main='''<div class="main">
        <section class="article-card" id="overview">
          <h2>設備保全は「設備を止めない・早く復旧する」仕事</h2>
          <p><strong>設備保全</strong>は、生産設備や機械を安定して動かすために、点検、整備、部品交換、故障対応、改善を行う仕事です。故障してから直すだけではなく、<span class="marker-blue">止まる前に異常の兆候を見つける</span>ことも重要な役割です。</p>
          <p>現場によって担当範囲は違いますが、センサ、モータ、シリンダ、電磁弁、インバータ、PLC、機械要素など、複数分野を横断して設備を見る場面が多くあります。</p>
          <figure class="article-figure">
            <img src="../assets/images/plc-control-engineer-career/plc-control-engineer-career-overview.webp" alt="設備保全の仕事の全体像を確認するための仮画像" loading="lazy" decoding="async">
            <figcaption>※ Preview用の仮画像です。記事構造採用後に設備保全専用画像へ差し替えます。</figcaption>
          </figure>
          <div class="talk-thread">
            <div class="talk-row">
              <div class="talk-avatar"><img src="../assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png" alt="後輩の案内役"></div>
              <div class="talk-bubble"><span class="talk-name">後輩</span><p>設備保全って、壊れた機械を修理する仕事というイメージでした。</p></div>
            </div>
            <div class="talk-row talk-row--right">
              <div class="talk-avatar"><img src="../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png" alt="先輩の案内役"></div>
              <div class="talk-bubble"><span class="talk-name">先輩</span><p>修理も大事だけど、実務では「壊れないようにする」「同じ故障を繰り返さない」まで含めて考えることが多いよ。</p></div>
            </div>
          </div>
        </section>

        <section class="article-card" id="work">
          <h2>主な仕事内容</h2>
          <div class="flow">
            <div class="flow-item"><span class="flow-no">1</span><div><h3>日常点検・巡回</h3><p>異音、振動、温度、漏れ、摩耗、センサ状態などを確認し、普段と違う兆候を早めに拾います。</p></div></div>
            <div class="flow-item"><span class="flow-no">2</span><div><h3>予防保全・定期整備</h3><p>消耗部品の交換、給油、締付け、清掃、測定などを計画的に行い、突発停止のリスクを下げます。</p></div></div>
            <div class="flow-item"><span class="flow-no">3</span><div><h3>故障対応・復旧</h3><p>設備が停止したときは、症状、I/O、電源、センサ、アクチュエータ、機械側の状態を順に確認して原因を切り分けます。</p></div></div>
            <div class="flow-item"><span class="flow-no">4</span><div><h3>改善・再発防止</h3><p>故障原因を記録し、部品選定、配線、機構、制御条件、点検周期などを見直して再発を防ぎます。</p></div></div>
            <div class="flow-item"><span class="flow-no">5</span><div><h3>記録・予備品管理</h3><p>保全履歴や交換周期を残し、必要な予備品を切らさないように管理します。記録は次の故障対応を早くする材料にもなります。</p></div></div>
          </div>
        </section>

        <section class="article-card" id="skills">
          <h2>必要なスキルは4つに分けて考えると分かりやすい</h2>
          <div class="skill-grid">
            <div class="skill"><h3>1. 電気の基礎</h3><p>DC24V、リレー、センサ、モータ、電源、テスタの使い方など、異常箇所を追うための土台です。</p></div>
            <div class="skill"><h3>2. 機械・空圧の基礎</h3><p>ベアリング、ベルト、チェーン、シリンダ、電磁弁、レギュレータなど、駆動部の基本を理解します。</p></div>
            <div class="skill"><h3>3. PLC・制御の基礎</h3><p>I/Oの状態やインターロックを確認できると、「なぜ動かないか」を電気と制御の両面から追いやすくなります。</p></div>
            <div class="skill"><h3>4. トラブルを切り分ける力</h3><p>電気・機械・空圧・制御のどこに原因があるかを、現象と確認結果から順番に絞る力です。</p></div>
          </div>
          <figure class="article-figure">
            <img src="../assets/images/plc-control-engineer-career/plc-control-engineer-career-skills.webp" alt="設備保全に必要なスキル構成を確認するための仮画像" loading="lazy" decoding="async">
            <figcaption>※ Preview用の仮画像です。設備保全向けのスキル図へ差し替える予定です。</figcaption>
          </figure>
          <h3>当サイトで先に押さえたい記事</h3>
          <div class="internal-grid">
            <a class="internal-link" href="../categories/control-basics.html"><strong>制御の基礎</strong><span>リレー、センサ、PLCなど制御全体を整理する</span></a>
            <a class="internal-link" href="../categories/circuit-basics.html"><strong>回路の基礎</strong><span>電源・回路・配線の考え方を学ぶ</span></a>
            <a class="internal-link" href="./plc-io-unit-basic.html"><strong>PLC入出力ユニット</strong><span>設備の信号がPLCへどう入るかを理解する</span></a>
            <a class="internal-link" href="./air-regulator-basic.html"><strong>エアレギュレータ</strong><span>空圧機器の基本から確認する</span></a>
          </div>
        </section>

        <section class="article-card" id="beginner">
          <h2>未経験から目指すなら、いきなり全部を覚えなくていい</h2>
          <p>設備保全は扱う範囲が広いため、最初から電気・機械・PLC・空圧を全部深く覚える必要はありません。まずは<strong>安全に確認する手順</strong>と、担当設備でよく使う機器から覚えていく方が実務につながります。</p>
          <p>未経験なら、点検や部品交換から入り、次に電気図面やI/O確認、故障原因の切り分けへ進むと理解しやすくなります。</p>
          <div class="highlight">「何を知っているか」だけでなく、分からない故障に対して確認順序を組み立てられることが、保全では大きな強みになります。</div>
        </section>

        <section class="article-card" id="career">
          <h2>経験者は「担当範囲」を広げるほどキャリアの選択肢が増えやすい</h2>
          <p>日常保全だけでなく、予防保全、改善、PLC変更、設備導入、メーカー折衝まで経験すると、設備保全の中でも担当できる仕事が広がります。</p>
          <p>そこから、生産技術、制御設計、設備立上げ、保全リーダーなどへ進む道もあります。大切なのは肩書きより、<span class="marker-blue">どこまで自分で原因を追い、改善まで担当できるか</span>です。</p>
          <figure class="article-figure">
            <img src="../assets/images/plc-control-engineer-career/plc-control-engineer-career-career.webp" alt="設備保全から広がるキャリアを確認するための仮画像" loading="lazy" decoding="async">
            <figcaption>※ Preview用の仮画像です。設備保全からのキャリア図へ差し替える予定です。</figcaption>
          </figure>
        </section>

        <section class="article-card" id="job-check">
          <h2>転職求人を見るときに確認したいポイント</h2>
          <ul>
            <li><strong>保全対象：</strong>生産設備、ユーティリティ、建物設備など、何を担当するのか</li>
            <li><strong>担当範囲：</strong>点検中心か、故障対応・PLC・改善まで担当するのか</li>
            <li><strong>勤務形態：</strong>日勤のみか、交替勤務・夜間呼出しがあるか</li>
            <li><strong>内製と外注：</strong>自社で直す範囲と、メーカーへ依頼する範囲</li>
            <li><strong>教育環境：</strong>未経験の場合、図面・PLC・機械保全を学べる仕組みがあるか</li>
          </ul>
          <div class="caution">同じ「設備保全」という求人名でも仕事内容はかなり違います。職種名だけではなく、担当設備と担当範囲まで確認するのが重要です。</div>
        </section>

        <section class="article-card" id="service">
          <h2>転職サービスは「今すぐ転職する人」だけのものではない</h2>
          <p>自分の経験がどの職種で評価されるのか、求人ではどんなスキルが求められているのかを確認するだけでも、今後伸ばすスキルを考える材料になります。</p>
          <div class="cta cta-muted"><div><h3>転職サービス比較は準備中です</h3><p>キャリアカテゴリ側のSTEP4が整ってから、設備保全向けの見方も追加します。</p></div><a href="../categories/career.html">キャリアカテゴリへ</a></div>
        </section>

        <section class="article-card" id="summary">
          <h2>まとめ</h2>
          <p>設備保全は、設備が止まってから直すだけではなく、<strong>点検・予防保全・故障対応・改善</strong>を通して安定稼働を支える仕事です。</p>
          <p>電気、機械、空圧、PLCを横断して見る場面が多いため、最初から全部を深く覚えるより、担当設備の故障を一つずつ切り分けながら知識を広げる方が実務的です。</p>
          <div class="cta"><div><h3>次は必要スキルをつなげて学ぶ</h3><p>制御・回路・PLC入出力など、設備保全でよく使う基礎へ進めます。</p></div><a href="../categories/career.html">キャリアカテゴリへ戻る</a></div>
        </section>
      </div>

      '''
s=s[:main_start]+main+s[aside_start:]

aside_start=s.index('<aside class="side">')
aside_end=s.index('</aside>', aside_start)+len('</aside>')
aside='''<aside class="side">
        <section class="side-card">
          <h3>この記事のポイント</h3>
          <ul class="side-list">
            <li>設備保全の役割と仕事内容</li>
            <li>日常点検・予防保全・故障対応の違い</li>
            <li>電気・機械・PLCで必要な基礎</li>
            <li>未経験からの学び方とキャリア</li>
          </ul>
        </section>
        <section class="side-card support-card">
          <h3 class="support-card-title">このサイトを応援する</h3>
          <p class="support-card-text">記事づくりとサイト運営の励みになります。無理のない範囲で応援いただけるとうれしいです。</p>
          <div class="support-card-actions">
            <a class="support-link support-link--coffee" href="https://buymeacoffee.com/denkicontrol" target="_blank" rel="noopener noreferrer">Buy Me a Coffeeで応援</a>
            <a class="support-link support-link--paypal" href="https://www.paypal.com/paypalme/denkicontrol" target="_blank" rel="noopener noreferrer">PayPalで応援</a>
          </div>
        </section>
      </aside>'''
s=s[:aside_start]+aside+s[aside_end:]
s=s.replace('PLC・制御設計エンジニアとは？', '設備保全とは？')

required=['class="article-hero"','class="top-summary"','class="layout"','class="main"','class="side"','class="talk-thread"','support-card','site-footer','@media (min-width:744px) and (max-width:1100px)']
missing=[x for x in required if x not in s]
if missing:
    raise SystemExit('missing template invariants: '+repr(missing))
if 'https://buymeacoffee.com/denkicontrol' not in s or 'https://www.paypal.com/paypalme/denkicontrol' not in s:
    raise SystemExit('support link invariant failed')
dst.write_text(s,encoding='utf-8')
print('built',dst,'bytes',len(s.encode('utf-8')))
