const finiteNonNegative = (value) => Number.isFinite(value) && value >= 0;

function sanitizeScript(script = {}) {
  return {
    invokerType: typeof script.invokerType === 'string' ? script.invokerType : 'unknown',
    windowAttribution: typeof script.windowAttribution === 'string' ? script.windowAttribution : 'unknown',
    duration: finiteNonNegative(script.duration) ? script.duration : 0,
    forcedStyleAndLayoutDuration: finiteNonNegative(script.forcedStyleAndLayoutDuration)
      ? script.forcedStyleAndLayoutDuration
      : 0,
  };
}

export function summarizeLongAnimationFrames({ supported, entries = [], severeMs = 200 } = {}) {
  if (supported !== true) {
    return {
      classification: 'unsupported',
      supported: false,
      observedFrameCount: 0,
      severeFrameCount: 0,
      maxDurationMs: null,
      totalBlockingDurationMs: null,
      maxInteractionDelayMs: null,
      scriptAttribution: [],
      claimLimit: 'No conclusion about frame health is permitted when the API is unavailable.',
    };
  }

  const normalized = entries
    .filter((entry) => finiteNonNegative(entry?.duration))
    .map((entry) => {
      const startTime = finiteNonNegative(entry.startTime) ? entry.startTime : 0;
      const firstUIEventTimestamp = finiteNonNegative(entry.firstUIEventTimestamp)
        ? entry.firstUIEventTimestamp
        : 0;
      return {
        startTime,
        duration: entry.duration,
        blockingDuration: finiteNonNegative(entry.blockingDuration) ? entry.blockingDuration : 0,
        firstUIEventTimestamp,
        interactionDelay: firstUIEventTimestamp > 0
          ? Math.max(0, startTime + entry.duration - firstUIEventTimestamp)
          : 0,
        scripts: Array.isArray(entry.scripts) ? entry.scripts.map(sanitizeScript) : [],
      };
    });

  if (normalized.length === 0) {
    return {
      classification: 'no-long-frame-observed',
      supported: true,
      observedFrameCount: 0,
      severeFrameCount: 0,
      maxDurationMs: 0,
      totalBlockingDurationMs: 0,
      maxInteractionDelayMs: 0,
      scriptAttribution: [],
      claimLimit: 'Absence of buffered entries is evidence only for the observed window, not proof of universal smoothness.',
    };
  }

  const scriptBuckets = new Map();
  for (const frame of normalized) {
    for (const script of frame.scripts) {
      const key = `${script.invokerType}:${script.windowAttribution}`;
      const current = scriptBuckets.get(key) ?? {
        invokerType: script.invokerType,
        windowAttribution: script.windowAttribution,
        count: 0,
        durationMs: 0,
        forcedStyleAndLayoutDurationMs: 0,
      };
      current.count += 1;
      current.durationMs += script.duration;
      current.forcedStyleAndLayoutDurationMs += script.forcedStyleAndLayoutDuration;
      scriptBuckets.set(key, current);
    }
  }

  const maxDurationMs = Math.max(...normalized.map((entry) => entry.duration));
  const severeFrameCount = normalized.filter((entry) => entry.duration >= severeMs).length;
  const totalBlockingDurationMs = normalized.reduce((sum, entry) => sum + entry.blockingDuration, 0);
  const maxInteractionDelayMs = Math.max(...normalized.map((entry) => entry.interactionDelay));

  return {
    classification: severeFrameCount > 0 ? 'severe-jank-observed' : 'long-frame-observed',
    supported: true,
    observedFrameCount: normalized.length,
    severeFrameCount,
    maxDurationMs,
    totalBlockingDurationMs,
    maxInteractionDelayMs,
    scriptAttribution: [...scriptBuckets.values()].sort((a, b) => b.durationMs - a.durationMs),
    claimLimit: 'Long-animation-frame entries diagnose main-thread congestion; they do not by themselves identify user-visible harm or causal source code.',
  };
}

export function evaluateInteractionBudget({ supported, entries = [], maxBlockingMs = 20, maxInteractionDelayMs = 100, maxLongFrames = 0 } = {}) {
  if (![maxBlockingMs, maxInteractionDelayMs, maxLongFrames].every(finiteNonNegative)) {
    throw new TypeError('budgets must be finite non-negative numbers');
  }
  const summary = summarizeLongAnimationFrames({ supported, entries });
  if (!summary.supported) {
    return {
      accepted: false,
      classification: 'unsupported',
      reasons: ['long-animation-frame-unsupported'],
      summary,
      trustLimit: 'Unsupported instrumentation cannot establish that the interaction stayed within budget.',
      falsificationRoute: 'Run the same exact interaction in a target browser that exposes long-animation-frame entries, retaining buffered and live observations.',
    };
  }

  const reasons = [];
  if (summary.observedFrameCount > maxLongFrames) reasons.push('long-frame-count-exceeded');
  if (summary.totalBlockingDurationMs > maxBlockingMs) reasons.push('blocking-budget-exceeded');
  if (summary.maxInteractionDelayMs > maxInteractionDelayMs) reasons.push('interaction-delay-budget-exceeded');

  return {
    accepted: reasons.length === 0,
    classification: reasons.length === 0 ? 'within-budget' : 'budget-violation',
    reasons,
    budget: { maxBlockingMs, maxInteractionDelayMs, maxLongFrames },
    summary,
    trustLimit: 'Acceptance applies only to the retained observation window and exact interaction sequence; it is not a universal smoothness claim.',
    falsificationRoute: 'Repeat the exact interaction on the target device and reject acceptance if any retained long frame causes the declared count, blocking, or interaction-delay budget to be exceeded.',
  };
}

export function createLongAnimationFrameObserver({ PerformanceObserverImpl = globalThis.PerformanceObserver, onSummary } = {}) {
  const supported = Boolean(
    PerformanceObserverImpl &&
    Array.isArray(PerformanceObserverImpl.supportedEntryTypes) &&
    PerformanceObserverImpl.supportedEntryTypes.includes('long-animation-frame')
  );

  if (!supported) {
    onSummary?.(summarizeLongAnimationFrames({ supported: false }));
    return { supported: false, disconnect() {} };
  }

  const entries = [];
  const observer = new PerformanceObserverImpl((list) => {
    entries.push(...list.getEntries());
    onSummary?.(summarizeLongAnimationFrames({ supported: true, entries }));
  });
  observer.observe({ type: 'long-animation-frame', buffered: true });

  return {
    supported: true,
    disconnect() {
      observer.disconnect();
    },
  };
}
