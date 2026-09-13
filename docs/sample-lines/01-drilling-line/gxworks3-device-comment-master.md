# 01 Drilling Line — GX Works3 デバイスコメントマスター

Status: Draft / GX Works3登録用基準

## 1. 目的

GX Works3へ登録するX/Y/M/Dデバイスコメントを、電気図面・I/O表・シーケンス仕様と同じ名称体系へそろえる。

本ファイルは教材・シミュレーション用のコメント基準であり、安全機能そのものを通常PLCへ持たせるものではない。

## 2. コメント命名ルール

- 物理I/Oは `physical-io-map.md` の信号名称を基準とする。
- 内部Mは「役割 + 機器名 + 状態」が分かる名称にする。
- Auto / Manual / Common要求はコメント上でも区別する。
- 加工ステップは `STEP500_待機` のように工程番号と意味を併記する。
- アラームはコードを先頭に含める。
- 予備デバイスは用途確定まで `SPARE` とする。

## 3. 物理入力 X

| Device | Comment |
|---|---|
| X0 | 運転準備PB |
| X1 | 自動起動PB |
| X2 | 停止PB |
| X3 | RESET PB |
| X4 | 投入完了PB |
| X5 | 手動モードSW |
| X6 | 自動モードSW |
| X7 | ブザー停止PB |
| X10 | 安全回路OK監視 |
| X11 | エア圧OK |
| X12 | 非常停止系正常監視 |
| X13 | 安全扉閉確認 |
| X14 | ライトカーテンクリア |
| X15 | 安全リレー正常監視 |
| X16 | CV01在荷 |
| X17 | CV02在荷 |
| X20 | CV03在荷 |
| X21 | CV04在荷 |
| X22 | CV01通過 |
| X23 | CV02通過 |
| X24 | CV03通過 |
| X25 | CV04通過 |
| X26 | ST01上昇端 |
| X27 | ST01下降端 |
| X30 | ST02上昇端 |
| X31 | ST02下降端 |
| X32 | ST03上昇端 |
| X33 | ST03下降端 |
| X34 | ST04上昇端 |
| X35 | ST04下降端 |
| X36 | ST05上昇端 |
| X37 | ST05下降端 |
| X40 | 加工ST搬送位置在荷 |
| X41 | 加工治具位置在荷 |
| X42 | CY01搬送面復帰端 |
| X43 | CY01加工側端 |
| X44 | CY02後退端 |
| X45 | CY02前進端 |
| X46 | CY03解除端 |
| X47 | CY03位置決め端 |
| X50 | CY04解除端 |
| X51 | CY04クランプ端 |
| X52 | CY05上昇端 |
| X53 | CY05下降端 |
| X54 | 搬出満杯 |
| X55 | 加工ST排出通過 |
| X56 | INV01運転確認 |
| X57 | INV02運転確認 |
| X60 | INV03運転確認 |
| X61 | INV04運転確認 |
| X62 | INV01異常 |
| X63 | INV02異常 |
| X64 | INV03異常 |
| X65 | INV04異常 |
| X66 | 主軸運転確認 |
| X67 | 主軸異常 |
| X70～X77 | SPARE |

## 4. 物理出力 Y

| Device | Comment |
|---|---|
| Y0 | CV01 RUN |
| Y1 | CV02 RUN |
| Y2 | CV03 RUN |
| Y3 | CV04 RUN |
| Y4 | ST01上昇SOL |
| Y5 | ST01下降SOL |
| Y6 | ST02上昇SOL |
| Y7 | ST02下降SOL |
| Y10 | ST03上昇SOL |
| Y11 | ST03下降SOL |
| Y12 | ST04上昇SOL |
| Y13 | ST04下降SOL |
| Y14 | ST05上昇SOL |
| Y15 | ST05下降SOL |
| Y16 | CY01搬送面復帰SOL |
| Y17 | CY01加工側切替SOL |
| Y20 | CY02後退SOL |
| Y21 | CY02前進SOL |
| Y22 | CY03解除SOL |
| Y23 | CY03位置決めSOL |
| Y24 | CY04解除SOL |
| Y25 | CY04クランプSOL |
| Y26 | CY05上昇SOL |
| Y27 | CY05下降SOL |
| Y30 | 主軸RUN |
| Y31 | 投入可表示灯 |
| Y32 | 運転表示灯 |
| Y33 | 異常表示灯 |
| Y34 | ブザー |
| Y35～Y37 | SPARE |

