# proximity-sensor-basic 公式参照メモ

## 参照した公式元・確認対象
- オムロン制御機器
  - [近接センサ 概要](https://www.fa.omron.co.jp/guide/technicalguide/41/17/)：誘導形、静電容量形、磁気式、材質・取付け・環境条件。
  - [近接センサ 用語解説](https://www.fa.omron.co.jp/guide/technicalguide/41/318/index.html)：標準検出物体、検出距離、設定距離、応差。測定方向の違いがあるため全型式を単一形状で表さない。
  - [近接センサ 参考資料](https://www.fa.omron.co.jp/guide/technicalguide/41/19/)・[共通の注意事項](https://www.fa.omron.co.jp/product/cautions/41/18/index.html)：材質・寸法・周囲金属・相互干渉。取付け寸法は個別仕様へ。人体保護への代替不可。
  - [形E2E-X2D1-M1](https://www.fa.omron.co.jp/product/item/E2E-X2D1-M1/)：「定格/性能」「相互干渉」「周囲金属の影響」。検出距離2 mm ±10%、設定距離0～1.6 mm、標準鉄8×8×1 mm。直流2線式、NO、動作表示灯（橙）と設定表示灯（緑）の例。背面端子配列の例として使わない。
  - [光電センサ 概要](https://www.fa.omron.co.jp/guide/technicalguide/43/2/index.html)：遮光・反射による受光量変化。表面や透明度の影響は方式依存。
- SICK
  - [IME12-04BPPZC0S 1060232](https://www.sick.com/media/pdf/4/44/744/dataSheet_IME12-04BPPZC0S_1060232_en.pdf)：「Connection diagram CD-006」。DC4線PNP相補出力。1茶L+、3青M、4黒NO、2白NC。
  - [IME12-04BPSZC0S 1040764](https://www.sick.com/media/pdf/1/81/481/dataSheet_IME12-04BPSZC0S_1040764_en.pdf)：「Connection diagram CD-007」。DC3線PNP NO。1茶L+、3青M、4黒NO、2未接続。連続出力電流200 mA以下、最大負荷時の電圧降下2 V以下。両機種の資料版日は2026-07-18。
- 三菱電機
  - [MELSEC iQ-F FAQ 24170：S/S端子について](https://fa-faq.mitsubishielectric.co.jp/faq/show/24170)：「ソース入力時」はS/Sが0 V。名称だけで一般化しない。
  - [MELSEC iQ-F FX5S CPUユニットハードウェアマニュアル](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/ib0800671j/ib0800671jf.pdf)：入力信号形式とPNPの適合。
- Siemens
  - [ET 200eco PN Operating Instructions](https://support.industry.siemens.com/cs/attachments/29999018/et200eco_pn_operating_instructions_en-US_en-US.pdf) §3.6.3、表3-4（p.40）、表3-5（p.41）。6ES7141-6BF00-0AB0 のX1は4番DI0／2番DI4、6ES7141-6BG00-0AB0 の2番は未使用。子局の種類を比較するだけで、特定センサ/ケーブルとの互換を保証しない。
- Phoenix Contact
  - [RIF-0-RSC-24DC/21AU 2903372 PDF](https://www.phoenixcontact.com/en-us/products/relay-module-rif-0-rsc-24dc21au-2903372?type=pdf) p.2「Set consists of」、p.3「Coil side」、p.4「Output data」、p.11「Circuit diagram」。組立品のベース RIF-0-BSC/21（2900957）、リレー REL-MR-24DC/21AU（2961121）。A1＋、A2−、11 common、14 NO、12 NC。DC24 V、定格時代表値9 mA、還流ダイオード内蔵。コイル入力範囲19.2～36 Vは20℃時。実際には温度・電源変動・出力/線路降下・投入電流に照合する。接点最小切替電流の仕様は1 mA（12 V時）、金接点の条件で参照。PLC入力回路との適合を無条件で主張しない。

## 確認日
- 2026-11-21（JST）。記事内容更新日とは別項目。

## 記事で使う範囲
- 誘導形を中心に、方式の違い、実物の材料と寸法、設定距離と検出距離、設備取付けと信号を分ける。
- M12のピン・線数・出力の違い、センサの直結と子局経由の違い、リレーを使う場合の二つの回路を具体例で説明する。
- 現場知識候補PB-018は「どの条件を見落とすか」の着眼点。ブログ内の色や操作手順、比率や実例を転記せず、オムロンの注意事項で確認できる材質/取付け/相互干渉のみを一般的な診断観点として採用。

## 断定しない範囲
- 検出距離の材質別一律換算、金具への埋込み条件、表示灯の機能、M12互換、リレー適合・応答。ケーブル・メーカーや形式に沿って確認する。
- 模式図はメーカー回路図の転載ではない。端子記号と参照機種のみを示し、正面／背面／内部ピン配列や工事実施手順を再現しない。構成変更や点検時は設備固有の安全手順を優先。

## 画像ルール・表記
- Hero/OGPは誘導形円柱・非接触を示す表紙用のイメージ。メーカー銘板・ロゴ・配線なし。光線、共通の数値、通電中の作業を描かない。
- 図は「検出距離」「設定距離」「周囲の金属」「相互干渉」「A1＋」「A2−」「11」「14：NO」「12：未使用」。機種例以外では端子番号を標準と断定しない。
