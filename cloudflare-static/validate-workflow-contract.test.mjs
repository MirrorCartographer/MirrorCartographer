import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectWorkflowContract } from './validate-workflow-contract.mjs';

const valid = `permissions:\n  contents: read\n  deployments: write\nconcurrency:\n  cancel-in-progress: false\njobs:\n  deploy-and-verify:\n    environment: cloudflare-research\n    steps:\n      - name: Checkout committed source\n      - name: Test deployment evidence contracts\n      - name: Verify committed research surface identity\n      - name: Classify deployment readiness\n      - name: Summarize deployment blocker\n      - name: Validate deployment blocker contract\n      - name: Deploy static research surface\n        with:\n          command: pages deploy . --commit-hash=\${{ github.sha }}\n      - name: Record deployment decision\n      - name: Verify served identity\n      - name: Record deployment proof\n      - name: Validate deployment proof contract\n      - name: Attest exact proof bytes and enforce builder policy\n      - name: Upload proof artifacts\n        with:\n          if-no-files-found: error\n          retention-days: 30\n      - name: Publish run summary\n        run: echo never contains secret values\n`;

test('accepts the complete ordered deployment evidence chain', () => {
  const result = inspectWorkflowContract(valid);
  assert.equal(result.ok, true);
  assert.equal(result.guarantees.readiness_precedes_deployment, true);
  assert.equal(result.guarantees.proof_validated_before_attestation, true);
});

test('rejects deployment before readiness classification', () => {
  const source = valid.replace('      - name: Classify deployment readiness\n', '').replace('      - name: Deploy static research surface\n', '      - name: Deploy static research surface\n      - name: Classify deployment readiness\n');
  const result = inspectWorkflowContract(source);
  assert.equal(result.ok, false);
  assert.ok(result.violations.includes('required_steps_out_of_order'));
});

test('rejects a workflow that stops binding the deployment to github.sha', () => {
  const result = inspectWorkflowContract(valid.replace('--commit-hash=${{ github.sha }}', '--commit-hash=main'));
  assert.equal(result.ok, false);
  assert.ok(result.violations.includes('source_commit_not_bound_to_deploy'));
});

test('rejects direct secret echo commands', () => {
  const result = inspectWorkflowContract(`${valid}\n      - run: echo $CLOUDFLARE_API_TOKEN\n`);
  assert.equal(result.ok, false);
  assert.ok(result.violations.includes('secret_name_echo_risk'));
});
