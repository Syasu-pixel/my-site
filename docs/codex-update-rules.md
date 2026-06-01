# CODEX反映ルール（codex update rules）

## 前提
- 記事HTMLと画像（完成HTML）は、ChatGPT作成後にユーザーまたはChatGPTから受領したものを前提にする。
- Codexは記事本文をゼロから執筆せず、配置・整合チェック・導線更新を中心に反映する。
- 記事制作は原則2ステップ完了フローで進める。Step 1では記事HTML・画像・確認用URLまで作成し、導線追加は行わない。ユーザーが確認用URLを確認してOKした後のみ、Step 2として index.html、categories/*.html、assets/data/search-index.json、sitemap.xml へ導線追加する。
- 途中確認は原則不要。ただし、導線追加前（Step 2開始前）のユーザー確認は必須。
- 導線追加エージェントは、ユーザー明示OK前に実行しない。


## Codexタスクの分離（必須）

### A. Step 1 配置タスク
- ユーザーまたはChatGPTが完成HTMLを渡す。
- Codexは指定パスへ配置する。
- Codexは画像ファイルの配置を確認する。
- Codexは記事本文を大きく書き換えない。
- Codexは導線追加をしない。
- 報告は `safe to merge: YES / NO`。

### B. Step 2 導線追加タスク
- 確認用URLをユーザーが確認済みであることを前提に開始する。
- Step 2は原則 Step 2-A（基本導線・検索整合）を先に実施し、既存記事への関連記事追加が必要な場合のみ Step 2-B を別タスクで実施する。
- Codexは導線追加を行う。
- `index / category / search-index / sitemap / backlog` を更新する。
- 記事HTMLと画像は原則変更しない。
- `/seo/sitemap.xml` は非運用なので触らない。
- 報告は `safe to close: YES / NO`。


## Step 2導線追加の分離ルール

Step 2は、原則として Step 2-A と Step 2-B に分ける。

### Step 2-A: 基本導線・検索整合

新規記事の確認用URLをユーザーが確認済みの場合、まず以下のみを更新する。

- categories/*.html
- assets/data/search-index.json
- sitemap.xml
- docs/article-backlog.md

Step 2-Aでは、以下を触らない。

- articles/**
- assets/images/**
- en/**
- index.html
- seo/sitemap.xml

Step 2-Aでは、既存記事への関連記事カード追加は行わない。
カテゴリページ、検索インデックス、サイトマップ、バックログに反映できていれば、基本導線は確保済みと判断する。

### Step 2-B: 既存記事への関連記事追加

既存記事への関連記事追加が必要な場合だけ、Step 2-Aとは別タスクで実施する。

Step 2-Bのルール:

- 対象記事は原則1本ずつに限定する。
- 複数記事へ一括で関連記事カードを追加しない。
- related-card は、各記事の「あわせて読みたい記事」セクション内の .related-grid の中にだけ追加する。
- talk-thread 内、本文途中、会話ブロック直後、section本文内には related-card を置かない。
- 既存の talk-thread、talk-row、talk-avatar、talk-bubble、閉じタグ、インデントを変更しない。
- 既存の関連記事カードを削除しない。
- 1行圧縮HTMLや構造が読み取りにくい記事には、無理に関連記事カードを追加しない。
- 追加位置が安全に特定できない場合は not safe と報告し、変更しない。
- articles/** を触る場合は、対象記事名と変更箇所をPR本文に明記する。
- safe to merge 判定では、talk-thread 周辺に差分が出ていないことを確認する。

## 一括反映ルール
- 記事HTMLと画像は、1記事ずつユーザーがGitHubへ追加する。
- その後、3〜5記事分をまとめてCODEXで以下へ反映してよい。
  - `index.html`
  - `categories/*.html`
  - `assets/data/search-index.json`
  - `sitemap.xml`
  - カテゴリページや必要な一覧ページの記事数表示
- ただし、CODEXは原則 `articles/**` と `assets/images/**` を触らない。
- 5記事まとめ制作フローでも2ステップ制を適用し、Step 1完了とユーザーOK後のStep 2（導線追加）を分離する。

## CODEXの主な反映対象
- トップページ
- カテゴリページ
- `assets/data/search-index.json`
- `sitemap.xml`
- カテゴリページや必要な一覧ページの記事数表示

## トップページ導線の運用ルール
- 新記事を反映するとき、`index.html` の右カラムにある「新着記事」は更新してよい。
- `index.html` の「カテゴリから探す」内にある各カテゴリ棚リンクは、代表記事だけを見せる入口として扱う。
- 新記事を追加するたびに、カテゴリ棚へ5件目・6件目・7件目のようにリンクを増やさない。
- カテゴリ棚は原則4件固定とする。
- 新記事をトップ棚へ出したい場合は、既存代表記事との「追加」ではなく「入れ替え」として扱う。
- カテゴリ棚へ追加・入れ替えを行う場合は、ユーザーが明示的に希望したときだけ行う。
- 新記事の通常反映先は、カテゴリページ、検索インデックス、サイトマップ、右カラム新着記事を基本とする。
- `index.html` / `en/index.html` のメインカテゴリ棚は、表示記事リンクを原則4件固定とする。
- メインカテゴリ棚に `すべてを見る` / `View all` ボタンは戻さない。
- メインカテゴリ棚に `Articles: xx` / 記事数表示は戻さない。
- 棚のラベル・画像・説明エリアをカテゴリトップへのリンクとして扱う。
- 右側の1〜4記事リンクは個別記事リンクとして維持する。
- カテゴリトップへの導線は「すべてを見る」ボタンではなく、棚の主エリアリンクで担保する。
- 新記事追加時にトップ棚へ5件目を追加しない。必要な場合は既存4件との入れ替えとして扱う。

## トップページ表示件数の固定ルール

- `index.html` / `en/index.html` の各カテゴリ棚・カード棚・リンク棚は、原則4件表示に固定する。
- 新記事を追加するたびに、カテゴリ棚へ5件目・6件目として単純追加しない。
- 新記事をトップ棚へ出す場合は、既存4件のうち1件との入れ替えとして扱う。
- 入れ替えを行った場合、PR本文で「追加した記事」と「外した記事」を明記する。
- Top page の New articles / 新着記事（`index.html` / `en/index.html` の右カラム新着リスト）は、**必ず6件表示**に固定する。
- 5件・7件・10件など可変運用にしない（明示的な指示がある場合のみ変更可）。
- 新着リストに新記事を追加する場合は、常に最新・適切な6件になるよう古い記事を押し出す。
- 7件目以降をそのまま追加して、トップページを縦に間延びさせない。
- ただし既存の個別設計がある場合は、その設計を壊さず、表示件数を増やし続けない方針を優先する。
- Step 2導線追加時は、トップ棚4件固定・新着6件固定を確認してから `safe to close` を出す。
- `en/index.html` の `Popular articles` は10件固定とする
- 新記事を追加するたびに `Popular articles` へ11件目、12件目として単純追加しない
- `Popular articles` に新記事を入れる場合は、既存10件のうち1件との入れ替えとして扱う
- 入れ替えを行った場合、PR本文で「追加した記事」と「外した記事」を明記する
- Step 2導線追加時は、`Popular articles` が10件以内か確認してから `safe to close` を出す
- `en/index.html` の右カラムに `Series` カードは戻さない
- 英語トップ右カラムの基本構成は `Popular articles` / `New articles` / `Bookmark this page` / `Support this site` とする
- `en/index.html` の `New articles` は6件固定とする

## 言語メニュー更新ルール

- 日本語記事 `articles/{slug}.html` に対応する英語記事 `en/articles/{slug}.html` を追加した場合、日本語記事側の言語メニューの英語リンクは英語記事へ直接向ける。
  - 例: `../en/articles/{slug}.html`
- 英語リンクの補足文言は、英語トップへ向ける場合のみ `English top` とする。
- 英語記事へ直接向ける場合は `English article` とする。
- href だけを英語記事へ変更して、表示文言が `English top` のまま残らないように確認する。
- 言語メニュー更新時は、本文・CSS・画像パス・検索フォーム・`site-search.js` は触らない。

## 関連記事リンク実在確認ルール

- 英語記事 `en/articles/{slug}.html` の Related articles / おすすめ記事カードは、必ず `en/articles/` 配下に実在するHTMLだけをリンク先にする。
- 日本語記事 `articles/{slug}.html` が存在していても、対応する英語記事 `en/articles/{slug}.html` が未作成の場合は、英語記事の関連記事カードには入れない。
- 関連記事候補を選ぶときは、リンク先ファイルの存在確認を行う。
- 存在しない英語記事リンクがある場合は、実在する英語記事へ差し替える。
- 関連記事カードは無理に6件固定にしない。3〜6件の範囲で、実在する記事だけにする。
- Step 1でGPTが英語記事HTMLを作成する場合も、Related articles は実在する英語記事だけで構成する。
- Step 2導線追加時にも、Related articles のリンク実在確認を再チェックする。
- 404候補が見つかった場合は、記事本文・CSS・画像・meta を触らず、Related articles 内の該当カードのみ最小修正してよい。
- PR本文には、Related articles の実在確認結果と、差し替えたリンクがあればその内容を明記する。

## 変更対象の原則
- `articles/**` と `assets/images/**` は原則触らない。
- 必要に応じて以下のみを触る。
  - `index.html`
  - カテゴリページ
  - `assets/data/search-index.json`
  - `sitemap.xml`
- `/seo/sitemap.xml` は非運用のため触らない。

## search-indexチェック
- `search-index` の以下を確認する。
  - missing
  - extra
  - duplicate

## sitemapチェック
- `sitemap.xml` の重複URL有無を確認する。
- 追加・削除された記事URLとの整合性を確認する。


## Bing / IndexNow 運用ルール
- このサイトでは、Bing および IndexNow 対応検索エンジン向けの更新通知として IndexNow を導入済み。
- サイトルートの IndexNow キー確認ファイル `d6f8bcb2c7d94f1caef4e8b7f25a1d03.txt` は削除・リネームしない。
- `.github/workflows/indexnow.yml` は、`main` への push 時に変更されたHTML URLをIndexNow APIへ通知するための GitHub Actions workflow として維持する。
- 通常の記事更新では、IndexNow用の手動作業を追加しなくてよい。
- HTML記事、カテゴリページ、トップページ、問い合わせページを更新して `main` へマージすると、対象URLが自動通知される。
- docs / assets / sitemap / search-index / CSS / JS のみの変更では、IndexNow通知対象外でよい。
- IndexNowは Bing / IndexNow 対応検索エンジン向けの更新通知であり、Googleへの直接施策ではない。
- Google向けには、通常どおり sitemap、内部リンク、Search Console のURL検査、自然クロールを前提にする。
- GitHub Actions の `Notify IndexNow` が失敗した場合のみ、Actionsログを確認して修正する。

## SEOタグ・IndexNow関連PR確認ルール
- SEOタグのみを変更するPRでは、title / canonical / og:url / og:image / twitter:image / robots / sitemap / search-index に意図しない変更がないか確認する。
- meta descriptionだけの変更であれば、原則として表示崩れリスクは低い。
- ただし、HTML構文を壊していないかは確認する。
- IndexNow関連PRでは、既存HTMLや画像・CSS・sitemap・search-indexを変更していないか確認する。

## safe to merge 条件
以下を満たす場合に **safe to merge** とする。
- `search-index` に missing / extra / duplicate がない。
- `sitemap.xml` に重複がない。
- 更新対象が想定範囲（トップ、カテゴリ、search-index、sitemap、カテゴリページ等の必要な記事数表示）に収まっている。
- 非運用対象（`/seo/sitemap.xml`）を変更していない。
- 対象記事の画像ファイルが存在している。
- カテゴリページ等に記事数表示がある場合は、`search-index` のカテゴリ別件数と一致している。
- トップページのカテゴリ棚に記事数表示を再追加していない。
- トップページのカテゴリ棚が4件固定、`New articles` / `新着記事` が6件固定、`en/index.html` の `Popular articles` が10件固定である。
- articles count と search-index article urls count が一致している。
- 新記事追加時に、ユーザーの明示なしでトップページのカテゴリ棚リンクを増やしていない。
- トップページのカテゴリ棚を変更した場合は、代表記事の入れ替えとして理由が説明されている。

上記を満たさない場合は **not safe** とする。

## 追加整合ルール（HTML先行・画像分割生成）
- 5記事まとめ制作時も、まず5記事分のHTMLを先に完成させる。
- 画像生成はHTML作成後に、記事ごとに5枚ずつ実施する（25枚一括生成しない）。
- 導線追加は、画像表示確認まで完了し、ユーザーが確認用URLを見て明示OKした後のみ実施する。
- Step 1〜5（候補選定〜画像表示確認）では、`index.html` / `categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` を更新しない。
- `/seo/sitemap.xml` は非運用のため変更禁止。


## Step 1 配置タスク後のCodex報告形式

Summary:
- 作成した記事タイトル
- 作成したHTMLファイル
- コピー元テンプレート
- 画像フォルダ
- 画像5枚のファイル名
- 導線追加は未実施

Image handoff:
- ChatGPTで生成する画像順
- 各画像の用途
- HTML内の画像パス

Checks:
- HTMLテンプレート維持
- PNG参照
- OGP/Twitter画像URL
- レスポンシブCSS維持
- iPad幅hero確認
- 関連記事リンク実在確認
- 旧サイト名なし

判定:
safe to move to image generation: YES / NO

## GPTが英語記事HTMLを書き出す場合の報告形式

英語記事HTMLをCodexではなくGPTが直接作成する場合も、いきなりHTMLだけを出さず、先に以下の形式で整理する。
Step 1 / Step 2 の分離は維持し、導線追加はユーザー確認後のStep 2でのみ実施する。

Summary:
- 作成する英語記事タイトル
- 作成するHTMLファイル
- 日本語元記事
- コピー元テンプレート
- 画像フォルダ
- 画像5枚のファイル名
- 導線追加は未実施であること

Image handoff:
- 画像生成順
- 各画像の用途
- HTML内の画像パス
- OGP/Twitter画像パス

Checks:
- テンプレート構造維持
- Support this site 2ボタン維持
- site-search.js 1回のみ
- レスポンシブCSS維持
- 関連記事リンク実在確認
- 旧サイト名なし
- Step 1では index.html / categories/*.html / assets/data/search-index.json / sitemap.xml を触らない
- /seo/sitemap.xml は非運用なので触らない

判定:
safe to move to image generation: YES / NO

その後にHTML本体を書き出す。

## 画像配置後のCodex報告形式

Summary:
- 配置した画像5枚
- 更新したファイル
- 表示確認したURL

Checks:
- hero表示OK
- OGP画像パスOK
- overview表示OK
- comparison表示OK
- check-flow表示OK
- PC表示OK
- スマホ表示OK
- iPad / iPad Pro相当表示OK

判定:
safe to request route addition: YES / NO

## 導線追加後のCodex報告形式

Summary:
- 導線追加した記事
- 更新したファイル
- 追加した場所

Checks:
- index.html に対象URLあり
- categories/*.html に対象URLあり
- search-index.json に対象URLあり
- sitemap.xml に対象URLが1回だけあり
- /seo/sitemap.xml 未変更
- トップページの各カテゴリ棚が4件固定を守っている
- トップページの新着記事 / 右カラム新着リストが10件以内である
- 新記事を棚に出した場合、追加ではなく入れ替えである
- 入れ替えた記事と外した記事をPR本文に明記している
- PR本文に safe to merge: YES / NO を明記している
- 表示数を増やしてトップページを縦に間延びさせていない

判定:
safe to close: YES / NO
