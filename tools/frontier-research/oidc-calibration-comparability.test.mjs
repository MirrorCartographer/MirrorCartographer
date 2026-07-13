import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTemporalCalibrationComparability } from './oidc-calibration-comparability.mjs';

function cohort(overrides = {}) {
  return {
    summary_schema_version: '1.0.0',
    metric_definition_version: 'oidc-temporal-v1',
    collector_version: 'collector-1.2.0',
    provider_class: 'github-actions-oidc',
    clock_basis: 'unix-seconds-monotonic-observation',
    collection_method: 'independent-workflow-job-samples',
    quantile_method: 'nearest-rank',
    privacy_profile: 'aggregate-no-identity-v1',
    sample_count: 12,
    cohort_id: 'cohort-a',
    window_start_epoch_s: 1000,
    window_end_epoch_s: 1100,
    contains_raw_tokens: false,
    contains_identity_claims: false,
    policy_change_permitted: false,
    ...overrides
  };
}

test('permits a separate drift evaluation for contract-compatible non-overlapping cohorts', () => {
  const result = evaluateTemporalCalibrationComparability(
    cohort(),
    cohort({ cohort_id: 'cohort-b', window_start_epoch_s: 1200, window_end_epoch_s: 1300 })
  );
  assert.equal(result.comparable, true);
  assert.equal(result.disposition, 'drift_evaluation_permitted');
  assert.equal(result.policy_change_permitted, false);
});

test('rejects changed metric definitions and collector versions', () => {
  const result = evaluateTemporalCalibrationComparability(
    cohort(),
    cohort({ metric_definition_version: 'oidc-temporal-v2', collector_version: 'collector-2.0.0', cohort_id: 'cohort-b', window_start_epoch_s: 1200 })
  );
  assert.equal(result.comparable, false);
  assert.deepEqual(result.reasons, ['mismatch_metric_definition_version', 'mismatch_collector_version']);
});

test('rejects changed clock, quantile, or privacy contracts', () => {
  const result = evaluateTemporalCalibrationComparability(
    cohort(),
    cohort({ clock_basis: 'wall-clock-only', quantile_method: 'linear-interpolation', privacy_profile: 'unknown', cohort_id: 'cohort-b', window_start_epoch_s: 1200 })
  );
  assert.equal(result.comparable, false);
  assert.ok(result.reasons.includes('mismatch_clock_basis'));
  assert.ok(result.reasons.includes('mismatch_quantile_method'));
  assert.ok(result.reasons.includes('mismatch_privacy_profile'));
});

test('rejects reused identity and overlapping windows', () => {
  const result = evaluateTemporalCalibrationComparability(cohort(), cohort());
  assert.equal(result.comparable, false);
  assert.ok(result.reasons.includes('cohort_identity_reused'));
  assert.ok(result.reasons.includes('collection_windows_overlap_or_reverse'));
});

test('fails closed when privacy or policy boundaries are not explicit', () => {
  const result = evaluateTemporalCalibrationComparability(
    cohort(),
    cohort({ contains_raw_tokens: true, contains_identity_claims: true, policy_change_permitted: true })
  );
  assert.equal(result.comparable, false);
  assert.ok(result.reasons.includes('current_raw_token_boundary_not_proven'));
  assert.ok(result.reasons.includes('current_identity_boundary_not_proven'));
  assert.ok(result.reasons.includes('current_policy_boundary_not_proven'));
  assert.equal(result.token_acceptance_permitted, false);
  assert.equal(result.deployment_permitted, false);
});
