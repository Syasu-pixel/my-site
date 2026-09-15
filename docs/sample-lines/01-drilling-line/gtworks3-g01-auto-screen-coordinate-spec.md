# 01 Drilling Line — GT Works3 G01 自動運転画面 座標仕様

Status: Draft / GT Works3実装直前基準

## 1. 目的

G01 自動運転画面を、GT Works3でそのまま配置作業へ移れるよう、論理座標・領域・オブジェクト名・タグを固定する。

本仕様はGOT実画素数へ依存しない論理座標で管理する。最終GOT機種・解像度確定後に等比変換する。

## 2. 論理キャンバス

- 論理幅：1000
- 論理高さ：750
- 原点：左上 (0,0)
- X：右方向
- Y：下方向

領域：

- Header：Y 0～80
- Main：Y 80～670
- Footer：Y 670～750

推奨マージン：左右 20、領域内 10～20。

## 3. 画面全体構成

```text
┌──────────────────────────────────────────────────────┐
│ HEADER : MODE / READY / RUN / ALARM / STEP / CLOCK  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  LOAD→CV01→CV02→CV03→CV04→PROCESS→OUT               │
│                                                      │
│  [運転状態]                 [加工工程・位置]         │
│                                                      │
│  [警告/待ちメッセージ]      [サイクル/タクト]        │
│                                                      │
├──────────────────────────────────────────────────────┤
│ AUTO READY MANUAL ALARM PRODUCTION MAINT             │
└──────────────────────────────────────────────────────┘
```

## 4. Headerオブジェクト

| Object | x | y | w | h | Tag/Device | 表示 |
|---|---:|---:|---:|---:|---|---|
| TXT_EquipmentName | 20 | 15 | 190 | 45 | - | 01 Drilling Line |
| LMP_ModeAuto | 220 | 15 | 90 | 45 | M928 | AUTO |
| LMP_ModeManual | 315 | 15 | 90 | 45 | M927 | MANUAL |
| LMP_Ready | 410 | 15 | 90 | 45 | M920 | READY |
| LMP_Run | 505 | 15 | 90 | 45 | M921 | RUN |
| LMP_Warning | 600 | 15 | 90 | 45 | M926 | WARNING |
| BTN_AlarmHeader | 695 | 15 | 100 | 45 | M925 / G05 | ALARM |
| NUM_HeaderStep | 805 | 15 | 75 | 45 | D100 | STEP |
| SYS_Clock | 890 | 15 | 90 | 45 | GOT時刻 | HH:MM |

MODE未成立 M929 の場合はAUTO/MANUAL領域に `MODE NG` を優先表示する。

## 5. 設備フロー部

領域：x 20～980 / y 100～300。

ゾーンカードは横並びで統一する。

| Object | x | y | w | h | Tag | 内容 |
|---|---:|---:|---:|---:|---|---|
| TXT_Load | 25 | 165 | 70 | 50 | - | LOAD |
| LMP_CV01_Present | 115 | 145 | 105 | 80 | M116 | CV01 空/在荷 |
| LMP_CV02_Present | 240 | 145 | 105 | 80 | M117 | CV02 空/在荷 |
| LMP_CV03_Present | 365 | 145 | 105 | 80 | M120 | CV03 空/在荷 |
| LMP_CV04_Present | 490 | 145 | 105 | 80 | M121 | CV04 空/在荷 |
| LMP_ProcessTransport | 625 | 130 | 115 | 65 | M140 | ST搬送位置 |
| LMP_JigPresent | 625 | 205 | 115 | 65 | M141 | 治具位置 |
| LMP_DischargeFull | 770 | 145 | 105 | 80 | M932 | OUT / FULL |

搬送矢印の中央にBusy表示を置く。

| Object | x | y | w | h | Tag | 内容 |
|---|---:|---:|---:|---:|---|---|
| LMP_T1_Busy | 205 | 110 | 50 | 30 | M430 | T1 |
| LMP_T2_Busy | 330 | 110 | 50 | 30 | M431 | T2 |
| LMP_T3_Busy | 455 | 110 | 50 | 30 | M432 | T3 |
| LMP_T4_Busy | 580 | 110 | 50 | 30 | M433 | T4 |
| LMP_TransferBusyAny | 885 | 145 | 90 | 35 | M936 | 搬送中 |
| LMP_ProcessActive | 885 | 190 | 90 | 35 | M937 | 加工中 |

