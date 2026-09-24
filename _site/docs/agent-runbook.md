# agent runbook

## 新規記事・更新の実作業入口

共通ひな形導入後の登録先・本文更新時の検査基準・生成・公開導線は [実作業手順](article-editing-playbook.md) を先に確認する。新規記事は第3節、既存記事は第4節、Step 2は第6節に従う。旧コピー指定や固定件数だけで処理を終えない。

## 全ルール確認の共通入口

新しいチャット・引き継ぎ・「ルールを確認して」の依頼では、[ルール確認手順](rules/README.md)と正式一覧を先に開く。開始時必須を読み、条件付き全件の適用性を判定し、必要な参照先まで確認する。未読・取得不可・適用性未判定を残して「全ルール確認済み」と言わない。個別業務の実行順は本書の該当節に従う。

## 共通ひな形移行との関係（2026-09-18）
- サイト構造・共通部品・記事制作に関係する作業では、[site-template-policy.md](site-template-policy.md) と [site-template-migration-status.md](site-template-migration-status.md) を先に確認する。
- 現在段階・採用判断・対象ごとの移行状態は、上記の移行状況文書だけを正本とする。本書の既存要件は、同方針に明示した限定例外以外は維持する。
- 方針採用後、既存の移行済みページ、または利用可能なひな形・正本を台帳で確認して新規登録するページでは、完成記事HTMLのコピーをレイアウト・共通部品と固有内容の組み合わせへ読み替える。未移行・未登録は従来方式。初回移行の扱いは同方針第6節を参照する。
- 構造移行を本文改善・公開導線追加・本番承認の省略と混同しない。相談窓口・法務・設計シリーズ等の意図した構造差を保持する。
- 段階変更は移行状況文書へ記録し、各入口に段階・件数を重複管理しない。

## 目的
- 記事制作時に ChatGPT / Codex が迷わないよう、実行順と判断基準をまとめる。
- 上位正本は `docs/ai-editorial-master-rules.md`。下位文書と矛盾する場合はマスタールールを優先する。

## 案件・連載の引き継ぎ時に追加で行うこと

- 継続案件では、共通ルール確認とは別に案件固有の正本を探す。GitHub `main` だけでなく、関連するOpen/Draft PR、作業ブランチ、過去PRの変更ファイルも確認する。
- 案件名、記事slug、設備名、シリーズ名、`master-spec`、decision log、I/O表、仕様書等を検索語に使う。
- `docs/sample-lines/**`、`docs/plc-projects/**`、`docs/reference-notes/**` は候補例であり、場所を決め打ちしない。
- 既存の案件正本が見つかったら、その状態・採用判断・更新履歴を確認してから作業を再開する。同じ目的の新しい正本を先に作らない。
- 未マージPR/ブランチ上の資料は、採用済みmainルールとは区別する。ただし案件の継続資料として無視せず、後続作業との整合を取る。
- 新規記事が既存シリーズや設備設計案件の続編である場合、本文設計の前に案件正本と直前回の記事・決定ログを照合する。

## 実行順（新規記事・更新共通）
1. `docs/ai-governance.md` と `docs/ai-editorial-master-rules.md` を確認する。
2. `docs/article-workflow.md` を確認する。
3. `docs/new-article-checklist.md` を確認する。
4. **記事監査・全記事監査・修正前監査を行う場合は、最初に `docs/article-audit-entrypoint.md` を確認し、そこから必要な正本へ進む。記事タイプ差をそのまま欠落判定せず、broken / 構造差 / 意図した例外を分離する。**
5. **既存記事の更新・改善候補選定では、本文・meta・見出しを触る前に `docs/article-update-date-guard.md` を確認する。完成・凍結状態、最終内容更新日、メーカー公式資料確認日、GitHub/PR履歴を確認し、直近28日以内に実質改善した記事を原則として再改善候補から除外する。**
6. **新規記事・既存記事で検索意図、title、meta description、H2/H3、本文補強、関連記事を検討する場合は `docs/article-search-data-precheck-override.md` と `docs/search-data-acquisition-rules.md` を確認する。既存記事では必ず前項の日付ガードを先に通す。**
7. 記事タイプに応じて `docs/article-type-templates.md` を確認する。
8. 記事評価カードを新規追加・流用・修正する場合は `docs/article-feedback-rules.md` を確認する。
9. 画像がある場合は `docs/image-generation-rules.md` を確認する。
10. 必要なら `docs/reference-notes/{slug}.md` と `docs/terminology/` を確認・更新する。

