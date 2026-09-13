from pathlib import Path
import re
p=Path('articles/production-engineering-career.html')
s=p.read_text(encoding='utf-8')

def rep(sid, block):
    global s
    pat=rf'<section class="article-card" id="{sid}">.*?</section>'
    s,n=re.subn(pat,block,s,count=1,flags=re.S)
    if n!=1: raise RuntimeError(sid)

hero='''<section class="article-hero" id="top">
      <div class="article-hero-copy">
        <span class="hero-label">キャリア・転職｜仕事を知る</span>
        <h1>生産技術とは？<br>仕事内容・必要スキル・キャリアを解説</h1>
        <p class="hero-lead">生産技術は<span class="marker-blue">「設備を入れる仕事」だけではありません。</span> 工程設計、設備・治具の検討、量産立上げ、品質や生産性の改善まで含めて、<strong>製品を安定して作れる仕組みをつくる仕事</strong>です。</p>
        <div class="hero-actions"><a class="btn btn-primary" href="#overview">仕事の全体像を見る</a><a class="btn btn-secondary" href="#skills">必要スキルを見る</a></div>
      </div>
    </section>'''
s,n=re.subn(r'<section class="article-hero" id="top">.*?</section>',hero,s,count=1,flags=re.S)
if n!=1: raise RuntimeError('hero')

overview='''<section class="article-card" id="overview"><h2>生産技術は「安定して作れる仕組み」をつくる仕事</h2><p>製品設計が完成しても、そのままでは量産できません。作業順序、設備、治具、検査方法、タクト、安全条件などを整理し、<strong>現場で繰り返し作れる工程へ落とし込む</strong>のが生産技術の中心です。</p><p>会社によって担当範囲は異なります。工程改善を中心に担当する会社もあれば、<span class="marker-blue">設備仕様、治具、自動化、PLC・ロボット、試運転、量産立上げまで</span>一人で広く担当する会社もあります。</p><figure class="article-figure"><img src="../assets/images/production-engineering-career/production-engineering-career-overview.webp" alt="工程設計、設備・治具導入、量産立上げ、改善までの生産技術の仕事の全体像" width="1200" height="900" loading="lazy"><figcaption>製品設計と製造現場の間に入り、工程・設備・品質・生産性をつないで量産できる仕組みにします。</figcaption></figure><div class="highlight">求人を見るときは「生産技術」という職種名だけで判断せず、<strong>工程改善・設備導入・自動化のどこまで担当する仕事なのか</strong>を見ることが重要です。</div><div class="talk-thread" aria-label="会話でポイント整理"><div class="talk-row talk-row--right"><div class="talk-avatar"><img src="../assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png" alt="後輩の案内役"></div><div class="talk-bubble"><span class="talk-name">後輩</span><p>生産技術って、設備を買って入れる担当というイメージでした。</p></div></div><div class="talk-row"><div class="talk-avatar"><img src="../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png" alt="先輩の案内役"></div><div class="talk-bubble"><span class="talk-name">先輩</span><p>設備導入も大事だけど、それだけじゃないよ。どう作るかを考えて、量産できるところまで立ち上げ、その後も改善していく仕事なんだ。</p></div></div></div></section>'''
rep('overview',overview)

work='''<section class="article-card" id="work"><h2>主な仕事内容</h2><div class="flow"><div class="flow-item"><div class="flow-no">1</div><div><h3>製品・工程条件を確認する</h3><p>何を、どの品質で、どれだけの数量・タクトで作るのか、<strong>安全や検査条件も含めて必要条件</strong>を整理します。</p></div></div><div class="flow-item"><div class="flow-no">2</div><div><h3>工程を設計する</h3><p>作業順序、人と設備の分担、検査位置、物流動線などを決め、<span class="marker-blue">安定して繰り返せる工程</span>を考えます。</p></div></div><div class="flow-item"><div class="flow-no">3</div><div><h3>設備・治具を導入する</h3><p>設備仕様、治具、センサ、PLC、ロボットなどを検討し、メーカーや社内関係者と仕様を詰めます。</p></div></div><div class="flow-item"><div class="flow-no">4</div><div><h3>試運転・量産立上げをする</h3><p>実機で能力・品質・安全・操作性を確認し、問題を一つずつ潰して<strong>量産条件を作り込みます。</strong></p></div></div><div class="flow-item"><div class="flow-no">5</div><div><h3>立上げ後の改善をする</h3><p>停止時間、不良、作業時間、設備能力などを見ながら、ボトルネックやムダを減らしていきます。</p></div></div></div></section>'''
rep('work',work)

