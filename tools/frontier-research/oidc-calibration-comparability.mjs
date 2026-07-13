const REQUIRED_IDENTITY_FIELDS = [
  'summary_schema_version',
  'metric_definition_version',
  'collector_version',
  'provider_class',
  'clock_basis',
  'collection_method',
  'quantile_method',
  'privacy_profile'
];

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateCohort(cohort, label) {
  const reasons = [];
  if (!isPlainObject(cohort)) return [`${label}_not_object`];

  for (const field of REQUIRED_IDENTITY_FIELDS) {
    if (!normalizedString(cohort[field])) reasons.push(`${label}_missing_${field}`);
  }

  if (!Number.isInteger(cohort.sample_count) || cohort.sample_count < 1) {
    reasons.push(`${label}_invalid_sample_count`);
  }

  if (cohort.contains_raw_tokens !== false) reasons.push(`${label}_raw_token_boundary_not_proven`);
  if (cohort.contains_identity_claims !== false) reasons.push(`${label}_identity_boundary_not_proven`);
  if (cohort.policy_change_permitted !== false) reasons.push(`${label}_policy_boundary_not_proven`);

  return reasons;
}

export function evaluateTemporalCalibrationComparability(baseline, current) {
  const reasons = [
    ...validateCohort(baseline, 'baseline'),
    ...validateCohort(current, 'current')
  ];

  if (reasons.length === 0) {
    for (const field of REQUIRED_IDENTITY_FIELDS) {
      if (normalizedString(baseline[field]) !== normalizedString(current[field])) {
        reasons.push(`mismatch_${field}`);
      }
    }

    if (normalizedString(baseline.cohort_id) && normalizedString(current.cohort_id) && baseline.cohort_id === current.cohort_id) {
      reasons.push('cohort_identity_reused');
    }

    if (
      Number.isFinite(baseline.window_end_epoch_s) &&
      Number.isFinite(current.window_start_epoch_s) &&
      current.window_start_epoch_s <= baseline.window_end_epoch_s
    ) {
      reasons.push('collection_windows_overlap_or_reverse');
    }
  }

  const comparable = reasons.length === 0;
  return {
    schema_version: '1.0.0',
    comparable,
    disposition: comparable ? 'drift_evaluation_permitted' : 'comparability_review_required',
    reasons,
    policy_change_permitted: false,
    token_acceptance_permitted: false,
    deployment_permitted: false,
    interpretation: comparable
      ? 'The aggregate cohorts share the declared measurement contract and may proceed to a separate drift evaluation.'
      : 'The aggregate cohorts do not share a proven measurement contract and must not be compared for drift.'
  };
}
