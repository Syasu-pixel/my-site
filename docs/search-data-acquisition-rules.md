# 検索データ取得・保存ルール（正本）

更新日: 2026-09-17

この文書は、denkicontrol.com の Google Search Console / Bing Webmaster Tools の検索実績データを取得・保存し、ChatGPT から分析するための標準ルートを定義する正本である。

## 1. 現在の標準ルート

今後の標準構成は次の通りとする。

1. Google Search Console は Google 公式 Search Console API から取得する。
2. Bing は Microsoft 公式 Bing Webmaster API の現行 REST / JSON API から取得する。
3. 定期取得は GitHub Actions の標準 GitHub-hosted runnerで毎日06:25 JSTに実行する。
4. 取得データは必要な粒度へ整形して Supabase に保存する。
5. ChatGPT は Supabase に蓄積された検索データを読み、週次・月次・記事改善・人気記事集計などに利用する。

標準フロー:

`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`

## 2. GSC Wizard・外部連携アプリの扱い

- **GSC Wizard を定例の検索集計・検索確認の標準ルートとして使用しない。**
- これまで GSC Wizard を経由して行っていた Google Search Console / GA4 等の確認方法を、今後の恒久運用の正本とはしない。
- GSC Wizard、Windsor.ai、その他の第三者連携アプリの無料枠を使い切るたびに別アプリへ乗り換える運用は採用しない。
- 第三者アプリは、管理者が明示的に一時利用を指示した場合、または公式APIで取得できない補助データを確認する場合に限り補助ルートとして扱う。
- 第三者アプリが一時的に使える場合でも、それを理由に標準ルートを公式APIから外部アプリへ戻さない。

## 3. 実装状況の扱い

2026-09-17時点で、公式APIルートは**実環境でE2E確認済み・稼働状態**である。

確認済み:

- Google OAuth client / refresh token 発行
- Bing Webmaster API Key 発行
- GitHub Secrets / Variables 設定
- Google実API dry-run
- Bing実API dry-run
- Google / Bing のSupabase実保存
- Google / Bing 60日backfill
- ChatGPTからSupabase実データを使った「直近28日 vs 前28日」集計
- 日次06:25 JSTのGitHub Actions schedule設定

初回60日backfill後の実測:

- Google: 48,953行、2026-07-17〜2026-09-14
- Bing: 1,662行、2026-07-19〜2026-09-15
- `search_performance_daily`: 約27MB

したがって、新しいチャットは**公式APIルートが標準で稼働中**と判断する。
検索分析依頼では、まずSupabaseの蓄積データを確認する。
詳細な実装状態は `docs/search-data-implementation-status.md` を確認する。

## 4. コスト方針

- 月額0円ベースで運用できる構成を優先する。
- Google Search Console API は公式の無料API枠を利用する。
- GitHub Actions は本リポジトリが public の間、標準 GitHub-hosted runner の無料利用を前提とする。
- Supabase は Free プランの範囲を優先する。
- Bing Webmaster API の料金・利用条件、各サービスの無料枠は変更される可能性があるため、大きな仕様変更時に公式情報を再確認する。
- 無料枠を超える可能性がある変更、従量課金の有効化、有料プランへの変更は管理者の明示承認なしに行わない。

## 5. データ取得方針

### Google Search Console

最低限、次を取得対象とする。

- 日付
- ページURL
- 検索クエリ
- クリック
- 表示回数
- CTR
- 平均掲載順位
- 必要に応じて device / country / search appearance 等

Search Console の確定遅延や後日補正を吸収するため、日次処理では直近日だけを固定的に1回取得するのではなく、直近数日を再取得して upsert する。

Google認証は `https://www.googleapis.com/auth/webmasters.readonly` の読み取り専用OAuthを使用する。

### Bing Webmaster Tools

取得可能な現行APIの範囲で最低限、次を対象とする。

- 検索クエリ
- ページURL
- クリック
- インプレッション
- CTR
- 日付推移
- その他、公式APIから安定して取得できる検索パフォーマンス指標

認証は Microsoft 公式のAPI Keyを標準とし、OAuth 2.0 `Webmaster.read` は予備ルートとする。APIキーが設定されている場合はAPIキーを優先する。

GoogleとBingで指標定義や取得粒度が異なる場合は、無理に同一値として扱わず、元サービスと定義を保持した上で横断比較する。

## 6. Supabase保存方針

検索データは既存のAI編集部系データと混同しない構造を優先する。

2026-09-17の主基盤実装では、追加コストを発生させず、既存の接続済みSupabaseプロジェクト内に検索専用テーブルを論理分離して実装した。検索専用Supabaseプロジェクトを将来新設する場合も、同期クライアントは接続先を環境変数で切り替えられる構造を維持する。

