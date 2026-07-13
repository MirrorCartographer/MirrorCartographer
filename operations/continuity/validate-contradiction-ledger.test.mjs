import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContradictionLedger } from './validate-contradiction-ledger.mjs';

function validLedger() {
  return {
    schema_version: '1.0.0',
    updated_at: '2026-07-13T12:37:00-04:00',
    privacy_boundary: 'Public repository state only.',
    records: [{
      id: 'CON-001',
      subject: 'Reviewed baseline versus append-only candidate state',
      state: 'resolved',
      observations: [
        { status: 'observed', statement: 'Baseline remains unchanged.', source_ref: 'file:queue@abc1234' },
        { status: 'observed', statement: 'Candidate update exists.', source_ref: 'commit:def5678' }
      ],
      resolution: {
        status: 'resolved',
        interpretation: 'The sources represent separate state layers.',
        preservation_rule: 'Preserve both until reviewed compaction.'
      },
      sources: [
        { path: 'operations/ACTIVE_QUEUE.json', ref: 'abc1234', evidence_strength: 'direct' },
        { path: 'operations/queue-updates/M-002.json', ref: 'def5678', evidence_strength: 'strong' }
      ],
      claim_ceiling: 'Repository-state reconciliation only.',
      review_route: 'Review all candidate updates before compaction.'
    }]
  };
}

test('accepts a ledger with independently referenced observations and a preservation rule', () => {
  assert.deepEqual(validateContradictionLedger(validLedger()), { valid: true, record_count: 1 });
});

test('rejects fewer than two observations', () => {
  const ledger = validLedger();
  ledger.records[0].observations.pop();
  assert.throws(() => validateContradictionLedger(ledger), /at least two entries/);
});

test('rejects duplicate observation references', () => {
  const ledger = validLedger();
  ledger.records[0].observations[1].source_ref = ledger.records[0].observations[0].source_ref;
  assert.throws(() => validateContradictionLedger(ledger), /two distinct observation sources/);
});

test('rejects a missing preservation rule', () => {
  const ledger = validLedger();
  ledger.records[0].resolution.preservation_rule = '';
  assert.throws(() => validateContradictionLedger(ledger), /preservation_rule/);
});

test('rejects duplicate source identities', () => {
  const ledger = validLedger();
  ledger.records[0].sources[1] = { ...ledger.records[0].sources[0] };
  assert.throws(() => validateContradictionLedger(ledger), /two distinct sources/);
});
