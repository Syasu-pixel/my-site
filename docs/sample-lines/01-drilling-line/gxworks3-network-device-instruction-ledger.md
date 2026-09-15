# 01 Drilling Line — GX Works3 ネットワーク / デバイス / 命令種別 実装台帳

Status: Draft / 教材・シミュレーション実装基準

## 1. 目的

Section 00～16をGX Works3へ転記するときに、各ネットワークで「何を読むか」「何を生成するか」「どの命令種別を使うか」「何を確認するか」を一表で追えるようにする。

本台帳は教材・シミュレーション用。実機の安全機能、危険源対策、主回路、保護定格、実設備の最終動作許可をこの台帳だけで成立させない。

## 2. 命令種別の表記

本台帳ではGX Works3の具体命令文字列を固定せず、次の論理種別で管理する。

- `COPY`：物理入力→意味Mなどの状態受け
- `EDGE`：立上り/立下りワンショット
- `BOOL`：AND / OR / NOTによる状態生成
- `SET/RST`：状態・ステップ・Busyのラッチ
- `INTERLOCK`：相反・競合・許可条件
- `TIMER_MON`：期待FBのタイムアウト監視
- `COMPARE`：D値比較
- `COUNT`：イベント単位の加算
- `MOVE`：表示値・統計値の更新

具体命令形式はGX Works3プロジェクト作成時に使用CPU・プログラム表現へ合わせる。

## 3. Section 00 — INPUT_PROCESS

| Network | 読み | 生成 | 種別 | 確認 |
|---|---|---|---|---|
| 00-001～ | X0～X67 | M100～M167 | COPY | physical-io-mapと一致 |
| 00-080 | M100 | M180 | EDGE | 準備PB立上り1スキャン |
| 00-081 | M101 | M181 | EDGE | 自動起動PB |
| 00-082 | M102 | M182 | EDGE | 停止PB |
| 00-083 | M103 | M183 | EDGE | RESET PB |
| 00-084 | M104 | M184 | EDGE | 投入完了PB |
| 00-087 | M107 | M187 | EDGE | ブザー停止PB |

X70～X77はSPAREのまま。

## 4. Section 01 — PASSAGE_DETECT

| Network | 読み | 生成 | 種別 | 確認 |
|---|---|---|---|---|
| 01-01/02 | M122 | M200/M201 | SET/RST + EDGE | ON確認後OFFのみCOMPLETE |
| 01-03/04 | M123 | M202/M203 | SET/RST + EDGE | 同上 |
| 01-05/06 | M124 | M204/M205 | SET/RST + EDGE | 同上 |
| 01-07/08 | M125 | M206/M207 | SET/RST + EDGE | 同上 |
| 01-09/10 | M155 | M208/M209 | SET/RST + EDGE | 排出通過 |

OFF単独をCOMPLETEにしない。

## 5. Section 02 — COMMON_SAFETY_MON

| Network | 読み | 生成 | 種別 | 確認 |
|---|---|---|---|---|
| 02-01～05 | M110/M112～M115 | M760～M764 | BOOL | 安全監視表示のみ |
| 02-20 | M110/M111/M112/M113/M114/M115/M324/M142/M144/M146/M150/M152/M167 | M320 | BOOL | 運転準備条件 |

安全停止機能そのものは通常PLCで代替しない。

## 6. Section 03 — MODE_RUN

| Network | 読み | 生成 | 種別 | 確認 |
|---|---|---|---|---|
| 03-01 | M105/M106 | M300/M301 | BOOL | manual/auto相互排他 |
| 03-10 | M320/M180 | M321 | SET/RST | 準備ラッチ |
| 03-20 | M301/M321/M320/M305/M324 | M322 | BOOL | startable |
| 03-30 | M322/M181/M182/M321/M324 | M305 | SET/RST | RESETでSETしない |
| 03-40 | M305/M321/M116/M430/M324 | M323 | BOOL | 投入可 |
| 03-50 | M305/M321/M500/M140/M141/M142/M144/M146/M150/M152/M166/M167/M154/M324 | M330 | BOOL | 加工ST受入可 |

## 7. Section 04～07 — TRANSFER

各区間は同一構造で実装する。

