const VALID_MODES = new Set(['buffered-default', 'live-threshold']);

export function evaluateEventTimingCoverage(packet) {
  const reasons = [];
  if (!packet || typeof packet !== 'object') reasons.push('packet_required');
  const mode = packet?.observerMode;
  if (!VALID_MODES.has(mode)) reasons.push('observer_mode_invalid');

  const threshold = packet?.durationThresholdMs;
  if (!Number.isFinite(threshold)) reasons.push('duration_threshold_required');
  if (mode === 'buffered-default' && threshold !== 104) reasons.push('buffered_threshold_must_be_104');
  if (mode === 'live-threshold' && threshold < 16) reasons.push('live_threshold_below_spec_floor');

  const entries = packet?.observedEntries;
  const interactionCount = packet?.interactionCount;
  if (!Number.isInteger(entries) || entries < 0) reasons.push('observed_entries_invalid');
  if (!Number.isInteger(interactionCount) || interactionCount < 0) reasons.push('interaction_count_invalid');
  if (Number.isInteger(entries) && Number.isInteger(interactionCount) && entries > interactionCount && interactionCount > 0) {
    reasons.push('entries_exceed_interactions');
  }

  const completeWindow = packet?.observerStartedBeforeFirstInteraction === true;
  const countAvailable = packet?.interactionCountAvailable === true;
  const canInterpretAbsence = mode === 'live-threshold' && completeWindow && countAvailable && interactionCount === 0;
  const coverage = reasons.length ? 'invalid' : canInterpretAbsence ? 'absence_interpretable' : 'partial';

  return {
    accepted: reasons.length === 0,
    coverage,
    reasons,
    epistemicLimit: coverage === 'absence_interpretable'
      ? 'No qualifying interactions were counted during a fully observed navigation window.'
      : 'Missing Event Timing entries do not prove that no interactions occurred or that responsiveness was good.'
  };
}
