# 記事制作ワークフロー v2 移行オーバーライド

> 正本: `docs/ai-editorial-master-rules.md`。`docs/article-workflow.md` の旧担当・手動アップロード記述と矛盾する場合は本書とマスタールールを優先する。

## 日本語記事 Step 1
- ChatGPT / AI編集部が完成記事HTMLを作成する。
- ChatGPTが記事画像を生成する。
- AI編集部は技術/SEO/画像監査後、確認用GitHubブランチ/PRへ反映する。
- GitHub PRに接続されたNetlify Deploy Previewを発行する。
- 管理者はPreviewで記事本文・画像・レイアウトをまとめて目視確認する。
- 管理者OK前はStep 2公開導線を追加しない。

## Codex
- 記事本文をゼロから執筆する主担当にしない。
- 配置、静的チェック、リンク/画像存在確認、限定的な細修正、Step 2導線整備を担当する。

## Preview NG
- 管理者は問題点・目的を指示すればよく、具体的修正方法はAI編集部が設計する。
- 再制作後は必要な監査を再実行し、再Previewする。

## Gemini障害
- Gemini一時障害時は再試行後、GPT API代理検証を許可する。
- GPT代理検証は `⚠️ GPT代理検証・Gemini未確認` と明示する。
- GPT代理になった案件は記事制作前で停止し、再開判断後にPreviewまで進行できる。
- 管理者がPreviewを確認しOKすれば公開可能で、Gemini再検証を絶対条件にはしない。
