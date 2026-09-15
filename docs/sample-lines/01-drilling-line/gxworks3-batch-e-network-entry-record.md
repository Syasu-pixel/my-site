# 01 Drilling Line — GX Works3 Batch E Section 12～13 ネットワーク実装記録

Status: Active / 教材・シミュレーション入力管理用

## 1. 目的

Batch E（Section 12 `TIMEOUT_FAULT` / Section 13 `WARNING_BUZZER`）をGX Works3へ入力する際に、各ネットワーク単位で `COMMENT / LADDER / SIM` の実績を分離して記録する。

設計監査済みでも、GX Works3実プロジェクトを実際に確認していない項目は完了扱いにしない。

## 2. Section 12 — TIMEOUT_FAULT

### 12-01～12-04 搬送T1～T4 timeout

| Network | Alarm | 監視対象 | 完了条件 | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|---|
| 12-01 | M701 / A101 | T1 RUN window M442～M445 | M201 + !M116 + M117 | [ ] | [ ] | [ ] |
| 12-02 | M702 / A102 | T2 RUN window M452～M455 | M203 + !M117 + M120 | [ ] | [ ] | [ ] |
| 12-03 | M703 / A103 | T3 RUN window M462～M465 | M205 + !M120 + M121 | [ ] | [ ] | [ ] |
| 12-04 | M704 / A104 | T4 RUN window M472～M475 | M207 + !M121 + M140 | [ ] | [ ] | [ ] |

確認：

- [ ] D110監視開始点が各RUN windowと一致
- [ ] 期待完了成立で監視解除
- [ ] timeout成立で該当M701～M704をSET
- [ ] M324成立へ反映
- [ ] M305解除方向へ働く
- [ ] Busy / サブステップを無条件RESETしない
- [ ] passage OFF単独で完了にしない

### 12-10～12-14 ST01～ST05

| Network | ST | Alarm | COMMON要求 | FB | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|---|---|
| 12-10 | ST01 | M711 / A111 | M864/M865 | M126/M127 | [ ] | [ ] | [ ] |
| 12-11 | ST02 | M712 / A112 | M866/M867 | M130/M131 | [ ] | [ ] | [ ] |
| 12-12 | ST03 | M713 / A113 | M868/M869 | M132/M133 | [ ] | [ ] | [ ] |
| 12-13 | ST04 | M714 / A114 | M870/M871 | M134/M135 | [ ] | [ ] | [ ] |
| 12-14 | ST05 | M715 / A115 | M872/M873 | M136/M137 | [ ] | [ ] | [ ] |

確認：

- [ ] 要求ONかつ期待FB未成立でD111監視
- [ ] 期待FB成立で監視解除
- [ ] UP/DOWN端同時成立を正常完了扱いしない
- [ ] 端矛盾時はtimeout待ちだけに依存しない

### 12-20～12-25 CY01～CY05

| Network | 軸 | Alarm | 要求 | 期待FB | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|---|---|
| 12-20 | CY01 | M721 / A201 | M874/M875 | M142/M143 | [ ] | [ ] | [ ] |
| 12-21 | CY02 | M722 / A202 | M876/M877 | M144/M145 | [ ] | [ ] | [ ] |
| 12-22 | CY03 | M723 / A203 | M878/M879 | M146/M147 | [ ] | [ ] | [ ] |
| 12-23 | CY04 | M724 / A204 | M880/M881 | M150/M151 | [ ] | [ ] | [ ] |
| 12-24 | CY05 DOWN | M725 / A205 | M883 | M153 | [ ] | [ ] | [ ] |
| 12-25 | CY05 UP | M726 / A206 | M882 | M152 | [ ] | [ ] | [ ] |

確認：

- [ ] 各機構で要求→期待FB未成立のみ監視
- [ ] 対応端センサ同時成立を正常扱いしない
- [ ] D111共用または専用値の最終方針が未確定ならBLOCKED-TBD記録

### 12-26 加工位置 M730 / A210

