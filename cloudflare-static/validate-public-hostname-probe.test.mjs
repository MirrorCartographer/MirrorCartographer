import assert from 'node:assert/strict';
import test from 'node:test';
import { validatePublicHostnameProbe } from './validate-public-hostname-probe.mjs';

function verifiedPacket() {
  return {
    schemaVersion: '1.0.0',
    checkedAt: '2026-07-13T17:20:00.000Z',
    hostname: 'mirror-cartographer-research.pages.dev',
    url: 'https://mirror-cartographer-research.pages.dev/',
    classification: 'identity_verified',
    claim: 'Public hostname serves the expected research-surface identity; this is not exact-commit or control-plane deployment proof.',
    dns: { ipv4: ['192.0.2.10'], ipv6: [], errors: [] },
    http: { status: 200, finalUrl: 'https://mirror-cartographer-research.pages.dev/', redirected: false },
    identity: { ok: true, markers: ['mirror-cartographer-research'] }
  };
}

test('accepts a coherent identity-verified packet with a narrow claim', () => {
  const result = validatePublicHostnameProbe(verifiedPacket());
  assert.equal(result.ok, true);
  assert.equal(result.authorizedClaim, 'public_reachability_and_surface_identity_only');
});

test('rejects identity_verified when identity.ok is false', () => {
  const packet = verifiedPacket();
  packet.identity.ok = false;
  const result = validatePublicHostnameProbe(packet);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /identity\.ok=true/);
});

test('rejects reachable evidence without DNS resolution', () => {
  const packet = verifiedPacket();
  packet.dns.ipv4 = [];
  const result = validatePublicHostnameProbe(packet);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /DNS resolution evidence/);
});

test('rejects a non-canonical hostname URL pairing', () => {
  const packet = verifiedPacket();
  packet.url = 'https://example.com/';
  const result = validatePublicHostnameProbe(packet);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /canonical HTTPS root/);
});

test('accepts unresolved only with null HTTP and identity evidence', () => {
  const packet = verifiedPacket();
  packet.classification = 'unresolved';
  packet.claim = 'No public deployment claim is authorized.';
  packet.dns = { ipv4: [], ipv6: [], errors: [{ family: 'ipv4', code: 'ENOTFOUND', message: 'not found' }] };
  packet.http = null;
  packet.identity = null;
  const result = validatePublicHostnameProbe(packet);
  assert.equal(result.ok, true);
  assert.equal(result.authorizedClaim, 'none');
});

test('rejects unresolved packets that smuggle HTTP evidence', () => {
  const packet = verifiedPacket();
  packet.classification = 'unresolved';
  packet.dns = { ipv4: [], ipv6: [], errors: [] };
  packet.identity = null;
  const result = validatePublicHostnameProbe(packet);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /http=null/);
});
