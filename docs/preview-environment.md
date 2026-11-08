# Denkicontrol Preview Environment v0.2

## 目的
本番 `https://denkicontrol.com/` を変更する前に、PRの内容を実ページとして確認できるPreview環境を用意する。

Canonical ProductionはGitHub Pages / `main` / `https://denkicontrol.com/`。本書のNetlify Deploy Previews手順は2026-09-06時点の初期導入記録であり、現在の最終Preview標準経路とみなさない。実際の配信サービスと生成済みHTMLの実体を確認する。

## 正常完了した記事更新ルート（ロードセルを基準とする）

2026-10-02に最終Previewから管理者承認・本番反映まで完了したロードセル記事の PR #1650（記事更新）と PR #1651（最終Preview専用）を基準事例とする。

- 記事編集PRと最終Preview専用ブランチを分離する。Preview専用ブランチはmainへマージしない。
- 専用ブランチでは採用済みソースをもとに `scripts/build-integrated-review.mjs` を実行し、生成済みcandidate記事HTMLと必要な共通CSS/JSを実際の配信ブランチへ書き出す。編集元raw HTMLを最終Previewとして案内しない。
- 固定ヘッダー `site-header dc-shell`、目次・共通JS・画像等の対象マーカーを検査し、外部Preview URLで実際の表示を確認する。PC/スマホ・ライト/ダークの確認を行う。
- 管理者が最終Previewを目視承認した後にのみ、本番用PRをmainへ反映する。本番Pages公開と本番URL表示も別途確認する。
- PR #1651のブランチ内に存在したロードセル専用Preview Workflowは当時の成功実装例であり、現在のmainに存在する汎用Workflowではない。記事名・ブランチ名・画像名をそのまま別記事へ流用せず、適用対象と必要資産を限定する。
- PLC記事は2026-10-11にCloudflare Pages Preview配信と管理者目視承認が完了。配信手順は次節を正本とする。
- 追加ページは `docs/additional-page-shells.md` の生成・検査を優先し、記事専用の目次・関連記事などを要求しない。外部Previewの配信実体確認と管理者承認という共通原則だけを適用する。

以下は初期Netlify導入時の履歴であり、現在の作業手順として実行しない。現在の正規判断は上記の成功実績と `docs/article-editing-playbook.md`（記事）・`docs/additional-page-shells.md`（追加ページ）を優先する。


## Cloudflare Pages 最終Preview配信：2026-10-11検証済み手順（配信運用の正本）

この節は **配信方法だけ** の正本。本文編集・画像採用・統合生成・publication検証は `docs/article-editing-playbook.md`、管理者承認後の本番反映と検索登録は `docs/post-approval-publish-pipeline.md` を参照し、ここで重複記述しない。

1. 最終統合済みpublicationのHTMLと必要な共通CSS/JS・画像を、**mainへマージしない専用Previewブランチ**へ保存。raw HTMLやreview用noindex出力を最終Previewとしない。Preview専用Draft PRは本番PRと分離する。新規PR/Workflowを無意味に増やさない。
2. Cloudflare Pagesプロジェクトは `denkicontrol-preview`、Git連携先は `Syasu-pixel/my-site`。Cloudflare Dashboard → Workers & Pages → `denkicontrol-preview` → Settings → Preview → Branch control で、対象ブランチがPreview許可条件に含まれることを確認する。2026-10-11時点のカスタム許可条件は `ai-editorial/*`、`プレビュー-*`、`preview-final-plc-basic-publication-v3-20261007`。**別記事のブランチが自動で許可されるとは限らない**。必要なブランチのみ追加し、既存条件を削除しない。
3. Production branchは `main`。Productionの自動デプロイ設定をPreview配信のために有効化しない。Cloudflare Pagesのプロジェクト内「Production」は本番サイト `denkicontrol.com`（GitHub Pages）とは別の環境だが、意図しないデプロイを避ける。
4. Git連携の新しいPushが届いてもCloudflareが `skipped` とする場合がある。Dashboard → Deployments → 対象ブランチ・commitの Details で状態を確認し、**対象がPreviewブランチであることを確認したうえで**「Manage deployment → Retry deployment」を使う。2026-10-11のPLCではコミット `7fee8c6` が最初 `skipped` となり、同じ対象のRetryで `success` になった。別ブランチやProductionのデプロイを再実行しない。Retryが使えるなら追加コミットは不要。
5. Cloudflareの成功画面に表示される **Deployment URL** と **Branch alias** を記録する。記事の場合はその実URLの末尾に `/articles/{slug}.html` を付け、HTTP到達・統合ヘッダー・本文・画像・CSS/JS・ライトボックス・PC/スマホとライト/ダークを実際に確認する。**URLの文字列を作れただけでは表示成功と記録しない**。BotコメントがなくてもCloudflare Dashboardのsuccessと実URLを証拠とできる。
6. 管理者の最終目視OKが出るまでmainマージ禁止。承認後の公開は `docs/post-approval-publish-pipeline.md` に従い、Preview専用PRをそのままmainへマージしない。公開成功後にPreview専用PRを未マージで閉じる。

