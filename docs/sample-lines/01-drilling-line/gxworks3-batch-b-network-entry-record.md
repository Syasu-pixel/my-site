# 01 Drilling Line — GX Works3 Batch B Network Entry Record

Status: Active / 教材・シミュレーション実装記録用

## 1. 目的

Batch B（Section 04～07 / T1～T4搬送）をGX Works3へ実入力する際に、各ネットワーク単位で `COMMENT / LADDER / SIM` の実績を記録する。

本記録は設計監査結果とGX Works3実プロジェクト上の実績を分離する。未確認項目を完了扱いにしない。

## 2. 共通ルール

- T1～T4は Busy → stopper release → motor run → passage seen → passage complete → source OFF + destination ON → restore の順で確認する。
- passage OFF単独では搬送完了にしない。
- 通常停止や異常時にBusy/サブステップを一括初期化しない。
- 隣接搬送は同時開始させない。
- 非隣接の T1+T3 / T2+T4 は同時成立試験対象。
- T4加工ST側の未確定駆動は勝手に追加しない。
- 安全機能そのものは通常PLCで成立させない。

## 3. Section 04 — T1 CV01→CV02

| Network | 内容 | 主デバイス | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 04-01 | START CONDITION | M305,M321,M116,!M117,!M430,!M431,!M324 | [ ] | [ ] | [ ] |
| 04-02 | Busy / RELEASE SET | M430,M440 | [ ] | [ ] | [ ] |
| 04-03 | ST01 DOWN要求 | M805 | [ ] | [ ] | [ ] |
| 04-04 | DOWN FB遷移 | M127→M441 | [ ] | [ ] | [ ] |
| 04-05 | RUN STEP | M442 | [ ] | [ ] | [ ] |
| 04-06 | CV01/CV02 RUN要求 | M800,M801 | [ ] | [ ] | [ ] |
| 04-07 | PASS SEEN | M200→M443 | [ ] | [ ] | [ ] |
| 04-08 | PASS COMPLETE | M201→M444 | [ ] | [ ] | [ ] |
| 04-09 | TRANSFER OK | !M116 & M117→M445 | [ ] | [ ] | [ ] |
| 04-10 | RESTORE | M446 | [ ] | [ ] | [ ] |
| 04-11 | ST01 UP要求 | M804 | [ ] | [ ] | [ ] |
| 04-12 | END | M126→RST M446/M430 | [ ] | [ ] | [ ] |

T1確認：

- [ ] M126/M127同時成立時に正常遷移しない。
- [ ] M201だけでは完了せず、source OFF + destination ONが必要。
- [ ] RESTOREへ入る前後でM800/M801が解除される。
- [ ] M701/M711成立時に正常進行しない。

## 4. Section 05 — T2 CV02→CV03

| Network | 内容 | 主デバイス | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 05-01 | START CONDITION | M305,M321,M117,!M120,!M431,!M430,!M432,!M324 | [ ] | [ ] | [ ] |
| 05-02 | Busy / RELEASE SET | M431,M450 | [ ] | [ ] | [ ] |
| 05-03 | ST02 DOWN要求 | M807 | [ ] | [ ] | [ ] |
| 05-04 | DOWN FB遷移 | M131→M451 | [ ] | [ ] | [ ] |
| 05-05 | RUN STEP | M452 | [ ] | [ ] | [ ] |
| 05-06 | CV02/CV03 RUN要求 | M801,M802 | [ ] | [ ] | [ ] |
| 05-07 | PASS SEEN | M202→M453 | [ ] | [ ] | [ ] |
| 05-08 | PASS COMPLETE | M203→M454 | [ ] | [ ] | [ ] |
| 05-09 | TRANSFER OK | !M117 & M120→M455 | [ ] | [ ] | [ ] |
| 05-10 | RESTORE | M456 | [ ] | [ ] | [ ] |
| 05-11 | ST02 UP要求 | M806 | [ ] | [ ] | [ ] |
| 05-12 | END | M130→RST M456/M431 | [ ] | [ ] | [ ] |

T2確認：

- [ ] T1 Busy M430中はT2開始不可。
- [ ] T3 Busy M432中はT2開始不可。
- [ ] M702/M712成立時に正常進行しない。

## 5. Section 06 — T3 CV03→CV04

| Network | 内容 | 主デバイス | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 06-01 | START CONDITION | M305,M321,M120,!M121,!M432,!M431,!M433,!M324 | [ ] | [ ] | [ ] |
| 06-02 | Busy / RELEASE SET | M432,M460 | [ ] | [ ] | [ ] |
| 06-03 | ST03 DOWN要求 | M809 | [ ] | [ ] | [ ] |
| 06-04 | DOWN FB遷移 | M133→M461 | [ ] | [ ] | [ ] |
| 06-05 | RUN STEP | M462 | [ ] | [ ] | [ ] |
| 06-06 | CV03/CV04 RUN要求 | M802,M803 | [ ] | [ ] | [ ] |
| 06-07 | PASS SEEN | M204→M463 | [ ] | [ ] | [ ] |
| 06-08 | PASS COMPLETE | M205→M464 | [ ] | [ ] | [ ] |
| 06-09 | TRANSFER OK | !M120 & M121→M465 | [ ] | [ ] | [ ] |
| 06-10 | RESTORE | M466 | [ ] | [ ] | [ ] |
| 06-11 | ST03 UP要求 | M808 | [ ] | [ ] | [ ] |
| 06-12 | END | M132→RST M466/M432 | [ ] | [ ] | [ ] |

T3確認：

