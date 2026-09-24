# AI編集部 Dashboard v0.1

## 目的
Multi-AI Orchestrator の実処理を、人間が「AI編集部の会話と進行」として観察・介入できるUIにする。

重要: 会話表示は演出ではない。Orchestratorが実際に発生させたイベント、提案、反証、修正、判定、待機を表示する。

## v0.1 画面

### 左: 案件キュー
- job_id / topic
- 現在状態
- 担当ロール
- revision回数
- HUMAN GATEの有無
- 最終更新

### 中央: AI編集部チャット
表示対象イベント:
- EDITOR: 調査結果、目的、採用方針
- BUILDER: 作成・修正内容
- CHALLENGER: 指摘、根拠、severity
- REVIEWER: 採否、理由、次の遷移
- SYSTEM: retry、失敗、preview生成、公開確認
- HUMAN: 承認、却下、追加指示

各発言は最低限 `event_id`, `job_id`, `role`, `provider`, `type`, `summary`, `evidence`, `created_at` を持つ。
内部chain-of-thoughtは保存・表示せず、監査可能な結論・根拠・反論だけを表示する。

### 右: 状態 / 成果物 / 人間ゲート
- 現在state
- 実行中ロール
- Preview URL
- PR URL
- 画像候補
- AI間の未解決 disagreement
- HUMAN GATE の理由
- 承認 / 却下 / コメント

## 状態表示
`QUEUED → EDITING → BUILDING → CHALLENGING → REVIEWING → REVISING → PREVIEWING → HUMAN_GATE → APPROVED → PUBLISHING → VERIFYING → DONE`

ESCALATED / FAILED / CANCELLED は明示する。`ESCALATED` は人間の注意が必要な未解決状態として扱う。

「進行中のだんまり」を避けるため、長い処理では heartbeat を別イベントとして記録する。ただし無意味な実況を大量生成しない。表示例: `Gemini CHALLENGER 応答待ち`, `Netlify Preview生成待ち`, `Builder revision 2/3 実行中`。

## イベント契約 v0.1
```json
{
  "schema_version": "0.1",
  "event_id": "uuid",
  "job_id": "uuid",
  "role": "challenger",
  "provider": "google-gemini",
  "type": "finding",
  "summary": "content guard does not inspect changed files",
  "evidence": [{"kind":"github","ref":"PR#1303:.github/workflows/orchestrator-pilot.yml"}],
  "severity": "high",
  "state": "CHALLENGING",
  "created_at": "RFC3339"
}
```

## 真実性ルール
1. 実行されていないAIの発言を生成しない。
2. provider/model/roleを混同しない。
3. UIの「会話」は実イベントの表示形式であり、架空の会議ログではない。
4. evidenceのない重要判断は `UNVERIFIED` と表示する。
5. AI同士の不一致は消さず、REVIEWERが解決したかHUMAN GATEへ送る。
6. secrets、API key、hidden reasoningはイベントへ書かない。

## Human gate
v0.1では以下を人間へ送る:
- 最終画像採用
- Preview / production公開承認
- 重要なAI間 disagreement が解消できない
- 有料化・新規外部アカウント・権限拡大

通常のretry、軽微な修正、内部監査、非production PRは自走する。

## Live event feed v0.1
- 永続化: 専用非productionブランチ `ai-dashboard-events`
- 保存先は固定パス `dashboard-data/events.json`
- GitHub Actions の `GITHUB_TOKEN` を使い、`scripts/publish_orchestrator_events.py` が専用ブランチだけを更新する。`main` はイベント保存先にしない。
- publisher は event_id で重複排除し、最大1000件に制限する。
- Dashboard は `raw.githubusercontent.com` の専用ブランチを10秒間隔で読み取り、feed障害時は接続状態を明示する。
- feed は公開リポジトリ由来のサニタイズ済み非機密イベントだけを扱う。secrets、hidden reasoning、非公開資料は保存しない。
- Dashboard 自体は `noindex,nofollow,noarchive` とし、運営画面を検索対象にしない。
- Supabaseの `orchestrator_events` / `ai-editorial-feed` は将来の認証付きRealtime案の実験資産として保留する。専用ingest認証を整備するまで本番feedには使わない。

## 実装フェーズ
### Phase A — Event log
Orchestrator job recordからUI向け `events.jsonl` を生成し、role/provider/state/evidenceを正規化する。**実装済み。**

### Phase B — Read-only dashboard
案件一覧・チャット・状態パネルを表示し、専用GitHub event feedへ接続する。**v0.1実装済み、live smoke test待ち。**

### Phase C — Human controls
承認/却下/コメントを安全なAPI経由でOrchestratorへ戻す。ブラウザから直接GitHub tokenやAI keyを扱わない。

### Phase D — Realtime / separate app
専用Dashboard認証を追加した上で、必要に応じてSupabase Realtime等へ移行する。GitHub Actionsは実行基盤の一部として残し、必要なら後にLangGraph常駐runnerへ移行する。AI編集部UIは最終的に本体サイトから分離した運営アプリとして提供する。

## v0.1採用方針
まず既存のGitHub + Netlify資産を再利用して最小構成を作る。新しい有料サービスは導入しない。UIがOrchestratorの正しい観測面として成立した後、LangGraph/LangSmith等への移行を評価する。
