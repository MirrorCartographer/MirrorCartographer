# Replay Result State Machine and Check-Code Taxonomy

Date: 2026-07-04
Status: Architecture note / implementation contract
Scope: Governance replay tooling, artifact-manifest-helper replay, future dashboard ingestion
Public-safety level: public-safe; no private user details, secrets, raw unsafe payloads, or personal examples

## Architecture question

How should MC design the replay-result envelope state machine and normalized check-code taxonomy so descriptor validation, helper execution, public-safety blocking, manifest generation, and sentinel behavior all produce stable dashboard-ingestible statuses without ad hoc error strings?

## Research basis

Current sources reviewed:

- GitHub Actions workflow commands for notices, warnings, errors, masking, and job summaries.
- JSON Schema Draft 2020-12 core model and JSON Schema output concepts.
- SLSA provenance v1.0 materials/digest model.
- RFC 9457 Problem Details shape for machine-readable errors.
- Recent GitHub Actions reliability and agentic workflow-injection research.
- Recent JSON Schema validation complexity research.

## Useful concepts extracted

### 1. Separate event state from process outcome

A replay result must not use one flat `status` field for everything. The runner has at least two different jobs:

1. Describe what happened in the governance domain.
2. Decide whether the local/CI process should fail.

Those are related, but not identical. For example, an `expected_failure` descriptor should produce a successful process outcome when the expected failure is observed. An `unsafe_blocked` descriptor should also be a successful process outcome if the unsafe material was blocked before persistence. An `unexpected_failure` should fail the process.

Required split:

- `domain_state`: what the fixture proved.
- `process_outcome`: whether the runner itself behaved correctly.
- `exit_behavior`: what the shell/CI should do.

### 2. Use finite states, not prose

Dashboard ingestion and future replay comparison require closed vocabularies. Human-readable summaries can explain the state, but the durable event must use machine-stable enums.

Recommended domain states:

- `passed`: descriptor expected a valid manifest path and received it.
- `expected_failure_observed`: descriptor expected a safe, typed failure and received it.
- `unsafe_blocked`: descriptor synthesized unsafe temp-only material and the helper blocked it before persistence.
- `schema_invalid_observed`: descriptor expected a schema-invalid replay object and the validator rejected it.
- `unexpected_failure`: runner/helper failed outside the expected state model.
- `contract_violation`: runner emitted an impossible or incomplete event.

Recommended process outcomes:

- `success`: runner behavior matched descriptor expectation.
- `failure`: runner behavior violated expectation.
- `internal_error`: runner could not complete its own responsibilities.

Recommended exit behaviors:

- `zero`: normal local/CI pass.
- `nonzero`: normal local/CI failure.
- `sentinel_nonzero`: intentional diagnostic mode used to prove failure paths without making default CI flaky.

### 3. Check codes are the stable language of governance

Ad hoc error strings are not durable. The runner should emit normalized check codes with severity, category, and optional public-safe location. Human text can change; check codes should not.

Check-code shape:

```json
{
  "code": "GHM_DESCRIPTOR_VALID",
  "severity": "info",
  "category": "descriptor.validation",
  "state": "passed",
  "public_message": "Descriptor is valid.",
  "location": {
    "path": "mind/fixtures/.../descriptor.json"
  }
}
```

Code prefix proposal:

- `GHM_` = governance artifact manifest helper.
- `GHR_` = generic governance replay.
- `GHS_` = governance schema validation.
- `GHP_` = governance public-safety boundary.
- `GHA_` = GitHub Actions emission boundary.

### 4. Public-safety blocking is a success state when expected

Unsafe fixture material should never be stored in the repository or summarized raw. Negative cases should stay symbolic in committed descriptors and become concrete only in a temp directory during replay. The durable event may record that unsafe input was synthesized and blocked, but must not include the unsafe raw value.

Allowed event fields for unsafe cases:

- symbolic fixture id
- synthetic class name
- blocked stage
- redacted reason code
- digest of the safe descriptor, not the unsafe payload

Disallowed fields:

- raw unsafe strings
- absolute temp paths containing user/system details
- secrets or tokens
- private/personal examples
- untrusted prompt text copied from GitHub events

### 5. Annotation emission should be derived from check codes

GitHub annotations should not be hand-built from raw thrown errors. They should be emitted from normalized check objects after redaction. This keeps summaries, `result.json`, annotations, and future dashboards aligned.

Mapping:

- `info` -> optional notice or summary row
- `warning` -> GitHub warning annotation
- `error` -> GitHub error annotation
- `blocked` -> warning or error depending on expectedness

### 6. Use Problem Details only as an internal pattern, not as HTTP coupling

RFC 9457 is useful because it separates stable machine fields from human-readable details. MC can borrow the pattern without pretending replay results are HTTP responses.

Recommended fields:

- `type`: stable URI-like problem/check identifier
- `title`: short stable label
- `detail`: public-safe explanation
- `instance`: replay run id or descriptor id
- `status`: omit unless an HTTP boundary exists

### 7. Avoid complex schemas for the first runner

Modern JSON Schema can become unexpectedly complex, especially with dynamic references. The first replay-result schema should use closed enums, required fields, explicit object shapes, and shallow composition. Avoid `$dynamicRef`, deep conditionals, and schema tricks until there is a proven need.

## Proposed state machine

