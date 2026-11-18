# PLC入出力4コマ採用記録

状態：本人採用・本番配信確認済み。2026-11-15 JST。
元記事：https://denkicontrol.com/articles/plc-io-unit-basic.html

## 台本と根拠
「出力なのに、入力？」を本人が採用、通常のトップ公開・Instagram予約へ進行承認。
1. 後輩「先輩、出力なのに入力って…どっちですか？」
2. 先輩「どちらも正解。どの機器から見ているかで変わるんだ。」
3. 先輩「PLCは入力を受け取り、条件を判断して、出力へ伝えるよ。」
4. 後輩「なるほど！私もちゃんと入力しました！…メモへの出力、忘れてました。」
センサーからの出力がPLCから見た入力になる関係と、入力・処理判断・出力の概念を示す。図は配線図ではなく情報の流れ、接続条件は機種の仕様・図面へ戻す限定あり。現物配線変更や活線作業は示さない。
現記事、docs/reference-notes/plc-io-unit-basic.md、オムロン公式 https://www.fa.omron.co.jp/guide/technicalguide/26/129/index.html と三菱電機 https://www.mitsubishielectric.co.jp/fa/ssl/learn/el/eln/course/common/term_0002/0122.html を確認。全メーカー共通X/YやCOM極性を主張しない。自己目視・親独立目視・本人採用済み。

## 採用原本と転送
plc-io-unit-basic-yonkoma-01-candidate.png、1254×1254、2201024 bytes。
SHA256 10af85c2e348c6cec8a901fa9bc211f5ffad5135c388662a86bed04966f72b73。
Gitblob ac254f500acda5a6a714b8a88403c4cc1ecda893。
配置 assets/images/comics/plc-io-unit-basic/plc-io-unit-basic-yonkoma-01.png。
24時間Firestorage→既存binary transfer run43662030383成功。transfercommit cc6594caf24404c801e1a9f34eec0350b8fdcb56でbyte数/blob一致とrequest削除を確認。採用後の再生成なし。

## 公開・検査
source PR1918 HEAD351c61e7cac834f9d9d1ab784d01ccc77baa6e7f、main8609700基準。
anchor1件とcounter20→21、manifest/inventory index同期のみ。16ページ再生成PASS、indexは承認追加以外一致、他15ページ一致。
preview専用PR1919 HEAD07687e6badfcc89dab51344044816ef75154679f、https://328379ce.denkicontrol-preview.pages.dev/ 。PC約1180px/狭幅500pxで21作品・16/21採用画像・拡大/閉じる・plc-io-unit-basic.htmlリンクを独立確認。簡素化Heroと新カテゴリ6画像保持。
build/prepare/verify/check/preserve/capture成功。Donation strict job132655365925は既存GX Works2専用許容assert行42でindex変更を拒否。独立生成物差分と根拠はPRコメント6887305333/6887342190。設定・保護変更や強制mergeなし。任意全件browser/compareの完了は主張しない。
正式PR1918通常merge9d0322f2632cf204578246ab2a11e86b2503035b。health JSON更新95afd343保全。preview1919未マージ閉鎖。Pages43663553011 completed/success。独立担当が新規タブで本番21作品・16/21採用画像の実表示と正しい記事リンクを確認。簡素化Heroとカテゴリ新6画像の正常ロード・配置も保持。

## Instagram
既存11/15〜22枠を保持、2026-11-23 10:00 JSTの空き枠へ予約。
post428500781 / UUID8494493787636386633。
再取得でPENDING、draft:false、autoPublish:true確認。isAiGenerated:trueで予約。実投稿とは区別。
https://app.metricool.com/planner/calendar?blogId=7162417&openWithPostUuid=8494493787636386633
transfercommitの不変原本URLから採用PNGを保存。記事本文・更新日・90日間隔は変更しない。