## 記事監査の入口
- 日本語記事の監査では `docs/article-audit-entrypoint.md` を案内板として最初に読む。
- 本書は監査項目そのものを重複管理せず、`article-audit-entrypoint.md` から各正本へ辿る。
- language-menu のbroken判定では、相対URLを文字列だけで判定せず `docs/language-menu-audit-method-review.md` の base解決 → `index.html` 補完 → 実在確認を使う。
- 監査結果から修正へ進む前に、記事タイプ例外、日付ガード、完成・凍結状態、保守か実質改稿かを再判定する。

## 制作担当の正本
- ChatGPT / AI編集部が完成記事HTMLと記事画像を作成する。
- Codexは記事本文をゼロから執筆する主担当にしない。
- Codexは配置、静的チェック、リンク・画像存在確認、限定的な細修正、Step 2導線整備を担当する。
- 日本語記事Step 1はAI編集部が確認用GitHub反映と現行の公開生成と一致するPreview作成まで自動進行できる。
- MEDIUM/HIGH記事は管理者が現行の公開生成と一致するPreviewを目視確認してから公開工程へ進む。
- LOW自動公開の範囲は `docs/ai-editorial-master-rules.md` の定義に限定する。

## キャラクター運用の要点
- 画像生成の正本テンプレートは `assets/images/character-templates/senpai-kouhai-character-template.png`。
- `senpai-kouhai-chibi-character-template.png` は補助参照または旧テンプレート。
- `assets/images/guide-characters/` はHTML会話ブロック表示用で、画像生成テンプレートとは用途が異なる。
- Agent / ChatGPT / Codex は、画像生成時に `assets/images/guide-characters/` を正本テンプレートとして扱わない。
- hero採用後は、正本テンプレート + 採用済みhero の両方をキャラクター入り後続画像で参照する。
- 画像は5枚固定ではない。hero + OGP + 本文1〜4枚を原則とし、不要な説明画像を枚数合わせで作らない。
- 生成側自己評価95点以上 + 独立IMAGE REVIEWER通過をPreview採用条件とする。

## 記事評価カード運用の要点
- 記事評価を扱う場合は `docs/article-feedback-rules.md` を正本として確認する。
- 評価カードは共通 `assets/js/article-feedback.js` を使い、記事ごとの投票処理を別JSへ複製しない。
- `article_slug` は記事固有値とし、別記事へコピー元のslugを残さない。
- 1ブラウザ・1記事・1票を維持し、2回目は追加・上書きせず投票済み表示へ遷移させる。
- 新しい記事へ追加した場合は、記事側だけでなくbackendの許可記事登録と `/admin/` の記事別集計まで確認する。
- `site-search.js` 等へ投票処理を重複実装しない。
- JS更新時はキャッシュキーを更新し、旧JSが残らないようにする。

## 記事更新時の要点
- まず更新理由と公式参照元を確認する。
- **既存記事は `docs/article-update-date-guard.md` を先に確認し、最近実質更新した記事を検索データだけで再編集しない。**
- **メーカー公式資料を参照する記事では、`docs/reference-notes/{slug}.md` の公式URL・資料名・確認日を確認し、再確認していない資料の確認日を現在日に更新しない。**
- 既存記事の影響範囲を特定し、必要箇所のみ差分更新する。
- 更新PRで、変更理由・更新範囲・未更新範囲・参照元を報告する。
- `safe to merge: YES / NO` を明記する。

## Step 1 / Step 2
- Step 1は記事本体、記事画像、技術/SEO/画像監査、確認用GitHub反映、現行の公開生成と一致するPreviewまでを扱う。
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
