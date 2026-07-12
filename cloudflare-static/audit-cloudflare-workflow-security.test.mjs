import test from 'node:test';
import assert from 'node:assert/strict';
import { auditCloudflareWorkflowSecurity } from './audit-cloudflare-workflow-security.mjs';

const safe = `name: Deploy\non:\n  workflow_dispatch:\npermissions:\n  contents: read\n  deployments: write\n  id-token: write\n  attestations: write\nconcurrency:\n  group: cloudflare-research-production\n  cancel-in-progress: false\njobs:\n  deploy:\n    environment: cloudflare-research\n    steps:\n      - uses: actions/checkout@v6\n      - run: echo safe\n`;

test('accepts the intended fail-closed workflow posture and flags floating action refs only as advisory', () => {
  const result = auditCloudflareWorkflowSecurity(safe);
  assert.equal(result.status, 'security_contract_satisfied');
  assert.equal(result.warnings[0].code, 'floating_action_refs');
});

test('rejects automatic pull request execution', () => {
  const result = auditCloudflareWorkflowSecurity(safe.replace('  workflow_dispatch:\n', '  workflow_dispatch:\n  pull_request:\n'));
  assert.equal(result.checks.manual_dispatch_only, false);
  assert.equal(result.status, 'security_contract_failed');
});

test('rejects expanded repository permissions', () => {
  const result = auditCloudflareWorkflowSecurity(safe.replace('  contents: read\n', '  contents: write\n'));
  assert.equal(result.checks.least_privilege_permissions, false);
});

test('rejects direct secret interpolation inside shell run blocks', () => {
  const result = auditCloudflareWorkflowSecurity(safe.replace('echo safe', 'echo ${{ secrets.CLOUDFLARE_API_TOKEN }}'));
  assert.equal(result.checks.no_secret_interpolation_in_run_blocks, false);
});

test('accepts exact commit-pinned action refs without advisory', () => {
  const pinned = safe.replace('actions/checkout@v6', `actions/checkout@${'a'.repeat(40)}`);
  const result = auditCloudflareWorkflowSecurity(pinned);
  assert.equal(result.warnings.length, 0);
});
