# Cloudflare research environment bootstrap

Status: implementation-ready operator procedure. This document does not contain, request, or validate secret values.

## Purpose

Unblock `C-001` by configuring the GitHub environment used by `.github/workflows/cloudflare-pages-research.yml` while preserving least privilege, provenance, and the rule that configuration evidence is not deployment evidence.

## Required identities

- GitHub environment: `cloudflare-research`
- Cloudflare Pages project: `mirrorcartographer-research`
- GitHub environment secrets:
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_API_TOKEN`

Do not place either value in repository variables, workflow YAML, issues, logs, evidence JSON, screenshots, or commit messages.

## Cloudflare token boundary

Create a dedicated token for this deployment path rather than reusing a broad personal or global token.

Minimum intended capability:

- Account scope: the single account that owns `mirrorcartographer-research`
- Permission: Cloudflare Pages edit/deploy access only
- Resource scope: narrowest account scope supported by Cloudflare for the Pages project

Do not grant DNS edit, Workers edit, account administration, billing, user management, or unrelated zone permissions unless a later verified deployment requirement proves one is necessary.

## GitHub environment installation

In repository settings:

1. Open **Environments**.
2. Create or open `cloudflare-research`.
3. Add environment secret `CLOUDFLARE_ACCOUNT_ID`.
4. Add environment secret `CLOUDFLARE_API_TOKEN`.
5. Keep secret values masked and never copy them into workflow inputs.
6. Preserve any existing environment protection rules.

The deployment workflow must continue to reference the environment by name and consume only these two secrets.

## Pre-dispatch verification

Before dispatching the deployment workflow, verify the committed contract on the exact target commit:

```bash
node --test cloudflare-static/validate-workflow-environment-contract.test.mjs
node cloudflare-static/validate-workflow-environment-contract.mjs .github/workflows/cloudflare-pages-research.yml
node --test cloudflare-static/validate-environment-requirements.test.mjs
node cloudflare-static/validate-environment-requirements.mjs cloudflare-static/cloudflare-environment-requirements.json
```

A pass proves only that repository declarations are structurally consistent. It does not prove that secrets exist, are correct, are authorized, or can deploy.

## Dispatch and evidence sequence

Dispatch `.github/workflows/cloudflare-pages-research.yml` from the target commit. Accept completion only when the workflow produces all of the following:

1. successful Cloudflare access/readiness classification;
2. Cloudflare-returned deployment URL;
3. resolving HTTPS response;
4. served research-surface identity;
5. served commit matching the dispatched source commit;
6. validated deployment proof packet;
7. provenance attestation bound to the exact proof bytes;
8. trusted-builder policy acceptance;
9. retained workflow artifact or immutable evidence record.

Do not report `C-001` complete from a green configuration test alone.

## Failure classification

- `missing_secret`: GitHub environment secret absent or unavailable to the job.
- `unauthorized_token`: token exists but Cloudflare denies the requested operation.
- `wrong_account`: account identifier does not own the Pages project.
- `project_missing`: authenticated account cannot resolve `mirrorcartographer-research`.
- `deploy_failed`: access succeeds but Pages deployment fails.
- `url_unresolved`: deployment is returned but the hostname does not resolve or serve HTTPS.
- `identity_mismatch`: served surface or commit differs from the dispatched source.
- `proof_invalid`: deployment occurred but the proof packet, attestation, or trust policy fails.

Record only the classification, timestamps, workflow/run references, commit SHA, and non-secret provider error summaries.

## Rollback and revocation

If the token is exposed, over-permissioned, or behaves unexpectedly:

1. revoke the Cloudflare API token;
2. remove or replace `CLOUDFLARE_API_TOKEN` in the GitHub environment;
3. preserve workflow logs and evidence records that contain no secret value;
4. do not rewrite or delete Git history;
5. create a narrower replacement token and repeat the verification sequence.

Removing environment secrets blocks future deployments but does not remove prior Cloudflare deployments. Roll back a deployed release through Cloudflare's deployment controls only after preserving the deployment identity and evidence needed for audit.

## Epistemic boundary

- Secret installation is configuration evidence.
- Successful authentication is access evidence.
- A returned deployment is provider control-plane evidence.
- A resolving URL with matching served identity is runtime deployment evidence.
- None of these, by itself, proves scientific or medical claims published on the research surface.
