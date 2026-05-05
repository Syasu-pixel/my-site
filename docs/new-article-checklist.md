# 新規記事作成チェックリスト

## 1. 記事テーマ・カテゴリ確認
- 記事テーマが既存記事と重複しすぎていないか確認する
- カテゴリを決める
  - 制御の基礎
  - 回路
  - 工具
  - 比較・使い分け
- 回路記事の場合は、概要だけでなく簡略ラダー例・回路例・条件と出力の見本を入れる
- サーボやシンプルモーションなど応用寄りの内容は、ベーシック記事に無理に入れない

## 2. スラッグ・URL確認
- 記事スラッグを決める
- ファイル名は articles/slug.html にする
- canonical / og:url は以下の形式にする
  - https://syasu-pixel.github.io/my-site/articles/slug.html
- URLは後から変えない前提で決める

## 3. 画像準備
- 画像フォルダは記事スラッグに合わせる
  - assets/images/slug/
- 画像は用途ごとに別ファイルにする
- 1枚にまとめた画像は使わない
- ヒーロー画像はOGP兼用できる構図にする
- ヒーロー画像は左側にHTML文字が乗る余白を残す
- SNSや検索結果で見ても記事テーマが分かるようにする
- 必要なら短いタイトル風テキストを入れてよい
- 本文図や細かい表はヒーローに入れない
- 実在メーカーUIやロゴは入れない
- 人物キャラクターは docs/image-generation-rules.md の guide-characters 参照ルールに従う
- 人物を入れる場合は assets/images/guide-characters/ の既存2人を基準にする
- 新しい別キャラを勝手に作らない



### 本文内キャラチェック
- guide-characters 内の既存キャラだけを使っているか
- 先輩キャラと後輩キャラの役割が自然か
- 会話欄で、先輩・後輩の画像が別テイストになっていないか
- 会話欄の画像は `div.talk-avatar > img` になっているか
- 注意ボックス内の画像は `caution-character-box` / `caution-character` 構造になっているか
- 注意ボックス内の `h3` と `p` が、キャラ右側の同じ `div` にまとまっているか
- 注意ボックス内のキャラサイズが PC 36px / スマホ 30px 基準になっているか
- 注意ボックス内のキャラが大きすぎて、本文より目立っていないか
- `.talk-avatar` のサイズと `.caution-character img` のサイズを混同していないか
- 頭身の高い立ち絵や別系統キャラが本文中に混ざっていないか

## 4. 画像構成の目安
通常記事：
- slug-hero.png
- slug-overview.png
- slug-control-flow.png または slug-operation-flow.png
- slug-checkpoints.png

回路記事：
- slug-hero.png
- slug-overview.png
- slug-ladder.png
- slug-checkpoints.png

必要に応じて、回路記事では以下も追加可：
- slug-operation-flow.png

## 5. HTML作成ルール
- 新規記事HTMLは完成済み記事HTMLを完全コピーして必要箇所だけ差し替える
- 見た目だけ似せるのではなく、構造をコピーする
- 新規記事HTML作成時は、記事本文構造と固定ヘッダーの参照元を分ける
  - 記事本文構造：完成済み記事HTMLをコピー
  - 固定ヘッダー：必ず `index.html` の最新版を参照
  - 固定フッター：必ず `index.html` の最新版文言を基準にし、`articles/*.html` 用の相対リンクへ調整
  - 共通キャラ画像：`assets/images/guide-characters/` の既存2人を使う
- 固定ヘッダー、検索フォーム、右カラム、section-card、talk-thread、related-grid、site-search.js、固定フッターは維持する
- site-search.js は重複読み込みしない
- 新しい独自CSSテンプレートを作らない
- コピー元に古いフッターがあっても流用せず、必ず固定フッターへ差し替える

