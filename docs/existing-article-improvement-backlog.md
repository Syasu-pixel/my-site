# 既存記事改善バックログ

このファイルは、既存記事の**改善履歴・完了状態・未完了候補**を管理するためのバックログです。

このファイル内の並び順は、今後の更新優先順位を固定するものではありません。
次に改善する記事は、作業開始時点の最新検索データを使って都度再評価します。

## 運用ルール

- `[x]` は、技術内容・構造・画像・スマホ表示を確認し、必要な修正を main へ反映して「完成・凍結」と判断した記事。
- `[ ]` は、未完了または再評価対象になり得る既存記事。
- **この一覧を上から順番に消化しない。** 次の改善対象は、毎回 `docs/article-search-data-precheck-override.md` に従って最新の Google / Bing 検索データから選び直す。
- 優先度判断では、少なくとも impressions、clicks、CTR、average position、直近増減、Google/Bing差分を確認する。
- 曜日・日本の祝日・連休による検索需要の変動が明らかな期間は、単純な前期間比較だけで異常判定しない。
- 表示回数が多いのにCTRが低い記事、順位5〜15位付近で改善余地が大きい記事、直近で検索需要が伸びている記事を優先候補にする。
- 元の候補抽出や過去監査（例: `docs/search-top-content-audit-2026-09-10.md`）は**履歴資料**として参照できるが、現在の優先順位の根拠にはしない。
- 完了済み記事は、明確な不具合・技術情報更新・検索データ上の大きな問題がない限り不用意に再編集しない。
- ただし、完了済みでも検索データ上で明確な悪化や大きな改善機会が確認できた場合は、再評価候補へ戻してよい。
- Preview承認前に main へ入れない。
- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。

## 改善進捗

- [x] `articles/star-delta-start-basic.html` — スターデルタ始動
- [x] `articles/pilot-lamp-basic.html` — パイロットランプ・表示灯
- [x] `articles/control-panel-grounding-basic.html` — 制御盤の接地
- [x] `articles/shielded-cable-basic.html` — シールド線
- [x] `articles/selector-switch-basic.html` — セレクタスイッチ
- [x] `articles/terminal-block-jumper-basic.html` — 端子台ジャンパ
- [x] `articles/air-cylinder-basic.html` — エアシリンダ
- [x] `articles/a-contact-b-contact-basic.html` — a接点・b接点
- [x] `articles/control-panel-wire-color-basic.html` — 制御盤の電線色
- [ ] `articles/dc24v-common-basic.html` — DC24Vコモン
- [ ] `articles/no-nc-basic.html` — NO・NC
- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット
- [ ] `articles/plc-xymd-device-basic.html` — PLC X/Y/M/Dデバイス
- [ ] `articles/one-shot-circuit-basic.html` — ワンショット回路
- [ ] `articles/terminal-block-basic.html` — 端子台
- [ ] `articles/control-panel-cooling-fan-basic.html` — 制御盤冷却ファン
- [ ] `articles/power-signal-wiring-separation-basic.html` — 動力線・信号線の分離
- [ ] `articles/solenoid-valve-troubleshooting-basic.html` — 電磁弁トラブルシューティング
- [ ] `articles/din-rail-basic.html` — DINレール
- [ ] `articles/alternate-operation-circuit-basic.html` — 交互運転回路
- [ ] `articles/control-transformer-basic.html` — 制御トランス
- [ ] `articles/emergency-stop-switch-basic.html` — 非常停止スイッチ
- [ ] `articles/signal-tower-light-basic.html` — タワーライト
- [ ] `articles/dc24v-power-supply-basic.html` — DC24V電源
- [ ] `articles/limit-switch-troubleshooting-basic.html` — リミットスイッチトラブルシューティング

## 次回の改善対象の決め方

固定の「現在位置」は持たない。
記事改善を開始するたびに、最新の直接API経路

`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`

から取得できる最新データを確認し、全記事を再評価して候補を選ぶ。

候補選定後は、対象記事の検索queryとメーカー公式資料・一次情報を確認してから本文・meta・画像の刷新範囲を決定する。

最終更新: 2026-09-27
