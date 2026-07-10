# Cloudflare public generative setup

Purpose: deploy the public `MirrorCartographer/MirrorCartographer` site to Cloudflare Pages and allow `/generative` to record public interaction capsules back into GitHub.

## What is already in the repo

- `src/app/generative/page.tsx` — public self-rebuilding generative interface.
- `functions/api/interactions.ts` — Cloudflare Pages Function that receives interaction capsules and commits them to GitHub.
- `wrangler.jsonc` — Pages output directory is `./out`.
- `next.config.ts` — static export is enabled.

## Cloudflare Pages project

Create a Cloudflare Pages project from GitHub.

Repository: `MirrorCartographer/MirrorCartographer`
Production branch: `main`
Build command: `npm run build:cloudflare`
Build output directory: `out`
Root directory: `/`

This is intended as the public site, separate from the private Vercel phone-first weather/music prototype.

## Required Cloudflare environment variables

Set these in Cloudflare Pages project settings.

`GITHUB_OWNER=MirrorCartographer`
`GITHUB_REPO=MirrorCartographer`
`GITHUB_BRANCH=main`
`GITHUB_EVENT_PATH=data/public-interactions`

Set this as a secret, not a plain public variable:

`GITHUB_TOKEN=<fine-grained GitHub token>`

The token should have the smallest workable permissions: write access to contents for `MirrorCartographer/MirrorCartographer` only.

Optional protection:

`MC_INGEST_SECRET=<random secret>`

If `MC_INGEST_SECRET` is set, browser requests must include `x-mc-ingest-secret`. The current public page does not include that header because a browser-visible secret is not a real secret. Use this only for non-public clients or a later signed-token flow.

## What gets committed

The site does not commit raw personal data. It commits public behavioral capsules like:

- event type
- generation number
- generated grammar
- selected dead end
- anonymous session id
- source path
- client time

Files are written under:

`data/public-interactions/YYYY-MM-DD/<timestamp>-<event>-<session>.json`

## Safety notes

Do not put a GitHub token in client-side code.
Do not collect raw chat content through the public page.
Do not let public users write arbitrary paths.
Do not let public users overwrite existing repo files.
Treat committed interactions as public.

## Learning loop

Current loop:

visitor interaction → Cloudflare Function → GitHub JSON capsule → future build cycles analyze capsules → update public grammar intentionally

Later loop:

visitor interaction → capsule aggregation → motif scoring → generated PR or issue → review → merge into grammar

The site should learn, but not silently rewrite the project without review.

## Suggested next action

After Cloudflare Pages is connected, open `/generative`, click `rebuild now`, then check whether a new JSON file appears under `data/public-interactions`. If no file appears, inspect Cloudflare Function logs first for missing `GITHUB_TOKEN` or GitHub permission errors.
