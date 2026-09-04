# 日本語記事バックログ（中級・実務フェーズ）

このファイルは、Denkicontrol / 電気と制御の実務メモの日本語記事について、テーマ別クラスターの現在地と次の判断を管理するバックログです。単純な記事本数や「あと何記事」を目標にはしません。

## 現在のフェーズ

- **初心者向け基礎層は完了**: `articles/safety-control-basic.html`（安全制御の全体像）までの公開をもって、いったん完成とする。
- 今後は **基礎 → 応用 → トラブル → 実務** の導線をテーマ別に強化する。
- 初心者向け記事を機械的に追加しない。検索需要、既存記事との重複、読者の次の疑問、内部リンク構造、テーマ別クラスターの不足を確認し、既存記事では埋められない場合だけ新規作成する。
- 安全制御基礎は当面、新規記事を量産する優先対象にしない。既存記事間の導線改善を先に検討する。

## 運用ルール

1. 候補へ着手する前に、`articles/*.html` の slug だけでなく title、見出し、扱う範囲を確認する。あわせて検索インデックス、サイトマップ、カテゴリ導線、過去の削除・差し替え履歴も必要に応じて確認する。
2. 候補は次の状態で管理する。
   - **優先**: クラスターの不足が明確で、検索意図と既存記事からの導線を確認して企画する。
   - **既存記事でカバー済み**: 原則として新規作成せず、必要なら既存記事を強化する。
   - **ハブ完成後に判断**: 先にハブと内部リンクを整え、独立記事が必要か再評価する。
   - **保留**: 現時点の優先クラスターより後に判断する。
3. 公開時は記事、画像、サイトマップ、検索インデックス、関連記事、カテゴリ導線、必要に応じた英語展開を一組として確認する。
4. 工具・比較系は原則として英語化対象外とする。

## 優先順位とクラスター監査

### 第一優先: PLC・入出力

#### 既存資産

- 基礎と信号の流れ: `plc-basic.html`、`input-output-basic.html`、`plc-xymd-device-basic.html`、`plc-scan-basic.html`
- I/O: `plc-io-allocation-basic.html`、`plc-io-unit-basic.html`
- トラブル: `plc-input-troubleshooting-basic.html`、`plc-output-troubleshooting-basic.html`、`plc-error-lamp-troubleshooting-basic.html`
- 電源・配線方式: `dc24v-power-supply-basic.html`、`dc24v-power-troubleshooting-basic.html`、`dc24v-common-basic.html`、`npn-pnp-basic.html`
- 実務ツール: `gx-works3-monitor-basic.html`、`gx-works3-device-monitor-basic.html`、`gx-works3-force-on-off-basic.html`、`gx-works3-cross-reference-basic.html`

#### 不足しているハブ（優先）

- [ ] **PLC入出力トラブルシューティング系ハブ**
  - main の実ファイルを確認した時点で、入力・出力・電源・COM・センサー／負荷を横断して切り分ける専用ハブは存在しない。
  - 仮題: 「PLC入出力トラブルシューティングの基本｜入力・出力・電源・COM・機器を切り分ける考え方」
  - 既存の入力／出力／DC24V／NPN・PNP／I/O記事を束ねることを主目的とし、個別記事の量産より先に企画する。

#### 個別候補

- **既存記事でカバー済み**: X、Y、M、Dの個別解説／スキャンタイム／I/O割付／入出力ユニット番号／COM／シンク・ソース入力／リレー・トランジスタ出力／PLCエラーランプ／デバイス値の確認／強制ON・OFF／クロスリファレンス。独立記事化せず上記既存記事の不足だけ強化する。
- **ハブ完成後に判断**: PLC入力はONしているのに出力が出ない、PLC出力はONしているのに機器が動かない、センサーは光っているのにPLC入力が入らない、現場で電源・入力・出力・機械を切り分ける基本。
- **優先候補**: PLCの停電保持、初期化処理、バッテリー、ワードとビット、アナログ値のスケーリング、PLCで小数を扱う考え方。
- **保留**: PLC通信（Ethernet・CC-Link・RS-485）、リモートI/O、PLCとタッチパネルの役割、GOTの画面部品、GOTでPLCデバイスを表示する考え方、GX Works3のコメント・デバイス検索・オンライン書込み・読出し／書込み、ラダー追跡手順。

### 第二優先: センサ・信号

#### 既存資産

