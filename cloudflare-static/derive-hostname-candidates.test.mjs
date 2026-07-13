import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveHostnameCandidates } from './derive-hostname-candidates.mjs';

test('derives the conventional Pages hostname as candidate-only evidence', () => {
  const result = deriveHostnameCandidates({ name: 'mirror-cartographer-research' });
  assert.equal(result.projectName, 'mirror-cartographer-research');
  assert.deepEqual(result.candidates, [{
    hostname: 'mirror-cartographer-research.pages.dev',
    basis: 'cloudflare_pages_default_hostname_convention',
    claimState: 'candidate_only'
  }]);
  assert.equal(result.authorizedClaim, 'candidate_generation_only');
});

test('normalizes case and surrounding whitespace', () => {
  const result = deriveHostnameCandidates({ name: '  Mirror-Cartographer-Research  ' });
  assert.equal(result.projectName, 'mirror-cartographer-research');
});

test('rejects invalid or ambiguous project names', () => {
  for (const name of ['', 'bad_name', '-leading', 'trailing-', '.']) {
    assert.throws(() => deriveHostnameCandidates({ name }), /project name/);
  }
});

test('does not authorize deployment or exact-commit claims', () => {
  const result = deriveHostnameCandidates({ name: 'mirror-cartographer-research' });
  assert.notEqual(result.authorizedClaim, 'deployment_verified');
  assert.match(result.limits.join(' '), /does not prove that a Pages project exists/);
  assert.match(result.limits.join(' '), /does not prove exact commit identity/);
});

test('adds a workers.dev candidate only when an account subdomain is supplied', () => {
  const result = deriveHostnameCandidates(
    { name: 'mirror-cartographer-research' },
    { accountSubdomain: 'example-account' }
  );
  assert.equal(result.candidates.length, 2);
  assert.equal(result.candidates[1].hostname, 'mirror-cartographer-research.example-account.workers.dev');
  assert.equal(result.candidates[1].claimState, 'candidate_only');
});
