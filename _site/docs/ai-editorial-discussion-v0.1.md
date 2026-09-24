# AI編集会議 Discussion Session v0.1

## 目的
AI編集部に、単なる処理ログではなく、実際の意思決定に使われる短いAI間討論を追加する。

討論は演出ではない。各発言は次の処理の入力になり、最終的にREVIEWERの裁定へつながる。

## 基本フロー

`EDITOR claim → CHALLENGER counterargument → EDITOR response → CHALLENGER reassessment → REVIEWER decision`

必要な場合だけ最大2ラウンド行う。通常の機械的処理に会話を強制しない。

## 討論を開始する条件
- 記事テーマや検索意図について重要な異論がある
- 技術的正確性・安全性についてhigh/blocker findingがある
- 既存記事との重複・カニバリ懸念がある
- SEOと読者価値など複数の目的が衝突する
- BUILDERの修正後もCHALLENGERが重要指摘を維持する
- REVIEWERが証拠不足で裁定できない

軽微な表記修正、明白なCI失敗、単純なretryでは討論しない。

## 発言契約
各turnはUI-safeな結論のみを持つ。hidden chain-of-thoughtは要求・保存・表示しない。

```json
{
  "session_id": "uuid",
  "turn": 2,
  "role": "challenger",
  "provider": "google-gemini",
  "stance": "oppose",
  "message": "既存記事との検索意図の重複確認が不足しています。",
  "claims": ["新規記事化の根拠が不足"],
  "evidence": ["GitHub: articles/example.html", "GSC: query cluster"],
  "questions": ["既存記事の更新では不足する理由は何ですか？"],
  "confidence": 0.82
}
```

## 役割
### EDITOR
提案、目的、検索意図、既存記事との差分、採用理由を提示する。反論を受けたら証拠で回答し、必要なら自説を変更する。

### CHALLENGER
反対すること自体を目的にしない。最も重大な弱点を証拠付きで指摘する。EDITORの回答で懸念が解消した場合は明示的に撤回・severity低下できる。

### REVIEWER
多数決をしない。両者のclaim/evidence/reassessmentを比較し、`ADOPT / REVISE / ESCALATE`を決める。未解決の重要論点を消さない。

## 終了条件
- CHALLENGERが重要懸念を撤回しREVIEWERがADOPT
- REVIEWERが修正内容を特定してREVISE
- 2ラウンド後もhigh/blocker disagreementが残りESCALATE
- 人間判断が必要な論点へ到達しHUMAN_GATE

## Dashboard表示
中央ペインでは通常イベントと区別して「編集会議」としてまとめる。

表示例:

**EDITOR / GPT** — 提案
> 制御盤ノイズの記事は個別対策ではなく、切り分けハブとして新規作成します。

**CHALLENGER / Gemini** — 反論
> 既存の配線分離記事との重複を先に確認すべきです。

**EDITOR / GPT** — 回答
> 既存記事は配線分離単独、新記事は発生源→経路→被害側の横断診断を扱います。

**CHALLENGER / Gemini** — 再評価
> 重複懸念をmediumからlowへ下げます。

**REVIEWER** — 裁定
> 新規ハブをADOPT。配線分離の詳細は既存記事へリンクします。

## コスト・暴走防止
- 最大2ラウンド
- 1 turnのmessageは1200文字以内
- evidenceは最大10件
- 同一主張の言い換えだけなら会話を継続しない
- API失敗は討論結果として扱わずretry/fail-closed
- providerは自分自身の過去発言を証拠として扱わない

## 人間の参加
Dashboardから人間がコメントした場合、その内容は `role=human` の正式turnとして追加する。AIは次のroundでその指示を考慮する。

ただしproduction公開、最終画像採用、有料化・権限拡大など既存のHUMAN GATEは討論で迂回できない。
