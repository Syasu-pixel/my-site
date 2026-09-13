# 01 Drilling Line — GX Works3 Section 00～16 擬似ラダー仕様

Status: Draft / 教材・シミュレーション実装直前基準

## 1. 目的

これまで定義した物理I/O、M100～M900帯、Dデバイス、搬送4区間、加工ステップM500～M517、アラーム、警告を、GX Works3へ実装しやすい順序に並べた擬似ラダー仕様として統合する。

本資料は教材・シミュレーション用の通常PLCロジック仕様である。非常停止、安全扉、ライトカーテン等の安全機能は通常PLCだけで成立させず、通常PLC側では安全回路から返る監視信号を運転許可・表示へ使用する。

## 2. 実装順序の基本

GX Works3では原則として以下のSection順に上から処理する。

1. 入力を意味Mへ受ける
2. エッジ/通過検出を生成する
3. 共通条件・モード・運転状態を生成する
4. 搬送シーケンスを処理する
5. 加工ステップを処理する
6. 手動要求を生成する
7. 自動/手動要求を共通要求へ集約する
8. 実Yを最後に一元出力する
9. タイムアウト・異常・警告を管理する
10. GOT表示、生産、保守データを更新する

Yを上位シーケンスから直接駆動しない。

## 3. Section 00 — INPUT_PROCESS

目的：物理XをM100帯へ受け、制御本体から物理入力依存を減らす。

擬似ラダー：

```text
X0   ----------------------------( M100 )
X1   ----------------------------( M101 )
X2   ----------------------------( M102 )
...
X67  ----------------------------( M167 )
```

押しボタンは必要に応じて立上りワンショットを生成する。

```text
M100 --[ rising edge ]------------( M180 )  運転準備PB立上り
M101 --[ rising edge ]------------( M181 )  自動起動PB立上り
M102 --[ rising edge ]------------( M182 )  停止PB立上り
M103 --[ rising edge ]------------( M183 )  RESET PB立上り
M104 --[ rising edge ]------------( M184 )  投入完了PB立上り
M107 --[ rising edge ]------------( M187 )  ブザー停止PB立上り
```

## 4. Section 01 — PASSAGE_DETECT

通過は「一度ONした後にOFF」で完了とする。

CV01例：

```text
M122 -----------------------------( SET M200 )
M200 AND NOT M122 ----------------( pulse M201 )
M201 AND transfer-complete-T1 ----( RST M200 )
```

同様に、

- M202 / M203：CV02
- M204 / M205：CV03
- M206 / M207：CV04
- M208 / M209：加工ST排出

を作る。

## 5. Section 02 — COMMON_SAFETY_MON

目的：通常PLCから見た安全監視状態と共通健全条件をまとめる。

安全表示例：

```text
NOT M112 -------------------------( M760 )  E001
NOT M110 -------------------------( M761 )  E002
NOT M113 -------------------------( M762 )  E003
NOT M114 -------------------------( M763 )  E004
NOT M115 -------------------------( M764 )  E005
```

M320運転準備条件は、

```text
M110
AND M111
AND M112
AND M113
AND M114
AND M115
AND NOT M324
AND M142
AND M144
AND M146
AND M150
AND M152
AND NOT M167
----------------------------------( M320 )
```

を基準とする。

## 6. Section 03 — MODE_RUN

### 6.1 モード

```text
M105 AND NOT M106 ----------------( M300 )
M106 AND NOT M105 ----------------( M301 )
```

### 6.2 運転準備

```text
M320 AND M180 --------------------( SET M321 )
```

M321 RESET条件：

```text
NOT M110 OR NOT M111 OR NOT M112 OR NOT M113 OR NOT M114 OR NOT M115 OR M324
----------------------------------( RST M321 )
```

### 6.3 自動起動可能

```text
M301 AND M321 AND M320 AND NOT M305 AND NOT M324
----------------------------------( M322 )
```

### 6.4 自動運転

```text
M322 AND M181 --------------------( SET M305 )
M182 OR NOT M321 OR M324 ---------( RST M305 )
```

### 6.5 投入可

```text
M305 AND M321
AND NOT M116
AND NOT M430
AND NOT M324
AND NOT M770
----------------------------------( M323 )
```

### 6.6 加工ST受入許可

```text
M305 AND M321 AND M500
AND NOT M140
AND NOT M141
AND M142 AND M144 AND M146 AND M150 AND M152
AND NOT M166
AND NOT M167
AND NOT M154
AND NOT M324
----------------------------------( M330 )
```

