# エアシリンダートラブル記事 改善作業ログ / 再開用バックログ

更新日: 2026-09-17
状態: **本文の改稿を保存済み / 最終画像・独立レビュー・実画面確認は未完了**
対象記事: `articles/air-cylinder-troubleshooting-basic.html`
作業PR: #1488
作業ブランチ: `preview-air-cylinder-troubleshooting-official-sources-20260916`
main: **未反映。最終Previewのユーザー承認前にマージ・公開しない。**
API編集部: **停止を維持。再起動・画像生成API・有料連携の追加はしていない。**

## 1. 今回確認した保存状態

再開時HEAD: `5efc7a345844423369047e196cd1658be3757b26`。
再開前のPR差分は、記事冒頭の公式資料ボックス、既存パスのPNG 3点、このログの計5ファイルだった。本文の重複整理、7点の新画像への置換、共通制作ルール・Work工程文書の変更は、その差分に存在しなかった。

Work画面で報告された「原本7点が独立レビュー通過」は、このチャットで取得した保存物とは対応付けられていない。保存を確認できない変更を実施済みとして引き継がない。

|対象|確認結果|
|---|---|
|記事HTML|GitHubから全文を区間分割で読み、今回の改稿を保存した|
|既存掲載PNG|対象フォルダのメタデータを確認。新しいLibrary候補とは別データ|
|Workの最終原本7点|対応する最終版・採用記録を確認できない|
|回収した原本|Libraryのレビュー用ZIPに候補8点、参照画像2点、不採用初稿2点あり|
|掲載用WebP|回収候補から7点をローカルで可逆変換。採用未確定につきGitHubへ未配置|
|独立レビュー|回収ZIPの台帳は未実施。PRのreviewsも空。別の最終レビュー記録は未取得|
|共通ルール・Work工程文書|再開前PRに報告された変更なし。内容不明の変更を推測して再作成しない|

## 2. 今回保存した記事変更

記事コミット: `6dc94ee0a042feb8be8c3cfe930ad69bf59c4c8c`
記事blob: `19da644c90a583b5d14006dd225d40aa25d41644`

- 実際の停止と到着信号の未検出を区別し、各節を「確認対象・判断の理由」で整理。
- 導入、確認順、まとめの反復を削減。重複するflow図はHTMLから外したが、画像ファイル自体は削除していない。
- 本文図は5用途。heroとOGPを加えた7用途は今回の説明構成上の結果であり、固定ノルマではない。
- 実機の手動操作や手で可動部を動かす確認を促す文を修正。仕様・既存の点検記録・担当者への引き継ぎを中心にした。
- 既存の `.mark` とstrongを使用。固定ヘッダー、共通CSS、導入3カード、本文・右カラム、寄付導線、フッターの構成を維持。
- 関連記事4件に、それぞれのHTMLのog:imageで確認した既存OGPパスを追加。カードの画像読込・表示確認は未実施。
- description、og:description、twitter:descriptionを実際の本文に合わせた。タイトル・canonicalは維持。未検証の構造化データや検索実績は追加していない。
- Preview確認中のためrobotsを `noindex,follow` にした。公開承認後の取り込み前に、本番用robots方針へ戻す確認が必要。インデックス登録依頼はしていない。
- 新画像の最終採否が不明なため、残る5本文図とhero/OGPの参照は既存PNGのまま。画像置換完了ではない。

## 3. 回収した原本の所在と検証

Libraryファイル: `air-cylinder-image-review-bundle.zip`
Library backing file ID: `file_000000007f808206b9ba7c075d3ba698`
作成日時: 2026-09-16 19:18:39 UTC（2026-09-17 04:18:39 JST）
サイズ: 19,080,578 bytes
ZIP SHA-256: `30d2e6c12e50f3a058e42d2f86af6eb9e24e1cb559d794e6cbda12994f48ffc4`
今回の作業コンテナ: `/mnt/data/air-cylinder-recovery/air-cylinder-image-review-bundle.zip`

ZIPのREADMEとmanifestには、候補8枚・最終採用0枚・技術監査/独立レビュー待ち・GitHub未配置と明記されている。これは「7点通過」という後続報告を否定する証明ではなく、後続版をまだ回収できていないことを示す。

