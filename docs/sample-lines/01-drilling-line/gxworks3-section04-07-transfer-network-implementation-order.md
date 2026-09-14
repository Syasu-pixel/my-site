# 01 Drilling Line — GX Works3 Section 04～07 搬送ネットワーク実装順

Status: Draft / 教材・シミュレーション実装直前基準

## 1. 目的

Section 04～07のT1～T4搬送を、M430～M433 BusyとM440～M476サブステップを使って、GX Works3へそのまま組み始めやすいネットワーク順に固定する。

本仕様は通常PLCの教材・シミュレーション用であり、安全機能そのものを通常PLCで成立させない。

## 2. 共通ルール

各搬送区間は次の順で統一する。

1. START CONDITION
2. BUSY SET
3. RELEASE STEP SET
4. STOPPER DOWN要求
5. DOWN FB確認
6. RUN STEP SET
7. 搬送モータAUTO要求
8. PASS SEEN
9. PASS COMPLETE
10. SOURCE OFF + DEST ON確認
11. TRANSFER OK
12. RUN解除
13. RESTORE STEP
14. STOPPER UP要求
15. UP FB確認
16. Busy RESET

通過完了はセンサOFF単独では成立させず、必ずSEEN後のOFFで生成されたM201/M203/M205/M207を使う。

サブステップは通常停止や異常で無条件クリアしない。復旧時は実センサ状態との整合を確認する。

## 3. Section 04 — T1 CV01→CV02

### Network 04-01 START CONDITION

開始条件：

```text
M305
AND M321
AND M116
AND NOT M117
AND NOT M430
AND NOT M431
AND NOT M324
----------------------------------( T1_START )
```

`T1_START` は説明用論理名であり、専用Mを追加する場合は別途正式割付する。未登録Mを勝手に使用しない。

### Network 04-02 Busy SET

```text
T1_START -------------------------( SET M430 )
T1_START -------------------------( SET M440 )
```

M430：T1 BUSY
M440：T1_RELEASE_ST01_DOWN

### Network 04-03 ST01 DOWN要求

```text
M440 AND M430 AND NOT M701 AND NOT M711
----------------------------------( M805 )
```

### Network 04-04 DOWN FB遷移

```text
M440 AND M127
----------------------------------( SET M441 )
----------------------------------( RST M440 )
```

M126/M127同時成立は正常遷移扱いにしない。

### Network 04-05 RUN STEP遷移

```text
M441 AND M127 AND NOT M324
----------------------------------( SET M442 )
----------------------------------( RST M441 )
```

### Network 04-06 CV01/CV02 AUTO RUN要求

```text
M442 OR M443 OR M444 OR M445 ----( M800 )
M442 OR M443 OR M444 OR M445 ----( M801 )
```

### Network 04-07 PASS SEEN

```text
M442 AND M200 --------------------( SET M443 )
----------------------------------( RST M442 )
```

### Network 04-08 PASS COMPLETE

```text
M443 AND M201 --------------------( SET M444 )
----------------------------------( RST M443 )
```

### Network 04-09 TRANSFER OK

```text
M444 AND NOT M116 AND M117
----------------------------------( SET M445 )
----------------------------------( RST M444 )
```

### Network 04-10 RESTORE

```text
M445
----------------------------------( SET M446 )
----------------------------------( RST M445 )
```

M446に入るとM800/M801は解除される。

### Network 04-11 ST01 UP要求

```text
M446 AND NOT M701 AND NOT M711 ----( M804 )
```

### Network 04-12 T1 END

```text
M446 AND M126
----------------------------------( RST M446 )
----------------------------------( RST M430 )
```

## 4. Section 05 — T2 CV02→CV03

### Network 05-01 START CONDITION

```text
M305
AND M321
AND M117
AND NOT M120
AND NOT M431
AND NOT M430
AND NOT M432
AND NOT M324
----------------------------------( T2_START )
```

### Network 05-02～05-12

T1と同じ順序で以下を使う。

| 機能 | T2 |
|---|---|
| Busy | M431 |
| RELEASE | M450 |
| DOWN_OK | M451 |
| RUN | M452 |
| PASS_SEEN | M453 |
| PASS_COMPLETE | M454 |
| TRANSFER_OK | M455 |
| RESTORE | M456 |
| ST DOWN req | M807 |
| ST UP req | M806 |
| DOWN FB | M131 |
| UP FB | M130 |
| RUN req | M801 + M802 |
| PASS SEEN | M202 |
| PASS COMPLETE | M203 |
| Complete presence | NOT M117 AND M120 |
| Transfer alarm | M702 |
| Stopper alarm | M712 |

遷移順は `M450→451→452→453→454→455→456→END` とする。

## 5. Section 06 — T3 CV03→CV04

### Network 06-01 START CONDITION

```text
M305
AND M321
AND M120
AND NOT M121
AND NOT M432
AND NOT M431
AND NOT M433
AND NOT M324
----------------------------------( T3_START )
```

### Network 06-02～06-12

