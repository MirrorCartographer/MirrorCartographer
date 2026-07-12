import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPagesHostnameAuthority } from './build-pages-hostname-authority.mjs';

function probe(overrides = {}) {
  return {
    schema_version: '1.2.0',
    ready: true,
    target_project: {
      name: 'mirror-cartographer-research',
      found: true,
      canonical_hostname: 'mirror-cartographer-research-a1b2.pages.dev',
      custom_domains: ['research.example.org']
    },
    privacy: {
      secret_values_emitted: false,
      account_id_emitted: false,
      unrelated_project_names_emitted: false
    },
    ...overrides
  };
}

test('emits canonical authority from a privacy-safe ready probe', () => {
  const result = buildPagesHostnameAuthority(probe());
  assert.equal(result.claim, 'canonical-hostname-observed');
  assert.equal(result.canonical_origin, 'https://mirror-cartographer-research-a1b2.pages.dev');
  assert.equal(result.authority, 'sanitized-direct-pages-project-probe');
});

test('binds a Pages preview deployment beneath the canonical hostname', () => {
  const result = buildPagesHostnameAuthority(probe(), 'https://9f2c.mirror-cartographer-research-a1b2.pages.dev/');
  assert.equal(result.deployment.bound, true);
  assert.equal(result.deployment.relation, 'pages-preview');
  assert.equal(result.claim, 'hostname-control-plane-bound');
});

test('preserves an unbound deployment rather than accepting it', () => {
  const result = buildPagesHostnameAuthority(probe(), 'https://mirror-cartographer-research.pages.dev/');
  assert.equal(result.deployment.bound, false);
  assert.equal(result.deployment.relation, 'unbound');
});

test('fails closed when the access probe is not ready', () => {
  assert.throws(() => buildPagesHostnameAuthority(probe({ ready: false })), /access-probe-not-ready/);
});

test('fails closed when privacy assertions are absent or unsafe', () => {
  assert.throws(() => buildPagesHostnameAuthority(probe({ privacy: {} })), /access-probe-privacy-unverified/);
  assert.throws(() => buildPagesHostnameAuthority(probe({ privacy: { secret_values_emitted: false, account_id_emitted: true } })), /access-probe-account-id-exposed/);
});

test('rejects inferred or malformed non-Pages canonical hostnames', () => {
  const bad = probe();
  bad.target_project.canonical_hostname = 'mirror-cartographer-research.example.com';
  assert.throws(() => buildPagesHostnameAuthority(bad), /canonical-hostname-not-pages-dev/);
});

test('is deterministic for equivalent normalized inputs', () => {
  const a = buildPagesHostnameAuthority(probe());
  const bProbe = probe();
  bProbe.target_project.custom_domains = ['research.example.org', 'research.example.org'];
  const b = buildPagesHostnameAuthority(bProbe);
  assert.equal(a.digest_sha256, b.digest_sha256);
});
