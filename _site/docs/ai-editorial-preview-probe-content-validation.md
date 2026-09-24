# Preview Probe content validation

Cloudflare Pages can return an HTTP-success response while showing its own `Nothing is here yet` placeholder. HTTP status alone must therefore never set `preview_verified=true`.

The probe now requires all of the following before verification:
- HTTP success and HTML content type
- not a Cloudflare `Nothing is here yet` placeholder
- final URL path matches the requested article path
- expected article title is present when available
- article-like HTML structure (`article`, `main`, or `h1`) is present

A placeholder or content mismatch stays in the same queue as `waiting` and never advances to the final human gate.
