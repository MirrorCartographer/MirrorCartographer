# GHF Cross-Surface Contract Test Design

Date: 2026-07-05
Status: design pattern / executable-test plan
Public safety: public-safe; no private user material; no absolute local paths; no raw fixture body content.

## Architecture question

How should MC implement a small check-code contract test that loads the replay-check registry, expected-fixture pair manifest, and compare-result schema, then fails if any `GHF_*` code appears in one custody surface but not the appropriate others?

## Why this needs deeper understanding

Expected-fixture verification now has three distinct custody surfaces:

1. **Replay-check registry**: the append-only source of normalized governance check identity.
2. **Expected-fixture pair manifest**: the declaration surface that chooses which registered checks apply to each public API fixture pair.
3. **Compare-result schema**: the dashboard-ingestible result contract that restricts emitted pair-level checks to known values.

A mismatch between these surfaces creates silent drift. The verifier could emit a code that dashboards reject, a manifest could reference a code the registry cannot normalize, or the schema could allow a stale alias that is no longer canonical.

The contract test should therefore prove *cross-surface identity*, not merely prove that each individual JSON file is syntactically valid.

## Current source facts from the repository

The replay-check helper already declares the `GHF` prefix under `expectedFixture` and registers expected-fixture check codes including:

- `GHF_MANIFEST_SCHEMA_VALID`
- `GHF_MANIFEST_SCHEMA_INVALID`
- `GHF_PAIR_MATCHED`
- `GHF_PAIR_DRIFTED`
- `GHF_PAIR_GENERATED_MISSING`
- `GHF_PAIR_EXPECTED_MISSING`
- `GHF_UNLISTED_GENERATED_OUTPUT`

The minimal pair manifest references the canonical pair-level codes for match, drift, and missing-file outcomes.

The compare-result schema constrains pair result `check_code` values to canonical registry names and separately constrains `unlisted_generated_outputs[].check_code` to `GHF_UNLISTED_GENERATED_OUTPUT`.

## Research basis

Fresh references checked on 2026-07-05:

- JSON Schema 2020-12 validation defines `enum` as identity membership: an instance validates when its value equals one value in the enum array. That makes enum values appropriate for exact check-code identity, not fuzzy aliases.
- JSON Schema 2020-12 also defines `const` as equivalent to an enum with one value. That makes single-code fields such as `GHF_UNLISTED_GENERATED_OUTPUT` precise and machine-checkable.
- Node's built-in test runner is sufficient for a small executable contract test without adding a dedicated test framework.
- GitHub Actions workflow-command surfaces can emit annotations, summaries, and masking, so public-safe check text must remain normalized and never expose raw fixture contents or absolute runtime paths.
- SLSA provenance models subjects and digests, but this contract test should not claim provenance. It only guards MC custody-surface consistency.
- Recent 2026 agentic workflow-injection research reinforces the need to keep CI/agent output boundaries deterministic and not attacker-shaped by untrusted text.

## Useful concepts extracted

### 1. Registry-owned identity

The replay-check registry should remain the only canonical identity source. Other files may reference `GHF_*` codes, but they should not invent them.

Rule:

- Every `GHF_*` code in the manifest or compare-result schema must exist in `CHECK_CODES`.
- Any unknown `GHF_*` code is a contract violation.

### 2. Surface-specific expected sets

Not every registered `GHF_*` code belongs in every surface.

Recommended partitions:

- `registryGhfCodes`: all registered `CHECK_CODES` keys beginning with `GHF_`.
- `manifestOutcomeCodes`: all manifest pair fields matching `on_*_check_code`.
- `pairResultSchemaCodes`: the enum values allowed by `$defs.pairResult.properties.check_code`.
- `unlistedOutputSchemaCodes`: const values under `unlisted_generated_outputs.items.properties.check_code`.

The test should compare appropriate subsets, not force all registered `GHF_*` codes into the pair result enum.

### 3. Manifest-to-schema outcome parity

The minimal manifest currently declares pair outcome codes for:

- matched
- drifted
- missing generated
- missing expected

The compare-result schema pair enum should include every code the manifest can cause the comparator to emit for a listed pair.

Rule:

