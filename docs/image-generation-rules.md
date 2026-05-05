# 画像生成ルール（image generation rules）

## ヒーロー画像の方針
- 通常記事では、ヒーロー画像をOGP兼用してよい。
- GX Works3命令語シリーズでは、ヒーロー画像とOGP画像を分離する。
- 左側にHTML文字が乗る余白を残す。
- 記事テーマが一目で分かる軽いタイトル要素は入れてよい。
- 本文図や細かい表はヒーローに入れない。

## 禁止・制限事項
- 実在メーカーUIやロゴは入れない。

## ファイル運用ルール
- 画像は用途ごとに別ファイルで作成する。
  - 例：ヒーロー画像、本文補助画像、図解画像など
- 回路記事では必要に応じてラダー例画像を作る。
- フォルダ名は記事スラッグと合わせる。

## 品質チェック
- OGPサムネイルとして縮小表示したときも主題が判読できるか。
- テキスト重畳領域（左側余白）が確保されているか。
- ロゴ・商標に該当する要素が混入していないか。

## 人物キャラクター / 画像生成時の参照ルール
- 記事画像や会話用キャラクター画像を生成・追加する時は、既存の会話キャラクター画像を基準にする。
- 参照元フォルダ：`assets/images/guide-characters/`
- 特に参照する画像：
  - `assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png`
  - `assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png`
- 新しいキャラクターを勝手に作らない。
- 既存の「先輩役」「新人役」の雰囲気を基準にする。
- 顔立ち、ヘルメット、作業服、やさしい解説イラスト風の雰囲気を大きく変えない。
- 表情やポーズのバリエーションを作る場合も、同じ2人の差分として作る。
- 別人に見えるキャラクター画像は採用しない。
- 会話画像を増やす場合は、既存キャラの差分として分かるファイル名にする。
- ヒーロー画像に人物を入れる場合も、既存の先輩役キャラクターの雰囲気に寄せる。
- 記事ごとに人物の顔・服装・雰囲気がぶれないようにする。



## 本文内ガイドキャラ運用ルール

本文内で使う人物キャラクターは、`assets/images/guide-characters/` 内の既存キャラを使う。新しい別キャラや、別テイストの人物画像を勝手に増やさない。

基準キャラ：
- 先輩キャラ：
  - `assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png`
- 後輩キャラ：
  - `assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png`

会話欄の基本：
- 先輩は説明・補足・判断の役
- 後輩は質問・気づき・理解確認の役
- 会話は「先輩の説明 → 後輩の理解・質問」または「後輩の疑問 → 先輩の説明」の流れにする
- 先輩は左配置、後輩は右配置を基本にする
- 会話画像は必ず `div.talk-avatar > img` に入れる
- 会話欄では `.talk-avatar` / `.talk-avatar img` の既存サイズを使う
- 注意ボックス用の小さいキャラサイズを、会話欄には流用しない

注意ボックスの基本：
- 注意・補足・安全関連の `note-box` / `danger-box` では、先輩キャラを小さく添えてよい
- 注意ボックス内では、キャラが本文より目立ちすぎないようにする
- 注意ボックス内では、頭身の高い立ち絵や別テイスト画像を使わない
- 注意ボックス内のキャラは「補助役」として扱い、本文の主役にしない

注意ボックスのHTML構造：
- `h3` と `p` は、キャラ右側の同じ `div` 内にまとめる
- `h3` だけを `caution-character-box` の外に出さない

基本構造：

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

注意ボックス用ちびキャラCSS基準：

```css
.caution-character-box{
  display:grid;
  grid-template-columns:42px minmax(0,1fr);
  gap:10px;
  align-items:center;
}

.caution-character{
  display:flex;
  align-items:center;
  justify-content:center;
}

.caution-character img{
  width:36px;
  height:auto;
  display:block;
  object-fit:contain;
}

@media (max-width:900px){
  .caution-character-box{
    grid-template-columns:36px minmax(0,1fr);
    gap:8px;
  }

  .caution-character img{
    width:30px;
  }
}
```

