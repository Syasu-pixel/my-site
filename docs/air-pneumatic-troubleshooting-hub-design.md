# Air Pneumatic Troubleshooting Hub Design

## 1. Purpose
- Air Pneumatic Troubleshooting Guide は、既存の空圧系記事を「部品単体解説」から「症状→原因候補→確認順→次に読む記事」へ再編するハブとする。
- 主に以下の症状系検索意図を受ける設計にする。
  - エアシリンダが動かない
  - エアシリンダが遅い／片側だけ遅い
  - エアシリンダが途中で止まる
  - 圧力が低い
  - エア漏れがある
  - 電磁弁が切り替わらない
  - リードスイッチが入らない
- 目的は「読むこと」ではなく、現場で次にどこを見るかを判断できる導線提供とする。
- Whitepaper原則に合わせ、メーカー仕様書・回路図・設備安全ルール優先を明記する（本ハブは意思決定補助であり最終判断の代替ではない）。

## 2. Target Readers
- 電気工事士
- 設備保全担当
- 制御盤・FA設備に関わる初心者〜中級者
- PLC出力と空圧動作（電磁弁、シリンダ、圧力スイッチ、レギュレータ、スピコン、サイレンサ）の関係を実務で確認したい読者
- 英語版ターゲット
  - maintenance technician
  - field engineer
  - automation beginner

## 3. Search Intent
### JA primary intents
- エアシリンダ 動かない
- エアシリンダ 遅い
- エア圧 低い 原因
- エア漏れ 探し方
- 電磁弁 ランプ 点く シリンダ 動かない
- 空圧 トラブル 見る順番
- スピコン 調整
- サイレンサ 詰まり
- エアチューブ 抜け 漏れ

### EN primary intents
- air cylinder not moving
- pneumatic cylinder troubleshooting
- air pressure low troubleshooting
- air leak check
- solenoid valve clicks but cylinder does not move
- pneumatic troubleshooting guide
- speed controller adjustment
- pneumatic silencer clogged
- air tube fitting leak

## 4. Existing Article Inventory
実在HTML（`articles/*.html`, `en/articles/*.html`）を棚卸しし、ハブ視点で以下に分類する。

### A. Core spokes（ハブ中核）
- `air-cylinder-basic`（JA/ENあり）
- `air-cylinder-troubleshooting-basic`（JAのみ）
- `air-valve-basic`（JA/ENあり）
- `solenoid-valve-troubleshooting-basic`（JA/ENあり）
- `solenoid-valve-manual-override-basic`（JA/ENあり）
- `air-regulator-basic`（JA/ENあり）
- `speed-controller-basic`（JA/ENあり）
- `pneumatic-silencer-basic`（JA/ENあり）
- `air-tube-fitting-basic`（JA/ENあり）
- `pressure-switch-basic`（JA/ENあり）
- `air-filter-regulator-lubricator-basic`（JA/ENあり）
- `float-switch-basic`（JA/ENあり）
- `limit-switch-troubleshooting-basic`（JA/ENあり）
- `reed-switch-basic`（JA/ENあり）
- `pressure-gauge-basic`（JA/ENあり）
- `pressure-switch-vs-gauge-basic`（JA/ENあり）

### B. Supporting spokes（補助）
- `input-output-basic`（JA/ENあり）
- `plc-output-troubleshooting-basic`（JAのみ）
- `plc-input-troubleshooting-basic`（JA/ENあり）
- `control-panel-grounding-basic`（JA/ENあり）
- `power-signal-wiring-separation-basic`（JA/ENあり）
- `dc24v-power-troubleshooting-basic`（JA/ENあり）

### C. JA-only items relevant to this hub
- `air-cylinder-troubleshooting-basic`
- `plc-output-troubleshooting-basic`

方針:
- 英語ハブでは JA-only 記事へ無理に直接リンクしない。
- まず JAハブを先行実装し、EN側は EN実在記事のみで成立させる。
- EN不足記事は別PRで順次追加する（ハブ公開を止めない）。

### D. Not-yet-existing gap candidates (from backlog)
Air Pneumatic hubに直結する未作成候補を優先度付きで抽出する。

- P1（ハブ公開後すぐ必要）
  - エア圧が低い時に見る順番
  - エア漏れを探す時の基本
  - エアシリンダが途中で止まる原因
  - エアシリンダの速度が安定しない原因
  - 電気信号と空圧動作の流れを追う方法
- P2（中核導線強化）
  - 電磁弁の5ポート・3ポート・2ポートの違い
  - シングルソレノイドとダブルソレノイドの違い
  - 電磁弁の手動操作で確認すること
  - エアチューブの折れ・抜け・つぶれを見るポイント
  - レギュレータの一次側・二次側とは？
  - FRLのドレンとは？水抜きの基本
  - サイレンサが詰まるとどうなる？
- P3（安全・読図補完）
  - エア機器の残圧抜きとは？
  - 残圧で危ない動きをしないための考え方
  - 空圧回路図の読み方の基本
  - 空圧記号の読み方

## 5. Gap Articles
優先穴埋め記事（実装順の推奨）:
1. エア圧が低い時に見る順番
2. エア漏れを探す時の基本
3. エアシリンダが途中で止まる原因
4. エアシリンダの速度が安定しない原因
5. 電気信号と空圧動作の流れを追う方法
6. 電磁弁の5/3/2ポートの違い
7. シングル/ダブルソレノイドの違い
8. 残圧抜き・残圧安全の2本（安全ブロック補強）

