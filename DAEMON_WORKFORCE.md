# Mirror Cartographer daemon workforce

Four repository-local workers now share one operating contract.

| Worker | Repository | Mandate |
|---|---|---|
| Observatory | MirrorCartographer/MirrorCartographer | Research, evidence, architecture integrity |
| Human Judgment Lab | MirrorCartographer/J (private) | Experiment integrity and falsifiability |
| Unfinished Constellation | MirrorCartographer/c (private) | Creative-page and interaction integrity |
| UI Sentinel | MirrorCartographer/mirror-cartographer-ui | Routes, workbenches, encounter integrity |

## Runtime

Each repository contains:
- `daemons/project_daemon.py` — deterministic, read-only inspection worker.
- `daemons/config.json` — project identity and guardrails.
- `daemons/mandate.md` — project-specific responsibilities and future capabilities.
- `.github/workflows/project-daemon.yml` — scheduled, push-triggered, and manually triggered execution.

The workflow runs on pushes to `main`, can be started with `workflow_dispatch`, and is scheduled every six hours. It publishes a Markdown summary and retains JSON/Markdown reports as workflow artifacts for 30 days.

## Current capability boundary

**Operational now:** local Markdown/HTML link checks, missing HTML fragment checks, duplicate HTML ID detection, basic unnamed-button and unlabelled-input warnings, page inventory, and dated report generation.

**Not yet operational:** browser interaction, semantic code repair, research synthesis, cross-repository task assignment, autonomous commits, or model-driven coding. The current workers are reliable inspection daemons, not autonomous software engineers. Those capabilities require a separately configured agent runtime, model credentials, scoped permissions, and a review policy. No API key or paid compute has been added.

## Safety contract

- No source edits or deletions.
- No external publishing.
- Private repositories remain private; no GitHub Pages setup.
- No access to personal conversations or sensitive records.
- No deployment changes.
- The two user-confirmed Vercel experiences remain protected:
  - https://mirror-cartographer-ui-3orp.vercel.app
  - https://mirrorcartographeravprototypev4.vercel.app/#

## Handoff protocol

A daemon finding is a lead, not a verdict. Human review determines priority. A future coding worker must:
1. create an isolated branch;
2. state the intended change and expected verification;
3. run the repository's tests and the daemon;
4. report exact changed files and test outcomes;
5. open a reviewable pull request rather than silently merging or deploying.

## Next build layer

1. Browser-level playtesting for the UI and creative repositories.
2. Research-provenance checks for the Observatory.
3. Experiment falsifiability and reset-path checks for Human Judgment Lab.
4. A cross-repository task ledger and coordinator.
5. Only then, an optional model-backed coding worker with explicit cost and permission boundaries.
