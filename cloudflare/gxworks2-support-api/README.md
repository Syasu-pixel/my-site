# GX Works2 support API

Preview用の受付APIです。相談受付をD1に保存し、同じ送信の二重受付を防ぎながらResendで通知メールを送ります。

## Cloudflare bindings

- `DB` : D1 database binding
- `RESEND_API_KEY` : Secret
- `NOTIFY_TO_EMAIL` : Variable
- 将来追加: `FILES` : R2 bucket binding

## D1

推奨データベース名: `gxworks2-support-preview`

1. Cloudflare DashboardでD1データベースを作成
2. `schema.sql` の内容をD1 Consoleで実行
3. Worker `gxworks2-support-api` にD1 bindingを追加
   - Variable name: `DB`
   - Database: `gxworks2-support-preview`
4. `worker.js` をデプロイ

## 受付の考え方

ブラウザは1回の相談送信につきランダムな `idempotencyKey` を生成し、同じ送信を再試行するときは同じキーを使います。

WorkerはD1の `idempotency_key` UNIQUE制約を使い、同じ送信から相談番号を複数発行しません。途中でメール送信が失敗した場合も、D1に残った状態から未完了の処理だけ再試行します。

状態の基本順序:

`received` -> admin mail -> customer mail -> `completed`

メールごとに `pending / sending / sent / failed` を保存します。`sending` のままWorkerが中断した場合は一定時間後に再取得できます。

## ZIP

現段階ではZIP本体はまだ保存しません。次段階でR2を接続します。

- 20MB未満: メール添付方式を候補
- 20MB以上: R2非公開保存方式
- ZIPとパスワードは別API・別保存経路にする
