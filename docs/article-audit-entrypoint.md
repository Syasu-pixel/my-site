# 日本語記事監査の入口・必須参照ルール

## 共通ひな形移行との関係（2026-09-18）
- サイト構造・共通部品・記事制作に関係する作業では、[site-template-policy.md](site-template-policy.md) と [site-template-migration-status.md](site-template-migration-status.md) を先に確認する。
- 現在段階・採用判断・対象ごとの移行状態は、上記の移行状況文書だけを正本とする。本書の既存要件は、同方針に明示した限定例外以外は維持する。
- 方針採用後、既存の移行済みページ、または利用可能なひな形・正本を台帳で確認して新規登録するページでは、完成記事HTMLのコピーをレイアウト・共通部品と固有内容の組み合わせへ読み替える。未移行・未登録は従来方式。初回移行の扱いは同方針第6節を参照する。
- 構造移行を本文改善・公開導線追加・本番承認の省略と混同しない。相談窓口・法務・設計シリーズ等の意図した構造差を保持する。
- 段階変更は移行状況文書へ記録し、各入口に段階・件数を重複管理しない。

更新日: 2026-09-17
状態: **現行・監査入口**

## 目的

日本語記事の全体監査・個別監査・修正前監査を行うときに、ChatGPT / Codex / 別チャットが「どのルールを読むべきか」で迷わないよう、監査時の入口を1か所に集約する。

この文書は各正本を置き換えない。**監査開始時に読む案内板**として使い、詳細判断はリンク先の正本を優先する。

## 0. 監査開始時の最初の確認

1. GitHub `main` の最新HEADを確認する。
2. 監査対象を明示する。
   - 日本語記事のみか
   - 全記事か一部記事か
   - 構造監査か、リンク監査か、画像監査か、技術監査か、SEO監査か
3. 監査対象の記事タイプを先に分類する。
   - 通常記事
   - ハブ / まとめ記事
   - 比較記事
   - 手順 / トラブル記事
   - 特別構成 / 連載 / フルワイド記事
4. **記事タイプの違いだけを理由に broken / 欠落と判定しない。**
5. 監査だけで終えるのか、修正まで行うのかを分ける。

## 1. 最低限読む正本

監査開始時は、次を基本セットとして確認する。

1. `docs/ai-governance.md`
   - 安全、技術的根拠、人間承認、リスク分類。
2. `docs/ai-editorial-master-rules.md`
   - 記事制作・更新・監査の上位運用ルール。
3. `docs/agent-runbook.md`
   - 実行順と担当分担。
4. `docs/article-workflow.md`
   - 記事構造、公式資料、内部リンク、関連記事、Preview等の標準フロー。
5. `docs/new-article-checklist.md`
   - HTML、リンク、Support、画像、PC/スマホ、PR確認の詳細チェック。
6. `docs/article-type-templates.md`
   - 記事タイプ別の構造差。通常記事とハブ / トラブル / 比較記事を同一基準で誤判定しないために使う。

## 2. 既存記事を「改善候補」にする監査で追加確認

既存記事を直すかどうかまで判断する場合は、構造監査より先に以下を確認する。

1. `docs/article-update-date-guard.md`
   - 完成・凍結状態
   - 最終内容更新日
   - 公式資料確認日
   - GitHub / PR履歴
   - 28日クールダウン
2. `docs/existing-article-improvement-backlog.md`
   - `[x]` 完成・凍結か、`[ ]` 改善対象か。
3. `docs/article-search-data-precheck-override.md`
   - title / meta / 見出し / 本文 / 関連記事の再設計を行う場合に必要。
4. `docs/search-data-acquisition-rules.md`
   - 検索データ取得の正本。GSC Wizardへ戻さない。

### 保守作業の例外

次のような、検索意図や本文内容を変えない明白な保守は、検索データ事前確認を省略してよい。

