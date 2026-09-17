# AI Artifact Broker

更新日: 2026-09-17
状態: **旧方式・現行のサイト画像配置には使用しない**

## 現在の扱い
この文書は、2026-09-06〜2026-09-17に検討・試験した Supabase Artifact Broker の履歴を残すためのもの。

**通常の記事制作で採用済み画像をGitHubへ配置する手順として、このBrokerを使わない。**

現行の正本は次だけ。

- `docs/adopted-image-github-placement-rule.md`
- `.github/workflows/binary-image-transfer.yml`

他チャットは、画像配置が必要な場合にこの文書を運用手順として参照しないこと。

## 旧方式を残す理由
AI編集部は現在停止中であり、関連コード・Supabase Edge Function・GitHub履歴は解体せず保全する方針のため、Broker実装自体は履歴として残している。

残っている主な旧コンポーネント:
- `supabase/functions/artifact-broker/`
- `.github/workflows/ai-artifact-writer.yml`
- `scripts/ai_artifact_writer.py`

これらがリポジトリに存在していても、**現行のサイト画像配置ルートであることを意味しない**。

## 使用禁止
通常の記事画像配置で次を行わない。
- Supabase Artifact Brokerへ画像をimportする
- `import_firestorage` を画像配置手順として使う
- Brokerのsigned URLを作ってAI Artifact Writerへ渡す
- `.github/workflows/ai-artifact-writer.yml` を通常の記事画像転送に使う
- Broker経路と現行 `binary-image-transfer.yml` を混在させる

## 再利用条件
将来、AI編集部そのものを正式に再開し、Broker方式を再評価する場合だけ別途検討する。

その場合でも、通常の記事画像配置ルートを変更するなら先に隔離ブランチで検証し、`docs/adopted-image-github-placement-rule.md` を更新して旧ルート表記を整理する。

現行運用では、**採用済みサイト画像のGitHub配置は `binary-image-transfer.yml` だけを使用する。**
