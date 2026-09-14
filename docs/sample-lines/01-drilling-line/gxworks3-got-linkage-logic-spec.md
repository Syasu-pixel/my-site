# 01 Drilling Line — GX Works3 GOT連携ロジック仕様

Status: Draft / 教材・シミュレーション基準

## 1. 目的

GT Works3側で使用する M920～M938 表示補助、M940～M955 操作不可理由、M960～M971 アラーム補助について、GX Works3側でどの内部状態から生成するかを固定する。

本仕様は通常PLCとGOTの連携仕様であり、安全機能そのものを通常PLCやGOTで成立させない。

## 2. 基本原則

- GOT表示用Mは、既存の制御状態を表示用に意味変換する。
- GOTから実Yへ直接書き込まない。
- GOT手動要求は MANUAL section → COMMON要求 → ACTUAL_OUTPUT の順を必ず通す。
- 表示用Mから自動運転M305や運転準備M321をSETしない。
- RESET表示・RESET要求から自動再始動しない。
- 安全監視M760～M764をGOT操作で解除しない。

## 3. Section 14 GOT_INTERFACE 実行順

推奨順：

1. M920～M939 表示状態生成
2. M940～M959 BLOCK理由生成
3. M960～M971 アラーム/HMI補助
4. D100 現在加工STEP生成
5. D101 現在搬送状態生成
6. 画面表示用文字列/補助状態生成

制御ロジック本体より後、実Y生成とは独立して処理する。

## 4. M920～M939 表示補助

### 4.1 直接ミラー

```text
M920 = M321                    // AUTO READY
M921 = M305                    // AUTO RUNNING
M922 = M322                    // AUTO STARTABLE
M923 = M323                    // LOAD PERMITTED
M924 = M330                    // STATION ACCEPTABLE
M925 = M324                    // ALARM ACTIVE
M926 = M325                    // WARNING ACTIVE
M927 = M300                    // MANUAL MODE
M928 = M301                    // AUTO MODE
M930 = M140                    // PROCESS TRANSPORT WORK
M931 = M141                    // JIG WORK
M932 = M154                    // DISCHARGE FULL
M933 = M166                    // SPINDLE RUN FB
```

### 4.2 派生状態

```text
M929 = NOT M300 AND NOT M301
M934 = M167 OR M750
M936 = M430 OR M431 OR M432 OR M433
M937 = M501 OR M502 OR ... OR M517
```

M500は加工ST待機なので `PROCESS ACTIVE` には含めない。

### 4.3 M935 RECOVERY REQUIRED

M935は「通常操作だけでは自動起動状態へ戻れず、位置確認または手動復旧が必要」と判断できる場合に表示する。

一次案：

```text
M935 = M324
    OR (NOT M305 AND (M430 OR M431 OR M432 OR M433))
    OR (NOT M305 AND (M501 OR M502 OR ... OR M516) AND NOT M320)
```

注意：

- M517はサイクル完了処理なので復旧要求判定から除外する。
- 単なる搬出満杯M770、投入待ちM771、下流待ちM772だけではM935をONしない。
- ワークが設備内に存在するだけでもM935をONしない。

### 4.4 M938 SETTINGS CHANGE PERMIT

PLC側の機械状態許可と、GOT側の権限許可を分離する。

PLC側 M938 一次条件：

```text
M938 = M300
    AND NOT M305
    AND NOT M324
```

意味：

- 手動モード成立
- 自動運転停止中
- 設備異常なし

GT Works3側では、これに加えて Level 2 相当の保守権限成立を編集可否条件とする。

PLC側M938だけで「権限あり」とは扱わない。

M939はSPAREのままとする。

## 5. M940～M955 BLOCK理由

BLOCKビットは「現在押されているGOT要求がPLC側で通らない理由」を表示するために使う。

### 5.1 共通BLOCK

