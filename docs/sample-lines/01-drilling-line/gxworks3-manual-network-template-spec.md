# 01 Drilling Line — GX Works3 Section 09 MANUAL 代表ネットワーク仕様

Status: Draft / 教材・シミュレーション実装直前基準

## 1. 目的

Section 09 `MANUAL` を、GT Works3の手動要求からPLC側MANUAL要求へ変換する代表ネットワークとして具体化する。

対象は次の5パターン。

1. CV01 JOG
2. ST01 UP / DOWN
3. CY04 RELEASE / CLAMP
4. CY05 UP / DOWN
5. 主軸 RUN

残りのCV/ST/CYは本仕様を横展開する。

本仕様は通常制御・教材・シミュレーション用であり、安全機能そのものを通常PLC/GOTで代替しない。

## 2. Section 09 共通原則

GOT要求から実Yへ直接接続しない。

```text
GOT要求
  ↓
Section 09 MANUAL 許可判定
  ↓
M830～M854 MANUAL要求
  ↓
Section 10 OUTPUT_REQUEST
  ↓
M860～M884 COMMON要求
  ↓
Section 11 ACTUAL_OUTPUT
  ↓
Y
```

共通手動許可の基準：

- M300 手動モード成立
- M305 自動運転中 = OFF
- M324 異常総合 = OFFを通常基準とする
- 安全監視入力 M110/M112/M113/M114/M115 が通常運転許可状態
- 相反要求なし
- 対象動作の機械干渉条件成立

手動ボタンは原則モーメンタリ。画面切替後にGOT要求Mを保持し続けない。

## 3. Network 09-01 — 手動共通許可

実装補助用の共通条件を論理式として定義する。

```text
MANUAL_COMMON_OK =
    M300
AND NOT M305
AND NOT M324
AND M110
AND M112
AND M113
AND M114
AND M115
```

専用Mを新規割付するか、各ネットワークへ直接条件を展開するかはGX Works3実装時に選択する。

新規Mを採用する場合はデバイスコメントマスターへ先に正式登録し、未登録番号を勝手に使用しない。

## 4. Network 09-10 — CV01 JOG

### 4.1 入力

- GOT要求：M900 `GOT_CV01_RUN_REQ`
- MANUAL要求：M830
- COMMON要求：M860
- 実出力：Y0
- 在荷：M116
- 通過：M200/M201

### 4.2 許可思想

CV01 JOGは自動搬送T1の起動要求ではない。

通常制御上、少なくとも以下を満たす場合だけM830へ通す。

- MANUAL_COMMON_OK
- 自動T1/T2の干渉状態でない
- CV02在荷 M117 が、要求目的に対して禁止条件でない
- 関連する機械干渉条件なし

擬似ラダー：

```text
M900
AND MANUAL_COMMON_OK
AND NOT M430
AND NOT M431
AND NOT M117
----------------------------------( M830 )
```

ここで `NOT M117` は「CV01から下流へ送るJOG」を想定した一次基準。単独ベルト点検など別用途のJOGを将来認める場合は、用途別に手動モードを分離して再設計する。

### 4.3 BLOCK表示

```text
M900 AND NOT M300 ----------------( M940 )
M900 AND safety-monitor-NG -------( M941 )
M900 AND M324 --------------------( M942 )
M900 AND (M430 OR M431) ----------( M944 )
M900 AND M117 --------------------( M945 )
```

## 5. Network 09-20 — ST01 UP / DOWN

### 5.1 入力

- UP GOT：M904 → MANUAL M834 → COMMON M864 → Y4
- DOWN GOT：M905 → MANUAL M835 → COMMON M865 → Y5
- UP FB：M126
- DOWN FB：M127

### 5.2 相反禁止

```text
M904 AND M905 --------------------( M943 )
```

M834/M835は同時成立させない。

```text
M904
AND NOT M905
AND MANUAL_COMMON_OK
AND ST01_UP_MACHINE_PERMIT
----------------------------------( M834 )

M905
AND NOT M904
AND MANUAL_COMMON_OK
AND ST01_DOWN_MACHINE_PERMIT
----------------------------------( M835 )
```

`ST01_*_MACHINE_PERMIT` はワーク位置、搬送Busy、ストッパー周辺干渉を確認する通常制御条件。GOT側だけで成立させない。

### 5.3 フィードバック診断

- UP要求中にM126が成立すれば動作完了表示候補。
- DOWN要求中にM127が成立すれば動作完了表示候補。
- M126/M127同時成立は正常完了として扱わない。

## 6. Network 09-30 — CY04 RELEASE / CLAMP

### 6.1 入力

- RELEASE：M986 → M850 → M880 → Y24 → M150
- CLAMP：M987 → M851 → M881 → Y25 → M151

### 6.2 RELEASE

一次基準：

```text
M986
AND NOT M987
AND MANUAL_COMMON_OK
AND CY04_RELEASE_MACHINE_PERMIT
----------------------------------( M850 )
```

### 6.3 CLAMP

クランプ要求はワーク位置が確認でき、他軸の位置がクランプ動作と整合している場合のみ通す。

```text
M987
AND NOT M986
AND MANUAL_COMMON_OK
AND M141
AND M147
AND CY04_CLAMP_MACHINE_PERMIT
----------------------------------( M851 )
```

M141/M147は一次案。実機干渉条件・治具構造確定後に最終化する。

### 6.4 BLOCK表示例

```text
(M986 OR M987) AND NOT M300 -------( M940 )
M986 AND M987 ---------------------( M943 )
M987 AND NOT M141 -----------------( M952 )
M987 AND NOT M147 -----------------( M949 )
(M986 OR M987) AND other-interference
-----------------------------------( M955 )
```

## 7. Network 09-40 — CY05 UP / DOWN

### 7.1 入力

