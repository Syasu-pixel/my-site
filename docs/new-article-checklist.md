# 新規記事作成チェックリスト

## 1. 記事テーマ・カテゴリ確認
- 記事テーマが既存記事と重複しすぎていないか確認する
- カテゴリを決める
  - 制御の基礎
  - 回路
  - 工具
  - 比較・使い分け
- 回路記事の場合は、概要だけでなく簡略ラダー例・回路例・条件と出力の見本を入れる
- サーボやシンプルモーションなど応用寄りの内容は、ベーシック記事に無理に入れない

## 2. スラッグ・URL確認
- 記事スラッグを決める
- ファイル名は articles/slug.html にする
- canonical / og:url は以下の形式にする
  - https://syasu-pixel.github.io/my-site/articles/slug.html
- URLは後から変えない前提で決める

## 3. 画像準備
- 画像フォルダは記事スラッグに合わせる
  - assets/images/slug/
- 画像は用途ごとに別ファイルにする
- 1枚にまとめた画像は使わない
- ヒーロー画像はOGP兼用できる構図にする
- ヒーロー画像は左側にHTML文字が乗る余白を残す
- SNSや検索結果で見ても記事テーマが分かるようにする
- 必要なら短いタイトル風テキストを入れてよい
- 本文図や細かい表はヒーローに入れない
- 実在メーカーUIやロゴは入れない
- 人物キャラクターは docs/image-generation-rules.md の guide-characters 参照ルールに従う
- 人物を入れる場合は assets/images/guide-characters/ の既存2人を基準にする
- 新しい別キャラを勝手に作らない

## 4. 画像構成の目安
通常記事：
- slug-hero.png
- slug-overview.png
- slug-control-flow.png または slug-operation-flow.png
- slug-checkpoints.png

回路記事：
- slug-hero.png
- slug-overview.png
- slug-ladder.png
- slug-checkpoints.png

必要に応じて、回路記事では以下も追加可：
- slug-operation-flow.png

## 5. HTML作成ルール
- 新規記事HTMLは完成済み記事HTMLを完全コピーして必要箇所だけ差し替える
- 見た目だけ似せるのではなく、構造をコピーする
- 固定ヘッダー、検索フォーム、右カラム、section-card、talk-thread、related-grid、site-search.js は維持する
- site-search.js は重複読み込みしない
- 新しい独自CSSテンプレートを作らない

基準記事：
- articles/relay-basic.html
- articles/forward-reverse-circuit-basic.html
- articles/lamp-indicator-circuit-basic.html

## 6. HTMLで差し替えるもの
- title
- meta description
- canonical
- OGP / Twitter
- h1
- hero-lead
- パンくず末尾
- カテゴリ
- top-summary の文言
- mini-toc の項目
- section-card の本文
- article-figure の画像パスとalt
- 表やチェック項目
- 関連記事
- 右カラムの目次とまとめ
- footer-nav のリンク

## 7. OGP・meta確認
- og:image / twitter:image はヒーロー画像を指定する
- ヒーロー画像はOGP兼用前提で使う
- meta description は記事内容に合わせる
- canonical と og:url が記事URLと一致しているか確認する
- 古い共通OGPや汎用画像を使わない

## 8. 関連記事確認
- あわせて読みたい記事は3〜6件を目安にする
- 回路記事・制御記事では自然につながるなら6件まで入れてよい
- 存在しない記事へのリンクは入れない
- 自己リンクは入れない
- 実務の流れで自然につながる記事を選ぶ
- GitHub最新で実在確認済みの記事だけ使う

## 9. 回路記事の必須確認
回路記事では、以下のどれかを必ず入れる。

- 簡略ラダー例
- 回路例
- 条件と出力の見本
- 動作順序図

例：
- ランプ表示回路 → 運転中条件 / 停止中条件 / 異常条件から各ランプ出力への基本ラダー例
- 正転・逆転回路 → 正転側 / 逆転側の基本ラダー例
- ブザー回路 → 異常条件からブザー出力への基本ラダー例
- リセット回路 → 異常保持とリセット解除の基本例

## 10. GitHub追加後の確認URL
記事HTMLと画像をGitHubへ入れたら、確認用URLを案内する。

形式：
https://syasu-pixel.github.io/my-site/articles/slug.html

## 11. CODEX反映ルール
記事HTMLと画像は1記事ずつユーザーがGitHubへ追加する。
その後、3〜5記事分をまとめてCODEXで以下へ反映してよい。

- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml
- トップページの記事数表示

CODEX反映時の注意：
- articles/** と assets/images/** は原則触らない
- /seo/sitemap.xml は非運用なので触らない
- search-index の missing / extra / duplicate を確認する
- sitemap の重複を確認する
- トップの記事数表示がカテゴリ別件数と一致しているか確認する

## 12. 新規記事作成の最終チェック
新規記事HTMLを出す前に、以下を確認する。

- コピー方式で作っているか
- 固定ヘッダーが維持されているか
- サイト内検索フォームが維持されているか
- 右カラムがあるか
- section-card 構造があるか
- talk-thread があるか
- related-grid があるか
- site-search.js が1回だけ読み込まれているか
- 画像パスが記事スラッグと一致しているか
- ヒーロー画像がOGPにも指定されているか
- 回路記事ならラダー例または回路例があるか
- 関連記事が3〜6件あるか
- 存在しないリンクがないか
- canonical / og:url / 確認URL が一致しているか

## 13. 新しいチャットでの使い方
新しいチャットでは、以下のように伝える。

このチャットでは my-site の新規記事制作を進めます。
docs/article-workflow.md、docs/image-generation-rules.md、docs/new-article-checklist.md、docs/codex-update-rules.md を前提にしてください。
画像生成時は docs/image-generation-rules.md の guide-characters 参照ルールに従ってください。

確認コマンド：
ls -la docs
rg -n "新規記事|OGP兼用|guide-characters|コピー方式|ラダー例|3〜6件|site-search.js|CODEX|/seo/sitemap.xml" docs/new-article-checklist.md

報告形式：
Summary
- 作成したdocsファイル
- 入れた主なチェック項目

Testing
- ls確認結果
- rg確認結果

判定
safe to merge / not safe
