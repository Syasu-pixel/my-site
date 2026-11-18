# 端子台4コマ・採用記録

状態: 正式採用済み。2026-11-14本人が候補を目視し「4コマもいいねそのまま進めてよ」と承認。本人OK後にサイト公開・通常Instagram予約を行う継続指示の範囲で進行。

## 対象・選定
- 元記事: https://denkicontrol.com/articles/terminal-block-basic.html
- 統合更新台帳の最終内容更新2026-11-11を確認。COMまでの既存14作品と重複なし。記事本文を再編集するものではない。
- `series-parallel-circuit-basic` は旧バックログに「新たに生成・公開しない」の個別留保があり、自動制作では選定しなかった。
- 公式参照・安全条件: [端子台公式参照メモ](../reference-notes/terminal-block-basic.md)。現行記事は端子番号と線番を区別し、図面・接続先との照合を説明。
- Phoenix Contact [端子台マーキング](https://www.phoenixcontact.com/ja-jp/products/marking-material/terminal-marking) を2026-11-14再確認。識別による配線の割当の明確化を根拠とする。オムロン制御盤設置ガイドは今回本文取得できず、新たに読了した根拠にはしない。

## 台本
題名: 端子番号と線番、同じじゃない？
1. 後輩「端子は3番、線は103…番号が違うのはミスですか？」
2. 先輩「端子番号と線番は、識別するものが違うんだ。」
3. 先輩「図面で端子と線番、接続先をセットで確認しよう。」
4. 後輩「番号だけで、早とちりするところでした！」
CTA: 詳しくは記事で！ → denkicontrol.com
注記: 端子番号3・線番103は架空例

## 技術・画像ガード
- 番号を見て誤配線を断定しない。端子番号3/線番103は標準採番法でなく架空例。
- 端子台は紙上の教育用模式イメージ。隣接端子の導通、接続手順、締付け条件、通電測定を図から推定させない。
- キャラクター正本 `assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png`、採用COM作品、端子台記事Hero外観を実際に目視。白ヘルメット青服の先輩、水色ヘルメット灰色服の後輩の同一人物感を優先。
- 自己目視・root独立目視で文字・構成・人物に明白な破綻なし。紙を持つ/資料を指す演出のみで導体へ手を触れない。

## 採用原本・公式転送
- 生成原本: exec-dfe209b4-7b28-4cbe-9752-801af0adddf0.png
- 採用候補名: terminal-block-basic-yonkoma-01-candidate.png
- byte size: 2206737
- SHA256: d1317e25c18f56b440d1520f4772e39f884cb53555a15b725bc841733364452c
- Git blob: e446b848290f0503741c5c8ba79d5b1e3d1e53ee
- 配置先: `assets/images/comics/terminal-block-basic/terminal-block-basic-yonkoma-01.png`
- 採用後の再描画・トリミングなし。
- 24時間限定一時保管後、公式binary-image-transfer run43584158799 / job132414966111成功。実byte/SHA一致のログを確認。一時依頼JSONは成功commit327326aで削除。

## サイト検証
- main4225f737を基点とするソースPR #1890。COM・ちび3導線・既存共有スクリプトを保持。追加shell16ページの同一生成器比較ではトップだけにCOMの次の端子台1作品と1/15カウンターを追加。他15ページ差分なし。
- source index Git blob0a9ea00bd05583fd2e5d8c22717054972557c62f。normalized candidateSHA78a9a6955f8a002219ce76a7f00383ac166364785f76b4692686008dec8ac176。再生成・異常系検査成功。
- Preview専用PR #1891、index完全生成HTML204820bytes、ローカルと送信Git blob64918c31ea8eefbe320db29141587de302be8e12一致。noindex付与。previewは本番へマージしない。
- ソースの14→15作品を数え、全style・scriptブロックが基点と完全一致、ちび導線dc-home-guide62参照保持を確認。
- Catalog、追加shell、Pages build、source preserve、impact-reportが成功。Donation専用strict-generated-diffは今回もindex.htmlを拒否しGXサービスページだけを許可する用途限定検査（job132415829619）で失敗。今回の共有寄付・CSS/JS変更なしを差分で確認し、検査設定・閾値は変更しない。
- Preview固定URL https://e9307a98.denkicontrol-preview.pages.dev/ 、HEAD9f28113f841b9072aff9b9576e73e431fb837ef7、Cloudflare deploy成功。
- 独立担当がPC1180と約400CSS pxで13/15の採用端子台画像全4コマ表示を目視、PC×閉じる、狭幅CTA実クリックで正しい端子台記事へ遷移を確認。実機スマホ検査ではなく狭幅Chromium。ヘッダー/フッターcompare CIも成功。
- PR #1890をmainへmerge（b2dce29ff5a6b8cf4127fc6d0305ac71fe25f57e）。本番配信確認は下記へ追記。
- Instagram denkicontrol: 2026-11-17 10:00 JST予約。post427891476、UUID -6842433265755927097。予約前の一覧にNFB11/15・COM11/16を確認し、重複のない次の通常枠を選定。再取得でPENDING / draft:false / autoPublish:true / isAiGenerated:trueを確認。実投稿完了ではない。
- Planner: https://app.metricool.com/planner/calendar?blogId=7162417&openWithPostUuid=-6842433265755927097

- 本番Pages workflow43585460169はsuccess。2026-11-14 10:35:34 UTC独立担当が本番トップHTTP200・15作品と端子台掲載、配信WebP画像HTTP200/266508bytesを取得し採用4コマの内容を目視。記事実URLもHTTP200。拡大UIは本番未操作だが、本番同等固定プレビューでPC/約400CSS pxの画像/閉じる/実リンク遷移を確認済み。
