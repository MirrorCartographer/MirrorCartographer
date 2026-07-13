import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync(new URL('../.github/workflows/cloudflare-promotion-consistency-audit.yml', import.meta.url), 'utf8');

function requireFragment(fragment) {
  assert.notEqual(workflow.indexOf(fragment), -1, `missing workflow fragment: ${fragment}`);
}

test('audit is bound to the completed deployment workflow and exact head commit', () => {
  requireFragment('workflow_run:');
  requireFragment('workflows: ["Deploy Cloudflare research surface"]');
  requireFragment('ref: ${{ github.event.workflow_run.head_sha }}');
  requireFragment('cloudflare-deployment-proof-$SOURCE_SHA');
});

test('audit downloads retained evidence before validating exact proof bytes', () => {
  const download = workflow.indexOf('gh run download');
  const validate = workflow.indexOf('node cloudflare-static/validate-promotion-consistency.mjs');
  assert.ok(download >= 0 && validate > download);
  requireFragment('audited-evidence/cloudflare-deployment-proof.json');
  requireFragment('audited-evidence/cloudflare-deployment-acceptance.json');
  requireFragment('audited-evidence/cloudflare-evidence-promotion-decision.json');
});

test('audit has read-only source permissions and retains only its bounded verdict', () => {
  requireFragment('actions: read');
  requireFragment('contents: read');
  assert.equal(workflow.includes('deployments: write'), false);
  assert.equal(workflow.includes('pages deploy'), false);
  requireFragment('path: cloudflare-promotion-consistency.json');
});
