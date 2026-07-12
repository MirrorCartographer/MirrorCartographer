function assertProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be between 0 and 1`);
  }
}

function choose(n, k) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) return 0;
  const m = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= m; i += 1) result = (result * (n - m + i)) / i;
  return result;
}

export function binomialUpperTail({ trials, successes, nullSuccessProbability }) {
  if (!Number.isInteger(trials) || trials < 1) throw new RangeError('trials must be a positive integer');
  if (!Number.isInteger(successes) || successes < 0 || successes > trials) {
    throw new RangeError('successes must be an integer between 0 and trials');
  }
  assertProbability(nullSuccessProbability, 'nullSuccessProbability');

  let probability = 0;
  for (let k = successes; k <= trials; k += 1) {
    probability += choose(trials, k) * (nullSuccessProbability ** k) * ((1 - nullSuccessProbability) ** (trials - k));
  }
  return Math.min(1, probability);
}

export function evaluateRepeatedAcousticTrials({
  trials,
  randomExactMatchProbability,
  alpha = 0.01,
  minimumTrials = 5,
  minimumAccepted = 3,
}) {
  if (!Array.isArray(trials) || trials.length === 0) throw new TypeError('trials must be a non-empty array');
  assertProbability(randomExactMatchProbability, 'randomExactMatchProbability');
  assertProbability(alpha, 'alpha');
  if (alpha === 0) throw new RangeError('alpha must be greater than zero');

  const accepted = trials.filter((trial) => trial?.acceptedAsCodewordResponse === true).length;
  const ambiguous = trials.filter((trial) => trial?.classification === 'ambiguous_environmental_match').length;
  const invalid = trials.filter((trial) => !trial || typeof trial.acceptedAsCodewordResponse !== 'boolean').length;
  const pValue = binomialUpperTail({
    trials: trials.length,
    successes: accepted,
    nullSuccessProbability: randomExactMatchProbability,
  });

  let classification = 'insufficient_repetition';
  if (invalid > 0) classification = 'invalid_trial_record';
  else if (ambiguous > 0) classification = 'environmental_confound_present';
  else if (trials.length >= minimumTrials && accepted >= minimumAccepted && pValue <= alpha) {
    classification = 'repeated_challenge_consistent';
  } else if (trials.length >= minimumTrials) classification = 'repetition_not_distinguishable_from_null';

  return {
    classification,
    trialCount: trials.length,
    acceptedCount: accepted,
    ambiguousCount: ambiguous,
    invalidCount: invalid,
    nullSuccessProbability: randomExactMatchProbability,
    upperTailPValue: pValue,
    alpha,
    assumptions: [
      'trial challenges are independently randomized',
      'null match probability is correctly specified',
      'trial outcomes are not selectively omitted',
    ],
    acceptedAsRepeatedEvidence: classification === 'repeated_challenge_consistent',
  };
}