## 先輩チビキャラ画像の運用ルール

記事内の注意喚起・補足・覚え方の補助には、採用済みの先輩チビキャラ画像を優先して使う。

使用する画像：
- `assets/images/guide-characters/senpai-chibi-pointing.png`
- `assets/images/guide-characters/senpai-chibi-guide.png`
- `assets/images/guide-characters/senpai-chibi-idea.png`

用途：
- `senpai-chibi-pointing.png`
  - 「ここ注意」
  - よく間違えるポイント
  - 配線・接点・回路の見落とし注意
  - 本文中で注意ボックスへ視線誘導したい場合

- `senpai-chibi-guide.png`
  - 通常の案内
  - 補足説明
  - 読み進め方のガイド
  - 「まずここを見ればOK」のような案内

- `senpai-chibi-idea.png`
  - コツ
  - 覚え方
  - ひらめき・理解の助け
  - 「こう考えると分かりやすい」のような補足

使用ルール：
- 新しい別キャラを勝手に作らず、まずはこの3枚を使う。
- 記事内では主役にしすぎず、注意・補足・覚え方の補助として小さく使う。
- 1記事に入れすぎない。基本は1〜3か所までを目安にする。
- 本文の読みやすさを優先し、キャラが本文やボタンと重ならないようにする。
- スマホではキャラを大きくしすぎない。
- 背景つき画像は使わず、透過PNGのキャラ単体画像を使う。
- チェック柄背景や白い四角背景が焼き付いている画像は使わない。
- 画像を差し替える場合も、同じファイル名・同じ用途を維持する。


## GX Works3命令語シリーズの5枚画像ルール

### 基本方針（5枚を分離して作成）
- GX Works3命令語シリーズでは、原則として以下の5枚を**別ファイル**で作成する。
  - `slug-hero.png`
  - `slug-ogp.png`
  - `slug-overview.png`
  - `slug-comparison.png`
  - `slug-check-flow.png`
- 1枚に5枚分の内容をまとめない。
- 1回の画像生成では1枚の用途だけを作る。
- 他4枚の内容を混ぜない。
- 実在メーカーUIやロゴは入れない。
- 既存の先輩・後輩キャラの雰囲気を維持する。
- 文字は大きく、記事内画像として読みやすくする。
- 白背景、青ベース、補助色に緑・黄・赤を少し使う。
- 1枚に情報を詰め込みすぎない。

### 5枚それぞれの役割
- `slug-hero.png`
  - 記事トップ用のメイン画像。
  - 先輩・後輩キャラ、記事テーマ、命令語の象徴を大きく見せる。
  - 左側にHTML文字が乗る余白を残す。
  - 細かい表・長い文章・5枚分の要素を入れない。
- `slug-ogp.png`
  - SNS・リンク共有用サムネイル。
  - タイトルを大きく、記事テーマが一目で分かる構図にする。
  - 細かい表や小さい文字を入れない。
  - `og:image` / `twitter:image` に指定する。
- `slug-overview.png`
  - 本文内の基本説明図。
  - 命令語の基本動作、データの流れ、ON/OFFや値の移動などを図で説明する。
  - 記事本文の最初の説明セクションに対応する。
- `slug-comparison.png`
  - 使い分け・違いを整理する画像。
  - 例：ADDとSUB、MOVとMOVP、通常実行とパルス実行など。
  - 表や左右比較の形にして、読者が違いを見比べやすくする。
- `slug-check-flow.png`
  - うまく動かない時の確認手順画像。
  - 実行条件 → 元データ → 格納先 → 上書き → データ幅 など、順番に確認できる流れにする。
  - troubleshooting / check flow として使う。

