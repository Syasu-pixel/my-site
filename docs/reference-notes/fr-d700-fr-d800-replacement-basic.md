# FR-D700からFR-D800への置き換え 公式参照メモ

- 対象：日本語新規記事 `fr-d700-fr-d800-replacement-basic`。三菱電機の公式資料を2026-11-25（JST）に確認。
- [三菱電機 No.832 生産終了のお知らせ](https://www.mitsubishielectric.co.jp/fa/document/sales/inv/832/sales832.pdf) 1ページ：掲載のFR-D700形名と後継、2026年7月1日から受注生産、2027年1月末受注受付分まで。修理・サービスの受付は2034年1月末までの案内だが部品等の条件あり。納期、在庫、修理可否は保証しない。
- [三菱電機 BCN-C21002-229B 置換え資料](https://www.mitsubishielectric.co.jp/fa/document/techlib/inv/bcn-c21002-229j/bcn-c21002-229B.pdf) 2–3ページ：三相200 VのFR-D720-1.5K→FR-D820-1.5K-070は取付穴が同じでも外形と端子配置を個別確認。FR-D720-3.7K→FR-D820-3.7K-165で既設穴を使うときのFR-E8AT03。15・20ページ：FMの違い、AMを同じ出力とみなさず、Pr.54をそのまま引き継がない根拠。記事の比較はND定格の例であり、別電圧・形名に一般化しない。
- [三菱電機 No.812 FR-E8AT03 変更案内](https://www.mitsubishielectric.co.jp/fa/document/sales/inv/812/sales812.pdf)：FR-D820向け穴の追加。既設品・旧在庫の対応は変更後の図と照合する。
- [三菱電機 FAQ 44813](https://fa-faq.mitsubishielectric.co.jp/faq/show/44813?site_domain=default)：FR-D700パラメータの直接コピー・転送は不可。[三菱電機 No.809 FR Configurator2 更新案内](https://www.mitsubishielectric.co.jp/fa/document/sales/inv/809/sales809.pdf)：1.34L以降でコンバートに対応。変換結果は型式別の資料で再照合し、同じ動作を保証しない。

## 採用する範囲・採用しない範囲

- 採用：形名、取付穴、端子位置、I/Oの行き先・経由先、パラメータを分けて確認する考え方。FMモニタの例は想定例で、特定設備の体験談・復旧実績ではない。
- A4横の確認シートは、旧機・新機の実際の情報を書き残すための記録用。9項目と任意のPr.欄3行。初期値・推奨値、転用できる設定の断定は記載しない。
- 除外：結線・通電・設定変更・試運転の実施手順。機種や設備が特定できないときは「未確認」として引き継ぐ。
- Hero／OGP／本文図は概念図。メーカーのUI・銘板・実物端子配置を再現せず、図から接続位置や寸法を判断しない。
