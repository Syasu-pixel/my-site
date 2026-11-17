# LANチェッカー記事の参照・制作記録

対象: `articles/lan-checker.html`。確認日: 2026-11-18 JST。
状態: 本文・画像の更新候補。最終Previewと所有者の公開承認前。公開完了記録ではない。

## 選定と変更前基準

- 基準main: `35c934c9b323b6a19cdaa94eaf1e1dc30c161865`。ロボシリンダー・モーターブレーカは今回の対象外。
- 記事の更新台帳、Git履歴、Open PRを照合。LANの記事固有刷新の90日クールダウン該当記録と競合更新PRは確認されなかった。最近の共通フッター変更は本文刷新と区別した。
- 本番取得: 2026-11-17T23:06:12.375018Z。URL: <https://denkicontrol.com/articles/lan-checker.html>。
- 本番HTML SHA-256: `90f9fccf53b98a025c9984a262f0fe8ca4cfa23d7734f41b173f33a7291644af`。
- 変更前編集元SHA-256: `178874145864dc48636e00361f85aa922e464f7cea959e0ba4a0805deb5d0ae1`。
- 本番manifestのsourceCommitは上記main。最新mainの統合生成候補に公開時の画像URL変換を適用したHTMLと、本番配信HTMLの全バイト一致を確認。
- 共通shellの旧移行基準には承認済みプロフィールリンク追加前のhashが残る。今回の本文改稿に移行専用検査を無条件適用せず、本番基準を別保全し、意図した差分に対応する対象entryだけ同期する。

## 検索データの事前確認

Supabaseの公式API収集データを読み取り確認。収集healthはGoogle/Bingとも成功。Google最終日は2026-11-14、Bingのpage/query粒度最終日は2026-11-13。取得は2026-11-18 JST。手動CSVと公式API値を混同しない。

| Googleページ集計 | clicks | impressions | CTR | 平均掲載順位 |
|---|---:|---:|---:|---:|
| 2026-10-18〜11-14 | 48 | 1,237 | 3.88% | 5.16 |
| 2026-09-20〜10-17 | 49 | 994 | 4.93% | 6.16 |

表示と順位が改善してもクリックはほぼ横ばい。使い方・LEDの判定・検査限界への回答を明確にする候補とした。因果や将来の増加を保証するものではない。

Bing pageは週次スナップショットとして扱う。直近2026-11-13は11clicks/153impressions、前スナップショット11-06は6/88。重複する可能性がある値を合算して28日実績とは表記しない。

Googleのサイト全体query粒度では「lanチェッカー 使い方」3clicks/99impressions、「lanケーブル テスター 使い方」5/75、「lanケーブルテスター 使い方」5/51等を確認。query×page結合ではないのでLAN記事への直接帰属とはしない。

Bing AI検索のmain保存3CSV（2026-10-14）と、Draft PR #1806の2026-11-07保存3CSVを確認。後者は未マージ資料であり共通ルール採用とは区別する。引用クエリには「lanケーブル 導通 確認 方法」186、「lanチェッカーとは」172、「lanケーブルテスター 使い方」100、「lanチェッカー 使い方」72 citations。Citationは訪問・クリックではなく、この記事単体への帰属も確認できない。日別概要はサイト全体、市場トピック表は市場規模でありサイト実績ではない。期間が揃わない10月版との成長率比較はしない。

## 技術一次資料と採用範囲

