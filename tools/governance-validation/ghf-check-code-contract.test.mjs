// Public-safe GHF check-code contract test.
// Purpose: prove expected-fixture custody symbols stay consistent across registry, manifest, and result schema.
// Boundary: this test reads only declaration surfaces; it does not read fixture bytes, run Ajv, or create new governance check codes.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { CHECK_CODES } from '../lib/governance-replay-checks.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../..');
const GHF_CODE_PATTERN = /GHF_[A-Z0-9_]+/g;

const SURFACES = Object.freeze({
  manifest: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
  compareResultSchema: 'mind/schemas/governance.expected-fixture-compare.result.v1.schema.json'
});

async function readJson(relativePath) {
  const raw = await readFile(resolve(REPO_ROOT, relativePath), 'utf8');
  return JSON.parse(raw);
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function ghfRegistryCodes() {
  return new Set(
    Object.entries(CHECK_CODES)
      .filter(([key]) => key.startsWith('GHF_'))
      .map(([key, definition]) => {
        assert.equal(definition.code, key, `registry key/value code mismatch: ${key}`);
        return key;
      })
  );
}

function collectGhfStrings(value, output = new Set()) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(GHF_CODE_PATTERN)) output.add(match[0]);
    return output;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectGhfStrings(item, output);
    return output;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectGhfStrings(item, output);
  }
  return output;
}

function collectManifestOutcomeCodes(manifest) {
  const outcomeKeys = [
    'on_match_check_code',
    'on_drift_check_code',
    'on_missing_generated_check_code',
    'on_missing_expected_check_code'
  ];
  const codes = new Set();
  for (const pair of manifest.pairs || []) {
    for (const key of outcomeKeys) {
      if (typeof pair[key] === 'string') codes.add(pair[key]);
    }
  }
  return codes;
}

function difference(left, right) {
  return sorted([...left].filter((item) => !right.has(item)));
}

test('GHF registry definitions are internally stable', () => {
  const registry = ghfRegistryCodes();
  assert.ok(registry.size > 0, 'registry must include at least one GHF code');
  for (const code of registry) {
    assert.match(code, /^GHF_[A-Z0-9_]+$/, `invalid GHF code shape: ${code}`);
  }
});

test('expected-fixture manifest uses only registered GHF codes', async () => {
  const registry = ghfRegistryCodes();
  const manifest = await readJson(SURFACES.manifest);
  const manifestCodes = collectManifestOutcomeCodes(manifest);

  assert.ok(manifestCodes.size > 0, 'manifest must declare expected-fixture outcome codes');
  assert.deepEqual(
    difference(manifestCodes, registry),
    [],
    'manifest contains GHF codes missing from the append-only registry'
  );
});

test('compare-result schema uses only registered GHF codes', async () => {
  const registry = ghfRegistryCodes();
  const schema = await readJson(SURFACES.compareResultSchema);
  const schemaCodes = collectGhfStrings(schema);

  assert.ok(schemaCodes.size > 0, 'compare-result schema must constrain emitted GHF codes');
  assert.deepEqual(
    difference(schemaCodes, registry),
    [],
    'compare-result schema contains GHF codes missing from the append-only registry'
  );
});

test('manifest outcome codes are representable in the compare-result schema', async () => {
  const manifest = await readJson(SURFACES.manifest);
  const schema = await readJson(SURFACES.compareResultSchema);
  const manifestCodes = collectManifestOutcomeCodes(manifest);
  const schemaCodes = collectGhfStrings(schema);

  assert.deepEqual(
    difference(manifestCodes, schemaCodes),
    [],
    'manifest outcome codes must be allowed by the compare-result schema before verifier emission'
  );
});
