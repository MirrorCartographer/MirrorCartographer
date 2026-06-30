# Python end-to-end fixture validation command

Date: 2026-06-30
Status: implementation contract / prototype plan
Public safety: no private user material; fixtures remain abstract agency-validation cases.

## Architecture question

How should MC implement the first Python end-to-end fixture validation command that loads the three seed fixtures, validates them, serializes errors, and writes byte-stable raw captures for the paired convergence report?

## Current repo basis

MC already has three needed primitives:

1. `python_path_authority.py` rejects unsafe repo-relative path inputs before schema loading or validation.
2. `python_schema_registry.py` loads local JSON schemas from `mind/schemas`, requires each schema to declare a string `$id`, rejects duplicate `$id` values, and builds a Python `referencing.Registry` without network retrieval.
3. `python_raw_error_serializer.py` serializes `jsonschema.ValidationError` objects into `raw-validator-error-capture.v1` evidence envelopes using stable pointers, bounded summaries, structural sorting, and debug-only message policy.

The expected-output pack already defines the first three fixtures and the CI target: compare canonical repair categories, not raw messages, raw error ordering, or validator-specific keyword paths.

## Research basis

Current `python-jsonschema` documentation exposes `ValidationError` structural fields including `validator`, `validator_value`, `path`, `absolute_path`, `schema_path`, `absolute_schema_path`, `json_path`, `context`, `cause`, and `parent`. It also warns that `best_match` is heuristic and can change across versions, so it must not define CI truth.

`python-jsonschema` now uses the `referencing` library for JSON Schema reference resolution. The docs show `Registry().with_resource(...)` / `Registry().with_resources(...)` as the replacement path for older resolver storage. They also explicitly warn about the security implications of configured retrieval and describe network retrieval as something schema authors opt into, not something MC should enable by default.

Format validation must remain an explicit policy. `jsonschema.FormatChecker` is optional; some format checks require extra dependencies, unknown formats return true, and missing checker dependencies can make validation succeed. Therefore the first Python command should default to `format_assertion = disabled` and only report policy-dependent fixtures as review items unless a shared strict policy is pinned.

Python JSON output can be made byte-stable with explicit `sort_keys`, `indent`, `ensure_ascii`, and separators. MC should use one local writer helper for all JSON artifacts instead of letting every module choose its own formatting.

Recent JSON Schema research continues to show that modern JSON Schema has complex keyword interactions and that validators can differ in behavior. MC should therefore treat the Python command as evidence capture and schema-shape validation, not as proof of symbolic truth.

## Design decision

Add one narrow command:

`tools/agency-validation/python_validate_fixtures.py`

The command should be executable locally and in CI without network access:

`python tools/agency-validation/python_validate_fixtures.py --expected-pack mind/fixtures/agency-near-miss/v1/expected-output-pack.seed-001-003.json --out artifacts/agency-validation/python`

It should do five jobs only:

1. Load the expected-output pack through `assert_safe_repo_relative_path`.
2. Load each fixture through `load_json_file`.
3. Resolve the target validation schema through `get_python_validator(...)` using only the local registry.
4. Run `validator.iter_errors(fixture)` and serialize errors with `build_python_raw_error_capture(...)`.
5. Write byte-stable JSON captures and a minimal Python-side run summary.

It should not assign canonical repair categories yet. That remains the paired adapter / convergence layer so raw Python evidence and canonical MC repair receipts stay separated.

## Required output layout

For the first command, write only Python-side artifacts:

```text
artifacts/agency-validation/python/
  run-summary.python.json
  raw-captures/
    seed-001-valid-choice-preserving-caution.python.raw-validator-error-capture.v1.json
    seed-002-broken-missing-evidence.python.raw-validator-error-capture.v1.json
    seed-003-divergent-format-boundary.python.raw-validator-error-capture.v1.json
```

The summary should include:

