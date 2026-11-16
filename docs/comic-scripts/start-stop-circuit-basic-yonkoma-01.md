# 起動・停止回路 四コマ漫画 01

状態: 正式採用済み（2026-11-16）。Instagram予約済み、トップ本番公開・配信確認済み。

- 元記事: `articles/start-stop-circuit-basic.html`（本文の変更なし）
- 参照: `docs/reference-notes/start-stop-circuit-basic.md`
- 正本: `assets/images/comics/start-stop-circuit-basic/start-stop-circuit-basic-yonkoma-01.png`
- 元ファイル: start-stop-circuit-basic-yonkoma-01-candidate.png
- 生成ID: exec-4952d100-222d-490f-a464-cc3cc112c81c
- 1254×1254px、2,292,193 bytes
- SHA-256: `a7b9302a6dc4efbafa98c87edc9ea872a6b0c1a996e85fa1a4f21d8e7cfb352e`
- Binary image transfer run 43815801976を使用。採用後の再描画なし。
- シリーズ正本: sensor-basic-yonkoma-01-pilot、yonkoma-chibi-senpai-kouhai-anchor-01。白ヘルメット・青作業服の先輩、水色ヘルメット・グレー作業服の後輩。

## 採用構成

タイトル「押せば必ず動く？」
1. 後輩「起動ボタン、押せば動くんじゃ？」
2. 先輩「起動指令だけでなく、運転許可などの条件も必要なんだ。」
3. 「この例では」運転許可OFF→運転しない／運転許可ON＋起動指令→運転開始。後輩「条件を一つずつ見るんですね！」
4. 後輩「私の起動条件は…朝ごはんです！」先輩「準備は大事だね。」

## 技術ガード

通常運転の概念例。全設備共通の条件とは断定しない。非常停止や安全機能の代用にしない。許可条件のバイパス、出力強制、活線作業を示さない。実機の配線・条件は設備の回路図と仕様に従う。

## 配信・検査

- Instagram: 2026-12-04 10:00 Asia/Tokyo、Metricool post 429636385。既存予約と重複しない次の空き枠。
- トップ既存28作品へ1枚追加し、カウンター29へ。既存記事・ヒーロー・カテゴリは変更しない。
- additional shellは正規生成し、承認済み追加に対応するindex.htmlのsource/candidate基準とinventoryエントリーだけ同期。他エントリー・共通テンプレート・検査は変更しない。

- 公開: PR #1937、merge `1008f7ca72f0d0222047df6c9540a7e622ba8d9d`。Pages run 43819941811 success。
- 本番HTMLの29作品・対象記事リンク・WebP画像配信を確認。公開WebPは1254×1254で再取得し目視確認。GitHub正本とMetricool画像は採用元SHA-256一致、公開WebPは最適化済みのためバイト同一とは扱わない。
- PC/スマホ×明暗・拡大・画像デコードは生成候補で確認。公開後ブラウザの直接アクセスはERR_EMPTY_RESPONSEだったため、本番の確認はHTTP取得と画像目視で実施。
- Instagramは予約であり、実投稿完了とは区別。
