# 01 Drilling Line — GX Works3 Batch F / Section 14 GOT_INTERFACE チェックシート

Status: Draft / 教材・シミュレーション実装チェック用

## 1. 目的

Section 14 `GOT_INTERFACE` を GX Works3 / GT Works3 へ実装する際、表示補助、操作不可理由、アラーム補助、D100/D101表示が仕様通りにつながっているかを `COMMENT / LADDER / SIM` の3段階で確認する。

本チェックシートは通常PLC/HMIの表示・診断用であり、安全機能をGOTや通常PLCで代替しない。

## 2. 記録方法

- COMMENT：デバイスコメント/タグが基準と一致
- LADDER：Section 14ロジック入力済み
- SIM：GX Simulator等で期待動作確認済み

各項目は `[ ] COMMENT  [ ] LADDER  [ ] SIM` で記録する。

## 3. M920～M933 表示補助

- [ ] COMMENT [ ] LADDER [ ] SIM — M920 = M321 AUTO READY
- [ ] COMMENT [ ] LADDER [ ] SIM — M921 = M305 AUTO RUNNING
- [ ] COMMENT [ ] LADDER [ ] SIM — M922 = M322 AUTO STARTABLE
- [ ] COMMENT [ ] LADDER [ ] SIM — M923 = M323 LOAD PERMITTED
- [ ] COMMENT [ ] LADDER [ ] SIM — M924 = M330 STATION ACCEPTABLE
- [ ] COMMENT [ ] LADDER [ ] SIM — M925 = M324 ALARM ACTIVE
- [ ] COMMENT [ ] LADDER [ ] SIM — M926 = M325 WARNING ACTIVE
- [ ] COMMENT [ ] LADDER [ ] SIM — M927 = M300 MANUAL MODE
- [ ] COMMENT [ ] LADDER [ ] SIM — M928 = M301 AUTO MODE
- [ ] COMMENT [ ] LADDER [ ] SIM — M930 = M140 PROCESS TRANSPORT WORK
- [ ] COMMENT [ ] LADDER [ ] SIM — M931 = M141 JIG WORK
- [ ] COMMENT [ ] LADDER [ ] SIM — M932 = M154 DISCHARGE FULL
- [ ] COMMENT [ ] LADDER [ ] SIM — M933 = M166 SPINDLE RUN FB

## 4. M929 / M934～M938 派生表示

- [ ] COMMENT [ ] LADDER [ ] SIM — M929 = NOT M300 AND NOT M301
- [ ] COMMENT [ ] LADDER [ ] SIM — M934 = M167 OR M750
- [ ] COMMENT [ ] LADDER [ ] SIM — M936 = M430 OR M431 OR M432 OR M433
- [ ] COMMENT [ ] LADDER [ ] SIM — M937 = OR M501～M517、M500は含めない
- [ ] COMMENT [ ] LADDER [ ] SIM — M935は異常/中断/位置不整合など復旧必要時のみ成立
- [ ] COMMENT [ ] LADDER [ ] SIM — 単なるM770/M771/M772だけでM935を立てない
- [ ] COMMENT [ ] LADDER [ ] SIM — M938 = M300 AND NOT M305 AND NOT M324
- [ ] COMMENT [ ] LADDER [ ] SIM — M938だけを権限成立と扱わず、GT Works3側Level 2相当権限を別条件にする
- [ ] COMMENT [ ] LADDER [ ] SIM — M939はSPAREのまま

## 5. M940～M955 操作不可理由

### 共通

- [ ] COMMENT [ ] LADDER [ ] SIM — M940：GOT手動要求あり + NOT M300
- [ ] COMMENT [ ] LADDER [ ] SIM — M941：GOT手動要求あり + 安全監視未成立
- [ ] COMMENT [ ] LADDER [ ] SIM — M942：GOT手動要求あり + M324
- [ ] COMMENT [ ] LADDER [ ] SIM — M943：ST/CY相反GOT要求同時成立

### 搬送

- [ ] COMMENT [ ] LADDER [ ] SIM — M944：関連隣接搬送Busyで手動JOG不可
- [ ] COMMENT [ ] LADDER [ ] SIM — M945：搬送先在荷で手動JOG不可
- [ ] COMMENT [ ] LADDER [ ] SIM — M946：CV04→加工ST関連の手動受入条件不成立
- [ ] COMMENT [ ] LADDER [ ] SIM — M946判定へAUTO専用M330をそのまま直接流用しない

### 加工

- [ ] COMMENT [ ] LADDER [ ] SIM — M947～M951は各軸要求中だけ位置不成立理由として生成
- [ ] COMMENT [ ] LADDER [ ] SIM — M952はワーク位置条件不成立
- [ ] COMMENT [ ] LADDER [ ] SIM — M953は主軸異常/主軸関連条件不成立
- [ ] COMMENT [ ] LADDER [ ] SIM — M954は搬出満杯により対象動作不可
- [ ] COMMENT [ ] LADDER [ ] SIM — M955はその他工程干渉
- [ ] COMMENT [ ] LADDER [ ] SIM — BLOCKビットを制御正本にせず診断表示用とする

## 6. M960～M971 アラーム/HMI補助

