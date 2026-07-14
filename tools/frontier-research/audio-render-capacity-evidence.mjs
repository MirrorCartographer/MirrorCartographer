const STATES = Object.freeze({
  UNSUPPORTED: 'unsupported',
  AVAILABLE_UNOBSERVED: 'available_unobserved',
  HEALTHY_SAMPLE: 'healthy_sample',
  PRESSURE_SAMPLE: 'pressure_sample',
  INVALID_SAMPLE: 'invalid_sample'
});

export function classifyAudioRenderCapacity(input = {}) {
  const supported = input.supported === true;
  if (!supported) {
    return {
      state: STATES.UNSUPPORTED,
      claim: 'render-capacity telemetry unavailable; audio health remains unresolved',
      evidenceStrength: 'none',
      falsification: 'retest in a user agent exposing AudioContext.renderCapacity'
    };
  }

  if (input.averageLoad == null && input.peakLoad == null && input.underrunRatio == null) {
    return {
      state: STATES.AVAILABLE_UNOBSERVED,
      claim: 'telemetry capability exists but no capacity sample was retained',
      evidenceStrength: 'capability_only',
      falsification: 'retain a timestamped capacity sample during audible playback'
    };
  }

  const values = [input.averageLoad, input.peakLoad, input.underrunRatio];
  if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
    return {
      state: STATES.INVALID_SAMPLE,
      claim: 'capacity sample is malformed and cannot support an audio-health claim',
      evidenceStrength: 'rejected',
      falsification: 'capture finite non-negative values from the browser API'
    };
  }

  const pressure = input.peakLoad >= 1 || input.underrunRatio > 0;
  return {
    state: pressure ? STATES.PRESSURE_SAMPLE : STATES.HEALTHY_SAMPLE,
    claim: pressure
      ? 'render-capacity telemetry shows processing pressure or underruns'
      : 'this retained sample shows no reported render pressure',
    evidenceStrength: 'single_runtime_sample',
    limits: [
      'does not prove sound reached speakers',
      'does not prove future or prior playback health',
      'does not identify the cause of pressure'
    ],
    falsification: 'repeat under the same graph and device conditions and compare retained samples'
  };
}
