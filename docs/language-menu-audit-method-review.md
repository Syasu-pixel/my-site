# Language Menu Audit Method Review

## 1. Purpose
`docs/ja-en-technical-seo-audit.md` で言及されている language-menu の broken 候補 443 件について、**監査方法が過剰検出していないか**を再検証する。

本レビューは **main 相当の基準コミット（`8cbe2e6`）**を対象に、修正ではなく検証レポートのみを作成する。

## 2. Audit Method
以下の手順で検証した。

1. 基準コミット `8cbe2e6` の全 HTML を列挙。
2. 各 HTML から `language-menu-panel` 内の `a.language-menu-item[href]` を抽出。
3. `href` を「その HTML の配置ディレクトリ」を base に解決。
   - 例: `categories/control-basics.html` で `../en/categories/control-basics.html`
   - 例: `en/categories/control-basics.html` で `../../categories/control-basics.html`
   - 例: `articles/noise-filter-basic.html` で `../en/articles/noise-filter-basic.html`
   - 例: `en/articles/noise-filter-basic.html` で `../../articles/noise-filter-basic.html`
4. 解決後パスについて、次の実在判定を実施。
   - 直接 `.html` が存在するか
   - ディレクトリ参照（`../en/`, `./`, `../../` など）の場合、`index.html` に解決できるか
5. 集計カテゴリを分離。
   - 実際に正しく解決できる相対リンク
   - 本当に存在しないファイルへ向くリンク
   - 独自ドメインでは問題ないが GitHub Pages サブパスでは注意が必要なルート相対リンク
   - language-menu 仕様として `/en/` へ逃がしているリンク

## 3. Findings
基準コミット `8cbe2e6` における抽出結果:

- language-menu 内リンク総数: **393**
- 相対リンクとして正しく解決: **393**
- 実在しないリンク（真の broken）: **0**
- ルート相対リンク（`/...`）: **0**
- `/en/` への仕様フォールバック（ルート相対）: **0**

補足:
- `../en/` は 35 件存在したが、いずれも `en/index.html` へ解決できる。
- `./` や `../../` などのディレクトリ参照も、`index.html` 解決を考慮すれば broken にはならない。

## 4. False Positive Assessment
結論として、**broken 候補 443 件の大部分（または全件）は監査手法由来の過剰検出である可能性が高い**。

過剰検出が起きる典型要因:

- `../en/` を「`en` というファイルがない」と判定してしまい、`en/index.html` への解決を見ない。
- `./` や `../../` を正規化後に `.` となった際、ルート `index.html` への解決を見ない。
- 相対 URL を「ファイル位置基準」で解決せず、文字列ベースでのみ判定する。

したがって、`language-menu` の broken 監査は **URL 解決 + index 補完**を含む必要がある。

## 5. Real Broken Links
今回の main 基準レビューでは、language-menu 内リンクに **真の broken は 0 件**。

- 「存在しない英語カテゴリに飛ばす」問題は、基準コミット時点では主に `../en/` フォールバックで回避されており、リンク切れではなく仕様上の遷移（ENトップ）として機能している。

## 6. Production Domain vs GitHub Pages Path Risk
main 基準ではルート相対リンクが無いため、以下リスクは **現時点で未発生**。

- ルート相対（`/en/`, `/categories/...`）は独自ドメイン直下運用では明快。
- ただし GitHub Pages のサブパス運用（例: `/my-site/...`）では、`/...` がリポジトリルートを指して 404 になり得る。

つまり、ルート相対化を進める場合は「本番配信パス前提（独自ドメイン直下か、サブパスか）」を明示した上で監査・適用する必要がある。

## 7. Recommendation
1. **language-menu normalization は継続してよい**（可読性・一貫性の観点）。
2. ただし、**相対パスのままで正しく解決できる箇所は broken 扱いにしない**（今回の main では多数）。
3. ルート相対に統一する方針を取る場合は、**独自ドメイン直下前提を運用条件として明記**する。
4. 監査ルールを次の順序に更新する。
   - (a) base 解決
   - (b) `index.html` 補完
   - (c) 実在確認
   - (d) サブパス運用時の注意喚起（broken と区別）

## 8. Next Action
- 監査ドキュメント側で、`broken` と `environment-dependent risk`（配信パス依存）を別カテゴリ化する。
- `language-menu` の将来改修を行う場合は、先に「配信前提（独自ドメイン / GitHub Pages）」を固定し、判定基準を統一する。
- 本レビューは監査方法の見直しが目的であり、**今回は HTML 修正は行わない**。
