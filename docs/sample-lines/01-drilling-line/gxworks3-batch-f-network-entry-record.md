# 01 Drilling Line — GX Works3 Batch F Section 14 GOT_INTERFACE ネットワーク実装記録

Status: Active / 教材・シミュレーション入力管理用

## 1. 目的

Section 14 `GOT_INTERFACE` をGX Works3へ実装するとき、表示補助・BLOCK理由・アラームHMI補助・D100/D101表示値をネットワーク単位で `COMMENT / LADDER / SIM` 管理する。

重要：GOT表示用ロジックは設備制御の正本ではない。GOTから実Yへ直接書き込まず、RESETや表示補助からM305/M321を自動SETしない。

## 2. 共通実績欄

各行を独立管理する。

```text
[ ] COMMENT  [ ] LADDER  [ ] SIM
```

## 3. 14-01〜14-14 直接ミラー

| Network | Device | 元状態 | 内容 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|---|
| 14-01 | M920 | M321 | AUTO READY | [ ] | [ ] | [ ] |
| 14-02 | M921 | M305 | AUTO RUNNING | [ ] | [ ] | [ ] |
| 14-03 | M922 | M322 | AUTO STARTABLE | [ ] | [ ] | [ ] |
| 14-04 | M923 | M323 | LOAD PERMITTED | [ ] | [ ] | [ ] |
| 14-05 | M924 | M330 | STATION ACCEPTABLE | [ ] | [ ] | [ ] |
| 14-06 | M925 | M324 | ALARM ACTIVE | [ ] | [ ] | [ ] |
| 14-07 | M926 | M325 | WARNING ACTIVE | [ ] | [ ] | [ ] |
| 14-08 | M927 | M300 | MANUAL MODE | [ ] | [ ] | [ ] |
| 14-09 | M928 | M301 | AUTO MODE | [ ] | [ ] | [ ] |
| 14-10 | M930 | M140 | PROCESS TRANSPORT WORK | [ ] | [ ] | [ ] |
| 14-11 | M931 | M141 | JIG WORK | [ ] | [ ] | [ ] |
| 14-12 | M932 | M154 | DISCHARGE FULL | [ ] | [ ] | [ ] |
| 14-13 | M933 | M166 | SPINDLE RUN FB | [ ] | [ ] | [ ] |
| 14-14 | M934 | M167 OR M750 | SPINDLE ALARM STATUS | [ ] | [ ] | [ ] |

## 4. 14-20〜14-24 派生状態

| Network | Device | 条件 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 14-20 | M929 | NOT M300 AND NOT M301 | MODE NOT ESTABLISHED | [ ] | [ ] | [ ] |
| 14-21 | M936 | M430 OR M431 OR M432 OR M433 | TRANSFER ACTIVE | [ ] | [ ] | [ ] |
| 14-22 | M937 | M501〜M517 OR | PROCESS ACTIVE | [ ] | [ ] | [ ] |
| 14-23 | M935 | recovery conditions | RECOVERY REQUIRED | [ ] | [ ] | [ ] |
| 14-24 | M938 | M300 AND NOT M305 AND NOT M324 | SETTINGS CHANGE PERMIT | [ ] | [ ] | [ ] |

確認：

- [ ] M500単独ではM937 ONにしない。
- [ ] 単なるM770/M771/M772だけでM935をONしない。
- [ ] M938だけで保守権限成立扱いにしない。

## 5. 14-30〜14-33 共通BLOCK

GOT手動要求対象：M900〜M913、M980〜M990。

| Network | Device | 条件 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 14-30 | M940 | active request AND NOT M300 | 手動モード不成立 | [ ] | [ ] | [ ] |
| 14-31 | M941 | active request AND safety-monitor condition NG | 通常PLC側安全監視NG | [ ] | [ ] | [ ] |
| 14-32 | M942 | active request AND M324 | 異常中BLOCK | [ ] | [ ] | [ ] |
| 14-33 | M943 | opposing GOT requests simultaneous | 相反要求 | [ ] | [ ] | [ ] |

## 6. 14-34〜14-36 搬送BLOCK

| Network | Device | 条件 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 14-34 | M944 | transport JOG request AND adjacent transfer busy | 隣接搬送干渉 | [ ] | [ ] | [ ] |
| 14-35 | M945 | transport JOG request AND destination occupied | 搬送先在荷 | [ ] | [ ] | [ ] |
| 14-36 | M946 | CV04→加工ST手動要求 AND NOT MANUAL_STATION_ACCEPT_OK | 加工ST手動受入不可 | [ ] | [ ] | [ ] |

`MANUAL_STATION_ACCEPT_OK` は説明用論理名とし、未登録Mは追加しない。

基準：

