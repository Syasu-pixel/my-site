# オンライン相談 見積書Google Sheets連携

## 目的

管理画面の案件詳細から「見積書作成シートを開く」を押すと、現在の案件情報を反映したGoogleスプレッドシートを作成または再利用して開く。

有料AI APIは使用しない。OpenAI API / Gemini API / AI編集部APIは呼び出さない。

## Google側の正本

- テンプレートSpreadsheet ID: `1UojO-T7TMuG3peAlvGSUtIux0DNtY8rG1tx2qglOIYM`
- 見積書保存フォルダID: `1P7EmVyne6t_VmG3pTyWHN1ZGmppGXFAD`
- テンプレート名: `オンライン相談 見積書テンプレート`
- 保存フォルダ名: `オンライン相談 見積書`

## 自動反映する項目

- 会社名
- お客様名
- 相談番号
- 件名
- 見積日
- 見積有効期限（見積日から30日）
- 見積総額
- 着手金
- 残金（Sheet内の式で自動計算）

作業内訳・納期目安・口座番号など、案件ごとに人が判断する項目は自動で推測しない。

## 重複防止

Apps Script の Script Properties に `estimateSheet:<相談番号>` -> Spreadsheet ID を保存する。
同じ案件でボタンを再度押した場合は新しいファイルを増やさず、既存の案件見積シートへ現在値を再反映して開く。

## 認証

Cloudflare Worker と Apps Script の間では共通Secret `ESTIMATE_WEBHOOK_SECRET` を使用する。

- SecretはGitHubへ保存しない。
- Apps Script: Script Properties に保存する。
- Cloudflare Worker: Secretとして保存する。
- WebアプリURLは公開情報のためWorker正本に固定する。
- Cloudflare Worker側で追加が必要なのは `ESTIMATE_WEBHOOK_SECRET` のみ。

現在のWebアプリURL:
`https://script.google.com/macros/s/AKfycbyPMJDrPkcOEAQi34qLHXGiIauFq98gPeRE77DhaAyzHphRoS4uUjJAzyipBQu2Wq7E2A/exec`

## Apps Scriptデプロイ

1. Google Apps Scriptで新規プロジェクトを作成。
2. `docs/integrations/online-estimate-sheet-apps-script.gs` の内容を貼り付ける。
3. プロジェクト設定 -> スクリプト プロパティに `ESTIMATE_WEBHOOK_SECRET` を追加。
4. デプロイ -> 新しいデプロイ -> ウェブアプリ。
5. 実行ユーザーは自分。
6. Cloudflare WorkerからPOSTできるアクセス設定にする。
7. 発行された `.../exec` URLをWorker正本の `ESTIMATE_SHEET_WEBAPP_URL` と一致させる。
8. 同じSecretをCloudflare Workerの `ESTIMATE_WEBHOOK_SECRET` に設定する。

## セキュリティ

Apps ScriptのURLが知られてもSecretが一致しなければ処理しない。
管理画面側は既存のSupabase管理者認証と案件担当者ロックを通過した管理者だけがWorker経由で呼び出せる。

## 課金方針

有料AI APIの使用は禁止。
この連携はGoogle Apps Script / Drive / Sheetsのみを使用し、案件数が月数件〜数十件程度の通常運用を想定する。
