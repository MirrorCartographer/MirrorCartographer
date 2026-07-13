function reject(reason, details = {}) {
  return Object.freeze({
    accepted: false,
    classification: 'playback_stats_rejected',
    reason,
    details: Object.freeze(details),
    claim_boundary: Object.freeze([
      'does_not_prove_audibility',
      'does_not_identify_the_physical_output_device',
      'does_not_distinguish_application_load_from_external_system_load'
    ])
  });
}

function finiteNonNegative(value) {
  return Number.isFinite(value) && value >= 0;
}

function validSnapshot(value) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    finiteNonNegative(value.underrunDuration) &&
    Number.isSafeInteger(value.underrunEvents) && value.underrunEvents >= 0 &&
    finiteNonNegative(value.totalDuration) &&
    finiteNonNegative(value.averageLatency) &&
    finiteNonNegative(value.minimumLatency) &&
    finiteNonNegative(value.maximumLatency);
}

export function evaluatePlaybackStats({ before, after, elapsedMs, documentVisible = true }) {
  if (before == null || after == null) {
    return Object.freeze({
      accepted: true,
      classification: 'audio_playback_stats_unsupported',
      evidence_strength: 'none',
      design_action: 'retain render-position and user/device-level audibility evidence',
      claim_boundary: Object.freeze([
        'feature absence is not evidence of audio failure',
        'this draft API is not universally implemented'
      ]),
      falsification_route: 'Run in an implementation exposing AudioContext.playbackStats and provide two valid snapshots.'
    });
  }

  if (!validSnapshot(before) || !validSnapshot(after)) return reject('invalid_snapshot');
  if (!finiteNonNegative(elapsedMs)) return reject('invalid_elapsed_ms');
  if (elapsedMs < 1000) {
    return reject('sampling_interval_below_spec_update_period', { minimum_ms: 1000, elapsed_ms: elapsedMs });
  }
  if (after.totalDuration < before.totalDuration ||
      after.underrunDuration < before.underrunDuration ||
      after.underrunEvents < before.underrunEvents) {
    return reject('counter_regression_or_reset');
  }
  if (after.minimumLatency > after.maximumLatency) return reject('latency_bounds_inverted');
  if (after.averageLatency < after.minimumLatency || after.averageLatency > after.maximumLatency) {
    return reject('average_latency_outside_bounds');
  }

  const deltaDuration = after.totalDuration - before.totalDuration;
  const deltaUnderrunDuration = after.underrunDuration - before.underrunDuration;
  const deltaUnderrunEvents = after.underrunEvents - before.underrunEvents;
  const underrunRatio = deltaDuration > 0 ? deltaUnderrunDuration / deltaDuration : null;

  if (!documentVisible && deltaDuration === 0) {
    return Object.freeze({
      accepted: true,
      classification: 'stats_update_privacy_gated_or_idle',
      evidence_strength: 'weak',
      deltas: Object.freeze({ deltaDuration, deltaUnderrunDuration, deltaUnderrunEvents }),
      claim_boundary: Object.freeze([
        'a hidden document may not receive updated statistics',
        'zero change does not prove the audio graph stopped'
      ]),
      falsification_route: 'Repeat while the document is fully active and visible for at least one update interval.'
    });
  }

  if (deltaDuration === 0) {
    return Object.freeze({
      accepted: true,
      classification: 'no_playback_progress_observed',
      evidence_strength: 'weak',
      deltas: Object.freeze({ deltaDuration, deltaUnderrunDuration, deltaUnderrunEvents }),
      claim_boundary: Object.freeze([
        'does_not_prove_context_suspension',
        'does_not_prove_inaudibility'
      ]),
      falsification_route: 'Capture a longer visible-window interval while a scheduled source is connected to the destination.'
    });
  }

  const classification = deltaUnderrunEvents > 0 || deltaUnderrunDuration > 0
    ? 'playback_progress_with_underrun'
    : 'playback_progress_without_reported_underrun';

  return Object.freeze({
    accepted: true,
    classification,
    evidence_strength: 'browser_reported_playback_path_telemetry',
    deltas: Object.freeze({
      totalDuration: deltaDuration,
      underrunDuration: deltaUnderrunDuration,
      underrunEvents: deltaUnderrunEvents,
      underrunRatio
    }),
    latency: Object.freeze({
      average: after.averageLatency,
      minimum: after.minimumLatency,
      maximum: after.maximumLatency
    }),
    claim_boundary: Object.freeze([
      'playback-path progress is stronger than AudioContext.state alone',
      'reported underruns do not identify root cause',
      'absence of reported underruns does not prove human audibility'
    ]),
    falsification_route: 'Induce sustained render overload in a supporting implementation and verify that underrun counters increase after the specified update interval.'
  });
}
