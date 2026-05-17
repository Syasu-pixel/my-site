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


## 英語記事制作の担当固定（Step 1 / Step 2）
- Step 1（記事本体と画像の作成・アップロード）は ChatGPT + ユーザー担当とし、Codexは原則担当しない。
- Step 1では、ChatGPTが英語記事HTML作成と画像生成を行い、ユーザーがHTMLと画像ZIPをGitHubへアップロードする。
- Step 2（導線追加）は、Step 1完了とユーザー確認後にCodexへ依頼する。
- CodexはStep 2として、language-menu / hreflang 相互リンク確認、`en/index.html`、`en/categories/**`、`assets/data/search-index.json`、`sitemap.xml`、`docs/en-article-backlog.md` の更新を担当する。
- Step 2で日本語記事 `articles/{slug}.html` を変更する場合は、language-menu / hreflang 相互リンクの該当箇所に限定する。
- Codexは「英語記事を作る」等の曖昧依頼だけで、Step 1とStep 2を一括実行しない。

## Codex指示の標準ルール
Codexへ作業を依頼する場合は、以下を必ず明記する。

1. 対象リポジトリ
- 必ず `Syasu-pixel/my-site` と書く。

2. 目的
- 何を直すタスクかを1〜3行で明記する。
- 「リンク修正」「本文強調」「Step 2導線追加」「整形のみ」など、作業種別を明確にする。

3. 変更してよいファイル
- `今回触ってよいファイル` を必ず列挙する。
- 可能な限り最小ファイル数にする。

4. 触ってはいけないファイル
- `触らないファイル` を必ず列挙する。
- 特に以下は、対象外なら必ず禁止する。
  - `articles/**`
  - `en/articles/**`
  - `assets/**`
  - `index.html`
  - `en/index.html`
  - `categories/**`
  - `en/categories/**`
  - `assets/data/search-index.json`
  - `sitemap.xml`
  - `seo/sitemap.xml`
  - `docs/en-article-backlog.md`

5. 修正対象の範囲
- 可能なら、対象セクション・対象class・対象文言・対象行の目印を明記する。
- 例:
  - `aside.side-rail` 内だけ
  - `New articles` の `<ul>` 内だけ
  - `support-card` だけ
  - `thermal-relay-basic` の `<li>` だけ

6. 作業内容
- 変更前と変更後をできるだけコードで示す。
- 抽象的な「自然に直して」だけで依頼しない。
- 既存構造・既存class・既存リンクルールに合わせることを書く。

7. 禁止事項
- 本文を変えない
- CSSを追加しない
- 新規classを作らない
- リンクを推測しない
- 画像パスを変えない
- sitemap/search-index/backlogを触らない
など、今回のタスクで禁止することを明記する。

8. 確認項目
- 作業後にCodexが確認する項目を箇条書きで書く。
- 例:
  - 変更ファイルが許可範囲内か
  - href="#" が追加されていないか
  - 既存リンクを壊していないか
  - Support this site の正式リンクが維持されているか
  - /seo/sitemap.xml を触っていないか

9. 報告形式
Codexには最後に必ず以下の形式で報告させる。

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
- 日本語記事: `articles/{slug}.html` + `assets/images/{slug}/` + `docs/reference-notes/{slug}.md`
- 英語記事: `en/articles/{slug}.html` + `assets/images/{slug}-en/` + `docs/reference-notes/{slug}.md`
- Step 1では `index.html` / `categories/**` / `search-index` / `sitemap` / `backlog` を変更しない。

## Step 2 language-menu 相互リンク完了条件
英語記事の Step 2 導線追加では、以下を必ず確認する。

1. 英語記事側の language-menu
   - `en/articles/{slug}.html` から `../../articles/{slug}.html` または既存構造に合う日本語記事へリンクできること。
   - small文言は `English article` / `Japanese article` など記事ページ用になっていること。
   - `English top` / `Japanese top` のようなトップページ用文言を記事ページに残さないこと。

2. 日本語記事側の language-menu
   - `articles/{slug}.html` から `../en/articles/{slug}.html` へリンクできること。
   - small文言は `日本語記事` / `English article` を使うこと。
   - `日本語トップ` / `English top` のようなトップページ用文言を記事ページに残さないこと。

3. Step 2で日本語記事を触ってよい条件
   - 日本語記事側の language-menu / hreflang / 相互リンク確認に必要な場合のみ、`articles/{slug}.html` を変更してよい。
   - 変更範囲は language-menu / hreflang 相互リンクだけに限定する。
   - 本文、画像、Support this site、Category links、関連記事本文は変更しない。

4. PR報告の必須項目（Step 2）
   - 英語記事側 language-menu: 修正済み / 既に正しい / 未確認
   - 日本語記事側 language-menu: 修正済み / 既に正しい / 未確認
   - 日本語記事から英語記事への href
   - 英語記事から日本語記事への href
   - `日本語トップ` / `English top` が記事ページの language-menu に残っていないこと
   - language-menu 未確認の場合は `safe to close: NO`

5. safe to close 判定
   - 日本語記事 → 英語記事のリンクが未確認なら `safe to close: NO`
   - 英語記事 → 日本語記事のリンクが未確認なら `safe to close: NO`
   - 文言がトップページ用のままなら `safe to close: NO`

## HTML内リンク確認の要点
- 記事HTMLを作成・更新・PR確認する場合、HTML内のすべての `href` を確認する。
- 関連記事カードだけでなく、パンくず、記事下部ボタン、右カラム、カテゴリリンク、language-menu、フッター、Support this site も確認対象にする。
- 内部リンクは GitHub `main` 上で実在するファイルだけに向ける。
- 存在未確認のカテゴリページ、仮リンク、未確認支援リンクを入れない。
- ボタン文言とリンク先が一致しているか確認する。
- 未確認リンクが残る場合は `safe to merge: NO` とする。
- 詳細は `docs/new-article-checklist.md` の `0.7. HTML内リンク実在確認ルール` を参照する。

## Support this site 支援リンク運用ルール
- 正式な支援リンクは以下で固定する。
  - Buy me a coffee: `https://buymeacoffee.com/denkicontrol`
  - PayPal: `https://www.paypal.com/paypalme/denkicontrol`
- Agent / ChatGPT / Codex は、上記以外の支援リンクURLを推測して使わない。
- 支援カードを追加・復旧する場合は、この2つのURLを使う。
- `href="#"` や空リンクを残さない。
- `target="_blank"` の外部リンクには `rel="noopener"` を付ける。
