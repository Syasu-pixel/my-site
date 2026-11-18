# solenoid-valve-troubleshooting-basic 四コマ漫画 01

更新日: 2026-10-06  
状態: **正式採用済み**

## 1. 元記事
- `articles/solenoid-valve-troubleshooting-basic.html`
- https://denkicontrol.com/articles/solenoid-valve-troubleshooting-basic.html

## 2. 技術参照
- `docs/reference-notes/solenoid-valve-troubleshooting-basic.md`

## 3. 共通ルール
- `docs/comic-style-guide.md`
- `docs/comic-character-sheet.md`
- `docs/comic-production-checklist.md`
- `docs/image-generation-rules.md`

## 4. 採用画像
- `assets/images/comics/solenoid-valve-troubleshooting-basic/solenoid-valve-troubleshooting-basic-yonkoma-01.png`
- 画像生成ID: `b3598add-92f4-41b6-9153-af2422f1defa`
- SHA-256: `73e693e933f8fc55d1f38e6b3afbab603fb85b0dcc8901f1a1b2e1abb9dee890`
- size: `2,211,243 bytes`

ユーザー確認により 2026-10-06 に正式採用。

## 5. 採用内容
- 2×2の四コマ構成、青系のDenkicontrol四コマ世界観
- 正本の先輩・後輩キャラクターを維持
- 1コマ目: 電磁弁が動かない状況で、いきなり故障と決めつけず順番に切り分ける導入
- 2コマ目: 電気側として PLC出力、電磁弁の表示、コネクタ・配線をまず確認
- 3コマ目: 空圧側と負荷側として、エア供給・レギュレータ・電磁弁・シリンダの流れを概念図で整理
- 3コマ目の要点: 「電磁弁だけが原因とは限らない。エア供給やシリンダ側でも動かないことがある」
- 4コマ目: 電気側 → 空圧側 → 負荷側の順に切り分けると原因を追いやすいとまとめる
- CTA: 「詳しくは記事で！」

## 6. 技術ガード
- 電磁弁の不動を単一原因へ断定しない
- 型式未確認の端子番号、定格電圧、使用圧力、流量を固定しない
- 四コマ内で通電測定や手動操作などの具体的な危険作業手順を完結させない
- PLC出力・表示・配線など、触らず確認しやすい情報から整理する
- 複動シリンダの概念図では、電磁弁からシリンダ側へ2系統の配管がつながる表現を採用
- 実在メーカーのロゴ、型式銘板、UIを再現しない
- 実作業では設備図面、対象型式のメーカー資料、安全手順、現場ルールを優先する

## 7. シリーズ参照
1. `assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png`
2. `assets/images/comics/sensor-basic/sensor-basic-yonkoma-01-pilot.png`
3. 本作品は電磁弁トラブル回の正式採用例として参照する
