# 検索流入上位記事 技術・テンプレート品質監査（2026-09-10）

## 目的
Google Search Console の直近28日で検索流入が多い日本語の技術記事を優先し、テンプレート統一と技術的整合性を順番に確認する。
工具紹介・商品比較寄り記事、英語記事は今回の優先監査から除外する。

## 監査対象
GSC settled through 2026-09-07。上位から以下25記事を対象とする。

1. `articles/star-delta-start-basic.html`
2. `articles/pilot-lamp-basic.html`
3. `articles/control-panel-grounding-basic.html`
4. `articles/shielded-cable-basic.html`
5. `articles/selector-switch-basic.html`
6. `articles/terminal-block-jumper-basic.html`
7. `articles/air-cylinder-basic.html`
8. `articles/a-contact-b-contact-basic.html`
9. `articles/control-panel-wire-color-basic.html`
10. `articles/dc24v-common-basic.html`
11. `articles/no-nc-basic.html`
12. `articles/plc-io-unit-basic.html`
13. `articles/plc-xymd-device-basic.html`
14. `articles/one-shot-circuit-basic.html`
15. `articles/terminal-block-basic.html`
16. `articles/control-panel-cooling-fan-basic.html`
17. `articles/power-signal-wiring-separation-basic.html`
18. `articles/solenoid-valve-troubleshooting-basic.html`
19. `articles/din-rail-basic.html`
20. `articles/alternate-operation-circuit-basic.html`
21. `articles/control-transformer-basic.html`
22. `articles/emergency-stop-switch-basic.html`
23. `articles/signal-tower-light-basic.html`
24. `articles/dc24v-power-supply-basic.html`
25. `articles/limit-switch-troubleshooting-basic.html`

## 初回オンページ監査結果
- 25/25 が HTTP 200、indexable、self canonical、H1 1個。
- critical / high / medium の機械監査エラーは0件。
- 画像 alt 欠落は対象25記事で0件。
- 構造化データは対象25記事すべてで未検出。Article / BreadcrumbList 等を今後テンプレート共通仕様として検討する。
- crawler の `thin-content` 判定は日本語の語数分割に弱いため、その数値だけで加筆判断しない。本文の検索意図・説明不足・一次情報との整合性を人間向けに監査する。
- `dc24v-common-basic.html` と `plc-xymd-device-basic.html` は hreflangCount が2で、他の多くの記事の3より少ない。実ファイルを確認して不足タグの有無を個別修正する。

## 技術監査の進め方
- 検索流入順で1記事ずつ確認する。
- メーカー公式マニュアル、FAQ、技術資料など一次情報を優先する。
- 記事の検索実績が強い場合、正しい既存構造を不用意に全面改稿しない。
- 誤り、誤解を招く表現、条件不足、図と本文の不一致を優先して修正する。
- 一般論と機種固有仕様を混同しない。
- 安全・保護・接地・モータ・PLC入出力などは特に条件を明記する。

## 監査開始：スターデルタ始動
三菱電機FA FAQで、スターデルタ始動はスター接続で始動し、始動電流を直入れ時の1/3として加速後デルタ接続する方式と確認。現記事の「Y結線では各巻線電圧が線間電圧の1/√3」という説明とも整合する。

ただし、始動トルク、切替条件、対象モータ・端子構成、サーマルリレー配置などは条件依存のため、記事内の該当記述を一次資料と突合してから修正要否を決める。

## 次の順番
1. スターデルタ始動：技術本文の精査を完了
2. パイロットランプ：表示色・用途・規格依存表現を精査
3. 制御盤の接地：保護接地とノイズ対策接地を混同していないか精査
4. 以降、検索流入順に継続
