import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runEnvironmentPreflight } from './run-environment-preflight.mjs';

function fixture(workflow) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-preflight-'));
  const workflowPath = path.join(dir, 'workflow.yml');
  const requirementsPath = path.join(dir, 'requirements.json');
  const contractOutputPath = path.join(dir, 'contract.json');
  const evidenceOutputPath = path.join(dir, 'evidence.json');
  fs.writeFileSync(workflowPath, workflow);
  fs.writeFileSync(requirementsPath, JSON.stringify({
    environment: 'cloudflare-research',
    provider: 'Cloudflare Pages',
    project_name: 'mirror-cartographer-research',
    workflow: '.github/workflows/cloudflare-pages-research.yml',
    required_secrets: [
      { name: 'CLOUDFLARE_ACCOUNT_ID' },
      { name: 'CLOUDFLARE_API_TOKEN' }
    ]
  }));
  return { dir, workflowPath, requirementsPath, contractOutputPath, evidenceOutputPath };
}

test('writes a fail-closed contract and bounded evidence packet for matching declarations', () => {
  const files = fixture('jobs:\n  deploy:\n    environment: cloudflare-research\n    env:\n      A: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}\n      T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n');
  const result = runEnvironmentPreflight({
    ...files,
    source: {
      repository: 'MirrorCartographer/MirrorCartographer',
      commit_sha: 'a'.repeat(40)
    }
  });
  assert.equal(result.evidence.ready_for_dispatch, true);
  assert.equal(JSON.parse(fs.readFileSync(files.contractOutputPath)).ok, true);
  assert.equal(JSON.parse(fs.readFileSync(files.evidenceOutputPath)).evidence_strength, 'repository_declaration_only');
});

test('records mismatch and does not mark dispatch ready', () => {
  const files = fixture('jobs:\n  deploy:\n    environment: wrong\n    env:\n      A: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}\n');
  const result = runEnvironmentPreflight({ ...files });
  assert.equal(result.evidence.ready_for_dispatch, false);
  assert.deepEqual(result.workflowContract.errors, [
    'environment-name-mismatch',
    'required-secret-reference-missing'
  ]);
});

test('outputs contain secret names but never secret values', () => {
  const files = fixture('jobs:\n  deploy:\n    environment: cloudflare-research\n    env:\n      A: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}\n      T: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n');
  runEnvironmentPreflight({ ...files });
  const text = fs.readFileSync(files.evidenceOutputPath, 'utf8');
  assert.match(text, /CLOUDFLARE_API_TOKEN/);
  assert.doesNotMatch(text, /super-secret-value/);
});
