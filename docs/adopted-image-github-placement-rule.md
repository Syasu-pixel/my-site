# 採用済み画像のGitHub配置ルール

更新日: 2026-09-17
状態: **現行・正本**

## 目的
ChatGPTで生成・採用済みになった画像を、記事のPreviewブランチへ安全かつ再現可能に配置するための**唯一の現行ルート**を定める。

この文書に書かれた「検証付きバイナリ転送」以外の画像転送経路を、通常のサイト記事制作では使用しない。

## 現行ルートは1本だけ
採用済み画像のGitHub配置は、必ず次を使用する。

- 恒久Workflow: `.github/workflows/binary-image-transfer.yml`
- 一時依頼ファイル: `.github/binary-transfer-request.json`
- 配置先: `preview-*` / `ai-*` / `pilot-*` ブランチの `assets/images/` 配下
- `main` へ画像を直接転送しない

**大容量Base64をGitHubツール入力へ載せる方法、`create_blob` を使った画像転送、AI Artifact Broker / AI Artifact Writer、記事ごとの専用転送Workflowは、現行のサイト画像配置ルートではない。**

現行ルートが利用できない場合は別経路を即席で作らず、作業を停止してルート自体を見直す。

## 基本原則
- 採用済み画像は、配置の都合だけで再生成しない。
- Hero / OGP / 本文図の採用対象を取り違えない。
- 同じ用途で複数候補がある場合は、最終採用された原本だけを使う。
- 原本を保全してからWeb用ファイルを作る。
- WebP化は可。ただし元解像度・縦横比・内容を維持し、見て分かる強圧縮はしない。
- 形式変換後の掲載対象ファイルについて、**byte size と SHA-256** を必ず記録する。
- 画像バイナリや巨大Base64を、会話本文・作業ログ・Markdown・依頼JSONへ貼らない。
- 画像配置だけのために一時Workflowを毎回作らない。
- `force push` は使わない。

## 対象範囲
このルートを使用できるのは、**最終的に公開サイトへ掲載する非機密画像**だけ。

使用してよい例:
- Hero
- OGP
- 本文説明図
- 関連記事カード画像
- 公開予定のサイト用イラスト

使用してはいけない例:
- 顧客データを含む画像
- 設備の非公開写真・図面
- パスワードや認証情報を含むファイル
- 秘密鍵
- 社内限定資料
- 公開予定のない個人情報・機密情報

機密・非公開ファイルはこのルートへ載せない。適切な非公開転送経路が明示的に整備されていない場合は転送を停止する。

## 正式手順
### 1. 原本を固定する
採用画像の原本を保全する。必要ならWebPへ変換するが、構図変更・トリミング・文字追加・再生成は行わない。

掲載対象ファイルについて次を取得する。
- ファイル名
- byte size
- SHA-256
- 拡張子
- GitHubでの `target_path`

### 2. 一時保管へ置く
公開予定の非機密画像だけを、承認済みの一時保管先へ短期保存する。

現行実装は Firestorage の短期ファイル共有を使用する。保存期間は必要最小限とし、長期保管場所として扱わない。

一時保管から取得する値:
- `share_id`
- `file_id`
- 正確な `file_name`
- `size_bytes`

共有URLそのものを記事、PR本文、公開ログへ記載しない。

### 3. 一時依頼JSONを作る
対象Previewブランチに `.github/binary-transfer-request.json` を作成する。

画像本体やBase64は入れず、次の6項目だけを書く。

```json
{
  "share_id": "12-character-id",
  "file_id": "32-character-id",
  "file_name": "exact-file-name.webp",
  "sha256": "64-lowercase-hex",
  "size_bytes": 1234567,
  "target_path": "assets/images/example/example.webp"
}
```

### 4. 恒久Workflowへ任せる
`.github/workflows/binary-image-transfer.yml` が依頼JSONのpushを検知して実行する。

Workflowは以下を検証する。
- 実行ブランチが `preview-*` / `ai-*` / `pilot-*`
- `main` ではない
- `target_path` が `assets/images/` 配下
- 対応拡張子が `.webp` / `.png` / `.jpg` / `.jpeg`
- 一時保管側の file ID が一致
- file name が完全一致
- metadata上のbyte sizeが一致
- HTTPSで取得している
- Firestorageの短期download URLのhostが許可済みhostと一致
- 実取得byte sizeが完全一致
- SHA-256が完全一致
- WebP / PNG / JPEGの実ファイル署名と拡張子が一致
- 最大5 MiB以内

どれか1つでも不一致ならcommitしない。

### 5. 最新HEADへ追従してcommitする
画像検証後、Workflowはcommit直前に対象ブランチの最新HEADを再取得する。

さらに、処理開始時と現在の `.github/binary-transfer-request.json` のSHA-256を比較する。

- 同じ依頼なら処理を継続
- 依頼が変更されていれば古い転送を中止
- 依頼が削除されていれば転送を中止

