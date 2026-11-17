# 押している間だけ動く回路 四コマ漫画 01

状態: 正式採用済み（2026-11-16）。Instagram予約済み、トップ本番公開・配信確認済み。

- 元記事: `articles/while-pressed-circuit-basic.html`（本文の変更なし）
- 参照: `docs/reference-notes/while-pressed-circuit-basic.md`
- 正本: `assets/images/comics/while-pressed-circuit-basic/while-pressed-circuit-basic-yonkoma-01.png`
- 元ファイル: while-pressed-circuit-basic-yonkoma-01-candidate.png
- 生成ID: exec-9e51673e-ce91-4be5-9885-a1447112304d
- 1254×1254px、2,185,162 bytes
- SHA-256: `d552090fb5191e15dab44acc3e023c79115a3247df5b1dc44552ca681a17f667`
- Binary image transfer run 43834002041を使用。採用後の再描画なし。
- シリーズ正本: sensor-basic-yonkoma-01-pilot、yonkoma-chibi-senpai-kouhai-anchor-01。白ヘルメット・青作業服の先輩、水色ヘルメット・グレー作業服の後輩。

## 採用構成

1. 後輩「離したら消えた！壊れたんですか？」
2. 先輩「今回は押している間だけON。自己保持は入れていないよ。」
3. 自己保持なしの例。押している間はランプON、離すとOFF。
4. 後輩「私のやる気も、ほめられてる間だけONです！」先輩「そこは保持してほしいな。」

## 技術ガード

自己保持を入れない基本例であり、すべてのモーメンタリ押しボタンが離すと運転停止するとは断定しない。通常操作回路を安全機能の代用にしない。実機は設備の回路図と仕様を確認する。

## 配信・検査

- Instagram: 2026-12-05 10:00 Asia/Tokyo、Metricool post 429749472。次の空き枠で予約し、PENDINGと画像のSHA-256一致を読み戻し確認。実投稿は未実施。
- トップ既存29作品へ1枚追加し、カウンター30へ。記事本文・既存ヒーロー・カテゴリは変更しない。
- additional shell正規生成と16ページ再生成検査に合格。変更は承認された追加のindexエントリーとinventoryだけ。共通テンプレート・検査の改変なし。
- 変更前main: b6e1f7732bd8a9077d7d6e1f9c1cfbda45f8039f。2026-11-16取得の本番トップSHA-256: 8ad1841d40a8b5cbe5ac3dcf4197acfa9124bc0b7dc48729fc3551c90bf6f4de。生成候補との差は配信時画像最適化のURL変換。
- ローカルChromium起動は環境制約、別ブラウザからローカルPreviewへは接続不可。GitHub Actionsの生成・4幅ブラウザ検証を確認し、公開配信の確認は別途記録する。

## 本番公開結果（2026-11-16）

- 管理者のトップ本番公開承認後、PR #1939を正規マージ。merge `bf3a3a170236df7a6be64137a540f558cd7091ac`。Pages run 43841268201 success。
- Additional page shared shells run 43835379789 success（16ページ×4幅、明暗を含む既設検査）。寄付CSS限定の比較は承認済みindex追加を許容しない用途不一致で失敗。検査・共通部品は変更していない。
- 本番HTML30作品・採用画像・元記事導線・カウンターを再取得確認。配信WebPは1254×1254を目視確認（最適化後なので原本とバイト同一とは扱わない）。
- 本番ブラウザでも手動切替、対象作品の通常表示から拡大、16 / 30表示、記事リンクを確認。
- Instagramは予約完了と実投稿を区別し、実投稿は未確認。
