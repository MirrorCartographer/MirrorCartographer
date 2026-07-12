import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAcousticEvidence } from './acoustic-evidence-fusion.mjs';

const render = { classification: 'rendering' };
const detected = { classification: 'detected', detected: true };
const clean = { classification: 'verified_unprocessed', usableForStrongAcousticClaim: true };
const control = { normalDetected: true, mutedDetected: false };

test('accepts only correlated render, clean capture, detection, and discriminating control', () => {
  const result = classifyAcousticEvidence({ renderObservation: render, loopbackDetection: detected, captureIntegrity: clean, controlTrial: control });
  assert.equal(result.classification, 'strong_acoustic_evidence');
  assert.equal(result.acceptedAsStrongAcousticEvidence, true);
});

test('downgrades detected tone when capture processing is unknown', () => {
  const result = classifyAcousticEvidence({ renderObservation: render, loopbackDetection: detected, captureIntegrity: { classification: 'processing_unknown', usableForStrongAcousticClaim: false }, controlTrial: control });
  assert.equal(result.classification, 'qualified_acoustic_observation');
  assert.equal(result.acceptedAsStrongAcousticEvidence, false);
});

test('rejects strong evidence when muted control also detects tone', () => {
  const result = classifyAcousticEvidence({ renderObservation: render, loopbackDetection: detected, captureIntegrity: clean, controlTrial: { normalDetected: true, mutedDetected: true } });
  assert.equal(result.classification, 'qualified_acoustic_observation');
  assert.match(result.reasons.join(','), /muted_control_not_discriminating/);
});

test('keeps render-only evidence distinct from acoustic evidence', () => {
  const result = classifyAcousticEvidence({ renderObservation: render, loopbackDetection: { classification: 'not_detected', detected: false }, captureIntegrity: clean, controlTrial: { normalDetected: false, mutedDetected: false } });
  assert.equal(result.classification, 'browser_render_observation_only');
});

test('fails closed on malformed inputs', () => {
  assert.throws(() => classifyAcousticEvidence({}), /renderObservation/);
});