- 共通基礎: `sensor-basic.html`、`npn-pnp-basic.html`、`sensor-2wire-3wire-basic.html`
- 個別機器: `proximity-sensor-basic.html`、`photoelectric-sensor-basic.html`、`pressure-switch-basic.html`、`flow-switch-basic.html`、`float-switch-basic.html`、`temperature-sensor-basic.html`、`encoder-basic.html`、`load-cell-basic.html`、`limit-switch-basic.html`、`reed-switch-basic.html`、`magnetic-switch-basic.html`、`area-sensor-basic.html`
- 接続・トラブル導線: `plc-input-troubleshooting-basic.html`、`limit-switch-troubleshooting-basic.html`

#### 候補の分類

- **既存記事でカバー済み**: 2線式／3線式、NPN／PNP、近接・光電・圧力・流量・フロート・温度・エンコーダ・ロードセル等の入口解説。センサーの茶・青・黒の配線色やNO／NCも、まず共通基礎記事内の扱いを確認して強化する。
- **優先候補**: センサー信号トラブルの横断ハブ、センサー入力のチャタリング、表示灯とPLC入力が一致しない時の切り分け、近接センサーが反応しない時、光電センサーが反応しない時、フロースイッチが反応しない時。
- **ハブ完成後に判断**: センサー表示灯、感度調整、透過型・回帰反射型・拡散反射型、投光器・受光器、圧力スイッチ設定値、リミットスイッチの種類・押し込み量、リードスイッチ位置調整、フロートスイッチのa／b接点、熱電対と測温抵抗体、エンコーダA／B／Z相、ロードセルのゼロ点・校正、センサーケーブルとシールド。
- **保留**: エリアセンサーとライトカーテンの違い、安全センサーと一般センサーの違い。安全制御基礎との重複を先に確認する。

### 第三優先: 制御盤・ノイズ

#### 既存資産

- ノイズ対策: `control-panel-grounding-basic.html`、`shielded-cable-basic.html`、`power-signal-wiring-separation-basic.html`、`noise-filter-basic.html`、`surge-protection-basic.html`
- アナログ信号: `analog-input-basic.html`、`analog-output-basic.html`
- 配線識別: `terminal-block-basic.html`、`terminal-block-jumper-basic.html`、`wire-number-marker-basic.html`、`control-panel-wire-color-basic.html`、`control-panel-label-basic.html`
- 盤内機器: `control-panel-cooling-fan-basic.html`、`panel-heater-basic.html`、`control-panel-outlet-basic.html`、`wiring-duct-basic.html`、`din-rail-basic.html`

#### 不足しているハブ（優先）

- [ ] **制御盤ノイズ対策ハブ（Control Panel Noise Reduction Basics 相当）**
  - main の実ファイルを確認した時点で、接地・シールド・配線分離・フィルタ・アナログ信号を一つの切り分け手順として束ねる専用ハブは存在しない。
  - 個別の「配線を離す理由」「電源線と信号線を分ける理由」は既存記事と重なるため、先にハブの検索意図と構成へ統合する。

#### 個別候補

- **既存記事でカバー済み**: 端子台の渡り配線・短絡バー・ジャンパ、線番の追い方、マークチューブ、配線色、盤アース、動力線／信号線の分離、シールド線、ノイズフィルタ、盤ファン、盤ヒータ、盤内コンセント、盤内ラベル。
- **優先候補**: ノイズらしい誤動作の切り分け、シールドの片側／両側接地を選ぶ考え方、FG・SG・PE、4–20mA／0–10V信号のノイズ診断。
- **ハブ完成後に判断**: センサーケーブルの保護、センサーのシールド接続、盤内温度上昇、主回路と制御回路の電源分岐、AC100V・AC200V・DC24Vの使い分け、制御盤内コモン線、配線図と実物線番の照合、電線色と線番の優先順位。
- **保留**: ヒューズとブレーカー、サーキットプロテクタとNFB、ELBとNFB、トランス一次／二次、CT二次側開放、パイロットランプAC／DC、表示灯不点灯、タワーライトの色。

### 第四優先: 空圧

#### 既存ハブと資産

- **ハブ公開済み**: `air-pneumatic-troubleshooting-guide.html`。新規作成候補ではない。
- 基礎・トラブル: `air-cylinder-basic.html`、`air-cylinder-troubleshooting-basic.html`、`solenoid-valve-troubleshooting-basic.html`、`solenoid-valve-manual-override-basic.html`、`air-valve-basic.html`、`speed-controller-basic.html`
- 周辺機器: `air-filter-regulator-lubricator-basic.html`、`air-regulator-basic.html`、`air-tube-fitting-basic.html`、`pneumatic-silencer-basic.html`、`pressure-gauge-basic.html`、`vacuum-ejector-basic.html`、`vacuum-switch-basic.html`

