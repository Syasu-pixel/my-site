# agent runbook

## 目的
- 記事制作時に ChatGPT / Codex が迷わないよう、実行順と判断基準をまとめる。
- 上位正本は `docs/ai-editorial-master-rules.md`。下位文書と矛盾する場合はマスタールールを優先する。

## 実行順（新規記事・更新共通）
1. `docs/ai-governance.md` と `docs/ai-editorial-master-rules.md` を確認する。
2. `docs/article-workflow.md` を確認する。
3. `docs/new-article-checklist.md` を確認する。
4. 記事タイプに応じて `docs/article-type-templates.md` を確認する。
5. 画像がある場合は `docs/image-generation-rules.md` を確認する。
6. 必要なら `docs/reference-notes/{slug}.md` と `docs/terminology/` を確認・更新する。

## 制作担当の正本
- ChatGPT / AI編集部が完成記事HTMLと記事画像を作成する。
- Codexは記事本文をゼロから執筆する主担当にしない。
- Codexは配置、静的チェック、リンク・画像存在確認、限定的な細修正、Step 2導線整備を担当する。
- 日本語記事Step 1はAI編集部が確認用GitHub反映とNetlify Deploy Preview作成まで自動進行できる。
- MEDIUM/HIGH記事は管理者がNetlify Deploy Previewを目視確認してから公開工程へ進む。
- LOW自動公開の範囲は `docs/ai-editorial-master-rules.md` の定義に限定する。

## キャラクター運用の要点
- 画像生成の正本テンプレートは `assets/images/character-templates/senpai-kouhai-character-template.png`。
- `senpai-kouhai-chibi-character-template.png` は補助参照または旧テンプレート。
- `assets/images/guide-characters/` はHTML会話ブロック表示用で、画像生成テンプレートとは用途が異なる。
- Agent / ChatGPT / Codex は、画像生成時に `assets/images/guide-characters/` を正本テンプレートとして扱わない。
- hero採用後は、正本テンプレート + 採用済みhero の両方をキャラクター入り後続画像で参照する。
- 画像は5枚固定ではない。hero + OGP + 本文1〜4枚を原則とし、不要な説明画像を枚数合わせで作らない。
- 生成側自己評価95点以上 + 独立IMAGE REVIEWER通過をPreview採用条件とする。

## 記事更新時の要点
- まず更新理由と公式参照元を確認する。
- 既存記事の影響範囲を特定し、必要箇所のみ差分更新する。
- 更新PRで、変更理由・更新範囲・未更新範囲・参照元を報告する。
- `safe to merge: YES / NO` を明記する。

## Step 1 / Step 2
- Step 1は記事本体、記事画像、技術/SEO/画像監査、確認用GitHub反映、Netlify Deploy Previewまでを扱う。
- Step 1ではトップ、カテゴリ、search-index、sitemap、backlog等のStep 2公開導線を変更しない。
- Step 2は管理者がPreviewを明示OKした後に開始する。
- 英語記事について既存の手動アップロード方式が必要な環境では従来手順を使用できるが、AI編集部から安全にGitHub反映できる場合はマスタールールを優先する。

## Codex指示の標準ルール
Codexへ作業を依頼する場合は以下を必ず明記する。
1. 対象リポジトリ `Syasu-pixel/my-site`
2. 目的（1〜3行）
3. 今回触ってよいファイル（最小化）
4. 触らないファイル
5. 修正対象セクション/class/文言等
6. 具体的な作業内容
7. 禁止事項
8. 作業後の確認項目
9. 報告形式

対象外なら特に `articles/**`、`en/articles/**`、`assets/**`、`index.html`、`en/index.html`、`categories/**`、`en/categories/**`、`assets/data/search-index.json`、`sitemap.xml`、`seo/sitemap.xml`、backlog類を変更禁止に含める。

報告形式:
```text
変更ファイル:
- ...

修正内容:
- ...

確認結果:
- ...

safe to merge: YES / NO
```

## Step 1納品構成
- 日本語記事: `articles/{slug}.html` + `assets/images/{slug}/` + 必要に応じて `docs/reference-notes/{slug}.md`
- 英語記事: `en/articles/{slug}.html` + `assets/images/{slug}-en/` + 必要に応じて `docs/reference-notes/{slug}.md`
- Step 1では `index.html` / `categories/**` / `search-index` / `sitemap` / `backlog` を変更しない。

## Step 2 language-menu 相互リンク完了条件
- 英語記事側から既存構造に合う日本語記事へリンクできること。
- 日本語記事側から対応する英語記事へリンクできること。
- 記事ページにトップページ用language-menu文言を残さない。
- Step 2で日本語記事を触る場合はlanguage-menu / hreflang相互リンクだけに限定する。
- 双方向リンク未確認または文言不整合なら `safe to close: NO`。

## HTML内リンク確認の要点
- 記事HTMLを作成・更新・PR確認する場合、HTML内のすべての `href` を確認する。
- パンくず、記事下部ボタン、右カラム、カテゴリリンク、language-menu、フッター、Support this siteも確認対象にする。
- 内部リンクはGitHub `main` 上で実在するファイルだけに向ける。ただし同一Step 1 PR内で新規作成する対象へのリンクはPR内実在を確認する。
- 存在未確認のカテゴリページ、仮リンク、未確認支援リンクを入れない。
- ボタン文言とリンク先が一致しているか確認する。
- 未確認リンクが残る場合は `safe to merge: NO` とする。

## Support this site 支援リンク運用ルール
- 正式な支援リンクは以下で固定する。
  - Buy me a coffee: `https://buymeacoffee.com/denkicontrol`
  - PayPal: `https://www.paypal.com/paypalme/denkicontrol`
- 上記以外の支援リンクURLを推測して使わない。
- `href="#"` や空リンクを残さない。
- `target="_blank"` の外部リンクには `rel="noopener"` を付ける。
