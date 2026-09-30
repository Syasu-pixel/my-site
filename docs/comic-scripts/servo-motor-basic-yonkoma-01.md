# servo-motor-basic 四コマ漫画 01

更新日: 2026-09-30  
状態: **正式採用済み**

## 1. 元記事
- `articles/servo-motor-basic.html`
- https://denkicontrol.com/articles/servo-motor-basic.html

## 2. 技術参照
- `docs/reference-notes/servo-motor-basic.md`

## 3. 共通ルール
- `docs/comic-style-guide.md`
- `docs/comic-character-sheet.md`
- `docs/comic-production-checklist.md`
- `docs/image-generation-rules.md`

## 4. 採用画像
- `assets/images/comics/servo-motor-basic/servo-motor-basic-yonkoma-01.png`

ユーザー確認により 2026-09-30 に正式採用。

## 5. 採用内容
- 第1〜4号と同じ、ちびキャラ先輩・後輩の2×2四コマ構成
- 青系のDenkicontrol四コマ世界観を維持
- 「普通のモータと何が違う？」を入口に、位置決め制御の考え方へつなぐ
- `PLC / モーション → サーボアンプ → サーボモータ` の関係を示す
- エンコーダの位置フィードバックがサーボアンプへ戻る関係を示す
- 同じ位置へ繰り返し止める用途を視覚化
- 4コマ目の「“回す”より“思った通りに動かす”のが強みなんですね！」を理解の締めとして採用
- 詳細は元記事へ誘導する

## 6. 技術ガード
- PLCがサーボモータへ直接駆動電流を出すように描かない
- エンコーダのフィードバック先を曖昧にしない
- 信号名称・配線・制御方式を全サーボ共通仕様として一般化しない
- サーボON、原点復帰、位置決め完了、アラームの論理を機種共通として断定しない
- 実在メーカーの型式・ロゴ・UI・端子番号を再現しない
- 四コマ内で具体的なパラメータ変更・調整手順を完結させない

## 7. シリーズ参照
今後の作品は、シリーズ正本として次を優先する。
1. `assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png`
2. `assets/images/comics/sensor-basic/sensor-basic-yonkoma-01-pilot.png`
3. 本作品はサーボモータ回の採用例として参照する

本作品を新しい最優先アンカーへ昇格させるものではなく、第1号パイロットの世界観を継承した第5号として保存する。

## 8. 転送確認
- 元ファイル SHA-256: `c4b5ef9a84cfc05a61ff1397447ccc37066db1419d86191b90f822126ebcf014`
- 元ファイル size: `2,296,233 bytes`
- GitHub transfer commit: `5c36fbd94ed527459456ea400f2609e2d792fb74`
- Git blob SHA: `5ab7c240e7c073e9e37592632e6172f9f2059ff6`
