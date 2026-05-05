# 画像生成ルール（image generation rules）

## 目的
このドキュメントは、画像生成ルールを「全記事共通ルール」と「記事タイプ別ルール」に分け、画像生成エージェントが以下の記事タイプすべてで迷わずに使えるようにする。

- GX Works3命令語シリーズ
- 制御の基礎記事
- 比較・使い分け記事

---

## A. 全記事共通ルール

### 1) 画像設計の基本
- 画像は用途ごとに別ファイルで作成する（1枚1用途）。
- 1回の画像生成指示では1枚分だけ扱う。
- 他の画像用途を混ぜない（hero / ogp / overview / comparison / flow系を混在させない）。
- 白背景、青ベース、補助色として緑・黄・赤を少し使う。
- 文字は大きく、記事内画像として読みやすくする。
- 1枚に情報を詰め込みすぎない。
- 実在メーカーUI、ロゴ、製品画面は入れない。

### 2) キャラクター統一ルール（全記事共通）
- 新規記事の画像生成では、記事ごとの画像を作る前に、共通キャラクターテンプレートを必ず確認する。
- 参照先：
  - `assets/images/character-templates/senpai-kouhai-character-template.png`
  - `assets/images/character-templates/senpai-kouhai-chibi-character-template.png`
- 先輩・後輩キャラは、既存記事と同じ人物・同じ雰囲気として扱う。
- 毎回別人のように見えるデザイン変更はしない。
- 髪型、ヘルメット、作業服、色味、親しみやすい表情の方向性を維持する。
- 記事テーマに応じてポーズや表情は変えてよい。
- ただし、キャラクターの基本設定は変えない。

### 3) `guide-characters` と `character-templates` の役割違い
- `assets/images/guide-characters/`
  - 記事HTML本文内の会話ブロック、注意ボックス、本文中のキャラ素材として使う。
  - 既存記事内で直接表示される素材。
- `assets/images/character-templates/`
  - 今後の画像生成時に、先輩・後輩キャラの見た目を統一するための参照テンプレート。
  - 画像生成エージェントが雰囲気合わせのために参照する画像。
- 上記2つは混同しない。

### 4) 全記事共通の不採用基準
以下に該当する画像は採用しない。

- 文字が崩れて読めない
- 1枚の用途から外れている
- 複数用途の内容が1枚に混ざっている
- 既存の先輩・後輩キャラと別人に見える
- 記事ごとにキャラの顔・服装・雰囲気が大きく変わっている
- 共通キャラクターテンプレートから大きく外れている
- 実在メーカーUI・ロゴ・製品画面が入っている
- 記事テーマと違う用語や題材が入っている
- 情報量が多すぎて読みづらい
- ちびキャラが大きすぎて本文図解より目立っている
- 先輩と後輩の役割が逆に見える

### 5) 画像生成プロンプトに含める共通考え方
必要に応じて、画像生成プロンプトには以下を含める。

- この画像は何枚中の何枚目かを明記する
- 他の画像の内容を混ぜない
- 共通キャラクターテンプレートを参照して、先輩・後輩キャラの見た目を統一する
- 白背景、青ベース、補助色は緑・黄・赤を少し使う
- 文字は大きく、記事内画像として読みやすくする
- 1枚に情報を詰め込みすぎない
- 必要に応じて親しみやすい会話や吹き出しを入れてよい
- 実在メーカーUIやロゴは入れない


### 6) 本文内ガイドキャラ運用ルール
- 本文内で使う人物キャラクターは `assets/images/guide-characters/` 内の既存キャラを使う。
- 新しい別キャラや別テイストの人物画像を勝手に増やさない。
- 基準キャラ：
  - 先輩キャラ：`assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png`
  - 後輩キャラ：`assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png`
- 先輩は説明・補足・判断の役。
- 後輩は質問・気づき・理解確認の役。
- 会話は「後輩の疑問 → 先輩の説明」または「先輩の説明 → 後輩の理解・質問」の流れにする。
- 会話画像は必ず `div.talk-avatar > img` に入れる。
- 会話欄では `.talk-avatar` / `.talk-avatar img` の既存サイズを使う。
- 注意ボックス用の小さいキャラサイズを会話欄に流用しない。

### 7) 注意ボックス内のキャラ構造ルール
- 注意・補足・安全関連の `note-box` / `danger-box` では、先輩キャラまたは先輩チビキャラを小さく添えてよい。
- 注意ボックス内では、キャラが本文より目立ちすぎないようにする。
- 注意ボックス内では、頭身の高い立ち絵や別テイスト画像を使わない。
- `h3` と `p` は、キャラ右側の同じ `div` 内にまとめる。
- `h3` だけを `caution-character-box` の外に出さない。
- 注意ボックス内のキャラサイズは、既存CSSの `.caution-character-box` / `.caution-character` / `.caution-character img` に従い、新規CSSを勝手に作らない。

基本HTML構造：

