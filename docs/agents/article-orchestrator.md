# 記事運用オーケストレーター手順

> 上位正本: `docs/ai-editorial-master-rules.md`。矛盾時は上位正本を優先する。

## 役割
- GitHub最新mainとdocsを確認する
- 記事候補提案エージェントへ候補出しを依頼する
- 既存記事と重複しない候補を選ぶ
- ChatGPT / AI編集部の記事作成担当へ完成HTML作成を依頼する
- 対象記事分のHTMLを完成させる
- 記事ごとに必要画像を設計し、ChatGPTへ生成を依頼する
- 画像生成側の自己評価と独立IMAGE REVIEWERの結果を確認する
- TECHNICAL / SEO監査と自動検査を通す
- GitHub確認ブランチ / PRへ反映し、Netlify Deploy Previewを発行する
- 管理者確認前にStep 2公開導線を追加しない
- 管理者OK後にのみStep 2導線整備へ進む
- 最後に公開後監査を行う

## 重要ルール
- 1回の管理者指示で新規記事は最大5本。
- 複数記事でも各記事を個別に品質ゲートへ通す。
- 画像は5枚固定ではない。hero + OGP + 本文1〜4枚を原則とし、説明上不要な画像を枚数合わせで作らない。
- 画像は記事ごとに分割して生成し、大量一括生成しない。
- 管理者確認前にStep 2導線追加を行わない。
- 途中確認は最小限にし、MEDIUM/HIGH記事案件はNetlify Deploy Previewで管理者目視確認を行う。

## 標準フロー
1. 記事候補選定
2. 重複・検索意図・既存記事確認
3. 公式一次情報調査
4. EDITOR設計 / CHALLENGER反証
5. 最適な既存完成記事をコピー元として完成HTML作成
6. TECHNICAL / SEO監査
7. 必要画像を記事ごとに生成
8. 画像自己評価95点以上 + 独立IMAGE REVIEWER
9. 画像配置・HTML/リンク/表示自動検査
10. GitHub確認ブランチ / PR作成
11. Netlify Deploy Preview発行
12. 管理者目視確認
13. 管理者OK後にStep 2導線追加
14. 公開後監査
15. safe to close 判定

## 監査チェック
- 記事URL表示、PC/スマホ等の表示
- hero過剰拡大なし、hero内テーマが明確
- 必要な本文画像が表示され、不要な枚数合わせがない
- 画像が自己評価95点以上かつIMAGE REVIEWER通過
- 全内部リンク・画像パス実在確認
- Step 1ではトップ/カテゴリ/search-index/sitemap/backlogを変更していない
- Step 2後はトップ/カテゴリ/検索/sitemap導線確認
- sitemap・search-index重複なし
- `/seo/sitemap.xml` を触っていない

## Codex / ChatGPT 分担の固定
- ChatGPT / AI編集部が完成記事HTMLの作成を担当する。
- 新規HTMLは同じ記事タイプ・目的・レイアウトに最も近い完成済み記事を完全コピーし、必要箇所だけ差し替える。
- Codexは記事本文をゼロから執筆する主担当にしない。
- Codexは配置、静的チェック、リンク・画像存在確認、限定的な細修正、Step 2導線整備を担当する。
- ChatGPTは記事固有画像を生成する。Codexは画像生成を行わない。
- 画像ファイル名は実際に必要な用途に合わせて確定し、`overview / comparison / check-flow` を固定セットとして強制しない。
- 管理者OK前に `index.html` / `categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` 等のStep 2導線を更新しない。
- `/seo/sitemap.xml` は非運用のため参照・更新しない。

## Preview
- 本リポジトリではGitHub PRに接続されたNetlify Deploy Previewを標準の目視確認環境として使用する。
- PreviewはProductionと分離し、公開前コンテンツを本番sitemap/search-index等へ追加しない。
- MEDIUM/HIGH記事案件は管理者がPreviewを確認し、OK後に公開工程へ進む。
