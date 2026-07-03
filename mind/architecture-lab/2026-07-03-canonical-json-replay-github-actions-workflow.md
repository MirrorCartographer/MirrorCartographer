# Canonical JSON Replay GitHub Actions Workflow Pattern

Date: 2026-07-03
Status: proposed design pattern
Scope: MC governance tooling / canonical JSON replay
Public-safety posture: public-safe; no private user material, secrets, personal data, or project-private narrative is required by this pattern.

## Architecture question researched

How should MC define the GitHub Actions workflow for canonical JSON replay so it runs `tools/replay-governance-canonical-json-fixtures.mjs` with least privilege, preserves replay artifacts, avoids workflow complexity traps, and blocks governance changes only on stable check failures?

## Research sources

- GitHub documentation: `GITHUB_TOKEN` can be accessed by actions through the `github.token` context even when not explicitly passed, so workflows should grant only minimum required permissions with the `permissions` key.
- GitHub documentation: workflow commands support file/line error annotations, so normalized replay checks can be projected into CI annotations without exposing raw validator internals.
- GitHub documentation: job summaries are written through `GITHUB_STEP_SUMMARY`, are displayed on the workflow run summary page, and should be generated from already-normalized Markdown.
- GitHub documentation: artifacts can be uploaded with `actions/upload-artifact@v4`, can use custom `retention-days`, and uploaded/downloaded artifact digests are SHA-256 validated.
- 2024-2026 research on GitHub Actions workflow maintenance and reliability indicates that larger, more complex workflow files correlate with more maintenance effort and higher failure risk.
- 2025-2026 security research on GitHub Actions indicates that over-privileged jobs and agentic workflow injection are live supply-chain risks, especially when untrusted event content reaches scripts, prompts, or privileged tokens.

## Useful concepts extracted

### 1. Treat the workflow as a thin harness, not a second compiler

The workflow must not reimplement canonicalization, schema validation, Markdown generation, or check normalization. It should only:

1. check out the repository;
2. install or select the runtime;
3. run the replay tool;
4. upload generated replay artifacts;
5. append the generated Markdown summary to `GITHUB_STEP_SUMMARY` if present;
6. let the replay tool's exit code determine pass/fail.

This keeps the durable logic inside versioned MC tools rather than inside brittle YAML shell logic.

### 2. Use least privilege by default

The workflow requires repository read access only. It should set top-level permissions to read-only:

```yaml
permissions:
  contents: read
```

No secrets, write tokens, issue permissions, pull-request write permissions, package permissions, deployment permissions, or OIDC permissions are required for canonical replay.

### 3. Trigger narrowly enough to reduce noise

The workflow should run only when canonical governance inputs or the replay harness change:

```yaml
on:
  pull_request:
    paths:
      - "tools/replay-governance-canonical-json-fixtures.mjs"
      - "tools/lib/governance-canonical-json.mjs"
      - "mind/schemas/governance.canonical-json*.json"
      - "mind/fixtures/governance.canonical-json.v1/**"
      - ".github/workflows/governance-canonical-json-replay.yml"
  push:
    branches: [main]
    paths:
      - "tools/replay-governance-canonical-json-fixtures.mjs"
      - "tools/lib/governance-canonical-json.mjs"
      - "mind/schemas/governance.canonical-json*.json"
      - "mind/fixtures/governance.canonical-json.v1/**"
      - ".github/workflows/governance-canonical-json-replay.yml"
```

This avoids CI churn while still protecting the governance kernel.

### 4. Preserve artifacts even on failure

Replay output is a governance artifact. The artifact upload step should use `if: always()` so maintainers can inspect generated JSON and Markdown after failures.

Recommended artifact bundle path:

```text
artifacts/governance/canonical-json-replay/
```

Recommended minimum generated files:

```text
replay-result.json
summary.md
annotations.ndjson
```

`replay-result.json` remains the source of truth. `summary.md` and annotations are generated views.

### 5. Stable failures only

The workflow should fail only when the replay CLI exits nonzero. Shell glue must not create extra failure modes except missing runtime or missing files. This means:

