# PLC入力が入らない時の確認手順：参照資料

- 対応ページ：[PLC入力が入らない時の確認手順](../../articles/plc-input-troubleshooting-basic.html)
- 公式資料の確認日：2026-11-21
- 範囲：一般のDC24Vデジタル入力の学習用。型式・入力回路・入力割付を特定せず、施工・通電測定・安全入力の診断や設定変更を案内しない。

## 一次資料と採用範囲

1. [三菱電機 MELSEC iQ-F FX5S/FX5UJ/FX5U/FX5UC ユーザーズマニュアル（ハードウェア編）SH-082451-L](https://dl.mitsubishielectric.co.jp/dl/fa/members/document/manual/plcf/sh082451/sh082451l.pdf) §15.5 入力配線 pp.176–178。FX5U内蔵入力のS/S・Xなどは同社の例。入力ONとLED、入力応答・デジタルフィルタの区別に使用。接続先・設定値・動作保証値は記事に転記しない。現行版Qの掲載を[公式ダウンロード一覧](https://www.mitsubishielectric.co.jp/fa/download/search.page?category1=CPU&category2=FX5U+CPU%E3%83%A6%E3%83%8B%E3%83%83%E3%83%88&category3=0&filter_bundled=1&filter_discontinued=1&filter_readme=1&kisyu=%2Fplcf&kisyuid=&lang=1&listView=1&mode=manual&preview=&q=&sort=0)で確認。Q PDFは会員ログインが必要で本文未取得。確認できたLの仕様説明に限る。
2. [三菱電機 MELSOFT GX Works3「第23回 デバイスの変化をモニタで確認」](https://www.mitsubishielectric.co.jp/fa/products/cnt/plceng/smerit/gx_works3/gx3go/0023.html)。モニタは指定したデバイスの表示であり、対象CPU・局・アドレスを揃える必要があることの説明に使用。モニタ表示周期の具体値や特定機能の対応を一般化しない。
3. [オムロン E3Z-R66 型式別製品資料](https://www.fa.omron.co.jp/product/item/E3Z-R66/ja/pdf/) pp.3–4 性能・表示灯、p.7 タイムチャート。動作表示灯の変化が制御出力と対応し、入光ON／遮光ONが切替式であることを型式例として使用。安定表示灯・電源灯と混同しない。センサー表示だけからPLC側の信号到達を推定しない。
4. [三菱電機 MELSEC iQ-F FX5U CPU スクールテキスト JY997D68101-E](https://dl.mitsubishielectric.co.jp/dl/fa/members/document/manual/school_text/jy997d68101/jy997d68101e.pdf) §4.3.1。a接点とOUTの読み方を確認。X10のa接点が内部M10を駆動する図は番号を揃えて読む学習用で、外部出力・端子配線・安全回路を示さない。

## 現場知識から採った考え方

- [第19回・FK18-006](field-knowledge-round19-2026-11-08.md#fk18-006-r19) はB。交換前後に見た事実と推定原因を分ける方法だけを採用。原典にある湿潤・漏れ・電圧・実機故障の断定は採用せず、別メーカーの保証値もこの記事に入れない。
- [第19回・FK12-009](field-knowledge-round19-2026-11-08.md#fk12-009-r19) はB。短い入力について、入力回路の応答・処理経路・画面での観測を分ける考え方だけを採用。原典の故障原因・設定値・処置は採用しない。
- 搬送終点のX10/X11と引き継ぎメモは学習用の架空例。実機事例・測定結果ではない。
