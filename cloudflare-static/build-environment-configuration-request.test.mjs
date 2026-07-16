import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnvironmentConfigurationRequest } from './build-environment-configuration-request.mjs';

const base = {
  schema_version: '1.0.0',
  status: 'blocked_external_configuration',
  blockers: [
    {
      name: 'CLOUDFLARE_API_TOKEN',
      reasons: ['missing'],
      actions: ['configure the secret in the cloudflare-research GitHub environment']
    },
    {
      name: 'CLOUDFLARE_ACCOUNT_ID',
      reasons: ['missing'],
      actions: ['configure the secret in the cloudflare-research GitHub environment']
    }
  ],
  privacy: { secret_values_emitted: false }
};

test('builds a deterministic privacy-safe operator request', () => {
  const result = buildEnvironmentConfigurationRequest(base);
  assert.equal(result.status, 'operator_action_required');
  assert.deepEqual(result.requested_secret_names, ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']);
  assert.equal(result.target.environment, 'cloudflare-research');
  assert.equal(result.target.project, 'mirror-cartographer-research');
  assert.equal(result.privacy.secret_values_emitted, false);
});

test('does not classify non-secret Cloudflare blockers as requested secrets', () => {
  const result = buildEnvironmentConfigurationRequest({
    ...base,
    blockers: [{
      name: 'CLOUDFLARE_PAGES_PROJECT',
      reasons: ['target_project_not_found'],
      actions: ['create the exact project']
    }]
  });
  assert.deepEqual(result.requested_secret_names, []);
  assert.equal(result.remediation[0].name, 'CLOUDFLARE_PAGES_PROJECT');
});

test('fails closed when blocker privacy evidence is absent or unsafe', () => {
  assert.throws(() => buildEnvironmentConfigurationRequest({ ...base, privacy: {} }), /privacy contract/);
  assert.throws(() => buildEnvironmentConfigurationRequest({ ...base, privacy: { secret_values_emitted: true } }), /privacy contract/);
});

test('marks a ready blocker packet as ready to dispatch without claiming deployment', () => {
  const result = buildEnvironmentConfigurationRequest({
    schema_version: '1.0.0',
    status: 'ready',
    blockers: [],
    privacy: { secret_values_emitted: false }
  });
  assert.equal(result.status, 'ready_to_dispatch');
  assert.deepEqual(result.requested_secret_names, []);
  assert.match(result.prohibitions.join(' '), /do not claim deployment/);
});