- `schema_version`: `python-fixture-validation-run.v1`
- `runner`: command name, Python version, jsonschema version
- `validation_policy`: format assertion disabled, all errors collected, messages debug-only
- `expected_pack_path`
- `fixture_count`
- `captures`: fixture path, fixture id, expected validity, raw capture path, raw validity, error count
- `guardrails`: no network retrieval configured; raw messages are not CI invariants; symbolic truth is not scored

## Fixture ID rule

The first implementation should derive fixture IDs from filenames by removing `.json`:

- `seed-001-valid-choice-preserving-caution`
- `seed-002-broken-missing-evidence`
- `seed-003-divergent-format-boundary`

This keeps IDs public-safe and stable while avoiding embedded personal text.

## Schema selection rule

The first implementation should not infer schema IDs from the fixture body unless the fixture already carries an explicit public schema reference. Use a constant command default:

`https://mirrorcartographer.dev/schemas/agency-near-miss.v1.schema.json`

If that schema does not exist yet, the command must fail with a clear `Schema not registered` error instead of falling back to an arbitrary schema.

Reason: fallback validation creates false evidence. A failed end-to-end command is better than a command that validates against the wrong contract.

## Byte-stability requirements

Add a single helper:

`write_stable_json(path: Path, value: Any) -> None`

Use:

- UTF-8
- `sort_keys=True`
- `indent=2`
- `ensure_ascii=False`
- final newline
- deterministic capture paths sorted by fixture path

Do not include wall-clock timestamps in raw captures or summaries. Timestamps make repeated local runs noisy. If CI needs timing later, place it in a separate non-invariant artifact.

## Safety and trust-boundary requirements

The command must reject before validation:

- absolute paths
- URL-shaped paths
- Windows drive paths
- paths with backslashes
- paths with NUL bytes
- `../` repo escapes
- non-JSON expected pack paths

The command must not configure a `Registry(retrieve=...)` callback. The registry is an in-memory local schema map only.

The command must not fetch schemas, fixtures, or expected outputs from the network.

The command must not place full fixture bodies or full schemas in the run summary. Raw capture content hashes and bounded error summaries are enough.

## First test plan

Add:

`tools/agency-validation/python_validate_fixtures.test.py`

Minimum tests:

1. Unsafe expected-pack paths are rejected before reading.
2. Output paths are deterministic and repo-relative display paths are stable.
3. Running the command twice over copied temp output directories produces identical JSON bytes.
4. `run-summary.python.json` validates its own structural assumptions.
5. Each raw capture validates against `raw-validator-error-capture.v1.schema.json` using the local Python registry.
6. No network retrieval path is configured; unknown `$ref` should fail rather than fetch.

## Implementation sketch

Main functions:

- `fixture_id_from_path(path: str) -> str`
- `capture_filename_for_fixture(path: str) -> str`
- `write_stable_json(path: Path, value: Any) -> None`
- `validate_fixture(fixture_entry: dict, schema_id: str, out_dir: Path) -> dict`
- `run(expected_pack_path: str, out_dir_path: str, schema_id: str = DEFAULT_AGENCY_SCHEMA_ID) -> dict`
- `main(argv: list[str] | None = None) -> int`

Exit policy:

- `0`: command completed and wrote captures, even if fixtures are invalid as expected.
- `1`: path authority failure, schema registry failure, malformed expected pack, write failure, or serializer/schema self-validation failure.

## What this changes in understanding

The end-to-end Python command should not try to become the full paired convergence system. Its job is smaller and stronger: create deterministic Python-side evidence. The paired runner can then compare that evidence with Ajv evidence and canonical repair receipts.

This protects MC from three bad failure modes:

1. Treating validator messages as if they were stable truth.
2. Allowing network or path behavior to become invisible validation input.
3. Letting one runner command mix raw evidence, repair interpretation, and reviewer language into the same artifact.

## Next architecture question

How should MC define the first canonical repair receipt generator that maps Python raw captures and Ajv raw captures into the governed `repair-category-map.v1` categories without letting the mapper depend on raw message wording?