全候補は `candidates/air-cylinder-troubleshooting-basic-<用途>.png` に保存されており、1536×1024。PNGデコードとmanifestのSHA-256一致を8点すべて確認した。

|用途|PNG bytes|PNG SHA-256|
|---|---:|---|
|hero|1622657|41f2309bb128f91373dca0c7d2c41d681b1a180ede0c5fbb015eaf864b6e86f3|
|ogp|1697402|e4ca9801b722bada04bd07a98162116fa8645ed60ea853169a6409b2dce44b10|
|flow|1617490|320d95bac3406749e4ace09f24edd27e9654fdc58939e52e6eb537f303c465fc|
|air-pressure|1760146|ea226d32173b1d81dbae0e2bd5af748dc068bedbed5019ef818739e5cdb4a1bd|
|manual-operation|1914703|b40cd58ce48e483b0cc9f3c48b355971643df81368837cf3344a04a3c17f0ad3|
|speed-controller|1600361|3baa9dd5c8f5bc864923d7ce9e78c23e86a05e0649aa193d66d93637bccdcc32|
|mechanical-interference|1689733|292eb51ae40c490b569181b292e00ce79940427e95b0af5a0163890197ea4dd0|
|reed-switch|1679494|89b583d3a14ea0c4f868edb4dc55c5f9a08fd2d6ec0ca6c9b2473aebf7c83e15|

`references/character-master.png` と `references/style-reference-only.png`、`rejected/` の初稿、README、manifest、production-promptsもZIPのまま保全した。原本へ描画・トリミング・文字追加・再生成はしていない。

## 4. 自己確認と採否

これは今回の制作側の目視確認であり、独立レビューではない。数値の合格点は付けない。

- hero候補は先輩1人で、大きな「エアシリンダの確認」のタイトルが残る。最新指示の「二人・短いやり取り・大きなタイトル不要」を満たさないため最終採用扱いにしない。
- OGP候補も先輩1人で、題名の占有が大きい。二人を起用した最終版は未回収。
- 空気圧・スピコン等の候補には部品識別中心のものがあり、「どこを見る・何を確認・何が分かる」の説明密度について再確認が必要。
- reed-switch候補は、リード線が先輩の後ろを通って右へ伸びる版。短い線がシリンダ後端へ入って見える不採用初稿とは別。指定された暫定ベースと対応するが、取付金具・技術表現・配置後の確認は未完了。
- selector-switchの参考2画像との密度比較、現行GitHubキャラクター正本との今回の最終照合、機種別公式資料による最終技術監査は未完了。
- PR reviews取得結果は空。Workの別担当による最終レビューを実施済みとして代用しない。

## 5. WebP・保存転送の検証

最初に空気圧PNG 1点をLibraryから保存し、PIL verify・再読込・寸法・SHA-256を確認した。その後に他の原本を回収した。

flowを除いた7候補を、元の1536×1024・無加工・lossless=TrueのWebPへ変換。PNGとWebPをRGBAへデコードして全画素比較し、7点すべて一致。ローカル成果は `/mnt/data/air-cylinder-recovery/verified-recovery/`、`recovery-manifest.json` に記録。ファイル名には `-candidate-lossless.webp` を付け、採用済み掲載画像と区別した。

高負荷の可逆変換が実行時間上限に達し空ファイルを残したため、空ファイルを検出して再作成し、最終7点のデコードと全画素一致を再確認した。空ファイルを完成扱いにしていない。

GitHubのcreate_blobは利用可能だが、この接続の入力はcontent文字列であり、ローカルファイルを直接指定する機能ではない。大容量Base64を会話へ出力して転記する方法は実行していない。GitHubへの新画像1点の保存・読み戻しは未達。

転送経路の確認中、配置専用ルールを読み終える前に空気圧PNG 1点をfirestorageへ一時保存した（72時間、2026-09-20 00:25:55 UTCに期限）。保存応答のサイズ一致のみ確認、外部からの読み戻し・GitHub転送はしていない。共有URLはこの公開ログへ転記しない。`docs/adopted-image-github-placement-rule.md` の直接配置優先・外部共有/一時workflow迂回禁止を確認後、この経路は続けていない。新しい転送workflowやmain上の一時ファイルは作成していない。

