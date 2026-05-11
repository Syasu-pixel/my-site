# 記事制作ワークフロー（article workflow）

## 基本方針
- このファイルは「方針・優先順位・標準フロー」を扱う。
- 実作業の詳細チェックは `docs/new-article-checklist.md` を優先して確認する。
- 新規記事HTMLは**コピー方式**で作成する。
- 完成済み記事HTMLを**完全コピー**し、必要箇所のみ差し替える。
- 既存テンプレートのレイアウト一貫性を優先し、構造改変は最小限にする。

## 基準記事（コピー元の明記）
- 新規記事HTMLは、完成済み記事を**完全コピー**して必要箇所だけ差し替える。
- 現時点の主な基準記事は以下。
  - `articles/relay-basic.html`
  - `articles/forward-reverse-circuit-basic.html`
  - `articles/lamp-indicator-circuit-basic.html`

## 維持する必須要素
- 固定ヘッダー
- 検索フォーム
- フッター（`footer.site-footer` + `div.container`）
- 右カラム
- `section-card`
- `talk-thread`
- `related-grid`
- `site-search.js`

上記は記事ページのUI/UX統一のため、基本的に維持する。

- 新規記事HTMLでは、コピー元テンプレートのレスポンシブCSSを省略・短縮・圧縮・統合しない。
- 特に以下のメディアクエリを必須維持要素として扱う。
  - `@media (max-width:1100px)`
  - `@media (max-width:900px)`
  - `@media (max-width:768px)`
  - `@media (min-width:744px) and (max-width:1100px)`
  - `@media (max-width:640px)`
- iPad / iPad Pro 幅の表示崩れ再発防止のため、`@media (min-width:744px) and (max-width:1100px)` を必須チェック対象にする。
- 上記の中間幅指定では、`.article-hero`、`.article-hero::before`、`.article-hero::after`、`.article-hero-copy`、`h1`、`.hero-lead`、`.top-summary`、`.side-rail` の補正を落とさない。
- `.article-hero::before` の中間幅指定では、ヒーロー背景画像の過剰拡大を防ぐため `right center / auto 92% no-repeat` 相当の指定を維持する。

## 記事内容ルール
- 回路記事は基本ラダー例を入れる。
- 関連記事は3〜6件までを目安に設定してよい。
- 存在しないリンクは入れない（公開済みURLのみ使用）。


## 技術的資料・仕様確認の公式参照ルール

制御機器、PLC、センサー、空圧機器、真空機器、電気部品、工具、測定器など、技術的な説明を含む記事では、公式情報を優先して確認する。

優先参照先:
- メーカー公式ページ
- メーカー公式カタログ
- 公式マニュアル
- 公式技術資料
- 公式FAQ / サポート情報
- 規格や安全に関わる内容は、可能な範囲で公的機関・規格団体・メーカー公式資料を確認する

基本ルール:
- 技術的な仕組み、仕様、選定条件、配線、設定値、注意事項は、公式資料を参考にする
- 一般ブログ、個人記事、販売店説明、AI生成文だけを根拠にしない
- 公式資料で確認できない内容は、断定せず「一般的には」「機種により異なる」と表現する
- 実機の設定値、配線、圧力範囲、電流容量、入出力仕様、安全条件は、必ず実際の型式の公式マニュアル確認を促す
- 記事本文では初心者向けに言い換えてよいが、技術的な根拠は公式情報を優先する
- 英語記事化する場合も、日本語元記事の内容だけでなく、必要に応じて公式英語ページ・公式カタログ・公式マニュアルを確認する

禁止:
- 公式確認なしに仕様値を断定する
- メーカーや型式に依存する内容を一般論として書く
- 安全に関わる内容を推測で書く
- 取扱説明書の代わりになるような断定的な手順を書く
- 非公式ブログだけを根拠に技術説明を書く
- 公式資料で確認できない専門用語や仕様を勝手に作る

記事内での書き方:
- 「実際の設定値や配線は、使用している機種の公式マニュアルを確認してください」
- 「メーカーや型式によって端子名・設定項目・圧力範囲は異なります」
- 「この記事では基本の考え方を整理しています」
のように、公式マニュアル確認を促す文を必要に応じて入れる。

