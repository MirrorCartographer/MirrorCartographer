import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeContinuityDelta } from './merge-continuity-delta.mjs';

const source = { type: 'github_file', locator: 'x', content_sha: 'abc' };
const record = (id) => ({
  id,
  kind: 'decision',
  claim_state: 'observed',
  privacy: 'public_repository_safe',
  sources: [source],
  contradicts: [],
  supersedes: []
});
const base = { schema_version: '1.0.0', generated_at: 'old', records: [record('CM-0001')] };
const delta = {
  generated_at: 'new',
  base_index: { path: 'operations/continuity/continuity-index.json', content_sha: 'base-sha' },
  supersedes_artifact: { path: 'old-delta', content_sha: 'old-sha' },
  records: [record('CM-0002'), record('CM-0003')]
};

test('appends validated records in deterministic order and retains history', () => {
  const input = structuredClone(base);
  const out = mergeContinuityDelta(input, delta, 'base-sha');
  assert.deepEqual(out.appended_record_ids, ['CM-0002', 'CM-0003']);
  assert.equal(out.merged.records.length, 3);
  assert.equal(out.merged.merge_history[0].historical_artifact_retained.path, 'old-delta');
  assert.deepEqual(input, base);
});

test('rejects stale base binding', () =>
  assert.throws(() => mergeContinuityDelta(base, delta, 'wrong'), (error) => error.code === 'CONTINUITY_DELTA_INVALID'));

test('rejects duplicate record ids', () => {
  const bad = { ...delta, records: [record('CM-0001')] };
  assert.throws(
    () => mergeContinuityDelta(base, bad, 'base-sha'),
    (error) => error.validation.errors.some((entry) => entry.includes('duplicates existing'))
  );
});

test('rejects nondeterministic delta ordering', () => {
  const bad = { ...delta, records: [record('CM-0003'), record('CM-0002')] };
  assert.throws(
    () => mergeContinuityDelta(base, bad, 'base-sha'),
    (error) => error.validation.errors.includes('records are not deterministically ordered by id')
  );
});
