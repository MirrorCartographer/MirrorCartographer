import test from 'node:test';
import assert from 'node:assert/strict';
import { createAcousticCodewordChallenge, classifyAcousticCodewordResponse } from './acoustic-codeword-challenge.mjs';

function deterministicCrypto(words = [], bytes = []) {
  let wordIndex = 0;
  let byteIndex = 0;
  return {
    getRandomValues(target) {
      if (target instanceof Uint32Array) {
        target[0] = words[wordIndex++] ?? 0;
      } else {
        for (let index = 0; index < target.length; index += 1) target[index] = bytes[byteIndex++] ?? index;
      }
      return target;
    }
  };
}

function detectionsFor(challenge) {
  return challenge.symbols.map(symbol => ({
    frequencyHz: symbol.frequencyHz,
    startPerformanceTime: symbol.expectedWindow.start + 5,
    endPerformanceTime: symbol.expectedWindow.end - 5
  }));
}

test('creates a deterministic multi-symbol codeword and collision bound', () => {
  const challenge = createAcousticCodewordChallenge({
    cryptoSource: deterministicCrypto([2, 1, 0, 3, 2, 1]),
    baseStartPerformanceTime: 1000,
    slotCount: 6,
    pulseCount: 3
  });
  assert.equal(challenge.symbols.length, 3);
  assert.equal(new Set(challenge.symbols.map(symbol => symbol.slotIndex)).size, 3);
  assert.equal(challenge.collisionModel.codeSpaceSize, 120 * 64);
  assert.equal(challenge.collisionModel.randomExactMatchProbability, 1 / 7680);
});

test('accepts exactly one matching detection for every symbol', () => {
  const challenge = createAcousticCodewordChallenge({ cryptoSource: deterministicCrypto(), baseStartPerformanceTime: 500 });
  const result = classifyAcousticCodewordResponse({ challenge, detections: detectionsFor(challenge) });
  assert.equal(result.classification, 'codeword_consistent');
  assert.equal(result.acceptedAsCodewordResponse, true);
});

test('rejects an incomplete codeword', () => {
  const challenge = createAcousticCodewordChallenge({ cryptoSource: deterministicCrypto(), baseStartPerformanceTime: 500 });
  const result = classifyAcousticCodewordResponse({ challenge, detections: detectionsFor(challenge).slice(0, -1) });
  assert.equal(result.classification, 'absent_or_incomplete');
  assert.equal(result.acceptedAsCodewordResponse, false);
});

test('rejects a matching-frequency replay in a control slot', () => {
  const challenge = createAcousticCodewordChallenge({ cryptoSource: deterministicCrypto(), baseStartPerformanceTime: 500 });
  const detections = detectionsFor(challenge);
  const controlSlot = challenge.controlSlotIndexes[0];
  detections.push({
    frequencyHz: challenge.symbols[0].frequencyHz,
    startPerformanceTime: challenge.baseStartPerformanceTime + controlSlot * challenge.slotDurationMs + 5,
    endPerformanceTime: challenge.baseStartPerformanceTime + controlSlot * challenge.slotDurationMs + 80
  });
  const result = classifyAcousticCodewordResponse({ challenge, detections });
  assert.equal(result.classification, 'ambiguous_or_replayed');
  assert.equal(result.controlHits, 1);
});

test('rejects duplicate active-window hits', () => {
  const challenge = createAcousticCodewordChallenge({ cryptoSource: deterministicCrypto(), baseStartPerformanceTime: 500 });
  const detections = detectionsFor(challenge);
  detections.push({ ...detections[0], startPerformanceTime: detections[0].startPerformanceTime + 10 });
  const result = classifyAcousticCodewordResponse({ challenge, detections });
  assert.equal(result.classification, 'ambiguous_or_replayed');
  assert.equal(result.duplicateActiveHits, 1);
});