## 7. Section 04 — TRANSFER_CV12

T1 = CV01→CV02 / Busy M430。

開始：

```text
M305 AND M321
AND M116
AND NOT M117
AND NOT M430
AND NOT M431
AND NOT M324
----------------------------------( SET M430 )
```

T1内部状態はM440帯等を実装候補とし、順に、

1. ST01下降要求 M805
2. M127下降端確認
3. CV01/CV02 RUN要求 M800/M801
4. M200 seen
5. M201 complete
6. NOT M116 AND M117
7. RUN解除
8. ST01上昇要求 M804
9. M126上昇端確認
10. M430 RESET

とする。

具体的な内部サブステップM番号はGX Works3実装時にSection単位で連番化する。

## 8. Section 05 — TRANSFER_CV23

T2 = CV02→CV03 / Busy M431。

開始：

```text
M305 AND M321
AND M117
AND NOT M120
AND NOT M431
AND NOT M430
AND NOT M432
AND NOT M324
----------------------------------( SET M431 )
```

動作パターンはT1と同一。

- ST02：M806/M807
- 下降端：M131
- 上昇端：M130
- RUN：M801/M802
- passage：M202/M203
- 完了：NOT M117 AND M120

## 9. Section 06 — TRANSFER_CV34

T3 = CV03→CV04 / Busy M432。

開始：

```text
M305 AND M321
AND M120
AND NOT M121
AND NOT M432
AND NOT M431
AND NOT M433
AND NOT M324
----------------------------------( SET M432 )
```

- ST03：M808/M809
- 下降端：M133
- 上昇端：M132
- RUN：M802/M803
- passage：M204/M205
- 完了：NOT M120 AND M121

## 10. Section 07 — TRANSFER_CV4ST

T4 = CV04→加工ST / Busy M433。

開始：

```text
M305 AND M321
AND M121
AND NOT M140
AND M330
AND NOT M433
AND NOT M432
AND NOT M324
----------------------------------( SET M433 )
```

- ST04：M810/M811
- 下降端：M135
- 上昇端：M134
- RUN：M803 + 加工ST搬送側要求
- passage：M206/M207
- 完了：NOT M121 AND M140

T4完了を加工STの責任移管点とする。

## 11. Section 08 — PROCESS_AUTO

M500～M517を1ステップ1Mで処理する。

### 初期/待機

M500では原位置を保持する要求を生成し、T4完了 + M140在荷でM501へ進む。

### ステップ遷移概念

```text
M500 AND infeed-condition --------( SET M501 / RST M500 )
M501 AND infeed-confirm ----------( SET M502 / RST M501 )
M502 AND M136 --------------------( SET M503 / RST M502 )
M503 AND M143 --------------------( SET M504 / RST M503 )
M504 AND M145 AND M141 -----------( SET M505 / RST M504 )
M505 AND M147 --------------------( SET M506 / RST M505 )
M506 AND M151 --------------------( SET M507 / RST M506 )
M507 AND M166 --------------------( SET M508 / RST M507 )
M508 AND M153 AND dwell-complete -( SET M509 / RST M508 )
M509 AND M152 --------------------( SET M510 / RST M509 )
M510 AND M150 --------------------( SET M511 / RST M510 )
M511 AND M146 --------------------( SET M512 / RST M511 )
M512 AND M144 --------------------( SET M513 / RST M512 )
M513 AND M142 --------------------( SET M514 / RST M513 )
M514 AND NOT M154 ----------------( SET M515 / RST M514 )
M515 AND M209 --------------------( SET M516 / RST M515 )
M516 AND discharge-complete ------( SET M517 / RST M516 )
M517 AND completion-process ------( SET M500 / RST M517 )
```

各ステップのAUTO要求は `gxworks3-process-auto-output-map.md` を正とする。

## 12. Section 09 — MANUAL

GOT操作はM900帯の要求へ書き込む。

例：

```text
M900 GOT CV01 manual request
AND M300 manual mode
AND manual-permit-CV01
----------------------------------( M830 )
```

各アクチュエータも同様に、

`GOT REQUEST AND MANUAL MODE AND MACHINE PERMIT → M830～M854`

とする。

禁止理由はM940帯へ個別に生成し、GOTへ表示する。

## 13. Section 10 — OUTPUT_REQUEST

自動要求と手動要求を共通要求へ集約する。

CV01例：

```text
(M800 OR M830)
AND output-permit-CV01
----------------------------------( M860 )
```

ダブルSOLは相反要求が同時成立しない条件をここでも持つ。

例：CY04

