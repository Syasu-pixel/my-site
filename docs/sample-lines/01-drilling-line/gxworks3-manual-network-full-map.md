# 01 Drilling Line — GX Works3 Section 09 MANUAL 全点展開マップ

Status: Draft / 教材・シミュレーション実装直前基準

## 1. 目的

`gxworks3-manual-network-template-spec.md` の代表5パターンを、Section 09 MANUALの全手動要求へ展開する。

対象：

- CV01～CV04
- ST01～ST05
- CY01～CY05
- 主軸

本資料は通常制御・教材・シミュレーション用であり、安全機能そのものを通常PLC/GOTで代替しない。

## 2. 共通原則

すべての手動操作は次の経路を通す。

```text
GOT要求
→ Section 09 MANUAL
→ MANUAL要求 M830～M854
→ Section 10 OUTPUT_REQUEST
→ COMMON要求 M860～M884
→ Section 11 ACTUAL_OUTPUT
→ 実Y
→ FB
```

共通手動許可の基準：

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

個別動作ごとに機械干渉・相反・在荷・位置条件を追加する。

## 3. CV01～CV04

### 3.1 CV01

```text
M900
AND MANUAL_COMMON_OK
AND NOT M430
AND NOT M431
AND NOT M117
----------------------------------( M830 )
```

経路：M900 → M830 → M860 → Y0。

代表BLOCK：M940/M941/M942/M944/M945。

### 3.2 CV02

```text
M901
AND MANUAL_COMMON_OK
AND NOT M430
AND NOT M431
AND NOT M432
AND NOT M120
----------------------------------( M831 )
```

経路：M901 → M831 → M861 → Y1。

代表BLOCK：M940/M941/M942/M944/M945。

### 3.3 CV03

```text
M902
AND MANUAL_COMMON_OK
AND NOT M431
AND NOT M432
AND NOT M433
AND NOT M121
----------------------------------( M832 )
```

経路：M902 → M832 → M862 → Y2。

代表BLOCK：M940/M941/M942/M944/M945。

### 3.4 CV04

```text
M903
AND MANUAL_COMMON_OK
AND NOT M432
AND NOT M433
AND NOT M140
AND CV04_MANUAL_MACHINE_PERMIT
----------------------------------( M833 )
```

経路：M903 → M833 → M863 → Y3。

代表BLOCK：M940/M941/M942/M944/M945/M946/M955。

CV04 JOGは自動T4起動要求ではない。加工ST側への移送条件はM330そのものをそのまま流用せず、手動復旧用途に必要な通常制御条件を個別定義する。

## 4. ST01～ST05

全STはUP/DOWN相反要求を禁止する。

### ST01

```text
M904 AND NOT M905 AND MANUAL_COMMON_OK AND ST01_UP_MACHINE_PERMIT
----------------------------------( M834 )
M905 AND NOT M904 AND MANUAL_COMMON_OK AND ST01_DOWN_MACHINE_PERMIT
----------------------------------( M835 )
```

M904/M905 → M834/M835 → M864/M865 → Y4/Y5 → M126/M127。

### ST02

```text
M906 AND NOT M907 AND MANUAL_COMMON_OK AND ST02_UP_MACHINE_PERMIT
----------------------------------( M836 )
M907 AND NOT M906 AND MANUAL_COMMON_OK AND ST02_DOWN_MACHINE_PERMIT
----------------------------------( M837 )
```

M906/M907 → M836/M837 → M866/M867 → Y6/Y7 → M130/M131。

### ST03

```text
M908 AND NOT M909 AND MANUAL_COMMON_OK AND ST03_UP_MACHINE_PERMIT
----------------------------------( M838 )
M909 AND NOT M908 AND MANUAL_COMMON_OK AND ST03_DOWN_MACHINE_PERMIT
----------------------------------( M839 )
```

M908/M909 → M838/M839 → M868/M869 → Y10/Y11 → M132/M133。

### ST04

