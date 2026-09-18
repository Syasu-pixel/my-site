# トップ・相談・キャリア入口の共通枠

対象は日本語トップ `index.html`、英語トップ `en/index.html`、相談 `services/gxworks2-online-support.html`、キャリア入口 `categories/career.html` の4ページ。管理者が変更前後プレビューを確認し「問題なし、採用で進めてください」と了承。現在の公開状態は [移行記録](site-template-migration-status.md) に記す。

## 正本と保持範囲

- 対象・対応言語・採用時の原文／候補ハッシュは `.github/site-shells/additional/manifest.json`。
- ヘッダーのHTML/CSS/操作は既存の `.github/site-shells/ui-proposal/` を再利用。日本語は相談・検索・メニュー、英語は検索・メニュー。日英トップのみ相互切替。相談の自ページボタンは現在ページの表示とし、架空の翻訳先を作らない。
- 追加4ページのフッター外枠は `.github/site-shells/additional/footer.njk`、枠のCSSは `.github/site-shells/additional/frame.css`、ヘッダー高との調整は `.github/site-shells/additional/offset.js`。記事側の登録済みfooter variantsを無断で変更しない。
- ヒーロー・人気/新着・カテゴリ棚・キャリア導線・フォーム・料金・同意・検証・元のスクリプト・送信先・フッター内の文言とリンクは元HTMLの正本に残す。サービス提供者名、英語トップの日本語トップリンク、キャリアの著作権も保持。相談の共通検索に必要な既存共通loaderだけを追加する。記事用目次・評価・関連記事を追加しない。

## 生成・検査・公開

`scripts/build-additional-shells.mjs` は既存Eleventy依存に固定されたNunjucksを使い、共通ヘッダーと追加枠を生成する。原文から共通枠と追加読込だけを置換し、逆置換で全バイト一致を検査する。出力はソース外のcandidateと、noindex・通信/送信隔離付きreviewに分ける。公開HTMLを手修正しない。

`scripts/check-additional-shell-regeneration.mjs` は採用プレビューとのハッシュ一致、共通ヘッダー／フッター各4ページへの反映、未定義値と重複登録の拒否を検査。`scripts/check-additional-shell-browser.mjs` は4ページ×320/390/768/1440pxを確認し、検索・メニュー・実在言語・横幅・本文フォーム・フッターの文言とリンクを照合。実送信はしない。

Pagesで従来の288記事生成に続いて追加4ページを同じ生成器で作り、`scripts/prepare-integrated-publication.mjs` が検証済みcandidateだけをコピーする。最終公開対象の検査は288記事＋追加4ページの292ページ、残る17非記事は元のまま。旧サービス原文保持の検査は記事レビューの基準段階として残るが、実際の公開サービスは追加版のヘッダー／フッターに置き換わる。最終公開コピーの全テキストはWebP画像URL変換以外の差分なしを検査する。

元HTMLの差分ではないため、既存IndexNowのHTML差分検出は今回の追加4ページを通知しない。URL・canonical・更新日・sitemapは変更せず、既存のクロール導線を維持する。通知APIや停止中AI機能を再開しない。

## 継続編集と戻し方

採用時ハッシュは意図しない変更を防ぐ移行基準。承認済みの追加編集では、変更目的・差分・比較結果を記録し、正本から再生成して基準を整合させる。古いハッシュに合わせるために本文を戻したり検査を削除したりしない。

取り消す場合は本追加PRの部品・対象台帳・生成・公開接続・検査を一単位で戻す。root HTMLの一部だけを書き換えて生成を迂回しない。本文技術内容の再監査、実機Safari・スクリーンリーダー・実際の相談送信は本検査の保証外。

## フッター広告表記の追加案（2026-09-19、未公開）

記事と同じ `.github/site-shells/components/affiliate-disclosure.njk` を生成時に読み、既存のfooterInnerの後へ1段落だけ追加する。元の文言・リンクを置換せず、追加段落を除く候補は変更前と全バイト一致。原文4ページは変更しない。manifestのrevisionと候補ハッシュは今回の確認候補を示し、公開承認ではない。ブラウザ検査では元フッターの文言とリンクを照合し、追加段落の個数と言語を別途検査する。
