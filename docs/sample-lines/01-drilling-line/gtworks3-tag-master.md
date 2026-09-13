# 01 Drilling Line — GT Works3 タグマスター

Status: Draft / GT Works3登録用基準

## 1. 目的

GT Works3で使用する主要タグ名とPLCデバイスを一対一で管理し、GX Works3コメント、GOT画面、試験表の名称ずれを防ぐ。

## 2. タグ命名ルール

接頭辞：

- `STS_`：状態表示
- `CMD_`：GOT操作要求
- `FB_`：フィードバック
- `BLK_`：操作不可理由
- `ALM_`：アラーム補助
- `PRC_`：加工工程
- `TRN_`：搬送状態
- `CNT_`：生産数
- `TIM_`：時間/タクト
- `SET_`：設定値

タグ名は意味を表す英字、画面上表示は日本語を基本とする。

## 3. 共通状態タグ

| GT Tag | PLC | 意味 |
|---|---|---|
| STS_AutoReady | M920 | 運転準備成立 |
| STS_AutoRunning | M921 | 自動運転中 |
| STS_AutoStartable | M922 | 自動起動可能 |
| STS_LoadPermitted | M923 | 投入可 |
| STS_StationAcceptable | M924 | 加工ST受入可 |
| STS_AlarmActive | M925 | 異常あり |
| STS_WarningActive | M926 | 警告あり |
| STS_ManualMode | M927 | 手動モード |
| STS_AutoMode | M928 | 自動モード |
| STS_ModeInvalid | M929 | モード未成立 |
| STS_ProcessWorkPresent | M930 | 加工ST搬送位置在荷 |
| STS_JigWorkPresent | M931 | 治具位置在荷 |
| STS_DischargeFull | M932 | 搬出満杯 |
| STS_SpindleRunning | M933 | 主軸運転確認 |
| STS_SpindleFault | M934 | 主軸異常 |
| STS_RecoveryRequired | M935 | 復旧要求 |
| STS_TransferBusyAny | M936 | 搬送中あり |
| STS_ProcessActive | M937 | 加工工程中 |
| STS_SettingsChangePermit | M938 | 設定変更許可 |

## 4. 搬送手動要求タグ

| GT Tag | PLC | 意味 |
|---|---|---|
| CMD_CV01_Run | M900 | CV01 JOG要求 |
| CMD_CV02_Run | M901 | CV02 JOG要求 |
| CMD_CV03_Run | M902 | CV03 JOG要求 |
| CMD_CV04_Run | M903 | CV04 JOG要求 |
| CMD_ST01_Up | M904 | ST01上昇要求 |
| CMD_ST01_Down | M905 | ST01下降要求 |
| CMD_ST02_Up | M906 | ST02上昇要求 |
| CMD_ST02_Down | M907 | ST02下降要求 |
| CMD_ST03_Up | M908 | ST03上昇要求 |
| CMD_ST03_Down | M909 | ST03下降要求 |
| CMD_ST04_Up | M910 | ST04上昇要求 |
| CMD_ST04_Down | M911 | ST04下降要求 |
| CMD_ST05_Up | M912 | ST05上昇要求 |
| CMD_ST05_Down | M913 | ST05下降要求 |

## 5. 加工手動要求タグ

| GT Tag | PLC | 意味 |
|---|---|---|
| CMD_CY01_Home | M980 | CY01搬送面復帰 |
| CMD_CY01_Process | M981 | CY01加工側 |
| CMD_CY02_Back | M982 | CY02後退 |
| CMD_CY02_Forward | M983 | CY02前進 |
| CMD_CY03_Release | M984 | CY03解除 |
| CMD_CY03_Position | M985 | CY03位置決め |
| CMD_CY04_Release | M986 | CY04解除 |
| CMD_CY04_Clamp | M987 | CY04クランプ |
| CMD_CY05_Up | M988 | CY05上昇 |
| CMD_CY05_Down | M989 | CY05下降 |
| CMD_Spindle_Run | M990 | 主軸RUN要求 |

## 6. 操作不可理由タグ

| GT Tag | PLC |
|---|---|
| BLK_NotManualMode | M940 |
| BLK_SafetyNotReady | M941 |
| BLK_AlarmActive | M942 |
| BLK_ConflictRequest | M943 |
| BLK_AdjacentTransferBusy | M944 |
| BLK_DestinationOccupied | M945 |
| BLK_StationNotAcceptable | M946 |
| BLK_CY01Position | M947 |
| BLK_CY02Position | M948 |
| BLK_CY03Position | M949 |
| BLK_CY04Position | M950 |
| BLK_CY05Position | M951 |
| BLK_WorkPosition | M952 |
| BLK_SpindleFault | M953 |
| BLK_DischargeFull | M954 |
| BLK_ProcessInterference | M955 |

## 7. アラーム補助タグ

