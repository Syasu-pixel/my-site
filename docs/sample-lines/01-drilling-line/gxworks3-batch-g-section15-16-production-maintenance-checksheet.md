# 01 Drilling Line — GX Works3 Batch G Section 15～16 Production / Maintenance Checksheet

Status: Draft / 教材・シミュレーション実装チェック用

## 1. 目的

Section 15 `PRODUCTION_TAKT` と Section 16 `MAINTENANCE` をGX Works3へ実装・確認する際に、各項目を `COMMENT / LADDER / SIM` の3段階で記録できるようにする。

本資料は教材・シミュレーション用。生産統計・保守統計は設備制御の従属処理とし、安全機能、主回路設計、危険動作の成立条件をこのSectionから変更しない。

## 2. 記録ルール

各項目は以下を記録する。

- COMMENT：デバイスコメント・用途が登録済み
- LADDER：GX Works3へロジック入力済み
- SIM：シミュレーション確認済み

表記例：

```text
[ ] COMMENT
[ ] LADDER
[ ] SIM
```

## 3. Section 15 — D200 総投入数

確認条件：

- M323投入可成立
- M184投入完了PB立上り受付
- M116 CV01在荷成立確認
- 1ワークにつき1回だけ加算
- M184だけでは加算しない

チェック：

```text
[ ] COMMENT D200 = 総投入数
[ ] LADDER accepted-load-event をワンショット化
[ ] LADDER M323 + M184 + M116の整合確認後のみD200加算
[ ] SIM M184単独ではD200が増えない
[ ] SIM M116確認後に1回だけ増える
[ ] SIM 同一ワークで多重加算しない
```

専用イベントMは未割付番号を勝手に使用せず、正式登録後に採用する。

## 4. Section 15 — D201 総排出数

基準：

- M515排出工程を経由
- M209排出通過COMPLETE
- M140加工ST在荷OFF
- M516→M517完了イベント
- 1サイクルにつき1回だけ加算

```text
[ ] COMMENT D201 = 総排出数
[ ] LADDER cycle-discharge-completeをワンショット化
[ ] LADDER M209 + M140 OFF + M516→M517整合
[ ] SIM M517保持中にD201が毎scan増えない
[ ] SIM 未完了排出ではD201を増やさない
```

M515正式搬出駆動は未確定のため、本チェックシートでは新規Y/Mを追加しない。

## 5. Section 15 — D202 / D203 OK・NG

現行設備仕様では独立品質判定がないため予約。

```text
[ ] COMMENT D202 = OK数 将来予約
[ ] COMMENT D203 = NG数 将来予約
[ ] LADDER 現段階で自動加算ロジックなし
[ ] SIM D201増加でD202が自動増加しない
[ ] SIM 異常なしを理由にOK判定しない
```

## 6. Section 15 — サイクル開始 / 終了

一次基準：

- START：T4責任移管後のM500→M501遷移イベント
- END：M517サイクル完了イベント

```text
[ ] COMMENT cycle-start-event用途明確
[ ] COMMENT cycle-end-event用途明確
[ ] LADDER STARTをM500→M501遷移に同期
[ ] LADDER ENDをM517完了イベントに同期
[ ] SIM START前に計測開始しない
[ ] SIM M517未到達サイクルを正常完了扱いしない
```

## 7. Section 15 — D210 直近サイクルタイム

```text
[ ] COMMENT D210 = 直近サイクルタイム
[ ] LADDER cycle-startで計測開始
[ ] LADDER cycle-endでD210確定
[ ] LADDER 工程途中の経過値をD210へ常時上書きしない
[ ] SIM 正常完了時だけD210更新
[ ] SIM 異常中断時に正常値として確定しない
```

正式時間単位はTBD。D120と同一内部単位にする。

## 8. Section 15 — D212 最大 / D213 最小

### D212

```text
[ ] COMMENT D212 = 最大サイクルタイム
[ ] LADDER cycle-end時のみ比較
[ ] LADDER D210 > D212時のみ更新
[ ] SIM 小さい値ではD212を更新しない
```

### D213

