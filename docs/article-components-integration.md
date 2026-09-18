# 採用済み記事部品の全記事統合レビュー

生成・検査・配信手順。現在の承認・公開状態の正本は [site-template-migration-status.md](site-template-migration-status.md)。採用済みの見た目の再承認は求めない。本番マージ・公開は管理者の公開承認後に行う。

## 基準と編集元

この文書の相談サービス全バイト保持は記事統合レビュー段階の基準を指す。後続で採用した日英トップ・相談・キャリア入口のヘッダー／フッターは [追加4ページの実装](additional-page-shells.md) で別に生成・保全検査し、公開時に重ねる。サービス本文・フォーム・元スクリプトは保持する。

- main: `394203274a5bd4d1eff4dd51fe64e07127c65275`
- 先行ヘッダーPR #1509: `71de9c96021ef3e725af6ffda88e46076161575f`
- 作業ブランチ: `review/article-components-integration-20260918`
- 編集元は最新の未変換 `articles/*.html` / `en/articles/*.html`。旧プレビューHTMLは入力にしない。
- 処理順はヘッダー → 目次/右欄 → 評価/関連記事。Eleventy/Nunjucksへ現在の固有内容を渡し、元記事は変更しない。
- 採用CSS/JSはadoption.jsonのSHAで照合。全記事の右欄・目次仕様は `.github/article-components/sidebar/all-pages.json`。元の代表17件もこの全配列へ含まれる。
- 出力は編集元と別ディレクトリに限定する。本番は同じ生成処理のcandidateだけをPages用コピーへ重ね、従来のWebP最適化後に公開する。

## 全309 HTMLの対応

通常記事251件と専用構成37件、計288記事を統合対象にする。非記事20件は対象外、GX Works2相談サービス1件は専用構造を保持する例外として検査する。元HTMLのGit blobを全309件で照合する。台帳は生成直後を「画面検査待ち」とし、全分割検査の照合が通過した記事だけを「画面検査済み」へ更新する。本番反映済みにはしない。

- 設備設計#1/#2/#3: 右欄を付けず、前後回・次回・相談案内を保持。
- 目次の切替境界: 1100px 240記事、900px 44記事、768px 3記事、1180px 1記事。crimping-toolsだけは採用済み代表の1180pxを維持（元本文レイアウトの1列化は900px）。他の工具へ1180pxを一般化しない。
- 工具・キャリア・ハブ: 元カード・商品リンク・比較/分岐構造を保持。
- 英語111記事: 評価欄と相談導線を追加しない。検索・お問い合わせ・実在する対応記事への言語切替を確認。
- 日本語177記事: 固有slug、共通の既存投票ロジック、関連記事直前の配置を維持。
- 相談サービス: 元HTML全体をbyte一致で別出力に保持。料金・同意/注意事項・フォーム・入力検証・送信処理を書き換えない。空欄/メール形式/受付番号の読み取り専用を試し、本番送信は行わない。
- その他20件: トップ、カテゴリ、法務、お問い合わせ、管理認証、停止中ダッシュボード、別Preview、参照断片ごとに対象外理由を台帳へ記録する。

## 全件化で必要な互換処理

狭い画面の検索結果と固定目次の重なりは統合用compat CSS/JSで解消し、採用済み部品は変更しない。検索の再表示は既存検索側の外側click処理と競合しないよう、ヘッダーの入力focusを次の処理タイミングに移す。テストはfocusが実際に移ることを待って判定する。

18記事112カードの旧div.related-card-thumbは画像だけの枠であることを確認し、画像と一緒に置換する。タグ、本文、リンク、順序を捨てない。img自身に同classが付いた5件は通常の画像として置換する。

fa-engineer-skill-map-careerは元から検索用共通JSが欠けていたため、data-integration-added=search付きの既存共通scriptを1件だけ補う。既存feedback.jsとその重複防止を維持し、別の投票ロジックは作らない。保全検証器もこの1件だけを明示した例外にする。

## 検査と再生成

静的検査は本文の部品外、SEO、元スクリプト、フッター、href順、残した右欄カードを比較する。関連記事担当の独立オラクルで記事カード1361件・案内9件、画像/属性/文面順、グリッド外リンク、評価JA177/EN0を照合する。別途全記事のローカルリンク・アンカー・画像/スクリプト等の参照を変更前後で比較し、新規不具合と既存問題を分ける。

ブラウザは6分割し、全288記事を390/768/1440px、既存代表17記事は320/1024pxも確認する。相談サービス3幅を合わせ901表示条件。日本語全177記事の投票成功/再読込と409/503/保存不可の3条件を本番へ送らない模擬応答で検査する。全分割の対象集合、幅、投票、画像を集約し、抜け・重複・失敗があれば完了にしない。

境界/向き/検索再開等28条件に加え、別担当が抽出した長い目次、生成ID、固定操作、英語900px境界等74条件を確認する。関連する実装変更後は対応する検査を再実施する。外部の広告/分析等は隔離しており、全外部リンクの到達性は保証しない。

共通部品の編集→再生成テストは作業用コピーだけを変更する。ヘッダー/関連記事は各288件、評価は日本語177件だけへ反映し英語111件は不変。フッターは登録variantを変更し、対象120件だけに反映・非対象168件不変を確認する。マーカー除去後は元内容と一致し、ソースを汚さない。

