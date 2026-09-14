# 01 Drilling Line — GX Works2 初回入力セッションガイド

Status: Active / PROJECT CHECK PENDING

## 1. 目的

GX Works2でFX3U教材版プロジェクトを初めて開くときに、何を確認し、どこまで出来たらBatch A入力へ進めるかを固定する。

本資料は教材・シミュレーション用途。実機施工、安全回路、主回路、保護定格を確定するものではない。

## 2. 初回セッションのゴール

このセッションではラダーを大量入力しない。

最初に次だけを実確認する。

1. GX Works2で新規プロジェクト作成ができる
2. PLCシリーズでFXCPUを選べる
3. CPUタイプでFX3Uを選べる
4. Ladderプロジェクトとして保存できる
5. デバイスコメントを登録できる
6. X/Y/M/D/Tデバイスが編集・モニタ対象として使える
7. GX Simulator2を起動できる

ここまで確認できたらBatch AのCOMMENT入力へ進む。

## 3. 推奨プロジェクト名

例：

`01_DrillingLine_FX3U_GXW2`

GX Works3想定資料と区別できる名前を使用する。

## 4. 新規プロジェクト作成時の確認記録

| No. | 確認内容 | 期待値 | 実確認 |
|---|---|---|---|
| W2-FIRST-01 | GX Works2起動 | 起動できる | [ ] |
| W2-FIRST-02 | 新規プロジェクト | 作成画面を開ける | [ ] |
| W2-FIRST-03 | PLC Series | FXCPU | [ ] |
| W2-FIRST-04 | PLC Type | FX3U | [ ] |
| W2-FIRST-05 | Program Type | Ladder | [ ] |
| W2-FIRST-06 | 保存 | GX Works2版として保存 | [ ] |
| W2-FIRST-07 | Device Comment | コメント登録可能 | [ ] |
| W2-FIRST-08 | Device Entry | X/Y/M/D/Tが扱える | [ ] |
| W2-FIRST-09 | Simulator | GX Simulator2起動可能 | [ ] |

画面上の表記が異なる場合は、実際の表示名を記録し、資料側を後で合わせる。

## 5. I/O確認

基準候補：

- CPU: FX3U-80MT/DS
- 追加入力: FX2N-16EX
- 要求: 約56DI / 29DO

ただし、初回GX Works2セッションでは物理I/Oを推測で確定しない。

確認するのは以下。

- CPUタイプFX3Uを選択できること
- X/Yデバイスが8進表記で扱われること
- 既存 `physical-io-map.md` の信号名を維持できること
- 増設入力の開始X番号は実構成確認後に確定すること

## 6. Batch A入力開始前に登録するコメント範囲

初回は全デバイスを一気に入力せず、Batch Aで必要な範囲から開始する。

### X→M入力処理

- M100～M167: 物理入力ミラー
- M180～M187: PB/操作エッジ

### passage

- M200～M209

### common/run

- M300～M330

### safety monitor

- M760～M764

コメント名称は `gxworks3-device-comment-master.md` の論理名を流用し、GX Works2版でアドレス変更が必要なものだけ差分管理する。

## 7. Batch Aラダー入力順

初回ラダー入力は以下の順。

1. Section 00 INPUT_PROCESS
2. Section 01 PASSAGE_DETECT
3. Section 02 COMMON_SAFETY_MON
4. Section 03 MODE_RUN

詳細条件は `gxworks2-batch-a-migration-diff.md` と既存Section 00～03資料を正とする。

## 8. 初回シミュレーションの最小確認

Batch Aを入力した後、最初は以下だけ確認する。

- X相当入力を切り替えると対応M100帯が追従する
- READY PB立上りでM180が1スキャンイベントになる
- AUTO START PB立上りでM181が1スキャンイベントになる
- passageはONを見た後のOFFでCOMPLETEになる
- RESETだけではM321/M305がSETされない
- safety monitor未成立時は自動開始不可

実確認できるまでは `SIM PASS` としない。

## 9. 証跡として残すもの

可能なら次のいずれかを残す。

- GX Works2プロジェクトファイル
- 新規プロジェクト設定画面のスクリーンショット
- CPUタイプ表示のスクリーンショット
- Batch A入力済みラダー画面
- GX Simulator2モニタ画面

証跡なしで `PROJECT CREATED` / `LADDER DONE` / `SIM PASS` を付けない。

## 10. この時点で決めないもの

- M515搬出機構
- 主軸ゼロ速度確認
- 主軸立上り監視専用D
- ダブルソレノイド保持/パルス方式
- 生産統計32bit化範囲
- D300～D365保持範囲
- GOT最終通信方式

これらは該当Batchまでに決める。

## 11. 現在ステータス

`GUIDE READY / GX WORKS2 PROJECT CHECK PENDING / BATCH A INPUT PENDING / SIM PENDING`
