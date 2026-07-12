import test from 'node:test';
import assert from 'node:assert/strict';
import { binomialUpperTail, evaluateRepeatedAcousticTrials } from './acoustic-repeated-trial-gate.mjs';

const accepted = () => ({ classification: 'codeword_consistent', acceptedAsCodewordResponse: true });
const absent = () => ({ classification: 'absent', acceptedAsCodewordResponse: false });

test('computes exact upper-tail probability under the declared null', () => {
  const p = binomialUpperTail({ trials: 3, successes: 3, nullSuccessProbability: 0.1 });
  assert.ok(Math.abs(p - 0.001) < 1e-12);
});

test('accepts a repeated pattern that is improbable under random exact matches', () => {
  const result = evaluateRepeatedAcousticTrials({
    trials: [accepted(), accepted(), accepted(), accepted(), accepted()],
    randomExactMatchProbability: 1 / 7680,
  });
  assert.equal(result.classification, 'repeated_challenge_consistent');
  assert.equal(result.acceptedAsRepeatedEvidence, true);
  assert.ok(result.upperTailPValue < 0.01);
});

test('does not upgrade too few trials even when every trial accepts', () => {
  const result = evaluateRepeatedAcousticTrials({
    trials: [accepted(), accepted()],
    randomExactMatchProbability: 1 / 7680,
  });
  assert.equal(result.classification, 'insufficient_repetition');
  assert.equal(result.acceptedAsRepeatedEvidence, false);
});

test('fails closed when any trial records an environmental confound', () => {
  const result = evaluateRepeatedAcousticTrials({
    trials: [accepted(), accepted(), { classification: 'ambiguous_environmental_match', acceptedAsCodewordResponse: false }, accepted(), accepted()],
    randomExactMatchProbability: 1 / 7680,
  });
  assert.equal(result.classification, 'environmental_confound_present');
  assert.equal(result.acceptedAsRepeatedEvidence, false);
});

test('does not accept a weak repeated pattern that remains plausible under the null', () => {
  const result = evaluateRepeatedAcousticTrials({
    trials: [accepted(), absent(), absent(), absent(), absent()],
    randomExactMatchProbability: 0.25,
  });
  assert.equal(result.classification, 'repetition_not_distinguishable_from_null');
  assert.equal(result.acceptedAsRepeatedEvidence, false);
});

test('rejects malformed trial records', () => {
  const result = evaluateRepeatedAcousticTrials({
    trials: [accepted(), {}, accepted(), accepted(), accepted()],
    randomExactMatchProbability: 1 / 7680,
  });
  assert.equal(result.classification, 'invalid_trial_record');
});