実行の入口:

```sh
pnpm install --frozen-lockfile --ignore-scripts
python -m pip install lxml==6.1.1
node scripts/build-integrated-review.mjs ../integration-build
python scripts/verify-integrated-source.py ../integration-build
python scripts/audit-integrated-links.py ../integration-build
python scripts/verify-article-end-preservation.py --oracle .github/article-components/end/all-preservation-oracle.json --candidate ../integration-build/candidate --assets-source . --output ../integration-build/end-independent-checks.json
node scripts/check-component-regeneration.mjs ../integration-build
node scripts/serve-integrated-review.mjs ../integration-build
```

別ターミナルでcheck-integrated-review.mjsをREVIEW_SHARD_COUNT=6/REVIEW_SHARD_INDEX=0〜5で実行し、境界・riskケースを実行する。その後merge-integration-checks.mjs、package-integrated-review.mjs、make-integration-gallery.mjsで台帳・証拠・操作画面を生成する。正式な一式はarticle-components-integration.ymlに定義する。Python実行ファイルはPYTHON_EXECUTABLE、ローカルのポートはREVIEW_PORT/REVIEW_BEFORE_PORTで指定可能。

## 既存の残課題

今回の部品変更へ混ぜて修正しない。

- 英語自己リンク/タイトル不一致3件: air-breaker-basic、control-panel-cooling-fan-basic、surge-protection-basic。hrefの実際の行き先のOGPを表示する。
- 英語8記事のfooterに、存在しないen/contact.htmlとen/privacy-policy.htmlを指す計16リンク。control-panel-grounding-basic、control-panel-label-basic、control-panel-outlet-basic、control-panel-wire-color-basic、din-rail-basic、terminal-block-basic、terminal-block-jumper-basic、wire-number-marker-basic。変更前後で同じ問題として記録する。
- 実機iOS/Safari、実機ソフトキーボード、スクリーンリーダーは未検証。実際の投票集計/相談送信は試験していない。
- 技術本文の正しさを再監査する作業ではない。

## 隔離・証拠・復旧

candidateは生成候補、reviewだけにnoindex/CSP/模擬投票を追加する。フォーム送信、外部通信、Workerを遮断。元投票JSは変更しない。

CIでは画像の重複転送を避けREVIEW_COPY_ASSETS=0で生成し、元のassetsを同じcheckoutから参照する。したがってCIのreview成果物は単独配布用サイトではない。ローカル操作画面は同じ版のassetsを備える。証拠は6分割の画像artifactと最終index/reportsに分け、全件台帳で追跡する。意図したUI変更の比較画像を、共通化だけの差分0検証と混同しない。

review出力を本番へコピーしない。元HTMLは未変更で、統合用の追加部品・アダプタ・workflowを同じ単位でrevert可能。ルール一覧PR #1511へ追加文書・制御ファイルを登録してから合流する。

## 本番生成の接続

Pages workflowは共有shell整合性を検査し、同じbuild-integrated-review処理で候補を再生成、原本保全・リンク・独立オラクル検査を通す。scripts/prepare-integrated-publication.mjsがcandidateの288記事・専用サービス1件・生成CSS/JS6件だけを公開用コピーへ転記する。非記事21件の原文一致、評価JS不変、レビュー隔離/noindex/CSP混入拒否を検査する。scripts/check-integrated-publication.mjsは候補との全記事byte一致と、隔離版の誤入力・編集元上書きの拒否を確認する。

その後の画像WebP変換・参照置換・900MiB上限・Pages配信は既存工程を維持する。ただし同名PNG/JPEGが同一WebPへ潰れる場合は双方の原画像を保持し、変換・置換・削除から除く。現在はcharging-tools/charging-mainのPNG/JPG一組。最適化前の全公開HTML/CSS/JS/JSON/XMLを記録し、最適化後は実際の画像マッピング以外の差分がないこと、公開コピー単独で新規資源欠落がないこと、原feedback.js不変を検査する。相談サービスも最適化前はbyte一致、最適化後は画像URL置換だけという保証範囲を明示する。

site-build-manifest.jsonは生成元commit、画像最適化前のハッシュ、最終配信物の検査結果を示す。前段ハッシュを最適化後のHTMLハッシュと誤認しない。公開後は代表日英・設計シリーズ・工具・相談サービスと画像、検索、目次を確認し、本番投票やフォーム送信は試さない。

記事URL、本文、更新日、search-index、sitemapは今回の構造移行では更新しない。現在のIndexNow workflowはルートHTML差分を対象にするため、この部品だけの変更は通知対象0件となる。既存URLの構造保守としてsitemap・内部リンク・自然クロールを使用し、Googleへの一括手動リクエストを行わない。通知済み・インデックス済みとは報告しない。

後日の本文・部品改訂では現在の承認基準ハッシュ、右欄役割台帳、独立オラクルの影響を確認し、差分を審査して必要な登録を更新する。既存の保全検査を外して変更を通さない。新規記事はmanifestとintegration.targets/右欄仕様へ明示登録し、追加URLの公開導線・通知を別途確認する。
