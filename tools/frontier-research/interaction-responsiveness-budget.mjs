const finiteNonNegative = (value) => Number.isFinite(value) && value >= 0;

function normalizeEntry(entry = {}) {
  if (!finiteNonNegative(entry.duration) || !finiteNonNegative(entry.startTime)) return null;
  const processingStart = finiteNonNegative(entry.processingStart) ? entry.processingStart : entry.startTime;
  const processingEnd = finiteNonNegative(entry.processingEnd) ? entry.processingEnd : processingStart;
  const inputDelayMs = Math.max(0, processingStart - entry.startTime);
  const processingDurationMs = Math.max(0, processingEnd - processingStart);
  const presentationDelayMs = Math.max(0, entry.startTime + entry.duration - processingEnd);
  return {
    interactionId: Number.isInteger(entry.interactionId) && entry.interactionId > 0 ? entry.interactionId : 0,
    eventType: typeof entry.name === 'string' ? entry.name : 'unknown',
    durationMs: entry.duration,
    inputDelayMs,
    processingDurationMs,
    presentationDelayMs,
  };
}

export function summarizeInteractionResponsiveness({
  supported,
  entries = [],
  slowMs = 200,
  severeMs = 500,
} = {}) {
  if (supported !== true) {
    return {
      classification: 'unsupported',
      supported: false,
      interactionCount: 0,
      worstInteractionMs: null,
      interactions: [],
      claimLimit: 'No conclusion about interaction responsiveness is permitted when Event Timing is unavailable.',
    };
  }

  const normalized = entries.map(normalizeEntry).filter(Boolean).filter((entry) => entry.interactionId > 0);
  const groups = new Map();
  for (const entry of normalized) {
    const current = groups.get(entry.interactionId) ?? [];
    current.push(entry);
    groups.set(entry.interactionId, current);
  }

  const interactions = [...groups.entries()].map(([interactionId, events]) => {
    const worst = events.reduce((a, b) => (b.durationMs > a.durationMs ? b : a));
    return {
      interactionId,
      durationMs: worst.durationMs,
      eventCount: events.length,
      eventTypes: [...new Set(events.map((event) => event.eventType))].sort(),
      inputDelayMs: worst.inputDelayMs,
      processingDurationMs: worst.processingDurationMs,
      presentationDelayMs: worst.presentationDelayMs,
      dominantPhase: [
        ['input-delay', worst.inputDelayMs],
        ['processing', worst.processingDurationMs],
        ['presentation', worst.presentationDelayMs],
      ].sort((a, b) => b[1] - a[1])[0][0],
    };
  }).sort((a, b) => b.durationMs - a.durationMs);

  if (interactions.length === 0) {
    return {
      classification: 'no-interaction-observed',
      supported: true,
      interactionCount: 0,
      worstInteractionMs: 0,
      interactions: [],
      claimLimit: 'No qualifying interaction was observed in this window; this is not proof of universal responsiveness.',
    };
  }

  const worstInteractionMs = interactions[0].durationMs;
  const classification = worstInteractionMs >= severeMs
    ? 'severe-interaction-latency-observed'
    : worstInteractionMs >= slowMs
      ? 'slow-interaction-observed'
      : 'bounded-interaction-window';

  return {
    classification,
    supported: true,
    interactionCount: interactions.length,
    worstInteractionMs,
    interactions,
    claimLimit: 'Event Timing attributes latency phases to observed interactions; it does not by itself prove subjective harm or identify causal source code.',
  };
}

export function createInteractionTimingObserver({
  PerformanceObserverImpl = globalThis.PerformanceObserver,
  durationThreshold = 16,
  onSummary,
} = {}) {
  const supported = Boolean(
    PerformanceObserverImpl &&
    Array.isArray(PerformanceObserverImpl.supportedEntryTypes) &&
    PerformanceObserverImpl.supportedEntryTypes.includes('event')
  );

  if (!supported) {
    onSummary?.(summarizeInteractionResponsiveness({ supported: false }));
    return { supported: false, disconnect() {} };
  }

  const entries = [];
  const observer = new PerformanceObserverImpl((list) => {
    entries.push(...list.getEntries());
    onSummary?.(summarizeInteractionResponsiveness({ supported: true, entries }));
  });
  observer.observe({ type: 'event', buffered: true, durationThreshold: Math.max(16, durationThreshold) });
  return { supported: true, disconnect: () => observer.disconnect() };
}
