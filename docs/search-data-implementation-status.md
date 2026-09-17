# 検索データ基盤 実装状況

更新日: 2026-09-17

この文書は `docs/search-data-acquisition-rules.md` で定義した
`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`
の実装状況を記録する。

## 現在の状態

### 実装済み

- Supabase に検索データ用テーブルを追加
  - `public.search_performance_daily`
  - `public.search_collection_runs`
  - `public.search_collection_health`
- RLS を有効化
- `anon` / `authenticated` のテーブル権限を削除
- service-role のバックエンド書き込みだけを許可
- Google Search Console Search Analytics API の取得クライアントを追加
- Bing Webmaster JSON API の取得クライアントを追加
- Bingは公式APIキー方式を優先し、OAuth Bearerを予備ルートとして保持
- Google / Bing を共通形式へ正規化
- deterministic `record_key` による idempotent upsert
- Google と Bing を独立実行し、片方が失敗してももう片方を試行
- GitHub Actions 日次Workflowを追加
- 認証未設定時は安全にno-op
- Python標準ライブラリだけで動作
- モック/正規化のユニットテストを追加
- `query x page` の高粒度取得は既定OFF
- 高粒度データを有効化した場合の90日削除処理を実装
- 初回用の28 / 60 / 90日bounded backfillを実装
- Actionsは `scripts/` のsparse checkoutで実行時間を抑える

### 未完了

- Google OAuth client / refresh token の発行
- Bing Webmaster API Key の発行
- GitHub Secrets / Variables の設定
- Google実APIでのdry-run
- Bing実APIでのdry-run
- 初回Supabase保存
- 60日backfill
- ChatGPTから実データを集計するE2E確認

したがって、コードとDBの主基盤は存在するが、認証設定前は「検索データ自動取得が稼働中」とは扱わない。

## Supabase

現時点では追加コストを発生させず、既存の接続済みSupabaseプロジェクトへ論理分離して格納している。

- project: `denkicontrol-ai-artifacts`
- migration: `20260917025740_create_search_data_foundation`
- 検索データはAI編集部系テーブルと別テーブルで管理

検索専用プロジェクトを将来作る場合も、接続先を環境変数で切り替えられる構造を維持する。

## GitHub Actions

Workflow:

`.github/workflows/search-data-sync.yml`

通常運用:

- 毎日 06:25 JST
- Google: 3日遅れを基準に直近4日を再取得
- Bing: 1日遅れを基準に直近14日を再取得
- 同じデータはupsertするため再取得で重複を増やさない
- Google/Bingの片方だけ認証済みでも、その片方は動かせる
- 認証未設定のproviderは `skipped` として扱う

手動実行:

- provider: `all / google / bing`
- `dry_run=true`: API取得・正規化まで行いSupabaseへ書かない
- `date=YYYY-MM-DD`: 1日指定
- `backfill_days=28 / 60 / 90`: rolling backfill

## GitHub Variables

秘密ではない値:

- `SEARCH_DATA_SUPABASE_URL`
- `GSC_SITE_URL`
- `BING_WEBMASTER_SITE_URL`

`GSC_SITE_URL` はSearch Consoleのproperty文字列と完全一致させる。
`BING_WEBMASTER_SITE_URL` はBing Webmaster Toolsの登録site URLと一致させる。

## GitHub Secrets

### 必須

- `SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY`
- `GSC_CLIENT_ID`
- `GSC_CLIENT_SECRET`
- `GSC_REFRESH_TOKEN`
- `BING_WEBMASTER_API_KEY`

### Bing OAuth予備ルート

APIキーを使わない場合だけ以下を使える。

- `BING_WEBMASTER_CLIENT_ID`
- `BING_WEBMASTER_CLIENT_SECRET`
- `BING_WEBMASTER_REFRESH_TOKEN`

秘密値をGitHub通常ファイル、PR本文、Issue、Actions input、ログへ出さない。

## Google Search Console

Google側はOAuth 2.0の読み取り専用scopeで運用する。

`https://www.googleapis.com/auth/webmasters.readonly`

同期処理はrefresh tokenから短命access tokenを発行し、Search Analytics APIを `dataState=final` で読む。

初期粒度:

- site daily
- page daily
- query daily
- query x page daily: OFF

後日補正を吸収するため、通常は直近4日を再取得する。

## Bing Webmaster Tools

### 推奨: API Key

Microsoft公式のAPI Accessからユーザー単位のAPIキーを生成し、JSON/HTTP APIへ `apikey` パラメータで渡す。

Secret:

`BING_WEBMASTER_API_KEY`

### 予備: OAuth 2.0

APIキーを使わない場合は読み取り専用scope `Webmaster.read` のOAuthを利用できる。

初期取得:

- `GetRankAndTrafficStats`
- `GetQueryStats`
- `GetPageStats`

Bingの更新頻度や位置指標はGoogleと同一ではない。`AvgImpressionPosition` / `AvgClickPosition` を保持し、Googleの平均掲載順位と同じ指標として扱わない。

## 保存スキーマ

### `search_performance_daily`

主な列:

- source
- data_date
- site_url
- grain
- query
- page
- country
- device
- search_type
- clicks
- impressions
- ctr
- avg_position
- avg_click_position
- metadata
- fetched_at

`record_key` は source/date/site/grain/dimensions からSHA-256で決定し、再取得をupsertする。

### `search_collection_runs`

providerごとの実行履歴を保存する。秘密情報は保存しない。

### `search_collection_health`

各providerの最新実行状態を見る `security_invoker` view。

## 容量制御

初期状態では `query_page` を取得しない。
必要時だけ `SEARCH_ENABLE_FINE_GRAIN=true` とする。
有効化した場合は `SEARCH_FINE_GRAIN_RETENTION_DAYS=90` を初期値とする。

site/page/queryは長期分析に使う。容量が増えた場合は取得件数上限・保持期間・月次ロールアップを先に調整し、有料化を先に選ばない。

## 障害時

- Google OAuth認証エラーとAPI障害を区別する
- Bing APIキー失効/権限とAPI障害を区別する
- HTTP 429 / 5xx は有限リトライのみ
- APIレスポンス本文をエラーログへ出さない
- Google失敗時にBing値を推測しない
- Bing失敗時にGoogle値を推測しない
- GSC Wizardや別の無料アプリへ自動フォールバックしない

## 次の有効化手順

1. Google OAuth clientを作成しread-only consentでrefresh tokenを取得
2. Bing Webmaster ToolsでAPI Keyを生成
3. GitHub Variables / Secretsを設定
4. Googleだけ `dry_run=true` で実行
5. Bingだけ `dry_run=true` で実行
6. 通常windowで実書き込み
7. Supabaseの行数・run履歴・値を確認
8. `all`, `backfill_days=60` を1回実行
9. ChatGPTから直近28日 vs 前28日を集計
10. 日次scheduleを1回確認

詳細な手順は `docs/search-data-oauth-setup.md` を参照する。
