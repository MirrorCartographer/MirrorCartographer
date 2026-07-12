import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyPagesProjectResponse, discoverPagesProject } from './discover-pages-project.mjs';

test('verifies exact project and returns canonical Pages URL', () => {
  const result = classifyPagesProjectResponse({
    success: true,
    result: [{
      name: 'mirror-cartographer-research',
      subdomain: 'mirror-cartographer-research.pages.dev',
      domains: ['research.example.com'],
      production_branch: 'main'
    }]
  }, 'mirror-cartographer-research');

  assert.equal(result.status, 'project_verified');
  assert.equal(result.canonical_url, 'https://mirror-cartographer-research.pages.dev/');
  assert.deepEqual(result.domains, ['mirror-cartographer-research.pages.dev', 'research.example.com']);
});

test('fails closed when expected project is absent', () => {
  const result = classifyPagesProjectResponse({
    success: true,
    result: [{ name: 'different-project', subdomain: 'different-project.pages.dev' }]
  }, 'mirror-cartographer-research');

  assert.equal(result.status, 'project_not_found');
  assert.equal(result.project_found, false);
});

test('fails closed on malformed Cloudflare payload', () => {
  const result = classifyPagesProjectResponse({ success: false, errors: [{ code: 10000 }] }, 'mirror-cartographer-research');
  assert.equal(result.status, 'api_response_invalid');
  assert.deepEqual(result.reason_codes, ['cloudflare-pages-project-list-invalid']);
});

test('does not expose credentials in discovery evidence', async () => {
  const secret = 'token-that-must-not-appear';
  const result = await discoverPagesProject({
    accountId: 'account-id',
    apiToken: secret,
    expectedProject: 'mirror-cartographer-research',
    fetchImpl: async (_url, options) => {
      assert.equal(options.headers.Authorization, `Bearer ${secret}`);
      return {
        status: 200,
        async json() {
          return {
            success: true,
            result: [{ name: 'mirror-cartographer-research', subdomain: 'mirror-cartographer-research.pages.dev' }]
          };
        }
      };
    }
  });

  assert.equal(result.status, 'project_verified');
  assert.equal(JSON.stringify(result).includes(secret), false);
});
