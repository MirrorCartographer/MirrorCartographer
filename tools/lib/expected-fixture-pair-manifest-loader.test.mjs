import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH,
  loadExpectedFixturePairManifest,
  isRepositoryRelativePath,
} from './expected-fixture-pair-manifest-loader.mjs';

const SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://mirrorcartographer.dev/schemas/governance.expected-fixture-pair-manifest.v1.schema.json',
  type: 'object',
  additionalProperties: false,
  required: [
    'schema_version',
    'manifest_id',
    'generated_root',
    'expected_root',
    'comparison_policy',
    'checks',
    'pairs',
  ],
  properties: {
    schema_version: { const: 'governance.expected-fixture-pairs.v1' },
    manifest_id: { type: 'string' },
    generated_root: { type: 'string' },
    expected_root: { type: 'string' },
    comparison_policy: { type: 'object' },
    checks: { type: 'object' },
    pairs: { type: 'array', minItems: 1 },
  },
};

function validManifest(overrides = {}) {
  return {
    schema_version: 'governance.expected-fixture-pairs.v1',
    manifest_id: 'governance-expected-fixture-pairs',
    generated_root: 'artifacts/governance',
    expected_root: 'mind/fixtures/expected/governance',
    comparison_policy: {
      comparison: 'byte_sha256',
      unexpected_output_policy: 'reject',
      update_policy: 'verify_only',
      path_policy: 'repository_relative_only',
    },
    checks: {
      manifest_schema_valid: 'GHF_MANIFEST_SCHEMA_VALID',
      manifest_schema_invalid: 'GHF_MANIFEST_SCHEMA_INVALID',
      pair_matched: 'GHF_PAIR_MATCHED',
      pair_drifted: 'GHF_PAIR_DRIFTED',
      pair_generated_missing: 'GHF_PAIR_GENERATED_MISSING',
      pair_expected_missing: 'GHF_PAIR_EXPECTED_MISSING',
      unlisted_generated_output: 'GHF_UNLISTED_GENERATED_OUTPUT',
    },
    pairs: [
      {
        id: 'artifact-manifest-result-json',
        descriptor_id: 'artifact-manifest-helper-dry-run',
        artifact_kind: 'result-json',
        generated_path: 'artifacts/governance/result.json',
        expected_path: 'mind/fixtures/expected/governance/result.json',
        comparison: 'byte_sha256',
        checks: {
          matched: 'GHF_PAIR_MATCHED',
          drifted: 'GHF_PAIR_DRIFTED',
          generated_missing: 'GHF_PAIR_GENERATED_MISSING',
          expected_missing: 'GHF_PAIR_EXPECTED_MISSING',
        },
      },
    ],
    ...overrides,
  };
}

async function withRepo(files, run) {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'mc-manifest-loader-'));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const absolutePath = path.join(repoRoot, relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, content, 'utf8');
    }
    return await run(repoRoot);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
}

test('valid manifest returns digest, roots, pairs, and success check', async () => {
  const manifestText = JSON.stringify(validManifest(), null, 2);
  await withRepo(
    {
      [DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH]: JSON.stringify(SCHEMA),
      'mind/fixtures/governance.expected-fixture-pairs.v1.json': manifestText,
    },
    async (repoRoot) => {
      const result = await loadExpectedFixturePairManifest({
        repoRoot,
        manifestPath: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
      });

      assert.equal(result.state, 'passed');
      assert.match(result.manifest.manifest_sha256, /^[a-f0-9]{64}$/);
      assert.equal(result.manifest.generated_root, 'artifacts/governance');
      assert.equal(result.pairs[0].generated_path, 'artifacts/governance/result.json');
      assert.equal(result.checks[0].code, 'GHF_MANIFEST_SCHEMA_VALID');
    },
  );
});

test('loader reads only schema and manifest files', async () => {
  const reads = [];
  await withRepo(
    {
      [DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH]: JSON.stringify(SCHEMA),
      'mind/fixtures/governance.expected-fixture-pairs.v1.json': JSON.stringify(validManifest()),
    },
    async (repoRoot) => {
      const readTextFile = async (absolutePath) => {
        reads.push(path.relative(repoRoot, absolutePath).split(path.sep).join('/'));
        if (absolutePath.endsWith('result.json')) {
          throw new Error('fixture bytes must not be read by manifest loader');
        }
        return import('node:fs/promises').then(({ readFile }) => readFile(absolutePath, 'utf8'));
      };

      const result = await loadExpectedFixturePairManifest({
        repoRoot,
        manifestPath: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
        readTextFile,
      });

      assert.equal(result.state, 'passed');
      assert.deepEqual(reads.sort(), [
        DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH,
        'mind/fixtures/governance.expected-fixture-pairs.v1.json',
      ].sort());
    },
  );
});