- CSSだけの表示崩れ修正
- 固定ヘッダーだけの統一
- 明白な内部リンク切れ修正
- 誤字脱字のみ
- 画像パスだけの修正
- canonical等の明白な技術的不具合

ただし、同時に title / meta / H1-H3 / 本文 / 関連記事リンク先を再設計する場合は、保守扱いにしない。

## 3. 構造監査で見るもの

通常記事では、少なくとも以下を確認する。

- 固定ヘッダー
- ヒーロー
- 冒頭カード / summary
- 本文カラム
- 右カラム
- Support this site / このサイトを応援する
- 記事評価カード
- あわせて読みたい記事 / `related-grid`
- フッター
- PC / タブレット / スマホのレスポンシブ

ただしハブ記事・連載・フルワイド等は、**その記事タイプとして意図した構造か**を確認し、通常記事との差だけで欠落扱いしない。

## 4. 内部リンク監査

詳細は `docs/new-article-checklist.md` と `docs/article-workflow.md` を正本とする。

対象:

- パンくず
- ヒーローボタン
- 記事下部ボタン
- 右カラム
- カテゴリリンク
- language-menu
- 関連記事カード
- フッター
- Support this site
- その他すべての内部 `href`
- 画像 `src`
- OGP / twitter画像
- Hero背景画像

### 相対URL監査の注意

language-menu等の相対URLは、文字列だけで broken 判定しない。

`docs/language-menu-audit-method-review.md` に従い、次の順で確認する。

1. そのHTMLの配置ディレクトリをbaseとして解決
2. パス正規化
3. ディレクトリ参照なら `index.html` 補完
4. 実在確認
5. 配信環境依存リスクと真の broken を分離

`../en/`、`./`、`../../` 等を、ファイル名がないという理由だけで404扱いしない。

## 5. 関連記事カード監査

関連記事カードは、次を確認する。

- リンク先記事が実在する
- 未作成記事へ先行リンクしていない
- 画像付きカードが標準
- 画像は **リンク先記事のOGPを第一候補** とする
- OGPが縮小表示に不向きな場合のみHeroを使う
- 画像ファイルが実在する
- altが対象記事と整合する
- 関連記事セクション内へ記事評価カードを誤挿入していない
- カード追加のために本文やCSSを不要に作り替えていない

参照:

- `docs/image-generation-rules.md`
- `docs/article-feedback-rules.md`
- `docs/article-workflow.md`

## 6. 記事評価カード監査

`docs/article-feedback-rules.md` を正本とする。

最低限:

- 並びが `本文・まとめ・次回案内 → 記事評価カード → 関連記事`
- 関連記事セクションの直前の兄弟要素
- 本文カラム内
- 1記事1カード
- `article_slug` が記事固有
- `article-feedback.js` の重複なし
- PC / スマホでボタンや枠がはみ出さない

## 7. 画像監査

既存画像の表示監査と、新規画像生成・配置は分けて扱う。

### 既存画像を参照するだけの場合

- 実在確認
- 用途取り違えなし
- OGP / Hero / 本文図を混同しない
- PC / スマホ表示確認

### 新規画像を生成する場合

- `docs/image-generation-rules.md`
- `docs/image-quality-gate.md`
- 必要に応じて `docs/reference-notes/{slug}.md`
- キャラクターを含む場合は正本テンプレート

### GitHubへ新規画像を置く場合

`docs/adopted-image-github-placement-rule.md` を唯一の現行ルートとして使う。

- `binary-image-transfer.yml`
- Preview系ブランチへ配置
- mainへ画像を直接転送しない
- `create_blob` 等を画像転送経路として使わない
- byte size / SHA-256確認
- PreviewでPC / スマホ確認

## 8. 公式資料監査

公式資料が必要な技術記事では、次を分けて確認する。

- 記事に公式資料リンクが表示されているか
- `docs/reference-notes/{slug}.md` があるか（公式資料を参照して記事を作成・更新した場合は必須）
- メーカー名
- 公式URL
- 資料名 / マニュアル名
- 確認日
- 記事で使う範囲
- 断定しない範囲