## 実装上の注意
- `site-search.js` は重複読み込みしない。
- 変更対象は必要箇所に限定し、無関係な差分を含めない。
- 新規記事を既存記事からコピーして作る場合、コピー元に古いフッターが残っていても、そのまま使わず固定フッターへ差し替える。
- 新規記事HTMLの最終確認では、コピー元テンプレートと比較してレスポンシブ用メディアクエリの欠落がないかを確認する。
- CSSを短縮・圧縮しただけに見える変更でも、テンプレート由来のレスポンシブ補正が抜ける場合はNGとする。

## 事前チェック
- コピー元HTMLの構造が最新か確認。
- 関連記事リンク先の存在確認。
- スクリプト読込の重複有無確認。


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


## 英語記事の Support this site 固定ルール

英語記事 `en/articles/*.html` では、右カラムの `Support this site` は収益導線として扱う。
記事ごとに独自の簡易カードを作らず、既存英語記事で使っている `support-card` の2ボタン構成を固定パーツとして使う。

必須構造:
- `section.side-card.support-card`
- `h3.support-card-title`
- `p.support-card-text`
- `div.support-card-actions`
- `a.support-link.support-link--coffee`
- `a.support-link.support-link--paypal`

必須ボタン:
- `Buy me a coffee`
- `Support via PayPal`

禁止:
- 1ボタンだけの `support-button` 版にしない
- `Support this site` を省略しない
- 右カラムから収益導線を外さない
- 記事ごとに文言やCSSを再設計しない
- `support-card` 系CSSを削除しない
- supportリンクの href / target / rel を勝手に変えない

英語記事で使う標準HTML:

```html
<section class="side-card support-card">
  <h3 class="support-card-title">Support this site</h3>
  <p class="support-card-text">
    If this guide helped you, please consider supporting Denki Control Lab. Your support helps keep practical control articles available.
  </p>
  <div class="support-card-actions">
    <a class="support-link support-link--coffee" href="https://www.buymeacoffee.com/denkicontrol" target="_blank" rel="noopener">Buy me a coffee</a>
    <a class="support-link support-link--paypal" href="https://www.paypal.com/paypalme/denkicontrol" target="_blank" rel="noopener">Support via PayPal</a>
  </div>
</section>
```


## 英語記事作成時の日本語記事側言語メニュー接続ルール

英語記事 `en/articles/{slug}.html` を作成した場合、英語記事本体だけでなく、対応する日本語記事 `articles/{slug}.html` の言語選択メニューも必ず確認する。

基本ルール:
- 日本語記事側の言語メニューから、英語トップ `../en/` や `../en/index.html` に飛ばさない。
- 対応する英語記事が存在する場合は、必ず同一テーマの英語記事へ直接リンクする。
- 日本語記事 `articles/{slug}.html` から英語記事へ飛ぶリンクは、原則 `../en/articles/{slug}.html` とする。
- 英語記事 `en/articles/{slug}.html` から日本語記事へ戻るリンクは、原則 `../../articles/{slug}.html` とする。

日本語記事側の推奨表示:
```html
<a class="language-menu-item is-active" href="{slug}.html" lang="ja" aria-current="page">
  <span class="language-menu-flag" aria-hidden="true">🇯🇵</span>
  <span>
    <strong>日本語記事</strong>
    <small>現在のページ</small>
  </span>
</a>
<a class="language-menu-item" href="../en/articles/{slug}.html" lang="en">
  <span class="language-menu-flag" aria-hidden="true">🇺🇸</span>
  <span>
    <strong>English article</strong>
    <small>英語版の記事を開く</small>
  </span>
</a>
```

## 固定フッターの扱い（新規記事HTML）

新規記事HTMLのフッターは、トップページ `index.html` の最新フッター文言・導線を基準にする。  
ただし `articles/*.html` は1階層下のため、リンクは記事ページ用の相対パスに調整する。  
抽象的に作り直さず、以下を固定パーツとして使う。

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

