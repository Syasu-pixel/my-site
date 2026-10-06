# AI編集部ルール整合メモ v1

上位正本: `docs/ai-editorial-master-rules.md`

## この変更で解消する矛盾
- 記事HTML主担当を ChatGPT / AI編集部へ統一する。
- Codexは配置・静的監査・限定修正・Step 2導線整備を主担当とする。
- 画像5枚固定を廃止し、hero + OGP + 本文1〜4枚を原則とする。
- 不要な説明画像を枚数合わせで生成しない。
- 画像は自己評価95点以上 + 独立IMAGE REVIEWER通過をPreview採用条件とする。
- 日本語Step 1はAI編集部が確認用GitHub反映/PR/Previewまで進行する。
- 本リポジトリの標準PreviewはGitHub PRに接続されたNetlify Deploy Previewとする。
- MEDIUM/HIGH記事はPreviewで管理者目視確認後に公開工程へ進む。
- LOW自動公開はマスタールールに列挙された意味を変えない明白な修正だけに限定する。

## 旧文書を読むAgentへの注意
既存文書に「5枚固定」「Codexが記事HTML作成」「ユーザーが毎回手動アップロード」等の旧記述が残っている場合でも、`docs/ai-editorial-master-rules.md` と本整合後のAgent文書を優先する。旧記述は順次削除・更新する。

## 実装上の別課題
- キューの7日自動CLOSEDは表示整理だけでは実現しない。DB/processor側の状態遷移として別実装する。
- Gemini障害時のGPT代理検証は、記事制作前停止と再開判断をprocessor側の状態機械へ反映する必要がある。
- Netlify Previewのnoindex/canonical/analytics隔離は、Preview運用の技術監査項目として継続確認する。
