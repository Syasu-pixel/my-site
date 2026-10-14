# plc-basic 公式参照メモ

## 参照した公式元
- オムロン
  - https://www.fa.omron.co.jp/guide/technicalguide/26/283/
  - https://www.fa.omron.co.jp/guide/technicalguide/26/129/
- 三菱電機FA
  - https://www.mitsubishielectric.co.jp/fa/learn/el/eln/plc/index.html
  - https://www.mitsubishielectric.co.jp/fa/products/cnt/plceng/smerit/gx_works3/
  - https://www.mitsubishielectric.co.jp/fa/download/search.do?mode=keymanual&q=GX+Works3

## 確認対象資料
- オムロン「プログラマブルコントローラ 概要」：PLCの基本構成、入力・出力、ラダーの一般的な考え方
- オムロン「プログラマブルコントローラ 用語解説」：I/Oリフレッシュ、サイクルタイム、処理周期
- 三菱電機FA「シーケンサ MELSEC FA eラーニング」：シーケンサ入門・基礎、GX Works3学習導線
- 三菱電機FA「MELSOFT GX Works3」：GX Works3の位置付け、対象システム
- 三菱電機「GX Works3 オペレーティングマニュアル SH-081214」：GX Works3固有事項の確認先

## 確認日
- 2026-10-06

## 記事で使う範囲
- PLCは入力機器から状態を受け、ユーザプログラムで定めた条件に従って出力側を制御する基本構成
- 入力／PLC／出力の関係
- 入力取り込み、プログラム実行、出力更新を繰り返す基本的な処理イメージ
- I/Oリフレッシュ、サイクルタイムの基本概念
- リレー回路では配線で条件を構成し、PLCでは入出力配線とプログラムで制御条件を構成する初心者向け比較
- ラダーを入力、制御条件、出力の流れで追う基本
- GX Works3は三菱電機MELSEC向けエンジニアリングソフトウェアとして一般論と区別

## 断定しない範囲
- PLCのI/O更新方式・タイミングは機種や設定で異なるため、全PLCが同一方式とは断定しない
- スキャンが速いだけで設備全体が必ず同じ速度で応答するとは断定しない
- 実際の応答にはI/O応答、プログラム、通信、接続機器、機械側応答等が関係する
- COM=0V等、配線方式・電源方式・入出力回路で変わる事項をPLC一般仕様として固定しない
- X/Y/M/T等のデバイス表現はメーカー・機種固有の文脈と区別する
- PLC出力がモータ等の負荷を常に直接駆動するとは表現せず、接触器・ドライバ・インバータ等を介する構成を考慮する

## 画像ルール
- 実在メーカーのロゴ、型式銘板、製品UIを再現しない
- Heroは文字なし、OGPは採用済みタイトル構成を使用
- 本文図は一般概念図とし、メーカー固有デバイス番号を決め打ちしない
- 本文4枚はライトボックス対象とする

## 採用画像
- Hero: plc-basic-hero.png
- OGP: plc-basic-ogp.png
- 本文1 基本構成: plc-basic-overview.png
- 本文2 スキャン: plc-basic-scan.png
- 本文3 リレー回路とPLC: plc-basic-relay-comparison.png
- 本文4 ラダーを見る基本: plc-basic-ladder.png

## 転送検証記録
- 採用画像は前チャットで1枚ずつ管理者確認済み。再生成しない。
- GitHub配置は .github/workflows/binary-image-transfer.yml の検証付き転送のみを使用する。
- 旧検証ブランチ preview-plc-basic-refresh-20261006 では、OGP / Hero / 本文1 / 本文2 が正規Workflow経由で配置済み。ただし同ブランチは記事HTML削除検証を含むため最終成果物には使用しない。
- 最終ブランチ preview-plc-basic-final-20261006 へは、正式原本6枚を改めて正規Workflowで配置してからpublicationを生成する。
- 本文3 / 本文4を含む最終採用原本はProject Libraryで確認済み。本文4は「PLCラダー図で学ぶ入力・制御・出力.png」（2026-10-06 10:55 UTC、1,943,116 bytes）。
- bytes / SHA-256 / Git blob SHA は最終ブランチへの6枚の正規転送完了後に追記する。
