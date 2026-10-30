# Public website operations

The canonical static atlas is published from `site/` by `.github/workflows/publish-mc-atlas.yml`. Expected URL: https://mirrorcartographer.github.io/MirrorCartographer/.

No Cloudflare account, paid host, server, database, or API key is required. If GitHub Pages has not already been enabled, choose **Settings → Pages → Build and deployment → Source → GitHub Actions** once.

The build generates a searchable catalog from tracked repository files. It excludes paths named private/secrets/credentials/personal-records, environment files, binary media, and workflow internals. This is a presentation filter, not a security boundary: anything committed to a public repository is public.

The site links to https://chatgpt.com/ as a general continuation point. It cannot read private ChatGPT conversation state or embed an authenticated ChatGPT session. Direct conversation URLs must be intentionally supplied and reviewed before publication.

Do not call the site live until the workflow succeeds and the deployed URL has been checked on desktop and mobile.