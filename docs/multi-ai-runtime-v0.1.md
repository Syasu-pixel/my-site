# Multi-AI runtime v0.1

## Purpose

denkicontrol.com の制作・監査・改善を、単一AIではなく役割の異なる複数AIで運営するための最小実装方針。

## First live topology

1. **EDITOR — OpenAI / GPT**
   - GSC・Bing・GitHubを横断し、テーマ、検索意図、既存記事との重複、優先順位を決める。
   - 実装そのものは担当しない。

2. **BUILDER — Codex**
   - EDITORの仕様に基づいてHTML、内部リンク、構造化された変更を実装する。
   - 公開可否を自分で決めない。

3. **CHALLENGER — external provider**
   - OpenAI系とは別系統のモデルを優先する。
   - 技術的誤り、SEO上の逆効果、カニバリ、UX崩れ、根拠不足、危険表現を反証する。
   - 結論への同意ではなく、失敗条件を探すことを役割とする。

4. **REVIEWER — separate review pass**
   - BUILDERとCHALLENGERの成果物を比較し、ADOPT / REVISE / ESCALATE を判定する。
   - CHALLENGERの意見を自動的に採用しない。

5. **HUMAN GATE**
   - 画像の最終採用。
   - 未承認の本番公開。
   - 重大なAI間対立。
   - 費用、契約、外部権限の追加。

## Provider rule

役割とプロバイダを固定しない。モデル変更は月曜評価または内部ベンチマークで再検討できる。

最初の外部CHALLENGER候補は Anthropic Claude または Google Gemini。どちらか一方から開始し、内部ベンチマーク後にもう一方を追加する。

## Execution boundary

外部AIにGitHubの広い書き込み権限を直接渡さない。

AIは次のJSON形式のレビュー結果だけを返す。

```json
{
  "role": "challenger",
  "verdict": "adopt|revise|escalate",
  "findings": [
    {
      "severity": "blocker|high|medium|low",
      "path": "relative/path.html",
      "claim": "指摘内容",
      "evidence": "根拠",
      "recommended_action": "推奨修正"
    }
  ],
  "confidence": 0.0
}
```

GitHubへの変更は既存の制約付きWriter / BUILDER層のみが行う。

## First implementation target

既存記事1本の改善PRを対象に以下を通す。

`EDITOR → BUILDER → external CHALLENGER → REVIEWER → Netlify Preview → Human gate → main`

まずはCHALLENGERだけを外部プロバイダ化する。ここで品質・コスト・応答時間を測定してから、REVIEWERの別プロバイダ化を判断する。

## Required secrets later

外部プロバイダAPIを実接続する段階で、GitHub Actions側にプロバイダAPIキーをSecretとして登録する。キー値はドキュメント、ログ、PR本文、AI出力へ書かない。

Secret名は実装PRで確定し、プロバイダ未接続時はworkflowをfail-closedにする。