## 6. Recommended Hub Type
比較対象:
- 記事型: `articles/air-pneumatic-troubleshooting-guide.html`（EN: `en/articles/...`）
- カテゴリ型: `categories/air-pneumatic-troubleshooting.html`（EN: `en/categories/...`）

### Comparison
- 記事型ハブ
  - 長所: 症状起点のストーリー（確認順）を記述しやすい。検索意図「troubleshooting guide」と一致しやすい。Quick conclusion / flow / symptom map を1ページで実装しやすい。
  - 短所: カテゴリ一覧との役割重複を避ける設計が必要。
- カテゴリ型ハブ
  - 長所: 既存カテゴリ導線との整合が取りやすい。運用ルールが単純。
  - 短所: 症状→確認順の実務フロー記述が薄くなりやすい。単なる記事一覧化のリスク。

### Recommendation
- **推奨: 記事型ハブ（JA/ENとも articles 配下）**
- 理由:
  1. Whitepaper 6.1 の「hub-and-spokeで broad intent を受ける親ページ」に最も適合。
  2. internal reachability review 7章の「Air Pneumatic hub design/report PR先行」と整合。
  3. 症状別分岐と安全注意を同一ページで扱えるため、実務価値が高い。

## 7. Proposed Page Structure
1. Quick conclusion
2. Safety first
3. Troubleshooting flow
   - 設備停止・安全確認
   - エア元圧確認
   - レギュレータ二次圧確認
   - チューブ／継手／漏れ確認
   - 電磁弁ランプ・コイル・手動操作確認
   - シリンダ機械負荷確認
   - スピコン／サイレンサ／排気確認
   - センサー／リードスイッチ／PLC入力確認
4. Symptom map
   - 動かない
   - 遅い
   - 片側だけ遅い
   - 途中で止まる
   - 戻らない
   - エア漏れ
   - PLC信号は出ているが動かない
5. Related articles by cause
   - air supply / regulator
   - valve / solenoid
   - cylinder / mechanical load
   - speed controller / exhaust
   - tubing / fitting / leak
   - sensor / pressure switch / PLC input
6. Manufacturer documentation note
7. Next articles to create

## 8. Internal Link Policy
- ハブ→子記事: 症状別・原因別に分岐リンクを配置。
- 子記事→ハブ: 空圧中核記事の関連記事欄にハブを1件追加（全記事一括ではなく段階導入）。
- 導入順:
  1. `air-cylinder-troubleshooting-basic`
  2. `solenoid-valve-troubleshooting-basic`
  3. `air-regulator-basic`
  4. `speed-controller-basic`
  5. `pneumatic-silencer-basic`
  6. `air-tube-fitting-basic`
- 補助記事群（PLC入出力など）への展開は、コア導線の挙動確認後に拡張する。

## 9. JA/EN Strategy
### Option comparison
- JA先行
  - 長所: JAの既存空圧記事密度が高く、最短で実務導線を完成できる。
  - 短所: EN公開まで時差が出る。
- JA/EN同時
  - 長所: 多言語整合が最初から揃う。
  - 短所: EN未作成子記事の不足で構成が弱くなり、初回PRが肥大化する。

### Recommendation
- **推奨: 設計はJA/EN同時、実装はJA先行（2段階）**
  - 今回: JA/EN共通設計を docs で固定。
  - 次回: JA記事型ハブ実装。
  - その次: EN記事型ハブ実装（EN実在子記事のみ使用）。

### EN terminology policy
英語版では単純翻訳でなく、検索語に合わせる。
- pneumatic cylinder
- solenoid valve
- air pressure
- air leak
- manual override
- speed controller
- pneumatic muffler / pneumatic silencer

## 10. Implementation Plan
小PR分割案:
1. Hub design/report PR（今回）
2. Japanese hub HTML PR
3. Japanese core child articles backlink PR
4. English hub HTML PR
5. English core child articles backlink PR
6. Missing gap-filler article PRs

## 11. Visual QA Plan
- 今回の docs-only PR: 目視確認不要。
- 次回以降の hub HTML PR: 目視確認必須。

確認URL候補（記事型ハブ案）:
- `https://denkicontrol.com/articles/air-pneumatic-troubleshooting-guide.html`
- `https://denkicontrol.com/en/articles/air-pneumatic-troubleshooting-guide.html`

カテゴリ型を採用した場合の確認URL候補:
- `https://denkicontrol.com/categories/air-pneumatic-troubleshooting.html`
- `https://denkicontrol.com/en/categories/air-pneumatic-troubleshooting.html`

## 12. Risks and Guardrails
- リスク1: 症状ページと部品ページで意図が混ざり、カニバリゼーションが発生。
  - 対策: ハブは broad intent、子記事は component/symptom specificity に固定。
- リスク2: 安全に関する断定表現。
  - 対策: メーカー仕様書・現場安全規則優先を常設注記。
- リスク3: ENでJA-only記事へリンクして導線破綻。
  - 対策: ENは EN実在ページのみリンク。
- リスク4: 一度に全関連記事を更新して変更規模が膨張。
  - 対策: 空圧コア記事から段階導入。

## 13. Recommendation
- Air Pneumatic Troubleshooting Guide は **記事型ハブ（articles配下）** を採用する。
- 実装順は **JAハブ → JAコア子記事backlink → ENハブ → ENコア子記事backlink → 不足記事** の順を推奨する。
- 今回PRは設計レポートのみとし、HTML・記事本文・sitemap/search-index/robots は変更しない。
- PR note:
  - Air Pneumatic hub design/report only
  - HTML変更なし
  - 記事本文変更なし
  - sitemap/search-index変更なし
  - safe to review