```text
M940 = (GOT手動要求のいずれかON) AND NOT M300
M941 = (GOT手動要求のいずれかON)
       AND NOT (M110 AND M112 AND M113 AND M114 AND M115)
M942 = (GOT手動要求のいずれかON) AND M324
M943 = 相反するGOT要求が同時成立
```

GOT手動要求の対象：

- M900～M913
- M980～M990

M941は安全機能そのものではなく、通常PLCが受ける安全監視状態による操作禁止表示である。

### 5.2 搬送系BLOCK

```text
M944 = 搬送JOG要求あり AND 関連隣接transfer busy
M945 = 搬送JOG要求あり AND 対象搬送先在荷
```

CV04→加工STの手動BLOCKは、自動専用のM330をそのまま使わない。M330にはM305自動運転中が含まれるため、手動モードでは常時不成立となり、M946が誤って常時BLOCKになり得る。

手動用の受入条件は説明用論理名 `MANUAL_STATION_ACCEPT_OK` とし、未登録Mを新設せず次を基準に評価する。

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

M946 = CV04→加工ST関連手動要求あり
       AND NOT MANUAL_STATION_ACCEPT_OK
```

M300手動モード、安全監視、必要なM111エア条件などの共通操作許可はSection 09側で判定し、M946は加工ST受入に固有の機械状態理由を表示する。

各CVの具体的な対象搬送先は搬送仕様と一致させる。

GOT JOGを押しただけで自動搬送T1～T4を起動する構造にはしない。

### 5.3 加工系BLOCK

M947～M955は、現在要求している加工系手動動作に対して必要な位置条件が成立しない場合にONする。

- M947：CY01関連位置条件不成立
- M948：CY02関連位置条件不成立
- M949：CY03関連位置条件不成立
- M950：CY04関連位置条件不成立
- M951：CY05関連位置条件不成立
- M952：ワーク位置条件不成立
- M953：主軸異常または主軸関連条件不成立
- M954：搬出満杯により要求動作不可
- M955：その他工程干渉条件不成立

重要：これらは「常時NG状態」を示すのではなく、原則として該当GOT要求がある時に、その要求が通らない理由として生成する。

## 6. 加工手動要求の診断チェーン

G04では次の5段階を別々に監視できるようにする。

```text
GOT要求
  ↓
M980～M990
  ↓ MANUAL sectionで許可判定
M844～M854
  ↓ OUTPUT_REQUEST
M874～M884
  ↓ ACTUAL_OUTPUT
Y16～Y30
  ↓
位置/運転FB M142～M167
```

途中で止まった場合、M940～M955を同時に確認する。

## 7. M963 / M964 RESET可否

`gxworks3-alarm-latch-reset-spec.md` の M340 `ALARM RESET COMMON PERMIT` を基準にする。

### M963 RESET PERMIT

```text
M963 = M324 AND M340 AND 個別アラーム原因復旧条件成立
```

M340だけでは個別原因復旧を保証しないため、実装時は解除対象アラームごとのRESET条件を確認した結果をまとめる。

複数アラームが同時発生している場合は、RESET要求で解除可能なものだけ解除し、原因未復旧のアラームは保持する。

### M964 RESET BLOCKED

```text
M964 = M324 AND NOT M963
```

異常が存在しない場合はM963/M964ともOFFを基本とする。

## 8. M960～M971 アラーム補助

### GOT書込要求

- M960：ACK要求
- M961：GOT RESET要求候補
- M962：ブザー停止要求候補
- M970：履歴消去要求

これらはモーメンタリ要求を基本とする。

### PLC生成表示

- M963：RESET可
- M964：RESET不可
- M965：新規アラーム立上りパルス
- M966：履歴記録イベント
- M967：新規警告立上りパルス
- M968：現在アラーム表示保持補助
- M969：復旧案内有効
- M971：履歴消去許可

一次案：

```text
M968 = M324
M969 = M935 OR M964
```

M965/M967は前スキャン状態との差分から1スキャンパルスで生成する。

M966はアラーム発生・復旧・ACK・RESETを履歴イベントとして記録するための補助とし、イベント種別はGT Works3側または別データで区別する。

## 9. M961 GOT RESET要求の採否

通常運用では物理RESET PB X3 / M183を正式RESET操作とする。

M961を採用する場合でも、PLC側で次の条件を必ず通す。

```text
GOT RESET要求 M961
AND M963 RESET可
→ 個別アラームRESET処理へ
```

禁止：

- M961 → M321 SET
- M961 → M305 SET
- M961 → 自動起動要求
- M961 → 安全回路のRESET代替

## 10. M962 ブザー停止

M962を採用する場合は、物理M187と同じ「音だけ停止」経路へ合流させる。

```text
M187 OR M962
→ M327 ブザー消音状態
```

アラームM700帯、M324、履歴は解除しない。

## 11. M971 履歴消去許可

履歴消去許可は現在アラーム解除許可とは別にする。

一次案：

```text
M971 = M300
    AND NOT M305
    AND NOT M324
    AND M938
