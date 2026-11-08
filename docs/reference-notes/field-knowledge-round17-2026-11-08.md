# 現場知識調査 第17回 — 世界の故障事例・暗黙知・旧Bの再検証

調査・記録日：2026-11-08。基点main：`ee01ad0f8adc0d855198cc5441beb9eba3738320`（開始時に取得）。資料のみの追加。Aは掲載承認でも故障事例の第三者実証でもない。海外の操作・設定値は国内の一般手順にしない。

## 集計と読み方

調査は36発信主体・53URL（メーカー照合用13URLを別集計）。主調査33URLは本文全体27、一部3、取得不可3。予備候補20URLは検索抜粋のみ。したがって本文を少なくとも一部確認したのは30URL、全体27・一部3・抜粋20・取得不可3。Web抄録だけの論文、公開要約だけの詳細事例集は一部とした。図面・写真・画像のスペクトルは判読・転載していない。全文確認は主記事の文章範囲を指し、関連記事の全リンクや画像内容の検証を含まない。

本文を複数比較した発信主体は9（うち3記事以上7）。同著者の複数記事を独立証言と数えない。40〜70主体、本文全体30〜50記事、3記事以上8〜12主体には未達。未解決例や宣伝を水増しせず、旧Bの証拠を具体化するところで区切る。

新規独立知識候補3（A2/B1/C0、JP-A2/JP-B1/JP-C0）。既存知識補足9（A2/B7、JP-A2/JP-B7）。見送り8（C8、JP-C8）。合計20判定記録はA4/B8/C8、JP-A4/JP-B8/JP-C8。旧B再検証9件は別の履歴表：追加本文・一次資料との比較8件と、公式本文取得に至らない再検証試行1件。旧判定は9件とも維持。補足ID・旧B追補・複数出典を新規知識に再計上しない。

地域は発信・設備・言語を分ける。所在地を本文で確認できた発信はチリ、ブラジル、インド/オマーン、インドネシア、ベトナム、タイ、米国。設備の所在地まで記載があった例はチリ、インド、ベトナム、イタリア、米国。ポーランド語・繁体字媒体の投稿者所在地は不明。韓国・メキシコ・アルゼンチン・チェコ等は十分な新規実務本文に至らず、国別傾向を比較する段階ではない。調査言語は西・葡・尼・越・繁体中・英・泰・波、探索のみ簡体中・捷、国内照合は日本語。

## 原典の確認台帳

全件の著者報告は独立追試なし。原典に書かれない初期仮説・測定値・再発追跡期間は「記載なし」と扱い、補完しない。全URLの確認日は上記調査日。所在地確認の補助にServige/Pacifcoの連絡先、RASEのhome、Smart Servoのaboutを確認したが記事数には含めない。

