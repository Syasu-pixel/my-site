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
- 原則として以下の5枚を別ファイルで作成する。
  - `slug-hero.png`
  - `slug-ogp.png`
  - `slug-overview.png`
  - `slug-comparison.png`
  - `slug-check-flow.png`
- `slug-ogp.png` はSNS・リンク共有専用とし、`og:image` / `twitter:image` に指定する。
- hero は記事上部表示用で、左側にHTML文字が乗る余白を残す。
- OGP画像には細かい表や小さい文字を詰め込みすぎない。
- 1回の画像生成では1枚の用途だけを作り、他4枚の内容を混ぜない。
- 実在メーカーUIやロゴは入れない。
- 既存の先輩・後輩キャラの雰囲気を維持する。
