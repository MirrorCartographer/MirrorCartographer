import test from 'node:test';
import assert from 'node:assert/strict';
import { validateClaimGraph } from './claim-graph.mjs';

const record = (id, claim_state = 'observed', extra = {}) =>
  ({ id, claim_state, contradicts: [], supersedes: [], ...extra });

test('accepts linked historical claims without overwriting them', () => {
  const result = validateClaimGraph({ records: [
    record('CM-A', 'superseded'),
    record('CM-B', 'observed', { contradicts: ['CM-A'] }),
    record('CM-C', 'observed', { supersedes: ['CM-A'] })
  ] });
  assert.equal(result.valid, true);
});

test('retains observed historical claims even when a newer claim supersedes their current status', () => {
  const result = validateClaimGraph({ records: [
    record('CM-OLD'),
    record('CM-NEW', 'observed', { supersedes: ['CM-OLD'] })
  ] });
  assert.equal(result.valid, true);
});

test('rejects missing record collection rather than treating it as empty', () => {
  for (const input of [{}, { records: null }, { records: {} }, null]) {
    const result = validateClaimGraph(input);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.code === 'CG-000'));
  }
});

test('rejects malformed relation collections', () => {
  for (const relation of ['CM-B', null, { target: 'CM-B' }]) {
    const result = validateClaimGraph({ records: [
      record('CM-A', 'observed', { supersedes: relation }),
      record('CM-B')
    ] });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.code === 'CG-010'));
  }
});

test('rejects empty or non-string relation targets', () => {
  const result = validateClaimGraph({ records: [record('CM-A', 'observed', { contradicts: [null, ''] })] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-011'));
});

test('rejects dangling contradiction target', () => {
  const result = validateClaimGraph({ records: [record('CM-A', 'observed', { contradicts: ['CM-Z'] })] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-006'));
});

test('rejects self relation', () => {
  const result = validateClaimGraph({ records: [record('CM-A', 'observed', { contradicts: ['CM-A'] })] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-005'));
});

test('requires a superseded claim to be targeted by its successor, not to point backward', () => {
  const result = validateClaimGraph({ records: [
    record('CM-OLD', 'superseded', { supersedes: ['CM-OLDER'] }),
    record('CM-OLDER')
  ] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-007' && e.record_id === 'CM-OLD'));
});

test('rejects supersession cycles', () => {
  const result = validateClaimGraph({ records: [
    record('CM-A', 'superseded', { supersedes: ['CM-B'] }),
    record('CM-B', 'superseded', { supersedes: ['CM-A'] })
  ] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-008'));
});

test('rejects duplicate record ids', () => {
  const result = validateClaimGraph({ records: [record('CM-A'), record('CM-A')] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-002'));
});

test('rejects records that are not objects', () => {
  const result = validateClaimGraph({ records: [null] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-009'));
});