明記ルール：
- 記事末尾を「© 電気と制御の実務メモ」だけの簡易フッターにしない。
- `<footer>` だけの裸フッターにしない。
- `footer` には必ず `class="site-footer"` を付ける。
- `footer` 内には必ず `div class="container"` を入れる。
- 文言と導線はトップページのフッター基準にする。
- `articles/*.html` ではリンクを `../privacy-policy/` と `../contact/` にする。
- 新規記事を既存記事からコピーして作る場合、コピー元に古いフッターが残っていても、そのまま使わずこの固定フッターへ差し替える。
- `header`、検索フォーム、本文、関連記事、`side-rail`、`site-search.js` と同じく、`footer` も共通固定パーツとして扱う。

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

## 先輩チビキャラ画像の運用（記事制作時）

## 先輩・後輩会話パートの画像参照ルール

新規記事・英語記事で `talk-thread` を使う場合、会話パートのキャラクター画像は必ず `assets/images/guide-characters/` に実在する既存ファイルだけを使う。

必須ルール:
- HTML出力前に `assets/images/guide-characters/` の実在ファイル名を確認する
- 存在しないファイル名を推測で書かない
- `senpai` 発言には先輩キャラ画像を使う
- `kouhai` 発言には後輩キャラ画像を使う
- 先輩・後輩の役割を逆にしない
- `div.talk-avatar > img` 構造を維持する
- alt属性は英語記事では英語、日本語記事では日本語で自然に書く
- 画像パスは記事階層に合わせて正しい相対パスにする

禁止:
- `kouhai-chibi-question.png` など、実在確認していないファイル名を使わない
- 生成画像や記事固有画像を会話アイコンとして使わない
- 先輩・後輩以外の新キャラを勝手に追加しない
- 頭身の高い立ち絵や別テイストの人物画像を混ぜない
- `.talk-avatar` 構造を崩さない
- 丸トリミングや独自装飾を追加しない