### HTML内の配置対応（GX Works3命令語シリーズ標準）
- hero：`.article-hero::before` の背景画像として使う。
- ogp：`og:image` / `twitter:image` に指定する。必要に応じて、まとめセクションの画像にも使う。
- overview：最初の基本説明セクションに入れる。
- comparison：使い分け・違い・比較セクションに入れる。
- check-flow：確認手順・トラブルシュートセクションに入れる。

### 共通キャラクターテンプレート参照ルール
- 新規記事の画像生成では、記事ごとの画像を作る前に、必ず以下の共通キャラクターテンプレートを確認する。
  - `assets/images/character-templates/senpai-kouhai-character-template.png`
  - `assets/images/character-templates/senpai-kouhai-chibi-character-template.png`
- キャラクター統一ルール：
  - 先輩・後輩キャラは、共通キャラクターテンプレートを基準にする。
  - 既存記事と同じ人物・同じ雰囲気として扱う。
  - 毎回別人のように見えるデザイン変更はしない。
  - 髪型、ヘルメット、作業服、色味、親しみやすい表情の方向性を維持する。
  - 記事テーマに応じてポーズや表情は変えてよい。
  - ただし、キャラクターの基本設定は変えない。

### 通常キャラとちびキャラの使い分け
- hero / ogp：通常立ち絵テンプレートを優先して参照する。
- overview / comparison / check-flow：内容に応じて通常キャラまたはちびキャラを使ってよい。
- ちびキャラは、補足説明、注意点、ポイント整理、吹き出し説明に向いている。
- 記事内画像では、少なくとも1枚はちびキャラを使うことを推奨する。
- ただし、無理に入れて図解の分かりやすさを落とさない。

### guide-characters と character-templates の役割違い
- `assets/images/guide-characters/`
  - 記事HTML内の会話ブロック、注意ボックス、本文中のキャラ素材として使う。
  - 既存記事内で直接表示されるキャラクター画像。
- `assets/images/character-templates/`
  - 今後の画像生成時に、先輩・後輩キャラの見た目を統一するための参照テンプレート。
  - 画像生成エージェントがキャラクターの雰囲気を合わせるために見る画像。
- 両方を混同しない。

### 不採用基準（画像生成時）
- 以下に該当する画像は採用しない。
  - 文字が崩れて読めない
  - 5枚分の内容が1枚に混ざっている
  - 1枚の用途から外れている
  - 既存の先輩・後輩キャラと別人に見える
  - 記事ごとにキャラの顔・服装・雰囲気が大きく変わっている
  - 共通キャラクターテンプレートから大きく外れている
  - 実在メーカーUI・ロゴ・製品画面が入っている
  - 記事テーマと違う命令語や用語が入っている
  - hero画像に細かい表や長文が入っている
  - OGP画像が小さい文字だらけでサムネイルとして読めない
  - overview画像なのに基本動作が分からない
  - comparison画像なのに比較・使い分けになっていない
  - check-flow画像なのに確認手順になっていない
  - ちびキャラが大きすぎて本文図解より目立っている
  - 先輩と後輩の役割が逆に見える

### 画像生成エージェント向けの生成順
- GX Works3命令語シリーズでは、原則として以下の順に生成・確認する。
  1. hero
  2. ogp
  3. overview
  4. comparison
  5. check-flow
- 各画像の生成指示は完全に分離する。
- 1回の生成指示には1枚の用途だけを書く。
- 他の4枚の内容を混ぜない。

### 画像生成プロンプトに入れるべき共通文（考え方）
- この画像は5枚中の何枚目かを明記する。
- 他の4枚の内容を混ぜない。
- 共通キャラクターテンプレートを参照し、先輩・後輩キャラの見た目を統一する。
- 白背景、青ベース、補助色は緑・黄・赤を少し使う。
- 文字は大きく、記事内画像として読みやすくする。
- 1枚に情報を詰め込みすぎない。
- 記事テーマに合う範囲で、親しみやすい会話や吹き出しを入れてよい。
- 実在メーカーUIやロゴは入れない。
