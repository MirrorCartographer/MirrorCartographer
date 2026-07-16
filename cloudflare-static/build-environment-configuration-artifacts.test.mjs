import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnvironmentConfigurationArtifacts } from './build-environment-configuration-artifacts.mjs';

const baseBlocker = {
  schema_version: '1.0.0',
  status: 'blocked',
  blockers: [
    { name: 'CLOUDFLARE_API_TOKEN', actions: ['configure protected environment secret'] },
    { name: 'CLOUDFLARE_ACCOUNT_ID', actions: ['configure protected environment secret'] }
  ],
  privacy: { secret_values_emitted: false }
};

test('builds and validates a privacy-safe operator handoff atomically', () => {
  const { request, validation } = buildEnvironmentConfigurationArtifacts(baseBlocker);
  assert.equal(request.status, 'operator_action_required');
  assert.deepEqual(request.requested_secret_names, ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN']);
  assert.equal(validation.valid, true);
  assert.deepEqual(validation.errors, []);
});

test('ready blocker produces a dispatch-ready request without claiming deployment', () => {
  const { request } = buildEnvironmentConfigurationArtifacts({ ...baseBlocker, status: 'ready', blockers: [] });
  assert.equal(request.status, 'ready_to_dispatch');
  assert.equal(request.prohibitions.some((entry) => entry.includes('do not claim deployment')), true);
});

test('fails closed before emitting artifacts when blocker privacy is weakened', () => {
  assert.throws(
    () => buildEnvironmentConfigurationArtifacts({ ...baseBlocker, privacy: { secret_values_emitted: true } }),
    /privacy contract is not fail-closed/
  );
});
