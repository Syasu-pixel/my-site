# ジョグ運転回路：技術参照メモ

- 対象：電気コントロールのジョグ運転回路の日本語記事。確認日：2026-11-19（日本時間）。
- [三菱電機 MR-J4-A サンプル画面説明書](https://www.mitsubishielectric.co.jp/fa/document/others/got/conn_j002/MITSUBISHI_MR-J4-A_V_Ver3a_J.pdf)：JOG運転画面の押下と加減速時定数について、対象機種の操作例として確認。一般的な停止距離や時間を保証する例ではない。
- [オムロン 非常停止の安全機能・PL評価事例](https://www.fa.omron.co.jp/product/special/safetynavi/design/pl_case/emergency_stop/)／[リセットの使い分け](https://www.fa.omron.co.jp/product/special/safetynavi/tips/safety_principle_03/)：通常運転の条件と機械安全機能を区別し、リセットや条件復帰で予期しない起動を防ぐ考え方を確認。
- 掲載するラダーは練習用表示灯を操作する概念例。通常運転の指令OFFと設備が実際に停止したことは別で、配線設計、安全回路、実機の停止・再起動手順は範囲に含めない。
