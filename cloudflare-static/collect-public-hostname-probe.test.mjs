import assert from 'node:assert/strict';
import test from 'node:test';
import { collectPublicHostnameProbe } from './collect-public-hostname-probe.mjs';
import { validatePublicHostnameProbe } from './validate-public-hostname-probe.mjs';

const checkedAt = '2026-07-13T17:35:00.000Z';
const no4 = async () => { const error = new Error('not found'); error.code = 'ENODATA'; throw error; };
const no6 = async () => { const error = new Error('not found'); error.code = 'ENODATA'; throw error; };
const yes4 = async () => ['203.0.113.7'];

function headers(values = {}) {
  return { get: (name) => values[name.toLowerCase()] ?? null };
}

test('classifies bounded DNS non-resolution without claiming nonexistence', async () => {
  const packet = await collectPublicHostnameProbe('example.pages.dev', {
    checkedAt, resolve4Fn: no4, resolve6Fn: no6,
    fetchFn: async () => { throw new Error('fetch must not run'); }
  });
  assert.equal(packet.classification, 'unresolved');
  assert.match(packet.claim, /bounded probe/);
  assert.equal(validatePublicHostnameProbe(packet).ok, true);
});

test('classifies resolved but unreachable HTTPS', async () => {
  const packet = await collectPublicHostnameProbe('example.pages.dev', {
    checkedAt, resolve4Fn: yes4, resolve6Fn: no6,
    fetchFn: async () => { throw new Error('connection refused'); }
  });
  assert.equal(packet.classification, 'http_unreachable');
  assert.equal(packet.dns.ipv4[0], '203.0.113.7');
  assert.equal(validatePublicHostnameProbe(packet).ok, true);
});

test('classifies reachable wrong surface', async () => {
  const packet = await collectPublicHostnameProbe('example.pages.dev', {
    checkedAt, resolve4Fn: yes4, resolve6Fn: no6,
    fetchFn: async () => ({
      status: 200,
      url: 'https://example.pages.dev/',
      headers: headers({ 'content-type': 'text/html' }),
      text: async () => '<html><title>Other site</title></html>'
    })
  });
  assert.equal(packet.classification, 'reachable_wrong_or_unverified_surface');
  assert.equal(packet.identity.ok, false);
  assert.equal(validatePublicHostnameProbe(packet).ok, true);
});

test('rejects malformed hostnames before DNS or HTTP', async () => {
  await assert.rejects(
    collectPublicHostnameProbe('https://example.pages.dev/', { checkedAt }),
    /hostname is invalid/
  );
});
