# 共通ひな形方針の既存ルール横断確認

- 確認日: 2026-09-18
- 基準main: `25115cf61fade37dd6c52a7f9071286e87d77255`
- 範囲: このcommitの全Markdown85件を取得し、見出し・適用範囲・構造／コピー／公開／監査等の関連記述を横断確認。下表の関連正本を詳細照合した。
- これは全ルールを廃止・再承認する作業でも、全APIや実環境の稼働確認でもない。

## 今回の整合方針
| 関連正本 | 関係／矛盾候補 | 今回の処置 |
|---|---|---|
| ai-governance / master | サイト全体構造はHIGH、上位優先順位、本文担当 | 原則保持。master側にも移行済み対象の限定例外を追記 |
| workflow / checklist / writer / orchestrator | 完成HTMLの完全コピー、独自CSS再設計禁止 | 未移行は継続、移行済みは部品＋レイアウトへ。各入口から新方針へリンク |
| codex-update-rules | articles原則変更禁止、Step 2の範囲 | 通常導線タスクは従来どおり。移行は対象限定の別PR |
| article-type / audit-entrypoint / legacy-refresh | 用途別構造、フルワイド・連載の例外 | 強制統一禁止を新方針へ明記し入口を接続 |
| update-date-guard / refresh-log / improvement-backlog | 凍結、28日、公式確認日 | 状態確認と内容保存。日付の一括更新禁止 |
| search-data-precheck / search-data-acquisition | 改善前の検索データ確認 | 内容不変の移行へ本文再設計を混ぜない。検索運用は変更しない |
| feedback / popular-maintenance / link-agent | slug、評価配置、ランキング、導線制約 | 既存要件を保持し生成処理の依存関係確認項目へ |
| preview関連 / pages / post-approval / IndexNow | 公開方式とHTML差分前提 | 本番とPreviewで同一生成、生成差分に基づく通知設計が必要。今回workflowは変更しない |
| image関連 / placement / reference-notes | キャラ、画像配置・品質、一次資料 | 変更なし。HTMLと画像テンプレートを混同しない |
| AI編集部status / artifact関連 | 一時閉鎖・旧経路の扱い | 共通化を理由に再開・再利用しない |
| PLCラダー／設備仕様テンプレート | 電気設備の別用途ルール | Web構造移行の対象外 |

## 今回と別に残る既存不整合
旧 `preview-environment.md`、runbook等にはNetlifyの記述が残る一方、Cloudflare移行・Builder finalization文書と `netlify.toml` には移行／Netlify自動build停止が記載されている。今回はサービスの再設定を行わない。パイロット時に実際のPreview経路・設定・到達URLを確認し、古いNetlify手順を無条件に再採用しない。
画像5枚固定等の旧記述はmasterと移行オーバーライドに異なる記述がある。今回は画像方針を変えず、既存の上位正本を適用する。
Step 2-Aのindex除外と他節の新着更新許可等は、今回の構造移行で独断統合しない。新規導線変更を同梱しない。

## 引き継ぎ後のレビューで補正した点
- 最新mainが調査基準と一致することと、既存の未完了PR一覧を再確認した。未完了PRが存在するため、管理者の「他チャットで進行中なし」を「未完了PRなし」と読み替えない。
- 段階・移行件数の正本を移行状況文書へ集約し、10件の既存入口とAGENTSへ固定した停止状態を残さない。
- 初回移行を可能にする対象限定の例外と、新規記事で利用可能なひな形を選ぶ条件を追加した。実装・本番完了とは区別する。
- 通常設計や検査ごとの承認は追加せず、既に受けた明示依頼を継承する。
- legacy-refreshには旧キャラクター参照・hero/OGP兼用・ヘッダー統一の記述も残る。画像はmaster・画像正本を優先し、今回の構造移行へ画像再制作や見た目統一を混ぜない。
- このレビューは文書・取得済み資料の照合であり、独立モデルによる裁定やサイト実装の動作検証ではない。

## 確認した全Markdownの一覧
一覧は確認範囲の証跡であり、すべてを現行ルールの正本と認定するものではない。履歴・個別記事メモはその用途として扱う。