- UP：M988 → M852 → M882 → Y26 → M152
- DOWN：M989 → M853 → M883 → Y27 → M153

### 7.2 UP

CY05 UPは復旧時にも重要な基準方向だが、無条件動作にはしない。

```text
M988
AND NOT M989
AND MANUAL_COMMON_OK
AND CY05_UP_MACHINE_PERMIT
----------------------------------( M852 )
```

### 7.3 DOWN

CY05 DOWNは加工位置への進入動作なので、通常制御上の確認条件を多めに持たせる。

一次基準：

```text
M989
AND NOT M988
AND MANUAL_COMMON_OK
AND M141
AND M147
AND M151
AND M166
AND NOT M167
AND CY05_DOWN_MACHINE_PERMIT
----------------------------------( M853 )
```

意味：

- 治具にワークあり
- 位置決め成立
- クランプ成立
- 主軸運転確認あり
- 主軸異常なし
- その他の通常制御干渉条件成立

これは安全機能の代替ではなく、通常PLC上の加工順序インターロックである。

### 7.4 BLOCK表示例

```text
M988 AND M989 --------------------( M943 )
M989 AND NOT M141 ----------------( M952 )
M989 AND NOT M147 ----------------( M949 )
M989 AND NOT M151 ----------------( M950 )
M989 AND (M167 OR NOT M166) -------( M953 )
M989 AND other-interference -------( M955 )
```

## 8. Network 09-50 — 主軸 RUN

### 8.1 入力

- GOT要求：M990
- MANUAL要求：M854
- COMMON要求：M884
- 実出力：Y30
- RUN FB：M166
- FAULT：M167

### 8.2 許可条件

一次基準：

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

意味：

- 治具在荷
- 位置決め済み
- クランプ済み
- CY05上昇基準位置
- 主軸異常なし
- その他加工干渉なし

主軸RUN FB M166は、RUN要求を出す前の許可条件ではなく、要求後の確認用とする。

### 8.3 診断

```text
M990 ON / M854 OFF
→ Section 09許可条件を確認

M854 ON / M884 OFF
→ Section 10共通要求条件を確認

M884 ON / Y30 OFF
→ Section 11最終出力条件を確認

Y30 ON / M166 OFF
→ RUN指令は出たが運転確認未成立
```

M166 OFFを専用ゼロ速度確認とは扱わない。

## 9. Section 10 OUTPUT_REQUEST への受け渡し

MANUAL要求はAUTO要求とORし、最終相反排他を通してCOMMON要求へ集約する。

代表：

```text
(M800 OR M830) AND CV01_OUTPUT_PERMIT
----------------------------------( M860 )
```

CY04：

```text
(M820 OR M850)
AND NOT (M821 OR M851)
----------------------------------( M880 )

(M821 OR M851)
AND NOT (M820 OR M850)
----------------------------------( M881 )
```

CY05：

```text
(M822 OR M852)
AND NOT (M823 OR M853)
----------------------------------( M882 )

(M823 OR M853)
AND NOT (M822 OR M852)
----------------------------------( M883 )
```

相反側同時成立時は両COMMON要求をOFF側へ倒す。

## 10. Section 11 ACTUAL_OUTPUT

実YはSection 11だけで出力する。

代表：

```text
M860 -----------------------------( Y0 )
M864 -----------------------------( Y4 )
M865 -----------------------------( Y5 )
M880 -----------------------------( Y24 )
M881 -----------------------------( Y25 )
M882 -----------------------------( Y26 )
M883 -----------------------------( Y27 )
M884 -----------------------------( Y30 )
```

ダブルソレノイドは最終段でも相互排他を維持する。

## 11. 残り機器への横展開

同じテンプレートを以下へ適用する。

- CV02：M901 → M831 → M861 → Y1
- CV03：M902 → M832 → M862 → Y2
- CV04：M903 → M833 → M863 → Y3
- ST02：M906/M907 → M836/M837 → M866/M867 → Y6/Y7
- ST03：M908/M909 → M838/M839 → M868/M869 → Y10/Y11
- ST04：M910/M911 → M840/M841 → M870/M871 → Y12/Y13
- ST05：M912/M913 → M842/M843 → M872/M873 → Y14/Y15
- CY01：M980/M981 → M844/M845 → M874/M875 → Y16/Y17
- CY02：M982/M983 → M846/M847 → M876/M877 → Y20/Y21
- CY03：M984/M985 → M848/M849 → M878/M879 → Y22/Y23

各機器の `MACHINE_PERMIT` は機械構造と工程干渉条件に合わせて個別化し、単純コピーだけで確定しない。

## 12. シミュレーション試験

最低限、次を確認する。

1. M300 OFFでは全MANUAL要求がOFF。
2. M305 ONでは通常手動要求が通らない。
3. M324 ONでは通常手動要求が通らない。
4. 相反GOT要求を同時ONしても相反Yが同時ONしない。
5. CV01で搬送先在荷時にM830が成立しない。
6. CY04 CLAMPでワーク/位置条件不足時にM851が成立しない。
7. CY05 DOWNでM141/M147/M151/M166のいずれか不足時にM853が成立しない。
8. 主軸RUNでM167 ON時にM854が成立しない。
9. MANUAL要求ONでもCOMMON要求で止められる状態を診断できる。
10. COMMON要求ONでもACTUAL_OUTPUT最終条件で止められる状態を診断できる。

## 13. 未確定事項

- 各 `MACHINE_PERMIT` の最終条件
- ダブルソレノイドの保持/パルス出力哲学（MV01正式仕様・最新メーカー資料確認後）
- 主軸手動RUNの最終機械条件
- T4加工ST側搬送機構の正式出力
- M515搬出時の正式駆動方式

未確定事項は架空のY/Mを追加して埋めない。
