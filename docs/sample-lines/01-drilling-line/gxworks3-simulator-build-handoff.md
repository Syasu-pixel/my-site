# 01 Drilling Line — GX Works3 シミュレータ構築引継ぎ

Status: Draft / 教材・シミュレーション実装開始用

## 1. 目的

既存のSection 00～16仕様をGX Works3上の教材・シミュレーションプロジェクトへ順番に入力するため、実装を小さなバッチへ分割する。

危険な実機運転を目的とせず、まずソフトウェア上で状態遷移・インターロック・診断を確認する。

## 2. Build Batch A — 土台

対象：Section 00～03。

実装：

- X→M100帯の意味変換
- PBエッジ M180～M187
- passage M200～M209
- 安全監視表示 M760～M764
- M300/M301
- M320/M321/M322/M305
- M323/M330

合格：

- モードSW矛盾時にAUTO/MANUAL同時成立しない
- RESETで運転準備/自動運転が勝手に成立しない
- passage OFF単独でCOMPLETEにならない

## 3. Build Batch B — 搬送

対象：Section 04～07。

実装：

- M430～M433 Busy
- M440～M476 substep
- ST01～ST04 AUTO要求
- CV01～CV04 AUTO要求
- 隣接排他
- 非隣接T1+T3 / T2+T4

合格：

- T1～T4単独が状態順どおり進む
- adjacent transferが同時成立しない
- passage complete + source OFF + destination ONまで完了扱いしない
- normal stopでsubstepを無条件初期化しない

T4加工ST側搬送駆動はTBDのため、既存I/Oの範囲でシミュレーション境界を明示する。

## 4. Build Batch C — 加工工程

対象：Section 08。

実装：

- M500～M517
- M812～M824
- FBによる遷移
- M507主軸RUN確認
- M508下降端後の加工滞留
- M509復帰
- M514搬出待ち
- M515/M516排出検出

合格：

- one-hot維持
- フィードバックなしで次工程へ飛ばない
- M167成立時に主軸系工程を進めない
- 搬出満杯は故障ではなく待ち
- RESETで途中工程を勝手にM500へ戻さない

## 5. Build Batch D — Manual / Output

対象：Section 09～11。

実装：

- M900～M913 / M980～M990
- M830～M854
- M860～M884
- M890～M893
- Y0～Y34一元出力

合格：

- GOT要求からY直結なし
- AUTO/MANUAL→COMMON→Yを追跡可能
- ST/CY相反側同時要求で実Y両側OFF
- Y二重コイルなし
- Y35～Y37未使用

## 6. Build Batch E — Fault / Warning

対象：Section 12～13。

実装：

- M701～M750個別Alarm
- M324
- 原因復旧付きRESET
- M770～M775
- M325
- M326/M327
- M893/Y34

合格：

- timeout発生で自動進行停止
- 原因未復旧AlarmはRESETできない
- 複数Alarmの一部だけ復旧時、未復旧分を保持
- warningだけでM305を一律解除しない
- buzzer silenceでAlarmを解除しない

## 7. Build Batch F — GOT Interface

対象：Section 14。

実装：

- M920～M938
- M940～M955
- M960～M971
- D100/D101

合格：

- display helperが制御正本を逆駆動しない
- M938だけで権限成立としない
- ACK / RESET / BUZZER SILENCEを分離
- D101だけに同時搬送状態を依存しない

## 8. Build Batch G — Production / Maintenance

対象：Section 15～16。

実装：

- D200/D201
- D210～D213
- M774
- D300～D365

合格：

- PB押下だけで投入数を増やさない
- 1ワークで多重加算しない
- 品質判定なしでD202 OKを自動加算しない
- Alarmラッチ中に異常回数を毎scan増加させない
- 主軸運転時間はM166基準

## 9. 全体回帰試験

最終的に以下を連続確認する。

1. 起動前状態
2. 運転準備
3. 自動起動
4. ワーク投入
5. T1→T4搬送
6. M500→M517加工
7. 搬出完了
8. 次ワーク投入
9. normal stop / resume
10. timeout fault
11. manual recovery
12. reset後の非自動再始動
13. GOT手動block表示
14. warning / buzzer
15. production / maintenance count

## 10. 実装時に確定してはいけないTBD

- 主軸停止完了/ゼロ速度方式
- T4加工ST側正式搬送駆動
- M515正式搬出駆動
- M515専用timeout Alarm
- 各OUTPUT_PERMIT最終条件
- double-solenoid保持/パルス方式
- main circuit protection / conductor sizing / short-circuit design
- safety circuit final design

実機関連の最終値や安全・主回路仕様は、資格・責任を持つ設計者が最新メーカー資料、現地条件、リスクアセスメントを基に別途確定する。

## 11. 次作業

次はBatch AをさらにGX Works3入力用のチェックシートへ分解し、Section 00～03について「入力済み / コメント済み / シミュレーション済み」を記録できる形へする。
