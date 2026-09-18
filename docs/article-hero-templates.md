# 全288記事のヒーローひな形

状態・対象・本番承認の正本は [移行状態](site-template-migration-status.md)。この文書は実装と再生成手順を説明する。共通化方針は [site-template-policy.md](site-template-policy.md)。

## 目的と範囲

現在の表示と内容を変えず、記事ヒーローの枠・固有情報・専用CSSを分離する。代表8記事の見た目保持方針を管理者が確認し、残り280記事への展開を承認。manifestに全288記事を明示する。日本語通常/長タイトル、工具、CTAなし2件、広告表記、英語通常/長タイトルを含める。トップ、相談サービス、カテゴリ、キャリア入口は対象外。設計シリーズ3記事はヒーローのみを共有し、本文・シリーズ構成へ通常記事のレイアウトを強制しない。本文全体、日付、SEO、URL、画像制作、記事改善へ拡張しない。

## 正本と編集方法

|責任|正本|編集後の扱い|
|---|---|---|
|対象URL|[manifest](../.github/article-components/hero/manifest.json)|明示登録以外へ適用しない|
|共通の内部順序と任意領域|[hero.njk](../.github/article-components/hero/hero.njk)|全登録ページを再生成し比較|
|タイトル/ラベル/説明/要点/広告/CTAの固有内容|既存の対象記事HTML|生成時に最新ソースから抽出。別JSONへコピーして二重管理しない|
|ヒーローだけを対象とするCSSルール|hero/css配下のCSS Nunjucksファイル|利用ページへ同じ宣言位置で展開。共有プロフィールの利用先はcss-bindingsで特定|
|CSSの元位置とソース指紋|[css-bindings](../.github/article-components/hero/css-bindings.json)|元HTMLのCSSを勝手に上書き・再採取しない|
|本文・パンくず・全体CSS・既存共通部品|既存の編集元と各部品の正本|このパイロットでは変更しない|

初回のCSS分離は字句単位で保守的に行う。空白・順序まで同じルールだけを同一プロフィールへまとめるため、288記事で521ファイルになる。521の別デザインを推奨するものではない。短いルール単位のため、プロフィールのファイル名は初期内容のハッシュを識別子とする。ページ/元CSS位置→プロフィールの対応を経由して編集する。

各記事の元HTMLは固有内容の編集元と移行前構造の照合元を兼ねる。CSSの元断片は互換性検査用に残すが、生成時の宣言は共有プロフィールから得る。CSSを末尾へまとめたりlink要素へ移したりせず、元style内の同じメディア条件・同じ順序に展開する。混在セレクタやグローバルh1/変数等、hero専用と断定できないルールは動かさない。

抽出するタイトル等はHTML断片であり、br、span、タグ属性、空白を保持する。labelはhero-labelとhero-kickerに対応。points/disclosure/actionsは任意、順序はテンプレートで規定する。未知の子要素、重複フィールド、未知の順序、CSS元指紋の変化、抽出後のソース変更は失敗させ、黙って捨てない。

## 正規の生成工程

既存の [build-integrated-review.mjs](../scripts/build-integrated-review.mjs) 内で、最新記事からhero-pages.jsonを生成する。既存のヘッダー/目次/関連記事/評価の生成後に、登録288記事だけへhero.njkとCSSを適用する。candidateとreviewは従来の境界を維持する。Pagesが呼ぶ同じ生成入口に接続しており、生成HTMLを手直しする別工程はない。

```sh
pnpm install --frozen-lockfile --ignore-scripts
python -m pip install lxml==6.1.1
node scripts/build-integrated-review.mjs ../hero-build
node scripts/check-article-hero-preservation.mjs ../hero-build
node --test tests/article-heroes.test.mjs
python scripts/verify-integrated-source.py ../hero-build
python scripts/audit-integrated-links.py ../hero-build
```

Windows等でPythonのコマンドが異なる場合はPYTHON_EXECUTABLEを設定する。出力先はソース外を指定する。初期CSSの取り込みは明示コマンドのみで、通常ビルドでは行わない。既存プロフィールに意図的な編集がある状態で初期化すると上書きされるため、対象差分と保全基準を確認して別の移行作業として実施する。

```sh
python scripts/prepare-article-heroes.py --initialize-css --out ../hero-build/hero-pages.json
```

## 比較プレビュー

