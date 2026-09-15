# 01 Drilling Line — GX Works3 実装実績管理

Status: Active / 教材・シミュレーション実装進捗管理

## 1. 目的

Batch A～Gの設計資料が揃った後、GX Works3実プロジェクトへの入力・コメント登録・シミュレーション実績を、設計レビュー結果と分離して管理する。

重要：本資料で `DESIGN READY` は「仕様・ネットワーク・デバイス対応をGPT側で監査済み」を意味する。GX Works3実プロジェクトを実際に開いて確認していない項目を `LADDER DONE` / `SIM PASS` としない。

## 2. ステータス定義

- `DESIGN READY`：仕様・ネットワーク・デバイス対応の実装前監査済み
- `COMMENT PENDING`：GX Works3デバイスコメント未確認
- `LADDER PENDING`：GX Works3ラダー入力未確認
- `SIM PENDING`：GX Works3シミュレーション未確認
- `BLOCKED-TBD`：未確定仕様のため該当部分のみ保留

## 3. 全体進捗

| Batch | Section | 内容 | Design | Comment | Ladder | Sim | 備考 |
|---|---|---|---|---|---|---|---|
| A | 00～03 | INPUT / PASSAGE / COMMON / MODE_RUN | DESIGN READY | PENDING | PENDING | PENDING | 実入力開始対象 |
| B | 04～07 | T1～T4搬送 | DESIGN READY | PENDING | PENDING | PENDING | T4加工ST側搬送駆動TBD |
| C | 08 | PROCESS_AUTO M500～M517 | DESIGN READY | PENDING | PENDING | PENDING | M515駆動/timeout、主軸zero-speed等TBD |
| D | 09～11 | MANUAL / OUTPUT_REQUEST / ACTUAL_OUTPUT | DESIGN READY | PENDING | PENDING | PENDING | OUTPUT_PERMIT詳細、double-solenoid方式TBD |
| E | 12～13 | TIMEOUT_FAULT / WARNING_BUZZER | DESIGN READY | PENDING | PENDING | PENDING | 主軸監視時間、M515 timeout等TBD |
| F | 14 | GOT_INTERFACE | DESIGN READY | PENDING | PENDING | PENDING | D101詳細コード等TBD |
| G | 15～16 | PRODUCTION / MAINTENANCE | DESIGN READY | PENDING | PENDING | PENDING | 時間単位、保持、32bit範囲等TBD |

## 4. Batch A 実入力順

Batch Aは `gxworks3-section00-03-network-implementation-order.md` を正として、次の順でGX Works3へ入力する。

### A-01 Section 00 INPUT_PROCESS

- Network 00-01～00-08：X0～X7 → M100～M107
- Network 00-10～00-15：X10～X15 → M110～M115
- Network 00-20～00-37：X16～X37 → M116～M137
- Network 00-40～00-55：X40～X55 → M140～M155
- Network 00-56～00-67：X56～X67 → M156～M167
- Network 00-80～00-85：PB立上り M180/M181/M182/M183/M184/M187
- X70～X77はSPAREを維持

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] X→M番号ずれなし
- [ ] PB長押しで1スキャンパルスのみ

### A-02 Section 01 PASSAGE_DETECT

- CV01：M122 → M200 SEEN → M201 COMPLETE
- CV02：M123 → M202 → M203
- CV03：M124 → M204 → M205
- CV04：M125 → M206 → M207
- 排出：M155 → M208 → M209

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] raw OFF開始だけでCOMPLETEにならない
- [ ] raw ONを一度見た後のOFFでのみCOMPLETE
- [ ] COMPLETE多重発生なし

### A-03 Section 02 COMMON_SAFETY_MON

- M760～M764：安全監視表示
- M324：故障総合
- M325：警告総合
- M320：運転準備条件

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] 安全監視NGでM320 OFF
- [ ] M324でM320 OFF
- [ ] 原位置不足でM320 OFF
- [ ] M167主軸異常でM320 OFF

注意：M760～M764は安全機能そのものではなく、通常PLC側の監視・通常運転許可用。安全回路をバイパスしない。

### A-04 Section 03 MODE_RUN

- M300：手動モード
- M301：自動モード
- M321：運転準備ラッチ
- M322：自動起動可能
- M305：自動運転中
- M310：停止要求
- M323：投入可
- M330：加工ST受入許可
- M327：ブザー消音

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] 手動/自動同時成立なし
- [ ] M320だけでM321自動SETなし
- [ ] RESETだけでM321/M305自動SETなし
- [ ] 通常STOPでM305 OFF、健全ならM321保持
- [ ] 異常/安全監視喪失でM305/M321解除
- [ ] M323はM154/M770だけでグローバル禁止しない
- [ ] M330は加工ST原位置・空き・M154 OFF等が揃った時のみ成立

