# sto-basic 四コマ漫画 01

更新日: 2026-10-06  
状態: **正式採用済み**

## 1. 元記事
- `articles/sto-basic.html`
- https://denkicontrol.com/articles/sto-basic.html

## 2. 技術参照
- `docs/reference-notes/sto-basic.md`

## 3. 共通ルール
- `docs/comic-style-guide.md`
- `docs/comic-character-sheet.md`
- `docs/comic-production-checklist.md`
- `docs/image-generation-rules.md`

## 4. 採用画像
- `assets/images/comics/sto-basic/sto-basic-yonkoma-01.png`
- 画像生成ID: `c018af51-dff5-4b6e-a611-eda0efe92bfa`
- SHA-256: `efa6909102a7943dca2770c36ed7ec5d4bcb7b34c75c2e0647bac7b1946c8ab8`
- size: `2,305,430 bytes`

ユーザー確認により 2026-10-06 に正式採用。

## 5. 採用内容
- 2×2の四コマ構成、青系のDenkicontrol四コマ世界観
- 正本の先輩・後輩キャラクターを維持
- 1コマ目: STOとは何かを「モータがトルクを出せない状態にする安全機能」と説明
- 2コマ目: STOは「どう止まるか」まで制御する機能ではなく、回転中はすぐ止まるとは限らないことを提示
- 3コマ目: STOは電源OFFや機械ブレーキとは別の役割だと比較
- 4コマ目: 慣性で回り続ける場合と、ドライブ側に電源が残る場合があることを注意点として整理
- CTA: 「詳しくは記事で！」

## 6. 技術ガード
- STOを「電源OFF」「ブレーキ」「必ず瞬時停止」と表現しない
- STOは停止過程そのものを制御する機能ではない
- STO作動後も機械条件により惰性停止があり得る
- STOは感電防止用の電源遮断ではなく、ドライブ側に電源が残る場合がある
- 非常停止、安全扉、安全リレー、安全PLC等との具体構成は機種・設計条件により異なるため一般化しすぎない
- 型式固有の端子番号、CH名、PL/SIL/Category、復帰条件、アラーム番号を固定しない
- 実在メーカーのロゴ、UI、型式銘板を再現しない

## 7. シリーズ参照
1. `assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png`
2. `assets/images/comics/sensor-basic/sensor-basic-yonkoma-01-pilot.png`
3. 本作品はSTO回の正式採用例として参照する
