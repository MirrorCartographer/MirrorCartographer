import test from 'node:test';
import assert from 'node:assert/strict';
import { digestHandoff, validateHandoffPromotion } from './handoff-promotion-validator.mjs';

const handoff = 'Add commit and decision-history records, then model contradictions as linked records rather than overwriting earlier observations.';

function fixture() {
  return {
    schema_version: '1.0.0',
    promotion_id: 'HP-0001',
    source_item: {
      queue_id: 'M-001',
      terminal_status: 'completed',
      source_path: 'operations/ACTIVE_QUEUE.json',
      source_blob_sha: 'abb807e1a25d399f301238f6b8cc26d6be10385f',
    },
    handoff_reference: {
      kind: 'inline_text',
      value: handoff,
      content_digest: digestHandoff(handoff),
    },
    new_work: {
      queue_id: 'M-002',
      owner: 'continuity_mining',
      action: 'Add commit and decision-history records and model contradictions as linked records.',
      priority: 0,
      required_evidence: ['promotion record', 'linked contradiction records'],
    },
    authorization: {
      authorized_at: '2026-07-12T11:33:30Z',
      authorized_by: 'continuity_mining',
      authority_basis: 'owner_acceptance_record',
      acceptance_status: 'authorized',
    },
    state_links: {
      source_state: 'completed',
      promoted_state: 'queued',
      relationship: 'derived_from_handoff',
      supersedes: null,
    },
    provenance: {
      created_at: '2026-07-12T11:33:30Z',
      created_by_team: 'continuity_mining',
      record_path: 'operations/continuity/promotions/HP-0001.json',
    },
    privacy_boundary: {
      classification: 'public_repository_safe',
      excluded: ['private chat text', 'health data', 'credentials', 'personal identifiers'],
    },
  };
}

test('accepts a provenance-bound owner-authorized promotion', () => {
  const result = validateHandoffPromotion(fixture(), { expectedHandoffText: handoff, receivingOwner: 'continuity_mining' });
  assert.equal(result.valid, true);
  assert.equal(result.executable, true);
  assert.equal(result.new_queue_id, 'M-002');
});

test('rejects owner acceptance signed by a different team', () => {
  const record = fixture();
  record.authorization.authorized_by = 'frontier_research';
  assert.throws(() => validateHandoffPromotion(record, { expectedHandoffText: handoff }), /receiving owner/);
});

test('rejects a mismatched handoff digest', () => {
  const record = fixture();
  record.handoff_reference.content_digest = digestHandoff('different handoff');
  assert.throws(() => validateHandoffPromotion(record, { expectedHandoffText: handoff }), /digest mismatch/);
});

test('rejects an unauthorized record claiming active execution', () => {
  const record = fixture();
  record.authorization.acceptance_status = 'proposed';
  record.state_links.promoted_state = 'active';
  assert.throws(() => validateHandoffPromotion(record, { expectedHandoffText: handoff }), /cannot claim executable/);
});

test('rejects mutation disguised as promotion', () => {
  const record = fixture();
  record.new_work.queue_id = 'M-001';
  assert.throws(() => validateHandoffPromotion(record, { expectedHandoffText: handoff }), /new queue identity/);
});