## 6. 既存GitHub画像について

対象フォルダの現物メタデータでは、speed-controllerが12,129 bytes、mechanical-interferenceが13,363 bytes、reed-switchが14,997 bytes。回収した約1.6〜1.9MBのPNG原本とは一致しない。旧レビューZIPにはこの3点が不正PNGとの記録があるが、今回そのGitHubバイト列の独立デコードは未実施。容量だけから障害原因を断定しない。

過去の「Base64エンコード」表示後の通信エラー原因は未特定。バイト列の破損原因も断定しない。既存PNGを上書きする前に、最終原本・採否・ハッシュの対応を確定する。

## 7. 検索実績・公式資料

Google/Bingの記事単位のクエリ・表示回数・クリックと対象期間: **未取得**。GSC Wizardの無料体験終了はユーザー提供の既知制約として尊重し、有料契約・新規検索連携を追加していない。Libraryにあったサイト全体のBing画面をこの記事の実績へ流用していない。

本文の検索意図に関する改稿は、症状の整理に基づく編集判断であり、実績データ分析の結果ではない。

SMC C96/C96SDの公式製品ページは今回Webで取得できた。回収ZIPに列挙される各PDFや最新版比較を今回すべて再確認したわけではないため、公式資料確認日の表示は前工程の2026-09-16を維持。資料追加・確認範囲の精査は残作業。

## 8. Previewの状態・未確認事項

既存Botが発行したBranch alias:
`https://preview-air-cylinder-trouble.denkicontrol-preview.pages.dev/articles/air-cylinder-troubleshooting-basic.html`

再開時に成功確認済みだった旧コミットのPreview:
`https://2ea24c7e.denkicontrol-preview.pages.dev/articles/air-cylinder-troubleshooting-basic.html`

この旧URLを今回の改稿や新画像の完了証拠に使わない。
記事コミット `6dc94ee` について、Botの2026-09-17 00:35:13 UTC更新ではBuild in progress。ログ記録時点で新コミットのデプロイ成功は未確認。後続確認では必ずBot/Checksとコミットを照合する。

実画面確認を試みたが、ローカルPlaywrightのChromium実行ファイルが無く起動できなかった。WebからのPreview読取もエラー。PC/スマホの実Previewの画像・文字・配置・関連記事カード確認は**未実施**。ローカル画像のデコード成功を実Preview合格に置き換えない。

## 9. 最終Previewまでに不足するもの

1. Work「機能確認と構成案」で後から修正・独立レビュー通過と報告された**最終原本7点**。hero/OGPは二人版。本文はair-pressure、manual-operation、speed-controller、mechanical-interference、reed-switchの5用途。既に存在するものを再生成せず回収する。
2. 7点それぞれのファイル/ハッシュに対応する**独立レビュー結果**。担当・対象版・指摘・修正・合否を区別する。記録が残っていなければ未実施扱いで別担当のレビューが必要。
3. 後続Workでのみ保存された本文差分・共通ルール/工程文書の差分があれば、その実ファイルまたはcommit。今回の改稿と重複・矛盾を照合する。
4. 採用原本のGitHub直接保存と1点の読み戻し、残りの配置、原寸/可逆WebPの参照更新、hero全体表示・OGP meta・本文図の整合確認。
5. 成功した実デプロイURLに対するPC/スマホの目視確認。画像が未確定の現状を最終Previewと呼ばない。

本番main・en/・アフィリエイト・API編集部の設定は変更していない。共通ルール本文も今回推測で変更していない。ここに記した案件固有の採否と残作業を、共通制作ルールへ無条件に昇格させない。

## 10. 旧ログの保全と優先順位

前工程のログはGit履歴に保存されている:
`5efc7a345844423369047e196cd1658be3757b26:docs/worklogs/air-cylinder-troubleshooting-basic-20260917.md`
旧blob: `3eac95bed74e7b4fc140ab9e593b955d944c12a6`

旧ログにある「Step 5を直ちに再生成」「Step 6/7は採用済み」は当時の候補に対する記録であり、回収した候補8点や未回収の後続7点の合格証明ではない。現在のユーザー指示（原本保全・安易な再生成禁止・最終Preview承認待ち）と、この再開確認を優先する。
