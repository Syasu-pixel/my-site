# AI編集部 進行状況表示 v0.6.6

実運用で「動いているのか止まっているのか分からない」という問題が確認されたため、ダッシュボードに進行状況表示を追加する。

## 必須UI

- 選択中案件について、中央上部または分かりやすい位置に進行ステータスを常時表示する。
- 表示例:
  - `🟢 処理中｜最終更新 12秒前`
  - `🟡 応答待ち｜最終更新 1分20秒前`
  - `🔴 停止の可能性｜最終更新 5分以上前`
  - `🟠 管理者確認待ち`
  - `✅ 完了`
- あわせて `現在：Gemini検証 → 次：最終確認` のように現在工程と次工程を表示する。
- `HUMAN_GATE` / `NEEDS_HUMAN` は経過時間に関係なく「管理者確認待ち」を最優先表示する。
- `FAILED` / `ESCALATED` / `ERROR` は「要確認」を最優先表示する。
- `COMPLETED` / `DONE` / `PUBLISHED` / `CLOSED` / `REJECTED` / `CANCELLED` は「完了」系表示にする。

## 経過時間の目安

通常進行状態では、最新イベントから60秒未満を `処理中`、60秒以上3分未満を `応答待ち`、3分以上を `停止の可能性` とする。これは障害確定ではなくUI上の注意表示である。

## 工程表示

可能な範囲で `state` / `stage` / `provider` から現在工程と次工程を推定する。少なくとも以下を扱う。

- QUEUED / instruction → GPT編集長
- PLANNING / editorial-plan → GPT Web調査
- RESEARCHING / editorial-web-research → Gemini検証
- CHALLENGING / gemini-challenge / gpt-challenger-fallback → 最終確認
- REVIEWING / final-review → 管理者確認
- HUMAN_GATE / NEEDS_HUMAN → 管理者判断

Gemini代理検証時は `⚠ Gemini未確認` を見える形で残す。

## 実装条件

- 既存の曜日テンプレート、案件キュー、モバイル表示を壊さない。
- 表示はfeedの最新イベント時刻を基準に、少なくとも10秒ごとに経過時間表記を更新する。
- `ai-editorial-dashboard/index.html` の静的表示を `chat v0.6.6` にする。
- `command-center.js` と `queue-organizer.js` のキャッシュキーも `?v=0.6.6` にそろえる。
- `queue-organizer.js` 内の動的version表示も v0.6.6 にそろえる。