| Section | Busy | Substep | 主な入力 | AUTO要求 | 種別 |
|---|---|---|---|---|---|
| 04 T1 | M430 | M440～M446 | M116/M117/M200/M201/M126/M127 | M800/M801/M804/M805 | SET/RST + INTERLOCK |
| 05 T2 | M431 | M450～M456 | M117/M120/M202/M203/M130/M131 | M801/M802/M806/M807 | SET/RST + INTERLOCK |
| 06 T3 | M432 | M460～M466 | M120/M121/M204/M205/M132/M133 | M802/M803/M808/M809 | SET/RST + INTERLOCK |
| 07 T4 | M433 | M470～M476 | M121/M140/M206/M207/M134/M135/M330 | M803/M810/M811 | SET/RST + INTERLOCK |

実装順は各区間とも `START → RELEASE → DOWN_OK → RUN → PASS_SEEN → PASS_COMPLETE → TRANSFER_OK → RESTORE → Busy解除`。

T4加工ST側の正式搬送駆動はTBD。未割付Y/Mを追加しない。

## 8. Section 08 — PROCESS_AUTO

| Network帯 | Step | 主FB | AUTO要求 | 種別 |
|---|---|---|---|---|
| 08-500 | M500 | M136/M142/M144/M146/M150/M152/M140 | M812/M814/M816/M818/M820/M822 | BOOL + SET/RST |
| 08-501 | M501 | M140/M433 | - | BOOL + SET/RST |
| 08-502 | M502 | M136 | M812 | BOOL + SET/RST |
| 08-503 | M503 | M143 | M815 | BOOL + SET/RST |
| 08-504 | M504 | M145/M141 | M817 | BOOL + SET/RST |
| 08-505 | M505 | M147/M141 | M819 | BOOL + SET/RST |
| 08-506 | M506 | M151/M147/M141 | M821 | BOOL + SET/RST |
| 08-507 | M507 | M166/M167 | M824 | BOOL + SET/RST |
| 08-508 | M508 | M153/M166 | M823/M824 | TIMER_MON + SET/RST |
| 08-509 | M509 | M152 | M822/M824 | BOOL + SET/RST |
| 08-510 | M510 | M150 | M820 | BOOL + SET/RST |
| 08-511 | M511 | M146 | M818 | BOOL + SET/RST |
| 08-512 | M512 | M144 | M816 | BOOL + SET/RST |
| 08-513 | M513 | M142 | M814 | BOOL + SET/RST |
| 08-514 | M514 | M154 | M814/M816/M818/M820/M822 | BOOL + SET/RST |
| 08-515 | M515 | M209 | M813 + TBD搬出駆動 | BOOL + SET/RST |
| 08-516 | M516 | M209/M140/M141 | 復帰要求 | BOOL + SET/RST |
| 08-517 | M517 | 完了イベント | 基準位置要求 | EDGE + COUNT + SET/RST |

M500～M517はone-hot監視対象。

## 9. Section 09 — MANUAL

入力：M900～M913 / M980～M990。
生成：M830～M854。

命令種別：`BOOL + INTERLOCK`。

最低確認：M300 ON、M305 OFF、M324 OFF、安全監視正常、相反要求なし、対象機構の通常制御干渉条件成立。

BLOCK表示はM940～M955。GOT要求からYへ直結しない。

## 10. Section 10 — OUTPUT_REQUEST

| 対象 | AUTO | MANUAL | COMMON | 種別 |
|---|---|---|---|---|
| CV | M800～M803 | M830～M833 | M860～M863 | BOOL + INTERLOCK |
| ST | M804～M813 | M834～M843 | M864～M873 | BOOL + 相反排他 |
| CY | M814～M823 | M844～M853 | M874～M883 | BOOL + 相反排他 |
| 主軸 | M824 | M854 | M884 | BOOL + INTERLOCK |
| 表示/報知 | M323/M305/M324/M326/M327 | - | M890～M893 | BOOL |

各 `*_OUTPUT_PERMIT` 最終条件はTBD。安全機能の代替条件にしない。

## 11. Section 11 — ACTUAL_OUTPUT

入力：M860～M884 / M890～M893。
出力：Y0～Y34。

