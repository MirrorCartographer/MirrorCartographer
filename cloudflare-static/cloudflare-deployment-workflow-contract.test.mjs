import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const deployPath = new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url);
const contractPath = new URL('../.github/workflows/cloudflare-research-contracts.yml', import.meta.url);

function read(url) {
  return fs.readFileSync(url, 'utf8');
}

function requireFragments(source, fragments, label) {
  for (const fragment of fragments) {
    assert.ok(
      source.includes(fragment),
      `${label} is missing required fail-closed fragment: ${fragment}`
    );
  }
}

test('deployment workflow preserves the complete evidence chain', () => {
  const workflow = read(deployPath);

  requireFragments(workflow, [
    'environment: cloudflare-research',
    'permissions:',
    'contents: read',
    'id-token: write',
    'attestations: write',
    'node --test cloudflare-static/research-surface-identity.test.mjs',
    'node --test cloudflare-static/validate-deployment-proof.test.mjs',
    'node --test cloudflare-static/validate-deployment-proof-freshness.test.mjs',
    'node --test cloudflare-static/run-hostname-evidence-gate.test.mjs',
    'continue-on-error: true',
    "if: steps.access_probe.outcome == 'success'",
    'cloudflare/wrangler-action@',
    '--commit-hash=${{ github.sha }}',
    'Verify served identity',
    'Enforce exact-commit hostname evidence gate',
    'Sign exact deployment proof bytes',
    'gh attestation verify cloudflare-deployment-proof.json',
    'Evaluate deployment evidence acceptance',
    'Enforce promotion consistency before evidence finalization',
    'Finalize and verify exact deployment evidence manifest',
    'Upload proof artifacts'
  ], 'deployment workflow');
});

test('contract workflow watches deployment changes and executes this guard', () => {
  const workflow = read(contractPath);

  requireFragments(workflow, [
    "- '.github/workflows/cloudflare-pages-research.yml'",
    "- '.github/workflows/cloudflare-research-contracts.yml'",
    'node --test cloudflare-static/cloudflare-deployment-workflow-contract.test.mjs',
    'This workflow verifies source contracts only.',
    'It does not establish a live Cloudflare deployment'
  ], 'contract workflow');
});

test('deployment is gated by access probe rather than readiness-file existence alone', () => {
  const workflow = read(deployPath);
  const deployStep = workflow.indexOf('- name: Deploy static research surface');
  const deployGate = workflow.indexOf("if: steps.access_probe.outcome == 'success'", deployStep);
  const wranglerAction = workflow.indexOf('uses: cloudflare/wrangler-action@', deployStep);

  assert.ok(deployStep >= 0, 'deployment step must exist');
  assert.ok(deployGate > deployStep, 'deployment step must be gated by a successful access probe');
  assert.ok(wranglerAction > deployGate, 'Wrangler invocation must occur only after the access gate');
});

test('evidence acceptance occurs after signature verification input is produced', () => {
  const workflow = read(deployPath);
  const verifySignature = workflow.indexOf('- name: Verify GitHub artifact attestation');
  const buildInput = workflow.indexOf('- name: Build explicit verification input manifest');
  const accept = workflow.indexOf('- name: Evaluate deployment evidence acceptance');
  const finalize = workflow.indexOf('- name: Finalize and verify exact deployment evidence manifest');

  assert.ok(verifySignature >= 0, 'signature verification step must exist');
  assert.ok(buildInput > verifySignature, 'verification input must be built after signature verification');
  assert.ok(accept > buildInput, 'acceptance must be evaluated after verification input exists');
  assert.ok(finalize > accept, 'evidence finalization must occur after acceptance evaluation');
});
