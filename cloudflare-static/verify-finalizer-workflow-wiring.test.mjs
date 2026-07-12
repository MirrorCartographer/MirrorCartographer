import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyFinalizerWorkflowWiring } from './verify-finalizer-workflow-wiring.mjs';

const wired = `
node --test cloudflare-static/finalize-deployment-evidence.test.mjs
- name: Finalize and verify exact deployment evidence manifest
  run: node cloudflare-static/finalize-deployment-evidence.mjs . cloudflare-deployment-evidence-manifest.json
cloudflare-deployment-evidence-manifest.json
Atomic evidence manifest:
`;

test('accepts only a workflow containing all required finalizer wiring', () => {
  const result = verifyFinalizerWorkflowWiring(wired);
  assert.equal(result.status, 'wired');
  assert.deepEqual(result.missing, []);
  assert.ok(result.checks.every((check) => check.present));
});

test('reports every missing wiring component without approximation', () => {
  const result = verifyFinalizerWorkflowWiring('name: incomplete workflow');
  assert.equal(result.status, 'not_wired');
  assert.deepEqual(result.missing, [
    'finalizer-test',
    'finalizer-step',
    'manifest-upload',
    'manifest-summary'
  ]);
});

test('reports a partial workflow as not wired', () => {
  const result = verifyFinalizerWorkflowWiring(`${wired}\n`.replace('Atomic evidence manifest:', ''));
  assert.equal(result.status, 'not_wired');
  assert.deepEqual(result.missing, ['manifest-summary']);
});

test('rejects absent workflow source', () => {
  assert.throws(() => verifyFinalizerWorkflowWiring(''), /workflow-source-required/);
});
