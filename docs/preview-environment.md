# Denkicontrol Preview Environment v0.1

## 目的
本番 `https://denkicontrol.com/` を変更する前に、PRの内容を実ページとして確認できるPreview環境を用意する。

Productionは引き続きGitHub Pages / `main` を正本とし、PreviewはNetlify Deploy Previewsを利用する。

## 採用理由
- GitHub PRごとに固有のPreview URLを自動生成できる。
- PRへ追加コミットすると同じPreview URLが更新される。
- Productionとは別URLで確認できる。
- 静的HTML中心の現在の構成をそのまま配信できる。
- Netlify Deploy Previewは検索エンジン向けnoindexヘッダーを自動付与する。
- さらに本リポジトリの `netlify.toml` でもNetlify配信全体へ `X-Robots-Tag: noindex` を付与し、Netlify側の重複Production URLも検索対象外にする。

## Productionとの境界
- `main` pushによるGitHub Pages公開は変更しない。
- `.github/workflows/pages.yml` は変更しない。
- `.github/workflows/indexnow.yml` は `main` pushのみで動くためPreviewでは実行されない。
- NetlifyのURLを本番canonicalとして扱わない。
- NetlifyのURLを本番sitemap、search-index、IndexNow通知対象へ追加しない。
- Denkicontrolの独自ドメインをNetlifyへ向けない。

## 想定フロー
1. AIが確認用ブランチへ変更を作成する。
2. `main` 向けPRを作成する。
3. NetlifyがPR固有のDeploy Previewを作成する。
4. AIがHTML、リンク、画像、HTTPヘッダー等を確認する。
5. ユーザーがPreview URLを目視確認する。
6. 修正が必要なら同じPRへ追加コミットする。
7. ユーザーが公開OKを出す。
8. PRを `main` へマージする。
9. GitHub PagesがProductionを更新する。
10. `main` pushを受けて既存IndexNow workflowが対象HTMLを通知する。

## 検索エンジン隔離チェック
Preview導入テストでは最低限以下を確認する。

- Preview URLが `denkicontrol.com` ではない。
- PreviewのHTTPレスポンスに `X-Robots-Tag: noindex` がある。
- Preview作成だけではIndexNow workflowが実行されない。
- Preview URLをsitemapへ追加していない。
- ページ内canonicalがPreview URLへ書き換わっていない。
- robots/noindexの設定がProductionへ影響していない。

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

## 初回実証
接続完了後、表示へ影響しない小さなテストPRまたは次の実記事変更PRで以下を実証する。

- PR上にDeploy Preview status / URLが出る。
- 記事URLへ直接アクセスできる。
- CSS / JS / 画像がProductionと同様に読み込める。
- `X-Robots-Tag: noindex` を確認できる。
- `main` はユーザー承認まで変更されない。

## ロールバック
Preview側の設定に問題がある場合はNetlify連携を停止しても、GitHub PagesのProduction公開には影響させない。`netlify.toml` はNetlify専用設定として扱う。
