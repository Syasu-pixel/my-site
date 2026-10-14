# AI編集部 火曜日フロー hard-stop 先回り監査

監査日: 2026-09-09

## 対象フロー
火曜日ボタン → 企画 → 公式調査 → Gemini検証 → 自動修正 → 記事HTML → hero → 本文図解 → OGP → PR → Cloudflare Pages Preview → PC/スマホ自動取得 → GPT Preview監査 → 自動修正 → 最終管理者確認。

## 今回先回りで修正した停止点
- hero画像: 3回品質未達で `throw` していた。3回目は暫定候補として同じ案件で続行し、最終Preview監査で再評価する。
- 本文図解: 3回品質未達で `throw` していた。heroと同じ方針へ統一。
- Gemini修正上限: resume controller自身が `NEEDS_HUMAN/HUMAN_GATE` を作っていた。上限後は degraded 警告を保持して制作へ進み、唯一の人間判断は最終Previewに限定。
- ダッシュボード: 成果物URL判定と火曜日テンプレートにNetlify前提が残っていたため、Cloudflare Pagesを第一候補として扱う。

## 既に自動復旧または待機設計になっている停止候補
- OpenAI/Gemini 429、Gemini 503、quota/resource exhausted/high demand: DBの `ai_editorial_claim_retry()` が同一commandをcooldown後に再開。
- 3分以上の planning/research/running 停滞: stalled recoveryが同じqueueで再開。
- Gemini一時制限でGPT代理検証: `ai_editorial_claim_autonomous_gate()` が中間human gateを自動回収。
- OGP品質未達: Article Builderは3回目候補をdegradedで保存し、Preview専用OGP監査は最大5回再設計後も途中human gateへ止めない。
- Cloudflare未完成: `preview_wait` のままProbeを繰り返し、配信確認前に最終Previewとして表示しない。
- 最終Preview GPT監査未達: v7以降は同じPRを最大5回自動修正・再Preview・再監査。

## fail-closedのまま残すもの
以下は自動継続すると破損や誤公開につながるため、意図的にhard failureを維持する。
- 認証/権限/secret欠落。
- GitHub branch/PR metadata欠落。
- checkpointやblueprintそのものが欠損。
- 生成AIが要求された構造(JSON/完全HTML)を返さず、状態を安全に復元できない場合。
- GitHub書込み失敗など、成果物の整合性を保証できない永続的エラー。

## 人間確認ポリシー
通常フローでは、最終Previewの自動品質基準を通過した後の既存右上「管理者確認」だけを人間の意思決定ゲートとする。右上UI構造は変更しない。
