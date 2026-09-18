# 記事リフレッシュ記録

このファイルは、既存記事の画像・OGP・カテゴリカード・関連記事導線などを改善した履歴を記録するためのログです。

## 運用ルール

- 既存記事の画像、OGP、カテゴリカード、関連記事導線、本文の軽微改善を行ったら記録する。
- 記事URLを変更しないリフレッシュ作業も記録対象にする。
- 画像を追加した場合は、画像パスを必ず記録する。
- HTML反映PRがある場合は、PR番号を記録する。
- `sitemap.xml` や `search-index.json` を触らなかった場合も、触っていないことを記録する。
- 画像ファイルが存在しない状態でHTMLだけ差し替えない。
- `/seo/sitemap.xml` は非運用なので触らない。

---

## 2026-09-19 — 既存記事のリンク・表示不備修正（確認用、未公開）

- PR: [#1514](https://github.com/Syasu-pixel/my-site/pull/1514)。追加4ページを含むmain `c86a6e7` を保持した独立ブランチ。マージ・本番公開は本依頼の対象外。
- 英語関連記事: `air-breaker-basic` のSurge Protection → `surge-protection-basic`、`control-panel-cooling-fan-basic` のDC Motor Control → `dc-motor-control-basic`、`surge-protection-basic` のCooling Fan → `control-panel-cooling-fan-basic`。表示名・説明・順序は維持し、リンク先に対応する既存OGPを生成時に取得する。画像の新規作成・差し替えはない。
- 英語フッター: `control-panel-grounding-basic`、`control-panel-label-basic`、`control-panel-outlet-basic`、`control-panel-wire-color-basic`、`din-rail-basic`、`terminal-block-basic`、`terminal-block-jumper-basic`、`wire-number-marker-basic` のcontact/privacy-policy計16リンクを、共通footer `en-footer-0a54aa29e78c.njk` から実在ディレクトリへ再生成。
- 日本語 `pressure-switch-vs-gauge-basic`: `.term` の幅制限と折り返しだけを修正。390px画面でscrollWidth 424px → 375px（縦スクロールバー15pxを除く本文幅）。比較表の内部スクロールを保持。
- 本文、記事URL、更新日、SEO情報、画像ファイル、フォーム、投票処理、`sitemap.xml`、`assets/data/search-index.json`、`/seo/sitemap.xml` は変更なし。通常記事のヒーロー分離や技術内容改善は別作業。
- 12記事の正本ハッシュと3カードの検証値を明示修正に同期。shell比較基準は修正ソースcommit `f6cf5e30dbb7d5dd46590b6f348cdcc41efc23be` へ別commitで固定し、判定・対象範囲は保持。
- ローカルで12記事×4幅、修正先5URLの200、288記事本文等保持、関連記事1361/案内9、リンク監査不備0、追加4ページを含む公開境界を確認。GitHub全件検査の最終結果はPRに記録する。実機Safari・実投票・実フォーム送信は未検証。

---

## 2026-05-22

- 2026-06-01: Bing / IndexNow 運用と meta description 作成方針を今後のCodex作業で維持できるよう、テンプレート・運用ルール系docsへ追記。IndexNowキー確認ファイルとworkflowは削除・変更しない方針、meta descriptionは新規記事作成時から短すぎない自然な説明文にする方針を明文化。

- 2026-06-01: Bing向けの更新通知を自動化するため、IndexNowキー確認ファイルをサイトルートに追加し、main更新時に変更されたHTML URLをIndexNow APIへ送信するGitHub Actions workflowを追加。本文・画像・CSS・sitemap・search-index・既存HTML構造は変更しない。

- 2026-06-01: Bing Webmaster Tools の「meta description が短い」指摘に対応するため、添付CSV掲載URLを対象に各HTMLの meta description を確認し、短すぎる説明文を記事内容に合わせて自然な長さへ補強。本文・画像・CSS・title・canonical・OGP・sitemap・search-index は変更しない方針で実施。

- 2026-05-28: `articles/a-contact-b-contact-basic.html` の古い記事内画像2枚を新しい図解画像へ差し替え。あわせて「a接点 b接点 覚え方」クエリを意識し、通常時/動作時の見方、a接点=普段OFF→動作ON、b接点=普段ON→動作OFFが目に入りやすいよう本文を整理。

- 2026-05-28: `articles/star-delta-start-basic.html` の本文に太字・色付き強調・短段落化を追加し、切替の流れ、電気図の流れ、直入れ始動との違い、確認ポイントを読みやすく調整。

- 2026-05-28: `articles/control-transformer-basic.html` の「制御盤内の結線イメージ」セクションに、制御用トランスの盤内結線イメージ図（article-figure）を追加。

### star-delta-start-basic

- 対象記事: `articles/star-delta-start-basic.html`
- 対象クエリ:
  - `スターデルタ回路`
  - `スター デルタ回路`
- 実施内容:
  - 「簡略ラダー例」という表現を、記事内容に合わせて「電気図の流れ」へ調整
  - スター・デルタ始動をラダー回路ではなく、主接触器・スター接触器・デルタ接触器・タイマの時間順の流れとして読めるように補正
  - 表の見出しと文言を、電気図上の接触器の動きとして自然に読める表現へ調整
  - 既存のタイマ設定時間・切替時間の補足は維持
- 変更しなかったもの:
  - カテゴリ
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリ確認後の記事内容整合調整

### relay-socket-basic

- 対象記事: `articles/relay-socket-basic.html`
- 対象クエリ:
  - `relay socket`
  - `relay socket terminals`
- 実施内容:
  - relay socket / relay socket terminals の英語表記を軽く補足
  - リレーソケット端子と端子番号の見方を軽く補強
  - 関連記事に `a-contact-b-contact-basic.html` を追加
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強

### air-filter-regulator-lubricator-basic

- 対象記事: `articles/air-filter-regulator-lubricator-basic.html`
- 対象クエリ:
  - `filter regulator lubricator`
  - `compressed air filter regulator lubricator`
  - `air filter regulator lubricator`
  - `frlユニットとは`
- 実施内容:
  - FRLの英語表記とFilter / Regulator / Lubricatorの意味を軽く補足
  - フィルタ・レギュレータ・ルブリケータの役割分担を軽く補強
  - 関連記事に `air-pneumatic-troubleshooting-guide.html` を追加
  - 右カラムの先に読む記事に `air-pneumatic-troubleshooting-guide.html` を追加
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強

### a-contact-b-contact-basic

- 対象記事: `articles/a-contact-b-contact-basic.html`
- 対象クエリ:
  - `a接点 b接点 覚え方`
  - `a接点 b接点`
  - `NO NC 違い`
- 実施内容:
  - a接点・b接点の覚え方を「通常時」と「動作時」で見る説明として軽く補強
  - NO / NCとの関係説明を軽く補足
  - 関連記事の `no-nc-basic.html` への説明文を軽く調整
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強

## 2026-05-21

### forward-reverse-circuit-basic

- 対象記事: `articles/forward-reverse-circuit-basic.html`
- 対象カテゴリ: `categories/circuit-basics.html`
- 追加画像:
  - `assets/images/forward-reverse-circuit-basic/forward-reverse-circuit-basic-ogp.png`
- 実施内容:
  - `articles/forward-reverse-circuit-basic.html` の `og:image` を `forward-reverse-circuit-basic-hero.png` から `forward-reverse-circuit-basic-ogp.png` へ変更
  - `articles/forward-reverse-circuit-basic.html` の `twitter:image` を `forward-reverse-circuit-basic-hero.png` から `forward-reverse-circuit-basic-ogp.png` へ変更
  - `categories/circuit-basics.html` の正転・逆転回路カード画像を `forward-reverse-circuit-basic-ogp.png` へ変更
  - 記事hero背景は既存の `forward-reverse-circuit-basic-hero.png` のまま維持
- 変更しなかったもの:
  - 記事本文
  - CSS
  - canonical
  - og:url
  - title
  - meta description
  - `sitemap.xml`
  - `assets/data/search-index.json`
- HTML反映PR:
  - `#1225 Apply Forward Reverse circuit OGP image`
- 状態:
  - safe to merge 確認済み

### magnetic-switch-basic

- 対象記事: `articles/magnetic-switch-basic.html`
- 対象カテゴリ: `categories/circuit-basics.html`
- 追加画像:
  - `assets/images/magnetic-switch-basic/magnetic-switch-basic-ogp.png`
- 実施内容:
  - `articles/magnetic-switch-basic.html` の `og:image` を `magnetic-switch-overview.png` から `magnetic-switch-basic-ogp.png` へ変更
  - `articles/magnetic-switch-basic.html` に `twitter:image` を追加
  - `categories/circuit-basics.html` のマグネットスイッチカード画像を `magnetic-switch-basic-ogp.png` へ変更
  - 記事hero背景は既存の `magnetic-switch-overview.png` のまま維持
- 変更しなかったもの:
  - 記事本文
  - CSS
  - canonical
  - og:url
  - title
  - meta description
  - `sitemap.xml`
  - `assets/data/search-index.json`
- HTML反映PR:
  - `#1226 Apply Magnetic Switch OGP image`
- 状態:
  - safe to merge 確認済み


### star-delta-start-basic

- 対象記事: `articles/star-delta-start-basic.html`
- 対象クエリ:
  - `スターデルタ回路`
  - `スター デルタ回路`
  - `スターデルタタイマ 設定時間`
  - `スター デルタ タイマ 設定時間`
  - `直入れ スターデルタ 使い分け`
- 実施内容:
  - スター・デルタタイマの設定時間を見る時の考え方を追記
  - 直入れ始動とスター・デルタ始動の使い分け説明を軽く補強
  - 関連記事に `timer-circuit-basic.html` を追加
  - 右カラムの先に読む記事に `timer-circuit-basic.html` を追加
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強


### control-transformer-basic

- 対象記事: `articles/control-transformer-basic.html`
- 対象クエリ:
  - `制御盤 トランス`
  - `制御トランス`
  - `control transformer`
- 実施内容:
  - 黒文字中心で読みづらかった本文を、強調・短段落・注意ボックスで整理
  - 一次側 / 二次側 / 制御回路用電源の説明を見やすく補強
  - 制御盤内での結線イメージが伝わるよう、盤内での電源の流れの説明を整理
  - 小型の制御用トランスが盤内でどう使われるか分かりやすく調整
- 変更しなかったもの:
  - カテゴリ
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリ確認後の読みやすさ改善と内容整理

- 2026-05-28: `articles/star-delta-start-basic.html` の「電気図の流れで見る」セクションに配線イメージ図（article-figure）を追加。