```text
M910 AND NOT M911 AND MANUAL_COMMON_OK AND ST04_UP_MACHINE_PERMIT
----------------------------------( M840 )
M911 AND NOT M910 AND MANUAL_COMMON_OK AND ST04_DOWN_MACHINE_PERMIT
----------------------------------( M841 )
```

M910/M911 → M840/M841 → M870/M871 → Y12/Y13 → M134/M135。

### ST05

```text
M912 AND NOT M913 AND MANUAL_COMMON_OK AND ST05_UP_MACHINE_PERMIT
----------------------------------( M842 )
M913 AND NOT M912 AND MANUAL_COMMON_OK AND ST05_DOWN_MACHINE_PERMIT
----------------------------------( M843 )
```

M912/M913 → M842/M843 → M872/M873 → Y14/Y15 → M136/M137。

ST05は加工ST内のワーク位置・搬出満杯M154・工程干渉を追加確認する。搬出満杯は故障ではないが、搬出方向の手動要求禁止理由M954として使用可能。

## 5. CY01～CY05

### 5.1 CY01 搬送面切替

```text
M980 AND NOT M981 AND MANUAL_COMMON_OK AND CY01_HOME_MACHINE_PERMIT
----------------------------------( M844 )
M981 AND NOT M980 AND MANUAL_COMMON_OK AND CY01_PROCESS_MACHINE_PERMIT
----------------------------------( M845 )
```

経路：M980/M981 → M844/M845 → M874/M875 → Y16/Y17 → M142/M143。

代表BLOCK：M940/M941/M942/M943/M948/M949/M950/M951/M955。

### 5.2 CY02 横移載

```text
M982 AND NOT M983 AND MANUAL_COMMON_OK AND CY02_BACK_MACHINE_PERMIT
----------------------------------( M846 )
M983 AND NOT M982 AND MANUAL_COMMON_OK AND CY02_FWD_MACHINE_PERMIT
----------------------------------( M847 )
```

経路：M982/M983 → M846/M847 → M876/M877 → Y20/Y21 → M144/M145。

代表BLOCK：M940/M941/M942/M943/M947/M949/M950/M951/M952/M955。

### 5.3 CY03 位置決め

```text
M984 AND NOT M985 AND MANUAL_COMMON_OK AND CY03_RELEASE_MACHINE_PERMIT
----------------------------------( M848 )
M985 AND NOT M984 AND MANUAL_COMMON_OK AND M141 AND CY03_POSITION_MACHINE_PERMIT
----------------------------------( M849 )
```

経路：M984/M985 → M848/M849 → M878/M879 → Y22/Y23 → M146/M147。

代表BLOCK：M940/M941/M942/M943/M948/M950/M951/M952/M955。

### 5.4 CY04 クランプ

```text
M986 AND NOT M987 AND MANUAL_COMMON_OK AND CY04_RELEASE_MACHINE_PERMIT
----------------------------------( M850 )
M987 AND NOT M986 AND MANUAL_COMMON_OK
AND M141
AND M147
AND CY04_CLAMP_MACHINE_PERMIT
----------------------------------( M851 )
```

経路：M986/M987 → M850/M851 → M880/M881 → Y24/Y25 → M150/M151。

代表BLOCK：M940/M941/M942/M943/M948/M949/M951/M952/M955。

### 5.5 CY05 ドリル上下

```text
M988 AND NOT M989 AND MANUAL_COMMON_OK AND CY05_UP_MACHINE_PERMIT
----------------------------------( M852 )
```

下降：

```text
M989 AND NOT M988
AND MANUAL_COMMON_OK
AND M141
AND M147
AND M151
AND M166
AND NOT M167
AND CY05_DOWN_MACHINE_PERMIT
----------------------------------( M853 )
```

経路：M988/M989 → M852/M853 → M882/M883 → Y26/Y27 → M152/M153。

代表BLOCK：M940/M941/M942/M943/M947/M948/M949/M950/M952/M953/M955。

## 6. 主軸

```text
M990
AND MANUAL_COMMON_OK
AND M141
AND M147
AND M151
AND M152
AND NOT M167
AND SPINDLE_MACHINE_PERMIT
----------------------------------( M854 )
```

