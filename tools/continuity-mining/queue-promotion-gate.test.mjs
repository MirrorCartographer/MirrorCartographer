import test from 'node:test';
import assert from 'node:assert/strict';
import { digestHandoff } from './handoff-promotion-validator.mjs';
import { validateQueuePromotionGate } from './queue-promotion-gate.mjs';

const blob = 'abb807e1a25d399f301238f6b8cc26d6be10385f';
const handoff = 'Create the next continuity record without changing completed history.';

function record(acceptance = 'authorized') {
  return {
    schema_version: '1.0.0',
    promotion_id: 'HP-0002',
    source_item: { queue_id: 'M-001', terminal_status: 'completed', source_path: 'operations/ACTIVE_QUEUE.json', source_blob_sha: blob },
    handoff_reference: { kind: 'inline_text', value: handoff, content_digest: digestHandoff(handoff) },
    new_work: { queue_id: 'M-002', owner: 'continuity_mining', action: 'Create linked continuity records.', priority: 0, required_evidence: ['linked records'] },
    authorization: { authorized_at: '2026-07-12T11:40:00Z', authorized_by: 'continuity_mining', authority_basis: 'owner_acceptance_record', acceptance_status: acceptance },
    state_links: { source_state: 'completed', promoted_state: acceptance === 'authorized' ? 'queued' : 'proposed', relationship: 'derived_from_handoff', supersedes: null },
    provenance: { created_at: '2026-07-12T11:40:00Z', created_by_team: 'continuity_mining', record_path: 'operations/continuity/promotions/HP-0002.json' },
    privacy_boundary: { classification: 'public_repository_safe', excluded: ['nonpublic source material'] }
  };
}

function queue(successor = true) {
  const items = [{ id: 'M-001', owner: 'continuity_mining', priority: 0, action: 'Build index.', required_evidence: ['index'], status: 'completed', handoff }];
  if (successor) items.push({ id: 'M-002', owner: 'continuity_mining', priority: 0, action: 'Create linked continuity records.', required_evidence: ['linked records'], status: 'queued' });
  return { items };
}

test('accepts exact successor', () => {
  assert.equal(validateQueuePromotionGate({ queue: queue(), promotions: [record()], queueBlobSha: blob }).valid, true);
});

test('rejects missing successor', () => {
  assert.throws(() => validateQueuePromotionGate({ queue: queue(false), promotions: [record()], queueBlobSha: blob }), /missing queue item/);
});

test('rejects changed successor', () => {
  const changed = queue(); changed.items[1].action = 'Other work';
  assert.throws(() => validateQueuePromotionGate({ queue: changed, promotions: [record()], queueBlobSha: blob }), /action mismatch/);
});

test('rejects proposed executable work', () => {
  assert.throws(() => validateQueuePromotionGate({ queue: queue(), promotions: [record('proposed')], queueBlobSha: blob }), /unauthorized promotion is executable/);
});
