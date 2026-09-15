# 01 Drilling Line — GX Works3 最終実装前整合監査

Status: Draft / 教材・シミュレーション実装前監査

## 1. 目的

Batch A～Gのチェックシート、Section 00～16仕様、I/O、GOT、警報、保守統計の横断整合を確認し、GX Works3へ実入力する前に、既知不整合・古い仕様・未確定事項を分離する。

本監査は教材・シミュレーション用。実機安全設計、主回路、保護協調、配線施工条件は対象外であり、別途正式設計を必要とする。

## 2. 監査対象

- Batch A：Section 00～03
- Batch B：Section 04～07
- Batch C：Section 08
- Batch D：Section 09～11
- Batch E：Section 12～13
- Batch F：Section 14
- Batch G：Section 15～16
- physical I/O map
- input/output request maps
- actual output map
- common run condition
- process step / transfer logic
- GOT linkage
- timeout / warning
- production / maintenance

## 3. 今回解消した既知不整合

### 3.1 M323 投入可と搬出満杯

旧記述ではM323条件に「搬出満杯による全体投入禁止」が残っていた。

現方針：

- M154/M770搬出満杯は故障ではない。
- M323へ単純に `NOT M770` を入れない。
- CV01に投入余地があり、上流バッファで保持可能なら新規投入を許可できる。
- 流動停止は各搬送先在荷、M330加工ST受入不可、M514搬出待ちによって下流から自然に伝播させる。
- 実質空きが無い状態は各区間在荷/busy/受入条件から投入不可とする。

`gxworks3-common-run-condition-spec.md` をこの方針へ更新済み。

### 3.2 M946 手動CV04→加工ST BLOCK

旧記述：

```text
M946 = CV04→加工ST関連要求あり AND NOT M330
```

M330はM305自動運転中を含むため、手動モードでは常時OFFとなり、M946が誤って常時BLOCKになる問題があった。

修正方針：

- M330は自動搬送専用の受入条件として維持。
- 手動では説明用論理名 `MANUAL_STATION_ACCEPT_OK` を使用。
- 未登録Mは追加しない。
- 手動固有の機械状態条件だけでM946を生成する。

基準：

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

`gxworks3-got-linkage-logic-spec.md` を更新済み。

## 4. Section横断整合結果

### 4.1 INPUT → INTERNAL

- X0～X67 → M100帯の意味変換方針は一貫。
- PBは立上りM180/M181/M182/M183/M184/M187を使用。
- 安全入力は通常PLCで安全機能を成立させず、監視/通常運転許可に限定。

判定：OK。

### 4.2 PASSAGE

- 各passageはSEEN後のOFFでCOMPLETE。
- OFF単独では通過完了にしない。
- T1～T4、排出で同じ思想を使用。

判定：OK。

### 4.3 MODE / READY / AUTO RUN

- M300/M301は相互排他。
- M321は運転準備PBでSET。
- M305は自動起動PBでSET。
- 通常停止はM305のみ解除、M321保持。
- 異常/安全条件喪失はM305/M321を解除。
- RESETはM321/M305をSETしない。

判定：OK。

### 4.4 TRANSFER

- Busy：M430～M433。
- Substep：M440～M476。
- 隣接排他：一貫。
- T1+T3 / T2+T4：非隣接同時搬送可。
- 完了はpassage complete + source OFF + destination ON。
- normal stopでsubstepを無条件RESETしない。

判定：OK。

TBD：T4加工ST側正式搬送駆動。

### 4.5 PROCESS AUTO

- M500～M517 one-hot方針。
- M812～M824 AUTO要求。
- 各遷移はFB確認後。
- M507で主軸RUN FB M166確認。
- M508でM153後に加工滞留。
- M509でM152後に主軸要求解除。
- M514搬出満杯は待ちであり故障ではない。
- RESET一律M500戻し禁止。

判定：OK。

### 4.6 MANUAL → COMMON → Y

経路：

```text
GOT req
→ M830～M854 MANUAL
→ M860～M884 COMMON
→ Section 11 Y
→ FB
```

- GOT→Y直結なし。
- ST/CY相反要求はSection 10と11で二重排他。
- Y二重コイル禁止方針と一致。
- M946の自動条件流用問題は今回修正済み。

判定：OK。

### 4.7 ACTUAL OUTPUT

- Y0～Y34はSection 11のみ。
- Y35～Y37 SPARE。
- M884→Y30主軸RUN。
- M890～M893→Y31～Y34。

判定：OK。

### 4.8 TIMEOUT / FAULT