1. [サンワサプライ LAN-TST7取扱説明書 Ver1.0](https://cdn.sanwa.co.jp/support/setsumeisyo/pdf/L/LAN-TST7_ver1-0.pdf)
   - 第5〜7節: LED表示、FAST/SLOW、起動時の開始番号、断線・短絡、Gのシールド導通。
   - 「片側だけ消灯なら圧着不良」と一律断定しない。PoE通電検査対応の根拠としては使用しない。
2. [HIOKI 3665製品情報](https://www.hioki.com/jp-ja/products/rgb-laser/lan-cable/id_6019)
   - 公式検索結果でワイヤマップ、スプリットペア、長さ、識別機能を確認。ページ直接取得は403のため全文読了とはしない。
3. [HIOKI 3665-20英語取扱説明書 3665A981-06、2024年1月第6版](https://shop.hioki.eu/media/49/76/17/1762417933/3665A981-06_0_Manual_EN.pdf?ts=1762417933)
   - p19: ネットワーク機器から外した独立ケーブルの検査。p28: 短いケーブルでスプリットペアを検出できない場合。
   - 日本向け3665と型式が異なるため、許容電圧等の数値仕様は転用しない。日本語最新取説は未取得。
4. [HIOKI 3665技術資料](https://www.hioki.co.jp/file/cmw/hdTechnicalData/297/attached_file/?action=browser&lang=jp&log=0&nr=t)
   - p2・p5: スプリットペアと、導通・番号対応検査との違い。
5. [Panasonic T568A/T568B公式FAQ](https://jpn.faq.panasonic.com/app/answers/detail/a_id/80034/)
6. [パンドウイットLAN配線部材カタログ](https://www.panduit.co.jp/wp-content/uploads/catalog/panduit_lan.pdf)
   - p46: ピン番号と芯線色。1–2、3–6、4–5、7–8の対。プラグの観察方向を示さず「左から」と説明しない。

採用語: 導通、ワイヤマップ、断線、短絡、スプリットペア、T568A/T568B、シールド。機種固有の表示・測定範囲・安全条件は説明書を優先する。簡易導通、対応機種の追加診断、通信性能・規格認証試験を区別する。実機検証済みとは主張しない。

## 編集・画像計画

既存工具記事のレイアウト、Amazonリンク・商品画像、動画、関連記事順、共通header/footerを維持。本文の安全条件と限定条件を更新する。Heroは全体表示のcontain、OGPは専用画像。旧intro説明図は本文と重複するため削除し、本文図は手順と検査限界の2点に整理。図の緑表示は実機UI・合否表示ではない模式図と明記する。

画像は通常ChatGPT画像生成。停止中AI編集部や有料APIループは再開していない。正本キャラクターテンプレートを参照し、工具・技術説明を主役として補助chibiを選択した。独立レビューはGPT担当によるもので、Gemini独立確認ではない。

| 用途・掲載ファイル（assets/images/lan-checker/） | size bytes | SHA-256 | 独立QA |
|---|---:|---|---:|
| lan-checker-hero-20261118.webp | 999482 | eb75e582dff62ffe48fa6cbd6f382eb1b80735f4fae5a01292fb75e4685c8689 | 96 |
| lan-checker-ogp-20261118.webp | 996254 | 5f5672d8707e3683f1dba5b15605b2569ac264edb929d9f3f7a03b6befa4223e | 96 |
| lan-checker-flow-20261118.webp | 1249326 | b9a775e172b25ea7db0a273ace41f1eaf5bfc94d66b816500be23a4b86240258 | 95 |
| lan-checker-limits-20261118.webp | 1153356 | 44d58ff3e825cff7a3891af1422644c3bb04291008d6f1865a9039b20c60b25c | 96 |

全画像1536×1024、ロスレスWebP。原本は別保全し、切抜き・縮小・文字追加なし。手順図初稿は機器へ向く矢印が誤読を招くため不採用とし、切離し状態を明示して再生成した。初回Heroレビューの頭身単独NGは、品質ゲートのchibi許可と正本chibiの照合後に訂正した。95点でも最終Previewの所有者確認に代わらない。OGPは正本キャラと採用Heroを生成参照にした。本文2図は生成時に正本キャラのみを参照した点を区別し、生成後の独立QAでHeroを含む視覚的一貫性を9/10として確認した。生成時のHero参照まで実施したとは記録しない。

転送は承認された24時間限定Firestorage保管と恒久Binary image transferのみ。共有URLは記事・公開ログへ掲載しない。本番mainへ直接画像転送しない。2026-11-18、確認用ブランチへの4件の正式転送が成功し、全size/Git blob一致と一時依頼JSON削除を確認した。成功run: [Hero](https://github.com/Syasu-pixel/my-site/actions/runs/44197942053)、[OGP](https://github.com/Syasu-pixel/my-site/actions/runs/44198182142)、[手順](https://github.com/Syasu-pixel/my-site/actions/runs/44198421118)、[限界](https://github.com/Syasu-pixel/my-site/actions/runs/44198676830)。

## 完了判定

本文技術確認・画像QAは実施。統合生成、影響カード5記事、PC/スマホ明暗と境界幅、最終Previewの外部実体確認、所有者の公開承認は別工程。未実施の段階を合格・公開済みと記さない。公開後のみ更新台帳へ実公開日と承認・配信根拠を記録する。
