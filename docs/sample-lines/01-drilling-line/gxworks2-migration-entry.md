# 01 Drilling Line — GX Works2 移行入口

Status: Active / 教材・シミュレーション環境再整理

## 1. 背景

現在の設計資料は `FX5U-64MT/ES + GX Works3` を基準として作成している。一方、実際に使用できるエンジニアリングソフトは GX Works2 のみである。

このため、既存資料を単純に「GX Works3 → GX Works2」と文字置換して実装開始してはならない。

現行 `hardware-spec.md` では iQ-F / FX5U を GX Works3 基準として正式選定しており、GX Works2版は旧FX系・MELSEC-L / Q 等を対象に別教材化する方針である。

## 2. GX Works2版の一次ターゲット

GX Works2教材版は、一次ターゲットとして次を採用する。

- CPU: `FX3U-80MT/DS`
- 入力増設: `FX2N-16EX`
- エンジニアリング: `GX Works2`
- 用途: 教材・ラダー作成・GX Simulator2での論理確認

理由は `gxworks2-fx3u-target-spec.md` を正とする。

この構成では本体40DI / 40DOに16DIを追加し、合計56DI / 40DOとなる。現在要求の約56DI / 29DOを収容でき、既存FX5U版で使用している入力 `X0～X67` と出力 `Y0～Y34` を大きく崩さず移植しやすい。

## 3. 結論

現在の状態は次のように扱う。

- 既存GX Works3資料：**制御思想・I/O名称・M/D構成・Batch A～Gの設計正本として保持**
- GX Works2：**FX3U-80MT/DS + FX2N-16EXを一次ターゲットとして移行**
- FX5U前提のままGX Works2へ入力開始：**しない**
- GX Works2プロジェクト上のI/O割付を未確認のまま `COMMENT DONE` / `LADDER DONE` / `SIM PASS`：**しない**

## 4. そのまま流用できる設計

次の設計思想はGX Works2版にも原則流用する。

- X入力を内部Mへ整理してから制御に使用
- 実YはACTUAL_OUTPUTへ集約
- AUTO / MANUAL / COMMON要求の分離
- ダブルコイル禁止
- passage = ON確認後の立下りで完了
- 搬送T1～T4の隣接排他
- M500～M517の加工STEP構成
- Fault / Warning分離
- RESETで自動再始動しない
- GOTからYへ直接書かない
- 生産統計・保守統計を制御本体から分離

したがってBatch A～Gの論理構造そのものは破棄しない。

## 5. GX Works2版で再確認が必要な項目

CPUターゲット決定後、以下を正式化する。

1. GX Works2プロジェクト上のCPU設定
2. 入出力点数と増設I/O構成
3. X/Yの実アドレス範囲
4. デバイス保持範囲
5. 使用可能命令と立上り/立下り表現
6. タイマ時間基準
7. 32bit演算・積算方法
8. GOT接続方式
9. GX Simulator2での試験可否と手順
10. GX Works2のプロジェクトパラメータ設定

これらが未確認の間は、既存のFX5U物理I/O割付を完了扱いにしない。

## 6. 推奨移行手順

### Phase W2-0 — CPUターゲット決定

一次ターゲットを `FX3U-80MT/DS + FX2N-16EX` とする。

GX Works2でFX3Uプロジェクトを作成し、対象CPUとI/O割付が利用可能か確認する。

### Phase W2-1 — ハードウェア対応表

現行要求 `約56DI / 29DO` を基準とし、既存 `physical-io-map.md` の信号名と機能を維持する。

一次方針:

- 使用入力 `X0～X67`：維持候補
- 旧予備入力 `X70～X77`：一旦未割付
- 使用出力 `Y0～Y34`：維持候補
- `Y35～Y37`：予備維持候補

正式番号はGX Works2プロジェクト上で確認後に確定する。

### Phase W2-2 — デバイス互換表

既存の M100～、M200～、M300～、M400～、M500～、M700～、M800～、M900～、D100～、D200～、D300～ の論理帯を、FX3Uの利用可能範囲と照合する。

問題がなければ内部M/D番号は可能な限り維持する。

### Phase W2-3 — Batch Aから実装

GX Works2版でも実装順は原則 A → G とする。

`COMMENT → LADDER → SIM` の実績管理方式も維持する。

### Phase W2-4 — SIM結果を別記録

GX Works3向け設計チェックシートをそのまま `SIM PASS` にしない。

GX Works2 / GX Simulator2で実際に確認した結果だけをGX Works2版実績として記録する。

## 7. 既存ファイルの扱い

当面、`gxworks3-*` ファイルは削除・一括リネームしない。

理由：

- これまでの設計履歴を保持するため
- 制御ロジック自体は流用価値が高いため
- 大量改名すると、何が設計正本か分からなくなるため

GX Works2版は `gxworks2-*` の入口資料、互換表、実装記録を追加して並行管理する。

## 8. 現在ステータス

- 制御ロジック設計：COMPLETE相当
- GX Works3実装：未実施
- GX Works2実装：未実施
- GX Works2 CPUターゲット：`FX3U-80MT/DS` 一次採用
- 入力増設：`FX2N-16EX` 一次採用
- GX Works2 I/O再割付：一次方針決定 / プロジェクト確認待ち
- GX Works2 SIM：未実施

現在判定：

**DESIGN PACKAGE AVAILABLE / GX WORKS2 FX3U TARGET SELECTED / PROJECT CHECK PENDING**

## 9. 次に行うこと

次はGX Works2上でFX3Uプロジェクトを作成するための、プロジェクト作成チェックシートとBatch A移植差分表を作る。

実際のGX Works2画面またはプロジェクトを確認できたら、その証拠に基づいてCPU/I/O項目を `CONFIRMED` に更新する。

安全機能、主回路、高電圧配線、保護定格等は本移行とは別管理とし、実機適用時は資格・責任を持つ設計者が最新メーカー資料、現地条件、リスクアセスメントで確認する。
