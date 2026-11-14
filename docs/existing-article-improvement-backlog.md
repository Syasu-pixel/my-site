# 既存記事改善バックログ

更新済み記事の状態・件数の正本は[統合更新台帳](article-refresh-log.md#統合更新台帳状態集計の正本)。本書のチェック欄は週次機械評価向けの派生ビュー。過去の未公開記録だけで現在状態を決めず、正本と公開PRを照合する。

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
- 候補記事を選んだ後は、本文・title・metaだけでなくHero / OGPも監査し、古い・内容不一致・サムネイルとして弱い場合は刷新範囲に含める。
- HeroとOGPの兼用は必須にせず、用途ごとの見え方で専用OGPが必要か判断する。
- 元の候補抽出や過去監査（例: `docs/search-top-content-audit-2026-09-10.md`）は**履歴資料**として参照できるが、現在の優先順位の根拠にはしない。
- 完了済み記事は、明確な不具合・技術情報更新・検索データ上の大きな問題がない限り不用意に再編集しない。
- ただし、完了済みでも[日付ガード](article-update-date-guard.md)の90日待機を満たし、検索データ上で明確な悪化や大きな改善機会が継続して確認できた場合は、再評価候補へ戻してよい。安全・技術誤り等の例外は同正本に従う。
- Preview承認前に main へ入れない。
- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。

## 改善進捗

- [x] `articles/encoder-basic.html` — エンコーダ。最終内容更新・公式資料確認2026-11-14。[PR #1892](https://github.com/Syasu-pixel/my-site/pull/1892)をmain `95756c1ffaa0258c9e07dd0efd23b4d3096d300e`へ反映、Pages成功・2026-11-14T12:31:08Zの本番HTML/6画像一致とPC Hero正常表示を確認。完成・凍結。90日未満は原則再改善候補から除外、最短再評価2027-02-12。期間経過だけでは再編集しない。IndexNow HTTP200受理、Google登録リクエストは2026-11-14に本人実施の申告あり、インデックス完了未確認。詳細は統合正本の個別履歴を参照。

- [x] `articles/speed-controller-basic.html` — スピードコントローラ。最終内容更新・公式資料確認日2026-11-12。[PR #1846](https://github.com/Syasu-pixel/my-site/pull/1846)で本文・採用画像5枚を公開し、2026-11-13 JSTにPages成功・本番反映を確認。完成・凍結、90日未満は原則再改善候補から除外。2027-02-10以降も期間経過だけで再編集せず日付ガードに従う。
- [x] `articles/electromagnetic-contactor-vs-switch.html` — 電磁接触器と電磁開閉器の違い。最終内容更新 2026-11-11、公式資料確認日 2026-11-11。本文・採用画像4枚を [PR #1832](https://github.com/Syasu-pixel/my-site/pull/1832) でmain反映（2026-11-12 JST）。2026-11-12 JSTにPages成功・本番の採用画像と表示を確認。完成・凍結、最終内容更新から90日間は原則再改善候補から除外。
- [x] `articles/star-delta-start-basic.html` — スターデルタ始動
- [x] `articles/pilot-lamp-basic.html` — パイロットランプ・表示灯
- [x] `articles/control-panel-grounding-basic.html` — 制御盤の接地
- [x] `articles/shielded-cable-basic.html` — シールド線
- [x] `articles/selector-switch-basic.html` — セレクタスイッチ
- [x] `articles/terminal-block-jumper-basic.html` — 端子台ジャンパ
- [x] `articles/air-cylinder-basic.html` — エアシリンダ
- [x] `articles/a-contact-b-contact-basic.html` — a接点・b接点
- [x] `articles/control-panel-wire-color-basic.html` — 制御盤の電線色
- [x] `articles/no-fuse-breaker-basic.html` — ノーヒューズブレーカ。最終内容更新 2026-11-08（JST、本文・採用画像5枚の本番反映 [PR #1812](https://github.com/Syasu-pixel/my-site/pull/1812)）。完成・凍結、日付ガードの90日間は原則再改善候補から除外。

- [x] `articles/dc24v-common-basic.html` — DC24Vコモン。2026-11-09刷新・本番反映確認（[PR #1825](https://github.com/Syasu-pixel/my-site/pull/1825)）。四コマの引き継ぎは [公開反映メモ](article-backlog.md#公開反映メモ) を参照。
- [x] `articles/no-nc-basic.html` — NO・NC
- [x] `articles/plc-io-unit-basic.html` — PLC I/Oユニット。最終内容更新・公式資料確認2026-11-13。本文・ちびキャラ画像6枚の最終Previewを管理者が採用・公開承認、[PR #1855](https://github.com/Syasu-pixel/my-site/pull/1855)をmain `612584cf3d6880dc701f7d512adf1ff035f1a14c`へ反映。Pages成功と2026-11-13 10:02 UTCの本番表示を確認。完成・凍結、最終内容更新から90日未満は原則再改善候補から除外。最短再評価2027-02-11、期間経過だけでは再編集しない。IndexNow HTTP200受理、Google登録リクエストは未実施。
- [x] `articles/plc-xymd-device-basic.html` — 最終内容更新・公式資料確認2026-11-14。[PR #1878](https://github.com/Syasu-pixel/my-site/pull/1878)はmain反映・本番確認済み。完成・凍結。90日未満は原則再改善候補から除外、最短再評価2027-02-12。Google登録リクエストは助手実施・受理済み（再インデックス完了は未確認）。詳細は統合正本の個別履歴を参照。 — PLC X/Y/M/Dデバイス
- [x] `articles/one-shot-circuit-basic.html` — ワンショット回路。最終内容更新・公式資料確認2026-11-13。PR #1852で採用本文・ちびキャラ画像4枚を公開し、Pages成功と本番表示を確認。完成・凍結、90日未満は原則再改善候補から除外。最短再評価2027-02-11、期間経過だけでは再編集しない。
- [x] `articles/terminal-block-basic.html` — 端子台。2026-11-11刷新・本番反映確認（[PR #1828](https://github.com/Syasu-pixel/my-site/pull/1828)、本文・採用画像6枚・共通ライトボックス幅修正）。完成・凍結、日付ガードの90日間は原則再改善候補から除外。
- [ ] `articles/control-panel-cooling-fan-basic.html` — 制御盤冷却ファン
- [x] `articles/power-signal-wiring-separation-basic.html` — 動力線・信号線の分離。最終内容更新・公式資料確認日2026-11-14。[PR #1871](https://github.com/Syasu-pixel/my-site/pull/1871)で刷新し、本番反映を確認。完成・凍結、90日未満は原則再改善候補から除外。最短再評価2027-02-12、期間経過だけで再編集しない。
- [x] `articles/solenoid-valve-troubleshooting-basic.html` — 電磁弁トラブルシューティング — 2026-09-29 本番公開完了（PR #1621 / Hero・OGP・本文画像3枚刷新 / 公式資料監査済み / 本番同等Preview承認済み / GitHub Pages・IndexNow確認済み）
- [x] `articles/din-rail-basic.html` — DINレール。最終内容更新・公式資料確認日 2026-11-12。[PR #1841](https://github.com/Syasu-pixel/my-site/pull/1841) で公開し、Pages成功・本番表示を確認。完成・凍結、90日未満は原則再改善候補から除外。2027-02-10以降も期間経過だけで再編集せず、日付ガードの条件で再評価する。
- [ ] `articles/alternate-operation-circuit-basic.html` — 交互運転回路
- [x] `articles/control-transformer-basic.html` — 制御トランス。最終内容更新・公式資料確認2026-11-13。本文・ちびキャラ6画像の最終Previewを管理者が採用・公開承認。[PR #1858](https://github.com/Syasu-pixel/my-site/pull/1858)をmain `4e698688dd161c4bd3ae104290fff7284f311ab5`へ反映、Pages成功と2026-11-13 11:06 UTCの本番表示を確認。完成・凍結、90日未満は原則再改善候補から除外。最短再評価2027-02-11、期間経過だけでは再編集しない。IndexNow HTTP200受理。Google手動リクエストは未依頼・未実施。
- [x] `articles/emergency-stop-switch-basic.html` — 非常停止スイッチ。最終内容更新・公式資料確認日2026-11-13。[PR #1848](https://github.com/Syasu-pixel/my-site/pull/1848)で本文・採用画像5枚を公開し、Pages成功と本番28資源の配信一致を確認。完成・凍結、90日未満は原則再改善候補から除外。2027-02-11以降も期間経過だけで再編集せず日付ガードに従う。
- [x] `articles/signal-tower-light-basic.html` — タワーライト。2026-11-13 PR #1861で刷新・本番確認完了、完成/凍結。最終内容更新・公式資料確認2026-11-13、90日未満は重複改善候補から除外（最短再評価2027-02-11）。IndexNow HTTP200受理、Google手動リクエスト未実施・インデックス未確認。詳細は記事リフレッシュ記録。
- [x] `articles/dc24v-power-supply-basic.html` — DC24V電源。最終内容更新・公式資料確認日2026-11-12。[PR #1843](https://github.com/Syasu-pixel/my-site/pull/1843)で本文・ちびキャラ画像5枚を公開し、2026-11-12 23:21 JSTにPages成功・本番30資源の配信一致を確認。完成・凍結、90日未満は原則再改善候補から除外。2027-02-10以降も期間経過だけで再編集せず日付ガードに従う。
- [ ] `articles/limit-switch-troubleshooting-basic.html` — リミットスイッチトラブルシューティング
- [x] `articles/load-cell-basic.html` — ロードセル — 2026-10-02 本番公開完了（PR #1650 / 画像6枚刷新 / 公式資料監査済み / 統合最終Preview承認済み / GitHub Pages・IndexNow確認済み / Google Search Console登録リクエスト実施済み）

- [x] `articles/air-regulator-basic.html` — エアレギュレータ。最終内容更新・公式資料確認2026-11-14。本文とちびキャラ画像6枚を承認後、[PR #1867](https://github.com/Syasu-pixel/my-site/pull/1867)をmainへ反映。Pages成功、2026-11-14 03:41 UTCに本番本文・6画像の一致を確認。完成・凍結、90日未満は原則再改善候補から除外、最短再評価2027-02-12。IndexNow HTTP200受理。Google登録リクエストは2026-11-14にユーザー本人から実施報告あり、検索インデックス完了は未確認。詳細は記事リフレッシュ記録。

## 次回の改善対象の決め方

固定の「現在位置」は持たない。
記事改善を開始するたびに、最新の直接API経路

`Google Search Console API / Bing Webmaster API -> GitHub Actions -> Supabase -> ChatGPT`

から取得できる最新データを確認し、全記事を再評価して候補を選ぶ。

候補選定後は、対象記事の検索queryとメーカー公式資料・一次情報を確認してから本文・meta・画像の刷新範囲を決定する。

改善進捗リストの最終手動更新: 2026-10-02

## 検索データの週次・自動評価（導入済み：2026-11-05 / PR #1798）

- `scripts/search_backlog_report.py` は既存のSupabase公式API保存データを読み、Google検索の直近28日と前28日を比較する。Bingのページ別値は週次スナップショットのため日次比較に合算しない。
- `.github/workflows/weekly-search-backlog.yml` は **毎週月曜日08:30 JST（GitHub Actionsのscheduleなので開始が遅れる場合あり）** に動く設定で、生成した提案は **Draft PR** にまとめる。PR作成権限が無い場合、確認用artifactと警告を残す。週次処理の実運用成功は実行履歴とPRで別途確認する（導入CI成功と初回定期実行成功を混同しない）。
- 元の改善進捗リスト、`[x]` 完成・凍結状態、記事HTML、SEO、公開導線は自動変更しない。候補は調査提案であり、採用・再編集・main反映は管理者判断を要する。
- Google確定データの欠損・遅延、公開sitemapが利用不能な場合には候補生成を停止する。公開sitemapに含まれる日本語記事を候補とする。内容更新日が不明な記事はGitHub/PR履歴で確認し、90日ガードを機械判定済みとして扱わない。
- クールダウン中の記事も異常を見落とさないため監視表示には残すが、90日未満は原則として通常の再改善候補から除外する。評価期間より新しい更新、更新日不明、完成・凍結も表示し、期間経過だけで再編集を許可しない。比較窓は直近28日対前28日のまま維持する。
- 公開GitHubのPR・本文にはサイトの検索生データ（クリック数・表示回数・順位）を出さない。詳細数値は非公開のSupabase側で確認する。
- **新しいチャット・記事刷新担当**は、ここに提案があるかだけで判断せず、最新mainの本書、`docs/article-update-date-guard.md`、`docs/article-search-data-precheck-override.md`、Supabaseのデータ鮮度・現在の検索状況、既存PRを確認する。機械評価は提案であって改善実行の許可ではない。

<!-- SEARCH_BACKLOG_AUTO_START -->
2026-11-05にmainへ導入済み。初回の週次実データ生成・Draft PR作成は未確認。毎週の実行成功後、この区画が確認用PRで更新提案される。
<!-- SEARCH_BACKLOG_AUTO_END -->

## 2026-11-13 個別更新候補の進行記録

- [x] `articles/interlock-basic.html` — インターロック回路。刷新・本番公開完了（PR #1862）。最終内容更新・公式資料確認2026-11-13。90日ガード最短再評価2027-02-11、完成/凍結。期間経過だけで再編集しない。

## 2026-11-13 圧力スイッチ更新着手（未公開）

`articles/pressure-switch-basic.html` は「とは・仕組み」を中心に基礎記事として刷新し、設定/復帰・応差は補助説明とする。現在は本文・統一キャラ画像を含む最終プレビュー準備中。公開承認・本番反映は未完了。対象記事の履歴・変更前ベースライン・検索データ事前確認は作業開始時に確認。公開後の完了記録で追記する。

## 統合更新台帳からの完了状態同期（2026-11-14）

以下は[統合更新台帳](article-refresh-log.md#更新済み記事一覧)に根拠を集約した派生状態。日付不明は自動で再編集可能としない。

- [x] `articles/air-cylinder-troubleshooting-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/area-sensor-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/earth-leakage-breaker-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/light-curtain-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/magnetic-switch-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/npn-pnp-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/plc-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/pressure-switch-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/push-button-switch-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/reed-switch-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/safety-control-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/self-hold-circuit.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/sensor-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/series-parallel-circuit-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/servo-motor-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/start-stop-circuit-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/sto-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
- [x] `articles/while-pressed-circuit-basic.html` — 刷新反映確認済み。公開・日付・検証範囲は統合更新台帳を参照。
