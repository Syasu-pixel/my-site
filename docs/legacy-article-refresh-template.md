# 古い記事リフレッシュ運用テンプレート（現在スタイル統一）

## 1. 目的
- 古い工具記事・古い記事HTMLを、現在の固定ヘッダー・検索フォーム・右カラム・カード構造・コピー方式に統一する。
- 記事URLを変えずに、見た目・読みやすさ・関連記事導線・商品導線を改善する。

## 2. 基本方針
- 最新GitHubの対象記事HTMLを必ず確認してから作業する。
- 完成済み記事HTMLをコピーして、必要箇所だけ差し替える。
- 見た目だけ似せるのではなく、固定ヘッダー・検索フォーム・右カラム・`section-card`・`related-grid` などの構造を維持する。
- 古い記事の本文・商品情報・Amazonリンク・画像パスは勝手に消さない。
- 記事URLは変更しない。

## 3. 維持するもの
- canonical URL
- 既存のAmazonリンク
- 既存の商品画像パス
- 既存の重要本文
- 既存の内部リンクで有効なもの
- 既存のOGP画像（ただし明示があれば差し替え可）

## 4. 今のスタイルへ寄せるもの
- 固定ヘッダー
- サイト内検索フォーム
- パンくず
- ヒーロー
- 向いている人 / まだ不要な人 / 先に結論
- この記事でわかること
- 右カラムの目次・まとめ
- `section-card`
- `talk-thread`
- `article-figure`
- `check-grid`
- `table-wrap`
- `related-grid`
- footer
- `site-search.js`

## 5. 工具記事で特に注意すること
- 商品カードのAmazonリンクを壊さない。
- 画像クリックでAmazonへ行く導線を維持する。
- 1位カードだけ強調する既存方針を守る。
- 商品説明は売り込みすぎない。
- 向いている人 / まだ不要な人 / 使い分けを明確にする。
- 関連記事は前工程・後工程・一緒に使う工具へ自然につなげる。

## 6. 追加点検（画像・OGP・メタ情報）
古い記事を現在のスタイルへ統一する時は、見た目だけでなく以下も必ず点検する。

- ヒーロー画像の有無
- OGP画像の有無
- `og:image` / `twitter:image` が記事固有画像になっているか
- canonical が正しいか
- meta description が現在の記事内容に合っているか
- 本文補助画像が不足していないか
- 商品画像やAmazonリンクが維持されているか
- 関連記事が3〜6件あるか
- `search-index.json` の `title` / `description` / `keywords` 更新が必要か

### 6.1 画像が不足している場合
- `docs/image-generation-rules.md` に従って画像追加候補を提案する。
- ヒーロー画像はOGP兼用できる構図にする。
- 人物を入れる場合は `assets/images/guide-characters/` の既存2人を基準にする。
- 画像フォルダは記事スラッグに合わせる。
- 画像は用途ごとに別ファイルにする。

### 6.2 OGP更新ルール
- 古い記事で共通OGPや汎用画像を使っている場合は、記事固有のヒーロー画像またはOGP兼用画像への差し替えを検討する。
- ただし、画像ファイルがまだ存在しない場合は、勝手にHTMLだけ差し替えない。
- 画像生成・画像保存後にHTMLの `og:image` / `twitter:image` を更新する。

### 6.3 search-index更新ルール
- URLが変わらないリフレッシュ作業では、`sitemap.xml` は原則触らない。
- `title` / meta description / 記事内容を大きく変更した場合は、`assets/data/search-index.json` の `title` / `description` / `keywords` / `synonyms` 更新を検討する。
- `/seo/sitemap.xml` は非運用なので触らない。


確認コマンド：
- `rg -n "OGP|og:image|twitter:image|ヒーロー画像|記事固有|meta description|search-index|image-generation-rules|guide-characters" docs/legacy-article-refresh-template.md`

## 7. 禁止事項
- 記事URLを変更しない。
- 既存Amazonリンクを削除しない。
- 画像パスを未確認で変更しない。
- 関係ない記事やカテゴリページを触らない。
- 固定ヘッダーや右カラムを独自に作り直さない。
- `site-search.js` を重複読み込みしない。
- `/seo/sitemap.xml` を触らない。

## 8. CODEX依頼テンプレ
以下の形式を使って依頼する。

```md
目的：
古い記事を現在のサイトスタイルへ統一してください。

対象ファイル：
- articles/xxxx.html

コピー元の基準記事：
- articles/relay-basic.html
または
- articles/lamp-indicator-circuit-basic.html

触ってよいファイル：
- articles/xxxx.html

触らないファイル：
- index.html
- categories/**
- assets/data/search-index.json
- sitemap.xml
- assets/images/**
- /seo/sitemap.xml

重要：
記事URL、既存Amazonリンク、商品画像パス、canonicalは原則維持してください。
固定ヘッダー、検索フォーム、右カラム、section-card、related-grid は現在のテンプレに合わせてください。
本文は削りすぎず、現在の読みやすい構造へ移植してください。

Testing：
- rg -n "site-search.js|canonical|amazon|amzn|related-grid|section-card|side-rail|article-hero" articles/xxxx.html
- site-search.js が1回だけ読み込まれているか確認
- 画像パスが存在するか確認
- Amazonリンクが消えていないか確認
- 関連記事リンクが実在するか確認

報告形式：
Summary
- 統一した構造
- 維持したリンク・画像
- 更新した見出し・関連記事
- 変更ファイル

Testing
- rg確認結果
- site-search.js重複確認
- 画像存在確認
- Amazonリンク確認

判定
safe to merge / not safe
```


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
