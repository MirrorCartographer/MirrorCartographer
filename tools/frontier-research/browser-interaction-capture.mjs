import { evaluateInteractionTimingBudget } from './event-timing-interaction-evidence.mjs';
import { evaluateInteractionBudget } from './long-animation-frame-budget.mjs';

const finiteNonNegative = (value) => Number.isFinite(value) && value >= 0;

function cloneEntry(entry, fields) {
  const output = {};
  for (const field of fields) {
    const value = entry?.[field];
    if (Array.isArray(value)) output[field] = value.map((item) => ({ ...item }));
    else if (typeof value !== 'undefined') output[field] = value;
  }
  return output;
}

export function createInteractionCapture({
  PerformanceObserverImpl = globalThis.PerformanceObserver,
  now = () => globalThis.performance?.now?.() ?? Date.now(),
  eventBudgets = {},
  frameBudgets = {},
} = {}) {
  const supportedTypes = Array.isArray(PerformanceObserverImpl?.supportedEntryTypes)
    ? PerformanceObserverImpl.supportedEntryTypes
    : [];
  const support = {
    eventTiming: supportedTypes.includes('event'),
    longAnimationFrame: supportedTypes.includes('long-animation-frame'),
  };
  let state = 'idle';
  let windowIdentity = null;
  let startTime = null;
  let eventEntries = [];
  let frameEntries = [];
  let eventObserver = null;
  let frameObserver = null;

  const disconnect = () => {
    eventObserver?.disconnect();
    frameObserver?.disconnect();
    eventObserver = null;
    frameObserver = null;
  };

  return {
    support,
    start({ interactionWindowId, sequence = [] } = {}) {
      if (state !== 'idle') throw new Error('capture already started or closed');
      if (typeof interactionWindowId !== 'string' || interactionWindowId.trim() === '') {
        throw new TypeError('interactionWindowId is required');
      }
      if (!Array.isArray(sequence) || sequence.some((step) => typeof step !== 'string' || step.trim() === '')) {
        throw new TypeError('sequence must be an array of non-empty strings');
      }
      startTime = now();
      if (!finiteNonNegative(startTime)) throw new TypeError('now() must return a finite non-negative number');
      state = 'capturing';
      windowIdentity = { interactionWindowId, sequence: [...sequence] };

      if (support.eventTiming) {
        eventObserver = new PerformanceObserverImpl((list) => {
          eventEntries.push(...list.getEntries().map((entry) => cloneEntry(entry, [
            'name', 'interactionId', 'startTime', 'duration', 'processingStart', 'processingEnd', 'targetSelector',
          ])));
        });
        eventObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      }

      if (support.longAnimationFrame) {
        frameObserver = new PerformanceObserverImpl((list) => {
          frameEntries.push(...list.getEntries().map((entry) => cloneEntry(entry, [
            'startTime', 'duration', 'blockingDuration', 'firstUIEventTimestamp', 'scripts',
          ])));
        });
        frameObserver.observe({ type: 'long-animation-frame', buffered: true });
      }

      return { state, support: { ...support }, startedAt: startTime, ...windowIdentity };
    },

    close() {
      if (state !== 'capturing') throw new Error('capture is not active');
      const endTime = now();
      if (!finiteNonNegative(endTime) || endTime < startTime) {
        disconnect();
        state = 'closed';
        throw new TypeError('capture end time must be finite and not precede start time');
      }
      disconnect();
      state = 'closed';

      const eventVerdict = evaluateInteractionTimingBudget({
        supported: support.eventTiming,
        entries: eventEntries,
        ...eventBudgets,
      });
      const frameVerdict = evaluateInteractionBudget({
        supported: support.longAnimationFrame,
        entries: frameEntries,
        ...frameBudgets,
      });

      return {
        schemaVersion: '1.0.0',
        ...windowIdentity,
        observationWindow: { startTime, endTime, durationMs: endTime - startTime },
        support: { ...support },
        rawObservationCounts: {
          eventTiming: eventEntries.length,
          eventTimingZeroInteractionId: eventEntries.filter((entry) => !(Number.isSafeInteger(entry.interactionId) && entry.interactionId > 0)).length,
          longAnimationFrame: frameEntries.length,
        },
        eventEntries: eventEntries.map((entry) => ({ ...entry })),
        frameEntries: frameEntries.map((entry) => ({
          ...entry,
          scripts: Array.isArray(entry.scripts) ? entry.scripts.map((script) => ({ ...script })) : [],
        })),
        eventVerdict,
        frameVerdict,
        accepted: eventVerdict.accepted === true && frameVerdict.accepted === true,
        claimLimit: 'This capture establishes only retained browser observations inside one explicit window. It does not prove causality, audibility, subjective smoothness, or unsupported API behavior.',
        falsificationRoute: 'Repeat the same ordered interaction sequence on the same deployed commit and device/browser; reject the result if support, raw counts, zero-interactionId counts, or either independent verdict changes materially.',
      };
    },

    abort() {
      if (state === 'closed') return { state };
      disconnect();
      state = 'closed';
      eventEntries = [];
      frameEntries = [];
      return { state, discarded: true };
    },
  };
}
