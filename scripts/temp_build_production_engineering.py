from pathlib import Path
import re

src = Path('articles/equipment-maintenance-career.html').read_text(encoding='utf-8')
s = src

s = s.replace('equipment-maintenance-career', 'production-engineering-career')
s = s.replace('設備保全とは？仕事内容・必要スキル・キャリアを現場目線で解説 | 電気と制御の実務メモ', '生産技術とは？仕事内容・必要スキル・キャリアを現場目線で解説 | 電気と制御の実務メモ')
s = s.replace('設備保全の仕事内容、日常点検・予防保全・故障対応、必要な電気・機械・PLCの基礎、向いている人、キャリアの広げ方を現場目線で整理します。', '生産技術の仕事内容、工程設計・設備導入・立上げ・改善、必要な電気・機械・制御の基礎、未経験からの学び方、キャリアの広げ方を現場目線で整理します。')
s = s.replace('設備保全とは？仕事内容・必要スキル・キャリアを現場目線で解説', '生産技術とは？仕事内容・必要スキル・キャリアを現場目線で解説')
s = s.replace('設備保全の仕事を、仕事内容・必要スキル・故障対応・キャリアの順に整理します。', '生産技術の仕事を、仕事内容・必要スキル・設備導入・改善・キャリアの順に整理します。')
s = s.replace('設備保全とは？仕事内容・必要スキル・キャリア', '生産技術とは？仕事内容・必要スキル・キャリア')
s = s.replace('<nav class="breadcrumb" aria-label="パンくずリスト"><a href="../">トップ</a><span>›</span><a href="../categories/career.html">キャリア・転職</a><span>›</span><span>設備保全とは？</span></nav>', '<nav class="breadcrumb" aria-label="パンくずリスト"><a href="../">トップ</a><span>›</span><a href="../categories/career.html">キャリア・転職</a><span>›</span><span>生産技術とは？</span></nav>')

hero = '''<section class="article-hero" aria-labelledby="page-title">
      <div class="article-hero-copy">
        <span class="hero-label">キャリア・転職</span>
        <h1 id="page-title">生産技術とは？<br>仕事内容・必要スキル・キャリアを解説</h1>
        <p class="hero-lead">製品を安定して、効率よく、狙った品質で作るために、工程設計・設備導入・立上げ・改善までを担う生産技術の仕事を、現場目線で整理します。</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#work">仕事内容を見る</a>
          <a class="btn btn-secondary" href="#skills">必要スキルを見る</a>
        </div>
      </div>
    </section>'''
s, n = re.subn(r'<section class="article-hero" aria-labelledby="page-title">.*?</section>', hero, s, count=1, flags=re.S)
assert n == 1

summary = '''<section class="top-summary" aria-label="記事の導入まとめ">
      <section class="summary-card">
        <strong>仕事の中心</strong>
        <span>生産工程を設計し、設備や治具を導入して立ち上げ、品質・生産性・安全を継続的に改善する仕事です。</span>
      </section>
      <section class="summary-card">
        <strong>必要な力</strong>
        <span>現場理解、電気・機械・制御の基礎、データ分析、問題解決、関係部署との調整力が重要です。</span>
      </section>
      <section class="summary-card">
        <strong>キャリア</strong>
        <span>工程改善から設備導入・自動化・設備設計・プロジェクトリーダー・管理職などへ役割を広げられます。</span>
      </section>
    </section>'''
s, n = re.subn(r'<section class="top-summary" aria-label="記事の導入まとめ">.*?</section>\s*</section>\s*</section>', summary, s, count=1, flags=re.S)
assert n == 1

