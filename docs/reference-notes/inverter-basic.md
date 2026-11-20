# inverter-basic 公式参照メモ

## 参照した公式元
- 三菱電機FA：[FR-A800/FREQROL-A800 公式資料・ダウンロード](https://www.mitsubishielectric.co.jp/fa/download/search.page?category1=FREQROL-A800&kisyu=%2Finv&lang=1&listView=1&mode=manual&sort=0)

## 確認対象マニュアル・資料
- [FAQ #39241：周波数設定について](https://fa-faq.mitsubishielectric.co.jp/faq/show/39241?site_domain=default)：始動と周波数の指令元を区別。運転モードによって操作パネル側の周波数設定が有効でない例。
- [FAQ #39170：周波数設定について](https://fa-faq.mitsubishielectric.co.jp/faq/show/39170?site_domain=default)：CC-Linkで周波数を指令する構成例。条件を限定し、書込先・ビット・倍率等を一般手順として扱わない。
- [FR-A800カタログ L06074-R](https://dl.mitsubishielectric.co.jp/dl/fa/document/catalog/inv/l06074/l06074r.pdf)：出力信号と操作パネルのモニタ項目。標準端子仕様のRUNは運転中を示す出力で、始動指令の入力ではない。
- [FR-A800/F800 セーフティストップ機能取扱説明書 BCN-A23228-001-H(E)](https://dl.mitsubishielectric.com/dl/fa/document/manual/inv/bcn-a23228-001e/bcna23228001eh.pdf) pp. 2–3：STOは電気的隔離ではない。作業前の電源隔離・放電待ち・無電圧確認には対象機種および設備の手順を用いる。

## 確認日
- 2026-11-20（日本時間）

## 記事で使う範囲
- 運転指令・設定周波数・出力周波数は別項目。指令元とRUNの具体例は対象シリーズに限定する。
- 通常停止、STO、作業前の電源隔離は別。停止した表示だけでは無電圧を判断しない。
- インバーター、モーター、機械の仕様に沿って運転範囲を決める。消費電力は負荷と運転条件による。

## 断定しない範囲
- 他機種の運転モード、端子割付、電圧/電流入力、通信指令、表示、停止条件を同じとみなさない。
- Hzと実回転数を固定対応で示さない。実回転数はモーター種類・極数・負荷等に関わる。省エネ効果を保証しない。
- 安全回路を変更するための設計・配線・パラメータ値、一定の放電時間、端子測定を一般的な作業手順として案内しない。

## 画像ルール
- 指令と停止の2図は、既存の本文スタイルを使う読み取り可能なHTML概念図。実機配線、メーカーのロゴ・銘板・UI、具体設定を再現しない。
- 旧本文図の参照を外し、資産自体は保全。Hero/OGPは本文差分とは別に審査する。
