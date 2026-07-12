import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { captureBrowserAudioEvidence, sha256Browser } from './browser-audio-evidence-adapter.mjs';

const commit = 'a'.repeat(40);
const base = {
  scope: {
    crypto: webcrypto,
    __MC_AUDIO_EVIDENCE__: { contextState: 'running', renderAdvance: 0.021 },
    __MC_AUDIO_PULSE__: { frequencyHz: 523.25, durationSeconds: 0.22 }
  },
  cryptoImpl: webcrypto,
  sessionId: 'session-1234',
  deployedCommit: commit,
  capturedAt: '2026-07-12T15:07:00.000Z',
  clockPacket: { acquisitionStatus: 'available', samples: [1, 2] },
  clockGate: { accepted: true, evaluation: { classification: 'consistent' } },
  routeObservation: { outputRoute: 'default' }
};

test('captures and digest-binds browser globals', async () => {
  const packet = await captureBrowserAudioEvidence(base);
  assert.equal(packet.schemaVersion, '1.1.0');
  assert.equal(packet.components.diagnosticPulse.sessionId, base.sessionId);
  assert.equal(packet.components.diagnosticPulse.commit, commit);
  assert.equal(packet.components.routeObservation.sessionId, base.sessionId);
  assert.equal(packet.componentDigests.runtimeEvidence, await sha256Browser(packet.components.runtimeEvidence, webcrypto));
  assert.equal(packet.claimBoundary.audibilityEvidence, 'not_observed');
});

test('copies globals so later runtime mutation cannot rewrite captured evidence', async () => {
  const packet = await captureBrowserAudioEvidence(base);
  base.scope.__MC_AUDIO_EVIDENCE__.renderAdvance = 99;
  assert.equal(packet.components.runtimeEvidence.renderAdvance, 0.021);
});

test('keeps audibility separate and session-bound', async () => {
  const packet = await captureBrowserAudioEvidence({ ...base, audibleObservation: { outcome: 'heard', observerClass: 'human' } });
  assert.equal(packet.components.audibleObservation.sessionId, base.sessionId);
  assert.equal(packet.claimBoundary.audibilityEvidence, 'separately_observed');
});

test('rejects missing runtime evidence', async () => {
  await assert.rejects(() => captureBrowserAudioEvidence({ ...base, scope: { crypto: webcrypto, __MC_AUDIO_PULSE__: {} } }), /__MC_AUDIO_EVIDENCE__/);
});

test('rejects missing Web Crypto instead of silently weakening digests', async () => {
  await assert.rejects(() => captureBrowserAudioEvidence({ ...base, cryptoImpl: {} }), /SubtleCrypto/);
});
