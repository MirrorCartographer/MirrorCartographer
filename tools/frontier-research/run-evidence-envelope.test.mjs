import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceEnvelope, parseTraceparent, validateEvidenceEnvelope } from './run-evidence-envelope.mjs';

const validTraceparent = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';

test('accepts the W3C traceparent example and exposes sampling', () => {
  const result = parseTraceparent(validTraceparent);
  assert.equal(result.valid, true);
  assert.equal(result.sampled, true);
  assert.equal(result.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
});

test('rejects forbidden all-zero identifiers and version ff', () => {
  assert.equal(parseTraceparent('00-00000000000000000000000000000000-00f067aa0ba902b7-01').valid, false);
  assert.equal(parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-0000000000000000-01').valid, false);
  assert.equal(parseTraceparent('ff-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01').valid, false);
});

test('requires a falsification route rather than evidence-only storytelling', () => {
  const result = validateEvidenceEnvelope({
    traceparent: validTraceparent,
    team: 'frontier_research',
    queue_item: 'R-002',
    claim_state: 'observed',
    evidence_state: 'test-verified',
    summary: 'validated',
    sources: [],
    artifacts: [],
    falsification_routes: []
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('falsification_routes'));
});

test('creates a frozen, valid envelope with explicit claim and evidence strength', () => {
  const envelope = createEvidenceEnvelope({
    traceparent: validTraceparent,
    created_at: '2026-07-11T20:29:15Z',
    team: 'frontier_research',
    queue_item: 'R-002',
    claim_state: 'observed',
    evidence_state: 'test-verified',
    summary: 'A trace-linked evidence envelope was validated.',
    sources: [{ type: 'primary-standard', locator: 'https://www.w3.org/TR/trace-context/' }],
    artifacts: ['tools/frontier-research/run-evidence-envelope.mjs'],
    falsification_routes: ['Submit malformed traceparent values and confirm rejection.']
  });
  assert.equal(Object.isFrozen(envelope), true);
  assert.equal(validateEvidenceEnvelope(envelope).valid, true);
});
