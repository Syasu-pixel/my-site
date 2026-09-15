# 01 Drilling Line — GX Works3 Build Batch B Section 04～07 搬送チェックシート

Status: Draft / 教材・シミュレーション実装用

## 1. 目的

Build Batch Bとして、Section 04～07のT1～T4搬送について、GX Works3実装時に `COMMENT / LADDER / SIM` の3段階で進捗と確認結果を記録する。

本チェックシートは教材・シミュレーション用。安全機能そのものや実機主回路設計を扱わない。

記号：

- `[ ] COMMENT`：デバイスコメント/名称確認
- `[ ] LADDER`：ラダー入力確認
- `[ ] SIM`：シミュレーション確認

## 2. 共通構造

各T区間で以下の順を確認する。

1. START CONDITION
2. Busy SET
3. RELEASE
4. STOPPER DOWN
5. DOWN FB
6. RUN
7. PASS SEEN
8. PASS COMPLETE
9. source OFF + destination ON
10. TRANSFER OK
11. RUN解除
12. RESTORE
13. STOPPER UP
14. UP FB
15. Busy RESET

共通確認：

- [ ] COMMENT M430～M433 Busyの名称一致
- [ ] COMMENT M440～M476サブステップ名称一致
- [ ] LADDER 各区間のサブステップが原則one-hot
- [ ] LADDER passage OFF単独ではCOMPLETEに進まない
- [ ] LADDER source OFF + destination ON前にTRANSFER_OKへ進まない
- [ ] LADDER 通常停止でBusy/サブステップを一括RESETしない
- [ ] LADDER RESETだけでBusy/サブステップを勝手に初期化しない
- [ ] SIM 正常搬送中に状態遷移が順序どおり進む
- [ ] SIM センサ不成立時に勝手に次状態へ進まない

## 3. T1 CV01→CV02 / Section 04

使用：

- Busy M430
- M440 RELEASE
- M441 DOWN_OK
- M442 RUN
- M443 PASS_SEEN
- M444 PASS_COMPLETE
- M445 TRANSFER_OK
- M446 RESTORE
- ST01 DOWN M805 / UP M804
- FB M127 DOWN / M126 UP
- RUN M800 + M801
- passage M200/M201
- source M116 / destination M117
- Alarm M701 / M711

チェック：

- [ ] COMMENT 上記デバイスコメント一致
- [ ] LADDER START = M305 & M321 & M116 & !M117 & !M430 & !M431 & !M324
- [ ] LADDER STARTでM430/M440をSET
- [ ] LADDER M440でM805要求、M127でM441へ
- [ ] LADDER M441→M442はM127成立かつ異常なし
- [ ] LADDER M442～M445でM800/M801要求
- [ ] LADDER M200でM443、M201でM444
- [ ] LADDER !M116 & M117でM445
- [ ] LADDER M445→M446でRUN要求解除
- [ ] LADDER M446でM804要求
- [ ] LADDER M126でM446/M430 RESET
- [ ] SIM 正常T1完走
- [ ] SIM M117 ONでは新規T1開始しない
- [ ] SIM M431 ONではT1開始しない
- [ ] SIM M200未成立ではM443へ進まない
- [ ] SIM M201だけを擬似成立させてもSEEN経由なしでは正常完了扱いしない
- [ ] SIM source OFFだけではM445へ進まない
- [ ] SIM destination ONだけではM445へ進まない

## 4. T2 CV02→CV03 / Section 05

使用：M431、M450～M456、M807/M806、M131/M130、M801/M802、M202/M203、M117/M120、M702/M712。

- [ ] COMMENT T2デバイス名称一致
- [ ] LADDER START = M305 & M321 & M117 & !M120 & !M431 & !M430 & !M432 & !M324
- [ ] LADDER M450→451→452→453→454→455→456
- [ ] LADDER M452～M455でM801/M802要求
- [ ] LADDER !M117 & M120でTRANSFER_OK
- [ ] LADDER M456 + M130でBusy解除
- [ ] SIM 正常T2完走
- [ ] SIM M430 ONまたはM432 ONでは開始しない
- [ ] SIM source/destination条件不成立時に完了しない

## 5. T3 CV03→CV04 / Section 06

