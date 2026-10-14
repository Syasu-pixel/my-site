# safety-control-basic 公式参照メモ

## 参照した公式元
- ISO:
  - https://www.iso.org/standard/51528.html
  - https://www.iso.org/standard/73481.html
  - https://www.iso.org/standard/59970.html
- IEC:
  - https://webstore.iec.ch/en/publication/59927
  - https://webstore.iec.ch/en/publication/92835
  - https://webstore.iec.ch/en/publication/71256
- 既存STO参照メモ:
  - docs/reference-notes/sto-basic.md

## 確認対象資料
- ISO 12100:2010 — Safety of machinery — General principles for design — Risk assessment and risk reduction
- ISO 13849-1:2023 — Safety of machinery — Safety-related parts of control systems — Part 1
- IEC 62061:2021 + amendments — Safety of machinery — Functional safety of safety-related control systems
- ISO 13850:2015 — Safety of machinery — Emergency stop function — Principles for design
- IEC 60204-1:2016 + AMD1:2021 — Safety of machinery — Electrical equipment of machines — Part 1

## 確認日
- 2026-10-01

## 記事で使う範囲
- リスクアセスメントとリスク低減を安全設計の出発点とする一般原則
- 安全機能を実行する安全関連制御システムという考え方
- 安全入力 → 安全判断 → 安全出力 → 危険源という初心者向け整理
- 非常停止は安全制御全体そのものではなく、機械の非常停止機能として設計すること
- STOは対応ドライブの安全機能の1つであり、非常停止機能全体や主電源遮断と同一ではないこと

## 断定しない範囲
- 個別設備に必要なPLr / SIL / Category
- 個別機器の安全性能値、配線方式、診断方式、リセット条件
- 特定の安全入力・安全リレー・安全PLC・STOを使えば設備全体が安全になるという表現
- 機械固有のType-C規格を確認せずに具体的安全方策を確定すること
- 安全距離、停止時間、回路構成などを設備条件なしで固定値として示すこと

## 画像ルール
- 画像は記事構成確定後に OGP → Hero → 本文図の順で1枚ずつ生成・審査する
- メーカー名、ロゴ、型式、実在端子番号を入れない
- 実配線図ではなく概念図・模式図を基本とする
- 「安全機器を付ければ安全」という見せ方をしない
- リスク → 必要な安全機能 → 安全入力 / 判断 / 出力 → 危険源の関係を崩さない
- STOを電源OFF、ブレーキ、瞬時停止と同一視しない

## 公式用語・採用表記
| 種別 | 採用表記 | 英語 | 参照元 |
|---|---|---|---|
| 基本プロセス | リスクアセスメント / リスク低減 | risk assessment / risk reduction | ISO 12100 |
| 制御 | 安全関連制御システム | safety-related parts/control systems | ISO 13849-1 / IEC 62061 |
| 機能 | 非常停止機能 | emergency stop function | ISO 13850 |
| 安全機能 | 安全トルク遮断 | Safe Torque Off (STO) | IEC 60204-1 / 既存STO参照メモ |

## 画像内で使用してよい表記
- リスクアセスメント
- リスク低減
- 安全機能
- 安全入力
- 安全判断
- 安全出力
- 危険源
- 非常停止
- 安全ドア
- ライトカーテン
- 安全リレー
- 安全PLC
- STO
- 安全トルク遮断
- コンタクタ
- ドライブ

## 画像内で使用しない表記
- メーカー名・ロゴ・型式
- 実在端子番号
- 「安全リレーを付ければ安全」
- 「STO = 電源OFF」
- 「STO = ブレーキ」
- 「STOで必ず瞬時停止」

## メモ
- ISO 12100:2010 は2022年に確認され現行だが、2026-10-01時点で後継ドラフト ISO/DIS 12100.3 が開発中。
- IEC 62061 は2026年に Amendment 2 が公開されているため、記事では固定版の細部へ踏み込まず一般原則を扱う。
