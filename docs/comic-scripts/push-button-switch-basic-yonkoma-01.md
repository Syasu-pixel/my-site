# 押しボタン4コマ採用記録

状態：正式採用済み、本番配信検証待ち。2026-11-15 JST。
元記事：https://denkicontrol.com/articles/push-button-switch-basic.html

## 本人採用と技術
「押してないのに、光ってる？」を本人が採用し進行承認。本人OK後トップ公開とInstagram通常予約の運用を適用。
1. 後輩「先輩、押してないのに光ってます。故障ですか？」
2. 先輩「照光ボタンは、ランプと接点が別の役割なんだ。」
3. 先輩「何を知らせる光かは、設備の仕様や図面で確認しよう。」
4. 後輩「故障報告、早まるところでした！」
ランプは表示、接点は信号。点灯だけで接点状態は決められず、故障でないとも断定しない。閉じた盤の外で概念を説明し配線作業を示さない。
現行記事と docs/reference-notes/push-button-switch-basic.md、富士電機公式 https://www.fujielectric.co.jp/fcs/feature/command_switch.html を確認。先輩説明・後輩疑問/オチ、青系2×2、既存ちびキャラ。自己目視と親の独立目視・本人確認済み。

## 採用原本
push-button-switch-basic-yonkoma-01-candidate.png、1254×1254、2309644 bytes。
SHA256 c9d35e31c4d2fa1dbd14032df05db4157458afe112a852d9ac593229d87b805d。
Gitblob 0a16245e8ea1da14329b974dbc20257abf7bdd50。
配置 assets/images/comics/push-button-switch-basic/push-button-switch-basic-yonkoma-01.png。
24時間Firestorage→検証付きBinary image transfer run43655590886成功、転送後size/blob一致と依頼JSON削除を確認。採用原本を再生成していない。

## 公開検証
Hero/カテゴリ統合main56f00cc基準。正式source PR1912 HEAD40e133812fa949e4c466050a2ad2d390003f8dd6。
トップanchor1件と静的カウンタ18→19、検査manifest/site-inventoryのindex同期のみ。全style/scriptは一致、他15生成HTMLは完全一致。
追加shell再生成16ページと未定義値/重複拒否の検査PASS。
確認専用PR1913 HEAD8f289ba85d59e17d3140e167a49bb982f4c6da62、生成reviewblob7c1cad688f9bb16c7180c34c79dc43ead6a3754f。mainへマージしない。
https://422ac835.denkicontrol-preview.pages.dev/
独立PC約1180px/狭幅500pxで19作品・14/19採用画像・拡大・閉じると正しい記事リンクを確認。簡素Heroとカテゴリ6画像保持。
source build/prepare/preserve/check/capture成功。Donation strict job132637818872はサービス限定許容assert行42で失敗。生成indexから承認anchor1件/counterだけ戻すと基準完全一致、他15ページ一致を確認しPRコメント6886453730/6886621817へ記録。設定・必須check変更なし。任意全件browser/compareは未完了と区別。
PR1912通常merge c87b144e6ec3cd697c084b587afd9da796fa6aa6。直前health自動更新d1c4623も保全。Preview専用PR1913は未マージ閉鎖。本番Pages43658560611配信は確認待ち。

## Instagram
既存11/15〜20各10:00 JSTを保持し、次の空き枠2026-11-21 10:00 JST予約。
post428460902 / UUID -215484246832103246。
再取得でPENDING/draft:false/autoPublish:true/isAiGenerated:true確認。投稿実績とは区別。
https://app.metricool.com/planner/calendar?blogId=7162417&openWithPostUuid=-215484246832103246
転送commit cc2acb702716acb0c2dbda053e3df2a56bb5fcfcの不変原本URLをMetricoolへ保存。記事本文と内容更新日・90日ガードは変更しない。