```text
[ ] COMMENT D213 = 最小サイクルタイム
[ ] LADDER 初回有効サイクルはD210をD213へ格納
[ ] LADDER 2回目以降はD210 < D213時のみ更新
[ ] SIM 初期値0のまま固定されない
```

## 9. Section 15 — D211 平均

基本：累積時間 / 有効サイクル件数。

```text
[ ] COMMENT D211 = 平均サイクルタイム
[ ] LADDER 正常完了サイクルのみ累積対象
[ ] LADDER 有効件数0の除算防止
[ ] LADDER 異常中断サイクルを平均へ入れない
[ ] SIM 1回目はD210と同等になる
[ ] SIM 2回目以降の平均が正しく更新される
```

累積時間・有効件数用デバイスは未割付。D300帯を流用しない。

## 10. Section 15 — D120 / M774 タクト

```text
[ ] COMMENT D120 = 目標タクト
[ ] COMMENT M774 = タクト超過警告
[ ] LADDER D210とD120を同一内部単位で比較
[ ] LADDER D210 > D120でM774成立
[ ] LADDER M774単独でM324へ含めない
[ ] LADDER M774単独でM305を落とさない
[ ] SIM 目標超過で警告のみ成立
```

## 11. Section 15 — STOP / FAULT時の統計扱い

```text
[ ] LADDER M324発生サイクルを正常統計へ入れない
[ ] LADDER RESETで生産カウンタを初期化しない
[ ] LADDER M183をD200/D201初期化へ使わない
[ ] SIM normal stop→resumeで多重計測しない
[ ] SIM fault→manual recovery時に未完了サイクルを誤加算しない
```

通常停止時間をサイクル時間へ含める最終方針はTBD。

## 12. Section 15 — 保持 / 初期化

```text
[ ] COMMENT D200/D201/D210～D213保持候補を明記
[ ] LADDER 電源投入ごとに毎scan初期化しない
[ ] SIM 統計初期化操作が未実装ならGOTに確定機能として出さない
```

FX5U保持範囲は最終パラメータ設定時に確認する。

## 13. Section 16 — D300～D305 運転時間

| Device | 内容 | 基準 |
|---|---|---|
| D300 | CV01累積運転時間 | Y0またはM860 |
| D301 | CV02累積運転時間 | Y1またはM861 |
| D302 | CV03累積運転時間 | Y2またはM862 |
| D303 | CV04累積運転時間 | Y3またはM863 |
| D304 | 主軸累積運転時間 | M166優先 |
| D305 | 自動運転累積時間 | M305 |

```text
[ ] COMMENT D300～D305登録
[ ] LADDER CV運転時間を実運転成立基準で積算
[ ] LADDER D304はM824/Y30要求ではなくM166基準
[ ] LADDER D305はM305基準
[ ] SIM 主軸要求だけでD304が増えない
[ ] SIM M166成立時のみD304が増える
```

表示単位は分を一次基準とするが、内部積算方式は最終実装で固定する。

## 14. Section 16 — ST動作回数 D310～D314

```text
[ ] COMMENT D310 ST01
[ ] COMMENT D311 ST02
[ ] COMMENT D312 ST03
[ ] COMMENT D313 ST04
[ ] COMMENT D314 ST05
[ ] LADDER 対応端FB OFF→ONの有効成立で1回加算
[ ] LADDER 相反端同時成立時は加算しない
[ ] SIM FB ON保持で毎scan加算しない
```

一次基準は「要求方向の期待端が新規成立した1動作 = 1カウント」。

## 15. Section 16 — CY動作回数 D315～D319

```text
[ ] COMMENT D315 CY01
[ ] COMMENT D316 CY02
[ ] COMMENT D317 CY03
[ ] COMMENT D318 CY04
[ ] COMMENT D319 CY05
[ ] LADDER 端FB OFF→ONイベントで1回加算
[ ] LADDER 同じ端のON保持で加算継続しない
[ ] SIM 往復時のカウント意味が一貫している
```

## 16. Section 16 — 異常発生回数 D330～D351

対応：

- D330～D333：M701～M704
- D334～D338：M711～M715
- D339～D344：M721～M726
- D345：M730
- D346：M731
- D347～D350：M741～M744
- D351：M750

