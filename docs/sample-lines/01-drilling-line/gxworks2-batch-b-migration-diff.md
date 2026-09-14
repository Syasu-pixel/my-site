# 01 Drilling Line — GX Works2 Batch B 搬送移行差分

Status: Active / 教材・シミュレーション移行基準

## 1. 目的

GX Works3基準で整理済みのSection 04～07、T1～T4搬送ロジックを、GX Works2 + FX3U版へ移植する際の差分を固定する。

本資料は既存の搬送ロジックを作り直すためのものではない。制御思想・内部M・搬送サブステップは極力維持し、GX Works2/FX3U固有の命令・タイマ・I/O構成だけを差分として管理する。

参照元：

- `gxworks3-section04-07-transfer-network-implementation-order.md`
- `gxworks3-batch-b-network-entry-record.md`
- `gxworks3-batch-b-section04-07-transfer-checksheet.md`
- `gxworks2-fx3u-target-spec.md`
- `physical-io-map.md`

## 2. 結論

Batch Bの主要ロジックはGX Works2版でも維持する。

維持対象：

- Busy：M430～M433
- T1サブステップ：M440～M446
- T2：M450～M456
- T3：M460～M466
- T4：M470～M476
- passage seen/complete：M200～M207
- AUTO出力要求：M800～M811の既存割付
- 搬送異常：M701～M704
- ストッパー異常：M711～M714
- 隣接搬送排他
- 通常STOPでサブステップを無条件RESETしない方針

したがって搬送シーケンスの再設計は不要。

## 3. GX Works2でそのまま移植するネットワーク論理

### T1 CV01→CV02

開始条件：

`M305 & M321 & M116 & !M117 & !M430 & !M431 & !M324`

搬送順：

`M440 → M441 → M442 → M443 → M444 → M445 → M446 → END`

主要デバイス：

- Busy M430
- ST01 DOWN要求 M805
- DOWN FB M127
- CV01/CV02 RUN要求 M800/M801
- PASS SEEN M200
- PASS COMPLETE M201
- 完了条件 `!M116 & M117`
- ST01 UP要求 M804
- UP FB M126
- transfer alarm M701
- stopper alarm M711

### T2 CV02→CV03

開始条件：

`M305 & M321 & M117 & !M120 & !M431 & !M430 & !M432 & !M324`

搬送順：

`M450 → M451 → M452 → M453 → M454 → M455 → M456 → END`

主要デバイス：M431、M807/M806、M131/M130、M801/M802、M202/M203、M702/M712。

### T3 CV03→CV04

開始条件：

`M305 & M321 & M120 & !M121 & !M432 & !M431 & !M433 & !M324`

搬送順：

`M460 → M461 → M462 → M463 → M464 → M465 → M466 → END`

主要デバイス：M432、M809/M808、M133/M132、M802/M803、M204/M205、M703/M713。

### T4 CV04→加工ST

開始条件：

`M305 & M321 & M121 & !M140 & M330 & !M433 & !M432 & !M324`

搬送順：

`M470 → M471 → M472 → M473 → M474 → M475 → M476 → END`

主要デバイス：

- Busy M433
- ST04 DOWN/UP M811/M810
- FB M135/M134
- CV04 RUN M803
- passage M206/M207
- 完了 `!M121 & M140`
- transfer alarm M704
- stopper alarm M714

加工ST側の未確定搬送出力はGX Works2移行時にも追加しない。

## 4. 隣接排他

GX Works2版でも次を維持する。

- T1はT2 Busy M431で開始禁止
- T2はT1/T3 Busy M430/M432で開始禁止
- T3はT2/T4 Busy M431/M433で開始禁止
- T4はT3 Busy M432で開始禁止

非隣接同時搬送として設計上確認するもの：

- T1 + T3
- T2 + T4

T1 + T4は現時点では積極的な同時運転保証に含めない。

## 5. GX Works2 / FX3Uで再確認する差分

### W2-B-01 SET/RST命令

