import test from 'node:test';
import assert from 'node:assert/strict';
import { createAcousticChallenge, classifyAcousticChallengeResponse } from './acoustic-challenge-control.mjs';

function deterministicCrypto(words, nonceByte = 7) {
  let cursor = 0;
  return {
    getRandomValues(array) {
      if (array instanceof Uint32Array) array[0] = words[cursor++];
      else array.fill(nonceByte);
      return array;
    }
  };
}

test('creates a randomized frequency and active slot with control slots', () => {
  const challenge = createAcousticChallenge({ cryptoSource: deterministicCrypto([1, 2]), baseStartPerformanceTime: 1000 });
  assert.equal(challenge.frequencyHz, 523.25);
  assert.equal(challenge.activeSlotIndex, 2);
  assert.deepEqual(challenge.controlSlotIndexes, [0, 1, 3]);
  assert.equal(challenge.nonce.length, 32);
});

test('accepts one matching detection only in the active slot', () => {
  const challenge = createAcousticChallenge({ cryptoSource: deterministicCrypto([1, 2]), baseStartPerformanceTime: 1000 });
  const result = classifyAcousticChallengeResponse({ challenge, detections: [{ frequencyHz: 525, startPerformanceTime: 2010, endPerformanceTime: 2140 }] });
  assert.equal(result.classification, 'challenge_consistent');
  assert.equal(result.acceptedAsChallengeResponse, true);
});

test('rejects an ambient matching tone in a control slot as ambiguous', () => {
  const challenge = createAcousticChallenge({ cryptoSource: deterministicCrypto([1, 2]), baseStartPerformanceTime: 1000 });
  const result = classifyAcousticChallengeResponse({ challenge, detections: [
    { frequencyHz: 523.25, startPerformanceTime: 2010, endPerformanceTime: 2140 },
    { frequencyHz: 523.25, startPerformanceTime: 1510, endPerformanceTime: 1620 }
  ] });
  assert.equal(result.classification, 'ambiguous_environmental_match');
  assert.equal(result.acceptedAsChallengeResponse, false);
});

test('classifies no active-window match as absent', () => {
  const challenge = createAcousticChallenge({ cryptoSource: deterministicCrypto([1, 2]), baseStartPerformanceTime: 1000 });
  const result = classifyAcousticChallengeResponse({ challenge, detections: [{ frequencyHz: 700, startPerformanceTime: 2010 }] });
  assert.equal(result.classification, 'absent');
});