## 5. Batch A シミュレーション試験順

1. 全X→Mミラー
2. PB rising edge
3. passage OFF開始
4. passage ON→OFF
5. 手動/自動モード4パターン
6. M320正常成立
7. M320各阻害条件
8. M321 SET / 通常STOP保持 / 異常RESET
9. M322起動可能
10. M305起動 / STOP / 異常停止 / RESET非再始動
11. M323投入可
12. M330加工ST受入可
13. M327ブザー消音経路

## 6. Batch B 実入力順 — Section 04～07 T1～T4搬送

正本：`gxworks3-section04-07-transfer-network-implementation-order.md` / `gxworks3-batch-b-section04-07-transfer-checksheet.md`

### B-01 T1 CV01→CV02

- M430 Busy
- M440→M446 substep
- ST01 DOWN M805 / UP M804
- FB M127 / M126
- CV RUN M800 + M801
- passage M200 / M201
- 完了 `NOT M116 AND M117`
- timeout M701 / stopper fault M711

### B-02 T2 CV02→CV03

- M431 Busy
- M450→M456
- ST02 DOWN M807 / UP M806
- FB M131 / M130
- CV RUN M801 + M802
- passage M202 / M203
- 完了 `NOT M117 AND M120`
- timeout M702 / M712

### B-03 T3 CV03→CV04

- M432 Busy
- M460→M466
- ST03 DOWN M809 / UP M808
- FB M133 / M132
- CV RUN M802 + M803
- passage M204 / M205
- 完了 `NOT M120 AND M121`
- timeout M703 / M713

### B-04 T4 CV04→加工ST

- M433 Busy
- M470→M476
- 開始時M330必須
- ST04 DOWN M811 / UP M810
- FB M135 / M134
- CV04側RUN M803
- passage M206 / M207
- 完了 `NOT M121 AND M140`
- M475を責任移管点
- timeout M704 / M714
- 加工ST側搬送駆動はTBDのため架空Y/Mを追加しない

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認 T1
- [ ] LADDER入力確認 T2
- [ ] LADDER入力確認 T3
- [ ] LADDER入力確認 T4
- [ ] 隣接排他 T1+T2 / T2+T3 / T3+T4
- [ ] 非隣接 T1+T3 / T2+T4
- [ ] T1+T4は未保証のまま
- [ ] passage OFF単独で完了しない
- [ ] normal stopでBusy/substepを blanket resetしない
- [ ] fault後に位置未確認で自動再開しない

Batch B判定：`DESIGN READY / INPUT PENDING`。T4加工ST側搬送駆動は `BLOCKED-TBD`。

## 7. Batch C 実入力順 — Section 08 PROCESS_AUTO

正本：`gxworks3-section08-process-auto-network-implementation-order.md` / `gxworks3-batch-c-section08-process-checksheet.md`

### C-01 one-hot / 初期化

- M500～M517をone-hot管理
- 初期M500は初期化時のみ候補
- STOP/RESETだけでM500へ戻さない
- 複数STEP成立を正常扱いしない

### C-02 工程入力順

`M500→M501→...→M517→M500`

主要確認：

- M502 ST05
- M503 CY01 surface switch
- M504 CY02 lateral in + M141
- M505 CY03 position
- M506 CY04 clamp
- M507 spindle prep + M166
- M508 drill + CY05 down + D112 dwell
- M509 CY05 up / spindle request release
- M510 unclamp
- M511 position release
- M512 lateral return
- M513 surface restore
- M514 discharge prep / M154 full wait
- M515 discharge / M209 passage complete
- M516 station clear check
- M517 cycle complete

実績：

- [ ] COMMENT登録確認
- [ ] LADDER one-hot確認
- [ ] LADDER M500～M517遷移確認
- [ ] 各動作でcommand→FB後に次STEP
- [ ] M324中に正常遷移しない
- [ ] STOPでSTEP保持
- [ ] RESETだけで次STEPへ進まない
- [ ] M154は故障化せずM514待機
- [ ] M166 OFFをzero-speedと扱わない
- [ ] M515に架空搬出駆動を追加しない

Batch C判定：`DESIGN READY / INPUT PENDING`。M515駆動/専用timeout、主軸zero-speed、D112正式単位、double-solenoid方式は `BLOCKED-TBD`。

