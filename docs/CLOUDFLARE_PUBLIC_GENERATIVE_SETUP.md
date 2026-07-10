# Cloudflare public generative setup

Purpose: deploy the public `MirrorCartographer/MirrorCartographer` site to Cloudflare Pages and allow `/generative` to record intentional public interaction capsules back into GitHub.

## What is already in the repo

- `cloudflare-static/index.html` — committed public landing page for the generative/Cloudflare side.
- `cloudflare-static/generative/index.html` — committed self-rebuilding generative chamber.
- `src/app/page.tsx` and `src/app/generative/page.tsx` — Next source versions for later rebuilds.
- `functions/api/interactions.ts` — Cloudflare Pages Function that receives intentional interaction capsules and commits them to GitHub.
- `wrangler.jsonc` and `wrangler.toml` — Pages output directory is `cloudflare-static`.
- `next.config.ts` — static export remains available if the project returns to a build step later.

## Cloudflare Pages project

Create or update a Cloudflare Pages project from GitHub.

Repository: `MirrorCartographer/MirrorCartographer`
Production branch: `main`
Build command: `exit 0`
Build output directory: `cloudflare-static`
Root directory: `/`
Functions directory: `functions`

This committed-static path exists to keep deployment working even when the Cloudflare dashboard build command is blank or not yet configured. Cloudflare's current static-site guidance recommends `exit 0` for no-build projects that still need Pages features such as Functions.

This is intended as the public generative site, separate from the private Vercel phone-first weather/music prototype.

## Required Cloudflare environment variables

Set these in Cloudflare Pages project settings.

`GITHUB_OWNER=MirrorCartographer`
`GITHUB_REPO=MirrorCartographer`
`GITHUB_BRANCH=interaction-capsules`
`GITHUB_EVENT_PATH=data/public-interactions`

Set this as a secret, not a plain public variable:

`GITHUB_TOKEN=<fine-grained GitHub token>`

The token should have the smallest workable permissions: write access to contents for `MirrorCartographer/MirrorCartographer` only.

Optional protection:

`MC_INGEST_SECRET=<random secret>`

If `MC_INGEST_SECRET` is set, browser requests must include `x-mc-ingest-secret`. The current public page does not include that header because a browser-visible secret is not a real secret. Use this only for non-public clients or a later signed-token flow.

## What gets committed

The site does not commit raw personal data. It commits public behavioral capsules only for intentional actions:

- `manual-rebuild`
- `dead-end-selected`

Files are written under:

`data/public-interactions/YYYY-MM-DD/<timestamp>-<event>-<session>.json`

on the `interaction-capsules` branch.

## Safety notes

Do not put a GitHub token in client-side code.
Do not collect raw chat content through the public page.
Do not let public users write arbitrary paths.
Do not let public users overwrite existing repo files.
Do not let passive timers create GitHub commits.
Treat committed interactions as public.

## Learning loop

Current loop:

intentional visitor interaction → Cloudflare Function → GitHub JSON capsule on `interaction-capsules` → future build cycles analyze capsules → reviewed update to public grammar

Later loop:

visitor interaction → capsule aggregation → motif scoring → generated PR or issue → review → merge into grammar

The site should learn, but not silently rewrite the project without review.

## Suggested next action

Redeploy Cloudflare Pages, then open `/`, open `/generative`, click `rebuild now`, choose one dead end, and check whether new JSON files appear under `data/public-interactions` on the `interaction-capsules` branch. If no file appears, inspect Cloudflare Function logs first for missing `GITHUB_TOKEN`, missing `GITHUB_BRANCH`, or GitHub permission errors.
