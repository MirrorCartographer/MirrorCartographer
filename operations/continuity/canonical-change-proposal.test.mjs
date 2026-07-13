import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCanonicalChangeProposal, sha256Json } from './canonical-change-proposal.mjs';

const projection = { source_commit: 'a'.repeat(40), queue_items: [{ id: 'M-003', owner: 'continuity_mining', priority: 2, action: 'Bind authenticated review evidence to a manual canonical adoption proposal.', dependencies: ['M-002'], required_evidence: ['review authorization', 'proposal digest', 'manual application record'], status: 'queued' }] };
const canonicalQueue = { schema_version: '1.0.0', updated_at: '2026-07-11T16:51:00-04:00', items: [{ id: 'M-001', owner: 'continuity_mining', status: 'completed' }] };
const authorization = {
  schema_version: '1.0.0', decision: 'approve', reviewer: 'continuity-reviewer', source_commit: 'a'.repeat(40),
  canonical_queue_blob_sha: 'b'.repeat(40), projection_sha256: sha256Json(projection), authorized_queue_items: ['M-003'],
  canonical_mutation_permitted: false, automatic_adoption_permitted: false, rationale: 'Reviewed projection is bounded to one continuity queue item.'
};

test('builds a digest-bound proposal without mutating canonical queue', () => {
  const before = JSON.stringify(canonicalQueue);
  const result = buildCanonicalChangeProposal({ authorization, projection, canonicalQueue });
  assert.equal(result.valid, true);
  assert.equal(result.proposal.operations[0].path, '/items/-');
  assert.equal(result.canonical_queue_modified, false);
  assert.equal(result.application_permitted, false);
  assert.equal(JSON.stringify(canonicalQueue), before);
});

test('rejects review rejection', () => {
  const result = buildCanonicalChangeProposal({ authorization: { ...authorization, decision: 'reject' }, projection, canonicalQueue });
  assert.ok(result.errors.includes('approval_required'));
});

test('rejects changed projection bytes under stale authorization digest', () => {
  const changed = { ...projection, queue_items: [{ ...projection.queue_items[0], status: 'active' }] };
  const result = buildCanonicalChangeProposal({ authorization, projection: changed, canonicalQueue });
  assert.ok(result.errors.includes('projection_digest_mismatch'));
});

test('rejects widened projection scope', () => {
  const widened = { ...projection, queue_items: [...projection.queue_items, { id: 'M-004', owner: 'continuity_mining', status: 'queued' }] };
  const widenedAuthorization = { ...authorization, projection_sha256: sha256Json(widened) };
  const result = buildCanonicalChangeProposal({ authorization: widenedAuthorization, projection: widened, canonicalQueue });
  assert.ok(result.errors.includes('projection_exceeds_authorized_scope'));
});

test('rejects duplicate canonical queue identifiers', () => {
  const duplicateProjection = { ...projection, queue_items: [{ ...projection.queue_items[0], id: 'M-001' }] };
  const duplicateAuthorization = { ...authorization, projection_sha256: sha256Json(duplicateProjection), authorized_queue_items: ['M-001'] };
  const result = buildCanonicalChangeProposal({ authorization: duplicateAuthorization, projection: duplicateProjection, canonicalQueue });
  assert.ok(result.errors.includes('canonical_queue_item_already_exists'));
});

test('rejects any permission for automatic or direct mutation', () => {
  const unsafe = { ...authorization, canonical_mutation_permitted: true, automatic_adoption_permitted: true };
  const result = buildCanonicalChangeProposal({ authorization: unsafe, projection, canonicalQueue });
  assert.ok(result.errors.includes('canonical_mutation_permission_invalid'));
  assert.ok(result.errors.includes('automatic_adoption_permission_invalid'));
});
