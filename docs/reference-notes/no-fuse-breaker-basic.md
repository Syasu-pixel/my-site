# no-fuse-breaker-basic 公式参照メモ

## 対象と現在の状態
- 対象: `articles/no-fuse-breaker-basic.html`
- 状態: 本文改訂の作業ブランチ。画像5枚の最終採用、統合Preview、管理者承認、本番公開は未完了。
- 記事の中心: ノーヒューズブレーカ（NFB）とは、配線用遮断器（MCCB）の呼称、過負荷・短絡の遮断、漏電ブレーカとの違い、定格電流・遮断容量。

## 参照した公式元（2026-11-06確認）
- 三菱電機FA「ノーヒューズ遮断器」FAQ No.12711
  - https://fa-faq.mitsubishielectric.co.jp/faq/show/12711
  - 使用範囲: 配線の過電流・短絡保護、MCCBへの分類、NFBという製品呼称。
- 三菱電機FA「配線用遮断器 製品特長」
  - https://fa-dic.mitsubishielectric.co.jp/fa/products/lvd/lvcb/pmerit/mccb/index.html
  - 使用範囲: NFBの呼称、熱動電磁式の引きはずし方式。
- 三菱電機FA「漏電遮断器」
  - https://fa-dic.mitsubishielectric.co.jp/fa/products/lvd/lvcb/items/elcb/index.html
  - 使用範囲: 漏電遮断器の漏電保護と過負荷・短絡保護。
- 三菱電機FA「機器用遮断器」
  - https://fa-dic.mitsubishielectric.co.jp/fa/products/lvd/lvcb/items/cbe/index.html
  - 使用範囲: 地絡保護専用（OCなし）と過負荷・短絡兼用（OC付）の分類例。
- 三菱電機FA「マグオンリ形」
  - https://fa-dic.mitsubishielectric.co.jp/fa/products/lvd/lvcb/pmerit/spcb_mag/index.html
  - 使用範囲: 短絡保護専用の例外、全NFBが同じ過負荷保護を備えると断定しない根拠。
- 富士電機機器制御「定格遮断容量の意味」FAQ No.2104
  - https://faq-fa.fujielectric.co.jp/faq/show/2104
  - 使用範囲: Icu/Ics、定格電流と遮断容量を別項目として説明する背景。
- 富士電機機器制御「電線保護用ブレーカ選定」
  - https://f-net.fujielectric.co.jp/Catalog/FCS_appli/MCCB_ELCB_for_WireProtection/MCCB_ELCB_for_WireProtection.html
  - 使用範囲: 回路電圧・短絡電流・電線サイズ・布線条件の検討必要性。

## 記事で採用する用語
| 種別 | 日本語 | 英語 | 方針 |
|---|---|---|---|
| 機器 | ノーヒューズブレーカ／ノーヒューズ遮断器（NFB） | No-fuse breaker | 三菱電機の呼称として説明 |
| 分類 | 配線用遮断器（MCCB） | Molded Case Circuit Breaker | 機器分類として説明 |
| 異常 | 過負荷／短絡 | Overload / Short circuit | 別の異常として説明 |
| 性能 | 定格電流／定格遮断容量 | Rated current / Breaking capacity | 値の意味を混同しない |
| 機器 | 漏電遮断器 | Earth leakage circuit breaker | 過電流保護の有無は製品仕様を確認 |

## 断定しない範囲
- NFBとMCCBがすべてのメーカー・市場・製品で完全同義であるとは書かない。
- すべてのNFBが同じ引きはずし方式・特性であるとは書かない。
- 定格電流をわずかに超えたら瞬時に遮断すると書かない。
- 漏電遮断器がすべて過電流保護付き／漏電専用であるとは書かない。
- 特定の回路へ何Aや何kAを選定すべきかは、公式資料・回路条件を確認せず断定しない。
- 安全確認なしにトリップを復旧・再投入する手順は書かない。

## 画像ルール（画像生成時の事前確認）
- Heroは左側にHTML文字領域を確保、盤内のNFBを主役にし、1枚1用途。
- 正本キャラクター画像 `assets/images/character-templates/senpai-kouhai-character-template.png` を実際に確認するまでは人物入り生成をしない。
- 採用Heroをアンカーとし、後続のOGP・本文図はその採用結果へ揃える。
- 遮断動作の図で「過負荷→短絡」という誤った連続因果を描かない。
- NFBの通常製品を漏電検知器として描かない。
- メーカーのロゴや実在型式銘板・画面を再現せず、自作の概念図を使う。
- 画像の最終採用はユーザーが1枚ごとに判断する。

## 検索調査（2026-11-06時点）
- Google Search Consoleの確定データ（Supabase）: 直近28日 2026-10-07〜11-03 と前28日 2026-09-09〜10-06 を比較。検索実測値は公開PR本文へ転記しない。
- Bing AI Performance: `.github/data/bing-ai-search/2026-10-14/` の3件の履歴スナップショットを参照。対象クエリは「ノーヒューズブレーカーとは」「ノーヒューズブレーカー 漏電ブレーカー 違い」等。クエリ単位の引用数を記事URL別引用と混同しない。

## 未完了検査
- 本番HTTPレスポンスの生バイトSHA-256照合（公開生成結果とsource commitは照合済み）。公開承認判定前に必須。
- 現行記事から新画像への差し替えと原本SHA-256保全。
- 変更記事固有の統合・静的リンク・ライト/ダーク・PC/スマホ・画像拡大表示の検証。
- `docs/article-editing-playbook.md` に基づく対象記事の共通台帳entry同期、最終Preview、管理者承認。

## 最終Preview配信監査（2026-11-08、専用ブランチのみ）
- 対象PR #1808 は Draft のまま。本番mainへのマージは禁止。
- 本ブランチの記事HTMLは `site-header dc-shell` と `data-ui-proposal="header"` を含む統合済みcandidate（commit `7458f682251b4f04854d1e45bbf7ac2522c3ad0a`）。編集元のraw HTMLと混同しない。
- 採用画像5点は `preview-no-fuse-breaker-refresh-20261107` のGit blob SHAと一致することを確認済み。画像は変更しない。
- 既存Deployment `c99801e2` は本番相当の公開成果物と一致しておらず、最終Previewとして不採用。
- この記録の更新は専用ブランチへの新規pushによるCloudflare再配信の確認を兼ねる。新Deploymentの成功と実URLでの統合HTML確認まで合格扱いにしない。
