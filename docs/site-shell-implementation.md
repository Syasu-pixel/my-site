# ヘッダー・フッター共通化の実装と画面確認

## 対象と編集する場所

対象は記事のヘッダー・フッターだけ。本文・記事内CSS・記事内レイアウト・新着・人気一覧・記事データ管理は変更しない。

- 共通部分の正本: `.github/site-shells/components/*.njk`
- 対象URL、言語別部品と基準HTMLハッシュ: `.github/site-shells/manifest.json`
- 記事本文の正本: 従来どおり `articles/*.html` / `en/articles/*.html` の **header/footerの外側**。
- header/footerの内側は生成領域。記事ファイルに直接編集してもCIで不一致となるため、該当する共通部品を直して `pnpm build:shells` を実行し、生成HTMLを同じPRへ含める。

これはヘッダー・フッターだけを分離する混在方式。記事全体を生成物扱いにせず、本文を二重管理しない。記事全体のレイアウト移行や記事データ一元化は別段階とする。

## 実装方式

[Eleventy](https://www.11ty.dev/docs/languages/nunjucks/) 3.1.6のNunjucksを利用する。独自テンプレート言語は導入しない。既存のPython試作は採用しない。Node/pnpm、依存の固定版とlockfileを共有する。

Eleventyは登録URLごとの部品をメモリー上へ生成し、小さな接続処理が記事のheader/footer要素だけを置換する。未定義値、未登録記事、重複URL、無効な部品パス、欠損・重複header/footerで失敗する。全対象の生成・検証後にだけHTMLへ反映する。本文とCSS・スクリプトのバイト列は保存する。

同じHTMLを共有できる箇所を同一部品にまとめ、構造・ラベル・ID・リンク・空白による差は移行時に統一しない。言語リンクをファイル名から推測して追加しない。manifestの各部品を参照すれば利用範囲を列挙できる。

## 実行

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm check:shells
pnpm test:shells
pnpm build:shells
```

共通化だけの移行検査では `node scripts/build-site-shells.mjs --check --verify-baseline` で変更前HTMLハッシュと照合する。後続の明示されたUI変更や本文更新へ、この移行時ハッシュを無条件で適用しない。基準ハッシュ・画像の更新は目的と差分を記録した別判断にする。

## 配信とPreview

完成HTMLを従来のURLへコミットするので、ブラウザで部品を追加取得しない。GitHub Pagesは公開前に `check:shells` を実行し、不一致のまま公開しない。既存の画像WebP処理はその後に行い、手順を変えない。テンプレート正本は既存のPages除外対象 `.github/` 配下に置き、生テンプレートを公開成果物へ入れない。

このPRの `refactor/` ブランチは既存Cloudflare自動Preview対象の `preview-*` / `pilot-*` / `ai-editorial/*` に含めない。外部サービス設定を変更せず、Actionsで同じ生成HTMLをローカル配信して画像を残す。Cloudflareへの独立配置やrawソースを含むルート公開を、このPRの完成条件として扱わない。

## 画面比較と画像取得

既存 `ai-editorial-preview-capture.yml` のPlaywright 1.55.0、PC 1440×1000、スマホ390×844、Actions artifact保存方式を再利用。従来の1記事撮影は変更せず、別workflowで全記事へ拡張する。

1. 固定した変更前commit `394203274a5bd4d1eff4dd51fe64e07127c65275` を別ディレクトリに展開。
2. **生成前に**全記事のPC/スマホのヘッダー付近・フッター付近を撮影。代表6ページは全文画像も取得。
3. 基準画像とmanifestを、そのrun固有のartifactへ保存。
4. 生成・検査後、同一run・同じChromium/OS/Node/viewportで変更後を撮影し比較する。
5. Actionsの `shell-comparison-PR番号-run番号-attempt` をダウンロードして展開し、`index.html` を開く。各記事からBefore/After/Diffへ進める。`report.json`に結果、元commit、画像ハッシュ、環境、既存エラー、外部通信の除外を記録する。

基準画像がある出力先への上書きは拒否する。比較時に基準画像ハッシュを照合する。変更後画像で基準を自動更新しない。artifactは30日保存で永久保存ではないため、必要な証跡は期限内に取得する。

遅延画像は撮影前に読込完了を待つ。アニメーション・カーソル点滅を無効化し、日時を固定。外部通信は両側同じ条件で遮断する。小さなアンチエイリアス差と実際の変更を分けるため、pixelmatch threshold 0.1（AA除外）の判定に加えて、しきい値0・AA込みの生ピクセル差数も保存する。マスクで本文差分を隠さない。

この比較は、外部API・送信フォーム・投票backendの動作保証ではない。既存エラーは基準側にも記録し、新規エラーを別判定する。隠れた既存の言語ボタンを無理にクリックしない。

## 段階とロールバック

PR #1509の初期コミットは比較環境のみ。次に代表6ページ、全288記事の共通化のみを検証する。言語切替条件や相談・お問い合わせ・スマホ検索の追加UIは、その後の別コミット・比較結果で識別する。

本番マージは未承認。戻す場合は該当PRのコミットをrevertし、共通部品・manifest・生成HTML・検査導入を同じ単位で戻す。部分的にHTMLだけ戻して検査を迂回しない。新着・人気記事同期、IndexNow、本番ドメインには変更を加えない。

## 追加UIのレビュー専用出力

`node scripts/preview-site-shell-ui.mjs .ui-proposal` で代表6記事だけを別フォルダーへ出力する。元の `articles/` / `en/articles/` は書き換えない。生成部品は `.github/site-shells/ui-proposal/`。新UIの全記事適用は、この見た目の確認後の段階とする。

- 相談リンクは常時表示。英語ページは日本語相談であることを表示。
- 検索ボタンから横幅の広い検索欄を開き、既存site-search.jsと同じIDで検索処理を使う。
- メニューへ通常のお問い合わせと記事の言語を配置。現在言語は非リンクのラベル。実ファイルがある対応記事だけを切替先とし、ホームへ代替しない。
- Escape・外側クリックで閉じる。検索展開時は入力へ、Escape時は起点ボタンへフォーカスする。

`node scripts/capture-site-shell-ui.mjs .ui-proposal .ui-evidence .visual-evidence` で同環境の変更前と比較し、通常/検索/メニュー/Before/Diffを保存する。CIでは共通化の比較が成功した後にだけ実行し、別の `shell-ui-proposal-*` artifactへ保存する。これは意図したUI差分で、共通化の差分ゼロ判定へ混ぜない。比較画像の自動承認やbaseline更新は行わない。

後続のサイドバー/目次・評価/関連記事の変更は最新の正本へ統合し、shellを再生成して再検査する。古い生成HTML同士を上書きマージしない。統合順はheader/footer、sidebar/目次、評価/関連記事。本番マージの追加承認は得ていない。
