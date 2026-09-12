# 採用済み画像のGitHub配置ルール

## 目的
ChatGPTで生成・採用済みになった画像を、記事Previewブランチへ最短・安全に配置するための標準手順を定める。

## 原則
- 採用済み画像は再生成しない。
- 画像をGitHubへ入れるためだけに、外部ストレージ、共有URL、ブラウザスクレイピング、GitHub Actions経由の転送を使わない。
- ChatGPTからGitHubのGit Data API相当機能が使える場合は、必ず直接配置する。
- `main` には直接入れず、記事作業中は対象の `preview-*` ブランチへ配置する。
- 画像差し替え後は、記事HTMLと画像資産だけが意図した差分になっているか確認する。

## 標準ルート
1. 採用済み画像を会話内または作業コンテナから取得する。
2. 必要ならWeb用に最適化する。
   - Hero / OGP は必要に応じて WebP 化する。
   - 画質を落としすぎない。
   - スマホ表示を前提にサイズを調整する。
3. 画像バイナリを base64 として GitHub blob に直接登録する。
4. 対象 `preview-*` ブランチの現在HEADとtreeを確認する。
5. 画像blobを目的のパスへ追加した新treeを作る。
6. 必要なら同じcommitでHTMLの画像参照も更新する。
7. 現在のPreviewブランチHEADをparentにしてcommitを作る。
8. `update_ref` で対象Previewブランチをそのcommitへfast-forwardする。
9. `main...preview-*` の差分を確認し、対象記事＋採用画像以外の一時ファイルが残っていないことを確認する。
10. Cloudflare Previewで管理者確認を行う。

## 使用するGitHub操作の基準
直接配置ルートでは、利用可能な場合は次を使う。

- `create_blob`
- `create_tree`
- `create_commit`
- `update_ref`

テキストファイルだけを追加・更新する場合は `create_file` / `update_file` を使ってよい。

## 禁止する迂回ルート
画像配置だけの目的で以下を行わない。

- firestorage等の外部共有サービスへ一度アップロードして取り直す
- 一時的なGitHub Actions workflowを作って画像を回収する
- 共有ページをPuppeteer等で開いて画像を抜き出す
- Previewブランチに `.github/.preview-trigger-*` や画像転送専用workflowを恒久的に残す
- 画像取得のためにmainへ一時ファイルを入れる

## 例外
GitHub接続側に `create_blob / create_tree / create_commit / update_ref` が存在しない場合は、勝手に迂回経路を発明しない。
その時点で「直接配置ルートが使えない」と明示し、別手段を使う前に運用を見直す。

## 最終確認
- 採用画像そのものを使っている
- 再生成していない
- HeroとOGPの参照先が正しい
- 既存本文画像を消していない
- 英語版を触っていない
- affiliate URLを触っていない
- mainを触っていない
- 一時workflow / triggerファイルが残っていない
- Preview URLで最終確認できる状態になっている