### PLC配信の検証済み実績（2026-10-11）

- Preview専用PR: #1761、ブランチ `preview-final-plc-basic-publication-v3-20261007`、内容不変の配信トリガーコミット `7fee8c667a7e3fd85dede20950ff2e7000b8086f`。
- Cloudflare Deployment ID: `609fd85d-bc8d-4928-bb9e-efc804619b69`。Dashboardで clone/build/deploy 全成功、所要1分37秒。
- 固定Deployment URL: `https://609fd85d.denkicontrol-preview.pages.dev/articles/plc-basic.html`。Branch alias: `https://preview-final-plc-basic-publ-rnch.denkicontrol-preview.pages.dev`（Cloudflare画面表示）。
- 管理者から最終目視確認完了の明示OKあり。Cloudflare配信成功と管理者目視承認は記録済みだが、main公開成功とは区別する。

## 表示差分の品質判断（2026-11-02 管理者方針）

- 原則としてCIのピクセル比較・画像保全検査は維持する。閾値を一律に緩めたり、失敗を自動成功へ変更したりしない。
- 既存記事の刷新で検出された差分は、**変更記事固有の表示差分・共通部品の回帰・無関係な他記事の既存差分**を、最新mainを基準に個別に区別する。CIジョブ全体のFAILと変更記事そのもののFAILを混同しない。
- 管理者が承認済みのPreviewについて、フッターの約1pxの高さ差や文字アンチエイリアス等の人間が通常表示で気づかない微小差は、before/after/diff、表示幅、原因、リンク・機能・テキスト切れの有無を記録した**個別の目視判定**によって、公開の妨げとしない判断ができる。ただし全件に自動適用する許容値ではない。
- 文字切れ、重なり、画像の取り違え、リンク・操作不良、横スクロール、重要な構造の変化、未確認の技術表現などは微小差扱いにせず修正または追加検証する。
- 画像のハッシュ不一致は表示の微小差とは別問題。変換・配信・キャッシュ・原本取り違えを切り分け、承認画像と配信物の対応を検証する。
- CIが失敗のままでも公開可と**機械的に判定しない**。ブランチ保護・必須チェックを迂回せず、必要な例外判断は、根拠・対象URL・承認者・比較元SHA・結果をPRに記録して正式な公開経路で扱う。全サイト保全で他記事の既存FAILがある場合は独立した改善案件に分け、今回の変更による新規回帰がないことを必ず確認する。
- 目視判定後に本文・Hero・共通部品など意味のある変更が加わった場合は、再検証を要する。

## 旧運用記録の扱い

2026-09-06のNetlify Pilotの具体的な設定手順・初回接続・旧PR #1292の記録はGit履歴で確認する。現行の作業手順として再掲しない。旧記録を参照する際も現在の配信・生成・検証実装を優先する。

## PRのヘッダー・フッター視覚比較：最新mainを基準とする（2026-10-16）

- **通常のPRレビューでは、古い固定コミットを合否判定の基準にしない。** `.github/workflows/site-shell-visual.yml` は検査対象PRの `pull_request.base.sha`（その実行時点のマージ先 `main`）を取得し、同じランナー・ブラウザ・設定でbaseとheadを比較する。古い記事刷新、画像変更、文字位置の変化を今回のPRに誤帰属しない。
- `scripts/site-shell-visual.mjs` にはWorkflowから `BASE_SHA` を渡して、before/afterの基準一致を強制する。既存の `.github/site-shell-visual.json` の `baselineCommit` は過去比較用の手動フォールバックであり、PR合否の正本ではない。
- **検査の厳しさを下げる運用ではない。** 予期しないヘッダー・フッターの構造、リンク、メニュー、横スクロール、崩れは差し戻す。描画差分が出た場合はスクリーンショットのbefore/after/diffを確認し、1〜2px程度の文字輪郭やアンチエイリアスと、実際の配置・構造の変化を分けて記録する。現行のピクセル判定を勝手に緩和・停止しない。
- PR作成・レビュー中にmainが進んだ場合は `base.sha` と比較対象の再確認が必要。見かけ上の成功だけで本番反映しない。変更対象の限定差分検査（例：寄付カード非表示）と実際の最終Preview目視確認も別途実施する。
- 正式な本番反映は、**生成済み最終Previewを管理者が確認して明示承認した後だけ**。従来の固定baselineの履歴・証拠は削除しない。

## Hero検査の影響範囲レポート（2026-11-08 段階導入）

