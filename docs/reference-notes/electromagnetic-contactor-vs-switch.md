# electromagnetic-contactor-vs-switch 公式参照メモ

対象: `articles/electromagnetic-contactor-vs-switch.html`  
初回確認日: 2026-11-06  
状態: **記事刷新の作業資料（本番未承認）**

## 参照したメーカー公式資料

1. 三菱電機 FA FAQ No.14999「電磁接触器とは何ですか？」  
   https://fa-faq.mitsubishielectric.co.jp/faq/show/14999?site_domain=default  
   確認: 電磁石（コイル）の力で主接点を開閉する機器という定義。
2. 三菱電機 FA FAQ No.14998「電磁開閉器とは何ですか？」  
   https://fa-faq.mitsubishielectric.co.jp/faq/show/14998?site_domain=default  
   確認: 電磁接触器とサーマルリレーの組み合わせという定義。
3. 三菱電機 FA FAQ No.15002「サーマルリレーとは何ですか？」  
   https://fa-faq.mitsubishielectric.co.jp/faq/show/15002?site_domain=default  
   確認: 過負荷等で動作し、その出力接点を介して電磁開閉器を開路する役割。
4. 富士電機機器制御 FAQ No.1715「電磁接触器と電磁開閉器の違い」  
   https://faq-fa.fujielectric.co.jp/faq/show/1715?site_domain=default  
   確認: 「マグネットコンタクタ」は電磁接触器、「マグネットスイッチ」は電磁開閉器を指す場合がある。FAQの2026-09-09更新を確認。
5. 富士電機機器制御「電磁開閉器」製品情報  
   https://www.fujielectric.co.jp/products/magnetic_contactor/  
   確認: 主接点・補助接点、サーマルリレーと接触器の役割分担。**サーマルリレー自体が主回路電流を直接遮断するわけではなく**、接点信号により電磁接触器を開放する。
6. 富士電機機器制御「低圧開閉機器 製品カタログ一覧」  
   https://www.fujielectric.co.jp/fcs/document/catalog/general/motorcontrol.html  
   機種別仕様の追跡先。型式別定格・選定値は一般記事に固定記載しない。

## 公式用語・採用表記

| 種別 | 日本語 | 英語・略称 | 採用方針 |
|---|---|---|---|
| 接触器単体 | 電磁接触器 | magnetic contactor / MC | コイル駆動の主接点開閉を説明 |
| 保護付き組合せ | 電磁開閉器 | magnetic switch / MS | 電磁接触器＋サーマルリレーと明確化 |
| 過負荷保護 | サーマルリレー | thermal overload relay | 過負荷検知→接触器を開放、主回路の直接遮断と混同しない |
| 現場の口語 | マグネット | — | 略称だけで接触器単体か組合せか断定しない |

## 使う範囲・断定しない範囲

- 本文では**構成・原理・呼称・保護の役割分担**のみ一般説明する。
- コイル電圧、負荷定格、補助接点数、サーマルリレーの特性・設定などは型式ごとに異なり、機種固有のメーカー正式資料を優先する。
- 「マグネットスイッチ」と「マグネットコンタクタ」を同義語として一括処理しない。ただし現場略称「マグネット」が曖昧に使われることは区別して補足する。
- サーマルリレー単体が短絡保護・主回路遮断を兼ねるとは説明しない。遮断器などとの保護範囲の違いに留意。
- 通電試験・結線変更・電源投入・復旧操作の具体手順は記事内で示さない。実設備の安全手順、責任者および有資格者の判断が優先。

## 画像ルール

- Hero / OGP / 本文図を独立に監査する。採用済み原本の用途やハッシュを取り違えない。
- 本文に既存の「接触器の概略」「電磁開閉器の構成」「両者の比較」の3図がある。図中の接触器／サーマルの位置、名称、矢印を再確認する。
- 説明図では「接触器：主接点を開閉」「サーマル：過負荷を検知」「開閉器：両者の組合せ」を一意に表す。機種固有の端子番号・未検証の回路図は作らない。
- 本メモの登録だけで画像の採用・差替え・Preview合格としない。

## 検索データの確認

- Google Search Console（Supabase上の確定ページ別）：2026-10-07〜11-03、1,635 impressions / 9 clicks / CTR約0.55% / 平均順位約7.7。前28日（2026-09-09〜10-06）は1,120 impressions / 6 clicks。
- Bing Webmaster（ページ別・2026-10-30スナップショット）：450 impressions / 16 clicks / 平均順位約4。Google日次合計と同一条件で比較しない。
- Google query例：「電磁接触器 電磁開閉器 違い」「電磁開閉器 電磁接触器 違い」。検索意図は名称の比較と、マグネットの呼称整理。
- 保存済みBing AI検索CSV（2026-10-14、`.github/data/bing-ai-search/index.json`）：例「電磁開閉器と電磁接触器の違い」「電磁接触器 電磁開閉器 違い」に引用実績。**クエリ単位**でありこの記事URLへの帰属は確定できない。2026-10-14以前の履歴データとして扱う。
- 検索データのみで仕様や安全情報を決めない。メーカー一次資料優先。

## 既存PR・基準・確認状況

- 旧未マージPR #1483 `preview-electromagnetic-contactor-official-sources-20260916` は旧main基準の11行変更。メーカー資料ボックスの提案を参照し、ブランチ内容を丸ごとマージしない。
- 調査開始時main: `e64e667d98ef51addcf858977113e32c0f412ae2`。対象記事Git blob: `9ddd9762ae3f47f84482943b079bd30680fc05ad`。
- 本番URL: https://denkicontrol.com/articles/electromagnetic-contactor-vs-switch.html
- 本番の検索取得済みテキストとGitHub編集元は照合したが、**本番配信HTMLのバイトSHA-256・本番デプロイID・PC/スマホの現行表示ベースラインは未取得**。公開判定前に必ず実配信版を照合し、不明な検査基準を書き換えない。
- 現在のメモは**一次資料調査と編集設計の段階**。完成版と偽らず、本番公開・IndexNow・Google登録はしない。
