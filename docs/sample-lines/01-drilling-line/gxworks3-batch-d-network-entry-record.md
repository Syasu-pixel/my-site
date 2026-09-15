# 01 Drilling Line — GX Works3 Batch D Section 09～11 ネットワーク入力実績記録

Status: Active / 教材・シミュレーション入力管理用

## 1. 目的

Batch D（Section 09 MANUAL / Section 10 OUTPUT_REQUEST / Section 11 ACTUAL_OUTPUT）をGX Works3へ入力する際、GOT要求からMANUAL要求、COMMON要求、実Y、FBまでをネットワーク単位で記録する。

本資料は実績記録用であり、設計済みであってもGX Works3実プロジェクトで未確認の項目を `DONE` / `PASS` にしない。

安全機能そのものを通常PLC/GOTで成立させない。GOTからYへ直接書き込まず、必ず MANUAL → COMMON → ACTUAL_OUTPUT の経路を通す。

## 2. 記録記号

- `[ ] COMMENT`：デバイス/ネットワークコメント登録確認
- `[ ] LADDER`：GX Works3ラダー入力確認
- `[ ] SIM`：GX Works3シミュレーション確認
- `BLOCKED-TBD`：未確定仕様のため、その部分だけ保留

## 3. Section 09 — MANUAL

### 09-00 共通手動許可

基準：

```text
M300
AND NOT M305
AND NOT M324
AND M110
AND M112
AND M113
AND M114
AND M115
```

記録：

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M300 OFFで全MANUAL要求OFF
- [ ] SIM M305 ONで全MANUAL要求OFF
- [ ] SIM M324 ONで全MANUAL要求OFF
- [ ] SIM 安全監視1点NGで通常手動要求OFF

### 09-01～09-04 CV01～CV04

| Network | GOT req | MANUAL | COMMON | Y | 主な条件 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|---|---|---|
| 09-01 | M900 | M830 | M860 | Y0 | T1/T2 busyなし、CV02空き | [ ] | [ ] | [ ] |
| 09-02 | M901 | M831 | M861 | Y1 | T1/T2/T3 busyなし、CV03空き | [ ] | [ ] | [ ] |
| 09-03 | M902 | M832 | M862 | Y2 | T2/T3/T4 busyなし、CV04空き | [ ] | [ ] | [ ] |
| 09-04 | M903 | M833 | M863 | Y3 | T3/T4 busyなし、加工ST条件成立 | [ ] | [ ] | [ ] |

CV04注意：

- M330はAUTO専用の加工ST受入許可として扱い、手動JOGの許可判定へそのまま流用しない。
- `CV04_MANUAL_MACHINE_PERMIT` / `MANUAL_STATION_ACCEPT_OK` は手動復旧用の通常制御条件として扱う。
- 未確定の加工ST側搬送Y/Mを追加しない。

追加SIM：

- [ ] 搬送先在荷で対象CV JOGがBLOCK
- [ ] 隣接transfer busyで対象CV JOGがBLOCK
- [ ] CV04手動JOGでAUTO T4 M433をSETしない
- [ ] CV04加工ST条件不成立時M833 OFF

### 09-10～09-19 ST01～ST05

| Network | GOT UP/DOWN | MANUAL UP/DOWN | COMMON | Y | FB | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|---|---|---|
| 09-10 | M904/M905 | M834/M835 | M864/M865 | Y4/Y5 | M126/M127 | [ ] | [ ] | [ ] |
| 09-12 | M906/M907 | M836/M837 | M866/M867 | Y6/Y7 | M130/M131 | [ ] | [ ] | [ ] |
| 09-14 | M908/M909 | M838/M839 | M868/M869 | Y10/Y11 | M132/M133 | [ ] | [ ] | [ ] |
| 09-16 | M910/M911 | M840/M841 | M870/M871 | Y12/Y13 | M134/M135 | [ ] | [ ] | [ ] |
| 09-18 | M912/M913 | M842/M843 | M872/M873 | Y14/Y15 | M136/M137 | [ ] | [ ] | [ ] |

共通確認：

- [ ] UP/DOWN同時GOT要求時、両MANUAL要求OFF
- [ ] 相反要求M943表示へつながる
- [ ] Section 10でも相反COMMON同時成立なし
- [ ] Section 11でも相反Y同時ONなし

ST05追加確認：

- [ ] 加工ST内ワーク位置と矛盾する要求をBLOCK
- [ ] M154搬出満杯が搬出方向手動操作のBLOCK理由になることを確認

### 09-20～09-29 CY01～CY05

