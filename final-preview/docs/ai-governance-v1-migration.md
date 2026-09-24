# AI Governance v1 移行オーバーライド

> `docs/ai-governance.md` のPrinciplesは最上位。運用方針・公開権限の具体化は `docs/ai-editorial-master-rules.md` を正本とする。

## 公開権限
- LOWは、意味・技術内容・読者判断を変えない明白な誤字、実在確認済みリンク復旧、表示を変えない整形、確定済みメタデータの機械修正等に限定してAI自動公開可。
- 判断の余地があればMEDIUMへ上げる。
- 新規記事、本文意味変更、技術情報、記事画像、タイトル、SEO方針、収益導線、カテゴリ構造、削除/統合、安全関連、本番方式はMEDIUM/HIGHとして管理者Preview承認必須。

## Preview
- 本リポジトリではGitHub PRに接続されたNetlify Deploy Previewを標準の目視確認環境とする。
- PreviewはProductionと分離し、公開前コンテンツを本番sitemap/search-index/公開通知へ混ぜない。
- noindex、canonical、分析ノイズ等の隔離条件を監査する。

## 修正ループ
- 通常最大3ラウンド。
- 問題数/重大度が明確に改善している場合のみ最大5ラウンド。
- 同じ重大問題が2回連続で残る場合は停止して `NEEDS_HUMAN`。

## キュー
- 24時間更新なしの進行中案件は停滞/要確認表示。
- HUMAN_GATE以外で7日更新なしは自動CLOSED対象。
- HUMAN_GATEは日数だけで自動CLOSEDにしない。
- 履歴は削除しない。
