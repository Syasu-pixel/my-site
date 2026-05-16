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
- Agent / ChatGPT / Codex は、画像生成時に `assets/images/guide-characters/` を正本テンプレートとして扱わない。
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

## HTML内リンク確認の要点
- 記事HTMLを作成・更新・PR確認する場合、HTML内のすべての `href` を確認する。
- 関連記事カードだけでなく、パンくず、記事下部ボタン、右カラム、カテゴリリンク、language-menu、フッター、Support this site も確認対象にする。
- 内部リンクは GitHub `main` 上で実在するファイルだけに向ける。
- 存在未確認のカテゴリページ、仮リンク、未確認支援リンクを入れない。
- ボタン文言とリンク先が一致しているか確認する。
- 未確認リンクが残る場合は `safe to merge: NO` とする。
- 詳細は `docs/new-article-checklist.md` の `0.7. HTML内リンク実在確認ルール` を参照する。

## Support this site 支援リンク運用ルール
- Support this site の PayPal / Buy me a coffee リンクは、ユーザー確認済みの正式URLだけを使う。
- Agent / ChatGPT / Codex は、支援リンクURLを推測して作らない。
- 支援リンクの正式URLが不明な場合は、記事HTMLへ新規追加せず、ユーザー確認待ちにする。
- `https://www.paypal.com/paypalme/denkicontrol` のような未確認URLを使わない。
- `href="#"` や空リンクを残さない。
- `target="_blank"` の外部リンクには `rel="noopener"` を付ける。
- 支援リンクの正式URLが未確定の間は、既存記事テンプレートから PayPal / Buy me a coffee リンクをコピーして新規記事へ入れず、未確認URLが入っている既存記事の修正は別タスクで行う。