skills='''<section class="article-card" id="skills"><h2>必要なスキルは6つに分けて考えると分かりやすい</h2><p>生産技術では、<span class="marker-blue">一つの専門だけで工程全体を改善するのは難しい</span>ことがあります。工程、設備、電気・制御、データ、調整、改善の視点を少しずつつなげることが重要です。</p><figure class="article-figure"><img src="../assets/images/production-engineering-career/production-engineering-career-skills.webp" alt="工程理解、電気制御、機械設備、問題解決、調整、改善という生産技術に必要な6つのスキル" width="1200" height="900" loading="lazy"><figcaption>生産技術では、技術知識だけでなく、現場の課題を整理して改善まで進める力が必要です。</figcaption></figure><div class="skill-grid"><div class="skill"><h3>1. 生産工程の理解</h3><p>加工・組立・検査・物流など。<strong>製品がどう作られるかを見る土台</strong>です。</p></div><div class="skill"><h3>2. 電気・制御の基礎</h3><p>PLC、センサ、モータ、インバータ、安全回路など。自動化設備を理解するために役立ちます。</p></div><div class="skill"><h3>3. 機械・設備の基礎</h3><p>機構、治具、アクチュエータ、位置決めなど。設備仕様や改善案を考えるときに必要です。</p></div><div class="skill"><h3>4. データ・問題解決</h3><p>タクト、不良率、停止時間などから、<strong>原因と優先順位を整理する力</strong>です。</p></div><div class="skill"><h3>5. 調整・プロジェクト力</h3><p>製造、設計、品質、保全、メーカーなどと条件・日程を合わせて立上げを進めます。</p></div><div class="skill"><h3>6. 改善・コストの視点</h3><p>品質・生産性・安全に加えて、設備費、工数、保守性まで含めて考えます。</p></div></div><h3>当サイトで先に押さえたい記事</h3><div class="internal-grid"><a class="internal-link" href="plc-basic.html"><strong>PLCとは？</strong><span>自動化設備の制御の中心をつかむ</span></a><a class="internal-link" href="plc-io-unit-basic.html"><strong>PLC入出力ユニットの基礎</strong><span>設備とPLCの信号のつながり</span></a><a class="internal-link" href="inverter-basic.html"><strong>インバータの基礎</strong><span>モータ速度制御を理解する</span></a><a class="internal-link" href="safety-control-basic.html"><strong>安全制御の全体像</strong><span>設備導入で欠かせない安全を理解する</span></a></div></section>'''
rep('skills',skills)

beginner='''<section class="article-card" id="beginner"><h2>未経験から目指すなら、いきなり全部を覚えなくていい</h2><p>未経験から生産技術を目指す場合は、最初から設備設計・PLC・機械・品質管理を全部できる必要はありません。まずは<span class="marker-blue">「製品 → 工程 → 設備 → 品質・タクト」</span>というつながりを追えることが重要です。</p><ol><li>担当する<strong>製品と工程</strong>を理解する</li><li>設備や治具が<strong>何のためにあるか</strong>を理解する</li><li>タクト、不良、停止などの数字を見る</li><li>小さな改善を実施して結果を確認する</li><li>改善経験を設備導入や工程設計へ広げる</li></ol><p>この順番で経験を積むと、単なる設備知識ではなく<strong>工程全体を良くする視点</strong>として理解しやすくなります。</p></section>'''
rep('beginner',beginner)

