import test from 'node:test';
import assert from 'node:assert/strict';
import { hostnameFromDeploymentUrl, runHostnameEvidenceGate } from './run-hostname-evidence-gate.mjs';

const commit = 'a'.repeat(40);

test('canonicalizes an HTTPS deployment URL and accepts exact bindings', async () => {
  const result = await runHostnameEvidenceGate({ deploymentUrl: 'https://Example.Pages.Dev/path?q=1', expectedCommit: commit, repository: 'MirrorCartographer/MirrorCartographer' }, {
    builder: async ({ hostname, expectedCommit, repository }) => ({
      expected: { source_commit: expectedCommit, repository },
      observation: { hostname },
      classification: { claim: 'deployed-commit-served' },
      accepted: true
    })
  });
  assert.equal(result.hostname, 'example.pages.dev');
  assert.equal(result.accepted, true);
});

test('rejects non-HTTPS deployment URLs', () => {
  assert.throws(() => hostnameFromDeploymentUrl('http://example.pages.dev'), /deployment-url-must-use-https/);
});

test('rejects packet hostname substitution', async () => {
  await assert.rejects(() => runHostnameEvidenceGate({ deploymentUrl: 'https://good.pages.dev', expectedCommit: commit, repository: 'MirrorCartographer/MirrorCartographer' }, {
    builder: async () => ({ expected: { source_commit: commit }, observation: { hostname: 'evil.pages.dev' }, accepted: true })
  }), /packet-hostname-binding-mismatch/);
});

test('rejects packet commit substitution', async () => {
  await assert.rejects(() => runHostnameEvidenceGate({ deploymentUrl: 'https://good.pages.dev', expectedCommit: commit, repository: 'MirrorCartographer/MirrorCartographer' }, {
    builder: async () => ({ expected: { source_commit: 'b'.repeat(40) }, observation: { hostname: 'good.pages.dev' }, accepted: true })
  }), /packet-commit-binding-mismatch/);
});
