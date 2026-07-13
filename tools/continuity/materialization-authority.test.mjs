import assert from 'node:assert/strict';
import test from 'node:test';
import { createMaterializationRequest, evaluateMaterializationAuthority } from './materialization-authority.mjs';

const sourceCommit = 'a'.repeat(40);
const sourceDigest = 'b'.repeat(64);
const candidateDigest = 'c'.repeat(64);
const future = '2099-01-01T00:00:00.000Z';

function candidate(overrides = {}) {
  return {
    mutation_performed: false,
    snapshot_native: true,
    materialization_allowed: false,
    source_commit: sourceCommit,
    source_digest: sourceDigest,
    candidate_digest: candidateDigest,
    rejected_files: [],
    orphan_projections: [],
    items: [{ id: 'M-001', materialization_allowed: true }],
    ...overrides
  };
}

function request(overrides = {}) {
  return createMaterializationRequest({
    sourceCommit,
    sourceDigest,
    candidateDigest,
    actor: 'continuity-materializer',
    workflow: 'github-actions:continuity-materialize',
    expiresAt: future,
    ...overrides
  });
}

const policy = {
  enabled: true,
  allowed_actors: ['continuity-materializer'],
  allowed_workflows: ['github-actions:continuity-materialize'],
  allowed_canonical_paths: ['operations/ACTIVE_QUEUE.json']
};

test('authorizes only an exact, fresh, snapshot-native binding', () => {
  const result = evaluateMaterializationAuthority({ request: request(), candidate: candidate(), policy, now: new Date('2026-07-13T00:00:00Z') });
  assert.equal(result.authorized, true);
  assert.equal(result.decision, 'authorized');
  assert.equal(result.mutation_performed, false);
});

test('denies disabled policy and untrusted actor or workflow', () => {
  const result = evaluateMaterializationAuthority({
    request: request({ actor: 'other', workflow: 'local-shell' }),
    candidate: candidate(),
    policy: { ...policy, enabled: false },
    now: new Date('2026-07-13T00:00:00Z')
  });
  assert.deepEqual(result.reasons.sort(), ['actor_not_allowed', 'policy_disabled', 'workflow_not_allowed']);
});

test('denies stale or mismatched source and candidate bindings', () => {
  const result = evaluateMaterializationAuthority({
    request: request({ sourceDigest: 'd'.repeat(64), candidateDigest: 'e'.repeat(64), expiresAt: '2020-01-01T00:00:00Z' }),
    candidate: candidate(),
    policy,
    now: new Date('2026-07-13T00:00:00Z')
  });
  assert.ok(result.reasons.includes('source_digest_mismatch'));
  assert.ok(result.reasons.includes('candidate_digest_mismatch'));
  assert.ok(result.reasons.includes('request_expired'));
});

test('denies rejected, orphaned, or unresolved candidate state', () => {
  const result = evaluateMaterializationAuthority({
    request: request(),
    candidate: candidate({ rejected_files: [{}], orphan_projections: [{}], items: [{ id: 'M-001', materialization_allowed: false }] }),
    policy,
    now: new Date('2026-07-13T00:00:00Z')
  });
  assert.ok(result.reasons.includes('candidate_has_rejected_files'));
  assert.ok(result.reasons.includes('candidate_has_orphan_projections'));
  assert.ok(result.reasons.includes('candidate_contains_blocked_item'));
});

test('denies tampered requests and candidates that claim authority', () => {
  const tampered = { ...request(), candidate_digest: 'f'.repeat(64) };
  const result = evaluateMaterializationAuthority({
    request: tampered,
    candidate: candidate({ materialization_allowed: true, mutation_performed: true }),
    policy,
    now: new Date('2026-07-13T00:00:00Z')
  });
  assert.ok(result.reasons.includes('candidate_claims_own_authority'));
  assert.ok(result.reasons.includes('candidate_already_mutated_state'));
  assert.ok(result.reasons.includes('candidate_digest_mismatch'));
  assert.ok(result.reasons.includes('request_digest_mismatch'));
});
