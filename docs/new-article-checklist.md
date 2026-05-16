# 新規記事作成チェックリスト

## 0. 正式ドメイン固定ルール（最重要）
- このサイトの正式ドメインは `https://denkicontrol.com` とする
- `https://denki-control.com` は使用しない
- GitHub Pages の旧URL `https://syasu-pixel.github.io/my-site/` を canonical / og:url / sitemap に使わない
- CNAME は `denkicontrol.com` の1行のみ
- canonical は必ず `https://denkicontrol.com/...` にする
- og:url は必ず `https://denkicontrol.com/...` にする
- og:image / twitter:image は必ず `https://denkicontrol.com/assets/...` にする
- hreflang の href も必ず `https://denkicontrol.com/...` にする
- sitemap.xml の `<loc>` は必ず `https://denkicontrol.com/...` にする
- `/seo/sitemap.xml` は非運用なので触らない
- `denki-control.com` と `denkicontrol.com` を混同しない
- ドメイン修正作業の前後には必ず `rg` で誤ドメイン残存を確認する

確認コマンド例:
```bash
rg -n "denki-control\\.com|syasu-pixel\\.github\\.io|github\\.io/my-site" CNAME index.html en/index.html articles/*.html en/articles/*.html categories/*.html en/categories/*.html privacy-policy/index.html contact/index.html sitemap.xml robots.txt docs/*.md
```

期待結果:
- 本番対象HTML / sitemap / CNAME には `denki-control.com` が残っていない
- `syasu-pixel.github.io` / `github.io/my-site` が canonical / og:url / sitemap に残っていない
- docs内で注意書きとして `denki-control.com` を禁止例に出す場合はOK

正しい例:
```html
<link rel="canonical" href="https://denkicontrol.com/articles/slug.html">
<meta property="og:url" content="https://denkicontrol.com/articles/slug.html">
<meta property="og:image" content="https://denkicontrol.com/assets/images/slug/slug-ogp.png">
<meta name="twitter:image" content="https://denkicontrol.com/assets/images/slug/slug-ogp.png">
```





## Support this site 支援リンク確認
記事HTMLを作成・更新・導線追加する場合、Support this site カードがあるなら以下を確認する。

- PayPalリンクがユーザー確認済みの正式URLか
- Buy me a coffeeリンクがユーザー確認済みの正式URLか
- PayPalリンクに `https://www.paypal.com/paypalme/denkicontrol` のような未確認URLが入っていないか
- `href="#"` や空リンクを残していないか
- `target="_blank"` の外部リンクに `rel="noopener"` が付いているか
- 支援リンクをテンプレートからコピーしただけで未確認のまま使っていないか
- 支援リンクの正式URLが未確定なら、既存記事テンプレートからPayPal / Buy me a coffeeリンクをコピーして新規記事へ入れない（既存記事側の未確認URL修正は別タスク）。

PR確認時:
- Support this site の2ボタンとhrefを必ず確認する。
- 支援リンクが未確認・不正確な場合は `safe to merge: NO` または `safe to close: NO` とする。

## 0.6. PR確認時の必須チェック
- キャラクター入り記事画像を作る場合は、画像生成前に `assets/images/character-templates/senpai-kouhai-character-template.png` の存在確認を行う。
- 会話ブロック用画像（`assets/images/guide-characters/`）と画像生成用テンプレート（`assets/images/character-templates/`）を混同しない。
- 変更ファイルが依頼された許可範囲内か、Step 1/Step 2が混在していないかを確認する。
- 記事HTML禁止タスクで記事HTMLを変更していないか、画像禁止タスクで `assets/images/**` を変更していないかを確認する。
- `/seo/sitemap.xml` を変更していないことを確認する。
- 正式ドメイン `https://denkicontrol.com` 以外（`denki-control.com` / `syasu-pixel.github.io/my-site`）が canonical / og:url / sitemap に残っていないか確認する。
- Step 1では完成HTMLと画像配置のみに限定し、`index.html` / `en/index.html` / categories / search-index / sitemap / backlog を触らない。
- Step 2では language-menu 相互リンク、英語カテゴリ導線、トップ件数固定（新着6・Popular 10・トップ棚4）、search-index JSON、sitemap、backlog更新を確認する。
- PR本文に変更理由と確認結果、`safe to merge: YES/NO` または `safe to close: YES/NO` を明記する。

## 0.3. 公式一次情報参照ルール（GOT / GX Works3 / MELSEC系は最重要）
- GOT / HMI / タッチパネル / GX Works3 / MELSEC / ラダー命令語 / PLC命令語に関わる記事では、本文作成前に必ず三菱電機FA公式情報を確認する。
- GOT / HMI記事では、三菱電機FA公式のマニュアル検索ページを一次参照元とする。
  - https://www.mitsubishielectric.com/fa/download/search.page?mode=manual
- GOT / HMI記事で優先して確認する公式マニュアル名:
  - GOT2000 Series User's Manual (Hardware)
  - GOT2000 Series User's Manual (Utility)
  - GOT2000 Series Connection Manual (Mitsubishi Electric Products) For GT Works3
  - GT Designer3 (GOT2000) Screen Design Manual
- GX Works3 / ラダー / 命令語 / PLC命令語に関わる記事では、三菱電機FA公式の GX Works3 / MELSEC系マニュアルを一次参照元とする。
- GX Works3 / MELSEC系で優先して確認する公式マニュアル名:
  - GX Works3 Operating Manual
  - MELSEC iQ-F FX5 User's Manual (Application)
  - MELSEC iQ-R Programming Manual (Instructions, Standard Functions/Function Blocks)
- 記事内の簡易ラダー図、接点、コイル、内部リレー、命令語風の表現は、GX Works3 / MELSEC系の表記を基準にする。
- ただし、記事画像では実在メーカーUIの完全再現、公式画面スクリーンショット風の生成、三菱電機ロゴやGOTロゴの使用は避ける。
- 画像は初心者向けの概念図として簡略化し、実在UIではなく「概念的な画面」「概念的なラダー図」として作成する。
- 非公式ブログ、販売店ページ、個人サイトだけを根拠にして本文を作らない。
- PDF直リンクだけに依存せず、公式マニュアル検索ページと公式マニュアル名を確認したうえで、記事テーマに合う公式資料を参照する。
- 公式情報で確認できない内容は、断定表現を避ける。
- 公式情報の確認結果は、記事作成時の報告またはPR説明に「確認した公式参照元」として簡潔に記載する。


### 公式用語・ラダー表記・命令語の安定化ルール
- GX Works3 / MELSEC / GOT / PLC命令語 / ラダー図 / 制御機器に関わる記事では、本文・画像に使う用語、デバイス名、命令語、ラダー表記を公式資料ベースで整理してから作成する。
- ChatGPT / Codex は、公式資料で確認していないデバイス名・命令語・機能名・画面名・設定名を、推測で本文や画像に入れない。
- 画像内の簡易ラダー図や命令語風表現は、実在ソフト画面の再現ではなく、公式資料で確認した表記を参考にした「概念図」として作る。
- 実在GX Works3画面、実在GOT画面、実在メーカーUI、メーカー公式画面スクリーンショット風の画像は作らない。
- 三菱電機ロゴ、GOTロゴ、GX Works3ロゴ、メーカー製品ロゴ、型式銘板、実在製品ラベルは画像に入れない。
- 公式資料で確認した表記であっても、画像内では読みやすさを優先し、細かいパラメータ、実機画面の詳細、長文説明を詰め込まない。
- 型式固有、機種固有、シリーズ固有の仕様・配線・通信・パラメータ・アラーム・安全事項は、公式資料で確認できた範囲だけを書く。
- 公式資料で確認できない場合は、本文では一般的な考え方として表現し、画像では汎用的な概念図に留める。
- 公式英語資料がある英語記事では、英語公式資料の用語を優先する。
- 日本語記事では日本語公式資料の用語を優先する。
- 日本語元記事を英語化する場合は、日本語用語をそのまま直訳せず、英語公式資料で使われる用語に合わせる。
- 日本語版と英語版で用語・説明範囲が異なる場合、英語記事では英語版公式資料を優先する。
- 英語公式資料が見つからない場合は、日本語公式資料を参照してもよいが、英語記事では一般化して書き、型式固有情報は断定しない。

公式資料で確認してから使う対象:

- PLCデバイス表記
  - 入力デバイス
  - 出力デバイス
  - 内部リレー
  - ラッチリレー
  - アナンシェータ
  - ステップリレー
  - タイマ
  - カウンタ
  - データレジスタ
  - ファイルレジスタ
  - インデックスレジスタ
  - リンクデバイス
  - 特殊リレー
  - 特殊レジスタ

- ラダー図の基本表記
  - a接点 / NO contact
  - b接点 / NC contact
  - コイル / coil
  - 出力コイル / output coil
  - セット / SET
  - リセット / RST
  - 立上り / rising edge
  - 立下り / falling edge
  - パルス / pulse
  - インターロック / interlock
  - 自己保持 / self-holding / seal-in
  - タイマ回路
  - カウンタ回路

- 基本命令・応用命令
  - OUT
  - SET
  - RST
  - MOV
  - 比較命令
  - 加算
  - 減算
  - 乗算
  - 除算
  - タイマ命令
  - カウンタ命令
  - 立上り検出
  - 立下り検出
  - ワンショット
  - データ転送
  - 演算
  - 変換
  - 比較
  - シフト
  - ラッチ
  - リセット

- GOT / HMI 用語
  - GOT
  - HMI
  - screen
  - object
  - switch
  - lamp
  - numerical display
  - numerical input
  - alarm
  - recipe
  - monitor
  - device monitor
  - communication setting
  - connection
  - PLC connection
  - screen design

- サーボ / インバーター / モーション用語
  - servo motor
  - servo amplifier
  - positioning
  - origin return / home return
  - jog operation
  - pulse train
  - electronic gear
  - parameter
  - alarm
  - inverter
  - frequency
  - acceleration time
  - deceleration time
  - speed command
  - torque
  - simple motion
  - motion module
  - network
  - communication