検証済み画像を最新HEADへ配置し、画像SHA-256を再確認してからcommitする。

成功commitでは一時依頼JSONを同時に削除する。

### 6. 並行更新があってもforceしない
push直前に別作業が同じブランチを更新した場合、非fast-forwardをforceで上書きしない。

Workflowは最新HEADを再取得して安全に再試行する。現行実装では最大3回まで。

依頼JSONが途中で変わっていた場合は再試行せず停止する。

### 7. GitHub保存後を確認する
最低限、GitHub側で次を確認する。
- ファイルが目的の `target_path` に存在する
- byte sizeが元ファイルと一致する
- 記事ブランチの関係ない変更を消していない

可能な場合はGit blob SHAも照合する。

Git blob SHAは通常のSHA-256とは別で、次で計算する。

`SHA-1("blob <byte-size>\0" + raw-bytes)`

GitHub contents APIの `sha` と一致すれば、Gitへ保存されたbyte列が元ファイルと同一であることを追加確認できる。

### 8. Previewで目視確認する
GitHubへ保存できたことと、記事上で正しく見えることは別確認とする。

配置後はPreviewで確認する。
- PC
- スマホ
- Hero / OGP の見切れ
- 本文図の文字・細線の可読性
- 関連カード画像
- 画像パス切れ
- レイアウト崩れ

## Hero / OGP の表示ルール
- 採用画像は原則として画像全体を見せる。
- Heroで全体表示が必要な画像に、勝手に `background-size: cover` を使わない。
- 全体表示が要件なら `background-size: contain` または `<img>` + `object-fit: contain` を優先する。
- 画像を枠へ合わせる目的だけで再トリミング・再生成しない。
- OGPの `og:image` / `twitter:image` は最終HTMLの `<head>` に静的metaとして記述する。
- SNSクロップ対策が必要でも、採用済み原本を無断変更しない。

## 使用禁止・旧経路
他チャットは以下を画像配置ルートとして使用しない。

- 大容量Base64文字列をGitHubツールへ渡す方法
- `create_blob` / `create_tree` / `create_commit` / `update_ref` を画像本体転送のために組み合わせる方法
- `.github/workflows/ai-artifact-writer.yml` を通常の記事画像配置へ使う方法
- `docs/ai-artifact-broker.md` の旧Broker経路
- Supabase Artifact Brokerを通常の記事画像配置へ使う方法
- 記事ごとの専用画像転送Workflowを新規作成する方法
- Firestorage共有ページをブラウザやスクレイピングで開いて画像を回収する方法
- Puppeteer等で共有ページから画像を抜き出す方法
- `main` に一時画像や転送用ファイルを置く方法
- `.github/.preview-trigger-*` のような一時トリガーファイルを恒久運用する方法
- `force push` で並行作業を上書きする方法

旧AI編集部関連のBroker / Writerコードは履歴・停止中システム保全のため残る場合があるが、**それは現行のサイト画像配置手順ではない**。

## 2026-09-17 実証済み事項
正式ルートは実ファイルで検証済み。

検証ファイル:
- WebP
- 1,167,170 bytes
- SHA-256: `d4a609346181ff3e8c8a757de20b10ce4142b19a80d637c6bc7bcf4fecd8640c`
- Git blob SHA: `78d45cb3da2d0e12abd05e7550cf6195d7e6ccaf`

確認結果:
- Base64を使わずGitHubへ転送成功
- GitHub保存後のbyte size一致
- SHA-256一致
- WebP署名一致
- 元ファイルから計算したGit blob SHAとGitHub contents APIのsha一致
- 意図的に同一ブランチへ別commitを挿入した競合試験でも、最新HEADを保持して転送成功
- 最新mainから作成した別Previewブランチでも再試験成功
- 検証用画像と依頼JSONは最終ルールPR差分から削除済み

## 最終チェック
- 採用済み原本を使っている
- 不要な再生成をしていない
- Web用変換後のbyte size / SHA-256を記録した
- 正式Workflowだけを使った
- 一時依頼JSONだけをトリガーにした
- `main` へ直接書いていない
- `force push`していない
- GitHub保存後のbyte sizeを確認した
- PreviewでPC / スマホを確認した
- Hero / OGP / 本文図を取り違えていない
- 英語版・affiliate URLなど関係ない箇所を触っていない
- 一時依頼JSONが成功後に消えている
- 旧転送ルートを追加していない

## ルート変更時のルール
この正式ルートを変更する必要が出た場合は、作業中に別経路へ勝手に切り替えない。

1. 現行ルートの問題を切り分ける。
2. 隔離ブランチで新ルートを実ファイル検証する。
3. byte size / SHA-256 / GitHub保存後の同一性を確認する。
4. 並行更新テストを行う。
5. この正本文書と恒久Workflowを同じPRで更新する。
6. 旧ルートの記述を残さず、次の正本を1本にする。

他チャットは常にこの文書を最優先で参照する。