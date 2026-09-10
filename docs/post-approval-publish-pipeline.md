# 管理者Preview承認後の公開・インデックス工程

> 上位正本: `docs/ai-editorial-master-rules.md`

## 目的
MEDIUM/HIGHの記事について、管理者がNetlify Deploy Previewを目視してOKした後の処理をAI編集部が一貫して進めるための標準工程を定義する。

## HUMAN GATE解除
管理者の明示OKをHUMAN GATE解除条件とする。OK前にStep 2の本番導線追加や本番公開を行わない。

## Step 2 公開工程
1. 承認対象の記事slug、Preview PR、承認時点のcommit SHAを固定する。
2. Preview承認後に記事内容が変わった場合は、意味・技術・画像・レイアウトへ影響する変更なら再Preview/再承認する。
3. 必要な内部リンク導線を追加する。
   - トップページ
   - 対応カテゴリページ
   - 関連記事
   - language-menu / hreflang（対応言語記事が存在する場合）
   - その他、既存サイト構造上必要な導線
4. `assets/data/search-index.json` を既存形式に従って更新する。
5. 運用中の `sitemap.xml` を更新する。非運用の `/seo/sitemap.xml` は変更しない。
6. backlog等、既存運用で公開完了時に更新すべき管理データを更新する。
7. 全内部リンク、canonical、OGP、robots、画像パス、sitemap/search-index重複を監査する。
8. Step 2 PRを作成し、自動チェックを通す。
9. 承認済み記事の内容を不用意に変更していないことを確認してmainへ反映する。
10. 本番URLがHTTP成功し、意図した記事が表示されることを確認する。

## Bing / IndexNow
- 本リポジトリには `.github/workflows/indexnow.yml` の `Notify IndexNow` があり、mainへのpushで変更HTML URLを収集してIndexNowへ通知する。
- 記事HTML、カテゴリ、トップ等の対象HTMLがmainへ反映された場合は、この既存GitHub Actionsを標準通知経路とする。
- HTTP 200/202を「IndexNow通知受理」として記録する。
- 通知受理は検索結果へのインデックス完了を意味しない。
- Actions失敗時は `INDEX_NOTIFY_FAILED` とし、ログ確認・修正対象にする。失敗を成功扱いしない。

## Google
- IndexNowをGoogleへの直接登録手段として扱わない。
- Google向けの基礎経路は、正しい内部リンク、canonical、robots、運用中sitemap、本番到達性、自然クロールとする。
- 次のような**重要更新**は、本番反映後にGoogle Search ConsoleのURL検査を行い、問題がなければ「インデックス登録をリクエスト」を1回実施する候補とする。
  - Google Search Consoleで流入上位の既存記事を、技術内容・構成・画像・主要導線まで明確に更新した場合
  - サイト内で重要な柱記事を新規公開した場合
  - 検索意図に影響するタイトル・主要説明・大きな内容修正を行った場合
- 軽微な文言修正、CSSのみ、画像パスだけの調整、同日に多数のURLを更新した場合は、原則としてURL検査の手動リクエストを乱発せず、sitemap・内部リンク・自然クロールを優先する。
- 同一更新について短時間に「インデックス登録をリクエスト」を繰り返さない。
- Google Search ConsoleのURL検査/インデックス登録リクエストを自動化できる正式な接続・許可済み手段が存在する場合のみ、その手段を使用する。
- 接続がない場合は、重要更新を `GOOGLE_REQUEST_PENDING_MANUAL` として管理者へ表示し、対象URLを明記する。「Google登録リクエスト済み」とは記録しない。
- Search Console上で確認できる状態と、検索結果へ実際にインデックスされた状態を分けて記録する。

## 状態の分離
公開後は少なくとも次の状態を混同しない。
- `PUBLISHED`: main反映・本番URL表示確認済み
- `INDEXNOW_ACCEPTED`: Bing/IndexNow通知が200/202で受理済み
- `GOOGLE_REQUEST_PENDING_MANUAL`: 重要更新だが、許可済み自動経路がなくSearch ConsoleでのURL検査/登録リクエストが未実施
- `GOOGLE_REQUESTED`: 許可済みSearch Console経路または管理者操作でGoogleへ登録リクエストを実施済み
- `INDEX_CONFIRMED`: 対象検索エンジンでインデックス状態を後日確認済み
- `INDEX_NOTIFY_FAILED`: 通知/リクエスト工程が失敗
- `COMPLETED`: 必須公開工程と当日実行可能な通知・監査が完了。インデックス確認待ちがある場合はその事実を別状態/監査記録として保持する。

## 完了レポート
AI編集部は管理者へ以下を表示する。
- 本番記事URL
- Step 2で追加した主要導線
- sitemap/search-index更新結果
- IndexNow通知結果
- Google登録リクエスト結果（実行できた場合のみ）
- 重要更新で手動URL検査が必要な場合は、その対象URLと `GOOGLE_REQUEST_PENDING_MANUAL`
- インデックス確認状況
- エラーまたは後日確認が必要な項目

「公開済み」「通知済み」「インデックス確認済み」を同義として表示しない。
