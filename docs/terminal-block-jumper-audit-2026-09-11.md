# 端子台の渡り線・ジャンパー記事 品質監査 2026-09-11

対象: `articles/terminal-block-jumper-basic.html`

## 現状
- 公開URL: https://denkicontrol.com/articles/terminal-block-jumper-basic.html
- GSC直近28日: 64 clicks / 1,239 impressions
- HTTP 200 / indexable / self-canonical / H1=1 / hreflang=3 / image alt欠落=0
- 機械監査上の低優先度課題: structured data未検出、クローラ上のthin-content判定

## 技術監査の重点
1. 渡り線・ジャンパーバーは、電源や同電位の分岐・共通化に使われることがあるが、用途を一律化しない。
2. 専用ジャンパーは対応する端子台シリーズ、ピッチ、極数、アクセサリ仕様などを確認する。
3. ジャンパーの許容電流は部品だけの代表値で一般化しない。Phoenix Contact FBSの公式仕様でも、使用する端子台によってジャンパーの電流値が変わり得る旨が明記されている。
4. 1つのクランプ部へ複数導体を入れる扱いは接続方式・製品仕様で異なるため、一律に推奨しない。
5. 本文の「電源、保護機器、端子台、渡り線・ジャンパー、各負荷の順」は唯一の標準順序のように読めるため、「代表的な見方の一例」へ弱める候補。
6. 既存画像 `hero` / `overview` / `comparison` / `branch-flow` とOGPを、技術誤解・文字潰れ・スマホ可読性・キャラクター統一で確認する。

## 一次資料
- Phoenix Contact, Terminal blocks / CLIPLINE complete
- Phoenix Contact, FBS plug-in bridge technical data
- WAGO, Rail-mount terminal block application tips / Connection Technology

## 方針
全面改稿はしない。既存の固定ヘッダー、3カラム/右レール、先輩・後輩会話、青マーカー、支援導線を維持し、検索上位記事を壊さない最小修正を優先する。Preview確認後に採否判断する。

## 実装修正
- 端子台の用途を一律化しない表現へ調整。
- 専用ジャンパーは端子台シリーズ・ピッチ・極数などの適合確認を明記。
- 許容電流はジャンパー単体の代表値だけで一般化せず、組み合わせる端子台側の仕様確認を明記。
- 1端子への複数導体接続は製品仕様で可否・導体本数・サイズ・締付条件を確認する表現へ調整。
- 「電源→保護機器→端子台→ジャンパー→負荷」は代表的な見方の一例へ弱めた。
- Phoenix Contact / WAGO の公式一次資料導線を記事内に追加。
- 固定ヘッダー、3カラム/右レール、先輩・後輩会話、支援導線、既存画像構成は維持。

## Preview再確認
- 2026-09-11: GitHub Actions `AI Editorial Preview Capture` が `action_required` で開始前停止したため、再トリガーしてCloudflare Pages Preview生成を再確認する。

Preview確認前のため safe to merge: NO
