import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const normalizerPath = new URL('./normalize-github-attestation-verification.mjs', import.meta.url);
const workflowPath = new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url);
const normalizer = fs.readFileSync(normalizerPath, 'utf8');
const workflow = fs.readFileSync(workflowPath, 'utf8');

test('cryptographic verification adapter is deny by default and exact-identity scoped', () => {
  assert.match(normalizer, /status: 'not_verified'/);
  assert.match(normalizer, /verifiedSourceRepository/);
  assert.match(normalizer, /signerWorkflow/);
  assert.match(normalizer, /sha256:\[a-f0-9\]\{64\}/);
});

test('deployment workflow signs and verifies exact proof bytes', () => {
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /attestations: write/);
  assert.match(workflow, /actions\/attest-build-provenance@v3/);
  assert.match(workflow, /subject-path: cloudflare-deployment-proof\.json/);
  assert.match(workflow, /gh attestation verify cloudflare-deployment-proof\.json/);
  assert.match(workflow, /normalize-github-attestation-verification\.mjs/);
  assert.match(workflow, /cloudflare-deployment-proof\.signature-verification\.json/);
});

test('acceptance remains an explicit conjunction of provenance and claim checks', () => {
  assert.match(workflow, /acceptance-must-equal-all-required-checks/);
  assert.match(workflow, /signatureVerification\?\.status === 'verified'/);
  assert.match(workflow, /claimEvidence\?\.status === 'valid'/);
});

test('verification uses GitHub artifact attestations rather than local digest matching', () => {
  assert.match(normalizer, /gh attestation verify/);
  assert.match(normalizer, /transparencyLogVerified/);
  assert.doesNotMatch(normalizer, /createHash|subtle\.digest/);
});
