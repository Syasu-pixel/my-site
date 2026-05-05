# CODEX反映ルール（codex update rules）

## 前提
- 記事HTMLと画像はユーザーが先にGitHubへ入れる。
- CODEXはメタ更新・導線更新を中心に反映する。
- 記事制作は原則2ステップ完了フローで進める。Step 1では記事HTML・画像・確認用URLまで作成し、導線追加は行わない。ユーザーが確認用URLを確認してOKした後のみ、Step 2として index.html、categories/*.html、assets/data/search-index.json、sitemap.xml へ導線追加する。
- 途中確認は原則不要。ただし、導線追加前（Step 2開始前）のユーザー確認は必須。
- 導線追加エージェントは、ユーザー明示OK前に実行しない。

## 一括反映ルール
- 記事HTMLと画像は、1記事ずつユーザーがGitHubへ追加する。
- その後、3〜5記事分をまとめてCODEXで以下へ反映してよい。
  - `index.html`
  - `categories/*.html`
  - `assets/data/search-index.json`
  - `sitemap.xml`
  - トップページの記事数表示
- ただし、CODEXは原則 `articles/**` と `assets/images/**` を触らない。
- 5記事まとめ制作フローでも2ステップ制を適用し、Step 1完了とユーザーOK後のStep 2（導線追加）を分離する。

## CODEXの主な反映対象
- トップページ
- カテゴリページ
- `assets/data/search-index.json`
- `sitemap.xml`
- 記事数表示

## トップページ導線の運用ルール
- 新記事を反映するとき、`index.html` の右カラムにある「新着記事」は更新してよい。
- `index.html` の「カテゴリから探す」内にある各カテゴリ棚リンクは、代表記事だけを見せる入口として扱う。
- 新記事を追加するたびに、カテゴリ棚へ5件目・6件目・7件目のようにリンクを増やさない。
- カテゴリ棚は原則として各カテゴリ4件前後までに抑える。
- 新記事をトップ棚へ出したい場合は、既存代表記事との「追加」ではなく「入れ替え」として扱う。
- カテゴリ棚へ追加・入れ替えを行う場合は、ユーザーが明示的に希望したときだけ行う。
- 新記事の通常反映先は、カテゴリページ、検索インデックス、サイトマップ、右カラム新着記事を基本とする。

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

## safe to merge 条件
以下を満たす場合に **safe to merge** とする。
- `search-index` に missing / extra / duplicate がない。
- `sitemap.xml` に重複がない。
- 更新対象が想定範囲（トップ、カテゴリ、search-index、sitemap、記事数表示）に収まっている。
- 非運用対象（`/seo/sitemap.xml`）を変更していない。
- 対象記事の画像ファイルが存在している。
- トップページの記事数表示が `search-index` のカテゴリ別件数と一致している。
- articles count と search-index article urls count が一致している。
- 新記事追加時に、ユーザーの明示なしでトップページのカテゴリ棚リンクを増やしていない。
- トップページのカテゴリ棚を変更した場合は、代表記事の入れ替えとして理由が説明されている。

上記を満たさない場合は **not safe** とする。
