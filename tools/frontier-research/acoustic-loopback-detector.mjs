function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function rms(samples) {
  let sum = 0;
  for (const sample of samples) sum += sample * sample;
  return Math.sqrt(sum / samples.length);
}

function tonePower(samples, sampleRate, frequencyHz) {
  const omega = (2 * Math.PI * frequencyHz) / sampleRate;
  let real = 0;
  let imag = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const window = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (samples.length - 1));
    const value = samples[i] * window;
    real += value * Math.cos(omega * i);
    imag -= value * Math.sin(omega * i);
  }
  return (real * real + imag * imag) / (samples.length * samples.length);
}

export function detectAcousticLoopback(samples, {
  sampleRate,
  targetFrequencyHz = 523.25,
  neighborOffsetHz = 55,
  minRms = 0.003,
  minTargetToNeighborRatio = 4,
  minTargetPower = 1e-5,
  maxClippedFraction = 0.02
} = {}) {
  if (!(samples instanceof Float32Array)) throw new TypeError('samples must be a Float32Array');
  if (samples.length < 256) throw new RangeError('at least 256 samples are required');
  for (const [name, value] of Object.entries({ sampleRate, targetFrequencyHz, neighborOffsetHz, minRms, minTargetToNeighborRatio, minTargetPower, maxClippedFraction })) assertFinite(value, name);
  if (sampleRate <= 0 || targetFrequencyHz <= 0 || targetFrequencyHz >= sampleRate / 2) throw new RangeError('target frequency must be below Nyquist');
  if (neighborOffsetHz <= 0 || minRms < 0 || minTargetToNeighborRatio <= 0 || minTargetPower < 0) throw new RangeError('thresholds must be positive');
  if (maxClippedFraction < 0 || maxClippedFraction > 1) throw new RangeError('maxClippedFraction must be between 0 and 1');

  const signalRms = rms(samples);
  let clipped = 0;
  for (const sample of samples) if (Math.abs(sample) >= 0.999) clipped += 1;
  const clippedFraction = clipped / samples.length;

  const targetPower = tonePower(samples, sampleRate, targetFrequencyHz);
  const lowerPower = tonePower(samples, sampleRate, targetFrequencyHz - neighborOffsetHz);
  const upperPower = tonePower(samples, sampleRate, targetFrequencyHz + neighborOffsetHz);
  const neighborPower = Math.max(lowerPower, upperPower, Number.EPSILON);
  const targetToNeighborRatio = targetPower / neighborPower;

  let classification = 'detected';
  const reasons = [];
  if (signalRms < minRms) {
    classification = 'no_signal';
    reasons.push('rms_below_threshold');
  }
  if (targetPower < minTargetPower) {
    classification = classification === 'no_signal' ? classification : 'not_detected';
    reasons.push('target_power_below_threshold');
  }
  if (targetToNeighborRatio < minTargetToNeighborRatio) {
    classification = classification === 'no_signal' ? classification : 'not_detected';
    reasons.push('target_not_distinct_from_neighbors');
  }
  if (clippedFraction > maxClippedFraction) {
    classification = 'ambiguous';
    reasons.push('capture_clipped');
  }

  return {
    schemaVersion: '1.0.0',
    kind: 'acoustic-loopback-detection',
    classification,
    detected: classification === 'detected',
    metrics: { signalRms, targetPower, lowerPower, upperPower, targetToNeighborRatio, clippedFraction },
    thresholds: { minRms, minTargetPower, minTargetToNeighborRatio, maxClippedFraction },
    target: { frequencyHz: targetFrequencyHz, neighborOffsetHz, sampleRate, sampleCount: samples.length },
    reasons,
    claimBoundary: {
      supports: 'a microphone capture contained energy consistent with the configured diagnostic tone',
      doesNotProve: 'which physical transducer emitted the tone, that the listener perceived it, or that every playback attempt is audible',
      falsification: 'repeat with the speaker muted or route changed; detection should disappear or materially weaken'
    }
  };
}
