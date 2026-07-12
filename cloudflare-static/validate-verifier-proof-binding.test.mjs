import assert from 'node:assert/strict';
import test from 'node:test';
import { validateVerifierProofBinding } from './validate-verifier-proof-binding.mjs';

test('accepts a successful verifier row bound to the exact deployment URL', () => {
  const result = validateVerifierProofBinding({
    deployment_url: 'https://a1b2c3.mirror-cartographer-research.pages.dev/',
    verifier_output: [{ ok: true, resolvedUrl: 'https://a1b2c3.mirror-cartographer-research.pages.dev' }]
  });
  assert.equal(result.valid, true);
  assert.equal(result.bound_rows, 1);
  assert.deepEqual(result.errors, []);
});

test('rejects success that belongs to a different deployment URL', () => {
  const result = validateVerifierProofBinding({
    deployment_url: 'https://expected.mirror-cartographer-research.pages.dev',
    verifier_output: [{ ok: true, resolvedUrl: 'https://other.mirror-cartographer-research.pages.dev' }]
  });
  assert.equal(result.valid, false);
  assert.equal(result.successful_rows, 1);
  assert.equal(result.bound_rows, 0);
  assert.deepEqual(result.errors, ['successful-verifier-row-not-bound-to-deployment-url']);
});

test('does not treat an unbound failed row plus unrelated success as proof', () => {
  const result = validateVerifierProofBinding({
    deployment_url: 'https://expected.mirror-cartographer-research.pages.dev',
    verifier_output: [
      { ok: false, resolvedUrl: 'https://expected.mirror-cartographer-research.pages.dev' },
      { ok: true, resolvedUrl: 'https://other.mirror-cartographer-research.pages.dev' }
    ]
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /not-bound/);
});

test('fails closed when deployment URL or successful rows are absent', () => {
  const result = validateVerifierProofBinding({ verifier_output: [] });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ['deployment-url-invalid', 'successful-verifier-row-required']);
});
