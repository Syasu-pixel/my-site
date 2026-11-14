# 記事リフレッシュ記録

このファイルは、既存記事の画像・OGP・カテゴリカード・関連記事導線などを改善した履歴を記録するためのログです。

## 統合更新台帳（状態・集計の正本）

2026-11-14の管理者依頼により、**更新済み記事の状態・件数は本書のこの台帳を唯一の入口**とする。新しい別台帳は作らない。以降の個別履歴も本書に追記し、この表の同じslugを更新する。過去の記録は消さず、訂正は根拠付きで追記する。

### 集計範囲と根拠

- 照合基点: main `0c98d86c4ad712235054e46b460269a01f909d8c`。照合日2026-11-14。
- [公開サイトマップ](../sitemap.xml)の日本語 `/articles/` は174 URL（重複0）。英語111 URLと公開停止PLC設計シリーズ3本は分母から除外。今回の本番サイトマップとmainの日本語174 URL集合は一致し、対象記事1 URLを含む。
- 下表は45 slug。初回統合44件（旧改善台帳25件と公開履歴・mainマージ済み刷新PRの19件）に、動力線・信号線の分離記事の刷新1件を追加。本文改善だけでなく採用画像刷新・完成凍結の既存記録も含む。全45本を「同一基準の全面改稿」とは呼ばない。
- 174−45＝129本は**今回の統合で完了を確認できていない残り**。過去全PRを網羅した未更新確定数ではない。単なる共通CSS、リンク・導線修正、新規公開、英語、PreviewだけのPR、同じ記事の再更新を重複加算しない。
- 公開記録日、最終内容更新日、公式資料確認日は別欄。HTMLのファイル更新日時やPRのマージ日を内容更新日に転用しない。未確認は未確認のまま保持。記事本文そのものの日付は今回変更しない。
- 本番表示の個別確認は既存公開記録を継承。初回統合44記事すべてをブラウザ再監査したという意味ではない。記録が古い・矛盾する場合は実公開・main・PRを確認する。

### 既存文書との分担

- [既存記事改善バックログ](existing-article-improvement-backlog.md): 検索候補と機械評価用の完成・凍結チェック欄を維持する。本表の派生ビューであり、件数の正本ではない。既存の週次処理はこの欄を読むため、完了反映時は同じPRで同期する。自動処理は完了状態を変更しない。
- [日本語記事バックログ](article-backlog.md): 新規企画・四コマ待ちなど別目的の状態を保持する。四コマ未完了を記事刷新未完了とは扱わない。
- [検索改善ログ](search-console-content-improvement-log.md): 個別施策・検索意図の履歴。本文更新件数は本表で管理する。
- [日付ガード](article-update-date-guard.md): 90日間の再編集制限の正本。日付不明・矛盾は履歴を追加確認し、凍結解除の理由にしない。

### 更新手順

1. 対象slugの実公開状況・記事PRと記録PRを区別して確認する。記録PRの未マージだけで公開済み記事を未公開へ戻さない。
2. 本表の同一slugの状態・3種の日付・根拠を更新し、下の個別履歴に変更内容と検証範囲を記録する。Googleの本人実施・助手実施・未確認と、検索インデックス完了は分ける。
3. 同じPRでバックログの派生チェック欄を同期し、slug重複・公開URL・差分範囲を検査する。集計基点と件数は公開URL集合を再確認して更新する。
4. 安全・技術誤り等の既存例外を除き、90日経過だけでは再編集しない。本台帳は記事公開・費用発生の新たな許可を与えない。

### 更新済み記事一覧

