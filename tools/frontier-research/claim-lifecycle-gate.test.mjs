import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateClaimLifecycle, assertCurrentClaim } from './claim-lifecycle-gate.mjs';

const baseClaim = {
  claim_id: 'claim-audio-render-advance',
  claim_state: 'observed',
  evidence_strength: 'strong',
  source_status: 'primary',
  observed_at: '2026-07-12T00:00:00Z',
  revalidate_after: '2026-08-12T00:00:00Z',
  sources: ['https://www.w3.org/TR/webaudio/'],
  falsification: {
    test: 'Compare render-position advance with a device-level audible outcome.',
    failure_signal: 'Render position advances while repeated device-level observations remain silent.',
    action: 'Downgrade the claim and investigate output routing or hardware state.'
  }
};

test('accepts a current claim with explicit falsification route', () => {
  const result = evaluateClaimLifecycle(baseClaim, { now: '2026-07-12T06:00:00Z' });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'current');
  assert.equal(result.falsification_ready, true);
});

test('rejects a claim after its revalidation deadline', () => {
  const result = evaluateClaimLifecycle(baseClaim, { now: '2026-08-12T00:00:00Z' });
  assert.equal(result.accepted, false);
  assert.equal(result.classification, 'revalidation_required');
});

test('rejects a structurally plausible claim without a falsification action', () => {
  const claim = structuredClone(baseClaim);
  delete claim.falsification.action;
  const result = evaluateClaimLifecycle(claim, { now: '2026-07-12T06:00:00Z' });
  assert.equal(result.accepted, false);
  assert.equal(result.classification, 'invalid');
  assert.match(result.errors.join(' '), /falsification\.action/);
});

test('rejects superseded claims even when their dates and sources are valid', () => {
  const claim = { ...baseClaim, claim_state: 'superseded' };
  assert.throws(
    () => assertCurrentClaim(claim, { now: '2026-07-12T06:00:00Z' }),
    /superseded/
  );
});

test('rejects future-dated observations', () => {
  const claim = { ...baseClaim, observed_at: '2026-07-13T00:00:00Z' };
  const result = evaluateClaimLifecycle(claim, { now: '2026-07-12T06:00:00Z' });
  assert.equal(result.accepted, false);
  assert.equal(result.classification, 'future_dated');
});
