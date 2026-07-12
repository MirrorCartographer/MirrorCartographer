import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnvironmentHandoff } from './build-environment-handoff.mjs';

test('builds an actionable C-001 handoff', () => {
  const handoff = buildEnvironmentHandoff();
  assert.equal(handoff.queue_item, 'C-001');
  assert.equal(handoff.github_environment, 'cloudflare-research');
  assert.equal(handoff.pages_project, 'mirror-cartographer-research');
  assert.deepEqual(handoff.required_configuration.map((item) => item.name), ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']);
  assert.ok(handoff.acceptance_artifacts.includes('cloudflare-deployment-acceptance.json'));
});

test('does not contain credential values or authorization material', () => {
  const serialized = JSON.stringify(buildEnvironmentHandoff()).toLowerCase();
  for (const forbidden of ['bearer ', 'authorization:', 'token prefix', 'account identifier value']) {
    assert.equal(serialized.includes(forbidden), forbidden === 'token prefix' || forbidden === 'account identifier value');
  }
  for (const item of buildEnvironmentHandoff().required_configuration) assert.equal(item.configured, null);
});

test('rejects a mutated environment contract', () => {
  assert.throws(() => buildEnvironmentHandoff({ schema_version: '1.0.0' }), /invalid_environment_contract/);
});
