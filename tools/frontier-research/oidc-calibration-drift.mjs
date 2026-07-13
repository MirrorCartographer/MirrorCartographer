const REQUIRED_STATS = ['lifetime_seconds', 'absolute_issued_skew_seconds', 'absolute_not_before_skew_seconds'];

function assertObject(name, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`);
}

function assertFiniteNonNegative(name, value) {
  if (!Number.isFinite(value) || value < 0) throw new TypeError(`${name} must be a finite non-negative number`);
}

function normalizeSummary(name, summary) {
  assertObject(name, summary);
  if (summary.status !== 'calibrated_observation_summary') throw new Error(`${name} is not a calibrated observation summary`);
  if (summary.policy_change_permitted !== false) throw new Error(`${name} violates no-auto-policy-change boundary`);
  if (!Number.isInteger(summary.cohort_size) || summary.cohort_size < 3) throw new Error(`${name}.cohort_size must be an integer >= 3`);
  assertObject(`${name}.statistics`, summary.statistics);
  for (const key of REQUIRED_STATS) assertObject(`${name}.statistics.${key}`, summary.statistics[key]);

  const lifetime = summary.statistics.lifetime_seconds;
  const issued = summary.statistics.absolute_issued_skew_seconds;
  const nbf = summary.statistics.absolute_not_before_skew_seconds;
  for (const field of ['min','median','p95','max']) assertFiniteNonNegative(`${name}.statistics.lifetime_seconds.${field}`, lifetime[field]);
  for (const field of ['median','p95','max']) assertFiniteNonNegative(`${name}.statistics.absolute_issued_skew_seconds.${field}`, issued[field]);
  if (!Number.isInteger(nbf.count) || nbf.count < 0 || nbf.count > summary.cohort_size) throw new Error(`${name}.statistics.absolute_not_before_skew_seconds.count invalid`);
  if (nbf.count > 0) for (const field of ['median','p95','max']) assertFiniteNonNegative(`${name}.statistics.absolute_not_before_skew_seconds.${field}`, nbf[field]);

  return {
    cohort_size: summary.cohort_size,
    lifetime_p95: lifetime.p95,
    issued_skew_p95: issued.p95,
    nbf_count: nbf.count,
    nbf_skew_p95: nbf.count > 0 ? nbf.p95 : null
  };
}

export function evaluateTemporalCalibrationDrift(baselineSummary, currentSummary, options = {}) {
  const minimumCohort = options.minimumCohort ?? 5;
  const maxSkewIncreaseSeconds = options.maxSkewIncreaseSeconds ?? 30;
  const maxLifetimeDecreaseSeconds = options.maxLifetimeDecreaseSeconds ?? 30;
  if (!Number.isInteger(minimumCohort) || minimumCohort < 3) throw new TypeError('minimumCohort must be an integer >= 3');
  assertFiniteNonNegative('maxSkewIncreaseSeconds', maxSkewIncreaseSeconds);
  assertFiniteNonNegative('maxLifetimeDecreaseSeconds', maxLifetimeDecreaseSeconds);

  const baseline = normalizeSummary('baselineSummary', baselineSummary);
  const current = normalizeSummary('currentSummary', currentSummary);
  const reasons = [];

  if (baseline.cohort_size < minimumCohort || current.cohort_size < minimumCohort) reasons.push('insufficient_cohort');
  if (current.issued_skew_p95 > baseline.issued_skew_p95 + maxSkewIncreaseSeconds) reasons.push('issued_skew_drift');
  if (current.lifetime_p95 < baseline.lifetime_p95 - maxLifetimeDecreaseSeconds) reasons.push('lifetime_contraction');
  if (baseline.nbf_count === 0 && current.nbf_count > 0) reasons.push('not_before_claim_emerged');
  if (baseline.nbf_count > 0 && current.nbf_count === 0) reasons.push('not_before_claim_disappeared');
  if (baseline.nbf_count > 0 && current.nbf_count > 0 && current.nbf_skew_p95 > baseline.nbf_skew_p95 + maxSkewIncreaseSeconds) reasons.push('not_before_skew_drift');

  return {
    schema_version: '1.0.0',
    status: reasons.length ? 'drift_review_required' : 'no_material_drift_observed',
    comparison_performed: true,
    reusable_for_review: reasons.length === 0,
    policy_change_permitted: false,
    reasons,
    thresholds: { minimum_cohort: minimumCohort, max_skew_increase_seconds: maxSkewIncreaseSeconds, max_lifetime_decrease_seconds: maxLifetimeDecreaseSeconds },
    observations: {
      baseline_cohort_size: baseline.cohort_size,
      current_cohort_size: current.cohort_size,
      issued_skew_p95_delta_seconds: current.issued_skew_p95 - baseline.issued_skew_p95,
      lifetime_p95_delta_seconds: current.lifetime_p95 - baseline.lifetime_p95,
      not_before_presence_changed: (baseline.nbf_count === 0) !== (current.nbf_count === 0),
      not_before_skew_p95_delta_seconds: baseline.nbf_count > 0 && current.nbf_count > 0 ? current.nbf_skew_p95 - baseline.nbf_skew_p95 : null
    },
    interpretation: 'This comparison detects material change between aggregate cohorts only. It does not authorize token acceptance, verifier widening, or deployment.',
    falsification_route: 'Collect a new independently verified cohort and reject this result if raw-source review shows dependent samples, clock-measurement error, or aggregate reconstruction mismatch.'
  };
}