## 8. Batch D 実入力順 — Section 09～11 MANUAL / OUTPUT

正本：`gxworks3-manual-network-full-map.md` / `gxworks3-output-request-full-map.md` / `gxworks3-actual-output-full-map.md` / `gxworks3-batch-d-section09-11-manual-output-checksheet.md`

### D-01 MANUAL

経路：

`GOT req → M830～M854 MANUAL → M860～M884 COMMON → Y → FB`

対象：CV01～04、ST01～05、CY01～05、主軸。

共通手動条件は、手動モード・自動停止・異常なし・通常PLC側の安全監視成立を基準とし、M111エア圧は空圧動作ごとの個別条件として扱う。

### D-02 OUTPUT_REQUEST

- AUTO M800帯 + MANUAL M830帯 → COMMON M860帯
- ST/CY相反ペアは両要求同時時COMMON両OFF
- 主軸 M824/M854 → M884
- lamp/buzzer M890～M893

### D-03 ACTUAL_OUTPUT

- Y0～Y34はSection 11だけで駆動
- ST/CY相反ペアは最終段でも排他
- GOT→Y直接書込なし
- RESET→自動再始動なし

実績：

- [ ] COMMENT登録確認
- [ ] MANUAL経路全点追跡
- [ ] AUTO/MANUAL→COMMON全点追跡
- [ ] COMMON→Y全点追跡
- [ ] Y二重コイルなし
- [ ] 相反要求時両Y OFF
- [ ] M940～M955 BLOCK理由表示
- [ ] 画面切替後のGOT要求残留なし
- [ ] CV04手動受入判定がM330直流用ではないこと確認

Batch D判定：`DESIGN READY / INPUT PENDING`。各OUTPUT_PERMIT最終条件、double-solenoid hold/pulse方式、manual JOG最終意味は一部 `BLOCKED-TBD`。

## 9. Batch E 実入力順 — Section 12～13 FAULT / WARNING

正本：`gxworks3-timeout-fault-full-map.md` / `gxworks3-warning-buzzer-full-map.md` / `gxworks3-batch-e-section12-13-fault-warning-checksheet.md`

### E-01 TIMEOUT_FAULT

- M701～M704：T1～T4搬送
- M711～M715：ST01～05
- M721～M726：CY01～05
- M730：加工位置
- M731：低エア
- M741～M744：INV01～04
- M750：主軸
- M324：異常総合

監視はcommand成立かつ期待FB未成立で開始し、時間だけで工程を進めない。

### E-02 RESET

- 原因復旧済みのみ解除
- RESETでM305/M321をSETしない
- passage/Busy/ワーク位置不明時は自動再開しない
- 複数異常時は解除可能なものだけ解除

### E-03 WARNING_BUZZER

- M770～M775：警告/待ち
- M325：警告総合
- M326：ブザー要求
- M327：消音
- M893→Y34
- 警告だけでM324へ昇格しない
- 消音はalarm latch/historyを解除しない

実績：

- [ ] COMMENT登録確認
- [ ] 全fault立上り1回確認
- [ ] M324集約確認
- [ ] cause restored条件付きRESET確認
- [ ] warningのみでM305保持
- [ ] M154→M770/M325、M324 OFF
- [ ] new alarmでbuzzer再鳴動
- [ ] muteでY34だけ停止

Batch E判定：`DESIGN READY / INPUT PENDING`。主軸start monitor設定値、M515専用timeout、ST/CY監視時間分離、M326正式SET/RST方式は一部 `BLOCKED-TBD`。

## 10. Batch F 実入力順 — Section 14 GOT_INTERFACE

正本：`gxworks3-got-linkage-logic-spec.md` / `gxworks3-batch-f-section14-got-interface-checksheet.md`

### F-01 表示補助

- M920～M938 status
- M929 mode invalid
- M934 spindle fault status
- M935 recovery required
- M936 transfer active
- M937 process active
- M938 settings machine-side permit

### F-02 BLOCK理由

- M940～M955
- M946はAUTO専用M330を直接流用せず、手動専用 `MANUAL_STATION_ACCEPT_OK` で判定

### F-03 alarm/HMI helper

- M960 ACK req
- M961 GOT RESET req candidate
- M962 buzzer mute req
- M963/M964 RESET permit/blocked
- M965 new alarm pulse
- M967 new warning pulse
- M968 alarm active helper
- M969 recovery guidance
- M970 history clear req
- M971 history clear permit

