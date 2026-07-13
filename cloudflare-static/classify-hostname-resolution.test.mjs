import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyHostnameResolution } from './classify-hostname-resolution.mjs';

test('does not confuse control-plane knowledge with DNS resolution', () => {
  const result = classifyHostnameResolution({
    hostname: 'mirror-cartographer-research.pages.dev',
    ipv4: [],
    ipv6: [],
    dns_errors: ['ENOTFOUND']
  });
  assert.equal(result.claim, 'hostname-unresolved');
  assert.equal(result.accepted, false);
  assert.equal(result.evidence_strength, 'no-positive-runtime-evidence');
});

test('DNS answers alone stop at dns-resolved', () => {
  const result = classifyHostnameResolution({
    hostname: 'mirror-cartographer-research.pages.dev',
    ipv4: ['192.0.2.10'],
    ipv6: ['2001:db8::10']
  });
  assert.equal(result.claim, 'dns-resolved');
  assert.equal(result.accepted, false);
  assert.equal(result.evidence_strength, 'dns-only');
});

test('served identity without exact commit remains insufficient', () => {
  const result = classifyHostnameResolution({
    hostname: 'mirror-cartographer-research.pages.dev',
    ipv4: ['192.0.2.10'],
    http: {
      completed: true,
      status: 200,
      resolved_url: 'https://mirror-cartographer-research.pages.dev/',
      identity_verified: true,
      deployed_commit_verified: false
    }
  });
  assert.equal(result.claim, 'research-surface-served');
  assert.equal(result.accepted, false);
  assert.equal(result.evidence_strength, 'dns-plus-http-plus-served-identity');
});

test('accepts only DNS, HTTP, identity, and exact commit together', () => {
  const result = classifyHostnameResolution({
    hostname: 'mirror-cartographer-research.pages.dev',
    ipv4: ['192.0.2.10'],
    http: {
      completed: true,
      status: 200,
      resolved_url: 'https://mirror-cartographer-research.pages.dev/',
      identity_verified: true,
      deployed_commit_verified: true
    }
  });
  assert.equal(result.claim, 'deployed-commit-served');
  assert.equal(result.accepted, true);
  assert.deepEqual(result.contradictions, []);
});

test('flags retained-evidence contradictions', () => {
  const result = classifyHostnameResolution({
    hostname: 'mirror-cartographer-research.pages.dev',
    ipv4: [],
    ipv6: [],
    http: {
      completed: true,
      status: 200,
      identity_verified: true,
      deployed_commit_verified: true
    }
  });
  assert.equal(result.accepted, false);
  assert.deepEqual(result.contradictions, ['http-reachable-without-retained-dns-answer']);
});
