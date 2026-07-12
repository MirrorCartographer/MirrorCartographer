const TOKEN = /^[A-Za-z0-9._:-]{1,128}$/;

export function evaluateEventTimingCapability(input = {}) {
  const supported = Array.isArray(input.supportedEntryTypes)
    ? [...new Set(input.supportedEntryTypes.filter((value) => typeof value === 'string'))].sort()
    : [];
  const requestedThreshold = normalizeThreshold(input.durationThresholdMs);
  const observedThreshold = Math.max(16, requestedThreshold ?? 104);
  const result = {
    claim_state: 'unresolved',
    capability_valid: false,
    navigation_id: validToken(input.navigationId),
    supported_entry_types: supported,
    requested_duration_threshold_ms: requestedThreshold,
    effective_minimum_threshold_ms: observedThreshold,
    first_input_exception_expected: true,
    interaction_grouping_available: input.interactionIdAvailable === true,
    event_counts_available: input.eventCountsAvailable === true,
    privacy_boundary: {
      retains: ['opaque navigation id', 'capability flags', 'duration threshold'],
      excludes: ['event names', 'event targets', 'selectors', 'raw timing entries']
    },
    reason: ''
  };

  if (!result.navigation_id) return fail(result, 'invalid_navigation_identity');
  if (!supported.includes('event')) return fail(result, 'event_entry_type_unsupported');
  if (!supported.includes('first-input')) return fail(result, 'first_input_entry_type_unsupported');
  if (requestedThreshold === null) return fail(result, 'invalid_duration_threshold');
  if (requestedThreshold < 16) return fail(result, 'duration_threshold_below_spec_minimum');
  if (input.interactionIdAvailable !== true) return fail(result, 'interaction_grouping_unavailable');

  result.claim_state = 'observed';
  result.capability_valid = true;
  result.reason = input.eventCountsAvailable === true
    ? 'event timing, first input, interaction grouping, and event-count cross-checking are available for bounded replay collection'
    : 'event timing, first input, and interaction grouping are available; event-count completeness cross-checking is unavailable';
  return result;
}

function normalizeThreshold(value) {
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 1000) / 1000 : null;
}
function validToken(value) { return typeof value === 'string' && TOKEN.test(value) ? value : null; }
function fail(result, reason) { result.reason = reason; return result; }
