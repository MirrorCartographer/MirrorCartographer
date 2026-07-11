import assert from 'node:assert/strict';
import test from 'node:test';
import { validateDecisionEvents } from './validate-decision-events.mjs';

function validEvent(overrides = {}) {
  return {
    schema_version: '1.0.0',
    event_id: 'DE-0001',
    subject_id: 'subject',
    event_type: 'observe',
    claim_state: 'observed',
    valid_time: { from: '2026-07-11T20:00:00Z', to: null },
    transaction_time: { recorded_at: '2026-07-11T21:00:00Z', recorded_commit: null },
    summary: 'Observed repository state.',
    sources: [{ type: 'github_file', locator: 'operations/example.json', content_sha: 'abc', observed_at: '2026-07-11T21:00:00Z' }],
    supersedes_event_ids: [],
    contradicts_event_ids: [],
    privacy: 'public_repository_safe',
    review_route: 'Re-fetch the source and compare the recorded state.',
    ...overrides
  };
}

function ledger(events) {
  return { schema_version: '1.0.0', generated_at: '2026-07-11T21:00:00Z', events };
}

test('accepts a valid ledger and linked supersession', () => {
  const first = validEvent();
  const second = validEvent({
    event_id: 'DE-0002',
    event_type: 'supersede',
    claim_state: 'superseded',
    summary: 'A later repository state supersedes the earlier observation.',
    supersedes_event_ids: ['DE-0001']
  });
  assert.deepEqual(validateDecisionEvents(ledger([first, second])), { valid: true, errors: [] });
});

test('rejects duplicate event identifiers', () => {
  const result = validateDecisionEvents(ledger([validEvent(), validEvent()]));
  assert.equal(result.valid, false);
  assert(result.errors.some((error) => error.message === 'must be unique'));
});

test('rejects dangling and self-referential links', () => {
  const result = validateDecisionEvents(ledger([
    validEvent({ supersedes_event_ids: ['DE-0001'], contradicts_event_ids: ['DE-9999'] })
  ]));
  assert.equal(result.valid, false);
  assert(result.errors.some((error) => error.message === 'must not self-reference'));
  assert(result.errors.some((error) => error.message === 'must reference an event in this ledger'));
});

test('rejects invalid chronology, privacy, and commit identity', () => {
  const result = validateDecisionEvents(ledger([
    validEvent({
      valid_time: { from: '2026-07-12T00:00:00Z', to: '2026-07-11T00:00:00Z' },
      transaction_time: { recorded_at: '2026-07-11T21:00:00Z', recorded_commit: 'NOT-A-SHA' },
      privacy: 'public'
    })
  ]));
  assert.equal(result.valid, false);
  assert(result.errors.some((error) => error.path.endsWith('valid_time.to')));
  assert(result.errors.some((error) => error.path.endsWith('recorded_commit')));
  assert(result.errors.some((error) => error.path.endsWith('privacy')));
});

test('rejects malformed documents without throwing', () => {
  const result = validateDecisionEvents(null);
  assert.equal(result.valid, false);
  assert.equal(result.errors[0].path, '$');
});
