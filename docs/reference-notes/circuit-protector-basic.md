# サーキットプロテクタ 公式参照メモ

確認日：2026-11-22。対象：既存の日本語記事 `articles/circuit-protector-basic.html`。

| 一次資料 | 確認事項 | 適用範囲 |
| --- | --- | --- |
| [富士電機機器制御 CP30Fシリーズ](https://www.fujielectric.co.jp/products/circuit_protector/cp30f/) | 制御回路・機器向けのシリーズであり、付属装置や引外し特性に違いがある。 | シリーズの見出しだけで適用回路・定格は決めない。 |
| [CP30FS-1P003個別仕様](https://selector-fa.fujielectric.co.jp/products/g/gCP30FS-1P003/?search=common) | 制御回路用、1極・低速形・直列形。定格電流3A、表面ねじ取付、補助・警報スイッチなし、定格遮断容量2.5kA（AC250V）、2.5kA（DC65V）。 | カタログの読み方だけの例。異なる型式の定格や機器選定には転用しない。 |
| [CP30FS-3P002個別仕様](https://selector-fa.fujielectric.co.jp/products/goods/goodsprintpreview.aspx?goods=CP30FS-3P002&search=common) | 3極・低速形・AC回路、定格電流2A、定格遮断容量2.5kA（AC250V）。 | 同じシリーズでもDCに使えると断定しない。 |
| [富士電機機器制御 SCCRの解説](https://www.fujielectric.co.jp/fcs/feature/box/pdf/PA076J_SCCR.pdf) | 米国向け制御盤におけるUL1077補助保護・分岐回路保護の区別。装置全体のSCCRと機器の定格遮断容量の区別。 | 米国向けの資料を国内の一律の規格要件として使わない。組合せ・選択遮断・SCCRは装置と該当規格で個別検討。 |

図中の機器や回路は概念例。適用回路の具体的設計、結線・遮断の順序や法令の適用を示すものではない。実機の調査・交換は認められた担当者が設備の安全手順で行う。未確認の現場実績、無断の定格変更・上流保護の代替・原因不明の再投入は採用しない。

DC24Vの停止例は旧版の保護対象・症状を引き継いだ架空の読図例。洗浄や損傷は履歴照合の仮説で、動作試験、点検手順や故障実績を示すものではない。
