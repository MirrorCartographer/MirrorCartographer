const DEFAULT_FREQUENCIES = Object.freeze([523.25, 659.25, 783.99, 932.33]);

function assertFinitePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new TypeError(`${name} must be a positive finite number`);
}

function toBytes(entropyBytes) {
  if (entropyBytes instanceof Uint8Array) return entropyBytes;
  if (Array.isArray(entropyBytes)) return Uint8Array.from(entropyBytes);
  throw new TypeError("entropyBytes must be a Uint8Array or byte array");
}

function hex(bytes) {
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

export function createAcousticChallenge({
  entropyBytes,
  frequencies = DEFAULT_FREQUENCIES,
  pulseMs = 180,
  gapMs = 120,
  startDelayMs = 80,
  pulseCount = 6,
} = {}) {
  const bytes = toBytes(entropyBytes);
  if (bytes.length < pulseCount) throw new RangeError("entropyBytes must contain at least pulseCount bytes");
  if (!Array.isArray(frequencies) || frequencies.length < 2) throw new TypeError("frequencies must contain at least two values");
  frequencies.forEach((value, index) => assertFinitePositive(value, `frequencies[${index}]`));
  [pulseMs, gapMs, startDelayMs].forEach((value, index) => assertFinitePositive(value, ["pulseMs", "gapMs", "startDelayMs"][index]));
  if (!Number.isInteger(pulseCount) || pulseCount < 3 || pulseCount > 32) throw new RangeError("pulseCount must be an integer from 3 to 32");

  const pulses = [];
  let previousIndex = -1;
  for (let index = 0; index < pulseCount; index += 1) {
    let frequencyIndex = bytes[index] % frequencies.length;
    if (frequencyIndex === previousIndex) frequencyIndex = (frequencyIndex + 1) % frequencies.length;
    previousIndex = frequencyIndex;
    const startMs = startDelayMs + index * (pulseMs + gapMs);
    pulses.push({
      index,
      frequencyHz: frequencies[frequencyIndex],
      startMs,
      endMs: startMs + pulseMs,
    });
  }

  return {
    schemaVersion: "1.0.0",
    challengeId: hex(bytes.slice(0, Math.min(16, bytes.length))),
    pulseMs,
    gapMs,
    startDelayMs,
    pulses,
    sourceStatus: "browser-scheduled",
    claimLimit: "The challenge specifies intended browser output; it does not prove that a speaker emitted it.",
  };
}

export function scoreAcousticChallenge({
  challenge,
  detections = [],
  timingToleranceMs = 90,
  frequencyToleranceRatio = 0.025,
  minimumSnrDb = 6,
  acceptanceRatio = 0.8,
} = {}) {
  if (!challenge || !Array.isArray(challenge.pulses)) throw new TypeError("challenge.pulses is required");
  if (!Array.isArray(detections)) throw new TypeError("detections must be an array");
  assertFinitePositive(timingToleranceMs, "timingToleranceMs");
  assertFinitePositive(frequencyToleranceRatio, "frequencyToleranceRatio");
  assertFinitePositive(minimumSnrDb, "minimumSnrDb");
  if (!(acceptanceRatio > 0 && acceptanceRatio <= 1)) throw new RangeError("acceptanceRatio must be in (0, 1]");

  const unused = new Set(detections.map((_, index) => index));
  const matches = challenge.pulses.map((pulse) => {
    let best = null;
    for (const detectionIndex of unused) {
      const detection = detections[detectionIndex];
      if (![detection.timeMs, detection.frequencyHz, detection.snrDb].every(Number.isFinite)) continue;
      const timingErrorMs = Math.abs(detection.timeMs - (pulse.startMs + pulse.endMs) / 2);
      const frequencyErrorRatio = Math.abs(detection.frequencyHz - pulse.frequencyHz) / pulse.frequencyHz;
      if (timingErrorMs <= timingToleranceMs
          && frequencyErrorRatio <= frequencyToleranceRatio
          && detection.snrDb >= minimumSnrDb) {
        const score = timingErrorMs / timingToleranceMs + frequencyErrorRatio / frequencyToleranceRatio;
        if (!best || score < best.score) best = { detectionIndex, timingErrorMs, frequencyErrorRatio, score };
      }
    }
    if (best) unused.delete(best.detectionIndex);
    return {
      pulseIndex: pulse.index,
      matched: Boolean(best),
      detectionIndex: best?.detectionIndex ?? null,
      timingErrorMs: best?.timingErrorMs ?? null,
      frequencyErrorRatio: best?.frequencyErrorRatio ?? null,
    };
  });

  const matchedCount = matches.filter((entry) => entry.matched).length;
  const matchRatio = challenge.pulses.length ? matchedCount / challenge.pulses.length : 0;
  const accepted = matchRatio >= acceptanceRatio;

  return {
    schemaVersion: "1.0.0",
    challengeId: challenge.challengeId,
    matchedCount,
    pulseCount: challenge.pulses.length,
    matchRatio,
    accepted,
    claimState: accepted ? "acoustic-sequence-correlated" : "attribution-unproven",
    matches,
    unmatchedDetectionCount: unused.size,
    evidenceStrength: accepted ? "corroborating-device-level" : "insufficient",
    uncertainty: [
      "A nearby source could reproduce the same sequence.",
      "Clock alignment and detector frequency resolution can cause false negatives.",
      "Correlation supports attribution but does not prove listener perception.",
    ],
    falsificationRoute: "Replay with a newly generated challenge; reject attribution if the detector cannot match the new time-frequency sequence above threshold.",
  };
}

export function scheduleAcousticChallenge(audioContext, destination, challenge, { gainValue = 0.08 } = {}) {
  if (!audioContext || typeof audioContext.createOscillator !== "function") throw new TypeError("audioContext is required");
  if (!destination) throw new TypeError("destination is required");
  assertFinitePositive(gainValue, "gainValue");
  const baseTime = audioContext.currentTime;
  const nodes = challenge.pulses.map((pulse) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = pulse.frequencyHz;
    gain.gain.setValueAtTime(0, baseTime + pulse.startMs / 1000);
    gain.gain.linearRampToValueAtTime(gainValue, baseTime + (pulse.startMs + 10) / 1000);
    gain.gain.setValueAtTime(gainValue, baseTime + (pulse.endMs - 10) / 1000);
    gain.gain.linearRampToValueAtTime(0, baseTime + pulse.endMs / 1000);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(baseTime + pulse.startMs / 1000);
    oscillator.stop(baseTime + pulse.endMs / 1000);
    return { oscillator, gain };
  });
  return { baseTime, nodes, challengeId: challenge.challengeId };
}