M430～M476のSET/RSTはGX Works2 + FX3Uで使用可能な標準命令として実入力確認する。

設計資料上のSET/RST表現をそのままSIM PASSにはしない。

### W2-B-02 passage立下り生成

Batch A側でM201/M203/M205/M207を生成する正式なGX Works2命令形式を確認する。

原則は「SEENフラグON後に入力OFFとなった1スキャン完了イベント」。

センサOFF単独で搬送完了を作らない。

### W2-B-03 タイムアウト命令

D110は設定値として維持候補だが、FX3Uでの実タイマデバイス、時間基準、設定値との対応をGX Works2プロジェクト側で確定する。

未確定タイマ番号を新規に推測割付しない。

### W2-B-04 実X/Y割付

内部Mによる搬送ロジックは維持する。

ただしFX3U-80MT/DS + FX2N-16EXの実I/O割付確定後、次の物理入力が既存論理Mへ正しくマッピングされていることを確認する。

- CV1～4 presence
- passage1～4
- ST01～04 UP/DOWN FB
- station transport presence

実YはSection 10/11相当の共通出力処理へ集約する方針を維持する。

### W2-B-05 通常STOP後の再開

M305 OFF時にBusy/サブステップを一括RESETしない設計を維持する。

GX Simulator2では途中停止→再開時に、保持されたサブステップと模擬FBが整合しない場合に勝手に次工程へ進まないことを確認する。

### W2-B-06 異常時

M701～M704またはM711～M714成立時に、新しい搬送開始および自動サブステップ遷移を抑止する。

RESET操作だけでBusyを消さない。

## 6. GX Works2入力順

Batch Bは次の順で入力する。

1. T1 START / Busy / RELEASE
2. T1 FB遷移 / RUN / PASS / COMPLETE / RESTORE
3. T2
4. T3
5. T4
6. 隣接排他確認
7. timeout連携
8. STOP/FAULT/RESET挙動
9. 非隣接同時搬送SIM

各区間ごとに `COMMENT → LADDER → SIM` を記録する。

## 7. GX Simulator2試験候補

実SIM実施前は全て未確認扱い。

- B-W2-SIM-01 T1正常搬送
- B-W2-SIM-02 T2正常搬送
- B-W2-SIM-03 T3正常搬送
- B-W2-SIM-04 T4正常搬送
- B-W2-SIM-05 passage OFFのみでCOMPLETEしない
- B-W2-SIM-06 passage ON→OFFで1回だけCOMPLETE
- B-W2-SIM-07 source OFFだけでは完了しない
- B-W2-SIM-08 destination ONだけでは完了しない
- B-W2-SIM-09 T1中にT2開始しない
- B-W2-SIM-10 T2中にT3開始しない
- B-W2-SIM-11 T3中にT4開始しない
- B-W2-SIM-12 T1 + T3同時搬送
- B-W2-SIM-13 T2 + T4同時搬送
- B-W2-SIM-14 通常STOPでBusy/step保持
- B-W2-SIM-15 再開時FB不整合なら進まない
- B-W2-SIM-16 transfer timeoutでM701～704
- B-W2-SIM-17 stopper timeoutでM711～714
- B-W2-SIM-18 RESETだけでBusy消去しない

## 8. Batch Bの未解決事項

- FX3U版の実タイマデバイス割付と時間単位
- GX Works2で採用する立下り1ショットの正式命令形式
- T4加工ST側正式搬送駆動方式
- T1 + T4同時運転の正式保証可否
- 停止中の出力保持/解除に関するSection 10/11側最終ポリシー

これらは未確定のまま空きデバイスを推測割付しない。

## 9. 現在判定

- Batch B制御思想：移行可能
- 内部M構成：維持可能候補
- GX Works2ラダー入力：未確認
- GX Simulator2：未確認

現在は **BATCH B LOGIC MIGRATION READY / GX WORKS2 INPUT PENDING / SIM PENDING** とする。
