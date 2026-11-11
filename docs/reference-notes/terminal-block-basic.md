# terminal-block-basic 公式参照メモ

## 状態と確認日
- 2026-11-11。本文下書きの技術精査用。画像の修正・採用と公開前確認は未完了であり、公開承認ではない。
- 最新main 45c9773843e16024ba1525825582e20d83ace6b8を基準に作成。未マージPR #1463の安全表現を参照したが、古いレイアウトと共通部品を戻さない。

## 参照した公式元と使用範囲
- オムロン「端子台 技術解説」 https://www.fa.omron.co.jp/guide/technicalguide/46/342/index.html ：ねじ式とねじなし式、クランプ操作とプッシュイン、導体・端末処理の適合条件。
- オムロン XW5T-P 仕様 https://www.fa.omron.co.jp/products/family/3480/specification/ ：型式と導体種類で適合範囲が異なる。数値を端子台一般の仕様として転載しない。
- オムロン FAQ05534 https://faq.fa.omron.co.jp/tech/s/article/faq05534 ：対応短絡バー等の使用条件。特定製品の一穴一本条件を全製品へ一般化しない。
- フエニックス・コンタクト UT 2,5 https://www.phoenixcontact.com/ja-jp/products/feed-through-terminal-block-ut-25-3044076 ：締付け条件・剥き線長さは型式固有。記事に汎用トルク値を提示しない。
- フエニックス・コンタクト 端子台 https://www.phoenixcontact.com/ja-jp/products/terminal-blocks ：中継、多段、接地、ヒューズ、断路等の機能を接続方式と区別。
- 同社 端子マーキング https://www.phoenixcontact.com/ja-jp/products/marking-material/terminal-marking と導体マーキング https://www.phoenixcontact.com/ja-jp/products/conductor-and-cable-marking ：端子の識別と電線の識別を区別。
- WAGO TOPJOB S https://www.wago.com/jp/products/interconnections/railmount-terminalblocks/topjob-s ：操作部と適合条件は製品によって異なる。完全版PDFの読了は主張しない。
- IDEC 接続機器 https://www.idec.com/ja-jp/industrial-components/connection-devices/terminal-blocks ：現行シリーズと旧シリーズを混同しない。旧PDFへの転送を本文確認と扱わない。
- NECA 制御盤内配線 https://www.neca.or.jp/wiringincontrolpanel/ と資料 https://www.neca.or.jp/wp-content/uploads/S7219_slides.pdf ：スプリング接続、フェルールと工具の適合、品質管理。省工数率や点検不要を一般化しない。
- オムロン制御盤設置技術解説 https://www.fa.omron.co.jp/guide/technicalguide/26/130/ ：誤配線防止と識別・接続先照合。
- オムロン電源の注意事項 https://www.fa.omron.co.jp/product/cautions/22/139/ ：通電中の接触回避等は対象製品の注意事項。資格の法的範囲をこの資料だけで判断しない。

## 公式用語と本文の採用方針
- 端子番号：その端子台内の接続点を識別する表示。線番：電線や回路を識別する表示。同じ値である必要はない。
- DINレール：機器を取り付けるレール。内部の導通関係を意味しない。
- ねじなし式にはバネを使う複数の方式がある。接続方式と機能・構成を別々に説明する。
- 端子台TB1、端子3、線番103、盤外機器A、盤内入力機器Bは編集用の架空例。標準採番法や施工可能な回路図ではない。

## 断定しない範囲と安全条件
- 横に並んだ端子の導通、相互接続、色だけによる回路確定、適合導体・本数・電流・締付け条件を外観から推定しない。
- 配線、接触、締付け、測定は資格・教育・許可を満たす担当者が設備手順と対象型式の資料に従う。本文は図面・表示・仕様書の読み方であり、施工・通電測定・復旧の手順ではない。
- 異常時は触る・締め直すことを勧めず、設備の異常時手順に従い担当者へ伝える。

## 現場知識の採否
- F051/F052：一部採用。NECAの接続方式・フェルールと工具の適合だけを本文checkへ反映。工数削減の数値、点検不要、定期増締めは採用しない。
- F053：採用。オムロン制御盤技術解説で識別と接続先の照合を確認し、number/wiringへ反映。実体験として語らない。
- FK12-008：一部採用。 https://www.plctalk.net/forums/threads/ferrule-question.123994/ の個人体験は原因確定資料ではない。国内メーカー資料で独立確認したフェルール・スリーブ・工具の適合確認だけを採用し、特定機器への干渉談は載せない。
- FK12-014/015：見送り。工具の人気、無理な押込みや端末切断は本文の根拠としない。今回原典を再確認していない。
- FK10-001/003、FK15-009：追加検証Bを維持。一般化せず不採用。

## 画像ルールと未完了事項
- ロゴ・実在型式・銘板は再現しない。概念図として描く。
- 許可する説明用表記は「端子台TB1」「端子番号3」「線番103」「盤外機器A」「盤内入力機器B」。架空例であることを本文と図の双方で明示する。
- 既存terminal-number-wiring.pngは番号対応が不明確で本文と整合しないため差替え必須。terminal-block-checkpoints.pngも測定・締付けの表現が新本文と矛盾し、そのまま採用しない。
- overviewは隣接極の導通を誤解させないよう再制作・確認する。heroの指示先も改善候補。画像は自己点検と独立審査が終わるまで採用しない。
- 現時点のHTMLに残る旧画像参照は作業途中のもので、完成したPreviewではない。画像未解決のまま公開・マージしない。

## 検証記録
- 本文変更前の統合生成は288記事保持と資産欠落0を確認。実配信はWebP変換と改行正規化を考慮して基準生成物と一致を確認した。
- 本文変更後の生成・台帳整合・公開物検査・PC/mobile明暗レビューは別途必要。検査未完了を合格として扱わない。
