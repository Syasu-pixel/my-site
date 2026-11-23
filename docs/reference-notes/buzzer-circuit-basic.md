# ブザー回路 公式参照メモ

確認日：2026-11-23。対象は日本語の既存記事 `articles/buzzer-circuit-basic.html`。

| 一次資料 | 確認した事項 | 適用・限界 |
| --- | --- | --- |
| [パトライト BMシリーズ](https://online-shop.patlite.co.jp/c/oto/BM) | BM-202 AC/DC 24V、BM-210 AC100V、BM-220 AC220V、2音内蔵。 | 最新の使用・選定条件は個別型式で確認。速さや音圧は本文で指定しない。 |
| [三菱電機 はじめてのシーケンサ 入門編（日本語）](https://www.mitsubishielectric.co.jp/fa/service-support/global/satellite/pdf/jy997d41501e.pdf) | 4.1.3接点・OUT、4.1.5〜4.1.6分岐と直列条件。 | 記号の根拠。掲載ラダーは当記事独自の内部M学習例。 |
| [三菱電機 FX5ユーザーズマニュアル 応用編（日本語）](https://dl.mitsubishielectric.co.jp/dl/fa/members/document/manual/plcf/jy997d54301/jy997d54301ab.pdf) | JY997D54301-AB §1.2のスキャン。 | 同時イベント・保持の優先順位はこの例の前提で、実機の設定や安全機能ではない。 |

ブザー通知、異常状態、安全機能・運転再開、それぞれは別。本文のワーク詰まりは独自の説明例であって現場実績ではない。既存記録と建付けを読む範囲にとどめ、通電中に試す方法や安全リセット手順は扱わない。