articles/*.html 用の固定フッター：

```html
<footer class="site-footer">
  <div class="container">
    <p>
      現場で使う工具と、制御の基本を、迷いにくく整理してまとめています。<br>
      <a href="../privacy-policy/">プライバシーポリシー</a> | <a href="../contact/">お問い合わせ</a>
    </p>
  </div>
</footer>
```

固定フッタールール：
- 「© 電気と制御の実務メモ」だけの簡易フッターにしない
- `<footer>` だけの裸フッターにしない
- `footer` には必ず `class="site-footer"` を付ける
- `footer` 内には必ず `div class="container"` を入れる

基準記事：
- articles/relay-basic.html
- articles/forward-reverse-circuit-basic.html
- articles/lamp-indicator-circuit-basic.html

## 6. HTMLで差し替えるもの
- title
- meta description
- canonical
- OGP / Twitter
- h1
- hero-lead
- パンくず末尾
- カテゴリ
- top-summary の文言
- mini-toc の項目
- section-card の本文
- article-figure の画像パスとalt
- 表やチェック項目
- 関連記事
- 右カラムの目次とまとめ
- footer-nav のリンク

## 7. OGP・meta確認
- og:image / twitter:image はヒーロー画像を指定する
- ヒーロー画像はOGP兼用前提で使う
- meta description は記事内容に合わせる
- canonical と og:url が記事URLと一致しているか確認する
- 古い共通OGPや汎用画像を使わない

## 8. 関連記事確認
- あわせて読みたい記事は3〜6件を目安にする
- 回路記事・制御記事では自然につながるなら6件まで入れてよい
- 存在しない記事へのリンクは入れない
- 自己リンクは入れない
- 実務の流れで自然につながる記事を選ぶ
- GitHub最新で実在確認済みの記事だけ使う

## 9. 回路記事の必須確認
回路記事では、以下のどれかを必ず入れる。

- 簡略ラダー例
- 回路例
- 条件と出力の見本
- 動作順序図

例：
- ランプ表示回路 → 運転中条件 / 停止中条件 / 異常条件から各ランプ出力への基本ラダー例
- 正転・逆転回路 → 正転側 / 逆転側の基本ラダー例
- ブザー回路 → 異常条件からブザー出力への基本ラダー例
- リセット回路 → 異常保持とリセット解除の基本例

## 10. GitHub追加後の確認URL
記事HTMLと画像をGitHubへ入れたら、確認用URLを案内する。

形式：
https://syasu-pixel.github.io/my-site/articles/slug.html

## 11. CODEX反映ルール
記事HTMLと画像は1記事ずつユーザーがGitHubへ追加する。
その後、3〜5記事分をまとめてCODEXで以下へ反映してよい。

- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml
- トップページの記事数表示

CODEX反映時の注意：
- articles/** と assets/images/** は原則触らない
- /seo/sitemap.xml は非運用なので触らない
- search-index の missing / extra / duplicate を確認する
- sitemap の重複を確認する
- トップの記事数表示がカテゴリ別件数と一致しているか確認する

## 12. 新規記事作成の最終チェック
新規記事HTMLを出す前に、以下を確認する。

- コピー方式で作っているか
- 固定ヘッダーが維持されているか
- 固定ヘッダーの `brand-title` / `brand-sub` が `index.html` と一致しているか
- ヘッダーナビの文言と `href` が `index.html` 基準になっているか
  - ホーム：`../index.html`
  - 人気記事：`../index.html#featured`
  - カテゴリ：`../index.html#category`
- 検索placeholderが「キーワードで検索」になっているか
- ロゴ画像が記事階層用の `../kougu_logo_middle.png` になっているか
- 先輩・後輩キャラ画像が `guide-characters` の実在パスになっているか
- 「電気工事士の工具箱」「工具・制御・現場の基本をやさしく整理」など旧ヘッダー文言が残っていないか
- サイト内検索フォームが維持されているか
- 右カラムがあるか
- section-card 構造があるか
- talk-thread があるか
- related-grid があるか
- site-search.js が1回だけ読み込まれているか
- 画像パスが記事スラッグと一致しているか
- ヒーロー画像がOGPにも指定されているか
- 回路記事ならラダー例または回路例があるか
- 関連記事が3〜6件あるか
- 存在しないリンクがないか
- canonical / og:url / 確認URL が一致しているか

## 13. 新しいチャットでの使い方
新しいチャットでは、以下のように伝える。

このチャットでは my-site の新規記事制作を進めます。
docs/article-workflow.md、docs/image-generation-rules.md、docs/new-article-checklist.md、docs/codex-update-rules.md を前提にしてください。
画像生成時は docs/image-generation-rules.md の guide-characters 参照ルールに従ってください。

確認コマンド：
ls -la docs
rg -n "新規記事|OGP兼用|guide-characters|コピー方式|ラダー例|3〜6件|site-search.js|CODEX|/seo/sitemap.xml" docs/new-article-checklist.md

報告形式：
Summary
- 作成したdocsファイル
- 入れた主なチェック項目

Testing
- ls確認結果
- rg確認結果

判定
safe to merge / not safe


## 固定ヘッダーの扱い

記事HTMLの本文テンプレートと、サイト共通の固定ヘッダーは分けて扱う。

### 記事本文テンプレート
新規記事・古い記事の移植では、以下の基準記事を完全コピーして、必要箇所だけ差し替える。

- `articles/relay-basic.html`
- `articles/forward-reverse-circuit-basic.html`
- `articles/lamp-indicator-circuit-basic.html`

維持する本文構造：
- `article-hero`
- `article-hero-copy`
- `top-summary`
- `summary-card`
- `mini-toc-card`
- `page-layout`
- `main-column`
- `side-rail`
- `side-card`
- `section-card`
- `talk-thread`
- `article-figure`
- `check-grid`
- `table-wrap`
- `related-grid`

### 固定ヘッダー
固定ヘッダーは、最終的にトップページ `index.html` の最新版を基準に全ページで統一する。

- 記事移植作業のたびに、固定ヘッダーを個別に作り直さない。
- 記事テンプレート内のヘッダーCSSを勝手に再設計しない。
- 検索フォーム構造や `site-search.js` の読み込みを重複させない。

固定ヘッダーを修正する場合は、記事本文修正とは別タスクにする。

その場合の対象は以下に限定する。

触ってよい範囲：
- `header.site-header` 周辺
- 固定ヘッダー関連CSS
- サイト内検索フォーム構造
- `site-search.js` の読み込み確認

触らない範囲：
- 記事本文
- `article-hero`
- `top-summary`
- `section-card`
- `related-grid`
- 画像パス
- Amazonリンク
- canonical / OGP
- `search-index.json`
- `sitemap.xml`
- `/seo/sitemap.xml`

### 判断ルール
記事本文テンプレートの統一作業では、固定ヘッダーの完全統一は後回しにしてよい。

ただし、以下の場合は要修正。
- ヘッダーが壊れている
- 検索フォームが使えない
- `site-search.js` が重複している

固定ヘッダーの見た目統一は、後日 `index.html` を基準に CODEX で全記事横断修正する。

## 固定ヘッダーをトップページと統一する時の詳細ルール

固定ヘッダーを全記事へ統一する場合は、「トップページ風に寄せる」のではなく、`index.html` の固定ヘッダーを正として扱う。

### 基本方針

固定ヘッダーは、記事ごとに再設計しない。
記事側の既存ヘッダーCSSを少し調整して似せるのではなく、`index.html` の固定ヘッダーHTML・CSS・参照変数を基準にする。

固定ヘッダー修正は、記事本文テンプレート修正とは別タスクにする。
本文・画像・関連記事・Amazonリンク・canonical・OGPを同時に触らない。

### 必ず揃えるもの

固定ヘッダー統一時は、以下を `index.html` 基準で揃える。

- `header.site-header` のHTML構造
- ロゴ画像の構造
- `brand-title` / `brand-sub` の構造
- `header-nav` / `header-link` の構造
- サイト内検索フォームのDOM構造
- `site-search.js` の読み込み位置
- 固定ヘッダー関連CSS
- 固定ヘッダーが参照するCSS変数

### フォーム部品の継承までトップページと一致させる

固定ヘッダーを `index.html` と統一する場合は、見た目の数値だけでなく、検索フォームの `input` / `button` のフォント継承もトップページと一致させる。

`index.html` には以下の共通指定があるため、記事側でもこれを維持する。

```css
button,input{
  font:inherit;
}
```

### 記事用に変えてよいもの

記事ページでは、パスだけ記事用に変更してよい。

- `kougu_logo_middle.png` → `../kougu_logo_middle.png`
- `#top` または `index.html#top` → `../index.html#top`
- `#featured` → `../index.html#featured`
- `#category` → `../index.html#category`
- `assets/js/site-search.js` → `../assets/js/site-search.js`

### ヘッダーナビ確認（文言 + href）

記事ページのヘッダーナビは、文言だけでなく `href` も必ず確認する。

- ホーム：`../index.html`
- 人気記事：`../index.html#featured`
- カテゴリ：`../index.html#category`

### サイト内検索フォームの必須DOM構造

検索フォームは、全記事で以下の構造を維持する。

```html
<form class="header-search search-box" id="siteSearch" aria-label="サイト内検索" role="search">
  <label class="sr-only" for="site-search-input">サイト内検索</label>
  <input id="site-search-input" class="search-box-input" type="search" placeholder="キーワードで検索" autocomplete="off" enterkeyhint="search">
  <button class="search-box-button" type="submit" aria-label="検索">
    <span class="header-search-icon" aria-hidden="true"></span>
  </button>
  <div class="search-box-panel" id="site-search-panel" hidden>
    <ul class="search-box-results" id="site-search-results"></ul>
    <p class="search-box-empty" id="site-search-empty" hidden>該当する記事がありません</p>
  </div>
</form>
```
