# terminal-block-basic 公式参照メモ

## 状態と確認日
- 2026-11-11。本文と画像の正式Preview用下書き。画像6枚は自己点検と独立審査後のPreview採用候補として配置済み。最終Previewの管理者確認、本番承認・公開は未完了。
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

## 画像の採用範囲と未完了事項
- 画像はロゴ・実在型式・銘板を再現しない概念図。2026-11-11にHero、OGP、内部構造、接続方式比較、端子番号と線番の照合、確認ポイントの6枚を自己点検と独立画像審査後のPreview採用候補として配置した。旧画像をそのまま採用したものではない。
- HeroとOGPは3極・6ねじ・6配線、丸端子の余分な穴の除去、隣接極の分離、手が導体に触れない表現を確認した。
- 内部構造は渡り配線のない一般的な中継の模式図。端子番号と線番の照合は「端子台TB1」「端子番号3」「線番103」「盤外機器A」「盤内入力機器B」の架空例で、施工可能な回路図や標準採番法ではない。
- 接続方式比較は固定方法だけを示す。左側は隔壁のある2極にも見えるため、この図から内部導通や同電位を断定しない。確認ポイントは資料照合と担当者判断を中心とし、一律の測定・増締めを勧めない。
- 外観参照: [IDEC BNシリーズ端子台](https://www.idec.com/ja-jp/industrial-components/connection-devices/terminal-blocks/bn-series) と同ページの [公式製品写真](https://apem.asset.akeneo.cloud/idec_product_images/media/BN_Series.jpg)。2026-11-11確認。レール取付、黒い隔壁、ねじ、導電金具という一般外観だけを参照し、特定型式の精密な再現とはしない。本文の公式資料欄にも参照範囲付きのリンクを追加した。
- 接続原理の参照は上記オムロン技術解説。ねじ式・ねじなし式の固定方法、導体・端末処理の適合を区別し、画像だけで定格・締付け条件・内部導通を判断させない。
- 画像のローカル原本とGitHub保存用blobのGit SHA一致は6枚すべて確認。最終publicationのWebP対応、外部Previewでの画像表示、PC/スマホのライト・ダーク確認は別工程として残す。

## 検証記録
- 本文変更前の統合生成は288記事保持と資産欠落0を確認。実配信はWebP変換と改行正規化を考慮して基準生成物と一致を確認した。
- 本文変更後の統合生成・台帳整合・静的保全検査は下記のとおり実施。WebP最適化後の最終成果物とPC/mobile明暗レビューは別工程であり、静的検査の成功だけで合格扱いしない。

## PR #1828 正式Preview用の限定同期（2026-11-11）
- 編集元head: `5e69fcb3137a63c1663eb273fce183d54b8bb923`。採用候補の本文・画像・目次に合わせ、以下の端子台記事entryだけを同期した。この最初の同期では他記事entryを変更しなかった。後述の追加許可により、端子台へリンクする13カードのOGP記録だけを同期した。共通比較基準、生成器、必須チェックは変更していない。
- これはDraftの原稿と生成台帳の整合であり、変更後の本番承認基準への昇格ではない。旧値を以下に保持する。最終Previewの承認後も本番配信確認までは公開済みと扱わない。
- 意図した差分: 説明画像6枚と対応する本文参照・alt、照合例と安全上の留保、公式参照欄、対象記事の要点カードと目次。IDEC BNの外観参照リンクを公式資料欄に1件追加した。記事URL、共通レイアウト、既存関連記事の内容・順序、投票処理、トップ・カテゴリ・検索index・sitemapは変更しない。
- `.github/site-shells/manifest.json` の `baselineSha256`: `fb5a27d8121d622391eee533339f24094995d1771493af4cccb32e4e2acf3251` → `ea6a45b8597684c8c7b70b5bea9ed18650052a80ecede944151e3f0ebac90bab`。既存生成器の規則に従い、承認済みfooter profile-link navを1件除いたHTMLのSHA-256。全文SHA-256とは区別する。
- `.github/article-components/site-inventory.json` の `gitBlob`: `f331b5b5befa74776d6edfd8dc57ad5869ccff8e` → `e55448eb9c92f49afc104fc99f92db877a2301e9`。最終編集元の全文実バイトをGit blob形式で計算。
- `.github/article-components/sidebar/all-pages.json` の `cardsBefore[1].sha256`: `8ccc8c0d58804cf20cc925886a61ec4ed345ffca46e10dd2e07d21d5f164c92b` → `e962103a17ba8ae6df5afee7836234e834f855bc7d8215092f30758de75a2672`。他の3カード指紋・保持順・境界幅は不変。
  - 目次 `check`: 端子台まわりの確認ポイント → 端子台まわりで確認する表示と仕様。
  - 目次 `trouble`: トラブル時の見方 → トラブル時は、端子台を境に情報を整理する。
  - 目次 `caution`: 作業するときの注意点 → 配線や点検を行う前の注意点。
  - 目次 `sources`: （旧entryなし） → メーカー公式資料・技術参照元。
- `.github/article-components/end/all-preservation-oracle.json` の `sourceSha256`: `fb5a27d8121d622391eee533339f24094995d1771493af4cccb32e4e2acf3251` → `b22aaaf4c4ed6b5c3fe405e36e2a4dbcecb69c9639038c053b0d1509f5c484fa`。全文実バイトのSHA-256。関連記事3件・順序・リンク・画像期待値・総件数は不変。
- Hero CSS・背景URLは変更していないため、hero/css-bindingsの対象entryは不変。
- 未変更headではshell整合288件・単体5件、ルール構造151文書/81制御・回帰18件が成功し、正式統合生成は既存の対象記事shell baseline不整合で停止した。限定同期後の初回生成、本文/SEO/元スクリプト/フッター等の全288記事保全、Hero288記事保全・共通伝播/異常系、追加16ページ生成は成功。IDECリンク追記後の最終統合生成も成功し、source/Hero保全288記事、リンク資産監査の新規欠落0、追加shell16ページ、publication境界検査288記事/追加16ページ/非対象7ページと異常系を確認した。外部Previewの4表示条件は引き続き確認が必要。未完了を合格として扱わない。

## 関連記事カードOGPの限定同期（2026-11-11）
- 追加許可に基づき、以下13記事の端子台へのカードについて、独立照合台帳の `ogp` と `ogpPath` のみを更新した。記事本文・カード文言・リンク先・並び順・タイトル・元記事SHAは変更しない。
- 旧 `ogp`: `https://denkicontrol.com/assets/images/terminal-block-basic/terminal-block-hero.png`。新 `ogp`: `https://denkicontrol.com/assets/images/terminal-block-basic/terminal-block-ogp.png`。
- 旧 `ogpPath`: `assets/images/terminal-block-basic/terminal-block-hero.png`。新 `ogpPath`: `assets/images/terminal-block-basic/terminal-block-ogp.png`。
  - `articles/circuit-protector-basic.html` のカードindex `0`。
  - `articles/control-panel-label-basic.html` のカードindex `1`。
  - `articles/control-panel-light-basic.html` のカードindex `1`。
  - `articles/control-panel-wire-color-basic.html` のカードindex `1`。
  - `articles/dc24v-power-supply-basic.html` のカードindex `2`。
  - `articles/dc24v-power-troubleshooting-basic.html` のカードindex `4`。
  - `articles/din-rail-basic.html` のカードindex `0`。
  - `articles/limit-switch-troubleshooting-basic.html` のカードindex `5`。
  - `articles/plc-io-unit-basic.html` のカードindex `5`。
  - `articles/relay-socket-basic.html` のカードindex `3`。
  - `articles/terminal-block-jumper-basic.html` のカードindex `0`。
  - `articles/wire-number-marker-basic.html` のカードindex `0`。
  - `articles/wiring-duct-basic.html` のカードindex `1`。
- これは承認済み専用OGPを関連記事カードにも用いるためのDraft内整合であり、本番承認基準への昇格ではない。この同期後に独立静的保全を再検証した。

## 正式生成の到達点（2026-11-11 11:31 UTC時点）
- 同期後の独立関連記事保全: 288記事、記事カード1356件、案内カード9件。日本語評価欄177件・英語0件。共通関連記事CSS・評価CSS・元投票スクリプト一致、検査中の入力不変、エラー0。
- shell基準検査288記事とルール構造検査151文書/81制御は成功。構造検査は全ルールの意味上の読了や外部資料の妥当性を証明しない。
- 正式publication組立: 288記事、追加shell16ページ、非対象7ページの保全、レビュー専用の隔離コード非混入を確認。WebP前スナップショット350テキスト、参照資産の既存欠落0。同名PNG/JPEG衝突2組は既存規則に従って原本を保持する。
- この記録の確定時点では、publication複製だけを対象に本番と同じ cwebp `-quiet -mt -q 82 -m 4` でWebP派生を生成中。採用PNG原本6枚と最終編集元本文は不変。WebP後の最終検証・外部URL実バイト照合・PCライト/PCダーク/スマホライト/スマホダークの表示確認は未完了であり、完了記録は後続のPreview検証結果で確認する。
- 既存Cloudflare Previewの旧head配信はraw HTMLとバイト一致し、正式生成物ではなかった。最終案内には検証済みpublication成果物をPreview専用branchで配信し、共通shell等の構造と実バイトを確認する。Preview専用branchはmainへマージせず、本番公開・課金は別途確認する。
