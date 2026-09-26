# STO記事 全面刷新 作業ログ 2026-09-27

## 対象
- 公開URL: https://denkicontrol.com/articles/sto-basic.html
- 編集元: articles/sto-basic.html
- 作業ブランチ: preview-sto-basic-refresh-clean-20260927
- 基準main: 461dd1407588ed74e6da127b5e73627226f191f7

## 経緯
- 旧作業ブランチ `preview-sto-basic-refresh-20260925` は途中でmain側の別記事更新と乖離し、統合レビューが無関係なbaseline差分で停止した。
- 管理者指示により、同じWorkflowの手動再実行を繰り返さず、最新mainからクリーンなPreviewブランチを作り直した。
- 旧ブランチのSTO固有成果（本文、公式参照メモ、採用済み画像）だけを新ブランチへ再反映する。
- mainへのマージは最終統合Preview承認まで行わない。

## 検索データ事前確認
- Bing 日本語URL（保存データ最新 2026-09-18）
  - 直近28日: 41クリック / 540表示 / CTR 7.59% / 平均順位 5.00
  - 前28日: 20クリック / 327表示 / CTR 6.12% / 平均順位 4.39
- Google 日本語URLのpage粒度データは現行Supabase保存では未取得扱い。

## 技術刷新の要点
- STOを「停止指令」ではなく、トルク生成エネルギを遮断する安全機能として説明。
- STOは停止過程を制御しないことを明示。
- SS1、機械ブレーキ、非常停止、電源遮断との役割差を整理。
- 感電防止用の電源遮断とSTOを混同しない。
- 型式固有の端子名、復帰ロジック、PL/SIL/Category値を一般化しない。
- トラブル確認は安全回路のバイパスを促さず、診断表示と正式復帰手順を中心にする。

## 画像
採用済み原本を再利用し、配置都合で再生成しない。
- Hero: sto-hero.png
- OGP: sto-ogp.png
- 本文1: sto-normal-stop-vs-sto.png
- 本文2: sto-vs-ss1.png
- 本文3: sto-safety-flow.png
- 本文4: sto-safe-check-flow.png

## 承認条件
- `build-integrated-review` とpublication系検証を通す。
- raw branch HTMLを最終承認用Previewとして扱わない。
- PCライト / PCダーク / スマホライト / スマホダークを最終確認する。
- 管理者の明示OK前にmainへマージしない。