| Network | GOT A/B | MANUAL A/B | COMMON | Y | FB | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|---|---|---|
| 09-20 | M980/M981 | M844/M845 | M874/M875 | Y16/Y17 | M142/M143 | [ ] | [ ] | [ ] |
| 09-22 | M982/M983 | M846/M847 | M876/M877 | Y20/Y21 | M144/M145 | [ ] | [ ] | [ ] |
| 09-24 | M984/M985 | M848/M849 | M878/M879 | Y22/Y23 | M146/M147 | [ ] | [ ] | [ ] |
| 09-26 | M986/M987 | M850/M851 | M880/M881 | Y24/Y25 | M150/M151 | [ ] | [ ] | [ ] |
| 09-28 | M988/M989 | M852/M853 | M882/M883 | Y26/Y27 | M152/M153 | [ ] | [ ] | [ ] |

必須位置条件：

- CY03 POSITION：M141在荷確認
- CY04 CLAMP：M141 + M147
- CY05 DOWN：M141 + M147 + M151 + M166 + NOT M167

記録：

- [ ] 各CY相反GOT要求で両MANUAL要求OFF
- [ ] CY03位置決めがM141なしで通らない
- [ ] CY04 CLAMPがM141/M147不足で通らない
- [ ] CY05 DOWNがM141/M147/M151/M166不足で通らない
- [ ] CY05 DOWNがM167 ONで通らない

### 09-30 主軸手動

経路：

```text
M990
→ M854
→ M884
→ Y30
→ M166/M167
```

必要条件：

```text
MANUAL_COMMON_OK
AND M141
AND M147
AND M151
AND M152
AND NOT M167
AND SPINDLE_MACHINE_PERMIT
```

記録：

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 条件成立でM854→M884→Y30
- [ ] SIM M167 ONで主軸要求OFF
- [ ] SIM 位置/クランプ条件不足で主軸要求OFF
- [ ] M166はRUN FBでありゼロ速度入力ではないことを維持

## 4. Section 10 — OUTPUT_REQUEST

### 10-01～10-04 CV COMMON

```text
M800/M830 -> M860 -> Y0
M801/M831 -> M861 -> Y1
M802/M832 -> M862 -> Y2
M803/M833 -> M863 -> Y3
```

記録：

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM AUTO要求のみでCOMMON成立
- [ ] SIM MANUAL要求のみでCOMMON成立
- [ ] SIM OUTPUT_PERMIT不成立でCOMMON OFF

### 10-10～10-19 ST COMMON相反排他

対象：M864～M873。

共通形：

```text
(AUTO_UP OR MANUAL_UP)
AND NOT (AUTO_DOWN OR MANUAL_DOWN)
AND *_OUTPUT_PERMIT
→ COMMON_UP

(AUTO_DOWN OR MANUAL_DOWN)
AND NOT (AUTO_UP OR MANUAL_UP)
AND *_OUTPUT_PERMIT
→ COMMON_DOWN
```

記録：

- [ ] ST01～ST05全ペア入力
- [ ] AUTO/MANUAL混在相反時も両COMMON OFF
- [ ] 各OUTPUT_PERMIT未確定条件を架空で埋めていない

### 10-20～10-29 CY COMMON相反排他

対象：M874～M883。

記録：

- [ ] CY01～CY05全ペア入力
- [ ] AUTO/MANUAL混在相反時も両COMMON OFF
- [ ] OUTPUT_PERMITが最終確定前の箇所をBLOCKED-TBDとして記録

### 10-30 主軸 COMMON

```text
(M824 OR M854)
AND SPINDLE_OUTPUT_PERMIT
AND NOT M167
→ M884
```

記録：

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM AUTOからM884成立
- [ ] SIM MANUALからM884成立
- [ ] SIM M167 ONでM884 OFF

### 10-40 表示・報知COMMON

```text
M323 -> M890 -> Y31
M305 -> M891 -> Y32
M324 -> M892 -> Y33
M326 AND NOT M327 -> M893 -> Y34
```

記録：

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M890～M893が各表示/ブザー要求へ一対一

## 5. Section 11 — ACTUAL_OUTPUT

### 11-01 CV出力

```text
M860 -> Y0
M861 -> Y1
M862 -> Y2
M863 -> Y3
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM

### 11-10～11-19 ST出力最終排他

```text
M864 AND NOT M865 -> Y4
M865 AND NOT M864 -> Y5
...
M872 AND NOT M873 -> Y14
M873 AND NOT M872 -> Y15
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 全ST相反COMMON同時ON時に両Y OFF