| slug | 確認できた状態 | 公開・確認記録日 | 最終内容更新日 | 公式資料確認日 | 根拠 | 注意 |
|---|---|---|---|---|---|---|
| `a-contact-b-contact-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `air-cylinder-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `air-cylinder-troubleshooting-basic` | 刷新main反映済み | 2026-09-22（公開記録日） | 未確認 | 2026-09-16 | [PR #1488](https://github.com/Syasu-pixel/my-site/pull/1488)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `air-regulator-basic` | 刷新main反映済み | 2026-11-14（公開記録日） | 2026-11-14 | 2026-11-14 | [PR #1867](https://github.com/Syasu-pixel/my-site/pull/1867)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `area-sensor-basic` | 刷新main反映済み | 未確認 | 2026-10-06 | 2026-10-06 | [PR #1693](https://github.com/Syasu-pixel/my-site/pull/1693) | 本文表示から採録。未確認は推測補完しない。 |
| `control-panel-grounding-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `control-panel-wire-color-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `control-transformer-basic` | 刷新main反映済み | 2026-11-13（公開記録日） | 2026-11-13 | 2026-11-13 | [PR #1858](https://github.com/Syasu-pixel/my-site/pull/1858)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `dc24v-common-basic` | 改善完了・凍結記録あり | 2026-11-09（本番反映確認記録） | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 統合前台帳は本番反映確認日。内容更新日・公式確認日に転用しない。 |
| `dc24v-power-supply-basic` | 刷新main反映済み | 2026-11-12（公開記録日） | 2026-11-12 | 2026-11-12 | [PR #1843](https://github.com/Syasu-pixel/my-site/pull/1843)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `din-rail-basic` | 刷新main反映済み | 2026-11-12（公開記録日） | 2026-11-12 | 2026-11-12 | [PR #1841](https://github.com/Syasu-pixel/my-site/pull/1841)・本書の個別履歴 | 本書の個別公開履歴の最終内容更新日・公式資料確認日を採録。 |
| `earth-leakage-breaker-basic` | 刷新main反映済み | 未確認 | 未確認 | 2026-10-06 | [PR #1677](https://github.com/Syasu-pixel/my-site/pull/1677) | 本文表示から採録。未確認は推測補完しない。 |
| `electromagnetic-contactor-vs-switch` | 刷新main反映済み | 2026-11-12（公開記録日） | 2026-11-11 | 2026-11-11 | [PR #1832](https://github.com/Syasu-pixel/my-site/pull/1832)・本書の個別履歴 | 本書の公開記録を根拠。 |
| `emergency-stop-switch-basic` | 刷新main反映済み | 2026-11-13（公開記録日） | 2026-11-13 | 2026-11-13 | [PR #1848](https://github.com/Syasu-pixel/my-site/pull/1848)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `interlock-basic` | 刷新main反映済み | 2026-11-13（公開記録日） | 2026-11-13 | 2026-11-13 | [PR #1862](https://github.com/Syasu-pixel/my-site/pull/1862)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `light-curtain-basic` | 刷新main反映済み | 未確認 | 未確認 | 未確認 | [PR #1659](https://github.com/Syasu-pixel/my-site/pull/1659) | 本文表示から採録。未確認は推測補完しない。 |
| `load-cell-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 2026-10-01 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `magnetic-switch-basic` | 刷新main反映済み | 2026-09-28（公開記録日） | 2026-09-28 | 2026-09-28 | [PR #1606](https://github.com/Syasu-pixel/my-site/pull/1606)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `no-fuse-breaker-basic` | 改善完了・凍結記録あり | 未確認 | 要照合（本文11-06／台帳11-08） | 2026-11-06 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 日付不一致を保留。安全側で11-08から90日未満は除外し、本文・台帳を勝手に変更しない。 |
| `no-nc-basic` | 刷新main反映済み | 2026-09-23（公開記録日） | 2026-09-23 | 2026-09-23 | [PR #1568](https://github.com/Syasu-pixel/my-site/pull/1568)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `npn-pnp-basic` | 刷新main反映済み | 2026-09-26（公開記録日） | 未確認 | 2026-09-25 | [PR #1586](https://github.com/Syasu-pixel/my-site/pull/1586)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `one-shot-circuit-basic` | 刷新main反映済み | 2026-11-13（公開記録日） | 2026-11-13 | 2026-11-13 | [PR #1852](https://github.com/Syasu-pixel/my-site/pull/1852)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `pilot-lamp-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `plc-basic` | 刷新main反映済み | 2026-10-14（管理者表示確認記録） | 未確認 | 2026-10-06 | [PR #1763](https://github.com/Syasu-pixel/my-site/pull/1763) | 本文表示から採録。未確認は推測補完しない。 |
| `plc-io-unit-basic` | 刷新main反映済み | 2026-11-13（公開記録日） | 2026-11-13 | 2026-11-13 | [PR #1855](https://github.com/Syasu-pixel/my-site/pull/1855)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `power-signal-wiring-separation-basic` | 刷新main反映・本番確認済み | 2026-11-14（本番確認記録） | 2026-11-14 | 2026-11-14 | [PR #1871](https://github.com/Syasu-pixel/my-site/pull/1871)・本書の個別履歴 | 完成・凍結。最短再評価2027-02-12。Googleはユーザー担当・未実施。 |
| `pressure-switch-basic` | 刷新main反映済み | 2026-11-14（JST公開確認） | 2026-11-13 | 2026-11-13 | [PR #1864](https://github.com/Syasu-pixel/my-site/pull/1864) | 公開後コメントを根拠。記録PR #1866は統合時未マージ。 |
| `push-button-switch-basic` | 刷新main反映済み | 未確認 | 2026-11-12 | 2026-11-12 | [PR #1837](https://github.com/Syasu-pixel/my-site/pull/1837) | 本文表示から採録。未確認は推測補完しない。 |
| `reed-switch-basic` | 刷新main反映済み | 2026-09-23（公開記録日） | 2026-09-23 | 2026-09-23 | [PR #1554](https://github.com/Syasu-pixel/my-site/pull/1554)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `safety-control-basic` | 刷新main反映済み | 未確認 | 未確認 | 未確認 | [PR #1661](https://github.com/Syasu-pixel/my-site/pull/1661) | 本文表示から採録。未確認は推測補完しない。 |
| `selector-switch-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `self-hold-circuit` | 刷新main反映済み | 未確認 | 2026-10-04 | 2026-09-30 | [PR #1664](https://github.com/Syasu-pixel/my-site/pull/1664) | 本文表示から採録。未確認は推測補完しない。 |
| `sensor-basic` | 刷新main反映済み | 2026-09-25（公開記録日） | 未確認 | 2026-09-24 | [PR #1575](https://github.com/Syasu-pixel/my-site/pull/1575)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `series-parallel-circuit-basic` | 刷新main反映済み | 2026-11-02（公開記録日） | 未確認 | 2026-10-28 | [PR #1789](https://github.com/Syasu-pixel/my-site/pull/1789)・[公開反映メモ](article-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `servo-motor-basic` | 画像刷新main反映済み | 2026-09-25（公開記録日） | 未確認 | 未確認 | [PR #1587](https://github.com/Syasu-pixel/my-site/pull/1587)・本書の個別履歴 | 画像刷新を含む広義の改善完了。本文全面改稿とは数えない。 |
| `shielded-cable-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `signal-tower-light-basic` | 刷新main反映済み | 2026-11-13（公開記録日） | 2026-11-13 | 2026-11-13 | [PR #1861](https://github.com/Syasu-pixel/my-site/pull/1861)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `solenoid-valve-troubleshooting-basic` | 刷新main反映済み | 2026-09-29（公開記録日） | 2026-09-29 | 2026-09-29 | [PR #1621](https://github.com/Syasu-pixel/my-site/pull/1621)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `speed-controller-basic` | 刷新main反映済み | 2026-11-13（公開記録日） | 2026-11-12 | 2026-11-12 | [PR #1846](https://github.com/Syasu-pixel/my-site/pull/1846)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `star-delta-start-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `start-stop-circuit-basic` | 刷新main反映済み | 未確認 | 2026-09-29 | 2026-09-29 | [PR #1630](https://github.com/Syasu-pixel/my-site/pull/1630) | 本文表示から採録。未確認は推測補完しない。 |
| `sto-basic` | 刷新main反映済み | 2026-09-28（公開記録日） | 未確認 | 2026-09-25 | [PR #1599](https://github.com/Syasu-pixel/my-site/pull/1599)・本書の個別履歴 | 本文表示から採録。未確認は推測補完しない。 |
| `terminal-block-basic` | 改善完了・凍結記録あり | 未確認 | 2026-11-11 | 2026-11-11 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `terminal-block-jumper-basic` | 改善完了・凍結記録あり | 未確認 | 未確認 | 未確認 | [統合前の完了台帳](https://github.com/Syasu-pixel/my-site/blob/d474f1241545a779488adb92aa42605b1299b117/docs/existing-article-improvement-backlog.md) | 本文表示から採録。未確認は推測補完しない。 |
| `while-pressed-circuit-basic` | 刷新main反映済み | 未確認 | 未確認 | 未確認 | [PR #1645](https://github.com/Syasu-pixel/my-site/pull/1645) | 本文表示から採録。未確認は推測補完しない。 |

### 圧力スイッチの記録不一致を解消（2026-11-14）

- [公開本体PR #1864](https://github.com/Syasu-pixel/my-site/pull/1864) はmainへマージ済み（`109a6a6b7a6d99d2097b07f498e43f6b7feedfd0`）。[公開後確認](https://github.com/Syasu-pixel/my-site/pull/1864#issuecomment-6867001027)にPages run 43516486745成功、本番HTMLと採用6画像の一致、PC表示・画像拡大確認、管理者の表示確認とGoogleリクエスト本人申告がある。
- 記録専用[PR #1866](https://github.com/Syasu-pixel/my-site/pull/1866)は統合時点でopen/Draft・未マージ。本書の古い「プレビュー準備中」は当時の履歴として残し、**現在の公開状態として使用しない**。#1866のブランチやPRは今回変更・マージ・閉鎖しない。将来取り込む場合は本書との重複を解消する。
- 最終内容更新・公式資料確認は2026-11-13。最短再評価2027-02-11。IndexNowはrun 43516486693で2026-11-13T22:07:23Zに1 URL HTTP200受理。Googleインデックス完了は未確認。本番スマホ・ダークの追加検証は未実施という制約も継承する。

---

## 運用ルール

- 既存記事の画像、OGP、カテゴリカード、関連記事導線、本文の軽微改善を行ったら記録する。
- 記事URLを変更しないリフレッシュ作業も記録対象にする。
- 画像を追加した場合は、画像パスを必ず記録する。
- HTML反映PRがある場合は、PR番号を記録する。
- `sitemap.xml` や `search-index.json` を触らなかった場合も、触っていないことを記録する。
- 画像ファイルが存在しない状態でHTMLだけ差し替えない。
- `/seo/sitemap.xml` は非運用なので触らない。
- 四コマ漫画の追従確認では、このログの「本番公開完了」記事を起点に `docs/comic-scripts/` の正式採用記録と突合し、未四コマ化の記事を抽出する。

---

## 2026-11-14 — power-signal-wiring-separation-basic 刷新・本番公開完了

- 対象: `articles/power-signal-wiring-separation-basic.html`。本番URL: https://denkicontrol.com/articles/power-signal-wiring-separation-basic.html
- 管理者が最終Previewの公開を承認。公開本体 [PR #1871](https://github.com/Syasu-pixel/my-site/pull/1871)、承認source `43d20cfdfb134feb22fa3a7da4609ac4063a74a1`。mainマージ: `0c98d86c4ad712235054e46b460269a01f909d8c`。生成済みHTMLを含むPreview専用 #1872 はmainへマージしない。
- 最終内容更新・公式資料確認: 2026-11-14。電力と情報の役割、信号の種類、配線経路、交差、記録すべき条件を基礎向けに整理。一律の離隔数値やシールド接地方法を指定せず、機器資料と安全な電源隔離を優先。[制作・参照メモ](reference-notes/power-signal-wiring-separation-basic.md)。現場資料は独自の実体験として語らない。
- 採用画像: `assets/images/power-signal-wiring-separation-basic/power-signal-wiring-separation-basic-{hero,ogp,classification,routing,crossing,checkpoints}-20261114.webp` の6枚。統一ちびキャラ、Hero/OGP別、本文4図。
- 既存URL・canonical・関連記事構成を維持。対象テンプレートentryと、対象記事を参照するカードのOGPキャッシュを同期。sitemap.xml・search-index.json・トップ・カテゴリ・英語記事は今回変更なし。
- 最終統合公開候補のPreview検査は実施済み。[Pages run43570282299](https://github.com/Syasu-pixel/my-site/actions/runs/43570282299) build/deploy成功（2026-11-14T07:20:11Z更新）。07:20:35 UTC以降に本番HTMLと依存29資産すべてHTTP200・承認publicationとのSHA256一致を確認。採用6画像も含む。外部ブラウザのPC幅1331px・スマホ幅400pxでHero・本文図・画像拡大開閉を確認。スマホ幅でscrollWidth388px/viewport400px、ページ横はみ出しなし。Previewでは両幅のライト/ダーク確認済み。本番の実機スマホ検査を行った意味ではない。
- [IndexNow run43570282284](https://github.com/Syasu-pixel/my-site/actions/runs/43570282284)成功（2026-11-14T07:16:55Z更新）。ワークフロー成功を確認。検索エンジンでのインデックス完了を意味しない。
- Google: ユーザー担当・未実施。助手によるリクエストはしていない。検索インデックス完了は未確認。
- 状態: 本番公開完了・完成/凍結。最終内容更新から90日未満は原則再改善候補から除外。最短再評価2027-02-12、期間経過だけで再編集しない。Preview専用 #1872 はこの記録時点でopen/Draft、mainへマージしない。

## 2026-11-14 — air-regulator-basic 刷新・本番公開完了

- 対象: `articles/air-regulator-basic.html`。本番URL: https://denkicontrol.com/articles/air-regulator-basic.html
- 管理者の最終Preview公開承認により [PR #1867](https://github.com/Syasu-pixel/my-site/pull/1867) をmain `db570109a702204f6d2bd2ee5e48ba9df1e0f0c5` へマージ。承認時source `797479aa8aee3c8e309fc1551067cea4e9333b43`、最終source `96eb868d0b5896c6308a09a796ffacffa1e19725`。後者は根拠noteのcatalog登録と参照表記の修正のみで、承認本文・画像は変更していない。
- 最終内容更新・公式資料確認: 2026-11-14。一次側/二次側、圧力計の枝接続、使用中の圧力変化、圧力スイッチ・スピコンとの役割差を基礎向けに整理。[公式参照メモ](reference-notes/air-regulator-basic.md)。未検証の体験談・原因割合は採用していない。
- 画像: `assets/images/air-regulator-basic/air-regulator-basic-{hero,ogp,overview,comparison,flow,checkpoints}-20261114.webp` の6枚。統一ちびキャラHero/OGPと本文4図。針の概念表現は方向・大きさ・正常異常を示さないと図直下に注記。
- 台帳と検索索引の対象title/description・キーワードを同期。既存関連記事とURL維持、sitemap.xml・トップ・カテゴリ・英語記事は変更なし。sitemap対象URLは既存掲載、lastmodなし。
- 検証: build/prepare/本文349件・画像1641件の対応とリンク・共通領域保存検査を実施。幅320/390/768/1440の明暗8条件で画像・はみ出し・横スクロール表・拡大操作を確認。catalog修正後check job132312378322は成功。shell compareは対象footerの切り出し位置/1px画像寸法差で失敗したが、DOM実寸/内部配置/動作は同一、他記事差分・新規エラーなしと独立確認し個別許容。閾値・設定は変更せず。詳細は[検査記録](https://github.com/Syasu-pixel/my-site/pull/1867#issuecomment-6870826463)。
- [Pages run43550878307](https://github.com/Syasu-pixel/my-site/actions/runs/43550878307) build/deploy成功。2026-11-14 03:41 UTC（12:41 JST）、本番HTMLが承認publicationとSHA256完全一致、採用6画像すべてHTTP200・SHA256一致。外部Chromeでも更新本文・Hero・本文図の表示を確認。実機スマホ検査とは区別する。
- [IndexNow run43550878384](https://github.com/Syasu-pixel/my-site/actions/runs/43550878384): 対象1URLの通知が03:20:11 UTCにHTTP200で受理。検索インデックス完了を意味しない。
- Google: 2026-11-14、ユーザー本人からインデックス登録リクエスト実施の報告あり。助手による再送はしていない。検索インデックス完了は未確認。
- 状態: 本番公開完了・完成/凍結。最終内容更新から90日未満は原則再改善候補から除外。最短再評価2027-02-12、期間経過だけで再編集しない。Preview専用 #1868 は未マージでclose、ブランチ保持。旧競合PR #1486はマージしていない。

## 2026-11-13 — pressure-switch-basic 刷新プレビュー準備中（未公開）

- 対象: `articles/pressure-switch-basic.html`。本文を「とは・仕組み」中心に刷新。メーカー資料との照合、機械式/電子式、適用流体、応差、表示/信号の読み分けを整理。
- 画像予定: `assets/images/pressure-switch-basic/pressure-switch-basic-{hero,ogp,flow,comparison,hysteresis,confirmation}-20261113.webp` の6枚。画像検査・最終プレビュー確認は別途実施。
- 既存anchor/関連記事6枚を保全し、対象台帳と検索索引のtitle/descriptionを同期。sitemap.xmlは変更しない。
- 状態: プレビュー準備中。公開未承認・本番未反映。統合検査と実画面確認後に最終プレビューを提示する。公開完了・検索登録完了ではない。
- 根拠: [圧力スイッチ根拠ノート](reference-notes/pressure-switch-basic.md)。旧PR1478の資料確認方針を継承。

## 2026-11-13 — interlock-basic 刷新・本番公開完了

- 対象: `articles/interlock-basic.html`。本番URL: https://denkicontrol.com/articles/interlock-basic.html
- 公開PR [#1862](https://github.com/Syasu-pixel/my-site/pull/1862)。管理者が最終Preview #1863 の公開を承認。source head `c04b333688a4454088b4d930ea8ee2ed7d97f998`、main反映 `933c71241294968080269d5454846fae7bc54128`。承認後の本文・採用画像は不変。
- 最終内容更新日・公式資料確認日: 2026-11-13。通常制御の基本、自己保持との違い、正逆転、実物接点とPLC論理、安全機能・再起動の境界を整理。[公式参照メモ](reference-notes/interlock-basic.md)。実体験の創作なし。
- 採用画像: `assets/images/interlock-basic/interlock-basic-{hero,ogp,conditions,comparison,reversing,confirmation}-20261113.webp` の6枚。PNG原本と可逆WebPのRGBA一致、GitHub転送後blob照合。正式採用四コマは変更なし。
- 導線: search-indexの対象日本語title/descriptionだけ同期。keywords/synonyms・他entryを維持。既存記事刷新のためsitemap.xmlのURL1件を確認、lastmodがなく変更不要。非運用seo/sitemap.xml・トップ・カテゴリは変更なし。
- 検証: 全288記事保全・関連記事1,356件・追加shell16件・公開境界・リンク/資産欠損0。source build/preserve/prepare/verify/test/check成功。最終生成物のHero320/390/768/1440幅、本文320/390/1440幅の明暗で横はみ出し・JSエラーなし、画像拡大開閉成功。外部PreviewはPC表示と全画像読込を確認。外部DevToolsは利用制限によりスマホエミュレーション未実施。全記事browser/compareの進行中を成功とせず、対象記事スコープ規則に従った。検査閾値・共有実装・公開設定は不変。
- Pages: [run43437672913](https://github.com/Syasu-pixel/my-site/actions/runs/43437672913) build/deploy成功。2026-11-13 13:59 UTC、本番で採用title・内容更新日・Hero・本文4図と7関連記事画像の正常読込・拡大開閉・canonical・OGP参照・robots index,follow・横はみ出しなしを確認。公開後の全依存資源ハッシュ照合・実機スマホ検査を行ったとはしない。
- IndexNow: [run43437672986](https://github.com/Syasu-pixel/my-site/actions/runs/43437672986)成功。2026-11-13T13:54:35Zに対象1URLをHTTP200で受理。送信受理と検索インデックス完了は区別。
- Google: 今回の手動URL検査・登録リクエストは未依頼のため未実施。検索インデックス完了は未確認。
- 状態: 本番公開完了・完成/凍結。2026-11-13から90日未満は原則再改善対象外。最短再評価2027-02-11、期間経過だけで再編集しない。Preview専用 #1863 は未マージで閉じ、ブランチを証跡として保持。

## 2026-11-13 — signal-tower-light-basic 刷新・本番公開完了

- 対象: `articles/signal-tower-light-basic.html`。本番URL: https://denkicontrol.com/articles/signal-tower-light-basic.html
- 公開PR [#1861](https://github.com/Syasu-pixel/my-site/pull/1861)。管理者が最終Preview #1860 head `4ce85ee47a29ca73ed1162c6da3c0fbf796c8364` の公開を承認。正式source head `1556d3a034988a0d04dc9c03cc0018819429caba`、main反映 `3e6a0cac0757b90cee8b5e2733b89b1885c59156`。承認本文・採用画像は不変。
- 最終内容更新日・公式資料確認日: 2026-11-13。構成、色・点滅・ブザーの読み方、制御指示と実表示、消音と原因解消・再開の違いを初学者向けに整理。[公式参照メモ](reference-notes/signal-tower-light-basic.md)。実体験の創作なし。
- 採用画像: `assets/images/signal-tower-light-basic/signal-tower-light-basic-{hero,ogp,overview,display-rules,flow,confirmation}-20261113.webp` の6枚。承認後の変更なし。
- 導線: search-indexの対象日本語title/descriptionだけ採用HTMLへ同期。keywords/synonyms・他entry・英語を維持。既存記事の刷新のためsitemap.xmlの対象URL1件を確認、lastmodがなく変更不要。非運用seo/sitemap.xml・トップ・カテゴリは変更なし。
- 日付管理: 2026-11-13から90日未満は原則再改善候補から除外。最短再評価2027-02-11、経過だけで再編集しない。
- 検証: build・preserve・prepare・verify・test・check成功。Hero run43421616374は全体success、対象320/390/768/1440幅PASS、shard3は192cases/192CTAクリック・失敗0。統合表示browser全6shard成功。footer compareはdesktop字形差とmobile撮影高1px差の個別REVIEW。今回のbefore/after/diff・DOM寸法/style完全一致・操作変化/新規エラーなしを確認し、[PRコメント](https://github.com/Syasu-pixel/my-site/pull/1861#issuecomment-6852623783)に根拠を記録。CI FAILや設定は変更していない。
- Pages: [run43425236530](https://github.com/Syasu-pixel/my-site/actions/runs/43425236530) build/deploy成功。2026-11-13 12:34 UTC、本番で採用Hero・本文4図の正常読込・拡大開閉、title・内容更新日・canonical・OGP画像を実Chromeで確認。公開後のスマホ実機検査や全依存資源ハッシュ照合を行ったとはしない。
- IndexNow: [run43425236524](https://github.com/Syasu-pixel/my-site/actions/runs/43425236524)、2026-11-13T12:27:37Zに対象1URLをHTTP200受理。受理と検索インデックス完了は区別。
- Google: 今回の手動URL検査・登録リクエストは未依頼のため未実施。インデックス完了は未確認。
- 状態: 本番公開完了・完成/凍結。最短再評価2027-02-11。期間経過のみで再編集しない。Preview専用 #1860 は未マージで閉じ、ブランチを保持する。

## 2026-11-13 — control-transformer-basic 刷新・本番公開完了

- 対象: `articles/control-transformer-basic.html`。本番URL: https://denkicontrol.com/articles/control-transformer-basic.html
- 公開PR: [#1858](https://github.com/Syasu-pixel/my-site/pull/1858)。最終Previewについて管理者が「採用で公開していこうか」と承認。承認source `697d8b5a4d96446c7bfd32f102853ddf56e529f1`、検索index同期後head `c2e7309c2690e2f7565264239e982b2736173712`、main反映 `4e698688dd161c4bd3ae104290fff7284f311ab5`。本文・画像は承認後不変。
- 最終内容更新日・公式資料確認日: 2026-11-13。一次側・二次側、ACとDC、定格電圧/VA/周波数、複巻と単巻を初心者向けに整理。東洋技研・鎌田信号機・オムロン公式資料を確認。実体験の創作なし。[公式参照メモ](reference-notes/control-transformer-basic.md)。
- 採用画像: `assets/images/control-transformer-basic/` の `control-transformer-basic-{hero,ogp,overview,comparison,ratings,check-flow}-20261113.webp` 6枚。Hero/OGP/本文4図、ちびキャラ統一。PNG原本とlossless WebPの全画素一致、転送後Git blob・Preview配信画像の照合済み。
- 最終Preview: https://5d660330.denkicontrol-preview.pages.dev/articles/control-transformer-basic 。統合済みpublicationを配信。PC 1180px・狭幅393 CSS px（Chrome拡大率による確認、実機エミュレーションではない）で明暗テーマ・目次・本文図拡大を確認。旧等身会話アイコンと重複案内を最終調整。Preview専用PR #1859 は本番確認後に未マージでclose、ブランチは証跡として保持。
- 検証: 静的保全・統合生成・publication・リンク検査済み。承認sourceのbuild/check/verify/preserve成功。全記事browser/compareの待機・実行中を成功とは扱わず、個別記事スコープ規則と対象記事検査記録に基づき正式公開。CI閾値・必須設定を変更せず。
- 導線: search-indexの対象日本語title/descriptionのみ採用HTMLへ同期。keywords/synonyms・他entryを維持。sitemap.xmlの対象URL1件を確認、lastmodなしで変更不要。非運用seo/sitemap.xml・トップ・カテゴリは変更なし。
- Pages: [run43413310685](https://github.com/Syasu-pixel/my-site/actions/runs/43413310685) のbuild/deploy成功。2026-11-13 11:06 UTC、本番の採用title・Hero・本文4図の正常読込・更新日・canonical・OGPを実Chromeで確認。robots metaなし。全依存資源のHTTP/ハッシュ照合・実機スマホ再検査は公開後確認に含めない。
- IndexNow: [run43413310819](https://github.com/Syasu-pixel/my-site/actions/runs/43413310819)、2026-11-13T10:59:49Zに対象1 URLをHTTP200受理。通知受理と検索インデックス完了は区別。
- Google: 今回の手動URL検査・登録リクエストは未依頼のため未実施。インデックス完了は未確認。
- 状態: 本番公開完了・完成/凍結。最終内容更新から90日未満は原則再改善候補から除外。最短再評価2027-02-11。期間経過のみでは再編集しない。

## 2026-11-13 — plc-io-unit-basic 刷新・本番公開完了

- 対象: `articles/plc-io-unit-basic.html`。本番URL: https://denkicontrol.com/articles/plc-io-unit-basic.html
- 公開PR: [#1855](https://github.com/Syasu-pixel/my-site/pull/1855)。承認source head `c65bf037`、main反映 `612584cf3d6880dc701f7d512adf1ff035f1a14c`。追加2図を含む最終Previewについて管理者が「採用でいいよ進めて」と承認。Preview専用PR [#1856](https://github.com/Syasu-pixel/my-site/pull/1856)は2026-11-13 10:03 UTCに未マージで閉鎖。
- 最終内容更新日・公式資料確認日: 2026-11-13。入力・内部処理・出力、端子番号／線番／I/Oアドレス、COMの機種差、LEDと実動作、入力仕様と出力定格を初歩向けに整理。三菱電機・オムロン公式資料を確認。根拠と旧PR #1458の限定継承は [公式参照メモ](reference-notes/plc-io-unit-basic.md)。実体験の創作なし。
- 採用画像: `assets/images/plc-io-unit-basic/` 内の `assets/images/plc-io-unit-basic/plc-io-unit-basic-hero-20261113.webp`、`assets/images/plc-io-unit-basic/plc-io-unit-basic-ogp-20261113.webp`、`assets/images/plc-io-unit-basic/plc-io-unit-basic-overview-20261113.webp`、`assets/images/plc-io-unit-basic/plc-io-unit-basic-observation-20261113.webp`、`assets/images/plc-io-unit-basic/plc-io-unit-basic-specs-20261113.webp`、`assets/images/plc-io-unit-basic/plc-io-unit-basic-mapping-20261113.webp`。Hero/OGP/本文4図、ちびキャラ統一。PNG原本とlossless WebPの全画素一致確認済み。
- 導線: search-indexの対象日本語title/descriptionのみ採用HTMLへ同期。既存keywords/synonyms・英語entryは維持。既存記事URLの更新であり、sitemap.xmlの対象URL1件を確認し変更なし（lastmodなし）。非運用seo/sitemap.xml・カテゴリ・トップは変更なし。
- Pages: [run43405422090](https://github.com/Syasu-pixel/my-site/actions/runs/43405422090)成功。2026-11-13 10:02 UTC、本番URLを実Chromeで確認し、採用title・本文・Hero・本文4画像の読込・canonical・OGPを確認。robotsおよび全依存資源のHTTP/ハッシュ照合は、この公開後確認の報告対象に含めない。
- 状態: 本番公開完了・完成/凍結。
- IndexNow: [run43405422101](https://github.com/Syasu-pixel/my-site/actions/runs/43405422101)、2026-11-13 09:58:33 UTCにHTTP200受理。通知受理と検索インデックス完了は区別する。
- Google: 今回更新のURL検査・登録リクエストは未実施。本文・title・画像の重要更新として本番反映後に確認し、許可済み経路で実行できた場合のみ記録する。IndexNow受理をGoogleリクエスト済みとは扱わない。
- 90日管理: 本番反映を確認し、backlogを完成・凍結へ更新。最終内容更新2026-11-13から90日未満は原則再改善候補から除外。最短再評価2027-02-11、期間経過だけでは再編集しない。

## 2026-11-13 — one-shot-circuit-basic 刷新・本番公開完了

- 対象: `articles/one-shot-circuit-basic.html`。本番URL: https://denkicontrol.com/articles/one-shot-circuit-basic.html
- 公開PR: [#1852](https://github.com/Syasu-pixel/my-site/pull/1852)。承認source `f2762d9b1e1dc1582c3d5a6164d98b1b19f6d00f`、検索索引同期後head `78397f1cbda23d62776cad6dbd03efeb05e25ad4`、main反映 `ddb82b47810e974909bf4a40f11005d19f97a274`。採用本文・画像は承認後不変。
- 最終内容更新日・公式資料確認日: 2026-11-13。内部1スキャンと入力ON継続、物理出力、時間指定との違い、機種固有命令、取り込みと実行条件、安全を基礎向けに整理。三菱電機・オムロン公式資料を確認。実体験の創作なし。
- 採用画像: `assets/images/one-shot-circuit-basic/` 内 `one-shot-circuit-basic-hero-20261113.webp`、`one-shot-circuit-basic-ogp-20261113.webp`、`one-shot-circuit-basic-overview-20261113.webp`、`one-shot-circuit-basic-concept-20261113.webp`。ちびキャラを統一したHero/OGP/本文図2枚。
- 最終Preview: https://fd60fcd1.denkicontrol-preview.pages.dev/articles/one-shot-circuit-basic 。管理者が採用・公開承認。Preview専用PR #1853は未マージで閉鎖し、ブランチを保持。
- 確認: 統合288記事、Hero288件保全、リンク新規/既存不良0、publication349テキスト保全・新規欠落0。同一成果物の320/390/768/1440幅light/darkで横溢れ・欠落0、ライトボックス開閉・スマホ表最右列到達を確認。footerの描画/切出し1px差は[管理者許可済み個別監査記録](https://github.com/Syasu-pixel/my-site/pull/1852#issuecomment-6847431943)を参照。CI全緑とはせず、必須設定・閾値変更なし。
- Pages: [run43389594977](https://github.com/Syasu-pixel/my-site/actions/runs/43389594977) build/deploy成功。2026-11-13 08:05 UTC頃、本番の新本文・採用Hero・更新日を視覚確認。canonicalは本番URL、OGPは採用画像、robots metaなし、横溢れなし。
- 導線: search-indexの対象日本語title/descriptionのみ同期。既存keywords/synonyms・英語entry・カテゴリ・トップは不変。sitemap.xmlの既存URL1件を維持（lastmodなし）、非運用seo/sitemap.xmlは不変。
- IndexNow: [run43389594786](https://github.com/Syasu-pixel/my-site/actions/runs/43389594786)、2026-11-13T07:59:11Zに対象1 URLがHTTP200受理。検索反映完了とは区別する。
- Google: 手動リクエスト未実施。今回は個別依頼がなく、sitemap・内部リンク・自然クロールを維持。検索結果への反映は未確認。
- 状態: 本番公開完了・完成/凍結。最終内容更新から90日未満は原則再改善候補から除外。最短再評価2027-02-11、期間経過だけでは再編集しない。

## 2026-11-13 — speed-controller-basic 刷新・本番公開完了

- 対象: `articles/speed-controller-basic.html`。本番URL: https://denkicontrol.com/articles/speed-controller-basic.html
- 公開PR: [#1846](https://github.com/Syasu-pixel/my-site/pull/1846)。採用source `b2a92689ccf14a34aeb03c8c3d21c4bc4c6d1262`、競合解消後head `b221adab0577682ac2e9db90a9dc74bc1feb2670`、main反映 `b3879e1f53e60e53c781f5483e9f5fd204429761`。最新mainのルールcatalogと統合し、採用本文・画像は不変。
- 最終内容更新日・公式資料確認日: 2026-11-12。公開確認日とは区別する。流量と圧力、メータイン/メータアウト、前進/後退で関係するポート、型式固有の調整方向、安全確認を初歩向けに整理。根拠はSMC・ニッタ公式資料。実体験の創作なし。
- 採用画像: `assets/images/speed-controller-basic/` 内の `speed-controller-basic-hero-v2.webp`、`speed-controller-basic-ogp-v2.webp`、`speed-controller-basic-overview-v2.webp`、`speed-controller-basic-comparison-v2.webp`、`speed-controller-basic-check-flow-v2.webp`。Hero/OGP/本文3枚、元PNGも保存。承認後の本文・画像変更なし。
- 最終Preview: https://471e607f.denkicontrol-preview.pages.dev/articles/speed-controller-basic 。Preview専用PR #1847は2026-11-13T04:06:42Zに未マージでclose、ブランチは証跡として保持。
- 公開前確認: shell 288件不変、統合生成289ページ・欠落資源0、本文保全288件、リンク新規/既存エラー0、関連記事保全288ページ/1356カード・errors0、ルール構造検査成功。新headのPages PR検証43361325368、ルール構造、AI Editorial、追加shellは成功。統合prepare/境界・Hero preserve成功。全記事ブラウザ比較の待機/実行中を成功とは扱わず、個別記事スコープ規則と対象記事の既存確認記録に基づき公開。CI閾値・必須設定は変更なし。既知のmobile footer 1px差は[個別評価記録](https://github.com/Syasu-pixel/my-site/pull/1846#issuecomment-6837540097)を参照。
- Pages: [run43362428094](https://github.com/Syasu-pixel/my-site/actions/runs/43362428094)、build131678834509・deploy131680809816成功。2026-11-13 04:05 UTCに本番の新title、最終内容更新日、採用Heroを視覚確認。本文3図v2.webpの読込、canonical一致、OGP meta v2.webp、robots metaなし、viewport1180pxに対しscrollWidth1165pxを確認。全依存資源のHTTP/ハッシュ照合や実機スマホ再検査はこの公開後確認では未実施。
- IndexNow: [run43362428194](https://github.com/Syasu-pixel/my-site/actions/runs/43362428194)（#676）、job131678834879。2026-11-13T03:59:05.0401890Zに対象記事1 URLを送信、03:59:06.7630924ZにHTTP200受理。通知受理と検索インデックス完了を区別する。
- Google: `GOOGLE_REQUESTED`。対象本番URLをSearch Consoleで検査し、登録リクエストを1回実行。2026-11-13T04:05:58Zに「インデックス登録をリクエスト済み」「URLを優先クロールキューに追加しました」を確認。再クロール完了・検索結果への反映は未確認。
- 公開導線: 既存URLを維持し、search-indexの対象日本語title/description1件だけ採用済みHTMLメタへ同期。既存keywords/synonyms・英語entry・カテゴリ・トップ・sitemap.xml・非運用seo/sitemap.xmlは変更なし。
- 状態: 本番公開完了・完成/凍結。最終内容更新から90日未満は原則再改善候補から除外。最短再評価日2027-02-10、期間経過だけでは再編集しない。

## 2026-11-13 — emergency-stop-switch-basic 刷新・本番公開完了

- 対象: `articles/emergency-stop-switch-basic.html`。本番URL: https://denkicontrol.com/articles/emergency-stop-switch-basic.html
- 公開PR: [#1848](https://github.com/Syasu-pixel/my-site/pull/1848)。採用source `5d74a151cf186fa5ca9e36fb4eabbd3e5bc0d360`、main反映 `cba25e7156fb996b9da71ed613415eeac318bdc8`。
- 最終内容更新日・公式資料確認日: 2026-11-13 JST。通常停止・非常停止・保守時の隔離、NCと直接開路動作、安全PLCと二重化、解除と再起動の区別を初歩向けに整理。根拠はIDEC/オムロン公式資料。実体験の創作なし。
- 採用画像: `assets/images/emergency-stop-switch-basic/` 内の `emergency-stop-switch-hero-v2.webp`、`emergency-stop-switch-ogp-v2.webp`、`emergency-stop-comparison-v2.webp`、`emergency-stop-system-v2.webp`、`emergency-stop-reset-v2.webp`。Hero/OGP/本文3枚。承認後の本文・画像変更なし。
- 最終Preview: https://9f4c0a4c.denkicontrol-preview.pages.dev/articles/emergency-stop-switch-basic 。Preview専用PR #1849は本番へマージしない。PCライト/ダーク、400 CSS pxライト/ダーク、目次、画像拡大/閉じる、表横スクロール、検索・関連記事を確認。実機スマートフォン/Safari/実投票は未検証。
- source CI: 統合検査、Pages PR検証、Hero preservation、追加shell、ルール構造、AI Editorialは成功。Header/footer比較run43327882681は対象記事footer 2枚のみFAIL。artifact13995090246のbefore/after実見、PC1440px/mobile390pxのgeometryとstyles同一、header差分0、interactionChanged=false/newErrors=0。文字輪郭差として個別判定し[公開前記録](https://github.com/Syasu-pixel/my-site/pull/1848#issuecomment-6840393992)に保存。CI閾値・必須設定を変更せず、全緑とはしない。
- Pages: [run43340055774](https://github.com/Syasu-pixel/my-site/actions/runs/43340055774)成功。本番検証時刻 `2026-11-13T01:11:32.899050+00:00`、HTML＋27依存資源のHTTP200・承認済みpublicationとSHA256一致。HTML SHA256 `ed97c80b1802a69f26c805bbabd12f6a81fa773c57311bb947c05f59a397c482`。
- IndexNow: [run43340055695](https://github.com/Syasu-pixel/my-site/actions/runs/43340055695)、job131605829388、2026-11-13T00:49:40Zに対象記事1 URLをHTTP200受理。インデックス完了を意味しない。
- Google: `GOOGLE_REQUEST_PENDING_MANUAL`。再ログインの二段階認証待ち。まだインデックス登録リクエスト未実施。
- 公開導線: 既存URLを維持、search-indexの対象日本語title/descriptionを採用済み本文メタへ同期。sitemap.xml、非運用seo/sitemap.xml、カテゴリ・トップの件数や記事棚は変更なし。
- 状態: 本番公開完了・完成/凍結。90日未満は原則再改善候補から除外。最短再評価日2027-02-11、期間経過だけでは再編集しない。

## 2026-11-12 — dc24v-power-supply-basic 刷新・本番公開完了

- 対象記事: `articles/dc24v-power-supply-basic.html`
- 本番URL: https://denkicontrol.com/articles/dc24v-power-supply-basic.html
- 公開PR: [#1843](https://github.com/Syasu-pixel/my-site/pull/1843)。承認source `cf971997efe13eed9e41e506bf239ee7b204afb6`。main反映commit: `c8d0dfc5360d7215c69454dc8634630c80cc220b`。
- 最終内容更新日・公式資料確認日: 2026-11-12。公開確認時刻: 2026-11-12T14:21:08.581058Z（同日23:21 JST）。
- 内容: AC入力・DC24V出力の対象範囲、トランス比較、容量・起動時・温度条件、0V/保護接地、表示と実状態の区別、安全表現を整理。一次資料はオムロン・コーセル。未解決掲示板事例は見送り、実体験の創作なし。
- 採用画像（ちびキャラ5枚）:
  - `assets/images/dc24v-power-supply-basic/dc24v-power-supply-basic-hero-v2.png`
  - `assets/images/dc24v-power-supply-basic/dc24v-power-supply-basic-ogp-v2.png`
  - `assets/images/dc24v-power-supply-basic/dc24v-power-supply-basic-overview-v2.png`
  - `assets/images/dc24v-power-supply-basic/dc24v-power-supply-basic-comparison-v2.png`
  - `assets/images/dc24v-power-supply-basic/dc24v-power-supply-basic-selection-v2.png`
- 最終Preview: https://8ed9a404.denkicontrol-preview.pages.dev/articles/dc24v-power-supply-basic.html （Preview専用PR #1844、mainには入れない）。承認後に記事・画像の意味変更なし。
- Preview確認: PC1440/390/320/768 CSSpxの通常Chromeウィンドウ＋ズーム検査、Light/Dark、Hero、画像、OGP、目次、CTA、拡大/閉じる。実機スマホ/Safariではない。新図5枚と既存会話avatarの画風差は保持。
- source CI最終結果: Header/footer比較 [43230808608](https://github.com/Syasu-pixel/my-site/actions/runs/43230808608)はFAILを保持。対象PC/mobileのPNG高さが各1px差、footerの相対構造・5box styles不変、interactionChanged=false・newErrorsなし。本文長によるy差はPC−0.359375px/mobile−0.765625px。Before/After/Diffを個別確認し既存Preview規則によりREVIEW許容。全領域白diffは寸法不一致時のplaceholderで、全画素の実変更ではない。閾値/保護設定変更なし。失敗を成功と書き換えない。
- Pages: [run43235484944](https://github.com/Syasu-pixel/my-site/actions/runs/43235484944)、build job131241593804・deploy job131243893205とも成功。本番manifest/HTML/画像照合: 本番30/30資源HTTP200・承認済みpublicationとSHA256一致・noindexなし。記事HTML SHA256 `4baeda22ba0b679dcc899185a2a566f8ac0fe5702cf1fe01d9b45f27cd4715d4`、source SHA256 `e11c97871b43d9e9b5053e56de6e25da6607c83f032599288ade337010bd756b`。配信mainは上記merge commit。
- IndexNow: [run43235484948](https://github.com/Syasu-pixel/my-site/actions/runs/43235484948)、job131241589536。対象本記事1 URL、2026-11-12T14:17:18.9849238ZにHTTP 200受理。通知受理と検索インデックス完了を区別。
- Google登録リクエスト: 当初未実施だったが、公開後にSearch Consoleで「インデックス登録をリクエスト済み」「URLを優先クロールキューに追加しました」を2026-11-12に確認。`GOOGLE_REQUESTED`。正確な操作時刻は未記録。再クロール完了・検索結果への反映は未確認。
- ナビ/メタ: URLは維持、sitemap.xmlとseo/sitemap.xmlは変更なし。search-index/カテゴリ: 今回の公開後メタ同期でsearch-indexの対象JA description1件のみ承認metaへ同期。カテゴリは既存有効画像・カード・件数を維持。新着追加や既存棚の件数変更なし。
- 状態: 本番公開完了・完成／凍結。最終内容更新から90日未満は原則再改善候補から除外。2027-02-10以降も期間経過だけで再編集せず、日付ガードにより再評価する。


## 2026-11-12 — din-rail-basic 刷新・本番公開完了

- 対象記事: `articles/din-rail-basic.html`
- 本番URL: https://denkicontrol.com/articles/din-rail-basic.html
- 公開PR: [#1841](https://github.com/Syasu-pixel/my-site/pull/1841)。main反映commit: `ffad714cb9eda0581d2d1259474e34e0f4ed74a0`。旧PR #1839は未マージで閉鎖し、同一の承認済みsource `ab90c6ebc00a3fb3f31f3e547be5a12d1cc6d2c8`で再作成した。
- 最終内容更新日・公式資料確認日: 2026-11-12。
- 反映内容: 本文・SEO・Hero/OGP・本文図2枚・公式参照メモ・対象記事の生成台帳。今回の公開PRでは `sitemap.xml` と `assets/data/search-index.json` は変更していない。
- 採用画像:
  - `assets/images/din-rail-basic/din-rail-basic-hero-v2.png`
  - `assets/images/din-rail-basic/din-rail-basic-ogp-v2.png`
  - `assets/images/din-rail-basic/din-rail-basic-fixing-roles-v2.png`
  - `assets/images/din-rail-basic/din-rail-basic-maintenance-space-v2.png`
- CI: 6 workflow成功。Header/footer比較 [43216060795](https://github.com/Syasu-pixel/my-site/actions/runs/43216060795)は既知のDIN日本語PC footer差分1件でFAIL。旧PRと同じ2644 pixels、全288ページ1164画像、interactionChanged=false、新規errors=0。既に個別評価した微小描画差であり、CI成功と書き換えていない。
- 本番Pages [43220496035](https://github.com/Syasu-pixel/my-site/actions/runs/43220496035)成功。2026-11-12 JSTに本番の新本文、更新日、採用Hero、本文2図の読込、canonical/OGP URLを確認。1152px表示の横はみ出しなし。公開後の実機スマホ検査・実投票・フォーム送信は未実施。
- IndexNow [43220495962](https://github.com/Syasu-pixel/my-site/actions/runs/43220495962): 1 URL、HTTP 200受理。検索エンジンのインデックス完了とは区別する。
- Google登録リクエスト: この公開確認時点で未実行（`GOOGLE_REQUEST_PENDING_MANUAL`）。
- 状態: 本番公開完了・完成／凍結。最終内容更新から90日未満は原則再改善候補から除外。2027-02-10以降も期間経過だけで再編集せず、日付ガードの条件で再評価する。
- Preview専用PR #1840はmainに取り込まず、未閉鎖。後片付けは別途許可の範囲で行う。

## 2026-11-12 — electromagnetic-contactor-vs-switch 刷新・本番公開完了

- 対象記事: `articles/electromagnetic-contactor-vs-switch.html`
- 本番URL: https://denkicontrol.com/articles/electromagnetic-contactor-vs-switch.html
- 公開PR: [#1832](https://github.com/Syasu-pixel/my-site/pull/1832)。main反映commit: `f57285ea31c774b2002ef3539a80e6547eee0044`（2026-11-11 21:35:07 UTC / 2026-11-12 06:35:07 JST）。
- 最終内容更新日: 2026-11-11。公式資料確認日: 2026-11-11。本番配信確認日とは区別する。
- 反映内容: 採用済み比較記事本文、Hero・OGP・本文図2枚、公式参照メモ、対象記事の共通台帳entry。
- 採用画像:
  - `assets/images/electromagnetic-contactor-vs-switch/electromagnetic-contactor-vs-switch-hero.png`
  - `assets/images/electromagnetic-contactor-vs-switch/electromagnetic-contactor-vs-switch-ogp.png`
  - `assets/images/electromagnetic-contactor-vs-switch/contactor-switch-construction.png`
  - `assets/images/electromagnetic-contactor-vs-switch/contactor-thermal-protection-flow.png`
- 承認済み最終統合Preview: [#1833](https://github.com/Syasu-pixel/my-site/pull/1833)、commit `d81ee74`。採用済み編集元: `cc308f0`。
- フッター視覚CI: FAILを成功に書き換えず、[個別REVIEW記録](https://github.com/Syasu-pixel/my-site/pull/1832#issuecomment-6807572899)を根拠として公開判断。`docs/preview-environment.md` に従い、必須チェック・保護設定は変更していない。
- 記事本文・title・meta description・URLは採用版を保持。`assets/data/search-index.json` の対象日本語entryは、承認済み記事のtitle・descriptionと名称の同義表記へ同期。本記録と同じ公開後整備PRで更新。
- 変更しなかったもの: `sitemap.xml`、`/seo/sitemap.xml`、トップ。`categories/comparison-guide.html` の対象カード1件は、名称・説明を採用本文へ、画像を採用OGPへ同期。カード順・件数・他記事は変更しない。
- 公開後確認:
  - GitHub Pages: [run 43104347166](https://github.com/Syasu-pixel/my-site/actions/runs/43104347166) 成功、配信commit `f57285ea31c774b2002ef3539a80e6547eee0044`。最終publicationは350テキスト照合・欠落資源0・errors 0。
  - 本番表示: 2026-11-12 JST、統合ヘッダー・新Hero・本文図2枚・ライトボックス・公式資料確認日をブラウザ確認。公開前のPCライト/ダークと狭幅388px/323pxライト/ダークの記録を保持。狭幅は通常デスクトップの窓幅・ズームによる検査であり、実機スマホ検査とは扱わない。
  - IndexNow: [run 43104347105](https://github.com/Syasu-pixel/my-site/actions/runs/43104347105) 成功。job 130803624915で対象記事URL 1件、2026-11-11 21:35:57 UTC（2026-11-12 06:35:57 JST）にHTTP 200受理。検索エンジンでのインデックス確認は未実施。
  - Google登録リクエスト: 未実施。`GOOGLE_REQUEST_PENDING_MANUAL`。対象は上記本番URL。別途適用可能な許可を確認してから進める。インデックス状態は未確認。
  - Preview専用PR #1833: 本番公開成功後に未マージでclose。#1832の変更13ファイルにPreview専用Workflow・trigger・生成HTMLの混入なし。Previewブランチは証跡として保持。
- 状態: 本番公開完了・完成／凍結。最終内容更新から90日間は原則再改善候補から除外。

---

## 2026-09-29 — solenoid-valve-troubleshooting-basic 全面刷新・本番公開

- 対象記事: `articles/solenoid-valve-troubleshooting-basic.html`
- 公開PR: [#1621](https://github.com/Syasu-pixel/my-site/pull/1621)
- 実施内容:
  - 最新main基準で本文を再構成し、採用済みの最終Preview内容を本番へ反映
  - Hero / OGP / 本文画像3枚（全体像／比較／確認フロー）を反映
  - 公式参照メモ `docs/reference-notes/solenoid-valve-troubleshooting-basic.md` を追加
  - article-components / site inventory / site-shell manifest を最終ソースへ同期
  - `docs/existing-article-improvement-backlog.md` の状態を更新
- 状態: 本番公開完了。

---

## 2026-09-28 — sto-basic 全面刷新・本番公開

- 対象記事: `articles/sto-basic.html`
- 公開PR: [#1599](https://github.com/Syasu-pixel/my-site/pull/1599)
- 実施内容:
  - STO記事本文・SEO・公式参照情報を刷新
  - Hero / OGP を刷新
  - 本文画像4枚（通常停止との違い／STOとSS1／安全フロー／確認フロー）を反映
  - 共通ライトボックスを適用
  - 公式参照メモ `docs/reference-notes/sto-basic.md` と作業ログを反映
  - article-components / site inventory / site-shell manifest を最終ソースへ同期
- 状態: 本番公開完了。

---

## 2026-09-28 — magnetic-switch-basic 全面刷新・本番公開

- 対象記事: `articles/magnetic-switch-basic.html`
- 公開PR: [#1606](https://github.com/Syasu-pixel/my-site/pull/1606)
- 実施内容:
  - 記事本文の刷新内容を本番へ反映
  - 採用済みOGPを `assets/images/magnetic-switch-basic/magnetic-switch-basic-ogp.png` へ反映
  - 専用Heroを `assets/images/magnetic-switch-basic/magnetic-switch-basic-hero.png` へ反映し、Hero bindingを更新
  - 本文画像3枚（全体像／動作フロー／コイル・主接点・補助接点の違い）を反映
  - 本文画像のPC・スマホ共通ライトボックスを有効化
  - site inventory / site-shell manifest を最終ソースに同期
- 公開前確認:
  - 本番同等の統合生成Previewで確認
  - publication生成・WebP最適化・最終検証成功
  - PCライト／PCダーク／スマホライト／スマホダーク確認済み
- 公式参照元:
  - 三菱電機FA 低圧開閉器／電磁開閉器／サーマルリレー公式情報
  - 富士電機機器制御 電磁開閉器公式情報
  - 詳細は `docs/reference-notes/magnetic-switch-basic.md` に記録
- 正式用語・公式資料の追補（公開PR [#1614](https://github.com/Syasu-pixel/my-site/pull/1614)）:
  - 三菱電機FA「電磁開閉器」製品情報／低圧開閉器マニュアル検索／サーマルリレーFAQを日本語一次資料として再確認
  - 富士電機機器制御「電磁開閉器」製品情報、および富士電機「SC-NEXT 電磁接触器・電磁開閉器」日本語カタログ（資料No.62C1-J-0307g、2026年3月）を再確認
  - 「電磁接触器」と「電磁開閉器」を同義語として扱わず、電磁開閉器は電磁接触器とサーマルリレーの組合せとして本文を修正
  - 現場呼称「マグネット」と正式名称を分けて説明
  - 記事本文へ日本語公式資料リンクを掲載
  - 最終内容更新：2026-09-28／公式資料確認日：2026-09-28
  - 詳細な参照URL・使用範囲・断定しない範囲・画像ルールは `docs/reference-notes/magnetic-switch-basic.md` を正本とする
  - 本番同等の統合生成、WebP最適化、publication検証、PCライト／PCダーク／スマホライト／スマホダーク監査に成功
- 公開後確認:
  - GitHub Pagesデプロイ成功
  - IndexNow通知成功
  - 本番URLの目視確認済み
- 変更しなかったもの:
  - 記事URL
  - canonical
  - `sitemap.xml` のURL構成
  - `assets/data/search-index.json` のURL構成
  - `/seo/sitemap.xml`
- 状態: 本番公開完了。Google Search ConsoleはURL検査から再クロール依頼を行う運用。

---

## 2026-09-26 — npn-pnp-basic 全面刷新・本番公開

- 対象記事: `articles/npn-pnp-basic.html`
- 公開PR: [#1586](https://github.com/Syasu-pixel/my-site/pull/1586)
- 実施内容:
  - NPN / PNP基礎記事の本文・検索メタデータを刷新
  - Hero / OGP / 全体像 / 比較 / 確認フロー画像を採用版へ更新
  - search index と記事共通部品の整合を更新
  - production-equivalent Preview承認後に本番反映
- 状態: 本番公開完了。

---

## 2026-09-25 — servo-motor-basic 画像刷新・本番公開

- 対象記事: `articles/servo-motor-basic.html`
- 公開PR: [#1587](https://github.com/Syasu-pixel/my-site/pull/1587)
- 実施内容:
  - 最新main基準で採用済みHero / OGPへ刷新
  - 本文図2枚（サーボシステム全体像／位置決め用途）を追加
  - 記事HTMLと site inventory / site-shell manifest を更新
  - 最終Preview承認後に本番反映
- 状態: 本番公開完了。

---

## 2026-09-25 — sensor-basic 全面刷新・本番公開

- 対象記事: `articles/sensor-basic.html`
- 公開PR: [#1575](https://github.com/Syasu-pixel/my-site/pull/1575)
- 実施内容:
  - センサ基礎記事の本文・SEO・画像を全面刷新
  - Hero / OGP と、種類／信号フロー／信号種類／選定ポイント／安全／トラブル確認フローの本文画像を反映
  - search index と記事共通部品の整合を更新
  - 後続で公式参照メモ `docs/reference-notes/sensor-basic.md` を整備
- 状態: 本番公開完了。

---

## 2026-09-23 — no-nc-basic 公式資料・画像刷新・本番公開

- 対象記事: `articles/no-nc-basic.html`
- 公開PR: [#1568](https://github.com/Syasu-pixel/my-site/pull/1568)
- 実施内容:
  - NO / NCの本文を公式資料基準で整理
  - Hero / OGP / 本文画像2枚を更新
  - 公式参照メモ `docs/reference-notes/no-nc-basic.md` を追加
  - article-components / site inventory / site-shell manifest を同期
- 状態: 本番公開完了。

---

## 2026-09-23 — reed-switch-basic 公式資料・画像刷新・本番公開

- 対象記事: `articles/reed-switch-basic.html`
- 公開PR: [#1554](https://github.com/Syasu-pixel/my-site/pull/1554)
- 実施内容:
  - リードスイッチ記事を公式資料基準で更新
  - Hero / OGP / 本文画像2枚を更新
  - 公式参照メモ `docs/reference-notes/reed-switch-basic.md` を追加
  - search index と記事共通部品の整合を更新
- 状態: 本番公開完了。

---

## 2026-09-22 — air-cylinder-troubleshooting-basic 全面刷新・本番公開

- 対象記事: `articles/air-cylinder-troubleshooting-basic.html`
- 公開PR: [#1488](https://github.com/Syasu-pixel/my-site/pull/1488)
- 実施内容:
  - エアシリンダトラブル記事をメーカー公式資料と照合して刷新
  - Hero / OGP と、確認順／空圧／手動操作／機械干渉／リードスイッチ／スピードコントローラの本文画像を更新
  - 作業ログ `docs/worklogs/air-cylinder-troubleshooting-basic-20260917.md` を反映
  - 後続で公式参照メモ `docs/reference-notes/air-cylinder-troubleshooting-basic.md` を整備
- 状態: 本番公開完了。

---

## 2026-09-19 — 既存記事のリンク・表示不備修正（確認用、未公開）

- PR: [#1514](https://github.com/Syasu-pixel/my-site/pull/1514)。追加4ページを含むmain `c86a6e7` を保持した独立ブランチ。マージ・本番公開は本依頼の対象外。
- 英語関連記事: `air-breaker-basic` のSurge Protection → `surge-protection-basic`、`control-panel-cooling-fan-basic` のDC Motor Control → `dc-motor-control-basic`、`surge-protection-basic` のCooling Fan → `control-panel-cooling-fan-basic`。表示名・説明・順序は維持し、リンク先に対応する既存OGPを生成時に取得する。画像の新規作成・差し替えはない。
- 英語フッター: `control-panel-grounding-basic`、`control-panel-label-basic`、`control-panel-outlet-basic`、`control-panel-wire-color-basic`、`din-rail-basic`、`terminal-block-basic`、`terminal-block-jumper-basic`、`wire-number-marker-basic` のcontact/privacy-policy計16リンクを、共通footer `en-footer-0a54aa29e78c.njk` から実在ディレクトリへ再生成。
- 日本語 `pressure-switch-vs-gauge-basic`: `.term` の幅制限と折り返しだけを修正。390px画面でscrollWidth 424px → 375px（縦スクロールバー15pxを除く本文幅）。比較表の内部スクロールを保持。
- 本文、記事URL、更新日、SEO情報、画像ファイル、フォーム、投票処理、`sitemap.xml`、`assets/data/search-index.json`、`/seo/sitemap.xml` は変更なし。通常記事のヒーロー分離や技術内容改善は別作業。
- 12記事の正本ハッシュと3カードの検証値を明示修正に同期。shell比較基準は修正ソースcommit `f6cf5e30dbb7d5dd46590b6f348cdcc41efc23be` へ別commitで固定し、判定・対象範囲は保持。
- ローカルで12記事×4幅、修正先5URLの200、288記事本文等保持、関連記事1361/案内9、リンク監査不備0、追加4ページを含む公開境界を確認。GitHub全件検査の最終結果はPRに記録する。実機Safari・実投票・実フォーム送信は未検証。

---

## 2026-05-22

- 2026-06-01: Bing / IndexNow 運用と meta description 作成方針を今後のCodex作業で維持できるよう、テンプレート・運用ルール系docsへ追記。IndexNowキー確認ファイルとworkflowは削除・変更しない方針、meta descriptionは新規記事作成時から短すぎない自然な説明文にする方針を明文化。

- 2026-06-01: Bing向けの更新通知を自動化するため、IndexNowキー確認ファイルをサイトルートに追加し、main更新時に変更されたHTML URLをIndexNow APIへ送信するGitHub Actions workflowを追加。本文・画像・CSS・sitemap・search-index・既存HTML構造は変更しない。

- 2026-06-01: Bing Webmaster Tools の「meta description が短い」指摘に対応するため、添付CSV掲載URLを対象に各HTMLの meta description を確認し、短すぎる説明文を記事内容に合わせて自然な長さへ補強。本文・画像・CSS・title・canonical・OGP・sitemap・search-index は変更しない方針で実施。

- 2026-05-28: `articles/a-contact-b-contact-basic.html` の古い記事内画像2枚を新しい図解画像へ差し替え。あわせて「a接点 b接点 覚え方」クエリを意識し、通常時/動作時の見方、a接点=普段OFF→動作ON、b接点=普段ON→動作OFFが目に入りやすいよう本文を整理。

- 2026-05-28: `articles/star-delta-start-basic.html` の本文に太字・色付き強調・短段落化を追加し、切替の流れ、電気図の流れ、直入れ始動との違い、確認ポイントを読みやすく調整。

- 2026-05-28: `articles/control-transformer-basic.html` の「制御盤内の結線イメージ」セクションに、制御用トランスの盤内結線イメージ図（article-figure）を追加。

### star-delta-start-basic

- 対象記事: `articles/star-delta-start-basic.html`
- 対象クエリ:
  - `スターデルタ回路`
  - `スター デルタ回路`
- 実施内容:
  - 「簡略ラダー例」という表現を、記事内容に合わせて「電気図の流れ」へ調整
  - スター・デルタ始動をラダー回路ではなく、主接触器・スター接触器・デルタ接触器・タイマの時間順の流れとして読めるように補正
  - 表の見出しと文言を、電気図上の接触器の動きとして自然に読める表現へ調整
  - 既存のタイマ設定時間・切替時間の補足は維持
- 変更しなかったもの:
  - カテゴリ
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリ確認後の記事内容整合調整

### relay-socket-basic

- 対象記事: `articles/relay-socket-basic.html`
- 対象クエリ:
  - `relay socket`
  - `relay socket terminals`
- 実施内容:
  - relay socket / relay socket terminals の英語表記を軽く補足
  - リレーソケット端子と端子番号の見方を軽く補強
  - 関連記事に `a-contact-b-contact-basic.html` を追加
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強

### air-filter-regulator-lubricator-basic

- 対象記事: `articles/air-filter-regulator-lubricator-basic.html`
- 対象クエリ:
  - `filter regulator lubricator`
  - `compressed air filter regulator lubricator`
  - `air filter regulator lubricator`
  - `frlユニットとは`
- 実施内容:
  - FRLの英語表記とFilter / Regulator / Lubricatorの意味を軽く補足
  - フィルタ・レギュレータ・ルブリケータの役割分担を軽く補強
  - 関連記事に `air-pneumatic-troubleshooting-guide.html` を追加
  - 右カラムの先に読む記事に `air-pneumatic-troubleshooting-guide.html` を追加
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強

### a-contact-b-contact-basic

- 対象記事: `articles/a-contact-b-contact-basic.html`
- 対象クエリ:
  - `a接点 b接点 覚え方`
  - `a接点 b接点`
  - `NO NC 違い`
- 実施内容:
  - a接点・b接点の覚え方を「通常時」と「動作時」で見る説明として軽く補強
  - NO / NCとの関係説明を軽く補足
  - 関連記事の `no-nc-basic.html` への説明文を軽く調整
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強

## 2026-05-21

### forward-reverse-circuit-basic

- 対象記事: `articles/forward-reverse-circuit-basic.html`
- 対象カテゴリ: `categories/circuit-basics.html`
- 追加画像:
  - `assets/images/forward-reverse-circuit-basic/forward-reverse-circuit-basic-ogp.png`
- 実施内容:
  - `articles/forward-reverse-circuit-basic.html` の `og:image` を `forward-reverse-circuit-basic-hero.png` から `forward-reverse-circuit-basic-ogp.png` へ変更
  - `articles/forward-reverse-circuit-basic.html` の `twitter:image` を `forward-reverse-circuit-basic-hero.png` から `forward-reverse-circuit-basic-ogp.png` へ変更
  - `categories/circuit-basics.html` の正転・逆転回路カード画像を `forward-reverse-circuit-basic-ogp.png` へ変更
  - 記事hero背景は既存の `forward-reverse-circuit-basic-hero.png` のまま維持
- 変更しなかったもの:
  - 記事本文
  - CSS
  - canonical
  - og:url
  - title
  - meta description
  - `sitemap.xml`
  - `assets/data/search-index.json`
- HTML反映PR:
  - `#1225 Apply Forward Reverse circuit OGP image`
- 状態:
  - safe to merge 確認済み

### magnetic-switch-basic

- 対象記事: `articles/magnetic-switch-basic.html`
- 対象カテゴリ: `categories/circuit-basics.html`
- 追加画像:
  - `assets/images/magnetic-switch-basic/magnetic-switch-basic-ogp.png`
- 実施内容:
  - `articles/magnetic-switch-basic.html` の `og:image` を `magnetic-switch-overview.png` から `magnetic-switch-basic-ogp.png` へ変更
  - `articles/magnetic-switch-basic.html` に `twitter:image` を追加
  - `categories/circuit-basics.html` のマグネットスイッチカード画像を `magnetic-switch-basic-ogp.png` へ変更
  - 記事hero背景は既存の `magnetic-switch-overview.png` のまま維持
- 変更しなかったもの:
  - 記事本文
  - CSS
  - canonical
  - og:url
  - title
  - meta description
  - `sitemap.xml`
  - `assets/data/search-index.json`
- HTML反映PR:
  - `#1226 Apply Magnetic Switch OGP image`
- 状態:
  - safe to merge 確認済み


### star-delta-start-basic

- 対象記事: `articles/star-delta-start-basic.html`
- 対象クエリ:
  - `スターデルタ回路`
  - `スター デルタ回路`
  - `スターデルタタイマ 設定時間`
  - `スター デルタ タイマ 設定時間`
  - `直入れ スターデルタ 使い分け`
- 実施内容:
  - スター・デルタタイマの設定時間を見る時の考え方を追記
  - 直入れ始動とスター・デルタ始動の使い分け説明を軽く補強
  - 関連記事に `timer-circuit-basic.html` を追加
  - 右カラムの先に読む記事に `timer-circuit-basic.html` を追加
- 変更しなかったもの:
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリに合わせた軽量補強


### control-transformer-basic

- 対象記事: `articles/control-transformer-basic.html`
- 対象クエリ:
  - `制御盤 トランス`
  - `制御トランス`
  - `control transformer`
- 実施内容:
  - 黒文字中心で読みづらかった本文を、強調・短段落・注意ボックスで整理
  - 一次側 / 二次側 / 制御回路用電源の説明を見やすく補強
  - 制御盤内での結線イメージが伝わるよう、盤内での電源の流れの説明を整理
  - 小型の制御用トランスが盤内でどう使われるか分かりやすく調整
- 変更しなかったもの:
  - カテゴリ
  - title
  - meta description
  - canonical
  - og:url
  - og:image
  - twitter:image
  - 画像ファイル
  - CSS
  - `sitemap.xml`
  - `assets/data/search-index.json`
- 状態:
  - Search Consoleクエリ確認後の読みやすさ改善と内容整理

- 2026-05-28: `articles/star-delta-start-basic.html` の「電気図の流れで見る」セクションに配線イメージ図（article-figure）を追加。