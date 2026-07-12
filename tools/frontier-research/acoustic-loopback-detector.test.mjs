import test from 'node:test';
import assert from 'node:assert/strict';
import { detectAcousticLoopback } from './acoustic-loopback-detector.mjs';

const sampleRate = 48000;
const length = 4800;
function sine(frequency, amplitude = 0.2) {
  return Float32Array.from({ length }, (_, i) => amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate));
}
function deterministicNoise(amplitude = 0.02) {
  let state = 123456789;
  return Float32Array.from({ length }, () => {
    state = (1103515245 * state + 12345) % 0x80000000;
    return amplitude * ((state / 0x80000000) * 2 - 1);
  });
}

test('detects the configured diagnostic tone', () => {
  const result = detectAcousticLoopback(sine(523.25), { sampleRate });
  assert.equal(result.classification, 'detected');
  assert.equal(result.detected, true);
  assert.ok(result.metrics.targetToNeighborRatio > 4);
});

test('rejects an off-target tone', () => {
  const result = detectAcousticLoopback(sine(880), { sampleRate });
  assert.equal(result.detected, false);
  assert.ok(result.reasons.includes('target_power_below_threshold'));
});

test('classifies low-level capture as no signal', () => {
  const result = detectAcousticLoopback(sine(523.25, 0.0001), { sampleRate });
  assert.equal(result.classification, 'no_signal');
});

test('rejects broadband deterministic noise', () => {
  const result = detectAcousticLoopback(deterministicNoise(), { sampleRate });
  assert.equal(result.detected, false);
  assert.ok(result.reasons.includes('target_not_distinct_from_neighbors'));
});

test('marks clipped capture ambiguous even when target tone is present', () => {
  const samples = sine(523.25, 1.5);
  for (let i = 0; i < samples.length; i += 1) samples[i] = Math.max(-1, Math.min(1, samples[i]));
  const result = detectAcousticLoopback(samples, { sampleRate });
  assert.equal(result.classification, 'ambiguous');
  assert.ok(result.reasons.includes('capture_clipped'));
});