```text
(M820 OR M850) AND NOT (M821 OR M851) ----( M880 )
(M821 OR M851) AND NOT (M820 OR M850) ----( M881 )
```

## 14. Section 11 — ACTUAL_OUTPUT

実YはこのSectionだけで駆動する。

```text
M860 -----------------------------( Y0 )
M861 -----------------------------( Y1 )
...
M884 -----------------------------( Y30 )
M890 -----------------------------( Y31 )
M891 -----------------------------( Y32 )
M892 -----------------------------( Y33 )
M893 -----------------------------( Y34 )
```

ダブルソレノイドは最終段でも相互排他を入れる。

## 15. Section 12 — TIMEOUT_FAULT

### 搬送

T1例：

```text
T1 motor-run-condition -----------[ TON-like monitor D110 ]
Timeout AND NOT transfer-complete -( SET M701 )
```

T2～T4もM702～M704へ同様に割り当てる。

### アクチュエータ

例：CY01加工側

```text
M503 AND NOT M143 ---------------[ monitor D111 ]
Timeout --------------------------( SET M721 )
```

各異常Mは原因復旧 + RESET M183 + reset-permitでのみ解除する。

```text
M721 AND cause-restored AND M183 AND reset-permit
----------------------------------( RST M721 )
```

M324はM701～M750の対象異常ORで生成する。

## 16. Section 13 — WARNING_BUZZER

警告群：

- M770 搬出満杯
- M771 投入待ち
- M772 下流空き待ち
- M773 加工ST待ち
- M774 タクト超過
- M775 自動運転待機

M325は警告群OR。

ブザーは新規異常を主対象とし、消音状態M327と組み合わせる。

```text
new-alarm ------------------------( SET M326 )
M187 -----------------------------( SET M327 )
M326 AND NOT M327 ----------------( M893 )
```

新規別異常時にM327を解除する構成を基準とする。

## 17. Section 14 — GOT_INTERFACE

GOTへ最低限以下を公開する。

- M305 自動運転中
- M320 / M321 / M322
- M323 投入可
- M324 異常総合
- M325 警告総合
- M330 加工ST受入許可
- M430～M433 搬送Busy
- M500～M517 現在加工ステップ
- M700帯アラーム
- M770帯警告
- M940帯操作不可理由
- D100 現在加工ステップ番号
- D110 / D111 / D112 / D120 各設定値

GOTからYへ直接書かない。

## 18. Section 15 — PRODUCTION_TAKT

基準：

- 投入完了成立時にD200総投入数を更新
- M517サイクル完了でD201総排出数を更新
- OK判定機構がない現段階ではD202の正式加算条件は将来確定
- サイクル開始/完了時刻差からD210直近サイクルタイムを更新
- D211平均、D212最大、D213最小などを将来管理
- D120目標タクト超過でM774

## 19. Section 16 — MAINTENANCE

目的：診断・復旧を支援するが、安全機能を迂回しない。

表示候補：

- 各入力M100帯
- 各出力要求M800/M830/M860帯
- 実Y状態
- 各アクチュエータ両端FB
- 搬送Busy
- passage seen/complete
- 現在ステップ
- タイムアウト監視状態
- 操作不可理由

手動復旧はM300手動モード成立を前提とし、個別許可条件を通す。

## 20. 初期化方針

電源投入/PLC RUN開始時は、勝手に自動運転を開始しない。

基準：

- M305 = OFF
- M321 = OFF
- M500～M517は設備状態を確認後にWAITへ整合
- 出力要求M800/M830/M860帯はOFFから開始
- アラームは実原因と整合して再生成
- GOT要求M900帯は初期OFF

設備位置と工程状態が不明な場合は自動的にM500へ押し戻さず、復旧待ち状態を優先する。

## 21. ラダー実装時チェック

- ダブルコイルなし
- YはSection 11のみ
- Xは原則Section 00のみ
- GOTからY直書きなし
- 通過OFF単独で完了させない
- タイマだけで次ステップへ進めない
- 各アクチュエータの指令とFBが対になっている
- 通常停止と異常停止を分離
- RESETで再起動しない
- 搬出満杯等を故障扱いしない
- 予備X70～X77 / Y35～Y37へ架空用途を割り当てない

## 22. 次工程

この擬似ラダー仕様を基準に、次はGX Works3へ登録しやすい形式で

1. デバイスコメント一覧
2. M100～M999 / D100～D399のCSV相当一覧
3. Sectionごとのネットワーク番号・大項目コメント
4. 代表ラダーの具体化

を作成する。
