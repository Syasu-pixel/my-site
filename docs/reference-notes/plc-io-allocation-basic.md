# PLC I/O割付 公式参照メモ

- 三菱電機 [MELSEC iQ-F FX5ユーザーズマニュアル（ハードウェア編）SH-082452ENG-L（英語版）](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/sh082452eng/sh082452engl.pdf) §2.4：通常のローカルデジタルX/Yは8進の自動割付。増設はX/Y別々に続き、下1桁0始まり。機種固有の予約・空き番号の例もある。
- 三菱電機 [FX5スクールテキスト JY997D69701A（英語版）](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d69701/jy997d69701a.pdf) §2.5.4：FX5U-32MR/ES内蔵16入力、最初のFX5-16EX/ESのシステム側X20～X37とユニット内端子表示。本記事のTB1-03・ワーク検出は架空。
- 三菱電機 [公式FAQ No.25095](https://fa-faq.mitsubishielectric.co.jp/faq/show/25095?site_domain=default)：iQ-Rの先頭XYは16進。iQ-Fのインテリジェント機能ユニット等のユニットNo.は通常X/Yと別。設定や実機操作の手順には転用しない。
- 確認日：2026-11-19。ネットワーク・安全・特殊・アナログI/Oは対象外。対象型式の最新版を優先。
