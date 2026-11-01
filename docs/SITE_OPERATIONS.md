# Public website operations

The canonical static atlas is published from `site/` by `.github/workflows/publish-mc-atlas.yml`. The `/chatgpt/` route is a no-backend handoff: it creates a prepared ChatGPT prompt containing the selected public page and `chatgpt/project-manifest.json`; the visitor reviews and sends it, and ChatGPT must fetch the public sources itself. Expected URL: https://mirrorcartographer.github.io/MirrorCartographer/.

The build clones the public companion application repository and generates one searchable catalog across both repositories. The most recent successful build step indexed **6,450 public source files across two repositories**. The catalog links back to the canonical source files on GitHub.

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

## Companion route contract

The companion application uses the repository project path on GitHub Pages:

- `/` — wordless Room-World, built from `src/main.jsx` and `src/components/RoomWorldValid.jsx`.
- `/atlas/` — navigable Living Atlas, served from `public/atlas/index.html`.
- `/research-atlas/` — The Between, mirrored from `research-atlas/index.html` to `public/research-atlas/index.html`.

The Room-World card in the companion atlas uses the relative link `../` so it returns to the GitHub Pages project root without depending on another hosting provider. Local world links must resolve to files under `public/atlas/worlds/`; The Between link must resolve to the published research-atlas route.

Free GitHub Pages is the only approved public hosting target for these two sites. Existing Vercel, Netlify, and Cloudflare configuration or research files are retained as historical artifacts, not release targets.

The catalog excludes paths named private/secrets/credentials/personal-records, environment files, binary media, and workflow internals. This is a presentation filter, not a security boundary: anything committed to a public repository is public.

## Current deployment blocker — observed 2026-11-01

The latest publication attempts separate source/build health from Pages activation:

- Core run [41351129471](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/41351129471): site validation, cross-repository catalog generation, privacy checks, and Pages artifact upload passed. The deploy job failed before its steps started; no detailed deploy log was returned.
- Companion run [41351094787](https://github.com/MirrorCartographer/mirror-cartographer-ui/actions/runs/41351094787): Vite build, all three route artifacts, and immutable GitHub Pages build-identity checks passed. `configure-pages` then reported **Get Pages site failed: Not Found** and **Create Pages site failed: Resource not accessible by integration**; `deploy-pages` was skipped.

This is a repository Pages-activation/permission blocker, not a failed application build. The owner must set **Settings → Pages → Build and deployment → Source → GitHub Actions** once in each repository. Then rerun both publication workflows. Do not switch to another hosting provider.

Neither public site is considered live until both deploy jobs succeed and the deployed routes have been checked on desktop and mobile.

## ChatGPT relationship

The site links to https://chatgpt.com/ as a general continuation point. It cannot read private ChatGPT conversation state or embed an authenticated ChatGPT session. Direct conversation URLs must be intentionally supplied and reviewed before publication.

Do not call the sites live until the GitHub Actions deployment succeeds and the deployed URLs have been opened and checked on desktop and mobile.