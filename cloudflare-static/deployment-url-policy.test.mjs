import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeploymentUrl } from './deployment-url-policy.mjs';

test('accepts production and branch/deployment Pages hosts for the expected project', () => {
  assert.equal(evaluateDeploymentUrl('https://mirror-cartographer-research.pages.dev').ok, true);
  assert.equal(evaluateDeploymentUrl('https://main.mirror-cartographer-research.pages.dev/path').ok, true);
  assert.equal(evaluateDeploymentUrl('https://abc123.mirror-cartographer-research.pages.dev').ok, true);
});

test('rejects unrelated hosts and lookalike suffixes', () => {
  assert.equal(evaluateDeploymentUrl('https://example.com').reason, 'host-not-allowed');
  assert.equal(evaluateDeploymentUrl('https://mirror-cartographer-research.pages.dev.evil.test').reason, 'host-not-allowed');
});

test('requires HTTPS and forbids embedded credentials or nonstandard ports', () => {
  assert.equal(evaluateDeploymentUrl('http://mirror-cartographer-research.pages.dev').reason, 'https-required');
  assert.equal(evaluateDeploymentUrl('https://user:pass@mirror-cartographer-research.pages.dev').reason, 'credentials-forbidden');
  assert.equal(evaluateDeploymentUrl('https://mirror-cartographer-research.pages.dev:8443').reason, 'nonstandard-port-forbidden');
});

test('permits only explicitly approved custom hosts', () => {
  assert.equal(evaluateDeploymentUrl('https://research.example.org', { customHosts: ['research.example.org'] }).reason, 'approved-custom-host');
  assert.equal(evaluateDeploymentUrl('https://other.example.org', { customHosts: ['research.example.org'] }).ok, false);
});
