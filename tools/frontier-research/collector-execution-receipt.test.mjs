import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalize,
  digestExecutionReceipt,
  evaluateCollectorExecutionBinding,
  sha256Bytes
} from './collector-execution-receipt.mjs';

const collector = 'console.log(JSON.stringify({count: 3}));\n';
const workflow = 'steps:\n  - run: node tools/frontier-research/collector.mjs\n';

function validBundle() {
  const provenance = {
    collector_commit_sha: 'a'.repeat(40),
    workflow_sha: 'a'.repeat(40),
    collector_path: 'tools/frontier-research/collector.mjs',
    collector_sha256: sha256Bytes(collector),
    workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/calibrate.yml@refs/heads/main',
    workflow_sha256: sha256Bytes(workflow),
    run_id: 123,
    run_attempt: 1
  };
  const receipt = {
    collector_sha256: provenance.collector_sha256,
    workflow_sha256: provenance.workflow_sha256,
    collector_path: provenance.collector_path,
    workflow_ref: provenance.workflow_ref,
    run_id: provenance.run_id,
    run_attempt: provenance.run_attempt,
    argv: ['node', provenance.collector_path],
    exit_code: 0,
    step_conclusion: 'success',
    stdout_sha256: sha256Bytes('{"count":3}\n'),
    stderr_sha256: sha256Bytes(''),
    contains_raw_tokens: false,
    contains_private_payloads: false,
    policy_change_permitted: false
  };
  receipt.receipt_sha256 = digestExecutionReceipt(receipt);
  return { provenance, collector_source: collector, workflow_source: workflow, receipt };
}

test('accepts a byte-bound successful collector execution receipt', () => {
  const result = evaluateCollectorExecutionBinding(validBundle());
  assert.equal(result.verified, true);
  assert.equal(result.disposition, 'collector_execution_bound');
});

test('rejects substituted collector bytes', () => {
  const bundle = validBundle();
  bundle.collector_source += '// changed';
  const result = evaluateCollectorExecutionBinding(bundle);
  assert.equal(result.verified, false);
  assert.ok(result.reasons.includes('collector_bytes_digest_mismatch'));
});

test('rejects a receipt naming a different executed path even when other hashes match', () => {
  const bundle = validBundle();
  bundle.receipt.argv = ['node', 'tools/frontier-research/lookalike.mjs'];
  bundle.receipt.receipt_sha256 = digestExecutionReceipt(bundle.receipt);
  const result = evaluateCollectorExecutionBinding(bundle);
  assert.ok(result.reasons.includes('collector_invocation_not_bound'));
});

test('rejects failed execution and failed workflow step', () => {
  const bundle = validBundle();
  bundle.receipt.exit_code = 1;
  bundle.receipt.step_conclusion = 'failure';
  bundle.receipt.receipt_sha256 = digestExecutionReceipt(bundle.receipt);
  const result = evaluateCollectorExecutionBinding(bundle);
  assert.ok(result.reasons.includes('collector_execution_failed'));
  assert.ok(result.reasons.includes('workflow_step_not_successful'));
});

test('rejects receipt mutation after digest creation', () => {
  const bundle = validBundle();
  bundle.receipt.run_attempt = 2;
  const result = evaluateCollectorExecutionBinding(bundle);
  assert.ok(result.reasons.includes('run_attempt_mismatch'));
  assert.ok(result.reasons.includes('receipt_digest_mismatch'));
});

test('canonicalization is key-order independent', () => {
  assert.equal(canonicalize({ b: 2, a: 1 }), canonicalize({ a: 1, b: 2 }));
});
