# 01 Drilling Line — GX Works3 実装実績管理

Status: Active / 教材・シミュレーション実装進捗管理

## 1. 目的

Batch A～Gの設計資料が揃った後、GX Works3実プロジェクトへの入力・コメント登録・シミュレーション実績を、設計レビュー結果と分離して管理する。

重要：本資料で `DESIGN READY` は「仕様・ネットワーク・デバイス対応をGPT側で監査済み」を意味する。GX Works3実プロジェクトを実際に開いて確認していない項目を `LADDER DONE` / `SIM PASS` としない。

## 2. ステータス定義

- `DESIGN READY`：仕様・ネットワーク・デバイス対応の実装前監査済み
- `COMMENT PENDING`：GX Works3デバイスコメント未確認
- `LADDER PENDING`：GX Works3ラダー入力未確認
- `SIM PENDING`：GX Works3シミュレーション未確認
- `BLOCKED-TBD`：未確定仕様のため該当部分のみ保留

## 3. 全体進捗

| Batch | Section | 内容 | Design | Comment | Ladder | Sim | 備考 |
|---|---|---|---|---|---|---|---|
| A | 00～03 | INPUT / PASSAGE / COMMON / MODE_RUN | DESIGN READY | PENDING | PENDING | PENDING | 実入力開始対象 |
| B | 04～07 | T1～T4搬送 | DESIGN READY | PENDING | PENDING | PENDING | T4加工ST側搬送駆動TBD |
| C | 08 | PROCESS_AUTO M500～M517 | DESIGN READY | PENDING | PENDING | PENDING | M515駆動/timeout、主軸zero-speed等TBD |
| D | 09～11 | MANUAL / OUTPUT_REQUEST / ACTUAL_OUTPUT | DESIGN READY | PENDING | PENDING | PENDING | OUTPUT_PERMIT詳細、double-solenoid方式TBD |
| E | 12～13 | TIMEOUT_FAULT / WARNING_BUZZER | DESIGN READY | PENDING | PENDING | PENDING | 主軸監視時間、M515 timeout等TBD |
| F | 14 | GOT_INTERFACE | DESIGN READY | PENDING | PENDING | PENDING | D101詳細コード等TBD |
| G | 15～16 | PRODUCTION / MAINTENANCE | DESIGN READY | PENDING | PENDING | PENDING | 時間単位、保持、32bit範囲等TBD |

## 4. Batch A 実入力順

Batch Aは `gxworks3-section00-03-network-implementation-order.md` を正として、次の順でGX Works3へ入力する。

### A-01 Section 00 INPUT_PROCESS

- Network 00-01～00-08：X0～X7 → M100～M107
- Network 00-10～00-15：X10～X15 → M110～M115
- Network 00-20～00-37：X16～X37 → M116～M137
- Network 00-40～00-55：X40～X55 → M140～M155
- Network 00-56～00-67：X56～X67 → M156～M167
- Network 00-80～00-85：PB立上り M180/M181/M182/M183/M184/M187
- X70～X77はSPAREを維持

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] X→M番号ずれなし
- [ ] PB長押しで1スキャンパルスのみ

### A-02 Section 01 PASSAGE_DETECT

- CV01：M122 → M200 SEEN → M201 COMPLETE
- CV02：M123 → M202 → M203
- CV03：M124 → M204 → M205
- CV04：M125 → M206 → M207
- 排出：M155 → M208 → M209

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] raw OFF開始だけでCOMPLETEにならない
- [ ] raw ONを一度見た後のOFFでのみCOMPLETE
- [ ] COMPLETE多重発生なし

### A-03 Section 02 COMMON_SAFETY_MON

- M760～M764：安全監視表示
- M324：故障総合
- M325：警告総合
- M320：運転準備条件

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] 安全監視NGでM320 OFF
- [ ] M324でM320 OFF
- [ ] 原位置不足でM320 OFF
- [ ] M167主軸異常でM320 OFF

注意：M760～M764は安全機能そのものではなく、通常PLC側の監視・通常運転許可用。安全回路をバイパスしない。

### A-04 Section 03 MODE_RUN

- M300：手動モード
- M301：自動モード
- M321：運転準備ラッチ
- M322：自動起動可能
- M305：自動運転中
- M310：停止要求
- M323：投入可
- M330：加工ST受入許可
- M327：ブザー消音

実績：

- [ ] COMMENT登録確認
- [ ] LADDER入力確認
- [ ] 手動/自動同時成立なし
- [ ] M320だけでM321自動SETなし
- [ ] RESETだけでM321/M305自動SETなし
- [ ] 通常STOPでM305 OFF、健全ならM321保持
- [ ] 異常/安全監視喪失でM305/M321解除
- [ ] M323はM154/M770だけでグローバル禁止しない
- [ ] M330は加工ST原位置・空き・M154 OFF等が揃った時のみ成立

## 5. Batch A シミュレーション試験順

GX Works3側で入力完了後、最低限この順で確認する。

1. 全X→Mミラー
2. PB rising edge
3. passage OFF開始
4. passage ON→OFF
5. 手動/自動モード4パターン
6. M320正常成立
7. M320各阻害条件
8. M321 SET / 通常STOP保持 / 異常RESET
9. M322起動可能
10. M305起動 / STOP / 異常停止 / RESET非再始動
11. M323投入可
12. M330加工ST受入可
13. M327ブザー消音経路

## 6. Batch A 現在の判定

現時点：

- 設計監査：完了
- コメント実登録：未確認
- ラダー実入力：未確認
- GX Works3シミュレーション：未確認

したがってBatch Aは `DESIGN READY / INPUT PENDING` とする。

## 7. 次の更新条件

GX Works3実プロジェクトのスクリーンショット、エクスポート、プロジェクトファイル、または入力済みネットワーク情報を確認できた時点で、該当行だけ `COMMENT DONE` / `LADDER DONE` / `SIM PASS` へ更新する。

未確認の実績をGPT側の設計チェックだけで完了扱いにしない。

## 8. 実機境界

この進捗表は教材・シミュレーション用PLCロジックの管理であり、実機投入可否を示さない。安全設計、主回路保護、電源条件、配線・施工、採用機器の正式仕様は資格・責任を持つ設計者が最新メーカー資料と現地条件・リスクアセスメントを基に別途確認する。