注意:
上記は「確認対象カテゴリ」であり、未確認のまま固定用語として扱わない。
記事ごとに公式資料で確認した範囲だけを採用する。

### 英語記事の公式参照元ルール
- 英語記事 `en/articles/{slug}.html` を作成する場合は、原則としてメーカーの英語公式ページ、Global / US / International 公式ページ、英語版公式マニュアル、英語版カタログ、英語版ダウンロードページを優先して確認する。
- 日本語記事を元に英語化する場合でも、英語記事では英語公式資料を優先する。
- 日本語公式ページや日本語取扱説明書を参照してよいが、その場合は英語記事内で英語圏向けに自然な一般表現へ整理する。
- 型式固有の仕様、配線、通信、パラメータ、アラーム、設定手順、安全上の注意は、英語公式資料で確認できない限り断定しない。
- 日本語版と英語版の公式資料の両方がある場合:
  - 日本語記事では日本語公式資料を優先する。
  - 英語記事では英語公式資料を優先する。
  - 両方を確認できる場合は、英語記事では英語版の用語・表記・説明範囲を優先する。
  - 日本語版と英語版で用語や記載範囲が異なる場合は、英語記事では英語版に合わせる。
- 英語公式資料が見つからない場合は、日本語公式資料を参照してもよい。ただし、英語記事では「一般的な考え方」として表現し、メーカー・型式固有の仕様は断定しない。
- 英語記事の画像内テキストも、英語公式資料で使われる表現を優先する。
- 英語記事のPR説明または記事作成報告では、確認した英語公式参照元、日本語公式参照元、英語公式が見つからなかった場合の扱いを簡潔に記載する。

英語記事の公式参照優先順位:
1. メーカーの英語公式ページ / Global / US / International 公式ページ
2. 英語版の公式マニュアル・英語版カタログ・英語版ダウンロードページ
3. 英語版が見つからない場合、日本語公式ページ・日本語取扱説明書
4. 日本語公式を参照した場合は、英語圏向けに一般化して書く
5. 型式固有・法規・安全・配線・通信・パラメータは、英語公式で確認できない限り断定しない

### 周辺機器メーカー記事の公式参照ルール
- センサー、画像センサー、バーコードリーダ、ロボシリンダ、電動アクチュエータ、空圧機器、電磁弁、エアシリンダ、FRL、スピードコントローラ、圧力スイッチなど、特定メーカー機器に近い記事では、メーカー公式情報を一次参照元として確認する。
- 周辺機器記事では、以下のメーカー公式サイト・公式資料・公式マニュアル検索ページ・公式カタログ入口を優先して確認する。

#### 公式参照元URL

三菱電機FA:
- https://www.mitsubishielectric.com/fa/download/search.page?mode=manual

KEYENCE:
- https://www.keyence.co.jp/
- https://www.keyence.co.jp/download/
- https://www.keyence.com/downloads/

IAI:
- https://www.iai-robot.co.jp/
- https://www.iai-robot.co.jp/download/
- https://www.intelligentactuator.com/

SMC:
- https://www.smcworld.com/
- https://www.smcworld.com/catalog/
- https://www.smcworld.com/catalog/en/

CKD:
- https://www.ckd.co.jp/
- https://www.ckd.co.jp/kiki/
- https://www.ckd.co.jp/kiki/en/


#### 英語記事化時のメーカー別参照優先

- 三菱電機FA:
  - 英語記事では Mitsubishi Electric FA Global の英語マニュアル、英語版GOT / GX Works3 / MELSEC / MELSERVO / FR / Simple Motion 関連資料を優先する。
  - 公式マニュアル検索:
    - https://www.mitsubishielectric.com/fa/download/search.page?mode=manual

- KEYENCE:
  - 日本語記事では `keyence.co.jp` を優先する。
  - 英語記事では `keyence.com` の公式商品情報、英語版ダウンロード、英語版マニュアルを優先する。
  - 英語参照元:
    - https://www.keyence.com/
    - https://www.keyence.com/downloads/

- IAI:
  - 日本語記事では `iai-robot.co.jp` を優先する。
  - 英語記事では IAI / Intelligent Actuator の英語公式ページ、英語版カタログ、英語版取扱説明書を優先する。
  - 英語参照元:
    - https://www.intelligentactuator.com/

- SMC:
  - 日本語記事では SMC公式サイトの日本語資料を優先する。
  - 英語記事では SMCの英語カタログ、英語版製品情報、英語版取扱説明書を優先する。
  - 英語参照元:
    - https://www.smcworld.com/catalog/en/

- CKD:
  - 日本語記事では CKD日本語商品情報を優先する。
  - 英語記事では CKD英語商品情報、英語版カタログ、英語版取扱説明書を優先する。
  - 英語参照元:
    - https://www.ckd.co.jp/kiki/en/

- 安川電機:
  - 英語記事では Yaskawa Global / English の公式資料、英語版マニュアル、英語版ダウンロードを優先する。
  - 英語参照元:
    - https://www.yaskawa-global.com/

- オリエンタルモーター:
  - 英語記事では Oriental Motor English / Global の公式資料、英語版マニュアル、英語版カタログを優先する。
  - 英語参照元:
    - https://www.orientalmotor.com/

- パナソニック インダストリー:
  - 英語記事では Panasonic Industry Global / English の公式商品情報、英語版カタログ、英語版資料を優先する。
  - 英語参照元:
    - https://industry.panasonic.com/global/en

- 富士電機:
  - 英語記事では Fuji Electric Global / English の公式商品情報、英語版カタログ、英語版資料を優先する。
  - 英語参照元:
    - https://www.fujielectric.com/

- オムロン:
  - 英語記事では OMRON Industrial Automation Global / English の公式商品情報、英語版マニュアル、英語版カタログを優先する。
  - 英語参照元:
    - https://www.ia.omron.com/

- IDEC:
  - 英語記事では IDEC US / English の公式商品情報、英語版カタログ、英語版取扱説明書を優先する。
  - 英語参照元:
    - https://us.idec.com/

- PATLITE:
  - 英語記事では PATLITE Global / English の公式商品情報、英語版カタログ、英語版取扱説明書を優先する。
  - 英語参照元:
    - https://www.patlite.com/

- RKC / CHINO / Azbil:
  - 英語記事では各メーカーの英語公式ページ、英語版製品情報、英語版カタログ、英語版取扱説明書を優先する。
  - 日本語資料しか確認できない場合は、英語記事では一般化して表現し、型式固有仕様は断定しない。

- メーカー名、シリーズ名、型式、仕様値、配線方式、通信方式、設定項目、注意事項を扱う場合は、公式資料で確認できた範囲だけを書く。
- 公式資料で確認できない型式固有の仕様は断定しない。
- 販売店ページ、通販ページ、個人ブログ、二次情報だけを根拠に仕様説明を作らない。
- 公式資料が見つからない場合は、記事内では一般的な考え方に留め、「機種ごとの詳細はメーカー資料を確認する」と明記する。
- PDF直リンクは版数変更やURL変更の可能性があるため、原則として公式トップ、公式ダウンロード入口、公式カタログ入口、公式マニュアル検索ページをルールに記載する。
- 生成画像では、メーカーの実在UI、実在ロゴ、実在製品ラベル、型式銘板の完全再現は避ける。
- 画像は「概念図」「模式図」「一般的な機器イメージ」として作成する。
- 記事作成時の報告またはPR説明に、確認した公式参照元を簡潔に記載する。

| 対象 | 優先参照元 | 主な確認内容 |
|---|---|---|
| 三菱電機 GOT / HMI | 三菱電機FA公式マニュアル検索、GOT2000 / GT Designer3関連マニュアル | GOT本体、接続、画面設計、表示部品、通信 |
| 三菱電機 GX Works3 / MELSEC | 三菱電機FA公式マニュアル検索、GX Works3 / MELSEC iQ-F / iQ-R関連マニュアル | ラダー、接点、コイル、命令語、内部デバイス、モニタ |
| KEYENCE | KEYENCE公式サイト、公式マニュアル、公式ダウンロード、商品情報 | センサー、画像処理、測定器、バーコードリーダ、PLC/通信、設定項目 |
| IAI | IAI公式サイト、取扱説明書、カタログ、コントローラ資料 | ロボシリンダ、電動アクチュエータ、コントローラ、I/O信号 |
| SMC | SMC公式サイト、Webカタログ、取扱説明書、製品個別資料 | 空圧機器、電磁弁、エアシリンダ、FRL、圧力スイッチ |
| CKD | CKD公式サイト、商品情報、取扱説明書、カタログ | 空圧機器、電磁弁、シリンダ、流体制御機器 |


### サーボ・インバーター・温調器・安全機器などの公式参照ルール
- サーボモーター、サーボアンプ、インバーター、シンプルモーション、ステッピングモーター、モータードライバ、温調器、温度センサー、表示灯、積層信号灯、ブザー、安全機器、リレー、タイマ、カウンタ、センサー、計装機器を扱う記事では、メーカー公式サイト、公式マニュアル、公式カタログ、取扱説明書、製品個別資料を一次参照元として確認する。
- 型式固有の仕様、配線、通信方式、パラメータ、設定手順、異常コード、注意事項、安全上の制限は、公式資料で確認できた範囲だけを書く。
- 公式資料で確認できない内容は断定しない。
- 販売店ページ、通販ページ、個人ブログ、二次情報だけを根拠に仕様説明を作らない。
- 公式資料が見つからない場合は、記事内では一般的な考え方に留め、「機種ごとの詳細はメーカー資料を確認する」と明記する。
- 生成画像では、メーカーの実在UI、実在ロゴ、型式銘板、実在製品ラベル、公式画面スクリーンショット風の完全再現は避ける。
- 画像は「概念図」「模式図」「一般的な機器イメージ」として作成する。
- 記事作成時の報告またはPR説明に、確認した公式参照元を簡潔に記載する。