career='''<section class="article-card" id="career"><h2>経験者は「担当範囲」を広げるほどキャリアの選択肢が増えやすい</h2><p>同じ生産技術経験でも、<span class="marker-blue">担当できる範囲によって仕事の幅は変わります。</span> 工程改善だけでなく、設備仕様、自動化、PLC・ロボット、量産立上げ、投資計画まで経験すると、設備設計、制御設計、工場技術、プロジェクト管理など複数の方向へつながりやすくなります。</p><figure class="article-figure"><img src="../assets/images/production-engineering-career/production-engineering-career-career.webp" alt="現場改善から設備導入、生産技術、プロジェクトリーダー、専門職や管理職へ広がるキャリア例" width="1200" height="900" loading="lazy"><figcaption>キャリアの広がり方の一例。担当工程や会社の役割分担によって進み方は変わります。</figcaption></figure><div class="figure-note">この図は<strong>代表的なキャリアパスの一例</strong>です。必ずこの順番で進むわけではなく、設備自動化を深める人、工程設計を専門にする人、マネジメントへ進む人など、<strong>会社や現場によって広がり方は異なります。</strong></div><p>反対に、特定工程の改善だけに経験が偏っている場合は、次の職場で求められる設備導入や立上げ経験とのギャップが出ることがあります。転職前には<span class="marker-blue">「できること」と「まだ経験していないこと」</span>を分けて整理しておくと判断しやすくなります。</p><div class="caution">年収は会社規模、地域、経験年数、担当範囲、設備投資規模、出張・立上げ対応の有無などで大きく変わります。数字だけで比較せず、<strong>仕事内容・働き方・責任範囲</strong>を合わせて確認してください。</div></section>'''
rep('career',career)

job='''<section class="article-card" id="job-check"><h2>転職求人を見るときに確認したいポイント</h2><ul><li><strong>担当工程：</strong>加工、組立、検査、物流など何を担当するか</li><li><strong>業務の中心：</strong>工程改善、設備導入、新規ライン立上げのどれが中心か</li><li><strong>技術範囲：</strong>PLC、ロボット、CAD、治具設計などどこまで自分で担当するか</li><li><strong>出張・休日対応：</strong>設備立上げや工事対応の頻度</li><li><strong>役割分担：</strong>製造、保全、品質、設計、設備メーカーとの境界</li><li><strong>キャリア：</strong>設備自動化、工程設計、プロジェクト管理など次の道があるか</li></ul><p>「生産技術募集」とだけ書かれていても、<span class="marker-blue">実際の仕事はかなり違います。</span> 求人票で分からない部分は、面接や転職サービスの担当者を通して<strong>具体的な担当範囲まで確認</strong>するのがおすすめです。</p><div class="cta"><div><h3>転職サービス比較は準備中です</h3><p>比較記事は現在準備中です。仕事・必要スキル・キャリアはカテゴリトップから確認できます。</p></div><a href="../categories/career.html">キャリア・転職トップへ →</a></div></section>'''
rep('job-check',job)

service='''<section class="article-card" id="service"><h2>転職サービスは「今すぐ転職する人」だけのものではない</h2><p>現在の経験でどんな求人があるかを見るだけでも、<span class="marker-blue">自分に足りないスキルや、評価されやすい経験</span>が見えてきます。ただし、求人を見ることと転職を決めることは別です。</p><p>このサイトでは、電気・FA・製造業との相性や働き方の違いを分けて転職サービスを比較します。<strong>広告・アフィリエイトリンクは各サービスとの提携承認後に掲載</strong>します。</p><div class="cta"><div><h3>転職サービス比較は準備中です</h3><p>比較記事は現在準備中です。公開まではキャリア・転職トップから関連記事を確認できます。</p></div><a href="../categories/career.html">キャリア・転職トップへ →</a></div><div class="cta cta-muted"><div><h3>まだ転職先探しの前段階なら</h3><p>仕事 → 必要スキル → キャリアの順で整理できます。</p></div><a href="../categories/career.html">キャリア・転職トップへ →</a></div></section>'''
rep('service',service)

summary='''<section class="article-card" id="summary"><h2>まとめ</h2><p>生産技術は、<span class="marker-blue">工程設計・設備導入・量産立上げ・改善をつないで、製品を安定して作れる仕組みにする仕事</span>です。</p><p>これから目指す人は担当工程と設備の理解から順番に、経験者は<strong>担当できる範囲を広げる視点</strong>で経験を積むと、仕事の幅とキャリアの選択肢を増やしやすくなります。</p></section>'''
rep('summary',summary)

p.write_text(s,encoding='utf-8')
print('aligned body structure to PLC career article')
