# 01 Drilling Line — GX Works3 Section 09 MANUAL シミュレーション試験ケース

Status: Draft / 教材・シミュレーション基準

## 1. 目的

`gxworks3-manual-network-template-spec.md` の代表5パターンを、GX Works3シミュレーションで確認するための試験ケースへ落とす。

GOT要求 → MANUAL要求 → COMMON要求 → 実Y → FB のどこで止まるかを段階的に確認する。

安全機能そのものの動作試験やバイパス試験を通常PLCシミュレーションで代替しない。

## 2. 共通事前条件

通常手動試験の基準状態：

- M300 = ON
- M305 = OFF
- M324 = OFF
- M110/M112/M113/M114/M115 = ON
- 対象機器の相反要求 = OFF
- 対象軸の異常 = OFF

各試験で意図的に条件を崩す場合は、その項目だけ変更する。

## 3. CV01 JOG

### TC-M01 正常

入力：

- M900 ON
- M117 OFF
- M430 OFF
- M431 OFF

期待：

- M830 ON
- M860 ON（Section 10条件成立時）
- Y0 ON（Section 11条件成立時）

### TC-M02 手動モード未成立

- M900 ON
- M300 OFF

期待：

- M830 OFF
- M940 ON
- Y0 OFF

### TC-M03 搬送先在荷

- M900 ON
- M117 ON

期待：

- M830 OFF
- M945 ON
- Y0 OFF

### TC-M04 隣接搬送Busy

- M900 ON
- M431 ON

期待：

- M830 OFF
- M944 ON
- Y0 OFF

## 4. ST01 UP / DOWN

### TC-M10 UP正常

- M904 ON
- M905 OFF
- ST01_UP_MACHINE_PERMIT成立

期待：M834 ON → M864 ON → Y4 ON。

### TC-M11 DOWN正常

- M905 ON
- M904 OFF
- ST01_DOWN_MACHINE_PERMIT成立

期待：M835 ON → M865 ON → Y5 ON。

### TC-M12 相反要求

- M904 ON
- M905 ON

期待：

- M943 ON
- M834 OFF
- M835 OFF
- Y4/Y5同時ONなし

### TC-M13 FB矛盾

- M126 ON
- M127 ON

期待：正常完了表示として扱わない。ストッパー異常監視側の対象条件として確認する。

## 5. CY04 RELEASE / CLAMP

### TC-M20 CLAMP正常

- M987 ON
- M986 OFF
- M141 ON
- M147 ON
- CY04_CLAMP_MACHINE_PERMIT成立

期待：M851 ON → M881 ON → Y25 ON。

### TC-M21 ワークなし

- M987 ON
- M141 OFF

期待：

- M851 OFF
- M952 ON
- Y25 OFF

### TC-M22 位置決め未成立

- M987 ON
- M147 OFF

期待：

- M851 OFF
- M949 ON
- Y25 OFF

### TC-M23 相反要求

- M986/M987 同時ON

期待：

- M943 ON
- M850/M851ともOFF
- Y24/Y25同時ONなし

## 6. CY05 UP / DOWN

### TC-M30 DOWN正常

- M989 ON
- M988 OFF
- M141 ON
- M147 ON
- M151 ON
- M166 ON
- M167 OFF
- CY05_DOWN_MACHINE_PERMIT成立

期待：M853 ON → M883 ON → Y27 ON。

### TC-M31 クランプ未成立

- M989 ON
- M151 OFF

期待：

- M853 OFF
- M950 ON
- Y27 OFF

### TC-M32 主軸未確認

- M989 ON
- M166 OFF

期待：

- M853 OFF
- M953 ON
- Y27 OFF

### TC-M33 主軸異常

- M989 ON
- M167 ON

期待：

- M853 OFF
- M953 ON
- Y27 OFF

### TC-M34 UP正常

- M988 ON
- M989 OFF
- CY05_UP_MACHINE_PERMIT成立

期待：M852 ON → M882 ON → Y26 ON。

## 7. 主軸 RUN

### TC-M40 正常

- M990 ON
- M141 ON
- M147 ON
- M151 ON
- M152 ON
- M167 OFF
- SPINDLE_MACHINE_PERMIT成立

期待：M854 ON → M884 ON → Y30 ON。

### TC-M41 ワークなし

- M990 ON
- M141 OFF

期待：

- M854 OFF
- M952 ON
- Y30 OFF

### TC-M42 クランプ未成立

- M990 ON
- M151 OFF

期待：M854 OFF、工程干渉/位置不足理由を表示、Y30 OFF。

### TC-M43 主軸異常

- M990 ON
- M167 ON

期待：

- M854 OFF
- M953 ON
- Y30 OFF

### TC-M44 RUN FB未成立

- 許可条件成立
- M990 ON
- Y30 ON
- M166 OFF

期待：

- MANUAL要求経路は成立済み
- RUN FB未成立として診断可能
- 所定監視時間超過時は主軸異常監視A410側で処理

## 8. 共通禁止試験

### TC-M50 自動運転中

任意のGOT要求ON + M305 ON。

期待：通常手動MANUAL要求OFF、実Yへ手動経路から出ない。

### TC-M51 異常中

任意のGOT要求ON + M324 ON。

期待：

- 対応MANUAL要求OFF
- M942 ON

### TC-M52 安全監視未成立表示

任意のGOT要求ON + M113 OFF等。

期待：

- 対応MANUAL要求OFF
- M941 ON

この試験は通常PLCの監視・操作禁止表示の確認であり、安全機能本体の性能試験ではない。

## 9. 診断チェーン合格条件

各試験で、次のどこまで成立したかを記録する。

```text
GOT req
→ MANUAL
→ COMMON
→ Y
→ FB
```

BLOCK発生時は、最低1つの該当M940～M955がONして理由を説明できること。

GOT要求だけONなのにYがONしない場合、故障と決めつけず段階ごとに確認できることを合格条件とする。

## 10. 回帰試験

Section 09変更後は最低限、

- 相反Y同時ONなし
- 自動運転中の手動割込みなし
- RESET操作から手動要求が勝手に成立しない
- 画面切替で要求が残留しない
- M940～M955が常時NG表示にならず、要求時のBLOCK理由として働く

を再確認する。
