# Mirror Cartographer Execution Loop

The execution loop is a small, repository-owned runner. It is designed to operate without an open ChatGPT session or a paid AI API.

## What runs

- **Trigger:** manual dispatch, relevant pushes to `main`, and a scheduled run every six hours (GitHub may delay scheduled runs).
- **Queue:** `execution/queue.json` is the durable, version-controlled work queue.
- **Runner:** `tools/mc_execution/run.mjs` checks queue integrity and confirms required project inputs exist.
- **Verification:** GitHub Actions validates the canonical site, validates the playable Mind page (required systems, IDs, anchors, JavaScript syntax, room definitions, and local-only notebook boundary), parses the catalog tools, runs the integrated evidence-gate checks, generates/validates the cross-repository catalog using a temporary checkout of the companion application, and runs Playwright smoke tests in Chromium for navigation, expedition progression, room selection, notebook export, and mobile overflow.
- **Report:** every run attempts to upload `execution-report.md` as the `mc-execution-report` workflow artifact, including on failure.

## Start or inspect a run

1. Open [Execution Loop workflow runs](https://github.com/MirrorCartographer/MirrorCartographer/actions/workflows/mc-execution-loop.yml).
2. Select **Run workflow** to start a manual run, or open the latest scheduled/push run.
3. Open the run's **Artifacts** section and download `mc-execution-report`.
4. If a step failed, inspect that step's log. The report is a summary, not a substitute for the raw log.

## Queue contract

Each task in `execution/queue.json` has a stable ID, title, status, priority, type, checks, and completion evidence. Allowed statuses are:

- `queued`: not started
- `active`: currently prioritized
- `blocked`: requires an external action or unresolved dependency
- `done`: completion evidence exists

Do not mark a task `done` merely because a workflow ran. Record the evidence that demonstrates the stated outcome. Keep task descriptions and generated reports free of private conversations, credentials, and sensitive personal or medical records.

## Safety and scope

The current runner is deliberately **verify-and-report**, not an unrestricted self-modifying agent. Each required workflow step reports its outcome into the final artifact; a failed or skipped verification is not represented as a pass. It does not write to production code, merge changes, change repository settings, or mark tasks complete. A successful CI run verifies only the checks listed in that run; it does not prove that every interactive experience works in a real browser or that Pages is enabled in repository settings.

The next safe expansion is to add focused browser smoke tests and a failure-classification step. Any future automated patching should run on an isolated branch, produce a diff and test evidence, and require review before merge or deployment.

## Infrastructure

The loop uses GitHub Actions, Node.js, Python, and public repository sources. It does not require a paid host, paid API, secret API key, or external database.
