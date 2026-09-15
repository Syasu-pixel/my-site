# 採用画像を Preview に反映する実績ルート

## 目的

ChatGPT で採用済みの画像を、画質を落とさず GitHub の Preview ブランチへ反映し、Cloudflare Pages の Preview で確認するための実績ルートを残す。

## 前提

- 本番 `main` には直接入れない。
- まず Preview ブランチで確認する。
- 採用済み画像は再生成しない。
- 画像は SHA-256、サイズ、必要に応じて寸法まで確認してから取り込む。
- 一時転送 Workflow は用途を限定し、完了時に Workflow 自身を削除する。
- 外部の一時共有は転送専用。恒久配信には使わない。

## 実績ルート

1. 採用済み画像をローカルで確定する。
2. 各画像のファイルサイズと SHA-256 を計算する。
3. firestorage.ai の一時共有へ画像をアップロードする。
4. 共有側で得た `share id`、`file id`、正確なファイル名、サイズ、SHA-256 を控える。
5. 対象 Preview ブランチに、1回限りの GitHub Actions Workflow を追加する。
6. Workflow で firestorage.ai API からメタデータを取得し、`file id`、ファイル名、サイズを照合する。
7. ダウンロード URL を取得し、許可したホストだけを受け付ける。
8. 画像をダウンロードし、SHA-256、サイズ、必要なら画像形式と寸法を再検証する。
9. 正式な `assets/images/...` 配下へコピーする。
10. 必要なら記事 HTML の画像参照を正式ファイル名へ更新する。
11. 一時 Workflow ファイルを削除する。
12. 記事 HTML と採用画像だけを commit して Preview ブランチへ push する。
13. GitHub Actions が `success` になったことを確認する。
14. PR の changed files を確認し、一時 Workflow が差分に残っていないことを確認する。
15. Cloudflare Pages の Branch Preview URL で PC / スマホ / OGP / Hero / 本文画像 / 関連記事画像を確認する。
16. ユーザー承認後にだけ本番反映へ進む。

## Workflow の考え方

- `permissions: contents: write`
- `actions/checkout@v4`
- 対象ブランチ名を固定する。
- `curl --fail-with-body --silent --show-error` を使う。
- `set -euo pipefail` を有効にする。
- メタデータ照合後にだけ画像を取得する。
- SHA-256 不一致なら即失敗させる。
- 画像形式・寸法も必要に応じて検証する。
- 最終 step で Workflow 自身を `rm -f` してから commit / push する。

## 2026-09-16 の実績

`articles/control-panel-wire-color-basic.html` の Preview で、Hero / OGP / 本文画像3枚の合計5枚をこの方式で反映し、GitHub Actions 成功後に Cloudflare Pages Preview で表示確認できた。

また、過去の `fa-engineer-skill-map` 記事でも同様の one-shot Workflow による native-quality 画像転送の成功履歴がある。

## 注意

このルートは、GitHub コネクタからローカルの大容量バイナリを直接渡せない場合の補助ルートとして使う。通常の Git Data API で安全に直接配置できる場合は、既存の `docs/adopted-image-github-placement-rule.md` を優先する。
