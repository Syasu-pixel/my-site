# Denkicontrol Decision Log

## 目的
重要なAI判断を、結論だけでなく根拠・反証・再検討条件とともに残す。採用されなかった異論も、将来の再評価に価値がある場合は保存する。

## 記録対象
- サイト全体の方針変更
- AI役割 / モデル変更
- 大きなSEO施策
- 記事の統合・削除・大幅な検索意図変更
- Preview / Production / GitHub権限変更
- 画像品質基準変更
- 人間承認ゲート変更
- 収益化ルール変更
- AI間で対立し人間判断へ上げた案件

細かな誤字修正等は記録不要。

## Template

```md
# Decision: <short title>

- Date: YYYY-MM-DD
- Status: PROPOSED / ADOPTED / REVISED / HOLD / REJECTED / SUPERSEDED
- Risk: LOW / MEDIUM / HIGH
- Human approval: REQUIRED / NOT REQUIRED / COMPLETED

## Proposal
何を変更するか。

## Evidence
GSC / Bing / GitHub / 公式資料 / テスト結果 / 実運用データ等。

## Counterarguments
CHALLENGERおよび他Reviewerの主要な反論。

## Alternatives
検討した代替案と採用しなかった理由。

## Verdict
ADOPT / REVISE / HOLD / REJECT と理由。

## Confidence
LOW / MEDIUM / HIGH と、その理由。

## Human Decision
必要な場合のみ記録。

## Reconsideration Triggers
どんな新しい証拠・性能変化・検索変化・失敗が起きたら再検討するか。
```

## 原則
「以前そう決めたから」だけを継続理由にしない。新しい証拠が出た場合は過去Decisionを再評価し、置き換える場合は旧Decisionへの参照を残す。
