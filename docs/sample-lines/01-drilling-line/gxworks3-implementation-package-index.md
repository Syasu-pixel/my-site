# 01 Drilling Line — GX Works3 実装開始パッケージ目次

Status: Active / 教材・シミュレーション実装開始用

## 1. 目的

GX Works3入力開始時に、どの資料を正として、どの順で入力・確認・シミュレーションするかを一枚で追えるようにする。

本資料は教材・シミュレーション用の通常PLCロジック管理。実GX Works3プロジェクトを確認していない項目は `COMMENT DONE` / `LADDER DONE` / `SIM PASS` としない。

## 2. 実装開始時の正本

最初に以下を開く。

1. `gxworks3-implementation-execution-status.md` — 全体進捗
2. `gxworks3-implementation-master-checklist.md` — Section 00～16全体チェック
3. `gxworks3-device-comment-master.md` — デバイスコメント正本
4. `physical-io-map.md` — 物理X/Y正本
5. `gxworks3-input-mapping-spec.md` — X→M入力マップ
6. `gxworks3-output-request-full-map.md` — AUTO/MANUAL→COMMON要求
7. `gxworks3-actual-output-full-map.md` — COMMON→実Y
8. `gxworks3-simulation-test-matrix.md` — 全体SIM試験

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

## 4. 既知修正済み事項

以下は旧記述を正として扱わない。

- M323投入可：搬出満杯M154/M770を単純なグローバル投入禁止へ直結しない。
- M946：手動CV04→加工ST判定にAUTO専用M330を流用しない。`MANUAL_STATION_ACCEPT_OK` の機械状態条件を基準にする。
- passage：センサOFF単独では完了にしない。SEEN後の立下りCOMPLETEを使う。
- RESET：M321/M305を自動SETしない。
- GOT：実Yへ直接書かない。
- Warning M770～M775：M324へ含めない。

## 5. 実装開始を妨げないTBD

以下は該当部分のみ `BLOCKED-TBD` とし、他Sectionの入力は進められる。

- M320へST01～ST05全UPを追加するか
- M320へM166主軸RUN OFFを追加するか
- GX Works3で使う正式エッジ命令形式
- T4加工ST側の正式搬送駆動方式
- M515搬出の正式駆動方式と専用timeout
- 主軸立上り監視時間用D
- 主軸ゼロ速度/停止完了の正式確認方式
- ダブルソレノイドの保持/パルス方式
- 各 `*_MACHINE_PERMIT` / `*_OUTPUT_PERMIT` 最終条件
- D101搬送詳細コード
- 生産統計の時間単位、累積時間/件数デバイス、保持範囲
- D300～D365の32bit化/保持範囲

未確定番号を空きM/Dへ勝手に割り付けない。

## 6. 旧資料の扱い

`gxworks3-transfer-pattern-spec.md`、`gxworks3-transfer-substep-map.md`、`gxworks3-warning-status-spec.md`、`gxworks3-timeout-alarm-matrix.md` 等は設計履歴・補助参照として残す。

実装時は原則として本目次の「主実装資料」と各Batch最新実装記録を優先する。矛盾が見つかった場合は、番号を推測で合わせず最新正本へ統一してから入力する。

## 7. 実装記録の更新ルール

各Batchで順に記録する。

```text
DESIGN READY
→ COMMENT DONE
→ LADDER DONE
→ SIM PASS
```

実GX Works3の画面、プロジェクト、エクスポート、または実入力済みネットワークを確認できない限り、後ろ3つを完了にしない。

## 8. 現在判定

- Batch A～G：設計資料あり
- Batch A～G：ネットワーク単位実装記録あり
- 横断整合監査：実施済み
- GX Works3実入力：未確認
- GX Works3シミュレーション：未確認

したがって現在は **DESIGN PACKAGE COMPLETE / GX WORKS3 INPUT READY / INPUT PENDING** とする。

## 9. 実装開始順

GX Works3で実際に作業を始める場合は、Batch Aから開始し、各Batchごとに `COMMENT → LADDER → SIM` を完了してから次Batchへ進む。

安全機能、主回路、高電圧配線、保護定格、実機投入可否はこのPLC教材パッケージとは別管理とし、資格・責任を持つ設計者が最新メーカー資料・現地条件・リスクアセスメントで確認する。
