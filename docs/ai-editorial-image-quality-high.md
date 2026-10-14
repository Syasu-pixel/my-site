# AI編集部 画像生成品質アップデート

AI編集部 Article Builder の画像生成は OpenAI Images API の `gpt-image-2` を使用し、既定の画質を `medium` から `high` へ変更する。

- モデル既定値: `gpt-image-2`
- 画質既定値: `high`
- 環境変数 `OPENAI_IMAGE_QUALITY` で `low` / `medium` / `high` / `auto` を上書き可能
- 不正な値の場合は安全に `high` へフォールバック
- 既存の画像ピクセル監査（95点基準）と、前回指摘を次回プロンプトへ入れる再生成ループは維持
- 画像サイズは既存の `1536x1024` を維持し、品質変更だけを先に行う

OpenAI公式ドキュメント上、`gpt-image-2` は `low` / `medium` / `high` の品質指定をサポートする。今回、まず画質不足の主因だった `medium` 固定を解除し、既定を `high` にする。
