function requireObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`);
}

export function classifyAcousticEvidence({ renderObservation, loopbackDetection, captureIntegrity, controlTrial } = {}) {
  requireObject(renderObservation, 'renderObservation');
  requireObject(loopbackDetection, 'loopbackDetection');
  requireObject(captureIntegrity, 'captureIntegrity');
  requireObject(controlTrial, 'controlTrial');

  const renderAdvanced = renderObservation.classification === 'rendering' || renderObservation.renderAdvanced === true;
  const toneDetected = loopbackDetection.classification === 'detected' && loopbackDetection.detected === true;
  const captureVerified = captureIntegrity.classification === 'verified_unprocessed' && captureIntegrity.usableForStrongAcousticClaim === true;
  const controlPassed = controlTrial.normalDetected === true && controlTrial.mutedDetected === false;

  const reasons = [];
  if (!renderAdvanced) reasons.push('render_advance_not_observed');
  if (!toneDetected) reasons.push('diagnostic_tone_not_detected');
  if (!captureVerified) reasons.push(`capture_${captureIntegrity.classification ?? 'unknown'}`);
  if (!controlPassed) reasons.push('muted_control_not_discriminating');

  let classification = 'insufficient';
  if (toneDetected && captureVerified && controlPassed) classification = renderAdvanced ? 'strong_acoustic_evidence' : 'acoustic_evidence_without_render_correlation';
  else if (toneDetected) classification = 'qualified_acoustic_observation';
  else if (renderAdvanced) classification = 'browser_render_observation_only';

  return {
    schemaVersion: '1.0.0',
    kind: 'acoustic-evidence-fusion',
    classification,
    acceptedAsStrongAcousticEvidence: classification === 'strong_acoustic_evidence',
    observations: { renderAdvanced, toneDetected, captureVerified, controlPassed },
    reasons,
    claimBoundary: {
      supports: classification === 'strong_acoustic_evidence'
        ? 'the browser render position advanced and a permission-gated microphone capture discriminated the diagnostic tone from a muted control under reported browser-controllable DSP settings'
        : 'the available render and acoustic observations were classified without upgrading missing or qualified evidence',
      doesNotProve: 'listener perception, loudness adequacy, transducer identity, absence of platform-level processing, or repeatability across devices and sessions',
      falsification: 'repeat the same session protocol with muted output, changed route, and an off-target frequency; strong evidence must fail when the diagnostic output is absent'
    }
  };
}
