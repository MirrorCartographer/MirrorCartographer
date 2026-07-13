import test from 'node:test';
import assert from 'node:assert/strict';
import { validateHostnameAuthorityConsistency } from './validate-hostname-authority-consistency.mjs';

const commit = 'a'.repeat(40);
const url = 'https://abc123.mirror-cartographer-research.pages.dev';
const hostname = 'abc123.mirror-cartographer-research.pages.dev';

function fixtures() {
  return {
    authority: {
      project: 'mirror-cartographer-research',
      deployment: { url, hostname, relation: 'pages-preview', bound: true }
    },
    gate: {
      deployment_url: url,
      hostname,
      accepted: true,
      packet: {
        expected: { source_commit: commit },
        observation: { hostname }
      }
    },
    metadata: {
      valid: true,
      classification: 'exact-deployment-metadata-match',
      match: {
        id: 'deployment-1',
        project_name: 'mirror-cartographer-research',
        url,
        commit_hash: commit
      }
    },
    expectedCommit: commit
  };
}

test('accepts exact agreement across authority, served evidence, and control-plane metadata', () => {
  const result = validateHostnameAuthorityConsistency(fixtures());
  assert.equal(result.ok, true);
  assert.equal(result.accepted, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.bindings.deployment_url, url);
});

test('rejects a served lookalike hostname not bound by control-plane authority', () => {
  const input = fixtures();
  input.gate.deployment_url = 'https://lookalike.example.com';
  input.gate.hostname = 'lookalike.example.com';
  input.gate.packet.observation.hostname = 'lookalike.example.com';
  const result = validateHostnameAuthorityConsistency(input);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('authority-gate-url-mismatch'));
  assert.ok(result.errors.includes('authority-gate-hostname-mismatch'));
});

test('rejects metadata for a different source commit', () => {
  const input = fixtures();
  input.metadata.match.commit_hash = 'b'.repeat(40);
  const result = validateHostnameAuthorityConsistency(input);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('metadata.commit-mismatch'));
});

test('rejects custom-domain authority until explicitly admitted by policy', () => {
  const input = fixtures();
  input.authority.deployment.relation = 'declared-custom-domain';
  const result = validateHostnameAuthorityConsistency(input);
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('authority.relation-untrusted'));
});
