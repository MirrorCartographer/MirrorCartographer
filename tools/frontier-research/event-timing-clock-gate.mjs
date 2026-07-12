const TOKEN = /^[A-Za-z0-9._:-]{1,128}$/;

export function collectEventTimingClockPacket(runtime = globalThis, options = {}) {
  const performanceObject = runtime?.performance;
  const timeOriginMs = Number(performanceObject?.timeOrigin);
  const nowMs = typeof performanceObject?.now === 'function'
    ? Number(performanceObject.now())
    : NaN;

  return {
    schema_version: '1.0.0',
    collector: 'event-timing-clock-packet',
    navigation_id: validToken(options.navigationId),
    time_origin_ms: finiteNonNegative(timeOriginMs),
    collected_monotonic_ms: finiteNonNegative(nowMs)
  };
}

export function evaluateEventTimingClockBinding(input = {}) {
  const packet = input.packet ?? {};
  const replay = input.replay ?? {};
  const maxAgeMs = finitePositive(input.maxAgeMs) ?? 30_000;
  const originToleranceMs = finiteNonNegative(input.originToleranceMs) ?? 1;

  const result = {
    schema_version: '1.0.0',
    claim_state: 'unresolved',
    clock_binding_valid: false,
    navigation_id: validToken(packet.navigation_id),
    packet_age_ms: null,
    max_age_ms: maxAgeMs,
    privacy_boundary: {
      retains: ['opaque navigation id', 'bounded packet age', 'clock-binding validity'],
      excludes: ['raw time origin', 'raw monotonic timestamps', 'wall-clock timestamp', 'event names', 'event targets', 'selectors']
    },
    reason: ''
  };

  if (packet.collector !== 'event-timing-clock-packet') return fail(result, 'unexpected_collector');
  if (!result.navigation_id || result.navigation_id !== validToken(replay.navigation_id)) return fail(result, 'navigation_identity_mismatch');

  const packetOrigin = finiteNonNegative(packet.time_origin_ms);
  const replayOrigin = finiteNonNegative(replay.time_origin_ms);
  const collected = finiteNonNegative(packet.collected_monotonic_ms);
  const evaluated = finiteNonNegative(replay.evaluated_monotonic_ms);
  const windowStart = finiteNonNegative(replay.window_start_monotonic_ms);
  const windowEnd = finiteNonNegative(replay.window_end_monotonic_ms);

  if ([packetOrigin, replayOrigin, collected, evaluated, windowStart, windowEnd].some((value) => value === null)) {
    return fail(result, 'invalid_clock_fields');
  }
  if (Math.abs(packetOrigin - replayOrigin) > originToleranceMs) return fail(result, 'time_origin_mismatch');
  if (windowEnd < windowStart) return fail(result, 'replay_window_reversed');
  if (evaluated < windowEnd) return fail(result, 'evaluation_precedes_replay_end');
  if (evaluated < collected) return fail(result, 'monotonic_clock_reversed');

  const age = roundMillis(evaluated - collected);
  result.packet_age_ms = age;
  if (age > maxAgeMs) return fail(result, 'clock_packet_stale');
  if (collected > windowEnd) return fail(result, 'capability_collected_after_replay_window');

  result.claim_state = 'observed';
  result.clock_binding_valid = true;
  result.reason = 'capability and replay evidence share an opaque navigation identity and compatible monotonic clock domain within the freshness budget';
  return result;
}

function validToken(value) { return typeof value === 'string' && TOKEN.test(value) ? value : null; }
function finiteNonNegative(value) { return Number.isFinite(value) && value >= 0 ? value : null; }
function finitePositive(value) { return Number.isFinite(value) && value > 0 ? value : null; }
function roundMillis(value) { return Math.round(value * 1000) / 1000; }
function fail(result, reason) { result.reason = reason; return result; }
