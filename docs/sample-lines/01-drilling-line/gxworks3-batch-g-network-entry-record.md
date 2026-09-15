# 01 Drilling Line — GX Works3 Batch G Section 15～16 ネットワーク入力実績記録

Status: Draft / 教材・シミュレーション入力管理用

## 1. 目的

Batch G（Section 15 `PRODUCTION_TAKT` / Section 16 `MAINTENANCE`）をGX Works3へ入力する際に、各ネットワークを `COMMENT / LADDER / SIM` の3段階で実績管理する。

本資料は設計済み内容の入力記録用であり、未確認のGX Works3実入力やシミュレーション結果を完了扱いにしない。

## 2. 共通ルール

- 生産統計は設備制御へ逆流させない。
- D200/D201はイベント1回につき1回だけ加算する。
- D202/D203 OK/NGは品質判定未実装のため自動加算しない。
- サイクル統計は正常完了イベントを基準に更新する。
- Section 16は統計・診断の従属処理であり、Y、M305、M321、M700帯RESETを駆動しない。
- カウンタ更新はレベルON保持ではなく、可能な限り立上りイベント/有効FB成立イベントを使う。
- 時間単位、32bit範囲、保持範囲などのTBDを未確認のまま確定扱いしない。

## 3. Section 15 — PRODUCTION_TAKT

### Network 15-01 投入受付イベント / D200

基準：

```text
M323 投入可
AND M184 投入完了PB立上り
AND M116 CV01在荷確認
→ accepted-load-event one-shot
→ INC D200
```

| 確認 | COMMENT | LADDER | SIM |
|---|---|---|---|
| 投入受付イベント条件 | [ ] | [ ] | [ ] |
| 1ワーク1加算 | [ ] | [ ] | [ ] |
| M184単独では加算しない | [ ] | [ ] | [ ] |

専用イベントMは未登録番号を勝手に採用しない。

### Network 15-02 サイクル開始イベント

一次基準：

```text
M500 -> M501 遷移
→ cycle-start-event
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM T4受入後の加工STサイクル開始点として成立
- [ ] SIM 同一サイクルで多重STARTしない

### Network 15-03 サイクル完了 / D201

一次基準：

```text
M515経由
AND M209 排出通過COMPLETE
AND NOT M140
AND M516 -> M517 完了
→ cycle-end-event one-shot
→ INC D201
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 1サイクル1加算
- [ ] SIM M517保持中に多重加算しない

### Network 15-04 D210 直近サイクル時間

```text
cycle-start-event → 計測開始
cycle-end-event   → 計測値をD210へ確定
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 正常完了時のみ更新
- [ ] SIM 工程途中の経過値でD210を上書きしない

時間単位はTBD。

### Network 15-05 D212 最大値

```text
cycle-end-event
AND D210 > D212
→ D212 := D210
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 大きい値で更新
- [ ] SIM 小さい値では保持

### Network 15-06 D213 最小値

一次基準：

```text
first valid cycle → D213 := D210
second+ cycle AND D210 < D213 → D213 := D210
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 初回で0のままにならない
- [ ] SIM 2回目以降は最小値のみ更新

有効サイクル件数用デバイスは正式割付後に使用する。

### Network 15-07 D211 平均値

概念：

```text
TOTAL_CYCLE_TIME += D210
VALID_CYCLE_COUNT += 1
D211 = TOTAL_CYCLE_TIME / VALID_CYCLE_COUNT
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM 正常完了サイクルだけを平均へ反映
- [ ] SIM 異常中断サイクルを除外

累積時間/件数用デバイス、32bit方式はTBD。

### Network 15-08 D120 / M774 タクト超過

```text
cycle-end-event
AND D210 > D120
→ M774 ON
```

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM D210>D120でM774 ON
- [ ] SIM M774単独でM305をOFFしない
- [ ] SIM D120/D210の単位一致

### Network 15-09 D202 / D203 予約維持

