# 01 Drilling Line — GT Works3 全体整合監査

Status: Draft / G01～G10 横断監査

## 1. 目的

GOT/HMI仕様、G01～G10画面仕様、GTタグ、GX Works3デバイスコメント、アラーム仕様を横断し、GT Works3実装前に名称・デバイス・操作権限・画面遷移・RESET方針・安全境界の不整合を確認する。

本監査は教材・シミュレーション用の通常制御HMIを対象とする。安全機能そのものを通常PLCやGOTで代替しない。

## 2. 監査対象

- `hmi-spec.md`
- `got-screen-layout-spec.md`
- `got-display-device-map.md`
- `gtworks3-screen-object-list.md`
- `gtworks3-tag-master.md`
- `gtworks3-g01-auto-screen-coordinate-spec.md`
- `gtworks3-g02-ready-recovery-coordinate-spec.md`
- `gtworks3-g03-manual-transfer-coordinate-spec.md`
- `gtworks3-g04-manual-process-coordinate-spec.md`
- `gtworks3-g05-current-alarm-coordinate-spec.md`
- `gtworks3-g06-alarm-history-coordinate-spec.md`
- `gtworks3-g07-production-coordinate-spec.md`
- `gtworks3-g08-maintenance-coordinate-spec.md`
- `gtworks3-g09-io-monitor-coordinate-spec.md`
- `gtworks3-g10-settings-coordinate-spec.md`
- `gxworks3-device-comment-master.md`
- `gxworks3-got-manual-request-spec.md`
- `alarm-spec.md`

## 3. 結果概要

現時点で、G01～G10は同じ論理キャンバス 1000×750、共通Header、共通Footer、同一デバイス体系で接続できる状態。

今回の監査で見つかった即時修正項目は3件。

1. G03/G04の相互切替ボタンが下段診断表示と重なる可能性
2. `gxworks3-device-comment-master.md` のM920帯/M960帯が「未割付」の旧記述のまま
3. G05のアラーム対象が `M701～M764` 連続範囲表記で、未割付デバイスまで登録する誤解の余地

3件とも修正済み。

## 4. 画面遷移監査

### 通常Footer

全主要画面で以下を基準とする。

- AUTO → G01
- READY → G02
- MANUAL → G03
- ALARM → G05
- PRODUCTION → G07
- MAINT → G08

### 補助遷移

- G03 ↔ G04：手動画面サブナビ
- G05 → G06：アラーム履歴
- G06 → G05：現在アラーム
- G08 → G09：I/Oモニタ
- G08 → G10：設定
- G08 → G06：アラーム履歴

G03/G04のサブナビはMain上端へ移動し、BLOCK表示・D101表示と重ならないよう修正した。

## 5. GOT書込先監査

GOTが直接書込む候補は、通常制御用の要求Mと設定Dに限定する。

### 手動搬送

- M900～M913

### 手動加工

- M980～M990

### アラーム/HMI補助

- M960 ACK要求
- M961 RESET要求候補
- M962 ブザー停止要求候補
- M970 履歴消去要求候補

### 設定

- D110
- D111
- D112
- D120

Y0～Y34への直接書込は全画面で禁止。

## 6. RESET / ACK / ブザー監査

意味を分離している。

- ACK：表示確認のみ
- ブザー停止：音のみ停止
- RESET：原因復旧後の異常ラッチ解除要求

RESET後も以下を自動で行わない。

- M321運転準備ラッチSET
- M305自動運転SET
- 自動起動
- 安全機能RESETの代替

物理RESET PBを通常操作の基準とし、M961は採用時のみ補助候補。

## 7. 安全境界監査

GOT上のX10～X15 / M110～M115 / M760～M764は監視表示として扱う。

- 非常停止
- 安全扉
- ライトカーテン
- 安全リレー

の安全機能そのものをGOTや通常PLCで成立させない。

G02/G05/G06/G09でも「安全監視」と「安全機能本体」を区別する記述を維持している。

## 8. アラーム登録監査

G05/G06の正式対象は以下。

- M701～M704
- M711～M715
- M721～M726
- M730
- M731
- M741～M744
- M750
- M760～M764

未割付の隙間MはGT Works3アラーム登録対象にしない。

警告/状態 M770～M775 は故障アラームと分離する。

## 9. タグ / デバイス監査

以下の役割分離は一致している。

- M920～M939：GOT表示補助
- M940～M959：操作不可理由
- M960～M979：アラーム/履歴補助
- M980～M990：加工系手動要求

`gxworks3-device-comment-master.md` を `got-display-device-map.md` / `gtworks3-tag-master.md` と同期済み。

## 10. 生産 / 設定監査

- D200/D201：総投入/総排出
- D202/D203：OK/NG将来予約
- D210～D213：サイクル統計
- D120：目標タクト

D202/D203は品質判定機構未導入中に実績として強調表示しない。

D110/D111/D112/D120はG10で編集候補だが、M938変更許可、権限、入力範囲、確認操作を必須とする。

## 11. 現在残るTBD

### A. M938 設定変更許可の正式生成条件

候補要素：

- 自動停止中
- 異常なし
- 保守権限成立
- 設定変更モード条件

PLC側で正式条件を確定するまで、GOT単独で許可を生成しない。

### B. D300～D399 保守デバイス割付

G08の運転時間、動作回数、異常回数は表示項目だけ確定済み。具体D番号、保持属性、単位、オーバーフロー方針は未確定。

### C. アラーム発生時STEP保持

G06で発生時STEPを表示する方針は確定しているが、発生イベント時にD100を履歴へ保存する具体方式は未確定。

### D. GOT機種 / 実解像度

現在は1000×750論理座標。GT2708-STBD候補の最終採否と実解像度確認後に一括スケールする。

### E. 権限実装

Level 0～2の方針はあるが、GT Works3上のユーザー認証方式・パスワード管理・タイムアウトは未確定。

### F. M961 / M962 採用可否

GOT RESET、GOTブザー停止は候補。物理操作を正式基準とする方針は維持する。

## 12. 実装開始判定

GT Works3の画面骨格、表示タグ、手動要求、アラーム表示、画面遷移については実装開始可能。

ただし以下は仮実装/予約扱いとする。

- M938生成条件
- D300～D399
- 発生時STEP履歴保存
- 実機用設定上下限
- 最終GOT解像度
- 権限方式

## 13. 次工程

次はGX Works3側で、GOTと直接接続する表示補助ロジックを具体化する。

優先順：

1. M920～M938生成ロジック
2. M940～M955 BLOCK理由生成ロジック
3. M963/M964 RESET可否ロジック
4. M965～M969アラーム表示補助
5. D100/D101表示生成
6. M938設定変更許可

この部分が固まれば、GOT画面とPLCロジックの境界がほぼ完成する。
