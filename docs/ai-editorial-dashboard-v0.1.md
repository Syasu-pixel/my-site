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
- 永続化: Supabase `orchestrator_events`
- 書き込み: `ai-editorial-feed` Edge Function の認証済みPOSTのみ
- 読み取り: Edge Functionがサニタイズ済みイベントだけをGETで返す
- DBテーブルは RLS 有効、`anon` / `authenticated` へ直接権限を与えない
- GitHub Actions は共有シークレットをログへ出さず、`scripts/publish_orchestrator_events.py` 経由で送信する
- Dashboard は10秒間隔でfeedを更新し、feed障害時は接続状態を明示する
- 現段階のfeedには公開リポジトリ上の非機密な運用イベントだけを入れる。将来、非公開情報を扱う前にDashboard認証を追加する。

## 実装フェーズ
### Phase A — Event log
Orchestrator job recordからUI向け `events.jsonl` を生成し、role/provider/state/evidenceを正規化する。**実装済み。**

### Phase B — Read-only dashboard
案件一覧・チャット・状態パネルを表示し、Supabase feedへ接続する。**v0.1実装中。**

### Phase C — Human controls
承認/却下/コメントを安全なAPI経由でOrchestratorへ戻す。ブラウザから直接GitHub tokenやAI keyを扱わない。

### Phase D — Realtime
必要に応じてSupabase Realtime等へ移行し、pollingより低遅延にする。GitHub Actionsは実行基盤の一部として残し、必要なら後にLangGraph常駐runnerへ移行する。

## v0.1採用方針
まず既存のGitHub + Supabase + Netlify資産を再利用して最小構成を作る。新しい有料サービスは導入しない。UIがOrchestratorの正しい観測面として成立した後、LangGraph/LangSmith等への移行を評価する。
