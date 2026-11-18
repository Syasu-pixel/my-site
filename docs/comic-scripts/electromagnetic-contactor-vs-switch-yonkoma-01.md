# 接触器・サーマル4コマ採用記録

## 対象・選定
元記事：https://denkicontrol.com/articles/electromagnetic-contactor-vs-switch.html
既存の電磁開閉器4コマは名称と組合せが中心。今回はサーマルの過負荷検知と接触器の主回路開閉という役割を説明し重複を避けた。最新更新正本と公開済15作品を照合。

## 技術根拠
[公式参照ノート](../reference-notes/electromagnetic-contactor-vs-switch.md)と現行記事の保護動作図を参照。富士電機FAQ1715（https://faq-fa.fujielectric.co.jp/faq/show/1715?site_domain=default）、三菱電機FAQ15002（https://fa-faq.mitsubishielectric.co.jp/faq/show/15002?site_domain=default）を2026-11-14取得。サーマルの接点をコイル回路へ組んだ構成例を明示し、主回路遮断をサーマル自体の機能としない。短絡保護は別途必要。機器ごとの仕様を優先する。

## 採用版台本
題名：見張る係と、切り替える係
1. 後輩「サーマルが見張るなら、接触器はお休み？」
2. 先輩「接触器は電流の通り道を、開閉する係だよ。」
3. 先輩「過負荷でサーマル接点が開くと、コイルがOFF。接触器が主回路を開くんだ。」注記「サーマル接点をコイル回路に組んだ例」
4. 後輩「じゃあ私、見守る係で！」先輩「そっちは手を動かしてね。」
脚注：短絡保護は別途必要／構成は仕様書で確認

## 採用・転送
- 初稿01と文字修正版は本人から作り直し指示があり不採用。今回の別案02を本人が「4コマ採用で進めて」と承認。本人OK後にサイト公開・通常Instagram予約・次作提示まで進める継続指示に従う。
- 原本2356504bytes、SHA256 `2111eedd5f6620b8aff28e78ee1cc2e3ea00500609ef1ee2ee021d3d357fdb31`。Library確認用原本と公式転送元を一致させた。
- 24時間限定Firestorage、2026-11-14 10:58UTC開始、11/15 10:58UTC期限。Binary transfer run43587932825 / job132426340410成功、byte数とSHA一致。画像commit b794fb9ebe0b4d940f2ab1466660815d0f58c338。公開先 `assets/images/comics/electromagnetic-contactor-vs-switch/electromagnetic-contactor-vs-switch-yonkoma-01.png`。

## 公開前検証
- Source PR1895 HEAD25a7d0b35322639d13ead47104476579b8c731e5、基点main2b491cb501ed2ce02832318e1e47a06b00f4f312。15→16作品、他15追加shellページ同一。全style/scriptブロック同一、既存ちび3導線を保持。再生成・異常系チェック成功。
- 確認専用PR1896 HEADd65a9c882f11fd8847a35d440646addb9737229b、固定URL https://9680b5cb.denkicontrol-preview.pages.dev/ 。完全生成HTMLのローカル/送信blob `564b3101f5978c44ecce6fb4e6c8f393ce9eff2f`一致、noindex。確認専用PRは本番マージしない。
- build、prepare、verify、check、preserve、impact-report成功。Donation strict job132427403975はindex.htmlを拒否しGXサービスページだけ許可する用途限定条件で失敗。同じ生成器による実差分は漫画とカウンターだけ、共有寄付/CSS/JSは変更なし。PRコメント6876375315に根拠記録。検査設定・閾値変更なし。
- 独立PC確認で13/16採用画像全4コマ、拡大/×閉じる、CTAから正しい記事へ遷移を確認。狭幅414 CSS px/client402で横はみ出しなし。採用13/16全4コマ・CTA・×を目視、CTA実遷移と戻る/閉じるを確認。窓幅と倍率100%を復元。

- 最新main c3bba2cfを取り込み、最新記事inventoryを保全。index/manifest/画像は検証済みと完全一致。source PR1895 merge f71fb2f9d7b286b1b70736fb3e919b722bbab60e。
- Instagram denkicontrol 2026-11-18 10:00 JST予約。post428043373 / UUID3667522089179562736。既存11/15〜17枠と重複なし、再取得でPENDING/draft:false/autoPublish:true/AI:true確認。実投稿完了ではない。
- https://app.metricool.com/planner/calendar?blogId=7162417&openWithPostUuid=3667522089179562736
- 本番Pages run43604806005は2026-11-14 14:31:12UTC成功。配信トップを取得して16作品と採用題名・画像参照・記事リンクを確認。確認用PR1896は未マージclose。
