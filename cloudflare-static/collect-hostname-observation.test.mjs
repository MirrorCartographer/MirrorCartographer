import test from 'node:test';
import assert from 'node:assert/strict';
import { collectHostnameObservation } from './collect-hostname-observation.mjs';

function response(body, { status = 200, url = 'https://mirror-cartographer-research.pages.dev/', contentType = 'text/html' } = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    url,
    headers: new Map([
      ['content-type', contentType],
      ['content-length', String(Buffer.byteLength(body))]
    ]),
    async text() { return body; }
  };
}

test('retains DNS, served identity, and exact commit evidence separately', async () => {
  const commit = 'a'.repeat(40);
  const html = '<!doctype html><title>Mirror Cartographer Research Field</title><main>Build theories that can survive contact with evidence.</main><h2>Theory instrument</h2>';
  const manifest = JSON.stringify({
    schema_version: '1.0.0',
    surface: 'mirror-cartographer-research',
    repository: 'MirrorCartographer/MirrorCartographer',
    source_commit: commit,
    privacy: { contains_secrets: false, contains_private_user_data: false }
  });
  const fetchImpl = async (url) => String(url).includes('/.well-known/')
    ? response(manifest, { url: String(url), contentType: 'application/json' })
    : response(html);

  const result = await collectHostnameObservation({
    hostname: 'mirror-cartographer-research.pages.dev',
    expectedCommit: commit,
    repository: 'MirrorCartographer/MirrorCartographer',
    observedAt: '2026-07-13T12:00:00.000Z'
  }, {
    resolve4: async () => ['192.0.2.8'],
    resolve6: async () => ['2001:db8::8'],
    fetchImpl
  });

  assert.deepEqual(result.ipv4, ['192.0.2.8']);
  assert.deepEqual(result.ipv6, ['2001:db8::8']);
  assert.equal(result.http.completed, true);
  assert.equal(result.http.identity_verified, true);
  assert.equal(result.http.deployed_commit_verified, true);
});

test('does not turn DNS failure into HTTP or identity proof', async () => {
  const result = await collectHostnameObservation({
    hostname: 'mirror-cartographer-research.pages.dev',
    observedAt: '2026-07-13T12:00:00.000Z'
  }, {
    resolve4: async () => { const error = new Error('not found'); error.code = 'ENOTFOUND'; throw error; },
    resolve6: async () => { const error = new Error('not found'); error.code = 'ENOTFOUND'; throw error; },
    fetchImpl: async () => { throw new Error('network unreachable'); }
  });

  assert.deepEqual(result.ipv4, []);
  assert.deepEqual(result.ipv6, []);
  assert.deepEqual(result.dns_errors, ['A:ENOTFOUND', 'AAAA:ENOTFOUND']);
  assert.equal(result.http.completed, false);
  assert.equal(result.http.identity_verified, false);
  assert.equal(result.http.deployed_commit_verified, false);
});

test('rejects malformed hostnames before network access', async () => {
  await assert.rejects(
    collectHostnameObservation({ hostname: 'https://example.com/path' }),
    /hostname-invalid/
  );
});
