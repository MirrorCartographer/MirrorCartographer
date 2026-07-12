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
  for (let attempt = 0; attempt < 128; attempt += 1) {
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

function chooseDistinctIndexes(cryptoSource, populationSize, count) {
  const pool = Array.from({ length: populationSize }, (_, index) => index);
  const chosen = [];
  while (chosen.length < count) {
    chosen.push(pool.splice(randomIndex(cryptoSource, pool.length), 1)[0]);
  }
  return chosen.sort((a, b) => a - b);
}

export function createAcousticCodewordChallenge({
  cryptoSource = globalThis.crypto,
  frequenciesHz = [392, 523.25, 659.25, 783.99],
  slotCount = 6,
  pulseCount = 3,
  baseStartPerformanceTime,
  slotDurationMs = 420,
  pulseDurationMs = 180
} = {}) {
  if (!cryptoSource || typeof cryptoSource.getRandomValues !== 'function') throw new TypeError('cryptoSource.getRandomValues is required');
  if (!Array.isArray(frequenciesHz) || frequenciesHz.length < 2) throw new RangeError('frequenciesHz must contain at least two values');
  const frequencies = frequenciesHz.map((value, index) => positive(value, `frequenciesHz[${index}]`));
  const slots = integerAtLeast(slotCount, 4, 'slotCount');
  const pulses = integerAtLeast(pulseCount, 2, 'pulseCount');
  if (pulses >= slots) throw new RangeError('pulseCount must be smaller than slotCount');
  const base = finite(baseStartPerformanceTime, 'baseStartPerformanceTime');
  const slotDuration = positive(slotDurationMs, 'slotDurationMs');
  const pulseDuration = positive(pulseDurationMs, 'pulseDurationMs');
  if (pulseDuration >= slotDuration) throw new RangeError('pulseDurationMs must be shorter than slotDurationMs');

  const activeSlots = chooseDistinctIndexes(cryptoSource, slots, pulses);
  const symbols = activeSlots.map((slotIndex, sequenceIndex) => ({
    sequenceIndex,
    slotIndex,
    frequencyHz: frequencies[randomIndex(cryptoSource, frequencies.length)],
    expectedWindow: {
      start: base + slotIndex * slotDuration,
      end: base + slotIndex * slotDuration + pulseDuration
    }
  }));
  const possibleSlotPatterns = Array.from({ length: pulses }, (_, index) => slots - index).reduce((product, value) => product * value, 1);
  const codeSpaceSize = possibleSlotPatterns * (frequencies.length ** pulses);

  return {
    schemaVersion: '1.0.0',
    kind: 'acoustic-codeword-challenge',
    nonce: randomNonce(cryptoSource),
    baseStartPerformanceTime: base,
    slotDurationMs: slotDuration,
    pulseDurationMs: pulseDuration,
    slotCount: slots,
    pulseCount: pulses,
    symbols,
    controlSlotIndexes: Array.from({ length: slots }, (_, index) => index).filter(index => !activeSlots.includes(index)),
    collisionModel: {
      assumptions: 'uniform independent frequency choices and ordered sampling without replacement for active slots',
      codeSpaceSize,
      randomExactMatchProbability: 1 / codeSpaceSize
    }
  };
}

export function classifyAcousticCodewordResponse({
  challenge,
  detections = [],
  frequencyToleranceHz = 8,
  temporalToleranceMs = 45
} = {}) {
  if (!challenge || challenge.kind !== 'acoustic-codeword-challenge') throw new TypeError('valid challenge is required');
  if (!Array.isArray(detections)) throw new TypeError('detections must be an array');
  const frequencyTolerance = positive(frequencyToleranceHz, 'frequencyToleranceHz');
  const temporalTolerance = positive(temporalToleranceMs, 'temporalToleranceMs');

  const normalized = detections.map((detection, index) => {
    if (!detection || typeof detection !== 'object') throw new TypeError(`detections[${index}] must be an object`);
    const frequencyHz = positive(detection.frequencyHz, `detections[${index}].frequencyHz`);
    const start = finite(detection.startPerformanceTime, `detections[${index}].startPerformanceTime`);
    const end = finite(detection.endPerformanceTime ?? start, `detections[${index}].endPerformanceTime`);
    if (end < start) throw new RangeError(`detections[${index}].endPerformanceTime must be >= start`);
    return { frequencyHz, start, end };
  });

  const symbolResults = challenge.symbols.map(symbol => {
    const windowStart = symbol.expectedWindow.start - temporalTolerance;
    const windowEnd = symbol.expectedWindow.end + temporalTolerance;
    const matches = normalized.filter(detection =>
      Math.abs(detection.frequencyHz - symbol.frequencyHz) <= frequencyTolerance &&
      detection.end >= windowStart && detection.start <= windowEnd
    );
    return { sequenceIndex: symbol.sequenceIndex, slotIndex: symbol.slotIndex, matchCount: matches.length };
  });

  const activeMatchCount = symbolResults.filter(result => result.matchCount === 1).length;
  const duplicateActiveHits = symbolResults.reduce((sum, result) => sum + Math.max(0, result.matchCount - 1), 0);
  const controlHits = normalized.filter(detection => challenge.controlSlotIndexes.some(slotIndex => {
    const start = challenge.baseStartPerformanceTime + slotIndex * challenge.slotDurationMs - temporalTolerance;
    const end = challenge.baseStartPerformanceTime + slotIndex * challenge.slotDurationMs + challenge.pulseDurationMs + temporalTolerance;
    return detection.end >= start && detection.start <= end && challenge.symbols.some(symbol => Math.abs(detection.frequencyHz - symbol.frequencyHz) <= frequencyTolerance);
  })).length;

  let classification = 'absent_or_incomplete';
  if (activeMatchCount === challenge.pulseCount && duplicateActiveHits === 0 && controlHits === 0) classification = 'codeword_consistent';
  else if (controlHits > 0 || duplicateActiveHits > 0) classification = 'ambiguous_or_replayed';

  return {
    schemaVersion: '1.0.0',
    kind: 'acoustic-codeword-response-classification',
    challengeNonce: challenge.nonce,
    classification,
    acceptedAsCodewordResponse: classification === 'codeword_consistent',
    symbolResults,
    activeMatchCount,
    duplicateActiveHits,
    controlHits,
    claimBoundary: {
      supports: classification === 'codeword_consistent'
        ? 'the full randomized frequency-time codeword appeared once in the declared active windows and not in control windows'
        : 'the observations did not uniquely reproduce the full randomized codeword',
      doesNotProve: 'that the listener consciously heard the codeword, that the browser was the only source, or that the microphone and random source were uncompromised',
      falsification: 'omit, reorder, duplicate, alter, or replay any symbol in a control slot; acceptance must fail'
    }
  };
}
