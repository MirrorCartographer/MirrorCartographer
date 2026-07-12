const ALLOWED_INTERACTION_STATES = new Set([
  'unsupported', 'observation_unconfirmed', 'known_incomplete',
  'no_qualifying_interaction_observed', 'interaction_observed',
  'slow_interaction', 'very_slow_interaction'
]);
const ALLOWED_FRAME_STATES = new Set([
  'unsupported', 'unconfirmed', 'known_incomplete', 'bounded_no_observation',
  'congestion_observed', 'severe_congestion_observed'
]);

export function combineGestureReplayEvidence(input = {}) {
  const replayId = typeof input.replayId === 'string' && /^[a-zA-Z0-9._:-]{1,96}$/.test(input.replayId)
    ? input.replayId : null;
  const interaction = input.interaction ?? {};
  const frame = input.frame ?? {};

  if (!replayId) return unresolved('invalid_replay_identity');
  if (!ALLOWED_INTERACTION_STATES.has(interaction.classification)) {
    return unresolved('invalid_interaction_classification', replayId);
  }
  if (!ALLOWED_FRAME_STATES.has(frame.state)) {
    return unresolved('invalid_frame_classification', replayId);
  }

  const interactionComplete = interaction.claimState === 'observed' &&
    interaction.summary && interaction.summary.droppedEntries === 0;
  const frameComplete = frame.observation_complete === true &&
    frame.privacy_safe_summary && Number.isFinite(frame.privacy_safe_summary.entry_count);

  const packet = {
    replay_id: replayId,
    claim_state: 'observed',
    observation_complete: interactionComplete && frameComplete,
    diagnosis: 'undetermined',
    confidence: 'insufficient',
    interaction: sanitizeInteraction(interaction.summary),
    frame: sanitizeFrame(frame.privacy_safe_summary),
    reason: ''
  };

  if (!packet.observation_complete) {
    packet.claim_state = 'unresolved';
    packet.reason = 'one or both observers were unsupported, unconfirmed, malformed, or incomplete';
    return packet;
  }

  const duration = packet.interaction.worst_duration_ms;
  const inputDelay = packet.interaction.worst_input_delay_ms;
  const processing = packet.interaction.worst_processing_duration_ms;
  const presentation = packet.interaction.worst_presentation_delay_ms;
  const congestion = packet.frame.entry_count > 0;
  const severeCongestion = packet.frame.severe_frame_count > 0;

  if (duration === 0 && !congestion) {
    packet.diagnosis = 'bounded_no_latency_signal';
    packet.confidence = 'bounded';
    packet.reason = 'both complete observers reported no qualifying latency signal in this replay';
    return packet;
  }

  const components = [
    ['input_delay_dominant', inputDelay],
    ['handler_work_dominant', processing],
    ['presentation_delay_dominant', presentation]
  ].sort((a, b) => b[1] - a[1]);
  const [dominant, dominantMs] = components[0];
  const secondMs = components[1][1];

  if (severeCongestion && (dominant === 'handler_work_dominant' || dominant === 'presentation_delay_dominant')) {
    packet.diagnosis = `${dominant}_with_severe_main_thread_congestion`;
    packet.confidence = dominantMs >= secondMs * 1.25 ? 'strong_association' : 'mixed_association';
  } else if (congestion) {
    packet.diagnosis = `${dominant}_with_main_thread_congestion`;
    packet.confidence = dominantMs >= secondMs * 1.25 ? 'association' : 'mixed_association';
  } else {
    packet.diagnosis = dominant;
    packet.confidence = dominantMs >= secondMs * 1.25 ? 'component_dominance' : 'mixed_components';
  }
  packet.reason = 'diagnosis compares aggregate timing components from the same bounded replay; it does not establish causation';
  return packet;
}

function sanitizeInteraction(summary = {}) {
  return {
    interaction_count: safeInt(summary.interactionCount),
    observed_event_count: safeInt(summary.observedEventCount),
    dropped_entries: safeInt(summary.droppedEntries),
    worst_duration_ms: safeMs(summary.worstDurationMs),
    worst_input_delay_ms: safeMs(summary.worstInputDelayMs),
    worst_processing_duration_ms: safeMs(summary.worstProcessingDurationMs),
    worst_presentation_delay_ms: safeMs(summary.worstPresentationDelayMs)
  };
}

function sanitizeFrame(summary = {}) {
  return {
    entry_count: safeInt(summary.entry_count),
    max_duration_ms: safeMs(summary.max_duration_ms),
    total_blocking_duration_ms: safeMs(summary.total_blocking_duration_ms),
    rendering_frame_count: safeInt(summary.rendering_frame_count),
    severe_frame_count: safeInt(summary.severe_frame_count),
    max_style_layout_window_ms: safeMs(summary.max_style_layout_window_ms)
  };
}

function safeInt(value) { return Number.isInteger(value) && value >= 0 ? value : 0; }
function safeMs(value) { return Number.isFinite(value) && value >= 0 ? Math.round(value * 1000) / 1000 : 0; }
function unresolved(reason, replayId = null) {
  return { replay_id: replayId, claim_state: 'unresolved', observation_complete: false, diagnosis: 'undetermined', confidence: 'insufficient', interaction: null, frame: null, reason };
}
