import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserAudioEvidencePacket, verifyBrowserAudioEvidencePacket } from './browser-audio-evidence-packet.mjs';

const now = Date.parse('2026-07-12T15:00:00Z');
const sessionId = 'audio-session-20260712-001';
const commit = 'a'.repeat(40);
const input = {
  sessionId,
  deployedCommit: commit,
  capturedAt: '2026-07-12T14:59:30Z',
  clockPacket: { acquisitionStatus: 'available', samples: [{ currentTime: 1 }, { currentTime: 1.05 }] },
  clockGate: { accepted: true, evaluation: { classification: 'consistent' } },
  routeObservation: { sessionId, destinationConnected: true },
  diagnosticPulse: { sessionId, commit, frequencyHz: 523.25 },
  audibleObservation: null
};

test('accepts correlated processing evidence while preserving audibility boundary', () => {
  const packet = createBrowserAudioEvidencePacket(input);
  const result = verifyBrowserAudioEvidencePacket(packet, { expectedSessionId: sessionId, expectedCommit: commit, now });
  assert.equal(result.accepted, true);
  assert.equal(result.reason, 'processing_correlated_audibility_unobserved');
});

test('rejects component substitution after packet creation', () => {
  const packet = createBrowserAudioEvidencePacket(input);
  packet.components.routeObservation.destinationConnected = false;
  assert.equal(verifyBrowserAudioEvidencePacket(packet, { expectedSessionId: sessionId, expectedCommit: commit, now }).reason, 'digest_mismatch:routeObservation');
});

test('rejects cross-session pulse composition', () => {
  const packet = createBrowserAudioEvidencePacket({ ...input, diagnosticPulse: { ...input.diagnosticPulse, sessionId: 'audio-session-other' } });
  assert.equal(verifyBrowserAudioEvidencePacket(packet, { expectedSessionId: sessionId, expectedCommit: commit, now }).reason, 'pulse_session_mismatch');
});

test('rejects inconsistent clock evidence', () => {
  const packet = createBrowserAudioEvidencePacket({ ...input, clockGate: { accepted: false, evaluation: { classification: 'stalled' } } });
  assert.equal(verifyBrowserAudioEvidencePacket(packet, { expectedSessionId: sessionId, expectedCommit: commit, now }).reason, 'clock_not_consistent');
});

test('rejects stale packets', () => {
  const packet = createBrowserAudioEvidencePacket({ ...input, capturedAt: '2026-07-12T14:30:00Z' });
  assert.equal(verifyBrowserAudioEvidencePacket(packet, { expectedSessionId: sessionId, expectedCommit: commit, now }).reason, 'stale_or_future_packet');
});

test('accepts separately correlated audibility observation without merging claim classes', () => {
  const packet = createBrowserAudioEvidencePacket({ ...input, audibleObservation: { sessionId, observer: 'device_meter', classification: 'detected' } });
  const result = verifyBrowserAudioEvidencePacket(packet, { expectedSessionId: sessionId, expectedCommit: commit, now });
  assert.equal(result.reason, 'processing_and_audibility_correlated');
  assert.equal(packet.claimBoundary.prohibitedInference.includes('does not prove'), true);
});
