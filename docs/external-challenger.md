# External CHALLENGER pilot

Gemini を最初の外部 CHALLENGER として使うための pilot。

## Security boundary

- 外部AIは GitHub へ書き込まない。
- workflow は `contents: read` / `pull-requests: read` のみ。
- API key は `GEMINI_API_KEY` repository secret からのみ読む。
- PR本文とdiffは untrusted data として扱い、埋め込み命令を実行しないよう system prompt 相当の指示を固定する。
- 実行スクリプトは監査対象PRのbranchではなく `main` から checkout する。
- 入力は 500 KB 未満、findings は最大30件。
- API失敗、secret欠落、空入力、JSON/意味検証失敗は fail-closed。
- 結果は7日保持の Actions artifact のみ。自動でPRへ投稿・修正・mergeしない。

## Output

`challenger-result.json` に role / verdict / findings / confidence を保存する。JSON Schema 準拠に加え、runner側でも意味検証する。

## Human setup gate

実接続には GitHub repository secret `GEMINI_API_KEY` が必要。キー値をチャット、PR、docs、Actions logへ貼らない。

任意の repository variable `GEMINI_CHALLENGER_MODEL` でモデルを差し替えられる。未設定時は pilot の既定モデルを使う。

## Pilot evaluation

最初の数PRでは、外部CHALLENGERについて次を記録する。

- blocker/high のうち実際に有効だった割合
- 同一モデル内レビューでは見つからなかった有効指摘
- 誤検知・過剰修正の誘発数
- 応答時間
- APIコスト

結果を月曜のAI評価で見直し、Gemini継続・Claude比較・REVIEWER分離を判断する。
