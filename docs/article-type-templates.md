# 記事タイプ別テンプレート（article type templates）

## 目的
- 記事タイプごとに見出し構成を固定化し、日英で一貫した読みやすさとSEO導線を維持する。

## 共通ルール
- 先に記事タイプを決めてから見出しを作る。
- h1直下で「この記事で分かること」を短く示す。
- language-menu で日英記事を相互リンクする。
- 画像は `hero / overview / comparison / check-flow / ogp` を1用途1枚で使い分ける。
- `img` のaltは具体的に、`figcaption` は文脈補足として重複させない。

## 1) 基礎解説記事（Fundamentals）
推奨構成:
1. 概要（What it is）
2. なぜ必要か（Why it matters）
3. 仕組み（How it works）
4. よくある注意点
5. まとめ

## 2) 比較・使い分け記事（Comparison）
推奨構成:
1. 比較対象の定義
2. 比較表（用途・コスト・保守性など）
3. シーン別の選び方
4. 導入前チェック
5. まとめ

## 3) 手順・トラブル対応記事（Procedure / Troubleshooting）
推奨構成:
1. 前提条件・安全注意
2. 手順（STEP）
3. 失敗しやすいポイント
4. 切り分けチェック
5. まとめ

## 英語記事の自然化ルール
- 直訳ではなく、英語話者が自然に読める順序（結論→理由→補足）で書く。
- 見出しは短く具体的にし、曖昧な名詞句を避ける。
- 同じ概念に複数の訳語を混在させない。

## 日英SEO導線ルール
- canonical / og:url / hreflang / sitemap は `https://denkicontrol.com` で統一する。
- Step 2で `en/index.html`、`en/categories/**`、`assets/data/search-index.json`、`sitemap.xml`、`docs/en-article-backlog.md` の更新整合を確認する。


## 記事更新フロー
- 記事更新では、原則として全文を丸ごと書き換えない。
- 更新理由・公式参照元・影響範囲を先に整理し、必要箇所だけ差分更新する。
- 全文書き換えは、章構成の破綻など明確な理由がある場合に限る。
- 日英記事の同期、画像更新、reference-notes / terminology 更新の必要性を確認する。
- 更新PRでは「変更理由」「更新した範囲」「更新しなかった範囲」「確認した公式参照元」「safe to merge: YES / NO」を報告する。


## HTML内リンク実在確認テンプレートルール
- テンプレート適用時は、関連記事カードに加えて、パンくず・戻るボタン・右カラムCategory links・language-menu・フッター内リンク・画像 `src`・OGP/twitter画像・ヒーロー背景画像の実在確認を行う。
- カテゴリURLは推測で作らず、日本語は `categories/*.html`、英語は `en/categories/*.html` の実在確認後に設定する。
- 対応カテゴリ未作成時は暫定で `../index.html`（または `../`）へ戻し、表示文言を `English Home` / `Back to English Home` などに合わせる。
- 右カラムで同一URLを重複配置しない。
- 関連記事は実在記事のみ（英語記事は `en/articles/*.html` 実在のみ）を掲載し、未作成記事を先行リンクしない。
- language-menuは日英記事の相互リンク実在を確認し、small文言は `日本語記事` / `English article` を使う。
