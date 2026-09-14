# 01 Drilling Line — GX Works2 Batch A 移行差分表

Status: Active / Section 00～03 GX Works2移植用

## 1. 目的

GX Works3基準で設計済みのBatch A（Section 00～03）を、GX Works2 / FX3Uへ移植するときに、どこをそのまま使い、どこを再確認するかを明確にする。

## 2. そのまま維持する論理

以下はCPU世代に依存しないため、原則そのまま維持する。

- X入力をM100番台へミラー
- PB立上りをM180番台へ変換
- passageはSEEN後の立下りでCOMPLETE
- safety monitorは通常PLC上では監視・運転許可用途のみ
- M300手動 / M301自動
- M321運転準備ラッチ
- M322自動起動可能
- M305自動運転中
- M323投入可
- M330加工ST受入可
- RESETでM321/M305を自動SETしない
- WarningをM324 fault sumへ混ぜない

## 3. Section 00 INPUT_PROCESS 差分

既存論理:

- X0～X7 → M100～M107
- X10～X15 → M110～M115
- X16～X37 → M116～M137
- X40～X55 → M140～M155
- X56～X67 → M156～M167
- X70～X77 spare

GX Works2版対応:

| 項目 | 方針 | 状態 |
|---|---|---|
| X→Mミラー方式 | 維持 | DESIGN READY |
| X0～X67信号名 | 維持予定 | DESIGN READY |
| X70～X77 spare | FX3U割付確認後に確定 | TBD |
| PB edge M180/M181/M182/M183/M184/M187 | 維持 | DESIGN READY |
| edge命令書式 | GX Works2正式命令で再記述 | TBD |

## 4. Section 01 PASSAGE_DETECT 差分

論理は維持する。

- M122 → SET M200
- M200 & !M122 → M201 one-shot
- M123 → M202 → M203
- M124 → M204 → M205
- M125 → M206 → M207
- M155 → M208 → M209

重要:

- raw OFF単独ではCOMPLETEにしない。
- ONを一度確認してからOFFになったときだけCOMPLETE。
- GX Works2でのワンショット命令表現は実プロジェクトで確認する。

## 5. Section 02 COMMON_SAFETY_MON 差分

以下は維持する。

- !M112 → M760
- !M110 → M761
- !M113 → M762
- !M114 → M763
- !M115 → M764
- M324 = fault群OR
- M325 = warning群OR
- M320 readiness条件

未確定事項もそのままTBD維持:

- M320へST01～ST05全UPを追加するか
- M320へ!M166を追加するか

安全機能そのものは通常PLCラダーへ置き換えない。

## 6. Section 03 MODE_RUN 差分

以下は維持する。

- M300 = M105 & !M106
- M301 = M106 & !M105
- M321 SET条件 / RESET条件
- M322起動可能
- M305 SET/RESET
- M310停止要求
- M323投入可
- M330加工ST受入可
- M327ブザー停止ラッチ

GX Works2版で確認するのは主に:

- SET/RST命令入力形式
- edge命令形式
- 初期状態/電源再投入時の保持設定

## 7. 物理I/Oについて

`physical-io-map.md` の信号名・意味は維持する。

ただし、FX3U-80MT/DS + FX2N-16EXでの正式X/Y割付は、GX Works2プロジェクト上で確認してから確定する。

現時点では「既存番号を維持できる見込み」であり、実確認前に完了扱いにしない。

## 8. Batch A 実装順

1. GX Works2新規FX3Uプロジェクト作成
2. デバイスコメント登録
3. Section00 X→Mミラー
4. PB edge処理
5. Section01 passage処理
6. Section02 safety/fault/warning/readiness
7. Section03 mode/run
8. コンパイル確認
9. GX Simulator2でA-SIMケース実行

## 9. GX Works2版 A-SIM 最低確認

- [ ] X→Mミラー
- [ ] PB長押しで1パルスのみ
- [ ] passage raw OFFだけでCOMPLETEしない
- [ ] passage ON→OFFで1パルス
- [ ] 手動/自動セレクタ4状態
- [ ] M320成立
- [ ] safety 1点NGでreadiness解除
- [ ] ready PBでM321 SET
- [ ] normal stopでM321保持
- [ ] fault/safety lossでM321解除
- [ ] RESET単独で再始動しない
- [ ] M323投入可条件
- [ ] M154/M770だけで上流投入をグローバル禁止しない
- [ ] M330成立/不成立条件
- [ ] buzzer silenceでfaultラッチは消えない

## 10. 現在判定

**LOGIC MIGRATION READY / GX WORKS2 PROJECT INPUT PENDING / SIM PENDING**

GX Works2上で実入力・実シミュレーションを確認するまではDONE/PASSへ変更しない。
