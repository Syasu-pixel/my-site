# 01 Drilling Line — GX Works2 Batch F / Section 14 GOT_INTERFACE 移行差分

Status: Draft / GX Works2・FX3U移行用

## 1. 目的

GX Works3版 `gxworks3-got-linkage-logic-spec.md` の Section 14 GOT_INTERFACE を、GX Works2 + FX3U教材版へ移植する際の差分を整理する。

基本方針は、制御ロジック本体を変えず、GX Works2 / FX3Uで再確認が必要なデバイス・命令・GOT連携だけを差分管理すること。

## 2. そのまま流用する論理

次はGX Works2版でも維持する。

- GOTから実Yへ直接書かない。
- GOT手動要求は Section 09 MANUAL → Section 10 OUTPUT_REQUEST → Section 11 ACTUAL_OUTPUT を通す。
- 表示用Mから M305 AUTO RUN、M321 READY をSETしない。
- RESET要求から自動再始動しない。
- 安全監視M760～M764をGOT操作で解除しない。
- M920～M939は表示補助。
- M940～M955は操作不可理由。
- M960～M971はACK / RESET / SILENCE / HISTORY補助。
- D100は現在加工STEP表示。
- D101は搬送診断表示であり、制御条件の正本にはしない。

## 3. M920～M939 表示補助

GX Works2版も次を維持する。

```text
M920 = M321
M921 = M305
M922 = M322
M923 = M323
M924 = M330
M925 = M324
M926 = M325
M927 = M300
M928 = M301
M929 = NOT M300 AND NOT M301
M930 = M140
M931 = M141
M932 = M154
M933 = M166
M934 = M167 OR M750
M936 = M430 OR M431 OR M432 OR M433
M937 = M501 OR ... OR M517
M938 = M300 AND NOT M305 AND NOT M324
M939 = SPARE
```

M935 RECOVERY REQUIREDも既存ロジック方針を維持する。

## 4. M946 手動CV04→加工ST BLOCK

この項目は既存修正を必ず継承する。

AUTO専用M330を手動受入判定へ流用しない。

説明用論理名：

```text
MANUAL_STATION_ACCEPT_OK =
    M500
AND NOT M140
AND NOT M141
AND M142
AND M144
AND M146
AND M150
AND M152
AND NOT M166
AND NOT M167
AND NOT M154
AND NOT M324
```

```text
M946 = CV04→加工ST関連手動要求あり
       AND NOT MANUAL_STATION_ACCEPT_OK
```

GX Works2版でも未登録Mを新設せず、必要なら既存条件を直接組むか正式登録後に補助M化する。

## 5. M940～M955 BLOCK理由

既存定義を維持する。

- M940：手動要求あり + M300手動モード不成立
- M941：安全監視状態未成立
- M942：M324故障中
- M943：相反するGOT要求同時成立
- M944：関連隣接transfer busy
- M945：搬送先在荷
- M946：CV04→加工ST手動受入不可
- M947～M951：各加工軸位置条件不成立
- M952：ワーク位置条件不成立
- M953：主軸異常/主軸関連条件不成立
- M954：搬出満杯による操作禁止
- M955：その他工程干渉

BLOCKは原則として「該当要求があるときの理由表示」とし、単なる常時NG状態表示にはしない。

## 6. M960～M971 HMI補助

GX Works2版でも次を維持する。

GOT書込要求：

- M960 ACK
- M961 RESET要求候補
- M962 ブザー停止
- M970 履歴消去要求

PLC生成：

- M963 RESET PERMIT
- M964 RESET BLOCKED
- M965 NEW ALARM PULSE
- M966 HISTORY EVENT
- M967 NEW WARNING PULSE
- M968 ALARM ACTIVE HELPER
- M969 RECOVERY GUIDE
- M971 HISTORY CLEAR PERMIT

禁止事項：

```text
M961 -> M321 SET   禁止
M961 -> M305 SET   禁止
M961 -> AUTO START 禁止
M961 -> Safety Reset代替 禁止
```

ブザー停止M962はM327へ合流し、M700帯やM324をRESETしない。

