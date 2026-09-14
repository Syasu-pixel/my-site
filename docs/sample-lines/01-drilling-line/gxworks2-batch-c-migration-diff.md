# 01 Drilling Line — GX Works2 Batch C 移行差分

Status: Active / FX3U + GX Works2 教材・シミュレーション移行用

## 1. 目的

既存の `gxworks3-section08-process-auto-network-implementation-order.md` を基準に、Section 08 `PROCESS_AUTO`（M500～M517）を GX Works2 / FX3U へ移植するときの差分だけを整理する。

既存の工程論理は破棄せず、GX Works2側で命令形式・タイマ・初期化・シミュレーション手順を確認してから実入力する。

## 2. そのまま維持する設計

次はGX Works2版でも原則維持する。

- 加工STEP：M500～M517
- 原則one-hot
- `現在STEP + 完了FB + 共通進行許可` でのみ次STEPへ進む
- 時間だけで機構を次工程へ進めない
- M305 OFF時は現在STEPを原則保持する
- RESETだけで次STEPへ進めない
- M324成立中は正常遷移を進めない
- AUTO要求はM812～M824へ生成し、Section 08からYを直接駆動しない
- 主軸RUN要求M824、RUN FB M166、FAULT M167
- 排出通過はM208 SEEN → M209 COMPLETE
- M154搬出満杯はFaultではなく待ち/Warning
- M166 OFFをゼロ速度確認とは扱わない
- M515の未確定搬出駆動を推測で追加しない
- M700帯へ未割付アラームを勝手に追加しない

共通進行概念は維持する。

```text
PROCESS_ADVANCE_OK = M305 AND M321 AND NOT M324
```

専用Mを新設する場合はデバイス正本へ正式登録してから使用する。

## 3. GX Works2 / FX3U側で再確認する差分

| 項目 | 既存設計 | GX Works2版での扱い |
|---|---|---|
| STEPデバイス | M500～M517 | 原則そのまま維持。FX3Uデバイス範囲と保持設定をプロジェクトで確認 |
| SET/RST | STEP遷移に使用 | GX Works2 / FX3Uで実入力可能な命令形式を確認 |
| one-hot監視 | 診断コード未割付 | 未割付M700帯へ追加しない。まずSIM監査項目として扱う |
| 初期M500 | initialization-condition候補 | GX Works2起動時・SIM開始時の初期化方式を確認してから正式化 |
| 加工滞留 | D112設定値を使用 | FX3Uでのタイマデバイス/時間基準との対応を正式化 |
| 主軸立上り監視 | M750、監視時間Dは未割付 | 新規Dを推測で使わない。正式割付後に実装 |
| M515搬出timeout | 未確定 | 未実装のまま `BLOCKED-TBD` |
| ゼロ速度 | 専用入力なし | M166 OFFで代用しない |
| ダブルソレノイド | 保持/パルス未確定 | Section 10/11の出力方式確定まで要求論理のみ移植 |
| SIM | GX Works3想定 | GX Simulator2で実結果を別記録 |

## 4. STEP別移行方針

### M500 WAIT

維持：

- M812 ST05 UP
- M814 CY01 HOME
- M816 CY02 BACK
- M818 CY03 RELEASE
- M820 CY04 RELEASE
- M822 CY05 UP
- M824は出さない

遷移条件も原則維持する。

```text
M500
AND PROCESS_ADVANCE_OK
AND M140
AND M136
AND M142 AND M144 AND M146 AND M150 AND M152
AND NOT M167
→ M501
```

GX Works2側確認：

- T4終了とM140成立の同一スキャン関係
- M500初期化方式

### M501 INFEED

維持：

```text
M501 AND PROCESS_ADVANCE_OK AND M140 AND NOT M433
→ M502
```

T4責任移管点はBatch Bと一致させる。

### M502 ST05 STOP

維持：M812要求、M136 FBでM503へ。

監視：M715。

### M503 SURFACE SWITCH

維持：M815要求、M143でM504へ。

監視：M721。

### M504 LATERAL IN

維持：M817要求、M145 + M141でM505へ。

監視：M722 / M730候補。

### M505 POSITION

維持：M819要求、M147 + M141でM506へ。

監視：M723。

### M506 CLAMP

維持：M821要求、M151 + M147 + M141でM507へ。

監視：M724。

### M507 SPINDLE PREP

維持：

```text
M507 AND M141 AND M147 AND M151 AND M152 AND NOT M167
→ M824
```

M166成立でM508へ。

GX Works2側TBD：主軸立上り監視用の正式時間デバイス。

### M508 DRILL

維持：

- 主軸M824継続
- CY05下降 M823
- M153成立後にだけ加工滞留開始
- 加工滞留完了後にM509へ

重要：D112は設定値/概念として維持できるが、GX Works2 / FX3Uのタイマ時間基準に合わせた実タイマ構成を別途確定する。