代表監視：M504 + M145成立後にM141治具位置在荷が成立しないケース。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M141正常成立でM730なし
- [ ] SIM 期待タイミングでM141未成立 → M730
- [ ] SIM 単なる通常ワーク無しではM730にしない
- [ ] SIM M505/M506中の不整合も監査

### 12-30 低エア M731 / A301

一次基準：`(M305 OR M321) AND NOT M111`。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 運転/準備中のM111 OFFでM731
- [ ] SIM 復圧だけで途中位置を正常扱いしない
- [ ] SIM RESET前に位置整合が必要

### 12-31～12-34 INV01～INV04

| Network | 入力 | Alarm | COMMENT | LADDER | SIM |
|---|---|---|---|---|---|
| 12-31 | M162 | M741 / A401 | [ ] | [ ] | [ ] |
| 12-32 | M163 | M742 / A402 | [ ] | [ ] | [ ] |
| 12-33 | M164 | M743 / A403 | [ ] | [ ] | [ ] |
| 12-34 | M165 | M744 / A404 | [ ] | [ ] | [ ] |

確認：

- [ ] 異常入力ONで個別アラームSET
- [ ] 関連RUN要求を継続しない
- [ ] 元異常OFF + RUN要求OFFまでRESET不可

### 12-35 主軸 M750 / A410

発生系統：

1. M167主軸異常入力ON
2. M884主軸RUN共通要求ON後、M166 RUN FB未成立timeout

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M167 ONでM750
- [ ] SIM M884 ON / M166未成立でtimeout
- [ ] SIM M166成立で起動監視解除
- [ ] SIM 専用zero-speed入力を捏造していない
- [ ] 主軸立上り監視時間Dの正式値はBLOCKED-TBD

### 12-40 M324 異常総合

対象：M701～704、M711～715、M721～726、M730、M731、M741～744、M750。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 対象1点でM324 ON
- [ ] SIM M770～M775警告だけではM324 OFF
- [ ] SIM M324成立でM305解除
- [ ] SIM 安全監視M760～M764は表示分類を分離

### 12-50 個別RESET

基本：原因復旧済み + RESET要求 + M340共通RESET許可 + 個別復旧条件。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 原因未復旧では解除不可
- [ ] SIM 複数異常時、解除可能なものだけ解除
- [ ] SIM RESETだけでM305/M321をSETしない
- [ ] SIM 搬送ワーク位置不明時にBusyを自動消去しない
- [ ] SIM 主軸M750解除時はM167 OFF / M884 OFF / M152確認

## 3. Section 13 — WARNING_BUZZER

### 13-01 M770 搬出満杯

`M154 -> M770`

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M154 ONでM770 ON
- [ ] SIM M770だけでM324 ONにならない
- [ ] SIM M305は原則保持
- [ ] SIM M154 OFFで自動解除

### 13-02 M771 投入待ち

一次案：`M305 AND M323 AND NOT M116 -> M771`

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 投入可かつCV01空でON
- [ ] SIM M184ワンショットを常時条件にしない

### 13-03 M772 下流空き待ち

在荷連鎖または `M121 AND NOT M330` の正常待ち。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM CV01/CV02両在荷でON
- [ ] SIM T4受入不可の正常待ちでON
- [ ] SIM M701～M704異常時は正常待ち表示よりFaultを優先

### 13-04 M773 加工ST待ち

一次案：`M305 AND M121 AND NOT M330 AND NOT M324`。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 加工中/受入不可でON
- [ ] SIM Fault時はM773よりM324表示優先
- [ ] SIM M935復旧必要は表示優先順位で上位

### 13-05 M774 タクト超過

一次案：`D210 > D120`。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM D210>D120でON
- [ ] SIM 単独でM305を停止しない
- [ ] 時間単位正式化まではBLOCKED-TBD

### 13-06 M775 自動待機

一次案：自動運転中、Faultなし、transfer/process非動作、かつ待ち理由あり。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 正常待ちでON
- [ ] SIM 動作中はOFF
- [ ] SIM M324 ON中はOFF
- [ ] M937参照順が問題ならM501～M517 ORへ置換