- `articles/audit-product-image-links-2026-04-12.md` — 要件／履歴を参照・変更なし
- `docs/adopted-image-github-placement-rule.md` — 要件／履歴を参照・変更なし
- `docs/agent-runbook.md` — 入口を接続
- `docs/agents/article-candidate-agent.md` — 要件／履歴を参照・変更なし
- `docs/agents/article-image-generator-agent.md` — 要件／履歴を参照・変更なし
- `docs/agents/article-orchestrator.md` — 入口を接続
- `docs/agents/article-writer-agent.md` — 入口を接続
- `docs/agents/github-link-agent.md` — 要件／履歴を参照・変更なし
- `docs/ai-artifact-broker.md` — 要件／履歴を参照・変更なし
- `docs/ai-artifact-writer.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-chibi-motion-rules.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-dashboard-v0.1.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-discussion-v0.1.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-image-quality-high.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-master-rules.md` — 入口を接続
- `docs/ai-editorial-ogp-autonomous-gate.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-preview-auto-revise.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-preview-probe-content-validation.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-project-status.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-stall-recovery.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-tuesday-hard-stop-audit-2026-09-09.md` — 要件／履歴を参照・変更なし
- `docs/ai-editorial-weekly-routine.md` — 要件／履歴を参照・変更なし
- `docs/ai-fallback-attendance-v0.1.md` — 要件／履歴を参照・変更なし
- `docs/ai-governance-v1-migration.md` — 要件／履歴を参照・変更なし
- `docs/ai-governance.md` — 要件／履歴を参照・変更なし
- `docs/ai-search-citation-rules.md` — 要件／履歴を参照・変更なし
- `docs/ai-weekly-operation.md` — 要件／履歴を参照・変更なし
- `docs/air-pneumatic-troubleshooting-hub-design.md` — 要件／履歴を参照・変更なし
- `docs/article-audit-entrypoint.md` — 入口を接続
- `docs/article-backlog.md` — 要件／履歴を参照・変更なし
- `docs/article-feedback-rules.md` — 要件／履歴を参照・変更なし
- `docs/article-refresh-log.md` — 要件／履歴を参照・変更なし
- `docs/article-search-data-precheck-override.md` — 要件／履歴を参照・変更なし
- `docs/article-type-templates.md` — 入口を接続
- `docs/article-update-date-guard.md` — 要件／履歴を参照・変更なし
- `docs/article-workflow-v2-migration.md` — 要件／履歴を参照・変更なし
- `docs/article-workflow.md` — 入口を接続
- `docs/chibi-production-integration.md` — 要件／履歴を参照・変更なし
- `docs/cloudflare-preview-builder-finalization.md` — 要件／履歴を参照・変更なし
- `docs/cloudflare-preview-migration.md` — 要件／履歴を参照・変更なし
- `docs/codex-update-rules.md` — 入口を接続
- `docs/control-to-air-pneumatic-category-audit.md` — 要件／履歴を参照・変更なし
- `docs/dashboard-progress-status-v066.md` — 要件／履歴を参照・変更なし
- `docs/decisions/2026-09-06-multi-ai-runtime.md` — 要件／履歴を参照・変更なし
- `docs/decisions/2026-09-06-preview-provider.md` — 要件／履歴を参照・変更なし
- `docs/decisions/2026-09-06-supabase-artifact-broker.md` — 要件／履歴を参照・変更なし
- `docs/decisions/2026-09-07-dashboard-japanese-ui-v032.md` — 要件／履歴を参照・変更なし
- `docs/decisions/README.md` — 要件／履歴を参照・変更なし
- `docs/denkicontrol-site-strategy.md` — 要件／履歴を参照・変更なし
- `docs/denkicontrol-strategy-whitepaper.md` — 要件／履歴を参照・変更なし
- `docs/editorial-department-status.md` — 要件／履歴を参照・変更なし
- `docs/en-article-backlog.md` — 要件／履歴を参照・変更なし
- `docs/existing-article-improvement-backlog.md` — 要件／履歴を参照・変更なし
- `docs/external-challenger.md` — 要件／履歴を参照・変更なし
- `docs/fa-knowledge-plan.md` — 要件／履歴を参照・変更なし
- `docs/image-generation-rules-v2-migration.md` — 要件／履歴を参照・変更なし
- `docs/image-generation-rules.md` — 要件／履歴を参照・変更なし
- `docs/image-quality-gate.md` — 要件／履歴を参照・変更なし
- `docs/internal-reachability-audit-method-review.md` — 要件／履歴を参照・変更なし
- `docs/ja-en-technical-seo-audit.md` — 要件／履歴を参照・変更なし
- `docs/language-menu-audit-method-review.md` — 要件／履歴を参照・変更なし
- `docs/legacy-article-refresh-template.md` — 入口を接続
- `docs/multi-ai-orchestrator-v0.1.md` — 要件／履歴を参照・変更なし
- `docs/multi-ai-runtime-v0.1.md` — 要件／履歴を参照・変更なし
- `docs/new-article-checklist-v2-migration.md` — 要件／履歴を参照・変更なし
- `docs/new-article-checklist.md` — 入口を接続
- `docs/plc-ladder-editing-rules.md` — 別用途・変更なし
- `docs/plc-templates/README.md` — 別用途・変更なし
- `docs/plc-templates/estimate-template.md` — 別用途・変更なし
- `docs/plc-templates/io-removal-checklist-template.md` — 別用途・変更なし
- `docs/plc-templates/operation-spec-template.md` — 別用途・変更なし
- `docs/popular-articles-maintenance.md` — 要件／履歴を参照・変更なし
- `docs/post-approval-publish-pipeline.md` — 要件／履歴を参照・変更なし
- `docs/preview-environment.md` — 要件／履歴を参照・変更なし
- `docs/reference-notes/README.md` — 一次資料／用語・変更なし
- `docs/rule-alignment-v1.md` — 要件／履歴を参照・変更なし
- `docs/search-console-content-improvement-log.md` — 要件／履歴を参照・変更なし
- `docs/search-data-acquisition-rules.md` — 要件／履歴を参照・変更なし
- `docs/search-data-implementation-status.md` — 要件／履歴を参照・変更なし
- `docs/search-data-oauth-setup.md` — 要件／履歴を参照・変更なし
- `docs/search-top-content-audit-2026-09-10.md` — 要件／履歴を参照・変更なし
- `docs/terminal-block-jumper-audit-2026-09-11.md` — 要件／履歴を参照・変更なし
- `docs/terminology/README.md` — 一次資料／用語・変更なし
- `docs/tool-article-improvement-template.md` — 要件／履歴を参照・変更なし
- `top-page-audit-based-revision-plan.md` — 要件／履歴を参照・変更なし