- 搬送 M701～M704。
- ST M711～M715。
- CY M721～M726。
- 加工位置 M730。
- 低エア M731。
- INV M741～M744。
- 主軸 M750。
- M324は故障総合。
- Warning M770～M775はM324へ含めない。
- RESETは原因復旧済みの個別アラームだけ解除。

判定：OK。

### 4.9 WARNING / BUZZER

- M770搬出満杯は待ち。
- M771投入待ち。
- M772下流待ち。
- M773加工ST待ち。
- M774タクト超過。
- M775自動待機。
- M325警告総合。
- M326ブザー要求、M327消音。
- 消音でM700帯/M324を解除しない。

判定：OK。

### 4.10 GOT

- M920～M938表示補助。
- M940～M955BLOCK。
- M960～M971アラーム/HMI補助。
- D100加工STEP。
- D101搬送表示。
- M961 RESET、M962ブザー停止、M970履歴消去は設備制御と分離。
- M938はPLC側機械状態許可のみで、GOT権限は別。

判定：M946修正後OK。

### 4.11 PRODUCTION / TAKT

- D200はPB単独で加算しない。
- D201は排出完了イベントで1回。
- D202/D203は品質判定未実装のため予約。
- D210直近、D211平均、D212最大、D213最小。
- 異常中断サイクルは正常統計へ入れない。
- M774は停止故障ではない。

判定：OK。

### 4.12 MAINTENANCE

- D300～D305運転時間。
- D310～D319機構動作回数。
- D330～D351異常回数。
- D360～D365診断統計。
- ラッチ中毎scan加算禁止。
- 主軸時間はM166を基準。
- Section 16からY/M305/M321/アラームRESETへ影響させない。

判定：OK。

## 5. 実装前に残す正式TBD

以下は現時点で値・方式を固定しない。

1. T4加工ST側正式搬送駆動
2. M515正式搬出駆動
3. M515専用timeout Alarm
4. 主軸停止完了/ゼロ速度方式
5. 主軸立上り監視専用D
6. D112時間単位
7. D110/D111時間単位と最終値
8. double-solenoid保持/パルス方式
9. 各 `*_OUTPUT_PERMIT` 最終条件
10. 各 `*_MACHINE_PERMIT` 最終条件
11. D101詳細表示コード
12. M935位置不整合詳細判定
13. M947～M955詳細BLOCKマトリクス
14. 発生時STEP履歴保持方式
15. Section 15累積時間/有効件数用デバイス
16. Section 15/16 32bit化範囲
17. D300～D365保持範囲
18. 統計クリア方式
19. 外部CSV/履歴保存方式
20. 将来OK/NG判定入力

## 6. 古い仕様で注意するもの

### 6.1 giant pseudo ladder

`gxworks3-section-pseudo-ladder-spec.md` は旧M323条件などが残る可能性があるため、GX Works3実入力の正本にしない。

正本優先順位：

1. 最新Section別実装仕様
2. Batch A～G check sheet
3. device/comment/I/O map
4. 本監査
5. giant pseudo ladderは参考のみ

### 6.2 旧GOT M946

`M946 = ... AND NOT M330` の記述が他文書に残っていた場合は旧仕様と判断する。

## 7. GX Works3入力開始判定

教材・シミュレーション版については、以下の条件で入力開始可とする。

- Section 00～16の実装順が定義済み。
- Batch A～Gチェックシート作成済み。
- I/O割付済み。
- AUTO/MANUAL/COMMON/Y経路定義済み。
- 主要故障・警告定義済み。
- GOT補助定義済み。
- 生産/保守デバイス定義済み。
- M323/M946の既知不整合を修正済み。
- 未確定項目はTBDとして分離済み。

判定：**GX Works3教材・シミュレーション入力フェーズへ移行可能**。

## 8. 次工程

次工程は設計仕様追加ではなく、Batch Aから順にGX Works3へ実入力する前提の「入力実績管理」へ移る。

実プロジェクトを確認できる環境では、各Batchの `COMMENT / LADDER / SIM` を実結果に基づいて更新する。

実GX Works3プロジェクト未確認の段階では、`LADDER` / `SIM` を完了扱いにしない。

## 9. 実機転用境界

この監査のOKは教材・シミュレーションロジックの整合を示すだけで、実機投入可を意味しない。

実機では安全回路、リスクアセスメント、採用機器正式仕様、主回路保護、電源条件、配線施工、機械的危険源、現地条件を資格・責任を持つ設計者が最新メーカー資料に基づき別途確定する。
