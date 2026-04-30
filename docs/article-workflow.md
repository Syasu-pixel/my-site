# 記事制作ワークフロー（article workflow）

## 基本方針
- 新規記事HTMLは**コピー方式**で作成する。
- 完成済み記事HTMLを**完全コピー**し、必要箇所のみ差し替える。
- 既存テンプレートのレイアウト一貫性を優先し、構造改変は最小限にする。

## 基準記事（コピー元の明記）
- 新規記事HTMLは、完成済み記事を**完全コピー**して必要箇所だけ差し替える。
- 現時点の主な基準記事は以下。
  - `articles/relay-basic.html`
  - `articles/forward-reverse-circuit-basic.html`
  - `articles/lamp-indicator-circuit-basic.html`

## 維持する必須要素
- 固定ヘッダー
- 検索フォーム
- 右カラム
- `section-card`
- `talk-thread`
- `related-grid`
- `site-search.js`

上記は記事ページのUI/UX統一のため、基本的に維持する。

## 記事内容ルール
- 回路記事は基本ラダー例を入れる。
- 関連記事は3〜6件までを目安に設定してよい。
- 存在しないリンクは入れない（公開済みURLのみ使用）。

## 実装上の注意
- `site-search.js` は重複読み込みしない。
- 変更対象は必要箇所に限定し、無関係な差分を含めない。

## 事前チェック
- コピー元HTMLの構造が最新か確認。
- 関連記事リンク先の存在確認。
- スクリプト読込の重複有無確認。


## 固定ヘッダーの扱い

記事HTMLの本文テンプレートと、サイト共通の固定ヘッダーは分けて扱う。

### 記事本文テンプレート
新規記事・古い記事の移植では、以下の基準記事を完全コピーして、必要箇所だけ差し替える。

- `articles/relay-basic.html`
- `articles/forward-reverse-circuit-basic.html`
- `articles/lamp-indicator-circuit-basic.html`

維持する本文構造：
- `article-hero`
- `article-hero-copy`
- `top-summary`
- `summary-card`
- `mini-toc-card`
- `page-layout`
- `main-column`
- `side-rail`
- `side-card`
- `section-card`
- `talk-thread`
- `article-figure`
- `check-grid`
- `table-wrap`
- `related-grid`

### 固定ヘッダー
固定ヘッダーは、最終的にトップページ `index.html` の最新版を基準に全ページで統一する。

- 記事移植作業のたびに、固定ヘッダーを個別に作り直さない。
- 記事テンプレート内のヘッダーCSSを勝手に再設計しない。
- 検索フォーム構造や `site-search.js` の読み込みを重複させない。

固定ヘッダーを修正する場合は、記事本文修正とは別タスクにする。

その場合の対象は以下に限定する。

触ってよい範囲：
- `header.site-header` 周辺
- 固定ヘッダー関連CSS
- サイト内検索フォーム構造
- `site-search.js` の読み込み確認

触らない範囲：
- 記事本文
- `article-hero`
- `top-summary`
- `section-card`
- `related-grid`
- 画像パス
- Amazonリンク
- canonical / OGP
- `search-index.json`
- `sitemap.xml`
- `/seo/sitemap.xml`

### 判断ルール
記事本文テンプレートの統一作業では、固定ヘッダーの完全統一は後回しにしてよい。

ただし、以下の場合は要修正。
- ヘッダーが壊れている
- 検索フォームが使えない
- `site-search.js` が重複している

固定ヘッダーの見た目統一は、後日 `index.html` を基準に CODEX で全記事横断修正する。

