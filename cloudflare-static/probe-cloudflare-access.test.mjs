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

test('accepts active token with Pages project-list permission', async () => {
  const fetchImpl = mockFetch([
    { status: 200, body: { success: true, result: { status: 'active' } } },
    { status: 200, body: { success: true, result: [{ name: 'zeta' }, { name: 'alpha' }] } }
  ]);
  const result = await probeCloudflareAccess({ accountId, apiToken, fetchImpl });
  assert.equal(result.ready, true);
  assert.deepEqual(result.pages.project_names, ['alpha', 'zeta']);
  assert.equal(fetchImpl.calls.length, 2);
  assert.equal(result.privacy.secret_values_emitted, false);
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
  assert.equal(fetchImpl.calls.length, 0);
});
