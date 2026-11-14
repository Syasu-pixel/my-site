# ノーヒューズブレーカ 4コマ・採用記録

状態: 正式採用済み（2026-11-14の通話で管理者が画像確認しサイト公開承認）。サイト公開・Instagram予約まで完了。実投稿は予約日時後に確認する。
制作日: 2026-11-14
対象記事: https://denkicontrol.com/articles/no-fuse-breaker-basic.html

## 選定根拠
最新mainのarticle-backlogに制作待ちが明記され、刷新PR #1812の公開記録がある。mainトップ掲載12作品と重複しない。comic-scriptsの14件にも対象なし。Open PR一覧の取得範囲では対象記事の旧Preview PR #1808はあるが四コマ候補なし。全過去ブランチを網羅した主張はしない。

## 台本
1. 後輩「ヒューズがないのに、どうやって守るんですか？」
2. 先輩「異常な電流を内部の仕組みで検知して、回路を切るんだ。」図の要点「配線・回路を守る」
3. 先輩「主に過負荷や短絡から保護するよ。漏電の検知は別の機能なんだ。」
4. 後輩「ヒューズはなくても、守る係はいるんですね！」
CTA: 詳しくは記事で！ → denkicontrol.com
注記: 保護機能は製品仕様で確認

## 技術根拠・境界
- main記事本文とdocs/reference-notes/no-fuse-breaker-basic.mdを参照。
- 三菱電機FAQ 12711を今回読み直し、配線の過電流・短絡保護、MCCB分類を確認: https://fa-faq.mitsubishielectric.co.jp/faq/show/12711
- 全NFB同一特性・即時遮断・漏電検知とはしない。配線手順・復帰操作を描かない。
- 参照メモに旧未完了状態が残るが、公開記録とは区別。対象記事・記録の再編集は今回行わない。

## シリーズアンカー
- assets/images/comic-character-anchors/yonkoma-chibi-senpai-kouhai-anchor-01.png
- assets/images/comics/sensor-basic/sensor-basic-yonkoma-01-pilot.png
両画像を実際に目視。白帽・青服の先輩、青帽・灰色服のボブ後輩、顔・髪色・頭身・青系世界観・番号付き2×2と上下帯を照合。ヘルメットは無文字・無ロゴを優先。

## 生成・レビュー
- built-in image_gen使用、初稿1回と部分修正1回。
- 初稿は接点開閉図が不適切だったため不採用。第2コマの図だけを機器＋配線保護の盾へ変更。
- 候補原本: no-fuse-breaker-basic-yonkoma-01-candidate.png
- SHA256: 541bf16cb99d8cc89443fb2060877fbdbd712998178699a00ac49173d03c93b0
- 自己評価95/100: 顔・衣服・役割・日本語・安全境界は適合。第3コマの情報量がやや多いため縮小時は拡大導線必須。
- 独立レビュー（root）: 全文判読可、明白な手の破綻なし、技術概ね整合、疑問→説明→後輩オチ成立。縮小・拡大導線要確認。

## 公開・予約結果
- 本番PR #1876、merge d6840a2058cc03ad22432f140b1b74c3c1c79fb6。Pages run43576706318はbuild/deploy成功（2026-11-14 08:41:40 UTC）。
- 本番トップの13作品中7番に採用画像の拡大と正しい記事リンクを独立ブラウザ確認。PCとスマホ相当400pxの表示・拡大・閉じる・切替確認済み。実機スマホ検査ではない。
- 追加ページ4幅検査・公開成果物検査・catalog/統合保持成功。Donation専用チェックの用途外FAILはPRへ16ページ限定差分検証を記録し、検査設定を変更せず判断。
- IndexNow run43576706296:1URL、HTTP200受理。Googleリクエストは実施していない。検索登録完了とは扱わない。
- 2026-11-14管理者がInstagram denkicontrolへの予約投稿を明示承認。
- 予約:2026-11-15 10:00 Asia/Tokyo。既存未来予約なし、既存投稿履歴とMetricoolの日曜推奨10時（最高値）を確認。
- Metricool最新post ID427838450、uuid -6456341313180578066。再取得でPENDING/draft:false/autoPublish:true/isAiGenerated:true、対象予約1件を確認。
- 画像は本番merge固定commitの採用PNG原本からMetricoolへ取り込み。再生成なし。投稿文は過負荷・短絡保護と漏電検知の区別、プロフィール記事CTA、AIイラスト表記。
- 予約確認は実投稿成功ではない。公開予定時刻後の配信確認を別途行う。

## 採用原本の配置
assets/images/comics/no-fuse-breaker-basic/no-fuse-breaker-basic-yonkoma-01.png
転送Workflow 43574368766成功。サイズ2153466 bytes、Git blob 3601784fbb367011d0b79d50ec4973ed1fcfb8b8を原本と照合。SNSは上記予約確認済み。