使用：M432、M460～M466、M809/M808、M133/M132、M802/M803、M204/M205、M120/M121、M703/M713。

- [ ] COMMENT T3デバイス名称一致
- [ ] LADDER START = M305 & M321 & M120 & !M121 & !M432 & !M431 & !M433 & !M324
- [ ] LADDER M460→461→462→463→464→465→466
- [ ] LADDER M462～M465でM802/M803要求
- [ ] LADDER !M120 & M121でTRANSFER_OK
- [ ] LADDER M466 + M132でBusy解除
- [ ] SIM 正常T3完走
- [ ] SIM M431 ONまたはM433 ONでは開始しない
- [ ] SIM source/destination条件不成立時に完了しない

## 6. T4 CV04→加工ST / Section 07

使用：

- Busy M433
- M470～M476
- ST04 DOWN M811 / UP M810
- FB M135/M134
- CV04 RUN M803
- passage M206/M207
- source M121 / destination M140
- station accept M330
- Alarm M704/M714

- [ ] COMMENT T4デバイス名称一致
- [ ] LADDER START = M305 & M321 & M121 & !M140 & M330 & !M433 & !M432 & !M324
- [ ] LADDER STARTでM433/M470 SET
- [ ] LADDER M470でM811、M135でM471
- [ ] LADDER M471→M472はM330継続成立を確認
- [ ] LADDER M472～M475でM803要求
- [ ] LADDER M206→M473、M207→M474
- [ ] LADDER !M121 & M140でM475
- [ ] LADDER M475を加工ST側への責任移管点として扱う
- [ ] LADDER M476でM810要求、M134でBusy解除
- [ ] LADDER 未確定の加工ST側搬送Y/Mを追加していない
- [ ] SIM 正常T4を既存I/O境界まで確認
- [ ] SIM M330 OFFでは開始しない
- [ ] SIM M432 ONでは開始しない
- [ ] SIM M140 ONでは開始しない

## 7. 隣接排他

- [ ] LADDER T1はM431 ONで開始禁止
- [ ] LADDER T2はM430またはM432 ONで開始禁止
- [ ] LADDER T3はM431またはM433 ONで開始禁止
- [ ] LADDER T4はM432 ONで開始禁止
- [ ] SIM T1+T2同時開始しない
- [ ] SIM T2+T3同時開始しない
- [ ] SIM T3+T4同時開始しない

## 8. 非隣接同時搬送

- [ ] SIM T1 + T3同時搬送が可能
- [ ] SIM T2 + T4同時搬送が可能
- [ ] REVIEW T1 + T4は正式同時運転保証対象にしていない

T1+T4は機械的には非隣接だが、加工ST側正式搬送構成が未確定のため、現段階では積極保証しない。

## 9. 通常停止 / 再開

- [ ] SIM 搬送待機中に停止PBで新規搬送が始まらない
- [ ] SIM 搬送途中でM305 OFFになってもBusy/サブステップを無条件初期化しない
- [ ] SIM 再開時に保持サブステップと実FBの整合を確認できる
- [ ] SIM 不整合状態は自動で工程を飛ばさず手動復旧対象になる

## 10. 異常連携

- [ ] LADDER T1 RUN監視→M701
- [ ] LADDER T2 RUN監視→M702
- [ ] LADDER T3 RUN監視→M703
- [ ] LADDER T4 RUN監視→M704
- [ ] LADDER ST01→M711
- [ ] LADDER ST02→M712
- [ ] LADDER ST03→M713
- [ ] LADDER ST04→M714
- [ ] SIM timeout発生後に次サブステップへ進まない
- [ ] SIM RESETだけで搬送を自動再開しない

## 11. Batch B 合格判定

Batch B合格条件：

- [ ] T1～T4単独が正常完走
- [ ] passage seen→complete順序が維持
- [ ] source OFF + destination ONでのみ搬送完了
- [ ] 隣接搬送同時禁止
- [ ] T1+T3 / T2+T4同時搬送確認
- [ ] normal stopで状態を無条件初期化しない
- [ ] timeout時に自動進行停止
- [ ] T4の未確定加工ST側出力を追加していない

Batch Bが合格するまでBatch Cの総合連続運転判定へ進まない。
