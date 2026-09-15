# 01 Drilling Line — GOT表示補助 / アラーム補助デバイス割付

Status: Draft / GT Works3・GX Works3連携基準

## 1. 目的

`hmi-spec.md`、`got-screen-layout-spec.md`、`gxworks3-device-comment-master.md`、`gxworks3-got-linkage-logic-spec.md` と整合させ、M920～M939 表示補助、M960～M979 アラーム補助を正式割付する。

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

直接ミラー：

- M920 ← M321
- M921 ← M305
- M922 ← M322
- M923 ← M323
- M924 ← M330
- M925 ← M324
- M926 ← M325
- M927 ← M300
- M928 ← M301
- M930 ← M140
- M931 ← M141
- M932 ← M154
- M933 ← M166

派生状態：

- M929 ← NOT M300 AND NOT M301
- M934 ← M167 OR M750
- M936 ← M430 OR M431 OR M432 OR M433
- M937 ← M501～M517のいずれか

M935は、異常中、異常停止後に搬送Busyが残っている場合、または加工途中停止で位置整合が取れていない場合など「手動復旧または位置確認が必要」な状態で成立させる。

M938はPLC側の機械状態許可として、一次条件を次とする。

```text
M938 = M300 AND NOT M305 AND NOT M324
```

GT Works3側ではこれにLevel 2相当の保守権限を追加する。M938単独を権限ビットとして扱わない。

詳細は `gxworks3-got-linkage-logic-spec.md` を正とする。

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

## 5. RESET可否

`gxworks3-alarm-latch-reset-spec.md` のM340共通RESET許可と個別原因復旧判定を使う。

一次関係：

```text
M963 = M324 AND M340 AND 個別アラーム原因復旧条件成立
M964 = M324 AND NOT M963
```

複数アラームがある場合、原因が復旧したものだけ解除可能とし、未復旧アラームは保持する。

物理RESET PB X3 / M103 / M183を正式な通常RESET操作とする基準は維持する。

M961 `GOT_ALARM_RESET_REQ` は補助候補とし、採用する場合でもM963成立時のみPLC側RESET処理へ渡す。

RESETから以下を行わない。

- M321運転準備を自動SET
- M305自動運転を自動SET
- 自動起動
- 安全機能のRESET代替

## 6. ブザー停止

物理ブザー停止PBを正式操作とし、M962はGOT画面上の同等要求を採用する場合の候補とする。

採用時は、

```text
M187 OR M962 → M327 ブザー消音状態
```

とし、音のみを停止する。M700帯アラームラッチ、M324、履歴は解除しない。

## 7. アラーム確認と履歴

M960は「表示を確認した」というHMI上の確認操作用。

確認操作によって、

- 異常原因
- M324異常総合
- M700帯ラッチ

を解除しない。

M965は新規アラーム立上りパルス、M967は新規警告立上りパルス、M966は履歴イベント補助とする。

一次案：

- M968 ← M324
- M969 ← M935 OR M964

発生・復旧・ACK・RESETは履歴上で別イベントとして扱う。

## 8. M940～M959との関係

M940～M959は操作不可理由専用。

- M920～M939：表示状態
- M940～M959：操作不可理由
- M960～M979：アラーム / 履歴補助
- M980～M990：加工系手動要求

BLOCKビットは、原則として「現在押されているGOT要求が通らない理由」として生成する。

## 9. D100 / D101との関係

GOTの現在状態はMだけでなく、

- D100 現在加工ステップ番号
- D101 現在搬送状態番号

も使用する。

D100はM500～M517から生成する。

D101は表示専用とし、非隣接搬送が同時成立可能なため、D101単独を制御状態の正本にしない。M430～M433 Busyを必ず併記する。

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
4. `gxworks3-got-linkage-logic-spec.md`
5. `got-screen-layout-spec.md`
6. `hmi-spec.md`
7. GT Works3タグ

を同時更新する。
