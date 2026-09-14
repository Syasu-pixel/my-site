# 01 Drilling Line — GX Works3 Batch C / Section 08 PROCESS_AUTO チェックシート

Status: Draft / 教材・シミュレーション実装チェック用

## 1. 目的

Section 08 `PROCESS_AUTO` の M500～M517 をGX Works3へ実装する際に、各項目を

- COMMENT：デバイスコメント/名称確認
- LADDER：ラダー入力確認
- SIM：GX Works3シミュレーション確認

の3段階で記録できるようにする。

本チェックシートは教材・シミュレーション用。安全機能そのものは通常PLCロジックで成立させない。

記入例：`[ ] COMMENT  [ ] LADDER  [ ] SIM`

## 2. 共通前提

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500～M517の名称がデバイスコメントマスターと一致
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 正常時はM500～M517がone-hot
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 自動進行はM305 ON / M321 ON / M324 OFFを前提
- [ ] COMMENT  [ ] LADDER  [ ] SIM — FB成立前に次ステップへ進まない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 時間だけで機構ステップを飛ばさない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — RESETだけで次ステップへ進まない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 通常停止M305 OFFで現在ステップを無条件初期化しない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — Section 08からYを直接駆動しない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — AUTO要求はM812～M824のみ使用

## 3. M500 WAIT

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500でST05 UP要求 M812
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500でCY01 HOME M814
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500でCY02 BACK M816
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500でCY03 RELEASE M818
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500でCY04 RELEASE M820
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500でCY05 UP M822
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500ではM824主軸RUNを生成しない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M140/M136/M142/M144/M146/M150/M152成立後のみM501へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M167主軸異常中はM501へ進まない

## 4. M501 INFEED

- [ ] COMMENT  [ ] LADDER  [ ] SIM — T4責任移管後の加工ST受入状態を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M140在荷ONを確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M433 T4 Busy解除後にM502へ進む
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M501で不要な新規機械動作を生成しない

## 5. M502 ST05 STOP

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M812 ST05 UP要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M136上昇端確認後のみM503へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — ST05未成立時はM715監視対象

## 6. M503 SURFACE SWITCH

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M815 CY01加工側要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M143加工側端確認後のみM504へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — CY01未成立時はM721監視対象

## 7. M504 LATERAL IN

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M817 CY02前進要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M145前進端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M141治具位置在荷を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M145 AND M141成立後のみM505へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — CY02未成立はM722監視対象
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 治具在荷未成立はM730監視候補

## 8. M505 POSITION

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M819 CY03位置決め要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M147位置決め端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M141在荷が継続していることを確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M147成立後のみM506へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — CY03未成立はM723監視対象

## 9. M506 CLAMP

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M821 CY04クランプ要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M151クランプ端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M147位置決め端継続
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M141在荷継続
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 完了後のみM507へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — CY04未成立はM724監視対象

## 10. M507 SPINDLE PREP

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M141/M147/M151/M152成立時のみM824主軸RUN要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M167 ONならM824を生成しない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M166 RUN FB成立前にM508へ進まない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — RUN要求後M166未成立はM750監視対象
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M166 OFFをゼロ速度確認として扱わない

## 11. M508 DRILL

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M824主軸RUN継続
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M823 CY05下降要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M166/M151/M147/M141条件を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M153下降端成立前にD112滞留監視を開始しない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M153成立後にのみ加工滞留を開始
- [ ] COMMENT  [ ] LADDER  [ ] SIM — D112完了後のみM509へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — CY05下降未成立はM725監視対象
- [ ] COMMENT  [ ] LADDER  [ ] SIM — D112の実時間単位は未確定のまま明示

## 12. M509 DRILL RETURN

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M822 CY05上昇要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M152成立まではM824主軸RUN継続
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M152成立後にM824要求を解除
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M152成立後のみM510へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — CY05上昇未成立はM726監視対象
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 主軸停止完了を架空のI/Oで作らない

## 13. M510 UNCLAMP

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M820 CY04解除要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M150解除端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M152上昇端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 完了後のみM511へ

## 14. M511 POSITION RELEASE

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M818 CY03解除要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M146解除端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M150/M152状態を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 完了後のみM512へ

## 15. M512 LATERAL RETURN

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M816 CY02後退要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M144後退端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M146/M150/M152状態を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 完了後のみM513へ

## 16. M513 SURFACE RESTORE

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M814 CY01搬送面復帰要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M142復帰端を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M144/M146/M150/M152成立を確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 完了後のみM514へ

## 17. M514 DISCHARGE PREP

- [ ] COMMENT  [ ] LADDER  [ ] SIM — CY01/CY02/CY03/CY04/CY05を基準位置側へ保持
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M154搬出満杯ON時はM514で待機
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 搬出満杯はM324故障へ入れない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M154 OFFかつ基準位置成立後のみM515へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M770生成の正本はSection 13側

## 18. M515 DISCHARGE

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M813 ST05 DOWN要求
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M208 SEEN → M209 COMPLETEを排出通過判定に使用
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M209成立前にM516へ進まない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 未確定の搬出モータY/Mを追加していない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M515専用timeout Alarmは未割付のまま

## 19. M516 DISCHARGE CHECK

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M209排出COMPLETEを確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M140加工ST搬送位置在荷OFFを確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M141加工治具在荷OFFを確認
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 搬出完了条件成立後のみM517へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — ST05復帰要求との整合を確認

## 20. M517 CYCLE COMPLETE

- [ ] COMMENT  [ ] LADDER  [ ] SIM — サイクル完了イベントを1回だけ生成
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 生産実績Section 15へ完了イベントを渡せる構造
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 基準位置確認後にM500へ戻る
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M517保持中の多重カウントを防止

## 21. 異常・停止・復旧

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M324成立時に新規正常遷移を停止
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 通常停止で現在ステップ保持
- [ ] COMMENT  [ ] LADDER  [ ] SIM — RESETで一律M500へ戻さない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — FBと現在ステップが矛盾した場合は手動復旧へ
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 主軸異常M167中に加工進行しない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — 搬出満杯は故障でなく待ち

## 22. one-hot / 出力監査

- [ ] COMMENT  [ ] LADDER  [ ] SIM — M500～M517が複数同時成立しない
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M812/M813相反同時要求なし
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M814/M815相反同時要求なし
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M816/M817相反同時要求なし
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M818/M819相反同時要求なし
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M820/M821相反同時要求なし
- [ ] COMMENT  [ ] LADDER  [ ] SIM — M822/M823相反同時要求なし
- [ ] COMMENT  [ ] LADDER  [ ] SIM — YはSection 11のみで駆動

## 23. Batch C 合格条件

Batch Cを「SIM完了」とする最低条件：

1. M500→M517が正常順序で1サイクル完走する。
2. 各FBを意図的に与えない場合、そのステップで停止する。
3. M507でM166なしにM508へ進まない。
4. M508はM153成立後にのみ滞留時間へ進む。
5. M154搬出満杯中はM514で正常待機する。
6. M209なしに排出完了扱いしない。
7. 通常停止後、ステップを保持して再開確認できる。
8. RESETだけでM500へ戻らない。
9. M167主軸異常中に主軸系工程を継続しない。
10. one-hotと相反AUTO要求が破綻しない。

## 24. 未確定のまま維持する項目

- M515正式搬出駆動
- M515専用timeout Alarm
- 主軸停止完了 / ゼロ速度方式
- D112正式時間単位
- double-solenoid保持/パルス方式

これらは未確定のままシミュレーション境界として記録し、架空I/Oや未登録M/Dで埋めない。
