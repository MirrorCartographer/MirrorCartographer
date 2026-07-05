# Ajv Compare Result Validator Executable Layer

## Architecture question

How should MC add Ajv/Ajv2020 as the smallest explicit dev dependency and implement `validate-compare-result.mjs` plus synthetic tests while keeping validator reports public-safe and separate from governance replay checks?

## Research answer

Implement the validator as a schema-custody boundary. The byte verifier writes deterministic compare facts; the validator owns Ajv/Ajv2020, local schema resolution, fail-closed validation, and public-safe diagnostic reports. This keeps schema validation out of the byte verifier and prevents dashboard ingestion from consuming unvalidated compare results.

## Useful concepts extracted

### 1. Ajv2020 must be isolated

Ajv documents draft-2020-12 as a breaking JSON Schema dialect and says draft-2020-12 cannot be mixed with previous JSON Schema versions in the same Ajv instance. MC therefore uses `Ajv2020` in one validator module rather than importing default Ajv throughout governance tooling.

Implementation consequence:

- Add `ajv` as a dev dependency.
- Import `Ajv2020` only from `tools/governance-validation/validate-compare-result.mjs`.
- Keep the byte verifier free of Ajv imports.

### 2. `$id` is local identity, not network retrieval

JSON Schema 2020-12 defines `$id` as the canonical schema URI and explicitly distinguishes identifiers from network locators. Referenced schemas should be associated with known local resources ahead of validation. MC therefore uses a local bundle:

- `https://mirrorcartographer.dev/schemas/governance.expected-fixture-compare.result.v1.schema.json` -> `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json`
- `https://mirrorcartographer.dev/schemas/governance.replay.check.v1.schema.json` -> `mind/schemas/governance.replay.check.v1.schema.json`

The validator does not fetch schemas from the network.

### 3. Validation reports are not replay checks

The validator emits `governance.compare-result-validation.report.v1`, not `governance.replay.check.v1`. Replay checks remain stable normalized custody events. The validator report is a tool-local public-safe diagnostic envelope with:

- `state`
- `schema_id`
- `result_path`
- `error_count`
- bounded `errors`

This avoids promoting transient Ajv diagnostics into the append-only check registry.

### 4. Synthetic tests prove schema custody without fixture reads

Node's native test runner is stable and already used by `test:governance`. The synthetic test layer writes tiny compare-result JSON documents under `artifacts/governance/synthetic-validation` and validates them. It does not read generated fixture bytes, expected fixture bytes, or the expected-fixture pair manifest.

Synthetic cases implemented:

1. valid minimal pass;
2. missing top-level required field;
3. invalid nested replay-check object to prove referenced schema resolution;
4. absolute path rejected without diagnostic leakage;
5. invalid schema bundle path fails closed;
6. absolute result path rejected before JSON read.

### 5. Format validation is intentionally not expanded yet

Ajv does not include format validators by default. This first layer sets `validateFormats: false` and relies on structural and pattern constraints already present in the schemas. A future hardening pass can add `ajv-formats` if MC needs strict `date-time` and `uri-reference` enforcement. That should be a separate dependency decision, not hidden inside the first validator commit.

## Durable changes added

- Updated `package.json` to add `ajv` as an explicit dev dependency.
- Added `tools/governance-validation/validate-compare-result.mjs`.
- Added `tools/governance-validation/validate-compare-result.test.mjs`.

## Requirements update

1. Compare-result validation must run after compare-result writing and before dashboard ingestion.
2. The validator must resolve schemas only from a local `$id` allowlist.
3. The validator must never read expected fixture bytes or generated fixture bytes.
4. The validator must never emit raw result bodies, raw fixture bodies, absolute runtime paths, secrets, or private/personal material.
5. Validator diagnostics remain bounded and tool-local until a future schema explicitly promotes them.
6. `ajv-formats` is not required for the first executable layer; strict format enforcement is deferred.

## What changed in understanding

The missing layer was not simply “add Ajv.” The correct architectural move is a separate schema-custody validator that proves output ingestibility while preserving the byte verifier as a deterministic writer. MC now has a four-part governance path:

1. symbol sentinel: `GHF_*` consistency;
2. manifest loader: declaration custody;
3. byte verifier: deterministic compare facts;
4. compare-result validator: schema custody before ingestion.

## Next research question

How should MC implement the byte verifier so it calls the validator as a postwrite gate, writes deterministic result JSON and Markdown summary, and fails CI when validation fails without duplicating schema validation logic?

## Source anchors

- Ajv draft-2020-12 behavior: https://ajv.js.org/json-schema.html
- JSON Schema 2020-12 `$id` and reference behavior: https://json-schema.org/draft/2020-12/json-schema-core
- Node native test runner: https://nodejs.org/api/test.html
- GitHub Actions workflow-command output safety: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- Agentic workflow-injection context: https://arxiv.org/abs/2605.07135
