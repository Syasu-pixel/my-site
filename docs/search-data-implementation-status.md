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
- Bing Webmaster JSON API + OAuth Bearer の取得クライアントを追加
- Google / Bing を共通形式へ正規化
- deterministic `record_key` による idempotent upsert
- Google と Bing を独立実行し、片方が失敗してももう片方の取得を試行
- GitHub Actions 日次Workflowを追加
- 認証未設定時は失敗させず安全にno-op
- Python標準ライブラリだけで動作
- モック/正規化のユニットテストを追加
- `query x page` の高粒度取得は既定OFF
- 高粒度データを有効化した場合の90日削除処理を実装

### 未完了

- Google OAuth client / refresh token の発行
- Bing Webmaster OAuth client / refresh token の発行
- GitHub Secrets / Variables の設定
- Google実APIでのdry-run
- Bing実APIでのdry-run
- 初回Supabase保存
- 取得データをChatGPTから実際に集計するE2E確認

したがって、コードとDBの主基盤は存在するが、OAuth設定前は「検索データ自動取得が稼働中」とは扱わない。

## Supabase

現時点では追加コストを発生させず、既存の接続済みSupabaseプロジェクトへ論理分離して格納している。

- project: `denkicontrol-ai-artifacts`
- search data tables are separated from AI editorial tables
- migration: `20260917025740_create_search_data_foundation`

検索専用プロジェクトを将来作る場合でも、テーブルと同期クライアントの責務を分けているため移行可能とする。

## GitHub Actions

Workflow:

`.github/workflows/search-data-sync.yml`

通常運用:

- 毎日 06:25 JST
- Google: 3日遅れを基準に直近4日を再取得
- Bing: 1日遅れを基準に直近14日を再取得
- 同じデータはupsertするため再取得で重複を増やさない
- Google/Bingの片方だけ認証済みでも、その片方は動かせる
- OAuth未設定のproviderは `skipped` として扱う

手動実行では `all / google / bing` を選択できる。
`dry_run=true` ではAPI取得・正規化まで行い、Supabaseには書かない。
`date=YYYY-MM-DD` で1日分の検証・バックフィルを行える。

## GitHub Variables

次の値は秘密情報ではないため Repository Variables を使う。

- `SEARCH_DATA_SUPABASE_URL`
- `GSC_SITE_URL`
- `BING_WEBMASTER_SITE_URL`

`GSC_SITE_URL` はSearch Consoleで登録されているproperty文字列と完全一致させる。
`sc-domain:denkicontrol.com` か URL-prefix property かを推測で決めない。

`BING_WEBMASTER_SITE_URL` もBing Webmaster Tools側の登録site URLと一致させる。

## GitHub Secrets

次はRepository Secretsへ保存し、GitHubのファイル・PR本文・ログへ値を出さない。

- `SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY`
- `GSC_CLIENT_ID`
- `GSC_CLIENT_SECRET`
- `GSC_REFRESH_TOKEN`
- `BING_WEBMASTER_CLIENT_ID`
- `BING_WEBMASTER_CLIENT_SECRET`
- `BING_WEBMASTER_REFRESH_TOKEN`

## Google OAuth

Google側は読み取り専用で運用する。

必要scope:

`https://www.googleapis.com/auth/webmasters.readonly`

同期処理はrefresh tokenから短命access tokenを発行し、
Search Analytics APIを `dataState=final` で読む。

取得粒度の初期値:

- site daily
- page daily
- query daily
- query x page daily: OFF

GSCは後日補正を考慮し、1日だけを一度取得して終わる方式にしない。

## Bing OAuth

Bing Webmaster Tools のOAuth clientを使用する。

必要scope:

`webmaster.read`

同期処理はrefresh tokenから短命access tokenを取得し、BearerでJSON APIを呼ぶ。

初期取得:

- `GetRankAndTrafficStats`
- `GetQueryStats`
- `GetPageStats`

Bing側のquery/page統計はGoogleと更新頻度・位置指標の定義が同一ではない。
`AvgImpressionPosition` と `AvgClickPosition` を保持し、Googleの平均掲載順位と同一指標だと決めつけない。

## 保存スキーマ

`search_performance_daily`

主な列:

- `source`
- `data_date`
- `site_url`
- `grain`
- `query`
- `page`
- `country`
- `device`
- `search_type`
- `clicks`
- `impressions`
- `ctr`
- `avg_position`
- `avg_click_position`
- `metadata`
- `fetched_at`

`record_key` はsource/date/site/grain/dimensionsからSHA-256で決定し、再取得をupsertできる。

`search_collection_runs`

各providerの実行履歴を保存する。
秘密情報は保存しない。

`search_collection_health`

各providerの最新実行状態を見るための `security_invoker` view。

## 容量制御

初期状態では `query_page` を取得しない。

必要になった場合だけ `SEARCH_ENABLE_FINE_GRAIN=true` とする。
その場合は `SEARCH_FINE_GRAIN_RETENTION_DAYS=90` を初期値とし、古い `query_page` 行を削除する。

site/page/queryは長期分析に使う。
容量が増えた場合は、取得件数上限・保持期間・月次ロールアップを先に調整し、有料化を先に選ばない。

## 障害時

- OAuth認証エラーとAPI障害を区別する
- HTTP 429 / 5xx は短い有限リトライのみ
- 無限リトライしない
- エラー本文にtoken等が含まれる可能性を考え、APIレスポンス本文をログへ出さない
- Google失敗時にBing値を推測しない
- Bing失敗時にGoogle値を推測しない
- GSC Wizardや別の無料アプリへ自動フォールバックしない

## 次の有効化手順

1. Google OAuth clientを作成しread-only consentでrefresh tokenを取得
2. Bing Webmaster OAuth clientを作成し`webmaster.read` consentでrefresh tokenを取得
3. GitHub Variables / Secretsを設定
4. WorkflowをGoogleだけ `dry_run=true` で実行
5. Bingだけ `dry_run=true` で実行
6. 各結果を確認後、1日を指定して実書き込み
7. Supabaseの行数・run履歴・値を確認
8. `all` で通し実行
9. ChatGPTから28日集計を実行
10. 問題がなければ日次scheduleを通常運用とする

有効化前に第三者アプリへ戻さず、この順番で公式APIルートを完成させる。
