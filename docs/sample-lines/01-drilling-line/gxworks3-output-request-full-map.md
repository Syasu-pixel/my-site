# 01 Drilling Line — GX Works3 Section 10 OUTPUT_REQUEST 完全マップ

Status: Draft / 教材・シミュレーション実装直前基準

## 1. 目的

Section 10 `OUTPUT_REQUEST` を、AUTO要求 M800帯とMANUAL要求 M830帯からCOMMON要求 M860帯へ集約する全点マップとして固定する。

本仕様は教材・シミュレーション用の通常PLCロジックであり、安全機能そのものを通常PLCの出力許可で代替しない。

## 2. 基本原則

- AUTO / MANUALのどちらから来ても最終経路はCOMMONへ一本化する。
- 実YはSection 10では駆動しない。
- 相反ペアはSection 10で排他する。
- AUTOとMANUALが同時に成立しない設計を上位でも維持する。
- 異常や通常制御インターロックは各COMMON要求生成条件で確認する。
- 安全機能は別系統。通常PLC側では安全監視状態を通常運転許可として扱うだけにする。

基本形：

```text
(AUTO_REQ OR MANUAL_REQ)
AND OUTPUT_PERMIT
AND NOT OPPOSITE_REQ
----------------------------------( COMMON_REQ )
```

## 3. CV01～CV04

| 機器 | AUTO | MANUAL | COMMON | 実Y |
|---|---|---|---|---|
| CV01 | M800 | M830 | M860 | Y0 |
| CV02 | M801 | M831 | M861 | Y1 |
| CV03 | M802 | M832 | M862 | Y2 |
| CV04 | M803 | M833 | M863 | Y3 |

擬似ラダー：

```text
(M800 OR M830) AND CV01_OUTPUT_PERMIT ----( M860 )
(M801 OR M831) AND CV02_OUTPUT_PERMIT ----( M861 )
(M802 OR M832) AND CV03_OUTPUT_PERMIT ----( M862 )
(M803 OR M833) AND CV04_OUTPUT_PERMIT ----( M863 )
```

各 `CVxx_OUTPUT_PERMIT` は通常制御上の運転許可・区間干渉・異常状態を確認する。GOT要求だけでは成立させない。

## 4. ST01～ST05

### ST01

```text
(M804 OR M834)
AND NOT (M805 OR M835)
AND ST01_UP_OUTPUT_PERMIT
----------------------------------( M864 )

(M805 OR M835)
AND NOT (M804 OR M834)
AND ST01_DOWN_OUTPUT_PERMIT
----------------------------------( M865 )
```

### ST02

```text
(M806 OR M836)
AND NOT (M807 OR M837)
AND ST02_UP_OUTPUT_PERMIT
----------------------------------( M866 )

(M807 OR M837)
AND NOT (M806 OR M836)
AND ST02_DOWN_OUTPUT_PERMIT
----------------------------------( M867 )
```

### ST03

```text
(M808 OR M838)
AND NOT (M809 OR M839)
AND ST03_UP_OUTPUT_PERMIT
----------------------------------( M868 )

(M809 OR M839)
AND NOT (M808 OR M838)
AND ST03_DOWN_OUTPUT_PERMIT
----------------------------------( M869 )
```

### ST04

```text
(M810 OR M840)
AND NOT (M811 OR M841)
AND ST04_UP_OUTPUT_PERMIT
----------------------------------( M870 )

(M811 OR M841)
AND NOT (M810 OR M840)
AND ST04_DOWN_OUTPUT_PERMIT
----------------------------------( M871 )
```

### ST05

```text
(M812 OR M842)
AND NOT (M813 OR M843)
AND ST05_UP_OUTPUT_PERMIT
----------------------------------( M872 )

(M813 OR M843)
AND NOT (M812 OR M842)
AND ST05_DOWN_OUTPUT_PERMIT
----------------------------------( M873 )
```

相反側要求が同時成立した場合、両COMMONをOFF側へ倒す。

## 5. CY01～CY05

### CY01

```text
(M814 OR M844)
AND NOT (M815 OR M845)
AND CY01_HOME_OUTPUT_PERMIT
----------------------------------( M874 )

(M815 OR M845)
AND NOT (M814 OR M844)
AND CY01_PROCESS_OUTPUT_PERMIT
----------------------------------( M875 )
```

### CY02

```text
(M816 OR M846)
AND NOT (M817 OR M847)
AND CY02_BACK_OUTPUT_PERMIT
----------------------------------( M876 )

(M817 OR M847)
AND NOT (M816 OR M846)
AND CY02_FWD_OUTPUT_PERMIT
----------------------------------( M877 )
```

