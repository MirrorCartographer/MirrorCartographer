import assert from 'node:assert/strict';
import test from 'node:test';
import { correlateInteractionFrames } from './interaction-frame-correlation.mjs';

test('requires support for both performance entry types', () => {
  const result = correlateInteractionFrames({
    eventTimingSupported: true,
    longAnimationFrameSupported: false,
  });
  assert.equal(result.classification, 'unsupported-correlation');
  assert.equal(result.supported, false);
});

test('reports no overlap without treating it as universal smoothness', () => {
  const result = correlateInteractionFrames({
    eventTimingSupported: true,
    longAnimationFrameSupported: true,
    interactionEntries: [{ interactionId: 7, name: 'click', startTime: 10, duration: 40 }],
    frameEntries: [{ startTime: 100, duration: 80, blockingDuration: 30 }],
  });
  assert.equal(result.classification, 'interactions-without-observed-frame-overlap');
  assert.equal(result.correlatedInteractionCount, 0);
  assert.match(result.claimLimit, /co-occurrence only/);
});

test('computes bounded overlap on the shared performance timeline', () => {
  const result = correlateInteractionFrames({
    eventTimingSupported: true,
    longAnimationFrameSupported: true,
    interactionEntries: [{ interactionId: 11, name: 'pointerup', startTime: 50, duration: 120 }],
    frameEntries: [{ startTime: 100, duration: 90, blockingDuration: 45 }],
  });
  assert.equal(result.classification, 'all-observed-interactions-overlap-long-frames');
  assert.equal(result.correlations[0].totalOverlapMs, 70);
  assert.equal(result.correlations[0].totalBlockingDurationMs, 45);
});

test('groups an interaction by interactionId and keeps its worst event', () => {
  const result = correlateInteractionFrames({
    eventTimingSupported: true,
    longAnimationFrameSupported: true,
    interactionEntries: [
      { interactionId: 21, name: 'pointerdown', startTime: 10, duration: 20 },
      { interactionId: 21, name: 'pointerup', startTime: 15, duration: 90 },
    ],
    frameEntries: [{ startTime: 30, duration: 60, blockingDuration: 25 }],
  });
  assert.equal(result.interactionCount, 1);
  assert.equal(result.correlations[0].eventType, 'pointerup');
  assert.equal(result.correlations[0].totalOverlapMs, 60);
});

test('does not expose DOM targets, selectors, or script URLs', () => {
  const result = correlateInteractionFrames({
    eventTimingSupported: true,
    longAnimationFrameSupported: true,
    interactionEntries: [{
      interactionId: 31,
      name: 'click',
      startTime: 0,
      duration: 80,
      target: '#private-health-field',
    }],
    frameEntries: [{
      startTime: 20,
      duration: 50,
      blockingDuration: 10,
      scripts: [{ sourceURL: 'https://example.invalid/private.js' }],
    }],
  });
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('private-health-field'), false);
  assert.equal(serialized.includes('private.js'), false);
});
