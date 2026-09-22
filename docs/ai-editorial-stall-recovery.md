# AI編集部: stalled recovery

- `PLANNING` / `NEEDS_RESEARCH` / `RUNNING` の案件で、親・子イベントを含む最終活動から3分以上更新がない場合は停止とみなす。
- 停止を検出したら新しい案件は作らず、同じ command ID を `QUEUED` に戻して自動再開する。
- 再開履歴は `stall-auto-retry` として同じ案件に記録する。
- 1案件につき自動停止復旧は最大3回。3回で進捗が戻らない場合は `ERROR` にして管理者確認へ切り替える。
- API rate limit の待機・再開は従来の `ai_editorial_claim_retry` が担当し、stalled recovery とは分離する。