- [ ] T2 Busy M431中はT3開始不可。
- [ ] T4 Busy M433中はT3開始不可。
- [ ] M703/M713成立時に正常進行しない。

## 6. Section 07 — T4 CV04→加工ST

| Network | 内容 | 主デバイス | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 07-01 | START CONDITION | M305,M321,M121,!M140,M330,!M433,!M432,!M324 | [ ] | [ ] | [ ] |
| 07-02 | Busy / RELEASE SET | M433,M470 | [ ] | [ ] | [ ] |
| 07-03 | ST04 DOWN要求 | M811 | [ ] | [ ] | [ ] |
| 07-04 | DOWN FB遷移 | M135→M471 | [ ] | [ ] | [ ] |
| 07-05 | RUN STEP | M472 | [ ] | [ ] | [ ] |
| 07-06 | CV04 RUN要求 | M803 | [ ] | [ ] | [ ] |
| 07-07 | PASS SEEN | M206→M473 | [ ] | [ ] | [ ] |
| 07-08 | PASS COMPLETE | M207→M474 | [ ] | [ ] | [ ] |
| 07-09 | TRANSFER OK / responsibility handoff | !M121 & M140→M475 | [ ] | [ ] | [ ] |
| 07-10 | RESTORE | M476 | [ ] | [ ] | [ ] |
| 07-11 | ST04 UP要求 | M810 | [ ] | [ ] | [ ] |
| 07-12 | END | M134→RST M476/M433 | [ ] | [ ] | [ ] |

T4確認：

- [ ] M330 OFFではT4開始しない。
- [ ] M475を搬送側→加工ST側の責任移管点として確認。
- [ ] 未確定の加工ST側駆動Y/Mを追加していない。
- [ ] M704/M714成立時に正常進行しない。

## 7. 隣接排他 / 非隣接同時搬送試験

| Test | 条件 | 期待結果 | SIM |
|---|---|---|---|
| B-SIM-01 | T1動作中にT2開始条件成立 | T2開始しない | [ ] |
| B-SIM-02 | T2動作中にT3開始条件成立 | T3開始しない | [ ] |
| B-SIM-03 | T3動作中にT4開始条件成立 | T4開始しない | [ ] |
| B-SIM-04 | T1 + T3開始条件同時成立 | 両方開始可能 | [ ] |
| B-SIM-05 | T2 + T4開始条件同時成立 | 両方開始可能 | [ ] |
| B-SIM-06 | T1 + T4 | 積極的な同時運転保証はしない | [ ] |

## 8. passage / presence 試験

| Test | 条件 | 期待結果 | SIM |
|---|---|---|---|
| B-SIM-07 | passage raw OFFのまま | PASS COMPLETEにならない | [ ] |
| B-SIM-08 | passage ONのみ | SEEN成立、COMPLETE未成立 | [ ] |
| B-SIM-09 | passage ON→OFF | COMPLETE成立 | [ ] |
| B-SIM-10 | COMPLETE成立後もsource ON | TRANSFER OKへ進まない | [ ] |
| B-SIM-11 | COMPLETE成立後dest OFF | TRANSFER OKへ進まない | [ ] |
| B-SIM-12 | COMPLETE + source OFF + dest ON | TRANSFER OK成立 | [ ] |

## 9. STOP / FAULT / RECOVERY 試験

| Test | 条件 | 期待結果 | SIM |
|---|---|---|---|
| B-SIM-13 | 搬送途中で通常STOP | Busy/サブステップを無条件RESETしない | [ ] |
| B-SIM-14 | STOP後に条件復旧 | 状態整合確認後に再開可能 | [ ] |
| B-SIM-15 | M701～M704発生 | 次搬送へ自動進行しない | [ ] |
| B-SIM-16 | M711～M714発生 | stopper異常状態で進行しない | [ ] |
| B-SIM-17 | RESETのみ | Busyを勝手に消去しない | [ ] |
| B-SIM-18 | work位置不整合 | 手動復旧対象として扱う | [ ] |

## 10. タイムアウト連携記録

- [ ] T1 RUN window M442～M445 → M701監視
- [ ] T2 RUN window M452～M455 → M702監視
- [ ] T3 RUN window M462～M465 → M703監視
- [ ] T4 RUN window M472～M475 → M704監視
- [ ] T1 stopper M440/M446 → M711監視
- [ ] T2 stopper M450/M456 → M712監視
- [ ] T3 stopper M460/M466 → M713監視
- [ ] T4 stopper M470/M476 → M714監視

D110は監視設定値として扱い、実タイマデバイス番号は未登録番号を勝手に使用しない。

## 11. Batch B 合格条件

Batch Bを `LADDER DONE / SIM PASS` とするには最低限以下を満たす。

- [ ] 04-01～07-12の必要ネットワーク入力確認済み
- [ ] M430～M433 Busyが各区間で一元SET/RESET
- [ ] M440～M476サブステップのone-hot性確認
- [ ] passage seen → falling edge → presence確認の順序が維持される
- [ ] 隣接排他試験合格
- [ ] T1+T3 / T2+T4同時搬送試験合格
- [ ] STOP/FAULT時の状態保持方針確認
- [ ] M701～M704 / M711～M714連携確認
- [ ] T4加工ST側未確定駆動を架空実装していない

## 12. 現在ステータス

- Design review: DONE
- COMMENT: PENDING
- LADDER: PENDING
- SIM: PENDING
- T4 station-side drive: BLOCKED-TBD

GX Works3実プロジェクト上の証跡を確認するまで、PENDING項目を完了扱いにしない。
