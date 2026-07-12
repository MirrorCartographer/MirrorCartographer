const finiteNonNegative = (value) => Number.isFinite(value) && value >= 0;

function normalizeInterval(entry = {}, kind) {
  if (!finiteNonNegative(entry.startTime) || !finiteNonNegative(entry.duration)) return null;
  const startTime = entry.startTime;
  const endTime = startTime + entry.duration;
  if (!Number.isFinite(endTime)) return null;
  return { kind, startTime, endTime, durationMs: entry.duration };
}

function normalizeInteraction(entry = {}) {
  const interval = normalizeInterval(entry, 'interaction');
  if (!interval || !Number.isInteger(entry.interactionId) || entry.interactionId <= 0) return null;
  return {
    ...interval,
    interactionId: entry.interactionId,
    eventType: typeof entry.name === 'string' ? entry.name : 'unknown',
  };
}

function normalizeFrame(entry = {}) {
  const interval = normalizeInterval(entry, 'long-animation-frame');
  if (!interval) return null;
  return {
    ...interval,
    blockingDurationMs: finiteNonNegative(entry.blockingDuration) ? entry.blockingDuration : 0,
  };
}

function overlapMs(a, b) {
  return Math.max(0, Math.min(a.endTime, b.endTime) - Math.max(a.startTime, b.startTime));
}

export function correlateInteractionFrames({
  eventTimingSupported,
  longAnimationFrameSupported,
  interactionEntries = [],
  frameEntries = [],
} = {}) {
  if (eventTimingSupported !== true || longAnimationFrameSupported !== true) {
    return {
      classification: 'unsupported-correlation',
      supported: false,
      interactionCount: 0,
      correlatedInteractionCount: 0,
      correlations: [],
      claimLimit: 'Correlation requires both Event Timing and Long Animation Frames support; missing support is not evidence of healthy performance.',
    };
  }

  const interactions = interactionEntries.map(normalizeInteraction).filter(Boolean);
  const frames = frameEntries.map(normalizeFrame).filter(Boolean);
  const grouped = new Map();

  for (const interaction of interactions) {
    const current = grouped.get(interaction.interactionId);
    if (!current || interaction.durationMs > current.durationMs) {
      grouped.set(interaction.interactionId, interaction);
    }
  }

  const correlations = [...grouped.values()]
    .map((interaction) => {
      const overlaps = frames
        .map((frame, frameIndex) => ({
          frameIndex,
          overlapMs: overlapMs(interaction, frame),
          frameDurationMs: frame.durationMs,
          blockingDurationMs: frame.blockingDurationMs,
        }))
        .filter((item) => item.overlapMs > 0)
        .sort((a, b) => b.overlapMs - a.overlapMs);

      return {
        interactionId: interaction.interactionId,
        eventType: interaction.eventType,
        interactionDurationMs: interaction.durationMs,
        overlappingFrameCount: overlaps.length,
        totalOverlapMs: overlaps.reduce((sum, item) => sum + item.overlapMs, 0),
        maxFrameDurationMs: overlaps.length ? Math.max(...overlaps.map((item) => item.frameDurationMs)) : 0,
        totalBlockingDurationMs: overlaps.reduce((sum, item) => sum + item.blockingDurationMs, 0),
        overlaps,
      };
    })
    .sort((a, b) => b.interactionDurationMs - a.interactionDurationMs);

  const correlatedInteractionCount = correlations.filter((item) => item.overlappingFrameCount > 0).length;
  const classification = correlations.length === 0
    ? 'no-interaction-observed'
    : correlatedInteractionCount === 0
      ? 'interactions-without-observed-frame-overlap'
      : correlatedInteractionCount === correlations.length
        ? 'all-observed-interactions-overlap-long-frames'
        : 'mixed-interaction-frame-overlap';

  return {
    classification,
    supported: true,
    interactionCount: correlations.length,
    correlatedInteractionCount,
    correlations,
    claimLimit: 'Timeline overlap is evidence of temporal co-occurrence only. It does not prove that a long frame caused interaction latency or subjective harm.',
  };
}
