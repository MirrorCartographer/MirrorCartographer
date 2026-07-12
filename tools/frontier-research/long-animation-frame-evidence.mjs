const ENTRY_TYPE = 'long-animation-frame';

function finiteNonNegative(value) {
  return Number.isFinite(value) && value >= 0;
}

export function classifyLongAnimationFrameEvidence(input = {}) {
  const supportedEntryTypes = Array.isArray(input.supportedEntryTypes)
    ? input.supportedEntryTypes
    : [];
  const supported = supportedEntryTypes.includes(ENTRY_TYPE);
  const callbackCount = Number.isInteger(input.callbackCount) && input.callbackCount >= 0
    ? input.callbackCount
    : 0;
  const droppedEntriesCount = Number.isInteger(input.droppedEntriesCount) && input.droppedEntriesCount >= 0
    ? input.droppedEntriesCount
    : 0;
  const entries = Array.isArray(input.entries) ? input.entries : [];

  if (!supported) {
    return {
      state: 'unsupported',
      absence_claim_allowed: false,
      observation_complete: false,
      privacy_safe_summary: null,
      reason: 'long-animation-frame is not reported as a supported entry type'
    };
  }

  if (callbackCount === 0) {
    return {
      state: 'unconfirmed',
      absence_claim_allowed: false,
      observation_complete: false,
      privacy_safe_summary: null,
      reason: 'observer support exists but no callback execution was confirmed'
    };
  }

  const valid = entries.filter((entry) =>
    entry && entry.entryType === ENTRY_TYPE &&
    finiteNonNegative(entry.duration) &&
    finiteNonNegative(entry.blockingDuration) &&
    finiteNonNegative(entry.renderStart) &&
    finiteNonNegative(entry.styleAndLayoutStart)
  );

  const summary = valid.reduce((acc, entry) => {
    acc.entry_count += 1;
    acc.max_duration_ms = Math.max(acc.max_duration_ms, entry.duration);
    acc.total_blocking_duration_ms += entry.blockingDuration;
    const rendering = entry.renderStart > 0;
    if (rendering) acc.rendering_frame_count += 1;
    if (entry.styleAndLayoutStart > 0 && rendering) {
      acc.max_style_layout_window_ms = Math.max(
        acc.max_style_layout_window_ms,
        Math.max(0, entry.duration - (entry.styleAndLayoutStart - entry.startTime || 0))
      );
    }
    if (entry.duration >= 200 || entry.blockingDuration >= 150) acc.severe_frame_count += 1;
    return acc;
  }, {
    entry_count: 0,
    max_duration_ms: 0,
    total_blocking_duration_ms: 0,
    rendering_frame_count: 0,
    severe_frame_count: 0,
    max_style_layout_window_ms: 0
  });

  for (const key of ['max_duration_ms', 'total_blocking_duration_ms', 'max_style_layout_window_ms']) {
    summary[key] = Math.round(summary[key] * 1000) / 1000;
  }

  const complete = droppedEntriesCount === 0;
  if (!complete) {
    return {
      state: 'known_incomplete',
      absence_claim_allowed: false,
      observation_complete: false,
      privacy_safe_summary: summary,
      reason: 'the observer reported dropped entries'
    };
  }

  if (summary.entry_count === 0) {
    return {
      state: 'bounded_no_observation',
      absence_claim_allowed: true,
      observation_complete: true,
      privacy_safe_summary: summary,
      reason: 'supported observer executed with no dropped entries and observed no long animation frames in the bounded session'
    };
  }

  return {
    state: summary.severe_frame_count > 0 ? 'severe_congestion_observed' : 'congestion_observed',
    absence_claim_allowed: false,
    observation_complete: true,
    privacy_safe_summary: summary,
    reason: 'one or more long animation frames were observed'
  };
}
