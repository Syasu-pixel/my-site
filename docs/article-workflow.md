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