## 5. M100帯 — 入力意味変換

M100～M167は `gxworks3-input-mapping-spec.md` を正とする。

代表：

- M100 運転準備PB
- M101 自動起動PB
- M102 停止PB
- M103 RESET PB
- M104 投入完了PB
- M110 安全回路OK
- M111 エア圧OK
- M116 CV01在荷
- M140 加工ST搬送位置在荷
- M141 加工治具位置在荷
- M142 CY01搬送面復帰端
- M152 CY05上昇端
- M166 主軸運転確認
- M167 主軸異常

### エッジ補助

- M180 運転準備PB立上り
- M181 自動起動PB立上り
- M182 停止PB立上り
- M183 RESET PB立上り
- M184 投入完了PB立上り
- M187 ブザー停止PB立上り

## 6. M200帯 — 通過検出

| Device | Comment |
|---|---|
| M200 | CV01通過SEEN |
| M201 | CV01通過COMPLETE |
| M202 | CV02通過SEEN |
| M203 | CV02通過COMPLETE |
| M204 | CV03通過SEEN |
| M205 | CV03通過COMPLETE |
| M206 | CV04通過SEEN |
| M207 | CV04通過COMPLETE |
| M208 | 加工ST排出通過SEEN |
| M209 | 加工ST排出通過COMPLETE |

## 7. M300帯 — 共通 / モード / 運転

| Device | Comment |
|---|---|
| M300 | 手動モード成立 |
| M301 | 自動モード成立 |
| M305 | 自動運転中 |
| M310 | 停止要求 |
| M320 | 運転準備条件成立 |
| M321 | 運転準備ラッチ |
| M322 | 自動起動可能 |
| M323 | 投入可条件 |
| M324 | 異常総合 |
| M325 | 警告総合 |
| M326 | ブザー要求 |
| M327 | ブザー消音状態 |
| M330 | 加工ST受入許可 |

## 8. M400帯 — 搬送

### Busy

| Device | Comment |
|---|---|
| M430 | T1_CV01→CV02_BUSY |
| M431 | T2_CV02→CV03_BUSY |
| M432 | T3_CV03→CV04_BUSY |
| M433 | T4_CV04→加工ST_BUSY |

### T1 CV01→CV02

| Device | Comment |
|---|---|
| M440 | T1_RELEASE_ST01_DOWN |
| M441 | T1_ST01_DOWN_OK |
| M442 | T1_CV01_CV02_RUN |
| M443 | T1_PASS_SEEN |
| M444 | T1_PASS_COMPLETE |
| M445 | T1_TRANSFER_OK |
| M446 | T1_RESTORE_ST01_UP |

### T2 CV02→CV03

| Device | Comment |
|---|---|
| M450 | T2_RELEASE_ST02_DOWN |
| M451 | T2_ST02_DOWN_OK |
| M452 | T2_CV02_CV03_RUN |
| M453 | T2_PASS_SEEN |
| M454 | T2_PASS_COMPLETE |
| M455 | T2_TRANSFER_OK |
| M456 | T2_RESTORE_ST02_UP |

### T3 CV03→CV04

| Device | Comment |
|---|---|
| M460 | T3_RELEASE_ST03_DOWN |
| M461 | T3_ST03_DOWN_OK |
| M462 | T3_CV03_CV04_RUN |
| M463 | T3_PASS_SEEN |
| M464 | T3_PASS_COMPLETE |
| M465 | T3_TRANSFER_OK |
| M466 | T3_RESTORE_ST03_UP |

### T4 CV04→加工ST

| Device | Comment |
|---|---|
| M470 | T4_RELEASE_ST04_DOWN |
| M471 | T4_ST04_DOWN_OK |
| M472 | T4_CV04_ST_RUN |
| M473 | T4_PASS_SEEN |
| M474 | T4_PASS_COMPLETE |
| M475 | T4_TRANSFER_OK |
| M476 | T4_RESTORE_ST04_UP |

## 9. M500帯 — 加工ステップ

