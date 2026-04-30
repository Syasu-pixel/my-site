# 古い記事リフレッシュ運用テンプレート（現在スタイル統一）

## 1. 目的
- 古い工具記事・古い記事HTMLを、現在の固定ヘッダー・検索フォーム・右カラム・カード構造・コピー方式に統一する。
- 記事URLを変えずに、見た目・読みやすさ・関連記事導線・商品導線を改善する。

## 2. 基本方針
- 最新GitHubの対象記事HTMLを必ず確認してから作業する。
- 完成済み記事HTMLをコピーして、必要箇所だけ差し替える。
- 見た目だけ似せるのではなく、固定ヘッダー・検索フォーム・右カラム・`section-card`・`related-grid` などの構造を維持する。
- 古い記事の本文・商品情報・Amazonリンク・画像パスは勝手に消さない。
- 記事URLは変更しない。

## 3. 維持するもの
- canonical URL
- 既存のAmazonリンク
- 既存の商品画像パス
- 既存の重要本文
- 既存の内部リンクで有効なもの
- 既存のOGP画像（ただし明示があれば差し替え可）

## 4. 今のスタイルへ寄せるもの
- 固定ヘッダー
- サイト内検索フォーム
- パンくず
- ヒーロー
- 向いている人 / まだ不要な人 / 先に結論
- この記事でわかること
- 右カラムの目次・まとめ
- `section-card`
- `talk-thread`
- `article-figure`
- `check-grid`
- `table-wrap`
- `related-grid`
- footer
- `site-search.js`

## 5. 工具記事で特に注意すること
- 商品カードのAmazonリンクを壊さない。
- 画像クリックでAmazonへ行く導線を維持する。
- 1位カードだけ強調する既存方針を守る。
- 商品説明は売り込みすぎない。
- 向いている人 / まだ不要な人 / 使い分けを明確にする。
- 関連記事は前工程・後工程・一緒に使う工具へ自然につなげる。

## 6. search-index / sitemap の扱い
- URLが変わらないリフレッシュ作業では、原則 `search-index.json` と `sitemap.xml` は触らない。
- `title` や `description` を大きく変更する場合のみ、`search-index` の `title` / `description` 更新を検討する。
- `/seo/sitemap.xml` は非運用なので触らない。

## 7. 禁止事項
- 記事URLを変更しない。
- 既存Amazonリンクを削除しない。
- 画像パスを未確認で変更しない。
- 関係ない記事やカテゴリページを触らない。
- 固定ヘッダーや右カラムを独自に作り直さない。
- `site-search.js` を重複読み込みしない。
- `/seo/sitemap.xml` を触らない。

## 8. CODEX依頼テンプレ
以下の形式を使って依頼する。

```md
目的：
古い記事を現在のサイトスタイルへ統一してください。

対象ファイル：
- articles/xxxx.html

コピー元の基準記事：
- articles/relay-basic.html
または
- articles/lamp-indicator-circuit-basic.html

触ってよいファイル：
- articles/xxxx.html

触らないファイル：
- index.html
- categories/**
- assets/data/search-index.json
- sitemap.xml
- assets/images/**
- /seo/sitemap.xml

重要：
記事URL、既存Amazonリンク、商品画像パス、canonicalは原則維持してください。
固定ヘッダー、検索フォーム、右カラム、section-card、related-grid は現在のテンプレに合わせてください。
本文は削りすぎず、現在の読みやすい構造へ移植してください。

Testing：
- rg -n "site-search.js|canonical|amazon|amzn|related-grid|section-card|side-rail|article-hero" articles/xxxx.html
- site-search.js が1回だけ読み込まれているか確認
- 画像パスが存在するか確認
- Amazonリンクが消えていないか確認
- 関連記事リンクが実在するか確認

報告形式：
Summary
- 統一した構造
- 維持したリンク・画像
- 更新した見出し・関連記事
- 変更ファイル

Testing
- rg確認結果
- site-search.js重複確認
- 画像存在確認
- Amazonリンク確認

判定
safe to merge / not safe
```
