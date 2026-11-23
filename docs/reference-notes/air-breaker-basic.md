# エアブレーカー（低圧気中遮断器・ACB）の参照メモ

- 対象記事：`articles/air-breaker-basic.html`
- メーカー公式資料の最終確認日：2026-11-23

## 確認した一次資料

1. [三菱電機：低圧気中遮断器の特長](https://www.mitsubishielectric.co.jp/fa/products/lvd/lvcb/pmerit/acb/) — 低圧回路の保護に使うこと、配線用・漏電遮断器も空気中で遮断する例があること、引出形などの構造や性能差。名称や容量だけの区分にしない。
2. [三菱電機：AE1600-SWの仕様](https://www.mitsubishielectric.co.jp/fa/products/faspec/detail.page?category=ex&formNm=ACB_S_DRAWOUT_AE1600-SW_5262&id=spec&kisyu=%2Flvcb) — 一般保護用、引出形、4極の掲載構成。定格電流1600 A、AC440 VのIcu／Ics 65 kA。引きはずし設定 Ir と Icw は別欄。規定条件の説明であり、実設備の選定・調整値ではない。
3. [三菱電機：World Super AE 日本語カタログ（Y-0629L）](https://dl.mitsubishielectric.co.jp/dl/fa/document/catalog/lvcb/yn-c-0629/y0629l2505.pdf) — AE630-SW～AE1600-SWの製品定格表、引きはずしリレーの種類／オプション。遮断容量はリレー構成などにより異なる。IcwとIcu／Ics、投入容量Icmを混同しない。
4. [三菱電機技報：新形気中遮断器 Super AE](https://www.giho.mitsubishielectric.co.jp/giho/pdf/1992/9203.pdf) — 図6とその説明を空気中に生じたアークを消弧室で冷却する根拠として使用。旧世代の技報であり、図は現行AE1600-SW実機の断面図ではない。

## 記事・図の境界

- 図は電路保護、主幹と分岐、1極の遮断順序、仕様の読み方を示す独自の学習図。単線位置図の機器アイコンはJIS図記号でなく、実配線、操作、盤内作業、復電、保護協調設計の手順ではない。
- ACBと真空遮断器や圧縮空気機器を混同しない。遮断器が開いたことを設備全体の無電圧と同一視しない。
