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
