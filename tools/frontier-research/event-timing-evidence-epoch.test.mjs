import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEventTimingEvidenceEpoch } from './event-timing-evidence-epoch.mjs';

const base = {
  navigationId: 'nav:01',
  navigationType: 'navigate',
  pageshowPersisted: false,
  currentEpochId: 'epoch:01'
};

test('accepts a fresh navigation epoch', () => {
  const result = validateEventTimingEvidenceEpoch(base);
  assert.equal(result.evidence_epoch_valid, true);
  assert.equal(result.claim_state, 'observed');
  assert.equal(result.lifecycle, 'new_navigation_document');
});

test('accepts a persisted history restoration only after epoch rotation', () => {
  const result = validateEventTimingEvidenceEpoch({
    ...base,
    navigationType: 'back_forward',
    pageshowPersisted: true,
    previousEpochId: 'epoch:01',
    currentEpochId: 'epoch:02',
    epochResetObserved: true
  });
  assert.equal(result.evidence_epoch_valid, true);
  assert.equal(result.lifecycle, 'restored_history_document');
});

test('rejects a persisted restoration that reuses the prior epoch', () => {
  const result = validateEventTimingEvidenceEpoch({
    ...base,
    navigationType: 'back_forward',
    pageshowPersisted: true,
    previousEpochId: 'epoch:01',
    currentEpochId: 'epoch:01',
    epochResetObserved: true
  });
  assert.equal(result.evidence_epoch_valid, false);
  assert.equal(result.reason, 'persisted_restore_epoch_not_rotated');
});

test('rejects persisted pageshow with a non-history navigation type', () => {
  const result = validateEventTimingEvidenceEpoch({
    ...base,
    pageshowPersisted: true,
    previousEpochId: 'epoch:00',
    epochResetObserved: true
  });
  assert.equal(result.evidence_epoch_valid, false);
  assert.equal(result.reason, 'persisted_pageshow_navigation_type_conflict');
});

test('rejects a persisted restoration without an observed reset', () => {
  const result = validateEventTimingEvidenceEpoch({
    ...base,
    navigationType: 'back_forward',
    pageshowPersisted: true,
    previousEpochId: 'epoch:01',
    currentEpochId: 'epoch:02',
    epochResetObserved: false
  });
  assert.equal(result.evidence_epoch_valid, false);
  assert.equal(result.reason, 'persisted_restore_epoch_reset_unobserved');
});

test('output excludes supplied sensitive runtime material', () => {
  const result = validateEventTimingEvidenceEpoch(base);
  const serialized = JSON.stringify(result);
  for (const forbidden of ['https://private.example/path', 'secret-referrer', '#payment-button', 'Safari/999', '1720000000']) {
    assert.equal(serialized.includes(forbidden), false);
  }
});
