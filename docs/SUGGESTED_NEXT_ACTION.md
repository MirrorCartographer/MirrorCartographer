# Suggested next action

## Current best next move

Deploy this repository to Cloudflare Pages as the public generative site, then test `/`, `/generative`, and `/api/interactions` from the deployed origin.

Recommended Cloudflare Pages settings:

- Repository: `MirrorCartographer/MirrorCartographer`
- Production branch: `main`
- Build command: `npm run build:cloudflare`
- Build output directory: `out`
- Functions directory: `functions`
- Required environment variables/secrets:
  - `GITHUB_TOKEN`: fine-grained token with contents write access to this repository
  - `GITHUB_OWNER`: `MirrorCartographer`
  - `GITHUB_REPO`: `MirrorCartographer`
  - `GITHUB_BRANCH`: `interaction-capsules`
  - `GITHUB_EVENT_PATH`: `data/public-interactions`

## Why this is next

The public landing page now points visitors into the generative side, and `/generative` records only intentional interaction capsules:

- `manual-rebuild`
- `dead-end-selected`

The Cloudflare Pages Function can turn those capsules into GitHub JSON files without exposing a token in the browser. The safest path is to write those capsules to the separate `interaction-capsules` branch first, then decide what summaries or learned rules should be merged into `main`.

## Preserve

- no autoplay
- tap-to-start audio only when audio is added later
- low CPU
- phone-first stability
- no browser-exposed GitHub token
- no passive timer-driven GitHub commits
- interaction data as public behavioral capsules, not private chat or identity

## Next cycle check

1. Confirm the Cloudflare Pages deployment exists and resolves.
2. Open `/` and confirm it links to `/generative`.
3. Open `/generative` on the deployed URL.
4. Tap `rebuild now` and one dead-end button.
5. Confirm JSON files appear under `data/public-interactions` on the `interaction-capsules` branch.
6. If working, build the first summarizer that reads interaction capsules and proposes one grammar mutation without automatically changing public UI code.
