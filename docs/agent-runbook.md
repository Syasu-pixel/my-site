# agent runbook

## 目的
- 記事制作時に ChatGPT / Codex が迷わないよう、実行順と判断基準をまとめる。

## 実行順（新規記事・更新共通）
1. `docs/article-workflow.md` を確認する。
2. `docs/new-article-checklist.md` を確認する。
3. 記事タイプに応じて `docs/article-type-templates.md` を確認する。
4. 画像がある場合は `docs/image-generation-rules.md` を確認する。
5. 必要なら `docs/reference-notes/{slug}.md` と `docs/terminology/` を確認・更新する。

## キャラクター運用の要点
- 画像生成の正本テンプレートは `assets/images/character-templates/senpai-kouhai-character-template.png`。
- `senpai-kouhai-chibi-character-template.png` は補助参照または旧テンプレート。
- `assets/images/guide-characters/` はHTML会話ブロック表示用で、画像生成テンプレートとは用途が異なる。
- hero採用後は、正本テンプレート + 採用済みhero の両方を後続画像で参照する。

## 記事更新時の要点
- まず更新理由と公式参照元を確認する。
- 既存記事の影響範囲を特定し、必要箇所のみ差分更新する。
- 更新PRで、変更理由・更新範囲・未更新範囲・参照元を報告する。
- `safe to merge: YES / NO` を明記する。

## Step 1納品構成
- 日本語記事: `articles/{slug}.html` + `assets/images/{slug}/` + `docs/reference-notes/{slug}.md`
- 英語記事: `en/articles/{slug}.html` + `assets/images/{slug}-en/` + `docs/reference-notes/{slug}.md`
- Step 1では `index.html` / `categories/**` / `search-index` / `sitemap` / `backlog` を変更しない。


## Support this site 支援リンク運用ルール
- Support this site の PayPal / Buy me a coffee リンクは、ユーザー確認済みの正式URLだけを使う。
- Agent / ChatGPT / Codex は、支援リンクURLを推測して作らない。
- 支援リンクの正式URLが不明な場合は、記事HTMLへ新規追加せず、ユーザー確認待ちにする。
- `https://www.paypal.com/paypalme/denkicontrol` のような未確認URLを使わない。
- `href="#"` や空リンクを残さない。
- `target="_blank"` の外部リンクには `rel="noopener"` を付ける。
