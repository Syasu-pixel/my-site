# GX Works3 クロスリファレンス：公式参照と教材範囲

公式資料確認：2026-11-23 JST。対象はオフラインの学習例。使用環境に対応する公式マニュアルを優先する。

- [三菱電機 GX Works3 オペレーティングマニュアルの配布案内 SH-081214](https://www.mitsubishielectric.co.jp/fa/download/search.page?kisyu=%2Fplceng&mode=manual&q=SH-081214)。公式一覧で日本語Ver.AU（2026-10）と確認したが、ログインが必要で本体は未読。未読の版を機能根拠にしない。
- [三菱電機 GX Works3 Operating Manual SH-081215ENG-AS](https://dl.mitsubishielectric.com/dl/fa/document/manual/plc/sh081215eng/sh081215engas.pdf)。公開英語版§9.6、p576–582。プロジェクト内のデバイス・ラベル、検索対象/範囲、用途を示す表示項目、行からの移動、ローカルラベル、グローバルラベルに割り付けたデバイスを含める設定、ラベル定義の割付デバイス完全一致、表示フィルターを確認。D0/D0Z0は割付デバイス名からラベル定義を探す場合だけの限定例。間接指定や参照の見落としを全検索へ一般化しない。公開英語版§14.4、p785はデバイス/ラベルの現在値の確認。
- [三菱電機 MELSEC MXコントローラ プログラミングテクニックガイド BCN-89999-9684-A](https://www.mitsubishielectric.co.jp/fa/document/techlib/mxc/bcn-89999-9684/bcn899999684a.pdf)。未使用ラベルの節にある日本語の「検索/置換」→「クロスリファレンス」の表記を照合。MX以外に特有の機能を一般化しない。
- [三菱電機 マイクロシーケンサ基礎（iQ-F編）JY997D68101-E](https://dl.mitsubishielectric.co.jp/dl/fa/members/document/manual/school_text/jy997d68101/jy997d68101e.pdf) §4.3.1、p4-7～4-8：a接点とOUT、直列条件。§7.1、p7-2：MOVの転送元/先。図は自作教材で画面・図の転載なし。第1段はM0とM1から通常OUT M10、第2段はM10とM2からOUT M20。物理I/O、外部配線、運転許可、実機変更は含まない。
- 調査元の版と検索範囲を先に確認。結果一覧を実行順・記録・実機に通じた読み出し・依存先完全性・安全確認の証拠にしない。分離したGOTプロジェクトや別通信装置は、必要に応じ別資料で確認する。
- iQ-F教材はメーカーPDFの索引本文該当箇所で照合。通常のダウンロード経路ではFAメンバーズへのログインを求められる場合がある。
