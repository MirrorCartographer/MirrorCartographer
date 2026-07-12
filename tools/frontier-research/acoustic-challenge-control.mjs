function finite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
}

function positive(value, name) {
  finite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
  return value;
}

function integerAtLeast(value, minimum, name) {
  if (!Number.isInteger(value) || value < minimum) throw new RangeError(`${name} must be an integer >= ${minimum}`);
  return value;
}

function randomIndex(cryptoSource, size) {
  const limit = Math.floor(0x100000000 / size) * size;
  const word = new Uint32Array(1);
  for (let attempts = 0; attempts < 128; attempts += 1) {
    cryptoSource.getRandomValues(word);
    if (word[0] < limit) return word[0] % size;
  }
  throw new Error('random source did not produce an unbiased sample');
}

function randomNonce(cryptoSource) {
  const bytes = new Uint8Array(16);
  cryptoSource.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createAcousticChallenge({
  cryptoSource = globalThis.crypto,
  frequenciesHz = [392, 523.25, 659.25, 783.99],
  slotCount = 4,
  baseStartPerformanceTime,
  slotDurationMs = 500,
  pulseDurationMs = 220
} = {}) {
  if (!cryptoSource || typeof cryptoSource.getRandomValues !== 'function') {
    throw new TypeError('cryptoSource.getRandomValues is required');
  }
  if (!Array.isArray(frequenciesHz) || frequenciesHz.length < 2) {
    throw new RangeError('frequenciesHz must contain at least two values');
  }
  const frequencies = frequenciesHz.map((value, index) => positive(value, `frequenciesHz[${index}]`));
  const slots = integerAtLeast(slotCount, 3, 'slotCount');
  const base = finite(baseStartPerformanceTime, 'baseStartPerformanceTime');
  const slotDuration = positive(slotDurationMs, 'slotDurationMs');
  const pulseDuration = positive(pulseDurationMs, 'pulseDurationMs');
  if (pulseDuration >= slotDuration) throw new RangeError('pulseDurationMs must be shorter than slotDurationMs');

  const frequencyIndex = randomIndex(cryptoSource, frequencies.length);
  const activeSlotIndex = randomIndex(cryptoSource, slots);
  return {
    schemaVersion: '1.0.0',
    kind: 'acoustic-challenge-control',
    nonce: randomNonce(cryptoSource),
    frequencyHz: frequencies[frequencyIndex],
    activeSlotIndex,
    slotCount: slots,
    baseStartPerformanceTime: base,
    slotDurationMs: slotDuration,
    pulseDurationMs: pulseDuration,
    expectedPulseWindow: {
      start: base + activeSlotIndex * slotDuration,
      end: base + activeSlotIndex * slotDuration + pulseDuration
    },
    controlSlotIndexes: Array.from({ length: slots }, (_, index) => index).filter(index => index !== activeSlotIndex)
  };
}

export function classifyAcousticChallengeResponse({
  challenge,
  detections = [],
  frequencyToleranceHz = 8,
  temporalToleranceMs = 45
} = {}) {
  if (!challenge || challenge.kind !== 'acoustic-challenge-control') throw new TypeError('valid challenge is required');
  if (!Array.isArray(detections)) throw new TypeError('detections must be an array');
  const frequencyTolerance = positive(frequencyToleranceHz, 'frequencyToleranceHz');
  const temporalTolerance = positive(temporalToleranceMs, 'temporalToleranceMs');

  const matching = detections.filter((detection, index) => {
    if (!detection || typeof detection !== 'object') throw new TypeError(`detections[${index}] must be an object`);
    const frequency = positive(detection.frequencyHz, `detections[${index}].frequencyHz`);
    const start = finite(detection.startPerformanceTime, `detections[${index}].startPerformanceTime`);
    const end = finite(detection.endPerformanceTime ?? start, `detections[${index}].endPerformanceTime`);
    if (end < start) throw new RangeError(`detections[${index}].endPerformanceTime must be >= start`);
    return Math.abs(frequency - challenge.frequencyHz) <= frequencyTolerance;
  });

  const slotWindows = Array.from({ length: challenge.slotCount }, (_, index) => ({
    index,
    start: challenge.baseStartPerformanceTime + index * challenge.slotDurationMs - temporalTolerance,
    end: challenge.baseStartPerformanceTime + index * challenge.slotDurationMs + challenge.pulseDurationMs + temporalTolerance
  }));
  const hitsBySlot = slotWindows.map(window => matching.filter(detection => {
    const end = detection.endPerformanceTime ?? detection.startPerformanceTime;
    return end >= window.start && detection.startPerformanceTime <= window.end;
  }).length);
  const activeHits = hitsBySlot[challenge.activeSlotIndex];
  const controlHits = hitsBySlot.reduce((sum, count, index) => sum + (index === challenge.activeSlotIndex ? 0 : count), 0);

  let classification = 'absent';
  if (activeHits > 0 && controlHits === 0) classification = 'challenge_consistent';
  if (controlHits > 0 || activeHits > 1) classification = 'ambiguous_environmental_match';

  return {
    schemaVersion: '1.0.0',
    kind: 'acoustic-challenge-response-classification',
    challengeNonce: challenge.nonce,
    classification,
    acceptedAsChallengeResponse: classification === 'challenge_consistent',
    activeHits,
    controlHits,
    hitsBySlot,
    claimBoundary: {
      supports: classification === 'challenge_consistent'
        ? 'a matching tone appeared in the cryptographically randomized active window and not in the declared control windows'
        : 'the observations did not uniquely match the randomized active window',
      doesNotProve: 'that the listener consciously heard the tone, that the browser was the only possible sound source, or that the random source or microphone path was uncompromised',
      falsification: 'replay the same-frequency tone in a control window or add repeated ambient detections; acceptance must change to ambiguous_environmental_match'
    }
  };
}
