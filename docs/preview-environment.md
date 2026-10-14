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

## 旧運用記録の扱い

2026-09-06のNetlify Pilotの具体的な設定手順・初回接続・旧PR #1292の記録はGit履歴で確認する。現行の作業手順として再掲しない。旧記録を参照する際も現在の配信・生成・検証実装を優先する。

## 検証中：GitHub側での自動統合Preview（2026-10-14）

Production設定を変えず、既存のGit連携・`exit 0`・repository root配信を利用する検証実装。2026-10-14の管理者画面でPreview includeは `ai-editorial/*` と `preview-*`、excludeは旧PLC専用 `preview-final-plc-basic-publication-v3-20261007`、Production自動配信OFFを確認。既存条件は編集しない。

- 正本実装は `.github/workflows/validated-preview-publication.yml`。この実装を持つ `preview-*` ソースブランチへのpushで本番Pagesと同じ生成器・追加ページ生成・WebP最適化・publication最終検証を実行し、追加ページ再生成・4幅検査、全記事の6分割ブラウザ／ダーク検査を通す。失敗時は配信ブランチを更新しない。
- 生成物は `preview-publication-{ソース名から先頭preview-を除いた名前}` へ保存する。配信ブランチにはWorkflowを含めない。mainもソースブランチのHTMLも上書きせず、古いsource SHAや既存の無関係な配信ブランチを拒否する。
- `preview-source.json` にsource commit、source branch、run ID、最適化後HTML/CSS/JSハッシュを記録。`scripts/check-preview-publication.mjs` でローカルと実Cloudflare URLを確認する。外部URLはproviderの実成功記録から取得する。推定aliasだけを成功証拠にしない。
- 検査済みcandidate/publicationのHTMLにreview隔離コードを入れず、配信コピーの `_headers` でnoindexを指定する。Metricoolの既存本番ホストガードを保持し、確認ブラウザは外部通信・POSTを遮断する。
- 再利用には上記Workflowと検査スクリプトを新しいPreviewソースブランチへ最初に配置する。その後は通常チャットからソースを更新するだけで自動実行する。mainへの導入は今回の範囲外で禁止。すべての新規ブランチへ自動導入済みとは扱わない。
- 今回の検証元はPR #1764の `dd9eab7f43f25f379e4f0e174c708ab1702c80bb` を引き継いだ `preview-auto-publication-1764-20261014`。本番用PR #1764は変更せず、専用実装を本番へ混入させない。
- 状態は実装検証中。Cloudflare実配信・4条件目視確認・source hash照合の成功前に完了と記録しない。戻す場合はソース側Workflowを停止または削除する。Production設定の変更・mainマージ・既存Previewの削除は行わない。