| ID・発信主体・原典 | 発信/設備所在地・言語・掲載日 | 確認状態・情報の種類・読んだ範囲 | 観測・判断・結果・未確認事項 |
|---|---|---|---|
| <a id="r17-01"></a>R17-01・Servige [Monitoreo de condiciones en línea en planta de tissue \| Servige](https://servige.cl/recursos/monitoreo-de-condiciones-en-linea-en-planta-de-tissue) | 発信：チリ（Santiago連絡先）。現場：チリ首都圏／西／2026-09-21 | **全体**・保全企業事例。主記事123–232行、画像未判読 | 可変速tissue駆動。芯ずれ仮説から速度帯依存の2Xを観測し共振を推定。速度変更後の低下を報告、構造補強・再測定は予定、打撃試験未実施。統計量のみで軸受健全・芯ずれ不存在を断定しない。 |
| <a id="r17-02"></a>R17-02・Servige [Monitoreo de condiciones remoto en planta cementera \| Servige](https://servige.cl/recursos/monitoreo-de-condiciones-remoto-en-planta-cementera) | 発信：チリ。顧客の事業国は複数、当該設備国不明／西／2026-02-02 | **全体**・保全企業事例。主記事123–190行 | 誘引送風機の回転未満成分を失速と解釈。付着物と継手損傷を観察、清掃後の成分低下を報告。流量条件・継手整備の寄与・独立追試は不明。回転未満なら軸受原因を全否定する説明は採らない。 |
| <a id="r17-03"></a>R17-03・Servige [Alineación de ejes cardánicos en planta de celulosa \| Servige](https://servige.cl/recursos/alineacion-de-ejes-cardanicos-en-planta-de-celulosa) | 発信：チリ。設備国不明／西／2025-12-10 | **全体**・保全企業事例。主記事123–194行 | 減速機とロールの長いCardan軸で回転させにくく、多点測定機能を選択。許容角と振動低下の数値は未確認。減速比の大小の表現にも疑義があり、型式別許容値へ移植しない。 |
| <a id="r17-04"></a>R17-04・Pacifco [Defeito de rolamento na análise de vibração: o NSE](https://pacifco.com/energia-nao-sincrona-defeito-de-rolamento/) | 発信：ブラジル（Jaguariúna連絡先）。設備国不明／葡／2026-10-22 | **全体**・診断機器企業事例。主記事17–158行 | バケットエレベータのモータ。軸受とカバーを同時交換後もNSEが高いが、支配ピークは別の低周波成分へ変化。故障ピークの消失と総合指標の変化を区別。日付の間隔と「数週間」の表現は一致しない。 |
| <a id="r17-05"></a>R17-05・Pacifco [Falha de lubrificação na análise de vibração: o carpete](https://pacifco.com/carpete-falha-de-lubrificacao/) | 発信：ブラジル。設備国不明／葡／2026-10-14 | **全体**・診断機器企業事例。主記事17–165行 | ハンマーミルのモータ。スペクトル床の上昇、給脂後の低下を報告。ただし別時点のピークは給脂前に低下したと著者自身が記載。欠測期間があり、給脂と全変化の因果は未確定。 |
| <a id="r17-06"></a>R17-06・Pacifco [Como escolher coletor de vibração: checklist de 7 perguntas](https://pacifco.com/checklist-perguntas-antes-de-contratar-coletor-vibracao/) | 発信：ブラジル。個別現場なし／葡／2026-08-17 | **全体**・製品選定一般解説。主記事17–75行 | 低速回転でのノイズ床、帯域、データ取り出しを選定論点に挙げる。製品のAI精度・価格優位は独立検証されていない。センサ方式名だけで適合を決めない。 |
| <a id="r17-07"></a>R17-07・Juare97 [Channel rusak di Module 1746-NI8 \| Juare97's Blog ~ berbagi pengalaman & pengetahuan](https://juare97.wordpress.com/2012/09/02/channel-rusak-di-module-1746-ni8/) | 発信：インドネシア業務ブログ。個別現場国不明／尼／2012-09-02 | **全体**・同僚からの伝聞＋公開コメント。主記事89–105行、コメント119–143行 | 1746-NI8の点滅。雷損傷説は同僚の説明、コメントには断線説。別チャネルで動いたという報告だけでは雷・内部破損を確定できない。故障原因は未解決。 |
| <a id="r17-08"></a>R17-08・Juare97 [troubleshooting mencari input field device SLC – Panel View \| Juare97's Blog ~ berbagi pengalaman & pengetahuan](https://juare97.wordpress.com/2012/12/28/troubleshooting-mencari-input-field-device-slc-panel-view/) | 発信：インドネシア業務ブログ。例示設備国不明／尼／2012-12-28 | **全体**・教育用の追跡説明。主記事89–135行、コメント149–158行 | PanelViewの警報タグからラダーの保持条件、入力、図面、リレーへ追う説明。独立した復旧事例ではない。Anak Relayの指す部位は翻訳未確定。 |
| <a id="r17-09"></a>R17-09・Juare97 [tidak dikenalnya 1769sc-if8u membuat masalah upload RSLogix5000 dengan Compact Logix 1769-L32E \| Juare97's Blog ~ berbagi pengalaman & pengetahuan](https://juare97.wordpress.com/2010/04/06/tidak-dikenalnya-1769sc-if8u-membuat-masalah-upload-rslogix5000-dengan-compact-logix-1769-l32e/) | 発信：インドネシア業務ブログ。設備国不明／尼／2010-04-06 | **全体**・個人の作業経験。主記事89–107行、コメント121–185行 | RSLogix15でアップロード失敗。別PCでも再発し、第三者1769sc-IF8U用profileとEDS導入後に成功と報告。変更が複数で寄与は分離されていない。同著者の旧R16記事とは独立証言でない。 |
| <a id="r17-10"></a>R17-10・NIHACO [Sửa servo Delta lỗi encoder tại Bắc Ninh \| NIHACO](https://nihaco.com.vn/sua-servo-delta-loi-encoder) | 発信：ベトナム。現場：Bắc Ninhと記載／越／2026-08-12 | **全体**・修理企業の宣伝付き事例。主記事301–456行 | Delta ASD-A2-3043-Mのencoder警報。修理成功をうたうが原因欄は複数候補の列挙で、当該原因・測定結果が特定されない。確定した故障診断例として採用しない。 |
| <a id="r17-11"></a>R17-11・Smart Servo Home / Archer [台達 A2 伺服 原點回歸 常見問題 – Smart Servo Home](https://smartservo.org/a2-homing-q-and-a/) | 発信者所在地・設備国とも未確認。繁体字から台湾と決めない／繁体中／2016-10-31／2019-02-20 | **全体**・個人技術解説。主記事37–84行 | A2原点復帰で機械基準、座標ゼロ、減速後の停止位置を分けるFAQ。実故障の解決例ではない。DOG/Zの説明は当該方式・機種の範囲。 |
| <a id="r17-12"></a>R17-12・Smart Servo Home / Archer [台達 A2 電子凸輪 常見問題 – Smart Servo Home](https://smartservo.org/a2-ecam-q-and-a/) | 所在地不明、個別現場なし／繁体中／2016-10-30／2018-08-19 | **全体**・個人技術解説。主記事14–40行、型式補足コメント58行 | 電子カムの入力系統と電源断で保持しないパラメータを説明。コメントには対応型式の限定。型番末尾・機能・版を未確認のまま全A2へ広げない。 |
| <a id="r17-13"></a>R17-13・Smart Servo Home / Archer [如何用 DI 觸發 台達A2伺服 走定長 – Smart Servo Home](https://smartservo.org/ev-trig-a2-pinc/) | 所在地不明、個別現場なし／繁体中／2016-11-04／2019-02-18 | **全体**・個人技術解説。主記事9–61行 | DIのON/OFFイベントに割り当てる動作を解説。レベルとイベントの区別の補助例であり、新しい故障事例ではない。操作パラメータの手順は転載しない。 |
| <a id="r17-14"></a>R17-14・RASE Tech Services [RASE Tech - 1. Axial Vibration Mystery on Micro Pulverizer Motor – Case Study](https://www.rasetechservices.com/learning-hub/1-axial-vibration-mystery-on-micro-pulverizer-motor-case-study) | 発信：India/Omanと公式home記載。現場国不明／英／不明 | **全体**・診断企業事例。主記事12–25行、画像未判読 | 粉砕機モータの軸方向1X。ソロ試験で増え、カップリング側のバランス修正後に低下と報告。切離しで境界条件も変わるため、負荷側や構造要因を完全排除した証拠ではない。 |
| <a id="r17-15"></a>R17-15・RASE Tech Services [RASE Tech - 2. Hydro Generator Field Balancing (Pelton Turbine Driven) Case Study](https://www.rasetechservices.com/learning-hub/2-hydro-generator-field-balancing-pelton-turbine-driven-case-study) | 発信：India/Oman。現場国不明／英／不明 | **全体**・診断企業事例。主記事12–25行、画像未判読 | Pelton駆動発電機。緩み等の確認、位相を含む評価、修正後の振動低下を報告。剛体とした根拠や残留不釣合い・全運転域の評価はない。修正重りや角度は一般手順にしない。 |
| <a id="r17-16"></a>R17-16・Lubi Pumps [Troubleshooting Three Phase Induction Motor Shaft issues \| Lubi Pumps](https://www.lubipumps.com/media/case-study-troubleshooting-induction-motor-shaft-issues/) | 発信：インド。現場：Gujarat／英／不明 | **全体**・メーカー修理事例。主記事48–134行 | モータ軸を交換しベンチ試験後、現場で翌日再破損。据付面、プーリ摩耗、速度を調査し複数対策後正常と報告。破面・応力・各対策の寄与は未確認。 |
| <a id="r17-17"></a>R17-17・Lubi Pumps [Case Study of Reducing High Ampere Consumption in Openwell Submersible Pump](https://www.lubipumps.com/media/a-case-study-of-open-well-submersible-pump/) | 発信・現場：インド（Coimbatore）／英／不明 | **全体**・メーカー修理事例。主記事48–195行 | 過大電流でも電圧と吐出は正常との報告。低揚程の運転点に着目しメーカー工場で羽根車変更後改善。電流と電力の表現が混在、加工寸法も不明瞭。数値・改造は採らず、運転点確認は旧知識補足。 |
| <a id="r17-18"></a>R17-18・Lubi Pumps [Case Study of Stopping Humming Sound in Industrial RO Pumps](https://www.lubipumps.com/media/a-case-study-of-stopping-humming-sound-in-industrial-ro-pumps/) | 発信・現場：インド（Indore）／英／不明 | **全体**・メーカー修理事例。主記事47–106行 | RO装置のhummingをポンプ異常と疑ったが、ポンプ周辺の音・吸込漏れ・異物を確認後、膜の閉塞へ調査を広げた。膜交換後静穏化。騒音スペクトル・圧力推移は非掲載。 |
| <a id="r17-19"></a>R17-19・InstrumentationTools / S. Raghava Chari [CO2 Stripper Old Differential Pressure Transmitter Stopped Working](https://instrumentationtools.com/co2-stripper-old-differential-pressure-transmitter-stopped-working/) | 著者所在地・当該設備国未確認／英／更新2022-09-28、数十年前の経験との注記 | **全体**・署名付き経験談。主記事100–158行 | 空気式差圧伝送器が短時間後に動かなくなる。低圧側導圧管の凝縮水とレンジの関係を著者が説明。独自改造で復旧との主張は未追試。圧力境界部品の自作策は不採用。 |
| <a id="r17-20"></a>R17-20・InstrumentationTools / S. Raghava Chari [Pitot-tube Replaced with Innovative Segment Orifice Plate](https://instrumentationtools.com/pitot-tube-replaced-with-innovative-segment-orifice-plate/) | 著者所在地・当該設備国未確認／英／更新2022-09-28、歴史的経験 | **全体**・署名付き経験談。主記事109–201行 | ピトー管の閉塞・曲がりと流量計測不能を報告。別方式への変更後、ポンプ流量と熱交換器の汚れを分けて考察。独自絞り板の校正・耐圧評価はないため施工案は不採用。 |
| <a id="r17-21"></a>R17-21・InstrumentationTools / S. Raghava Chari [Control Valves - Repeat Actuator Diaphragm Bursts](https://instrumentationtools.com/actuator-diaphragm-bursts/) | 著者所在地・設備国未確認／英／更新2022-09-28、本文1973–1987年 | **全体**・署名付き経験談。主記事100–178行 | アクチュエータ膜を代替材で自作し、最初は漏れ、変更後長期使用と主張。材料・圧力適合や安全認証がなく、一般向け復旧方法としてC。耐久年数を実証値としない。 |
| <a id="r17-22"></a>R17-22・ALL-TEST Pro [VFD Troubleshooting Case Study: Motor Test Reveals Damaged VFD](https://alltestpro.com/vfd-troubleshooting-case-study-motor-test/) | 発信：米国。技術者・設備：イタリアと本文記載／英／投稿日不明、事例2017-01 | **全体**・メーカーが技術者の経験を紹介。主記事87–105行 | VFD警報なしでも入出力電流の不平衡と半波欠落を観測。内部ダイオード損傷確認・交換後波形改善との報告。測定器設定と他の影響は不明。故障状態で運転継続した判断は推奨しない。 |
| <a id="r17-23"></a>R17-23・ALL-TEST Pro [Predictive Maintenance in Manufacturing Case Study](https://alltestpro.com/predictive-maintenance-in-manufacturing-case-study/) | 発信・現場：米国（Midwest）／英／投稿日未確認、事例2018-07 | **全体**・メーカーの保全運用事例。主記事87–120行 | 内製と外注のモータ試験時間を比較。対象機器群・移動・案内工数が同一でないため、測定器の性能比較実験にはならない。新しい故障原因の証明に数えない。 |
| <a id="r17-24"></a>R17-24・Thai Printing Association / วิรัช เดชาสิริสิงห์ [การลดต้นทุนเชิงการจัดการ สำหรับอุตสาหกรรมการพิมพ์และแพคเกจจิ้ง ตอนที่ 7 - Thai Printing Association - สมาคมการพิมพ์ไทย](https://www.thaiprint.org/2023/03/vol140/knowledge140-04/) | 媒体：タイ（Bangkok連絡先）。著者・個別設備所在地未確認／泰／2023-03-13 | **全体**・署名付き保全一般解説。主記事38–88行 | 盤内温度、バックアップの契約、モータ・サーボ整備の分担を説明。PLC寿命、盤温度、遠隔対応費用の一般数値は採らない。故障時系列を持つ単一事例ではない。 |
| <a id="r17-25"></a>R17-25・Thai Printing Association / วิรัช เดชาสิริสิงห์ [การลดต้นทุนเชิงการจัดการ สำหรับอุตสาหกรรมการพิมพ์และแพคเกจจิ้ง ตอนที่ 5 - Thai Printing Association - สมาคมการพิมพ์ไทย](https://www.thaiprint.org/2022/10/vol138/knowledge138-01/) | 媒体：タイ。個別設備国なし／泰／2022-10-11 | **全体**・署名付き保全一般解説。主記事38–102行、挿図未判読 | 指押しと音波測定によるベルト張力を比較。一定たわみ量、全チェーンの寿命伸び率、運転中と読める測定表現は国内適用しない。型式と測定原理をV17-12で照合。 |
| <a id="r17-26"></a>R17-26・Thai Printing Association / วิรัช เดชาสิริสิงห์ [การลดต้นทุนเชิงการจัดการ สำหรับอุตสาหกรรมการพิมพ์และแพคเกจจิ้ง ตอนที่ 8 - Thai Printing Association - สมาคมการพิมพ์ไทย](https://www.thaiprint.org/2023/05/vol141/knowledge141-02/) | 媒体：タイ。個別設備国なし／泰／2023-05-22 | **全体**・署名付き解説・参照資料あり。主記事38–88行、参照一覧92–111行 | 代替歯車の材料・加工・仕上げ条件を説明。過去に補修された現物が元の設計仕様とは限らない点は旧識別知識の補足。熱処理条件と無ひずみ断定は未検証、施工にしない。 |
| <a id="r17-27"></a>R17-27・Łączy nas napięcie [Problem z falownikiem](https://laczynasnapiecie.pl/pytanie/problem-z-falownikiem) | ポーランド語媒体。投稿者・設備所在地未確認／波／2025-12-16〜25 | **全体**・未解決フォーラム。質問と表示された回答3件（25–126行） | Siemens VFDの無表示。回答の別装置でのはんだ修理経験は質問者の結果でない。型式・電源測定・復旧報告なし。宣伝リンクもあり信頼性を留保。 |
| <a id="r17-28"></a>R17-28・SPM Instrument [Case study: Electric current passage in a gearbox bearing](https://www.spminstrument.com/solutions/case/case-study-electric-current-passage-in-a-gearbox-bearing/) | 発信拠点・設備国は今回未確認／英／2023-08-15 | **一部**・メーカー事例の公開概要。公開要約36–41行のみ、詳細報告書未取得 | タイヤ工場のギヤボックス軸受電食。継手・接地の組立影響とする要約。可変速や各測定方式の詳細比較が読めず、解決・独立裏付けとして使わない。 |
| <a id="r17-29"></a>R17-29・IJMPE / Rai・Mathur [IJMPE : Investigations Into the Causes of High Vibrations in Case of a Circulating Water Pump Motor](https://ijmpe.iraj.in/paperdetails/7009) | 著者・設備所在地未確認／英／2017-04-19 | **一部**・署名付き論文抄録。Web抄録のみ。4頁の論文本文未取得 | 循環水ポンプで軸受整備と現地バランス修正を報告。抄録だけで振動原因を確定しない。名前から国を決めない。 |
| <a id="r17-30"></a>R17-30・PLCtalk [[MITSUBISHI SERVO] Home Position keeps shifting after the machine is restarted. \| PLCtalk - Interactive Q & A](https://www.plctalk.net/forums/threads/mitsubishi-servo-home-position-keeps-shifting-after-the-machine-is-restarted.124957/) | 投稿者・設備国未確認／英／2020-05-21開始（抜粋） | **取得不可**・フォーラム候補。検索抜粋あり、本文取得403 | 再起動後の原点ずれ。回答候補を質問者の原因確定としない。既存監視BW-016に再登録しない。 |
| <a id="r17-31"></a>R17-31・Elektroda [Falownik Danfoss - problem (pytanie do serwisantów)](https://www.elektroda.pl/rtvforum/topic490906.html) | ポーランド語媒体、投稿者・設備国未確認／波／未確認 | **取得不可**・フォーラム候補。本文取得502、検索結果のみ | Danfoss故障相談。本文なしでは知識化しない。 |
| <a id="r17-32"></a>R17-32・ALL-TEST Pro [Steel Mill Case Study（PDF題名・本文未取得）](https://alltestpro.com/wp-content/uploads/2019/07/Steel-Mill-Case-Study-Englsih.pdf) | 発信：米国。現場国未確認／英／URLに2019年、本文日付未確認 | **取得不可**・メーカー事例PDF候補。取得先は検証画面3行のみ | Steel Mill Case Study。PDF読了に数えず制限を回避しない。 |
| <a id="r17-33"></a>R17-33・Viewpoint Systems [Automated Test System Migration \| Replacing Obsolete Test Systems](https://www.viewpointusa.com/test-measurement/how-do-i-know-you-can-solve-my-specific-problem/replacing-obsolete-test-systems/) | 発信・設備所在地は本文の今回範囲で未確認／英／不明 | **一部**・システム企業事例集。1322行中、Selecting replacement hardware節197–264行を確認。他の事例は一部のみ | 同一品番PXI交換後にタイミング異常、ドライバ更新で復旧と報告。旧FK16-006の独立した別装置の補足。品番・ドライバ版・波形は非掲載。 |

## 予備候補・未読の留保

以下は発見・選別だけで調査完了ではない。全件、原典本文・原著者・掲載日・設備所在地は未確認。検索順位や多言語URLは技術的根拠にならない。

| ID・媒体 | 原典候補 | 言語・選別理由 |
|---|---|---|
| E17-01・KV E-Hospital | [รับซ่อม Servo Drive ทุกรุ่น | KV E-Hospital](https://kvehospital.com/service/servo) | **抜粋**／泰。サーボ修理サービス。個別の観測・結果は抜粋で未確認 |
| E17-02・Ch. Udom Technology | [รับซ่อมเซอร์โวมอเตอร์ Servo Motor ทุกยี่ห้อ ประสบการณ์กว่า 20 ปี](https://www.ch-udomtechnology.com/servo-motor-all/) | **抜粋**／泰。長年の修理経験を宣伝。工程と事例の実測を区別する必要 |
| E17-03・Lập trình tự động | [Ca Sửa Servo Mất Tín Hiệu Encoder Sau Khi Máy Bị Mất Điện Đột Ngột – Quy Trình Xử Lý Thực Tế - LẬP TRÌNH TỰ ĐỘNG HÓA TRẦN GIA](https://laptrinhtudong.com/ca-sua-servo-mat-tin-hieu-encoder-sau-khi-may-bi-mat-dien-dot-ngot-quy-trinh-xu-ly-thuc-te) | **抜粋**／越。停電後encoder損失の事例を称する。本文・著者実体験・型式未確認 |
| E17-04・EMIN | [Động Cơ Chạy Giật Cục, Biến Tần Báo Encoder Fault, Cách Kiểm Tra Mất Xung Encoder | EMIN.VN](https://emin.vn/dong-co-chay-giat-cuc-bien-tan-bao-encoder-fault-cach-kiem-tra-mat-xung-encoder-1861/ne.html) | **抜粋**／越。測定器とencoder fault解説。実事例か一般教材か未確認 |
| E17-05・Sửa Biến Tần Bình Dương | [Lỗi thường gặp Biến tần Servo - Các mã lỗi thường gặp ở Biến tần, Servo](https://suabientanbinhduong.com/loi-thuong-gap-bien-tan-servo/) | **抜粋**／越。警報表の解説候補。個別原因の証拠ではない |
| E17-06・Folks Automation | [Mengatasi Lampu Indikator ERROR/FAULT pada PLC: Panduan Lengkap untuk Teknisi Pemula | Folks Automation](https://folksautomation.com/blog/maintenance/cara-mengatasi-lampu-indikator-error-fault-pada-plc) | **抜粋**／尼。PLC fault一般ガイド。具体的故障の時系列は未確認 |
| E17-07・BRJ | [Casos de Éxito en Vibraciones, Ruido y Termografía | BRJ](https://brj.cl/casos/) | **抜粋**／西。振動・騒音事例一覧候補。個別記事未取得、優良認定しない |
| E17-08・Servomex | [¿Por qué un servomotor puede perder referencia al encender?](https://servomex-int.com/blog/por-qu%C3%A9-un-servomotor-puede-perder-referencia-al-encender) | **抜粋**／西。起動時原点ずれ一般解説候補。メキシコ所在地は今回未確認 |
| E17-09・Industrial Monitor Direct | [Diagnozowanie awarii serw i naprawa enkoderów w Hurco BMC 25 – Industrial Monitor Direct](https://industrialmonitordirect.com/pl/blogs/knowledgebase/hurco-bmc-25-servo-faults-require-motor-feedback-checks) | **抜粋**／波。多言語展開の二次的解説。波語＝ポーランド実務者とは認定しない |
| E17-10・奕凱㨗 | [奕凱㨗伺服維修｜CNC伺服驅動器、伺服馬達維修](https://service.estarcnc.com/) | **抜粋**／繁体中。サーボ修理窓口候補。故障経緯本文は未読 |
| E17-11・Siemens China Q&A | [V90伺服位置发生偏移-伺服电机/主轴电机-找答案-西门子中国](https://www.ad.siemens.com.cn/service/answer/solve_342252_1114.html) | **抜粋**／簡体中。位置ずれへの回答候補。公式媒体上のユーザー投稿はメーカー実証でない |
| E17-12・立裕科技 | [商業設備 - FANUC伺服馬達維修服務 - 維修案例 - 新聞訊息 - 立裕科技有限公司](https://www.lizyu.com.tw/modules/news/article.php?storyid=68) | **抜粋**／繁体中。FANUC修理事例候補。現場条件未取得 |
| E17-13・Serwis Fotowoltaiczny | [Usterki falownika trójfazowego – diagnostyka i naprawy](https://serwis-fotowoltaiczny.pl/usterki-falownika-trojfazowego-w-instalacjach-przemyslowych-diagnoza-i-rozwiazania/) | **抜粋**／波。三相インバータ一般解説。PVとモータ駆動の対象差を要確認 |
| E17-14・Elektrika.cz forum | [Jaký je typ sítě za frekvenčním měničem, střídačem, softstartem?](https://diskuse.elektrika.cz/index.php/topic%2C48967.0.html) | **抜粋**／捷。駆動機器出力側系統の討論。国内保護設計へ転用しない |
| E17-15・The Snell Group | [A Good Troubleshooting Tool is the In-Rush Starting Current | The Snell Group](https://www.thesnellgroup.com/a-good-troubleshooting-tool-is-the-in-rush-starting-current) | **抜粋**／英。始動電流の診断論点候補。今回本文未取得、旧測定知識との重複未確定 |
| E17-16・Chayanan Supply | [บริการ - บริษัท ชยนันต์ ซัพพลาย จำกัด](https://www.inverter.co.th/service/) | **抜粋**／泰。サービス一覧。観測に基づく実例か未確認 |
| E17-17・Smartdrive | [OUR SERVICES](https://www.smartdrive.co.th/our-services) | **抜粋**／泰・英。サービス一覧。本文を読んだ実務事例には数えない |
| E17-18・Six Engineer | [ซ่อม Inverter](https://sixengineer.com/index.php/inverter-repair) | **抜粋**／泰。修理広告。成功率の根拠未確認 |
| E17-19・Việt Machine | [Nguyên lý và kinh nghiệm lập trình PLC | Việt Machine](https://vietmachine.com.vn/nguyen-ly-va-kinh-nghiem-lap-trinh-plc.html) | **抜粋**／越。PLC原理・経験の一般解説候補。scanの一律説明を要確認 |
| E17-20・HL Automation | [Xử lý lỗi giao tiếp biến tần và PLC chi tiết từ A-Z](https://hlauto.vn/loi-nhieu-tin-hieu-giao-tiep-kem-giua-plc-va-bien-tan) | **抜粋**／越。PLCとVFD通信不良一般解説候補。最終原因と実例性未確認 |

## メーカー一次資料の確認範囲

V資料は故障の追加証言数に入れない。国内向け文書でも型式差を残す。規格番号や外国認証を国内適合の代用にしない。

| ID・一次資料 | 本文確認範囲・版 | 確認できた条件／確認できないこと |
|---|---|---|
| <a id="v17-01"></a>V17-01 [HIOKI LR5051取扱説明書（2022-05、第6版）](https://www.hioki.co.jp/file/cmw/hdInstructionManual/95041/pdf/?action=browser&log=1) | 一部：付録1/4、瞬時・統計値・実効値演算の段落 | 記録間隔、1秒ごとの統計測定、250µsサンプリングで最大400点の演算を区別。連続波形記録の保証でない。 |
| <a id="v17-02"></a>V17-02 [A&D FFTアナライザ入門 第3章](https://www.aandd.co.jp/products/nvh_analysis/fft/fft03.html) | 全体：本文406–508行、図の独立読図なし | 入力レンジ、結合、校正、時間長/周波数分解能、平均化の条件。機種例を全FFT装置へ一般化しない。 |
| <a id="v17-03"></a>V17-03 [Spectrum Controls 1769sc-IF8U Manual](https://www.spectrumcontrols.com/wp-content/uploads/2022/03/1769sc-if8umanual0300198_03_b0.pdf) | 一部：表紙とAppendix F。表紙0300198-06 Rev A.0、URL末尾と区別 | 追加profileとgeneric構成の説明。2010年のRSLogix15の不具合原因やEDSの寄与までは証明しない。 |
| <a id="v17-04"></a>V17-04 [Rockwell 1746-NI8 User Manual](https://literature.rockwellautomation.com/idc/groups/literature/documents/um/1746-um020_-en-p.pdf) | 一部：第7章7-1〜7-4。1746-6.8、1997-04 | 点滅は設定・断線・範囲外等を区別する必要。4–20mA等の対象条件あり。国内の他社I/OへLED意味を流用しない。 |
| <a id="v17-05"></a>V17-05 [横河 VYシリーズ Modbus通信形 IM01F07A02-03JA](https://web-material3.yokogawa.com/IM01F07A02-03JA.pdf) | 一部：3.1と3.1.8、初版、文書発行日は未確認 | FloatのABCD/CDAB/BADC/DCBA指定を確認。通信成立はデータ表現一致の保証でない。旧BHKWの実データ形式は別確認。 |
| <a id="v17-06"></a>V17-06 [Grundfos CR/CRN 日本語説明書](https://api.grundfos.com/literature/Grundfosliterature-6400798.pdf) | 一部：16–18頁、版日未確認 | モータの種類別に給脂条件が異なる。国内製モータ用の別説明書E7390957は未取得。排脂の扱いを全機種へ一般化しない。 |
| <a id="v17-07"></a>V17-07 [NSK 9.1 グリース潤滑](https://www.nsk.com/jp-ja/tools-resources/abc-bearings/grease-lubrication/) | 一部：本文386–470行、画像式・図は未判読 | 速度・ハウジング・充填/補給条件の区別。密封軸受と補給可能軸受、初期充填と再給脂を混同しない。 |
| <a id="v17-08"></a>V17-08 [ABB ACH580文書一覧とEN firmware manual](https://library.e.abb.com/public/6748adce0ba5412e90fc0ba2078e9b0f/LinkList_ACH580-31_manuals.html?x-sign=N2evr5ypFz8D3wNN2cfJLX7V3eGOtNkAvRkZtJ4FADWbPnOKpsLVzrPhO7s0Qdqk) | 一部：一覧のみ。EN本文は取得不可 | 文書一覧2026-09-16。警報該当箇所は未確認、FK16-001のFW条件は未解決。 |
| <a id="v17-09"></a>V17-09 [オムロン FA用語辞典 断線検知機能](https://www.fa.omron.co.jp/guide/glossary/meaning/4159.html) | 全体：短い定義本文591–607行、日付なし | 当該アナログI/Oスレーブの有効チャネル・入力レンジ条件を確認。1746-NI8と同じLED表ではない。 |
| <a id="v17-10"></a>V17-10 [三菱電機 FAQ11820 絶対位置システムでの原点復帰](https://fa-faq.mitsubishielectric.co.jp/faq/show/11820) | 全体：質問・回答・対象シリーズ、更新2025-10-20 | MELSEC-Q/Aの当該モーション機器。現在位置書換えのoffset保持条件。Deltaや現行全機種へ移植しない。 |
| <a id="v17-11"></a>V17-11 [横河 EJ□530J IM01C26F01-01](https://www.yokogawa.co.jp/pdf/provide/J/GW/IM/0000028002/0/IM01C26F01-01JA.pdf) | 一部：表紙第11版2022-06、5.1節（5-1頁） | 導圧管内のガス/ドレンが圧力伝達に影響する原理を確認。当該資料は圧力伝送器であり、旧空気式差圧計のレンジ改造を裏付けない。 |
| <a id="v17-12"></a>V17-12 [三ツ星ベルト Vベルトの取付け方法](https://product.mitsuboshi.com/technical-library/column/V-belt_installation_method/) | 一部：本文78–208行、表4画像は未判読、日付なし | シングルとマルチで測定方式が異なる。音波式にはスパン長・単位質量、騒音や低い固有振動数の制約。たわみ量を一律値にしない。 |
| <a id="v17-13"></a>V17-13 [荏原 MSN取扱説明書 CF4505K-H001 REV.8](https://product-standard-pump.ebara.com/files/handbook/MSN/MSN_manual.pdf) | 抜粋：原因表の検索抜粋、原典本文403 | 低揚程・過大流量と過負荷の関係は今回本文未照合。Lubi事例をAにする根拠には用いない。 |

## 重点比較した発信主体

| 主体 | 比較した本文 | 評価・継続性・限界 |
|---|---|---|
| Servige | R17-01〜03の3記事 | 速度・構造・測定方法を比較でき、実施済みと予定が分かれる。2025〜2026年の記事あり。統計量だけの原因除外や費用効果は留保。保全企業として候補推薦 |
| Pacifco | R17-04〜06の3記事 | 指標の定義、修理後の別ピーク、給脂前の低下まで書く点が有用。2026年の記事複数。AI精度は未検証、個人ブログではなく機器事業者 |
| Juare97 | R17-07〜09の3記事 | 伝聞、教育例、自身の失敗を分けて比較可能。2010〜2012年の機種・ソフトで現行への移植不可。第16回と同じ著者、発信主体の新発見ではない |
| Smart Servo Home / Archer | R17-11〜13の3記事 | 型式別FAQと信号・座標の説明が具体的。所在地不明、故障復旧記録ではない。古い機種の参照候補、新着頻度は未確認 |
| Lubi Pumps | R17-16〜18の3記事 | 軸交換再発、運転点、RO膜と異音という異なる境界を比較。メーカー修理報告で利害あり。数値や独自加工を国内手順にしない |
| S. Raghava Chari | R17-19〜21の3記事 | 同著者の歴史的な判断を比較。ただし圧力部・駆動部の自作例が多く、危険策の採用を避ける。媒体全体の重点監視は推薦しない |
| Thai Printing Association署名連載 | R17-24〜26の3記事 | タイ語の保全・伝動・部品仕様の文脈を比較。単独故障例ではなく一般解説。国内資料と異なる張力・寿命の一律値は見送り |
| RASE Tech | R17-14/15の2記事 | 位相と軸方向振動、切離し前後の比較。数値・画像の独立検証なし。2記事比較であり3記事精読主体に入れない |
| ALL-TEST Pro | R17-22/23の2記事 | 実故障と工数比較を区別。R17-32のPDFは未取得で3記事扱いしない。メーカー紹介と独立技術者の証言を重複計上しない |

## 新規候補と補足の判定

全件の記録日は2026-11-08。原典タイトル・URL・著者・掲載日・確認範囲はR表、一次資料URL・版・読んだ範囲はV表が正本。以下の原典番号はそこへの参照であり、出典の省略ではない。Aは記載した限定的な技術論点だけの判定で、記事全体や経験談全体の保証ではない。

| ID | 区分・論点 | A/B/C | JP判定 | 原典・技術照合 |
|---|---|---|---|---|
| FK17-001 | 新規：同じ指標名でも支配ピークが入れ替わる | B | JP-B | R17-04、V17-02 |
| FK17-002 | 新規：伝送器より手前の圧力伝達経路を確認 | A | JP-A | R17-19、V17-11 |
| FK17-003 | 新規：音波式張力計はベルト構造・入力値で適合が変わる | A | JP-A | R17-25、V17-12 |
| FK17-004 | 補足：共振の推定と加振源の除外を分ける | B | JP-B | R17-01/02、V17-02 |
| FK17-005 | 補足：給脂前の変化と欠測を残す | B | JP-B | R17-05、V17-07 |
| FK17-006 | 補足：同じ部品名でも復元に必要なソフト層がある | B | JP-B | R17-09/33、V17-03 |
| FK17-007 | 補足：機械原点・座標・停止位置・保持を分ける | B | JP-B | R17-11/12、V17-10 |
| FK17-008 | 補足：点滅表示の意味と損傷原因は別 | B | JP-B | R17-07/08、V17-04/09 |
| FK17-009 | 補足：ベンチ合格と組込み後の負荷条件は別 | B | JP-B | R17-16〜18/22、V17-13は抜粋のみ |
| FK17-010 | 補足：切離し試験で支持・拘束も変化する | B | JP-B | R17-14/15、V17-02 |
| FK17-011 | 補足：Modbusの通信成立と数値の並び順 | A | JP-A | 旧FK16-002、V17-05 |
| FK17-012 | 補足：記録周期・内部演算・統計値の別 | A | JP-A | 旧FK13-010、V17-01、R17-05は別現象の比較 |

<a id="fk17-001"></a>
### FK17-001 指標が下がらないとき、同じ現象を追跡しているか

- 症状・条件：[R17-04](#r17-04)の修理後にもNSEが高い。NSEはこの発信者の「非同期成分中の最大ピーク振幅」の呼称であり、物理的エネルギー積分と同義ではない。
- 初期仮説と観測：軸受由来と見たピークを追い、軸受とカバーを同時交換。著者は元の特徴周波数が消え、別の低周波成分が指標を支配したと説明する。単に修理前後の数値を比べると同じ故障が残ったように見える。
- 判断・報告結果：修理効果の評価をピークの由来別に分ける。ただしカバーと軸受の寄与、低周波成分の原因、期間表記の不一致は未解決。図の再解析・実機追試なし。
- [V17-02](#v17-02)はFFTの周波数分解能等の条件を支持するだけで、NSE演算や当該軸受診断を認証しない。**B/JP-B**。日本では同一の演算定義・帯域・速度条件と元スペクトルを対応させて評価する。しきい値や交換周期は移植しない。
- 差分：FK15-007の入力飽和、FK14-003の二周波数分離、F-047の条件記録に対し、今回は最大値を採る指標の「最大値の発生源」が変わる反例。単なるFFT基礎の再登録ではない。
- 活用候補：`equipment-maintenance-career`の記録の考え方に短い補足。FFT診断の詳細に適した専用slugは未特定。初心者には「同じメータ名＝同じ故障を測り続けた、とは限らない」と説明する。

<a id="fk17-002"></a>
### FK17-002 信号処理を疑う前に、圧力が計器へどう伝わるかを分ける

- 症状・条件：[R17-19](#r17-19)は空気式差圧伝送器の短時間後の不調。著者は低圧側導圧管の凝縮水と計器レンジに着目した。最初に疑った部品、測定生データ、再発追跡の客観資料は記載なし。
- 技術的範囲：[V17-11](#v17-11)のEJ□530Jは、導圧管の気体/液体の状態による圧力伝達の誤差を説明している。**A/JP-Aは「測定対象から受圧部までの経路も確認対象」という論点に限定**。圧力計の説明書を旧空気式差圧計の型式適合や改造の裏付けにしない。
- 日本向け条件：流体、温度、設置位置、導圧管の状態、計器型式とレンジをメーカー仕様で確認する必要がある。具体的な弁操作、圧力解放、部品自作は記録しない。原典の自作改造は[FK17-014](#fk17-014)で見送る。
- 差分：既存アナログ入力の電気レンジ・スケーリングに対し、今回はその前段の圧力伝達経路。`analog-input-basic`では「電気信号が正常でも物理量の伝達が正常とは限らない」という短い境界説明まで。差圧配管の詳説を無理に差し込まない。

<a id="fk17-003"></a>
### FK17-003 同じ張力でも、ベルト構造によって測定方法を選び直す

- 問題：[R17-25](#r17-25)は指押しと音波測定を比較するが、一定のたわみ量や測定状態の説明は一般化できない。これは故障の修理結果ではなく、工具選定の検証である。
- 観測・判断：[V17-12](#v17-12)は、三ツ星のシングルと連結されたマルチタイプを区別し、後者に前者の振動測定をそのまま使わない。音波式で入力するスパン長・単位質量と騒音・低周波側の検出制約も確認できる。
- **A/JP-A**。対象ベルト・指定張力・測定器の周波数範囲を確認するという考え方だけを採用候補とする。運転中に近づく方法、機種横断のたわみ数値、手の感覚を校正値にする説明は採らない。精度保証値と現場の繰返し性は今回未照合。
- 差分：F-047/FK13-002の一般的な測定条件に対し、同じベルト用途でも構造により測定原理の適合が変わる具体的な反例。N表示が得られたことと適正な張力評価を区別する。
- 活用：`equipment-maintenance-career`の機械保全スキルに例示候補。専用工具記事slug未特定。電気用`tester`へベルト調整方法を詰め込まない。

<a id="fk17-004"></a>
### FK17-004 共振推定と発生源の除外を分ける（旧知識補足）

[R17-01](#r17-01)の速度帯依存は仮説変更の材料だが、加振源と構造応答を同時に考える余地が残る。速度回避後の低下を恒久的な機械修理完了としない。[R17-02](#r17-02)の清掃前後も、流れ・付着物・継手の寄与が分離されていない。[V17-02](#v17-02)は測定条件の照合のみ。**B/JP-B**、FK14-009/FK14-003の追加反例で新規数0。`inverter-basic`には「特定速度の症状を履歴に含める」まで。安全な運転範囲・許容振動・構造対策は対象メーカー判断を要する。

<a id="fk17-005"></a>
### FK17-005 介入前に低下していた値まで効果へ算入しない（旧知識補足）

[R17-05](#r17-05)では給脂に先行する低下、別の給脂後の改善、欠測を著者が区別している。新しい普遍的な潤滑診断法ではなく、FK14-004/F-047の観測履歴への反例追加。速度・負荷・給脂量や潤滑剤は未確認。[V17-07](#v17-07)は補給条件の型式依存を支持するが、企業の指標演算は検証しない。**B/JP-B**。`equipment-maintenance-career`では「介入前/後/欠測を一緒に記録」。低下だけで軸受損傷なし、給脂完了、周期延長とは判定しない。

<a id="fk17-006"></a>
### FK17-006 復元対象をハードとソフトの組合せで残す（旧知識補足）

[R17-09](#r17-09)のprofile/EDS導入と、独立した企業の[R17-33](#r17-33)の同一品番交換後のdriver更新を比較。両者は別装置・別年代で、同じ障害の追試ではない。原典の成功報告を、必要ソフト層を洗い出す材料にする。[V17-03](#v17-03)はprofileの存在を確認できるが、2010年時点の版互換・各変更の寄与は未解決。**B/JP-B**、FK12-002/FK16-006補足。`got-touch-panel-basic`の変更履歴に、版・機器構成・復元対象の記録候補。稼働設備へのインストール手順や強制運転は保存しない。

<a id="fk17-007"></a>
### FK17-007 原点がずれたという訴えを、何の位置かに分解する（旧知識補足）

[R17-11](#r17-11)は原点検出と減速停止位置、[R17-12](#r17-12)は非保持パラメータを説明する。故障の原因確定例ではない。[V17-10](#v17-10)も対象Q/Aモーションに位置書換えの保持条件があることを示すが、Deltaと同じ挙動ではない。**B/JP-B**、FK15-003/FK12-004補足。`servo-motor-basic`の「原点復帰完了」に、機械基準・現在値・停止点・電源断前後を区別する候補。エンコーダの取付変更や原点設定の作業手順にはしない。

<a id="fk17-008"></a>
### FK17-008 点滅は原因名ではなく、状態を調べる入口（旧知識補足）

[R17-07](#r17-07)の雷故障説は伝聞で、コメントの断線説も未確定。チャネルを変えて動いたことだけでは部品内部の破損を証明できない。[V17-04](#v17-04)は当該LEDに複数の意味があることを確認、[V17-09](#v17-09)は国内アナログI/Oでも断線検知にレンジ/有効条件がある例。[R17-08](#r17-08)のHMI→ラダー→図面の追跡はF-038/039の説明補助で独立故障数0。**B/JP-B**、`analog-input-basic`と`got-touch-panel-basic`の既存説明へ補足候補。故障した疑いのあるモジュールを使い続けることは推奨しない。

<a id="fk17-009"></a>
### FK17-009 部品単体の合格と、組込み後の正常を分ける（旧知識補足）

[R17-16](#r17-16)は翌日の軸再破損、[R17-17](#r17-17)は低揚程での過大電流、[R17-18](#r17-18)はRO膜交換後の静穏化。単体の故障と周辺負荷を行き来する例で、いずれも原因の独立再現はない。旧FK14-001/FK10-005/F-047に追加出典、**B/JP-B**。荏原[V17-13](#v17-13)は今回抜粋止まりでAへの根拠にしない。[R17-22](#r17-22)は警報がなくても別観測が必要だった別企業事例だが、波形だけでモータ健全を全保証しない。`three-phase-induction-motor-basic`/`inverter-basic`に負荷・据付・修理後条件の区別を検討。運転継続・羽根車加工・電圧値の移植は不可。

<a id="fk17-010"></a>
### FK17-010 切り離した比較で何が同時に変わったかを残す（旧知識補足）

[R17-14](#r17-14)のソロ時増加と修正後低下は観測報告。負荷を外せば励振だけでなく拘束も変わり得るという編集上の留保を付す。原典が全構造条件を測ったという意味ではない。[R17-15](#r17-15)は位相も使う別設備で、軸方向1Xだけを万能原因表にしない。[V17-02](#v17-02)は測定/解析の一般条件まで。**B/JP-B**、FK15-006/FK14-009補足、`equipment-maintenance-career`の比較条件の記録候補。機械切離しや試験重りの再現手順は作らない。

<a id="fk17-011"></a>
### FK17-011 数値の型・順序を両側で照合する（旧Bへの限定補足）

旧[FK16-002](field-knowledge-round16-2026-11-08.md#fk16-002)。今回[V17-05](#v17-05)で数値Floatの順序指定を直接確認した。以前のGOT文字列のFAQだけから数値通信へ広げる制約を補う。**A/JP-Aは型・並び順を対象通信仕様で照合する論点のみ**。旧BHKWの実packet・型は依然不明、旧判定はBのまま。新規知識数0。`got-touch-panel-basic`の参照先・通信確認に補足可能。値を無条件でswapする対策にはしない。

<a id="fk17-012"></a>
### FK17-012 ログの一行は連続した生波形と同義ではない（旧Bへの限定補足）

[V17-01](#v17-01)を本文で確認し、LR5051の記録間隔と統計値の測定間隔、RMS内部演算を分けられた。**A/JP-Aは当該説明書に基づくこの区別のみ**。旧FK13-010の漏電事例の実設定・測定器は未確認でB維持。[R17-05](#r17-05)の約4時間の振動収集は別装置・別現象で、電気的な短パルス捕捉の裏付けではない。`tester`には「記録器を使えば全瞬間が残るわけではない」という選定論点を短く。LR5051の演算時間を他のロガーへ流用しない。

## B判定の再検証履歴（元の判定を保持）

今回の判定対象は9件。8件は追加本文/一次資料との比較、1件は取得に至らない試行。独立した原典とは別著者・別組織をいうが、別設備の類似例は同じ故障の実証でない。現地実機の追加試験は全件未実施。

| 履歴ID・旧知識 | 元のB理由・足りない証拠 | 今回の追加原典・独立性・一次資料 | 新しく分かった条件／未解決事項・判定理由・国内条件 |
|---|---|---|---|
| <a id="rv17-01"></a>RV17-01 [FK13-010](field-knowledge-round13-2026-11-08.md#fk13-010) | 元ブログ未取得、型式・応答・設定不明 | V17-01はメーカー資料。R17-05は別著者・別物理量で比較のみ | 記録/統計/演算周期を確認。旧事例の使用設定は未解決。B維持（国内事例の元JP対象外も維持）。掲載時は対象センサ・レンジと記録モードを確認 |
| <a id="rv17-02"></a>RV17-02 [FK16-002](field-knowledge-round16-2026-11-08.md#fk16-002) | 元BHKWの型・packet・byte順不明、従来照合は文字列FAQ | V17-05は独立メーカーの数値通信仕様。元事例の続報ではない | Float順序の選択肢は国内資料で確認。元2byte入替えの具体的原因は不明。B/JP-B維持、FK17-011の限定論点とは別 |
| <a id="rv17-03"></a>RV17-03 [FK16-006](field-knowledge-round16-2026-11-08.md#fk16-006) | OS・OPC等の復元変更が複数、依存版不明 | R17-09は旧Juareと同著者、独立扱いしない。R17-33は独立企業の別装置。V17-03 | ハード同名でもソフト層が必要な反例を追加。元ドイツOPCとインドネシアPLCの版・因果は不明。B/JP-B維持、国内も機器/driver/firmware/工程を記録 |
| <a id="rv17-04"></a>RV17-04 [FK13-004](field-knowledge-round13-2026-11-08.md#fk13-004) | 排脂経路・モータ型式・潤滑剤条件不明 | V17-06/07は独立一次資料。R17-05は別企業の給脂例で排脂実証ではない | 国内向け説明書でもモータ別条件が異なる。元の詰まり経路、給脂量は未解決。B/JP-B維持、銘板と該当説明書なしに排脂操作を提案しない |
| <a id="rv17-05"></a>RV17-05 [FK14-004](field-knowledge-round14-2026-11-08.md#fk14-004) | SDT演算・しきい値・機種適合不明、傷と給脂応答の分離不足 | R17-05は旧SDTと独立した別企業事例。V17-07 | 給脂前低下と欠測という反例を追加。SDTのしきい値も元損傷も証明していない。B/JP-B維持、指定潤滑条件を優先 |
| <a id="rv17-06"></a>RV17-06 [FK15-006](field-knowledge-round15-2026-11-08.md#fk15-006) | 内部軸受からの伝達減衰、取付/運転条件の一致が不明 | R17-14は独立したRASEの別設備。V17-02は解析条件の一般説明 | 比較時に拘束条件も変わる反例。元減衰倍率や改造取付の正当性は解消なし。B/JP-B維持、国内設備の取付点・支持構造を要確認 |
| <a id="rv17-07"></a>RV17-07 [FK14-003](field-knowledge-round14-2026-11-08.md#fk14-003) | beatと複数対策の寄与が未分離。RV15-05の差周波数表記矛盾 | R17-01/02は独立Servigeの別設備。V17-02 | 速度帯・分解能を追補。旧16.57/17.25Hzと30cpmの不整合は解消していない。B/JP-B維持、数値を再利用しない |
| <a id="rv17-08"></a>RV17-08 [FK15-003](field-knowledge-round15-2026-11-08.md#fk15-003) | ボールねじ交換と補正変更の寄与、計測条件不明 | R17-11/12は独立著者の機種FAQ（実証例でない）、V17-10 | 原点/停止/座標/保持を分ける反例。旧Seibuの機械原因は未確定。B維持（国内事例の元JP対象外維持）。国内も対象型式の保持仕様を確認 |
| <a id="rv17-09"></a>RV17-09 [FK16-001](field-knowledge-round16-2026-11-08.md#fk16-001) | ACH580二警報と内部センサ損傷のFW依存条件未確認 | V17-08の公式一覧確認。EN firmware PDF取得失敗。独立した同型式事例は得られず | **再検証試行・未解決**。警報該当本文を今回読めていない。B/JP-B維持。R17-22の別VFD事例はこの原因の証明に使わない |

## C判定・採用しない情報

判定は下記の主張・方法に対して付し、著者の全記事を虚偽と認定するものではない。Cも独立した新規知識数に入れない。

| ID | 不採用対象・原典 | 判定 | 理由・残す教訓 |
|---|---|---|---|
| <a id="fk17-013"></a>FK17-013 | R17-21の代替材によるアクチュエータ膜自作 | C / JP-C | 圧力・材料・寿命・フェイル動作の承認がない。長期使用の自己申告を安全適合としない |
| <a id="fk17-014"></a>FK17-014 | R17-19/20の圧力部品・絞り板の独自改造 | C / JP-C | 校正・耐圧・材質・プロセス安全未確認。観測経路の教訓だけを分離し加工手順は保存しない |
| <a id="fk17-015"></a>FK17-015 | R17-01/02の統計値・周波数帯からの全原因排除 | C / JP-C | 尖度等だけで軸受健全、狭い速度帯だけで芯ずれなし、全ての1X未満成分で軸受なしとは言えない。元原因は未確定 |
| <a id="fk17-016"></a>FK17-016 | R17-05/06のAI精度・方式優位の宣伝 | C / JP-C | データ集合、外部評価、適用母集団なし。外国認証を日本の設置適合に代用しない |
| <a id="fk17-017"></a>FK17-017 | R17-25の一律たわみ・一律チェーン寿命・測定中の状態 | C / JP-C | 対象・スパン・構造を欠く数値はV17-12の条件と両立しない。国内の指定方式へ戻す。全タイミングベルトの耐油性も認定しない |
| <a id="fk17-018"></a>FK17-018 | R17-10を原因確定したencoder故障例として採用 | C / JP-C | 当該原因と測定が特定できず、成功をうたうだけでは確定例にならない |
| <a id="fk17-019"></a>FK17-019 | R17-27の無表示なら整流部正常、容量だけで修理判断 | C / JP-C | 型式・測定なしの回答。別回答者の修理経験は質問者の解決でない。内部修理方法は保存しない |
| <a id="fk17-020"></a>FK17-020 | R17-23の工数差を測定器の普遍的性能差とする | C / JP-C | 試験対象、移動、付帯作業が一致しない。工数比較と測定精度/検出率の比較を区別 |

## 故障・実務事例の数え方

経緯を本文で確認した故障・保全実務報告は17件（R17-01〜05、09、14〜22、27、33）。うちR17-03は芯出し保全作業の報告で故障原因確定例に数えず、故障症状を含む報告は16件。R17-33は選んだ事例節は確認したがURL全体は一部扱い。R17-27は未解決、R17-21は危険策の見送りを含む。第三者が実機で原因を実証した件数は0。伝聞R17-07、原因が特定できない宣伝R17-10、保全運用比較R17-23、一般解説、抄録・未取得候補はこの16件に入れない。同じ記事の多言語版・別ホスト再掲は追加事例にしない。

厳密に「最初の仮説→観測による変更」が文章で追える例は少ない。R17-01の芯ずれから共振推定、R17-18のポンプからRO膜、R17-33の同一品番なら復旧する想定からdriver依存、という3例を優先する。著者が書かない他の初期仮説を創作しない。

## 現場表現の対照（新しい使用例10件）

国内の現場通称を新たに認定した件数は0。以下10件は原典で確認した外国語の文脈・説明訳で、既存概念の多言語用例も含む。語彙を知識10件として二重計上しない。

| 原語・言語・出典 | 文脈・直訳・自然な説明訳 | 正式概念/国内使用・混同・接続 |
|---|---|---|
| carpete／葡、R17-05 | 直訳は敷物。スペクトルの床状の成分を指す説明 | 「スペクトルの床」の説明訳。国内通称として未認定、ノイズ全てを潤滑不良としない。FK17-005、`equipment-maintenance-career` |
| NSE (Energia Não Síncrona)／葡、R17-04 | 非同期エネルギーという名前だが著者の計算は最大ピーク | 国内標準のエネルギー量でない。FK17-001、`equipment-maintenance-career` |
| folga／葡、R17-04 | すきま・緩み。軸受カバーとの関連で使用 | 日本語「ガタ」は説明候補、規定内部すきまと混同しない。FK17-001 |
| stall rotatorio／西、R17-02 | 送風機流れの失速を表す著者の原因推定 | 回転失速に相当する説明、機械の停止や電気的失速の同義でない。原因は未確定。FK17-004、`inverter-basic` |
| cardánico／西、R17-03 | カーダン軸の芯出し作業 | 国内カーダン/ユニバーサルジョイント用語の厳密対応と許容角は今回未検証。一般直結軸へ移植しない。専用slug未特定 |
| kedap-kedip／尼、R17-07 | 点滅する、というLEDの状態描写 | 点滅＝雷による故障ではない。国内語は「点滅」、故障コードの意味は型式別。FK17-008、`analog-input-basic` |
| Anak Relay／尼、R17-08 | 図面中のリレー関連部位を指す | 直訳を国内通称にしない。リレー本体か接点か翻訳未確定。FK17-008、`got-touch-panel-basic` |
| 原點回歸／繁体中、R17-11 | 原点へ戻る制御機能 | 国内「原点復帰」は既存記事で使用。停止座標ゼロを必ず意味しない。FK17-007、`servo-motor-basic` |
| humming／英、R17-18 | RO設備で聞こえたうなり音 | 擬音であり軸受故障名ではない。周波数分析なし。FK17-009、`three-phase-induction-motor-basic` |
| czarny／波、R17-27 | 「黒い」＝表示/LEDが出ないという回答の表現 | 国内では「無表示」と説明。焼損の診断語にしない。FK17-019、`inverter-basic` |

## 工具・測定器を選ぶ理由と限界

| 工具/計測系 | 選定・比較の論点 | 一次資料・未確認事項・索引先 |
|---|---|---|
| FFT/振動解析器 | scalarだけでなく元成分、帯域・時間長・回転条件を残せるか | V17-02。位相・画像の独立解析なし。FK17-001/004/010 |
| 音波式張力計・たわみ荷重計・メジャー | 対象構造で適合する原理が変わる。N表示だけでは入力値の正しさ不明 | V17-12。精度・校正周期未照合。FK17-003 |
| LR5051クランプロガー | 記録間隔と内部RMS演算を区別。連続波形が必要な現象を取り逃がさないか | V17-01。元漏電事例設定未確認。FK17-012/RV17-01 |
| レーザー芯出し器（R17-03） | 回転可能範囲と測定モードの適合を選ぶ理由 | 当該XT770公式仕様・角度許容は未確認。工具選定案B、施工値にしない |
| PLC診断表示・HMI・図面 | 数字の表示よりレンジ・状態・参照条件を辿れるか | V17-04/09。LED原因名の短絡を避ける。FK17-008 |
| モータ電気診断器（R17-22） | 警報とは別に入出力波形を観測した例 | 国内対象器のPWM適合・帯域・精度未確認。一般テスターで同じ診断ができるとはしない。FK17-009 |
| 給脂支援/状態監視（R17-05/06） | 低速で必要な帯域・ノイズ床、介入前後と欠測を記録できるか | V17-07は潤滑条件のみ。超音波方式と振動方式の換算不可。FK17-005/RV17-05 |

新規工具論点はFK17-003の1件。上表の7分類を7件の新しい独立知識とは数えない。トルクレンチ、圧着、プーラー、絶縁抵抗計、ダイヤルゲージについて旧台帳以上の適合情報は今回増えていない。

## 既存記事との対応・採用候補

mainの以下8記事の本文と該当見出しを照合した。slug実在だけの対応付けではない。知識Aでも記事別採否と最新の検索データ・日付ガード・原典再確認が必要。

| slug | 既存説明と差分 | 対応知識・将来の採否 |
|---|---|---|
| `equipment-maintenance-career` | 日常点検→復旧→再発防止、必要スキルは既存。指標の発生源の変化、介入前後の記録、工具適合の例は未収録 | FK17-001/003/005/010。仕事紹介の主題を保ち短例まで、振動診断詳説は別記事候補 |
| `analog-input-basic` | レンジ、配線、スケーリング、ノイズは既存。受圧部より前の伝達経路、断線診断の有効条件が追加価値 | FK17-002/008。圧力配管施工は載せない |
| `got-touch-panel-basic` | 通信・参照先・データ型・変更履歴は既存。具体的な並び順と機器profile・driverの版が補足候補 | FK17-006/008/011。HMI警報から図面へ追うだけの一般論は重複 |
| `servo-motor-basic` | 指令/実績/状態、原点復帰完了は既存。機械基準/座標/停止点/保持条件の区別を補足 | FK17-007。国内対象型式の仕様再確認後に検討 |
| `inverter-basic` | 周波数、RUN、警報、加減速は既存。速度域と負荷、警報なしの観測例に追加価値 | FK17-004/009、RV17-09。保護設定・危険運転継続は採らない |
| `three-phase-induction-motor-basic` | 固定子/回転子/軸、銘板と実機の違いは既存。工場試験と現場負荷の境界例を検討 | FK17-009。基礎記事へ軸修理・加工指示を入れない |
| `tester` | 検電器/テスターの目的別選択は既存。ログの時間仕様を確認する論点が補足 | FK17-012。ロガー詳細は専用記事候補、購入ランキングは追加しない |
| `plc-output-troubleshooting-basic` | ラダー→LED→リレー→負荷、安全確認はすでに説明済み | R17-08の順路は重複、今回は採用見送り。アナログ入力LED事例を出力LEDへ移植しない |

## 判断方法の引き継ぎ10件

1. 指標の前後比較では、最大ピークの発生源も同じかを確かめる：FK17-001。
2. 電気値より手前の物理的な伝達経路を分ける：FK17-002。
3. 測定原理の適合を、表示単位と別に確認する：FK17-003。
4. 共振で増幅された現象と、それを励起する要因を分ける：FK17-004。
5. 介入前の変化と欠測も保存し、後から効果を大きく見せない：FK17-005。
6. 復元成功に必要な部品・driver・profile・版を分けて残す：FK17-006。
7. 原点がずれたと聞いたら、機械基準・座標・停止位置を区別する：FK17-007。
8. 状態表示を原因名に読み替えず、型式の診断表へ戻る：FK17-008。
9. 切離しや部品交換で同時に変わった負荷・支持条件を残す：FK17-009/010。
10. 通信や記録が成功した事実と、値の解釈・現象捕捉を分ける：FK17-011/012。

これら10項目は編集用の要点整理であり、新規独立知識10件ではない。

## 更新監視への推薦・未開拓部分

[既存正本](field-blog-watchlist.md)の重点5・通常8・候補3と照合し、リスト本体・週次タスクは変更していない。登録したという報告もしない。タスクの実行成否は今回は未確認。追加設定は必要性と対象範囲を示して別途ユーザー承認を得る。

新規候補推薦は4主体：Servige、Pacifco、Smart Servo Home、Thai Printing Associationの当該署名連載。上の原典URLを再取得でき、複数記事の比較ができたことを理由とする。Servige/Pacifcoはメーカー・サービス企業として宣伝と実証を分ける。Smart Servoは古いA2記事の更新が続くか未確認、Thai連載は機械保全記事に対象を絞る。フィードの存在や現在の週次タスクが自動的に読むことは未検証。

Juare97は第16回の推薦履歴にあるため再度「新発掘」と数えない。PLCtalkはBW-016登録済み。Lubi/RASEは事例参照候補だが更新頻度・再現データが不足し、今回監視追加の優先度は下げる。InstrumentationToolsの今回著者は歴史的な危険改造も多く、無条件の監視推薦はしない。

不足：タイ/ベトナムの署名付き故障時系列、韓国・メキシコ・アルゼンチン・チェコの新規実務本文、低速軸受の原波形と実損傷、空圧と搬送の同期、油圧とPLC、encoder計数の型式条件、対象モータの排脂構造、旧Bの版別alarm表。数だけ増やす探索より、次回はこれらの不足証拠を対象型式ごとに埋める。

## 次のチャットでの使い方

最新のGitHubルールを確認→対象slugを決定→[既存4軸索引](field-knowledge-research-2026-11-07.md#cross-index)を症状/用語/工具/判断で検索→FKとRVを読む→R原典とV一次資料・日本向け条件を再取得→既存本文との差分を記事別に採否判断→通常のPreview・承認手順。Bをそのまま原因確定の本文へ変換せず、Cの危険策は反映しない。記事公開とmainマージは今回の範囲外。

## ルール適用・基点・検査範囲

入口は[ルール確認手順](../rules/README.md)、分類正本は[catalog](../rules/catalog.json)。開始mainとPR #1818のmergeをAPIで照合し、Git tree 3689項目、取得した既存157ファイル（うちMarkdown146）のGit blob SHAを照合した。前回採用済みの文書は同じblobの確認記録を継承し、今回入口・旧知識・関連出典を読み直した。取得だけを読了とは扱わない。

必須9文書と条件付き99件の適用性を以下に記録する。生成indexの全行表示と必要ない外部参照の全読了は完了と主張しない。今回の資料追加範囲に限定し、全ルール確認済みという表現は使用しない。

並行PR #1812の記事公開、#1817のHero関連CI、#1808のPreview、#1806のBing関連を取り込まない。Open/Draft一覧を開始時に取得した。第17回専用branchの親を基点mainに固定し、不要なrebaseや既存PRの変更をしない。

| 必須文書 | 内容・参照の確認範囲 |
|---|---|
| `AGENTS.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |
| `docs/agent-runbook.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |
| `docs/ai-editorial-master-rules.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |
| `docs/ai-editorial-project-status.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |
| `docs/ai-governance.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |
| `docs/editorial-department-status.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |
| `docs/rules/conflicts.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |
| `docs/rules/index.md` | 生成一覧は部分表示。catalog全項目の分類・参照は照合。全文読了とは記録しない。 |
| `docs/rules/README.md` | 同一blobで本文確認を継承し、資料追加の適用範囲と必要参照を照合。記事/本番作業は対象外。 |

| 条件付き文書 | 適用性・内容・参照確認の範囲 |
|---|---|
| `.github/article-components/end/INTEGRATION.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `.github/article-components/sidebar/INTEGRATION.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/additional-page-shells.md` | 対象外：トップ・相談・キャリア入口の共通枠、生成・比較・公開・採用基準を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/adopted-image-github-placement-rule.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/agents/article-candidate-agent.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/agents/article-image-generator-agent.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/agents/article-orchestrator.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/agents/article-writer-agent.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/agents/github-link-agent.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-artifact-broker.md` | 対象外：旧artifact転送経路を参照・変更・再利用しようとする場合。使用禁止・再利用条件を確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-artifact-writer.md` | 対象外：旧artifact転送経路を参照・変更・再利用しようとする場合。使用禁止・再利用条件を確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-chibi-motion-rules.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-dashboard-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-discussion-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-image-quality-high.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-ogp-autonomous-gate.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-preview-auto-revise.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-preview-probe-content-validation.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-stall-recovery.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-editorial-weekly-routine.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-fallback-attendance-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-governance-v1-migration.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/ai-search-citation-rules.md` | 本文確認。出典属性の混同を避ける。SEO・記事刷新に伴う検索分析工程は今回対象外。 |
| `docs/ai-weekly-operation.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-audit-entrypoint.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-backlog.md` | 対象外：新規記事候補や英語展開、既存候補との重複・公開済み状態を確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-components-integration.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-editing-playbook.md` | 関連する資料と本文/公開工程の境界を本文確認。記事改稿・Preview・公開は今回対象外。 |
| `docs/article-feedback-rules.md` | 対象外：評価カード・投票処理・記事slug・集計・評価の配置を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-hero-templates.md` | 対象外：記事ヒーローの共通枠・固有内容抽出・CSS・生成・比較検査・対象登録を扱う。プレビュー段階と公開承認を区別する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-refresh-log.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-search-data-precheck-override.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-type-templates.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-update-date-guard.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-workflow-v2-migration.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/article-workflow.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/chibi-production-integration.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/cloudflare-preview-builder-finalization.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/cloudflare-preview-migration.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/codex-update-rules.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/comic-character-sheet.md` | 対象外：四コマ漫画・SNS漫画で先輩/後輩キャラクターを制作・更新・監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/comic-production-checklist.md` | 対象外：四コマ漫画・SNS漫画の台本、画像生成、技術レビュー、採用、投稿準備を行う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/comic-style-guide.md` | 対象外：四コマ漫画・SNS漫画の世界観、絵柄、構成、CTA、シリーズ統一を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/dashboard-progress-status-v066.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/decisions/README.md` | 対象外：重要判断を記録・再評価する。既存判断の採用・未採用・失効を区別する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/denkicontrol-site-strategy.md` | 適用部分は現場知識F/PB・出典・採否の方針。該当箇所を確認。全戦略・全外部出典の再読は未実施。 |
| `docs/denkicontrol-strategy-whitepaper.md` | 対象外：サイト方針、企画、読者対象、収益化、言語展開を判断する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/en-article-backlog.md` | 対象外：新規記事候補や英語展開、既存候補との重複・公開済み状態を確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/existing-article-improvement-backlog.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/external-challenger.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/fa-knowledge-plan.md` | 対象外：サイト方針、企画、読者対象、収益化、言語展開を判断する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/image-generation-rules-v2-migration.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/image-generation-rules.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/image-quality-gate.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/integrations/online-estimate-sheet-setup.md` | 対象外：管理画面から案件別の見積Google Sheetを作成・更新する連携、Apps Script、Cloudflare Worker設定を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/internal-reachability-audit-method-review.md` | 対象外：内部リンク到達性・言語切替の監査方法を使う。旧監査の件数は現在値として流用しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/language-menu-audit-method-review.md` | 対象外：内部リンク到達性・言語切替の監査方法を使う。旧監査の件数は現在値として流用しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/legacy-article-refresh-template.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/multi-ai-orchestrator-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/multi-ai-runtime-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/new-article-checklist-v2-migration.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/new-article-checklist.md` | 記事制作は対象外。冒頭と現場知識採用ゲートを部分確認。全2011行読了ではない。 |
| `docs/plc-ladder-editing-rules.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/plc-templates/estimate-template.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/plc-templates/io-removal-checklist-template.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/plc-templates/online-consultation-estimate-template.md` | 対象外：GX Works2オンライン相談などWeb経由の初回取引で見積書を作成・編集する。標準の現地工事見積には通常適用しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/plc-templates/operation-spec-template.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/plc-templates/README.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/popular-articles-maintenance.md` | 対象外：人気記事のランキング・週次更新を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/post-approval-publish-pipeline.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/preview-environment.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/air-cylinder-troubleshooting-basic.md` | 対象外：articles/air-cylinder-troubleshooting-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/area-sensor-basic.md` | 対象外：articles/area-sensor-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/earth-leakage-breaker-basic.md` | 対象外：articles/earth-leakage-breaker-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/load-cell-basic.md` | 対象外：articles/load-cell-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/magnetic-switch-basic.md` | 対象外：articles/magnetic-switch-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/no-nc-basic.md` | 対象外：articles/no-nc-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/npn-pnp-basic.md` | 対象外：articles/npn-pnp-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/plc-basic.md` | 対象外：articles/plc-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/README.md` | 適用・本文確認。出典属性・記事別採否・Aの限界・画像非転載を継承。 |
| `docs/reference-notes/reed-switch-basic.md` | 対象外：articles/reed-switch-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/safety-control-basic.md` | 対象外：articles/safety-control-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/self-hold-circuit.md` | 対象外：articles/self-hold-circuit.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/sensor-basic.md` | 対象外：articles/sensor-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/servo-motor-basic.md` | 対象外：articles/servo-motor-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/solenoid-valve-troubleshooting-basic.md` | 対象外：articles/solenoid-valve-troubleshooting-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/start-stop-circuit-basic.md` | 対象外：articles/start-stop-circuit-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/sto-basic.md` | 対象外：articles/sto-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/reference-notes/while-pressed-circuit-basic.md` | 対象外：articles/while-pressed-circuit-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/rule-alignment-v1.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/search-console-content-improvement-log.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/search-data-acquisition-rules.md` | 対象外：検索データ取得・保存・認証・検索に基づく企画改善を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/search-data-implementation-status.md` | 対象外：検索データ取得・保存・認証・検索に基づく企画改善を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/search-data-oauth-setup.md` | 対象外：検索データ取得・保存・認証・検索に基づく企画改善を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/site-shell-implementation.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/site-template-migration-status.md` | 対象外：サイト構造・レイアウト・共通部品・記事制作・生成方式・移行状況を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/site-template-policy.md` | 対象外：サイト構造・レイアウト・共通部品・記事制作・生成方式・移行状況を扱う。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |
| `docs/terminology/README.md` | 適用・本文確認。説明訳と国内用語を区別。用語集本体は今回変更しない。 |
| `docs/tool-article-improvement-template.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は調査資料・索引のみで当該工程を行わない。本文読了とはしない。 |

旧F/PB/FK10〜16の全資料をURL・用語・知識記録で検索し、関連する本文と訂正欄を確認。全過去原典を再取得した意味ではない。R17/E17の53URLは旧docsの完全一致URLとしては未登録だったが、同一著者・既存論点・別URL再掲の独立性は別途扱う。R17-09などを新発信主体としない。

### 検査結果

保存前の自動検査：ルールカタログ構造検査PASS（147文書：必須9・条件付き99・参考39、supporting77、error0）。既存の回帰検査18件PASS。生成indexを再検査して一致。構造検査はsemanticReadingVerified=falseであり、内容読了の保証ではない。

追加照合PASS：53現場URLの一意性、36主体、本文区分の集計、FK17の20 ID/RV17の9 IDの重複なし、A/B/C・JP内訳、8 slug実在、今回追加したローカルリンク/anchor72件、旧4軸索引への追記のみ、旧知識本文のバイト保持、旧catalog登録と設定の保持、取得済み既存153ファイルの不変。変更は新規台帳と4既存文書の計5ファイルのみ。監視リスト・記事HTML・画像・SEO・Workflowへの差分なし。

実行した既存検査は `python scripts/check-rule-catalog.py --write-index` と `python scripts/test-rule-catalog.py` 相当。ローカル部分コピーでは `--root r17 --tree-list r17/tree-list.json` で開始時の全Git treeを与え、未取得の既存ファイルを不存在と誤判定しないようにした。追加の集計・バイト/anchor検査は作業用スクリプトで実施（リポジトリへCIを追加しない）。保存後のGitHub再取得照合・Draft/main状態はPR本文と最終報告に記録する。

未実施・未確認：実機試験、故障原因の第三者追試、全対象機器の精度/校正・現行版照合、全規格(JIS/IEC/ISO)・法令本文の対照、画像・動画の独立診断、原典全外部リンク、取得不可3件の本文、全過去出典の再取得、記事Preview/画面回帰/サイト全体build、本番配信動作試験、週次監視タスクの稼働/追加先参照試験。今回の変更でそれらの機能を動作検証済みとはしない。