```html
<div class="danger-box caution-character-box">
  <div class="caution-character">
    <img src="../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png" alt="注意点を案内する先輩キャラクター">
  </div>
  <div>
    <h3>注意見出し</h3>
    <p>注意本文を入れる。</p>
  </div>
</div>

<div class="note-box caution-character-box">
  <div class="caution-character">
    <img src="../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png" alt="補足する先輩キャラクター">
  </div>
  <div>
    <h3>補足見出し</h3>
    <p>補足本文を入れる。</p>
  </div>
</div>
```

### 8) 先輩チビキャラ画像の運用ルール
使用する画像と用途：

- `assets/images/guide-characters/senpai-chibi-pointing.png`
  - ここ注意
  - よく間違えるポイント
  - 配線・接点・回路の見落とし注意
  - 注意ボックスへ視線誘導したい場合

- `assets/images/guide-characters/senpai-chibi-guide.png`
  - 通常の案内
  - 補足説明
  - 読み進め方のガイド
  - まずここを見ればOK

- `assets/images/guide-characters/senpai-chibi-idea.png`
  - コツ
  - 覚え方
  - ひらめき・理解の助け
  - こう考えると分かりやすい

使用ルール：
- 新しい別キャラを勝手に作らず、まずはこの3枚を使う。
- 記事内では主役にしすぎず、注意・補足・覚え方の補助として小さく使う。
- 1記事あたり1〜3か所までを目安にする。
- 本文の読みやすさを優先する。
- スマホでは大きくしすぎない。
- 背景つき画像やチェック柄背景が焼き付いた画像は使わない。
- 画像を差し替える場合も、同じファイル名・同じ用途を維持する。

---

## B. 記事タイプ別ルール

### 1) GX Works3命令語シリーズ

#### 原則5枚構成
- `slug-hero.png`
- `slug-ogp.png`
- `slug-overview.png`
- `slug-comparison.png`
- `slug-check-flow.png`

#### 役割
- hero
  - 記事トップ用メイン画像
  - 左側にHTML文字が乗る余白を残す
  - 細かい表や長文は入れない
- ogp
  - SNS・共有用サムネイル
  - タイトル大きめ
  - 細かい表や小さい文字は入れない
  - `og:image` / `twitter:image` に使う
- overview
  - 命令語の基本動作説明図
  - データの流れ、値の移動、成立条件などを説明
- comparison
  - 命令同士、通常実行とパルス実行、似た命令の使い分け比較
- check-flow
  - 動かない時の確認手順
  - 例：実行条件 → 元データ → 格納先 → 上書き → データ幅

#### 標準配置
- hero：`.article-hero::before`
- ogp：`og:image` / `twitter:image`
- overview：最初の基本説明セクション
- comparison：使い分け・比較セクション
- check-flow：確認手順・トラブルシュートセクション

#### 生成順
1. hero
2. ogp
3. overview
4. comparison
5. check-flow

### 2) 制御の基礎記事

#### 基本構成（原則5枚。記事テーマにより4〜5枚で調整可）
- `slug-hero.png`
- `slug-ogp.png`
- `slug-overview.png`
- `slug-comparison.png`
- `slug-flow.png`

#### 5枚目はテーマに応じて柔軟化
5枚目の役割・ファイル名は記事テーマに応じて変更してよい。

- `slug-wiring-flow.png`
- `slug-power-flow.png`
- `slug-vacuum-flow.png`
- `slug-operation-flow.png`
- `slug-check-flow.png`

#### 役割例
- hero：記事トップ用
- ogp：SNS・共有用
- overview：機器や仕組みの基本説明図
- comparison：あり/なし、違い、使い分け、構成差の整理
- flow系：配線の流れ、電源の流れ、真空の流れ、動作手順、確認の流れ など

### 3) 比較・使い分け記事

#### 基本構成（比較画像中心。原則5枚、記事テーマにより4〜5枚で調整可）
- `slug-hero.png`
- `slug-ogp.png`
- `slug-overview.png`
- `slug-comparison.png`
- `slug-check-flow.png`

または、記事内容に応じて5枚目を柔軟化してよい。

- `slug-selection-flow.png`
- `slug-difference-flow.png`
- `slug-check-flow.png`

#### 役割例
- hero：比較テーマを一目で伝える
- ogp：共有用サムネ
- overview：両者の概要説明
- comparison：左右比較・表比較で違いを整理
- flow系：選び方、確認順、見分け方、使い分けの判断手順を説明

---

## 記事タイプごとの適用範囲
- GX Works3命令語シリーズ専用ルールは、命令語記事に適用する。
- 制御の基礎記事ルールは、機器解説・基本構成・仕組み解説記事に適用する。
- 比較・使い分け記事ルールは、違い・選び方・比較整理の記事に適用する。
- 共通ルールは、すべての記事タイプに適用する。

---

## 補足（既存ルールの扱い）
- 既存の命令語シリーズ用ルールは活かしつつ、全記事共通と誤読される内容は「A. 全記事共通ルール」へ整理する。
- 既存内容の重複は削除しすぎず、運用時に参照しやすい構造を優先する。
