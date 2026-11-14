# DC24V電源4コマ採用記録

状態：正式採用済み、main反映済み・本番配信確認中。2026-11-15 JST。
元記事：https://denkicontrol.com/articles/dc24v-power-supply-basic.html

## 本人採用・台本
前2候補は不採用。第3案「これ、充電するんですか？」を本人が「はい採用で進めて」と承認。既定の本人OK後トップ公開・Instagram通常予約を適用。
1. 後輩「先輩、これも充電してから使うんですか？」
2. 先輩「これは電池じゃなくて、交流を直流に変える電源だよ。」
3. 先輩「設備の電気から、センサなどが使うDC24Vをつくるんだ。」
4. 後輩「充電待ちの休憩…なくなりました。」
交流入力のDC24V電源に限定。センサはDC24Vで動く例。非通電の訓練用サンプル。配線作業の手順を示さず、機器指定を優先。定格電流・保護作動閾値・突入電流を混同する説明は含めない。
技術根拠：オムロン https://www.fa.omron.co.jp/guide/technicalguide/22/140/ 、現行元記事と参照メモ。先輩説明・後輩疑問とオチの青系2×2ちびキャラを維持。自己目視と独立目視で文字・人体・技術的な明白な破綻なし。

## 採用原本と転送
原本dc24v-power-supply-basic-yonkoma-03-candidate.png、1254×1254、2310933bytes。
SHA256 97cc9bd5b2a41e79588d90b88291b0a0c1687fe9cfbd693365c4d7461cffe999。
Gitblob 0aaa8de903cf38a2c5151b0568a8a8c389fe5995。
配置 assets/images/comics/dc24v-power-supply-basic/dc24v-power-supply-basic-yonkoma-01.png。
24時間Firestorage→恒久Binary image transfer run43653142100成功。Git保存後size/blob一致、一時JSON削除確認。

## 公開検査
main7fd6817基準のsource PR1908 c64136d。トップanchor1件とcounter17→18、検査manifest/index inventory同期のみ。
16追加shell生成と再生成・未定義値/重複拒否PASS。他15生成HTML完全同一、対象indexの全style/script完全同一。
生成Preview PR1909 ce29f8d、https://8771cea1.denkicontrol-preview.pages.dev/ 。生成ファイルblob a30d00f12e07d67c4af6f774b8073470993d639aを照合。確認専用・mainマージ禁止。
独立実画面PC約1180/狭幅500pxで18作品・DC24V6/18・採用画像・閉じる・記事CTA遷移正常。Hero3枚/カテゴリ6枠保持。実機スマホではない。
build/prepare/preserve/check/capture成功。Donation strict job132627512750はサービス専用の変更許容assert行42で失敗。限定差分証明をPRコメント6885987466/6886027988へ記録し、成功へ書き換えていない。任意全件browser/compare進行中、設定/必須check変更なし。
PR1908通常merge d81bb0350a38ea3806788e11d1d77fdaf06d1a70。Pages run43654431500は記録時進行中、本番確認は追記する。

## Instagram
既存11/15〜19各10:00 JSTの5予約を確認し、次の空き枠2026-11-20 10:00 JSTへ予約。
post428448957 / UUID -6135240567784848628。
再取得でPENDING/draft:false/autoPublish:true/isAiGenerated:true確認。実投稿完了とは区別する。
https://app.metricool.com/planner/calendar?blogId=7162417&openWithPostUuid=-6135240567784848628
採用原本の不変commit URLからMetricoolへ保存。本文はAC入力→DC出力と機種仕様確認、プロフィール記事への誘導。
記事本体・内容更新日・90日ガードは変更しない。
