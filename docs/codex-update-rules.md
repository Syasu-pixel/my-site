# CODEX反映ルール（codex update rules）

## 前提
- 記事HTMLと画像はユーザーが先にGitHubへ入れる。
- CODEXはメタ更新・導線更新を中心に反映する。

## CODEXの主な反映対象
- トップページ
- カテゴリページ
- `assets/data/search-index.json`
- `sitemap.xml`
- 記事数表示

## 変更対象の原則
- `articles/**` と `assets/images/**` は原則触らない。
- 必要に応じて以下のみを触る。
  - `index.html`
  - カテゴリページ
  - `assets/data/search-index.json`
  - `sitemap.xml`
- `/seo/sitemap.xml` は非運用のため触らない。

## search-indexチェック
- `search-index` の以下を確認する。
  - missing
  - extra
  - duplicate

## sitemapチェック
- `sitemap.xml` の重複URL有無を確認する。
- 追加・削除された記事URLとの整合性を確認する。

## safe to merge 条件
以下を満たす場合に **safe to merge** とする。
- `search-index` に missing / extra / duplicate がない。
- `sitemap.xml` に重複がない。
- 更新対象が想定範囲（トップ、カテゴリ、search-index、sitemap、記事数表示）に収まっている。
- 非運用対象（`/seo/sitemap.xml`）を変更していない。

上記を満たさない場合は **not safe** とする。
