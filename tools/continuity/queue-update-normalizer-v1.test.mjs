import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQueueUpdate } from './queue-update-normalizer-v1.mjs';
const owners = {'M-RECONCILE-002':'continuity_mining'};
const meta = {sourcePath:'operations/queue-updates/example.json',sourceCommit:'a'.repeat(40),committedAt:'2026-07-15T14:01:55Z',owners};

test('normalizes supported queue-update fields into explicit patches', () => {
  const out = normalizeQueueUpdate({queue_item:'M-RECONCILE-002',owner:'continuity_mining',status:'active',completed_slice:'built adapter',remaining:['attest'],verification:'3 tests'}, meta);
  assert.equal(out.patches[0].path, '/queue/M-RECONCILE-002/status');
  assert.deepEqual(out.patches.map(p=>p.path), ['/queue/M-RECONCILE-002/status','/queue/M-RECONCILE-002/progress/completed_slice','/queue/M-RECONCILE-002/progress/remaining','/queue/M-RECONCILE-002/progress/verification']);
  assert.equal(out.claim_state, 'observed');
});

test('rejects owner mismatch', () => assert.throws(() => normalizeQueueUpdate({queue_item:'M-RECONCILE-002',owner:'frontier_research',status:'active'}, meta), /owner mismatch/));
test('rejects unsupported status', () => assert.throws(() => normalizeQueueUpdate({queue_item:'M-RECONCILE-002',owner:'continuity_mining',status:'done'}, meta), /unsupported queue status/));
test('rejects non queue-update source path', () => assert.throws(() => normalizeQueueUpdate({queue_item:'M-RECONCILE-002',owner:'continuity_mining',status:'active'}, {...meta,sourcePath:'operations/CURRENT_STATE.json'}), /sourcePath/));
test('records omitted fields without silently converting them', () => {
 const out=normalizeQueueUpdate({queue_item:'M-RECONCILE-002',owner:'continuity_mining',status:'active',privacy_boundary:'public only'},meta);
 assert.deepEqual(out.normalization.omitted_fields,['privacy_boundary']);
 assert.equal(out.patches.some(p=>p.path.includes('privacy_boundary')),false);
});
