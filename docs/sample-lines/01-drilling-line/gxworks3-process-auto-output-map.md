# 01 Drilling Line — GX Works3 加工ステップ / AUTO出力要求対応表

Status: Draft / 教材・シミュレーション基準

## 1. 目的

`gxworks3-process-step-spec.md` の M500～M517 と、`gxworks3-output-request-mapping-spec.md` の M800帯AUTO要求を1枚で照合できるようにする。

本資料は通常PLCの教材・シミュレーション用制御仕様であり、安全機能を通常PLC出力だけで成立させるものではない。

## 2. AUTO要求一覧

加工STで使用する主なAUTO要求は以下。

| AUTO M | 機能 | 実Y |
|---|---|---|
| M812 | ST05 上昇SOL | Y14 |
| M813 | ST05 下降SOL | Y15 |
| M814 | CY01 搬送面復帰SOL | Y16 |
| M815 | CY01 加工側切替SOL | Y17 |
| M816 | CY02 後退SOL | Y20 |
| M817 | CY02 前進SOL | Y21 |
| M818 | CY03 解除SOL | Y22 |
| M819 | CY03 位置決めSOL | Y23 |
| M820 | CY04 解除SOL | Y24 |
| M821 | CY04 クランプSOL | Y25 |
| M822 | CY05 上昇SOL | Y26 |
| M823 | CY05 下降SOL | Y27 |
| M824 | 主軸 RUN | Y30 |

## 3. ステップ別AUTO要求

| Step | M | 名称 | AUTO要求 |
|---:|---|---|---|
| 500 | M500 | WAIT | M812, M814, M816, M818, M820, M822 / M824 OFF |
| 501 | M501 | INFEED | 基本状態保持、原則新規大動作なし |
| 502 | M502 | ST05 STOP | M812 |
| 503 | M503 | SURFACE SWITCH | M815 |
| 504 | M504 | LATERAL IN | M817 |
| 505 | M505 | POSITION | M819 |
| 506 | M506 | CLAMP | M821 |
| 507 | M507 | SPINDLE PREP | M824 |
| 508 | M508 | DRILL | M824 + M823 |
| 509 | M509 | DRILL RETURN | M824 + M822、上昇確認後M824解除 |
| 510 | M510 | UNCLAMP | M820 |
| 511 | M511 | POSITION RELEASE | M818 |
| 512 | M512 | LATERAL RETURN | M816 |
| 513 | M513 | SURFACE RESTORE | M814 |
| 514 | M514 | DISCHARGE PREP | 基準位置保持、搬出満杯なら待機 |
| 515 | M515 | DISCHARGE | M813 + 搬出用搬送要求（搬送側仕様と整合） |
| 516 | M516 | DISCHARGE CHECK | 搬出要求解除、ST05復帰準備 |
| 517 | M517 | CYCLE COMPLETE | M812 + 基準位置保持、完了処理後M500へ |

## 4. 保持出力の考え方

ステップ遷移で機構を動かした後、次ステップでその位置を維持する必要がある場合でも、ダブルソレノイドを常時両側ONさせない。

AUTO要求は「そのステップで必要な指令」を明示し、位置保持の実際の扱いは採用バルブ・機械仕様に合わせて共通出力層で整理する。

教材では、以下を明確に分ける。

- 動作させるための要求
- フィードバックで確認する位置
- 次工程で必要な位置条件

## 5. 相反ペア

加工STの相反出力は以下。

- M812 / M813：ST05 上昇 / 下降
- M814 / M815：CY01 復帰 / 加工側
- M816 / M817：CY02 後退 / 前進
- M818 / M819：CY03 解除 / 位置決め
- M820 / M821：CY04 解除 / クランプ
- M822 / M823：CY05 上昇 / 下降

上位ステップロジックで同時成立させず、さらに `ACTUAL_OUTPUT` でも同時Y出力を防止する。

## 6. 主軸M824

主軸は以下を基準とする。

- M507：M824 ON、M166運転確認待ち
- M508：M824 ON継続、CY05下降
- M509：CY05上昇完了まではM824 ON継続
- M152上昇端確認後にM824解除
- M510以降：M824 OFF

現在のI/OはRUN確認 M166 と異常 M167のみで、ゼロ速度確認は持たない。存在しない停止確認信号を仮定しない。

## 7. 搬出ステップと搬送側の境界

M515ではST05を開放して搬出するが、どのコンベヤRUN要求を同時に使うかは `gxworks3-transfer-pattern-spec.md` と加工STの正式搬送機構に合わせる。

この段階では加工ST側から勝手に新しいYを増やさず、既存の物理I/Oと搬送仕様の範囲で調停する。

## 8. ラダー実装時の並び

PROCESS_AUTOでは各ステップごとに以下の順で記述する。

1. STEP ACTIVE
2. AUTO REQUEST生成
3. FEEDBACK確認
4. NEXT STEP条件
5. 現在STEP RESET / 次STEP SET
6. TIMEOUT監視リンク

これによりステップとM800帯の関係を追いやすくする。

## 9. 次工程

`gxworks3-timeout-alarm-matrix.md` で各ステップの監視対象、アラームM、復旧条件を一覧化する。
