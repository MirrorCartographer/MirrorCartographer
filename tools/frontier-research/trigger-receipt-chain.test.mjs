import test from 'node:test';
import assert from 'node:assert/strict';
import { appendTriggerReceipt, validateTriggerReceiptChain } from './trigger-receipt-chain.mjs';

const correlation_id = 'run-2026-07-13T0024-0400';
const intent = {
  receipt_id: 'r1',
  correlation_id,
  state: 'trigger_intent_recorded',
  previous_receipt_digest: null,
  evidence: {
    request_id: 'req-1',
    requester_team: 'frontier_research',
    target_team: 'vercel_studio',
    requested_at: '2026-07-13T00:24:20-04:00'
  }
};

function baseChain() {
  return { schema_version: '1.0.0', correlation_id, receipts: [structuredClone(intent)] };
}

function completedChain() {
  let chain = baseChain();
  chain = appendTriggerReceipt(chain, {
    receipt_id: 'r2',
    state: 'trigger_attempt_accepted',
    evidence: { control_plane: 'automation_update', acknowledgement_id: 'ack-1', accepted_at: '2026-07-13T00:25:00-04:00' }
  });
  chain = appendTriggerReceipt(chain, {
    receipt_id: 'r3',
    state: 'peer_run_observed',
    evidence: { run_id: 'peer-run-1', run_started_at: '2026-07-13T00:25:10-04:00', run_observer: 'scheduler-history' }
  });
  chain = appendTriggerReceipt(chain, {
    receipt_id: 'r4',
    state: 'peer_output_committed',
    evidence: { repository: 'MirrorCartographer/MirrorCartographer', commit_sha: 'a'.repeat(40), output_paths: ['operations/evidence/peer.json'] }
  });
  return appendTriggerReceipt(chain, {
    receipt_id: 'r5',
    state: 'peer_completion_verified',
    evidence: { verifier: 'independent-evidence-check', verified_at: '2026-07-13T00:26:00-04:00', verification_result: 'accepted', acceptance_criteria: ['artifact exists', 'tests pass'] }
  });
}

test('accepts a complete contiguous receipt chain', () => {
  const result = validateTriggerReceiptChain(completedChain());
  assert.equal(result.accepted, true);
  assert.equal(result.complete, true);
  assert.equal(result.terminal_state, 'peer_completion_verified');
  assert.equal(result.receipt_count, 5);
});

test('an accepted trigger is not classified as peer execution', () => {
  const chain = appendTriggerReceipt(baseChain(), {
    receipt_id: 'r2',
    state: 'trigger_attempt_accepted',
    evidence: { control_plane: 'automation_update', acknowledgement_id: 'ack-1', accepted_at: '2026-07-13T00:25:00-04:00' }
  });
  const result = validateTriggerReceiptChain(chain);
  assert.equal(result.complete, false);
  assert.equal(result.terminal_state, 'trigger_attempt_accepted');
});

test('rejects a jump from intent directly to committed output', () => {
  assert.throws(() => appendTriggerReceipt(baseChain(), {
    receipt_id: 'r4',
    state: 'peer_output_committed',
    evidence: { repository: 'MirrorCartographer/MirrorCartographer', commit_sha: 'a'.repeat(40), output_paths: ['artifact.json'] }
  }), /invalid transition/);
});

test('rejects a broken predecessor digest', () => {
  const chain = appendTriggerReceipt(baseChain(), {
    receipt_id: 'r2',
    state: 'trigger_attempt_accepted',
    evidence: { control_plane: 'automation_update', acknowledgement_id: 'ack-1', accepted_at: '2026-07-13T00:25:00-04:00' }
  });
  chain.receipts[1].previous_receipt_digest = '0'.repeat(64);
  assert.throws(() => validateTriggerReceiptChain(chain), /broken receipt digest link/);
});

test('rejects correlation-id substitution', () => {
  const chain = appendTriggerReceipt(baseChain(), {
    receipt_id: 'r2',
    state: 'trigger_attempt_accepted',
    evidence: { control_plane: 'automation_update', acknowledgement_id: 'ack-1', accepted_at: '2026-07-13T00:25:00-04:00' }
  });
  chain.receipts[1].correlation_id = 'different-run';
  assert.throws(() => validateTriggerReceiptChain(chain), /correlation mismatch/);
});

test('rejects completion without acceptance criteria', () => {
  const chain = completedChain();
  chain.receipts.at(-1).evidence.acceptance_criteria = [];
  assert.throws(() => validateTriggerReceiptChain(chain), /requires non-empty acceptance_criteria/);
});