#### 三菱電機FA 拡張対象
- 公式マニュアル検索:
  - https://www.mitsubishielectric.com/fa/download/search.page?mode=manual
- 対象:
  - MELSERVO / MR-Jシリーズ
  - MR Configurator2
  - FR-A800 / FR-E800 などのインバーター
  - FR Configurator2
  - MELSEC iQ-R / iQ-F Simple Motion Module
  - SSCNET / CC-Link IE TSN / CC-Link IE Field 関連
  - GX Works3 のシンプルモーション設定
- ルール:
  - 三菱電機FAのサーボ、インバーター、シンプルモーション、ネットワーク、設定ソフトを扱う場合は、三菱電機FA公式マニュアル検索ページから該当シリーズの公式マニュアルを確認する。

#### 安川電機
- 公式サイト:
  - https://www.yaskawa.co.jp/
  - https://www.yaskawa.co.jp/download/
  - https://www.yaskawa-global.com/
- 対象:
  - ACサーボドライブ
  - Σシリーズ
  - サーボパック
  - インバーター
  - モーションコントローラ
  - エンコーダ
  - サーボ調整
- ルール:
  - 安川電機のサーボ、サーボパック、インバーター、モーション機器を扱う場合は、安川電機公式サイト、公式ダウンロード、取扱説明書を一次参照元にする。

#### オリエンタルモーター
- 公式サイト:
  - https://www.orientalmotor.co.jp/
  - https://www.orientalmotor.co.jp/ja/download/
  - https://www.orientalmotor.com/
- 対象:
  - ステッピングモーター
  - ブラシレスモーター
  - ACモーター
  - 小型ギヤードモーター
  - モータードライバ
  - 冷却ファン
- ルール:
  - ステッピングモーター、ブラシレスモーター、小型モーター、モータードライバ、冷却ファンを扱う場合は、オリエンタルモーター公式サイト、公式ダウンロード、取扱説明書、製品カタログを一次参照元にする。

#### パナソニック インダストリー
- 公式サイト:
  - https://industry.panasonic.com/jp/ja
  - https://industry.panasonic.com/global/en
- 対象:
  - MINASサーボ
  - FAセンサー
  - リレー
  - スイッチ
  - 制御部品
  - モータードライバ
- ルール:
  - パナソニック インダストリーのサーボ、FAセンサー、リレー、スイッチ、制御部品を扱う場合は、公式商品情報、公式カタログ、取扱説明書を一次参照元にする。

#### 富士電機
- 公式サイト:
  - https://www.fujielectric.co.jp/
  - https://www.fujielectric.com/
- 対象:
  - インバーター
  - FRENICシリーズ
  - 低圧遮断器
  - 電磁開閉器
  - 電源機器
- ルール:
  - 富士電機のインバーター、低圧機器、電源機器を扱う場合は、富士電機公式サイト、公式カタログ、取扱説明書、製品情報を一次参照元にする。

#### オムロン
- 公式サイト:
  - https://www.fa.omron.co.jp/
  - https://www.ia.omron.com/
- 対象:
  - 近接センサー
  - 光電センサー
  - リレー
  - タイマ
  - カウンタ
  - 温調器
  - PLC
  - 安全リレー
  - 非常停止・安全機器
- ルール:
  - オムロンのセンサー、リレー、タイマ、カウンタ、温調器、PLC、安全機器を扱う場合は、オムロン公式FAサイト、商品情報、マニュアル、カタログを一次参照元にする。

#### IDEC
- 公式サイト:
  - https://jp.idec.com/
  - https://us.idec.com/
- 対象:
  - 押しボタンスイッチ
  - セレクタスイッチ
  - 表示灯
  - 非常停止スイッチ
  - 安全リレー
  - 端子台
  - 制御盤部品
- ルール:
  - IDECのスイッチ、表示灯、非常停止、安全機器、端子台、制御盤部品を扱う場合は、IDEC公式サイト、製品情報、カタログ、取扱説明書を一次参照元にする。

#### PATLITE
- 公式サイト:
  - https://www.patlite.co.jp/
  - https://www.patlite.com/
- 対象:
  - シグナルタワー
  - 表示灯
  - 回転灯
  - ブザー
  - 音声合成報知器
  - 積層信号灯
- ルール:
  - PATLITEのシグナルタワー、表示灯、回転灯、ブザー、報知機器を扱う場合は、PATLITE公式サイト、製品情報、カタログ、取扱説明書を一次参照元にする。

#### RKC / CHINO / Azbil
- 公式サイト:
  - https://www.rkcinst.co.jp/
  - https://www.chino.co.jp/
  - https://www.azbil.com/jp/
- 対象:
  - 温調器
  - 熱電対
  - 測温抵抗体
  - PID制御
  - 調節計
  - 記録計
  - 計装機器
- ルール:
  - 温調器、温度センサー、熱電対、測温抵抗体、PID制御、調節計、計装機器を扱う場合は、RKC / CHINO / Azbil などの公式サイト、製品情報、カタログ、取扱説明書を一次参照元にする。

| 対象 | 優先参照元 | 主な確認内容 |
|---|---|---|
| 三菱電機 サーボ / インバーター / シンプルモーション | 三菱電機FA公式マニュアル検索、MELSERVO / FR / Simple Motion / MR Configurator2 / FR Configurator2 関連マニュアル | サーボ、アンプ、インバーター、パラメータ、配線、通信、アラーム、モーション設定 |
| 安川電機 | 安川電機公式サイト、公式ダウンロード、取扱説明書 | サーボ、サーボパック、インバーター、モーション機器、エンコーダ、調整 |
| オリエンタルモーター | オリエンタルモーター公式サイト、公式ダウンロード、取扱説明書、カタログ | ステッピングモーター、ブラシレスモーター、ACモーター、ドライバ、冷却ファン |
| パナソニック インダストリー | パナソニック インダストリー公式サイト、製品情報、カタログ、取扱説明書 | MINASサーボ、FAセンサー、リレー、スイッチ、制御部品 |
| 富士電機 | 富士電機公式サイト、製品情報、カタログ、取扱説明書 | インバーター、FRENIC、低圧遮断器、電磁開閉器、電源機器 |
| オムロン | オムロンFA公式サイト、商品情報、マニュアル、カタログ | センサー、リレー、タイマ、カウンタ、温調器、PLC、安全機器 |
| IDEC | IDEC公式サイト、製品情報、カタログ、取扱説明書 | スイッチ、表示灯、非常停止、安全リレー、端子台、制御盤部品 |
| PATLITE | PATLITE公式サイト、製品情報、カタログ、取扱説明書 | シグナルタワー、表示灯、回転灯、ブザー、報知機器 |
| RKC / CHINO / Azbil | 各社公式サイト、製品情報、カタログ、取扱説明書 | 温調器、温度センサー、熱電対、測温抵抗体、PID制御、計装機器 |

## 0.4. 短い依頼でも省略しない標準確認
- ユーザー依頼が短い場合でも、記事制作前の標準確認は省略しない。
- 「次の記事」「英語化しよう」「これで進めて」などの短い依頼は、標準フローの開始指示として扱う。
- ChatGPT / Codex は、ユーザーに毎回テンプレ依頼文を求めず、必要なルールファイル・元記事・テンプレ・公式参照元・画像ルールを自動確認する。
- 作成ファイル名、配置先、画像フォルダ名は最初から公開配置に合わせる。
- ユーザーにリネームや配置判断をさせない。
- 公式参照が必要な記事では、本文作成前に公式参照元を整理する。
- 記事ごとの公式参照元は、必要に応じて docs/reference-notes/{slug}.md に記録する。

## 0.5. 英語記事化・導線追加チェック（最重要）
英語記事 `en/articles/{slug}.html` を作成・追加した場合は、記事本体だけでなく、必ず以下を1セットで確認する。

対象ファイル:
- `articles/{slug}.html`
- `en/articles/{slug}.html`
- `en/index.html`
- `en/categories/{category}.html`
- `assets/data/search-index.json`
- `sitemap.xml`
- `docs/en-article-backlog.md`

必須確認:
- 日本語記事 `articles/{slug}.html` の language-menu から、英語記事 `../en/articles/{slug}.html` へ直接リンクしているか
- 日本語記事側の自己リンクが `./{slug}.html` になっているか
- 日本語記事側の language-menu small 文言が `日本語記事` / `English article` になっているか
- 日本語記事側に `日本語トップ` / `English top` が残っていないか
- 英語記事 `en/articles/{slug}.html` の language-menu から、日本語記事 `../../articles/{slug}.html` へ戻れるか
- 英語記事側の自己リンクが `{slug}.html` または既存テンプレ同等になっているか
- 英語カテゴリページ `en/categories/{category}.html` に記事カードまたは記事リンクが追加されているか
- 英語トップ `en/index.html` に追加する場合は、トップ棚の表示リンク数ルールを守っているか
- 英語トップ `en/index.html` の `New articles` は6件固定。新規追加時は古い1件を押し出し、7件以上にしない
- 日本語トップ `index.html` の `新着記事` も6件固定。新規追加時は古い1件を押し出し、7件以上にしない
- トップ棚へ追加する場合は、4件固定を守り、5件目として追加しない
- トップ棚の `View all` / `すべてを見る` と記事数表示を戻さない
- 棚のカテゴリトップ導線は、左側のラベル・画像・説明エリアのリンクで担保する
- 右側の1〜4記事リンクは個別記事リンクとして維持する
- 英語トップの `Series` カードは戻さない
- 英語トップの `Popular articles` は10件固定
- `assets/data/search-index.json` に英語記事URL `/en/articles/{slug}.html` が追加されているか
- `sitemap.xml` に `https://denkicontrol.com/en/articles/{slug}.html` が追加されているか
- `docs/en-article-backlog.md` の該当slugが完了済み `[x]` になっているか
- `/seo/sitemap.xml` は非運用なので触らない

