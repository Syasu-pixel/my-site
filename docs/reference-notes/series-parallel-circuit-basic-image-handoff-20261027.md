# 直列・並列回路 記事刷新｜採用画像引き継ぎ（2026-10-27）
対象：articles/series-parallel-circuit-basic.html
作業ブランチ：preview-refresh-series-parallel-circuit-20261025

ユーザーが会話内で採用した画像は6枚。画像ファイル自体のGitHub登録は**未完了**。以下は登録予定名であり、ファイルが存在することを意味しない。

| 役割 | 登録予定ファイル |
|---|---|
| Hero | series-parallel-circuit-basic-hero.png |
| OGP | series-parallel-circuit-basic-ogp.png |
| 本文1：直列・並列の基本構造 | series-parallel-circuit-basic-overview.png |
| 本文2：直列の電流・電圧 | series-parallel-circuit-basic-series.png |
| 本文3：並列の電流・電圧 | series-parallel-circuit-basic-parallel.png |
| 本文4：合成抵抗 | series-parallel-circuit-basic-resistance.png |

会話コンテナ側に原本6枚とmanifest.json（SHA256・寸法）を含む保全ZIPあり。
GitHub画像アップロードまではファイルパス参照を変更しないこと。

**未完了ゲート**
- 採用された本文画像1に、以前短絡ミスを繰り返した並列図があるため、画像実体を公開前に独立検査。承認済み=無条件の技術合格ではない。
- 採用済み6枚のGitHub画像バイナリ登録・バイトハッシュ検証。
- 編集前本番ベースライン固定（HTMLと共通shell）。
- 検索データ・メーカー一次情報・本文の更新、対応reference-notes更新。
- 対象記事の台帳entry同期、統合生成、publication検証。
- 本番相当Cloudflare PreviewとPC/スマホ・ライト/ダーク確認。
- 管理者Preview目視OK後にのみmainへ反映。

公開・通知・インデックスはすべて未実施。