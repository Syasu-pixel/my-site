# 01 Drilling Line — GX Works3 大項目コメント / ネットワーク構成

Status: Draft / GX Works3実装直前基準

## 1. 目的

Section 00～16を、GX Works3上で見たときに迷わず追えるよう、各セクションの大項目コメントとネットワーク並びを固定する。

本資料は教材・シミュレーション用の通常PLC構成基準。安全機能は通常PLCだけで成立させない。

## 2. 共通ルール

- 各Sectionの先頭に大項目コメントを置く。
- 1ネットワーク1目的を基本とする。
- SET/RSTは対象の意味がコメントで分かる位置に置く。
- YはSection 11以外で直接使用しない。
- 物理Xは原則Section 00だけで使い、それ以降はM100帯を使う。
- 同じ機構のネットワークは連続して並べる。
- T1～T4は同じ順序で並べて比較しやすくする。
- M500～M517は工程順を崩さない。

## 3. Section 00 — INPUT_PROCESS

大項目コメント：

`00_INPUT_PROCESS｜物理入力Xを意味Mへ変換`

推奨ネットワーク：

1. X0～X7 操作入力 → M100～M107
2. X10～X15 共通 / 安全監視 → M110～M115
3. X16～X37 搬送入力 → M116～M137
4. X40～X55 加工ST入力 → M140～M155
5. X56～X67 INV / 主軸 → M156～M167
6. M100～M107 押しボタン立上り → M180帯

## 4. Section 01 — PASSAGE_DETECT

大項目コメント：

`01_PASSAGE_DETECT｜通過ON確認→OFFでCOMPLETE`

ネットワーク：

1. CV01 SEEN M200
2. CV01 COMPLETE M201
3. CV02 SEEN M202
4. CV02 COMPLETE M203
5. CV03 SEEN M204
6. CV03 COMPLETE M205
7. CV04 SEEN M206
8. CV04 COMPLETE M207
9. 加工ST排出 SEEN M208
10. 加工ST排出 COMPLETE M209

## 5. Section 02 — COMMON_SAFETY_MON

大項目コメント：

`02_COMMON_SAFETY_MON｜安全監視表示と運転準備条件`

ネットワーク：

1. E001～E005安全監視表示 M760～M764
2. 異常総合 M324生成
3. 運転準備条件 M320
4. 原位置成立診断
5. 加工ST受入前提診断

## 6. Section 03 — MODE_RUN

大項目コメント：

`03_MODE_RUN｜手動/自動・準備・起動・停止`

ネットワーク：

1. 手動モード M300
2. 自動モード M301
3. 運転準備SET M321
4. 運転準備RESET M321
5. 自動起動可能 M322
6. 自動運転SET M305
7. 自動運転RESET M305
8. 停止要求 M310
9. 投入可 M323
10. 加工ST受入許可 M330

## 7. Section 04～07 — TRANSFER

各Sectionで同一順序を採用する。

大項目コメント例：

- `04_TRANSFER_CV12｜T1 CV01→CV02`
- `05_TRANSFER_CV23｜T2 CV02→CV03`
- `06_TRANSFER_CV34｜T3 CV03→CV04`
- `07_TRANSFER_CV4ST｜T4 CV04→加工ST`

各Sectionのネットワーク順：

1. START CONDITION
2. BUSY SET
3. STOPPER DOWN AUTO REQUEST
4. DOWN FEEDBACK CHECK
5. MOTOR RUN AUTO REQUEST
6. PASSAGE SEEN CHECK
7. PASSAGE COMPLETE CHECK
8. SOURCE OFF / DESTINATION ON CHECK
9. TRANSFER COMPLETE
10. MOTOR REQUEST RELEASE
11. STOPPER UP AUTO REQUEST
12. UP FEEDBACK CHECK
13. BUSY RESET
14. TIMEOUT LINK
15. GOT STATUS / BLOCK REASON

T1～T4でこの順序を変えない。

## 8. Section 08 — PROCESS_AUTO

大項目コメント：

`08_PROCESS_AUTO｜加工ST M500～M517`

推奨ネットワーク：

1. STEP500 WAIT / 原位置保持
2. STEP500→501
3. STEP501 INFEED
4. STEP501→502
5. STEP502 ST05 STOP
6. STEP502→503
7. STEP503 SURFACE SWITCH
8. STEP503→504
9. STEP504 LATERAL IN
10. STEP504→505
11. STEP505 POSITION
12. STEP505→506
13. STEP506 CLAMP
14. STEP506→507
15. STEP507 SPINDLE PREP
16. STEP507→508
17. STEP508 DRILL
18. STEP508→509
19. STEP509 DRILL RETURN
20. STEP509→510
21. STEP510 UNCLAMP
22. STEP510→511
23. STEP511 POSITION RELEASE
24. STEP511→512
25. STEP512 LATERAL RETURN
26. STEP512→513
27. STEP513 SURFACE RESTORE
28. STEP513→514
29. STEP514 DISCHARGE PREP
30. STEP514→515
31. STEP515 DISCHARGE
32. STEP515→516
33. STEP516 DISCHARGE CHECK
34. STEP516→517
35. STEP517 COMPLETE
36. STEP517→500
37. D100現在ステップ番号生成

