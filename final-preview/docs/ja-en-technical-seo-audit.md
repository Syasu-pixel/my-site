# JA/EN Technical SEO Audit

## 1. Purpose
- This audit follows `docs/denkicontrol-strategy-whitepaper.md` section 5 (JA/EN strategy), section 9 (technical SEO priorities), and section 12 (next actions).
- This document is **audit report only**. No production HTML, sitemap, robots, search-index, or article body changes were made.
- Goal: identify gaps and prioritize next fix PRs.

## 2. Summary
- Overall judgment: **mostly healthy foundation with localized navigation defects and internal reachability weakness**.
- Major positives:
  - Canonical coverage is complete and consistent for top, article, and category pages.
  - Hreflang (`ja` / `en` / `x-default`) is consistent on JA/EN paired article pages.
  - Sitemap coverage includes audited top/article/category pages and has no obvious dead URLs.
- Main risks:
  1. Relative-path interpretation in language-menu links can create broken counterpart navigation in audit checks and likely in some rendered contexts.
  2. Large set of article pages appears weakly reachable from top/category entry points (orphan candidates at practical level).
  3. JA-only inventory remains sizable (40 slugs), so EN expansion priorities should be explicit.

## 3. Scope
- Audited files/folders:
  - `index.html`, `en/index.html`
  - `articles/*.html`, `en/articles/*.html`
  - `categories/*.html`, `en/categories/*.html`
  - `sitemap.xml`, `robots.txt`
  - `seo/sitemap.xml` existence/reference check only (non-operational assumption)
- Out of scope:
  - content rewriting, HTML structure updates, canonical/hreflang/language-menu/sitemap/robots fixes
  - design/UI updates

## 4. JA/EN Counterpart Mapping
- Counts:
  - JA article slugs: **151**
  - EN article slugs: **111**
  - JA/EN counterpart pairs (same slug): **111**
  - JA only: **40**
  - EN only: **0**

### JA/EN 両方あり（111）
- 主要な paired 基盤は成立（個別一覧は長大のため省略。必要なら次PRでCSV化）。

### 日本語のみ（40）
- `air-cylinder-troubleshooting-basic`
- `anchor-fixing`
- `bandsaw`
- `cable-cutter`
- `charging-tools`
- `charging-tools-accessories`
- `crimping-hydraulic-vs-electric`
- `crimping-tips`
- `crimping-tools`
- `cutting-tools`
- `dc24v-common-basic`
- `din-rail-cutter`
- `driver`
- `electrician-knife`
- `gx-works3-cross-reference-basic`
- `gx-works3-device-monitor-basic`
- `gx-works3-force-on-off-basic`
- `gx-works3-monitor-basic`
- `hydraulic-punch`
- `ladder-and-or-basic`
- `ladder-work-platform`
- `lan-checker`
- `mega`
- `nipper`
- `pipe-wiring-tips`
- `plc-error-lamp-troubleshooting-basic`
- `plc-io-allocation-basic`
- `plc-output-troubleshooting-basic`
- `plc-scan-basic`
- `plc-tc-device-basic`
- `plc-xymd-device-basic`
- `pliers`
- `ratchet-wrench`
- `sensor-2wire-3wire-basic`
- `steel-wire`
- `stripper`
- `tajima-sef-boxes`
- `tepra-vs-lettertwin`
- `tester`
- `tool-belt`

### 英語のみ
- 該当なし。

### 注意が必要な対応関係
- スラッグ対応自体は良好だが、language-menu の相互遷移はリンク書式に改善余地あり（詳細は section 7）。

## 5. Canonical Findings
### 問題なし
- `index.html` canonical: `https://denkicontrol.com/` を参照。
- `en/index.html` canonical: `https://denkicontrol.com/en/` を参照。
- `articles/*.html` は `https://denkicontrol.com/articles/{slug}.html` に一致。
- `en/articles/*.html` は `https://denkicontrol.com/en/articles/{slug}.html` に一致。
- `categories/*.html` / `en/categories/*.html` は自己参照 canonical。
- canonical 欠落: **0**
- canonical 別言語誤参照: **0**
- URL形式の不自然 canonical: **検出なし**

### 問題候補
- 現時点では重大候補なし。

### 修正優先度
- **Low**（監視継続）

## 6. Hreflang Findings
### 問題なし
- JA/EN paired 111 スラッグで、`ja` / `en` / `x-default` の基本セットは両言語ページで確認。
- `ja` は日本語 URL、`en` は英語 URL を参照。
- 明確な相互不整合は未検出。

