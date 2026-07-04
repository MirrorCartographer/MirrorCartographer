# Dry-run replay result envelope field contract

Date: 2026-07-04
Status: Design pattern / implementation requirement
Scope: Public-safe MC governance replay architecture

## Architecture question

How should MC define the exact `result.json` envelope fields for the dry-run runner skeleton so they are minimal, schema-compatible, deterministic, and sufficient for later manifest custody and dashboard ingestion without introducing wall-clock or host-specific data?

## Research basis

Current source review focused on the interfaces the runner must later touch without leaking private or unstable execution data:

- GitHub Actions workflow commands support annotations and job summaries; job summaries are Markdown written to `GITHUB_STEP_SUMMARY`, are grouped on the workflow run summary page, and GitHub warns that sensitive data in summaries may require deleting the workflow run to remove it.
- GitHub Actions masking must be registered before a value is printed to logs or used in later workflow commands.
- Node.js documents `process.exitCode` as the safer graceful-exit mechanism; direct `process.exit()` can truncate asynchronous stdout writes.
- JSON Schema 2020-12 formalized recommended output formats and annotation behavior, which makes a stable validation envelope preferable to raw validator-specific messages.
- SLSA provenance models outputs as `subject` artifacts with digests, and separates external parameters, internal parameters, resolved dependencies, byproducts, and builder identity. SLSA v1.2 is current; v1.1 contains the detailed build-provenance field model still referenced by the v1 predicate path.
- 2026 GitHub Actions research reports that larger and more complex workflows are associated with higher reliability and maintenance risk, and agentic workflows introduce prompt-to-agent and prompt-to-script injection surfaces when untrusted event context crosses boundaries.

Sources checked:

- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- https://nodejs.org/api/process.html#processexitcode
- https://json-schema.org/draft/2020-12/json-schema-core
- https://slsa.dev/spec/v1.2/provenance
- https://slsa.dev/spec/v1.1/provenance
- https://arxiv.org/abs/2605.07135
- https://arxiv.org/abs/2605.26825

## Understanding change

The dry-run result envelope should not try to mimic the final manifest, provenance, or CI run. It should be a deterministic contract seed.

Previous framing: dry-run output proves the runner can start and produce a result.

Updated framing: dry-run output proves the public replay-result contract can exist before execution, custody, summaries, and annotations are implemented.

That means the first `result.json` must avoid:

- wall-clock timestamps;
- host names;
- absolute paths;
- environment variables;
- raw exception text;
- unsafe fixture payloads;
- CI run IDs;
- GitHub-specific URLs;
- tool-specific validator dumps;
- non-deterministic ordering.

The envelope should preserve places for future custody without pretending custody already exists.

## Field contract

The dry-run `result.json` envelope should contain only these required top-level fields:

1. `schema_version`
   - Constant string.
   - Value: `governance.artifact-manifest-helper.replay.result.v1`.
   - Purpose: stable ingestion key.

2. `runner_id`
   - Constant string.
   - Value: `governance-artifact-manifest-helper-fixtures`.
   - Purpose: identifies the replay family without depending on file paths.

3. `mode`
   - Enum.
   - Dry-run value: `dry-run`.
   - Future values may include `execute` and `ci` only by append-only schema evolution.

4. `contract_phase`
   - Enum.
   - Dry-run value: `skeleton`.
   - Purpose: makes it explicit that custody and concrete fixture execution are not yet claimed.

5. `process_outcome`
   - Enum.
   - Values: `success`, `failure`.
   - Dry-run success means the skeleton produced a valid envelope, not that domain replay passed.

6. `replay_state`
   - Enum aligned to normalized checks.
   - Dry-run value: `not_executed`.
   - Purpose: separates process success from domain execution state.

7. `exit_behavior`
   - Object with deterministic exit intent:
     - `default_exit_code`: number, normally `0` for non-sentinel dry run.
     - `sentinel_exit_code`: number, normally `1` when an explicit sentinel mode is requested.
     - `uses_process_exit_code`: boolean, true.
   - Purpose: records exit policy without needing to run CI.

