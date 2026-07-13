import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeploymentRedirectContinuity } from './deployment-redirect-continuity.mjs';

test('accepts an unchanged exact deployment URL', () => {
  const url = 'https://abc123.mirror-cartographer-research.pages.dev/';
  const result = evaluateDeploymentRedirectContinuity(url, url);
  assert.equal(result.ok, true);
  assert.deepEqual(result.reasons, []);
});

test('rejects a redirect from preview host to production host', () => {
  const result = evaluateDeploymentRedirectContinuity(
    'https://abc123.mirror-cartographer-research.pages.dev/',
    'https://mirror-cartographer-research.pages.dev/'
  );
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('hostname-changed-during-fetch'));
});

test('rejects path substitution on the same host', () => {
  const result = evaluateDeploymentRedirectContinuity(
    'https://mirror-cartographer-research.pages.dev/proof',
    'https://mirror-cartographer-research.pages.dev/'
  );
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('path-changed-during-fetch'));
});

test('rejects a query substitution on the same host', () => {
  const result = evaluateDeploymentRedirectContinuity(
    'https://mirror-cartographer-research.pages.dev/?commit=abc',
    'https://mirror-cartographer-research.pages.dev/?commit=def'
  );
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('query-changed-during-fetch'));
});

test('retains URL policy rejection reasons', () => {
  const result = evaluateDeploymentRedirectContinuity(
    'http://mirror-cartographer-research.pages.dev/',
    'https://example.com/'
  );
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('candidate:https-required'));
  assert.ok(result.reasons.includes('resolved:host-not-allowed'));
});