### 13-10 M325 警告総合

`M770 OR M771 OR M772 OR M773 OR M774 OR M775 -> M325`

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 個別警告1点でM325 ON
- [ ] SIM M325からM324へ自動昇格しない

### 13-20 新規Alarm / M326

M324 OFF→ON立上りで新規異常イベントを生成し、M326ブザー要求へ反映。

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 新規M324立上りでM326 SET
- [ ] SIM M324継続ONで毎スキャン再SETイベントにしない
- [ ] M965新規アラームパルスとイベント源整合

### 13-21 M327 消音

`M187 OR M962 -> SET M327`

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 物理PBでM327 SET
- [ ] SIM GOTブザー停止M962採用時も同経路
- [ ] SIM M327でアラームラッチは消えない
- [ ] 新規別異常時のM327解除方式はBLOCKED-TBD

### 13-22 M893 / Y34

`M326 AND NOT M327 -> M893 -> Y34`

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M326 ON/M327 OFFでY34 ON
- [ ] SIM M327 ONでY34のみOFF
- [ ] SIM M324/M700帯は保持

## 4. Batch E シミュレーションケース

| ID | 試験 | 期待 |
|---|---|---|
| E-SIM-01 | T1完了FB欠落 | M701→M324、進行停止 |
| E-SIM-02 | T2完了FB欠落 | M702→M324 |
| E-SIM-03 | T3完了FB欠落 | M703→M324 |
| E-SIM-04 | T4完了FB欠落 | M704→M324 |
| E-SIM-05 | ST01要求・端FB欠落 | M711 |
| E-SIM-06 | ST端同時ON | 正常完了扱いしない |
| E-SIM-07 | CY01～04各FB欠落 | M721～M724 |
| E-SIM-08 | CY05下降FB欠落 | M725 |
| E-SIM-09 | CY05上昇FB欠落 | M726 |
| E-SIM-10 | 加工位置M141未成立 | M730 |
| E-SIM-11 | 運転中低エア | M731 |
| E-SIM-12 | INV fault | 対応M741～744 |
| E-SIM-13 | spindle fault input | M750 |
| E-SIM-14 | spindle RUN req / FBなし | M750 |
| E-SIM-15 | 原因未復旧RESET | latch保持 |
| E-SIM-16 | 原因復旧RESET | 対象のみ解除 |
| E-SIM-17 | M154 ON | M770/M325、M324 OFF |
| E-SIM-18 | 投入待ち | M771 |
| E-SIM-19 | 下流空き待ち | M772 |
| E-SIM-20 | 加工ST待ち | M773 |
| E-SIM-21 | D210>D120 | M774、M305保持 |
| E-SIM-22 | 新規Fault | M326→Y34 |
| E-SIM-23 | Buzzer silence | Y34 OFF、Alarm保持 |
| E-SIM-24 | 新規別Fault | 再鳴動可を確認 |

## 5. BLOCKED-TBD

次は完了扱いにしない。

- 主軸立上り監視専用DまたはD111共用の正式決定
- M515排出専用timeoutアラーム番号
- ST/CY監視時間の個別化
- ダブルSOL保持/パルス方式
- M326正式SET/RST方式
- 警告ブザー採否
- M774の正式時間単位
- 新規異常時M327解除の最終方式

## 6. 合格条件

Batch Eを `SIM PASS` とする条件：

1. FaultとWarningが混同されない。
2. timeoutは「期待FB未成立」を検出し、時間だけで工程を進めない。
3. M324で自動運転を止めるが、M770～M775単独では止めない。
4. RESETは原因復旧済みの個別Alarmだけ解除する。
5. ブザー停止は音だけを止める。
6. 未確定TBDを架空M/D/I/Oで埋めていない。

現時点の実績は `DESIGN READY / COMMENT PENDING / LADDER PENDING / SIM PENDING` とする。