### 問題候補
- ページ種別（カテゴリやトップ）での `x-default` 方針の厳密統一は、別途テンプレート横断で目視確認を推奨。

### 修正優先度
- **Low-Medium**（次回テンプレート監査で最終確認）

## 7. Language Menu Findings
### 問題なし
- paired 記事に language-menu 自体は概ね存在。

### 問題候補
- 相対パス書式（例: `./{slug}.html`, `../en/articles/{slug}.html`, `../../articles/{slug}.html`）により、監査上は多数のリンク解決不整合候補を検出。
- 監査抽出上の broken 候補: **443**（重複含む）
- リスク内容:
  - 実行コンテキスト次第で同一URL再読込や誤階層解決を起こす可能性。
  - 将来テンプレート差分時にリンク事故を招きやすい。

### 修正優先度
- **High**（canonical/hreflang と並ぶ実運用上の主要修正候補）

## 8. Sitemap Findings
### 問題なし
- `sitemap.xml` に日本語トップ・英語トップを含む。
- `articles/*.html` / `en/articles/*.html` / `categories/*.html` / `en/categories/*.html` の対象範囲は監査時点で網羅。
- sitemap 掲載URLの実在性チェックで欠損候補は未検出。

### sitemapにない実在ページ
- 監査対象範囲（top/articles/categories）では未検出。

### sitemapにあるが実在しない可能性があるページ
- 監査対象範囲では未検出。

### `seo/sitemap.xml` について
- 現在の作業ツリーでは `seo/sitemap.xml` は存在を確認できず（非運用前提と整合）。
- ただし、将来の再導入時は `robots.txt` / Search Console 送信先との二重運用混乱に注意。

### 修正優先度
- **Low**（現状維持、運用ルール明記のみ）

## 9. Noindex / Robots Findings
- `meta robots` の `noindex` / `nofollow` は監査対象HTMLで未検出。
- `robots.txt` は存在し、主要パス（`/` や `/en/` を含む）を広範にブロックする設定は未検出。
- 不自然な robots 指定は現時点では重大検出なし。

## 10. Internal Reachability / Orphan Candidates
- トップ/カテゴリ起点のリンク抽出ベースで、到達性が弱い（実務上 orphan 候補）記事が多数。
- 候補数（粗抽出）: **211**。
- 傾向:
  - ツール系/比較系/トラブルシュート系の一部がトップカテゴリ導線に十分載っていない。
  - JA/ENともに深い記事で回遊導線が希薄な可能性。
- 例（抜粋）:
  - `articles/air-cylinder-troubleshooting-basic.html`
  - `articles/plc-output-troubleshooting-basic.html`
  - `articles/noise-filter-basic.html`
  - `en/articles/air-filter-regulator-lubricator-basic.html`
  - `en/articles/control-panel-grounding-basic.html`
- 注: 本監査は完全リンクグラフではなく、優先度判断のための粗抽出。

## 11. Cannibalization Risk Notes
- 役割重複の可能性がある近接テーマ（要レビュー）:
  - `pressure-switch-basic` vs `pressure-switch-vs-gauge-basic`
  - `sensor-basic` vs `npn-pnp-basic` vs `plc-input-troubleshooting-basic`
  - `air-cylinder-basic` vs `air-cylinder-troubleshooting-basic`
  - `relay-basic` vs `relay-socket-basic` vs `thermal-relay-basic`
  - `control-panel-grounding-basic` vs `power-signal-wiring-separation-basic` vs `noise-filter-basic` vs `shielded-cable-basic`
- 今回は修正対象外。次回は intent 役割（定義 / 比較 / troubleshooting / hub）で整理推奨。

## 12. Recommended Next Fix PRs
1. **Critical language-menu normalization PR**
   - JA/EN切替リンクを絶対URLまたは一貫したルート相対URLへ正規化。
2. **Internal reachability/orphan reduction PR**
   - トップ・カテゴリ・関連記事の導線追加で 211候補を段階的に圧縮。
3. **JA-only high-value EN expansion PR**
   - 白書の EN long-tail 方針に沿って、40件のJA-onlyから優先度順にEN展開。
4. **Hreflang/template consistency hardening PR**
   - トップ/カテゴリ含むテンプレート横断の最終整合チェック。
5. **Cannibalization review PR**
   - 近接intent群の役割分担を明文化し、内部リンク優先URLを統一。

---

### Validation Notes
- This PR is **audit report only**.
- **記事本文は変更なし**。
- HTML / CSS / images / search-index / sitemap / robots.txt は未変更。
- **safe to review**。