参照:

- `docs/reference-notes/README.md`
- `docs/article-update-date-guard.md`
- `docs/article-workflow.md`

**公式資料を再確認していないのに確認日を現在日に更新しない。**

## 9. Support this site監査

`docs/new-article-checklist.md` の固定値を使う。

- Buy Me a Coffee: `https://buymeacoffee.com/denkicontrol`
- PayPal: `https://www.paypal.com/paypalme/denkicontrol`
- `href="#"` や空リンクなし
- 外部リンクの `target` / `rel` を確認

支援URLを推測で変更しない。

## 10. PC / スマホ表示監査

記事HTMLを更新した場合、少なくともPCとスマホで確認する。

見るもの:

- 横はみ出し
- 固定ヘッダー
- ヒーローの見切れ
- summaryカード
- 本文幅
- 右カラム
- 表・コード・長いURL・長い見出し
- 関連記事カード
- 記事評価カード
- Supportカード
- フッター
- 画像読込失敗

構造の異なる代表記事は、必要に応じてタブレット幅も確認する。

## 11. 監査結果の分類

監査結果は、少なくとも以下へ分ける。

- **BROKEN**: 実在しないリンク、画像切れ、HTML構造破綻など明白な不具合
- **STRUCTURE**: 意図しない標準構造からの崩れ
- **ARTICLE-TYPE EXCEPTION**: ハブ / 連載 / フルワイド等の意図した例外
- **CONTENT / TECHNICAL**: 本文・技術内容の再確認が必要
- **OFFICIAL SOURCE**: 公式資料・reference-notes不足
- **UX / MOBILE**: PC / スマホ表示上の改善候補
- **SEO / SEARCH**: 検索データ確認後に判断すべき候補
- **NO ACTION**: 差異はあるが現状維持が妥当

差異の検出と、修正すべき問題の判定を分ける。

## 12. 監査から修正へ進む前の停止点

監査結果をそのまま一括修正しない。

修正前に:

1. 記事タイプ例外を除外
2. 日付ガードを確認
3. 完成・凍結状態を確認
4. 保守か実質改稿かを分類
5. 実質改稿なら検索データ事前確認
6. 技術内容を触るなら公式一次情報確認
7. 変更対象ファイルを最小化
8. Preview / 管理者承認が必要な変更か判定

## 13. 監査レポートに必ず書くこと

- 基準にしたmainのcommit SHA
- 対象範囲と記事数
- 監査した項目
- 除外した記事タイプ / 例外
- brokenと改善候補を分離
- 未確認事項
- 修正した場合は変更ファイル
- PC / スマホ確認結果
- `safe to merge: YES / NO` または監査のみなら `no changes made`

## 14. この文書の位置づけ

監査時はまず本書を読み、ここから各正本へ進む。

本書と各正本が矛盾した場合の優先順位:

1. `docs/ai-governance.md`
2. `docs/ai-editorial-master-rules.md`
3. 個別の現行正本 / 正本追補
4. `docs/article-workflow.md`
5. `docs/new-article-checklist.md`
6. 本書

本書は「入口」であり、個別正本の内容を上書きしない。

## 関連正本・監査補助

- `docs/ai-governance.md`
- `docs/ai-editorial-master-rules.md`
- `docs/agent-runbook.md`
- `docs/article-workflow.md`
- `docs/new-article-checklist.md`
- `docs/article-type-templates.md`
- `docs/article-update-date-guard.md`
- `docs/existing-article-improvement-backlog.md`
- `docs/article-search-data-precheck-override.md`
- `docs/search-data-acquisition-rules.md`
- `docs/article-feedback-rules.md`
- `docs/image-generation-rules.md`
- `docs/image-quality-gate.md`
- `docs/adopted-image-github-placement-rule.md`
- `docs/reference-notes/README.md`
- `docs/language-menu-audit-method-review.md`
- `docs/ai-search-citation-rules.md`
