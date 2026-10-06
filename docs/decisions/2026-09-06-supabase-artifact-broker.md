# Decision: Supabase temporary artifact broker

Date: 2026-09-06
Superseded: 2026-09-17
Status: **historical decision only / current image-placement routeではない**

## Historical decision
2026-09-06時点では、AI生成画像をGitHubへ安全に渡すため、Supabaseのprivate `ai-artifacts` bucketとArtifact Brokerを一時転送層として使う案を採用・試験した。

この判断は、当時の接続制約とAI編集部の構成を前提にしたもの。

## Superseded decision
2026-09-17に、通常の記事画像配置についてBase64を使わず、byte size・SHA-256・画像署名・最新HEAD・並行更新を検証できる恒久Workflow経路を実ファイルで確認した。

そのため、**通常の記事制作における採用済み画像のGitHub配置は新しい正本へ一本化する。**

現行の正本:
- `docs/adopted-image-github-placement-rule.md`
- `.github/workflows/binary-image-transfer.yml`

## 現在の運用
- Supabase Artifact Brokerを通常の記事画像配置には使わない。
- `AI Artifact Writer`を通常の記事画像配置には使わない。
- このdecision文書を転送手順として使わない。
- 旧Broker関連コードはAI編集部の履歴・停止中資産として保全する。

将来AI編集部を正式再開する場合は、必要に応じてBroker方式を別途再評価する。ただし、その評価は現在のサイト画像配置ルートを自動的に変更しない。
