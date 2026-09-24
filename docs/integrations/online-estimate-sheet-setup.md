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

Cloudflare Worker と Apps Script の間では同じSecret値を使う。名前は保存先ごとに分ける。

- SecretはGitHubへ保存しない。
- Apps Script: Script Properties の `ESTIMATE_WEBHOOK_SECRET` に保存する。
- Cloudflare Worker: `ESTIMATE_SHEET_WEBHOOK_SECRET` として保存する。
- 2つには同じSecret値を設定する。
- WebアプリURLは公開情報のためWorker正本に固定する。

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
8. 同じSecret値をCloudflare Workerの `ESTIMATE_SHEET_WEBHOOK_SECRET` に設定する。

## 見積書PDFのメール送付

案件が「見積作成中」のとき、案件管理の「見積書をメール送付」から完成したPDFをドラッグ＆ドロップできる。

- 宛先は案件の顧客メールアドレスを初期値にする。
- 件名・本文は案件情報から初期文面を作るが、管理者が送信前に編集できる。
- PDFは10MB以下に限定し、PDFヘッダーもWorker側で確認する。
- 「送信内容を確認」を押しても送信しない。確認ダイアログで宛先・件名・添付名・本文を再確認し、「確認して送信する」を押した場合だけ外部送信する。
- メール送信成功後だけ案件状態を「見積提出済み」に更新し、次の対応も自動更新する。
- 送信失敗時は案件状態を進めない。
- 送信履歴は案件イベントへ記録する。R2が利用可能なら送信したPDF控えも非公開保存する。
- 「見積送付を記録（手動）」は、管理画面以外の方法で実際に送付した例外時の記録用として残す。

メール送信は既存のResend設定を再利用する。新しい有料AI APIは追加しない。

## セキュリティ

Apps ScriptのURLが知られてもSecretが一致しなければ処理しない。
管理画面側は既存のSupabase管理者認証と案件担当者ロックを通過した管理者だけがWorker経由で呼び出せる。
見積書メールはPDFを選択しただけでは送信せず、管理者の2段階確認を必須とする。

## 課金方針

有料AI APIの使用は禁止。
この連携はGoogle Apps Script / Drive / Sheetsのみを使用し、案件数が月数件〜数十件程度の通常運用を想定する。


## 初回取引とPLAN自動見積

案件管理は、顧客一覧と同じ顧客単位で過去の `completed` 案件数を確認する。

- 完了案件 0 件: 初回取引
- 完了案件 1 件以上: 2回目以降

Worker は見積Sheet連携時に `is_first_transaction` と `completed_customer_cases` を Apps Script へ渡す。

社内用設定は、見積書本体とは別タブ `見積設定` に置く。見積書本体は A:F のみとし、社内用の設定・入力ガイドを印刷へ含めない。

`見積設定` の主なセル:

- `B2`: 取引区分（初回取引 / 2回目以降）
- `B3`: 料金区分
- `B4`: PLAN-04 の個別着手金
- `B5`: PLAN-04 の個別納期
- `B6`: 適用総額
- `B7`: 適用着手金
- `B8`: 納期目安
- `B11:B16`: PLAN-04 の個別作業内訳

PLAN1〜3は担当者が料金区分を選ぶだけで、総額・着手金・納期・作業内訳を自動設定する。

- PLAN-01: 総額 22,000円 / 初回着手金 11,000円 / 3〜5営業日
- PLAN-02A: 総額 44,000円 / 初回着手金 22,000円 / 5〜10営業日
- PLAN-02B: 総額 66,000円 / 初回着手金 22,000円 / 5〜10営業日
- PLAN-03: 総額 88,000円 / 初回着手金 44,000円 / 10〜15営業日
- PLAN-04: 総額・着手金・納期・内訳を個別入力

PLAN-02A / PLAN-02B は、公開ページ上では同じ「一般的な既設設備の変更（44,000〜66,000円程度）」に属する内部見積区分。公開料金文言は変更しない。

PLAN1〜3の作業内訳は総額を次の割合で配分する。

- 既設GX Works2プロジェクト確認・ラダー解析: 30%
- 変更仕様の整理・影響範囲確認: 15%
- PLCプログラム変更・回路整理: 35%
- 変更済みGX Works2プロジェクトデータ整備: 10%
- 納品後の軽微な修正対応: 10%
- その他: 0%

2回目以降は原則着手金 0 円。納期目安は必要資料・確認事項が揃った日を起点とする。

見積書の `F6` は `見積設定!B8`、`D9` は `見積設定!B7` を参照する。`B12` の見積総額は作業内訳 `F16:F21` の合計を正本とし、管理画面の旧金額で再上書きしない。

公開GitHubには顧客別の実見積金額や非公開の銀行情報を保存しない。公開料金区分との対応はGoogle Drive上の「オンライン相談 見積価格表」を正本とする。


## 銀行口座情報の自動入力

口座番号と口座名義は案件ごとに変わらないため、公開GitHubや見積テンプレートへ実値を保存せず、Apps Script の Script Properties を正本とする。

Script Properties に次の2項目を追加する。

- `ESTIMATE_BANK_ACCOUNT_NUMBER`: 口座番号
- `ESTIMATE_BANK_ACCOUNT_NAME`: 口座名義

Apps Script は見積書を作成・更新するたびに以下へ自動反映する。

- `見積書!D33`: 口座番号
- `見積書!B34`: 口座名義

どちらかのScript Propertyが未設定の場合は見積書生成をエラーにして、空欄や誤った口座情報のまま送付されないようにする。

銀行口座情報の実値は公開GitHubへコミットしない。変更があった場合も Script Properties だけを更新する。

## 担当者メールの自動入力

ログイン認証に使うメールアドレスと、お客様とのやり取りに使う担当者連絡先メールは分離する。

- `assignee_email`: 案件の所有者判定に使うログインメール。管理画面内部用。
- `assignee_contact_email`: 見積書へ表示する顧客向け連絡先メール。

顧客向け連絡先は Cloudflare Worker の secret `ADMIN_CONTACT_EMAIL_MAP` で、ログインメールをキーに対応付ける。JSON形式で保存し、実際のメールアドレスは公開GitHubへコミットしない。

例の形式だけ示す（実値は保存しない）。

```json
{"login@example.com":"contact@example.com"}
```

Worker は見積Sheet連携時に次をApps Scriptへ渡す。

- `assignee`: 担当者表示名
- `assignee_contact_email`: 顧客向け担当者連絡先メール

Apps Script は見積書の発行者情報へ自動反映する。

- `見積書!B41`: 担当者名
- `見積書!E41`: 顧客向け担当者メール

マッピングが未設定の場合のみログインメールへフォールバックする。見積書での担当者メール手入力は不要とする。
