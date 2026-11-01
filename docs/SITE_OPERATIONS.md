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

Free GitHub Pages is the only approved public hosting target for these two sites. The core repository still contains a manually dispatchable Cloudflare research deployment workflow; it is separate from the two-site release and must not be dispatched under the current hosting policy. Its workflow-contract tests are coupled to that research experiment, so retiring the workflow safely requires a coordinated update to those tests and related evidence workflows. Existing Vercel and Netlify configuration is historical only. No third-party hosting account, paid service, or API key is required for the two-site release.

The catalog excludes paths named private/secrets/credentials/personal-records, environment files, binary media, and workflow internals. This is a presentation filter, not a security boundary: anything committed to a public repository is public.

## Current deployment status — observed 2026-11-01

Source validation and static builds are passing. Neither public deployment is currently verified live. A successful build or Pages artifact upload is not a deployment.

### Core Living Atlas

- Current source commit: [c3548cde196eb3f7d1a7fa780a4067273522a226](https://github.com/MirrorCartographer/MirrorCartographer/commit/c3548cde196eb3f7d1a7fa780a4067273522a226).
- [Publication run 41354181442](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/41354181442): the build job passed site validation, cross-repository catalog generation, catalog privacy/schema checks, and Pages artifact upload. The deploy job failed before a runner started. GitHub returned no step list or job-log URL for that deploy job, so the exact cause is not established by this run.
- Repository metadata reports `has_pages: true`. The connected GitHub read did not expose the Pages publishing-source setting. Do not infer that the source is correctly configured from `has_pages` alone.
- [Core CI run 41354181443](https://github.com/MirrorCartographer/MirrorCartographer/actions/runs/41354181443) passed typecheck and build.

Check [core repository Pages settings](https://github.com/MirrorCartographer/MirrorCartographer/settings/pages) and confirm **Build and deployment → Source → GitHub Actions**. If that is already selected, inspect **Settings → Environments → github-pages** for deployment-branch restrictions or protection rules. The current deploy job has no runner log, so do not attribute its failure to a specific setting until that check is made.

### Companion interactive application

- Current source commit: [12f4895543a79b4b7914b7f899297ae2bb91eadf](https://github.com/MirrorCartographer/mirror-cartographer-ui/commit/12f4895543a79b4b7914b7f899297ae2bb91eadf).
- The preceding publication run [41354366039](https://github.com/MirrorCartographer/mirror-cartographer-ui/actions/runs/41354366039) passed the Vite build, all three route artifacts, immutable build-identity check, and Pages artifact upload. `actions/configure-pages@v5` then returned **Get Pages site failed: Not Found**; `actions/deploy-pages@v4` was skipped.
- Repository metadata reports `has_pages: false`, consistent with the Pages site not yet being enabled.
- [Phone-first local smoke run 41354366058](https://github.com/MirrorCartographer/mirror-cartographer-ui/actions/runs/41354366058), [build-artifact run 41354365983](https://github.com/MirrorCartographer/mirror-cartographer-ui/actions/runs/41354365983), and [working-machine run 41354365897](https://github.com/MirrorCartographer/mirror-cartographer-ui/actions/runs/41354365897) passed. These are source/build checks, not public deployment proof.
- The live browser test was corrected to target the active Room-World control `button.world-surface`; the retired `button.sky` selector was not present in the active component. The selector contract is now checked by `scripts/live-wiring-check.mjs`.

A repository administrator must open [interactive application Pages settings](https://github.com/MirrorCartographer/mirror-cartographer-ui/settings/pages) and set **Build and deployment → Source → GitHub Actions** once. Then rerun the publication workflow and the live route checks.

### Release acceptance

Neither public site is considered live until its deploy job succeeds and the deployed routes have been opened and checked on desktop and mobile. For the companion application, verify `/`, `/atlas/`, and `/research-atlas/`; for the core site, verify the Living Atlas, catalog search, `/mind/`, and `/chatgpt/` handoff. Do not use another hosting provider or add a personal access token to bypass Pages activation.

## ChatGPT relationship

The site links to https://chatgpt.com/ as a general continuation point. It cannot read private ChatGPT conversation state or embed an authenticated ChatGPT session. Direct conversation URLs must be intentionally supplied and reviewed before publication.

Do not call the sites live until the GitHub Actions deployment succeeds and the deployed URLs have been opened and checked on desktop and mobile.