- [ ] COMMENT [ ] LADDER [ ] SIM — M960 ACK要求はモーメンタリ
- [ ] COMMENT [ ] LADDER [ ] SIM — M961 GOT RESET要求候補はM963許可を通す
- [ ] COMMENT [ ] LADDER [ ] SIM — M961からM321/M305/自動起動をSETしない
- [ ] COMMENT [ ] LADDER [ ] SIM — M962ブザー停止要求はM187系統へ合流し音だけ停止
- [ ] COMMENT [ ] LADDER [ ] SIM — M963 = M324 AND M340 AND 個別原因復旧成立
- [ ] COMMENT [ ] LADDER [ ] SIM — M964 = M324 AND NOT M963
- [ ] COMMENT [ ] LADDER [ ] SIM — M965はM324新規立上り1スキャンパルス
- [ ] COMMENT [ ] LADDER [ ] SIM — M966は履歴イベント補助
- [ ] COMMENT [ ] LADDER [ ] SIM — M967はM325新規立上り1スキャンパルス
- [ ] COMMENT [ ] LADDER [ ] SIM — M968 = M324
- [ ] COMMENT [ ] LADDER [ ] SIM — M969 = M935 OR M964
- [ ] COMMENT [ ] LADDER [ ] SIM — M970履歴消去要求は設備制御へ影響しない
- [ ] COMMENT [ ] LADDER [ ] SIM — M971履歴消去許可は停止/手動/異常なし + GT権限条件

## 7. D100 現在加工ステップ

- [ ] COMMENT [ ] LADDER [ ] SIM — M500→D100=500
- [ ] COMMENT [ ] LADDER [ ] SIM — M501→D100=501
- [ ] COMMENT [ ] LADDER [ ] SIM — M502～M516も番号一致
- [ ] COMMENT [ ] LADDER [ ] SIM — M517→D100=517
- [ ] COMMENT [ ] LADDER [ ] SIM — 複数STEP同時成立時に単純後勝ち表示で隠さない

## 8. D101 現在搬送状態

- [ ] COMMENT [ ] LADDER [ ] SIM — D101=0を搬送待機表示に使用
- [ ] COMMENT [ ] LADDER [ ] SIM — 1xx=T1 / 2xx=T2 / 3xx=T3 / 4xx=T4 の表示体系とする
- [ ] COMMENT [ ] LADDER [ ] SIM — D101を搬送制御条件の正本にしない
- [ ] COMMENT [ ] LADDER [ ] SIM — 非隣接同時搬送時はM430～M433 Busyを併記し、D101単独で全状態を表現しようとしない

## 9. 診断チェーン確認

加工手動操作ごとに次を追跡できること。

`GOT req → M980～M990 → M844～M854 → M874～M884 → Y16～Y30 → FB`

- [ ] COMMENT [ ] LADDER [ ] SIM — GOT要求ONでもMANUAL条件NGならMANUAL要求OFF
- [ ] COMMENT [ ] LADDER [ ] SIM — MANUAL要求OFF理由をM940～M955で説明可能
- [ ] COMMENT [ ] LADDER [ ] SIM — COMMON要求OFFならSection10許可/相反を確認可能
- [ ] COMMENT [ ] LADDER [ ] SIM — Y ON / FB OFFはTimeout診断へつながる

## 10. 画面・権限境界

- [ ] COMMENT [ ] LADDER [ ] SIM — G01/G02/G03/G04/G05等の表示Mが制御正本を逆駆動しない
- [ ] COMMENT [ ] LADDER [ ] SIM — G10設定編集はM938 + GT権限で許可
- [ ] COMMENT [ ] LADDER [ ] SIM — ACK / RESET / BUZZER SILENCE / HISTORY CLEARを別機能として扱う
- [ ] COMMENT [ ] LADDER [ ] SIM — 安全監視M760～M764をGOTから解除/バイパスしない
- [ ] COMMENT [ ] LADDER [ ] SIM — GOTからYへ直接書き込まない

## 11. 必須シミュレーション

- [ ] SIM — M321 ON/OFFでM920追従
- [ ] SIM — M305 ON/OFFでM921追従
- [ ] SIM — モード不成立時M929 ON
- [ ] SIM — M324成立でM925/M935/M968が成立
- [ ] SIM — 原因未復旧時M964 ON / M963 OFF
- [ ] SIM — 原因復旧後M963成立してもM305/M321は自動SETしない
- [ ] SIM — 手動要求禁止時に該当BLOCK理由が成立
- [ ] SIM — M938 OFFで設定変更不可
- [ ] SIM — M970履歴消去要求でM305/M321/M324/Yが変化しない
- [ ] SIM — M962ブザー停止でM700帯/M324は保持
- [ ] SIM — M961採用時もRESET後に自動再起動しない
- [ ] SIM — D100がM500～M517と一致
- [ ] SIM — 非隣接同時搬送時、D101表示の限界をM430～M433併記で補える

## 12. TBDとして残す項目

- M938とGT Works3権限機能の最終組み合わせ
- M935の復旧必要判定の最終細分化
- M947～M955の要求別詳細マトリクス
- M961/M962を正式採用するか
- D101詳細サブコード
- アラーム履歴へ発生STEPを保存する方式

未確定項目を架空のM/D/I/Oで補完しない。

## 13. Batch F 完了判定

以下をすべて満たした時点でBatch Fを完了とする。

- M920～M938表示補助が制御状態と一致
- M940～M955で手動BLOCK理由を説明可能
- M963/M964が原因復旧状態と一致
- ACK/RESET/消音/履歴消去が分離
- D100/D101が表示専用として機能
- GOTからY直結なし
- RESETから自動再始動なし
- 安全監視の解除/バイパスなし
