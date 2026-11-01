# Public website operations

The canonical static atlas is published from `site/` by `.github/workflows/publish-mc-atlas.yml`. The `/chatgpt/` route is a no-backend handoff: it creates a prepared ChatGPT prompt containing the selected public page and `chatgpt/project-manifest.json`; the visitor reviews and sends it, and ChatGPT must fetch the public sources itself. Expected URL: https://mirrorcartographer.github.io/MirrorCartographer/.

The build clones the public companion application repository and generates one searchable catalog across both repositories. The most recent successful build step indexed **6,450 public source files across two repositories**. The catalog links back to the canonical source files on GitHub.

## One-time free activation

A repository owner, administrator, or maintainer must enable the Pages publishing source once in each repository:

1. Open [core repository Pages settings](https://github.com/MirrorCartographer/MirrorCartographer/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**, then save.
3. Open [interactive application Pages settings](https://github.com/MirrorCartographer/mirror-cartographer-ui/settings/pages).
4. Set **Source** to **GitHub Actions** there as well, then save.

This is free for these public repositories. No Cloudflare account, paid host, server, database, personal access token, or API key is required. After the source is enabled, the existing workflows use the repository-scoped Actions token to deploy.

The workflows intentionally call `actions/configure-pages@v5` without `enablement: true`. That option attempts to create the Pages site and requires a separate personal access token or GitHub App token with repository-administration permissions; the default `GITHUB_TOKEN` cannot perform that one-time administrative operation. Enabling the source in Settings is the correct no-secret setup.

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

Free GitHub Pages is the only approved public hosting target for these two sites. The former Cloudflare research deployment workflow is retired and now emits a notice without deploying; related evidence and contract files remain as historical research artifacts. Existing Vercel and Netlify configuration is historical only. No third-party hosting account, paid service, or API key is required for the two-site release.

The catalog excludes paths named private/secrets/credentials/personal-records, environment files, binary media, and workflow internals. This is a presentation filter, not a security boundary: anything committed to a public repository is public.

## Current deployment blocker — observed 2026-11-01

The latest runs confirm that source validation and static builds are healthy; deployment is blocked at repository-level Pages setup:

- Core run [41353268904](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/41353268904): site validation, cross-repository catalog generation, privacy checks, and Pages artifact upload all passed. The deploy job failed before a runner started; GitHub returned no steps or job log. Repository metadata reports `has_pages: true`, but the publishing-source setting could not be read through the available connection. Verify that **Source** is set to **GitHub Actions**. If this job still fails before a runner starts afterward, inspect **Settings → Environments → github-pages** for deployment-branch restrictions or protection rules; the current run does not expose enough evidence to identify that as the cause.
- Companion run [41353483322](https://github.com/MirrorCartographer/mirror-cartographer-ui/actions/runs/41353483322): the Vite build, all three route artifacts, immutable build-identity checks, and Pages artifact upload passed. `configure-pages` then reported **Get Pages site failed: Not Found** and `deploy-pages` was skipped. Repository metadata reports `has_pages: false`, consistent with the Pages site not yet being enabled.
- The preceding companion run [41351541475](https://github.com/MirrorCartographer/mirror-cartographer-ui/actions/runs/41351541475) showed the additional **Create Pages site failed: Resource not accessible by integration** error. That run had `enablement: true`; both publishing workflows have since been corrected to stop asking `GITHUB_TOKEN` to perform the administrative site-creation step.

This is not an application-build failure. Set **Settings → Pages → Build and deployment → Source → GitHub Actions** in both repositories, then rerun the two publication workflows. Do not switch to another hosting provider or add a personal access token.

Neither public site is considered live until both deploy jobs succeed and the deployed routes have been opened and checked on desktop and mobile.

## ChatGPT relationship

The site links to https://chatgpt.com/ as a general continuation point. It cannot read private ChatGPT conversation state or embed an authenticated ChatGPT session. Direct conversation URLs must be intentionally supplied and reviewed before publication.

Do not call the sites live until the GitHub Actions deployment succeeds and the deployed URLs have been opened and checked on desktop and mobile.