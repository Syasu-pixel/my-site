# トップ・相談・キャリア入口の共通枠

対象は `.github/site-shells/additional/manifest.json` に登録されたトップ、GX Works2相談、カテゴリートップ、および日英の問い合わせ／プライバシーページ（`contact/index.html`、`en/contact/index.html`、`privacy-policy/index.html`、`en/privacy-policy/index.html`）。共通ヘッダー／フッターは同じ正本から生成し、現在の公開状態は [移行記録](site-template-migration-status.md) に記す。

## 正本と保持範囲

- 対象・対応言語・採用時の原文／候補ハッシュは `.github/site-shells/additional/manifest.json`。
- ヘッダーのHTML/CSS/操作は既存の `.github/site-shells/ui-proposal/` を再利用。日本語は相談・検索・メニュー、英語は検索・メニュー。日英トップのみ相互切替。相談の自ページボタンは現在ページの表示とし、架空の翻訳先を作らない。
- 追加対象ページのフッター外枠は `.github/site-shells/additional/footer.njk`、枠のCSSは `.github/site-shells/additional/frame.css`、ヘッダー高との調整は `.github/site-shells/additional/offset.js`。問い合わせページだけに必要なダーク補正は `.github/site-shells/additional/contact.css` とし、生成時に日英の問い合わせページだけへ重ねる。プライバシーポリシー固有のダーク補正は `.github/site-shells/additional/privacy.css` とし、生成時に日英のプライバシーページだけへ重ねる。カテゴリートップ共通のダーク時文字コントラスト補正は `.github/site-shells/additional/category.css` とし、`categories/` と `en/categories/` の登録ページだけに重ねる。記事側の登録済みfooter variantsを無断で変更しない。
- ヒーロー・人気/新着・カテゴリ棚・キャリア導線・フォーム・料金・同意・検証・元のスクリプト・送信先・フッター内の文言とリンクは元HTMLの正本に残す。サービス提供者名、英語トップの日本語トップリンク、キャリアの著作権も保持。相談の共通検索に必要な既存共通loaderだけを追加する。記事用目次・評価・関連記事を追加しない。一般オンライン相談 `contact/index.html` のフォーム、送信先、Turnstile、受付確認処理も本文側の正本として保持し、共通シェル化で変更しない。

## 生成・検査・公開

`scripts/build-additional-shells.mjs` は既存Eleventy依存に固定されたNunjucksを使い、共通ヘッダーと追加枠を生成する。原文から共通枠と追加読込だけを置換し、逆置換で全バイト一致を検査する。出力はソース外のcandidateと、noindex・通信/送信隔離付きreviewに分ける。公開HTMLを手修正しない。

`scripts/check-additional-shell-regeneration.mjs` は採用プレビューとのハッシュ一致、共通ヘッダー／フッター各登録ページへの反映、未定義値と重複登録の拒否を検査。`scripts/check-additional-shell-browser.mjs` は登録ページ×320/390/768/1440pxを確認し、検索・メニュー・実在言語・横幅・本文フォーム・フッターの文言とリンクに加え、ダークモード時の主要面・文字コントラストを照合する。実送信はしない。

Pagesで従来の288記事生成に続いて追加対象ページを同じ生成器で作り、`scripts/prepare-integrated-publication.mjs` が検証済みcandidateだけをコピーする。最終公開対象は288記事とmanifest登録済み追加対象ページを統合して検査し、未登録の非記事ページは元のまま保持する。旧サービス原文保持の検査は記事レビューの基準段階として残るが、実際の公開サービスは追加版のヘッダー／フッターに置き換わる。最終公開コピーの全テキストはWebP画像URL変換以外の差分なしを検査する。

元HTMLの差分ではないため、既存IndexNowのHTML差分検出は今回の追加対象ページを通知しない。URL・canonical・更新日・sitemapは変更せず、既存のクロール導線を維持する。通知APIや停止中AI機能を再開しない。

## 公開前の最終Preview・人間承認

追加ページで共通ヘッダー／フッターを適用する場合、repository root の編集元HTMLをそのまま配信する raw branch Preview を最終承認用として案内してはならない。Cloudflare Pages 等がブランチrootを自動配信していても、そのURLが `scripts/build-additional-shells.mjs` の生成candidateを返していることを確認できない限り「本番相当Preview」と呼ばない。

最終承認の対象は、必ず次の順序を通した生成物とする。

1. 編集元HTMLを正本として保存する。
2. `scripts/build-additional-shells.mjs` で共通ヘッダー／フッターを適用したcandidateを生成する。
3. manifestのsource/candidateハッシュ、再生成検査、ブラウザ検査、publication検査を通す。
4. 人間が確認する対象がraw編集元ではなく、検査対象と同一のcandidateであることを確認する。
5. 管理者の目視承認後にだけ本番PRを正式化・mainへ反映する。

### 最終確認の提示方法

- 第一選択は、検査済みcandidateそのものを返す外部Preview URLとする。URLを案内する前に、固定ヘッダー、共通フッター、テーマ切替などcandidate固有の要素が実際のレスポンスHTMLに存在することを確認する。
- 現行配信基盤がraw branchしか外部配信できず、candidate専用外部URLが用意できない場合は、CIが同一candidateをローカル配信して取得した **PCライト／PCダーク／スマホライト／スマホダークの4条件スクリーンショット** を正式な目視確認面として使用できる。
- スクリーンショット方式を使う場合も、元HTMLを撮影して代用してはならない。撮影元commit、candidateハッシュ、使用した生成・検査workflowを記録し、管理者へ「外部URLではなく検査済みcandidateの画像確認」であることを明示する。
- ダークモード、固定ヘッダー、フッター、レスポンシブ表示など今回の変更対象がスクリーンショット内で確認できない場合は承認済みと扱わない。
- Preview専用branch / workflow / 一時ファイルを作った場合は本番PRへ混入させず、公開成功後に閉じる。

### 誤案内防止

- raw branch URLがHTTP 200でも、共通シェルが見えない場合は生成失敗ではなく「確認対象が違う」可能性を先に疑う。
- 「Cloudflare Preview成功」「Pages検査成功」だけを根拠に、人間がcandidateを見たと報告しない。
- 管理者が固定ヘッダーやダークモード等の不足を指摘した場合、raw URLを繰り返し案内せず、candidateの配信／撮影経路を確認する。
- 最終Previewを見せていない状態で、表示変更を含むPRをmainへマージしない。

## 継続編集と戻し方

採用時ハッシュは意図しない変更を防ぐ移行基準。承認済みの追加編集では、変更目的・差分・比較結果を記録し、正本から再生成して基準を整合させる。古いハッシュに合わせるために本文を戻したり検査を削除したりしない。

取り消す場合は本追加PRの部品・対象台帳・生成・公開接続・検査を一単位で戻す。root HTMLの一部だけを書き換えて生成を迂回しない。本文技術内容の再監査、実機Safari・スクリーンリーダー・実際の相談送信は本検査の保証外。

## フッター広告表記の追加案（2026-09-19、未公開）

記事と同じ `.github/site-shells/components/affiliate-disclosure.njk` を生成時に読み、既存のfooterInnerの後へ1段落だけ追加する。元の文言・リンクを置換せず、追加段落を除く候補は変更前と全バイト一致。原文4ページは変更しない。manifestのrevisionと候補ハッシュは今回の確認候補を示し、公開承認ではない。ブラウザ検査では元フッターの文言とリンクを照合し、追加段落の個数と言語を別途検査する。
