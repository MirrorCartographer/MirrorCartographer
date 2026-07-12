import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCloudflareBrowserVerificationPlan } from './build-browser-verification-plan.mjs';

const commit = '0123456789abcdef0123456789abcdef01234567';
const url = 'https://mirror-cartographer-research.pages.dev';

test('builds a Cloudflare-specific WebDriver BiDi verification plan', () => {
  const result = buildCloudflareBrowserVerificationPlan({ deploymentUrl: url, expectedCommit: commit });
  assert.equal(result.provider, 'cloudflare-pages');
  assert.equal(result.deployment_url, url);
  assert.equal(result.source_commit, commit);
  assert.equal(result.webdriver_bidi.acceptance.expectedCommit, commit);
  assert.deepEqual(result.webdriver_bidi.acceptance.requiredSequence, [
    'browsingContext.navigationStarted',
    'network.responseCompleted',
    'browsingContext.load',
    'script.evaluate',
    'browsingContext.captureScreenshot'
  ]);
  assert.match(result.runtime_expression, /sourceCommit/);
  assert.ok(result.acceptance_boundary.excludes.includes('scientific truth'));
});

test('rejects non-https deployment URLs', () => {
  assert.throws(() => buildCloudflareBrowserVerificationPlan({
    deploymentUrl: 'http://example.test',
    expectedCommit: commit
  }), /https URL/);
});

test('rejects abbreviated or malformed commit identities', () => {
  assert.throws(() => buildCloudflareBrowserVerificationPlan({
    deploymentUrl: url,
    expectedCommit: 'deadbeef'
  }), /40-character git SHA/);
});