## 7. GX Works2側で確認が必要な差分

### 7.1 GOT接続方式

FX3UにはFX5Uのような内蔵Ethernet前提を置かない。

GX Works2版では、GOT機種・接続方式・通信ユニットを別途正式化する。

未確定の通信モジュールやポートを推測で固定しない。

### 7.2 1スキャンパルス

M965 / M967は新規アラーム・警告の立上り1スキャンパルス。

GX Works2 / FX3Uで使う正式な立上り検出命令または自己保持差分方式をプロジェクト作成後に確認する。

実機プロジェクト未確認の段階では、GX Works3表記を機械的に置換しない。

### 7.3 D100 / D101の値書込

D100への500～517値書込、D101の搬送表示コードはFX3Uでも基本的に実装可能と想定するが、使用命令形式はGX Works2側で確認する。

D101詳細サブコードは未確定のため、この移行で勝手に採番しない。

### 7.4 GOTモーメンタリ要求

M900～M913、M980～M990、M960～M962、M970はGOT側でモーメンタリ操作を基本とする。

画面切替後に要求ビットが残留しないことをGT側設定とSIMで確認する。

## 8. Settings / History

M938はPLC側の機械状態許可のみ。

```text
M938 = M300 AND NOT M305 AND NOT M324
```

権限管理はGOT側で別管理する。

履歴消去はM971を通す。

```text
M971 = M300
AND NOT M305
AND NOT M324
AND M938
```

M970履歴消去要求を現在アラームRESETへ接続しない。

## 9. GX Works2 SIM試験候補

- F-SIM-W2-01：M321→M920、M305→M921が正しく表示される。
- F-SIM-W2-02：M300/M301両OFFでM929 ON。
- F-SIM-W2-03：M167またはM750でM934 ON。
- F-SIM-W2-04：M430～M433いずれかONでM936 ON。
- F-SIM-W2-05：M501～M517のどれかでM937 ON、M500のみではOFF。
- F-SIM-W2-06：M938は手動・停止・異常なし条件のみでON。
- F-SIM-W2-07：GOT手動要求あり + M300 OFFでM940 ON。
- F-SIM-W2-08：安全監視未成立でM941 ON。
- F-SIM-W2-09：M324 ONでM942 ON。
- F-SIM-W2-10：相反GOT要求でM943 ON、対応MANUAL要求は両方OFF。
- F-SIM-W2-11：CV04手動要求時、M330を使わずMANUAL_STATION_ACCEPT_OKでM946判定。
- F-SIM-W2-12：M961 RESET要求のみでM321/M305がSETされない。
- F-SIM-W2-13：M962でブザーだけ停止しM324/M700帯は保持。
- F-SIM-W2-14：M970履歴消去要求で現在アラームが消えない。
- F-SIM-W2-15：M963成立時のみGOT RESET経路へ入れる。
- F-SIM-W2-16：M964はM324かつRESET不可でON。
- F-SIM-W2-17：新規アラームでM965が1スキャンのみON。
- F-SIM-W2-18：新規警告でM967が1スキャンのみON。
- F-SIM-W2-19：M500～M517に応じD100=500～517となる。
- F-SIM-W2-20：D101は制御判定に使われていない。
- F-SIM-W2-21：画面切替後にモーメンタリ要求が残留しない。
- F-SIM-W2-22：GOTからYへ直接書込む経路が存在しない。

## 10. BLOCKED-TBD

- GX Works2版GOT正式機種
- FX3Uとの正式通信方式
- M965 / M967の正式1スキャン命令形式
- D101搬送詳細サブコード
- GOT権限レベル実装
- 履歴イベント種別の保持方式

## 11. 移行判定

- Section 14論理：流用可能
- M920～M971内部デバイス帯：維持候補
- M946手動受入修正：必須継承
- GOT通信ハード：未確定
- GX Works2入力：未実施
- GX Simulator2確認：未実施

現在判定：

**BATCH F LOGIC MIGRATION READY / GOT CONNECTION TBD / GX WORKS2 INPUT PENDING / SIM PENDING**
