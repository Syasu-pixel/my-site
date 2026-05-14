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
  - https://denkicontrol.com/articles/slug.html
- URLは後から変えない前提で決める

## 3. 画像準備
- 画像フォルダは記事スラッグに合わせる
  - assets/images/slug/
- 画像は用途ごとに別ファイルにする
- 1枚にまとめた画像は使わない
- 通常記事では、ヒーロー画像をOGP兼用してもよい。
- ヒーロー画像は左側にHTML文字が乗る余白を残す
- SNSや検索結果で見ても記事テーマが分かるようにする
- hero画像には、記事タイトルまたは記事テーマが分かる短いタイトル文を必ず入れる
- 本文図や細かい表はヒーローに入れない
- 実在メーカーUIやロゴは入れない
- 人物キャラクターは docs/image-generation-rules.md の guide-characters 参照ルールに従う
- 人物を入れる場合は assets/images/guide-characters/ の既存2人を基準にする
- 新しい別キャラを勝手に作らない
- 記事固有画像の拡張子は原則 `.png` とする
- 人物入り画像は `guide-characters` 参照を必須にする
- 同一記事5枚は `hero` をアンカーにして統一感を維持する
- 1画像1用途を徹底する
- 生成後に用途・キャラ・禁止要素を自己検品する



### GX Works3命令語シリーズの画像5枚ルール
GX Works3命令語シリーズでは、原則として以下の5枚を**別ファイル**で用意する。

- slug-hero.png
- slug-ogp.png
- slug-overview.png
- slug-comparison.png
- slug-check-flow.png

役割：
- hero：記事上部のメイン画像。左側にHTML文字が乗る余白を残す。
- ogp：SNS・リンク共有用サムネイル。細かい表や小さい文字を入れすぎない。
- overview：本文の基本説明図。
- comparison：使い分け・比較表・違いの整理。
- check-flow：うまく動かない時の確認手順。

注意：
- 1枚に5枚分の内容をまとめない。
- 1回の画像生成では1枚の用途だけを作る。
- 他4枚の内容を混ぜない。
- 実在メーカーUIやロゴは入れない。
- 既存の先輩・後輩キャラの雰囲気を維持する。


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

### 先輩・後輩会話パートの画像参照チェック
- `talk-thread` を使う場合、HTML出力前に `assets/images/guide-characters/` の実在ファイル名を確認したか
- `div.talk-avatar > img` 構造になっているか
- `src` が実在する guide-characters ファイルを参照しているか
- 存在しない画像名を推測で書いていないか
- 先輩発言に先輩キャラ画像を使っているか
- 後輩発言に後輩キャラ画像を使っているか
- 先輩・後輩の役割が逆になっていないか
- 記事固有画像や生成画像を会話アイコンに流用していないか
- 画像パスが記事階層に合っているか
- 英語記事では alt が英語になっているか
- 日本語記事では alt が日本語になっているか

禁止例:
- 実在確認なしで `kouhai-chibi-question.png` のようなファイル名を書く
- `senpai` / `kouhai` を名前だけで判断し、実在確認を省略する
- 会話アイコンを記事用説明画像で代用する
- 新しいキャラ画像を勝手に作る

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


### 公式資料参照チェック
- 技術的な説明を含む記事か確認したか
- メーカー公式ページ、公式カタログ、公式マニュアル、公式技術資料を確認したか
- 仕様値・設定値・配線・圧力範囲・電流容量・安全条件を推測で書いていないか
- メーカーや型式で変わる内容を一般論として断定していないか
- 公式資料で確認できない内容に「一般的には」「機種により異なる」などの注意表現を入れているか
- 実機では公式マニュアルを確認するよう本文で促しているか
- 英語記事では、必要に応じて公式英語ページや公式英語資料も確認したか
- 非公式ブログやAI生成文だけを根拠にしていないか

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
- 新規記事HTMLでは、コピー元テンプレートのレスポンシブCSSを省略・短縮・圧縮・統合しない
- とくに以下のメディアクエリは必ず維持する
  - `@media (max-width:1100px)`
  - `@media (max-width:900px)`
  - `@media (max-width:768px)`
  - `@media (min-width:744px) and (max-width:1100px)`
  - `@media (max-width:640px)`