### 11-20～11-29 CY出力最終排他

```text
M874 AND NOT M875 -> Y16
M875 AND NOT M874 -> Y17
...
M882 AND NOT M883 -> Y26
M883 AND NOT M882 -> Y27
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 全CY相反COMMON同時ON時に両Y OFF

### 11-30 主軸出力

```text
M884 -> Y30
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM

### 11-40 表示灯 / ブザー

```text
M890 -> Y31
M891 -> Y32
M892 -> Y33
M893 -> Y34
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM ブザー停止でY34のみOFF
- [ ] SIM ブザー停止でM324/M700帯は変化しない

## 6. 二重コイル監査

実GX Works3入力後に必ず確認する。

- [ ] Y0～Y34はSection 11以外でコイル駆動していない
- [ ] 同一M830～M854を複数ネットワークで二重コイルにしていない
- [ ] 同一M860～M893を複数箇所で競合駆動していない
- [ ] GOTからYへ直接書込設定がない
- [ ] Y35～Y37はSPAREのまま

## 7. Batch D シミュレーションケース

| ID | 試験 | 期待結果 | 実績 |
|---|---|---|---|
| D-SIM-01 | M300 OFFでCV手動要求 | MANUAL req OFF | [ ] |
| D-SIM-02 | M305 ONで手動要求 | MANUAL req OFF | [ ] |
| D-SIM-03 | M324 ONで手動要求 | MANUAL req OFF | [ ] |
| D-SIM-04 | CV01正常JOG | M900→M830→M860→Y0 | [ ] |
| D-SIM-05 | CV02搬送先在荷 | M831 OFF / BLOCK表示 | [ ] |
| D-SIM-06 | CV04加工ST条件NG | M833 OFF / M946等表示 | [ ] |
| D-SIM-07 | ST01 UP/DOWN同時要求 | Y4/Y5両OFF | [ ] |
| D-SIM-08 | ST05相反要求 | Y14/Y15両OFF | [ ] |
| D-SIM-09 | CY01相反要求 | Y16/Y17両OFF | [ ] |
| D-SIM-10 | CY04 CLAMP位置不足 | M851 OFF | [ ] |
| D-SIM-11 | CY05 DOWN主軸FB不足 | M853 OFF | [ ] |
| D-SIM-12 | CY05 DOWN主軸異常 | M853 OFF | [ ] |
| D-SIM-13 | 主軸手動正常 | M990→M854→M884→Y30 | [ ] |
| D-SIM-14 | 主軸異常M167 ON | M854/M884/Y30 OFF | [ ] |
| D-SIM-15 | AUTO/MANUAL相反混在 | 対象COMMON両側OFF | [ ] |
| D-SIM-16 | COMMON相反同時ONを強制 | 対象Y両側OFF | [ ] |
| D-SIM-17 | ブザー消音 | Y34のみ停止、Alarm保持 | [ ] |
| D-SIM-18 | 画面切替後GOT要求残留確認 | M900～913/M980～990残留なし | [ ] |
| D-SIM-19 | GOT→Y直書き監査 | 直接経路なし | [ ] |
| D-SIM-20 | Y二重コイル監査 | なし | [ ] |

## 8. BLOCKED-TBD

以下は正式確定前に仮実装しない。

- 各 `*_MACHINE_PERMIT` の最終条件
- 各 `*_OUTPUT_PERMIT` の最終条件
- ダブルソレノイドの保持/パルス方式
- T4加工ST側搬送機構の正式出力
- M515搬出の正式駆動方式
- 主軸停止完了/ゼロ速度の正式確認方式

TBDは「未完成」ではなく、既存I/O・機械条件・メーカー仕様を確認してから正式化する境界として管理する。

## 9. Batch D 合格条件

Batch Dを `SIM PASS` とするには最低限、

1. 全GOT手動要求が共通許可を通る。
2. GOT→MANUAL→COMMON→Y→FBの診断経路を全対象で追跡できる。
3. ST/CY相反ペアで同時Y ONが発生しない。
4. AUTO/MANUAL混在でも最終排他が成立する。
5. 主軸・CY05下降の前提条件が不足した状態で危険側要求が成立しない。
6. Y二重コイルがない。
7. GOTからYへ直接書き込まない。
8. 未確定条件を架空I/Oや未登録Mで埋めていない。

を実GX Works3シミュレーションで確認する。

現時点の状態は `DESIGN READY / COMMENT PENDING / LADDER PENDING / SIM PENDING` とする。
