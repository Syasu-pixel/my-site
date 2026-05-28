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

## 2026-05-22

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