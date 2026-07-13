import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContinuityRelations } from './validate-continuity-relations.mjs';

const base = () => ({records:[
  {id:'CM-0001', contradicts:[], supersedes:[]},
  {id:'CM-0002', contradicts:['CM-0001'], supersedes:[]},
  {id:'CM-0003', contradicts:[], supersedes:['CM-0002']}
]});

test('accepts linked records and reports relation counts', () => {
  assert.deepEqual(validateContinuityRelations(base()), {
    schema_version:'1.0.0', record_count:3, relation_count:2,
    contradiction_edges:1, supersession_edges:1, relation_integrity:'verified',
    claim_boundary:'Structural relation integrity does not prove that any indexed claim is true.'
  });
});

test('rejects dangling relation targets', () => {
  const value = base(); value.records[0].supersedes=['CM-9999'];
  assert.throws(() => validateContinuityRelations(value), /missing record/);
});

test('rejects self-relations', () => {
  const value = base(); value.records[0].contradicts=['CM-0001'];
  assert.throws(() => validateContinuityRelations(value), /cannot contradict itself/);
});

test('rejects duplicate record ids', () => {
  const value = base(); value.records.push({id:'CM-0001'});
  assert.throws(() => validateContinuityRelations(value), /duplicate record id/);
});

test('rejects supersession cycles', () => {
  const value = base(); value.records[1].supersedes=['CM-0003'];
  assert.throws(() => validateContinuityRelations(value), /supersedes cycle/);
});
