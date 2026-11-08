# 現場知識調査 第16回 — 国際比較・診断の証拠・日本向け適用条件

記録日：2026-11-08（UTC）。対象：`Syasu-pixel/my-site`。採用済みmain `6fb31609e8f92a661447f3b495417c4674fab38c` を基点とする資料追補。作業ブランチは `docs/field-knowledge-round16-2026-11-08`。記事への掲載承認・実機検証・現行規格への包括適合を意味しない。

[資料庫入口](README.md) → [既存4軸索引](field-knowledge-research-2026-11-07.md#cross-index) → 本台帳のID → 原典・国内条件 → 記事別採否へ進む。旧[国内資料](field-knowledge-research-2026-11-07.md)、[海外資料](overseas-field-knowledge-2026-11-07.md)、[第13回](field-knowledge-round13-2026-11-08.md)、[第14回](field-knowledge-round14-2026-11-08.md)、[第15回](field-knowledge-round15-2026-11-08.md)の本文・採否・訂正履歴は変更しない。

## 集計と調査の限界

- 探索49発信主体・64記事URL。内訳は本文取得を試した19主体34URLと、検索抜粋による選別のみ30主体30URL。メーカー照合11URL・6主体（三菱電機、HIOKI、NSK、旭化成エンジニアリング、ABB、横河電機）を別集計する。国籍・法人の独立性の全件調査ではなく、媒体/著者単位の探索数。
- 64URLの確認範囲：本文全体24、一部4、検索抜粋のみ34、取得不可2。抜粋34のうち4は本文取得も試して失敗。本文全体は公開された主記事のテキストの範囲であり、非公開報告・画像・図表・動画まで読んだ意味ではない。
- 重点比較は5主体（DV GROUP 4、Mendata 3、韓国PV日誌3、Juare97 3、森麒機電3）の計16記事本文全体。別にPLC Forumの3スレッドを比較したが、全体1・一部2であり「同じ著者の3記事精読」としない。SPSの5短報は1URL、Orkanは1本文と2取得不可なので3記事精読ではない。
- 新規独立論点3（FK16-001/002/004）：A1/B2/C0、JP-A1/JP-B2/JP-C0。独立とは旧台帳と異なる論点であり、独立実証3件ではない。旧知識補足5（003/005〜008）はA1/B4、JP-A1/JP-B4。C記録8（009〜016）はJP-B3/JP-C5。合計16判定記録はA2/B6/C8、JP-A2/JP-B9/JP-C5。B再検証5件は別表で、すべて旧B維持。集計間の重複加算をしない。
- 出典・条件を追える今回の新規故障エピソードは保守的に12件：R16-01/04/06/08/11/15/21/23/26各1、R16-09の2現場、R16-02のBHKW通信1。解決していないR16-11/15も含み、第三者実証や再発なし12件ではない。未読終盤のフォーラム、一般解説、旧事例、複数写真はこの数に加えない。その他の短報も独立性・経緯不足で数えない。
- 件数目安の60〜100主体・本文深読10〜20主体は未達。一般解説・同じ事例の転載・アクセス不可を増量して達成扱いにしない。国別の診断文化の差を立証できる比較標本は得られていない。

## 地域と言語の扱い

発信拠点を本文・連絡先で確認したのはフランス、ドイツ、スペイン、ブラジル、台湾、ポーランド、チェコ、オランダ、英国。韓国は事例の現場表記、インドネシアはブログの経歴自己記載に基づく。企業所在地を顧客工場の所在地に置き換えない。日本語の個人原典も所在地未確認とし、国内公式資料とは分ける。中国・メキシコ・チリ・インド・タイ・ベトナム等は探索先名称や言語だけで所在地を確定しない。

原語検索は日本語、英語、ドイツ語、フランス語、イタリア語、スペイン語、ポルトガル語、ポーランド語、チェコ語、オランダ語、韓国語、中国語、インドネシア語、タイ語、ベトナム語で実施。検索例は `SPS Fehlersuche Einsatzberichte`、`variateur panne diagnostic`、`inverter disturbi scatto differenziale`、`diagnostyka łożyska`、`인버터 소음 원인`、`變頻器 故障 維修`、`reparo inversor falha`、`mantenimiento diagnóstico motor`、`storingen frequentieregelaar`。検索言語と本文言語は一致しないことがある。英語表示に翻訳された日本語note、英語URLのフランス語本文、ベトナム企業名の英語解説を区別した。

## 原典記事台帳

全行の確認日は上記記録日。発信者の主張は事実認定と分離し、原因・再発期間・初期仮説が記載されない場合は補作しない。日付はページ表示、取得日時や検索エンジンのクロール日は発表日ではない。第三者の実機再現はいずれも今回行っていない。

| ID・発信主体・原典 | 地域／言語／公開更新日 | 種類・本文確認範囲 | 観測・結果と留保 |
|---|---|---|---|
| <a id="r16-01"></a>R16-01・DV GROUP [原典：Dépannage en urgence sur un variateur ABB ACS800 120KW](https://dv-group.com/etudes-de-cas/depannage-en-urgence-sur-un-variateur-abb-acs800-120kw/) | 仏・修理拠点記載／現場国未確認／仏／2023-09-05 | **全体**・修理企業事例。主記事58–90行。関連記事・画像は対象外 | 予備品も故障し、出力部と駆動回路を修理、負荷試験後復旧と報告。二台が壊れた起点は不明。表題kWと本文kVAの不一致があるため容量を一般化しない。 |
| <a id="r16-02"></a>R16-02・SPS-Feuerwehr / blue automation [原典：Einsatzberichte: SPS Feuerwehr Rettungseinsätze im Überblick](https://www.sps-feuerwehr.de/einsatzberichte) | 独・Rennerod表記／各現場国未確認／独／日付表示未確認 | **全体**・出張対応企業の短い5事例。再取得で本文5節を確認。1 URLであり5記事ではない | バイト順、OPC版、ドライブ設定など異なる原因層の短報。波形や版の組合せの詳細はない。第15回は探索のみだった原典を今回本文確認。 |
| <a id="r16-03"></a>R16-03・PLC Forum [原典：Problema modbus plc-inverter - S7-1500 - PLC Forum](https://www.plcforum.it/f/topic/308406-problema-modbus-plc-inverter/) | 投稿者所在地未確認／伊／2023-04-04〜07 | **一部**・技術者フォーラム。冒頭の投稿本文。終盤は検索抜粋のみ・再取得失敗 | S7-1500・変換器・複数INVTで、モータ運転時に通信不調。最終原因・顧客設備での完了試験は本文で未確認。保護接地切離しの提案は不採用。 |
| <a id="r16-04"></a>R16-04・Suministros Mendata [原典：Variador con dos fallos a la vez: diagnóstico antes de cambiarlo y reparación gestionada](https://mendata.com/index.php?Opcion=Noticias&id=5) | 西・Cantabria連絡先／現場国未確認／西／2026-06 | **全体**・修理企業事例。主記事全文。写真の独立診断なし | ACH580の二警報を、著者は内部電流センサ損傷と説明。客先のモータ点検と予備機での復旧は報告情報であり、第三者測定記録はない。 |
| <a id="r16-05"></a>R16-05・DV GROUP [原典：Réparation en urgence d'un moteur (200KW) d'extrudeuse à la suite d’une mesure vibratoire](https://dv-group.com/etudes-de-cas/reparation-en-urgence-dun-moteur-200kw-dextrudeuse-a-la-suite-dune-mesure-vibratoire/) | 仏・拠点表記／現場国未確認／仏／2024-11-28 | **全体**・修理企業事例。主記事51–75行 | 押出機モータを停止前の振動検査から整備へ。整備後の振動再測定を説明するが、欠陥の種類・値は非掲載。 |
| <a id="r16-06"></a>R16-06・DV GROUP [原典：Moteur Siemens 450 KW avec mode de refroidissement à eau](https://dv-group.com/etudes-de-cas/moteur-siemens-450-kw-avec-mode-de-refroidissement-a-eau/) | 仏・拠点表記／現場国未確認／仏／2023-09-01 | **全体**・修理企業事例。主記事50–78行 | 水冷モータ発熱後に巻線と冷却系をまとめて修理。冷却だけが原因だったとは切り分けられない。 |
| <a id="r16-07"></a>R16-07・DV GROUP [原典：Contrat de suivi vibratoire](https://dv-group.com/en/etudes-de-cas/contrat-de-suivi-vibratoire-offline/) | 仏・製紙工場と本文記載／仏（URLはen）／2023-08-29 | **全体**・保全契約企業の実務報告。主記事50–97行 | 回転機群を定期測定。共振への補修提案と、実施済みの修理結果を区別する。宣伝上の故障削減率は検証対象外。 |
| <a id="r16-08"></a>R16-08・Orkan [原典：Reparo de inversor CDX48 com saída em curto e teste com carga — Case Orkan](https://www.orkan.com.br/casos/reparo-inversor-cdx48-bloco-igbt) | 伯・サイト所在地／現場国未確認／葡／日付なし・本文に2025年11月末 | **全体**・修理企業の公開事例要約。公開ページの本文全体。有料・メール請求の詳細報告書は未取得 | 油汚染、出力短絡と駆動信号欠落を報告。修理後負荷試験あり。汚染から全故障への因果は未立証。内部操作の再現手順は保存しない。 |
| <a id="r16-09"></a>R16-09・태양광 윤대리 [原典：[태양광AS] 태양광 인버터 소음 원인](https://22tomorrow.tistory.com/entry/%EC%97%85%EB%AC%B4%EC%9D%BC%EC%A7%80-%ED%83%9C%EC%96%91%EA%B4%91-%EC%9D%B8%EB%B2%84%ED%84%B0-%EC%86%8C%EC%9D%8C-%EC%9B%90%EC%9D%B8) | 韓国の現場を本文記載／著者所在地未確認／韓／2023-12-27 | **全体**・個人のPV業務日誌。公開本文全体。写真未精査 | リアクトル音とリレー周辺音の二現場。電圧や接続部を別々に疑った記録。部品表現の揺れ、負荷条件、長期再発は不明。PV機器をモータ用VFDと混同しない。 |
| <a id="r16-10"></a>R16-10・Suministros Mendata [原典：Verificar antes de pedir: un motorreductor de repuesto cuya placa no se correspondía con la máquina](https://mendata.com/index.php?Opcion=Noticias&id=4) | 西・連絡先／現場国未確認／西／2026-05 | **全体**・修理企業事例。主記事全文 | ギヤモータ銘板と軸寸法・減速比が不一致。過去にモータ部だけ交換されていたと報告。回転数からの比の丸めは整合しないため数値手順にしない。 |
| <a id="r16-11"></a>R16-11・Suministros Mendata [原典：Filtros que revientan por golpes de ariete: de una consulta online a un nuevo cliente, sin pisar la planta](https://mendata.com/index.php?Opcion=Noticias&id=7) | 西・連絡先／現場国未確認／西／2026-06 | **全体**・企業の相談・提案記録。主記事〜71行 | ポンプ制御追加後も水処理部が破損。著者は下流の急閉弁を疑い機器を提案・出荷。設置後評価は記載なし。圧力計の応答速度も不明。解決済みにしない。 |
| <a id="r16-12"></a>R16-12・Orkan [原典：Reparo inversor WEG CFW09 180A parado（リンク表題）](https://www.orkan.com.br/casos/reparo-inversor-weg-cfw09-180a-parado) | 伯・サイト所在地／現場国未確認／葡／未確認 | **取得不可**・修理企業事例候補。リンク題名のみ・取得失敗 | 内容を知識の根拠にしない。 |
| <a id="r16-13"></a>R16-13・Orkan [原典：Reparo Siemens S120 motor module contaminação óleo（リンク表題）](https://www.orkan.com.br/casos/reparo-siemens-s120-motor-module-contaminacao-oleo) | 伯・サイト所在地／現場国未確認／葡／未確認 | **取得不可**・修理企業事例候補。リンク題名のみ・取得失敗 | 内容を知識の根拠にしない。 |
| <a id="r16-14"></a>R16-14・태양광 윤대리 [原典：[업무일지] 태양광 회로에 전압 차이가 발생한 이유(온도)](https://22tomorrow.tistory.com/entry/%EC%97%85%EB%AC%B4%EC%9D%BC%EC%A7%80-%ED%98%84%EC%9E%A5%EC%97%90%EC%84%9C-%EC%8A%A4%ED%8A%B8%EB%A7%81-%EC%A0%84%EC%95%95%EC%B0%A8%EC%9D%B4%EA%B0%80-%EB%B0%9C%EC%83%9D%ED%96%88%EB%8D%98-%EC%9D%B4%EC%9C%A0-%EC%98%A8%EB%8F%84-%EC%98%81%ED%96%A5) | 著者所在地未確認／韓国語業務日誌／韓／2023-12-26 | **全体**・個人のPV業務日誌。公開本文全体 | PVストリング電圧差を温度に帰した記録。温度・日射の同時測定がなく、一定温度係数や一般ガス則による説明は採用しない。 |
| <a id="r16-15"></a>R16-15・태양광 윤대리 [原典：[태양광AS] 태양광 전기세 폭탄 / 태양광이 원인이다?](https://22tomorrow.tistory.com/entry/%ED%83%9C%EC%96%91%EA%B4%91AS-%ED%83%9C%EC%96%91%EA%B4%91-%EC%A0%84%EA%B8%B0%EC%84%B8-%ED%8F%AD%ED%83%84-%ED%83%9C%EC%96%91%EA%B4%91%EC%9D%B4-%EC%9B%90%EC%9D%B8%EC%9D%B4%EB%8B%A4) | 韓国の住宅事例／著者所在地未確認／韓／2023-12-17 | **全体**・個人のPV業務日誌。公開本文全体 | PVを疑った相談から家側変圧器系統の絶縁異常へ。変圧器本体と下流機器のどちらかは未解決、電気料金との因果も未実証。 |
| <a id="r16-16"></a>R16-16・森麒機電 [原典：變頻器該維修還是更換？看停機風險與剩餘支援｜森麒機電](https://www.qingqimep.com/blog/vfd-replace-or-repair/) | 台湾・新北市連絡先／繁体中／2026-10-16 | **全体**・企業一般解説・同一事例参照。公開本文全体 | R16-26の排風機更新を再利用。修理と更新の判断資料として読むが独立した故障事例に数えない。 |
| <a id="r16-17"></a>R16-17・Utrzymanie Ruchu / UE Systems [原典：Case Study: diagnostyka łożyska tocznego o niskiej prędkości obrotowej – ultradźwiękowa detekcja uszkodzeń - Utrzymanie Ruchu](https://utrzymanieruchu.pl/case-study-diagnostyka-lozyska-tocznego-o-niskiej-predkosci-obrotowej-ultradzwiekowa-detekcja-uszkodzen/) | ポーランド媒体／現場国未確認／波／2020-12-02 | **全体**・メーカー事例の紹介。本文251–283行・画像未精査 | 低速炉軸受の超音波事例。旧FK13-005とは別設備（炉と搬送）であり、同一事例と断定しない。メーカー紹介の測定条件・正常比較という論点は旧F-046/047と重複。現場国は不明。 |
| <a id="r16-18"></a>R16-18・PLC Forum [原典：Più motori sotto inverter, scatto differenziale - Inverter AC - PLC Forum](https://www.plcforum.it/f/topic/311395-pi%C3%B9-motori-sotto-inverter-scatto-differenziale/) | 投稿者所在地未確認／伊／2023-07-10〜19 | **一部**・技術者フォーラム。冒頭から約524行まで。終盤未取得 | 複数モータの台数で漏電保護が動作。投稿者は総配線長を疑うが、見積長と「解決したようだ」という報告に留まり、最終変更は不明。FK12-005の補足。 |
| <a id="r16-19"></a>R16-19・PLC Forum [原典：problemi con inverter - disturbi - Inverter AC - PLC Forum](https://www.plcforum.it/f/topic/16584-problemi-con-inverter-disturbi/) | 投稿者所在地未確認／伊／2002-12-21〜24 | **全体**・技術者フォーラム。表示されたスレッド全投稿 | PT100変換信号がインバータの状態に伴い変動。回答者の別装置での改善談を、質問者の解決結果と混同しない。 |
| <a id="r16-20"></a>R16-20・ESOS [原典：AKTUALITY - ESOS](https://www.diagnostikastroju.cz/aktuality/) | チェコ・Ostravaサイト表記／捷／複数年・対象旧記事2020-10-22 | **一部**・企業ニュース一覧。上部の新着本文のみ。電食の旧項目は検索抜粋 | 一つの一覧URL。旧事例の原因や対策は本文未確認、独立事例として採用しない。 |
| <a id="r16-21"></a>R16-21・Juare97 [原典：plc compact logix tidak bisa di download ulang dan butuh soft reset dari tombol reset di controller ／ Juare97's Blog ~ berbagi pengalaman & pengetahuan](https://juare97.wordpress.com/2022/10/03/plc-compact-logix-tidak-bisa-di-download-ulang-butuh-soft-reset/) | インドネシアの経歴自己記載／現場国未確認／尼／2022-10-03 | **全体**・個人技術者ブログ。主記事101–130行 | CompactLogix交換モジュールとツール版の問題が併存。リセットと再転送を含む複数変更後復旧とするが、寄与は分離されていない。 |
| <a id="r16-22"></a>R16-22・Frazer-Nash Consultancy [原典：Investigation of bearing failure case study ／ Frazer-Nash Consultancy](https://www.fnc.co.uk/resources/investigation-of-bearing-failure-case-study/) | 英国・サイト所在地／現場国未確認／英／表示未確認 | **全体**・技術コンサル企業事例。主記事88–115行 | 負荷と前回改造を関連付ける発電機軸受事例。旧R14-20/FK14-006と完全に同じ原典を再読した記録。 |
| <a id="r16-23"></a>R16-23・マサマサ [原典：センサを3個交換したのに直らない。そして原因はエア漏れだった話｜マサマサ](https://note.com/masa_sti/n/n098a3021fb33) | 所在地・現場国未確認（日本語）／日／2026-07-08 | **全体**・個人の保全体験談。公開本文全体 | センサを複数交換して再発し、動作遅れとエア漏れへ着目。修繕後復旧とするが、圧力・時系列・長期再発の記録なし。旧切分け知識への補足。 |
| <a id="r16-24"></a>R16-24・Juare97 [原典：Update Software Rockwell RSLogix5000 versi 20.05 ／ Juare97's Blog ~ berbagi pengalaman & pengetahuan](https://juare97.wordpress.com/2022/07/15/update-software-rockwell-rslogix5000-versi-20-05/) | インドネシア経歴／現場国未確認／尼／2022-07-15 | **全体**・個人技術者ブログ。公開本文全体 | RSLogix 20の小版とOS組合せの経験。Rockwellの互換表は今回未確認、推奨版を現行全機へ流用しない。 |
| <a id="r16-25"></a>R16-25・Juare97 [原典：Rslogix5000 versi 20 log on ke Factory Talk Network ／ Juare97's Blog ~ berbagi pengalaman & pengetahuan](https://juare97.wordpress.com/2022/11/12/rslogix5000-versi-20-log-on-ke-factory-talk-network/) | インドネシア経歴／現場国未確認／尼／2022-11-12 | **全体**・個人技術者ブログ・他投稿引用。主記事89–112行 | FactoryTalk認証設定の体験。解決案はPLCTalk投稿を引用しているため、案自体を別人の独立実証とは数えない。 |
| <a id="r16-26"></a>R16-26・森麒機電 [原典：排風機變頻器更換紀錄｜配線與試運轉｜森麒機電](https://www.qingqimep.com/projects/exhaust-fan-vfd-replacement/) | 台湾・台北市の事例／繁体中／2026-10-16 | **全体**・施工企業事例。公開本文全体 | 排風機のインバータを更新し試運転。旧品の根本原因、長期比較は未確認。端子短絡・自動再起動設定を復旧手順にしない。 |
| <a id="r16-27"></a>R16-27・Wodeckiほか研究チーム [原典：Condition Monitoring of Horizontal Sieving Screens—A Case Study of Inertial Vibrator Bearing Failure in Calcium Carbonate Production Plant - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9964876/) | ポーランド所属・Romanowo現場明記／英／2023-02-12 | **一部**・署名付き実設備研究論文。要旨・測定/検証・結論の一部。方法の途中・図表画像・生データ未確認 | 振動ふるいの緩いカバーの衝撃と軸受成分を分ける研究。軸受型番の本文/図表表記が不一致。こちらで型式・故障原因を確定しない。 |
| <a id="r16-28"></a>R16-28・Inhidrau [原典：Trabajos y diagnósticos de componentes hidráulicos - Inhidrau](https://www.inhidrau.cl/trabajos/) | 所在地未確認（clドメインのみで確定しない）／西／未確認 | **抜粋**・修理企業事例候補。検索抜粋のみ、本文取得失敗 | シリンダ修理候補。観測・復旧結果は未読なので採録しない。 |
| <a id="r16-29"></a>R16-29・Innomotion [原典：Aardsluiting in een draaistroommotor: waarom niet altijd… ／ Innomotion](https://www.innomotion.eu/nl/faq/aardsluiting-in-een-draaistroommotor-waarom-niet-altijd-de-frequentieregelaar-de-schuld-is/) | 蘭・Varsseveld連絡先／蘭／表示未確認 | **全体**・企業一般解説。主本文全体 | 地絡警報をほぼモータ原因と決める一般説明。適合条件を欠く一律試験電圧・抵抗値・確定表現は不採用。特定現場の実証ではない。 |
| <a id="r16-30"></a>R16-30・Van Steen [原典：Servomotor uitlijnfouten herkennen aan trillingen](https://www.vansteenbv.nl/kennisbank/servomotor-uitlijnfouten-herkennen-aan-trillingen/) | 所在地未確認／蘭／2026-04-22（検索表示） | **抜粋**・企業一般解説候補。検索抜粋のみ、本文403 | 芯出しと振動の候補。本文を確認できず、新しい診断根拠にしない。 |
| <a id="r16-31"></a>R16-31・控制网 [原典：变频器干扰案例问题分析及其处理-案例-控制网](https://www.kongzhi.net/index.php/cases/details_2533.html) | 所在地・元著者未確認／簡体中／2007年相当の検索表示・正確日未確認 | **抜粋**・技術事例掲載媒体。検索抜粋のみ、本文取得失敗 | 原典の再掲関係・原因未確認。接地の操作提案は記録しない。 |
| <a id="r16-32"></a>R16-32・Ergenc [原典：Storingen aan een frequentieregelaar opsporen ／ Ergenc](https://www.ergenc.com/kennis/installaties/storingen-aan-een-frequentieregelaar-opsporen/) | 蘭・Hellevoetsluis連絡先／蘭／2026-09-02 | **全体**・企業一般解説。公開本文全体 | インバータとモータ・配線・機械負荷の切分け。固有の故障経緯はなく、既存の切分け知識を補う参照候補。 |
| <a id="r16-33"></a>R16-33・森麒機電 [原典：跳電排查與絕緣檢測紀錄｜迴路及接點｜森麒機電](https://www.qingqimep.com/projects/electrical-safety-inspection/) | 台湾・連絡先／写真各現場未確定／繁体中／2026-08-08／更新09-09 | **全体**・複数現場の施工説明。公開本文全体。画像による判断なし | 複数写真を一つの故障経過に組み立てない。跳電という表現から漏電と過負荷を決めない。 |
| <a id="r16-34"></a>R16-34・SINE México [原典：Mantenimiento predictivo de motores eléctricos: Guía para es](https://sinemexico.com.mx/blog/mantenimiento-predictivo-de-motores-electricos-guia-para-estructurar-un-plan-en-plantas-in) | 所在地未確認（名称・検索表示はメキシコ）／西／未確認 | **抜粋**・企業保全解説候補。本文はiframeだけ、検索抜粋のみ | モータ保全の候補。大容量機の事例本文は未確認。 |

## 探索のみの30主体

以下は全件「検索抜粋のみ」。掲載日・所在地・全本文・技術整合性は未確認、採用候補の数には加えない。検索結果に現れたことを調査完了にしない。元記事URLは追跡可能性のため残す。

| 探索ID・主体 | 言語・原典URL | 選別理由・次の確認 |
|---|---|---|
| E16-01・Industrie Maintenance | 仏・[Commande numérique CNC en panne : diagnostic et remplacement](https://industriemaintenance.fr/maintenance-175-commande-numerique-cnc-panne-diagnostic-remplacement) | 一般修理案内。個人の経緯・原測定未確認。 |
| E16-02・INOMATEX | 仏・[Post ／ INOMATEX](https://www.inomatex.com/en/post/top-10-problemes-automatisme-frequents-comment-les-eviter) | 一般トラブル解説。本文・固有事例は未読。 |
| E16-03・Elektroonline | 波・[Diagnostyka drganiowa silników elektrycznych - SILNIKI ELEKTRYCZNE - POMIARY EKSPLOATACYJNE - EKSPLOATACJA URZĄDZEŃ - DIAGNOSTYKA - ENERGIA DRGAŃ - WIBROMETR - ŁOŻYSKA TOCZNE - CREST FACTOR](https://elektroonline.pl/a/7179%2CDiagnostyka-drganiowa-silnikow-elektrycznych%2C%2CElektrotechnika) | 振動の専門解説候補。旧規格の現行適用は未確認。 |
| E16-04・Info Industrielle | 仏・[Servomoteur ou variateur CNC en panne : réparer"'e ou remplacer ?](https://www.info-industrielle.fr/equipement-industriel/servomoteur-ou-cnc/) | 修理対更新の一般説明。原事例は未読。 |
| E16-05・Napędy i Sterowanie | 波・[napędy i sterowanie](https://nis.com.pl/wp-content/uploads/userfiles/stare_wydania/nis_2.2019.pdf) | 専門誌PDF。本文未読、執筆主体の同定は保留。 |
| E16-06・壹讀 | 繁体中・[〖舉例說明〗PLC項目調試模擬量被干擾怎麼辦？ - 壹讀](https://read01.com/MJ0N6mK.html) | 集約・転載媒体。原著者を確認できず根拠にしない。 |
| E16-07・M.E.T | 韓・[M.E.T Co.,ltd ☏+82-42-934-8257: [PARKER 수리] PARKER 690-432160C0-B00P00-A400 인버터 출력 불평형 및 SMPS 노이즈 정밀 보정 사례 ／ (주)엠이티](https://met8257.blogspot.com/2026/09/parker-parker-690-432160c0-b00p00-a400.html) | 企業修理記録候補。写真・試験結果の裏付け未読。 |
| E16-08・kanonxkanon | 韓・[[인버터] 인버터 알람과 고장코드의 이해｜알람 발생 원인과 현장 점검방법](https://kanonxkanon.tistory.com/m/7571) | 警報一般解説。独立した現場記録か未確認。 |
| E16-09・elecsignal-ai | 韓・[인버터 구조 및 고장 진단](https://elecsignal-ai.tistory.com/133) | 一般解説。執筆経験・根拠未確認。 |
| E16-10・AXION | 泰・[ซ่อมอินเวอร์เตอร์ ตรวจเช็ก และเปลี่ยนรุ่นทดแทน ／ AXION](https://axiondrive-th.com/inverter-repair/) | 修理サービス案内。故障の観測記録未読。 |
| E16-11・KV E-Hospital | 泰・[รับซ่อม Inverter VFD ／ KV E-Hospital](https://kvehospital.com/service/inverter) | サービス案内。単独の実体験として計上しない。 |
| E16-12・ČVUTリポジトリ | 捷・[Detekce poruch ložisek](https://dspace.cvut.cz/entities/publication/c35edd9a-ad8d-4956-ad3d-9821acc739af) | 学位研究候補。実設備と模擬信号の区別は本文未確認。 |
| E16-13・VUTリポジトリ | 捷・[Diagnostika vibrací strojů při kusových zkouškách; Ing. Tomáš Kohutek (FSI 2016 - 101224) – VUT](https://www.vut.cz/studenti/zav-prace/detail/101224?zp_id=101224) | 試験時振動の学位研究。本文未読。 |
| E16-14・Adash | 英・[Which measurements should I take?](https://adash.com/vibration-analysis/which-measurements-should-take/) | メーカーの測定解説。独立経験談ではない。 |
| E16-15・IEE-Business | 尼・[Apa Saja Gejala Kerusakan Inverter yang Umum dan Metode Pemeriksaannya? Panduan Lengkap - IEE-Business](https://www.iee-business.com/id/knowledge/what-are-common-inverter-fault-symptoms-inspection-methods-4662) | 翻訳一般解説。元著者・所在地未確認。 |
| E16-16・Parker Vietnam | 英・[🧠 Why is the inverter running but the motor not rotating ? - Parker Vietnam](https://parkervietnam.com/en/faqs/why-is-the-inverter-running-but-the-motor-not-rotating/) | 現地語ではなく英語。原因割合を採用しない。 |
| E16-17・VŠB-TUO教材 | 捷・[Microsoft Word - Skripta Technická diagnostika II - Vibrodiagnostika.docx](https://www.fs.vsb.cz/export/sites/fs/340/.content/galerie-souboru/vyuka/Technicka-diagnostika-II-Vibrodiagnostika-skripta.pdf) | 教育資料。実故障例と数えない。 |
| E16-18・I-care | 蘭・[Wat is trillingsanalyse in voorspellend onderhoud? - I-care](https://www.icareweb.com/nl/hulpbronnen/predictief-onderhoud/wat-is-trillingsanalyse-voorspellend-onderhoud/) | 予知保全の一般解説。事例原典未確認。 |
| E16-19・maint-hub | 日・[工場設備保全・技術者コミュニティ](https://theshare.info/maint-hub/itm_6) | 第15回でも留保した体験談風候補。実在事例の確認なし。 |
| E16-20・株式会社STE | 日・[The sensor is lit, but the PLC input is not receiving a signal. 7 points to check on-site｜株式会社STE](https://note.com/ste_info/n/n42db96e59685?hl=en) | 英語表示の検索結果を海外技術者と誤認しない。元の日本語本文未読。 |
| E16-21・マテハンロジ研究所 | 日・[パワーモーラ故障の典型パターンと初動判断 - マテハンロジ研究所](https://matehan-logi.com/power-moller-trouble-first-response/) | 既存探索主体。原因一覧を新しい経験談に数えない。 |
| E16-22・Naoの逃げ切り戦略 | 日・[〖保存版〗センサーが反応しない！ランプ点灯・断線・電圧降下…原因を見抜く5つの診断手順 ／ Naoの逃げ切り戦略](https://nao-tech-memo.com/sensor-troubleshooting-diagnosis/) | 一般診断説明。断定の根拠・本文未確認。 |
| E16-23・VAC Technology | 越・[Sửa Chữa Biến Tần Công Nghiệp & Cung Cấp Biến Tần Chính Hãng ／ VAC Technology – CÔNG TY TNHH TMDV VAC](https://vactechnology.vn/sua-chua-bien-tan-cong-nghiep-cung-cap-bien-tan-chinh-hang-vac-technology) | 企業サービス・動画候補。動画未視聴。 |
| E16-24・TPQI | 泰・[TPQI-NET PROFESSIONAL QUALIFICATION](https://tpqi-net.tpqi.go.th/qualifications/unitinfo/20498) | 職業能力・資格資料。故障事例ではない。 |
| E16-25・Motor Makers India | 英・[Motor Troubleshooting: Overheating, Burnt Winding, Hum](https://www.motormakersindia.com/learn/motor-troubleshooting) | 一般故障説明。現場と国は名称だけで確定しない。 |
| E16-26・工場を止めない人 | 日・[The sensor is not responding!!｜工場を止めない人｜設備保全・サービスエンジニア](https://note.com/super_borage5985/n/n3dbfe488bb3c?hl=en) | 翻訳検索表示。本文未読、所在地未確認。 |
| E16-27・G-nerando掲載研究 | 西・[Propuesta de estandarización y mejora del proceso de mantenimiento correctivo de cilindros hidráulicos en una empresa industrial ecuatoriana: Proposal for Standardizing and Improving the Corrective Maintenance Process of Hydraulic Cylinders in an Ecuadorian Industrial Company](https://revista.gnerando.org/revista/index.php/RCMG/article/view/1438) | 改善提案・模擬評価を実施工後の改善と数えない。全文未読。 |
| E16-28・Harcki | 西・[Cilindro hidráulico deriva con fuga interna y carga lateral ／ Diagnóstico técnico](https://harcki.com/sectores/neumatica-hidraulica/diagnostico/actuadores-carga-lateral-drenaje-fuga-interna) | 一般診断説明。具体現場の経緯未読。 |
| E16-29・Shandong Everpower | 西・[Cómo comprobar si el cilindro hidráulico tiene fugas internas - Shandong Everpower](https://cylinder-hydraulic.com/es/how-to-check-if-hydraulic-cylinder-is-leaking-internally/) | 製品企業の別言語解説。スペイン語圏の現場と断定しない。 |
| E16-30・ScienceDirect掲載研究 | 英・[Failure investigation of a taper roller bearing: A case study](https://www.sciencedirect.com/science/article/pii/S2213290213000163) | 軸受損傷論文候補。著者・全文・再掲関係は未確認。 |

## メーカー一次資料の照合

11URLは、FAQ等の本文全体6、一部3、抜粋のみ2。照合した技術命題と、故障事例そのものの第三者実証を分ける。JIS/IEC/ISO・法令の最新版全文比較は実施していない。規格番号やATEX表示だけから国内使用可否を断定しない。

| 検証ID・原典 | 確認範囲・版 | 確認できた命題と適用限界 |
|---|---|---|
| <a id="v16-01"></a>V16-01 [三菱電機・配線長について](https://fa-faq.mitsubishielectric.co.jp/faq/show/17674?site_domain=default) | 全体：質問・回答・対象シリーズ。2013-09-06 | 並列モータ配線の合算。A700/D700/E700/F700/F700P/F700PJのFAQ。Delta MS300や任意長さの可否を保証しない。 |
| <a id="v16-02"></a>V16-02 [HIOKI・PVメガーと一般的な絶縁抵抗計との違い](https://hiokisupport.zendesk.com/hc/ja/articles/9370483214479--%E7%B5%B6%E7%B8%81%E6%8A%B5%E6%8A%97%E8%A8%88-PV%E3%83%A1%E3%82%AC%E3%83%BC%E3%81%A8%E4%B8%80%E8%88%AC%E7%9A%84%E3%81%AA%E7%B5%B6%E7%B8%81%E6%8A%B5%E6%8A%97%E8%A8%88%E3%81%A8%E3%81%AE%E9%81%95%E3%81%84%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6) | 全体：FAQ本文。日付の更新表示は変動するため版番号なし | IR4053のPVΩ機能と一般測定の違い。自己発電の影響を扱う機能の説明のみ。PV配線作業や一般メガーの活線使用を許可する根拠ではない。 |
| <a id="v16-03"></a>V16-03 [三菱電機・文字コード表示順の入れ換え](https://fa-faq.mitsubishielectric.co.jp/faq/show/24650?site_domain=default) | 全体：FAQ質問回答。2019-05-14 | GOT2000/SoftGOTとGT Designer3 1.100E以降の文字列。BHKWの数値データ型やPROFIBUSバイト順を直接検証しない。 |
| <a id="v16-04"></a>V16-04 [旭化成エンジニアリング・振動診断基礎講座 第5回](https://www.asahi-kasei.co.jp/aec/techcourses/shindoshindan/5th.html) | 全体：講座本文、表示日なし | 測定位置と測定方法。剛性のある測定部、機械のつながりに沿った観測。個別装置の減衰倍率や取付変更を承認しない。 |
| <a id="v16-05"></a>V16-05 [HIOKI・クランプロガーLR5051](https://www.hioki.com/jp-ja/products/compact-data-loggers/compact/id_6076) | 検索抜粋のみ／本文403 | 統計値・測定方式の制約に関する検索表示だけ。FK13-010の応答条件を本文で解決したとはしない。 |
| <a id="v16-06"></a>V16-06 [ABB・ACH580-01 quick installation and start-up guide](https://library.e.abb.com/public/a9da4be4891c45ee9cee0c7e1aa4ca4a/MUL_ACH580-01_QISG_IEC_A.pdf) | 検索抜粋のみ／PDF本文取得不可 | 2281/2330の警報候補。正確なFW版・内部検出回路は未照合。個人/修理企業のセンサ故障説明を実証する資料として使わない。 |
| <a id="v16-07"></a>V16-07 [NSK・D-VibA10取扱説明書](https://www.nsk.com/content/dam/nsk/common/products/condition-monitoring/d-viba10-support/WirelessVibrationDiagnosticDevice_%20D-VibA10_instruction%20manual_jp_ver.2.0_J.pdf) | 一部：表紙ver.2.0（2023-03）、Q4-20/21（印刷p125付近） | 型番・回転速度等の診断設定が実設備と違うと、ピークがあってもOKとなる場合のFAQ。全アルゴリズム・全運転域は未読。 |
| <a id="v16-08"></a>V16-08 [NSK・BearingDoctor BD-2取扱説明書](https://www.nsk.com/content/dam/nsk/common/products/condition-monitoring/bd-2-support/BearingDoctor_BD-2_manual_ver.3.1.pdf) | 一部：表紙・Q2-1〜4（印刷p6–8）。URLは3.1、表紙表示は1.3 | 軸受近傍の剛性、カバーや材質による観測への影響。版表示不一致は未解消。旧ISO10816の数値を現行の軸受欠陥基準として流用しない。 |
| <a id="v16-09"></a>V16-09 [三菱電機・FR-BLFの取付位置と効果](https://fa-faq.mitsubishielectric.co.jp/faq/show/11069?site_domain=default) | 全体：FAQ回答、2012-02-27／更新2025-03-11 | 同じフィルタでも入力側・出力側で扱う伝搬経路が異なる。任意フィルタの付替えを勧める説明ではない。 |
| <a id="v16-10"></a>V16-10 [三菱電機・インバータのノイズ対策](https://fa-faq.mitsubishielectric.co.jp/faq/show/11573?site_domain=default) | 全体：質問・回答・対象。2012-02-27 | FR-A220とST-581流量計の質問。配線経路変更で改善しない条件にも他経路の候補を残す。旧型FAQで、現行全機の施工規則にはしない。 |
| <a id="v16-11"></a>V16-11 [横河電機・Exaopc](https://www.yokogawa.co.jp/solutions/products-and-services/control/control-and-safety-system/distributed-control-systems-dcs/centum-opc-server-exaopc/) | 一部：R3.82（2025-11）の機能/OS・CENTUM対応節、前版の一部 | OPC ClassicとUAのパッケージ・対応OSに差があることを確認。ドイツ事例のOPC製品・原因やRockwell互換性の証明ではない。一般仕様書のサインイン先は未取得。 |

## 新規知識と既存知識の補足

Aは下記で限定した技術命題だけの採用検討資格。Bは原典の報告として保管するが掲載前の条件確認が必要。JP判定は機器/規格/安全条件の移植可能性であり、経験談の実在証明ではない。全記録の共通安全条件：危険源の隔離・機械メーカーの許可と有資格者の管理を前提とし、通電測定、内部改造、保護設定変更、接地切離し、強制出力、リセット操作は手順化しない。顧客識別情報・画像・本文の長文引用を保存しない。

| 知識ID | 論点・新規性 | A/B/C | JP判定 | 原典・検証 | 対応slug |
|---|---|---|---|---|---|
| FK16-001 | 複数警報が一つの測定部に依存する可能性・新規 | B | JP-B | [R16-04](#r16-04)、[V16-06](#v16-06) | `inverter-basic` |
| FK16-002 | 通信成立と受信値のバイト解釈を分ける・新規 | B | JP-B | [R16-02](#r16-02)、[V16-03](#v16-03) | `got-touch-panel-basic` |
| FK16-003 | 自動診断のOKとモデル入力条件・旧知識補足 | A | JP-A | [R16-27](#r16-27)、[V16-07](#v16-07) | `equipment-maintenance-career` |
| FK16-004 | 自己発電対象と専用絶縁測定機能・新規 | A | JP-A | [R16-15](#r16-15)、[V16-02](#v16-02) | `tester` |
| FK16-005 | 複合品の銘板が指す交換済み部位・旧知識補足 | B | JP-B | [R16-10](#r16-10) | `three-phase-induction-motor-basic` |
| FK16-006 | OS復元とミドルウェア版の組合せ・旧知識補足 | B | JP-B | [R16-02](#r16-02)/21/24/25、[V16-11](#v16-11) | `got-touch-panel-basic` |
| FK16-007 | 複数モータの総配線と台数依存・旧知識補足 | B | JP-B | [R16-18](#r16-18)、[V16-01](#v16-01) | `inverter-basic` |
| FK16-008 | 対策部品名とノイズの伝搬経路・旧知識補足 | B | JP-B | [R16-03](#r16-03)/19、[V16-09](#v16-09)/10 | `analog-input-basic`、`inverter-basic` |

<a id="fk16-001"></a>
### FK16-001 複数警報を独立した故障証拠の数にしない

- 症状・条件：R16-04のポンプ用ACH580で地絡系と電流校正系の警報。最初は本体か外部機器かを問う構成で、担当者が確信した初期原因は未記載。
- 観測→判断→結果：客先の外部点検と予備機復旧を受け、著者は内部電流測定部の損傷と説明。二警報が同じ観測系に依存し得るという編集上の論点を抽出する。
- B/JP-B：V16-06は検索抜粋まで。センサ損傷の測定証拠、FW版、実際の警報生成論理、長期再発を確認できない。配線接触など別要因も独立に排除できない。国内製品で同じ番号・同じ構造とはしない。
- 差分：FK15-002は警報名と検出器の構成、FK15-009は図面と現物が共通誤りを持つ話。今回は複数警報間の観測依存を限定的な新規候補とする。初心者には「警報二つ＝原因二つ/証拠二票」ではないと説明する候補。異常表示を分けて読む既存記事への補足に留める。

<a id="fk16-002"></a>
### FK16-002 信号が届くことと値の解釈が合うことは別

- 症状・条件：R16-02のBHKW通信で値が正しく受け渡されず、著者は二バイトの順序変更で改善したと記す。初期に疑った具体項目やパケットは非掲載。
- B/JP-B：型、符号、語長、スケーリング、通信変換器設定は未確認。V16-03は文字列の表示順だけで、同じ通信障害の裏付けにはならない。
- 差分・教訓：FK12-011のチャンネル識別とは別に、正しいアドレスでも内容解釈が違う可能性。国内機器は両側のデータ表で照合し、バイト入替を共通の修正手順にしない。`got-touch-panel-basic`の参照先説明の補足候補。

<a id="fk16-003"></a>
### FK16-003 自動診断の入力条件を測定値と別に残す

- 原典/観測：R16-27では意図的に振動するふるいで複数振動源を扱う。一方、軸受型番の記述が本文と図表で揃わず、こちらで欠陥周波数を型式確定することはできない。論文が自動診断で誤診したとする記述ではない。
- A/JP-Aの範囲：V16-07のQ4-20/21では、診断入力と実物が違うとOK判定になり得る。測定ログとともに型番・実回転速度・診断設定を保管する論点に限定。製品や許容回転域を超えた一般閾値は作らない。
- 重複：旧FK13-005の型番不足、F-046/047の測定条件へ、公式FAQで確認できた診断ソフトの条件を追加する。**新規独立知識には計上しない。**旧C/JP-Bを変更した意味ではなく、今回限定した公式命題にAを付ける。
- 教訓・安全：表示色だけで実機の安全や健全を保証しない。OKにするための設定変更や運転継続を助言しない。測定器選定・記録教育の補足候補で、詳細振動診断には専用記事が必要。

<a id="fk16-004"></a>
### FK16-004 測定対象の自己発電と測定機能の適合を確認する

- 経験談：R16-15はPV用の絶縁測定器を示すが、測定器型式やPV側健全の詳細値はない。家側の異常原因も未解決。写真から型式を推測しない。
- A/JP-Aの対象：V16-02のIR4053のPVΩ機能は自己発電の影響を扱う説明。普通の絶縁抵抗計と、同じ抵抗単位を表示するだけで互換と判断しないという機能選定の論点のみ。
- 未確認・限界：韓国記事の使用機種がIR4053だったとは確認していない。電力系統・接地方式・PCS条件も未確認。PV用機能をモータ駆動インバータの内部測定へ流用しない。
- 差分：FK10-004の携帯性/校正に対し、対象自身の電源が指示へ影響する専用測定機能。`tester`の「用途で計器を分ける」補足候補であり、配線・測定電圧・接続順序の作業手順は扱わない。

<a id="fk16-005"></a>
### FK16-005 交換された一部分の銘板を全体仕様と思わない

- R16-10は銘板と現物寸法の矛盾から、過去のモータ部交換へ遡った報告。発注前の判断事例であり、運転中の故障解決数には含めない。初期測定器はノギスだが校正・測定姿勢・減速比の不確かさは未確認。
- B/JP-B：国内の該当ギヤモータ型式・構成図を未照合。モータと減速機の識別を分ける教訓としてFK12-006、F-038/039の補足。新規独立論点にしない。対応記事の銘板節に限定し、減速比の現場測定手順を追加しない。

<a id="fk16-006"></a>
### FK16-006 復旧時のソフトウェア構成は一つの版で表せない

- R16-02のOPC短報はOSの戻しだけでは復旧せず、対応するOPC版で改善したとする。[R16-21](#r16-21)/24/25もツール・OS・認証の条件を示すが、同一原因や独立追試ではない。
- B/JP-B：V16-11は国内製品でもパッケージと対応OSに差があることを確認するだけ。原典の互換表・修正履歴・各変更の寄与は不明。
- FK12-002/004、PB-022の復元条件への補足。アーカイブだけでなくOS・ミドルウェア・ツール・CPU/FWを組合せで記録する候補。古い版へのロールバックやセキュリティ条件の緩和を推奨しない。

<a id="fk16-007"></a>
### FK16-007 台数と配線長が同時に変わる条件を記録する

- R16-18の台数依存は、単独モータだけを疑う説明の反例候補。負荷・配線・漏れ電流・保護器の型式が未分離で、投稿者の暫定報告は原因確定ではない。
- B/JP-B：V16-01で合算の考え方は確認できるが、原典のDelta機の数値制限は本文で独立照合していない。既存FK12-005のA（合算原則）を上書きしない。FK10-007の個別モータ保護にも関連するが、保護感度変更やフィルタ無効化は候補から除外。

<a id="fk16-008"></a>
### FK16-008 対策が効かなかった時は経路と試験条件へ戻る

- R16-19は質問者の未解決相談と回答者の別例を分離する。R16-03も終盤未読のため解決済みにしない。電源投入とモータ運転のどちらで変動するかを区別する条件が不足している。
- B/JP-B：[V16-09](#v16-09)/10が示す特定機種の対策経路の違いを照合。海外記事のフィルタ型式・接地・施工をそのまま国内へ移植しない。
- FK10-009/010、F-031の信号・発生条件の補足。フィルタの有無という二値ではなく、入力/出力/信号線のどの経路を扱ったかを履歴に残す候補。万能ノイズ除去手順は作らない。

## 同じ症状の国際比較

以下の地域は発信拠点または明記された現場の範囲。国民性や保全文化の優劣は結論にしない。比較できたのは「何を観測したか」「結果のどこまで公表したか」であり、同一設備を各国で追試した比較ではない。

| 症状・原典/地域と言語 | 設備・条件／観測と判断の違い | 日本向け共通点・異なる条件／留保 |
|---|---|---|
| 異常警報・復旧：[R16-01](#r16-01) 仏、04 西、26 台湾 | 仏は出力/駆動回路の修理、西は内部計測部の説明、台湾は別型式へ更新。いずれも復旧報告だが、故障起点と長期再発は未提示 | 警報履歴と交換履歴を分ける。ABB/旧品/士林の警報番号・電圧・制御方式は互換でない。FK16-001/005、[V16-06](#v16-06) |
| 通信・値がおかしい：[R16-02](#r16-02) 独、03 伊語所在地不明、21 尼語 | BHKWのデータ順、運転時だけのModbus不調、ツール版が絡むPLC復旧は異なる層。後二者からドイツ短報の原因は検証できない | 通信成立・内容解釈・実行環境を別欄にする。V16-03は文字列限定、V16-11は別OPC製品。FK16-002/006/008 |
| 振動・軸受：[R16-07](#r16-07) 仏、27 ポーランド、22 英国発信 | 紙工場の監視、意図的加振のふるい、負荷依存の発電機では正常成分が異なる。測定点・回転数・負荷・前回改造が必要。R16-22は旧原典の再読 | ふるいの大振動を一般モータの閾値へ当てはめない。[V16-04](#v16-04)/07/08。型式表記の不一致・複数変更・改造承認が未解決 |
| 電圧/絶縁の表示と現場状態：[R16-09](#r16-09)/14/15 韓国、29 蘭語一般論 | PV自己発電と三相モータでは対象と測定法が違う。PV温度説は温度測定なし、住宅の異常系統も故障部品は未確定 | V16-02の機能適合を確認。値が表示されたことを正確な条件での測定と同一視しない。FK16-004、C010/011 |
| 交換・対策後も不調：[R16-23](#r16-23) 日本語、18 伊語、11 西 | センサ交換後再発、モータ台数依存、ポンプ制御追加後の圧力問題。最初の対象とは別の動作条件を疑う報告。西の提案には設置後成績がない | 動作時間・台数・下流操作を分ける考え方は参考になる。エア回路・保護器・配管応答の型式仕様未確認。F-031、FK10-016、FK16-007への補足 |

## 現場表現の対照（翻訳候補を国内通称にしない）

12表現を出典の文脈で記録する。既存の語の別言語用例が中心で、日本の新規俗称12語を発見した意味ではない。国内での実際の呼び方が確認できない場合は説明訳とする。

| 原語・言語・用例 | 直訳／自然な説明・正式概念 | 条件・国内使用確認・旧語との関係 | ID・slug |
|---|---|---|---|
| variateur・仏、[R16-01](#r16-01) | 可変装置／ここではモータ用インバータ | PV用とは用途が違う。日本語機器名は既存記事で確認済み、仏の語を国内通称にはしない | FK16-001、`inverter-basic` |
| top 0 vibratoire・仏、[R16-05](#r16-05) | 振動のゼロ起点／整備後の基準測定という説明訳 | ゼロ振動・無故障保証ではない。国内俗称は未確認、旧F-047の基準比較へ | `equipment-maintenance-career` |
| zwei Byte・独、[R16-02](#r16-02) | 二バイト／データ順の文脈 | 国内の「バイト」はV16-03で概念確認、データ型は別確認 | FK16-002、`got-touch-panel-basic` |
| scatto differenziale・伊、[R16-18](#r16-18) | 差動動作／漏電保護の動作という説明訳 | 過負荷と同義ではない。日本の器具形式と保護方式は未確認。旧「サーマルが落ちる」と混同しない | FK16-007、`inverter-basic` |
| disturbi・伊、[R16-19](#r16-19) | 妨害／信号への外乱・ノイズ | 文脈により電磁的以外もあり得る。ノイズの国内表記はV16-09/10 | FK16-008、`analog-input-basic` |
| aardsluiting・蘭、[R16-29](#r16-29) | 大地への短絡／地絡 | 警報表示が実故障部位を証明しない。国内の対象保護器の正式名称は別確認 | FK16-011、`inverter-basic` |
| meggeren・蘭、[R16-29](#r16-29) | メガーで測る／絶縁抵抗測定 | 普通の抵抗レンジと同じではない。国内のメガー用例はV16-02、原語は国内通称未確認 | FK16-004/011、`tester` |
| motorreductor・西、[R16-10](#r16-10) | 減速機付きモータ／ギヤモータ | モータだけを指す訳にしない。国内型式名称未照合、説明訳。旧機器識別への補足 | FK16-005、`three-phase-induction-motor-basic` |
| golpes de ariete・西、[R16-11](#r16-11) | 衝撃／水撃という説明訳 | 設計条件・波形未確認。「ハンチング」の同義語にしない。国内公式用語の今回照合なし | F-031補足、専用slugなし |
| 도란스・韓、[R16-15](#r16-15) | トランスの口語表現／変圧器 | 当該住宅の変圧器系統を指す。語源・地域全体の慣習は断定せず、日本で同じ発音が通称か未確認 | FK16-004、`tester` |
| 跳電・繁体中、[R16-33](#r16-33) | 電気が跳ぶ／保護器動作・停電の文脈 | 漏電だけを意味しない。日本で「跳電」を通称として使う根拠なし | F-031補足、`inverter-basic` |
| 無熔絲開關・繁体中、[R16-26](#r16-26) | ヒューズのない開閉器／配線用遮断器の説明候補 | 日本の全遮断器と一対一対応させない。対象型式未確認、国内正式用語集への新規登録はしない | FK16-016、専用採用なし |

## 工具・測定器の比較と適合条件

| 対象・用例 | 選定の論点／値と条件の違い | 日本側照合・採否 |
|---|---|---|
| 絶縁抵抗計：[R16-15](#r16-15)/29 | PV自己発電と通常モータの違い。抵抗値が出るだけでは適合を保証しない | [V16-02](#v16-02)、FK16-004。汎用試験電圧・閾値は不採用 |
| 振動計・自動診断：[R16-07](#r16-07)/27 | 本来振動する機械か、欠陥検出か。型番/回転数/測定点の記録 | [V16-07](#v16-07)/08、FK16-003、RV16-01。閾値や計器ランキングにしない |
| 超音波：[R16-17](#r16-17) | 低速の微小衝撃を扱うメーカー事例。別原理のdBを振動速度と比較しない | 当該測定器仕様は未確認。旧F-046/047の補足、FK16-012 |
| ノギス：[R16-10](#r16-10) | 調達仕様と現物寸法の不一致検出。減速比の確認を寸法だけで代用しない | 校正/測定精度未確認、FK16-005。停止状態の現物検査でも適合判断は別 |
| 波形/信号監視：[R16-03](#r16-03)/19 | 通電/運転の状態差・信号経路。波形が掲載されていないためノイズ実証とはしない | [V16-09](#v16-09)/10、FK16-008。オシロの接続条件・CAT適合は未確認、操作手順なし |
| 圧力計：[R16-11](#r16-11) | 最大指示と圧力過渡の時間応答を分ける。設計値と実測ピークの同等性は未確認 | 型式・応答・波形未確認。油圧全般の測定手法へ一般化しない |
| ロガー：旧FK13-010 | 記録間隔と実測周期/応答は別。検索表示だけで短時間変動を保証しない | [V16-05](#v16-05)、RV16-03。本文未取得なのでB維持 |
| クランプ/テスター：[R16-09](#r16-09)/15 | 表示上差がないことと接続部の健全性は別。比較時の負荷・帯域が不明 | 対象型式未確認。絶縁抵抗計の代用にはしない。旧FK13-012の補足 |

ダイヤル/レーザー芯出し、トルクレンチ延長、圧着工具、プーラー、グリースガンについて今回新しい型式適合の裏付けは得られていない。旧FK13/FK14/FK15をそのまま参照し、調査済みの範囲を広げて報告しない。

## 既存Bの再検証（5件）

<a id="rv16-01"></a>
### RV16-01 FK15-006：外側測定への伝達減衰

元B理由は内部からの伝達経路・運転条件一致・損傷との照合不足。追加はV16-04/08とR16-27（旧Allied記事とは独立発信）。取付剛性/材質や複数振動源の影響を追加確認した。旧事例の減衰倍率・実損傷・取付承認は解決していない。**B/JP-B維持**。日本の対象機械の測定点と支持構造を確認するまで改造提案にしない。

<a id="rv16-02"></a>
### RV16-02 FK12-004：片側交換では不変だった通信

元B理由は両側交換による復旧から二つのポート故障を証明できず、版/設定/接触が代替原因に残ること。[R16-02](#r16-02)/21/24とV16-11は別の設備・発信主体で、ソフトウェア条件の交絡を追加する。元のRSView/PLC故障を独立追試した資料ではない。**B/JP-B維持**、国内機器では交換表に版と設定の組合せを加える候補。

<a id="rv16-03"></a>
### RV16-03 FK13-010：短い変動とクランプロガー

元B理由は原典本文未取得・測定応答/モード不明。V16-05を再取得したが403、検索抜粋は増強した裏付けとはしない。独立した海外の同型式実測原典も得られず、**B・国内JP対象外を維持**。次は取扱説明書の該当モード/波形/センサ条件を確保する。新たな事実確認0件の再検証試行として数える。

<a id="rv16-04"></a>
### RV16-04 FK15-002：警報名と実際の位置検出構成

元B理由はNC・検出器型式と信号波形が未確認。R16-04は別企業の警報診断例だが、対象はインバータであって同一NCではない。V16-06も抜粋のみ。類似した教訓は元原因の裏付けにならず、**B・国内JP対象外を維持**。日本の対象軸の構成図・メーカー警報条件がなお必要。

<a id="rv16-05"></a>
### RV16-05 FK14-006：前回改造と負荷依存の振動

元B理由は整列・温度・油状態の独立確認と定量成績が不足。R16-22は旧 `editor.fnc.co.uk` から `www.fnc.co.uk` の同じ記事で、新たな独立証言ではない。V16-04の機械連結に沿った観測は考え方の補足に留まる。**B/JP-B維持**。国内発電設備の設計/承認/負荷条件へ戻る必要がある。

5件中、別発信主体/公式資料で論点を補足できたのはRV16-01/02/04の3件。ただし原因確定・A昇格は0。RV16-03は取得制約、05は同一原典再読。第14回ビート数値の不整合など、今回未選択のBも未解決のまま保持する。

## C：不採用・重複・一般化の除外記録

ここでJP-Cはそのまま国内の方法として採用しない意味。論点重複に付けたJP-Bは国内条件の未確認を示し、危険という意味ではない。

| ID | 対象・理由 | 判定 | 国内判定 |
|---|---|---|---|
| <a id="fk16-009"></a>FK16-009 | [R16-03](#r16-03)/18の保護接地切離し・フィルタ無効化等を一般復旧策にすること。因果確認も安全条件も不足 | C | JP-C |
| <a id="fk16-010"></a>FK16-010 | R16-14の温度未測定の電圧差を温度だけで説明、出力効率との混同、一定係数の流用。原体験は残すが説明は不採用 | C | JP-C |
| <a id="fk16-011"></a>FK16-011 | R16-29の警報からモータ原因をほぼ確定し、一律の絶縁試験電圧・閾値で全機種を判断する説明 | C | JP-C |
| <a id="fk16-012"></a>FK16-012 | R16-17を新しい独立論点とすること。F-046/047の測定条件/比較と重複。旧FK13-005とは別設備で同一故障とは確認していない | C | JP-B |
| <a id="fk16-013"></a>FK16-013 | R16-22は旧R14-20とホスト名が違う同記事。新発見・独立裏付けに数えない | C | JP-B |
| <a id="fk16-014"></a>FK16-014 | [R16-16](#r16-16)/26は同じ排風機更新。2URLを2故障と数えない。R16-33の複数写真も一つの診断物語にしない | C | JP-B |
| <a id="fk16-015"></a>FK16-015 | [R16-04](#r16-04)/07等の出典データを追えない原因割合・削減率を一般統計にすること。R16-11の出荷を改善実証にすること | C | JP-C |
| <a id="fk16-016"></a>FK16-016 | [R16-02](#r16-02)/21/26のリセット・コピー・設定変更を初心者の共通復旧手順にすること。機器構成・保持値・安全条件が不足 | C | JP-C |

## 記事との照合・編集時の差分

mainの実在HTML本文を関連節まで照合。旧メモだけから不足と断定しない。記事は変更していない。

| slug | 既存記事にある説明 | 今回の追加価値／掲載前条件 |
|---|---|---|
| `inverter-basic` | 電源・運転指令・周波数指令・実出力・異常表示・負荷を分ける | FK16-001/007/008。警報の観測依存、総配線、対策経路の補足。既にある「本体と決めない」は新規扱いしない。内部修理・接地手順は主題外 |
| `got-touch-panel-basic` | 画面/PLCの参照先と版の組合せ | FK16-002/006、RV16-02。バイト解釈と実行環境の記録。個別OPC障害は別記事向き、GOTへ手順移植しない |
| `tester` | 測る量と測定器を選ぶ基本 | FK16-004、RV16-03。自己発電と測定モード、ロガー応答。PV専用作業は主題外、対象仕様の注意に限定 |
| `three-phase-induction-motor-basic` | 回転磁界・すべり・銘板と実機仕様の関係 | FK16-005。複合品の銘板の帰属を区別する短い補足候補。ギヤ比の測定方法は別記事候補 |
| `analog-input-basic` | 電圧/電流・配線・PLC表示の対応 | FK16-008。表示変動の発生状態と経路を記録する候補。電磁影響を実証したとは書かない |
| `equipment-maintenance-career` | 保全の役割・記録・技能 | FK16-003、RV16-01/05。測定条件・型番・改造履歴を残す教育例。振動の詳細解析は専用slug未特定 |
| `servo-motor-basic` | フィードバック・検出器の基礎 | RV16-04のみ。新規本文追加の根拠には未到達、元Bを維持 |

## 監視推薦と調査の終了点

[既存監視リスト](field-blog-watchlist.md)の重点・通常・候補を照合。以下4主体はリストの登録と重複しない推薦候補。SPSは第15回の探索候補を今回読んだもので、新発見ブログと呼ばない。今回はリスト・週次タスクを変更せず、追加先を自動巡回できるとの確認もしていない。

| 候補 | 実務性・比較結果 | 更新/アクセス・留保と推薦 |
|---|---|---|
| DV GROUP | 機械/電気の複数実務報告。[R16-01](#r16-01)/05/06/07 | 2023–24年の複数公開記事を確認。現時点の更新頻度・RSS未確認。通常候補、数値効果は別検証 |
| Suministros Mendata | 診断と発注前検証、未完了の相談結果を区別できる | 2026年5–6月の3件公開。継続更新頻度未確認。通常候補、断定や宣伝割合をチェック |
| Juare97 | 3記事でソフトウェア構成と現場復旧の条件を比較 | 2022年記事を確認。現在の更新頻度不明、引用元を独立証言にしない。候補分類が妥当 |
| SPS-Feuerwehr | 異なる診断層を示す5短報 | 公開1ページ・日付不明。詳細ログ不足のため候補。重点扱いには追加原典が必要 |

韓国PV日誌は実体験が有用でも説明の裏付け不足が目立ち、重点推薦しない。Orkanは公開要約以外のアクセス条件があり通常推薦を保留。森麒機電は閲覧可能だが同一事例の再利用と作業手順を選別する必要があり、今回推薦の4件には入れない。

本回は編集資料として一区切りにする。未確認地域を国別表の穴埋めで補わず、次回は国内対象型式の一次資料、B項目の測定条件、PLC/通信の原ログを優先する。タイ・ベトナム・インド・中南米の個人技術者、チェコの個別故障本文、低速軸受の国内機器適合、空圧/油圧と搬送同期の比較は不足している。欧州も国別の一般化ができる数/条件はない。

記事刷新では、最新ルール→slug→既存4軸索引→ID→原典の現在の内容と国内型式資料→記事別採否→通常のPreview/承認の順で使う。Bのままなら原因を断定しない。Aでも適用範囲を越える説明を追加せず、当サイトの実体験に書き換えない。

## ルール適用・基点・検査範囲

入口は[ルール確認手順](../rules/README.md)、分類正本は[catalog](../rules/catalog.json)。開始時のmain Git tree 3688項目と照合し、145 Markdown・catalog・構造検査スクリプト等をGit blob SHAで確認した。取得だけを読了とはしない。PR #1807/#1809/#1811/#1813/#1814/#1815の採用済み資料を引き継ぎ、今回は第16回の新規ブランチ。Open/Draftを探索し、並行#1812の記事公開準備、#1806のBing関連、#1808のPreview関連を取り込まない。

第15回時点で本文確認した文書も、今回基点のblobと一致することを照合して引き継いだ。必須9件、条件付き99件の適用性を下表に全件記録する。部分確認・未確認外部参照を残すため「全ルール・全参照を読了」とは主張しない。資料のみの依頼に、対象外の記事制作・公開工程を実施しない。

| 必須文書 | 内容・参照の確認範囲 |
|---|---|
| `AGENTS.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |
| `docs/agent-runbook.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |
| `docs/ai-editorial-master-rules.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |
| `docs/ai-editorial-project-status.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |
| `docs/ai-governance.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |
| `docs/editorial-department-status.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |
| `docs/rules/conflicts.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |
| `docs/rules/index.md` | 生成一覧は部分表示。catalog全項目の分類と参照は照合。全文読了とはしない。 |
| `docs/rules/README.md` | 本文確認。資料追加の適用範囲と参照先を確認。記事/本番変更の工程は対象外。 |

| 条件付き文書 | 適用性・内容確認・参照範囲 |
|---|---|
| `.github/article-components/end/INTEGRATION.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `.github/article-components/sidebar/INTEGRATION.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/additional-page-shells.md` | 対象外：トップ・相談・キャリア入口の共通枠、生成・比較・公開・採用基準を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/adopted-image-github-placement-rule.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/agents/article-candidate-agent.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/agents/article-image-generator-agent.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/agents/article-orchestrator.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/agents/article-writer-agent.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/agents/github-link-agent.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-artifact-broker.md` | 対象外：旧artifact転送経路を参照・変更・再利用しようとする場合。使用禁止・再利用条件を確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-artifact-writer.md` | 対象外：旧artifact転送経路を参照・変更・再利用しようとする場合。使用禁止・再利用条件を確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-chibi-motion-rules.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-dashboard-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-discussion-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-image-quality-high.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-ogp-autonomous-gate.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-preview-auto-revise.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-preview-probe-content-validation.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-stall-recovery.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-editorial-weekly-routine.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-fallback-attendance-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-governance-v1-migration.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/ai-search-citation-rules.md` | 関連原則を本文確認。出典属性を混同しない。検索実績に基づく記事改稿・SEO工程は対象外。 |
| `docs/ai-weekly-operation.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-audit-entrypoint.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-backlog.md` | 対象外：新規記事候補や英語展開、既存候補との重複・公開済み状態を確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-components-integration.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-editing-playbook.md` | 適用部分：資料と本文/公開工程の境界。本文読了。記事改稿・Preview・本番配信の工程は対象外。 |
| `docs/article-feedback-rules.md` | 対象外：評価カード・投票処理・記事slug・集計・評価の配置を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-hero-templates.md` | 対象外：記事ヒーローの共通枠・固有内容抽出・CSS・生成・比較検査・対象登録を扱う。プレビュー段階と公開承認を区別する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-refresh-log.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-search-data-precheck-override.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-type-templates.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-update-date-guard.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-workflow-v2-migration.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/article-workflow.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/chibi-production-integration.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/cloudflare-preview-builder-finalization.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/cloudflare-preview-migration.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/codex-update-rules.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/comic-character-sheet.md` | 対象外：四コマ漫画・SNS漫画で先輩/後輩キャラクターを制作・更新・監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/comic-production-checklist.md` | 対象外：四コマ漫画・SNS漫画の台本、画像生成、技術レビュー、採用、投稿準備を行う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/comic-style-guide.md` | 対象外：四コマ漫画・SNS漫画の世界観、絵柄、構成、CTA、シリーズ統一を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/dashboard-progress-status-v066.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/decisions/README.md` | 対象外：重要判断を記録・再評価する。既存判断の採用・未採用・失効を区別する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/denkicontrol-site-strategy.md` | 適用部分：F/PBの知識・採否と現場知識方針を確認。全サイト戦略の改訂は対象外、全外部URLは再読していない。 |
| `docs/denkicontrol-strategy-whitepaper.md` | 対象外：サイト方針、企画、読者対象、収益化、言語展開を判断する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/en-article-backlog.md` | 対象外：新規記事候補や英語展開、既存候補との重複・公開済み状態を確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/existing-article-improvement-backlog.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/external-challenger.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/fa-knowledge-plan.md` | 対象外：サイト方針、企画、読者対象、収益化、言語展開を判断する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/image-generation-rules-v2-migration.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/image-generation-rules.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/image-quality-gate.md` | 対象外：画像の制作・採用・配置・品質審査・キャラクター利用を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/integrations/online-estimate-sheet-setup.md` | 対象外：管理画面から案件別の見積Google Sheetを作成・更新する連携、Apps Script、Cloudflare Worker設定を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/internal-reachability-audit-method-review.md` | 対象外：内部リンク到達性・言語切替の監査方法を使う。旧監査の件数は現在値として流用しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/language-menu-audit-method-review.md` | 対象外：内部リンク到達性・言語切替の監査方法を使う。旧監査の件数は現在値として流用しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/legacy-article-refresh-template.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/multi-ai-orchestrator-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/multi-ai-runtime-v0.1.md` | 対象外：停止中のAI編集部の当該機能を明示依頼に基づき保守・再評価する場合。存在は再開許可を意味しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/new-article-checklist-v2-migration.md` | 対象外：記事の企画・制作・更新・導線整備。個別依頼に該当する工程を判定し、本文の優先順位・限定例外を適用する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/new-article-checklist.md` | 対象外：記事を制作しない。冒頭と現場知識採用ゲートを部分確認し将来の採用条件だけ参照。全2011行読了ではない。 |
| `docs/plc-ladder-editing-rules.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/plc-templates/estimate-template.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/plc-templates/io-removal-checklist-template.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/plc-templates/online-consultation-estimate-template.md` | 対象外：GX Works2オンライン相談などWeb経由の初回取引で見積書を作成・編集する。標準の現地工事見積には通常適用しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/plc-templates/operation-spec-template.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/plc-templates/README.md` | 対象外：PLCラダー、改造見積、設備運転仕様、現地I/O資料を作成・編集する。Web記事の構造だけの作業には通常該当しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/popular-articles-maintenance.md` | 対象外：人気記事のランキング・週次更新を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/post-approval-publish-pipeline.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/preview-environment.md` | 対象外：Preview環境・生成・公開・公開通知を扱う。サービスの現行接続を別途実証し、旧サービス固定記述を実装済みと扱わない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/air-cylinder-troubleshooting-basic.md` | 対象外：articles/air-cylinder-troubleshooting-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/area-sensor-basic.md` | 対象外：articles/area-sensor-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/earth-leakage-breaker-basic.md` | 対象外：articles/earth-leakage-breaker-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/load-cell-basic.md` | 対象外：articles/load-cell-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/magnetic-switch-basic.md` | 対象外：articles/magnetic-switch-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/no-nc-basic.md` | 対象外：articles/no-nc-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/npn-pnp-basic.md` | 対象外：articles/npn-pnp-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/plc-basic.md` | 対象外：articles/plc-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/README.md` | 適用・本文読了。出典の属性、記事別採否、Aの限界、画像非転載を引き継ぐ。 |
| `docs/reference-notes/reed-switch-basic.md` | 対象外：articles/reed-switch-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/safety-control-basic.md` | 対象外：articles/safety-control-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/self-hold-circuit.md` | 対象外：articles/self-hold-circuit.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/sensor-basic.md` | 対象外：articles/sensor-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/servo-motor-basic.md` | 対象外：articles/servo-motor-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/solenoid-valve-troubleshooting-basic.md` | 対象外：articles/solenoid-valve-troubleshooting-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/start-stop-circuit-basic.md` | 対象外：articles/start-stop-circuit-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/sto-basic.md` | 対象外：articles/sto-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/reference-notes/while-pressed-circuit-basic.md` | 対象外：articles/while-pressed-circuit-basic.html の技術内容・画像・公式資料・用語を更新または監査する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/rule-alignment-v1.md` | 対象外：AI編集部の再評価・保守・再開判断、または通常チャットで曜日の役割を依頼された場合。必ず運用状態文書を先に読み、自動再開しない。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/search-console-content-improvement-log.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/search-data-acquisition-rules.md` | 対象外：検索データ取得・保存・認証・検索に基づく企画改善を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/search-data-implementation-status.md` | 対象外：検索データ取得・保存・認証・検索に基づく企画改善を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/search-data-oauth-setup.md` | 対象外：検索データ取得・保存・認証・検索に基づく企画改善を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/site-shell-implementation.md` | 対象外：採用済み記事部品の編集・統合・検査・公開経路を扱う。初版採用記録と現在の移行状態を区別する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/site-template-migration-status.md` | 対象外：サイト構造・レイアウト・共通部品・記事制作・生成方式・移行状況を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/site-template-policy.md` | 対象外：サイト構造・レイアウト・共通部品・記事制作・生成方式・移行状況を扱う。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |
| `docs/terminology/README.md` | 適用・本文読了。国内正式用語と説明訳を分け、今回は用語集本体を変更しない。 |
| `docs/tool-article-improvement-template.md` | 対象外：既存記事の監査・改善候補選定・内容更新・検索意図・SEOを扱う。日付ガードを先に確認する。 今回は資料・索引のみで当該工程を実施しない。本文読了とはしない。 |

旧F/PB/FK10〜15の全記録を検索・重複照合し、関連知識・出典・訂正欄を再読した。全過去原典を再取得したという意味ではない。資料の元の判定は残し、新しい補足の判定を別IDで管理する。既存`conflicts`に関係する今回の新たな運用変更はない。保存直前のmainも基点と一致。新たな並行PR #1817はCI改善の4ファイルで、本PRの5文書と重複しない。#1812は保存直前にReady状態であり、記事公開変更を取り込んでいない。catalogへの並行追記が起きた場合は双方の登録を保持して再生成する。

### 検査結果

保存前の自動検査：`python scripts/check-rule-catalog.py` を取得済みGit treeのパス一覧で実行し、146文書（必須9・条件付き99・参考38）/supporting 77でエラー0。生成indexも一致。`python scripts/test-rule-catalog.py` は18テスト成功。構造検査は内容読了を保証しない。
+
+今回専用の手元の照合では、49主体/64URL・確認範囲・16知識ID・5再検証ID・11検証URL・A/B/CとJP内訳の整合、旧資料の全行保持、旧知識本文のbyte保持、catalogの既存登録保持、7 slug実在、今回追加したローカルリンク/アンカー、変更範囲5ファイルを確認した。Git treeと照合した既存152ファイルは変更なし。検査スクリプトや中間取得データは作業用で、今回リポジトリへ追加しない。
+
+手動検査：原典の言語と所在地、主記事の範囲、同一記事の別ホスト、論点重複と同一事例の違い、原因未確定・修理複数変更・未実施の改善、国内FAQの型式制限、非操作的な安全表現を確認した。GitHub保存後の再取得照合、Draft状態、main不変はPR本文・最終報告に記録する。

未実施：実機/故障再現、当該メーカー全型式の照合、現行JIS/IEC/ISO・法令の全文対照、画像/動画の診断、取得不可ページの全本文、全過去URLの再取得、記事Preview・画面回帰・サイト全体ビルド、週次監視タスクの実行確認。本番への操作はしていないが、本番配信そのものの動作試験は実施していない。
