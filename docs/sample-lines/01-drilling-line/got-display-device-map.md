# 01 Drilling Line — GOT表示補助 / アラーム補助デバイス割付

Status: Draft / GT Works3・GX Works3連携基準

## 1. 目的

`hmi-spec.md`、`got-screen-layout-spec.md`、`gxworks3-device-comment-master.md` と整合させ、未確定だった M920～M939 表示補助、M960～M979 アラーム補助を正式割付する。

GOTは原則としてPLC内部状態を表示し、実Yを直接操作しない。

## 2. M920～M939 — GOT表示補助

| Device | Comment | 主表示画面 |
|---|---|---|
| M920 | GOT_AUTO_READY | G01 / G02 |
| M921 | GOT_AUTO_RUNNING | G01 |
| M922 | GOT_AUTO_STARTABLE | G01 / G02 |
| M923 | GOT_LOAD_PERMITTED | G01 |
| M924 | GOT_STATION_ACCEPTABLE | G01 |
| M925 | GOT_ALARM_ACTIVE | 全画面ヘッダ |
| M926 | GOT_WARNING_ACTIVE | 全画面ヘッダ |
| M927 | GOT_MANUAL_MODE | 全画面ヘッダ |
| M928 | GOT_AUTO_MODE | 全画面ヘッダ |
| M929 | GOT_MODE_INVALID | G01 / G02 |
| M930 | GOT_PROCESS_WORK_PRESENT | G01 / G04 |
| M931 | GOT_JIG_WORK_PRESENT | G01 / G04 |
| M932 | GOT_DISCHARGE_FULL | G01 / G02 |
| M933 | GOT_SPINDLE_RUNNING | G01 / G04 |
| M934 | GOT_SPINDLE_FAULT | G02 / G04 / G05 |
| M935 | GOT_RECOVERY_REQUIRED | G02 |
| M936 | GOT_TRANSFER_BUSY_ANY | G01 |
| M937 | GOT_PROCESS_ACTIVE | G01 |
| M938 | GOT_SETTINGS_CHANGE_PERMIT | G10 |
| M939 | SPARE | - |

## 3. 表示補助の生成基準

一次ロジック：

- M920 ← M321
- M921 ← M305
- M922 ← M322
- M923 ← M323
- M924 ← M330
- M925 ← M324
- M926 ← M325
- M927 ← M300
- M928 ← M301
- M929 ← NOT M300 AND NOT M301
- M930 ← M140
- M931 ← M141
- M932 ← M154
- M933 ← M166
- M934 ← M167 OR M750
- M935 ← 位置不整合または復旧待ち状態
- M936 ← M430 OR M431 OR M432 OR M433
- M937 ← M501～M517のいずれか

M938は保守モード・権限・自動停止中など、設定変更を許可する条件が確定した段階で実装する。

## 4. M960～M979 — アラーム / 履歴補助

| Device | Comment | 用途 |
|---|---|---|
| M960 | GOT_ALARM_ACK_REQ | アラーム確認要求 |
| M961 | GOT_ALARM_RESET_REQ | GOT上RESET要求候補 |
| M962 | GOT_BUZZER_SILENCE_REQ | ブザー停止要求 |
| M963 | GOT_ALARM_RESET_PERMIT | RESET可能表示 |
| M964 | GOT_ALARM_RESET_BLOCKED | RESET不可表示 |
| M965 | GOT_ALARM_NEW_PULSE | 新規アラーム通知 |
| M966 | GOT_ALARM_HISTORY_EVENT | 履歴記録トリガ候補 |
| M967 | GOT_WARNING_NEW_PULSE | 新規警告通知 |
| M968 | GOT_ALARM_PRESENT_LATCH | 表示保持補助 |
| M969 | GOT_RECOVERY_GUIDE_ACTIVE | 復旧案内表示 |
| M970 | GOT_HISTORY_CLEAR_REQ | 履歴消去要求候補 |
| M971 | GOT_HISTORY_CLEAR_PERMIT | 履歴消去許可 |
| M972～M979 | SPARE | 将来補助 |

## 5. RESET要求の扱い

物理RESET PB X3 / M103 / M183を正式な通常RESET操作とする基準は維持する。

M961 `GOT_ALARM_RESET_REQ` は、教材・保守画面での補助候補として予約するが、実装する場合でも以下を満たすこと。

- 原因復旧済み
- 通常PLC側のRESET許可成立
- 自動起動には接続しない
- M321運転準備を自動SETしない
- M305自動運転を自動SETしない
- 安全機能のRESETを代替しない

採用しない場合はM961を未使用のまま残す。

## 6. ブザー停止

物理ブザー停止PBを正式操作とし、M962はGOT画面上の同等要求を採用する場合の候補とする。

ブザー停止は音のみを停止し、M700帯アラームラッチは解除しない。

## 7. アラーム確認と履歴

M960は「表示を確認した」というHMI上の確認操作用。

確認操作によって、

- 異常原因
- M324異常総合
- M700帯ラッチ

を解除しない。

履歴は発生・復旧・確認を別イベントとして記録できる構成を推奨する。

## 8. M940～M959との関係

M940～M959は操作不可理由専用。

- M920～M939：表示状態
- M940～M959：操作不可理由
- M960～M979：アラーム / 履歴補助
- M980～M990：加工系手動要求

と役割を分離する。

## 9. D100 / D101との関係

GOTの現在状態はMだけでなく、

- D100 現在加工ステップ番号
- D101 現在搬送状態番号

も使用する。

D100はM500～M517から生成し、D101はBusy / サブステップから表示用に生成する。

## 10. GT Works3タグ命名例

- `STS_AutoReady` → M920
- `STS_AutoRunning` → M921
- `STS_LoadPermitted` → M923
- `STS_AlarmActive` → M925
- `STS_RecoveryRequired` → M935
- `ALM_AckReq` → M960
- `ALM_ResetPermit` → M963
- `ALM_NewPulse` → M965

PLCデバイスコメントとGOTタグの意味を一致させる。

## 11. 変更管理

M920～M990を変更する場合は、

1. 本ファイル
2. `gxworks3-device-comment-master.md`
3. `gxworks3-got-manual-request-spec.md`
4. `got-screen-layout-spec.md`
5. `hmi-spec.md`
6. GT Works3タグ

を同時更新する。