| Device | Comment |
|---|---|
| M500 | STEP500_加工ST待機 |
| M501 | STEP501_搬入確認 |
| M502 | STEP502_ST05停止 |
| M503 | STEP503_搬送面切替 |
| M504 | STEP504_横移載IN |
| M505 | STEP505_位置決め |
| M506 | STEP506_クランプ |
| M507 | STEP507_主軸準備 |
| M508 | STEP508_穴あけ |
| M509 | STEP509_ドリル復帰 |
| M510 | STEP510_クランプ解除 |
| M511 | STEP511_位置決め解除 |
| M512 | STEP512_横移載RETURN |
| M513 | STEP513_搬送面復帰 |
| M514 | STEP514_搬出準備 |
| M515 | STEP515_搬出 |
| M516 | STEP516_搬出完了確認 |
| M517 | STEP517_サイクル完了 |

## 10. M700帯 — アラーム / 警告

### Alarm

- M701～M704：A101～A104 搬送タイムアウト
- M711～M715：A111～A115 ストッパー異常
- M721：A201 CY01異常
- M722：A202 CY02異常
- M723：A203 CY03異常
- M724：A204 CY04異常
- M725：A205 CY05下降異常
- M726：A206 CY05上昇異常
- M730：A210 加工位置未成立
- M731：A301 低エア圧
- M741～M744：A401～A404 INV異常
- M750：A410 主軸異常 / 運転確認異常

### Safety monitor display

- M760 E001_非常停止系正常でない
- M761 E002_安全回路OKでない
- M762 E003_安全扉開
- M763 E004_ライトカーテン遮光
- M764 E005_安全リレー正常でない

### Warning / status

- M770 搬出満杯
- M771 投入待ち
- M772 下流空き待ち
- M773 加工ST待ち
- M774 タクト超過
- M775 自動運転待機中

## 11. M800帯 — 出力要求

### Auto

- M800～M803：CV01～CV04 RUN_AUTO
- M804～M813：ST01～ST05 AUTO
- M814～M823：CY01～CY05 AUTO
- M824：主軸RUN_AUTO

### Manual

- M830～M833：CV01～CV04 RUN_MANUAL
- M834～M843：ST01～ST05 MANUAL
- M844～M853：CY01～CY05 MANUAL
- M854：主軸RUN_MANUAL

### Common

- M860～M863：CV01～CV04 RUN_COMMON
- M864～M873：ST01～ST05 COMMON
- M874～M883：CY01～CY05 COMMON
- M884：主軸RUN_COMMON

### Indication

- M890 投入可表示要求
- M891 運転表示要求
- M892 異常表示要求
- M893 ブザー出力要求

## 12. M900 / M920 / M940 / M960 / M980帯 — GOT

### M900～M913 手動操作要求

| Device | Comment |
|---|---|
| M900 | GOT_CV01_RUN_REQ |
| M901 | GOT_CV02_RUN_REQ |
| M902 | GOT_CV03_RUN_REQ |
| M903 | GOT_CV04_RUN_REQ |
| M904 | GOT_ST01_UP_REQ |
| M905 | GOT_ST01_DOWN_REQ |
| M906 | GOT_ST02_UP_REQ |
| M907 | GOT_ST02_DOWN_REQ |
| M908 | GOT_ST03_UP_REQ |
| M909 | GOT_ST03_DOWN_REQ |
| M910 | GOT_ST04_UP_REQ |
| M911 | GOT_ST04_DOWN_REQ |
| M912 | GOT_ST05_UP_REQ |
| M913 | GOT_ST05_DOWN_REQ |

### M920～M939 表示補助

| Device | Comment |
|---|---|
| M920 | GOT_AUTO_READY |
| M921 | GOT_AUTO_RUNNING |
| M922 | GOT_AUTO_STARTABLE |
| M923 | GOT_LOAD_PERMITTED |
| M924 | GOT_STATION_ACCEPTABLE |
| M925 | GOT_ALARM_ACTIVE |
| M926 | GOT_WARNING_ACTIVE |
| M927 | GOT_MANUAL_MODE |
| M928 | GOT_AUTO_MODE |
| M929 | GOT_MODE_INVALID |
| M930 | GOT_PROCESS_WORK_PRESENT |
| M931 | GOT_JIG_WORK_PRESENT |
| M932 | GOT_DISCHARGE_FULL |
| M933 | GOT_SPINDLE_RUNNING |
| M934 | GOT_SPINDLE_FAULT |
| M935 | GOT_RECOVERY_REQUIRED |
| M936 | GOT_TRANSFER_BUSY_ANY |
| M937 | GOT_PROCESS_ACTIVE |
| M938 | GOT_SETTINGS_CHANGE_PERMIT |
| M939 | SPARE |

