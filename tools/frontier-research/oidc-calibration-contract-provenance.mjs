import { createHash } from 'node:crypto';

const REQUIRED_FIELDS = [
  'collector_repository',
  'collector_commit_sha',
  'collector_path',
  'collector_sha256',
  'workflow_ref',
  'workflow_sha',
  'run_id',
  'run_attempt',
  'measurement_contract_sha256'
];

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function digestMeasurementContract(contract) {
  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    throw new TypeError('measurement contract must be an object');
  }
  return sha256(canonicalize(contract));
}

export function evaluateCalibrationContractProvenance(record) {
  const reasons = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return fail(['record_not_object']);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!text(record[field]) && !Number.isInteger(record[field])) reasons.push(`missing_${field}`);
  }

  if (!/^[0-9a-f]{40}$/i.test(text(record.collector_commit_sha))) reasons.push('invalid_collector_commit_sha');
  if (!/^[0-9a-f]{64}$/i.test(text(record.collector_sha256))) reasons.push('invalid_collector_sha256');
  if (!/^[0-9a-f]{40}$/i.test(text(record.workflow_sha))) reasons.push('invalid_workflow_sha');
  if (!/^[0-9a-f]{64}$/i.test(text(record.measurement_contract_sha256))) reasons.push('invalid_measurement_contract_sha256');
  if (!Number.isInteger(record.run_id) || record.run_id < 1) reasons.push('invalid_run_id');
  if (!Number.isInteger(record.run_attempt) || record.run_attempt < 1) reasons.push('invalid_run_attempt');
  if (record.contains_raw_tokens !== false) reasons.push('raw_token_boundary_not_proven');
  if (record.contains_identity_claims !== false) reasons.push('identity_boundary_not_proven');
  if (record.policy_change_permitted !== false) reasons.push('policy_boundary_not_proven');

  if (record.measurement_contract && typeof record.measurement_contract === 'object') {
    const observed = digestMeasurementContract(record.measurement_contract);
    if (observed !== text(record.measurement_contract_sha256).toLowerCase()) {
      reasons.push('measurement_contract_digest_mismatch');
    }
  } else {
    reasons.push('measurement_contract_missing');
  }

  if (text(record.workflow_sha) !== text(record.collector_commit_sha)) {
    reasons.push('workflow_and_collector_commit_mismatch');
  }

  const verified = reasons.length === 0;
  return {
    schema_version: '1.0.0',
    verified,
    disposition: verified ? 'comparability_input_permitted' : 'provenance_review_required',
    reasons,
    policy_change_permitted: false,
    token_acceptance_permitted: false,
    deployment_permitted: false,
    interpretation: verified
      ? 'The declared measurement contract is digest-bound to an exact collector and workflow invocation; separate comparability and drift gates are still required.'
      : 'The measurement contract is not sufficiently bound to immutable collector and invocation provenance.'
  };
}

function fail(reasons) {
  return {
    schema_version: '1.0.0',
    verified: false,
    disposition: 'provenance_review_required',
    reasons,
    policy_change_permitted: false,
    token_acceptance_permitted: false,
    deployment_permitted: false,
    interpretation: 'The measurement contract is not sufficiently bound to immutable collector and invocation provenance.'
  };
}
