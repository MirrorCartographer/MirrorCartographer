import test from 'node:test';
import assert from 'node:assert/strict';
import { assessCaptureIntegrity } from './capture-integrity.mjs';

const supported = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };
const requested = { echoCancellation: false, noiseSuppression: { exact: false }, autoGainControl: false };

test('accepts only when all controllable DSP settings report off', () => {
  const result = assessCaptureIntegrity({
    supportedConstraints: supported,
    requestedConstraints: requested,
    settings: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, sampleRate: 48000 },
    expectedSampleRate: 48000
  });
  assert.equal(result.classification, 'verified_unprocessed');
  assert.equal(result.usableForStrongAcousticClaim, true);
});

test('rejects active echo cancellation', () => {
  const result = assessCaptureIntegrity({
    supportedConstraints: supported,
    requestedConstraints: requested,
    settings: { echoCancellation: true, noiseSuppression: false, autoGainControl: false }
  });
  assert.equal(result.classification, 'processing_active');
  assert.match(result.reasons.join(','), /echoCancellation_active/);
});

test('downgrades when settings are omitted', () => {
  const result = assessCaptureIntegrity({
    supportedConstraints: supported,
    requestedConstraints: requested,
    settings: { echoCancellation: false }
  });
  assert.equal(result.classification, 'processing_unknown');
});

test('does not confuse requested constraints with effective settings', () => {
  const result = assessCaptureIntegrity({
    supportedConstraints: supported,
    requestedConstraints: requested,
    settings: {}
  });
  assert.equal(result.usableForStrongAcousticClaim, false);
});

test('downgrades a sample-rate mismatch', () => {
  const result = assessCaptureIntegrity({
    supportedConstraints: supported,
    requestedConstraints: requested,
    settings: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, sampleRate: 44100 },
    expectedSampleRate: 48000
  });
  assert.equal(result.classification, 'processing_unknown');
  assert.match(result.reasons.join(','), /sample_rate_differs/);
});
