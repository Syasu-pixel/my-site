# 01 Drilling Line — GX Works3 実装マスターチェックリスト

Status: Draft / 教材・シミュレーション実装基準

## 1. 目的

Section 00～16をGX Works3へ実装する際の順序、依存関係、確認項目、未確定項目を1枚にまとめる。

本資料は教材・シミュレーション用。安全機能、主回路保護、実機電源設計は別途正式設計とする。

## 2. 実装順

推奨順：

1. Section 00 INPUT_PROCESS
2. Section 01 PASSAGE_DETECT
3. Section 02 COMMON_SAFETY_MON
4. Section 03 MODE_RUN
5. Section 04 TRANSFER_CV12
6. Section 05 TRANSFER_CV23
7. Section 06 TRANSFER_CV34
8. Section 07 TRANSFER_CV4ST
9. Section 08 PROCESS_AUTO
10. Section 09 MANUAL
11. Section 10 OUTPUT_REQUEST
12. Section 11 ACTUAL_OUTPUT
13. Section 12 TIMEOUT_FAULT
14. Section 13 WARNING_BUZZER
15. Section 14 GOT_INTERFACE
16. Section 15 PRODUCTION_TAKT
17. Section 16 MAINTENANCE

## 3. Section 00 INPUT_PROCESS

確認：

- X0～X67をM100帯へ意味変換
- PB立上り M180/M181/M182/M183/M184/M187
- X70～X77はSPAREのまま
- 安全入力は通常制御の監視用途のみ

完了判定：物理Xを後段ロジックで直接多用しない。

## 4. Section 01 PASSAGE_DETECT

確認：

- M200/M201 CV01
- M202/M203 CV02
- M204/M205 CV03
- M206/M207 CV04
- M208/M209 排出

COMPLETEは必ず「ONを見た後のOFF」。OFF単独では成立させない。

## 5. Section 02 COMMON_SAFETY_MON

確認：

- M760～M764表示
- M320運転準備条件
- 通常PLCで安全機能を成立/解除しない
- M324と安全監視表示を表示上分離

TBD：M320へST全UPやM166 OFFを追加するかは正式決定前に固定しない。

## 6. Section 03 MODE_RUN

確認：

- M300手動 / M301自動
- M321準備ラッチ
- M322自動起動可能
- M305自動運転中
- M323投入可
- M330加工ST受入可
- RESETでM321/M305をSETしない
- 通常停止でM305のみOFF、健全ならM321保持

## 7. Section 04～07 TRANSFER

確認：

- Busy M430～M433
- サブステップ M440～M476
- 隣接排他
- T1+T3 / T2+T4 非隣接同時動作
- passage seen→complete
- source OFF + destination ONで完了
- ストッパー復帰後にBusy解除

TBD：T4加工ST側搬送駆動。

## 8. Section 08 PROCESS_AUTO

確認：

- M500～M517 one-hot
- M812～M824 AUTO要求
- FB確認後のみ次STEP
- M507でM166確認
- M508でM153 + D112滞留
- M509でM152確認後に主軸要求解除
- M514搬出満杯は待ち
- M515/M516排出
- RESETで一律M500へ戻さない

TBD：M515正式駆動、専用タイムアウト、D112単位。

## 9. Section 09 MANUAL

確認：

- GOT M900～M913 / M980～M990
- MANUAL M830～M854
- M300成立
- M305 OFF
- M324 OFF
- 通常制御インターロック
- 相反要求同時成立時は両方向禁止
- M940～M955でBLOCK理由表示

GOTからYへ直接接続しない。

## 10. Section 10 OUTPUT_REQUEST

確認：

- AUTO + MANUAL → COMMON
- M860～M884
- M890～M893表示/ブザー
- ST/CY相反ペア排他
- 主軸M884はM167異常時OFF

TBD：各 `*_OUTPUT_PERMIT` 最終条件。

## 11. Section 11 ACTUAL_OUTPUT

確認：

- YはSection 11だけで駆動
- Y0～Y34
- Y35～Y37 SPARE
- ST/CY最終排他
- 二重コイルなし
- M884→Y30
- M890～M893→Y31～Y34

## 12. Section 12 TIMEOUT_FAULT

確認：

- M701～M704 搬送
- M711～M715 ST
- M721～M726 CY
- M730加工位置
- M731低エア
- M741～M744 INV
- M750主軸
- M324総合
- 原因復旧済みのみRESET
- 複数異常時は解除可能分だけ解除

TBD：主軸専用監視D、M515専用アラーム、ST/CY監視時間分割。

## 13. Section 13 WARNING_BUZZER

確認：

- M770～M775
- M325警告総合
- 警告だけでM305を落とさない
- M326新規異常ブザー要求
- M327消音
- M893→Y34
- 消音でM700帯を解除しない

TBD：M326正式SET/RST、警告ブザー採否、タクト判定D210/D211。

## 14. Section 14 GOT_INTERFACE

確認：

- M920～M938表示補助
- M940～M955BLOCK
- M960～M971アラーム補助
- D100現在加工STEP
- D101搬送表示
- M938設定変更許可
- M963/M964 RESET可否
- RESET/ACK/消音を別機能として扱う

## 15. Section 15 PRODUCTION_TAKT

確認：

- D200投入数はPBだけで加算しない
- M116実在荷確認後に1回加算
- D201排出数は完了イベントで1回
- D202/D203は将来予約
- D210直近
- D211平均
- D212最大
- D213最小
- D120目標タクト
- 異常中断サイクルを正常統計へ入れない

TBD：時間単位、累積時間/件数デバイス、保持範囲。

## 16. Section 16 MAINTENANCE

確認：

- D300～D305運転時間
- D310～D319動作回数
- D330～D351異常回数
- D360～D365診断統計
- FB/アラーム立上りで1回だけ加算
- Section 16からY/M305/M321/アラームRESETを操作しない

TBD：32bit化、保持範囲、統計クリア、外部保存。

## 17. 全体禁止事項

- GOTからYへ直接書込み
- 同一Yの二重コイル
- RESETによる自動再起動
- 安全監視のバイパス
- 未割付M/D/X/Yを都合よく新設
- タイマ時間だけで機械STEP進行
- 警告を一律故障扱い
- M166 OFFをゼロ速度確認扱い

## 18. シミュレーション実施順

推奨：

1. INPUT/エッジ
2. 通過検出
3. モード/準備/起動停止
4. T1単独
5. T2単独
6. T3単独
7. T4単独
8. 隣接排他
9. 非隣接同時搬送
10. M500～M517正常工程
11. 手動各軸
12. 相反出力
13. タイムアウト
14. RESET/復旧
15. 警告/ブザー
16. GOT表示
17. 生産カウンタ/タクト
18. 保守統計
19. 停止→再開
20. 複数異常

## 19. 実装完了判定

教材・シミュレーション版の実装完了は、少なくとも以下を満たすこと。

- Section 00～16がGX Works3上で構築済み
- デバイスコメントと仕様書が一致
- Y二重コイルなし
- one-hot破綻なし
- 相反出力なし
- 正常搬送/加工サイクル完走
- 異常時停止とRESET後の非自動再始動を確認
- GOT手動要求のBLOCK診断可能
- 生産/保守カウンタの多重加算なし
- 未確定項目を実装済みと誤表記していない

## 20. 実機転用に関する境界

本チェックリストの完了は、教材・シミュレーション版の完成判定であり、実機投入可の判定ではない。

実機側では安全設計、採用機器正式仕様、リスクアセスメント、主回路保護、電源条件、配線・施工条件等を別途正式に確認する。
