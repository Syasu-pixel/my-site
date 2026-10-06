# sto-basic 公式参照メモ

## 参照した公式元
- 三菱電機FA:
  - https://www.mitsubishielectric.co.jp/fa/solutions/competencies/safety/features/servo.html
  - https://www.mitsubishielectric.co.jp/fa/products/drv/servo/pmerit/mr_j5/amp/index.html
  - https://www.mitsubishielectric.co.jp/fa/products/drv/servo/pmerit/mr_j5/amp/safety_sub-functions.html
  - https://fa-faq.mitsubishielectric.co.jp/fa/products/drv/inv/pmerit/fr_e/e800/e804.html
- オムロンFA:
  - https://www.fa.omron.co.jp/guide/technicalguide/4/178/
- Siemens:
  - SINAMICS Safety Integrated Function Manual / Commissioning Manual（STO / SS1 の一般原理確認）

## 確認対象マニュアル・資料
- 三菱電機FA ACサーボ 安全機能・MELSERVO-J5 安全監視機能
- 三菱電機FA FREQROL-E800 安全機能
- オムロン セーフティコンポ テクニカルガイド「セーフティ機能を搭載したドライブ機器」
- Siemens Safety Integrated STO / SS1 関連資料

## 確認日
- 2026-09-25

## 記事で使う範囲
- STO = Safe Torque Off の基本定義
- モータのトルク／推力を発生させる駆動エネルギを安全側で遮断する考え方
- IEC/EN 60204-1 の停止カテゴリ0に相当するという一般説明
- STOでは停止過程そのものを制御しないため、回転中は惰性・機械条件に依存して停止すること
- 必要に応じて機械ブレーキ等の追加方策が必要になること
- STOは感電防止用の電源遮断ではないこと
- SS1は減速後にSTOへ移行する機能であり、STOとの役割が異なること
- 非常停止・安全ドア・ライトカーテン・安全リレー／安全PLC等と組み合わせる場合の一般構成
- 機種ごとに安全入力方式、診断、復帰条件、安全性能レベル、停止挙動が異なること

## 断定しない範囲
- STO入力端子名・CH名・論理・配線方式
- STO作動時に必ずダイナミックブレーキ停止になる、など機種固有の停止挙動
- PL / SIL / Category の達成値を機種横断で固定値として扱うこと
- STOだけで非常停止機能全体が成立すると断定すること
- STOを電源遮断・感電防止・機械的ロックと同一視すること
- 復帰操作、リセット条件、パラメータ、アラーム番号の一般化

## 画像ルール
- 実在UIを完全再現しない
- メーカーロゴを入れない
- 型式銘板や実在製品ラベルを再現しない
- 概念図・模式図として作る
- STOは「制御停止ボタン」ではなく「トルク生成エネルギを遮断する安全機能」として表現する
- STO作動後に必ず即時停止・制動するような描写を避ける
- STOとSS1の比較図では「STO: トルク遮断」「SS1: 減速 → STO」の時間軸差を明確にする
- 電源遮断・ロックアウトをSTOと同じ機能として描かない

## 公式用語・採用表記

| 種別 | 日本語表記 | 英語表記 | 参照元 | 記事・画像での採用方針 |
|---|---|---|---|---|
| 安全機能 | 安全トルク遮断 | Safe Torque Off (STO) | 三菱電機FA | 初出で併記 |
| 停止機能 | 安全停止1 | Safe Stop 1 (SS1) | 三菱電機FA | STOとの差の説明に使用 |
| 停止区分 | 停止カテゴリ0 | Stop category 0 | 三菱電機FA / Siemens | 「STOはカテゴリ0に相当」と説明 |
| ブレーキ | 安全ブレーキ制御 | Safe Brake Control (SBC) | 三菱電機FA | 必要な場合のみ補足 |
| 安全性能 | PL / SIL / Category | PL / SIL / Category | 各メーカー | 型式固有値は一般化しない |

## 画像内で使用してよい表記
- STO
- Safe Torque Off
- 安全トルク遮断
- SS1
- Safe Stop 1
- 減速
- トルク遮断
- 安全リレー
- 安全PLC
- 非常停止
- 安全ドア
- モータ
- ドライブ

## 画像内で使用しない表記
- メーカー名・ロゴ・型式
- 実在端子番号
- 実在アラーム番号
- 「STO = 電源OFF」
- 「STO = ブレーキ」
- 「STOで必ず瞬時停止」

## メモ
- 三菱電機FAはSTOを外部入力に基づくモータ駆動エネルギの電子的遮断として説明し、IEC/EN 60204-1の停止カテゴリ0相当としている。
- オムロンFAはSTOでは停止状態が制御されないため、必要に応じて機械ブレーキ等の追加方策が必要であり、感電防止機能ではないと明記している。
- 記事本文ではメーカー横断の一般原理を中心にし、機種固有の挙動は公式資料の範囲外へ一般化しない。
