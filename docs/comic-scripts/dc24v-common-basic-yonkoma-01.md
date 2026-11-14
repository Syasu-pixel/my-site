# DC24V COM 4コマ・採用記録

状態: 正式採用済み。2026-11-14管理者が画像を目視し「採用で公開追加とインスタ配信予約お願いね」と承認。サイト公開・予約は検証後に追記。
対象記事: https://denkicontrol.com/articles/dc24v-common-basic.html

## 選定・構成
mainトップ13作品にCOMなし。統合更新台帳・article-backlogの11/9刷新と四コマ待ちを確認。直列並列は既存の生成禁止記載が残るため今回対象外。
1. 後輩「COMって、いつも0Vにつなぐんですか？」
2. 先輩「決めつけないよ。COMは入力回路の共通側なんだ。」
3. 先輩「+24V側か0V側か、図面と機種の仕様で確認しよう。」
4. 後輩「“共通”でも、答えは共通じゃないんですね！」
CTA: 詳しくは記事で！ → denkicontrol.com
注記: 端子名・接続条件は機種ごとに確認

## 技術・シリーズ検証
- [根拠メモ](../reference-notes/dc24v-common-basic.md)とmain記事を照合。COMを一律0Vや接地と扱わず、仕様と図面を確認する。
- 配線施工図・活線作業・短絡による動作確認は描かない。図面のアイコンは実施工の指示ではない。
- assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png と assets/images/comics/sensor-basic/sensor-basic-yonkoma-01-pilot.png を実際に開いて参照。
- 白帽青服の男性先輩、青帽灰色服の女性後輩。疑問→先輩説明→後輩オチ。2×2正方形と上下帯を維持。
- built-in image_genで1回生成。独立目視で日本語・キャラ・役割・手に明白な破綻なし。小表示では拡大導線を使う。

## 採用原本
- 生成原本ID: exec-09e124f2-e069-4d94-a561-1873810429db
- ファイル名: dc24v-common-basic-yonkoma-01-candidate.png
- PNG 1254×1254 / 2156974 bytes
- SHA256: e6743c24c2f6774313a1460f2ce58223fc8c61787c5101278e488fdfeafe8edf
- Git blob: e37c35e4424594cd8801c2a091ab1a81ad1611a3
- 配置: assets/images/comics/dc24v-common-basic/dc24v-common-basic-yonkoma-01.png
- 公式Binary image transfer run43581325088成功。ログでバイト数とSHA256一致を確認。一時依頼JSONは転送後削除。

## 公開検証
source PR1886、Preview専用PR1887。最新mainのちびキャラ案内とNFBを保持。記事本文・共有CSS/JS・公開設定は変更しない。追加shell16ページの同一生成器比較で差はトップのCOM1スライドと13→14カウンターのみ。検査対象のvisualBaseline正規化を採用し、閾値・検査コードは変更なし。

## Preview再配信の訂正記録
- 初回preview専用HTMLにツール出力の切詰め表示が混入し、漫画の縦積み・拡大表示異常を独立実ブラウザ確認で発見。本番には公開していない。
- 完全ローカルHTML 204,375bytesを分割取得し、Git blob `635ba436a3724005ab3f75621f8971823349ec4f` がローカルと一致することを検証してpreviewだけ修正。commit `78d05e1d0b84812eecfdd5e912e9d9b3d763ec15`、Cloudflare成功URL https://699d845c.denkicontrol-preview.pages.dev/ 。旧8403c87e版は検証用として無効。
- ソースindexのGit blob `42419f16373c30d5f850e92ab2c041c2d5f9e10a` はローカルと一致し切詰め混入なし。生成16ページを基点と比較し、差分はトップの採用COM追加とカウンターのみ。他15ページは同一。
- ソース検査check、verify、build、preserve、impact-report成功。Donation専用strict-generated-diffは許可変更をGXサービスページだけに固定した既存検査によりindex変更を拒否。共有寄付機能、ヘッダー/フッター、スクリプトは今回無変更。検査設定・閾値は変更していない。

## 正式採用後の反映
- 修正版Previewを独立担当がPC1180相当/400 CSS pxで検査。COM拡大オーバーレイ、画像全体、1/14、閉じる、正しいDC24V記事リンクを確認。ちびキャラ3導線を維持、旧切詰め警告と縦積み不具合は解消。
- 本番ソースPR #1886 をmerge。main commit `8b93d4bf84b74922e3d1f84792fb695e90081185`。本番Pages run43582810206の反映確認は下記へ追記。
- Instagram denkicontrol（brand7162417）: 2026-11-16 10:00 JST予約。post427872577、UUID `-2968990744188073067`。予約前に一覧を確認しNFBの11/15 10:00枠の翌日を選択。予約後再取得でPENDING / draft:false / autoPublish:true / isAiGenerated:true、重複なしを確認。実投稿完了ではない。
- 画像は上記本番merge commitのimmutable raw URLをMetricoolへ取り込み、採用原本と同一版を指定。
- Planner: https://app.metricool.com/planner/calendar?blogId=7162417&openWithPostUuid=-2968990744188073067
- Pages run43582810206のbuild/deploy成功。2026-11-14 10:01 UTC頃、本番トップHTTP200のHTMLでCOM採用画像参照・ちびキャラ案内保持・切詰め文字列なしを確認。本文204954bytes SHA256 `36582ede5ff37cbec30a8eb5da613cb3ee5e941143c4006bbaa081a5854d5322`。ブラウザ再確認結果は下記へ追記。
- 本番PCも独立担当が1/14・採用画像・正しい記事リンク・閉じるを確認。サイト反映確認済み。Preview専用PR #1887は未マージで閉じ、修正後検証URLを証跡として保持。
