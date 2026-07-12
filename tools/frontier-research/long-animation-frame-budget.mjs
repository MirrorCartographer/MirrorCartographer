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
      scriptAttribution: [],
      claimLimit: 'No conclusion about frame health is permitted when the API is unavailable.',
    };
  }

  const normalized = entries
    .filter((entry) => finiteNonNegative(entry?.duration))
    .map((entry) => ({
      duration: entry.duration,
      blockingDuration: finiteNonNegative(entry.blockingDuration) ? entry.blockingDuration : 0,
      scripts: Array.isArray(entry.scripts) ? entry.scripts.map(sanitizeScript) : [],
    }));

  if (normalized.length === 0) {
    return {
      classification: 'no-long-frame-observed',
      supported: true,
      observedFrameCount: 0,
      severeFrameCount: 0,
      maxDurationMs: 0,
      totalBlockingDurationMs: 0,
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

  return {
    classification: severeFrameCount > 0 ? 'severe-jank-observed' : 'long-frame-observed',
    supported: true,
    observedFrameCount: normalized.length,
    severeFrameCount,
    maxDurationMs,
    totalBlockingDurationMs,
    scriptAttribution: [...scriptBuckets.values()].sort((a, b) => b.durationMs - a.durationMs),
    claimLimit: 'Long-animation-frame entries diagnose main-thread congestion; they do not by themselves identify user-visible harm or causal source code.',
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