経路：M990 → M854 → M884 → Y30 → M166/M167。

M166はRUN確認であり、ゼロ速度確認ではない。

代表BLOCK：M940/M941/M942/M952/M953/M955。

## 7. 相反要求一覧

M943は次の同時要求で成立候補とする。

- M904 & M905
- M906 & M907
- M908 & M909
- M910 & M911
- M912 & M913
- M980 & M981
- M982 & M983
- M984 & M985
- M986 & M987
- M988 & M989

相反要求成立時は両MANUAL要求をOFF側へ倒す。

## 8. COMMON要求への展開

Section 10ではAUTOとMANUALをORし、最終排他を通す。

### CV

```text
(M800 OR M830) AND CV01_OUTPUT_PERMIT ----( M860 )
(M801 OR M831) AND CV02_OUTPUT_PERMIT ----( M861 )
(M802 OR M832) AND CV03_OUTPUT_PERMIT ----( M862 )
(M803 OR M833) AND CV04_OUTPUT_PERMIT ----( M863 )
```

### ST

各UP/DOWN対で相反側要求がない時だけCOMMON成立。

例ST02：

```text
(M806 OR M836) AND NOT (M807 OR M837) ----( M866 )
(M807 OR M837) AND NOT (M806 OR M836) ----( M867 )
```

ST01/ST03/ST04/ST05も同形式。

### CY

CY01～CY05も同形式で相反排他する。

例CY02：

```text
(M816 OR M846) AND NOT (M817 OR M847) ----( M876 )
(M817 OR M847) AND NOT (M816 OR M846) ----( M877 )
```

### 主軸

```text
(M824 OR M854) AND SPINDLE_OUTPUT_PERMIT ----( M884 )
```

## 9. ACTUAL_OUTPUT

実YはSection 11のみで駆動する。

```text
M860→Y0   M861→Y1   M862→Y2   M863→Y3
M864→Y4   M865→Y5   M866→Y6   M867→Y7
M868→Y10  M869→Y11  M870→Y12  M871→Y13
M872→Y14  M873→Y15
M874→Y16  M875→Y17
M876→Y20  M877→Y21
M878→Y22  M879→Y23
M880→Y24  M881→Y25
M882→Y26  M883→Y27
M884→Y30
```

ダブルSOLはSection 11でも相互排他を維持する。

## 10. 診断チェーン

すべての手動操作で、GOT上から次を追跡できる状態を基準とする。

```text
GOT req ON
↓
MANUAL req ?
↓
COMMON req ?
↓
Y ?
↓
FB ?
```

MANUAL reqで止まる場合はM940～M955を確認する。

COMMON reqで止まる場合はAUTO/MANUAL相反・最終出力許可を確認する。

Y ONでFB未成立なら指令後の実状態未成立として扱い、必要に応じてタイムアウト診断へ進む。

## 11. シミュレーション必須試験

1. 全GOT手動要求がM300 OFFでMANUAL要求へ通らない。
2. M305 ONで通常手動要求へ通らない。
3. M324 ONで通常手動要求へ通らない。
4. 全ST/CY相反ペアで両Y同時ONにならない。
5. CV02～CV04も搬送先在荷/干渉で適切にBLOCKされる。
6. CY01～CY03も要求→MANUAL→COMMON→Y→FBを追跡できる。
7. CY04 CLAMPのM141/M147不足でM851がOFF。
8. CY05 DOWNのM141/M147/M151/M166不足またはM167 ONでM853がOFF。
9. 主軸M990要求時、M167 ONでM854がOFF。
10. 画面切替後にM900～M913/M980～M990が残留しない。

## 12. 未確定事項

以下は本マップで仮埋めしない。

- 各 `*_MACHINE_PERMIT` の最終条件
- ダブルSOLの保持/パルス出力方式
- T4加工ST側搬送機構の正式出力
- M515搬出時の正式駆動方式
- 主軸停止完了/ゼロ速度の正式確認方式

正式決定時は、物理I/O、電気図面、GX Works3コメント、GOT、試験表を同時更新する。
