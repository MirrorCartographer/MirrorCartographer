import assert from 'node:assert/strict';
import { evaluateSharedStateWrite } from './optimistic-concurrency-guard.mjs';

const A = 'a'.repeat(40);
const B = 'b'.repeat(40);

const append = evaluateSharedStateWrite({
  actor: 'frontier_research', path: 'operations/queue-updates/R-005.json',
  observedSha: A, currentSha: A, operation: 'append_record', owner: 'frontier_research',
});
assert.equal(append.decision, 'allow');
assert.equal(append.precondition.matched, true);

const stale = evaluateSharedStateWrite({
  actor: 'frontier_research', path: 'operations/ACTIVE_QUEUE.json',
  observedSha: A, currentSha: B, operation: 'replace_owned_record', owner: 'frontier_research',
});
assert.equal(stale.decision, 'reject');
assert.deepEqual(stale.reasons, ['stale_precondition']);
assert.equal(stale.retry.safeToForce, false);

const foreign = evaluateSharedStateWrite({
  actor: 'frontier_research', path: 'operations/ACTIVE_QUEUE.json',
  observedSha: A, currentSha: A, operation: 'replace_owned_record', owner: 'vercel_studio',
});
assert.equal(foreign.decision, 'reject');
assert.deepEqual(foreign.reasons, ['owner_mismatch']);

const staleForeign = evaluateSharedStateWrite({
  actor: 'frontier_research', path: 'operations/ACTIVE_QUEUE.json',
  observedSha: A, currentSha: B, operation: 'replace_owned_record', owner: 'cloudflare_research',
});
assert.deepEqual(staleForeign.reasons, ['stale_precondition', 'owner_mismatch']);

assert.throws(() => evaluateSharedStateWrite({
  actor: 'Frontier Research', path: 'x', observedSha: A, currentSha: A,
  operation: 'append_record', owner: 'frontier_research',
}), /lowercase team identifier/);

console.log('optimistic-concurrency-guard: 5 tests passed');
