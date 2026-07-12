import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBlockedDeploymentEvidence } from './build-blocked-deployment-evidence.mjs';

const sourceCommit = 'a'.repeat(40);
const generatedAt = '2026-07-12T00:10:00.000Z';

test('builds a privacy-safe blocked deployment packet', () => {
  const packet = buildBlockedDeploymentEvidence({
    readiness: {
      ready: false,
      missing: ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']
    },
    blocker: { reason_codes: ['missing-cloudflare-credentials'] },
    sourceCommit,
    generatedAt
  });

  assert.equal(packet.deployment_state, 'blocked_external_configuration');
  assert.equal(packet.deployment_proven, false);
  assert.equal(packet.deployment_url, null);
  assert.equal(packet.served_identity_verified, false);
  assert.deepEqual(packet.missing_configuration, [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_API_TOKEN'
  ]);
  assert.equal(packet.privacy.secret_values_emitted, false);
  assert.match(packet.readiness_sha256, /^[0-9a-f]{64}$/);
});

test('rejects an unexpected secret name', () => {
  assert.throws(() => buildBlockedDeploymentEvidence({
    readiness: { ready: false, missing: ['DATABASE_PASSWORD'] },
    sourceCommit,
    generatedAt
  }), /unexpected-secret-name/);
});

test('rejects use after readiness becomes true', () => {
  assert.throws(() => buildBlockedDeploymentEvidence({
    readiness: { ready: true, missing: [] },
    sourceCommit,
    generatedAt
  }), /blocked-packet-requires-not-ready/);
});

test('rejects non-immutable source identity', () => {
  assert.throws(() => buildBlockedDeploymentEvidence({
    readiness: { ready: false, missing: ['CLOUDFLARE_API_TOKEN'] },
    sourceCommit: 'main',
    generatedAt
  }), /invalid-source-commit/);
});
