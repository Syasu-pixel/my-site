# analog-input-basic 公式参照メモ

## 参照した公式元・確認対象

- 三菱電機 MELSEC iQ-R R60AD4：公式仕様（日本語） https://www.mitsubishielectric.co.jp/fa/products/faspec/detail.page?formNm=R_ADDA_R60AD4_3337&kisyu=%2Fplcr&popup=1
- 三菱電機 MELSEC iQ-R R60DA4：公式仕様（日本語、入力と出力の区別にのみ使用） https://www.mitsubishielectric.co.jp/fa/products/faspec/detail.page?formNm=R_ADDA_R60DA4_3345&kisyu=%2Fplcr&popup=1
- 三菱電機 MELSEC iQ-R Analog-Digital Converter Module User's Manual (Startup), SH-081232ENG-F（2026-10）、2.1 性能仕様、付録2 電流入力特性 https://dl.mitsubishielectric.com/dl/fa/document/manual/plc/sh081232eng/sh081232engf.pdf
- 同 Application, SH-081233ENG-H（2026-10）、1.11 入力信号異常検出（pp. 42–46）、デジタル出力値・演算値の定義 https://dl.mitsubishielectric.com/dl/fa/document/manual/plc/sh081233eng/sh081233engh.pdf
- R60AD4公式マニュアル一覧（版確認） https://www.mitsubishielectric.com/fa/products/faspec/download.page?category=ex&formNm=R_ADDA_R60AD4_3433&id=spec&kisyu=%2Fplcr&lang=2&word=Analog

## 確認日

- 2026-11-21 JST。日本語の公式仕様と、公式サイトから実取得した最新の英語版Startup F・Application Hを照合。日本語PDF本文は認証画面のため未読。

## 記事で使う範囲

- アナログ入力 (AI, A/D) は機器からPLCへ、アナログ出力 (AO, D/A) はPLCから機器へ。速度指令はAO側の用途の例。
- R60AD4の4～20 mA通常レンジ：オフセット4 mA、ゲイン20 mA、公称内部値0～32000。12 mA→16000、0～1.00 MPaを出す架空の圧力変換器例→0.50 MPa。R60AD4の0～20 mAレンジと取り違えた公称値4 mA→6400／12 mA→19200は同機の当該レンジからの計算例。
- 設定した拡張レンジと検知方法を組み合わせる簡易断線検知、異常検出時の直前デジタル出力値・演算値保持。簡易断線の数値しきい値やユニット入出力番地は本文で示さない。
- 0 mAとPLC内部値0と表示上の0は別。実際の信号経路、ユニット内部値・状態、換算・表示の順を分けて診断。

## 断定しない範囲

- 他メーカー／シリーズの内部レンジ・極性・端子・入力コモン・断線検知条件・ファームウェア仕様は一般化しない。拡張モードでの下限動作や別の数値範囲を通常レンジの換算例へ混ぜない。
- センサ故障や断線を「0」やふらつきだけで判定しない。活線作業や保護装置無効化は案内しない。
- 接続や実施の原典は設置機器の公式マニュアルと現場規程。サイトの図は配線図ではない。

## 公式用語・採用表記／画像ルール

| 日本語表記 | 公式英語表記 | 採用方針 |
|---|---|---|
| アナログ入力 | Analog input | AIは受信側、メーカー製品名は出力と取り違えない |
| デジタル出力値 | Digital output value | A/DがPLC側へ返す内部値。AOのアナログ出力と区別 |
| デジタル演算値 | Digital operation value | スケーリング等の処理が有効な場合は生値と分ける |
| 入力信号異常検出・簡易断線検知 | Input signal error detection / Simple disconnection detection | R60AD4公式資料の機種・レンジ条件を添える |

- 画像に使用可：圧力変換器、電流・電圧、PLCの入力、内部値、入力電流、MPa、R60AD4の例。
- 機器は汎用概念図。端子名、実メーカーの型式銘板、実機画面、ロゴ、未検証の配線は描かない。Hero・OGPと本文の挿絵は別用途。本文は圧力変換器・入力ユニット・表示器の関係と、R60AD4の通常レンジに限った中間点（12 mA、内部値16000、0.50 MPa）の換算を示す。

## 現場知識の採否

- サイト方針 F-055（4～20 mAと断線検知）、F-056（アナログ信号のノイズ）を関連候補として照合。機器固有の数値を横断一般化しない。
- F-055はR60AD4のApplication Hの当該機能を独立照合し、同機の条件付きとして一部採用。現場経験談は追加しない。
- F-056は設置環境、信号・動力の配線経路やシールドが候補という位置づけまで。固有機器への固定配線長・固定接地方法やノイズ確定診断は採用しない。