- `manifestOutcomeCodes` must be a subset of `pairResultSchemaCodes`.
- `pairResultSchemaCodes` should be a subset of `registryGhfCodes`.

### 4. Schema-only internal failure allowance

The compare-result schema currently allows `GHF_MANIFEST_SCHEMA_INVALID` for a skipped/invalid manifest pair state. That code may not appear in the pair manifest because an invalid manifest cannot be trusted to declare its own failure code.

Rule:

- Schema may include registry-owned internal failure codes that do not appear in manifest pair fields.
- These exceptions must be named in the test, not silently ignored.

Recommended explicit exception set:

- `GHF_MANIFEST_SCHEMA_INVALID`

### 5. Unlisted-output code lives outside pair results

`GHF_UNLISTED_GENERATED_OUTPUT` is not a listed pair outcome. It belongs to the `unlisted_generated_outputs` result surface.

Rule:

- `GHF_UNLISTED_GENERATED_OUTPUT` must exist in the registry.
- `GHF_UNLISTED_GENERATED_OUTPUT` must be the const for unlisted generated output records.
- It should not be required in manifest pair outcome fields.

### 6. Test output should be public-safe by construction

The test may print relative repo paths and check-code names. It must not print:

- raw fixture body content
- absolute runtime paths
- secrets
- private/personal source material

Failure messages should name the surface, the relative path, and the missing/extra code only.

## Proposed executable test

Add:

`tools/governance-validation/ghf-check-code-contract.test.mjs`

Add package script:

`"test:governance": "node --test tools/governance-validation/*.test.mjs"`

Future `verify:governance` can include this after the loader and comparator exist.

## Test algorithm

1. Import `CHECK_CODES` from `tools/lib/governance-replay-checks.mjs`.
2. Read `mind/fixtures/governance.expected-fixture-pairs.v1.json` as UTF-8 JSON.
3. Read `mind/schemas/governance.expected-fixture-compare.result.v1.schema.json` as UTF-8 JSON.
4. Extract `registryGhfCodes` from `Object.keys(CHECK_CODES).filter(code => code.startsWith('GHF_'))`.
5. Extract `manifestOutcomeCodes` from every pair key matching `/^on_.*_check_code$/`.
6. Extract `pairResultSchemaCodes` from:
   - `$defs.pairResult.properties.check_code.enum`
7. Extract `unlistedOutputCode` from:
   - `properties.unlisted_generated_outputs.items.properties.check_code.const`
8. Assert:
   - manifest outcome codes are all registered.
   - pair result schema codes are all registered.
   - unlisted output const is registered.
   - manifest outcome codes are all allowed by the pair result schema.
   - pair result schema codes are either manifest outcome codes or explicitly listed internal schema-only exceptions.
   - `GHF_UNLISTED_GENERATED_OUTPUT` is present in the unlisted-output const surface.
9. Sort all sets before diffing to make failures deterministic.

## Failure model

Use Node's native assertion failure output, but keep assertion messages compact and public-safe.

Recommended failure labels:

- `GHF_CONTRACT_UNKNOWN_MANIFEST_CODE`
- `GHF_CONTRACT_UNKNOWN_RESULT_SCHEMA_CODE`
- `GHF_CONTRACT_UNKNOWN_UNLISTED_OUTPUT_CODE`
- `GHF_CONTRACT_MANIFEST_CODE_NOT_RESULT_SCHEMA_ALLOWED`
- `GHF_CONTRACT_RESULT_SCHEMA_CODE_UNOWNED_BY_MANIFEST_OR_EXCEPTION`
- `GHF_CONTRACT_UNLISTED_OUTPUT_CONST_MISSING`

These labels do not need to become governance check codes yet. They are test-local diagnostic labels. If they later become dashboard-ingestible checks, they should be promoted through the append-only registry process.

## Prototype skeleton

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { CHECK_CODES } from '../lib/governance-replay-checks.mjs';

const MANIFEST_PATH = 'mind/fixtures/governance.expected-fixture-pairs.v1.json';
const COMPARE_RESULT_SCHEMA_PATH = 'mind/schemas/governance.expected-fixture-compare.result.v1.schema.json';
const SCHEMA_ONLY_PAIR_CODES = new Set(['GHF_MANIFEST_SCHEMA_INVALID']);

