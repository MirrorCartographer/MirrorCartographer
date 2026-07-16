import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnvironmentConfigurationRequest } from './validate-environment-configuration-request.mjs';

function validRequest() {
  return {
    schema_version: '1.0.0',
    kind: 'cloudflare_environment_configuration_request',
    status: 'operator_action_required',
    target: {
      repository: 'MirrorCartographer/MirrorCartographer',
      environment: 'cloudflare-research',
      workflow: '.github/workflows/cloudflare-pages-research.yml',
      project: 'mirror-cartographer-research'
    },
    requested_secret_names: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'],
    remediation: [
      { name: 'CLOUDFLARE_ACCOUNT_ID', actions: ['configure the named secret in the protected environment'] },
      { name: 'CLOUDFLARE_API_TOKEN', actions: ['configure the named secret in the protected environment'] }
    ],
    completion_evidence_required: [
      'workflow run URL and immutable run ID',
      'exact source commit SHA',
      'Cloudflare-returned deployment URL',
      'canonical pages.dev hostname',
      'served research-surface identity proof'
    ],
    prohibitions: [
      'do not include secret values in issues, logs, artifacts, commits, or this request',
      'do not treat configured secret names as proof that credentials are valid',
      'do not claim deployment until the returned URL resolves and serves the expected identity'
    ],
    privacy: { secret_values_emitted: false, private_source_material_emitted: false }
  };
}

test('accepts the exact authorized, privacy-safe configuration request', () => {
  const result = validateEnvironmentConfigurationRequest(validRequest());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('rejects an unauthorized repository, workflow, or secret name', () => {
  const request = validRequest();
  request.target.repository = 'attacker/fork';
  request.target.workflow = '.github/workflows/untrusted.yml';
  request.requested_secret_names.push('UNREVIEWED_SECRET');
  const result = validateEnvironmentConfigurationRequest(request);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /not authorized|not allowlisted/);
});

test('rejects explicit credential material fields', () => {
  const request = validRequest();
  request.secret_token_value = '0123456789abcdef0123456789abcdef';
  const result = validateEnvironmentConfigurationRequest(request);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /forbidden-sensitive-field/);
});

test('rejects weakened privacy and missing completion proof requirements', () => {
  const request = validRequest();
  request.privacy.secret_values_emitted = true;
  request.completion_evidence_required = ['exact source commit SHA'];
  const result = validateEnvironmentConfigurationRequest(request);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /privacy\.secret_values_emitted|missing completion evidence requirement/);
});
