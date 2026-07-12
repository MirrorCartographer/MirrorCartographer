import assert from 'node:assert/strict';
import test from 'node:test';
import { appendRunLedgerEntry, buildRunLedgerEntry, digestRunLedgerEntry, validateRunLedger } from './run-ledger.mjs';

const digest = 'a'.repeat(64);
const commit = 'b'.repeat(40);
const empty = { schema_version: '1.0.0', artifact_type: 'continuity_run_ledger', entries: [] };

function input(overrides = {}) {
  return {
    recordedAt: '2026-07-12T06:39:00.000Z',
    owner: 'continuity_mining',
    queueItemId: 'M-016',
    teamStartDigestSha256: digest,
    implementationCommits: [commit],
    verificationEvidence: ['operations/evidence/example.json'],
    peerTriggerAttempts: [{ peer_owner: 'frontier_research', method: 'automation_reschedule', outcome: 'attempted', evidence: 'automation update succeeded' }],
    ...overrides
  };
}

test('appends a valid genesis entry and validates the ledger', () => {
  const result = appendRunLedgerEntry(empty, input());
  assert.equal(result.accepted, true);
  assert.equal(result.entry.sequence, 0);
  assert.equal(result.entry.previous_entry_digest_sha256, null);
  assert.deepEqual(validateRunLedger(result.ledger), { valid: true, errors: [] });
});

test('appends a second entry linked to the first digest', () => {
  const first = appendRunLedgerEntry(empty, input()).ledger;
  const second = appendRunLedgerEntry(first, input({ queueItemId: 'M-017', implementationCommits: ['c'.repeat(40)] }));
  assert.equal(second.accepted, true);
  assert.equal(second.entry.previous_entry_digest_sha256, first.entries[0].entry_digest_sha256);
});

test('rejects retroactive mutation of a prior entry', () => {
  const ledger = appendRunLedgerEntry(empty, input()).ledger;
  ledger.entries[0].queue_item_id = 'M-TAMPERED';
  const validation = validateRunLedger(ledger);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((error) => error.code === 'RLE-010'));
});

test('rejects a broken previous-entry link', () => {
  const first = appendRunLedgerEntry(empty, input()).ledger;
  const second = appendRunLedgerEntry(first, input({ queueItemId: 'M-017', implementationCommits: ['c'.repeat(40)] })).ledger;
  second.entries[1].previous_entry_digest_sha256 = 'd'.repeat(64);
  second.entries[1].entry_digest_sha256 = digestRunLedgerEntry(second.entries[1]);
  const validation = validateRunLedger(second);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((error) => error.code === 'RLE-009'));
});

test('refuses append when the existing ledger is invalid', () => {
  const invalid = { ...empty, artifact_type: 'wrong' };
  const result = appendRunLedgerEntry(invalid, input());
  assert.equal(result.accepted, false);
  assert.ok(result.errors.some((error) => error.code === 'RLL-002'));
});

test('digest is deterministic across object key ordering', () => {
  const first = buildRunLedgerEntry({ sequence: 0, previousEntryDigestSha256: null, ...input() });
  const reordered = {
    entry_digest_sha256: first.entry_digest_sha256,
    previous_entry_digest_sha256: first.previous_entry_digest_sha256,
    peer_trigger_attempts: first.peer_trigger_attempts,
    verification_evidence: first.verification_evidence,
    implementation_commits: first.implementation_commits,
    team_start_digest_sha256: first.team_start_digest_sha256,
    queue_item_id: first.queue_item_id,
    owner: first.owner,
    recorded_at: first.recorded_at,
    sequence: first.sequence
  };
  assert.equal(digestRunLedgerEntry(first), digestRunLedgerEntry(reordered));
});
