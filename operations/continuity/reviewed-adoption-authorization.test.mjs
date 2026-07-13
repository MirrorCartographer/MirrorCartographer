import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256Json, validateAdoptionAuthorization } from './reviewed-adoption-authorization.mjs';

const projection = { source_commit: 'a'.repeat(40), queue_items: [{ id: 'M-002', status: 'active' }] };
const context = {
  source_commit: 'a'.repeat(40),
  canonical_queue_blob_sha: 'b'.repeat(40),
  projection,
  projected_queue_item_ids: ['M-002']
};
const packet = {
  schema_version: '1.0.0', decision: 'approve', reviewer: 'continuity-reviewer',
  source_commit: context.source_commit, canonical_queue_blob_sha: context.canonical_queue_blob_sha,
  projection_sha256: sha256Json(projection), authorized_queue_items: ['M-002'],
  canonical_mutation_permitted: false, automatic_adoption_permitted: false,
  rationale: 'Projection reviewed against immutable source and queue identities.'
};

test('accepts exact, bounded review authorization without mutating canonical state', () => {
  const result = validateAdoptionAuthorization(packet, context);
  assert.equal(result.valid, true);
  assert.equal(result.effect, 'review_authorization_recorded');
  assert.equal(result.canonical_queue_modified, false);
});

test('rejects changed projection bytes under stale digest', () => {
  const changed = { ...context, projection: { ...projection, queue_items: [{ id: 'M-002', status: 'completed' }] } };
  assert.ok(validateAdoptionAuthorization(packet, changed).errors.includes('projection_digest_mismatch'));
});

test('rejects authorization scope outside reviewed projection', () => {
  const widened = { ...packet, authorized_queue_items: ['M-002', 'M-003'] };
  assert.ok(validateAdoptionAuthorization(widened, context).errors.includes('authorization_scope_exceeds_projection'));
});

test('rejects any automatic adoption or canonical mutation permission', () => {
  const unsafe = { ...packet, canonical_mutation_permitted: true, automatic_adoption_permitted: true };
  const result = validateAdoptionAuthorization(unsafe, context);
  assert.ok(result.errors.includes('canonical_mutation_must_remain_false'));
  assert.ok(result.errors.includes('automatic_adoption_must_remain_false'));
});

test('records explicit rejection as a durable review outcome', () => {
  const rejected = { ...packet, decision: 'reject', authorized_queue_items: ['M-002'] };
  assert.equal(validateAdoptionAuthorization(rejected, context).effect, 'review_rejection_recorded');
});
