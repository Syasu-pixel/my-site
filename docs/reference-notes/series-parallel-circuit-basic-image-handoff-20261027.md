# 直列・並列回路 記事刷新｜採用画像引き継ぎ（2026-10-27）
対象：articles/series-parallel-circuit-basic.html
作業ブランチ：preview-refresh-series-parallel-circuit-20261025

ユーザーが会話内で採用した画像は6枚。採用画像6枚は2026-10-27に既存 `.github/workflows/binary-image-transfer.yml` を経由しGitHub作業ブランチへ登録済み。原本PNGは改変せず、Git blob SHAを原本バイトから算出してGitHub保存後のSHAと照合した。

| 役割 | 登録予定ファイル |
|---|---|
| Hero | series-parallel-circuit-basic-hero.png |
| OGP | series-parallel-circuit-basic-ogp.png |
| 本文1：直列・並列の基本構造 | series-parallel-circuit-basic-overview.png |
| 本文2：直列の電流・電圧 | series-parallel-circuit-basic-series.png |
| 本文3：並列の電流・電圧 | series-parallel-circuit-basic-parallel.png |
| 本文4：合成抵抗 | series-parallel-circuit-basic-resistance.png |

原本ZIP（ChatGPTライブラリ）：`/電気コントロール/記事刷新/直列並列回路/series-parallel-circuit-adopted-20261027.zip`。

## 画像GitHub配置の検証（2026-10-27）

すべて `assets/images/series-parallel-circuit-basic/` 配下。掲載前に技術図の独立検証は別途必要。

| ファイル末尾 | bytes | SHA-256（原本） | Git blob SHA（原本・GitHub一致） |
|---|---:|---|---|
| hero.png | 1892845 | `40c606d0dd392cbfa8e8b834ed1f7ca66f1f801e16b49c8280fc3a313a24c85f` | `1cbfe0bc1c6258db447cc6234b864d39a44ba95a` |
| ogp.png | 1876459 | `6fd40ae3f294f124b24b0c8a374c69fc4bf10ded61884e125db56b802547f193` | `d8ac24742b90a17b9015465d8188da287e1d179b` |
| overview.png | 1972903 | `447fab59efa762a3d28cdc9860ae8b39dd291722ae32b1b99a5b6cc97200b3d4` | `1b12e594d59737e79bcdcaab6466f78b335b7dd9` |
| series.png | 1914020 | `c92b9c895ef4229600d8aa5e84e92b0b20ddaf3b783e1cc2f0daa83007157a75` | `4f73cdfffe6f3a405b6769e20030982d0d9034c2` |
| parallel.png | 1987633 | `191921ba4ea59b3c7214c76f6c8120ab14f8676e8a3f3191a7d7bd2e09298985` | `77cff5623950c77ab6b8d443a75032ec7fd6f772` |
| resistance.png | 1647638 | `9c441768456afabd03865580b21902b6505be2ebba47fb0494d2b2e76046627d` | `53a1b84e20c936a25de632fa6f67266f22eb6265` |

画像本体の転送に `create_blob`・大容量Base64は使用していない。Firestoreではなく Firestorage 短期共有＋小型JSON依頼＋恒久Workflowを使用し、依頼JSONが自動削除されたことを確認。短期共有URLはログへ転載しない。

**未完了ゲート**
- 採用された本文画像1に、以前短絡ミスを繰り返した並列図があるため、画像実体を公開前に独立検査。承認済み=無条件の技術合格ではない。
- ~~採用済み6枚のGitHub画像バイナリ登録・バイトハッシュ検証。~~ 完了（上記）。
- 編集前本番ベースライン固定（HTMLと共通shell）。
- 検索データ・メーカー一次情報・本文の更新、対応reference-notes更新。
- 対象記事の台帳entry同期、統合生成、publication検証。
- 本番相当Cloudflare PreviewとPC/スマホ・ライト/ダーク確認。
- 管理者Preview目視OK後にのみmainへ反映。

公開・通知・インデックスはすべて未実施。