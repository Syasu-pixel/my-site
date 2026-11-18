# earth-leakage-breaker-basic 四コマ漫画 01

更新日: 2026-10-06  
状態: **正式採用済み**

## 1. 元記事
- `articles/earth-leakage-breaker-basic.html`
- https://denkicontrol.com/articles/earth-leakage-breaker-basic.html

## 2. 技術参照
- `docs/reference-notes/earth-leakage-breaker-basic.md`

## 3. 共通ルール
- `docs/comic-style-guide.md`
- `docs/comic-character-sheet.md`
- `docs/comic-production-checklist.md`
- `docs/image-generation-rules.md`

## 4. 採用画像
- `assets/images/comics/earth-leakage-breaker-basic/earth-leakage-breaker-basic-yonkoma-01.png`
- 画像生成ID: `06f30131-c49f-4a43-9a5b-1cc534a292f4`
- SHA-256: `f0718f8ea9f2a28e25f0db3faea17d2e3f499c445bd4c23be3ce6f90dde7aa0c`
- size: `2,252,079 bytes`
- canvas: `1254 × 1254`

2026-10-06 にユーザー確認で正式採用。

## 5. 採用内容
- 1:1正方形、上部タイトル帯＋2×2四コマ＋下部CTA帯
- 先輩＝説明・整理、後輩＝疑問・気づきの役割を固定
- 1コマ目: 漏電ブレーカとは何かを導入
- 2コマ目: 過電流だけを見る機器ではなく、本来の回路外へ漏れる電流を検出することを整理
- 3コマ目: ZCTを通る各線の電流の合計が正常時はほぼ0、漏電時はバランスが崩れ、その差を検出する考え方を模式図で説明
- 4コマ目: 動作後はすぐ再投入せず、漏電原因や設備状態を確認する重要性をまとめる
- CTA: 「詳しくは記事で！」

## 6. 技術ガード
- 漏電を「地面へ流れる電気」だけに限定しない
- 単相回路だけに見える「行き／帰り」説明へ固定しない
- ZCTを通る導体の電流総和が正常時はほぼ0となり、漏電時の残留電流を検出する考え方を基本にする
- 漏電遮断器と配線用遮断器の役割を完全な二者択一として単純化しない
- 定格感度電流・動作時間・Type AC/A/B等を全機種共通値として固定しない
- TESTボタン、復帰操作、復旧可否を全機種共通の手順として示さない
- 実在メーカーのロゴ・型式銘板・製品UIを再現しない
- 実作業では対象製品の最新資料、設備の安全手順、必要な担当者判断を優先する

## 7. シリーズ参照
1. `assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png`
2. `assets/images/comics/sensor-basic/sensor-basic-yonkoma-01-pilot.png`
3. 本作品は漏電ブレーカ回の正式採用例として参照する
