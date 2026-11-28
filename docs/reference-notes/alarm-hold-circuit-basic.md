# 異常保持回路：メーカー公式資料照合

確認日：2026-11-28（JST）。MELSEC iQ-F FX5Uを題材にした学習例。M20・M21・M100は説明用であり、実設備の割付・動作確認ではない。

| 出典 | 記事で使用した範囲 |
|---|---|
| [三菱電機「MELSEC iQ-F FX5プログラミングマニュアル（命令／汎用FUN／汎用FB編）」公式配布一覧](https://www.mitsubishielectric.co.jp/fa/products/faspec/download.page?formNm=FX5-_M-D-_FX5UJ%2FDS_3440&kisyu=%2Fplcf&popup=1) | 日本語版JY997D54701-ACの掲載、2026年10月版。配布一覧で版を確認し、動作と対応デバイスの詳細は下記公開英語版で照合。 |
| [三菱電機「MELSEC iQ-F FX5 Programming Manual (Instructions, Standard Functions/Function Blocks)」JY997D55801-AC](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d55801/jy997d55801ac.pdf) | §6.3 印刷pp.145–148。SET/RSTの適用機種とビットデバイス（M）の対象表、SET条件OFF後もビットを保持、RST成立でビットをOFF。 |
| [三菱電機「MELSEC iQ-F Series Basic Course (for GX Works3)」JY997D69701-A](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d69701/jy997d69701a.pdf) | §4.3.2 印刷p.4-11。OUTとSET/RSTの違い。コイルや命令欄の公式教材例。実例のYは転用せず、記事はMのみ。 |
| [三菱電機「GOT2000シリーズ オープンフレームモデル」L08391-B](https://dl.mitsubishielectric.co.jp/dl/fa/document/catalog/got/l08391/l08391b.pdf) | p.5 アラーム機能。画面例で「発生日時」「復旧」「確認」を区別。当該設備の画面・保存期間・復旧条件の保証には使わない。 |

## 教材の境界と図の検証

- 学習図はM20のa接点→SET M100、M21のa接点とM20のb接点を直列→RST M100。同一の通常周期で条件はこの2段の間で一定、他に同じM100を書き込まない、M21は一回分の受け付け済み要求で繰り越さない前提。確認・消音と再通知の実装、安全機能、電源断後保持、実機の変更・配線は扱わない。
- タイムチャートは異常発生→確認・消音→異常条件OFF→別の解除要求。確認時点ではM20/M100を変更しない。模式例で、入力信号の長さ、通知条件やHMIの仕様を示さない。
- 旧記事の異常・表示・通知・リセット・自己保持との違い、診断の接続と関連導線を保持した。旧OR保持例は、共通のリセットb接点で異常中でも消せる構成だったため、本例では異常条件OFFでしか解除段が成立しない構成へ変更。
- 搬送例は架空。既存記録を整理する説明であり、個人の現場体験・確定した故障原因・通電試験ではない。