### M940～M959 操作不可理由

| Device | Comment |
|---|---|
| M940 | BLOCK_手動モードでない |
| M941 | BLOCK_安全監視未成立 |
| M942 | BLOCK_異常中 |
| M943 | BLOCK_相反要求あり |
| M944 | BLOCK_隣接搬送動作中 |
| M945 | BLOCK_搬送先在荷あり |
| M946 | BLOCK_加工ST受入不可 |
| M947 | BLOCK_CY01位置不成立 |
| M948 | BLOCK_CY02位置不成立 |
| M949 | BLOCK_CY03位置不成立 |
| M950 | BLOCK_CY04位置不成立 |
| M951 | BLOCK_CY05位置不成立 |
| M952 | BLOCK_ワーク位置不成立 |
| M953 | BLOCK_主軸異常 |
| M954 | BLOCK_搬出満杯 |
| M955 | BLOCK_工程干渉 |
| M956～M959 | SPARE |

### M960～M979 アラーム / 履歴補助

| Device | Comment |
|---|---|
| M960 | GOT_ALARM_ACK_REQ |
| M961 | GOT_ALARM_RESET_REQ |
| M962 | GOT_BUZZER_SILENCE_REQ |
| M963 | GOT_ALARM_RESET_PERMIT |
| M964 | GOT_ALARM_RESET_BLOCKED |
| M965 | GOT_ALARM_NEW_PULSE |
| M966 | GOT_ALARM_HISTORY_EVENT |
| M967 | GOT_WARNING_NEW_PULSE |
| M968 | GOT_ALARM_PRESENT_LATCH |
| M969 | GOT_RECOVERY_GUIDE_ACTIVE |
| M970 | GOT_HISTORY_CLEAR_REQ |
| M971 | GOT_HISTORY_CLEAR_PERMIT |
| M972～M979 | SPARE |

M961はGOT RESET候補であり、物理RESET PBを正式操作とする基準を維持する。採用する場合も安全機能RESET・運転準備SET・自動起動を代替しない。

### M980～M990 加工軸手動操作要求

| Device | Comment |
|---|---|
| M980 | GOT_CY01_HOME_REQ |
| M981 | GOT_CY01_PROCESS_REQ |
| M982 | GOT_CY02_BACK_REQ |
| M983 | GOT_CY02_FWD_REQ |
| M984 | GOT_CY03_RELEASE_REQ |
| M985 | GOT_CY03_POSITION_REQ |
| M986 | GOT_CY04_RELEASE_REQ |
| M987 | GOT_CY04_CLAMP_REQ |
| M988 | GOT_CY05_UP_REQ |
| M989 | GOT_CY05_DOWN_REQ |
| M990 | GOT_SPINDLE_RUN_REQ |

GOTからYへ直接書き込まない。GOT要求はMANUAL sectionで条件確認後、M830～M854へ変換する。

## 13. Dデバイス

| Device | Comment |
|---|---|
| D100 | 現在加工ステップ番号 |
| D101 | 現在搬送状態番号 |
| D110 | 搬送タイムアウト設定 |
| D111 | 加工アクチュエータタイムアウト設定 |
| D112 | 穴あけ滞留時間設定 |
| D120 | 目標タクト |
| D200 | 総投入数 |
| D201 | 総排出数 |
| D202 | OK数_将来 |
| D203 | NG数_将来 |
| D210 | 直近サイクルタイム |
| D211 | 平均サイクルタイム |
| D212 | 最大サイクルタイム |
| D213 | 最小サイクルタイム |
| D300～D399 | 保守 / 診断 / 将来設定 |

## 14. 変更管理

デバイス番号や名称を変更する場合は、以下を同時更新する。

1. `physical-io-map.md`
2. 対応E図面
3. wiring schedule
4. 本ファイル
5. 各GX Works3仕様ファイル
6. GOTタグ / 表示

特にM440～M476、M500～M517、M700帯、M800帯、M900/M920/M940/M960/M980帯は記事・GOT・ラダーで共通参照するため、番号を途中で変更しない基準とする。
