# リセット回路 公式参照メモ

確認日：2026-11-23。対象：既存日本語 `articles/reset-circuit-basic.html`。

| 一次資料 | 確認したこと | 適用範囲 |
| --- | --- | --- |
| [三菱電機 はじめてのシーケンサ 入門編（日本語）](https://www.mitsubishielectric.co.jp/fa/service-support/global/satellite/pdf/jy997d41501e.pdf) | 4.1.3、4.1.5〜4.1.7の接点・OUT・並列条件・RST。 | RSTによる保持解除と、掲載図のOUTを区別。図の新規要求判定・優先順位は本記事独自。 |
| [三菱電機 FX5マニュアル公式一覧（日本語）](https://www.mitsubishielectric.co.jp/fa/download/search.page?category1=CPU&kisyu=%2Fplcf&lang=1&mode=manual) | 機種別資料一覧に命令/汎用FUN/汎用FB編 JY997D54701 を掲載。 | 日本語版PDFの現行公開リンクはログイン経由の場合あり。本メモで本文を確認したRSTの根拠は上の公開日本語教材。 |
| [Pilz 日本語FAQ：非常停止が作動された場合](https://www.pilz.com/ja-JP/support/faq/standards/articles/180045) | 非常停止装置のリセット自体で自動再始動させない。 | この記事は実設備の安全回路・復帰手順の設計例ではない。 |

機械が停止した理由・発生の記憶・リセット要求と受付・運転許可と始動指令は別。例は記録の読み方で、通電中の点検、信号強制、安全バイパス、運転再開の操作手順や機器選定を扱わない。
