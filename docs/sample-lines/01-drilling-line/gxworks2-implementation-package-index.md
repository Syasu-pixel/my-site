# 01 Drilling Line — GX Works2 実装開始パッケージ目次

Status: Active / FX3U + GX Works2 教材・シミュレーション実装開始用

## 1. 目的

GX Works2で実際に入力を開始する際に、どの資料を正として、どの順でCOMMENT / LADDER / SIMを進めるかを一枚で追えるようにする。

本資料は教材・シミュレーション用の通常PLCロジック管理。実際のGX Works2プロジェクト、GX Simulator2結果、画面・エクスポート等を確認していない項目は `COMMENT DONE` / `LADDER DONE` / `SIM PASS` としない。

## 2. 現在ターゲット

一次採用ターゲット：

- PLC：FX3U-80MT/DS
- 追加入力：FX2N-16EX
- エンジニアリングソフト：GX Works2
- シミュレーション：GX Simulator2想定

I/O要求：

- DI：約56点
- DO：約29点

一次構成では56DI / 40DOを確保する。

ただし、実際のGX Works2新規プロジェクト作成画面でCPU選択可否を確認するまでは `PROJECT CHECK PENDING` とする。

## 3. 実装開始時に開く資料

1. `gxworks2-migration-entry.md` — GX Works2移行全体方針
2. `gxworks2-fx3u-target-spec.md` — FX3Uターゲット仕様
3. `gxworks2-project-setup-checksheet.md` — 新規プロジェクト設定確認
4. `physical-io-map.md` — 信号名・機能の正本
5. `gxworks3-device-comment-master.md` — 内部デバイスコメント設計正本
6. `gxworks3-input-mapping-spec.md` — X→M論理マップ正本
7. `gxworks3-output-request-full-map.md` — AUTO / MANUAL→COMMON要求正本
8. `gxworks3-actual-output-full-map.md` — COMMON→Y正本
9. GX Works2 Batch A〜G移行差分表
10. `gxworks3-simulation-test-matrix.md` — 元SIM試験観点

`gxworks3-*` はロジック設計正本として参照し、GX Works2固有差分は `gxworks2-*` を優先する。

## 4. Batch A〜G 実装順

| Batch | Section | GX Works2差分表 | 主設計資料 |
|---|---|---|---|
| A | 00〜03 | `gxworks2-batch-a-migration-diff.md` | `gxworks3-section00-03-network-implementation-order.md` |
| B | 04〜07 | `gxworks2-batch-b-migration-diff.md` | `gxworks3-section04-07-transfer-network-implementation-order.md` |
| C | 08 | `gxworks2-batch-c-migration-diff.md` | `gxworks3-section08-process-auto-network-implementation-order.md` |
| D | 09〜11 | `gxworks2-batch-d-migration-diff.md` | `gxworks3-manual-network-full-map.md` + output maps |
| E | 12〜13 | `gxworks2-batch-e-migration-diff.md` | timeout / warning maps |
| F | 14 | `gxworks2-batch-f-migration-diff.md` | `gxworks3-got-linkage-logic-spec.md` |
| G | 15〜16 | `gxworks2-batch-g-migration-diff.md` | production / maintenance maps |

実装順は A → B → C → D → E → F → G を基本とする。

## 5. 実績管理ルール

各Batchで次の順に記録する。

```text
DESIGN READY
→ COMMENT DONE
→ LADDER DONE
→ SIM PASS
```

実際のGX Works2入力確認なしに `COMMENT DONE` / `LADDER DONE` を付けない。

GX Simulator2で実際に試験した証拠なしに `SIM PASS` を付けない。

## 6. そのまま維持する設計原則

- X入力は内部Mへ起こして使用する
- YはSection 11へ集約する
- AUTO / MANUAL / COMMON要求を分離する
- ダブルコイル禁止
- passageはON確認後の立下りで完了
- T1〜T4隣接排他
- M500〜M517 one-hot工程
- command → feedback → next step
- タイマは監視・滞留用途、位置確認の代替にしない
- Fault / Warningを分離
- RESETでM305/M321を自動SETしない
- GOTからYへ直接書かない
- 安全監視は通常PLCで代替しない

## 7. 既知の重要修正

以下は旧記述へ戻さない。

