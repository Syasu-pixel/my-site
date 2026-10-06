# light-curtain-basic 四コマ漫画 01

更新日: 2026-10-06  
状態: **正式採用済み**

## 1. 元記事
- `articles/light-curtain-basic.html`
- https://denkicontrol.com/articles/light-curtain-basic.html

## 2. 共通ルール
- `docs/comic-style-guide.md`
- `docs/comic-character-sheet.md`
- `docs/comic-production-checklist.md`
- `docs/image-generation-rules.md`

## 3. 採用画像
- `assets/images/comics/light-curtain-basic/light-curtain-basic-yonkoma-01.png`
- 画像生成ID: `549b3c0f-102d-49c8-a860-0277199c9857`
- SHA-256: `e77dc3d584f9c2637c1ce43850b99c00e7ca89accfab78e763430fd20643f7ea`
- size: `2,228,423 bytes`
- canvas: `1254 × 1254`
- Git blob SHA: `49c370fdd6ee4f418257f00fa42f755b4a1d2075`

2026-10-06 にユーザー確認で正式採用。

## 4. 採用内容
- 1:1正方形、上部タイトル帯＋2×2四コマ＋下部CTA帯
- 先輩＝説明・整理、後輩＝疑問・気づき
- 1コマ目: 多数の光ビームで検出領域を作り、危険エリアへの侵入を検知する安全機器として導入
- 2コマ目: 検出領域の遮光をライトカーテンが検出し、安全出力を安全リレー・安全PLC等へ伝える流れ
- 3コマ目: 投光器・受光器 → 安全関連制御 → 危険源の停止という基本構成
- 4コマ目: 作業者を守る安全機器としてまとめ、記事へ誘導
- CTA: 「詳しくは記事で！」

## 5. 技術ガード
- 「1本遮光すれば必ず停止」など全機種共通の検出条件に固定しない
- ライトカーテン単体が直接モータ等を遮断する構成に一般化しない
- 遮光検出、安全出力、安全関連制御、危険源停止を区別する
- 安全距離、回り込み防止、意図しない再起動防止など設備全体の安全設計が必要
- 安全機器の無効化・短絡・迂回を促さない
- 実在メーカーのロゴ・型式・UIを再現しない

## 6. シリーズ参照
1. `assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png`
2. `assets/images/comics/sensor-basic/sensor-basic-yonkoma-01-pilot.png`
3. 漏電ブレーカ・電磁弁トラブル・リードスイッチ等の正式採用作とキャラクター・構造を揃える