注意:
- 「英語記事を公開した」だけでは完了扱いにしない。
- 日本語記事から英語記事へ切り替えられること、英語記事から日本語記事へ戻れることを必ず確認する。
- カテゴリ・トップ・検索・sitemap が通っていても、language-menu が古いままなら未完了とする。
- 導線追加タスクでは、対象が英語側だけに見えても `articles/{slug}.html` の日本語記事側 language-menu を必ず確認する。

## 1. 記事テーマ・カテゴリ確認
- 記事テーマが既存記事と重複しすぎていないか確認する
- カテゴリを決める
  - 制御の基礎
  - 回路
  - 工具
  - 比較・使い分け
- 回路記事の場合は、概要だけでなく簡略ラダー例・回路例・条件と出力の見本を入れる
- サーボやシンプルモーションなど応用寄りの内容は、ベーシック記事に無理に入れない

## 2. スラッグ・URL確認
- 記事スラッグを決める
- ファイル名は articles/slug.html にする
- canonical / og:url は以下の形式にする
  - https://denkicontrol.com/articles/slug.html
- URLは後から変えない前提で決める

## 3. 画像準備
- 画像フォルダは記事スラッグに合わせる
  - assets/images/slug/
- 画像は用途ごとに別ファイルにする
- 1枚にまとめた画像は使わない
- 通常記事では、ヒーロー画像をOGP兼用してもよい。
- ヒーロー画像は左側にHTML文字が乗る余白を残す
- SNSや検索結果で見ても記事テーマが分かるようにする
- hero画像には、記事タイトルまたは記事テーマが分かる短いタイトル文を必ず入れる
- 本文図や細かい表はヒーローに入れない
- 実在メーカーUIやロゴは入れない
- 人物キャラクターは docs/image-generation-rules.md の guide-characters 参照ルールに従う
- 人物を入れる場合は assets/images/guide-characters/ の既存2人を基準にする
- 新しい別キャラを勝手に作らない
- 記事固有画像の拡張子は原則 `.png` とする
- 人物入り画像は `guide-characters` 参照を必須にする
- 同一記事5枚は `hero` をアンカーにして統一感を維持する
- 1画像1用途を徹底する
- 生成後に用途・キャラ・禁止要素を自己検品する



### GX Works3命令語シリーズの画像5枚ルール
GX Works3命令語シリーズでは、原則として以下の5枚を**別ファイル**で用意する。

- slug-hero.png
- slug-ogp.png
- slug-overview.png
- slug-comparison.png
- slug-check-flow.png

役割：
- hero：記事上部のメイン画像。左側にHTML文字が乗る余白を残す。
- ogp：SNS・リンク共有用サムネイル。細かい表や小さい文字を入れすぎない。
- overview：本文の基本説明図。
- comparison：使い分け・比較表・違いの整理。
- check-flow：うまく動かない時の確認手順。

注意：
- 1枚に5枚分の内容をまとめない。
- 1回の画像生成では1枚の用途だけを作る。
- 他4枚の内容を混ぜない。
- 実在メーカーUIやロゴは入れない。
- 既存の先輩・後輩キャラの雰囲気を維持する。


### 本文内キャラチェック
- guide-characters 内の既存キャラだけを使っているか
- 先輩キャラと後輩キャラの役割が自然か
- 会話欄で、先輩・後輩の画像が別テイストになっていないか
- 会話欄の画像は `div.talk-avatar > img` になっているか
- 注意ボックス内の画像は `caution-character-box` / `caution-character` 構造になっているか
- 注意ボックス内の `h3` と `p` が、キャラ右側の同じ `div` にまとまっているか
- 注意ボックス内のキャラサイズが PC 36px / スマホ 30px 基準になっているか
- 注意ボックス内のキャラが大きすぎて、本文より目立っていないか
- `.talk-avatar` のサイズと `.caution-character img` のサイズを混同していないか
- 頭身の高い立ち絵や別系統キャラが本文中に混ざっていないか

### 先輩・後輩会話パートの画像参照チェック
- `talk-thread` を使う場合、HTML出力前に `assets/images/guide-characters/` の実在ファイル名を確認したか
- `div.talk-avatar > img` 構造になっているか
- `src` が実在する guide-characters ファイルを参照しているか
- 存在しない画像名を推測で書いていないか
- 先輩発言に先輩キャラ画像を使っているか
- 後輩発言に後輩キャラ画像を使っているか
- 先輩・後輩の役割が逆になっていないか
- 記事固有画像や生成画像を会話アイコンに流用していないか
- 画像パスが記事階層に合っているか
- 英語記事では alt が英語になっているか
- 日本語記事では alt が日本語になっているか

禁止例:
- 実在確認なしで `kouhai-chibi-question.png` のようなファイル名を書く
- `senpai` / `kouhai` を名前だけで判断し、実在確認を省略する
- 会話アイコンを記事用説明画像で代用する
- 新しいキャラ画像を勝手に作る

## 4. 画像構成の目安
通常記事：
- slug-hero.png
- slug-overview.png
- slug-control-flow.png または slug-operation-flow.png
- slug-checkpoints.png

回路記事：
- slug-hero.png
- slug-overview.png
- slug-ladder.png
- slug-checkpoints.png

必要に応じて、回路記事では以下も追加可：
- slug-operation-flow.png


### 公式資料参照チェック
- 技術的な説明を含む記事か確認したか
- メーカー公式ページ、公式カタログ、公式マニュアル、公式技術資料を確認したか
- 仕様値・設定値・配線・圧力範囲・電流容量・安全条件を推測で書いていないか
- メーカーや型式で変わる内容を一般論として断定していないか
- 公式資料で確認できない内容に「一般的には」「機種により異なる」などの注意表現を入れているか
- 実機では公式マニュアルを確認するよう本文で促しているか
- 英語記事では、必要に応じて公式英語ページや公式英語資料も確認したか
- 非公式ブログやAI生成文だけを根拠にしていないか

## 5. HTML作成ルール
- 新規記事HTMLは完成済み記事HTMLを完全コピーして必要箇所だけ差し替える
- 見た目だけ似せるのではなく、構造をコピーする
- 新規記事HTML作成時は、記事本文構造と固定ヘッダーの参照元を分ける
  - 記事本文構造：完成済み記事HTMLをコピー
  - 固定ヘッダー：必ず `index.html` の最新版を参照
  - 固定フッター：必ず `index.html` の最新版文言を基準にし、`articles/*.html` 用の相対リンクへ調整
  - 共通キャラ画像：`assets/images/guide-characters/` の既存2人を使う
- 固定ヘッダー、検索フォーム、右カラム、section-card、talk-thread、related-grid、site-search.js、固定フッターは維持する
- site-search.js は重複読み込みしない
- 新しい独自CSSテンプレートを作らない
- 新規記事HTMLでは、コピー元テンプレートのレスポンシブCSSを省略・短縮・圧縮・統合しない
- とくに以下のメディアクエリは必ず維持する
  - `@media (max-width:1100px)`
  - `@media (max-width:900px)`
  - `@media (max-width:768px)`
  - `@media (min-width:744px) and (max-width:1100px)`
  - `@media (max-width:640px)`
- iPad / iPad Pro 幅の表示崩れ防止のため、`@media (min-width:744px) and (max-width:1100px)` は必須チェック項目とする
- 上記の中間幅指定では、`.article-hero`、`.article-hero::before`、`.article-hero::after`、`.article-hero-copy`、`h1`、`.hero-lead`、`.top-summary`、`.side-rail` の補正を落とさない
- `.article-hero::before` の中間幅指定では、ヒーロー背景画像の過剰拡大を防ぐため `right center / auto 92% no-repeat` 相当の指定を維持する
- コピー元に古いフッターがあっても流用せず、必ず固定フッターへ差し替える
- 英語記事 `en/articles/*.html` では、右カラム `Support this site` に `section.side-card.support-card`（2ボタン: `Buy me a coffee` / `Support via PayPal`）を必ず維持し、1ボタンの `support-button` 版へ変更しない

### 本文の読みやすさ・強調表現チェック（必須）
- 新規記事では、本文をただ長く流すだけにせず、重要ポイントが目に止まるようにする
- 覚えてほしい一文や結論には `strong` を適度に使う
- 重要キーワードや現場で覚えてほしい語句には、下線風・マーカー風の強調を使ってよい
- 既存テンプレートにある `key-highlight` / `field-highlight` / `note-box` / `danger-box` などの強調ボックスを、内容に合わせて適度に使う
- 「ここだけ覚える」「現場ではここを見る」「間違えやすい点」は、文章中で自然に目が止まる形にする
- 色使いは Denki Control Lab らしく、白背景・青ベースを基本に、補助色として緑・黄・赤を少し使う
- 強調表現は読みやすさを助けるために使い、広告バナー風・派手すぎる装飾・過剰な色数にはしない
- 1セクション内で強調を入れすぎない。目安は重要ポイント1〜3か所程度
- スマホで流し読みしても、重要ポイント・注意点・結論が拾えるか確認する
- 英語記事でも日本語記事でも、重要な文がフラットに埋もれないようにする
- 強調する対象は、読者が覚えるべき結論・現場確認ポイント・誤解しやすい注意点に限定する
- 装飾のためだけの強調や、意味の薄い太字連発は避ける

例:

```html
<p>
  Star-delta starting is mainly used to
  <strong>reduce motor starting current</strong>,
  not to increase motor power.
</p>
```

