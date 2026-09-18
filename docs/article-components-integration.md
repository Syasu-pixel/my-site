# 採用済み記事部品の統合レビュー

状態: REVIEW_ONLY / 本番未反映。管理者の依頼により、採用済みヘッダー配置・sidebar-toc-v2・related-cards-compact-v1と、既存仕様の評価部品を順に統合する。同じ採用済み表示の再承認は求めない。最終組合せ確認・本番公開の承認とは区別する。

## 基準と編集元

- main: `394203274a5bd4d1eff4dd51fe64e07127c65275`
- ヘッダーPR #1509の基準: `71de9c96021ef3e725af6ffda88e46076161575f`
- 独立ブランチ: `review/article-components-integration-20260918`
- 共通部品: `.github/article-components/`。採用パッケージはadoption.jsonのSHA-256を照合する。
- 記事固有内容: 既存の `articles/*.html` / `en/articles/*.html`。過去のプレビューHTMLや旧fixturesを入力にしない。
- 処理順: ヘッダー → 目次/右欄 → 評価/関連記事。各段階のhash・原文保持結果を出力する。元記事と本番パイプラインを変更しない。
- HTMLはEleventy/Nunjucksで生成。Pythonの準備アダプタは最新HTMLの部品境界・見出し・既存カードの抽出/照合だけを担い、独自テンプレート言語は追加しない。

## 全件台帳と例外

GitHubの基準treeから309 HTMLを列挙し、ローカル入力のgit blob hashと照合。記事288件、その他21件を件数照合する。台帳の未確認を、共通ひな形があるという理由で適用済みにしない。

|状態|件数|
|---|---:|
|通常のレビュー適用|10|
|専用構成を保った例外レビュー適用|7|
|記事の統合・画面未検証|271|
|対象外の固定/カテゴリ/管理等|20|
|GX Works2相談サービス例外・原文保持|1|

17代表は日本語11・英語6。通常、工具2、キャリア、トラブル対応ハブ、設備設計#1/#2/#3、英語を含む。

- PLC設備設計シリーズ: 右欄を新設しない。前後回・次回案内、既存の相談案内、本文専用構造を保持。
- 工具: 商品リンクと説明を保持。anchor-fixingは900px、crimping-toolsは1180pxの元レイアウト境界を使用。
- キャリア/ハブ: 専用の比較・分岐構造を保持。
- GX Works2相談窓口 `services/gxworks2-online-support.html`: 記事部品の対象外。料金/説明/同意/フォーム/入力検証/送信処理を含む元HTMLを完全一致で別出力へ保持。PC/スマホの表示とフロント側入力検証だけ確認し、本番送信はしない。
- 英語: 評価を追加しない。ヘッダーの相談導線を掲載しない。通常のお問い合わせ・検索・実在する対応記事への言語切替は維持。

## 組合せに必要だった修正

320×568pxで検索結果が右下の目次ボタンを覆った。採用済みtoc.css/jsや関連記事CSSは変更せず、統合専用 `integration-compat.css/js` で狭い表示の検索結果を目次ボタン上12pxまでの高さに制限し、一覧内スクロールにした。検索項目や目次の配置・動作を削除して回避しない。

検索を再び開くとき、既存検索の「フォーム外クリックで閉じる」処理が再表示した結果を消す組合せも検出。ヘッダー側の入力フォーカスをクリック処理完了後へ移し、既存site-search.jsを変更せず再表示を保持する。

## 既知のリンク不整合（変更しない）

|英語記事|既存カードタイトル|既存href|
|---|---|---|
|air-breaker-basic|Surge Protection Basics|./air-breaker-basic.html|
|control-panel-cooling-fan-basic|DC Motor Control Basics|./control-panel-cooling-fan-basic.html|
|surge-protection-basic|Control Panel Cooling Fan Basics|./surge-protection-basic.html|

いずれも自己リンク。今回採用された表示とは別問題として原文を保持する。推測によるリンク修正を混ぜない。

## 再生成と検査

```sh
pnpm install --frozen-lockfile --ignore-scripts
node scripts/build-integrated-review.mjs ../integration-build
python scripts/verify-integrated-source.py ../integration-build
node scripts/make-integration-gallery.mjs ../integration-build
node scripts/serve-integrated-review.mjs ../integration-build
# 別の端末で
node scripts/check-integrated-review.mjs ../integration-build
node scripts/check-integration-boundaries.mjs ../integration-build
node scripts/package-integrated-review.mjs ../integration-build
```

Python3.12、Node22以上。WindowsでPython実行ファイルを指定する場合はPYTHON_EXECUTABLEを使用する。依存は既存の固定版Eleventy3.1.6、Playwright1.55.0、pixelmatch/pngjs。出力はソースと独立したディレクトリに限定する。

検査対象: 17記事×320/390/768/1024/1440px=85条件、相談窓口3幅、日英の検索/言語/お問い合わせ、目次の開閉/ジャンプ/フォーカス/重なり、OGP読込/contain/長いタイトル、評価位置/slug/一票制/再読込/409/503/保存不可。別に境界幅・回転・固定操作干渉・検索結果選択・カード実クリック28条件を確認する。

本文の部品外、SEO、元スクリプト、残した右欄カード、フッター、本文/フッターのhref順序を保持検査する。全309 HTMLの基準照合も行う。本文の技術的正確さを保証する監査ではない。

## Preview隔離と証拠

`candidate/` は統合候補。`review/` だけにnoindex・CSP・模擬投票を加える。本番の評価JS/API・loaderは変更しない。外部script/通信とフォーム送信は遮断し、同一originの検索JSONだけ取得可能にする。投票はブラウザ内の模擬応答で、本番の集計へ送らない。サービスフォームの実送信E2Eは行わない。

GitHub Actionsの `Integrated article component review` が再生成と検査を実施。`integrated-preview-*` と `integrated-evidence-*` を別artifactで30日保存。証拠には309件台帳、保全結果、Before/After/意図したDiff、操作結果を含める。旧ヘッダー/フッター共通化の視覚差分0検査とは区別する。

実機iOS/Safari、実機ソフトキーボード、スクリーンリーダーは未検証。271記事の統合・画面検査は未実施。本番マージ/公開は未承認。後続の全面適用は台帳の未確認を解消してから判断する。

## ロールバック

元記事とmainを変更していないため、このレビュー出力を本番へコピーしない。統合ブランチの追加部品・アダプタ・workflowを同じ単位でrevertできる。先行PR1509や他担当の独立パッケージを上書きしない。
