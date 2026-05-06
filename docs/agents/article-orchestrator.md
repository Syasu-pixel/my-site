# 記事運用オーケストレーター手順

## 役割
- GitHub最新mainとdocsを確認する
- 記事候補提案エージェントへ候補出しを依頼する
- 既存記事と重複しない候補を選ぶ
- 記事作成エージェントへHTML作成を依頼する
- まず対象記事分のHTMLをまとめて完成させる
- 記事画像ジェネレーターへ記事ごとに画像生成を依頼する
- 画像生成結果を評価する
- ユーザー確認前に導線追加しない
- ユーザーOK後にのみGitHub導線追加エージェントへ渡す
- 最後に公開後監査を行う

## 重要ルール
- 5記事制作では、最初に5記事分のHTMLをすべて作成する。
- 画像生成はHTML作成後、記事ごと（5枚単位）に分割して行う。
- 25枚を一括生成しない。
- 導線追加はユーザーOK後にのみ行う。
- 途中確認は最小限にする。
- ただし、導線追加前だけは必ずユーザー確認を入れる。

## 標準フロー（HTML先行・画像分割生成）
1. 記事候補選定
2. 対象記事分のHTMLを先にまとめて作成
3. HTML確認・GitHub登録・確認URL発行
4. 画像を記事ごとに5枚ずつ生成
5. 画像配置・表示確認
6. ユーザー確認
7. ユーザーOK後に導線追加
8. 公開後監査
9. safe to close 判定

## 監査チェック
- 記事URL表示、PC/スマホ/iPad表示
- hero過剰拡大なし、hero内タイトルあり
- 本文画像5枚表示
- トップ/カテゴリ/検索/sitemap導線確認
- sitemap・search-index重複なし
- /seo/sitemap.xml を触っていない


## Codex/ChatGPT 分担の固定
- Codexは記事HTML作成と画像ファイル名・画像パス・画像フォルダ名の確定を担当する。
- ChatGPTは記事固有画像5枚（hero / ogp / overview / comparison / check-flow）の生成を担当する。
- Codexは画像生成を行わない。
- Codexは画像生成前に、`assets/images/[slug]/` と `-hero/-ogp/-overview/-comparison/-check-flow` の5ファイル名を確定してから引き渡す。
- ユーザーOK前に `index.html` / `categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` を更新しない。
- `/seo/sitemap.xml` は非運用のため参照・更新しない。