### スマホ固定ヘッダー正規化チェック（必須）
- スマホ幅で `.brand-sub` が非表示か確認したか
- スマホ幅で `.brand-title` が表示されるか確認したか
- `.brand-copy` / `.brand-title` を `display:none` にしていないか確認したか
- `language-menu` が検索欄（`header-search`）の左側にあるか確認したか
- `language-menu-current` が狭幅で非表示になるか確認したか
- `header-search` が右側で見切れていないか確認したか
- `site-search.js` が1回だけ読み込まれているか確認したか
- 日本語記事は `index.html` 基準、英語記事は `en/index.html` 基準で確認したか
- 英語記事監査で日本語 `index.html` を基準にしていないか確認したか
- 日本語記事監査で `en/index.html` を基準にしていないか確認したか
- CSS全文を空白正規化（空白・改行差を無視）して、必須指定セットが揃っているか確認したか
- 1行CSSでも複数行CSSでも、同一指定が揃っていればOK判定にしているか
- 必須指定が欠けるページは C 判定として修正対象にしているか

標準補正CSS（必要ページのみ、`</style>` 直前に後勝ち追加）:

```css
@media (max-width:640px){:root{--header-h:66px;}html{scroll-padding-top:82px;}.site-header{padding:7px 8px;}.site-header-inner{gap:6px;}.brand{gap:7px;}.brand-logo{height:36px;}.brand-title{font-size:13px;letter-spacing:0;}.brand-sub{display:none;}.language-menu-button{width:34px;min-width:34px;min-height:34px;}.header-search{flex:0 1 138px;min-height:36px;}.search-box{padding:0 9px;gap:6px;}.search-box-input{font-size:11px;}.header-search-icon{width:14px;height:14px;}.search-box-panel{right:-48px;width:min(340px,94vw);}}
```


### 日本語記事 language-menu 表示チェック（必須）
- 対象: `articles/*.html`
- 日本語記事側の言語メニューで、英語版記事が存在する場合は英語リンクを `../en/articles/{slug}.html` にする
- 日本語記事側の自己リンクは `./{slug}.html` にする
- 記事ページでは `日本語トップ` / `English top` と表示しない
- 記事ページでは small 文言を `日本語記事` / `English article` にする
- トップページ用文言と記事ページ用文言を混同しない
- リンク先だけでなく、表示文言も記事ページ用になっているか確認する

### 英語記事 language-menu 表示チェック（必須）
- 対象: `en/articles/*.html`
- `language-menu-button` の表示が既存英語記事テンプレと一致しているか確認する
- `.language-menu-icon` に `"Language"` などの長い文字列を入れない
- `.language-menu-icon` は `🌐` など短いアイコン表示、または既存テンプレと同等の短い表示にする
- `.language-menu-current` は `English` など現在言語のみを表示する
- 公開表示で `"Language English"` のような重複・不自然表示になっていないか確認する
- `language-menu-panel` の JA / EN リンクが正しいか確認する
- 英語記事側の日本語リンクは `../../articles/{slug}.html`
- 英語記事側の英語リンクは `{slug}.html` または既存テンプレ同等の自己リンク
- `language-menu` の開閉JSが効くか確認する
- クリックで開く、外側クリックで閉じる、Escapeで閉じることを確認する
- `site-search.js` は1回だけ読み込む
- 検索フォーム構造を壊さない

正しい例:
```html
<button class="language-menu-button" type="button" aria-expanded="false" aria-controls="language-menu-panel">
  <span class="language-menu-icon" aria-hidden="true">🌐</span>
  <span class="language-menu-current">English</span>
</button>
```

禁止:
- スマホで `.brand-copy` を `display:none` にしない
- `.brand-title` を消さない
- `.brand-sub` を表示したままにしない
- `language-menu` と `header-search` の順番を入れ替えない
- `header-search` を固定幅で大きくしすぎない
- 本文側スマホCSS（`article-hero` / `talk` / `section-card` / `summary-card` / `mini-toc` など）を巻き込んで編集しない
- 既存 `@media` ブロックを雑に編集しない
- `site-search.js` を重複読み込みしない
- `sitemap.xml` / `assets/data/search-index.json` / `/seo/sitemap.xml` をヘッダー補正タスクで触らない