## 9. Section 09 — MANUAL

大項目コメント：

`09_MANUAL｜GOT手動要求を許可条件付きでMANUAL要求へ変換`

ネットワーク群：

1. 手動モード共通許可
2. CV01～CV04手動要求
3. ST01～ST05上昇/下降要求
4. CY01～CY05両方向要求
5. 主軸手動RUN要求
6. 操作不可理由 M940帯

各機構で、`GOT要求 → 許可条件 → MANUAL要求` の順に統一する。

## 10. Section 10 — OUTPUT_REQUEST

大項目コメント：

`10_OUTPUT_REQUEST｜AUTO/MANUALをCOMMON要求へ集約`

ネットワーク：

1. CV01～CV04 COMMON M860～M863
2. ST01～ST05 COMMON M864～M873
3. CY01～CY05 COMMON M874～M883
4. 主軸 COMMON M884
5. 投入可表示 M890
6. 運転表示 M891
7. 異常表示 M892
8. ブザー出力要求 M893

ダブルSOLはここで相反要求を排他する。

## 11. Section 11 — ACTUAL_OUTPUT

大項目コメント：

`11_ACTUAL_OUTPUT｜実YはこのSectionのみ`

ネットワーク：

1. Y0～Y3 CV RUN
2. Y4～Y15 ST SOL
3. Y16～Y27 CY SOL
4. Y30 主軸RUN
5. Y31～Y34 表示 / ブザー
6. 相反出力最終チェック

## 12. Section 12 — TIMEOUT_FAULT

大項目コメント：

`12_TIMEOUT_FAULT｜指令に対するFB未成立を異常化`

ネットワーク：

1. A101～A104 搬送タイムアウト
2. A111～A115 ST異常
3. A201～A206 CY異常
4. A210 加工位置未成立
5. A301 低エア圧
6. A401～A404 INV異常
7. A410 主軸異常
8. RESET許可条件
9. 各アラームRESET
10. M324異常総合更新

## 13. Section 13 — WARNING_BUZZER

大項目コメント：

`13_WARNING_BUZZER｜警告・待ち状態とブザー管理`

ネットワーク：

1. M770 搬出満杯
2. M771 投入待ち
3. M772 下流空き待ち
4. M773 加工ST待ち
5. M774 タクト超過
6. M775 自動運転待機
7. M325警告総合
8. 新規異常検出
9. M326ブザー要求
10. M327消音状態
11. M893ブザー出力要求

## 14. Section 14 — GOT_INTERFACE

大項目コメント：

`14_GOT_INTERFACE｜表示状態・操作要求・ブロック理由`

ネットワーク：

1. 運転状態表示
2. 搬送状態表示
3. 加工ステップ表示
4. 手動操作要求
5. 操作不可理由 M940帯
6. アラーム / 警告表示補助
7. 設定値読書き範囲整理

GOTから実Yへ直接書かない。

## 15. Section 15 — PRODUCTION_TAKT

大項目コメント：

`15_PRODUCTION_TAKT｜投入・排出・サイクルタイム・タクト`

ネットワーク：

1. 総投入数 D200
2. 総排出数 D201
3. OK/NG予約 D202/D203
4. サイクル開始時刻保持
5. 直近サイクルタイム D210
6. 平均 D211
7. 最大 D212
8. 最小 D213
9. 目標タクトD120との比較
10. M774タクト超過

## 16. Section 16 — MAINTENANCE

大項目コメント：

`16_MAINTENANCE｜保守診断・試運転表示`

ネットワーク：

1. 原位置診断
2. 相反端同時成立診断
3. 指令/FB診断
4. INV / 主軸状態診断
5. 入力ON時間等の保守データ予約
6. 手動復旧案内用状態

安全条件を迂回する保守ビットは作らない。

## 17. GX Works3上での可読性基準

- 大項目コメントはSection名と目的を一行で読めるようにする。
- ネットワークコメントには対象機器タグを入れる。
- 同じ出力要求を複数ネットワークでコイル駆動しない。
- SET/RSTのペアは検索で追えるよう、コメント名を一致させる。
- T1～T4、CY01～CY05など繰返し構造は並びを統一する。
- 設計変更時はコメントだけでなく仕様書側も同時更新する。

## 18. 次工程

次は実プロジェクト化前の最終準備として、

1. M440帯 搬送サブステップ番号の正式割付
2. M900帯 GOT手動操作要求の正式割付
3. M940帯 操作不可理由の正式割付
4. 初期値 / D110・D111・D112・D120の扱い
5. GX Works3プロジェクト作成チェックリスト

を固定する。
