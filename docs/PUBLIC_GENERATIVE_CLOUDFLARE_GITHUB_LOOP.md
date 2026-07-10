# Public generative site → Cloudflare → GitHub learning loop

Status: repository code is prepared. Cloudflare dashboard/project activation is still a manual account step unless a Cloudflare API connector/token is added to the assistant environment.

## Public page

Route after deploy:

`/generative`

Expected Cloudflare URL if the Pages project is named `mirror-cartographer`:

`https://mirror-cartographer.pages.dev/generative`

This URL is not verified until Cloudflare Pages is actually connected and deployed.

## What is built

- `src/app/generative/page.tsx` renders the public self-rebuilding generative chamber.
- The page records interaction capsules for manual rebuilds and dead-end selections.
- `functions/api/interactions.ts` is a Cloudflare Pages Function that receives those capsules and writes each event into this GitHub repository as a JSON file.
- Raw user chats are not sent. The interaction event stores only public behavioral capsules: generation, grammar, selected dead end, session id, route, and timestamp.

## Why the GitHub token must not be in browser code

The website runs in visitors' browsers. Any secret placed in browser JavaScript becomes public. The GitHub write token must live only in Cloudflare Pages environment variables, where the browser cannot read it.

## Cloudflare Pages setup

Repository: `MirrorCartographer/MirrorCartographer`
Branch: `main`
Build command: `npm run build:cloudflare`
Build output directory: `out`
Root directory: `/`

The repo already has `wrangler.jsonc` with:

- project name: `mirror-cartographer`
- output directory: `./out`

## Required Cloudflare environment variables

Set these in Cloudflare Pages → project → Settings → Environment variables:

- `GITHUB_TOKEN`: fine-grained GitHub token with Contents read/write for `MirrorCartographer/MirrorCartographer`
- `GITHUB_OWNER`: `MirrorCartographer`
- `GITHUB_REPO`: `MirrorCartographer`
- `GITHUB_BRANCH`: `main`
- `GITHUB_EVENT_PATH`: `data/public-interactions`

Optional:

- `MC_INGEST_SECRET`: if set, requests must provide `x-mc-ingest-secret`. Do not set this for public anonymous interaction capture unless the page is also updated to send the header from a non-public source. For a public website, rate limiting / Turnstile / review queue is safer than putting a shared secret in browser code.

## What commits to GitHub

Each accepted event writes a new file like:

`data/public-interactions/YYYY-MM-DD/<timestamp>-<eventType>-<sessionId>.json`

Commit message format:

`Record public generative interaction <eventType>`

## Safety boundary

This is not autonomous code rewriting yet. It is autonomous evidence collection.

Good next step after deploy:

1. Let the site collect interaction capsules.
2. Add a scheduled/explicit review script that summarizes patterns.
3. Only then generate proposed code changes as pull requests or reviewable commits.

Do not let anonymous traffic directly rewrite app source code.

## Verification checklist

After Cloudflare deploys:

1. Open `/generative`.
2. Press `rebuild now`.
3. Select a dead end.
4. Check GitHub for a new file under `data/public-interactions/`.
5. If no file appears, inspect Cloudflare Pages Function logs for `/api/interactions`.

## Current blocker

This assistant can write the repository but does not currently have a Cloudflare account connector in this chat. Cloudflare project creation, GitHub account authorization inside Cloudflare, and secret entry must be done in the Cloudflare dashboard unless a Cloudflare API token/tool is provided.
