# Decision: multi-AI runtime v0.1

- Date: 2026-09-06
- Status: proposed for pilot

## Decision

単一AIによる制作・監査ではなく、EDITOR / BUILDER / CHALLENGER / REVIEWER を分離し、最初の外部プロバイダ導入は CHALLENGER から開始する。

## Rationale

- 同一モデル内の自己監査だけでは、同じ前提や見落としを共有しやすい。
- 反証役を独立させることで、技術・SEO・UX・安全面の失敗条件を早く検出しやすい。
- 外部AIへGitHub書き込み権限を与えず、レビューJSONのみ返させることで権限境界を維持できる。

## Counterarguments

- 外部API追加でコストと運用複雑性が増える。
- モデル差よりプロンプト差の影響が大きい場合がある。
- 外部AIの指摘を過信すると不要修正が増える。

## Rejected alternative

全役割を1モデル内の複数プロンプトだけで運用する案は、初期テスト用には残すが最終形にはしない。

## Confidence

0.86

## Reconsideration triggers

- 外部CHALLENGERの有効指摘率が低い。
- 月間コストが得られる品質改善に見合わない。
- 応答時間が公開サイクルを大きく遅らせる。
- より適したモデルまたはプロバイダが登場する。
