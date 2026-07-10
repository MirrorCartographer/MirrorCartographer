# Cloudflare connector

The connector lives at `tools/cloudflare-connector.mjs`.

It performs four actions:

1. verifies a Cloudflare API token
2. checks whether the Pages project exists
3. creates the Pages project when missing
4. builds and deploys the public site, including the `functions/` API routes

## Required secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token should be scoped only to the account and permissions required to manage Pages deployments.

## Local command

`npm run cloudflare:connect`

Optional environment variables:

- `CLOUDFLARE_PROJECT_NAME` defaults to `mirror-cartographer`
- `CLOUDFLARE_PRODUCTION_BRANCH` defaults to `main`
- `CLOUDFLARE_OUTPUT_DIR` defaults to `out`

## GitHub Actions

`.github/workflows/cloudflare-pages.yml` runs the same connector on pushes to `main` and by manual dispatch.

Add these repository secrets before running it:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

After the first successful run, the expected public routes are:

- `/`
- `/generative`
- `/api/interactions`

## Remaining GitHub ingest secret

The deployment connector does not invent or expose `GITHUB_TOKEN` for the public interaction endpoint. Add that token separately as a Cloudflare Pages secret after the project exists, or extend the connector with a signed secret-provisioning step from a trusted local machine.
