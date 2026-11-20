# 交互運転回路 — 公式資料メモ

- 記事：`articles/alternate-operation-circuit-basic.html`
- 確認日：2026-11-19
- 三菱電機： [MELSEC iQ-F FX5 Programming Manual (Instructions, Standard Functions/Function Blocks), JY997D55801-AC](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d55801/jy997d55801ac.pdf)。6.3出力命令の「ALT(P)」（p.161–162）で、ALTPは実行条件のOFF→ONごとに対象ビットを1回反転、ALTは実行条件ONの間の各演算周期で反転することを確認。RSTで指定ビットがOFFになることと、後に実行した命令が反映される点は2.3の同一デバイスへのSET/RST等の動作説明、および6.3「SET, RST」で参照。
- 三菱電機： [FX5U-32MT/ES マニュアル一覧](https://www.mitsubishielectric.co.jp/fa/products/faspec/download.page?category=ex&formNm=FX5-_M-E-_FX5U-32MT%2FES_2&id=spec&kisyu=%2Fplcf)。日本語JY997D54701-ACと英語JY997D55801-ACの2026年10月版掲載を確認した。日本語PDFはメンバー限定のため、命令本文はメーカー公開の同版英語PDFを確認した。
- オムロン：[61F-AN データシート](https://www.fa.omron.co.jp/data_pdf/cat/61f-an_ds_j_5_2.pdf?id=249)／[61F-AN AC200 形式仕様](https://www.fa.omron.co.jp/product/item/61F-AN_AC200/)。ポンプ2台の交互運転を用途とする専用リレーの実例としてのみ使用。型式仕様・負荷選定・接続方法は記事では一般化しない。
- 見本図はメーカー転載ではなく、FX5Uのシミュレーター上で表示灯だけを想定した独自の教育用図。実機試運転、電源投入時の自動始動防止、保持設定、チャタリング対策、設備の状態監視・安全・異常切替は保証しない。