### F-04 display data

- D100 current process step
- D101 transfer display; 同時搬送を完全表現しないためM430～M433 Busyを正として併記

実績：

- [ ] COMMENT登録確認
- [ ] M920～M938追従
- [ ] M940～M955要求時BLOCK理由
- [ ] M961 RESET後自動再始動なし
- [ ] M962でalarm/historyを消さない
- [ ] M970で設備制御状態を変えない
- [ ] M938だけでGOT権限成立としない
- [ ] GOTからY直接writeなし

Batch F判定：`DESIGN READY / INPUT PENDING`。D101詳細コード、M935詳細位置不整合、GOT権限最終組合せは `BLOCKED-TBD`。

## 11. Batch G 実入力順 — Section 15～16 PRODUCTION / MAINTENANCE

正本：`gxworks3-production-takt-full-map.md` / `gxworks3-maintenance-device-map.md` / `gxworks3-batch-g-section15-16-production-maintenance-checksheet.md`

### G-01 PRODUCTION_TAKT

- D120 target takt
- D200 accepted load count
- D201 discharge complete count
- D202/D203 OK/NG reserve
- D210 latest cycle
- D211 average
- D212 max
- D213 min

ルール：

- M184押下だけでD200を増やさない
- M116実在荷まで確認したaccepted eventで1回
- M517保持でD201多重加算しない
- 品質入力なしのためD202/D203を推定更新しない
- 中断サイクルを正常統計へ入れない

### G-02 MAINTENANCE

- D300～D305 runtime
- D310～D319 mechanism counts
- D330～D351 fault counts
- D360～D365 diagnostic/recovery counts
- event/rising edgeで1回だけcount
- 主軸runtimeはM166実FBを優先
- Section 16からY/M305/M321/alarm resetへ干渉しない

実績：

- [ ] COMMENT登録確認
- [ ] D200/D201 one-shot count
- [ ] D202/D203予約維持
- [ ] D210～D213正常完了時のみ更新
- [ ] M774が単独でM305停止を起こさない
- [ ] FB保持でD310～D319多重加算なし
- [ ] alarm latch保持でD330～D351多重加算なし
- [ ] D360/D361 event count確認
- [ ] Section16が制御出力へ影響しない

Batch G判定：`DESIGN READY / INPUT PENDING`。時間単位、累積用work device、保持範囲、32bit化、統計clear、将来OK/NGは `BLOCKED-TBD`。

## 12. 推奨実装・シミュレーション順

GX Works3実プロジェクトでは次の順を維持する。

1. Batch A Section 00～03
2. Batch B Section 04～07
3. Batch C Section 08
4. Batch D Section 09～11
5. Batch E Section 12～13
6. Batch F Section 14
7. Batch G Section 15～16

各Batchで `COMMENT → LADDER → SIM` の順に確認し、前Batchの基本経路が成立する前に後Batchの不具合を無理に追わない。

## 13. 全Batch共通SIM合格条件

- [ ] X→M番号対応にズレなし
- [ ] 二重コイルなし
- [ ] passage OFF単独完了なし
- [ ] command→feedback前に次stepへ進まない
- [ ] adjacent transfer同時起動なし
- [ ] normal stopで必要なstep/busy保持
- [ ] faultでM305解除、RESETのみでrestartなし
- [ ] manual/auto出力はCOMMON経由
- [ ] paired solenoid相反同時Yなし
- [ ] warningとfaultを混同しない
- [ ] GOTからY直接writeなし
- [ ] counter/event多重加算なし
- [ ] TBDを架空deviceで埋めていない

## 14. 現在の判定

現時点は全Batch共通で：

- 設計監査：完了
- コメント実登録：未確認
- ラダー実入力：未確認
- GX Works3シミュレーション：未確認

したがって全体状態は `DESIGN READY / INPUT PENDING`。

## 15. 次の更新条件

GX Works3実プロジェクトのスクリーンショット、エクスポート、プロジェクトファイル、または入力済みネットワーク情報を確認できた時点で、該当Batch・Sectionだけ `COMMENT DONE` / `LADDER DONE` / `SIM PASS` へ更新する。

未確認の実績をGPT側の設計チェックだけで完了扱いにしない。

## 16. 実機境界

この進捗表は教材・シミュレーション用PLCロジックの管理であり、実機投入可否を示さない。安全設計、主回路保護、電源条件、配線・施工、採用機器の正式仕様は資格・責任を持つ設計者が最新メーカー資料と現地条件・リスクアセスメントを基に別途確認する。
