import test from 'node:test';
import assert from 'node:assert/strict';
import { createAudioCaptureSession } from './audio-capture-session.mjs';

const base = {
  commitSha: 'a'.repeat(40),
  deploymentId: 'dpl_immutable_123',
  sessionId: 'session_1234567890',
  deviceClass: 'physical_iphone',
  activatedAt: '2026-07-12T11:30:00Z',
  activation: { isActive: true, hasBeenActive: true, extra: 'drop' }
};

const runtime = {
  observedAt: '2026-07-12T11:30:01Z',
  audioContextState: 'running',
  sourceStarted: true,
  destinationConnected: true,
  renderAdvanced: true,
  analyserBins: [1, 2, 3]
};

test('emits allowlisted bounded packet', () => {
  const packet = createAudioCaptureSession(base)
    .recordRuntime(runtime)
    .recordHumanOutcome({ outcome: 'heard', reportedAt: '2026-07-12T11:30:03Z', notes: 'drop' });
  assert.equal(packet.human.outcome, 'heard');
  assert.equal('notes' in packet.human, false);
  assert.equal('analyserBins' in packet.runtime, false);
  assert.equal('extra' in packet.activation, false);
});

test('requires active transient activation', () =>
  assert.throws(() => createAudioCaptureSession({ ...base, activation: { isActive: false, hasBeenActive: true } }), /transient/));

test('rejects simulator device', () =>
  assert.throws(() => createAudioCaptureSession({ ...base, deviceClass: 'simulator' }), /physical_iphone/));

test('rejects runtime before activation', () =>
  assert.throws(() => createAudioCaptureSession(base).recordRuntime({ ...runtime, observedAt: '2026-07-12T11:29:59Z' }), /predates/));

test('rejects incomplete route', () =>
  assert.throws(() => createAudioCaptureSession(base).recordRuntime({ ...runtime, destinationConnected: false }), /incomplete/));

test('rejects report before runtime', () =>
  assert.throws(() => createAudioCaptureSession(base).recordRuntime(runtime).recordHumanOutcome({ outcome: 'heard', reportedAt: '2026-07-12T11:30:00Z' }), /predates/));

test('rejects sessions over ten minutes', () =>
  assert.throws(() => createAudioCaptureSession(base).recordRuntime(runtime).recordHumanOutcome({ outcome: 'not_heard', reportedAt: '2026-07-12T11:41:00Z' }), /ten minutes/));