## 6. 左下 — 運転状態カード

領域：x 20～480 / y 320～540。

| Object | x | y | w | h | Tag | 表示 |
|---|---:|---:|---:|---:|---|---|
| TXT_RunStatusTitle | 30 | 330 | 200 | 35 | - | 運転状態 |
| LMP_AutoReady | 40 | 380 | 190 | 45 | M920 | 運転準備 |
| LMP_AutoStartable | 250 | 380 | 190 | 45 | M922 | 自動起動可 |
| LMP_LoadPermitted | 40 | 435 | 190 | 45 | M923 | 投入可 |
| LMP_StationAcceptable | 250 | 435 | 190 | 45 | M924 | 加工ST受入可 |
| LMP_RecoveryRequired | 40 | 490 | 190 | 45 | M935 | 復旧必要 |
| LMP_DischargeFullStatus | 250 | 490 | 190 | 45 | M932 | 搬出満杯 |

## 7. 右下 — 加工工程カード

領域：x 500～980 / y 320～540。

| Object | x | y | w | h | Tag | 表示 |
|---|---:|---:|---:|---:|---|---|
| TXT_ProcessTitle | 510 | 330 | 200 | 35 | - | 加工工程 |
| NUM_ProcessStep | 520 | 375 | 100 | 65 | D100 | 現在STEP |
| TXT_ProcessStepName | 635 | 375 | 320 | 65 | D100連動 | 工程名称 |
| LMP_SpindleRunning | 520 | 455 | 135 | 40 | M933 | 主軸運転 |
| LMP_CY03_Position | 665 | 455 | 135 | 40 | M147 | 位置決め |
| LMP_CY04_Clamp | 810 | 455 | 135 | 40 | M151 | クランプ |
| LMP_CY05_Up | 520 | 505 | 135 | 40 | M152 | ドリル上 |
| LMP_CY05_Down | 665 | 505 | 135 | 40 | M153 | ドリル下 |
| LMP_SpindleFault | 810 | 505 | 135 | 40 | M934 | 主軸異常 |

工程名はM500～M517またはD100文字列切替で表示する。

## 8. 下段情報 — 警告 / タクト

領域：x 20～980 / y 560～650。

| Object | x | y | w | h | Tag | 表示 |
|---|---:|---:|---:|---:|---|---|
| TXT_StatusMessage | 30 | 575 | 500 | 55 | M770～M775 | 現在の待ち/警告理由 |
| NUM_LastCycle | 555 | 575 | 125 | 55 | D210 | 直近Cycle |
| NUM_TargetTakt | 695 | 575 | 125 | 55 | D120 | 目標Takt |
| LMP_TaktOver | 835 | 575 | 120 | 55 | M774 | タクト超過 |

警告と故障を同じ表示色・同じ文言で扱わない。

## 9. Footerナビゲーション

| Object | x | y | w | h | 遷移 |
|---|---:|---:|---:|---:|---|
| NAV_G01_Auto | 20 | 685 | 145 | 45 | G01 |
| NAV_G02_Ready | 180 | 685 | 145 | 45 | G02 |
| NAV_G03_Manual | 340 | 685 | 145 | 45 | G03 |
| NAV_G05_Alarm | 500 | 685 | 145 | 45 | G05 |
| NAV_G07_Production | 660 | 685 | 145 | 45 | G07 |
| NAV_G08_Maint | 820 | 685 | 145 | 45 | G08 |

G01自身のボタンは現在画面として選択表示にする。

## 10. 表示ロジック優先順位

1. M925 異常あり
2. M935 復旧必要
3. M932 搬出満杯
4. M926 警告あり
5. M921 自動運転中
6. M922 自動起動可能
7. M920 運転準備

同一領域に複数状態が重なる場合は上記優先度で表示する。

## 11. 操作方針

G01は監視中心とする。

- GOTから運転準備をSETしない。
- GOTから自動起動しない。
- GOTから個別アクチュエータを操作しない。
- ALARM / READY / MANUAL等の画面遷移のみ許可する。

## 12. GT Works3実装時チェック

- オブジェクト名が `gtworks3-screen-object-list.md` と一致。
- タグが `gtworks3-tag-master.md` と一致。
- D100工程名称の切替表はM500～M517と一致。
- M770～M775待ち/警告表示を故障表示と混同しない。
- Yデバイスへ書込むオブジェクトが存在しない。
- 実解像度確定時は論理座標から一括スケールする。