### CY03

```text
(M818 OR M848)
AND NOT (M819 OR M849)
AND CY03_RELEASE_OUTPUT_PERMIT
----------------------------------( M878 )

(M819 OR M849)
AND NOT (M818 OR M848)
AND CY03_POSITION_OUTPUT_PERMIT
----------------------------------( M879 )
```

### CY04

```text
(M820 OR M850)
AND NOT (M821 OR M851)
AND CY04_RELEASE_OUTPUT_PERMIT
----------------------------------( M880 )

(M821 OR M851)
AND NOT (M820 OR M850)
AND CY04_CLAMP_OUTPUT_PERMIT
----------------------------------( M881 )
```

### CY05

```text
(M822 OR M852)
AND NOT (M823 OR M853)
AND CY05_UP_OUTPUT_PERMIT
----------------------------------( M882 )

(M823 OR M853)
AND NOT (M822 OR M852)
AND CY05_DOWN_OUTPUT_PERMIT
----------------------------------( M883 )
```

## 6. 主軸

```text
(M824 OR M854)
AND SPINDLE_OUTPUT_PERMIT
AND NOT M167
----------------------------------( M884 )
```

M166はRUN要求後の運転確認用であり、RUN出力生成そのものの自己保持条件にはしない。

専用ゼロ速度入力は現行I/Oにないため、架空信号を追加しない。

## 7. 表示・報知要求

表示灯・ブザーはAUTO/MANUAL要求とは分ける。

```text
M323 -----------------------------( M890 )  投入可表示要求
M305 -----------------------------( M891 )  運転表示要求
M324 -----------------------------( M892 )  異常表示要求
M326 AND NOT M327 ----------------( M893 )  ブザー要求
```

M893は音だけを扱い、アラーム保持の正本にしない。

## 8. 全点一覧

| COMMON | 元要求 | 機能 | Y |
|---|---|---|---|
| M860 | M800/M830 | CV01 RUN | Y0 |
| M861 | M801/M831 | CV02 RUN | Y1 |
| M862 | M802/M832 | CV03 RUN | Y2 |
| M863 | M803/M833 | CV04 RUN | Y3 |
| M864 | M804/M834 | ST01 UP | Y4 |
| M865 | M805/M835 | ST01 DOWN | Y5 |
| M866 | M806/M836 | ST02 UP | Y6 |
| M867 | M807/M837 | ST02 DOWN | Y7 |
| M868 | M808/M838 | ST03 UP | Y10 |
| M869 | M809/M839 | ST03 DOWN | Y11 |
| M870 | M810/M840 | ST04 UP | Y12 |
| M871 | M811/M841 | ST04 DOWN | Y13 |
| M872 | M812/M842 | ST05 UP | Y14 |
| M873 | M813/M843 | ST05 DOWN | Y15 |
| M874 | M814/M844 | CY01 HOME | Y16 |
| M875 | M815/M845 | CY01 PROCESS | Y17 |
| M876 | M816/M846 | CY02 BACK | Y20 |
| M877 | M817/M847 | CY02 FWD | Y21 |
| M878 | M818/M848 | CY03 RELEASE | Y22 |
| M879 | M819/M849 | CY03 POSITION | Y23 |
| M880 | M820/M850 | CY04 RELEASE | Y24 |
| M881 | M821/M851 | CY04 CLAMP | Y25 |
| M882 | M822/M852 | CY05 UP | Y26 |
| M883 | M823/M853 | CY05 DOWN | Y27 |
| M884 | M824/M854 | 主軸 RUN | Y30 |
| M890 | M323 | 投入可表示 | Y31 |
| M891 | M305 | 運転表示 | Y32 |
| M892 | M324 | 異常表示 | Y33 |
| M893 | M326/327 | ブザー | Y34 |

## 9. 診断ルール

GOT/G09/G03/G04では、

```text
AUTOまたはMANUAL要求
↓
COMMON要求
↓
実Y
↓
FB
```

を別々に表示する。

MANUAL要求がONでCOMMONがOFFならSection 10の許可/排他条件を確認する。

## 10. 未確定事項

- 各 `*_OUTPUT_PERMIT` の最終条件
- ダブルソレノイドの保持/パルス出力哲学
- T4加工ST側搬送機構の正式要求
- M515搬出時の正式駆動方式

未確定事項を架空I/Oで埋めない。
