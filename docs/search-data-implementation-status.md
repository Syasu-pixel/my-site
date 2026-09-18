# 検索データ基盤 実装状況

更新日: 2026-09-17

この文書は `docs/search-data-acquisition-rules.md` で定義した
`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`
の実装状況を記録する。

## 現在の状態

**稼働確認済み。GSC Wizardは標準ルートとして使用しない。**

2026-09-17 に以下をすべて実環境で確認した。

- Google Search Console API のOAuth認証・実API取得
- Bing Webmaster API のAPI Key認証・実API取得
- GitHub Repository Secrets / Variables の設定
- Google / Bing のdry-run
- Google 1日分のSupabase実保存
- Bing通常windowのSupabase実保存
- Google / Bing 60日backfill
- SupabaseからChatGPTで「直近28日 vs 前28日」集計
- GitHub Actionsの日次実行設定

したがって、新しいチャットではこの検索データ基盤を**標準の稼働ルート**として扱う。
GSC Wizard、Windsor.ai等の第三者アプリへ自動的に戻さない。

## 実装済み

- Supabase
  - `public.search_performance_daily`
  - `public.search_collection_runs`
  - `public.search_collection_health`
  - RLS有効
  - `anon` / `authenticated` のテーブル権限なし
  - backend secret/service-roleのみで書き込み
- Google Search Console Search Analytics API
  - OAuth 2.0
  - scope: `https://www.googleapis.com/auth/webmasters.readonly`
  - `dataState=final`
  - site / page / query の日次粒度
- Bing Webmaster JSON API
  - API Keyを標準認証
  - OAuth Bearerは予備ルート
  - `GetRankAndTrafficStats`
  - `GetQueryStats`
  - `GetPageStats`
- 共通同期処理
  - deterministic `record_key` によるidempotent upsert
  - Google/Bingを独立実行
  - HTTP 429 / 5xxの有限リトライ
  - `query x page` は既定OFF
  - 高粒度データを有効化した場合は90日保持を初期値
- GitHub Actions
  - `scripts/` のsparse checkout
  - 手動実行は `dry_run=true` が既定
  - scheduleは実書き込み
  - 28 / 60 / 90日backfill対応

## 実環境で確認した値

2026-09-17の初回確認時点:

- dry-run
  - Google: 3,845行（page 962 / query 2,879 / site 4）
  - Bing: 413行（page 200 / query 200 / site 13）
- Google 1日実保存（2026-09-14）
  - 1,155行（page 259 / query 895 / site 1）
- 60日backfill後
  - Google: 48,953行、2026-07-17〜2026-09-14
  - Bing: 1,662行、2026-07-19〜2026-09-15
- `search_performance_daily` 使用量: 約27MB

Supabase Freeの500MB DB枠に対し、初回60日backfill後でも十分な余裕がある。

## E2E確認

Supabaseだけをデータ源として、ChatGPTから28日比較を実行済み。

初回確認値:

- Google
  - 直近28日: 2,548 clicks / 139,359 impressions / CTR 1.83%
  - 前28日: 1,567 clicks / 93,650 impressions / CTR 1.67%
- Bing
  - 直近28日: 5,842 clicks / 205,384 impressions / CTR 2.84%
  - 前28日: 4,300 clicks / 140,076 impressions / CTR 3.07%

この確認により、
`公式API -> GitHub Actions -> Supabase -> ChatGPT`
のE2E動作を実証済みとする。

## GitHub Actions

Workflow:

`.github/workflows/search-data-sync.yml`

通常運用:

- 毎日 06:25 JST
- Google: 3日遅れを基準に直近4日を再取得
- Bing: 1日遅れを基準に直近14日を再取得
- 同じデータはupsertするため再取得で重複を増やさない
- schedule実行はSupabaseへ実書き込み

手動実行:

- provider: `all / google / bing`
- `dry_run=true`: API取得・正規化のみでSupabaseへ書かない
- `date=YYYY-MM-DD`: 1日指定
- `backfill_days=28 / 60 / 90`: rolling backfill

## GitHub Variables

- `SEARCH_DATA_SUPABASE_URL`
- `GSC_SITE_URL`
- `BING_WEBMASTER_SITE_URL`

## GitHub Secrets

必須:

- `SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY`
- `GSC_CLIENT_ID`
- `GSC_CLIENT_SECRET`
- `GSC_REFRESH_TOKEN`
- `BING_WEBMASTER_API_KEY`

Bing OAuth予備ルート:

- `BING_WEBMASTER_CLIENT_ID`
- `BING_WEBMASTER_CLIENT_SECRET`
- `BING_WEBMASTER_REFRESH_TOKEN`

秘密値をGitHub通常ファイル、PR本文、Issue、Actions input、ログへ出さない。

## Supabase key移行メモ

2026-09-17時点では既存のlegacy `service_role` をバックエンドで使用している。
Supabaseはlegacy `anon` / `service_role` を2026年末までに非推奨化する方針のため、将来は `sb_secret_...` のSecret Keyへ移行する。
移行時も公開クライアントへSecret Keyを露出しない。

## 障害時

- Google OAuth認証エラーとAPI障害を区別する
- Bing API Key失効/権限とAPI障害を区別する
- HTTP 429 / 5xx は有限リトライのみ
- APIレスポンス本文をエラーログへ出さない
- Google失敗時にBing値を推測しない
- Bing失敗時にGoogle値を推測しない
- GSC Wizardや別の無料アプリへ自動フォールバックしない

## 今後の標準利用

月曜・金曜のSEO確認、記事改善候補、人気記事集計、Google/Bing比較では、まずSupabaseの蓄積データを利用する。
データが欠ける期間やproviderは推測せず未取得として扱う。

詳細な認証手順は `docs/search-data-oauth-setup.md` を参照する。
