# sidebar-toc-v2 — 採用済み部品の統合手順

以下は初版パッケージの採用・単独検査記録。現在の全記事統合と公開状態は [移行状態](../../../docs/site-template-migration-status.md)、組合せ検査は [統合手順](../../../docs/article-components-integration.md) を参照する。

状態: **ADOPTED_FOR_INTEGRATION / PREPARED_NOT_INTEGRATED**。2026-09-18、ユーザーがプレビューv2を目次と右側構成と確認した上で「いいと思う、この表示の仕方で。これで一度採用しようか」と明示採用。同じ表示の再承認は不要。本番マージ・公開の許可ではありません。

## 固定したもの

- `toc.css`: 採用プレビューのCSSとバイト一致。
- `toc.js`: 採用プレビューの開閉・ジャンプ・配置コードと同じ。末尾にあった**プレビュー専用の評価ボタン無効化処理だけを除外**。本番の評価JS/APIや商品リンク処理を止めないための分離で、採用した見た目・操作には変更なし。
- `pages.json`: 代表8ページの用途、既存レイアウト切替幅、右欄カードの元SHA-256、保持する順序、削除する目次カード、目次参照データ。
- `integrate.py` / `html_spans.py`: 最新の未変換ソースを入力する純粋な変換アダプタ。元のHTML全体は同梱しない。取得済みの古い記事HTMLを読み出す処理もない。
- `adoption.json`: 承認範囲・状態・各ファイルのSHA-256。

## 構成の契約

広い表示は右上、ヘッダーの検索欄／検索ボタンの下。開いた検索・メニューパネルを避ける。狭い表示は右下の同じボタンをモーダル内へ移し、ボタンの上に一覧を表示。独立した閉じるボタンは狭い表示で非表示。外側押下、Escape、項目選択で閉じる動作を保持する。

採用部品の依存セレクタ: `header.site-header`、`#dc-search-toggle` または `.header-search`、ヘッダー内 `.dc-drawer` / `.search-box-panel` / `.language-menu-panel`。下部回避対象は固定footer、`[data-fixed-footer]`、`.fixed-footer`、`#scrollTopBtn`。ヘッダーz999、通常目次z998、開いたdialogはtop layer。

目次データは1記事1個の `<script type="application/json" id="dc-toc-data">`。`lang`（ja/en）、`compactMaxWidth`、`toc`（id/label配列）を持つ。アダプタは最新本文のH2とアンカーから再計算し、参照と違う場合は停止する。古いラベル・本文をコピーしない。

CSS/JSは登録した利用記事にだけ読み込む。本部品CSSにはボタンのためのbody末尾余白があるため、無関係なページへのグローバル読込はしない。本文への新規アンカーが必要な場合は重複を拒否し、本文文言は変更しない。

## 対象と例外

|対象|切替幅以下で狭い表示|右欄の扱い|
|---|---:|---|
|articles/control-panel-outlet-basic.html|1100px|関連記事→カテゴリ→支援。要点の新規追加なし|
|articles/a-contact-b-contact-basic.html|1100px|固有の要点→次に読む→支援|
|articles/air-breaker-basic.html|1100px|要点・覚え方→先に読む→支援|
|articles/crimping-tools.html|1180px|選び方・商品リンク→支援を保持|
|articles/fa-engineer-career-service-comparison.html|900px|専用の要点→支援。本文の比較構成は対象外|
|articles/plc-io-troubleshooting-guide.html|1100px|使い方・主要な分岐→支援を保持|
|articles/plc-drilling-line-design-project-02.html|768px|右欄を追加しない。シリーズ本文を保持|
|en/articles/air-breaker-basic.html|1100px|Quick reminder→Category links→Support|

これは代表8ページの明示した適用データ。全288ページの自動分類を完了したものではない。追加対象は最新ソースから用途・実在カード・既存レイアウト境界を確認して登録する。カード名の推測だけで全記事を並べ替えるルールは同梱していない。

## 最新ソースへ組み込む順序

1. 最新mainとPR1509の採用済みヘッダー／フッター正本を確認し、統合用ブランチへ反映する。
2. 現行の混在方式を維持する。header/footerは `.github/site-shells/components/*.njk` とmanifestが正本、それ以外の本文・CSS/JSは既存記事HTMLが正本。
3. このアダプタを最新の未変換記事へ適用して別出力へ生成。例: `python integrate.py --source-root <latest-source> --output-root <empty-review-output>`。両ディレクトリは別系統とし、出力は空を要求する。全ページ検証後に出力する。
4. 右欄カードやH2が変わっていたら停止する。**最新ソースからpages.jsonを更新して適用方針と整合させる。旧HTMLで埋め戻して合格させない。** 表示の同一性の確認と本番公開承認は別。通常の統合検査ごとに採用済みの見た目を再承認してもらう必要はない。
5. 変換したソース差分（aside順序・目次カード削除・新規アンカー・共有CSS/JS/dataの読込）だけを最新編集元へ反映。ヘッダー・フッター・本文末関連記事・評価の差分が混入していないことを確認。
6. 出力される `/assets/css/article-toc-v2.css`、`/assets/js/article-toc-v2.js` を共有部品として配置。最新ソースを入力として `pnpm build:shells` → `pnpm check:shells` → 既存のshell比較検査。
7. その後、別担当の採用済み評価／コンパクト関連記事部品を統合し、再生成・最終組合せ検査。順序は **header/footer → sidebar/toc → feedback/related**。

アダプタは元ファイルを変更しない。外部JSを削除せず、投票を停止せず、本文・商品リンク・支援リンク・metaを保存する。Preview隔離のnoindex／計測遮断は既存のPreview工程で行う。今回のローカルサーバの全外部JS削除処理を本番生成へコピーしない。

## 統合後に必要な検査

- 本文保存（asideと追加アンカー以外）・meta・画像・リンク・評価slug・既存JSを比較。右欄の保持カードは内容とURLを保存。
- 8代表×PC/狭幅、日英・工具・キャリア・ハブ・シリーズを確認。新ヘッダー検索／メニュー、ボタンの位置、下部固定要素、境界と縦横切替、開閉・Tab循環・Escape・背景固定・項目ジャンプを確認。
- 評価／関連記事の統合後は、投票処理と関連記事が維持され、目次が二重生成されないことを確認。
- 本パッケージの単独検査を最終組合せ検査済みと扱わない。本番マージは未承認。

検査の根拠はパッケージ内 `verification.json` と、[統合手順](../../../docs/article-components-integration.md) に記録したCI。初版main基準394203274a5bd4d1eff4dd51fe64e07127c65275、新ヘッダー併用確認版71de9c96021ef3e725af6ffda88e46076161575f。実際の統合では必ず最新版を読み直す。