test('schema id mismatch fails closed', async () => {
  await withRepo(
    {
      [DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH]: JSON.stringify({ ...SCHEMA, $id: 'wrong-id' }),
      'mind/fixtures/governance.expected-fixture-pairs.v1.json': JSON.stringify(validManifest()),
    },
    async (repoRoot) => {
      const result = await loadExpectedFixturePairManifest({
        repoRoot,
        manifestPath: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
      });

      assert.equal(result.state, 'failed_manifest_invalid');
      assert.equal(result.checks[0].code, 'GHF_MANIFEST_SCHEMA_INVALID');
    },
  );
});

test('malformed manifest JSON fails with public-safe diagnostic', async () => {
  await withRepo(
    {
      [DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH]: JSON.stringify(SCHEMA),
      'mind/fixtures/governance.expected-fixture-pairs.v1.json': '{ bad json',
    },
    async (repoRoot) => {
      const result = await loadExpectedFixturePairManifest({
        repoRoot,
        manifestPath: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
      });

      assert.equal(result.state, 'failed_manifest_invalid');
      assert.equal(result.errors[0].keyword, 'json');
      assert.doesNotMatch(JSON.stringify(result), /\/tmp\//);
    },
  );
});

test('schema-invalid manifest fails before fixture paths are read', async () => {
  await withRepo(
    {
      [DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH]: JSON.stringify(SCHEMA),
      'mind/fixtures/governance.expected-fixture-pairs.v1.json': JSON.stringify({ manifest_id: 'missing-required-fields' }),
    },
    async (repoRoot) => {
      const result = await loadExpectedFixturePairManifest({
        repoRoot,
        manifestPath: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
      });

      assert.equal(result.state, 'failed_manifest_invalid');
      assert.equal(result.checks[0].code, 'GHF_MANIFEST_SCHEMA_INVALID');
    },
  );
});

test('unknown GHF code fails as manifest invalid', async () => {
  const manifest = validManifest({
    checks: {
      ...validManifest().checks,
      unlisted_generated_output: 'GHF_UNKNOWN_NEW_CODE',
    },
  });

  await withRepo(
    {
      [DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH]: JSON.stringify(SCHEMA),
      'mind/fixtures/governance.expected-fixture-pairs.v1.json': JSON.stringify(manifest),
    },
    async (repoRoot) => {
      const result = await loadExpectedFixturePairManifest({
        repoRoot,
        manifestPath: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
        knownCheckCodes: ['GHF_MANIFEST_SCHEMA_VALID'],
      });

      assert.equal(result.state, 'failed_manifest_invalid');
      assert.match(result.errors[0].message, /Unknown GHF check code/);
    },
  );
});

test('escaping generated root fails', async () => {
  const manifest = validManifest({
    pairs: [{ ...validManifest().pairs[0], generated_path: 'artifacts/other/result.json' }],
  });

  await withRepo(
    {
      [DEFAULT_EXPECTED_FIXTURE_PAIR_MANIFEST_SCHEMA_PATH]: JSON.stringify(SCHEMA),
      'mind/fixtures/governance.expected-fixture-pairs.v1.json': JSON.stringify(manifest),
    },
    async (repoRoot) => {
      const result = await loadExpectedFixturePairManifest({
        repoRoot,
        manifestPath: 'mind/fixtures/governance.expected-fixture-pairs.v1.json',
      });

      assert.equal(result.state, 'failed_manifest_invalid');
    },
  );
});

test('repository-relative path guard rejects absolute, parent, tilde, backslash, drive, and double slash paths', () => {
  for (const value of ['/tmp/file', '../file', 'a/../file', '~/file', 'a\\b', 'C:/tmp/file', 'a//b']) {
    assert.equal(isRepositoryRelativePath(value), false, value);
  }
  assert.equal(isRepositoryRelativePath('mind/fixtures/example.json'), true);
});