保存方針:

- サイト全体の日次集計: 長期保存
- ページ別日次集計: 長期保存
- 重要クエリ・上位クエリの日次集計: 長期保存
- `query x page x device x country` 等の高粒度データ: 必要期間のみ保持
- 高粒度データは原則90日程度を初期目安とし、週次・月次集計へロールアップ後に削除できる設計にする
- 容量実測後に保持期間を調整する

初回60日backfill後の `search_performance_daily` は約27MBで、Supabase Freeの500MB DB枠に対して余裕がある。
容量は継続監視し、増加時は取得件数上限・保持期間・月次ロールアップを先に調整する。

## 7. ChatGPTでの標準利用

検索分析依頼ではまずSupabaseの蓄積データを確認する。

例:

- 直近28日と前28日の比較
- 表示回数が増えた/減ったページ
- 掲載順位5〜15位で改善余地が大きいページ
- 表示回数は多いがCTRが低いページ
- Googleで強くBingで弱い、またはその逆のページ
- 新規クエリの発生
- コンテンツ減衰
- 人気記事TOP10用のGoogle+Bing集計

データが欠けている期間・サービスについて推測値を作らない。取得失敗は「未取得」と明記する。

## 8. 月曜・金曜の検索確認

月曜の調査・企画、金曜のSEO・検索パフォーマンス確認では、公式APIからSupabaseへ蓄積されたGoogle/Bing実データを標準ソースとする。

- 月曜: 直近28日等を使い、伸びているテーマ、落ちている記事、新規需要、人気記事候補を確認する。
- 金曜: Google/Bingを別々に評価してから横断比較し、CTR、順位、クリック、表示回数、インデックスや取得異常を確認する。
- 人気記事更新は `docs/popular-articles-maintenance.md` に従う。
- AI検索・引用分析は `docs/ai-search-citation-rules.md` に従う。

## 9. 認証情報とセキュリティ

- OAuth client secret、refresh token、Bing API key、Supabase secret/service-role key 等を公開GitHub、記事、PR本文、ログへ保存しない。
- GitHub Actions で必要な秘密情報は GitHub Repository Secrets に置く。
- Supabaseのservice-role/secret keyを公開クライアントへ露出しない。
- workflowログへトークン・APIキー・認証レスポンスを出力しない。
- PRやPreviewで秘密情報を確認するために値そのものを表示しない。
- 2026-09-17時点では既存legacy `service_role` をバックエンドで使用している。Supabaseの新 `sb_secret_...` Secret Keyへ順次移行し、公開クライアントには絶対に露出しない。

## 10. 失敗時のルール

- 取得失敗時に短時間の連打や無限リトライをしない。
- GoogleはOAuth認証、quota、仕様変更、サービス障害を切り分ける。
- BingはAPIキー失効/権限、quota、仕様変更、サービス障害を切り分ける。
- Googleだけ取得できた場合にBing分を推測しない。逆も同様。
- 一時障害を理由に第三者無料アプリを恒久標準へ戻さない。
- 有料化が必要になりそうな場合は、先に無料範囲での縮小案（取得頻度、保存粒度、保持期間）を検討する。

## 11. 正本と変更管理

検索データの**取得経路**について他文書と矛盾した場合は、この `docs/search-data-acquisition-rules.md` を優先する。

既存文書に「GSC Wizardを使用」「Windsor.aiを標準利用」「利用可能な外部アプリで取得」等、この正本と矛盾する表現を発見した場合は、公式APIルートへ統一する修正候補として扱う。

この方針を変更する場合は、料金、継続性、取得できる指標、データ保持、ChatGPTからの利用可否を比較し、管理者承認を得てから正本を更新する。

## 12. 公式確認先

実装・仕様変更時は最新の公式情報を確認する。

- Google Search Console API: https://developers.google.com/webmaster-tools/
- Google Search Console API pricing: https://developers.google.com/webmaster-tools/pricing
- Bing Webmaster API: https://learn.microsoft.com/en-us/bingwebmaster/
- Bing API access: https://learn.microsoft.com/en-us/bingwebmaster/getting-access
- Bing API protocols: https://learn.microsoft.com/en-us/bingwebmaster/api-protocols
- GitHub Actions billing: https://docs.github.com/en/actions/concepts/billing-and-usage
- Supabase API keys: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase pricing: https://supabase.com/pricing

2026-09-17時点の確認では、Google Search Console APIは無料、public repositoryの標準GitHub-hosted runnerは無料、Supabase Freeは500MB databaseを含む。これらを永続保証とみなさず、仕様変更時に再確認する。
