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

test('current deployment workflow still states that cryptographic verification is not wired', () => {
  assert.match(workflow, /Signature limit: no cryptographic signature verifier is wired yet/);
  assert.doesNotMatch(workflow, /gh attestation verify cloudflare-deployment-proof\.json/);
});

test('future wiring must use GitHub artifact attestation verification rather than local digest matching', () => {
  assert.match(normalizer, /gh attestation verify/);
  assert.match(normalizer, /transparencyLogVerified/);
  assert.doesNotMatch(normalizer, /createHash|subtle\.digest/);
});
