import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const workflowPath = new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url);
const workflow = fs.readFileSync(workflowPath, 'utf8');

test('workflow grants only the additional permissions required for GitHub artifact attestations', () => {
  assert.match(workflow, /permissions:\n(?:[ ]{2}.+\n)*[ ]{2}id-token: write\n/);
  assert.match(workflow, /permissions:\n(?:[ ]{2}.+\n)*[ ]{2}attestations: write\n/);
});

test('workflow signs the exact deployment proof artifact with the pinned provenance action', () => {
  assert.match(workflow, /uses: actions\/attest-build-provenance@v3\n[ ]{8}with:\n[ ]{10}subject-path: cloudflare-deployment-proof\.json/);
});

test('workflow cryptographically verifies the proof against the exact source repository', () => {
  assert.match(workflow, /gh attestation verify cloudflare-deployment-proof\.json/);
  assert.match(workflow, /--repo "\$GITHUB_REPOSITORY"/);
  assert.match(workflow, /> cloudflare-deployment-proof\.signature-verification\.json/);
});

test('verification evidence is uploaded and the run summary does not claim unsigned acceptance', () => {
  assert.match(workflow, /cloudflare-deployment-proof\.signature-verification\.json/);
  assert.doesNotMatch(workflow, /Signature limit: no cryptographic signature verifier is wired yet/);
  assert.match(workflow, /Signature verification: GitHub artifact attestation generated and verified/);
});
