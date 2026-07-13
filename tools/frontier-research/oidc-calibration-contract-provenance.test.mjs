import test from 'node:test';
import assert from 'node:assert/strict';
import {
  digestMeasurementContract,
  evaluateCalibrationContractProvenance
} from './oidc-calibration-contract-provenance.mjs';

const contract = {
  summary_schema_version: '1.0.0',
  metric_definition_version: 'temporal-v1',
  collector_version: 'collector-v3',
  provider_class: 'github-actions-oidc',
  clock_basis: 'runner-wall-clock',
  collection_method: 'aggregate-only',
  quantile_method: 'nearest-rank',
  privacy_profile: 'no-token-no-identity'
};

function valid(overrides = {}) {
  return {
    collector_repository: 'MirrorCartographer/MirrorCartographer',
    collector_commit_sha: 'a'.repeat(40),
    collector_path: 'tools/frontier-research/oidc-temporal-calibration.mjs',
    collector_sha256: 'b'.repeat(64),
    workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/calibration.yml@refs/heads/main',
    workflow_sha: 'a'.repeat(40),
    run_id: 123,
    run_attempt: 1,
    measurement_contract: contract,
    measurement_contract_sha256: digestMeasurementContract(contract),
    contains_raw_tokens: false,
    contains_identity_claims: false,
    policy_change_permitted: false,
    ...overrides
  };
}

test('accepts exact contract, collector, and invocation binding', () => {
  const result = evaluateCalibrationContractProvenance(valid());
  assert.equal(result.verified, true);
  assert.equal(result.disposition, 'comparability_input_permitted');
  assert.equal(result.policy_change_permitted, false);
});

test('rejects a changed contract under a stale digest', () => {
  const result = evaluateCalibrationContractProvenance(valid({
    measurement_contract: { ...contract, quantile_method: 'linear-interpolation' }
  }));
  assert.equal(result.verified, false);
  assert.ok(result.reasons.includes('measurement_contract_digest_mismatch'));
});

test('rejects workflow and collector commit divergence', () => {
  const result = evaluateCalibrationContractProvenance(valid({ workflow_sha: 'c'.repeat(40) }));
  assert.equal(result.verified, false);
  assert.ok(result.reasons.includes('workflow_and_collector_commit_mismatch'));
});

test('rejects privacy or policy boundary ambiguity', () => {
  const result = evaluateCalibrationContractProvenance(valid({ contains_raw_tokens: true }));
  assert.equal(result.verified, false);
  assert.ok(result.reasons.includes('raw_token_boundary_not_proven'));
  assert.equal(result.token_acceptance_permitted, false);
});

test('canonical digest is key-order independent', () => {
  const reordered = Object.fromEntries(Object.entries(contract).reverse());
  assert.equal(digestMeasurementContract(contract), digestMeasurementContract(reordered));
});
