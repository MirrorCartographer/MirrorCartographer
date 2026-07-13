import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTargetBrowserEvidencePacket, verifyTargetBrowserEvidencePacket } from './target-browser-evidence-packet.mjs';

const capture = ({ accepted = true, support = { eventTiming: true, longAnimationFrame: true } } = {}) => ({
  schemaVersion: '1.0.0',
  interactionWindowId: 'audio-pulse',
  sequence: ['pointerdown', 'pointerup', 'click'],
  observationWindow: { startTime: 10, endTime: 90, durationMs: 80 },
  support,
  rawObservationCounts: { eventTiming: 1, eventTimingZeroInteractionId: 0, longAnimationFrame: 0 },
  eventEntries: [{ interactionId: 7, duration: 20 }],
  frameEntries: [],
  eventVerdict: { accepted, budget: { maxDurationMs: 80 } },
  frameVerdict: { accepted, budget: { maxLongFrames: 0 } },
  accepted,
});

const input = () => ({
  repository: 'MirrorCartographer/mirror-cartographer-ui',
  sourceCommit: 'a'.repeat(40),
  deployment: { provider: 'Vercel', url: 'https://example.vercel.app', identity: 'dpl_123' },
  device: { model: 'iPhone', os: 'iOS 19' },
  browser: { name: 'Mobile Safari', version: '19' },
  trialGroupId: 'iphone-audio-001',
  capturedAt: '2026-07-13T16:35:00.000Z',
  trials: [
    { trialId: 'trial-1', capture: capture() },
    { trialId: 'trial-2', capture: capture() },
  ],
});

test('builds and verifies a repeated-trial packet bound to exact identities', () => {
  const packet = buildTargetBrowserEvidencePacket(input());
  assert.equal(packet.repeatedTrialSummary.allAccepted, true);
  assert.equal(packet.trials.length, 2);
  assert.equal(verifyTargetBrowserEvidencePacket(packet).sourceCommit, 'a'.repeat(40));
});

test('rejects cross-trial budget substitution', () => {
  const value = input();
  value.trials[1].capture.eventVerdict.budget.maxDurationMs = 81;
  assert.throws(() => buildTargetBrowserEvidencePacket(value), /event budget mismatch/);
});

test('rejects cross-trial support substitution', () => {
  const value = input();
  value.trials[1].capture.support.longAnimationFrame = false;
  assert.throws(() => buildTargetBrowserEvidencePacket(value), /API support mismatch/);
});

test('rejects retained capture tampering after packet construction', () => {
  const packet = structuredClone(buildTargetBrowserEvidencePacket(input()));
  packet.trials[0].capture.eventEntries[0].duration = 999;
  assert.throws(() => verifyTargetBrowserEvidencePacket(packet), /capture digest mismatch/);
});

test('retains a failed repeated trial without upgrading the packet to success', () => {
  const value = input();
  value.trials[1].capture = capture({ accepted: false });
  const packet = buildTargetBrowserEvidencePacket(value);
  assert.equal(packet.repeatedTrialSummary.acceptedTrials, 1);
  assert.equal(packet.repeatedTrialSummary.allAccepted, false);
});
