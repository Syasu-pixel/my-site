# 検索データ取得・保存ルール（正本）

更新日: 2026-09-17

この文書は、denkicontrol.com の Google Search Console / Bing Webmaster Tools の検索実績データを取得・保存し、ChatGPT から分析するための標準ルートを定義する正本である。

## 1. 現在の標準ルート

今後の標準構成は次の通りとする。

1. Google Search Console は Google 公式 Search Console API から取得する。
2. Bing は Microsoft 公式 Bing Webmaster API の現行 REST 系 API から取得する。
3. 定期取得は GitHub Actions の標準 GitHub-hosted runner で1日1回を基本とする。
4. 取得データは必要な粒度へ整形して Supabase に保存する。
5. ChatGPT は Supabase に蓄積された検索データを読み、週次・月次・記事改善・人気記事集計などに利用する。

想定フロー:

`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`

## 2. GSC Wizard・外部連携アプリの扱い

- **GSC Wizard を定例の検索集計・検索確認の標準ルートとして使用しない。**
- これまで GSC Wizard を経由して行っていた Google Search Console / GA4 等の確認方法を、今後の恒久運用の正本とはしない。
- GSC Wizard、Windsor.ai、その他の第三者連携アプリの無料枠を使い切るたびに別アプリへ乗り換える運用は採用しない。
- 第三者アプリは、管理者が明示的に一時利用を指示した場合、または公式APIで取得できない補助データを確認する場合に限り補助ルートとして扱う。
- 第三者アプリが一時的に使える場合でも、それを理由に標準ルートを公式APIから外部アプリへ戻さない。

## 3. 実装状況の扱い

この文書の追加時点では、上記は**採用済みの目標構成・運用ルール**であり、公式API取得・GitHub Actions・検索データ用Supabaseテーブルの実装完了を意味しない。

実装完了までは以下を守る。

- 新しいチャットは「公式APIルートがすでに稼働中」と推測しない。
- 実装済みかどうかは GitHub の workflow、Supabase のテーブル、実行履歴を確認して判断する。
- 未実装部分がある場合は、GSC Wizardへ自動的に戻らず、公式APIルートの実装を優先する。

## 4. コスト方針

- 月額0円ベースで運用できる構成を優先する。
- Google Search Console API は公式の無料API枠を利用する。
- GitHub Actions は本リポジトリが public の間、標準 GitHub-hosted runner の無料利用を前提とする。
- Supabase は Free プランの範囲を優先する。
- Bing Webmaster API の料金・利用条件、各サービスの無料枠は変更される可能性があるため、実装時および大きな仕様変更時に公式情報を再確認する。
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

Search Console の確定遅延や後日補正を吸収するため、日次処理では直近日だけを固定的に1回取得するのではなく、直近数日を再取得して upsert できる設計を優先する。

### Bing Webmaster Tools
取得可能な現行APIの範囲で最低限、次を対象とする。

- 検索クエリ
- ページURL
- クリック
- インプレッション
- CTR
- 日付推移
- その他、公式APIから安定して取得できる検索パフォーマンス指標

GoogleとBingで指標定義や取得粒度が異なる場合は、無理に同一値として扱わず、元サービスと定義を保持した上で横断比較する。

## 6. Supabase保存方針

検索データは、既存のAI編集部系データと混同しない構造を優先する。

検索データ専用Supabaseプロジェクトを新設できる場合は、`denkicontrol-search-data` 相当の独立プロジェクトを第一候補とする。ただし、プロジェクト作成は実際のFree枠・既存プロジェクト数を確認してから行う。

保存方針:

- サイト全体の日次集計: 長期保存
- ページ別日次集計: 長期保存
- 重要クエリ・上位クエリの日次集計: 長期保存
- `query x page x device x country` 等の高粒度データ: 必要期間のみ保持
- 高粒度データは原則90日程度を初期目安とし、週次・月次集計へロールアップ後に削除できる設計にする
- 容量実測後に保持期間を調整する

Supabase Free のDB容量を無制限とみなさず、保存量を定期確認する。

## 7. ChatGPTでの標準利用

公式APIルートの稼働後は、検索分析依頼でまずSupabaseの蓄積データを確認する。

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

- OAuth client secret、refresh token、API key、Supabase secret/service-role key 等を公開GitHub、記事、PR本文、ログへ保存しない。
- GitHub Actions で必要な秘密情報は GitHub Secrets 等の非公開の適切な保管先を使う。
- Supabaseのservice-role/secret keyを公開クライアントへ露出しない。
- workflowログへトークン・APIキー・認証レスポンスを出力しない。
- PRやPreviewで秘密情報を確認するために値そのものを表示しない。

## 10. 失敗時のルール

- 取得失敗時に短時間の連打や無限リトライをしない。
- 公式APIの認証エラー、quota、仕様変更、サービス障害を切り分ける。
- Googleだけ取得できた場合にBing分を推測しない。逆も同様。
- 一時障害を理由に第三者無料アプリを恒久標準へ戻さない。
- 有料化が必要になりそうな場合は、先に無料範囲での縮小案（取得頻度、保存粒度、保持期間）を検討する。

## 11. 正本と変更管理

検索データの**取得経路**について他文書と矛盾した場合は、この `docs/search-data-acquisition-rules.md` を優先する。

既存文書に「GSC Wizardを使用」「Windsor.aiを標準利用」「利用可能な外部アプリで取得」等、この正本と矛盾する表現を発見した場合は、公式APIルートへ統一する修正候補として扱う。

この方針を変更する場合は、料金、継続性、取得できる指標、データ保持、ChatGPTからの利用可否を比較し、管理者承認を得てから正本を更新する。

## 12. 公式確認先

実装時は必ず最新の公式情報を確認する。

- Google Search Console API: https://developers.google.com/webmaster-tools/
- Google Search Console API pricing: https://developers.google.com/webmaster-tools/pricing
- Bing Webmaster API: https://learn.microsoft.com/en-us/bingwebmaster/
- GitHub Actions billing: https://docs.github.com/en/actions/concepts/billing-and-usage
- Supabase pricing: https://supabase.com/pricing

2026-09-17時点の確認では、Google Search Console APIは無料、public repositoryの標準GitHub-hosted runnerは無料、Supabase Freeは500MB databaseを含む。これらを永続保証とみなさず、実装・仕様変更時に再確認する。