```text
[ ] COMMENT D330～D351登録
[ ] LADDER 各Alarm MのOFF→ON立上りで1回加算
[ ] LADDER Alarmラッチ中は加算し続けない
[ ] SIM 同一Alarm保持中にカウンタが1だけ増える
[ ] SIM RESET後に同じAlarmが再発した時は再度1増える
```

## 17. Section 16 — 診断 / 復旧統計 D360～D365

| Device | 内容 | イベント |
|---|---|---|
| D360 | 総異常発生回数 | M965新規アラーム |
| D361 | 総警告発生回数 | M967新規警告 |
| D362 | RESET実行回数 | 有効RESET受付 |
| D363 | 復旧要求発生回数 | M935 OFF→ON |
| D364 | 搬出満杯発生回数 | M770 OFF→ON |
| D365 | タクト超過発生回数 | M774 OFF→ON |

```text
[ ] COMMENT D360～D365登録
[ ] LADDER 各イベントをワンショットで加算
[ ] LADDER D362は単なるボタン押下ではなく有効RESET受付
[ ] SIM M965 1 pulseでD360 +1
[ ] SIM M967 1 pulseでD361 +1
[ ] SIM M935/M770/M774のON保持で連続加算しない
```

## 18. Section 16 — 従属処理境界

Section 16から以下を行わない。

```text
[ ] LADDER Yを直接駆動していない
[ ] LADDER M305をSETしていない
[ ] LADDER M321をSETしていない
[ ] LADDER M700帯AlarmをRESETしていない
[ ] LADDER M760～M764を解除していない
[ ] LADDER INV/主軸の危険な設定変更をしていない
```

## 19. Section 16 — 保持 / オーバーフロー

```text
[ ] COMMENT D300～D365は累積保守値の保持候補
[ ] LADDER 16bit上限到達時に無条件0循環しない方針
[ ] SIM 上限近傍の扱いを試験記録へ残す
[ ] SIM 保持設定未確定なら未確定として記録
```

32bit化範囲・FX5U保持範囲はTBD。

## 20. G07 / G08 表示連携

```text
[ ] SIM G07でD200/D201/D210～D213が意味どおり表示
[ ] SIM G07でD202/D203を確定品質値として見せない
[ ] SIM G08でD300～D304表示
[ ] SIM G08でD310～D319表示
[ ] SIM G08でD330～D351表示
[ ] SIM G08でD360～D365表示
[ ] SIM D306～D309 / D366～D399を用途未確定のまま見せない
```

## 21. Batch G 回帰試験

最低限：

1. 投入PB単独でD200が増えない。
2. 1ワーク投入でD200が1だけ増える。
3. 1ワーク排出でD201が1だけ増える。
4. D202/D203は自動加算されない。
5. 正常サイクルのみD210/D211/D212/D213へ反映。
6. タクト超過M774は警告扱いで、自動停止しない。
7. ST/CY FB保持で動作回数が毎scan増えない。
8. Alarmラッチ保持で異常回数が毎scan増えない。
9. M166未成立中は主軸運転時間D304を増やさない。
10. Section 16の統計更新がM305/M321/Yへ影響しない。
11. RESET PBで生産/保守統計を勝手に初期化しない。
12. 電源断保持範囲未確定なら試験結果を「未確定」と記録する。

## 22. Batch G 完了判定

Batch G完了は、次をすべて満たした時点とする。

- D200/D201がイベント単位で1回だけ加算される
- D202/D203が予約のまま
- D210～D213が正常完了サイクルのみ更新される
- M774がWarningとして扱われる
- D300～D365が仕様どおりのイベントで更新される
- 統計処理から設備制御本体を逆駆動しない
- 未確定の保持/32bit/時間単位を確定済みとして扱わない

## 23. 未確定事項

- サイクル時間の正式内部単位
- 累積時間/有効件数用デバイス
- 通常停止時間をタクトへ含める最終方針
- D200/D201/D210～D213の電源断保持範囲
- D300～D365の32bit化範囲
- FX5Uパラメータ上の保持範囲
- 統計クリア機能
- 外部CSV/履歴保存
- 将来品質判定入力

未確定事項は、GX Works3・GT Works3・試験記録でTBDのまま一致させる。
