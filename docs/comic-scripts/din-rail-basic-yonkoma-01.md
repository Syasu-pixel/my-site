# DINレール4コマ採用記録

状態：正式採用済み、公開前検査中（2026-11-14）。
元記事：https://denkicontrol.com/articles/din-rail-basic.html

## 選定・根拠
2026-11-12に更新済みのDINレールを、更新正本と既存16作品から未制作対象として選定。現行記事と docs/reference-notes/din-rail-basic.md を確認。メーカー根拠はオムロンPFP支持レール・エンドプレート・スペーサの寸法資料（https://www.fa.omron.co.jp/products/family/815/dimension/ 、2026-11-14取得）。DINレールは機器の取付土台、電源・信号配線とは別。対応・取付条件は機器指定を優先。接地端子台等の特殊構成へ一般化しない。

## 採用台本
題名：並べるだけで、つながる？
1. 後輩「同じレールに並べたら、配線もつながるんですか？」
2. 先輩「DINレールは、機器を固定する土台だよ。」
3. 先輩「並べるだけでは、電源や信号はつながらない。配線は図面で確認しよう。」取付条件は機器の指定を確認。
4. 後輩「“置くだけ完成”の夢、終了です！」
脚注：図は取付の概念例。実作業は機器の説明書と安全手順を確認。

## 本人採用・原本
本人が画像目視後「4コマは採用でこのまま進めていいよ」と明示承認。既定の本人OK後トップ公開・Instagram通常予約・記録の一式を適用。
原本 din-rail-basic-yonkoma-01-candidate.png、2246280bytes、SHA256 3bca8a695cd3ff20ffa1c5273b76057aac68b3965c28202957b32375f0e7dbf3。Gitblob 55372120cd727bc033dd98dc4df90d82152faa4c を転送後照合。正方形・2x2・青系ちび先輩後輩、疑問→説明→後輩オチを維持。本人と独立担当の目視で文字・人物・構成の明白な破綻なし。

## 転送・検証
24時間限定Firestorageを2026-11-14 14:34UTC作成。公式Binary image transfer run43605802519 / job132480050962成功、画像commit d2c55e4e91c237ed95b8b104ead6f8d450422694。
配置：assets/images/comics/din-rail-basic/din-rail-basic-yonkoma-01.png
Source PR1901 b212d65a646842e998ccc8e64f0bdfb4a392f2b2。17作品目の追加と静的カウンター更新のみ。既存style/scriptを完全維持。16追加shellページ再生成・異常系検査成功。
確認用PR1902 c0ce7648682718f8c20354a690e1256d0d60b827。完全生成HTMLblob93b3da09be03bb423cdee33bec6674745e983d25をローカルと照合、noindex、未公開確認専用で本番マージ禁止。

## 最新main同期とQA（2026-11-14）
- PCと狭幅424CSS px（client/scrollとも412px）の実画面で全4コマ/CTA/×確認、狭幅CTA→正しいDIN記事・戻る/閉じる成功。
- Hero先行 PR1903 main3b2c7dcc995410f0c5c02154a0e054ac57194970を統合。
- source PR1901 HEAD dc2dc19865fb64862426a4fc0991ee7816283b45。
- indexの差分はDIN anchorと17件counterのみ。style/scriptはHero mainと完全一致。
- 正式生成16ページ再生成検査PASS。blob SHAと手元の完全ファイル一致。
- preview PR1902 HEAD04d7635e0a17b2db36dd7609793313d8901b2a2e、noindex、絶対にmainへマージしない。
- 予約枠確認: NFB11/15、COM11/16、端子台11/17、接触器11/18、各10:00JST。DIN予定11/19 10:00JST（まだ未予約）。

## 本番公開・予約
- 統合プレビュー https://dd834ab3.denkicontrol-preview.pages.dev/ を独立担当がPC/435CSS pxで確認。17作品、DIN16/17全4コマ、CTA→正しい記事と戻る/閉じる、Hero自動切替と停止/再開を確認。
- main保護なし・必須チェックなし。source build/verify/prepare/check/preserve等成功。任意の旧画像比較は進行中、Donation専用strictのindex変更拒否はPRコメント6880004902/6880092433に原因と代替の完全差分検証を記録。閾値・設定変更なし。
- PR1901通常merge d10526a21033350b5b537324d45061666b3236b6。確認専用PR1902は未マージで閉鎖。
- Instagram denkicontrolは2026-11-19 10:00 JST予約、post428109456 / UUID-3193212872980281981。再取得PENDING/draftfalse/autoPublishtrue/isAiGeneratedtrueを確認。実投稿完了ではない。
- https://app.metricool.com/planner/calendar?blogId=7162417&openWithPostUuid=-3193212872980281981
