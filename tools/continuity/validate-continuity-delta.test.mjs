import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDelta } from './validate-continuity-delta.mjs';

const base = { __content_sha: 'abc', records: [{ id: 'CM-0001' }] };
const good = {
  base_index: { content_sha: 'abc' },
  records: [{
    id: 'CM-0002',
    kind: 'decision',
    claim_state: 'observed',
    privacy: 'public_repository_safe',
    sources: [{ locator: 'operations/example.json', content_sha: 'def' }],
    contradicts: [],
    supersedes: ['CM-0001']
  }]
};

test('accepts a valid additive delta', () => assert.equal(validateDelta(base, good).valid, true));
test('rejects unsupported record kinds', () => {
  const delta = structuredClone(good);
  delta.records[0].kind = 'implementation';
  assert.match(validateDelta(base, delta).errors.join('\n'), /unsupported/);
});
test('rejects unknown supersession links', () => {
  const delta = structuredClone(good);
  delta.records[0].supersedes = ['snapshot_only_queue_selection'];
  assert.match(validateDelta(base, delta).errors.join('\n'), /unknown record/);
});
test('rejects duplicate record ids', () => {
  const delta = structuredClone(good);
  delta.records[0].id = 'CM-0001';
  assert.match(validateDelta(base, delta).errors.join('\n'), /duplicates/);
});
