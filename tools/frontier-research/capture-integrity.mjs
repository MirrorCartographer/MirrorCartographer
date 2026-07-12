const DSP_KEYS = ['echoCancellation', 'noiseSuppression', 'autoGainControl'];

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object ?? {}, key);
}

export function assessCaptureIntegrity({
  supportedConstraints = {},
  settings = {},
  requestedConstraints = {},
  expectedSampleRate
} = {}) {
  const checks = DSP_KEYS.map((key) => {
    const supported = supportedConstraints[key] === true;
    const requestedOff = requestedConstraints[key] === false ||
      requestedConstraints[key]?.exact === false;
    const settingKnown = hasOwn(settings, key);
    const active = settingKnown ? settings[key] !== false : null;

    let status = 'unknown';
    if (supported && requestedOff && settingKnown && active === false) status = 'verified_off';
    else if (settingKnown && active === true) status = 'active';
    else if (!supported) status = 'unsupported_or_unreported';
    else if (!requestedOff) status = 'not_requested_off';

    return { property: key, supported, requestedOff, settingKnown, active, status };
  });

  const active = checks.filter((check) => check.status === 'active');
  const unknown = checks.filter((check) => check.status !== 'verified_off' && check.status !== 'active');

  let classification = 'verified_unprocessed';
  if (active.length) classification = 'processing_active';
  else if (unknown.length) classification = 'processing_unknown';

  const sampleRateKnown = Number.isFinite(settings.sampleRate);
  const expectedRateKnown = Number.isFinite(expectedSampleRate);
  const sampleRateMatches = sampleRateKnown && expectedRateKnown
    ? settings.sampleRate === expectedSampleRate
    : null;

  if (sampleRateMatches === false && classification === 'verified_unprocessed') {
    classification = 'processing_unknown';
  }

  return {
    schemaVersion: '1.0.0',
    kind: 'microphone-capture-integrity',
    classification,
    usableForStrongAcousticClaim: classification === 'verified_unprocessed',
    checks,
    sampleRate: {
      observed: sampleRateKnown ? settings.sampleRate : null,
      expected: expectedRateKnown ? expectedSampleRate : null,
      matches: sampleRateMatches
    },
    reasons: [
      ...active.map((check) => `${check.property}_active`),
      ...unknown.map((check) => `${check.property}_${check.status}`),
      ...(sampleRateMatches === false ? ['sample_rate_differs_from_analysis_rate'] : [])
    ],
    claimBoundary: {
      supports: classification === 'verified_unprocessed'
        ? 'the track reported the requested browser-controllable DSP features disabled at capture time'
        : 'the capture-processing state was recorded without assuming requested constraints took effect',
      doesNotProve: 'absence of platform-level signal processing, microphone calibration, emitter identity, or listener perception',
      falsification: 'inspect track.getSettings() after permission and compare a normal-output trial with a muted-output control; downgrade evidence when DSP is active or unreported'
    }
  };
}