| 機能 | T3 |
|---|---|
| Busy | M432 |
| RELEASE | M460 |
| DOWN_OK | M461 |
| RUN | M462 |
| PASS_SEEN | M463 |
| PASS_COMPLETE | M464 |
| TRANSFER_OK | M465 |
| RESTORE | M466 |
| ST DOWN req | M809 |
| ST UP req | M808 |
| DOWN FB | M133 |
| UP FB | M132 |
| RUN req | M802 + M803 |
| PASS SEEN | M204 |
| PASS COMPLETE | M205 |
| Complete presence | NOT M120 AND M121 |
| Transfer alarm | M703 |
| Stopper alarm | M713 |

遷移順は `M460→461→462→463→464→465→466→END` とする。

## 6. Section 07 — T4 CV04→加工ST

### Network 07-01 START CONDITION

```text
M305
AND M321
AND M121
AND NOT M140
AND M330
AND NOT M433
AND NOT M432
AND NOT M324
----------------------------------( T4_START )
```

### Network 07-02 Busy / RELEASE

```text
T4_START -------------------------( SET M433 )
T4_START -------------------------( SET M470 )
```

### Network 07-03 ST04 DOWN要求

```text
M470 AND M433 AND NOT M704 AND NOT M714
----------------------------------( M811 )
```

### Network 07-04 DOWN FB遷移

```text
M470 AND M135
----------------------------------( SET M471 )
----------------------------------( RST M470 )
```

### Network 07-05 RUN STEP

```text
M471 AND M135 AND M330 AND NOT M324
----------------------------------( SET M472 )
----------------------------------( RST M471 )
```

### Network 07-06 CV04 AUTO RUN要求

```text
M472 OR M473 OR M474 OR M475 ----( M803 )
```

加工ST側搬送要求は正式な出力デバイスが未確定のため、本仕様では追加しない。

### Network 07-07 PASS SEEN

```text
M472 AND M206 --------------------( SET M473 )
----------------------------------( RST M472 )
```

### Network 07-08 PASS COMPLETE

```text
M473 AND M207 --------------------( SET M474 )
----------------------------------( RST M473 )
```

### Network 07-09 TRANSFER OK

```text
M474 AND NOT M121 AND M140
----------------------------------( SET M475 )
----------------------------------( RST M474 )
```

M475成立を搬送側から加工ST側への責任移管成立点とする。

### Network 07-10 RESTORE

```text
M475
----------------------------------( SET M476 )
----------------------------------( RST M475 )
```

### Network 07-11 ST04 UP要求

```text
M476 AND NOT M704 AND NOT M714 ----( M810 )
```

### Network 07-12 T4 END

```text
M476 AND M134
----------------------------------( RST M476 )
----------------------------------( RST M433 )
```

## 7. 隣接排他 / 非隣接同時搬送

開始時の正式な隣接禁止：

- T1：M431がONなら開始禁止
- T2：M430またはM432がONなら開始禁止
- T3：M431またはM433がONなら開始禁止
- T4：M432がONなら開始禁止

したがって明示的に許可される非隣接組合せは、少なくとも次を含む。

- T1 + T3
- T2 + T4

T1 + T4については機械状態上は非隣接だが、正式な同時運転可否は設備全体の責任分界・加工ST側搬送構成を確定後に再確認する。現時点で積極的な同時運転保証条件にはしない。

## 8. タイムアウト連携

搬送タイムアウト監視はRUN開始状態を起点にする。

- T1：M442～M445中 → D110監視 → M701
- T2：M452～M455中 → D110監視 → M702
- T3：M462～M465中 → D110監視 → M703
- T4：M472～M475中 → D110監視 → M704

ストッパー監視：

- T1：M440/M446 → M711
- T2：M450/M456 → M712
- T3：M460/M466 → M713
- T4：M470/M476 → M714

実タイマ命令・時間単位は `gxworks3-timeout-fault-full-map.md` と最終GX Works3実装で統一する。

## 9. 通常停止時

通常停止PBでM305がOFFした場合：

- 新規T1～T4開始禁止
- M430～M433およびM440～M476を無条件RESETしない
- 実出力要求はSection 10/11の停止ポリシーに従う
- 再開時はサブステップと在荷/端位置の整合を確認する
- 不整合ならGOT手動復旧へ移る

「停止PBを押したら搬送サブステップを全部初期化」は採用しない。

## 10. 実装チェック

- M430～M433は各区間で1か所だけSET/RESET管理する。
- サブステップは各区間one-hotを基本とする。
- passage OFFだけでM444/M454/M464/M474へ進めない。
- source OFF + destination ONが揃わない限りTRANSFER_OKにしない。
- RUN要求はRESTOREへ入る前に解除される。
- 相反するST出力を同時要求しない。
- T4に未確定の加工ST側Y/Mを追加していない。
- M701～M704成立時に自動で次搬送へ進めない。
- RESETだけでBusyを勝手に消去しない。

## 11. 次工程

次はSection 08 `PROCESS_AUTO` のM500～M517を、同じくネットワーク番号付きで実装順に展開する。