```

GT Works3側Level 2権限成立を追加条件とする。

M970履歴消去要求は、現在アラームM700帯やM324へ接続しない。

## 12. D100 現在加工STEP

一対一表示：

- M500 → D100 = 500
- M501 → D100 = 501
- ...
- M517 → D100 = 517

一時的に複数STEPが成立した場合はシーケンス異常として扱い、単純な後勝ち表示で隠さない。

## 13. D101 現在搬送状態

D101はGOT診断用の表示値であり、制御条件の正本にしない。

推奨表示体系：

- 0：搬送待機
- 1xx：T1
- 2xx：T2
- 3xx：T3
- 4xx：T4

詳細サブ番号はM440～M476との対応表を別途作成してから固定する。

非隣接搬送が同時成立するため、D101単独では全搬送状態を完全表現できない。GOTではM430～M433 Busy表示を正として併記する。

## 14. Section 14 擬似ラダー順

```text
// Network 14-01 mode/status mirror
M321 -> M920
M305 -> M921
M322 -> M922
...

// Network 14-02 derived status
!M300 & !M301 -> M929
M167 | M750 -> M934
M430 | M431 | M432 | M433 -> M936
M501..M517 OR -> M937

// Network 14-03 recovery/settings
recovery conditions -> M935
M300 & !M305 & !M324 -> M938

// Network 14-04 manual block reasons
active GOT request + inhibit conditions -> M940..M955

// Network 14-05 alarm HMI helper
reset permit evaluation -> M963/M964
new alarm edge -> M965
new warning edge -> M967
M324 -> M968
M935 | M964 -> M969

// Network 14-06 display numbers
M500..M517 -> D100
transfer state -> D101
```

## 15. シミュレーション確認

最低限確認する。

1. M321 ONでM920のみ正しく追従する。
2. M305 ON/OFFでM921が追従する。
3. モード不成立時M929 ON。
4. M324発生でM925/M935/M968が成立する。
5. 原因未復旧ではM964 ON、M963 OFF。
6. 原因復旧後にRESET許可が成立してもM305/M321は自動SETされない。
7. 手動要求が禁止条件でブロックされた場合、該当M940～M955が表示される。
8. M938 OFF時はG10設定編集不可。
9. M970履歴消去で設備制御状態が変化しない。
10. M961採用時もRESET後に自動再始動しない。
11. 手動モードでCV04→加工ST関連要求を出した際、M330がOFFであることだけを理由にM946が常時ONにならない。
12. `MANUAL_STATION_ACCEPT_OK` が成立した手動受入状態ではM946 OFF、固有条件が不足した場合のみM946 ONとなる。

## 16. 未確定事項

- M938とGT Works3権限機能の最終組み合わせ
- M935の「位置不整合」詳細判定
- 各手動要求ごとのM947～M955詳細マトリクス
- 発生時STEP履歴保持方式
- D101詳細コード

これらは既存I/OやM番号を増やさず、必要性を確認してから正式化する。