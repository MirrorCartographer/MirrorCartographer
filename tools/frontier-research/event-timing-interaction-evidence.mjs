const finiteNonNegative = (value) => Number.isFinite(value) && value >= 0;

function normalizeEntry(entry = {}) {
  const startTime = finiteNonNegative(entry.startTime) ? entry.startTime : 0;
  const duration = finiteNonNegative(entry.duration) ? entry.duration : 0;
  const processingStart = finiteNonNegative(entry.processingStart) ? entry.processingStart : startTime;
  const processingEnd = finiteNonNegative(entry.processingEnd) ? entry.processingEnd : processingStart;
  const interactionId = Number.isSafeInteger(entry.interactionId) && entry.interactionId > 0
    ? entry.interactionId
    : 0;

  return {
    name: typeof entry.name === 'string' ? entry.name : 'unknown',
    interactionId,
    startTime,
    duration,
    processingStart,
    processingEnd,
    inputDelayMs: Math.max(0, processingStart - startTime),
    processingDurationMs: Math.max(0, processingEnd - processingStart),
    presentationDelayMs: Math.max(0, startTime + duration - processingEnd),
    targetSelector: typeof entry.targetSelector === 'string' ? entry.targetSelector : '',
  };
}

export function summarizeInteractionTiming({ supported, entries = [] } = {}) {
  if (supported !== true) {
    return {
      supported: false,
      classification: 'unsupported',
      interactions: [],
      ignoredEntryCount: 0,
      claimLimit: 'Unsupported Event Timing instrumentation cannot establish interaction latency.',
    };
  }

  const normalized = entries
    .filter((entry) => finiteNonNegative(entry?.duration))
    .map(normalizeEntry);
  const ignoredEntryCount = normalized.filter((entry) => entry.interactionId === 0).length;
  const grouped = new Map();

  for (const entry of normalized) {
    if (entry.interactionId === 0) continue;
    const current = grouped.get(entry.interactionId) ?? {
      interactionId: entry.interactionId,
      eventCount: 0,
      maxDurationMs: 0,
      maxInputDelayMs: 0,
      maxProcessingDurationMs: 0,
      maxPresentationDelayMs: 0,
      eventNames: new Set(),
      targetSelectors: new Set(),
    };
    current.eventCount += 1;
    current.maxDurationMs = Math.max(current.maxDurationMs, entry.duration);
    current.maxInputDelayMs = Math.max(current.maxInputDelayMs, entry.inputDelayMs);
    current.maxProcessingDurationMs = Math.max(current.maxProcessingDurationMs, entry.processingDurationMs);
    current.maxPresentationDelayMs = Math.max(current.maxPresentationDelayMs, entry.presentationDelayMs);
    current.eventNames.add(entry.name);
    if (entry.targetSelector) current.targetSelectors.add(entry.targetSelector);
    grouped.set(entry.interactionId, current);
  }

  const interactions = [...grouped.values()]
    .map((interaction) => ({
      ...interaction,
      eventNames: [...interaction.eventNames].sort(),
      targetSelectors: [...interaction.targetSelectors].sort(),
    }))
    .sort((a, b) => b.maxDurationMs - a.maxDurationMs || a.interactionId - b.interactionId);

  return {
    supported: true,
    classification: interactions.length > 0 ? 'interactions-observed' : 'no-grouped-interaction-observed',
    interactions,
    ignoredEntryCount,
    claimLimit: 'Interaction IDs correlate events within one page lifecycle; they are not stable global identifiers or proof of causality.',
  };
}

export function evaluateInteractionTimingBudget({
  supported,
  entries = [],
  maxDurationMs = 200,
  maxInputDelayMs = 100,
  maxProcessingDurationMs = 100,
  maxPresentationDelayMs = 100,
} = {}) {
  const budgets = { maxDurationMs, maxInputDelayMs, maxProcessingDurationMs, maxPresentationDelayMs };
  if (!Object.values(budgets).every(finiteNonNegative)) {
    throw new TypeError('budgets must be finite non-negative numbers');
  }

  const summary = summarizeInteractionTiming({ supported, entries });
  if (!summary.supported) {
    return {
      accepted: false,
      classification: 'unsupported',
      reasons: ['event-timing-unsupported'],
      budget: budgets,
      summary,
      trustLimit: 'Unsupported instrumentation is inconclusive and must not pass the interaction budget.',
      falsificationRoute: 'Repeat the exact interaction in a target browser exposing PerformanceEventTiming entries and retain buffered plus live observations.',
    };
  }

  if (summary.interactions.length === 0) {
    return {
      accepted: false,
      classification: 'inconclusive',
      reasons: ['no-grouped-interaction-observed'],
      budget: budgets,
      summary,
      trustLimit: 'No grouped interaction means the observation cannot establish that a tested gesture stayed within budget.',
      falsificationRoute: 'Perform a trusted pointer or keyboard interaction and reject the observation unless a non-zero interactionId is retained.',
    };
  }

  const violations = [];
  for (const interaction of summary.interactions) {
    if (interaction.maxDurationMs > maxDurationMs) violations.push({ interactionId: interaction.interactionId, reason: 'duration-budget-exceeded' });
    if (interaction.maxInputDelayMs > maxInputDelayMs) violations.push({ interactionId: interaction.interactionId, reason: 'input-delay-budget-exceeded' });
    if (interaction.maxProcessingDurationMs > maxProcessingDurationMs) violations.push({ interactionId: interaction.interactionId, reason: 'processing-budget-exceeded' });
    if (interaction.maxPresentationDelayMs > maxPresentationDelayMs) violations.push({ interactionId: interaction.interactionId, reason: 'presentation-budget-exceeded' });
  }

  return {
    accepted: violations.length === 0,
    classification: violations.length === 0 ? 'within-budget' : 'budget-violation',
    reasons: [...new Set(violations.map((item) => item.reason))],
    violations,
    budget: budgets,
    summary,
    trustLimit: 'Acceptance applies only to retained entries for the exact page lifecycle and tested interaction sequence.',
    falsificationRoute: 'Repeat the exact gesture on the target device and reject acceptance if any grouped interaction exceeds a declared latency component budget.',
  };
}

export function createEventTimingObserver({ PerformanceObserverImpl = globalThis.PerformanceObserver, onVerdict, budgets } = {}) {
  const supported = Boolean(
    PerformanceObserverImpl &&
    Array.isArray(PerformanceObserverImpl.supportedEntryTypes) &&
    PerformanceObserverImpl.supportedEntryTypes.includes('event')
  );

  if (!supported) {
    onVerdict?.(evaluateInteractionTimingBudget({ supported: false, ...budgets }));
    return { supported: false, disconnect() {} };
  }

  const entries = [];
  const observer = new PerformanceObserverImpl((list) => {
    entries.push(...list.getEntries());
    onVerdict?.(evaluateInteractionTimingBudget({ supported: true, entries, ...budgets }));
  });
  observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });

  return {
    supported: true,
    disconnect() {
      observer.disconnect();
    },
  };
}
