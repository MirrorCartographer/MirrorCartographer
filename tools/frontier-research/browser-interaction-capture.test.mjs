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
  observe(options) { this.options = options; }
  disconnect() { this.disconnected = true; }
  emit(entries) { this.callback({ getEntries: () => entries }); }
}

function reset() {
  FakePerformanceObserver.instances = [];
}

test('captures both APIs in one explicit window and preserves zero interaction IDs', () => {
  reset();
  const times = [10, 60];
  const capture = createInteractionCapture({
    PerformanceObserverImpl: FakePerformanceObserver,
    now: () => times.shift(),
  });
  capture.start({ interactionWindowId: 'tap-sound', sequence: ['pointerdown', 'click'] });
  const eventObserver = FakePerformanceObserver.instances.find((item) => item.options.type === 'event');
  const frameObserver = FakePerformanceObserver.instances.find((item) => item.options.type === 'long-animation-frame');
  eventObserver.emit([
    { name: 'pointerdown', interactionId: 0, startTime: 12, duration: 8, processingStart: 13, processingEnd: 14 },
    { name: 'click', interactionId: 7, startTime: 20, duration: 40, processingStart: 25, processingEnd: 35 },
  ]);
  frameObserver.emit([]);
  const result = capture.close();
  assert.equal(result.rawObservationCounts.eventTiming, 2);
  assert.equal(result.rawObservationCounts.eventTimingZeroInteractionId, 1);
  assert.equal(result.eventVerdict.classification, 'within-budget');
  assert.equal(result.frameVerdict.classification, 'within-budget');
  assert.equal(result.accepted, true);
  assert.equal(eventObserver.disconnected, true);
  assert.equal(frameObserver.disconnected, true);
});

test('unsupported instrumentation remains explicit and cannot pass', () => {
  class UnsupportedObserver { static supportedEntryTypes = []; }
  const times = [0, 1];
  const capture = createInteractionCapture({
    PerformanceObserverImpl: UnsupportedObserver,
    now: () => times.shift(),
  });
  capture.start({ interactionWindowId: 'unsupported' });
  const result = capture.close();
  assert.deepEqual(result.support, { eventTiming: false, longAnimationFrame: false });
  assert.equal(result.accepted, false);
  assert.equal(result.eventVerdict.classification, 'unsupported');
  assert.equal(result.frameVerdict.classification, 'unsupported');
});

test('supported Event Timing with only zero IDs is inconclusive rather than silently dropped', () => {
  reset();
  const times = [0, 5];
  const capture = createInteractionCapture({
    PerformanceObserverImpl: FakePerformanceObserver,
    now: () => times.shift(),
  });
  capture.start({ interactionWindowId: 'zero-only' });
  FakePerformanceObserver.instances.find((item) => item.options.type === 'event').emit([
    { name: 'click', interactionId: 0, startTime: 1, duration: 2, processingStart: 1, processingEnd: 2 },
  ]);
  const result = capture.close();
  assert.equal(result.rawObservationCounts.eventTimingZeroInteractionId, 1);
  assert.equal(result.eventVerdict.classification, 'inconclusive');
  assert.equal(result.accepted, false);
});

test('rejects duplicate start and close without active capture', () => {
  reset();
  const times = [0, 1];
  const capture = createInteractionCapture({
    PerformanceObserverImpl: FakePerformanceObserver,
    now: () => times.shift(),
  });
  capture.start({ interactionWindowId: 'one' });
  assert.throws(() => capture.start({ interactionWindowId: 'two' }), /already started/);
  capture.close();
  assert.throws(() => capture.close(), /not active/);
});

test('abort disconnects observers and discards observations', () => {
  reset();
  const capture = createInteractionCapture({
    PerformanceObserverImpl: FakePerformanceObserver,
    now: () => 0,
  });
  capture.start({ interactionWindowId: 'abort' });
  const result = capture.abort();
  assert.deepEqual(result, { state: 'closed', discarded: true });
  assert.ok(FakePerformanceObserver.instances.every((item) => item.disconnected));
});