- `article-heroes.yml` は従来の全サイトHero・CTA検査を維持しつつ、独立した `impact-report` ジョブでPRの変更対象を `hero-impact-report` に記録する。**現段階は情報提供のみ**であり、必須チェックの合否を変更しない。
- 記事固有の変更は対象記事、Hero生成器や共通部品変更は全記事を影響候補とする。共通CSS等の間接依存はこの簡易判定だけでは網羅できないため、公開判定時は差分を追加確認する。
- ブラウザ検査の `HERO_TARGETS` にはmanifest内の明示的な対象パスをカンマ区切りで指定できる。未指定なら従来どおり全対象を検査し、不明な対象はエラーとする。
- 微小な画素差は `REVIEW_MICRO_RASTER`、その他は `BLOCK_OR_INVESTIGATE` と診断記録を分類する。**分類だけで自動PASSにしない**。CTAの不一致、構造・画像・リンク異常は引き続き調査・修正対象。
- 全サイト検査と変更影響範囲の結果を比較し、変更対象外の既存不具合を独立Issueへ移す判断は証拠・管理者承認・必須チェック制約をPRに残す。全サイト監視の停止や必須チェックの迂回はしない。

# 記事公開監査の判定設計（段階導入案・2026-11-08）

対象：記事刷新PR、Hero保全、共通ヘッダー・フッター、リンク・CTA。関連Issue #1816、実例PR #1812。

## 1. 監査と公開ゲートを分ける

| 判定 | 例 | 対応 |
|---|---|---|
| BLOCK | 採用画像の取り違え、欠落、技術的な誤記、リンク切れ、CTA誤遷移、文字切れ・重なり・横スクロール、共通部品の実回帰 | 修正まで公開停止 |
| REVIEW | 同一HTML/CSS/寸法・機能正常が確認できた微小なラスタ差、原因がまだ確定していない非機能差 | before/after/diff、比較SHA、幅、対象URL、判断者と根拠をPRに記録。未判断は公開不可 |
| PASS | 対象記事と依存部品の検査成功、または根拠付き個別REVIEWを正式に承認 | 次の公開工程へ進む |

「maxChannelDelta=1」は **REVIEW候補** であり自動PASSではない。画像サイズ、配置、DOM、CSS、リンク、クリック結果に差がないことを確認する。CTA不一致を微小差扱いしない。

## 2. 変更影響範囲の決め方

- 記事本文だけ：当該記事と関連カード掲載元、カテゴリ・検索導線、共通テンプレートへの影響を点検。
- 画像・Hero・OGP：対象記事の画像原本ハッシュ、参照先、PC/スマホの表示、OGPを点検。
- 共通CSS/JS、ヘッダー・フッター、ビルダー、監査プログラム：全サイトに波及し得るため、対象を限定せず広範囲の回帰検査を実施。
- 変更対象外の既存FAIL：独立Issueへ切り分けるが、**今回のPRが新しい回帰を起こしていない証拠が必要**。未確認のCTAエラーは別Issueへ移すだけで解決済みとみなさない。

## 3. 段階導入と検証条件

1. **観測段階（PR #1817）**：`hero-impact-report` を生成。全サイトの従来CIは変更しない。微小差分は診断分類のみ。
2. **実証段階（後続PR）**：代表的な記事単独変更・画像変更・共通CSS変更の3ケースで、抽出された影響範囲が十分かテスト。変更記事のHero/CTA・フッターの不具合を故意に混ぜた負例テストも実施。
3. **公開ゲート段階（別途承認後）**：影響対象のBLOCKとREVIEWを判定し、全サイトの既存FAILを独立監査に分離。branch protection / required checksの変更が必要なら設定を確認し、事前承認を得て実施。黙って無効化しない。

## 4. 証跡の必須項目

- PR番号、対象URL、承認済みPreview URL、管理者承認
- base/head SHA、変更ファイルと間接依存、対象外の既存FAILのIssue
- 画像blob SHA、DOM/CSS/操作検査結果、スクリーンショット比較（幅別）
- BLOCK / REVIEW / PASSの根拠と判断者、再検証が必要な変更の有無

## 5. PR #1812への適用条件

ノーヒューズブレーカ記事の採用済み本文・画像5枚は維持する。今回の日本語記事の全幅Hero・CTAとフッターの差分を再確認し、対象外のCTAエラーを #1816 で追跡。**CIが失敗のままの状態を自動で公開許可としない**。正式な公開経路で条件が揃ってからmainへ反映する。

### 2026-11-08: PR時のHeroブラウザ検査を影響範囲に限定

- 登録済み記事HTMLのみのPR（補足Markdownを含む場合も同様）は、`impact-report` が選んだ `HERO_TARGETS` をブラウザ検査と最終集計で共有し、1シャードで検査する。集計では対象記事の全4幅とCTA操作の結果を照合する。
- 画像や登録台帳、共通CSS/JS・部品、検査器の変更、対象記事が0件の場合は全Heroを6シャードで検査する。画像参照を複数記事にまたがって解決する仕組みが整うまで、画像変更は全件検査とする。
- `workflow_dispatch` は引き続き全Heroを6シャードで検査する。定期全サイト監査の追加は別案件で検討する。
- DOM/CSS/CTAの検査を省略しない。微小画素差も自動PASSしない。フッター検査は別Workflowであり、この変更だけで解決したとは扱わない。
- **公開用の全サイトCIと変更対象検査の分離は段階導入**。影響範囲の網羅性・検査の成功を確認するまで必須チェックや保護設定を変更しない。
