import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyHostnameAuthorityConsistencyArtifact } from './verify-hostname-authority-consistency.mjs';

const commit = 'a'.repeat(40);
const base = {
  schema_version: '1.0.0',
  ok: true,
  accepted: true,
  errors: [],
  bindings: {
    deployment_url: 'https://abc.mirror-cartographer-research.pages.dev',
    hostname: 'abc.mirror-cartographer-research.pages.dev',
    project: 'mirror-cartographer-research',
    source_commit: commit,
    authority_relation: 'pages-preview',
    metadata_deployment_id: 'deployment-123'
  },
  acceptance_rule: 'same URL, project, hostname, and commit',
  epistemic_limit: 'identity consistency only',
  artifact_type: 'cloudflare-hostname-authority-consistency',
  source_inputs: {
    authority: 'cloudflare-pages-hostname-authority.json',
    gate: 'cloudflare-hostname-evidence-gate.json',
    metadata: 'cloudflare-deployment-metadata.json'
  },
  deployment_claim_permitted: true,
  privacy: { secret_values_emitted: false }
};

test('accepts a structurally consistent retained artifact', () => {
  const result = verifyHostnameAuthorityConsistencyArtifact({ artifact: structuredClone(base), expectedCommit: commit });
  assert.equal(result.verified, true);
  assert.equal(result.deployment_claim_permitted, true);
  assert.equal(result.claim_ceiling, 'deployment-identity-consistency-only');
});

test('rejects an elevated claim when the stored verdict is rejected', () => {
  const artifact = structuredClone(base);
  artifact.ok = false;
  artifact.accepted = false;
  artifact.errors = ['metadata.not-exact-match'];
  artifact.deployment_claim_permitted = true;
  const result = verifyHostnameAuthorityConsistencyArtifact({ artifact, expectedCommit: commit });
  assert.equal(result.verified, false);
  assert.ok(result.errors.includes('claim-permission.inconsistent'));
  assert.equal(result.deployment_claim_permitted, false);
});

test('rejects commit substitution', () => {
  const artifact = structuredClone(base);
  artifact.bindings.source_commit = 'b'.repeat(40);
  const result = verifyHostnameAuthorityConsistencyArtifact({ artifact, expectedCommit: commit });
  assert.equal(result.verified, false);
  assert.ok(result.errors.includes('bindings.commit-mismatch'));
});

test('rejects hostname and URL disagreement', () => {
  const artifact = structuredClone(base);
  artifact.bindings.hostname = 'other.pages.dev';
  const result = verifyHostnameAuthorityConsistencyArtifact({ artifact, expectedCommit: commit });
  assert.equal(result.verified, false);
  assert.ok(result.errors.includes('bindings.hostname-url-mismatch'));
});

test('rejects secret-emission ambiguity', () => {
  const artifact = structuredClone(base);
  artifact.privacy.secret_values_emitted = true;
  const result = verifyHostnameAuthorityConsistencyArtifact({ artifact, expectedCommit: commit });
  assert.equal(result.verified, false);
  assert.ok(result.errors.includes('privacy.secret-emission-not-denied'));
});