### M509 DRILL RETURN

維持：

- CY05上昇 M822
- M152成立まで主軸M824継続
- M152成立で主軸要求解除、M510へ

M166 OFFはゼロ速度確認ではない。

### M510 UNCLAMP

維持：M820要求、M150 + M152でM511へ。

### M511 POSITION RELEASE

維持：M818要求、M146 + M150 + M152でM512へ。

### M512 LATERAL RETURN

維持：M816要求、M144 + M146 + M150 + M152でM513へ。

### M513 SURFACE RESTORE

維持：M814要求、M142 + M144 + M146 + M150 + M152でM514へ。

### M514 DISCHARGE PREP

維持：

- 基準位置要求を保持
- M154搬出満杯中は待機
- M154をM324へ含めない
- M154 OFF + 基準位置成立でM515へ

### M515 DISCHARGE

維持：

- M813でST05開放
- M208 SEEN → M209 COMPLETEを排出通過確認に使用

BLOCKED-TBD：

- 加工ST側の正式搬出駆動方式
- M515専用timeout

存在しないY/Mを追加しない。

### M516 DISCHARGE CHECK

完了条件候補を維持する。

- M209 COMPLETE
- M140 OFF
- M141 OFF

成立後M517へ。

### M517 CYCLE COMPLETE

維持：

- 正常完了イベントをSection 15生産実績へ渡す
- 次サイクル待機M500へ戻す
- RESETや異常中断を正常完了カウントにしない

## 5. GX Works2実入力時の注意

1. M500～M517の各STEP SET/RSTを同一ネットワーク内で追える形にする。
2. 同じSTEPを複数箇所から直接SETしない。
3. STEP遷移条件に実FBを必ず含める。
4. M812～M824はAUTO要求でありYではない。
5. M324中はSTEPが勝手に進まないことを確認する。
6. 通常STOPでSTEPを全部M500へ戻さない。
7. RESETだけでM500初期化や次STEP遷移を行わない。
8. M154は待ち条件であってFaultにしない。
9. M209はSEEN後の立下りCOMPLETEであり、生OFFではない。
10. 未確定の搬出駆動・zero-speed・タイマ用Dを推測で埋めない。

## 6. GX Simulator2 試験候補

実シミュレーションを確認するまでは全件 `[ ]` とする。

- [ ] C-SIM-W2-01：M500基準出力要求が成立
- [ ] C-SIM-W2-02：M500で必要FB不足ならM501へ進まない
- [ ] C-SIM-W2-03：M500条件成立でM501へ1STEPだけ進む
- [ ] C-SIM-W2-04：M501中M433 ONならM502へ進まない
- [ ] C-SIM-W2-05：M502～M506で各完了FB不足時にSTEP保持
- [ ] C-SIM-W2-06：M507でM166成立前はM508へ進まない
- [ ] C-SIM-W2-07：M167成立中は主軸要求/正常遷移を許可しない
- [ ] C-SIM-W2-08：M508でM153成立前に加工滞留を開始しない
- [ ] C-SIM-W2-09：加工滞留完了後のみM509へ進む
- [ ] C-SIM-W2-10：M509でM152成立まで主軸要求が残る
- [ ] C-SIM-W2-11：M510～M513で復帰FB順序を確認
- [ ] C-SIM-W2-12：M514 + M154で待機しM324を立てない
- [ ] C-SIM-W2-13：M154解除後にM515へ進む
- [ ] C-SIM-W2-14：M515でM209なしではM516へ進まない
- [ ] C-SIM-W2-15：M208 ON→OFFでM209 COMPLETE生成後のみ進行
- [ ] C-SIM-W2-16：M516でM140/M141残存時はM517へ進まない
- [ ] C-SIM-W2-17：M517正常完了後にM500へ戻る
- [ ] C-SIM-W2-18：通常STOPで現在STEP保持
- [ ] C-SIM-W2-19：M324成立中にSTEP進行しない
- [ ] C-SIM-W2-20：RESETだけで次STEP/自動再始動しない
- [ ] C-SIM-W2-21：M500～M517複数同時成立を正常扱いしない
- [ ] C-SIM-W2-22：異常中断サイクルを正常完了イベントにしない

## 7. 完了判定

現時点：

- 設計論理移行：READY
- GX Works2ラダー実入力：PENDING
- GX Simulator2確認：PENDING
- M515搬出方式：BLOCKED-TBD
- 主軸zero-speed：BLOCKED-TBD
- 主軸立上り監視時間：BLOCKED-TBD
- D112実時間基準：PROJECT CHECK REQUIRED

したがって現在判定は、

**BATCH C LOGIC MIGRATION READY / GX WORKS2 INPUT PENDING / SIM PENDING**

とする。

安全機能・主回路・保護定格・実機動作確認は本教材ロジックとは別管理とする。