- [ ] COMMENT `QUALITY FUTURE / RESERVED`
- [ ] LADDER 自動加算ロジックなし
- [ ] SIM D201排出でD202が増えない
- [ ] SIM 異常なしだけでOK扱いしない

### Network 15-10 異常中断サイクル

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M324発生サイクルを正常統計へ算入しない
- [ ] SIM M517未到達でD210/D211/D212/D213を正常完了更新しない

### Network 15-11 RESET / 初期化境界

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M183 RESETでD200/D201統計が消えない
- [ ] SIM G07から自由書換しない
- [ ] SIM 統計クリア未採用時にクリア経路なし

## 4. Section 16 — MAINTENANCE

### Network 16-01 運転時間 D300～D305

基準：

- D300：CV01実運転
- D301：CV02実運転
- D302：CV03実運転
- D303：CV04実運転
- D304：M166主軸運転確認
- D305：M305自動運転中

| Device | COMMENT | LADDER | SIM |
|---|---|---|---|
| D300 | [ ] | [ ] | [ ] |
| D301 | [ ] | [ ] | [ ] |
| D302 | [ ] | [ ] | [ ] |
| D303 | [ ] | [ ] | [ ] |
| D304 | [ ] | [ ] | [ ] |
| D305 | [ ] | [ ] | [ ] |

確認：

- [ ] 主軸要求だけではD304を加算しない
- [ ] M166成立時間のみD304へ反映
- [ ] 表示単位/内部単位の変換が一貫

### Network 16-02 ST動作回数 D310～D314

基準：期待端FBが新たに成立した1動作 = 1カウント。

- D310 ST01：M126/M127
- D311 ST02：M130/M131
- D312 ST03：M132/M133
- D313 ST04：M134/M135
- D314 ST05：M136/M137

- [ ] COMMENT D310～D314
- [ ] LADDER edge/event化
- [ ] SIM FB ON保持で多重加算しない
- [ ] SIM 相反端同時成立では加算しない

### Network 16-03 CY動作回数 D315～D319

- D315 CY01：M142/M143
- D316 CY02：M144/M145
- D317 CY03：M146/M147
- D318 CY04：M150/M151
- D319 CY05：M152/M153

- [ ] COMMENT D315～D319
- [ ] LADDER edge/event化
- [ ] SIM FB ON保持で多重加算しない
- [ ] SIM 両端矛盾状態を正常動作として加算しない

### Network 16-04 搬送/ST異常回数 D330～D338

| Device | Alarm |
|---|---|
| D330 | M701 T1 |
| D331 | M702 T2 |
| D332 | M703 T3 |
| D333 | M704 T4 |
| D334 | M711 ST01 |
| D335 | M712 ST02 |
| D336 | M713 ST03 |
| D337 | M714 ST04 |
| D338 | M715 ST05 |

- [ ] COMMENT
- [ ] LADDER OFF→ON edge count
- [ ] SIM アラームラッチON保持で1回だけ加算

### Network 16-05 加工/駆動異常回数 D339～D351

| Device | Alarm |
|---|---|
| D339 | M721 CY01 |
| D340 | M722 CY02 |
| D341 | M723 CY03 |
| D342 | M724 CY04 |
| D343 | M725 CY05 DOWN |
| D344 | M726 CY05 UP |
| D345 | M730 PROCESS POSITION |
| D346 | M731 LOW AIR |
| D347 | M741 INV01 |
| D348 | M742 INV02 |
| D349 | M743 INV03 |
| D350 | M744 INV04 |
| D351 | M750 SPINDLE |

- [ ] COMMENT
- [ ] LADDER OFF→ON edge count
- [ ] SIM 同一故障保持で多重加算なし

### Network 16-06 診断統計 D360～D365

| Device | Event |
|---|---|
| D360 | M965 新規アラーム |
| D361 | M967 新規警告 |
| D362 | 有効RESET受付 |
| D363 | M935 OFF→ON |
| D364 | M770 OFF→ON |
| D365 | M774 OFF→ON |

