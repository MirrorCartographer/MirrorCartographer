import test from 'node:test';
import assert from 'node:assert/strict';
import { probePublicPagesHostname } from './probe-public-pages-hostname.mjs';

const fixedNow = () => '2026-07-13T17:04:30.000Z';
const resolves = async () => ['192.0.2.10'];
const noV6 = async () => { const error = new Error('no v6'); error.code = 'ENODATA'; throw error; };

function response(body, { status = 200, url = 'https://mirror-cartographer-research.pages.dev/' } = {}) {
  return { status, url, text: async () => body };
}

test('fails closed when DNS does not resolve', async () => {
  const missing = async () => { const error = new Error('not found'); error.code = 'ENOTFOUND'; throw error; };
  const result = await probePublicPagesHostname({ resolve4: missing, resolve6: missing, now: fixedNow });
  assert.equal(result.classification, 'unresolved');
  assert.equal(result.http, null);
  assert.match(result.claim, /No public deployment claim/);
});

test('distinguishes DNS resolution from HTTP reachability', async () => {
  const result = await probePublicPagesHostname({
    resolve4: resolves,
    resolve6: noV6,
    fetchImpl: async () => { throw new Error('connection refused'); },
    now: fixedNow
  });
  assert.equal(result.classification, 'http_unreachable');
  assert.equal(result.dns.ipv4.length, 1);
  assert.match(result.http.error, /connection refused/);
});

test('rejects a reachable surface with the wrong identity', async () => {
  const result = await probePublicPagesHostname({
    resolve4: resolves,
    resolve6: noV6,
    fetchImpl: async () => response('<html><title>Unrelated site</title></html>'),
    now: fixedNow
  });
  assert.equal(result.classification, 'reachable_wrong_or_unverified_surface');
  assert.equal(result.identity.ok, false);
  assert.ok(result.identity.missing_markers.length > 0);
});

test('verifies expected identity without claiming exact commit proof', async () => {
  const body = '<title>Mirror Cartographer Research Field</title>Build theories that can survive contact with evidence. Theory instrument';
  const result = await probePublicPagesHostname({
    resolve4: resolves,
    resolve6: noV6,
    fetchImpl: async () => response(body),
    now: fixedNow
  });
  assert.equal(result.classification, 'identity_verified');
  assert.equal(result.identity.ok, true);
  assert.match(result.claim, /not exact-commit or control-plane deployment proof/);
});
