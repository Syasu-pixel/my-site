# 01 Drilling Line — GX Works3 GOT手動要求 / 操作不可理由

Status: Draft / GT Works3・GX Works3連携基準

## 1. 目的

GOT手動画面からの操作要求をM900帯へ受け、PLC側で条件確認後にM830～M854のMANUAL要求へ変換する。

GOTからYへ直接書き込まない。

## 2. M900～M919 手動操作要求

### 搬送

- M900：GOT_CV01_RUN_REQ
- M901：GOT_CV02_RUN_REQ
- M902：GOT_CV03_RUN_REQ
- M903：GOT_CV04_RUN_REQ

### ストッパー

- M904：GOT_ST01_UP_REQ
- M905：GOT_ST01_DOWN_REQ
- M906：GOT_ST02_UP_REQ
- M907：GOT_ST02_DOWN_REQ
- M908：GOT_ST03_UP_REQ
- M909：GOT_ST03_DOWN_REQ
- M910：GOT_ST04_UP_REQ
- M911：GOT_ST04_DOWN_REQ
- M912：GOT_ST05_UP_REQ
- M913：GOT_ST05_DOWN_REQ

### 加工アクチュエータ

M900～M919だけでは全操作を収め切れないため、加工軸はM980帯を使用する。

- M980：GOT_CY01_HOME_REQ
- M981：GOT_CY01_PROCESS_REQ
- M982：GOT_CY02_BACK_REQ
- M983：GOT_CY02_FWD_REQ
- M984：GOT_CY03_RELEASE_REQ
- M985：GOT_CY03_POSITION_REQ
- M986：GOT_CY04_RELEASE_REQ
- M987：GOT_CY04_CLAMP_REQ
- M988：GOT_CY05_UP_REQ
- M989：GOT_CY05_DOWN_REQ
- M990：GOT_SPINDLE_RUN_REQ

M980帯はGOT手動操作拡張帯として予約する。

## 3. MANUAL要求への変換

基準：

`GOT REQUEST AND M300手動モード AND 個別操作許可 → M830～M854`

例：

- M900 → M830 CV01 RUN_MANUAL
- M904 → M834 ST01 UP_MANUAL
- M905 → M835 ST01 DOWN_MANUAL
- M980 → M844 CY01 HOME_MANUAL
- M981 → M845 CY01 PROCESS_MANUAL
- M990 → M854 SPINDLE RUN_MANUAL

相反ペアは同時要求を許可しない。

## 4. 共通手動許可

手動操作の基本条件：

- M300 手動モード成立
- 安全監視条件成立
- M321運転準備ラッチの扱いは操作対象に応じて定義
- M324重大異常中は通常手動操作を制限
- 相反出力要求なし
- 機械干渉条件なし

安全機能の迂回や無効化を手動モードで許可しない。

## 5. M940～M959 操作不可理由

GOTで「なぜ動かないか」を表示するため、代表ブロック理由を割り付ける。

- M940：BLOCK_手動モードでない
- M941：BLOCK_安全監視未成立
- M942：BLOCK_異常中
- M943：BLOCK_相反要求あり
- M944：BLOCK_隣接搬送動作中
- M945：BLOCK_搬送先在荷あり
- M946：BLOCK_加工ST受入不可
- M947：BLOCK_CY01位置不成立
- M948：BLOCK_CY02位置不成立
- M949：BLOCK_CY03位置不成立
- M950：BLOCK_CY04位置不成立
- M951：BLOCK_CY05位置不成立
- M952：BLOCK_ワーク位置不成立
- M953：BLOCK_主軸異常
- M954：BLOCK_搬出満杯
- M955：BLOCK_工程干渉
- M956～M959：SPARE

## 6. 手動画面表示

各機構について最低限、

- 操作ボタン
- 現在指令
- 原位置FB
- 動作位置FB
- 操作可/不可
- 不可理由

を同時表示する。

例：CY04なら、解除/クランプの2操作、M150/M151、M850/M851、BLOCK状態を同じ枠内に表示する。

## 7. 自動中の手動要求

M305自動運転中は通常のGOT手動要求をMANUAL要求へ通さない。

必要な復旧操作は、自動停止→手動モード→復旧画面の順で行う。

## 8. 主軸手動運転

主軸手動要求M990は、少なくとも以下を満たすときだけM854へ通す。

- 手動モード
- 主軸異常なし
- 加工側干渉条件なし
- CY05位置など機械条件が許可状態

主軸の安全停止機能は通常PLC手動ロジックで代替しない。

## 9. モーメンタリ操作

GOT手動操作は原則モーメンタリ要求とし、画面を離れた後も要求が残り続けない構成を基本とする。

保持が必要な操作はPLC側で目的・解除条件を明示してラッチする。

## 10. 変更管理

GOT操作Mを変更した場合は、

- 本ファイル
- `gxworks3-device-comment-master.md`
- GT Works3画面タグ
- MANUAL section
- GOT画面仕様

を同時更新する。
