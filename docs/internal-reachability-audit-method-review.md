# Internal Reachability Audit Method Review

## 1. Purpose
- `docs/ja-en-technical-seo-audit.md` の Internal Reachability / Orphan Candidates（約211件）について、**監査方法が過剰検出になっていないか**を再検証する。  
- 本ドキュメントは**監査方法レビューのみ**を目的とし、HTML修正・記事本文修正・`sitemap`/`search-index`/`robots` の更新は行わない。

## 2. Audit Method

### 2.1 Scope (link source files)
到達性評価のリンク元として、以下を対象に `<a href="...">` を抽出した。

- `index.html`
- `en/index.html`
- `categories/*.html`
- `en/categories/*.html`
- `articles/*.html`
- `en/articles/*.html`

### 2.2 Target pages (reachability targets)
分類対象（被リンク評価対象）は以下。

- `articles/*.html`
- `en/articles/*.html`

### 2.3 href extraction and URL resolution
- HTML文字列から `<a ... href="...">` / `<a ... href='...'>` を抽出。
- 除外: `#fragment`、`mailto:`、`tel:`、`javascript:`。
- 相対URLは「リンク元HTMLの配置パス」を base にして解決。
  - 例: `categories/foo.html` 内の `../articles/bar.html` は `/articles/bar.html` に正規化。
- `/path/` は `/path/index.html` と同等扱い。

### 2.4 Channel separation (導線の分離評価)
リンク導線は次で分離して扱った。

- top 由来（`index.html`, `en/index.html`）
- category 由来（`categories/*`, `en/categories/*`）
- article 由来（`articles/*`, `en/articles/*`）
  - article本文リンク
  - related links（関連記事ブロック）
  - language-menu
- `assets/data/search-index.json` 掲載有無（サイト内検索経由の到達可能性）
- `sitemap.xml` / `seo/sitemap.xml` 掲載有無（発見可能性としては有効だが回遊導線としては弱い）

### 2.5 Orphan判定基準（今回レビュー版）
- **A**: top または category から直接到達可能
- **B**: top/category 直リンクなしだが、article/related/language-menu から到達可能
- **C**: HTMLリンク弱いが search-index で到達可能
- **D**: HTML/search-index 弱いが sitemap 掲載あり
- **E**: 実務上 orphan 候補（HTMLリンク・search-index・sitemap のいずれでも弱い）

> 重要: 「top/category 直リンクがない = orphan」とは判定しない。

## 3. Summary

- 総記事数（`articles/*.html` + `en/articles/*.html`）: **262**
- 分類件数:
  - **A: 261**
  - **B: 1**
  - **C: 0**
  - **D: 0**
  - **E: 0**
- 真の orphan 候補（E）: **0件**
- 前回 orphan 候補 約211件との差分: **-211件（211件減）**
- 判定: 前回値は、現行サイト構造を十分に含まない監査条件による**過剰検出の可能性が高い**

## 4. Reachability Classification

### A: top/category から直接到達できる記事
- 261件。
- 実務上、主要導線からの到達性は概ね確保されている。

### B: 関連記事・記事内リンクから到達できる記事
- 1件。
- 代表例: `articles/din-rail-basic.html`  
  （記事系ページからの導線はあるが、top/category の直接導線は確認できず）

### C: search-index にはあるがHTMLリンクが弱い記事
- 0件。

### D: sitemapにはあるが他導線が弱い記事
- 0件。

### E: 実務上の orphan 候補
- 0件。
- 本レビュー時点では、優先修正が必要な「真の orphan」は確認されない。

## 5. False Positive Assessment

### 5.1 前回211件が過剰検出だったか
- 結論として、**過剰検出だった可能性が高い**。

### 5.2 見落としの主な可能性
- 監査リンク元に `articles/*.html` / `en/articles/*.html` を十分に含めていなかった。
- 相対URLの解決を「リンク元HTMLの配置パス基準」で行っていなかった。
- top/category 以外（関連記事・記事内導線・language-menu）を orphan 判定に反映していなかった。
- `search-index` と `sitemap` を「補助的発見経路」として分離評価していなかった。

### 5.3 今後の監査方法改善
- 到達性監査は「主導線（top/category）」と「補助導線（article related/body, language-menu, search-index, sitemap）」を分離して多層評価する。
- 判定出力を A/B/C/D/E の固定フォーマットで定例化し、比較可能にする。
- 長大一覧は CSV 出力を別成果物に分離し、レビュー文書では E候補と代表例中心に提示する。

## 6. Hub-Based Rescue Candidates

今回の再検証では E=0 のため「救済必須」対象はなし。ただし、B群（深い回遊導線のみのページ）が増える場合に備え、以下のハブ設計を優先候補として維持する。

- Air Pneumatic Troubleshooting Guide: 将来の空圧系 B/C 群の受け皿
- Control Panel Noise Reduction Basics: ノイズ/EMI 系 B/C 群の受け皿
- PLC Input and Output Troubleshooting Guide: PLC I/O 系 B/C 群の受け皿
- Sensor Signal Basics: センサ信号系 B/C 群の受け皿
- Control Panel Wiring Basics: 配線・端子・施工系 B/C 群の受け皿
- Relay and Circuit Troubleshooting Guide: リレー/回路保護系 B/C 群の受け皿

## 7. Recommended Next Fix PRs

小さく分割して、以下順で提案する。

1. Air Pneumatic hub design/report PR
2. Control Panel Noise hub design/report PR
3. search-index / category reachability fix PR
4. truly orphan articles link fix PR
5. category page link coverage improvement PR

補足:
- 現時点で E=0 のため、3〜5 は「再監査で E>0 が出た場合に着手」の条件付き実施が妥当。

## 8. Recommendation

**次に実施すべき作業は「ハブ設計PR（1. Air Pneumatic hub design/report PR）」を先行すること。**

理由:
- 現時点で真の orphan（E）は確認されず、緊急の HTML リンク修正は優先度が低い。
- 先にハブ方針を確定することで、将来の B/C 群増加時に一貫した内部リンク実装が可能になる。
- Whitepaper の Topic Cluster / Technical SEO 優先方針とも整合する。

---

PR note (for reviewers):
- internal reachability audit method review only
- HTML変更なし
- 記事本文変更なし
- sitemap/search-index変更なし
- safe to review
