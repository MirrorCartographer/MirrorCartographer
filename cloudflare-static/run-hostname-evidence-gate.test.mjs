import test from 'node:test';
import assert from 'node:assert/strict';
import { hostnameFromDeploymentUrl, runHostnameEvidenceGate } from './run-hostname-evidence-gate.mjs';

const commit = 'a'.repeat(40);

function acceptedPacket({ hostname, expectedCommit, repository }) {
  return {
    expected: { source_commit: expectedCommit, repository },
    observation: { hostname },
    classification: { claim: 'deployed-commit-served' },
    accepted: true
  };
}

test('accepts the canonical production Pages origin with exact bindings', async () => {
  const result = await runHostnameEvidenceGate({
    deploymentUrl: 'https://mirror-cartographer-research.pages.dev/',
    projectName: 'mirror-cartographer-research',
    expectedCommit: commit,
    repository: 'MirrorCartographer/MirrorCartographer'
  }, { builder: async input => acceptedPacket(input) });

  assert.equal(result.hostname, 'mirror-cartographer-research.pages.dev');
  assert.equal(result.hostname_policy.binding.host_class, 'pages-production-host');
  assert.equal(result.accepted, true);
});

test('accepts a project-bound preview Pages origin', async () => {
  const result = await runHostnameEvidenceGate({
    deploymentUrl: 'https://9e8c746c.mirror-cartographer-research.pages.dev/',
    projectName: 'mirror-cartographer-research',
    expectedCommit: commit,
    repository: 'MirrorCartographer/MirrorCartographer'
  }, { builder: async input => acceptedPacket(input) });

  assert.equal(result.hostname_policy.binding.host_class, 'pages-preview-host');
  assert.equal(result.accepted, true);
});

test('rejects a lookalike Pages hostname before network evidence construction', async () => {
  let builderCalled = false;
  await assert.rejects(() => runHostnameEvidenceGate({
    deploymentUrl: 'https://mirror-cartographer-research.pages.dev.attacker.example/',
    projectName: 'mirror-cartographer-research',
    expectedCommit: commit
  }, {
    builder: async () => {
      builderCalled = true;
      return {};
    }
  }), /deployment-hostname-policy-rejected:hostname-not-bound-to-pages-project-or-allowlist/);
  assert.equal(builderCalled, false);
});

test('rejects a deployment URL with path, query, or fragment before probing', async () => {
  await assert.rejects(() => runHostnameEvidenceGate({
    deploymentUrl: 'https://mirror-cartographer-research.pages.dev/path?q=1#fragment',
    projectName: 'mirror-cartographer-research',
    expectedCommit: commit
  }), /deployment-hostname-policy-rejected:deployment-url-must-identify-origin-root/);
});

test('accepts only an explicitly allowlisted custom hostname', async () => {
  const result = await runHostnameEvidenceGate({
    deploymentUrl: 'https://research.example.org/',
    projectName: 'mirror-cartographer-research',
    allowedCustomHosts: ['research.example.org'],
    expectedCommit: commit,
    repository: 'MirrorCartographer/MirrorCartographer'
  }, { builder: async input => acceptedPacket(input) });

  assert.equal(result.hostname_policy.binding.host_class, 'explicit-custom-host');
  assert.equal(result.accepted, true);
});

test('rejects non-HTTPS deployment URLs', () => {
  assert.throws(() => hostnameFromDeploymentUrl('http://mirror-cartographer-research.pages.dev'), /deployment-url-must-use-https/);
});

test('rejects packet hostname substitution', async () => {
  await assert.rejects(() => runHostnameEvidenceGate({
    deploymentUrl: 'https://mirror-cartographer-research.pages.dev/',
    projectName: 'mirror-cartographer-research',
    expectedCommit: commit,
    repository: 'MirrorCartographer/MirrorCartographer'
  }, {
    builder: async () => ({ expected: { source_commit: commit }, observation: { hostname: 'evil.pages.dev' }, accepted: true })
  }), /packet-hostname-binding-mismatch/);
});

test('rejects packet commit substitution', async () => {
  await assert.rejects(() => runHostnameEvidenceGate({
    deploymentUrl: 'https://mirror-cartographer-research.pages.dev/',
    projectName: 'mirror-cartographer-research',
    expectedCommit: commit,
    repository: 'MirrorCartographer/MirrorCartographer'
  }, {
    builder: async () => ({ expected: { source_commit: 'b'.repeat(40) }, observation: { hostname: 'mirror-cartographer-research.pages.dev' }, accepted: true })
  }), /packet-commit-binding-mismatch/);
});