命令種別：`BOOL + 最終相反排他`。

同一Yを他Sectionから駆動しない。Y35～Y37はSPARE。

## 12. Section 12 — TIMEOUT_FAULT

| Network帯 | 対象 | Alarm M | 種別 |
|---|---|---|---|
| 12-01～04 | T1～T4 | M701～M704 | TIMER_MON + SET |
| 12-10～14 | ST01～ST05 | M711～M715 | TIMER_MON + SET |
| 12-20～25 | CY01～CY05 | M721～M726 | TIMER_MON + SET |
| 12-26 | 加工位置 | M730 | TIMER_MON + SET |
| 12-30 | 低エア | M731 | BOOL + SET |
| 12-31～34 | INV01～04 | M741～M744 | BOOL + SET |
| 12-35 | 主軸 | M750 | TIMER_MON/BOOL + SET |
| 12-40 | 個別Alarm群 | M324 | BOOL |
| 12-50～ | RESET | 個別Alarm RST | INTERLOCK + RST |

RESETは原因復旧成立時だけ。RESETからM305/M321をSETしない。

## 13. Section 13 — WARNING_BUZZER

| Network | 読み | 生成 | 種別 |
|---|---|---|---|
| 13-01～06 | M154/搬送待ち/加工待ち/D210,D120 | M770～M775 | BOOL/COMPARE |
| 13-10 | M770～M775 | M325 | BOOL |
| 13-20 | M324立上り | M326 | EDGE + SET/RST候補 |
| 13-21 | M187/M962 | M327 | SET/RST |
| 13-22 | M326/M327 | M893 | BOOL |

警告だけではM305を落とさない。

## 14. Section 14 — GOT_INTERFACE

| Network帯 | 生成 | 種別 |
|---|---|---|
| 14-01 | M920～M934 | COPY/BOOL |
| 14-02 | M935/M938 | BOOL |
| 14-03 | M940～M955 | BOOL + request-relative diagnostic |
| 14-04 | M963～M971 | BOOL/EDGE |
| 14-05 | D100 | MOVE |
| 14-06 | D101 | MOVE |

M961 RESET要求、M962消音要求、M970履歴消去要求は制御本体へ直結しない。

## 15. Section 15 — PRODUCTION_TAKT

| Network | 生成 | 種別 |
|---|---|---|
| 15-01 | D200 | EDGE + COUNT |
| 15-02 | cycle start | EDGE |
| 15-03 | D201/D210 | EDGE + COUNT/MOVE |
| 15-04 | D211～D213 | COMPARE + MOVE |
| 15-05 | M774 | COMPARE |

D202/D203は品質判定入力未実装のため予約。

## 16. Section 16 — MAINTENANCE

| Network帯 | 生成 | 種別 |
|---|---|---|
| 16-01 | D300～D305 | time accumulation |
| 16-02 | D310～D314 | EDGE + COUNT |
| 16-03 | D315～D319 | EDGE + COUNT |
| 16-04 | D330～D351 | alarm EDGE + COUNT |
| 16-05 | D360～D365 | event EDGE + COUNT |
| 16-06 | overflow/hold check | COMPARE/diagnostic |

Section 16は従属統計のみ。Y、M305、M321、M700帯RESETを操作しない。

## 17. 実装前チェック

1. デバイスコメントを先に登録する。
2. Section名を00～16で固定する。
3. 同一YコイルをSection 11以外に置かない。
4. 未割付タイマ番号・補助M/Dは正式登録してから使用する。
5. one-hot / Busy / RESETのSET-RST責任箇所を1か所に寄せる。
6. AUTO/MANUAL/COMMONの3層を崩さない。
7. GOT write対象とread-only対象を分離する。
8. シミュレーションで各Section単独→結合の順に確認する。

## 18. 現時点TBD

- T4加工ST側搬送駆動
- M515正式搬出駆動
- M515専用タイムアウトAlarm
- 主軸立上り専用監視D
- D112時間単位
- 各 `*_OUTPUT_PERMIT` 最終条件
- ダブルソレノイド保持/パルス方式
- 生産統計補助D/Mと時間単位
- D300帯32bit/保持範囲

TBDを実装済みとして扱わない。
