import assert from 'node:assert/strict';
import test from 'node:test';
import { validatePeerTriggerReceipt } from './peer-trigger-receipt.mjs';

const base = {
  specversion:'1.0',
  id:'req-20260712-001-attempted',
  source:'urn:mirrorcartographer:team:frontier_research',
  type:'org.mirrorcartographer.peertrigger.attempted.v1',
  datacontenttype:'application/json',
  data:{
    state:'attempted', request_id:'req-20260712-001',
    from_team:'frontier_research', to_team:'vercel_studio',
    queue_item:'R-005', occurred_at:'2026-07-12T17:32:44Z',
    evidence_ref:'operations/evidence/frontier-peer-trigger-receipt-2026-07-12.json'
  }
};

test('accepts an attempted receipt with evidence', () => {
  assert.equal(validatePeerTriggerReceipt(base).ok, true);
});

test('rejects type/state disagreement', () => {
  const event = structuredClone(base);
  event.data.state = 'completed';
  const result = validatePeerTriggerReceipt(event);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /type and data.state/);
});

test('rejects completed claim without peer output and full commit', () => {
  const event = structuredClone(base);
  event.type = 'org.mirrorcartographer.peertrigger.completed.v1';
  event.data.state = 'completed';
  const result = validatePeerTriggerReceipt(event);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /peer_output_ref/);
  assert.match(result.errors.join('\n'), /peer_commit/);
});

test('accepts completed only with peer-produced evidence', () => {
  const event = structuredClone(base);
  event.type = 'org.mirrorcartographer.peertrigger.completed.v1';
  event.data.state = 'completed';
  event.data.peer_output_ref = 'operations/evidence/vercel-example.json';
  event.data.peer_commit = '0123456789abcdef0123456789abcdef01234567';
  assert.equal(validatePeerTriggerReceipt(event).ok, true);
});

test('rejects failed receipt without a reason', () => {
  const event = structuredClone(base);
  event.type = 'org.mirrorcartographer.peertrigger.failed.v1';
  event.data.state = 'failed';
  const result = validatePeerTriggerReceipt(event);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /failure_reason/);
});