確認コマンド例:
ls -la assets/images/guide-characters
rg -n "talk-avatar|guide-characters|senpai|kouhai" articles/*.html en/articles/*.html

HTML出力前チェック:
- `src` に書いた guide-characters 画像が実在するか
- 後輩発言に後輩画像が使われているか
- 先輩発言に先輩画像が使われているか
- `div.talk-avatar > img` になっているか
- 存在しない画像名を推測で入れていないか

- 記事内の注意喚起・補足・覚え方には、まず以下の3画像を使う。
  - `assets/images/guide-characters/senpai-chibi-pointing.png`
  - `assets/images/guide-characters/senpai-chibi-guide.png`
  - `assets/images/guide-characters/senpai-chibi-idea.png`
- 1記事あたりの使用目安は1〜3か所。
- 本文可読性を優先し、本文・ボタンへの重なりやスマホでの過大表示を避ける。
- 背景つき画像は使わず、透過PNGのキャラ単体画像のみを使う。
- 差し替え時も同じファイル名と用途を維持する。



## 対象リポジトリの固定

このサイトの記事制作・監査・導線追加・画像配置確認・テンプレート確認・オーケストレーター作業では、参照・更新対象リポジトリを以下に固定する。

- `Syasu-pixel/my-site`

運用ルール：
- 過去記事確認、最新GitHub main確認、新記事作成、画像配置確認、関連記事確認、導線追加、監査作業では、このリポジトリを前提に進める。
- オーケストレーター、Codex、記事作成エージェント、画像生成エージェントは、毎回ユーザーに `owner/repo` を確認しない。
- 判断に迷う場合も、まず `Syasu-pixel/my-site` の最新 main を確認する。
- 例外的に別リポジトリを使う場合のみ、ユーザーが明示する。

## エージェント運用時の優先順位
1. ユーザーの最新指示
2. docs/article-workflow.md
3. docs/new-article-checklist.md
4. docs/image-generation-rules.md
5. 既存の完成済み記事HTML
6. 過去の古い記事構造

- 古い記事をコピー元にして、現在のルールに反する場合は、現在のdocsルールを優先する。
- 判断に迷う場合は、勝手に大きく変更せず、確認事項として報告する。

## 運用フロー

### 0. 2ステップ完了フロー（標準）
- 記事制作は原則2ステップ完了フローで進める。Step 1では記事HTML・画像・確認用URLまで作成し、導線追加は行わない。ユーザーが確認用URLを確認してOKした後のみ、Step 2として index.html、categories/*.html、assets/data/search-index.json、sitemap.xml へ導線追加する。
- 途中確認は原則不要。ただし、**導線追加前（Step 2開始前）だけは必ずユーザー確認を入れる**。

#### Step 1（自律進行）
- 記事作成
- 画像生成
- 画像配置
- GitHub登録
- 確認用URL発行
- Step 1では以下を触らない。
  - `index.html`
  - `categories/*.html`
  - `assets/data/search-index.json`
  - `sitemap.xml`
  - `/seo/sitemap.xml`（非運用）

#### Step 2（ユーザーOK後のみ）
- 導線追加（`index.html` / `categories/*.html` / `assets/data/search-index.json` / `sitemap.xml`）
- 公開後監査（search-index missing/extra/duplicate、sitemap重複、件数整合）
- 導線追加エージェントは、ユーザー明示OK前に実行しない。

### A. 1記事ずつ完了フロー
1. 記事候補を決める
2. GitHub最新の既存HTMLを確認し、重複がないか確認する
3. 公式情報・命令語の基本動作を確認する
4. Codexで新規記事HTMLを作成する
5. GPTがHTMLを確認する
6. 必要ならCodexで修正する
7. safe to merge: YES になったらマージする
8. 画像5枚を生成する
9. ユーザーが画像フォルダを作り、画像を配置する
10. 確認用URLで表示確認する
11. 表示OK後、導線追加をCodexに依頼する
12. sitemap.xml / assets/data/search-index.json / categories/circuit-basics.html / index.html の記事数を更新する
13. GPTが導線反映を確認する
14. 1記事完了として次の記事へ進む

このフローを使う場合：
- 新しい記事タイプを試す時
- テンプレートや画像ルールを変更した直後
- 1本ずつ品質確認したい時
- 表示崩れや構造ズレが心配な時

### B. 5記事まとめ制作フロー

用途：
- 同じシリーズ、同じ記事テンプレート、同じ画像ルールで進める時に使う。
- 例：GX Works3命令語シリーズ、制御の基礎シリーズ、比較・使い分けシリーズなど。
- 5記事分をまとめて作ることで、制作スピードを上げるための運用。

基本フロー：
1. 5記事分の候補を出す
2. GitHub最新 main と articles/*.html を確認し、5記事すべて既存記事と重複しないか確認する
3. 5記事分のスラッグ、カテゴリ、想定画像構成、関連記事候補を先に確定する
4. Codexまたは記事作成エージェントで、5記事分のHTMLを作成する
5. GPTまたはオーケストレーターが5記事分のHTMLを確認する
6. safe to merge: YES になったら、5記事分のHTMLをマージする
7. 5記事分の画像を生成する
   - 原則は1記事あたり必要画像をまとめて用意する
   - GX Works3命令語シリーズなら、1記事5枚 × 5記事 = 25枚
   - 画像生成時は docs/image-generation-rules.md に従う
   - 1枚1用途の原則は維持する
   - hero / ogp / overview / comparison / check-flow などを混ぜない
8. ユーザーが5記事分の画像フォルダを作り、画像を配置する
9. 5記事分の確認用URLを出す
10. ユーザーが実際の表示を確認する
11. 表示確認後、修正が必要な記事だけ修正する
12. 5記事分の記事表示がOKになったら、導線追加へ進む
13. sitemap.xml / assets/data/search-index.json / categories/*.html / index.html の記事数をまとめて更新する
14. GPTまたはオーケストレーターが導線反映を確認する
15. 5記事分をまとめて完了とする

安全ルール：
- 5記事まとめ制作でも、既存記事との重複確認は必ず5記事すべて行う。
- 5記事まとめ制作でも、各記事の canonical / og:url / meta / OGP は個別に確認する。
- 5記事まとめ制作でも、画像は1枚1用途を維持する。
- 25枚を1枚にまとめるような画像生成は禁止。
- 画像の確認は、記事ごと・画像用途ごとに行う。
- ユーザーが実際の表示を確認するまでは、導線追加へ進まない。
- 表示NGの記事がある場合は、OK記事だけ先に導線追加するか、全記事修正後にまとめて導線追加するかを確認する。
- 導線追加前に、5記事分すべての確認用URLを出す。
- 導線追加タスク中は、articles/*.html や画像本体を触らない。
- 記事HTML作成タスク中は、sitemap / search-index / categories / index.html を触らない。
- /seo/sitemap.xml は非運用なので触らない。

使い分け：
- 1記事ずつ完了フロー：
  - 初回テーマ
  - 新しいレイアウト
  - 新しい画像ルール
  - 内容の難易度が高い記事
  - 公式確認が多い記事
  - 表示崩れが心配な記事

- 5記事まとめ制作フロー：
  - 同じシリーズでテンプレートが安定している記事
  - 基礎レベルの記事
  - 画像構成がほぼ共通している記事
  - 既存記事と差別化しやすい記事
  - ユーザーがまとめ制作を明示した場合

エージェント運用時：
- オーケストレーターは、ユーザーが「まとめて作りたい」と言った場合、5記事まとめ制作フローを選択してよい。
- 記事候補提案エージェントは、5記事分の候補を出す時、各候補の重複回避理由と優先順位を明記する。
- 記事作成エージェントは、5記事分を作る場合でも、各記事のテンプレ差し替え箇所を個別に管理する。
- 画像生成エージェントは、5記事分の画像を扱う場合でも、画像ごとの用途を混ぜず、記事名・用途・ファイル名を明記する。
- GitHub導線追加エージェントは、5記事分の表示確認が終わってから導線追加を行う。

## 追加標準フロー（HTML先行・画像分割生成）
今後の新規記事制作は、以下の順番を標準とする。

1. 記事候補選定
2. 5記事分のHTMLを先に作成
3. GitHub登録・確認URL発行
4. 画像を記事ごとに5枚ずつ生成
5. 画像配置・表示確認
6. ユーザー確認
7. ユーザーOK後に導線追加
8. 公開後監査
9. safe to close 判定

運用明記:
- 5記事まとめ制作でもこの順番を守る。
- Step 1〜5では `index.html` / `categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` は触らない。
- 導線追加はStep 7で、ユーザー明示OK後にのみ行う。
- `/seo/sitemap.xml` は非運用のため触らない。
- HTML作成時点では画像未生成でも、記事固有画像の予定パスを `.png` で先に確定してよい。
- 画像生成は記事単位（5枚単位）で進め、25枚一括生成は禁止。


## 標準運用: CodexでHTML、ChatGPTで画像生成

今後の新規記事作成は、原則として以下の分担で進める。

- Codex:
  - GitHub最新main確認
  - 既存記事HTML確認
  - docs確認
  - 新規記事HTML作成
  - HTML内の画像パス確定
  - 画像ファイル名確定
  - 画像フォルダ名確定
  - レスポンシブCSS維持
  - テンプレート構造維持
  - GitHub反映
  - 画像配置後のHTML表示確認
  - ユーザーOK後の導線追加
- ChatGPT:
  - 記事画像5枚を生成
  - hero / ogp / overview / comparison / check-flow を用途別に作る
  - guide-characters のキャラクター雰囲気を維持する
  - 生成画像をCodexが指定したファイル名に合わせる

Codexは画像を生成しない。
Codexは画像生成プロンプトを勝手に簡略化しない。
CodexはHTML内で使う画像名と配置先を先に確定し、ユーザーがChatGPTで画像を作りやすい状態にする。

## Codex用 新規記事作成フロー

### Step 1: 最新状態確認

Codexは作業前に必ず以下を確認する。

- GitHub最新main
- docs/article-workflow.md
- docs/new-article-checklist.md
- docs/image-generation-rules.md
- 既存 articles/*.html
- 関連する既存記事
- 画像フォルダ命名ルール
- search-index.json の既存形式
- sitemap.xml の運用状態

注意:
- sitemap.xml だけで既存記事確認を済ませない。
- 必ず articles/*.html を直接確認する。
- /seo/sitemap.xml は非運用なので参照・更新しない。

### Step 2: 重複確認

新規記事候補が既存記事と重複していないか確認する。

確認対象:
- HTMLファイル名
- slug
- 記事タイトル
- 近いテーマの記事
- search-index.json
- sitemap.xml

重複が強い場合は作成せず、ユーザーに確認する。

### Step 3: コピー元テンプレートを選ぶ

新規記事HTMLは、完成済み記事HTMLを完全コピーして必要箇所だけ差し替える。

候補テンプレート:
- articles/relay-basic.html
- articles/forward-reverse-circuit-basic.html
- articles/lamp-indicator-circuit-basic.html
- 必要に応じて、同カテゴリ・同シリーズの最新完成記事

禁止:
- ゼロからHTML構造を作り直さない。
- CSSを新規設計しない。
- クラス名を勝手に変えない。
- 検索ヘッダーを作り直さない。
- 会話構造を作り直さない。
- 関連記事構造を作り直さない。

### Step 4: HTMLを作成する

Codexは、コピー元テンプレートを使って新規記事HTMLを作成する。

差し替えるもの:
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
- footer前後の必要文言

変更しないもの:
- CSS全体構造
- クラス名
- header/search構造
- site-search.js読み込み位置
- guide-characters画像パス
- talk-thread構造
- page-layout構造
- related-grid構造
- check-grid構造
- レスポンシブメディアクエリ

## 導線追加ルール

Codexは、新規記事HTML作成直後に導線追加しない。

導線追加は以下が完了した後に行う。

1. 記事HTMLが完成
2. ChatGPTで画像5枚が生成済み
3. 画像が assets/images/[slug]/ に配置済み
4. 公開ページで画像表示確認済み
5. ユーザーが「OK」「導線追加して」と明示

ユーザーOK前に触らない:
- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml

導線追加時に触ってよい:
- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml

絶対に触らない:
- /seo/sitemap.xml

導線追加後の確認:
- index.html に対象URLがある
- 該当 categories/*.html に対象URLがある
- search-index.json に対象URLがある
- sitemap.xml に対象URLが1回だけある
- /seo/sitemap.xml を触っていない


## 標準運用: GPTで候補確認、CodexでHTML、ChatGPTで画像生成

今後の新規記事制作は、原則として以下の役割分担で進める。

### GPT担当
- GitHub最新mainの articles/*.html を確認する
- 既存記事一覧を把握する
- 既存記事と新規候補のテーマ重複を確認する
- 記事候補を選定する
- slug / カテゴリ / 関連記事候補を決める
- Codexへ渡す記事作成指示を作る

### Codex担当
- GPTが重複確認済みとして渡した記事テーマをもとにHTMLを作成する
- 既存完成記事テンプレートを完全コピーして必要箇所だけ差し替える
- HTML内の画像フォルダ名・画像ファイル名・画像パスを確定する
- 記事固有画像は .png で指定する
- レスポンシブCSSを維持する
- GitHubへHTMLを反映する
- 画像配置後に表示確認する
- ユーザーOK後にのみ導線追加する

### ChatGPT担当
- Codexが確定した画像ファイル名に合わせて記事画像を生成する
- hero / ogp / overview / comparison / check-flow を用途別に作る
- guide-characters の既存キャラクター雰囲気を維持する
- 画像は原則 .png とする

## 記事候補の重複確認ルール

新規記事候補の重複確認は、原則としてGPTが行う。

GPTはGitHub最新mainの articles/*.html を確認し、以下を見たうえで、新規記事候補が既存記事と重複していないか判断する。

確認対象:
- 既存HTMLファイル名
- slug
- title
- h1
- meta description
- 本文テーマ
- カテゴリ
- 関連記事
- search-index.json の既存登録
- sitemap.xml の既存登録

GPTが判断する内容:
- 同じ記事がすでに存在しないか
- タイトルは違うが検索意図が近すぎないか
- 既存記事の一部として追記すべき内容ではないか
- 独立記事として分ける価値があるか
- カテゴリが適切か
- 関連記事候補が実在するか

Codexは、GPTが「重複確認済み」として渡した記事テーマをもとにHTML作成を行う。

Codex側の最低限確認:
- 同名HTMLファイルが存在しない
- 同一slugが存在しない
- 同一URLが search-index.json に存在しない
- 同一URLが sitemap.xml に存在しない

ただし、記事テーマの重複判断や候補選定はGPT側で行う。

## 導線追加ルール

Codexは、新規記事HTML作成直後に導線追加しない。

導線追加は以下が完了した後に行う。

1. 記事HTMLが完成
2. ChatGPTで画像5枚が生成済み
3. 画像が assets/images/[slug]/ に配置済み
4. 公開ページで画像表示確認済み
5. ユーザーが「OK」「導線追加して」と明示

ユーザーOK前に触らない:
- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml

導線追加時に触ってよい:
- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml

絶対に触らない:
- /seo/sitemap.xml

導線追加後の確認:
- index.html に対象URLがある
- 該当 categories/*.html に対象URLがある
- search-index.json に対象URLがある
- sitemap.xml に対象URLが1回だけある
- /seo/sitemap.xml を触っていない

## 英語記事の画像フォルダ・画像パス運用

英語記事 `en/articles/*.html` で記事固有画像を使う場合、原則として日本語記事用画像フォルダとは分けて、英語用フォルダを作る。

基本形:
- 日本語記事用: `assets/images/{slug}/`
- 英語記事用: `assets/images/{slug}-en/`

例:
- 日本語記事: `assets/images/photoelectric-sensor-basic/`
- 英語記事: `assets/images/photoelectric-sensor-basic-en/`

ルール:
- 英語記事HTMLから記事固有画像を参照する場合は、`../../assets/images/{slug}-en/` を使う。
- `og:image` と `twitter:image` も英語用画像フォルダを見る。
- `.article-hero::before` の hero 背景画像も英語用画像フォルダを見る。
- 日本語記事画像フォルダ `assets/images/{slug}/` を英語記事から流用しない。ただし意図的に共通画像として使う場合は、理由を明記して報告する。
- フォルダ名に `-en` が付く場合、画像ファイル名には原則 `-en` を重ねない。

推奨ファイル名:
- `{slug}-hero.png`
- `{slug}-ogp.png`
- `{slug}-type-overview.png`
- `{slug}-comparison.png`
- `{slug}-plc-signal-flow.png`
- `{slug}-field-checks.png`

HTML内チェック:
- `meta property="og:image"` が `assets/images/{slug}-en/{slug}-ogp.png` を参照している
- `meta name="twitter:image"` が `assets/images/{slug}-en/{slug}-ogp.png` を参照している
- `.article-hero::before` が `assets/images/{slug}-en/{slug}-hero.png` を参照している
- 本文画像が `assets/images/{slug}-en/` を参照している
- 日本語用フォルダ `assets/images/{slug}/` が英語記事内に残っていない

## 英語記事の右カラム運用

英語記事の右カラム `aside.side-rail` は、基本的に以下の2カードを標準とする。

1. `On this page`
2. `Support this site`

ルール:
- 本文内にチェックリストや図解がある場合、右カラムに同内容の `Key checks` カードを重複追加しない。
- 右カラムにカードを増やす場合は、本文との重複がないか確認する。
- `Support this site` は削除しない。
- 右カラムの収益導線が下に埋もれすぎる場合は、重複カードを削る。
- 記事ごとに右カラムを独自再設計しない。

禁止:
- `Key checks` を毎回機械的に追加する
- 本文のチェック項目と同じ内容を右カラムに重複させる
- `Support this site` を削除する
- 寄付リンクやsupport-card構造を変更する

## 英語記事の会話キャラ画像パス確認

英語記事で `talk-thread` を使う場合、会話キャラ画像は推測で書かない。

必須:
- `assets/images/guide-characters/` の実在ファイルを確認する。
- `assets/images/common/senpai-character.png` や `assets/images/common/kouhai-character.png` のような未確認パスを使わない。
- 既存記事で実際に表示されている先輩・後輩画像パスを確認してから使う。
- `div.talk-avatar > img` 構造は維持する。
- 先輩発言には先輩画像、後輩発言には後輩画像を使う。
- 画像パスは `en/articles/*.html` から見た相対パスにする。

確認コマンド例:
- `ls -la assets/images/guide-characters`
- `rg -n "talk-avatar|guide-characters|senpai|kouhai" articles/*.html en/articles/*.html`

禁止:
- 存在しないファイル名を推測で書く
- `assets/images/common/` にキャラ画像がある前提で書く
- 記事固有画像を会話アイコンとして使う
- 会話キャラ構造を変更する

## 英語記事の2ステップ公開フロー補足

英語記事を新規作成した直後は、まず確認用URLで記事単体を確認する。
確認OKが出るまでは、導線追加に進まない。

Step 1で触らないもの:
- `en/index.html`
- `en/categories/*.html`
- `assets/data/search-index.json`
- `sitemap.xml`
- `seo/sitemap.xml`

Step 1で確認するもの:
- canonical
- hreflang
- OGP / twitter image
- 英語用画像フォルダ参照
- hero画像
- 本文画像
- 会話キャラ画像
- 右カラム
- Support this site
- site-search.js の読み込み
- 確認用URL

Step 2は、ユーザーが確認用URLでOKした後だけ行う。

変更してはいけないファイル:
- 記事HTML
- 画像ファイル
- en/index.html
- en/categories/*.html
- assets/data/search-index.json
- sitemap.xml
- seo/sitemap.xml

## 英語記事の画像参照チェックルール

英語記事 `en/articles/{slug}.html` で記事固有画像を使う場合、HTML側で想定したファイル名ではなく、GitHub main 上に実在する画像ファイル名を正とする。

基本ルール:
- 英語用画像フォルダは原則 `assets/images/{slug}-en/` を使う。
- HTML出力・修正前に、必ず `assets/images/{slug}-en/` の実在ファイル名を確認する。
- `og:image`、`twitter:image`、`.article-hero::before` の hero画像は、実在する画像ファイル名に合わせる。
- 存在しない推測ファイル名をHTMLに書かない。
- 画像ファイルをリネームするより、HTML側を実在ファイル名に合わせることを優先する。

確認コマンド例:
```bash
ls -la assets/images/{slug}-en
rg -n "og:image|twitter:image|article-hero::before|assets/images/{slug}-en" en/articles/{slug}.html
```

## hero / OGP と本文画像を分けて確認するルール

画像不具合の修正では、hero / OGP / 本文画像を分けて確認する。

ルール:
- 公開ページで本文画像が表示されている場合、本文画像の `src` はむやみに変更しない。
- hero画像だけ表示されない場合は `.article-hero::before` の background URL だけ確認する。
- OGP画像だけズレている場合は `og:image` と `twitter:image` だけ確認する。
- 「画像参照がズレている」と判断して、表示できている本文画像まで一括置換しない。
- 修正範囲は、実際に不具合が出ている画像種別に限定する。

確認項目:
- hero画像が表示される
- OGP / twitter画像が実在ファイルを参照している
- 本文画像が表示されている場合は、本文画像のsrcを変更していない
- alt文だけ表示される画像がない

## 英語記事作成時の日本語記事側言語メニュー接続ルール

英語記事 `en/articles/{slug}.html` を作成した場合、対応する日本語記事 `articles/{slug}.html` の言語選択メニューも必ず確認する。

基本ルール:
- 日本語記事側の言語メニューから、英語トップ `../en/` や `../en/index.html` に飛ばさない。
- 対応する英語記事が存在する場合は、必ず同一テーマの英語記事へ直接リンクする。
- 日本語記事 `articles/{slug}.html` から英語記事へ飛ぶリンクは、原則 `../en/articles/{slug}.html` とする。
- 英語記事 `en/articles/{slug}.html` から日本語記事へ戻るリンクは、原則 `../../articles/{slug}.html` とする。

日本語記事側の推奨表示:
- 日本語記事: 現在のページ
- English article: 英語版の記事を開く

英語記事側の推奨表示:
- 日本語記事: Japanese article
- English article: Current page

禁止:
- 対応英語記事があるのに英語トップへ飛ばす
- 英語トップへのリンクを `English article` と表示する
- 日本語記事側だけ未接続のまま完了扱いにする

確認項目:
- 日本語記事 → 英語版同一記事へ飛べる
- 英語記事 → 日本語版同一記事へ戻れる
- どちらもトップページではなく、同一テーマの記事同士で相互リンクしている
