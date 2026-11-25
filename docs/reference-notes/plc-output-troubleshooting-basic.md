# PLC出力がONしない時に見る順番｜公式資料確認

- 対象: `articles/plc-output-troubleshooting-basic.html`
- 公式資料確認日: 2026-11-21
- メーカー: 三菱電機（実在型式は境界を説明する例であり、記事のイラストは同社製品・端子配置を再現しない）

| 公式資料 | 確認・使用した範囲 |
| --- | --- |
| [FX5U-32MT/DS 仕様](https://www.mitsubishielectric.co.jp/fa/products/faspec/detail.page?category=ex&formNm=FX5-_M-D-_FX5U-32MT%2FDS_3331&id=spec&kisyu=%2Fplcf) | シンク出力、出力動作表示、外部電源、ON時電圧降下、開路もれ電流。 |
| [FX5U-32MT/DSS 仕様](https://www.mitsubishielectric.co.jp/fa/products/faspec/detail.page?category=ex&formNm=FX5-_M-D-_FX5U-32MT%2FDSS_3332&id=spec&kisyu=%2Fplcf) | ソース出力、出力動作表示、外部電源、ON時電圧降下、開路もれ電流。 |
| [FX5U-32MR/ES 仕様](https://www.mitsubishielectric.co.jp/fa/products/faspec/detail.page?formNm=FX5-_M-E-_FX5U-32MR%2FES_3342&kisyu=%2Fplcf&popup=1) | リレー出力、外部電源で負荷回路を扱うこと。 |
| [MELSEC iQ-F FX5S/FX5UJ/FX5U/FX5UC ユーザーズマニュアル（ハードウェア編）SH-082451-L](https://dl.mitsubishielectric.co.jp/dl/fa/members/document/manual/plcf/sh082451/sh082451l.pdf) | §5.9 端子配列とコモン識別、§15.6 出力配線、各出力方式の役割。関連世代は対象装置に適用される版を確認。 |
| [三菱電機 MELSEC iQ-F FX5U CPU スクールテキスト JY997D68101-E](https://dl.mitsubishielectric.co.jp/dl/fa/members/document/manual/school_text/jy997d68101/jy997d68101e.pdf) | §4.2のa/b接点とOUT、§4.3.1のa/b接点とOUTおよび直列の成立条件を照合。本文の図はX0・M0・M1・Y0を例にしたオリジナルの一段。実設備のプログラム、安全回路、I/O端子の指定ではない。 |

## 記事内で断定しないこと

- 表示LEDから電源・負荷の正常や安全状態は断定しない。リモートI/O等の表示・端子・割付は対象機種ごとに確認。
- COMの電位・端子番号・負荷電源の基準は一般化しない。信号の確認範囲のみを概念化し、導線・測定器の接続・現地測定操作を教える図ではない。
- 通常PLCの表示は安全状態の証明に使わず、試験のための強制・短絡・バイパスは行わないよう本文に記載。
