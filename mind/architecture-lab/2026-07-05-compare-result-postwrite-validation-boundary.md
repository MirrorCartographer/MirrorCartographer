# Compare Result Postwrite Validation Boundary

## Architecture question

How should MC validate the compare-result JSON after writing it, given that the compare-result schema references `governance.replay.check.v1.schema.json`, without forcing the first byte verifier to import Ajv or reimplement full schema resolution?

## Research answer

Use a separate postwrite validation boundary.

The byte verifier should write deterministic result JSON and Markdown summary, then hand the result path to a governance validation entry point. The validator owns schema compilation, schema reference resolution, and validation diagnostics. The verifier owns byte comparison only.

This keeps three responsibilities separate:

1. **Byte custody** — compare validated manifest pairs, compute SHA-256 digests, detect drift, missing files, and unlisted generated outputs.
2. **Schema custody** — validate emitted result JSON against `governance.expected-fixture-compare.result.v1.schema.json` and its referenced replay-check schema.
3. **Emission custody** — convert validation/check outcomes into public-safe Markdown and GitHub Actions annotations without leaking absolute paths, fixture bodies, secrets, or private/personal material.

## Useful concepts extracted

### Validator as a toolchain boundary, not a verifier dependency

Ajv documentation recommends managing schemas so compilation happens once and validation functions are reused. It also describes standalone validation code as useful for short-lived environments and strict execution environments. MC should adopt that shape: a dedicated governance validator module or script can own Ajv and compiled schemas, while the first byte verifier remains a deterministic writer.

Practical rule:

- `compare-governance-expected-fixtures.mjs` may call a validator entry point after writing the result file.
- It should not directly instantiate Ajv.
- It should not know schema-reference wiring beyond the declared result schema path.
- It should treat validation failure as a generated `GHF_*`/schema check outcome, not as an uncaught tool crash.

### Local schema bundle before remote schema resolution

The compare-result schema references `https://mirrorcartographer.dev/schemas/governance.replay.check.v1.schema.json`. JSON Schema allows implementation-specific base URI and reference behavior, and unknown or misinterpreted reference targets have security implications. MC should therefore resolve this URI from a local allowlisted schema bundle, not from the network.

Minimum bundle:

- `https://mirrorcartographer.dev/schemas/governance.expected-fixture-compare.result.v1.schema.json` -> `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json`
- `https://mirrorcartographer.dev/schemas/governance.replay.check.v1.schema.json` -> `mind/schemas/governance.replay.check.v1.schema.json`

No network fetch should be used for this validation path.

### Postwrite validation must be fail-closed but public-safe

If validation fails, MC should preserve the result JSON for debugging only if it is already public-safe by construction. The user-facing summary should report:

- result path,
- schema path,
- validation state,
- count of validation errors,
- public-safe JSON pointers when available,
- no raw fixture bytes,
- no absolute local paths,
- no secret values.

GitHub Actions summaries support per-step Markdown summaries, but summary output remains a public output surface for the repository. GitHub masking should be registered before any potentially sensitive value could be printed, and the MC result writer should avoid generating such values in the first place.

### Avoid shell mediation for validator execution

If the verifier shells out to a validation script later, it should use Node process APIs with argument arrays and no shell interpolation. Node documentation warns that passing unsanitized input through shell-enabled child-process APIs can trigger arbitrary command execution. MC can avoid that class by using direct module imports where possible, or `spawn('node', ['tools/governance-validation/validate-compare-result.mjs', resultPath], { shell: false })` if process separation is required.

## Design decision

Create a `validate-written-result` stage after byte comparison, not inside byte comparison.

Recommended next implementation shape:

- `tools/governance-validation/validate-compare-result.mjs`
  - imports Ajv/Ajv2020 only here,
  - loads the two local schemas,
  - registers schemas by `$id`,
  - validates a provided repository-relative result JSON path,
  - emits a normalized public-safe validation report.

- `compare-governance-expected-fixtures.mjs`
  - writes deterministic result JSON,
  - writes deterministic Markdown summary,
  - optionally invokes or imports the validator boundary,
  - maps validator failure to `failed_internal_error` or a future explicit schema-validation result state only after the schema contract is updated.

- `test:governance`
  - should run the GHF symbol sentinel first,
  - then run postwrite validation tests using tiny synthetic result JSON fixtures,
  - must not read expected/generated fixture bytes.

## Requirements update

1. The byte verifier must not import Ajv in its first implementation.
2. Result schema validation must be owned by `tools/governance-validation`, not by the byte verifier.
3. Schema references must resolve from an explicit local allowlist keyed by `$id`.
4. Validation diagnostics must use repository-relative paths and JSON Pointers only.
5. No validation path may fetch schemas over the network.
6. No validation path may print raw result JSON, raw fixture bodies, absolute runtime paths, secrets, or private/personal material.
7. Any child-process invocation must pass arguments as an array and avoid shell interpolation.

## Why this changes understanding

Before this note, the next step looked like a choice between weakening validation or adding Ajv directly into the byte verifier. The better boundary is a third custody layer: the verifier writes; the validator validates; the emitter summarizes. This preserves the byte verifier's narrow contract while still making schema validity provable before dashboard ingestion.

## Next research question

How should MC define the minimal `validate-compare-result.mjs` interface and synthetic validation fixtures so the validator proves local `$id` reference resolution, public-safe diagnostics, and fail-closed behavior without touching expected/generated fixture bytes?

## Source anchors

- Ajv schema management and standalone validation guidance: https://ajv.js.org/guide/managing-schemas.html
- JSON Schema 2020-12 core reference/base URI behavior: https://json-schema.org/draft/2020-12/json-schema-core
- GitHub Actions workflow command, masking, and job-summary behavior: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- Node child process shell-warning guidance: https://nodejs.org/api/child_process.html
- Agentic workflow-injection risk context: https://arxiv.org/abs/2605.07135