- iPad / iPad Pro 幅の表示崩れ防止のため、`@media (min-width:744px) and (max-width:1100px)` は必須チェック項目とする
- 上記の中間幅指定では、`.article-hero`、`.article-hero::before`、`.article-hero::after`、`.article-hero-copy`、`h1`、`.hero-lead`、`.top-summary`、`.side-rail` の補正を落とさない
- `.article-hero::before` の中間幅指定では、ヒーロー背景画像の過剰拡大を防ぐため `right center / auto 92% no-repeat` 相当の指定を維持する
- コピー元に古いフッターがあっても流用せず、必ず固定フッターへ差し替える
- 英語記事 `en/articles/*.html` では、右カラム `Support this site` に `section.side-card.support-card`（2ボタン: `Buy me a coffee` / `Support via PayPal`）を必ず維持し、1ボタンの `support-button` 版へ変更しない

### スマホ固定ヘッダー正規化チェック（必須）
- スマホ幅で `.brand-sub` が非表示か確認したか
- スマホ幅で `.brand-title` が表示されるか確認したか
- `.brand-copy` / `.brand-title` を `display:none` にしていないか確認したか
- `language-menu` が検索欄（`header-search`）の左側にあるか確認したか
- `language-menu-current` が狭幅で非表示になるか確認したか
- `header-search` が右側で見切れていないか確認したか
- `site-search.js` が1回だけ読み込まれているか確認したか
- 日本語記事は `index.html` 基準、英語記事は `en/index.html` 基準で確認したか
- 英語記事監査で日本語 `index.html` を基準にしていないか確認したか
- 日本語記事監査で `en/index.html` を基準にしていないか確認したか
- CSS全文を空白正規化（空白・改行差を無視）して、必須指定セットが揃っているか確認したか
- 1行CSSでも複数行CSSでも、同一指定が揃っていればOK判定にしているか
- 必須指定が欠けるページは C 判定として修正対象にしているか

標準補正CSS（必要ページのみ、`</style>` 直前に後勝ち追加）:

```css
@media (max-width:640px){:root{--header-h:66px;}html{scroll-padding-top:82px;}.site-header{padding:7px 8px;}.site-header-inner{gap:6px;}.brand{gap:7px;}.brand-logo{height:36px;}.brand-title{font-size:13px;letter-spacing:0;}.brand-sub{display:none;}.language-menu-button{width:34px;min-width:34px;min-height:34px;}.header-search{flex:0 1 138px;min-height:36px;}.search-box{padding:0 9px;gap:6px;}.search-box-input{font-size:11px;}.header-search-icon{width:14px;height:14px;}.search-box-panel{right:-48px;width:min(340px,94vw);}}
```

禁止:
- スマホで `.brand-copy` を `display:none` にしない
- `.brand-title` を消さない
- `.brand-sub` を表示したままにしない
- `language-menu` と `header-search` の順番を入れ替えない
- `header-search` を固定幅で大きくしすぎない
- 本文側スマホCSS（`article-hero` / `talk` / `section-card` / `summary-card` / `mini-toc` など）を巻き込んで編集しない
- 既存 `@media` ブロックを雑に編集しない
- `site-search.js` を重複読み込みしない
- `sitemap.xml` / `assets/data/search-index.json` / `/seo/sitemap.xml` をヘッダー補正タスクで触らない

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
- 通常記事：og:image / twitter:image はヒーロー画像をOGP兼用してもよい
- GX Works3命令語シリーズ：OGP専用画像 `slug-ogp.png` を使う
- GX Works3命令語シリーズ：og:image / twitter:image は `slug-ogp.png` を指定する
- GX Works3命令語シリーズ：hero画像とOGP画像を混同しない
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
https://denkicontrol.com/articles/slug.html

