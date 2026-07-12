import { evaluateEventTimingCapability } from './event-timing-capability.mjs';

export function collectEventTimingCapability(runtime = globalThis, options = {}) {
  const navigationId = options.navigationId;
  const durationThresholdMs = options.durationThresholdMs ?? 16;
  const PerformanceObserverCtor = runtime?.PerformanceObserver;
  const PerformanceEventTimingCtor = runtime?.PerformanceEventTiming;
  const performanceObject = runtime?.performance;

  const supportedEntryTypes = Array.isArray(PerformanceObserverCtor?.supportedEntryTypes)
    ? [...PerformanceObserverCtor.supportedEntryTypes]
    : [];
  const interactionIdAvailable = Boolean(
    PerformanceEventTimingCtor?.prototype &&
    'interactionId' in PerformanceEventTimingCtor.prototype
  );
  const eventCountsAvailable = Boolean(
    performanceObject &&
    'eventCounts' in performanceObject &&
    performanceObject.eventCounts != null
  );

  const evaluation = evaluateEventTimingCapability({
    navigationId,
    durationThresholdMs,
    supportedEntryTypes,
    interactionIdAvailable,
    eventCountsAvailable
  });

  return {
    schema_version: '1.0.0',
    collected_at: normalizeTimestamp(options.collectedAt),
    collector: 'event-timing-capability-collector',
    observer_interface_available: typeof PerformanceObserverCtor === 'function',
    event_timing_interface_available: typeof PerformanceEventTimingCtor === 'function',
    ...evaluation
  };
}

function normalizeTimestamp(value) {
  if (typeof value === 'string' && Number.isFinite(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  return new Date().toISOString();
}