#### 候補の分類

- **既存記事でカバー済み**: エアシリンダ／電磁弁の基本確認、電磁弁の手動操作、スピードコントローラ、FRL、レギュレータ、チューブ・継手、サイレンサ、真空エジェクタ／スイッチ。まず既存ハブからの導線と記事内容を強化する。
- **ハブ完成後に判断**: エア圧低下、エア漏れ、シリンダの途中停止・速度不安定、メータイン／メータアウト、5・3・2ポート、シングル／ダブルソレノイド、コイル焼損、チューブの折れ・抜け・つぶれ、継手の外し方、一次側／二次側、FRLドレン、サイレンサ詰まり、真空吸着、吸着パッド、エアブロー、シリンダクッション、残圧抜き、空圧回路図・記号、電気信号と空圧動作の追跡。
- 独立記事は、既存ハブ／個別記事で答えられない検索意図が確認できたものだけ追加する。

### 第五優先: リレー・制御回路

#### 既存資産

- 基礎: `relay-basic.html`、`relay-socket-basic.html`、`a-contact-b-contact-basic.html`、`no-nc-basic.html`
- 回路: `self-hold-circuit.html`、`interlock-basic.html`、`timer-circuit-basic.html`、`counter-circuit-basic.html`、`reset-circuit-basic.html`、`one-shot-circuit-basic.html`、`forward-reverse-circuit-basic.html`、`alarm-hold-circuit-basic.html`、`buzzer-circuit-basic.html`
- 運転・表示: `start-stop-circuit-basic.html`、`manual-auto-selector-circuit-basic.html`、`home-return-circuit-basic.html`、`upper-lower-limit-circuit-basic.html`、`lamp-indicator-circuit-basic.html`

#### 候補の分類

- **優先候補**: 基礎回路から「入らない／切れない／効かない」を診断する実務ハブ、READY条件・運転許可条件、ハード／ソフトインターロック。
- **ハブ完成後に判断**: 自己保持が入らない／切れない、インターロック・タイマ・カウンタが動かない、リセット回路のミス、ワンショット、正転逆転インターロック、ブザー停止、アラーム保持／リセット、手動／自動、原点復帰、上限／下限、RUN・STOP・ALARM表示、MCR、停電復帰時の不意な起動防止。
- **既存記事でカバー済み**: AND／OR、直列／並列、a／b接点、自己保持・インターロック・タイマ・カウンタ・リセット・ワンショット・正転逆転の基礎。初心者向けの分割記事は増やさない。

### 第六優先: モーター・駆動

#### 既存資産

- `three-phase-induction-motor-basic.html`、`motor-nameplate-basic.html`、`motor-breaker-basic.html`、`thermal-relay-basic.html`
- `inverter-basic.html`、`servo-motor-basic.html`、`dc-motor-control-basic.html`
- `forward-reverse-circuit-basic.html`、`star-delta-start-basic.html`、`sto-basic.html`

#### 候補の分類

- **ハブ完成後に判断**: モーター不回転・うなり、サーマルトリップ、モーターブレーカー設定、マグネット補助接点・チャタリング、正逆転と相順。
- **保留**: インバータRUN・周波数指令・0–10V／4–20mA・正逆転・アラームリセット・不動診断、サーボON・原点復帰・アラーム、ロボシリンダ原点復帰・位置決め完了、DCモーター正逆転、モータードライバ。
- STO入力OFFは `sto-basic.html` と安全制御基礎を先に強化し、重複記事を作らない。現時点ではPLC、センサ、ノイズより後順位とする。

### 安全制御: 当面完成

- 中心ハブ: `safety-control-basic.html`
- 既存資産: `emergency-stop-switch-basic.html`、`safety-relay-control-basic.html`、`safety-door-switch-interlock-basic.html`、`light-curtain-basic.html`、`sto-basic.html`
- 非常停止と停止ボタン、安全回路と制御回路、解除・復旧・手動操作時の注意などは、まず既存記事の範囲と導線を確認する。当面は量産対象にせず、明確な不足と検索意図が判明した場合だけ再開する。

## 横断的な中級・実務候補

### トラブルシュート（各ハブへ割り当ててから判断）

