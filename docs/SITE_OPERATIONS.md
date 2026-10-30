# Public website operations

The canonical static atlas is published from `site/` by `.github/workflows/publish-mc-atlas.yml`. Expected URL: https://mirrorcartographer.github.io/MirrorCartographer/.

The build clones the public companion application repository and generates one searchable catalog across both repositories. The most recent successful build step indexed **6,449 public source files across two repositories**. The catalog links back to the canonical source files on GitHub.

## One-time free activation

GitHub's Actions token cannot create a Pages site for these repositories. A repository owner must enable the Pages source once:

1. Open [core repository Pages settings](https://github.com/MirrorCartographer/MirrorCartographer/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open [interactive application Pages settings](https://github.com/MirrorCartographer/mirror-cartographer-ui/settings/pages).
4. Set **Source** to **GitHub Actions** there as well.

This is a free GitHub setting for public repositories. No Cloudflare account, paid host, server, database, or API key is required. After the settings are enabled, the existing workflows can deploy the sites.

## Architecture

- `site/index.html`: landing page, relationship explorer, and repository search interface.
- `site/generate-catalog.mjs`: builds a searchable index from tracked public files in both repositories.
- `.github/workflows/publish-mc-atlas.yml`: clones the companion repo, builds the catalog, and publishes the static artifact.
- The companion Vite app is built and published by `.github/workflows/publish-github-pages.yml` in the UI repository.

The catalog excludes paths named private/secrets/credentials/personal-records, environment files, binary media, and workflow internals. This is a presentation filter, not a security boundary: anything committed to a public repository is public.

## ChatGPT relationship

The site links to https://chatgpt.com/ as a general continuation point. It cannot read private ChatGPT conversation state or embed an authenticated ChatGPT session. Direct conversation URLs must be intentionally supplied and reviewed before publication.

Do not call the sites live until the GitHub Actions deployment succeeds and the deployed URLs have been opened and checked on desktop and mobile.