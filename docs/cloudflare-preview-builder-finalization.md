# Cloudflare Pages Preview Builder finalization

- AI Editorial Article Builder v4 now generates Cloudflare Pages branch-alias preview URLs instead of Netlify Deploy Preview URLs.
- Preview provider project: `denkicontrol-preview.pages.dev`.
- Branch alias is derived from the Git branch by lowercasing and replacing non-alphanumeric runs with `-`.
- Preview evidence kind is provider-neutral `preview`.
- The runtime entrypoint pins the patched v4 commit `5252e34bac27da807dd9b65f3941aa80a6522db3`.
- Production GitHub Pages and IndexNow remain unchanged.

## Final approval Preview

- Cloudflare Pages のbranch Preview URLが存在するだけでは、公開前の最終承認条件を満たさない。projectがrepository rootをそのまま配信する設定では、編集元 `articles/*.html` のraw HTMLが表示される場合がある。
- 共通shell / Hero / sidebar / end部品の統合対象記事は、raw branch Previewを最終承認用に使わない。
- 公開前の最終Previewは、本番GitHub Pagesと同じ `build-integrated-review` → `prepare-integrated-publication` → 公開用画像WebP最適化 → publication最終検証を通した成果物を配信する。
- 外部Preview URLをユーザーへ案内する前に、そのURLのHTMLが統合生成物であることを確認する。例として、共通shellのmarker、共通追従目次、関連記事・評価部品等の期待構造を確認し、編集元raw HTMLとの差を取り違えない。
- 最終目視は最低限 PCライト／PCダーク／スマホライト／スマホダークを行う。必要に応じてタブレット幅を追加する。
- 最終生成物を配信するための専用branch / PRを用意する場合はPreview専用と明示し、mainへマージしない。公開成功後に閉じ、一時Workflow・trigger・生成専用ファイルがmainへ混入していないことを確認する。


### 検証中のGitHub自動Preview経路

[Preview配信正本](preview-environment.md) の「検証中：GitHub側での自動統合Preview」を参照。自動経路を使う場合も、rawソースブランチURLではなく検証済みpublicationの配信ブランチを確認し、source commit／ハッシュ一致とPCライト・PCダーク・スマホライト・スマホダークを記録する。追加ページは記事専用controlsを要求しない。検証中の実装を完了済みと扱わず、mainにはマージしない。
