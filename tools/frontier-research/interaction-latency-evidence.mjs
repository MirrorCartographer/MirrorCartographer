const finite = (value) => Number.isFinite(value);
const nonNegative = (value) => finite(value) && value >= 0;

export function classifyInteractionLatency(session = {}) {
  const supported = session.supported === true;
  const observerConfirmed = session.observerConfirmed === true;
  const droppedEntries = Number.isInteger(session.droppedEntries) && session.droppedEntries >= 0
    ? session.droppedEntries
    : 0;
  const entries = Array.isArray(session.entries) ? session.entries : [];

  if (!supported) {
    return {
      claimState: 'unresolved',
      classification: 'unsupported',
      canSupportAbsenceClaim: false,
      reason: 'event timing entry type not supported',
      summary: emptySummary(droppedEntries),
    };
  }

  if (!observerConfirmed) {
    return {
      claimState: 'unresolved',
      classification: 'observation_unconfirmed',
      canSupportAbsenceClaim: false,
      reason: 'observer callback execution was not confirmed',
      summary: emptySummary(droppedEntries),
    };
  }

  const interactions = new Map();
  for (const raw of entries) {
    if (!raw || !nonNegative(raw.startTime) || !nonNegative(raw.duration)) continue;
    if (!nonNegative(raw.processingStart) || !nonNegative(raw.processingEnd)) continue;
    if (raw.processingStart < raw.startTime || raw.processingEnd < raw.processingStart) continue;
    if (!Number.isInteger(raw.interactionId) || raw.interactionId <= 0) continue;

    const inputDelay = raw.processingStart - raw.startTime;
    const processingDuration = raw.processingEnd - raw.processingStart;
    const presentationDelay = Math.max(0, raw.startTime + raw.duration - raw.processingEnd);
    const aggregate = interactions.get(raw.interactionId) ?? {
      interactionId: raw.interactionId,
      duration: 0,
      inputDelay: 0,
      processingDuration: 0,
      presentationDelay: 0,
      eventCount: 0,
    };

    aggregate.duration = Math.max(aggregate.duration, raw.duration);
    aggregate.inputDelay = Math.max(aggregate.inputDelay, inputDelay);
    aggregate.processingDuration = Math.max(aggregate.processingDuration, processingDuration);
    aggregate.presentationDelay = Math.max(aggregate.presentationDelay, presentationDelay);
    aggregate.eventCount += 1;
    interactions.set(raw.interactionId, aggregate);
  }

  const values = [...interactions.values()];
  const worst = values.reduce((current, candidate) => {
    if (!current || candidate.duration > current.duration) return candidate;
    return current;
  }, null);

  const summary = {
    interactionCount: values.length,
    observedEventCount: values.reduce((sum, item) => sum + item.eventCount, 0),
    droppedEntries,
    worstDurationMs: worst?.duration ?? 0,
    worstInputDelayMs: worst?.inputDelay ?? 0,
    worstProcessingDurationMs: worst?.processingDuration ?? 0,
    worstPresentationDelayMs: worst?.presentationDelay ?? 0,
  };

  if (droppedEntries > 0) {
    return {
      claimState: 'observed',
      classification: worst ? classifyWorst(worst) : 'known_incomplete',
      canSupportAbsenceClaim: false,
      reason: 'observation is incomplete because entries were dropped',
      summary,
    };
  }

  if (!worst) {
    return {
      claimState: 'observed',
      classification: 'no_qualifying_interaction_observed',
      canSupportAbsenceClaim: true,
      reason: 'supported bounded observation completed with no qualifying interaction entries',
      summary,
    };
  }

  return {
    claimState: 'observed',
    classification: classifyWorst(worst),
    canSupportAbsenceClaim: false,
    reason: 'one or more qualifying interaction entries were observed',
    summary,
  };
}

function classifyWorst(worst) {
  // Project heuristics, not thresholds from the Event Timing specification.
  if (worst.duration >= 500) return 'very_slow_interaction';
  if (worst.duration >= 200) return 'slow_interaction';
  return 'interaction_observed';
}

function emptySummary(droppedEntries) {
  return {
    interactionCount: 0,
    observedEventCount: 0,
    droppedEntries,
    worstDurationMs: 0,
    worstInputDelayMs: 0,
    worstProcessingDurationMs: 0,
    worstPresentationDelayMs: 0,
  };
}
