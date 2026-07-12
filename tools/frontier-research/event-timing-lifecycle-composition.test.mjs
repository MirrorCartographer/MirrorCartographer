import test from 'node:test';
import assert from 'node:assert/strict';
import { composeEventTimingLifecycleEvidence } from './event-timing-lifecycle-composition.mjs';

const interpretation = { interpretation_valid: true, navigation_id: 'nav-1', reason: 'ok' };
const epoch = { evidence_epoch_valid: true, navigation_id: 'nav-1', evidence_epoch_id: 'epoch-2', reason: 'ok' };

test('accepts valid interpretation in a valid matching epoch', () => {
  assert.equal(composeEventTimingLifecycleEvidence({ interpretationResult: interpretation, epochResult: epoch }).lifecycle_interpretation_valid, true);
});

test('fails closed when epoch result is missing', () => {
  assert.equal(composeEventTimingLifecycleEvidence({ interpretationResult: interpretation }).reason, 'epoch_gate_failed:epoch_result_missing');
});

test('rejects invalid epoch before interpretation', () => {
  const result = composeEventTimingLifecycleEvidence({
    interpretationResult: { ...interpretation, interpretation_valid: false },
    epochResult: { ...epoch, evidence_epoch_valid: false, reason: 'not_rotated' }
  });
  assert.equal(result.reason, 'epoch_gate_failed:not_rotated');
});

test('rejects invalid existing interpretation', () => {
  const result = composeEventTimingLifecycleEvidence({
    interpretationResult: { ...interpretation, interpretation_valid: false, reason: 'coverage_partial' },
    epochResult: epoch
  });
  assert.equal(result.reason, 'interpretation_gate_failed:coverage_partial');
});

test('rejects navigation mismatch between epoch and interpretation', () => {
  const result = composeEventTimingLifecycleEvidence({
    interpretationResult: { ...interpretation, navigation_id: 'nav-2' },
    epochResult: epoch
  });
  assert.equal(result.reason, 'epoch_interpretation_navigation_mismatch');
});

test('does not retain supplied sensitive fields', () => {
  const result = composeEventTimingLifecycleEvidence({
    interpretationResult: { ...interpretation, url: 'https://private.example' },
    epochResult: { ...epoch, selector: '#secret' }
  });
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('private.example'), false);
  assert.equal(serialized.includes('#secret'), false);
});
