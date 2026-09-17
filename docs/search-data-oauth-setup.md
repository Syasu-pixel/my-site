# 検索データ基盤 API 初期設定手順

更新日: 2026-09-17

この文書は `docs/search-data-acquisition-rules.md` / `docs/search-data-implementation-status.md` で定義した公式APIルートを有効化するための、一度だけ必要な認証設定を定義する。

標準ルート:

`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`

GSC Wizard、Windsor.ai 等の第三者アプリへ戻すための手順ではない。

## 重要

- Google client secret、Google refresh token、Bing API key、Supabase service-role keyを通常ファイル、PR本文、Issue、Actions input、ログへ貼らない。
- 秘密値は GitHub Repository Secrets に保存する。
- URLやproperty名など秘密ではない値は Repository Variables に保存する。
- Google OAuthは読み取り専用scopeだけを使う。
- Bingは**公式APIキー方式を優先**し、OAuthは互換用の予備ルートとする。
- 実API確認が終わるまで実装PRを本番マージしない。

## 1. GitHub Repository Variables

次の3つを設定する。

- `SEARCH_DATA_SUPABASE_URL`
  - 現在の接続先: `https://pavitnsnmoaiospswiys.supabase.co`
- `GSC_SITE_URL`
  - Search Consoleに登録されているproperty文字列と完全一致させる。
  - Domain propertyの例: `sc-domain:denkicontrol.com`
  - URL-prefix propertyの場合は登録URLをそのまま使う。
  - 推測で決めずSearch Console画面で確認する。
- `BING_WEBMASTER_SITE_URL`
  - Bing Webmaster Toolsに登録されているsite URLと完全一致させる。

## 2. GitHub Repository Secrets

### Supabase

- `SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY`

既存 `denkicontrol-ai-artifacts` のservice-role/secret keyを使用する。公開ファイルへ書かない。

### Google Search Console

- `GSC_CLIENT_ID`
- `GSC_CLIENT_SECRET`
- `GSC_REFRESH_TOKEN`

### Bing Webmaster Tools — 推奨

- `BING_WEBMASTER_API_KEY`

### Bing Webmaster Tools — OAuth予備ルート

APIキーを使わない場合だけ以下を使える。

- `BING_WEBMASTER_CLIENT_ID`
- `BING_WEBMASTER_CLIENT_SECRET`
- `BING_WEBMASTER_REFRESH_TOKEN`

同期処理は `BING_WEBMASTER_API_KEY` が設定されている場合、それを優先する。

## 3. Google Search Console OAuth

Google Search Console APIはユーザー権限に紐づくデータを読むため、Google側はOAuth 2.0を使用する。

### 3-1. Search Console APIを有効化

Google Cloud Consoleで使用するプロジェクトを選び、Search Console APIを有効化する。

公式:
- https://developers.google.com/webmaster-tools/
- https://developers.google.com/webmaster-tools/v1/prereqs

### 3-2. OAuth clientを作成

OAuth clientを作成し、denkicontrol.com のSearch ConsoleデータへアクセスできるGoogleアカウントで認可する。

使用scope:

`https://www.googleapis.com/auth/webmasters.readonly`

書き込み可能な `webmasters` scope は使わない。

### 3-3. refresh tokenを取得

offline accessで認可し、refresh tokenを取得する。

保存先:

- Client ID -> `GSC_CLIENT_ID`
- Client secret -> `GSC_CLIENT_SECRET`
- Refresh token -> `GSC_REFRESH_TOKEN`

## 4. Bing Webmaster API Key — 推奨

Microsoft公式の Bing Webmaster Tools では、ユーザー単位のAPIキーを生成できる。現在のJSON/HTTP APIは `apikey` パラメータで利用できるため、検索集計用途ではOAuthより設定が少ないAPIキー方式を標準とする。

手順:

1. Bing Webmaster Toolsへログイン
2. Settings -> API Access を開く
3. 初回のみ利用条件を確認・同意する
4. `API Key` を選ぶ
5. `Generate API Key` を実行
6. 生成された値をGitHub Repository Secret `BING_WEBMASTER_API_KEY` に保存
7. 値をチャット、GitHubファイル、PR本文、ログへ貼らない

Microsoft公式:
- https://learn.microsoft.com/en-us/bingwebmaster/getting-access
- https://learn.microsoft.com/en-us/bingwebmaster/api-protocols

APIキーはユーザーに対して発行され、そのユーザーが確認済みのサイトに利用する。漏えい時はBing Webmaster Tools側で古いキーを削除して再生成する。

## 5. Bing OAuth — 予備ルート

OAuthを使う場合は Settings -> API Access -> OAuth Client からclientを登録する。

読み取り専用scope:

`Webmaster.read`

認可URL:

`https://www.bing.com/webmasters/oauth/authorize`

Token URL:

`https://www.bing.com/webmasters/oauth/token`

保存先:

- Client ID -> `BING_WEBMASTER_CLIENT_ID`
- Client secret -> `BING_WEBMASTER_CLIENT_SECRET`
- Refresh token -> `BING_WEBMASTER_REFRESH_TOKEN`

APIキーが設定されている場合はOAuthよりAPIキーを優先する。

## 6. 最初の接続確認

Secrets / Variablesを設定したら、いきなり大量backfillをしない。

順番:

1. `Search data sync` を `provider=google`, `dry_run=true`, `backfill_days=0` で手動実行
2. Google成功後、`provider=bing`, `dry_run=true`, `backfill_days=0`
3. 両方成功後、通常windowで実書き込み
4. Supabase `search_collection_runs` が `succeeded` になることを確認
5. `search_performance_daily` にGoogle/Bing双方の行が入ることを確認
6. 管理画面と値が大きく矛盾していないか確認
7. その後 `provider=all`, `backfill_days=60` を1回だけ実行
8. 直近28日 vs 前28日の集計が成立することを確認
9. 問題がなければ日次scheduleを通常運用とする

## 7. 通常の日次取得

- 実行時刻: 06:25 JST
- Google: 3日遅れを基準に直近4日を再取得
- Bing: 1日遅れを基準に直近14日を再取得
- 同じrecordはdeterministic keyでupsertするため重複増殖しない
- `query_page` は既定OFF

## 8. 失敗時

- GoogleとBingは独立して確認する。
- 片方の値をもう片方から推測しない。
- GoogleはOAuthエラー、quota、API仕様変更、サービス障害を切り分ける。
- BingはAPIキー失効・権限、quota、API仕様変更、サービス障害を切り分ける。
- 429 / 5xxに対する無限リトライをしない。
- GSC Wizardや別の無料アプリへ自動フォールバックしない。
- 課金が必要になりそうな場合は取得頻度・粒度・保持期間を先に縮小し、管理者承認なしで有料化しない。

## 9. 完了判定

以下をすべて満たして初めて「公式API検索データ基盤が稼働中」とする。

- Google dry-run成功
- Bing dry-run成功
- Supabase実書き込み成功
- `search_collection_runs` の成功履歴確認
- Google/Bing双方の検索実績行を確認
- 60日backfill成功
- ChatGPTから直近28日 vs 前28日を実データで集計できる
- 日次scheduleの実行を1回以上確認

それまでは「主基盤実装済み・認証/E2E未完了」と記録する。
