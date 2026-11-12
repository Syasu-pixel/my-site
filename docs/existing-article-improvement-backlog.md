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
- 候補記事を選んだ後は、本文・title・metaだけでなくHero / OGPも監査し、古い・内容不一致・サムネイルとして弱い場合は刷新範囲に含める。
- HeroとOGPの兼用は必須にせず、用途ごとの見え方で専用OGPが必要か判断する。
- 元の候補抽出や過去監査（例: `docs/search-top-content-audit-2026-09-10.md`）は**履歴資料**として参照できるが、現在の優先順位の根拠にはしない。
- 完了済み記事は、明確な不具合・技術情報更新・検索データ上の大きな問題がない限り不用意に再編集しない。
- ただし、完了済みでも[日付ガード](article-update-date-guard.md)の90日待機を満たし、検索データ上で明確な悪化や大きな改善機会が継続して確認できた場合は、再評価候補へ戻してよい。安全・技術誤り等の例外は同正本に従う。
- Preview承認前に main へ入れない。
- 完了後は必要に応じて Google のインデックス状態確認と、既存 GitHub Actions の IndexNow 通知を確認する。

## 改善進捗

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
- [ ] `articles/no-nc-basic.html` — NO・NC
- [ ] `articles/plc-io-unit-basic.html` — PLC I/Oユニット
- [ ] `articles/plc-xymd-device-basic.html` — PLC X/Y/M/Dデバイス
- [ ] `articles/one-shot-circuit-basic.html` — ワンショット回路
- [x] `articles/terminal-block-basic.html` — 端子台。2026-11-11刷新・本番反映確認（[PR #1828](https://github.com/Syasu-pixel/my-site/pull/1828)、本文・採用画像6枚・共通ライトボックス幅修正）。完成・凍結、日付ガードの90日間は原則再改善候補から除外。
- [ ] `articles/control-panel-cooling-fan-basic.html` — 制御盤冷却ファン
- [ ] `articles/power-signal-wiring-separation-basic.html` — 動力線・信号線の分離
- [x] `articles/solenoid-valve-troubleshooting-basic.html` — 電磁弁トラブルシューティング — 2026-09-29 本番公開完了（PR #1621 / Hero・OGP・本文画像3枚刷新 / 公式資料監査済み / 本番同等Preview承認済み / GitHub Pages・IndexNow確認済み）
- [ ] `articles/din-rail-basic.html` — DINレール
- [ ] `articles/alternate-operation-circuit-basic.html` — 交互運転回路
- [ ] `articles/control-transformer-basic.html` — 制御トランス
- [ ] `articles/emergency-stop-switch-basic.html` — 非常停止スイッチ
- [ ] `articles/signal-tower-light-basic.html` — タワーライト
- [ ] `articles/dc24v-power-supply-basic.html` — DC24V電源
- [ ] `articles/limit-switch-troubleshooting-basic.html` — リミットスイッチトラブルシューティング
- [x] `articles/load-cell-basic.html` — ロードセル — 2026-10-02 本番公開完了（PR #1650 / 画像6枚刷新 / 公式資料監査済み / 統合最終Preview承認済み / GitHub Pages・IndexNow確認済み / Google Search Console登録リクエスト実施済み）

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
