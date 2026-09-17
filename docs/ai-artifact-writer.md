# AI Artifact Writer

更新日: 2026-09-17
状態: **旧AI編集部系コンポーネント・現行のサイト画像配置には使用しない**

## 現在の扱い
この文書は、AI編集部向けに作られた旧 `AI Artifact Writer` の履歴説明として残す。

**採用済み画像を記事Previewブランチへ配置する現行手順では、このWriterを使用しない。**

現行の正本:
- `docs/adopted-image-github-placement-rule.md`
- `.github/workflows/binary-image-transfer.yml`

他チャットは、通常の記事画像配置で `workflow_dispatch` / `repository_dispatch` の `AI Artifact Writer` を起動しないこと。

## 残存コードについて
履歴・停止中AI編集部の保全のため、次のコードはリポジトリに残る場合がある。
- `.github/workflows/ai-artifact-writer.yml`
- `scripts/ai_artifact_writer.py`
- Supabase Artifact Broker関連コード

存在しているだけで現行運用を意味しない。

## 使用禁止
通常の記事画像配置で次を行わない。
- artifact URLをAI Artifact Writerへ渡す
- `ai-artifact-ready` repository dispatchを使う
- Supabase signed URLとWriterを組み合わせる
- Writer経路と `binary-image-transfer.yml` を併用する

## 再利用条件
AI編集部を将来正式に再開し、このWriterを再採用する判断が行われた場合だけ再評価する。

通常の記事制作では、**`.github/workflows/binary-image-transfer.yml` + `.github/binary-transfer-request.json` の1ルートのみを使用する。**
