# Cloudflare Pages Preview Builder finalization

- AI Editorial Article Builder v4 now generates Cloudflare Pages branch-alias preview URLs instead of Netlify Deploy Preview URLs.
- Preview provider project: `denkicontrol-preview.pages.dev`.
- Branch alias is derived from the Git branch by lowercasing and replacing non-alphanumeric runs with `-`.
- Preview evidence kind is provider-neutral `preview`.
- The runtime entrypoint pins the patched v4 commit `5252e34bac27da807dd9b65f3941aa80a6522db3`.
- Production GitHub Pages and IndexNow remain unchanged.
