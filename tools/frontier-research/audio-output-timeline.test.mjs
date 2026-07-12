import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAudioOutputTimeline } from './audio-output-timeline.mjs';

const base = {
  commit: 'a'.repeat(40),
  deploymentId: 'dpl_immutable_123',
  sessionId: 'session_1234567890abcdef',
  samples: [
    { capturedAtMs: 1000, contextTime: 1, performanceTime: 990, currentTime: 1.02 },
    { capturedAtMs: 1100, contextTime: 1.1, performanceTime: 1090, currentTime: 1.12 }
  ]
};

test('accepts monotonic Safari-compatible timeline without outputLatency', () => {
  const result = validateAudioOutputTimeline(base);
  assert.equal(result.outputLatencyStatus, 'unavailable');
  assert.equal(result.samples[0].estimatedAcousticTimeMs, null);
});

test('estimates acoustic time only when outputLatency is reported', () => {
  const result = validateAudioOutputTimeline({ ...base, samples: base.samples.map((s) => ({ ...s, outputLatency: 0.04 })) });
  assert.equal(result.outputLatencyStatus, 'reported');
  assert.equal(result.samples[0].estimatedAcousticTimeMs, 1030);
});

test('rejects zero timestamps', () => {
  assert.throws(() => validateAudioOutputTimeline({ ...base, samples: [{ ...base.samples[0], contextTime: 0 }, base.samples[1]] }), /rendering has not been observed/);
});

test('rejects non-advancing render positions', () => {
  assert.throws(() => validateAudioOutputTimeline({ ...base, samples: [base.samples[0], { ...base.samples[1], contextTime: 1, performanceTime: 990 }] }), /did not advance/);
});

test('rejects incoherent performance clock', () => {
  assert.throws(() => validateAudioOutputTimeline({ ...base, samples: [{ ...base.samples[0], performanceTime: 1 }, base.samples[1]] }), /not coherent/);
});

test('rejects currentTime at or behind output contextTime', () => {
  assert.throws(() => validateAudioOutputTimeline({ ...base, samples: [{ ...base.samples[0], currentTime: 1 }, base.samples[1]] }), /must exceed/);
});