- [ ] 設備が起動しない時に見る順番
- [ ] 自動運転に入らない時に見る順番
- [ ] 手動では動くが自動で動かない時の考え方
- [ ] ランプは点くのに機械が動かない時の見方
- [ ] 電磁弁のランプは点くのにシリンダが動かない時
- [ ] シリンダは動くがリードスイッチが入らない時
- [ ] 押しボタンを押しても反応しない時
- [ ] 急にブレーカーが落ちる時／ヒューズが切れる時
- [ ] たまにしか出ない異常の追い方／アラーム履歴の見方
- [ ] 図面がない時に線を追う考え方
- [ ] 部品不良と配線不良の切り分け

`dc24v-power-troubleshooting-basic.html` があるため「DC24Vが落ちる時」は既存記事でカバー済み。テスターによるDC24V・導通確認は既存 `tester.html` の範囲を確認し、独立記事の必要性を判断する。

### 実務・保守（保留）

- 電気作業前の電源確認、検電と測定、活線作業を避ける考え方、盤を開ける前の確認
- 非常停止解除・手動操作・エア残圧・モーター／センサー／電磁弁交換前の確認
- PLC変更前のバックアップ、復旧後の試運転、I/Oチェック表、試運転立会い、設備移設・盤改造
- 写真・現場メモ・線番を残す方法、後から追いやすいラダー

安全情報は断片的な記事へ分散させず、既存の安全制御記事との役割分担と監修可能性を確認してから企画する。

### 入口・まとめ記事（原則保留）

「PLC初心者が最初に覚える用語」「制御盤部品一覧」「センサー／空圧／ラダー用語一覧」「入力・処理・出力」「信号の流れ」「NO/NC・NPN/PNP・a/b接点」「図面・ラダー・実配線」「PLCとリレー」「センサー・リレー・PLC・電磁弁」「各分野の記事を読む順番」などの旧候補は、初心者向け記事を増やす目的では作らない。カテゴリや優先ハブで導線を解決できない場合だけ再評価する。

### 工具系（保留）

- テスターのAC／DC・導通、クランプメーター、圧着端子（丸・Y・棒・フェルール・被覆付き）、圧着ミス
- ストリッパー／電工ナイフ／結束バンド、マークチューブとラベルライター
- 制御盤・I/Oチェック・盤改造・空圧配管・センサー交換の工具、保護具

既存工具記事との重複を確認し、テーマ別クラスターの中級・実務導線に必要な場合だけ企画する。

## 重複監査メモ

- **端子台**: `terminal-block-basic.html` と `terminal-block-jumper-basic.html` が存在する。渡り線・短絡バー・ジャンパ候補は新規作成前提にしない。
- **線番／マークチューブ**: `wire-number-marker-basic.html` が両方を扱う。線番追跡・マークチューブ候補は既存記事強化を優先する。
- **配線色**: `control-panel-wire-color-basic.html` が存在する。一般的な配線色候補はカバー済み。センサー線色は検索意図を分けられるか確認する。
- **PLC入出力**: 基礎、I/O割付、I/Oユニット、入力／出力トラブル記事は存在するが、横断ハブは未確認。
- **センサ**: 共通基礎、NPN／PNP、2線／3線、主要機種の記事が存在する。個別不具合は既存記事の範囲を確認する。
- **空圧**: `air-pneumatic-troubleshooting-guide.html` が既存ハブ。ハブ新設ではなく不足だけを追加する。
- **ノイズ**: 接地、シールド、配線分離、フィルタの記事は存在するが、横断ハブは未確認。
- **安全制御**: `safety-control-basic.html` と主要個別記事が存在し、基礎層は当面完成扱い。

## 英語展開との整合

- `en/articles/` には既に多数の記事が存在するため、「日本語完成後に英語サイトをゼロから作る」段階ではない。
- `docs/en-article-backlog.md` は、日本語版が存在して英語版と導線が未完の項目を管理している。日本語側の候補数をそのまま英訳件数にしない。
- 今後は **日本語側で基礎→応用→トラブル→実務の導線が強いテーマ** かつ **海外でも検索意図が成立しやすいテーマ** を選ぶ。優先ハブを日本語で検証した後、既存英語記事との重複、英語カテゴリ導線、検索意図を確認して展開する。
- 工具・一般比較系を原則対象外とする既存方針は維持する。

## 企画前チェック

- [ ] 実ファイルの title・見出し・本文まで検索し、同一または実質同一の記事がない
- [ ] 既存記事の追記や内部リンク改善だけでは検索意図を満たせない
- [ ] 読者が基礎記事の次に抱く疑問として位置付けられる
- [ ] 優先クラスターと、基礎→応用→トラブル→実務のどこを埋めるか説明できる
- [ ] ハブを先に作るべき候補ではない（またはハブ企画の一部である）
- [ ] 日本語側の企画と英語展開方針が矛盾しない
