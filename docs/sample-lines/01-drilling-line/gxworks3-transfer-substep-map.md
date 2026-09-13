# 01 Drilling Line — GX Works3 搬送サブステップ正式割付

Status: Draft / GX Works3実装直前基準

## 1. 目的

`gxworks3-transfer-pattern-spec.md` と `gxworks3-section-pseudo-ladder-spec.md` で定義した4搬送区間の内部サブステップを、M440帯へ正式に割り付ける。

T1～T4は同じ構造・同じ並びで比較できることを最優先とする。

## 2. 共通ステップ構造

各搬送区間は次の7状態を持つ。

1. RELEASE — 搬送元ストッパー下降要求
2. DOWN_OK — 下降端確認済み
3. RUN — 搬送元/搬送先モータRUN
4. PASS_SEEN — 通過センサON確認済み
5. PASS_COMPLETE — 通過ON後OFF確認済み
6. TRANSFER_OK — source OFF + destination ON
7. RESTORE — モータ停止後、ストッパー上昇復帰

Busyは別にM430～M433を使用する。

## 3. T1 CV01→CV02

| Device | Comment |
|---|---|
| M440 | T1_RELEASE_ST01_DOWN |
| M441 | T1_ST01_DOWN_OK |
| M442 | T1_CV01_CV02_RUN |
| M443 | T1_PASS_SEEN |
| M444 | T1_PASS_COMPLETE |
| M445 | T1_TRANSFER_OK |
| M446 | T1_RESTORE_ST01_UP |

開始：M430 SET後にM440へ。

遷移基準：

- M440 → M441：M127 ST01下降端
- M441 → M442：下降端成立かつ異常なし
- M442 → M443：M200 CV01通過SEEN
- M443 → M444：M201 CV01通過COMPLETE
- M444 → M445：NOT M116 AND M117
- M445 → M446：RUN要求解除後
- M446 → END：M126 ST01上昇端成立でM430 RESET

AUTO要求：

- M440：M805 ST01下降
- M442～M445：M800 CV01 RUN + M801 CV02 RUN
- M446：M804 ST01上昇

## 4. T2 CV02→CV03

| Device | Comment |
|---|---|
| M450 | T2_RELEASE_ST02_DOWN |
| M451 | T2_ST02_DOWN_OK |
| M452 | T2_CV02_CV03_RUN |
| M453 | T2_PASS_SEEN |
| M454 | T2_PASS_COMPLETE |
| M455 | T2_TRANSFER_OK |
| M456 | T2_RESTORE_ST02_UP |

遷移基準：

- M450 → M451：M131 ST02下降端
- M451 → M452：下降端成立かつ異常なし
- M452 → M453：M202
- M453 → M454：M203
- M454 → M455：NOT M117 AND M120
- M455 → M456：RUN要求解除後
- M456 → END：M130 ST02上昇端でM431 RESET

AUTO要求：

- M450：M807 ST02下降
- M452～M455：M801 CV02 RUN + M802 CV03 RUN
- M456：M806 ST02上昇

## 5. T3 CV03→CV04

| Device | Comment |
|---|---|
| M460 | T3_RELEASE_ST03_DOWN |
| M461 | T3_ST03_DOWN_OK |
| M462 | T3_CV03_CV04_RUN |
| M463 | T3_PASS_SEEN |
| M464 | T3_PASS_COMPLETE |
| M465 | T3_TRANSFER_OK |
| M466 | T3_RESTORE_ST03_UP |

遷移基準：

- M460 → M461：M133 ST03下降端
- M461 → M462：下降端成立かつ異常なし
- M462 → M463：M204
- M463 → M464：M205
- M464 → M465：NOT M120 AND M121
- M465 → M466：RUN要求解除後
- M466 → END：M132 ST03上昇端でM432 RESET

AUTO要求：

- M460：M809 ST03下降
- M462～M465：M802 CV03 RUN + M803 CV04 RUN
- M466：M808 ST03上昇

## 6. T4 CV04→加工ST

| Device | Comment |
|---|---|
| M470 | T4_RELEASE_ST04_DOWN |
| M471 | T4_ST04_DOWN_OK |
| M472 | T4_CV04_ST_RUN |
| M473 | T4_PASS_SEEN |
| M474 | T4_PASS_COMPLETE |
| M475 | T4_TRANSFER_OK |
| M476 | T4_RESTORE_ST04_UP |

遷移基準：

- M470 → M471：M135 ST04下降端
- M471 → M472：下降端成立 + M330受入許可継続
- M472 → M473：M206
- M473 → M474：M207
- M474 → M475：NOT M121 AND M140
- M475 → M476：搬送側RUN解除後
- M476 → END：M134 ST04上昇端でM433 RESET

AUTO要求：

- M470：M811 ST04下降
- M472～M475：M803 CV04 RUN + 加工ST側搬送要求（加工ST駆動方式に従う）
- M476：M810 ST04上昇

加工ST側への責任移管点はM475成立後とする。

## 7. 排他ルール

- T1とT2は同時不可
- T2とT3は同時不可
- T3とT4は同時不可
- T1とT3は同時可
- T2とT4は同時可

Busy M430～M433を開始時にラッチし、復帰完了まで保持する。

## 8. 停止・異常時

通常停止や異常で自動進行を止める場合、サブステップを無条件で消去しない。

- 現在サブステップを保持
- 出力要求は共通停止ポリシーに従う
- 復帰時にセンサとサブステップの整合を確認
- 不整合なら手動復旧へ

RESETだけで次サブステップへ送らない。

## 9. タイムアウト連携

搬送タイムアウト：

- T1：M701
- T2：M702
- T3：M703
- T4：M704

ストッパー異常：

- T1/ST01：M711
- T2/ST02：M712
- T3/ST03：M713
- T4/ST04：M714

## 10. GX Works3コメント登録

M440～M476は本ファイルのコメントを正式基準とし、`gxworks3-device-comment-master.md` 次回更新時に反映する。
