# 検索データ基盤 OAuth 初期設定手順

更新日: 2026-09-17

この文書は `docs/search-data-acquisition-rules.md` / `docs/search-data-implementation-status.md` の公式APIルートを有効化するための、一度だけ必要な認証設定を定義する。

標準ルート:

`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`

GSC Wizard、Windsor.ai 等の第三者アプリへ戻すための手順ではない。

## 重要

- Client secret、refresh token、Supabase service-role key をGitHubの通常ファイル、PR本文、Issue、Actions input、ログへ貼らない。
- 秘密値は GitHub Repository Secrets にのみ保存する。
- URLやproperty名など秘密ではない値は Repository Variables に保存する。
- OAuth認証画面で要求するscopeは必要最小限とする。
- 実API確認が終わるまでPR #1501相当の実装を `safe to merge: YES` にしない。

## 1. GitHub Repository Variables

次の3つを設定する。

- `SEARCH_DATA_SUPABASE_URL`
  - 現在の接続先: `https://pavitnsnmoaiospswiys.supabase.co`
- `GSC_SITE_URL`
  - Search Consoleに登録されているproperty文字列と完全一致させる。
  - Domain propertyなら例: `sc-domain:denkicontrol.com`
  - URL-prefix propertyなら登録URLをそのまま使う。
  - 推測で決めずSearch Console画面で確認する。
- `BING_WEBMASTER_SITE_URL`
  - Bing Webmaster Toolsに登録されているsite URLと完全一致させる。

## 2. GitHub Repository Secrets

### Supabase

- `SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY`

既存 `denkicontrol-ai-artifacts` のservice-role/secret keyを使用する。
値を公開ファイルへ書かない。

### Google Search Console

- `GSC_CLIENT_ID`
- `GSC_CLIENT_SECRET`
- `GSC_REFRESH_TOKEN`

### Bing Webmaster Tools

- `BING_WEBMASTER_CLIENT_ID`
- `BING_WEBMASTER_CLIENT_SECRET`
- `BING_WEBMASTER_REFRESH_TOKEN`

## 3. Google Search Console OAuth

### 3-1. APIを有効化

Google Cloud ConsoleでSearch Console APIを使用するプロジェクトを選び、Search Console APIを有効化する。

公式:
- https://developers.google.com/webmaster-tools/
- https://developers.google.com/identity/protocols/oauth2/native-app

### 3-2. OAuth clientを作成

OAuth clientを作成し、denkicontrol.com のSearch ConsoleデータへアクセスできるGoogleアカウントで認可する。

使用scope:

`https://www.googleapis.com/auth/webmasters.readonly`

書き込み権限の `webmasters` scope は使用しない。

### 3-3. refresh tokenを取得

offline accessで認可し、refresh tokenを取得する。

取得した値は以下へ保存する。

- Client ID -> `GSC_CLIENT_ID`
- Client secret -> `GSC_CLIENT_SECRET`
- Refresh token -> `GSC_REFRESH_TOKEN`

refresh tokenをPR、チャットの公開共有用文章、GitHub Actions inputへ入れない。

## 4. Bing Webmaster OAuth

### 4-1. OAuth clientを作成

Bing Webmaster Toolsへログインし、Settings -> API Access -> OAuth Client からclientを登録する。

Microsoft公式:
- https://learn.microsoft.com/en-us/bingwebmaster/oauth2
- https://learn.microsoft.com/en-us/bingwebmaster/getting-access

### 4-2. scope

読み取り専用scopeを使う。

`Webmaster.read`

`Webmaster.manage` は読み書き権限のため、この検索集計用途では使用しない。

### 4-3. authorization code -> token

認可URL:

`https://www.bing.com/webmasters/oauth/authorize`

token URL:

`https://www.bing.com/webmasters/oauth/token`

authorization codeをaccess token / refresh tokenへ交換し、refresh tokenを取得する。

保存先:

- Client ID -> `BING_WEBMASTER_CLIENT_ID`
- Client secret -> `BING_WEBMASTER_CLIENT_SECRET`
- Refresh token -> `BING_WEBMASTER_REFRESH_TOKEN`

同期処理は毎回refresh tokenから短命access tokenを取得し、Bearer認証でBing Webmaster JSON APIを読む。

## 5. 最初の接続確認

Secrets / Variablesをすべて設定したら、いきなり大量backfillをしない。

順番:

1. `Search data sync` を `provider=google`, `dry_run=true`, `backfill_days=0` で手動実行
2. Googleが成功したら `provider=bing`, `dry_run=true`, `backfill_days=0`
3. 両方成功後、1日分または通常windowで実書き込み
4. Supabase `search_collection_runs` が `succeeded` になることを確認
5. `search_performance_daily` にGoogle/Bing双方の行が入ることを確認
6. 値が管理画面と大きく矛盾していないか確認
7. その後に `provider=all`, `backfill_days=60` を1回だけ実行
8. 直近28日 vs 前28日の集計が成立することを確認
9. 問題がなければ日次scheduleを通常運用とする

## 6. 通常の日次取得

- 実行時刻: 06:25 JST
- Google: 3日遅れを基準に直近4日を再取得
- Bing: 1日遅れを基準に直近14日を再取得
- 同じrecordはdeterministic keyでupsertするため重複増殖しない
- `query_page` は既定OFF

## 7. 失敗時

- GoogleとBingは独立して確認する。
- 片方の値をもう片方から推測しない。
- OAuthエラー、quota、API仕様変更、サービス障害を切り分ける。
- 429 / 5xxに対する無限リトライをしない。
- GSC Wizardや別の無料アプリへ自動フォールバックしない。
- 課金が必要になりそうな場合は、取得頻度・粒度・保持期間を先に縮小し、管理者承認なしで有料化しない。

## 8. 完了判定

以下をすべて満たして初めて「公式API検索データ基盤が稼働中」とする。

- Google dry-run成功
- Bing dry-run成功
- Supabase実書き込み成功
- `search_collection_runs` の成功履歴確認
- Google/Bing双方の検索実績行を確認
- 60日backfill成功
- ChatGPTから直近28日 vs 前28日を実データで集計できる
- 日次scheduleの実行を1回以上確認

それまでは「主基盤実装済み・OAuth/E2E未完了」と記録する。
