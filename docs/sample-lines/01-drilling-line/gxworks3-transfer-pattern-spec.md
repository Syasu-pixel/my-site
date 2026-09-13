# 01 Drilling Line — GX Works3 搬送4区間 共通パターン仕様

Status: Draft / 教材・シミュレーション基準

## 1. 目的

CV01→CV02、CV02→CV03、CV03→CV04、CV04→加工STの4搬送区間を、同じ考え方で実装できるよう共通パターンを定義する。

本資料では安全回路や主回路の詳細を扱わず、通常PLCの搬送シーケンス・状態遷移・インターロックを整理する。

## 2. 搬送区間

| 区間 | 搬送元 | 搬送先 | Busy |
|---|---|---|---|
| T1 | CV01 | CV02 | M430 |
| T2 | CV02 | CV03 | M431 |
| T3 | CV03 | CV04 | M432 |
| T4 | CV04 | 加工ST | M433 |

非隣接区間は同時搬送可とする。

- T1 と T3：同時可
- T1 と T4：設備状態次第で同時可
- T2 と T4：同時可

隣接区間は同時搬送しない。

- T1 と T2：同時不可
- T2 と T3：同時不可
- T3 と T4：同時不可

## 3. 搬送開始の共通条件

各区間の開始条件は、原則として以下を満たすこと。

- M305 自動運転中
- M321 運転準備ラッチ
- 搬送元にワークあり
- 搬送先が空き
- 該当区間Busy = OFF
- 隣接区間Busy = OFF
- M324 異常総合 = OFF
- 該当ストッパーの状態が開始可能

T4のみ追加でM330 加工ST受入許可を要求する。

## 4. 区間別在荷条件

### T1 CV01→CV02

- Source occupied：M116 CV01在荷
- Destination empty：NOT M117 CV02在荷

### T2 CV02→CV03

- Source occupied：M117 CV02在荷
- Destination empty：NOT M120 CV03在荷

### T3 CV03→CV04

- Source occupied：M120 CV03在荷
- Destination empty：NOT M121 CV04在荷

### T4 CV04→加工ST

- Source occupied：M121 CV04在荷
- Destination empty：NOT M140 加工ST搬送位置在荷
- M330 加工ST受入許可

## 5. 通過検出

通過完了はセンサOFF単独で成立させない。

対応：

- T1：M200 seen / M201 complete
- T2：M202 seen / M203 complete
- T3：M204 seen / M205 complete
- T4：M206 seen / M207 complete

各completeは、該当通過センサが一度ONした後にOFFしたときのみ成立させる。

## 6. 搬送完了条件

共通完了条件：

1. passage complete
2. 搬送元在荷 = OFF
3. 搬送先在荷 = ON

区間別：

- T1：M201 AND NOT M116 AND M117
- T2：M203 AND NOT M117 AND M120
- T3：M205 AND NOT M120 AND M121
- T4：M207 AND NOT M121 AND M140

3条件が揃うまで完了としない。

## 7. 状態遷移テンプレート

各搬送区間は以下の順を基準とする。

```text
WAIT
 ↓ 開始条件成立
REQUEST
 ↓
SOURCE STOPPER DOWN
 ↓ 下降端確認
MOTOR RUN
 ↓ passage sensor ON
SEEN
 ↓ passage sensor OFF
PASS COMPLETE
 ↓ source OFF + destination ON
TRANSFER COMPLETE
 ↓
MOTOR STOP
 ↓
SOURCE STOPPER UP
 ↓ 上昇端確認
BUSY CLEAR
```

タイマで工程を飛ばさず、状態確認を優先する。

## 8. ストッパーの扱い

各区間は搬送元側ストッパーを開放してワークを送る。

- T1：ST01
- T2：ST02
- T3：ST03
- T4：ST04

ST05は加工ステーション内部の停止用であり、T4の通常搬送元ストッパーではない。

ストッパー下降指令後は下降端フィードバックを確認してからコンベヤRUNへ進む。

搬送完了後はコンベヤ停止 → ストッパー上昇 → 上昇端確認の順とする。

## 9. モータRUN要求

搬送中は原則として搬送元・搬送先双方のコンベヤをRUNさせ、受け渡しを滑らかにする考え方を基準とする。

例：

- T1：CV01 + CV02
- T2：CV02 + CV03
- T3：CV03 + CV04
- T4：CV04 + 加工ST側搬送機構（正式な駆動構成は加工ST仕様に従う）

ただし各コンベヤの最終RUN条件は、搬送競合・隣接区間・加工ST側状態を共通要求層で調停する。

## 10. 隣接インターロック

### T1

開始禁止：M431 ON

### T2

開始禁止：M430 OR M432

### T3

開始禁止：M431 OR M433

### T4

開始禁止：M432 ON

Busyは開始要求と同時にラッチし、搬送完了または異常停止まで保持する。

## 11. タイムアウト

各区間に搬送タイムアウトを持つ。

- T1 → A101 / M701
- T2 → A102 / M702
- T3 → A103 / M703
- T4 → A104 / M704

基準設定値はD110を使用し、暫定5秒級とする。

タイムアウト監視開始：

- モータRUN開始時

タイムアウト解除：

- 搬送完了時

タイムアウト時：

- 該当Busyは異常状態として保持
- モータ要求を解除
- M324異常総合へ反映
- M305自動運転を解除
- RESETだけで自動再搬送しない

## 12. センサ不整合

以下は異常候補として監視する。

- source presenceが搬送開始前に消失
- destination presenceが開始時からON
- passage seenが成立しない
- passage complete後もsourceがONのまま
- passage complete後もdestinationがONしない
- ストッパー下降/上昇端が所定時間内に成立しない

どの不整合を即時異常、どれを搬送タイムアウトに包含するかはラダー実装時に整理する。

## 13. 停止PB時の考え方

通常停止PBでM305がOFFした場合は、新規搬送開始を禁止する。

すでに搬送中の区間を即時停止するか、現在の受け渡しだけ完了させるかは実機の安全・機械条件に依存するため、教材版では「通常停止時の搬送中処理」を別項目として明示する。

現段階の基準は、危険な自動継続を避けるため、通常停止で新規要求を止め、既動作の出力は共通停止ポリシーに従わせる。

## 14. T4と加工STのハンドシェイク

T4開始にはM330が必要。

T4完了でM140 加工ST搬送位置在荷が成立した後、加工STシーケンス側へワーク到着を引き渡す。

加工ST側はM500待機から次工程へ進む前に、

- M140在荷
- 必要なST05状態
- 加工ST原位置

を再確認する。

搬送側と加工側の双方が同じワークを同時に独立制御しないよう、責任の切替点をT4完了に置く。

## 15. 実装時の共通テンプレート

各Section 04～07は同じ並びにする。

1. START CONDITION
2. BUSY LATCH
3. STOPPER DOWN REQUEST
4. DOWN FEEDBACK CHECK
5. MOTOR RUN REQUEST
6. PASSAGE SEEN
7. PASSAGE COMPLETE
8. SOURCE / DESTINATION CHECK
9. COMPLETE
10. MOTOR STOP
11. STOPPER UP REQUEST
12. UP FEEDBACK CHECK
13. BUSY RESET
14. TIMEOUT / FAULT LINK

これにより4区間を比較しながら読める教材構成にする。

## 16. 次工程

次は加工ST M500～M517について、各ステップごとに

- Entry条件
- 出力要求
- 必要フィードバック
- 次ステップ条件
- タイムアウト対象
- 異常時の保持/復旧

を表形式で固定する。
