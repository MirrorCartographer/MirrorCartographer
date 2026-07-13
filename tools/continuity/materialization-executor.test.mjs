import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildMaterializationPlan, executeMaterializationPlan } from './materialization-executor.mjs';

const h = (value) => createHash('sha256').update(value).digest('hex');
const sourceCommit = 'a'.repeat(40);
const sourceDigest = h('source');
const candidateDigest = h('candidate');
const requestDigest = h('request');

function fixture() {
  const request = { operation: 'replace_canonical_queue', canonical_path: 'operations/ACTIVE_QUEUE.json', source_commit: sourceCommit, source_digest: sourceDigest, candidate_digest: candidateDigest, request_digest: requestDigest };
  const candidate = { generated_at: '2026-07-13T03:46:00Z', mutation_performed: false, source_commit: sourceCommit, source_digest: sourceDigest, candidate_digest: candidateDigest, items: [{ id: 'M-001', status: 'completed' }] };
  const authorityDecision = { decision: 'authorized', authorized: true, mutation_performed: false, bound_source_commit: sourceCommit, bound_source_digest: sourceDigest, bound_candidate_digest: candidateDigest };
  return { request, candidate, authorityDecision };
}

test('builds an exact-byte ready plan', () => {
  const plan = buildMaterializationPlan(fixture());
  assert.equal(plan.ready, true);
  assert.match(plan.canonical_bytes, /"M-001"/);
  assert.equal(h(plan.canonical_bytes), plan.canonical_bytes_sha256);
});

test('blocks replayed committed requests', () => {
  const plan = buildMaterializationPlan({ ...fixture(), replayLedger: [{ request_digest: requestDigest, status: 'committed' }] });
  assert.equal(plan.ready, false);
  assert.ok(plan.reasons.includes('request_replayed'));
});

test('blocks binding drift', () => {
  const input = fixture();
  input.candidate.candidate_digest = h('changed');
  const plan = buildMaterializationPlan(input);
  assert.ok(plan.reasons.includes('candidate_digest_binding_mismatch'));
});

test('refuses execution when repository head moved', async () => {
  const plan = buildMaterializationPlan(fixture());
  await assert.rejects(() => executeMaterializationPlan({ plan, currentCommit: 'b'.repeat(40), replaceCanonical: async () => ({ commit_sha: 'c'.repeat(40) }) }), /repository_head_moved/);
});

test('executes only through injected writer and emits receipt', async () => {
  const plan = buildMaterializationPlan(fixture());
  let observed;
  const receipt = await executeMaterializationPlan({
    plan,
    currentCommit: sourceCommit,
    replaceCanonical: async (input) => { observed = input; return { commit_sha: 'c'.repeat(40) }; }
  });
  assert.equal(observed.path, 'operations/ACTIVE_QUEUE.json');
  assert.equal(h(observed.bytes), plan.canonical_bytes_sha256);
  assert.equal(receipt.status, 'committed');
  assert.equal(receipt.resulting_commit, 'c'.repeat(40));
});
