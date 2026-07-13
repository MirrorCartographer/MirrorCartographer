import { createHash } from 'node:crypto';

const HEX40 = /^[0-9a-f]{40}$/i;
const HEX64 = /^[0-9a-f]{64}$/i;

export function sha256Bytes(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return createHash('sha256').update(bytes).digest('hex');
}

export function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function digestExecutionReceipt(receipt) {
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) {
    throw new TypeError('receipt must be an object');
  }
  const unsigned = { ...receipt };
  delete unsigned.receipt_sha256;
  return sha256Bytes(canonicalize(unsigned));
}

export function evaluateCollectorExecutionBinding(bundle) {
  const reasons = [];
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) {
    return result(false, ['bundle_not_object']);
  }

  const { provenance, collector_source, workflow_source, receipt } = bundle;
  if (!provenance || typeof provenance !== 'object') reasons.push('provenance_missing');
  if (typeof collector_source !== 'string') reasons.push('collector_source_missing');
  if (typeof workflow_source !== 'string') reasons.push('workflow_source_missing');
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) reasons.push('receipt_missing');
  if (reasons.length) return result(false, reasons);

  if (!HEX40.test(String(provenance.collector_commit_sha || ''))) reasons.push('invalid_collector_commit_sha');
  if (!HEX40.test(String(provenance.workflow_sha || ''))) reasons.push('invalid_workflow_sha');
  if (!HEX64.test(String(provenance.collector_sha256 || ''))) reasons.push('invalid_collector_sha256');
  if (!HEX64.test(String(provenance.workflow_sha256 || ''))) reasons.push('invalid_workflow_sha256');
  if (provenance.collector_commit_sha !== provenance.workflow_sha) reasons.push('collector_workflow_commit_mismatch');

  const observedCollector = sha256Bytes(collector_source);
  const observedWorkflow = sha256Bytes(workflow_source);
  if (observedCollector !== provenance.collector_sha256) reasons.push('collector_bytes_digest_mismatch');
  if (observedWorkflow !== provenance.workflow_sha256) reasons.push('workflow_bytes_digest_mismatch');

  if (receipt.collector_sha256 !== observedCollector) reasons.push('receipt_collector_digest_mismatch');
  if (receipt.workflow_sha256 !== observedWorkflow) reasons.push('receipt_workflow_digest_mismatch');
  if (receipt.collector_path !== provenance.collector_path) reasons.push('collector_path_mismatch');
  if (receipt.workflow_ref !== provenance.workflow_ref) reasons.push('workflow_ref_mismatch');
  if (receipt.run_id !== provenance.run_id) reasons.push('run_id_mismatch');
  if (receipt.run_attempt !== provenance.run_attempt) reasons.push('run_attempt_mismatch');
  if (receipt.exit_code !== 0) reasons.push('collector_execution_failed');
  if (receipt.step_conclusion !== 'success') reasons.push('workflow_step_not_successful');
  if (!Array.isArray(receipt.argv) || receipt.argv.length < 2 || receipt.argv[1] !== provenance.collector_path) {
    reasons.push('collector_invocation_not_bound');
  }
  if (!HEX64.test(String(receipt.stdout_sha256 || ''))) reasons.push('stdout_digest_missing_or_invalid');
  if (!HEX64.test(String(receipt.stderr_sha256 || ''))) reasons.push('stderr_digest_missing_or_invalid');
  if (!HEX64.test(String(receipt.receipt_sha256 || ''))) {
    reasons.push('receipt_digest_missing_or_invalid');
  } else if (digestExecutionReceipt(receipt) !== receipt.receipt_sha256) {
    reasons.push('receipt_digest_mismatch');
  }

  if (receipt.contains_raw_tokens !== false) reasons.push('raw_token_boundary_not_proven');
  if (receipt.contains_private_payloads !== false) reasons.push('private_payload_boundary_not_proven');
  if (receipt.policy_change_permitted !== false) reasons.push('policy_boundary_not_proven');

  return result(reasons.length === 0, reasons);
}

function result(verified, reasons) {
  return {
    schema_version: '1.0.0',
    verified,
    disposition: verified ? 'collector_execution_bound' : 'execution_binding_review_required',
    reasons,
    policy_change_permitted: false,
    token_acceptance_permitted: false,
    deployment_permitted: false,
    interpretation: verified
      ? 'The supplied receipt is byte-bound to the declared collector, workflow, and successful invocation. Signature verification and independent repository/run acquisition remain required.'
      : 'The supplied evidence does not prove that the declared digest-bound collector executed successfully.'
  };
}
