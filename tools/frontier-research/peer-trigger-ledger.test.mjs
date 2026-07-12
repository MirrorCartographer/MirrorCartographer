import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePeerTriggerLedger } from './peer-trigger-ledger.mjs';

function receipt(state, overrides = {}) {
  const requestId = overrides.request_id ?? 'req-1';
  const event = {
    specversion: '1.0',
    id: overrides.id ?? `${requestId}-${state}`,
    source: overrides.source ?? 'urn:mirrorcartographer:team:frontier_research',
    type: `org.mirrorcartographer.peertrigger.${state}.v1`,
    datacontenttype: 'application/json',
    data: {
      state,
      request_id: requestId,
      from_team: overrides.from_team ?? 'frontier_research',
      to_team: overrides.to_team ?? 'vercel_studio',
      queue_item: overrides.queue_item ?? 'R-006',
      occurred_at: overrides.occurred_at ?? '2026-07-12T17:38:00Z'
    }
  };
  if (state !== 'requested') event.data.evidence_ref = overrides.evidence_ref ?? `operations/evidence/${requestId}-${state}.json`;
  if (state === 'completed') {
    event.data.peer_output_ref = overrides.peer_output_ref ?? 'operations/team-outputs/vercel-studio-run.json';
    event.data.peer_commit = overrides.peer_commit ?? '0123456789abcdef0123456789abcdef01234567';
  }
  if (state === 'failed') event.data.failure_reason = overrides.failure_reason ?? 'tool unavailable';
  return event;
}

test('accepts requested -> attempted -> accepted -> completed', () => {
  const result = validatePeerTriggerLedger([
    receipt('requested', { occurred_at: '2026-07-12T17:38:00Z' }),
    receipt('attempted', { occurred_at: '2026-07-12T17:39:00Z' }),
    receipt('accepted', { occurred_at: '2026-07-12T17:40:00Z' }),
    receipt('completed', { occurred_at: '2026-07-12T17:41:00Z' })
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.requests['req-1'].state, 'completed');
});

test('treats byte-equivalent duplicate identity as idempotent', () => {
  const event = receipt('requested');
  const result = validatePeerTriggerLedger([event, structuredClone(event)]);
  assert.equal(result.ok, true);
  assert.equal(result.requests['req-1'].event_count, 1);
});

test('rejects duplicate source+id with divergent content', () => {
  const first = receipt('requested', { id: 'same' });
  const second = receipt('requested', { id: 'same', queue_item: 'R-999' });
  const result = validatePeerTriggerLedger([first, second]);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /divergent content/);
});

test('rejects skipped lifecycle transition', () => {
  const result = validatePeerTriggerLedger([
    receipt('requested', { occurred_at: '2026-07-12T17:38:00Z' }),
    receipt('completed', { occurred_at: '2026-07-12T17:39:00Z' })
  ]);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /invalid transition requested -> completed/);
});

test('rejects mutation of request identity fields', () => {
  const result = validatePeerTriggerLedger([
    receipt('requested'),
    receipt('attempted', { to_team: 'cloudflare_research', occurred_at: '2026-07-12T17:39:00Z' })
  ]);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /identity fields changed/);
});

test('rejects events after a terminal state', () => {
  const result = validatePeerTriggerLedger([
    receipt('requested', { occurred_at: '2026-07-12T17:38:00Z' }),
    receipt('failed', { occurred_at: '2026-07-12T17:39:00Z' }),
    receipt('attempted', { occurred_at: '2026-07-12T17:40:00Z' })
  ]);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /terminal request received another state/);
});
