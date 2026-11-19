# load-cell-basic 公式参照メモ

## 参照した公式元
- A&D（エー・アンド・デイ）
  - https://www.aandd.co.jp/products/loadcell/introduction/cell_intro01.html
  - https://www.aandd.co.jp/products/loadcell/introduction/cell_intro02.html
  - https://www.aandd.co.jp/products/loadcell/introduction/cell_intro03.html
  - https://www.aandd.co.jp/products/loadcell/introduction/cell_intro06.html
- 共和電業
  - https://product.kyowa-ei.com/learn/transducers/loadcell_basic
  - https://product.kyowa-ei.com/products/accessories/type-er
- ミネベアミツミ
  - https://product.minebeamitsumi.com/product/category/mcd/loadcell/lc_accry/index.html

## 確認対象マニュアル・資料
- A&D「ロードセル入門」：ロードセルの概要、ひずみゲージ式の原理、用語・仕様、選定の考え方
- 共和電業「ロードセルの基礎」およびロードセル周辺アクセサリ情報：荷重測定、取付・横荷重対策の考え方
- ミネベアミツミ ロードセル関連公式情報：ロードセルと指示計を組み合わせる際の校正・周辺機器の考え方

## 確認日
- 2026-10-01

## 記事で使う範囲
- ロードセルは力・荷重を電気信号へ変換するセンサであること
- 一般的なひずみゲージ式ロードセルの基本原理
- 起歪体、ひずみゲージ、ホイートストンブリッジの役割
- 定格容量、定格出力、mV/V、印加電圧などの基本用語
- ロードセルの微小信号を指示計・アンプ／変換器等で処理し、表示・判定・PLC制御等へ利用する基本構成
- タンク・ホッパー計量、重量検査、押付け・圧入・圧着等の荷重測定
- 荷重方向、偏荷重、取付剛性、干渉、過負荷・衝撃への注意
- ゼロ・スパンおよび校正の一般的な考え方

## 断定しない範囲
- 定格出力、推奨印加電圧、許容過負荷等の具体値は製品ごとに異なるため一般化しない
- 4-20mA、0-10V、通信等の出力方式は接続する指示計・アンプ／変換器の仕様による
- ロードセルの正しい荷重方向・取付方法は構造・製品ごとに異なるため、メーカー仕様・取付要領を優先する
- ゼロ・スパンの具体的な操作手順は指示計・アンプ／変換器ごとの取扱説明書を優先する
- ロードセル生信号を一般的なPLCアナログ入力へ直接接続できるとは一般化しない

## 画像ルール
- 実在メーカーUIを完全再現しない
- メーカーロゴ、シリーズロゴ、型式銘板を入れない
- 機器は汎用的な概念図として描く
- 荷重方向は「メーカー指定方向を守る」とし、全ロードセルで中央鉛直が正解とは表現しない
- 指示計・アンプ／変換器からPLCへの信号方式は例示に留める

## 公式用語・採用表記
| 種別 | 日本語表記 | 記事・画像での採用方針 |
|---|---|---|
| センサ | ロードセル | 力・荷重を電気信号へ変換するセンサとして説明 |
| 構造 | 起歪体 | 荷重によってわずかに変形する部分 |
| 検出素子 | ひずみゲージ | 起歪体のひずみに伴う抵抗変化を検出 |
| 回路 | ホイートストンブリッジ | 抵抗変化を微小な電圧変化として取り出す基本回路 |
| 仕様 | 定格容量 | 仕様を保って測定できる最大荷重として説明 |
| 仕様 | 定格出力 / mV/V | 励起電圧との関係を含めて初心者向けに説明 |
| 周辺機器 | 指示計・アンプ／変換器 | 微小信号を表示・制御で扱いやすく処理する機器群として一般化 |

## 画像内で使用してよい表記
- ロードセル
- 荷重
- 起歪体
- ひずみゲージ
- ホイートストンブリッジ回路
- 微小な電圧信号
- 指示計・アンプ／変換器
- PLC
- 4-20mA / 0-10V / 通信など（例示としてのみ）

## 画像内で使用しない表記
- 実在メーカー名・ロゴ
- 実在PLCシリーズ名
- 特定製品の型式
- 全機種共通と誤認させる固定仕様値

## メモ
- 今回は既存記事の全面刷新。本文確定後に OGP 1枚、Hero 1枚、本文図4枚を管理者確認のうえ採用。
- 本文図は「基本原理」「信号の流れ」「代表的な使用例」「取付時の注意」の4用途。

## 採用画像・転送検証記録

| 用途 | ファイル | bytes | SHA-256 | Git blob SHA |
|---|---|---:|---|---|
| OGP | load-cell-basic-ogp.png | 1834233 | 309c2277ecefa8ed838f484857a308b41ed89555c0fc50986d5a91015be80887 | f42d83cb3c78e3a559aad40b09a822caaf83147c |
| Hero | load-cell-basic-hero.png | 1676220 | 5a6128c5834646e8071a6dcacea6222440b2654c8907fcbd48749b59950339d4 | 4d01496b220dea9e9bae5116a085ead36c2a93ab |
| 本文1 基本原理 | load-cell-basic-principle.png | 2036584 | bfcc4cd20afafa104666d13304a2001dac3311ec63790e2186a6614d60a26ff5 | 61be5278ff4dec5650a2becf6b24bb9cfc74fe4f |
| 本文2 信号の流れ | load-cell-basic-signal-flow.png | 2074855 | 621aa28dffd03f61dcc280b0c5e8d75e4f2d32274491623d819c6e7623588e70 | 53ce4aa82978667eeaf500e70d90f90f65c66dae |
| 本文3 使用例 | load-cell-basic-applications.png | 2161382 | 81d6d0f4f1864c104d0de5fa1c5f6f11bd0fc9cf64f3b1995e6e7e2dbd88f4bf | 0e1d4127a7ecf04b96ea2de0722b9264e1245045 |
| 本文4 取付注意 | load-cell-basic-installation.png | 2089993 | 621783331a791c4e83f73ed6c72ff2ba9831d3360a4f8bf9ae9f36941dfbdd38 | a618172fa0da03bc99aa47eed329b4a0f11ef462 |

- 正式な恒久 Workflow `.github/workflows/binary-image-transfer.yml` を使用。
- Preview branch への保存後、6ファイルすべてで byte size 一致を確認。
- OGP / Hero / 本文図の用途を分離し、本文4枚にはライトボックス対象クラスを付与。