function sorted(values) {
  return [...values].sort();
}

function difference(left, right) {
  return sorted([...left].filter((value) => !right.has(value)));
}

function extractManifestOutcomeCodes(manifest) {
  const codes = new Set();
  for (const pair of manifest.pairs || []) {
    for (const [key, value] of Object.entries(pair)) {
      if (/^on_.*_check_code$/.test(key) && typeof value === 'string') {
        codes.add(value);
      }
    }
  }
  return codes;
}

function extractPairResultSchemaCodes(schema) {
  return new Set(schema?.$defs?.pairResult?.properties?.check_code?.enum || []);
}

function extractUnlistedOutputSchemaCode(schema) {
  return schema?.properties?.unlisted_generated_outputs?.items?.properties?.check_code?.const;
}

test('GHF check-code custody surfaces stay aligned', async () => {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  const schema = JSON.parse(await readFile(COMPARE_RESULT_SCHEMA_PATH, 'utf8'));

  const registryGhfCodes = new Set(Object.keys(CHECK_CODES).filter((code) => code.startsWith('GHF_')));
  const manifestOutcomeCodes = extractManifestOutcomeCodes(manifest);
  const pairResultSchemaCodes = extractPairResultSchemaCodes(schema);
  const unlistedOutputCode = extractUnlistedOutputSchemaCode(schema);

  assert.deepEqual(
    difference(manifestOutcomeCodes, registryGhfCodes),
    [],
    'GHF_CONTRACT_UNKNOWN_MANIFEST_CODE'
  );

  assert.deepEqual(
    difference(pairResultSchemaCodes, registryGhfCodes),
    [],
    'GHF_CONTRACT_UNKNOWN_RESULT_SCHEMA_CODE'
  );

  assert.ok(
    registryGhfCodes.has(unlistedOutputCode),
    'GHF_CONTRACT_UNKNOWN_UNLISTED_OUTPUT_CODE'
  );

  assert.deepEqual(
    difference(manifestOutcomeCodes, pairResultSchemaCodes),
    [],
    'GHF_CONTRACT_MANIFEST_CODE_NOT_RESULT_SCHEMA_ALLOWED'
  );

  const allowedPairSchemaOwners = new Set([...manifestOutcomeCodes, ...SCHEMA_ONLY_PAIR_CODES]);
  assert.deepEqual(
    difference(pairResultSchemaCodes, allowedPairSchemaOwners),
    [],
    'GHF_CONTRACT_RESULT_SCHEMA_CODE_UNOWNED_BY_MANIFEST_OR_EXCEPTION'
  );

  assert.equal(
    unlistedOutputCode,
    'GHF_UNLISTED_GENERATED_OUTPUT',
    'GHF_CONTRACT_UNLISTED_OUTPUT_CONST_MISSING'
  );
});
```

## Requirement update

Add this requirement to the expected-fixture verifier chain:

> Before byte-comparison implementation is considered stable, MC must include a cross-surface `GHF_*` contract test proving that the replay-check registry, expected-fixture pair manifest, and compare-result schema agree on canonical check-code identity. The test must allow only explicit schema-only exceptions and must keep all diagnostics public-safe.

## Implementation order

1. Add `tools/governance-validation/ghf-check-code-contract.test.mjs`.
2. Add `test:governance` script to `package.json`.
3. Run `npm run test:governance` locally or in CI.
4. Only after this passes, continue implementing `compare-governance-expected-fixtures.mjs` result writing.

## Changed understanding

The key design shift is that check-code consistency is not a side effect of schema validation. It is a **three-surface custody invariant**:

- registry owns identity;
- manifest declares intentional fixture outcomes;
- compare-result schema constrains emitted dashboard records.

The contract test should sit before byte comparison so code-name drift fails before any fixture body is read or hashed.

## Next research question

How should MC implement `tools/governance-validation/ghf-check-code-contract.test.mjs` and the `test:governance` script as the first executable governance validation layer, while preserving deterministic failures and avoiding promotion of test-local diagnostics into the append-only governance check registry too early?
