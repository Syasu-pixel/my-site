# コメント専用 Pages 検証用パッケージ（未配備）

本番のビルドでは使わない。受付は初期状態で無効。単独プロジェクトの確認用ブランチ別名と、専用の Cloudflare Access アプリの署名・発行元・対象アプリ・期限を全て確認できたリクエストのみ処理する。公開サイトの Cookie の扱いは変更しない。

## ローカルでのみ試す

```sh
npm ci --ignore-scripts
node --test staging-worker.test.mjs ../pages-staging-smoke.test.mjs
node build-smoke-ui.mjs
mkdir -p worker-build
npx --no-install wrangler pages functions build functions --outdir worker-build --output-routes-path dist/_routes.json --compatibility-date 2026-11-26 --compatibility-flag nodejs_compat
```

Wrangler 4.119.0 のローカルビルドで `/api/article-comments/*` のみを確認。Node で専用ホスト拒否、未有効化、Access 認証なし／誤署名・対象外・期限切れ拒否を確認。実際の Access・ブラウザ・Cloudflare との通信は未検証。記事と管理の画面は `node build-smoke-ui.mjs` で `dist/` に生成する。承認・非表示は試験用 Auth ユーザーだけを使う。検証用の `sb_publishable_` キーをビルド時に渡し、実ユーザーの資格情報やサーバー用秘密鍵は渡さない。キーが未設定ならログインは無効。テストモジュールで、公開本番のホストに置かれた場合はフォームを出さず通信しないことを確認したが、Cloudflare 配備後の実ブラウザテストは未実施。

## 配備前に必要なもの

- 隔離した新規 Pages プロジェクトと、実際に一致するブランチ別名（本番や既存プレビューを流用しない）。その別名に限定した Access アプリを用意し、未ログインでは拒否を確認。Access のチーム名とアプリの Audience を対応するステージング変数に設定。
- 検証 Supabase の専用ロールで作ったキャッシュ無効の Hyperdrive と、ステージング限定の公開キー・署名鍵。秘密の値やトークンはGitHubやチャットに貼らない。
- 同一オリジンで記事ハーネスと管理ハーネスを開き、試験運営ユーザーで承認・非表示を検証。Access の Cookie を検証用同一オリジンにだけ載せる。専用ホスト間通信と本番Safariは別の検証とする。サインインとサインアウトには [Supabase のパスワード認証](https://supabase.com/docs/reference/javascript/auth-signinwithpassword) と [ローカルセッションのサインアウト](https://supabase.com/docs/guides/auth/signout) に対応する操作だけを使う。トークンはページ内のメモリに限り、サインアウト後も既に発行されたアクセストークンは期限まで有効になり得るため、試験完了後は運営権限を解除する。

Cloudflare の既存ログインを使えない場合、[端末コード方式](https://developers.cloudflare.com/changelog/post/2026-08-04-wrangler-login-device-flow/)でユーザーのスマホから承認可能。ログイン前に必要な権限と作業対象を確定し、DNS権限を付けない。発行コードの有効期間は短いので、利用者が操作できる時だけ開始する。現在はコードを発行していない。