```text
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

確認：

- [ ] M946に自動専用M330を直接流用しない。
- [ ] M300、安全監視、必要なエア条件はSection 09共通許可で判定する。
- [ ] GOT JOGから自動T4を直接起動しない。

## 7. 14-40〜14-48 加工系BLOCK M947〜M955

| Network | Device | 表示理由 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 14-40 | M947 | CY01関連位置条件不成立 | [ ] | [ ] | [ ] |
| 14-41 | M948 | CY02関連位置条件不成立 | [ ] | [ ] | [ ] |
| 14-42 | M949 | CY03関連位置条件不成立 | [ ] | [ ] | [ ] |
| 14-43 | M950 | CY04関連位置条件不成立 | [ ] | [ ] | [ ] |
| 14-44 | M951 | CY05関連位置条件不成立 | [ ] | [ ] | [ ] |
| 14-45 | M952 | ワーク位置条件不成立 | [ ] | [ ] | [ ] |
| 14-46 | M953 | 主軸異常/主軸関連条件不成立 | [ ] | [ ] | [ ] |
| 14-47 | M954 | 搬出満杯で要求不可 | [ ] | [ ] | [ ] |
| 14-48 | M955 | その他工程干渉 | [ ] | [ ] | [ ] |

原則：該当GOT要求がONのとき、その要求が通らない理由として生成する。常時NGフラグにはしない。

## 8. 14-50〜14-58 アラーム/HMI補助

| Network | Device | 内容 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 14-50 | M963 | RESET PERMIT | [ ] | [ ] | [ ] |
| 14-51 | M964 | RESET BLOCKED | [ ] | [ ] | [ ] |
| 14-52 | M965 | 新規アラーム1scan pulse | [ ] | [ ] | [ ] |
| 14-53 | M966 | 履歴記録イベント | [ ] | [ ] | [ ] |
| 14-54 | M967 | 新規警告1scan pulse | [ ] | [ ] | [ ] |
| 14-55 | M968 | M324 mirror | [ ] | [ ] | [ ] |
| 14-56 | M969 | M935 OR M964 | 復旧案内有効 | [ ] | [ ] | [ ] |
| 14-57 | M971 | 履歴消去許可 | [ ] | [ ] | [ ] |
| 14-58 | M960/M961/M962/M970 | GOTモーメンタリ要求受信確認 | [ ] | [ ] | [ ] |

RESET基本：

```text
M961 AND M963
→ 個別アラームRESET処理へ
```

禁止：

- M961 → M321 SET
- M961 → M305 SET
- M961 → 自動起動
- M961 → 安全回路RESET代替

M962はM187と同じ「音だけ停止」経路へ合流し、M700帯/M324は解除しない。

## 9. 14-60 D100 現在加工STEP

M500〜M517を一対一でD100=500〜517へ表示する。

実績：

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 各stepで正しい値
- [ ] SIM 複数step同時成立時に単純後勝ちで隠さない

## 10. 14-61 D101 搬送状態

D101は診断用表示値であり制御正本にしない。

一次表示：

- 0：搬送待機
- 1xx：T1
- 2xx：T2
- 3xx：T3
- 4xx：T4

確認：

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM idle=0
- [ ] SIM T1/T2/T3/T4でカテゴリ表示
- [ ] 非隣接同時搬送時、D101だけで全状態を表現できないことをGOT M430〜M433 Busy表示と併記

詳細サブコードはTBDのまま。未確定値を固定しない。

## 11. F-SIM 試験ケース

- [ ] F-SIM-01 M321 ON → M920 ON
- [ ] F-SIM-02 M305 ON/OFF → M921追従
- [ ] F-SIM-03 モード不成立 → M929 ON
- [ ] F-SIM-04 M324発生 → M925/M935/M968 ON
- [ ] F-SIM-05 transfer途中でM305 OFF → M935候補成立
- [ ] F-SIM-06 process途中かつM320不成立 → M935候補成立
- [ ] F-SIM-07 単なるM770だけではM935 OFF
- [ ] F-SIM-08 M938は手動/停止/異常なし時のみ成立
- [ ] F-SIM-09 手動要求 + M300 OFF → M940
- [ ] F-SIM-10 手動要求 + 安全監視NG → M941
- [ ] F-SIM-11 手動要求 + M324 → M942
- [ ] F-SIM-12 相反要求 → M943
- [ ] F-SIM-13 隣接搬送Busy → M944
- [ ] F-SIM-14 搬送先在荷 → M945
- [ ] F-SIM-15 CV04手動要求でMANUAL_STATION_ACCEPT_OK不足 → M946
- [ ] F-SIM-16 M946がM330依存で常時BLOCKにならない
- [ ] F-SIM-17 加工手動要求ごとにM947〜M955の該当理由だけ成立
- [ ] F-SIM-18 原因未復旧 → M964 ON / M963 OFF
- [ ] F-SIM-19 原因復旧 → M963成立可能、ただしM305/M321自動SETなし
- [ ] F-SIM-20 M965/M967は立上り1scan pulse
- [ ] F-SIM-21 M962でブザーのみ停止、M324/M700保持
- [ ] F-SIM-22 M970履歴消去で設備制御状態不変
- [ ] F-SIM-23 D100がM500〜M517へ一対一
- [ ] F-SIM-24 D101とM430〜M433 Busy表示の併用確認

## 12. BLOCKED-TBD

- [ ] M938とGT Works3 Level 2権限の最終組み合わせ
- [ ] M935位置不整合の詳細判定
- [ ] M947〜M955の手動要求別詳細マトリクス
- [ ] M966履歴イベント種別保持方式
- [ ] D101詳細サブコード

未確定項目のためSection 14全体を停止扱いにはしない。確定済み部分から実装し、該当ネットワークのみ `BLOCKED-TBD` とする。

## 13. Batch F 合格条件

- [ ] M920〜M938表示補助が制御本体へ逆流しない
- [ ] M940〜M955が要求時のBLOCK理由として正しく表示
- [ ] M946が自動専用M330を誤用しない
- [ ] M961/M962/M970が設備の自動始動や安全機能代替につながらない
- [ ] M963/M964が原因復旧状態を反映
- [ ] D100/D101は表示・診断専用
- [ ] GOTから実Yへ直接書込みなし
- [ ] RESET後の自動再始動なし

実GX Works3プロジェクト未確認のため、現時点ステータスは `DESIGN READY / INPUT PENDING` とする。
