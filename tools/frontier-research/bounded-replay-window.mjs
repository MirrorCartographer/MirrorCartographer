const TOKEN = /^[A-Za-z0-9._:-]{1,128}$/;

export function validateBoundedReplayWindow(input = {}) {
  const replayId = validToken(input.replayId);
  const interaction = normalizeObserver(input.interaction);
  const frame = normalizeObserver(input.frame);

  const result = {
    replay_id: replayId,
    claim_state: 'unresolved',
    window_integrity: false,
    shared_window: null,
    reason: ''
  };

  if (!replayId) return fail(result, 'invalid_replay_identity');
  if (!interaction.valid) return fail(result, `invalid_interaction_window:${interaction.reason}`);
  if (!frame.valid) return fail(result, `invalid_frame_window:${frame.reason}`);

  if (interaction.navigation_id !== frame.navigation_id) {
    return fail(result, 'navigation_identity_mismatch');
  }
  if (interaction.time_origin_token !== frame.time_origin_token) {
    return fail(result, 'clock_domain_mismatch');
  }
  if (!interaction.drained || !frame.drained) {
    return fail(result, 'observer_buffers_not_drained');
  }
  if (interaction.dropped_entries !== 0 || frame.dropped_entries !== 0) {
    return fail(result, 'dropped_entries_make_window_incomplete');
  }

  const start = Math.max(interaction.window_start_ms, frame.window_start_ms);
  const end = Math.min(interaction.window_end_ms, frame.window_end_ms);
  if (!(end > start)) return fail(result, 'observer_windows_do_not_overlap');

  const unionStart = Math.min(interaction.window_start_ms, frame.window_start_ms);
  const unionEnd = Math.max(interaction.window_end_ms, frame.window_end_ms);
  const overlap = end - start;
  const union = unionEnd - unionStart;
  const overlapRatio = union > 0 ? overlap / union : 0;
  const required = finiteRatio(input.minimumOverlapRatio, 0.9);

  if (overlapRatio < required) {
    return fail(result, 'observer_window_overlap_below_threshold');
  }

  result.claim_state = 'observed';
  result.window_integrity = true;
  result.shared_window = {
    navigation_id: interaction.navigation_id,
    time_origin_token: interaction.time_origin_token,
    start_ms: round(start),
    end_ms: round(end),
    duration_ms: round(overlap),
    overlap_ratio: round(overlapRatio),
    minimum_overlap_ratio: required
  };
  result.reason = 'both observer summaries were collected from the same navigation and clock domain, drained without known drops, and covered a sufficiently overlapping bounded interval';
  return result;
}

function normalizeObserver(value = {}) {
  const navigationId = validToken(value.navigationId);
  const timeOriginToken = validToken(value.timeOriginToken);
  const start = finiteMs(value.windowStartMs);
  const end = finiteMs(value.windowEndMs);
  const dropped = nonnegativeInt(value.droppedEntries);
  if (!navigationId) return { valid: false, reason: 'invalid_navigation_identity' };
  if (!timeOriginToken) return { valid: false, reason: 'invalid_time_origin_token' };
  if (start === null || end === null || !(end > start)) return { valid: false, reason: 'invalid_window_bounds' };
  if (dropped === null) return { valid: false, reason: 'invalid_dropped_entry_count' };
  if (typeof value.drained !== 'boolean') return { valid: false, reason: 'missing_drain_state' };
  return {
    valid: true,
    navigation_id: navigationId,
    time_origin_token: timeOriginToken,
    window_start_ms: start,
    window_end_ms: end,
    dropped_entries: dropped,
    drained: value.drained
  };
}

function validToken(value) { return typeof value === 'string' && TOKEN.test(value) ? value : null; }
function finiteMs(value) { return Number.isFinite(value) && value >= 0 ? value : null; }
function nonnegativeInt(value) { return Number.isInteger(value) && value >= 0 ? value : null; }
function finiteRatio(value, fallback) { return Number.isFinite(value) && value > 0 && value <= 1 ? value : fallback; }
function round(value) { return Math.round(value * 1000) / 1000; }
function fail(result, reason) { result.reason = reason; return result; }
