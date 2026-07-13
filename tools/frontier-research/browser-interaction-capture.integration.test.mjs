import test from 'node:test';
import assert from 'node:assert/strict';
import { createInteractionCapture } from './browser-interaction-capture.mjs';

class FakePerformanceObserver {
  static supportedEntryTypes = ['event', 'long-animation-frame'];
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    FakePerformanceObserver.instances.push(this);
  }

  observe(options) {
    this.options = options;
  }

  disconnect() {
    this.disconnected = true;
  }

  emit(entries) {
    this.callback({ getEntries: () => entries });
  }
}

function startCapture({ eventBudgets = {}, frameBudgets = {} } = {}) {
  FakePerformanceObserver.instances = [];
  const times = [100, 180];
  const capture = createInteractionCapture({
    PerformanceObserverImpl: FakePerformanceObserver,
    now: () => times.shift(),
    eventBudgets,
    frameBudgets,
  });
  capture.start({
    interactionWindowId: 'deployed-audio-diagnostic',
    sequence: ['pointerdown', 'pointerup', 'click'],
  });
  return {
    capture,
    eventObserver: FakePerformanceObserver.instances.find((item) => item.options.type === 'event'),
    frameObserver: FakePerformanceObserver.instances.find((item) => item.options.type === 'long-animation-frame'),
  };
}

test('exact evaluators accept only when both independent streams remain within declared budgets', () => {
  const { capture, eventObserver, frameObserver } = startCapture({
    eventBudgets: {
      maxDurationMs: 80,
      maxInputDelayMs: 20,
      maxProcessingDurationMs: 30,
      maxPresentationDelayMs: 40,
    },
    frameBudgets: {
      maxBlockingMs: 10,
      maxInteractionDelayMs: 60,
      maxLongFrames: 1,
    },
  });

  eventObserver.emit([
    {
      name: 'click',
      interactionId: 41,
      startTime: 110,
      duration: 60,
      processingStart: 120,
      processingEnd: 140,
      targetSelector: '[data-audio-diagnostic]',
    },
  ]);
  frameObserver.emit([
    {
      startTime: 115,
      duration: 52,
      blockingDuration: 7,
      firstUIEventTimestamp: 110,
      scripts: [{
        invokerType: 'event-listener',
        windowAttribution: 'self',
        duration: 12,
        forcedStyleAndLayoutDuration: 1,
      }],
    },
  ]);

  const result = capture.close();
  assert.equal(result.eventVerdict.classification, 'within-budget');
  assert.deepEqual(result.eventVerdict.budget, {
    maxDurationMs: 80,
    maxInputDelayMs: 20,
    maxProcessingDurationMs: 30,
    maxPresentationDelayMs: 40,
  });
  assert.equal(result.frameVerdict.classification, 'within-budget');
  assert.deepEqual(result.frameVerdict.budget, {
    maxBlockingMs: 10,
    maxInteractionDelayMs: 60,
    maxLongFrames: 1,
  });
  assert.equal(result.accepted, true);
});

test('Event Timing violation rejects the combined result even when long-frame evidence passes', () => {
  const { capture, eventObserver, frameObserver } = startCapture({
    eventBudgets: { maxDurationMs: 50 },
    frameBudgets: { maxLongFrames: 0, maxBlockingMs: 20, maxInteractionDelayMs: 100 },
  });

  eventObserver.emit([
    { name: 'click', interactionId: 7, startTime: 105, duration: 75, processingStart: 110, processingEnd: 120 },
  ]);
  frameObserver.emit([]);

  const result = capture.close();
  assert.equal(result.eventVerdict.classification, 'budget-violation');
  assert.ok(result.eventVerdict.reasons.includes('duration-budget-exceeded'));
  assert.equal(result.frameVerdict.classification, 'within-budget');
  assert.equal(result.accepted, false);
});

test('long-frame violation rejects the combined result even when Event Timing passes', () => {
  const { capture, eventObserver, frameObserver } = startCapture({
    eventBudgets: { maxDurationMs: 100 },
    frameBudgets: { maxLongFrames: 0, maxBlockingMs: 5, maxInteractionDelayMs: 30 },
  });

  eventObserver.emit([
    { name: 'click', interactionId: 8, startTime: 105, duration: 40, processingStart: 110, processingEnd: 125 },
  ]);
  frameObserver.emit([
    { startTime: 110, duration: 70, blockingDuration: 18, firstUIEventTimestamp: 105, scripts: [] },
  ]);

  const result = capture.close();
  assert.equal(result.eventVerdict.classification, 'within-budget');
  assert.equal(result.frameVerdict.classification, 'budget-violation');
  assert.ok(result.frameVerdict.reasons.includes('long-frame-count-exceeded'));
  assert.ok(result.frameVerdict.reasons.includes('blocking-budget-exceeded'));
  assert.ok(result.frameVerdict.reasons.includes('interaction-delay-budget-exceeded'));
  assert.equal(result.accepted, false);
});

test('zero interaction IDs remain retained while exact Event Timing evaluator stays inconclusive', () => {
  const { capture, eventObserver, frameObserver } = startCapture();

  eventObserver.emit([
    { name: 'pointerdown', interactionId: 0, startTime: 105, duration: 8, processingStart: 106, processingEnd: 108 },
    { name: 'click', interactionId: 0, startTime: 115, duration: 12, processingStart: 117, processingEnd: 120 },
  ]);
  frameObserver.emit([]);

  const result = capture.close();
  assert.equal(result.rawObservationCounts.eventTiming, 2);
  assert.equal(result.rawObservationCounts.eventTimingZeroInteractionId, 2);
  assert.equal(result.eventEntries.length, 2);
  assert.equal(result.eventVerdict.classification, 'inconclusive');
  assert.equal(result.eventVerdict.summary.ignoredEntryCount, 2);
  assert.equal(result.accepted, false);
});