| GT Tag | PLC | 意味 |
|---|---|---|
| ALM_AckReq | M960 | アラーム確認要求 |
| ALM_ResetReq | M961 | RESET要求候補 |
| ALM_BuzzerSilenceReq | M962 | ブザー停止要求候補 |
| ALM_ResetPermit | M963 | RESET可能 |
| ALM_ResetBlocked | M964 | RESET不可 |
| ALM_NewPulse | M965 | 新規アラーム通知 |
| ALM_HistoryEvent | M966 | 履歴記録トリガ |
| ALM_WarningNewPulse | M967 | 新規警告通知 |
| ALM_PresentLatch | M968 | アラーム表示保持 |
| ALM_RecoveryGuide | M969 | 復旧案内有効 |
| ALM_HistoryClearReq | M970 | 履歴消去要求 |
| ALM_HistoryClearPermit | M971 | 履歴消去許可 |

## 8. 主要FBタグ

| GT Tag | PLC | 意味 |
|---|---|---|
| FB_CV01_Present | M116 | CV01在荷 |
| FB_CV02_Present | M117 | CV02在荷 |
| FB_CV03_Present | M120 | CV03在荷 |
| FB_CV04_Present | M121 | CV04在荷 |
| FB_ProcessTransportPresent | M140 | 加工ST搬送位置在荷 |
| FB_JigPresent | M141 | 加工治具在荷 |
| FB_CY01_Home | M142 | CY01搬送面復帰端 |
| FB_CY01_Process | M143 | CY01加工側端 |
| FB_CY02_Back | M144 | CY02後退端 |
| FB_CY02_Forward | M145 | CY02前進端 |
| FB_CY03_Release | M146 | CY03解除端 |
| FB_CY03_Position | M147 | CY03位置決め端 |
| FB_CY04_Release | M150 | CY04解除端 |
| FB_CY04_Clamp | M151 | CY04クランプ端 |
| FB_CY05_Up | M152 | CY05上昇端 |
| FB_CY05_Down | M153 | CY05下降端 |
| FB_DischargeFull | M154 | 搬出満杯 |
| FB_SpindleRunning | M166 | 主軸運転確認 |
| FB_SpindleFault | M167 | 主軸異常 |

## 9. 搬送状態タグ

| GT Tag | PLC |
|---|---|
| TRN_T1_Busy | M430 |
| TRN_T2_Busy | M431 |
| TRN_T3_Busy | M432 |
| TRN_T4_Busy | M433 |
| TRN_CV01_PassSeen | M200 |
| TRN_CV01_PassComplete | M201 |
| TRN_CV02_PassSeen | M202 |
| TRN_CV02_PassComplete | M203 |
| TRN_CV03_PassSeen | M204 |
| TRN_CV03_PassComplete | M205 |
| TRN_CV04_PassSeen | M206 |
| TRN_CV04_PassComplete | M207 |
| TRN_DischargePassSeen | M208 |
| TRN_DischargePassComplete | M209 |

## 10. 工程・数値タグ

| GT Tag | PLC | 意味 |
|---|---|---|
| PRC_CurrentStep | D100 | 現在加工工程番号 |
| TRN_CurrentState | D101 | 現在搬送状態番号 |
| SET_TransferTimeout | D110 | 搬送タイムアウト |
| SET_ActuatorTimeout | D111 | 加工アクチュエータ監視時間 |
| SET_DrillDwell | D112 | 穴あけ滞留時間 |
| SET_TargetTakt | D120 | 目標タクト |
| CNT_TotalInfeed | D200 | 総投入数 |
| CNT_TotalDischarge | D201 | 総排出数 |
| CNT_OK | D202 | OK数 将来 |
| CNT_NG | D203 | NG数 将来 |
| TIM_LastCycle | D210 | 直近サイクル |
| TIM_AverageCycle | D211 | 平均サイクル |
| TIM_MaxCycle | D212 | 最大サイクル |
| TIM_MinCycle | D213 | 最小サイクル |

## 11. 実出力表示タグ

GOTでは監視のみ。

- `OUT_CV01` → Y0
- `OUT_CV02` → Y1
- `OUT_CV03` → Y2
- `OUT_CV04` → Y3
- `OUT_ST01_UP/DOWN` → Y4/Y5
- `OUT_ST02_UP/DOWN` → Y6/Y7
- `OUT_ST03_UP/DOWN` → Y10/Y11
- `OUT_ST04_UP/DOWN` → Y12/Y13
- `OUT_ST05_UP/DOWN` → Y14/Y15
- `OUT_CY01_*` → Y16/Y17
- `OUT_CY02_*` → Y20/Y21
- `OUT_CY03_*` → Y22/Y23
- `OUT_CY04_*` → Y24/Y25
- `OUT_CY05_*` → Y26/Y27
- `OUT_SpindleRun` → Y30

## 12. タグ運用ルール

- GTタグ名とPLCコメントの意味を一致させる。
- GOTからYを直接書き込まない。
- CMDタグはPLC側MANUAL処理を必ず経由する。
- FB/STS/OUTタグは原則読み取り表示。
- SPAREデバイスは用途確定までタグを作らない。
- デバイス変更時は `gxworks3-device-comment-master.md` と本ファイルを同時更新する。
