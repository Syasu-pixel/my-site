# 01 Drilling Line — GX Works3 実装開始パッケージ目次

Status: Reference / GX Works2移行判断後に再開

> 2026-09-14追記：実際に使用できるエンジニアリングソフトがGX Works2のみであることを確認した。現行ハードウェア仕様は `FX5U-64MT/ES + GX Works3` 基準のため、この資料をそのまま入力開始手順として使わない。GX Works2側の入口は `gxworks2-migration-entry.md` を正とする。

## 1. 目的

GX Works3入力開始時に、どの資料を正として、どの順で入力・確認・シミュレーションするかを一枚で追えるようにする。

本資料は教材・シミュレーション用の通常PLCロジック管理。実GX Works3プロジェクトを確認していない項目は `COMMENT DONE` / `LADDER DONE` / `SIM PASS` としない。

現在はGX Works2環境への移行判断中のため、GX Works3入力開始は保留とする。

## 2. 実装開始時の正本

GX Works3環境へ戻る場合は最初に以下を開く。

1. `gxworks3-implementation-execution-status.md` — 全体進捗
2. `gxworks3-implementation-master-checklist.md` — Section 00～16全体チェック
3. `gxworks3-device-comment-master.md` — デバイスコメント正本
4. `physical-io-map.md` — 物理X/Y正本
5. `gxworks3-input-mapping-spec.md` — X→M入力マップ
6. `gxworks3-output-request-full-map.md` — AUTO/MANUAL→COMMON要求
7. `gxworks3-actual-output-full-map.md` — COMMON→実Y
8. `gxworks3-simulation-test-matrix.md` — 全体SIM試験

GX Works2で進める場合は、先に `gxworks2-migration-entry.md` に従ってCPUターゲットを決定し、X/Y・命令・タイマ・保持範囲を再確認する。

## 3. Batch A～G 実装順

| Batch | Section | 主実装資料 | 実装記録 | 設計チェックシート |
|---|---|---|---|---|
| A | 00～03 | `gxworks3-section00-03-network-implementation-order.md` | `gxworks3-batch-a-network-entry-record.md` | `gxworks3-batch-a-section00-03-input-checksheet.md` |
| B | 04～07 | `gxworks3-section04-07-transfer-network-implementation-order.md` | `gxworks3-batch-b-network-entry-record.md` | `gxworks3-batch-b-section04-07-transfer-checksheet.md` |
| C | 08 | `gxworks3-section08-process-auto-network-implementation-order.md` | `gxworks3-batch-c-network-entry-record.md` | `gxworks3-batch-c-section08-process-checksheet.md` |
| D | 09～11 | `gxworks3-manual-network-full-map.md` + `gxworks3-output-request-full-map.md` + `gxworks3-actual-output-full-map.md` | `gxworks3-batch-d-network-entry-record.md` | `gxworks3-batch-d-section09-11-manual-output-checksheet.md` |
| E | 12～13 | `gxworks3-timeout-fault-full-map.md` + `gxworks3-warning-buzzer-full-map.md` | `gxworks3-batch-e-network-entry-record.md` | `gxworks3-batch-e-section12-13-fault-warning-checksheet.md` |
| F | 14 | `gxworks3-got-linkage-logic-spec.md` | `gxworks3-batch-f-network-entry-record.md` | `gxworks3-batch-f-section14-got-interface-checksheet.md` |
| G | 15～16 | `gxworks3-production-takt-full-map.md` + `gxworks3-maintenance-device-map.md` | `gxworks3-batch-g-network-entry-record.md` | `gxworks3-batch-g-section15-16-production-maintenance-checksheet.md` |

Batch構造と制御思想はGX Works2版でも極力再利用するが、実装結果はGX Works2側の記録として別管理する。

## 4. 既知修正済み事項

以下は旧記述を正として扱わない。

- M323投入可：搬出満杯M154/M770を単純なグローバル投入禁止へ直結しない。
- M946：手動CV04→加工ST判定にAUTO専用M330を流用しない。`MANUAL_STATION_ACCEPT_OK` の機械状態条件を基準にする。
- passage：センサOFF単独では完了にしない。SEEN後の立下りCOMPLETEを使う。
- RESET：M321/M305を自動SETしない。
- GOT：実Yへ直接書かない。
- Warning M770～M775：M324へ含めない。

## 5. 実装開始を妨げないTBD

以下は該当部分のみ `BLOCKED-TBD` とし、他Sectionの論理設計は維持できる。

- M320へST01～ST05全UPを追加するか
- M320へM166主軸RUN OFFを追加するか
- 採用CPUで使う正式エッジ命令形式
- T4加工ST側の正式搬送駆動方式
- M515搬出の正式駆動方式と専用timeout
- 主軸立上り監視時間用D
- 主軸ゼロ速度/停止完了の正式確認方式
- ダブルソレノイドの保持/パルス方式
- 各 `*_MACHINE_PERMIT` / `*_OUTPUT_PERMIT` 最終条件
- D101搬送詳細コード
- 生産統計の時間単位、累積時間/件数デバイス、保持範囲
- D300～D365の32bit化/保持範囲

GX Works2移行ではこれに加えて、CPU型式、I/O増設構成、X/Y再割付、タイマ基準、保持範囲、Simulator2試験条件を正式化する。

未確定番号を空きM/Dへ勝手に割り付けない。

## 6. 旧資料の扱い

`gxworks3-transfer-pattern-spec.md`、`gxworks3-transfer-substep-map.md`、`gxworks3-warning-status-spec.md`、`gxworks3-timeout-alarm-matrix.md` 等は設計履歴・補助参照として残す。

GX Works2移行のために既存GX Works3資料を一括削除・一括改名しない。制御思想の正本として再利用し、PLC世代依存部分だけ差分化する。

## 7. 実装記録の更新ルール

各Batchで順に記録する。

```text
DESIGN READY
→ COMMENT DONE
→ LADDER DONE
→ SIM PASS
```

実際の対象ソフトの画面、プロジェクト、エクスポート、または実入力済みネットワークを確認できない限り、後ろ3つを完了にしない。

GX Works2で確認した結果をGX Works3の `SIM PASS` として記録しない。

## 8. 現在判定

- Batch A～G：設計資料あり
- Batch A～G：ネットワーク単位実装記録あり
- 横断整合監査：実施済み
- 現行ハード基準：FX5U-64MT/ES + GX Works3
- 利用可能ソフト：GX Works2
- GX Works3実入力：未実施
- GX Works2実入力：未実施
- GX Works2 CPUターゲット：未決定

したがって現在は **DESIGN PACKAGE COMPLETE / GX WORKS2 MIGRATION REQUIRED / CPU TARGET PENDING** とする。

`GX WORKS3 INPUT READY` の判定は、実際の利用環境と一致しないため一旦解除する。

## 9. 次の実装開始条件

GX Works2で作業を始める場合は、`gxworks2-migration-entry.md` の Phase W2-0 でCPUターゲットを決め、I/O・デバイス・命令差分を確認した後にBatch Aへ進む。

安全機能、主回路、高電圧配線、保護定格、実機投入可否はこのPLC教材パッケージとは別管理とし、資格・責任を持つ設計者が最新メーカー資料・現地条件・リスクアセスメントで確認する。
