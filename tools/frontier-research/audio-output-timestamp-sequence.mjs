const STATES = Object.freeze({
  UNSUPPORTED: 'unsupported',
  UNSTARTED_ZERO: 'unstarted_zero',
  ADVANCING: 'advancing',
  STALLED: 'stalled',
  CLOCK_REGRESSION: 'clock_regression',
  INVALID_SEQUENCE: 'invalid_sequence'
});

function validSample(sample) {
  return sample &&
    Number.isFinite(sample.contextTime) && sample.contextTime >= 0 &&
    Number.isFinite(sample.performanceTime) && sample.performanceTime >= 0;
}

export function classifyAudioOutputTimestampSequence(input = {}) {
  if (input.supported !== true) {
    return {
      state: STATES.UNSUPPORTED,
      claim: 'output timestamp capability unavailable; render progress remains unresolved',
      evidenceStrength: 'none',
      falsification: 'retest in a user agent exposing AudioContext.getOutputTimestamp'
    };
  }

  const samples = Array.isArray(input.samples) ? input.samples : [];
  if (samples.length < 2 || samples.some((sample) => !validSample(sample))) {
    return {
      state: STATES.INVALID_SEQUENCE,
      claim: 'timestamp sequence is missing or malformed and cannot support a render-progress claim',
      evidenceStrength: 'rejected',
      falsification: 'capture at least two finite non-negative AudioTimestamp samples'
    };
  }

  if (samples.every(({ contextTime, performanceTime }) => contextTime === 0 && performanceTime === 0)) {
    return {
      state: STATES.UNSTARTED_ZERO,
      claim: 'the rendering graph has not yet demonstrated a processed audio block',
      evidenceStrength: 'standards_defined_zero_state',
      falsification: 'sample again after a direct user-gesture sound start'
    };
  }

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    if (current.contextTime < previous.contextTime || current.performanceTime < previous.performanceTime) {
      return {
        state: STATES.CLOCK_REGRESSION,
        claim: 'the retained timestamp sequence regressed and is not trustworthy as monotonic render evidence',
        evidenceStrength: 'rejected',
        falsification: 'repeat capture with ordered sampling and preserve raw timestamps'
      };
    }
  }

  const first = samples[0];
  const last = samples[samples.length - 1];
  const contextAdvance = last.contextTime - first.contextTime;
  const performanceAdvance = last.performanceTime - first.performanceTime;
  const advancing = contextAdvance > 0 && performanceAdvance > 0;

  return {
    state: advancing ? STATES.ADVANCING : STATES.STALLED,
    claim: advancing
      ? 'retained output timestamps advanced in both audio-context and performance clocks'
      : 'retained output timestamps did not demonstrate coherent forward render progress',
    evidenceStrength: advancing ? 'bounded_runtime_sequence' : 'bounded_negative_observation',
    metrics: {
      sampleCount: samples.length,
      contextAdvanceSeconds: contextAdvance,
      performanceAdvanceMilliseconds: performanceAdvance
    },
    limits: [
      'does not prove that sound reached a physical speaker',
      'does not establish output latency from currentTime minus contextTime',
      'does not prove progress outside the retained observation window'
    ],
    falsification: 'repeat under the same device, graph, gesture, and sampling interval and compare raw sequences'
  };
}