## 11. 現在の標準フロー
### 11.0 2ステップ完了フロー（標準）
- 記事制作は原則2ステップ完了フローで進める。Step 1では記事HTML・画像・確認用URLまで作成し、導線追加は行わない。ユーザーが確認用URLを確認してOKした後のみ、Step 2として index.html、categories/*.html、assets/data/search-index.json、sitemap.xml へ導線追加する。
- 途中確認は原則不要。ただし、導線追加前（Step 2開始前）だけは必ずユーザー確認を入れる。
- Step 1では `index.html` / `categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` を触らない。
- `/seo/sitemap.xml` は非運用なので触らない。

### 11.1 Step 1（自律進行）
1. 記事候補を決める
2. GitHub最新の既存HTMLを確認し、重複がないか確認する
3. 公式情報・命令語の基本動作を確認する
4. ChatGPTが新規記事HTML（完成HTML本文）を作成する
5. ChatGPTが画像生成ルールに従って画像を1枚ずつ作成する
6. ユーザーがHTMLと画像をGitHubへ追加する（またはCodexへ「完成HTMLと画像の配置のみ」を依頼する）
7. Codexが関与する場合は、完成HTMLと画像の配置・静的確認のみを実施する
8. Codexは完成HTML本文を勝手に再構成せず、CSS/テンプレート構造の省略・圧縮・再設計を行わない
9. Step 1時点では導線追加を実施しない
10. safe to merge: YES / NO を報告し、確認用URLを共有する

### 11.2 Step 2（ユーザーOK後のみ）
1. ユーザーが確認用URLを確認する
2. ユーザー明示OKを受ける（この確認は必須）
3. 導線追加を実施する（日本語記事側の言語メニュー / `en/index.html` / `en/categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` / `docs/en-article-backlog.md`）
4. 公開後監査を実施する（search-index missing / extra / duplicate、sitemap重複、件数整合）
5. 最後に `safe to close: YES / NO` を出す

補足：
- 通常は1記事ずつ完了フローを使う。
- ユーザーが希望した場合、または同じシリーズでテンプレートが安定している場合は、5記事まとめ制作フローを使ってよい。
- 5記事まとめ制作では、HTML作成・画像作成・表示確認・導線追加を段階ごとにまとめて行う。
- 5記事まとめ制作でも2ステップ制を適用し、Step 1完了（記事・画像・確認用URL）と、ユーザーOK後のStep 2（導線追加）を分離する。
- ただし、表示確認前に導線追加へ進まない。
- 導線追加時は sitemap / search-index / categories / index.html をまとめて更新してよい。
- articles/*.html と assets/images/** の修正と、導線追加作業は分ける。
- エージェント運用でも、標準は1記事ずつ完了させる。
- 3〜5記事まとめて導線反映してよいのは例外運用とする。
- 通常は記事単体の品質確認と導線確認を優先する。
- 導線追加エージェントは、ユーザー明示OK前に実行しない。

### 11.1 5記事まとめ制作時の画像運用メモ
- 5記事まとめ制作でも、画像は用途ごとに別ファイルで作る。
- 画像生成指示では、どの記事のどの用途の画像かを必ず明記する。
- 例：
  - article-a hero
  - article-a ogp
  - article-a overview
  - article-a comparison
  - article-a check-flow
- 1回で複数画像を作る場合でも、各画像の役割を混ぜない。
- 画像確認時は、記事単位で OK / 修正必要 を分けて記録する。

## 12. CODEX反映ルール
記事HTMLと画像は1記事ずつユーザーがGitHubへ追加する。
その後、3〜5記事分をまとめてCODEXで以下へ反映してよい（例外運用）。

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


## 新規記事作成エージェントの禁止事項
- 既存記事と重複したテーマを作らない
- GitHub最新の articles/*.html を確認せずに候補確定しない
- 公式情報を確認せずに命令語の挙動を断定しない
- ヘッダー・検索フォーム・フッターを独自に作り直さない
- side-rail を抜かさない
- site-search.js を重複読み込みしない
- 画像5枚の用途を混ぜない
- sitemap / search-index / categories / index.html をHTML作成タスク中に触らない
- 導線追加タスク中に articles/*.html や画像を触らない

## 13. 新規記事作成の最終チェック
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
- コピー元テンプレートと比較して、レスポンシブ用メディアクエリが欠落していないか
- CSSを短縮・圧縮しただけに見えても、テンプレート由来のレスポンシブ補正が抜けていないか
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

## 14. 新しいチャットでの使い方
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


## 12. 新規記事の最終ブランド整合チェック（公開前）
公開前の最終確認で、旧サイト名・旧ブランド文言が残っていないかを必ず確認する。

確認対象（新規記事 + 導線反映ファイル）：
- title
- meta description
- og:title
- og:description
- og:site_name
- twitter:title
- twitter:description
- header の brand-title / brand-sub
- footer 文言
- パンくず
- 本文内のサイト紹介文
- `assets/data/search-index.json` の description
- `categories/*.html` や `index.html` の導線文言

旧サイト名・旧文言の例（検出対象）：
- 電気工事士の工具箱
- 工具・制御・現場の基本をやさしく整理
- 旧ロゴ名や旧キャッチコピー
- 以前のサイト説明文

現在の基準：
- サイト名: 電気と制御の実務メモ
- 将来ブランド方針: 電気制御ラボ / Denki Control Lab
- キャッチコピー基準: 電気工事・PLC・制御を基礎から学ぶ実務ガイド

判定ルール：
- 旧サイト名・旧文言が1か所でも残っている場合は `safe to merge: NO` とする。
- すべて現行基準に一致している場合のみ `safe to merge: YES` とする。

- 記事固有画像は原則 `.png` で作成しているか
- 人物入り画像は `guide-characters` 参照必須を守っているか
- 同一記事5枚は `hero` をアンカーにして統一感を維持しているか
- 1画像1用途を守っているか
- 実在メーカーUI・ロゴを入れていないか
- 生成後に用途・キャラ・禁止要素を自己検品しているか
- 参照と違う別キャラになっていたら NG
- 画像5枚の雰囲気がバラついていたら NG

## 追加チェック（HTML先行・画像分割生成）
- 5記事制作では、まず5記事分のHTMLを先に作る
- 画像生成はHTML作成後、記事ごとに5枚ずつ行う
- 25枚を一括生成しない
- 記事固有画像は原則 `.png`
- HTML内の画像パスも `.png` で先に確定する
- 人物入り画像は `guide-characters` 参照必須
- 同一記事5枚は hero をアンカーにして統一感を維持する
- hero画像には記事タイトルまたは記事テーマ文を必ず入れる
- hero画像でタイトルがない場合はNG
- 1画像1用途を守る
- 参照と違う別キャラになっていたらNG
- 画像5枚の雰囲気がバラついていたらNG
- 画像生成後は自己検品（用途一致・キャラ一致・禁止要素なし）を実施する
- 導線追加はユーザーOK後のみ行う


## 画像ファイル名確定ルール

Codexは画像生成を行わない。
ただし、HTML作成時に画像フォルダ名・画像ファイル名・画像パスを必ず確定する。

画像はChatGPTで後から生成するため、CodexはHTML内に予定ファイル名を .png で指定する。

記事固有画像は原則 .png とする。
記事固有画像に .svg を指定しない。

基本の画像フォルダ:
assets/images/[slug]/

基本の画像5枚:
- [slug]-hero.png
- [slug]-ogp.png
- [slug]-overview.png
- [slug]-comparison.png
- [slug]-check-flow.png

HTML内の指定例:
- hero背景: ../assets/images/[slug]/[slug]-hero.png
- OGP画像: https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png
- Twitter画像: https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png
- overview本文画像: ../assets/images/[slug]/[slug]-overview.png
- comparison本文画像: ../assets/images/[slug]/[slug]-comparison.png
- check-flow本文画像: ../assets/images/[slug]/[slug]-check-flow.png

Codexは、HTML完成後にユーザーへ以下を必ず報告する。

- HTMLファイル名
- 画像フォルダ名
- 画像5枚のファイル名
- HTML内で使っている画像パス
- ChatGPTで画像生成すべき順番

報告例:
次にChatGPTで生成する画像:
1. [slug]-hero.png
2. [slug]-ogp.png
3. [slug]-overview.png
4. [slug]-comparison.png
5. [slug]-check-flow.png

## レスポンシブCSS維持ルール

Codexは新規記事HTML作成時に、既存テンプレートのレスポンシブCSSを落とさない。

必須維持:
- @media (max-width:1100px)
- @media (max-width:900px)
- @media (max-width:768px)
- @media (min-width:744px) and (max-width:1100px)
- @media (max-width:640px)

特に、iPad / iPad Pro相当幅でhero画像が過剰拡大しないように、以下の中間幅指定を維持する。

例:
@media (min-width:744px) and (max-width:1100px){
  .article-hero::before{
    background:url("../assets/images/[slug]/[slug]-hero.png") right center / auto 92% no-repeat;
    opacity:.24;
  }
  .article-hero-copy{
    width:min(100%,600px);
    padding:42px 34px;
  }
}

注意:
- 背景画像を 128% auto などにして過剰拡大させない。
- 既存テンプレートで安定している指定を優先する。
- hero画像の表示が崩れる場合は、記事本文ではなく .article-hero::before の背景指定を確認する。

## Codex用 HTML最終チェック

新規記事HTMLを作成したら、Codexは以下を確認する。

### 基本
- title が記事内容に合っている
- meta description が自然
- canonical が正しい
- og:url が正しい
- og:image が .png
- twitter:image が .png
- h1 が記事タイトルと一致している
- パンくず末尾が記事名になっている

### 画像
- 記事固有画像が .png 指定になっている
- .svg が記事固有画像に残っていない
- guide-characters配下の共通キャラ画像は変更していない
- 画像フォルダ名がslugと一致している
- 画像5枚のファイル名がルール通り
- OGP画像は absolute URL
- 本文画像は relative URL

### テンプレート
- header/search構造を維持している
- site-search.js がbody終了直前に1回だけ
- talk-thread構造を維持している
- talk-avatar > img 構造を維持している
- page-layout / main-column / side-rail を維持している
- related-grid を維持している
- check-grid を維持している

### レスポンシブ
- @media (min-width:744px) and (max-width:1100px) がある
- iPad幅でhero背景が過剰拡大しない指定になっている
- @media (max-width:900px) がある
- @media (max-width:640px) がある

### ブランド
- 旧サイト名が残っていない
- 旧ブランド文言が残っていない
- 現行表示名「電気と制御の実務メモ」に合っている
- Denki Control Lab 方針と矛盾しない

### 関連記事
- 関連記事リンクが実在している
- 存在しないHTMLへリンクしていない
- 自己リンクになっていない
- 関連記事カード構造を維持している

判定:
上記にNGがある場合は safe to move to image generation: NO とする。
すべてOKなら safe to move to image generation: YES とする。

## Codex禁止事項

Codexは新規記事作成時に以下を行わない。

- 画像生成をしない
- 記事固有画像に .svg を指定しない
- 画像ファイル名をHTML作成後に勝手に変更しない
- 既存テンプレートのCSSを作り直さない
- header/search構造を作り直さない
- site-search.js を複数回読み込まない
- talk-thread構造を崩さない
- guide-characters配下のキャラ画像を別名にしない
- iPad用レスポンシブCSSを削除しない
- ユーザーOK前に導線追加しない
- /seo/sitemap.xml を触らない
- 存在しない関連記事リンクを入れない
- 旧サイト名・旧ブランド文言を残さない


## 記事候補の重複確認ルール

新規記事候補の重複確認は、原則としてGPTが行う。

Codexは、GPTが「重複確認済み」として渡した記事テーマをもとにHTML作成を行う。

Codex側の最低限確認:
- 同名HTMLファイルが存在しない
- 同一slugが存在しない
- 同一URLが search-index.json に存在しない
- 同一URLが sitemap.xml に存在しない

ただし、記事テーマの重複判断や候補選定はGPT側で行う。

## Codexの作業範囲

Codexは、GPTから渡された記事作成指示をもとに、HTML作成とGitHub反映を行う。

Codexが行うこと:
- コピー元テンプレート記事を選ぶ
- 完成済み記事HTMLを完全コピーする
- title / meta / canonical / OGP / h1 / 本文 / 関連記事を差し替える
- 画像フォルダ名を確定する
- 画像5枚のファイル名を確定する
- HTML内の画像パスを .png で指定する
- レスポンシブCSSを維持する
- GitHubにHTMLを反映する
- 画像配置後に表示確認する
- ユーザーOK後に導線追加する

Codexが行わないこと:
- 記事候補の本格的な重複判断
- 記事候補の最終選定
- 画像生成
- guide-characters の新規作成
- ユーザーOK前の導線追加
- /seo/sitemap.xml の更新

## Codex用 HTML作成ルール

新規記事HTMLは、完成済み記事HTMLを完全コピーして必要箇所だけ差し替える。

コピー元候補:
- articles/relay-basic.html
- articles/forward-reverse-circuit-basic.html
- articles/lamp-indicator-circuit-basic.html
- 同カテゴリ・同シリーズの最新完成記事

差し替える対象:
- title
- meta description
- canonical
- og:title
- og:description
- og:url
- og:image
- twitter:title
- twitter:description
- twitter:image
- h1
- hero lead
- breadcrumb末尾
- top-summary
- mini-toc
- section-card本文
- article-figure画像パス
- figcaption
- 関連記事カード
- side-rail目次

変更しない対象:
- CSS全体構造
- クラス名
- header/search構造
- site-search.js読み込み位置
- talk-thread構造
- talk-avatar > img 構造
- guide-characters画像パス
- page-layout / main-column / side-rail
- related-grid
- check-grid
- レスポンシブメディアクエリ

禁止:
- ゼロからHTML構造を作り直さない
- CSSを新規設計しない
- クラス名を勝手に変えない
- 検索ヘッダーを作り直さない
- 会話構造を作り直さない
- 関連記事構造を作り直さない

## 画像パス確定ルール

Codexは画像生成を行わない。
ただし、HTML作成時に画像フォルダ名・画像ファイル名・画像パスを必ず確定する。

記事固有画像は原則 .png とする。
記事固有画像に .svg を指定しない。

基本の画像フォルダ:
assets/images/[slug]/

基本の画像5枚:
- [slug]-hero.png
- [slug]-ogp.png
- [slug]-overview.png
- [slug]-comparison.png
- [slug]-check-flow.png

HTML内では以下のように指定する。

- hero背景:
  ../assets/images/[slug]/[slug]-hero.png

- OGP画像:
  https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png

- Twitter画像:
  https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png

- overview本文画像:
  ../assets/images/[slug]/[slug]-overview.png

- comparison本文画像:
  ../assets/images/[slug]/[slug]-comparison.png

- check-flow本文画像:
  ../assets/images/[slug]/[slug]-check-flow.png

HTML完成後、記事固有画像に .svg が残っている場合はNGとする。

## レスポンシブCSS維持ルール

Codexは新規記事HTML作成時に、既存テンプレートのレスポンシブCSSを落とさない。

必須維持:
- @media (max-width:1100px)
- @media (max-width:900px)
- @media (max-width:768px)
- @media (min-width:744px) and (max-width:1100px)
- @media (max-width:640px)

特に、iPad / iPad Pro相当幅でhero画像が過剰拡大しないように、以下の中間幅指定を維持する。

例:
@media (min-width:744px) and (max-width:1100px){
  .article-hero::before{
    background:url("../assets/images/[slug]/[slug]-hero.png") right center / auto 92% no-repeat;
    opacity:.24;
  }
  .article-hero-copy{
    width:min(100%,600px);
    padding:42px 34px;
  }
}

禁止:
- 中間幅で background-size:128% auto などにしてhero画像を過剰拡大させない
- iPad用レスポンシブCSSを削除しない
- max-width系メディアクエリを省略しない


## 12. ChatGPT / Codex 役割分担
- ChatGPT
  - 記事テーマ選定補助
  - 元記事確認
  - 公式情報確認方針の整理
  - 英語記事HTML本文作成
  - メタ情報・関連記事案・画像名設計
  - 画像生成
  - 画像採用判定
- Codex
  - GitHub上のファイル配置
  - 完成HTMLの静的チェック
  - 画像ファイル存在確認
  - 関連記事リンク実在確認
  - Step 2導線追加
  - search-index / sitemap / backlog の整合確認
  - PR作成・報告
- Codexの禁止
  - 完成HTML本文を勝手に大幅改稿しない
  - 記事の技術説明を独自判断で増減しない
  - 画像を1枚にまとめない
  - Step 1中に導線追加ファイルを触らない
  - Step 2中に記事本文や画像を触らない
  - `/seo/sitemap.xml` を触らない