```text
START
  -> LOAD_DESCRIPTOR
  -> VALIDATE_DESCRIPTOR
      -> descriptor_invalid_expected? -> SCHEMA_INVALID_OBSERVED
      -> descriptor_invalid_unexpected? -> CONTRACT_VIOLATION
  -> SYNTHESIZE_CASE
      -> unsafe_symbolic_case? -> TEMP_ONLY_SYNTHESIS
  -> RUN_HELPER
      -> helper_success_expected? -> PASSED
      -> helper_failure_expected? -> EXPECTED_FAILURE_OBSERVED
      -> unsafe_blocked_expected? -> UNSAFE_BLOCKED
      -> helper_failure_unexpected? -> UNEXPECTED_FAILURE
  -> BUILD_RESULT_ENVELOPE
  -> VALIDATE_RESULT_ENVELOPE
      -> invalid? -> CONTRACT_VIOLATION
  -> WRITE_PUBLIC_SAFE_OUTPUTS
      -> result.json
      -> summary.md
      -> manifest.json
  -> EMIT_ANNOTATIONS_FROM_CHECKS
  -> SET_EXIT_BEHAVIOR
```

## Required envelope fields

```json
{
  "schema_version": "governance.artifact-manifest-helper.replay.result.v1",
  "runner": "tools/replay-governance-artifact-manifest-helper-fixtures.mjs",
  "descriptor_id": "pass-minimal-file-set",
  "domain_state": "passed",
  "process_outcome": "success",
  "exit_behavior": "zero",
  "expectedness": "expected",
  "checks": [],
  "outputs": {
    "result_json": "result.json",
    "summary_md": "summary.md",
    "manifest_json": "manifest.json"
  },
  "public_safety": {
    "raw_unsafe_material_persisted": false,
    "redaction_applied": true,
    "absolute_paths_persisted": false
  }
}
```

## Initial normalized check-code taxonomy

### Descriptor validation

- `GHM_DESCRIPTOR_VALID`
- `GHM_DESCRIPTOR_SCHEMA_INVALID_EXPECTED`
- `GHM_DESCRIPTOR_SCHEMA_INVALID_UNEXPECTED`
- `GHM_DESCRIPTOR_UNKNOWN_EXPECTATION`
- `GHM_DESCRIPTOR_UNSUPPORTED_SYNTHESIS_CLASS`

### Temp-only synthesis

- `GHM_TEMP_SYNTHESIS_CREATED`
- `GHM_TEMP_SYNTHESIS_CLEANED`
- `GHM_TEMP_SYNTHESIS_FAILED`
- `GHM_TEMP_PATH_NORMALIZED`
- `GHM_TEMP_ABSOLUTE_PATH_BLOCKED`

### Helper execution

- `GHM_HELPER_MANIFEST_CREATED`
- `GHM_HELPER_EXPECTED_FAILURE_OBSERVED`
- `GHM_HELPER_UNEXPECTED_FAILURE`
- `GHM_HELPER_CONTRACT_VIOLATION`

### Public-safety boundary

- `GHP_UNSAFE_SYMBOLIC_CASE_BLOCKED`
- `GHP_RAW_UNSAFE_MATERIAL_NOT_PERSISTED`
- `GHP_REDACTION_APPLIED`
- `GHP_PUBLIC_SUMMARY_SAFE`
- `GHP_PUBLIC_SAFETY_CONTRACT_VIOLATION`

### Schema/result validation

- `GHS_RESULT_ENVELOPE_VALID`
- `GHS_RESULT_ENVELOPE_INVALID_EXPECTED`
- `GHS_RESULT_ENVELOPE_INVALID_UNEXPECTED`
- `GHS_MANIFEST_SCHEMA_VALID`
- `GHS_MANIFEST_SCHEMA_INVALID`

### GitHub Actions emission

- `GHA_ANNOTATION_EMITTED`
- `GHA_SUMMARY_WRITTEN`
- `GHA_MASK_APPLIED`
- `GHA_EXIT_ZERO`
- `GHA_EXIT_NONZERO`
- `GHA_SENTINEL_EXIT_NONZERO`

## Exit behavior contract

Default mode:

- Exit `0` when all descriptors produce expected domain states.
- Exit nonzero only for unexpected failure, contract violation, or unsafe persistence.

Sentinel mode:

- Explicit flag, for example `--sentinel-failures`.
- Allows runner to intentionally exit nonzero for selected expected-failure descriptors so CI can prove the failure path in a controlled job.
- Must never be the default CI path.

## Design decisions

1. The runner should treat `unsafe_blocked` as a first-class green-path state when the descriptor expected it.
2. All public summaries should be rendered from normalized checks, not thrown errors.
3. All thrown errors must be caught and converted into `unexpected_failure` or `contract_violation` with public-safe details.
4. Result envelope validation is itself part of the replay contract.
5. Check codes are append-only once consumed by dashboards or CI summaries.
6. Human-readable check messages may be edited; check codes and state enums require a version bump or deprecation entry.

## Implementation requirements

- Add a small constants block or library for state enums and check-code definitions.
- Use the same check objects to write `result.json`, render `summary.md`, and emit GitHub annotations.
- Store only repo-relative paths.
- Hash safe persisted files, not temp-only unsafe payloads.
- Keep negative examples symbolic in committed files.
- Validate the final envelope against `governance.artifact-manifest-helper.replay.result.v1.schema.json` before writing success summaries.
- Make default exit behavior stable for CI.
- Put sentinel behavior behind an explicit flag.

## Next implementation target

Create `mind/schemas/governance.replay.check.v1.schema.json` and update `governance.artifact-manifest-helper.replay.result.v1.schema.json` to reference or embed the normalized check object. Then add one fixture for each state:

1. `passed`
2. `expected_failure_observed`
3. `unsafe_blocked`
4. `schema_invalid_observed`
5. `unexpected_failure`
6. `contract_violation`

The first executable runner should import the taxonomy instead of inventing local strings.