8. `inputs`
   - Object containing only symbolic input metadata:
     - `descriptor_set_id`: constant string for the fixture descriptor group.
     - `descriptor_count`: integer.
     - `descriptor_order`: array of descriptor IDs in stable sorted order.
   - Must not contain raw descriptor payloads if they may synthesize unsafe cases.

9. `artifacts`
   - Object with declared outputs, not digests yet:
     - `result_json`: relative path.
     - `summary_md`: relative path.
     - `manifest_json`: null in dry-run skeleton unless actually generated.
   - Purpose: reserves stable names for dashboard and custody handoff.

10. `checks`
   - Array of normalized check objects using `governance.replay.check.v1`.
   - Dry-run minimum:
     - `runner.skeleton.loaded` notice/pass;
     - `runner.descriptors.discovered` notice/pass;
     - `runner.execution.skipped` notice/not_executed;
     - optional sentinel check if sentinel mode is enabled.
   - Messages must be public-safe and deterministic.

11. `summary`
   - Object containing public-safe counts:
     - `total_checks`;
     - `passed_checks`;
     - `warning_checks`;
     - `error_checks`;
     - `fatal_checks`.
   - Purpose: dashboard ingestion without parsing messages.

12. `custody`
   - Object with explicit absence markers:
     - `manifest_generated`: false;
     - `artifact_digests_generated`: false;
     - `provenance_claimed`: false.
   - Purpose: prevents dry-run artifacts from being mistaken for custody evidence.

13. `public_safety`
   - Object:
     - `raw_payloads_committed`: false;
     - `unsafe_examples_materialized`: false;
     - `redaction_required`: false for normal dry run, true only when blocked data was encountered and removed.
   - Purpose: public-safe invariant visible to future dashboards.

## Determinism requirements

The runner must serialize JSON using a stable key order. Arrays must be sorted by descriptor ID or check code, never by filesystem traversal order unless traversal is normalized. All paths must be repository-relative POSIX-style paths. Missing optional future data must be represented by `null` or explicit false booleans only where the schema requires the field.

No timestamp should appear in the dry-run result. The surrounding file path and commit history already provide chronology. If later CI mode needs invocation identity, it should be added under a separate `execution_context` object and omitted from dry-run mode.

## Public-safety requirements

The dry-run envelope is allowed to name symbolic descriptor IDs, check codes, categories, and states. It is not allowed to include synthesized unsafe payloads, raw invalid paths, raw exception stacks, environment dumps, usernames, home directories, token-like strings, or full GitHub run URLs.

If a future runner encounters unsafe data, it should emit a normalized check with a stable code and a public-safe message, then store only a symbolic reason category.

## Implementation requirement

When `tools/replay-governance-artifact-manifest-helper-fixtures.mjs` is first created, it should implement the dry-run envelope before concrete fixture execution. The minimum implementation path should be:

1. Load descriptor files by stable path list.
2. Validate only descriptor metadata required for ordering.
3. Build normalized checks through `tools/lib/governance-replay-checks.mjs`.
4. Write `result.json` with the field contract above.
5. Write `summary.md` from the same check stream.
6. Set `process.exitCode`, never call `process.exit()` for normal control flow.
7. Defer `manifest.json` until byte-level artifact custody is actually implemented.

## Acceptance criteria

A dry-run skeleton is acceptable when:

- two identical local runs produce byte-identical `result.json` and `summary.md`;
- default mode exits with code `0` after writing outputs;
- sentinel mode writes the same valid envelope shape but exits with the configured non-zero sentinel code;
- no absolute paths, wall-clock timestamps, environment values, or raw unsafe payloads appear in outputs;
- all checks conform to the normalized check schema;
- `custody.provenance_claimed` remains false until manifest custody and digests are implemented.

## Design rule

A replay result is not a log. It is a public-safe event envelope. Logs describe what happened to the runner; the envelope describes what can be safely ingested by future governance surfaces.

## Next research question

How should MC implement the dry-run skeleton writer so stable JSON serialization, stable Markdown rendering, descriptor ordering, and default-vs-sentinel exit behavior are proven with byte-identical fixtures before any temp-only unsafe synthesis is added?
