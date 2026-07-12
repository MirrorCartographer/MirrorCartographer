const TOKEN = /^[A-Za-z0-9._:-]{1,128}$/;

export function evaluateEventTimingIntegration(input = {}, options = {}) {
  const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  const maxAgeMs = Number.isFinite(options.maxAgeMs) ? options.maxAgeMs : 10 * 60 * 1000;
  const packet = input.capabilityPacket;
  const replay = input.replayWindow;

  const result = {
    schema_version: '1.0.0',
    claim_state: 'unresolved',
    integration_valid: false,
    navigation_id: validToken(input.navigationId),
    capability_collected_at: normalizeTimestamp(packet?.collected_at),
    capability_age_ms: null,
    replay_navigation_id: validToken(replay?.navigation_id),
    capability_reason: typeof packet?.reason === 'string' ? packet.reason : null,
    reason: '',
    privacy_boundary: {
      retains: ['opaque navigation id', 'capability validity', 'collector timestamp', 'replay window bounds'],
      excludes: ['event names', 'event targets', 'selectors', 'raw timing entries', 'user-agent strings']
    }
  };

  if (!result.navigation_id) return fail(result, 'invalid_navigation_identity');
  if (!packet || packet.schema_version !== '1.0.0') return fail(result, 'invalid_capability_packet');
  if (packet.collector !== 'event-timing-capability-collector') return fail(result, 'unexpected_capability_collector');
  if (packet.capability_valid !== true || packet.claim_state !== 'observed') {
    return fail(result, 'capability_not_observed');
  }
  if (packet.navigation_id !== result.navigation_id) return fail(result, 'capability_navigation_mismatch');
  if (!result.capability_collected_at) return fail(result, 'invalid_capability_timestamp');

  result.capability_age_ms = Math.max(0, nowMs - Date.parse(result.capability_collected_at));
  if (result.capability_age_ms > maxAgeMs) return fail(result, 'stale_capability_packet');

  if (!replay || replay.schema_version !== '1.0.0') return fail(result, 'invalid_replay_window');
  if (result.replay_navigation_id !== result.navigation_id) return fail(result, 'replay_navigation_mismatch');
  if (!finiteNonNegative(replay.window_start_ms) || !finiteNonNegative(replay.window_end_ms)) {
    return fail(result, 'invalid_replay_window_bounds');
  }
  if (replay.window_end_ms < replay.window_start_ms) return fail(result, 'replay_window_reversed');
  if (replay.capability_valid !== true) return fail(result, 'replay_missing_capability_acceptance');

  result.claim_state = 'observed';
  result.integration_valid = true;
  result.reason = 'capability packet is observed, fresh, navigation-bound, and accepted by the replay window';
  return result;
}

function validToken(value) {
  return typeof value === 'string' && TOKEN.test(value) ? value : null;
}
function normalizeTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : null;
}
function finiteNonNegative(value) {
  return Number.isFinite(value) && value >= 0;
}
function fail(result, reason) {
  result.reason = reason;
  return result;
}
