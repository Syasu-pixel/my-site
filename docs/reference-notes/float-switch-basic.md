# フロートスイッチ｜参照した公式資料

- 対象: `articles/float-switch-basic.html`
- 公式資料確認日: 2026-11-22
- 使用した範囲: 構造・検知点・接点動作の読み方。銘板・取付図・実設備の制御判断・緊急安全手順は本記事の図解では代替しない。

| 公式資料 | 記事で使用した範囲 |
| --- | --- |
| [MRT 小型フロートスイッチ：MF/RF](https://www.mrt-sensor.jp/products/float_1m/) | ステム内リードとフロート内永久磁石。MFV/MFHの縦／横取付仕様。PLCやリレーを介した制御例。 |
| [WIKA RLS-1000 データシート LM 50.03（10/2026）](https://www.wika.com/media/Data-sheets/Level/Float-switches/ds_lm5003_en_co.pdf) | p.2 無電圧リード接点、検知点の配置、液面上昇を基準とするNO/NC/SPDTの選択、取付姿勢。型式固有の寸法値や電気定格を施工値として転記しない。 |
| [WIKA RLSシリーズ取扱説明書](https://www.wika.com/media/Operating-instructions/Operating-instructions/Level/Float-switches/oi_rls_en_de_fr_es.pdf) | §5.4 の意図しない動作への注意、§6 切替不調と異常時の安全、§7.1 槽内作業の危険。記事は外から見える情報を対象とし、施工・試運転手順を扱わない。 |

## 断定しない範囲
- 図は縦型の磁石／リード式の概念と検知位置の違い。信号極性、可動寸法、取付許容、タンク開放や機器の操作を示さない。
- 上限／下限は検知する高さ。接点の開閉とPLC入力／ポンプ運転には別の条件・回路が介在し、他機種・別用途のNO/NCやラダー条件に一般化しない。
