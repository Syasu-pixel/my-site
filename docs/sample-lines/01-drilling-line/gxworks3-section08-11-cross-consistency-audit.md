# 01 Drilling Line — GX Works3 Section 08～11 横断整合監査

Status: Draft / 教材・シミュレーション実装直前基準

## 1. 目的

Section 08 `PROCESS_AUTO`、Section 09 `MANUAL`、Section 10 `OUTPUT_REQUEST`、Section 11 `ACTUAL_OUTPUT` を横断し、加工ステップから実Yまでの要求経路が一貫しているか確認する。

本監査は通常PLCの教材・シミュレーション用。安全機能は別系統で成立させ、通常PLC/GOTから安全機能を代替しない。

## 2. 正式な出力経路

加工系の正本は次の4段階。

```text
Section 08 AUTO要求 M812～M824
          ┐
          ├→ Section 10 COMMON M872～M884
          │
Section 09 MANUAL要求 M842～M854
          ↓
Section 11 ACTUAL Y14～Y30
          ↓
物理FB M136～M167
```

GOT要求M900帯/M980帯からYへ直接接続しない。

## 3. ST05 横断確認

| 方向 | AUTO | MANUAL | COMMON | Y | FB |
|---|---|---|---|---|---|
| UP | M812 | M842 | M872 | Y14 | M136 |
| DOWN | M813 | M843 | M873 | Y15 | M137 |

Section 08使用：

- M500 WAIT：UP
- M502 ST05 STOP：UP
- M515 DISCHARGE：DOWN
- M517 CYCLE COMPLETE：UP

整合判定：OK。

注意：M515の正式な搬出駆動方式は未確定。ST05開放だけで「搬出駆動すべてが確定」と扱わない。

## 4. CY01 横断確認

| 方向 | AUTO | MANUAL | COMMON | Y | FB |
|---|---|---|---|---|---|
| HOME | M814 | M844 | M874 | Y16 | M142 |
| PROCESS | M815 | M845 | M875 | Y17 | M143 |

Section 08使用：

- M500：HOME
- M503：PROCESS
- M513：HOME
- M514：HOME保持候補

整合判定：OK。

## 5. CY02 横断確認

| 方向 | AUTO | MANUAL | COMMON | Y | FB |
|---|---|---|---|---|---|
| BACK | M816 | M846 | M876 | Y20 | M144 |
| FWD | M817 | M847 | M877 | Y21 | M145 |

Section 08使用：

- M500：BACK
- M504：FWD
- M512：BACK
- M514：BACK保持候補

整合判定：OK。

## 6. CY03 横断確認

| 方向 | AUTO | MANUAL | COMMON | Y | FB |
|---|---|---|---|---|---|
| RELEASE | M818 | M848 | M878 | Y22 | M146 |
| POSITION | M819 | M849 | M879 | Y23 | M147 |

Section 08使用：

- M500：RELEASE
- M505：POSITION
- M511：RELEASE
- M514：RELEASE保持候補

整合判定：OK。

## 7. CY04 横断確認

| 方向 | AUTO | MANUAL | COMMON | Y | FB |
|---|---|---|---|---|---|
| RELEASE | M820 | M850 | M880 | Y24 | M150 |
| CLAMP | M821 | M851 | M881 | Y25 | M151 |

Section 08使用：

- M500：RELEASE
- M506：CLAMP
- M510：RELEASE
- M514：RELEASE保持候補

整合判定：OK。

## 8. CY05 横断確認

| 方向 | AUTO | MANUAL | COMMON | Y | FB |
|---|---|---|---|---|---|
| UP | M822 | M852 | M882 | Y26 | M152 |
| DOWN | M823 | M853 | M883 | Y27 | M153 |

Section 08使用：

- M500：UP
- M508：DOWN
- M509：UP
- M514：UP保持候補

整合判定：OK。

## 9. 主軸 横断確認

| AUTO | MANUAL | COMMON | Y | RUN FB | FAULT |
|---|---|---|---|---|---|
| M824 | M854 | M884 | Y30 | M166 | M167 |

Section 08使用：

- M507：RUN要求
- M508：RUN継続
- M509：M152成立までRUN継続
- M510以降：RUN要求なし

整合判定：OK。

M166はRUN要求前の許可ではなく、RUN要求後の確認として扱う。M166 OFFを専用ゼロ速度確認として扱わない。

## 10. 相反ペア監査

Section 10で次の相反排他が存在する。

- M872 / M873
- M874 / M875
- M876 / M877
- M878 / M879
- M880 / M881
- M882 / M883

Section 11でもY側で二重排他する。

```text
COMMON_A AND NOT COMMON_B → Y_A
COMMON_B AND NOT COMMON_A → Y_B
```

判定：二重防止構造として整合。

## 11. Section 08 one-hotとの関係

M500～M517は原則one-hot。

正常時は、同一機構に対して相反AUTO要求が同時生成されないことを前提とする。

例：

- M506 CLAMP中にM820 RELEASEを同時生成しない。
- M508 DRILL中にM822 UPを同時生成しない。
- M503 PROCESS中にM814 HOMEを同時生成しない。

Section 10/11の排他は上位ロジック不整合を隠すためではなく、最終防止層として使う。

## 12. AUTO / MANUAL競合

通常基準：

- M305 ON中は通常手動要求を通さない。
- M300手動モード成立時のみSection 09がMANUAL要求を生成する。
- AUTOとMANUALが同時成立しないことを上位条件で保証する。

それでも同一方向のAUTO/MANUALが同時成立した場合は、Section 10ではOR合流するため同一COMMON要求は成立可能。

反対方向のAUTO/MANUALが競合した場合は、相反排他によりCOMMONをOFF側へ倒す。

## 13. TIMEOUT_FAULTとの接続

Section 12はCOMMON要求または搬送サブステップを監視開始点とする。

加工系対応：

- M872/M873 → M136/M137 → M715
- M874/M875 → M142/M143 → M721
- M876/M877 → M144/M145 → M722
- M878/M879 → M146/M147 → M723
- M880/M881 → M150/M151 → M724
- M882 → M152 → M726
- M883 → M153 → M725
- M884 → M166/M167 → M750

判定：Section 08～12の監視チェーンは整合。

## 14. 現在のTBD

以下は意図的に未確定。

1. M515正式搬出駆動方式
2. M515専用タイムアウトアラーム
3. 主軸立上り監視専用D
4. ダブルソレノイド保持/パルス方式
5. 各 `*_OUTPUT_PERMIT` の最終機械条件
6. 主軸停止完了/ゼロ速度の正式確認方式

未確定項目を架空のY/M/Xで埋めない。

## 15. 実装判定

Section 08～11は、教材・GX Works3シミュレーション用として実装開始可能。

実装後は最低限、

- one-hot
- AUTO/MANUAL競合
- COMMON排他
- Y二重コイルなし
- 相反Y同時OFF
- RUN要求→FB→次STEP
- 異常時要求解除

をGX Works3シミュレーションで確認する。
