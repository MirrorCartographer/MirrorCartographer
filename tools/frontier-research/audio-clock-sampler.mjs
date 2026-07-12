const finite = (value) => Number.isFinite(value) ? value : null;

export function captureAudioClockSample(context, { now = () => performance.now() } = {}) {
  if (!context || typeof context !== 'object') throw new TypeError('AudioContext-like object required');
  const sampledAtPerformanceTime = finite(now());
  if (sampledAtPerformanceTime === null) throw new TypeError('Sampling clock must return a finite number');

  const sample = {
    sampledAtPerformanceTime,
    contextState: typeof context.state === 'string' ? context.state : 'unknown',
    currentTime: finite(context.currentTime),
    baseLatency: finite(context.baseLatency),
    outputLatency: finite(context.outputLatency),
    outputTimestamp: null,
    acquisition: 'available'
  };

  if (typeof context.getOutputTimestamp !== 'function') {
    sample.acquisition = 'timestamp_api_unavailable';
    return sample;
  }

  const timestamp = context.getOutputTimestamp();
  const contextTime = finite(timestamp?.contextTime);
  const performanceTime = finite(timestamp?.performanceTime);
  if (contextTime === null || performanceTime === null) {
    sample.acquisition = 'malformed_timestamp';
    return sample;
  }

  sample.outputTimestamp = { contextTime, performanceTime };
  return sample;
}

export async function sampleAudioClock(context, {
  count = 3,
  intervalMs = 25,
  now,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
} = {}) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('count must be a positive integer');
  if (!Number.isFinite(intervalMs) || intervalMs < 0) throw new RangeError('intervalMs must be non-negative');
  const samples = [];
  for (let index = 0; index < count; index += 1) {
    samples.push(captureAudioClockSample(context, { now }));
    if (index + 1 < count) await sleep(intervalMs);
  }
  return {
    schemaVersion: '1.0.0',
    acquisitionStatus: samples.every((sample) => sample.acquisition === 'available') ? 'available' : 'incomplete',
    samples
  };
}

export function gateClockEvidence(packet, evaluate) {
  if (!packet || !Array.isArray(packet.samples)) throw new TypeError('sample packet required');
  if (packet.acquisitionStatus !== 'available') {
    return { accepted: false, reason: 'acquisition_incomplete', evaluation: null };
  }
  if (typeof evaluate !== 'function') throw new TypeError('evaluate function required');
  const evaluation = evaluate(packet.samples);
  return evaluation?.classification === 'consistent'
    ? { accepted: true, reason: 'clock_consistent', evaluation }
    : { accepted: false, reason: 'clock_not_consistent', evaluation };
}
