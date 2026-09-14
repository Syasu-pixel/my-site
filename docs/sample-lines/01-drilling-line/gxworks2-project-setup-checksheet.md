# 01 Drilling Line — GX Works2 新規プロジェクト設定チェックシート

Status: Active / FX3U教材・シミュレーション用

## 1. 対象

GX Works2で新規プロジェクトを作成し、既存の01 Drilling Line制御ロジックをGX Works2版へ移植するための初期設定確認表。

基準ターゲットは `FX3U-80MT/DS + FX2N-16EX`。

本チェックシートは教材・シミュレーション用途であり、実機施工・主回路・安全回路・保護定格を確定するものではない。

## 2. プロジェクト作成

| No. | 確認項目 | 予定値 | 実確認 | 備考 |
|---|---|---|---|---|
| W2-P-01 | エンジニアリングソフト | GX Works2 | [ ] | 実環境で確認 |
| W2-P-02 | PLCシリーズ | FXCPU | [ ] | GX Works2上の表示名に従う |
| W2-P-03 | CPUタイプ | FX3U | [ ] | 実際に選択できることを確認 |
| W2-P-04 | プログラム言語 | Ladder | [ ] | 教材基準 |
| W2-P-05 | プロジェクト保存 | 新規GX Works2版 | [ ] | GX Works3版と混在させない |
| W2-P-06 | コメント登録 | 有効 | [ ] | 既存comment master流用 |
| W2-P-07 | シミュレータ | GX Simulator2 | [ ] | 起動可否を実確認 |

## 3. I/O構成前提

- CPU: `FX3U-80MT/DS`
- CPU内蔵入力: 40点
- CPU内蔵出力: 40点
- 追加入力: `FX2N-16EX` 16点
- 合計DI: 56点
- 合計DO: 40点

既存要求は約56DI / 29DO。

物理信号名は `physical-io-map.md` を正とする。X/Y番号はGX Works2 / FX3U実機構成で正式確認してから確定する。

## 4. デバイス帯の維持方針

既存内部デバイス帯は原則維持する。

- M100～: 入力処理
- M200～: passage
- M300～: 共通/run
- M400～: transfer
- M500～M517: process step
- M700～: fault
- M800～: output request
- M900～: GOT
- D100～: process/settings
- D200～: production
- D300～: maintenance

GX Works2 / FX3Uの利用可能範囲と保持設定を実確認するまで、retentive範囲は完了扱いにしない。

## 5. GX Works2版で要確認の差分

| 項目 | 状態 |
|---|---|
| 立上り/立下り命令の正式入力形式 | TBD |
| タイマ時間基準 | TBD |
| 32bitカウンタ/演算方式 | TBD |
| ファイルレジスタ/保持範囲 | TBD |
| GOT接続方式 | TBD |
| GX Simulator2上のI/O強制方法 | TBD |
| 増設I/OのX割付開始位置 | TBD |

## 6. 入力開始条件

次を満たすまでBatch Aの実入力を `LADDER DONE` にしない。

- [ ] GX Works2でFX3Uプロジェクト作成済み
- [ ] CPU選択画面でFX3Uが選択可能
- [ ] デバイスコメント登録方法確認済み
- [ ] X/Yデバイス範囲確認済み
- [ ] GX Simulator2起動可否確認済み

## 7. 実績ステータス

```text
PROJECT CREATED
→ COMMENT IMPORTED/ENTERED
→ BATCH A LADDER ENTERED
→ BATCH A SIM VERIFIED
```

実際のGX Works2画面、プロジェクト、エクスポート、または入力済みネットワークを確認できない限り完了にしない。