articles/*.html 用の固定フッター：

```html
<footer class="site-footer">
  <div class="container">
    <p>
      現場で使う工具と、制御の基本を、迷いにくく整理してまとめています。<br>
      <a href="../privacy-policy/">プライバシーポリシー</a> | <a href="../contact/">お問い合わせ</a>
    </p>
  </div>
</footer>
```

固定フッタールール：
- 「© 電気と制御の実務メモ」だけの簡易フッターにしない
- `<footer>` だけの裸フッターにしない
- `footer` には必ず `class="site-footer"` を付ける
- `footer` 内には必ず `div class="container"` を入れる

基準記事：
- articles/relay-basic.html
- articles/forward-reverse-circuit-basic.html
- articles/lamp-indicator-circuit-basic.html



### 英語記事の先輩・後輩会話画像ルール（必須）
- 対象: `en/articles/*.html` で `talk-thread` / `talk-avatar` を使う場合
- 先輩・後輩画像は `assets/images/guide-characters/` の共通画像を必ず使う
- 記事個別フォルダや古い `assets/images/common/` 画像を推測で使わない
- `img src` は GitHub `main` 上で実在確認済みのパスのみ使う
- 標準参照（英語記事）
  - 先輩: `../../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png`
  - 後輩: `../../assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png`

### 英語記事HTML作成・配置・PR確認時の必須チェック（talk-avatar）
- `talk-avatar img` の `src` が実在する
- 先輩画像がブラウザで表示される
- 後輩画像がブラウザで表示される
- alt テキストだけ表示されていない
- `../../assets/images/common/senpai-character.png` や `../../assets/images/common/kouhai-character.png` のような古い参照を残していない
- 記事個別画像フォルダ内に会話キャラ画像を置かない
- `guide-characters` の共通画像を使う
- CSS や `talk-thread` 構造を変更せず、必要な場合は `img src` のみ修正する

### 禁止事項（英語記事の会話画像）
- 先輩・後輩画像を記事ごとに別名で推測して参照しない
- 実在確認なしで画像パスを書かない
- alt 表示だけになっている状態で Step 1 完了扱いにしない
- 上記未解消のまま Step 2 導線追加へ進まない
- 画像参照修正のために固定ヘッダー、レスポンシブCSS、本文、Support this site、Related articles を触らない


### 英語記事テンプレート再発防止・必須確認（Step 1完了前）
以下は**任意ではなく必須確認**とする。未達が1つでもある場合、Step 1 完了扱いにしない。

#### 1) talk-thread / talk-avatar 画像表示（必須）
- 対象: `en/articles/*.html` で `talk-thread` / `talk-avatar` を使う場合
- `talk-avatar img` の `src` が GitHub main 上で実在する
- 先輩画像が `assets/images/guide-characters/` の共通画像を参照している
- 後輩画像が `assets/images/guide-characters/` の共通画像を参照している
- 公開確認URLで先輩・後輩画像が実際に表示されている
- altテキストだけが表示されていない
- altテキストだけ表示されている状態では Step 1 完了扱いにしない
- 画像参照修正が必要な場合は `img src` のみ修正し、CSSやtalk-thread構造を触らない

標準参照:
- 先輩: `../../assets/images/guide-characters/friendly_worker_with_helmet_and_smile.png`
- 後輩: `../../assets/images/guide-characters/curious_worker_with_a_cheerful_expression.png`

禁止:
- `../../assets/images/common/senpai-character.png`
- `../../assets/images/common/kouhai-character.png`
- 実在確認なしの推測ファイル名
- 記事固有画像フォルダ内の画像を会話アイコンに流用すること
- 新しい別キャラを勝手に作ること

#### 2) HTML内の全画像参照チェック（必須）
英語記事HTML作成・配置・PR確認時、以下を一覧化して確認する。
- `img src`
- `og:image`
- `twitter:image`
- CSS内の `background:url(...)`
- `article-hero::before` の画像参照

必須確認:
- 記事固有画像は `assets/images/{slug}-en/` を参照している
- 会話キャラ画像は `assets/images/guide-characters/` を参照している
- ロゴやfaviconは `assets/images/common/` を参照している
- 他記事slugの画像フォルダを参照していない
- 404になる画像参照がない
- hero / ogp / 本文図のファイル名がHTML指定と一致している

禁止:
- 別記事の画像フォルダ参照を残すこと
- hero画像とOGP画像の指定を取り違えること
- 実在確認なしで画像パスを書くこと

#### 3) 固定ヘッダー比較確認（必須）
英語記事作成・配置・PR確認時、固定ヘッダーを対象言語の基準ページと比較する。

英語記事の基準:
- `en/index.html`
- または直近の完成済み英語記事

必須確認:
- 固定ヘッダーを記事ごとに再設計していない
- `header.site-header` の基本構造が基準と一致している
- ロゴが表示される
- `brand-title` が表示される
- スマホ幅で `brand-sub` が非表示になる
- `language-menu` が `header-search` の左側にある
- `header-search` が右側で見切れない
- `site-search.js` が1回だけ読み込まれている

禁止:
- 必要のない `header-nav` / `header-link` / Home / Featured / Categories などの独自ボタンを記事側へ勝手に追加しない
- 固定ヘッダーCSSを記事ごとに再設計しない
- レスポンシブCSSを短縮・圧縮・統合しない
- 既存 `@media` ブロックを雑に編集しない

#### 4) Support this site リンク確認（必須）
英語記事 `en/articles/*.html` では、右カラムの `Support this site` を必須確認項目にする。

必須構造:
- `section.side-card.support-card`
- `h3.support-card-title`
- `p.support-card-text`
- `div.support-card-actions`
- `a.support-link.support-link--coffee`
- `a.support-link.support-link--paypal`

必須ボタン:
- `Buy me a coffee`
- `Support via PayPal`

必須確認:
- 2ボタン構成になっている
- href が空ではない
- href が壊れたURLではない
- `target="_blank"` と `rel="noopener"` が維持されている
- 公開ページでボタンが表示されている

禁止:
- 1ボタン版にしない
- `Support this site` を省略しない
- 右カラムから外さない
- 記事ごとにCSSや文言を再設計しない
- supportリンクの href / target / rel を勝手に変えない

#### 5) Step 1完了前の公開URL表示確認（必須）
英語記事の Step 1 完了前に、確認用URLをPC幅とスマホ幅で確認する。

確認対象:
- ロゴ表示
- 固定ヘッダー
- language-menu
- 検索フォーム
- hero画像
- 本文画像
- 会話キャラ画像
- Support this site
- Related articles
- `site-search.js` の重複なし

完了条件:
- 画像がaltテキストだけになっていない
- 固定ヘッダーが崩れていない
- スマホ幅で検索欄が見切れていない
- Support this site が2ボタンで表示されている
- Related articles に404候補がない

### 英語記事作成時の language-menu チェック（日本語記事側含む）
- 日本語記事側 language-menu の英語項目が `English article / 英語記事を開く` になっているか
- 日本語記事側 language-menu の英語項目が `English top / United States` のまま残っていないか
- 日本語記事側 language-menu 英語項目の `href` が `../en/articles/{slug}.html` になっているか
- 英語記事側 language-menu から `../../articles/{slug}.html` で日本語記事へ戻れるか

## 6. HTMLで差し替えるもの
- title
- meta description
- canonical
- OGP / Twitter
- h1
- hero-lead
- パンくず末尾
- カテゴリ
- top-summary の文言
- mini-toc の項目
- section-card の本文
- article-figure の画像パスとalt
- 表やチェック項目
- 関連記事
- 右カラムの目次とまとめ
- footer-nav のリンク

## 7. OGP・meta確認
- 通常記事：og:image / twitter:image はヒーロー画像をOGP兼用してもよい
- GX Works3命令語シリーズ：OGP専用画像 `slug-ogp.png` を使う
- GX Works3命令語シリーズ：og:image / twitter:image は `slug-ogp.png` を指定する
- GX Works3命令語シリーズ：hero画像とOGP画像を混同しない
- meta description は記事内容に合わせる
- canonical と og:url が記事URLと一致しているか確認する
- 古い共通OGPや汎用画像を使わない

## 8. 関連記事確認
- あわせて読みたい記事は3〜6件を目安にする
- 回路記事・制御記事では自然につながるなら6件まで入れてよい
- 存在しない記事へのリンクは入れない
- 自己リンクは入れない
- 実務の流れで自然につながる記事を選ぶ
- GitHub最新で実在確認済みの記事だけ使う
- 英語記事の関連記事カードは `en/articles/*.html` に実在する記事だけか確認する
- 日本語記事の存在だけで英語関連記事へ入れていないか確認する
- 各 `href` を実際のGitHub最新`main`で確認する
- 404になるリンクがないか確認する
- 関連記事は3〜6件の範囲で、実在記事だけになっているか確認する

## 9. 回路記事の必須確認
回路記事では、以下のどれかを必ず入れる。

- 簡略ラダー例
- 回路例
- 条件と出力の見本
- 動作順序図

例：
- ランプ表示回路 → 運転中条件 / 停止中条件 / 異常条件から各ランプ出力への基本ラダー例
- 正転・逆転回路 → 正転側 / 逆転側の基本ラダー例
- ブザー回路 → 異常条件からブザー出力への基本ラダー例
- リセット回路 → 異常保持とリセット解除の基本例

## 10. GitHub追加後の確認URL
記事HTMLと画像をGitHubへ入れたら、確認用URLを案内する。

形式：
https://denkicontrol.com/articles/slug.html

## 11. 現在の標準フロー
### 11.0 2ステップ完了フロー（標準）
- 記事制作は原則2ステップ完了フローで進める。Step 1では記事HTML・画像・確認用URLまで作成し、導線追加は行わない。ユーザーが確認用URLを確認してOKした後のみ、Step 2として index.html、categories/*.html、assets/data/search-index.json、sitemap.xml へ導線追加する。
- 途中確認は原則不要。ただし、導線追加前（Step 2開始前）だけは必ずユーザー確認を入れる。
- Step 1では `index.html` / `categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` を触らない。
- `/seo/sitemap.xml` は非運用なので触らない。

### 11.1 Step 1（自律進行）
1. 記事候補を決める
2. GitHub最新の既存HTMLを確認し、重複がないか確認する
3. 公式情報・命令語の基本動作を確認する
4. ChatGPTが新規記事HTML（完成HTML本文）を作成する
5. ChatGPTが画像生成ルールに従って画像を1枚ずつ作成する
6. ユーザーがHTMLと画像をGitHubへ追加する（またはCodexへ「完成HTMLと画像の配置のみ」を依頼する）
7. Codexが関与する場合は、完成HTMLと画像の配置・静的確認のみを実施する
8. Codexは完成HTML本文を勝手に再構成せず、CSS/テンプレート構造の省略・圧縮・再設計を行わない
9. Step 1時点では導線追加を実施しない
10. safe to merge: YES / NO を報告し、確認用URLを共有する

### 11.2 Step 2（ユーザーOK後のみ）
1. ユーザーが確認用URLを確認する
2. ユーザー明示OKを受ける（この確認は必須）
3. 導線追加を実施する（日本語記事側の言語メニュー / `en/index.html` / `en/categories/*.html` / `assets/data/search-index.json` / `sitemap.xml` / `docs/en-article-backlog.md`）
4. 公開後監査を実施する（search-index missing / extra / duplicate、sitemap重複、件数整合）
5. 最後に `safe to close: YES / NO` を出す
6. `en/index.html` の `Popular articles` は10件以内か確認する
7. 新記事を `Popular articles` に入れる場合は、単純追加ではなく入れ替えにする
8. `Popular articles` が11件以上になっている場合は `safe to close: NO` とする

補足：
- 通常は1記事ずつ完了フローを使う。
- ユーザーが希望した場合、または同じシリーズでテンプレートが安定している場合は、5記事まとめ制作フローを使ってよい。
- 5記事まとめ制作では、HTML作成・画像作成・表示確認・導線追加を段階ごとにまとめて行う。
- 5記事まとめ制作でも2ステップ制を適用し、Step 1完了（記事・画像・確認用URL）と、ユーザーOK後のStep 2（導線追加）を分離する。
- ただし、表示確認前に導線追加へ進まない。
- 導線追加時は sitemap / search-index / categories / index.html をまとめて更新してよい。
- articles/*.html と assets/images/** の修正と、導線追加作業は分ける。
- エージェント運用でも、標準は1記事ずつ完了させる。
- 3〜5記事まとめて導線反映してよいのは例外運用とする。
- 通常は記事単体の品質確認と導線確認を優先する。
- 導線追加エージェントは、ユーザー明示OK前に実行しない。

### 11.1 5記事まとめ制作時の画像運用メモ
- 5記事まとめ制作でも、画像は用途ごとに別ファイルで作る。
- 画像生成指示では、どの記事のどの用途の画像かを必ず明記する。
- 例：
  - article-a hero
  - article-a ogp
  - article-a overview
  - article-a comparison
  - article-a check-flow
- 1回で複数画像を作る場合でも、各画像の役割を混ぜない。
- 画像確認時は、記事単位で OK / 修正必要 を分けて記録する。

## 12. CODEX反映ルール
記事HTMLと画像は1記事ずつユーザーがGitHubへ追加する。
その後、3〜5記事分をまとめてCODEXで以下へ反映してよい（例外運用）。

- index.html
- categories/*.html
- assets/data/search-index.json
- sitemap.xml
- トップページの記事数表示

CODEX反映時の注意：
- articles/** と assets/images/** は原則触らない
- /seo/sitemap.xml は非運用なので触らない
- search-index の missing / extra / duplicate を確認する
- sitemap の重複を確認する
- トップの記事数表示がカテゴリ別件数と一致しているか確認する


## 新規記事作成エージェントの禁止事項
- 既存記事と重複したテーマを作らない
- GitHub最新の articles/*.html を確認せずに候補確定しない
- 公式情報を確認せずに命令語の挙動を断定しない
- ヘッダー・検索フォーム・フッターを独自に作り直さない
- side-rail を抜かさない
- site-search.js を重複読み込みしない
- 画像5枚の用途を混ぜない
- sitemap / search-index / categories / index.html をHTML作成タスク中に触らない
- 導線追加タスク中に articles/*.html や画像を触らない

## 13. 新規記事作成の最終チェック
新規記事HTMLを出す前に、以下を確認する。

- コピー方式で作っているか
- 固定ヘッダーが維持されているか
- 固定ヘッダーの `brand-title` / `brand-sub` が `index.html` と一致しているか
- ヘッダーナビの文言と `href` が `index.html` 基準になっているか
  - ホーム：`../index.html`
  - 人気記事：`../index.html#featured`
  - カテゴリ：`../index.html#category`
- 検索placeholderが「キーワードで検索」になっているか
- ロゴ画像が記事階層用の `../kougu_logo_middle.png` になっているか
- コピー元テンプレートと比較して、レスポンシブ用メディアクエリが欠落していないか
- CSSを短縮・圧縮しただけに見えても、テンプレート由来のレスポンシブ補正が抜けていないか
- 先輩・後輩キャラ画像が `guide-characters` の実在パスになっているか
- 「電気工事士の工具箱」「工具・制御・現場の基本をやさしく整理」など旧ヘッダー文言が残っていないか
- サイト内検索フォームが維持されているか
- 右カラムがあるか
- section-card 構造があるか
- talk-thread があるか
- related-grid があるか
- site-search.js が1回だけ読み込まれているか
- 画像パスが記事スラッグと一致しているか
- ヒーロー画像がOGPにも指定されているか
- 回路記事ならラダー例または回路例があるか
- 関連記事が3〜6件あるか
- 存在しないリンクがないか
- canonical / og:url / 確認URL が一致しているか

## 14. 新しいチャットでの使い方
新しいチャットでは、以下のように伝える。

このチャットでは my-site の新規記事制作を進めます。
docs/article-workflow.md、docs/image-generation-rules.md、docs/new-article-checklist.md、docs/codex-update-rules.md を前提にしてください。
画像生成時は docs/image-generation-rules.md の guide-characters 参照ルールに従ってください。

確認コマンド：
ls -la docs
rg -n "新規記事|OGP兼用|guide-characters|コピー方式|ラダー例|3〜6件|site-search.js|CODEX|/seo/sitemap.xml" docs/new-article-checklist.md

報告形式：
Summary
- 作成したdocsファイル
- 入れた主なチェック項目

Testing
- ls確認結果
- rg確認結果

判定
safe to merge / not safe


## 固定ヘッダーの扱い

記事HTMLの本文テンプレートと、サイト共通の固定ヘッダーは分けて扱う。

### 記事本文テンプレート
新規記事・古い記事の移植では、以下の基準記事を完全コピーして、必要箇所だけ差し替える。

- `articles/relay-basic.html`
- `articles/forward-reverse-circuit-basic.html`
- `articles/lamp-indicator-circuit-basic.html`

維持する本文構造：
- `article-hero`
- `article-hero-copy`
- `top-summary`
- `summary-card`
- `mini-toc-card`
- `page-layout`
- `main-column`
- `side-rail`
- `side-card`
- `section-card`
- `talk-thread`
- `article-figure`
- `check-grid`
- `table-wrap`
- `related-grid`

### 固定ヘッダー
固定ヘッダーは、最終的にトップページ `index.html` の最新版を基準に全ページで統一する。

- 記事移植作業のたびに、固定ヘッダーを個別に作り直さない。
- 記事テンプレート内のヘッダーCSSを勝手に再設計しない。
- 検索フォーム構造や `site-search.js` の読み込みを重複させない。

固定ヘッダーを修正する場合は、記事本文修正とは別タスクにする。

その場合の対象は以下に限定する。

触ってよい範囲：
- `header.site-header` 周辺
- 固定ヘッダー関連CSS
- サイト内検索フォーム構造
- `site-search.js` の読み込み確認

触らない範囲：
- 記事本文
- `article-hero`
- `top-summary`
- `section-card`
- `related-grid`
- 画像パス
- Amazonリンク
- canonical / OGP
- `search-index.json`
- `sitemap.xml`
- `/seo/sitemap.xml`

### 判断ルール
記事本文テンプレートの統一作業では、固定ヘッダーの完全統一は後回しにしてよい。

ただし、以下の場合は要修正。
- ヘッダーが壊れている
- 検索フォームが使えない
- `site-search.js` が重複している

固定ヘッダーの見た目統一は、後日 `index.html` を基準に CODEX で全記事横断修正する。

## 固定ヘッダーをトップページと統一する時の詳細ルール

固定ヘッダーを全記事へ統一する場合は、「トップページ風に寄せる」のではなく、`index.html` の固定ヘッダーを正として扱う。

### 基本方針

固定ヘッダーは、記事ごとに再設計しない。
記事側の既存ヘッダーCSSを少し調整して似せるのではなく、`index.html` の固定ヘッダーHTML・CSS・参照変数を基準にする。

固定ヘッダー修正は、記事本文テンプレート修正とは別タスクにする。
本文・画像・関連記事・Amazonリンク・canonical・OGPを同時に触らない。

### 必ず揃えるもの

固定ヘッダー統一時は、以下を `index.html` 基準で揃える。

- `header.site-header` のHTML構造
- ロゴ画像の構造
- `brand-title` / `brand-sub` の構造
- `header-nav` / `header-link` の構造
- サイト内検索フォームのDOM構造
- `site-search.js` の読み込み位置
- 固定ヘッダー関連CSS
- 固定ヘッダーが参照するCSS変数

### フォーム部品の継承までトップページと一致させる

固定ヘッダーを `index.html` と統一する場合は、見た目の数値だけでなく、検索フォームの `input` / `button` のフォント継承もトップページと一致させる。

`index.html` には以下の共通指定があるため、記事側でもこれを維持する。

```css
button,input{
  font:inherit;
}
```

### 記事用に変えてよいもの

記事ページでは、パスだけ記事用に変更してよい。

- `kougu_logo_middle.png` → `../kougu_logo_middle.png`
- `#top` または `index.html#top` → `../index.html#top`
- `#featured` → `../index.html#featured`
- `#category` → `../index.html#category`
- `assets/js/site-search.js` → `../assets/js/site-search.js`

### ヘッダーナビ確認（文言 + href）

記事ページのヘッダーナビは、文言だけでなく `href` も必ず確認する。

- ホーム：`../index.html`
- 人気記事：`../index.html#featured`
- カテゴリ：`../index.html#category`

### サイト内検索フォームの必須DOM構造

検索フォームは、全記事で以下の構造を維持する。

```html
<form class="header-search search-box" id="siteSearch" aria-label="サイト内検索" role="search">
  <label class="sr-only" for="site-search-input">サイト内検索</label>
  <input id="site-search-input" class="search-box-input" type="search" placeholder="キーワードで検索" autocomplete="off" enterkeyhint="search">
  <button class="search-box-button" type="submit" aria-label="検索">
    <span class="header-search-icon" aria-hidden="true"></span>
  </button>
  <div class="search-box-panel" id="site-search-panel" hidden>
    <ul class="search-box-results" id="site-search-results"></ul>
    <p class="search-box-empty" id="site-search-empty" hidden>該当する記事がありません</p>
  </div>
</form>
```


## 12. 新規記事の最終ブランド整合チェック（公開前）
公開前の最終確認で、旧サイト名・旧ブランド文言が残っていないかを必ず確認する。

確認対象（新規記事 + 導線反映ファイル）：
- title
- meta description
- og:title
- og:description
- og:site_name
- twitter:title
- twitter:description
- header の brand-title / brand-sub
- footer 文言
- パンくず
- 本文内のサイト紹介文
- `assets/data/search-index.json` の description
- `categories/*.html` や `index.html` の導線文言

旧サイト名・旧文言の例（検出対象）：
- 電気工事士の工具箱
- 工具・制御・現場の基本をやさしく整理
- 旧ロゴ名や旧キャッチコピー
- 以前のサイト説明文

現在の基準：
- サイト名: 電気と制御の実務メモ
- 将来ブランド方針: 電気制御ラボ / Denki Control Lab
- キャッチコピー基準: 電気工事・PLC・制御を基礎から学ぶ実務ガイド

判定ルール：
- 旧サイト名・旧文言が1か所でも残っている場合は `safe to merge: NO` とする。
- すべて現行基準に一致している場合のみ `safe to merge: YES` とする。

- 記事固有画像は原則 `.png` で作成しているか
- 人物入り画像は `guide-characters` 参照必須を守っているか
- 同一記事5枚は `hero` をアンカーにして統一感を維持しているか
- 1画像1用途を守っているか
- 実在メーカーUI・ロゴを入れていないか
- 生成後に用途・キャラ・禁止要素を自己検品しているか
- 参照と違う別キャラになっていたら NG
- 画像5枚の雰囲気がバラついていたら NG

## 追加チェック（HTML先行・画像分割生成）
- 5記事制作では、まず5記事分のHTMLを先に作る
- 画像生成はHTML作成後、記事ごとに5枚ずつ行う
- 25枚を一括生成しない
- 記事固有画像は原則 `.png`
- HTML内の画像パスも `.png` で先に確定する
- 人物入り画像は `guide-characters` 参照必須
- 同一記事5枚は hero をアンカーにして統一感を維持する
- hero画像には記事タイトルまたは記事テーマ文を必ず入れる
- hero画像でタイトルがない場合はNG
- 1画像1用途を守る
- 参照と違う別キャラになっていたらNG
- 画像5枚の雰囲気がバラついていたらNG
- 画像生成後は自己検品（用途一致・キャラ一致・禁止要素なし）を実施する
- 導線追加はユーザーOK後のみ行う


## 画像ファイル名確定ルール

Codexは画像生成を行わない。
ただし、HTML作成時に画像フォルダ名・画像ファイル名・画像パスを必ず確定する。

画像はChatGPTで後から生成するため、CodexはHTML内に予定ファイル名を .png で指定する。

記事固有画像は原則 .png とする。
記事固有画像に .svg を指定しない。

基本の画像フォルダ:
assets/images/[slug]/

基本の画像5枚:
- [slug]-hero.png
- [slug]-ogp.png
- [slug]-overview.png
- [slug]-comparison.png
- [slug]-check-flow.png

HTML内の指定例:
- hero背景: ../assets/images/[slug]/[slug]-hero.png
- OGP画像: https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png
- Twitter画像: https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png
- overview本文画像: ../assets/images/[slug]/[slug]-overview.png
- comparison本文画像: ../assets/images/[slug]/[slug]-comparison.png
- check-flow本文画像: ../assets/images/[slug]/[slug]-check-flow.png

Codexは、HTML完成後にユーザーへ以下を必ず報告する。

- HTMLファイル名
- 画像フォルダ名
- 画像5枚のファイル名
- HTML内で使っている画像パス
- ChatGPTで画像生成すべき順番

報告例:
次にChatGPTで生成する画像:
1. [slug]-hero.png
2. [slug]-ogp.png
3. [slug]-overview.png
4. [slug]-comparison.png
5. [slug]-check-flow.png

## レスポンシブCSS維持ルール

Codexは新規記事HTML作成時に、既存テンプレートのレスポンシブCSSを落とさない。

必須維持:
- @media (max-width:1100px)
- @media (max-width:900px)
- @media (max-width:768px)
- @media (min-width:744px) and (max-width:1100px)
- @media (max-width:640px)

特に、iPad / iPad Pro相当幅でhero画像が過剰拡大しないように、以下の中間幅指定を維持する。

例:
@media (min-width:744px) and (max-width:1100px){
  .article-hero::before{
    background:url("../assets/images/[slug]/[slug]-hero.png") right center / auto 92% no-repeat;
    opacity:.24;
  }
  .article-hero-copy{
    width:min(100%,600px);
    padding:42px 34px;
  }
}

注意:
- 背景画像を 128% auto などにして過剰拡大させない。
- 既存テンプレートで安定している指定を優先する。
- hero画像の表示が崩れる場合は、記事本文ではなく .article-hero::before の背景指定を確認する。

## Codex用 HTML最終チェック

新規記事HTMLを作成したら、Codexは以下を確認する。

### 基本
- title が記事内容に合っている
- meta description が自然
- canonical が正しい
- og:url が正しい
- og:image が .png
- twitter:image が .png
- h1 が記事タイトルと一致している
- パンくず末尾が記事名になっている

### 画像
- 記事固有画像が .png 指定になっている
- .svg が記事固有画像に残っていない
- guide-characters配下の共通キャラ画像は変更していない
- 画像フォルダ名がslugと一致している
- 画像5枚のファイル名がルール通り
- OGP画像は absolute URL
- 本文画像は relative URL

### テンプレート
- header/search構造を維持している
- site-search.js がbody終了直前に1回だけ
- talk-thread構造を維持している
- talk-avatar > img 構造を維持している
- page-layout / main-column / side-rail を維持している
- related-grid を維持している
- check-grid を維持している

### レスポンシブ
- @media (min-width:744px) and (max-width:1100px) がある
- iPad幅でhero背景が過剰拡大しない指定になっている
- @media (max-width:900px) がある
- @media (max-width:640px) がある

### ブランド
- 旧サイト名が残っていない
- 旧ブランド文言が残っていない
- 現行表示名「電気と制御の実務メモ」に合っている
- Denki Control Lab 方針と矛盾しない

### 関連記事
- 関連記事リンクが実在している
- 存在しないHTMLへリンクしていない
- 自己リンクになっていない
- 関連記事カード構造を維持している

判定:
上記にNGがある場合は safe to move to image generation: NO とする。
すべてOKなら safe to move to image generation: YES とする。

## Codex禁止事項

Codexは新規記事作成時に以下を行わない。

- 画像生成をしない
- 記事固有画像に .svg を指定しない
- 画像ファイル名をHTML作成後に勝手に変更しない
- 既存テンプレートのCSSを作り直さない
- header/search構造を作り直さない
- site-search.js を複数回読み込まない
- talk-thread構造を崩さない
- guide-characters配下のキャラ画像を別名にしない
- iPad用レスポンシブCSSを削除しない
- ユーザーOK前に導線追加しない
- /seo/sitemap.xml を触らない
- 存在しない関連記事リンクを入れない
- 旧サイト名・旧ブランド文言を残さない


## 記事候補の重複確認ルール

新規記事候補の重複確認は、原則としてGPTが行う。

Codexは、GPTが「重複確認済み」として渡した記事テーマをもとにHTML作成を行う。

Codex側の最低限確認:
- 同名HTMLファイルが存在しない
- 同一slugが存在しない
- 同一URLが search-index.json に存在しない
- 同一URLが sitemap.xml に存在しない

ただし、記事テーマの重複判断や候補選定はGPT側で行う。

## Codexの作業範囲

Codexは、GPTから渡された記事作成指示をもとに、HTML作成とGitHub反映を行う。

Codexが行うこと:
- コピー元テンプレート記事を選ぶ
- 完成済み記事HTMLを完全コピーする
- title / meta / canonical / OGP / h1 / 本文 / 関連記事を差し替える
- 画像フォルダ名を確定する
- 画像5枚のファイル名を確定する
- HTML内の画像パスを .png で指定する
- レスポンシブCSSを維持する
- GitHubにHTMLを反映する
- 画像配置後に表示確認する
- ユーザーOK後に導線追加する

Codexが行わないこと:
- 記事候補の本格的な重複判断
- 記事候補の最終選定
- 画像生成
- guide-characters の新規作成
- ユーザーOK前の導線追加
- /seo/sitemap.xml の更新

## Codex用 HTML作成ルール

新規記事HTMLは、完成済み記事HTMLを完全コピーして必要箇所だけ差し替える。

コピー元候補:
- articles/relay-basic.html
- articles/forward-reverse-circuit-basic.html
- articles/lamp-indicator-circuit-basic.html
- 同カテゴリ・同シリーズの最新完成記事

差し替える対象:
- title
- meta description
- canonical
- og:title
- og:description
- og:url
- og:image
- twitter:title
- twitter:description
- twitter:image
- h1
- hero lead
- breadcrumb末尾
- top-summary
- mini-toc
- section-card本文
- article-figure画像パス
- figcaption
- 関連記事カード
- side-rail目次

変更しない対象:
- CSS全体構造
- クラス名
- header/search構造
- site-search.js読み込み位置
- talk-thread構造
- talk-avatar > img 構造
- guide-characters画像パス
- page-layout / main-column / side-rail
- related-grid
- check-grid
- レスポンシブメディアクエリ

禁止:
- ゼロからHTML構造を作り直さない
- CSSを新規設計しない
- クラス名を勝手に変えない
- 検索ヘッダーを作り直さない
- 会話構造を作り直さない
- 関連記事構造を作り直さない

## 画像パス確定ルール

Codexは画像生成を行わない。
ただし、HTML作成時に画像フォルダ名・画像ファイル名・画像パスを必ず確定する。

記事固有画像は原則 .png とする。
記事固有画像に .svg を指定しない。

基本の画像フォルダ:
assets/images/[slug]/

基本の画像5枚:
- [slug]-hero.png
- [slug]-ogp.png
- [slug]-overview.png
- [slug]-comparison.png
- [slug]-check-flow.png

HTML内では以下のように指定する。

- hero背景:
  ../assets/images/[slug]/[slug]-hero.png

- OGP画像:
  https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png

- Twitter画像:
  https://denkicontrol.com/assets/images/[slug]/[slug]-ogp.png

- overview本文画像:
  ../assets/images/[slug]/[slug]-overview.png

- comparison本文画像:
  ../assets/images/[slug]/[slug]-comparison.png

- check-flow本文画像:
  ../assets/images/[slug]/[slug]-check-flow.png

HTML完成後、記事固有画像に .svg が残っている場合はNGとする。

## レスポンシブCSS維持ルール

Codexは新規記事HTML作成時に、既存テンプレートのレスポンシブCSSを落とさない。

必須維持:
- @media (max-width:1100px)
- @media (max-width:900px)
- @media (max-width:768px)
- @media (min-width:744px) and (max-width:1100px)
- @media (max-width:640px)

特に、iPad / iPad Pro相当幅でhero画像が過剰拡大しないように、以下の中間幅指定を維持する。

例:
@media (min-width:744px) and (max-width:1100px){
  .article-hero::before{
    background:url("../assets/images/[slug]/[slug]-hero.png") right center / auto 92% no-repeat;
    opacity:.24;
  }
  .article-hero-copy{
    width:min(100%,600px);
    padding:42px 34px;
  }
}

禁止:
- 中間幅で background-size:128% auto などにしてhero画像を過剰拡大させない
- iPad用レスポンシブCSSを削除しない
- max-width系メディアクエリを省略しない


## 12. ChatGPT / Codex 役割分担
- ChatGPT
  - 記事テーマ選定補助
  - 元記事確認
  - 公式情報確認方針の整理
  - 英語記事HTML本文作成
  - メタ情報・関連記事案・画像名設計
  - 画像生成
  - 画像採用判定
- Codex
  - GitHub上のファイル配置
  - 完成HTMLの静的チェック
  - 画像ファイル存在確認
  - 関連記事リンク実在確認
  - Step 2導線追加
  - search-index / sitemap / backlog の整合確認
  - PR作成・報告
- Codexの禁止
  - 完成HTML本文を勝手に大幅改稿しない
  - 記事の技術説明を独自判断で増減しない
  - 画像を1枚にまとめない
  - Step 1中に導線追加ファイルを触らない
  - Step 2中に記事本文や画像を触らない
  - `/seo/sitemap.xml` を触らない


## 記事更新フロー
- 記事更新では、原則として全文を丸ごと書き換えない。
- まず更新理由を確認する。
  - 公式マニュアル更新
  - 新しい機器・仕様・用語の追加
  - 英語公式資料の追加
  - 古い説明の修正
  - 画像・導線・SEOの改善
  - 読者に誤解を与える可能性がある記述の修正
- 次に、新情報の公式参照元を確認する。
- 既存記事内の影響範囲を特定する。
- 必要箇所だけ差分更新する。
- 記事全体の流れが崩れる場合だけ、章構成を調整する。
- 公式資料・reference-notes・採用用語も必要に応じて更新する。
- 英語記事が存在する場合は、日本語記事と英語記事の両方に影響するか確認する。
- 画像内の用語や図解にも影響する場合は、画像更新の必要性を別途判断する。
- 更新PRでは「変更理由」「更新した範囲」「更新しなかった範囲」「確認した公式参照元」を報告する。
- 既存記事の雰囲気、会話構造、検索ヘッダー、関連記事、固定フッター、レスポンシブCSSは維持する。
- Codexは、更新理由と影響範囲が明確でない状態で記事本文を大幅改稿しない。

記事更新時の確認項目:
- 更新理由が明確か
- 公式参照元が確認されているか
- 差分更新で足りるか
- 全文書き換えが必要な理由があるか
- reference-notes を更新する必要があるか
- terminology を更新する必要があるか
- 画像更新が必要か
- 日英記事の同期が必要か
- search-index / sitemap / backlog に影響するか
- safe to merge: YES / NO を報告しているか


## 日本語記事のStep 1納品構成例
```text
articles/{slug}.html
assets/images/{slug}/{slug}-hero.png
assets/images/{slug}/{slug}-ogp.png
assets/images/{slug}/{slug}-overview.png
assets/images/{slug}/{slug}-comparison.png
assets/images/{slug}/{slug}-{optional-purpose}.png
docs/reference-notes/{slug}.md
```
