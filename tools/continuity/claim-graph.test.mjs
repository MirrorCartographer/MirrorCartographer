import test from 'node:test';
import assert from 'node:assert/strict';
import {validateClaimGraph} from './claim-graph.mjs';

const record = (id, claim_state='observed', extra={}) => ({id, claim_state, contradicts:[], supersedes:[], ...extra});

test('accepts linked historical claims without overwriting', () => {
  const result = validateClaimGraph({records:[
    record('CM-A'),
    record('CM-B','observed',{contradicts:['CM-A']}),
    record('CM-C','superseded',{supersedes:['CM-A']})
  ]});
  assert.equal(result.valid, true);
});

test('rejects dangling contradiction target', () => {
  const result = validateClaimGraph({records:[record('CM-A','observed',{contradicts:['CM-Z']})]});
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-006'));
});

test('rejects self relation', () => {
  const result = validateClaimGraph({records:[record('CM-A','observed',{contradicts:['CM-A']})]});
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-005'));
});

test('requires superseded records to name prior record', () => {
  const result = validateClaimGraph({records:[record('CM-A','superseded')]});
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-007'));
});

test('rejects supersession cycles', () => {
  const result = validateClaimGraph({records:[
    record('CM-A','superseded',{supersedes:['CM-B']}),
    record('CM-B','superseded',{supersedes:['CM-A']})
  ]});
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-008'));
});

test('rejects duplicate record ids', () => {
  const result = validateClaimGraph({records:[record('CM-A'), record('CM-A')]});
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'CG-002'));
});
