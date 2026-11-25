# GX Works3のタイマー命令：メーカー資料照合

確認日：2026-11-24（JST）／例示範囲：MELSEC iQ-F FX5U。公開記事内の立て付けは、ONディレー・OFFディレー・積算という挙動の違いと、FX5固有の命令・デバイスの区別。

| 一次資料 | 確認した箇所・記事への反映 |
| --- | --- |
| [三菱電機 MELSEC iQ-F FX5 Programming Manual (Instructions, Standard Functions/Function Blocks), JY997D55801-AC](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d55801/jy997d55801ac.pdf) | 印刷 pp.136–138、§6.3。FX5U適用、OUT/OUTH/OUTHSの100/10/1 msと設定デバイス。通常Tは条件OFFで現在値0、積算STは保持。満了後に計時条件がOFFになってもSTのa接点は導通状態を保持。RSTで現在値・接点をクリア。命令が実行されないと更新も同じとは限らない。 |
| 同資料 §34.2・34.3、印刷 pp.1391–1394 | 標準FBの記号はTON・TOF、入出力はIN・PT・ET・Q。TONはINの立上りを起点にONを遅らせる。TOFはINの立下りでOFFまでの計時を開始し、計時中にINが再びONになるとETはクリア、QはONを維持。PTは各計時起点の値を使用。EN/ENO付き型のENはINと別。 |
| [三菱電機 FX5プログラミングマニュアル（命令／汎用FUN／汎用FB編）JY997D54701](https://www.mitsubishielectric.co.jp/fa/download/search.page?kisyu=%2Fplcf&mode=manual&q=JY997D54701) | 日本語の公式配布案内。改訂版掲載を確認した。上記の命令の細部の照合は公開英語版ACによる。 |
| [三菱電機 マイクロシーケンサ基礎（iQ-F編）JY997D68101-E](https://dl.mitsubishielectric.co.jp/dl/fa/members/document/manual/school_text/jy997d68101/jy997d68101e.pdf) | 索引公開部分 §4.3.3 印刷 pp.4-12〜4-13、通常／積算タイマ、積算の計時再開とRST。メーカー配布PDFはFAメンバーズ認証が必要な場合あり。 |
| [三菱電機 GX Works3用 iQ-F基礎コース（英語版 JY997D69701-A）](https://dl.mitsubishielectric.com/dl/fa/document/manual/plcf/jy997d69701/jy997d69701a.pdf) | §4.3.3、印刷 pp.4-12〜4-13（PDF 87–88）。図の右端は通常タイマ [OUT][T0][K30]、積算タイマ [OUT][ST0][K120] の独立3欄、リセットは [RST][ST0] の2欄。別段の外部出力Yは別記号。記事では標準表示に倣って命令・デバイス・設定値を独立表示し、学習用の積算設定は本文の例に合わせK30。スクリーンショット転載ではなく教材図の描き起こし。 |

## 図の仕様

- TON／TOF：仮の共通INが0–4秒ON、PT=3秒。TONのQは3–4秒、TOFのQは0–7秒ON。値は学習用で実測・実行性能ではない。
- 通常／積算：M0が0–2秒と4–6秒ON、設定3秒、7秒でRST。T0はどちらの区間でも未完了、ST0は中断時の2秒を保持して5秒で満了。満了接点は7秒まで保持する。現在値の折れ線は値の推移の模式化。
- 通常／積算／クリア：M0のa接点を起点とする独立した OUT T0 K30／OUT ST0 K30。別段のM1のa接点とM0のb接点が同時に成立した場合だけRST ST0。K30はこのOUTの100 ms単位で3秒。
- 全図とも学習教材。外部出力／配線、稼働設備への書込みや強制操作、安全関連制御、電源断後の保持を扱わない。実PLC試運転は行っていない。
