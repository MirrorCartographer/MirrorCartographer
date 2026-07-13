import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflowUrl = new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url);
const workflow = fs.readFileSync(workflowUrl, 'utf8');

function indexOfRequired(fragment) {
  const index = workflow.indexOf(fragment);
  assert.notEqual(index, -1, `workflow must contain ${fragment}`);
  return index;
}

test('promotion contract test is part of the workflow gate', () => {
  indexOfRequired('node --test cloudflare-static/build-evidence-promotion-decision.test.mjs');
  indexOfRequired('node --test cloudflare-static/cloudflare-promotion-workflow-contract.test.mjs');
});

test('promotion decision is composed after acceptance and before consistency/finalization', () => {
  const acceptance = indexOfRequired('- name: Evaluate deployment evidence acceptance');
  const promotion = indexOfRequired('- name: Compose fail-closed evidence promotion decision');
  const consistency = indexOfRequired('- name: Validate cross-artifact deployment consistency');
  const finalization = indexOfRequired('- name: Finalize and verify exact deployment evidence manifest');
  assert.ok(acceptance < promotion);
  assert.ok(promotion < consistency);
  assert.ok(promotion < finalization);
});

test('promotion output is retained by the atomic artifact path', () => {
  const promotionStep = indexOfRequired('cloudflare-evidence-promotion-decision.json\n\n      - name: Validate cross-artifact');
  const artifactEntry = workflow.lastIndexOf('            cloudflare-evidence-promotion-decision.json');
  const finalization = indexOfRequired('- name: Finalize and verify exact deployment evidence manifest');
  assert.ok(promotionStep < finalization);
  assert.ok(artifactEntry > finalization);
});

test('summary preserves epistemic and medical claim boundaries', () => {
  indexOfRequired('they do not establish scientific or medical truth');
  indexOfRequired('requires the same proof digest across acceptance and all trust decisions');
});