- no grep-based assertions in YAML;
- no inline JSON parsing in workflow shell;
- no ad hoc path walking in YAML;
- no workflow-level transformation of check codes;
- no direct use of private or untrusted event text as script input.

### 6. Generated summaries must be public-safe by construction

The replay tool should emit a safe, bounded Markdown summary. The workflow may append that summary to `GITHUB_STEP_SUMMARY`, but must not construct Markdown from raw fixture contents, raw exception stacks, untrusted PR text, branch names, commit messages, or user-private context.

## Proposed workflow file

Target path:

```text
.github/workflows/governance-canonical-json-replay.yml
```

Proposed first version:

```yaml
name: Governance Canonical JSON Replay

on:
  pull_request:
    paths:
      - "tools/replay-governance-canonical-json-fixtures.mjs"
      - "tools/lib/governance-canonical-json.mjs"
      - "mind/schemas/governance.canonical-json*.json"
      - "mind/fixtures/governance.canonical-json.v1/**"
      - ".github/workflows/governance-canonical-json-replay.yml"
  push:
    branches: [main]
    paths:
      - "tools/replay-governance-canonical-json-fixtures.mjs"
      - "tools/lib/governance-canonical-json.mjs"
      - "mind/schemas/governance.canonical-json*.json"
      - "mind/fixtures/governance.canonical-json.v1/**"
      - ".github/workflows/governance-canonical-json-replay.yml"

permissions:
  contents: read

concurrency:
  group: governance-canonical-json-replay-${{ github.ref }}
  cancel-in-progress: true

jobs:
  replay:
    name: Replay canonical JSON fixtures
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Set up Node
        uses: actions/setup-node@v6
        with:
          node-version: "24"

      - name: Replay canonical JSON fixtures
        run: node tools/replay-governance-canonical-json-fixtures.mjs

      - name: Publish replay summary
        if: always()
        shell: bash
        run: |
          summary="artifacts/governance/canonical-json-replay/summary.md"
          if [ -f "$summary" ]; then
            cat "$summary" >> "$GITHUB_STEP_SUMMARY"
          else
            echo "### Canonical JSON replay" >> "$GITHUB_STEP_SUMMARY"
            echo "No replay summary was generated." >> "$GITHUB_STEP_SUMMARY"
          fi

      - name: Upload replay artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: governance-canonical-json-replay
          path: artifacts/governance/canonical-json-replay/
          if-no-files-found: warn
          retention-days: 14
```

## Acceptance requirements

The workflow is acceptable when all of the following are true:

1. It runs on pull requests and pushes to `main` only when canonical governance files change.
2. It grants only `contents: read` to `GITHUB_TOKEN`.
3. Checkout does not persist credentials into the local git config.
4. The replay tool is the only source of pass/fail semantics.
5. Replay artifacts are uploaded even when the replay step fails.
6. `summary.md` is appended to `GITHUB_STEP_SUMMARY` if generated.
7. No secret, private user material, raw exception dump, PR body, branch name, or commit message is interpolated into generated summaries or shell commands.
8. The workflow remains one job with a short timeout unless a measured need justifies expansion.
9. Future dependency installation must be pinned and minimal; the first workflow should avoid npm install if the current replay tool has no external package requirement.
10. Any later write-capable governance workflow must be separate from this read-only replay workflow.

## Design decision

MC should add this workflow only after the replay CLI consistently emits:

- canonical replay result JSON;
- generated Markdown summary;
- normalized annotations/checks;
- stable exit codes for pass, replay-failure, and schema-invalid cases.

The workflow itself should be committed as infrastructure, but it should not become the authority for governance semantics.

## Next implementation step

Add `.github/workflows/governance-canonical-json-replay.yml` using the proposed pattern after verifying the current replay tool writes artifacts to `artifacts/governance/canonical-json-replay/` and preserves stable exit behavior.

## Next architecture question

How should MC define the canonical replay artifact directory contract so `tools/replay-governance-canonical-json-fixtures.mjs`, GitHub Actions artifact upload, job summaries, and future governance dashboard ingestion all consume the same stable file layout without duplicating path constants across scripts and workflows?
