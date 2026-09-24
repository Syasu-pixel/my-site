# Denkicontrol Preview Environment v0.1

## 目的
本番 `https://denkicontrol.com/` を変更する前に、PRの内容を実ページとして確認できるPreview環境を用意する。

Canonical Productionは引き続きGitHub Pages / `main` / `https://denkicontrol.com/` とし、PreviewはNetlify Deploy Previewsを利用する。

## 採用理由
- GitHub PRごとに固有のPreview URLを自動生成できる。
- PRへ追加コミットすると同じPreview URLが更新される。
- Productionとは別URLで確認できる。
- 静的HTML中心の現在の構成をそのまま配信できる。
- Netlify Deploy Previewは検索エンジン向けnoindexヘッダーを自動付与する。
- さらに本リポジトリの `netlify.toml` でもNetlify配信全体へ `X-Robots-Tag: noindex, noarchive` を付与し、Netlify側の重複main deploymentも検索対象外にする。

## Previewは公開面である
Deploy Previewは `noindex` でも非公開ページではない。URLを知る人が閲覧できるPUBLIC REVIEW SURFACEとして扱う。

Previewへ載せてよいのは公開予定のHTML・画像・CSS/JS等のサイト資産と、公開されても問題ないリポジトリ内容に限る。APIキー、アクセストークン、秘密情報、契約情報、個人情報、非公開顧客情報等をPreview対象PRへ含めない。

将来、非公開案件やコミュニティの個人情報を扱う必要が生じた場合は、認証付きPreviewまたは別環境を設計する。

## Productionとの境界
- `main` pushによるGitHub Pages公開は変更しない。
- `.github/workflows/pages.yml` は変更しない。
- `.github/workflows/indexnow.yml` は `main` pushのみで動くためPreviewでは実行されない。
- NetlifyのURLを本番canonicalとして扱わない。
- NetlifyのURLを本番sitemap、search-index、IndexNow通知対象へ追加しない。
- Denkicontrolの独自ドメインをNetlifyへ向けない。
- Netlifyのmain deploymentは `duplicate non-indexed staging surface` と扱い、Canonical Productionとは呼ばない。

## 想定フロー
1. AIが確認用ブランチへ変更を作成する。
2. `main` 向けPRを作成する。
3. NetlifyがPR固有のDeploy Previewを作成する。
4. AIがHTML、リンク、画像、HTTPヘッダー等を確認する。
5. ユーザーがPreview URLを目視確認する。
6. 修正が必要なら同じPRへ追加コミットする。
7. ユーザーが公開OKを出す。
8. PRを `main` へマージする。
9. GitHub PagesがCanonical Productionを更新する。
10. `main` pushを受けて既存IndexNow workflowが対象HTMLを通知する。

## 検索エンジン隔離チェック
Preview導入テストでは最低限以下を確認する。

- Preview URLが `denkicontrol.com` ではない。
- PreviewのHTTPレスポンスに `X-Robots-Tag: noindex` がある。
- Preview作成だけではIndexNow workflowが実行されない。
- Preview URLをsitemapへ追加していない。
- ページ内canonicalがPreview URLへ書き換わっていない。
- robots/noindexの設定がProductionへ影響していない。

## 配信対象について
v0.1 Pilotでは現在の静的サイト構成を崩さないため `publish = "."` を使用する。この方式ではリポジトリrootが配信面となるため、Preview対象ブランチへ置くファイルは公開可能な内容のみとする。

AI運営ログ、Decision Log、将来の内部資料等で公開不要情報が増えた場合は、Preview専用build directoryを導入し、`docs/`、`.github/` 等の運用ファイルを配信対象から除外する。この改善はPilot後の再検討項目とする。

## 初回接続時に人間が行う作業
NetlifyのGitHub連携は外部サービスのアカウント権限を伴うため、初回だけユーザーがNetlify側でリポジトリ `Syasu-pixel/my-site` を接続する。

推奨設定:
- Git provider: GitHub
- Repository: `Syasu-pixel/my-site`
- Production branch: `main`
- Build command: なし
- Publish directory: `.`
- Deploy Previews: 有効
- Custom domain: 設定しない

接続後は通常のPR作成だけでPreview生成を自動化する。

## 初回接続とこのPRのマージを分離する
`netlify.toml` と設計文書を `main` へ入れること自体は、GitHub Pages / IndexNow workflowを変更しない。このためPR #1292のマージと、Netlifyへの外部GitHub接続は別ゲートとして扱う。

PR #1292はレビュー通過後に先にマージ可能。Netlify接続はその後、外部サービス権限を伴うHuman Gateとして実施する。

## 初回実証
接続完了後、表示へ影響しない小さなテストPRまたは次の実記事変更PRで以下を実証する。

- PR上にDeploy Preview status / URLが出る。
- 記事URLへ直接アクセスできる。
- CSS / JS / 画像がProductionと同様に読み込める。
- `X-Robots-Tag: noindex` を確認できる。
- `main` はユーザー承認まで変更されない。

## ロールバック
Preview側の設定に問題がある場合はNetlify連携を停止しても、GitHub PagesのCanonical Production公開には影響させない。`netlify.toml` はNetlify専用設定として扱う。