- M323投入可にM154/M770を単純なグローバル投入禁止として直結しない
- M946手動CV04→加工ST判定にAUTO専用M330をそのまま流用しない
- passage OFFだけで搬送完了にしない
- M770〜M775をM324へ含めない
- RESETでBusy / STEP / alarmを無条件初期化しない
- M166 OFFをゼロ速度確認扱いしない
- D202/D203へ品質判定未実装のまま値を入れない

## 8. 残TBD — 実装前または該当Batchで決める

### 8.1 FX3U / GX Works2固有

- GX Works2新規プロジェクトでFX3U-80MT/DSを選択できるか
- FX2N-16EX接続時の最終Xアドレス割付
- FX3Uの保持デバイス範囲
- GX Simulator2で対象CPUを試験できるか
- GX Works2で採用する立上り/立下り1ショット命令形式
- タイマTデバイス番号と100ms / 10ms等の正式時間基準
- 32bit演算・積算命令の正式使用方法
- GOT接続方式

### 8.2 共通制御TBD

- M320へST01〜ST05全UP条件を追加するか
- M320へM166主軸RUN OFFを追加するか
- T1 + T4同時運転を正式保証するか
- T4加工ST側の正式搬送駆動方式
- M515搬出の正式駆動方式
- M515専用timeout / alarm
- 主軸立上り監視専用D
- 主軸停止完了 / zero-speedの正式確認方式
- ダブルソレノイド保持 / パルス方式
- 各 `*_MACHINE_PERMIT` / `*_OUTPUT_PERMIT` の最終条件
- D101詳細搬送コード
- M326 SET/RST正式仕様
- M327新規Fault時の再鳴動解除仕様
- 警告ブザー採用有無

### 8.3 生産 / 保守TBD

- サイクル時間内部単位
- 通常停止時間をD210へ含める最終方針
- 累積時間 / 有効サイクル件数用ワークデバイス
- D200/D201/D210〜D213保持範囲
- D300〜D365 32bit化範囲
- オーバーフロー方式
- 統計クリア機能
- D202/D203品質判定方式
- CSV / 外部履歴保存

未確定デバイス番号を空きM/D/Tへ勝手に割り付けない。

## 9. GX Works2実装開始手順

### Step 1 — 新規プロジェクト確認

`gxworks2-project-setup-checksheet.md` を使い、実際のGX Works2でCPUを選択できることを確認する。

### Step 2 — X/Y割付確認

信号名・意味は `physical-io-map.md` を維持し、FX3U本体 + 入力増設の実アドレスと照合する。

### Step 3 — コメント登録

M100〜、M200〜、M300〜、M400〜、M500〜、M700〜、M800〜、M900〜、D100〜D365のコメントをGX Works2へ登録する。

### Step 4 — Batch A入力

まずSection 00〜03を入力し、入力処理・passage・mode/runが成立することをGX Simulator2で確認する。

### Step 5 — Batch単位で完結

各Batchで COMMENT → LADDER → SIM を完了してから次へ進む。

## 10. シミュレーション証跡

実際にSIMした場合は、最低限以下を残す。

- GX Works2プロジェクト名 / CPU
- Batch
- 試験ID
- 初期条件
- 操作
- 期待結果
- 実結果
- PASS / FAIL
- 必要なら画面キャプチャやエクスポート

設計上「通るはず」はPASSにしない。

## 11. 現在判定

- GX Works2移行方針：完了
- FX3U一次ターゲット：選定済み
- GX Works2 Batch A〜G差分表：作成済み
- 実GX Works2プロジェクト：未確認
- GX Works2 COMMENT入力：未確認
- GX Works2 LADDER入力：未確認
- GX Simulator2：未確認

現在ステータス：

**GX WORKS2 MIGRATION PACKAGE COMPLETE / PROJECT CHECK PENDING / INPUT PENDING / SIM PENDING**

## 12. 安全上の位置付け

本パッケージは教材・シミュレーション用の通常PLC設計。

非常停止、安全扉、ライトカーテン等の安全機能を通常PLCロジックで代替しない。実機の安全回路、主回路、保護定格、配線、電源・短絡条件は、資格・責任を持つ設計者が最新メーカー資料、現地条件、リスクアセスメントに基づいて別途確定する。
