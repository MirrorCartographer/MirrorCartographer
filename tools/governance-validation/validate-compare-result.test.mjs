import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  validateCompareResult,
  COMPARE_RESULT_SCHEMA_ID,
  REPLAY_CHECK_SCHEMA_ID,
} from './validate-compare-result.mjs';

const REPO_ROOT = process.cwd();

function baseResult(overrides = {}) {
  return {
    schema_version: 'governance.expected-fixture-compare.result.v1',
    result_id: 'synthetic-pass',
    generated_at_utc: '2026-07-05T12:00:00.000Z',
    tool: {
      name: 'compare-governance-expected-fixtures',
      version: '0.1.0',
      mode: 'verify',
    },
    manifest: {
      schema_version: 'governance.expected-fixture-pairs.v1',
      manifest_id: 'synthetic-manifest',
      path: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
      generated_root: 'artifacts/governance/generated',
      expected_root: 'mind/fixtures/governance/expected',
      manifest_sha256: 'a'.repeat(64),
    },
    comparison_policy: {
      comparison: 'byte_sha256',
      unexpected_output_policy: 'reject',
      update_policy: 'verify_only',
      path_policy: 'repository_relative_only',
      provenance_boundary: 'comparison_result_not_slsa_provenance',
    },
    result_state: 'passed',
    summary: {
      pair_count: 1,
      matched_count: 1,
      drift_count: 0,
      missing_generated_count: 0,
      missing_expected_count: 0,
      unlisted_generated_output_count: 0,
      error_count: 0,
    },
    pairs: [
      {
        id: 'synthetic-pair',
        artifact_kind: 'result-json',
        generated_path: 'artifacts/governance/generated/synthetic.json',
        expected_path: 'mind/fixtures/governance/expected/synthetic.json',
        comparison: 'byte_sha256',
        state: 'matched',
        check_code: 'GHF_PAIR_MATCHED',
        generated: {
          sha256: 'b'.repeat(64),
          size_bytes: 12,
        },
        expected: {
          sha256: 'b'.repeat(64),
          size_bytes: 12,
        },
      },
    ],
    checks: [
      {
        schema: 'governance.replay.check.v1',
        code: 'GHF_PAIR_MATCHED',
        severity: 'info',
        category: 'expected_fixture.compare',
        state: 'passed',
        expectedness: 'expected',
        publicMessage: 'Synthetic pair matched expected bytes.',
      },
    ],
    public_safety: {
      absolute_paths_allowed: false,
      raw_fixture_body_allowed: false,
      secret_values_allowed: false,
      private_personal_material_allowed: false,
      notes: 'Synthetic public-safe validation fixture.',
    },
    ...overrides,
  };
}

async function writeRepoRelativeResult(name, document) {
  const dir = path.join(REPO_ROOT, 'artifacts', 'governance', 'synthetic-validation');
  await mkdir(dir, { recursive: true });
  const relativePath = path.posix.join('artifacts/governance/synthetic-validation', name);
  await writeFile(path.join(REPO_ROOT, relativePath), `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  return relativePath;
}

test('validates a minimal synthetic compare-result document', async () => {
  const resultPath = await writeRepoRelativeResult('valid-minimal-pass.json', baseResult());

  const report = await validateCompareResult({ repoRoot: REPO_ROOT, resultPath });

  assert.equal(report.schema, 'governance.compare-result-validation.report.v1');
  assert.equal(report.state, 'passed');
  assert.equal(report.schema_id, COMPARE_RESULT_SCHEMA_ID);
  assert.equal(report.result_path, resultPath);
  assert.equal(report.error_count, 0);
});

test('fails closed when a required top-level property is missing', async () => {
  const invalid = baseResult();
  delete invalid.public_safety;
  const resultPath = await writeRepoRelativeResult('missing-required-field.json', invalid);

  const report = await validateCompareResult({ repoRoot: REPO_ROOT, resultPath });

  assert.equal(report.state, 'failed_schema_validation');
  assert.ok(report.error_count > 0);
  assert.ok(report.errors.some((error) => error.keyword === 'required'));
});

test('uses the referenced replay-check schema for nested check validation', async () => {
  const invalid = baseResult({
    checks: [
      {
        schema: 'not-governance.replay.check.v1',
        code: 'NOT_A_GHF_CODE',
        severity: 'info',
        category: 'expected_fixture.compare',
        state: 'passed',
        publicMessage: 'Synthetic invalid check.',
      },
    ],
  });
  const resultPath = await writeRepoRelativeResult('bad-referenced-check.json', invalid);

  const report = await validateCompareResult({ repoRoot: REPO_ROOT, resultPath });

  assert.equal(report.state, 'failed_schema_validation');
  assert.ok(report.error_count > 0);
  assert.ok(report.errors.some((error) => error.schemaPath.includes('governance.replay.check')));
});

test('rejects absolute paths without leaking the absolute path in diagnostics', async () => {
  const invalid = baseResult({
    pairs: [
      {
        ...baseResult().pairs[0],
        generated_path: '/tmp/private/path/synthetic.json',
      },
    ],
  });
  const resultPath = await writeRepoRelativeResult('absolute-path-leak.json', invalid);

  const report = await validateCompareResult({ repoRoot: REPO_ROOT, resultPath });

  assert.equal(report.state, 'failed_schema_validation');
  assert.ok(report.error_count > 0);
  assert.equal(report.result_path, resultPath);
  assert.doesNotMatch(JSON.stringify(report), /\/tmp\/private\/path/);
});

test('fails closed when a schema bundle entry is not repository-relative', async () => {
  const resultPath = await writeRepoRelativeResult('schema-bundle-path-invalid.json', baseResult());

  const report = await validateCompareResult({
    repoRoot: REPO_ROOT,
    resultPath,
    schemaBundle: {
      [COMPARE_RESULT_SCHEMA_ID]: '/tmp/not-allowed/schema.json',
      [REPLAY_CHECK_SCHEMA_ID]: 'mind/schemas/governance.replay.check.v1.schema.json',
    },
  });

  assert.equal(report.state, 'failed_schema_load');
  assert.ok(report.error_count > 0);
  assert.doesNotMatch(JSON.stringify(report), /\/tmp\/not-allowed/);
});

test('rejects non-repository-relative resultPath before reading JSON', async () => {
  const externalPath = path.join(os.tmpdir(), 'mc-compare-result.json');
  await writeFile(externalPath, `${JSON.stringify(baseResult(), null, 2)}\n`, 'utf8');

  const report = await validateCompareResult({ repoRoot: REPO_ROOT, resultPath: externalPath });

  assert.equal(report.state, 'failed_internal_error');
  assert.ok(report.error_count > 0);
  assert.doesNotMatch(JSON.stringify(report), new RegExp(os.tmpdir().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
