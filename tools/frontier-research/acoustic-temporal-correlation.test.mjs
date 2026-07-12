import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAcousticTemporalCorrelation } from './acoustic-temporal-correlation.mjs';

const base = {
  scheduledContextTime: 10.1,
  outputTimestamp: { contextTime: 10, performanceTime: 5000 },
  pulseDurationMs: 220,
  captureDelayRangeMs: { min: 10, max: 180 },
  toleranceMs: 20
};

test('accepts a detection overlapping the predicted acoustic window', () => {
  const result = classifyAcousticTemporalCorrelation({ ...base, detection: { startPerformanceTime: 5140, endPerformanceTime: 5220 } });
  assert.equal(result.classification, 'temporally_correlated');
  assert.equal(result.acceptedAsTemporalCorrelation, true);
});

test('rejects an unrelated detection outside the predicted window', () => {
  const result = classifyAcousticTemporalCorrelation({ ...base, detection: { startPerformanceTime: 5700, endPerformanceTime: 5780 } });
  assert.equal(result.acceptedAsTemporalCorrelation, false);
  assert.deepEqual(result.reasons, ['detection_outside_expected_window']);
});

test('fails closed before the output timestamp has started', () => {
  const result = classifyAcousticTemporalCorrelation({ ...base, outputTimestamp: { contextTime: 0, performanceTime: 0 }, detection: { startPerformanceTime: 5140 } });
  assert.equal(result.acceptedAsTemporalCorrelation, false);
  assert.ok(result.reasons.includes('output_timestamp_not_started'));
});

test('rejects projection from a stale output timestamp', () => {
  const result = classifyAcousticTemporalCorrelation({ ...base, scheduledContextTime: 11, detection: { startPerformanceTime: 6100 } });
  assert.equal(result.acceptedAsTemporalCorrelation, false);
  assert.ok(result.reasons.includes('projection_too_far_from_output_timestamp'));
});

test('rejects impossible detection windows', () => {
  assert.throws(() => classifyAcousticTemporalCorrelation({ ...base, detection: { startPerformanceTime: 5200, endPerformanceTime: 5100 } }), /must be >=/);
});