blocks = {
'overview': '''<section class="article-card" id="overview">
          <h2>生産技術は「どう作れば安定して良い製品を作れるか」を仕組みにする仕事</h2>
          <p><strong>生産技術</strong>は、設計された製品を量産できる形に落とし込み、現場で安定して作れる工程・設備・作業方法を整える仕事です。単に設備を選ぶだけではなく、<span class="marker-blue">品質・生産性・コスト・安全をバランスよく成立させる</span>ことが重要です。</p>
          <p>現場によって担当範囲は異なりますが、工程設計、設備仕様、治具、自動化、PLCやロボット、試運転、データ分析、改善まで横断して関わることがあります。</p>
          <figure class="article-figure">
            <img src="../assets/images/production-engineering-career/production-engineering-career-overview.webp" alt="生産技術の仕事を工程設計・設備導入・立上げ・改善の流れで整理した図" loading="lazy" decoding="async">
            <figcaption>製品設計と製造現場の間に入り、量産できる工程へ落とし込むのが生産技術の大きな役割です。</figcaption>
          </figure>
          <div class="talk-thread">
            <div class="talk-row">
              <div class="talk-avatar"><img src="../assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png" alt="後輩の案内役"></div>
              <div class="talk-bubble"><span class="talk-name">後輩</span><p>生産技術って、設備を買う担当というイメージがありました。</p></div>
            </div>
            <div class="talk-row talk-row--right">
              <div class="talk-avatar"><img src="../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png" alt="先輩の案内役"></div>
              <div class="talk-bubble"><span class="talk-name">先輩</span><p>設備導入も大事だけど、実際は「どう作るか」を考えて、立上げ後も改善し続けるところまで関わることが多いよ。</p></div>
            </div>
          </div>
        </section>''',
'work': '''<section class="article-card" id="work">
          <h2>生産技術の仕事は4つの流れで考えると分かりやすい</h2>
          <p>生産技術は、<strong>工程設計 → 設備・治具導入 → 立上げ → 改善</strong>という流れで見ると役割が分かりやすくなります。新製品の立上げだけでなく、既存ラインの生産性向上や不良低減も重要な仕事です。</p>
          <div class="flow">
            <div class="flow-item"><span class="flow-no">1</span><div><h3>工程設計・現状分析</h3><p>必要な作業、タクト、品質条件、安全条件、作業者の動きなどを整理し、どのような工程にするかを考えます。</p></div></div>
            <div class="flow-item"><span class="flow-no">2</span><div><h3>設備・治具の導入</h3><p>設備仕様を決め、メーカーとの打合せ、治具設計、自動化、センサ・PLC・ロボットなどの構成を検討します。</p></div></div>
            <div class="flow-item"><span class="flow-no">3</span><div><h3>試運転・量産立上げ</h3><p>設備を実際に動かし、能力・品質・安全・操作性を確認して、問題を潰しながら量産条件を作り込みます。</p></div></div>
            <div class="flow-item"><span class="flow-no">4</span><div><h3>生産性・品質の改善</h3><p>停止時間、不良、作業時間、設備能力などのデータを見ながら、ボトルネックやムダを減らし、より安定した工程へ改善します。</p></div></div>
          </div>
          <div class="highlight">新規設備の導入だけでなく、既存設備を活かして小さな改善を積み重ねることも、生産技術の重要な仕事です。</div>
        </section>''',
'skills': '''<section class="article-card" id="skills">
          <h2>必要スキルは「6つの柱」で整理すると学ぶ順番が見えやすい</h2>
          <p>生産技術は、設計・製造・保全・品質・設備メーカーなど多くの人と関わります。専門知識だけでなく、<span class="marker-blue">現場の課題を整理し、技術で改善へつなげる力</span>が重要です。</p>
          <div class="skill-grid">
            <div class="skill"><h3>1. 生産工程の理解</h3><p>加工・組立・検査・物流など、製品がどのような流れで作られるかを理解する力です。</p></div>
            <div class="skill"><h3>2. 電気・制御の基礎</h3><p>PLC、センサ、モータ、インバータ、I/O、安全回路など。自動化設備を理解する土台になります。</p></div>
            <div class="skill"><h3>3. 機械・設備の基礎</h3><p>機構、治具、アクチュエータ、位置決めなど。設備仕様や改善案を考えるときに役立ちます。</p></div>
            <div class="skill"><h3>4. データ・問題解決</h3><p>タクト、不良率、停止時間などを整理し、原因を切り分けて優先順位を付ける力です。</p></div>
            <div class="skill"><h3>5. 調整・プロジェクト力</h3><p>製造、設計、品質、保全、メーカーと条件を合わせ、納期や立上げを前へ進める力です。</p></div>
            <div class="skill"><h3>6. 改善・コストの視点</h3><p>品質・生産性・安全を高めながら、設備費や工数、保守性まで含めて判断する視点です。</p></div>
          </div>
          <figure class="article-figure">
            <img src="../assets/images/production-engineering-career/production-engineering-career-skills.webp" alt="生産技術に必要な工程理解・電気制御・機械設備・問題解決・調整・改善の6スキル" loading="lazy" decoding="async">
            <figcaption>生産技術は、技術知識と現場改善・調整力を組み合わせて工程を作り込む仕事です。</figcaption>
          </figure>
          <h3>当サイトで先に押さえたい記事</h3>
          <div class="internal-grid">
            <a class="internal-link" href="../categories/control-basics.html"><strong>制御の基礎</strong><span>PLC・センサ・リレーなど制御全体を整理する</span></a>
            <a class="internal-link" href="../categories/circuit-basics.html"><strong>回路の基礎</strong><span>設備の電源・配線・回路を理解する</span></a>
            <a class="internal-link" href="./plc-io-unit-basic.html"><strong>PLC入出力ユニット</strong><span>設備とPLCの信号のつながりを理解する</span></a>
            <a class="internal-link" href="./inverter-basic.html"><strong>インバータの基礎</strong><span>モータ速度制御と設備側の考え方を学ぶ</span></a>
          </div>
        </section>''',
'beginner': '''<section class="article-card" id="beginner">
          <h2>未経験から目指すなら、まず「現場と設備」を知るところから</h2>
          <p>生産技術は担当範囲が広いため、最初から設備設計・PLC・機械・品質管理を全部できる必要はありません。まずは<strong>自分の担当工程がどう動いているか</strong>を理解し、設備や作業の小さな改善から経験を積むと実務につながりやすくなります。</p>
          <p>製造現場、設備保全、制御設計などの経験から生産技術へ進むケースもあり、現場で得た知識を「工程全体の改善」に広げていくイメージです。</p>
          <div class="highlight">「設備を知っている」だけでなく、「なぜこの工程になっているか」「どこを変えると良くなるか」を考える習慣が大きな強みになります。</div>
        </section>''',
'career': '''<section class="article-card" id="career">
          <h2>経験を積むほど、生産技術から広がるキャリアは増えていく</h2>
          <p>最初は担当工程の改善や設備立上げから始まり、経験を積むと、複数設備をまとめる<strong>プロジェクトリーダー</strong>、自動化や設備仕様を深める<strong>専門職</strong>、投資・人員・生産戦略まで見る<strong>管理職</strong>へ役割を広げられます。</p>
          <p>さらに、設備設計、制御設計、製造技術、工場の技術管理、新工場・新ライン立上げなどへ進む道もあります。大切なのは肩書きより、<span class="marker-blue">工程全体を見て課題を見つけ、改善を実行できる範囲を広げること</span>です。</p>
          <figure class="article-figure">
            <img src="../assets/images/production-engineering-career/production-engineering-career-career.webp" alt="生産技術の担当者からプロジェクトリーダー・専門職・管理職や関連職種へ広がるキャリアマップ" loading="lazy" decoding="async">
            <figcaption>工程改善の経験を土台に、設備導入・自動化・設備設計・マネジメントなどへ選択肢を広げられます。</figcaption>
          </figure>
        </section>''',
'job-check': '''<section class="article-card" id="job-check">
          <h2>転職求人を見るときに確認したいポイント</h2>
          <ul>
            <li><strong>担当工程：</strong>加工、組立、検査、物流など、どの工程を担当するのか</li>
            <li><strong>業務の中心：</strong>新規ライン立上げ中心か、既存設備の改善中心か</li>
            <li><strong>技術範囲：</strong>PLC・ロボット・CAD・治具設計など、どこまで自分で担当するのか</li>
            <li><strong>出張・立上げ：</strong>設備メーカー立会い、休日工事、国内外出張があるか</li>
            <li><strong>役割分担：</strong>製造・保全・品質・設計との境界と、外注する範囲</li>
          </ul>
          <div class="caution">同じ「生産技術」という求人でも、工程改善中心・設備導入中心・設備設計中心など仕事内容は大きく異なります。職種名だけでなく担当範囲まで確認するのが重要です。</div>
        </section>''',
'service': '''<section class="article-card" id="service">
          <h2>転職サービスは「今すぐ転職する人」だけのものではない</h2>
          <p>自分の経験がどの業界・工程で評価されるのか、求人でどんなスキルが求められているのかを見るだけでも、今後伸ばす技術を考える材料になります。</p>
          <div class="cta cta-muted"><div><h3>転職サービス比較は準備中です</h3><p>キャリアカテゴリ側のSTEP4が整ってから、生産技術向けの見方も追加します。</p></div><a href="../categories/career.html">キャリアカテゴリへ</a></div>
        </section>''',
'summary': '''<section class="article-card" id="summary">
          <h2>まとめ</h2>
          <p>生産技術は、製品を安定して量産するために、<strong>工程設計・設備導入・立上げ・改善</strong>をつなぐ仕事です。</p>
          <p>電気・制御・機械の知識に加えて、現場の課題を整理し、関係部署と調整しながら改善を実行する力が重要です。まずは担当工程と設備を理解し、小さな改善経験を積み上げるところから始めると実務につながります。</p>
          <div class="cta"><div><h3>次は必要スキルをつなげて学ぶ</h3><p>制御・回路・PLC入出力など、生産技術でよく使う基礎へ進めます。</p></div><a href="../categories/career.html">キャリアカテゴリへ戻る</a></div>
        </section>'''
}

ids = ['overview', 'work', 'skills', 'beginner', 'career', 'job-check', 'service', 'summary']
for i, idv in enumerate(ids):
    nxt = ids[i + 1] if i + 1 < len(ids) else None
    if nxt:
        pat = rf'<section class="article-card" id="{idv}">.*?(?=<section class="article-card" id="{nxt}">)'
    else:
        pat = rf'<section class="article-card" id="{idv}">.*?</section>\s*(?=</article>)'
    s, n = re.subn(pat, blocks[idv] + '\n\n        ', s, count=1, flags=re.S)
    assert n == 1, (idv, n)

s = s.replace('<li>設備保全の役割と仕事内容</li>', '<li>生産技術の役割と仕事内容</li>')
s = s.replace('<li>日常点検・予防保全・故障対応の違い</li>', '<li>工程設計・設備導入・立上げ・改善の流れ</li>')
s = s.replace('<li>電気・機械・PLCで必要な基礎</li>', '<li>工程・電気・機械・制御で必要な基礎</li>')

Path('articles/production-engineering-career.html').write_text(s, encoding='utf-8')
