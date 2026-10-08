# Denkicontrol Preview Environment v0.1

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
- PLC記事の現在進行中の再制作・専用Previewブランチは本ルール整合の変更対象外とする。
- 追加ページは `docs/additional-page-shells.md` の生成・検査を優先し、記事専用の目次・関連記事などを要求しない。外部Previewの配信実体確認と管理者承認という共通原則だけを適用する。

以下は初期Netlify導入時の履歴であり、現在の作業手順として実行しない。現在の正規判断は上記の成功実績と `docs/article-editing-playbook.md`（記事）・`docs/additional-page-shells.md`（追加ページ）を優先する。

## 旧運用記録の扱い

2026-09-06のNetlify Pilotの具体的な設定手順・初回接続・旧PR #1292の記録はGit履歴で確認する。現行の作業手順として再掲しない。旧記録を参照する際も現在の配信・生成・検証実装を優先する。
