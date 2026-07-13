import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInteractionEvidencePacket, verifyInteractionEvidencePacket } from './interaction-evidence-packet.mjs';

const base = {
  sourceCommit: 'a'.repeat(40),
  deployment: { verified: true, sourceCommit: 'a'.repeat(40), identity: 'dpl_123', url: 'https://example.vercel.app' },
  observation: { device: 'iPhone 15', browser: 'Mobile Safari 18', startedAt: '2026-07-13T14:00:00Z', endedAt: '2026-07-13T14:00:02Z', sequence: ['tap:#sound', 'wait:500ms'] },
  eventTimingVerdict: { accepted: true, classification: 'within-budget', reasons: [] },
  longAnimationFrameVerdict: { accepted: true, classification: 'within-budget', reasons: [] },
};

test('accepts and verifies one exact deployment-bound observation', () => {
  const packet = buildInteractionEvidencePacket(base);
  assert.equal(packet.accepted, true);
  assert.equal(verifyInteractionEvidencePacket(packet).verified, true);
});

test('fails closed when deployment commit differs', () => {
  const packet = buildInteractionEvidencePacket({ ...base, deployment: { ...base.deployment, sourceCommit: 'b'.repeat(40) } });
  assert.equal(packet.accepted, false);
  assert(packet.reasons.includes('deployment-commit-mismatch'));
});

test('fails closed when either instrument is unsupported or non-accepting', () => {
  const packet = buildInteractionEvidencePacket({ ...base, eventTimingVerdict: { accepted: false, classification: 'unsupported', reasons: ['event-timing-unsupported'] } });
  assert.equal(packet.accepted, false);
  assert(packet.reasons.includes('event-timing-not-accepted'));
});

test('detects post-build evidence tampering', () => {
  const packet = buildInteractionEvidencePacket(base);
  packet.evidence.longAnimationFrame.classification = 'tampered';
  const result = verifyInteractionEvidencePacket(packet);
  assert.equal(result.verified, false);
  assert(result.reasons.includes('packet-digest-mismatch'));
  assert(result.reasons.includes('long-animation-frame-digest-mismatch'));
});

test('same semantic input produces the same packet digest', () => {
  const a = buildInteractionEvidencePacket(base);
  const reordered = buildInteractionEvidencePacket({
    longAnimationFrameVerdict: base.longAnimationFrameVerdict,
    observation: base.observation,
    sourceCommit: base.sourceCommit,
    eventTimingVerdict: base.eventTimingVerdict,
    deployment: base.deployment,
  });
  assert.equal(a.packetSha256, reordered.packetSha256);
});
