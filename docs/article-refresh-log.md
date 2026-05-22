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
- 実施内容:
  - 「制御盤 トランス」「制御トランス」という現場での呼ばれ方を自然に補足
  - 一次側・二次側・二次側保護・負荷側の切り分け説明を軽く補強
  - 関連記事に `control-panel-grounding-basic.html` を追加
  - 右カラムの先に読む記事に `control-panel-grounding-basic.html` を追加
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
