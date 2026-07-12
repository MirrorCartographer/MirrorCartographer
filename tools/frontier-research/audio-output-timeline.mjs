const SHA40 = /^[0-9a-f]{40}$/;

function finiteNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new TypeError(`${name} must be a finite non-negative number`);
  return value;
}

export function validateAudioOutputTimeline(input) {
  if (!input || typeof input !== 'object') throw new TypeError('input must be an object');
  const { commit, deploymentId, sessionId, samples } = input;
  if (!SHA40.test(commit ?? '')) throw new TypeError('commit must be a lowercase 40-character SHA');
  if (typeof deploymentId !== 'string' || deploymentId.length < 8) throw new TypeError('deploymentId is required');
  if (typeof sessionId !== 'string' || sessionId.length < 16) throw new TypeError('sessionId is required');
  if (!Array.isArray(samples) || samples.length < 2) throw new TypeError('at least two samples are required');

  let prior = null;
  let renderAdvanced = false;
  const normalized = samples.map((sample, index) => {
    if (!sample || typeof sample !== 'object') throw new TypeError(`samples[${index}] must be an object`);
    const capturedAtMs = finiteNonNegative(sample.capturedAtMs, `samples[${index}].capturedAtMs`);
    const contextTime = finiteNonNegative(sample.contextTime, `samples[${index}].contextTime`);
    const performanceTime = finiteNonNegative(sample.performanceTime, `samples[${index}].performanceTime`);
    const currentTime = finiteNonNegative(sample.currentTime, `samples[${index}].currentTime`);
    const outputLatency = sample.outputLatency == null ? null : finiteNonNegative(sample.outputLatency, `samples[${index}].outputLatency`);

    if (contextTime === 0 || performanceTime === 0) throw new Error('zero output timestamp means rendering has not been observed');
    if (!(currentTime > contextTime)) throw new Error('currentTime must exceed output contextTime after rendering starts');
    if (Math.abs(capturedAtMs - performanceTime) > 250) throw new Error('performanceTime is not coherent with capture time');
    if (prior) {
      if (capturedAtMs <= prior.capturedAtMs) throw new Error('capture times must increase');
      if (contextTime < prior.contextTime || performanceTime < prior.performanceTime) throw new Error('output timestamps must be monotonic');
      if (contextTime > prior.contextTime && performanceTime > prior.performanceTime) renderAdvanced = true;
    }
    prior = { capturedAtMs, contextTime, performanceTime };
    return {
      capturedAtMs,
      contextTime,
      performanceTime,
      currentTime,
      outputLatency,
      estimatedAcousticTimeMs: outputLatency == null ? null : performanceTime + outputLatency * 1000
    };
  });

  if (!renderAdvanced) throw new Error('output render position did not advance');

  return {
    schema: 'mc.audio-output-timeline.v1',
    commit,
    deploymentId,
    sessionId,
    classification: 'render_timeline_observed',
    outputLatencyStatus: normalized.every((sample) => sample.outputLatency == null) ? 'unavailable' : 'reported',
    samples: normalized,
    limits: [
      'A coherent output timeline is browser-visible rendering evidence, not proof that a human heard sound.',
      'estimatedAcousticTimeMs is emitted only when outputLatency is reported by the user agent.'
    ]
  };
}