```sh
HERO_REVIEW_PORT=18876 node scripts/serve-article-hero-review.mjs ../hero-build
```

同じPCの http://127.0.0.1:18876/ で変更前/ひな形版、記事、320/390/768/1440pxを切り替える。HERO_REVIEW_PORTは環境変数。既存サーバと衝突する場合は空きポートへ変更する。127.0.0.1は閲覧端末自身を指すので、スマートフォンからこのURLを開くことはできない。外部共有用URLの発行・公開はこのローカルプレビューに含まれない。

変更前は同じ最新ソースを既存部品まで生成したHTML、変更後はそこへヒーローひな形を適用したHTML。古いサイト全体との比較にしない。before/reviewだけにnoindex・CSP・模擬応答による送信隔離を付け、candidateへ混入させない。ポータルはGET/HEADだけを受け付ける。本番の投票・フォーム送信はしない。

## 検査と段階拡張

全288件のヒーロー/CSSを含む再構成HTML全バイト一致、統合後の断片一致、全288記事の既存保全検査を行う。単体検査は共通枠を一度変更して288件に伝播すること、共有CSSは利用ページにだけ伝播すること、対象外不変、未知構造/古いCSS/古い抽出データ/重複対象の拒否を別コピーで確認する。

画面は288記事×4幅の1152組を変更前後で比較し、タイトル・要点・広告・CTAの位置、背景画像の濃度/位置/サイズ、ヘッダーとの関係、折返しを確認する。比較結果は実行したcommitと成果物側へ記録し、コードの存在だけで合格とはしない。実機Safari、スクリーンリーダー、文字拡大は別途必要。

全記事展開では最新mainと他担当変更を取り込み、未対応構造を検出する。構造差や用途差を欠落扱いして変換しない。専用ページ群は別variantの設計と比較が必要。本文改稿、CTA追加、日付追加、検索需要に基づく再設計を混ぜない。

## 復旧

元の記事HTMLと既存部品は保持する。ヒーロー生成呼出し・専用部品・検査/文書を同じ変更単位で戻せば、既存生成工程へ戻る。後続の追加4ページやリンク修正を巻き戻さない。公開前には最新main上で再生成し、公開候補・隔離版・画像最適化後の既存検査を通す。本パイロットの実装承認を本番承認として扱わない。


## 全件台帳と例外

manifestのpageVariantsは全targetsと集合一致を要求する。日本語標準171、英語要点付き111、CTAなし2、広告表記1、設計シリーズ3の計288記事。いずれもヒーロー内部の語彙順序は共通のためhero.njkを共有し、別の本文レイアウトへ変換しない。variantは用途・検査対象の明示で、見た目を均一化する指定ではない。

en/articles/relay-socket-basic.htmlには既存の.side-rail閉じ括弧欠落がある。cssExceptionsでstyle全体のSHAと未閉鎖部分の開始位置を固定し、その手前の平衡なhero CSSのみ共通化する。後半のmedia CSSは原位置・原文のまま保持する。元CSSが変われば失敗する。この例外はCSS修正済みという意味ではない。

全件画面検査はscripts/check-article-hero-browser.mjsを6分割で実行し、上部viewportとヒーロー全体を別々に生ピクセル比較する。全288記事の320/390/768/1440pxで1152表示条件・2304画像比較。390pxでは存在するCTAを旧新版それぞれ実クリックし、hashと実在アンカーを照合する。CTAなしの3件は新設しない。CSS/HTML構造の変化に加えて配置、擬似要素、画像背景、ヘッダー下端、横幅を照合する。

scripts/merge-article-hero-checks.mjsは対象・幅・CTAの抜け、重複、失敗を拒否して最終レポートを生成する。全件の画像ハッシュと計測結果を記録し、代表8＋シリーズ3＋CSS例外1の画像と、失敗時の画像を保存する。CI画像は14日、集約レポートは30日保持。画面上部とヒーローを対象とし、全文スクリーンショットの比較とは区別する。


初回の全件CIでは別タブ間に最大3/255の微小な色差を確認したため、旧新を同じページへ順に読み込む比較へ変更した。許容画素数・色差の閾値は広げず、生ピクセル差分0を合格条件とする。全computed CSSも照合する。失敗時には同じ版を2回読み込むA/A・B/B比較を追加保存し、描画揺れと実装差の診断材料にするが、これを理由に旧新不一致を自動合格にはしない。
