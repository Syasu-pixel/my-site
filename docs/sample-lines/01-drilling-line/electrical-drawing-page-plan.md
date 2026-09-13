# 01 Drilling Line — 電気回路図ページ構成

Status: Draft / 図面化前のページ構成基準

## 1. 目的

本資料は、これまで作成した設備仕様、I/O、端子台、盤間配線、DC24V分配、インバータ・主軸I/Oを、実際の電気回路図へ落とし込むためのページ構成を定める。

安全回路については通常制御とページを分離し、実機向け詳細回路はリスクアセスメント・必要安全性能・採用安全機器が確定してから作成する。

## 2. 図面セット全体構成

教材用1号機は、まず以下の **E01～E18** を基本セットとする。

| Page | 内容 | 主な参照仕様 |
|---|---|---|
| E01 | 表紙・図面目次・設備基本情報 | master-spec.md |
| E02 | 電源系統概要 / 単線構成 | hardware-spec.md / bom-spec.md |
| E03 | AC主回路・INV01～04電源系統 | drive-io-wiring-schedule.md |
| E04 | DC24V電源・分岐保護 | dc24v-load-spec.md / dc24v-distribution-common-spec.md |
| E05 | PLC本体・追加DI・将来I/O予約 | hardware-spec.md / physical-io-map.md |
| E06 | OP01操作入力 X0～X7 | op01-wiring-schedule.md |
| E07 | 共通条件・安全監視入力 X10～X15 | terminal-block-spec.md |
| E08 | 搬送入力 X16～X37 | transport-wiring-schedule.md |
| E09 | 加工ST入力 X40～X55 | process-station-wiring-schedule.md |
| E10 | INV・主軸フィードバック X56～X67 / 予備X70～X77 | drive-io-wiring-schedule.md |
| E11 | INV RUN出力 Y0～Y3 | drive-io-wiring-schedule.md |
| E12 | ST01～ST05 SOL出力 Y4～Y15 | transport-wiring-schedule.md |
| E13 | CY01～CY05 SOL出力 Y16～Y27 | process-station-wiring-schedule.md |
| E14 | 主軸・表示・ブザー Y30～Y34 / 予備Y35～Y37 | process-station-wiring-schedule.md / op01-wiring-schedule.md |
| E15 | 端子台 XT1～XT3 / OP01盤間 | terminal-block-spec.md / interpanel-wiring-spec.md |
| E16 | 端子台 XT4～XT6 / 搬送・加工・INV | terminal-block-spec.md |
| E17 | XT7安全監視 / XT8将来拡張 / PE・シールド | terminal-block-spec.md |
| E18 | I/O・端子・ケーブル・線番クロスリファレンス | 各wiring schedule |

## 3. ページ設計方針

### 3.1 1ページ1機能群

異なる機能を1ページへ詰め込みすぎず、保守時に目的の回路を探しやすくする。

例：

- 搬送センサ入力はE08へ集約
- 加工STセンサはE09へ集約
- ストッパーSOLはE12へ集約
- 加工シリンダSOLはE13へ集約

### 3.2 PLC入出力は物理I/O順

図面では原則としてPLC物理アドレス順に並べる。

- X0 → X7
- X10 → X15
- X16 → X37
- X40 → X77
- Y0 → Y37

これによりGX Works3のI/O割付と回路図を直接照合しやすくする。

### 3.3 端子台・線番・タグを必ず併記

各信号には、可能な範囲で以下を同時表示する。

- PLC X/Y
- 信号名称
- 機器タグ
- 端子台番号
- 線番
- ケーブルタグ

## 4. 将来I/O拡張の図面表現

現在のDOは32点中29点使用であるため、E05に **将来追加DOユニット予約枠** を明示する。

表記例：

`FUTURE DO MODULE — 16～32 points / model TBD`

正式機種が未選定の段階では架空のYアドレスを割り振らない。

E17のXT8も将来I/O受け端子として表現し、将来改造時に既存XT4 / XT5を崩さず増設できる構成とする。

## 5. 予備I/Oの扱い

### DI

- X70～X77：8点予備

### DO

- Y35～Y37：3点予備

予備I/Oは図面上でも省略せず、「SPARE」として端子・用途予約状態が分かるようにする。

ただしY35～Y37は小規模変更用とし、4点以上の出力追加が必要になった場合は追加DOユニット導入を基本とする。

## 6. XT8将来拡張ページ

E17ではXT8を約24端子の将来拡張領域として示す。

推奨区分：

- XT8-01～08：将来DI
- XT8-09～16：将来DO
- XT8-17～20：将来+24V / 0V分配
- XT8-21～24：完全予備

これは固定I/O割付ではなく、盤内レイアウトと外部配線余地を確保するための予約区分とする。

## 7. 安全関連図面の位置付け

E07 / E17で扱うのは通常PLCが監視する安全状態信号のみ。

以下の詳細回路は別冊または別ページ群として扱う。

- 非常停止二重系
- 安全扉
- ライトカーテン
- 安全リレー / 安全PLC
- STO等の駆動停止
- 空圧残圧排気に関わる安全機能

本教材の通常PLC回路だけで安全機能を成立させない。

## 8. クロスリファレンスの基準

E18で最低限以下を一覧化する。

| 項目 | 例 |
|---|---|
| PLC I/O | X42 |
| 信号 | CY01 搬送面復帰端 |
| 端子 | XT5-03 |
| 機器タグ | LS-CY01-H |
| 線番 | 403 |
| ケーブル | CBL-PROC-01 |
| 参照ページ | E09 |

同様にY出力側も整理する。

## 9. 図面番号ルール

教材上は以下を基準とする。

- 電気回路図：E01～E99
- 空圧回路図：P01～P99
- 機械配置 / 外形：M01～M99
- I/O・一覧表：L01～L99

将来別設備を追加する場合は設備番号をプレフィックスに持たせてもよい。

## 10. 変更管理

図面化後にI/Oや端子を変更する場合、少なくとも以下を同時に更新する。

1. physical-io-map.md
2. terminal-block-spec.md
3. 対応する wiring schedule
4. 電気回路図該当ページ
5. GX Works3デバイスコメント / I/Oコメント

一方だけ変更して不整合を残さない。

## 11. 次工程

このページ構成を基準に、次は以下を進める。

1. E02 電源系統概要の中身を定義
2. E04 DC24V分岐表を回路図形式へ整理
3. E05 PLC・I/O構成図を具体化
4. E06以降の入出力回路を順番に図面化できるテンプレートへ落とす
5. 盤内発熱一次計算を実施し、W800×H1200×D350 mm級の妥当性を再確認する
