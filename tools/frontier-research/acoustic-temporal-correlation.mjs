function finite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
}

function nonNegative(value, name) {
  finite(value, name);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
  return value;
}

export function classifyAcousticTemporalCorrelation({
  scheduledContextTime,
  outputTimestamp,
  detection,
  pulseDurationMs,
  captureDelayRangeMs = { min: 0, max: 250 },
  toleranceMs = 35,
  maxProjectionSeconds = 0.5
} = {}) {
  if (!outputTimestamp || typeof outputTimestamp !== 'object') throw new TypeError('outputTimestamp must be an object');
  if (!detection || typeof detection !== 'object') throw new TypeError('detection must be an object');
  if (!captureDelayRangeMs || typeof captureDelayRangeMs !== 'object') throw new TypeError('captureDelayRangeMs must be an object');

  const scheduled = nonNegative(scheduledContextTime, 'scheduledContextTime');
  const contextTime = nonNegative(outputTimestamp.contextTime, 'outputTimestamp.contextTime');
  const performanceTime = nonNegative(outputTimestamp.performanceTime, 'outputTimestamp.performanceTime');
  const detectedStart = nonNegative(detection.startPerformanceTime, 'detection.startPerformanceTime');
  const detectedEnd = nonNegative(detection.endPerformanceTime ?? detection.startPerformanceTime, 'detection.endPerformanceTime');
  const duration = nonNegative(pulseDurationMs, 'pulseDurationMs');
  const minDelay = nonNegative(captureDelayRangeMs.min, 'captureDelayRangeMs.min');
  const maxDelay = nonNegative(captureDelayRangeMs.max, 'captureDelayRangeMs.max');
  const tolerance = nonNegative(toleranceMs, 'toleranceMs');
  const maxProjection = nonNegative(maxProjectionSeconds, 'maxProjectionSeconds');

  if (detectedEnd < detectedStart) throw new RangeError('detection.endPerformanceTime must be >= startPerformanceTime');
  if (maxDelay < minDelay) throw new RangeError('captureDelayRangeMs.max must be >= min');

  const projectionSeconds = scheduled - contextTime;
  const timestampUsable = contextTime > 0 && performanceTime > 0 && projectionSeconds >= 0 && projectionSeconds <= maxProjection;
  const expectedRenderPerformanceTime = performanceTime + projectionSeconds * 1000;
  const expectedWindow = {
    start: expectedRenderPerformanceTime + minDelay - tolerance,
    end: expectedRenderPerformanceTime + duration + maxDelay + tolerance
  };
  const overlapsExpectedWindow = timestampUsable && detectedEnd >= expectedWindow.start && detectedStart <= expectedWindow.end;

  const reasons = [];
  if (contextTime === 0 || performanceTime === 0) reasons.push('output_timestamp_not_started');
  if (projectionSeconds < 0) reasons.push('scheduled_time_precedes_output_position');
  if (projectionSeconds > maxProjection) reasons.push('projection_too_far_from_output_timestamp');
  if (timestampUsable && !overlapsExpectedWindow) reasons.push('detection_outside_expected_window');

  const classification = overlapsExpectedWindow ? 'temporally_correlated' : 'not_temporally_correlated';
  return {
    schemaVersion: '1.0.0',
    kind: 'acoustic-temporal-correlation',
    classification,
    acceptedAsTemporalCorrelation: overlapsExpectedWindow,
    projectionSeconds,
    expectedRenderPerformanceTime,
    expectedDetectionWindow: expectedWindow,
    observedDetectionWindow: { start: detectedStart, end: detectedEnd },
    reasons,
    claimBoundary: {
      supports: overlapsExpectedWindow
        ? 'the microphone detection occurred within a declared delay-and-tolerance window derived from the Web Audio output timestamp and scheduled pulse time'
        : 'the available timing observations did not satisfy the declared temporal-correlation gate',
      doesNotProve: 'that the browser caused the detected tone, that the listener heard it, or that the output route and microphone route were physically distinct',
      falsification: 'shift the diagnostic pulse schedule or replay an off-window tone; accepted temporal correlation must fail when the detection no longer overlaps the predicted window'
    }
  };
}
