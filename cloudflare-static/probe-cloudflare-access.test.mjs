import assert from 'node:assert/strict';
import test from 'node:test';
import { probeCloudflareAccess } from './probe-cloudflare-access.mjs';

const accountId = 'a'.repeat(32);
const apiToken = 't'.repeat(40);

function mockFetch(responses) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    const next = responses.shift();
    return { status: next.status, json: async () => next.body };
  };
  fetchImpl.calls = calls;
  return fetchImpl;
}

test('accepts active token only when intended Pages project identity resolves', async () => {
  const fetchImpl = mockFetch([
    { status: 200, body: { success: true, result: { status: 'active' } } },
    {
      status: 200,
      body: {
        success: true,
        result: [
          { name: 'zeta', subdomain: 'zeta.pages.dev' },
          {
            name: 'mirror-cartographer-research',
            subdomain: 'mirror-cartographer-research.pages.dev',
            domains: ['Research.Example.com', 'mirror-cartographer-research.pages.dev']
          }
        ]
      }
    }
  ]);
  const result = await probeCloudflareAccess({ accountId, apiToken, fetchImpl });
  assert.equal(result.ready, true);
  assert.deepEqual(result.pages.project_names, ['mirror-cartographer-research', 'zeta']);
  assert.deepEqual(result.target_project, {
    name: 'mirror-cartographer-research',
    found: true,
    canonical_hostname: 'mirror-cartographer-research.pages.dev',
    custom_domains: ['mirror-cartographer-research.pages.dev', 'research.example.com'],
    reason: 'target_project_resolved'
  });
  assert.equal(fetchImpl.calls.length, 2);
  assert.equal(result.privacy.secret_values_emitted, false);
});

test('does not treat generic Pages access as target deployment readiness', async () => {
  const fetchImpl = mockFetch([
    { status: 200, body: { success: true } },
    { status: 200, body: { success: true, result: [{ name: 'another-project', subdomain: 'another-project.pages.dev' }] } }
  ]);
  const result = await probeCloudflareAccess({ accountId, apiToken, fetchImpl });
  assert.equal(result.ready, false);
  assert.equal(result.target_project.found, false);
  assert.equal(result.target_project.reason, 'target_project_not_found');
  assert.match(result.interpretation, /intended project identity is not yet resolved/);
});

test('records a found project with missing canonical hostname as unresolved identity', async () => {
  const fetchImpl = mockFetch([
    { status: 200, body: { success: true } },
    { status: 200, body: { success: true, result: [{ name: 'mirror-cartographer-research', domains: ['Research.Example.com'] }] } }
  ]);
  const result = await probeCloudflareAccess({ accountId, apiToken, fetchImpl });
  assert.equal(result.ready, false);
  assert.equal(result.target_project.found, true);
  assert.equal(result.target_project.canonical_hostname, null);
  assert.equal(result.target_project.reason, 'target_project_missing_canonical_hostname');
  assert.deepEqual(result.target_project.custom_domains, ['research.example.com']);
});

test('stops after rejected token', async () => {
  const fetchImpl = mockFetch([{ status: 401, body: { success: false, errors: [{ code: 1000, message: 'invalid token' }] } }]);
  const result = await probeCloudflareAccess({ accountId, apiToken, fetchImpl });
  assert.equal(result.ready, false);
  assert.equal(result.checks[0].reason, 'token_rejected');
  assert.equal(result.checks[1].reason, 'not_attempted');
  assert.equal(fetchImpl.calls.length, 1);
});

test('distinguishes active token from insufficient Pages permission', async () => {
  const fetchImpl = mockFetch([
    { status: 200, body: { success: true } },
    { status: 403, body: { success: false, errors: [{ code: 9109, message: 'permission denied' }] } }
  ]);
  const result = await probeCloudflareAccess({ accountId, apiToken, fetchImpl });
  assert.equal(result.ready, false);
  assert.equal(result.checks[1].reason, 'permission_denied');
});

test('rejects malformed configuration before network access', async () => {
  const fetchImpl = mockFetch([]);
  await assert.rejects(() => probeCloudflareAccess({ accountId: 'wrong', apiToken, fetchImpl }), /accountId/);
  await assert.rejects(() => probeCloudflareAccess({ accountId, apiToken, targetProjectName: 'Bad Name', fetchImpl }), /targetProjectName/);
  assert.equal(fetchImpl.calls.length, 0);
});