- [ ] COMMENT
- [ ] LADDER
- [ ] SIM M965 1 pulse → D360 +1
- [ ] SIM M967 1 pulse → D361 +1
- [ ] SIM RESET PB押下だけでD362を増やさず、有効受付時のみ加算
- [ ] SIM M935/M770/M774 ON保持で多重加算しない

### Network 16-07 保持 / オーバーフロー監視

- [ ] COMMENT D300～D365保持候補を明記
- [ ] LADDER/parameter final retention TBDを維持
- [ ] SIM 上限到達で無条件0循環しない設計を確認
- [ ] SIM 32bit化未確定値を確定扱いしない

### Network 16-08 Section 16 禁止経路監査

- [ ] Section16からY駆動なし
- [ ] Section16からM305 SET/RSTなし
- [ ] Section16からM321 SET/RSTなし
- [ ] Section16からM700帯RESETなし
- [ ] Section16から安全監視M760～M764操作なし

## 5. Batch G シミュレーションケース

### 生産

- [ ] G-SIM-01 M184のみ → D200増加なし
- [ ] G-SIM-02 M323 + M184 + M116確認 → D200 +1
- [ ] G-SIM-03 同一投入でD200多重加算なし
- [ ] G-SIM-04 正常排出完了 → D201 +1
- [ ] G-SIM-05 M517保持 → D201多重加算なし
- [ ] G-SIM-06 D202/D203予約維持
- [ ] G-SIM-07 正常サイクルでD210更新
- [ ] G-SIM-08 D212最大値保持
- [ ] G-SIM-09 D213初回設定/最小値更新
- [ ] G-SIM-10 D211平均は有効サイクルのみ
- [ ] G-SIM-11 異常中断サイクルを正常統計から除外
- [ ] G-SIM-12 D210>D120 → M774、M305は継続可能
- [ ] G-SIM-13 RESET PBで生産統計を消去しない

### メンテナンス

- [ ] G-SIM-14 CV実運転時間D300～D303積算
- [ ] G-SIM-15 M166成立時のみD304積算
- [ ] G-SIM-16 M305成立時D305積算
- [ ] G-SIM-17 ST端FB立上りでD310～D314 1回加算
- [ ] G-SIM-18 CY端FB立上りでD315～D319 1回加算
- [ ] G-SIM-19 M701～M715新規発生でD330～D338 1回加算
- [ ] G-SIM-20 M721～M750新規発生でD339～D351 1回加算
- [ ] G-SIM-21 M965 → D360 +1
- [ ] G-SIM-22 M967 → D361 +1
- [ ] G-SIM-23 有効RESET受付 → D362 +1
- [ ] G-SIM-24 M935/M770/M774 edge → D363/D364/D365 +1
- [ ] G-SIM-25 Section16統計更新で制御出力/運転状態が変化しない

## 6. BLOCKED-TBD

次は未確定のため、入力時に無理に確定しない。

- サイクル時間の正式内部単位
- 累積時間/有効サイクル件数用デバイス
- 通常停止時間をタクトへ含める最終方針
- D200/D201/D210～D213の最終保持範囲
- D300～D365の32bit化範囲
- FX5Uパラメータ上の保持範囲
- 統計クリア機能の採否
- 外部CSV/履歴保存方式
- 将来OK/NG品質判定入力

TBD項目はデバイスを先食いせず、正式決定時にコメントマスター・GOT・試験表を同時更新する。

## 7. 合格条件

Batch Gを完了扱いできるのは、少なくとも次をGX Works3上で確認した後。

- [ ] Section 15 COMMENT完了
- [ ] Section 15 LADDER完了
- [ ] G-SIM-01～13確認
- [ ] Section 16 COMMENT完了
- [ ] Section 16 LADDER完了
- [ ] G-SIM-14～25確認
- [ ] 統計ロジックからY/M305/M321/アラームRESETへの逆流なし
- [ ] TBDを未確認のまま確定扱いしていない

現時点では `DESIGN READY / INPUT PENDING / SIM PENDING` とする。
