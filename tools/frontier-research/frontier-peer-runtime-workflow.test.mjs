import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const workflowPath = '.github/workflows/frontier-peer-runtime.yml';
const requiredRuntimePaths = Object.freeze([
  'tools/frontier-research/peer-execution-runtime.mjs',
  'tools/frontier-research/filesystem-peer-execution-runtime.mjs',
  'tools/frontier-research/durable-peer-terminal-journal.mjs',
  'tools/frontier-research/filesystem-peer-terminal-store.mjs'
]);
const forbiddenStalePaths = Object.freeze([
  'tools/frontier-research/filesystem-terminal-journal.mjs'
]);

test('workflow references only existing durability runtime modules', async () => {
  const workflow = await readFile(workflowPath, 'utf8');

  for (const path of requiredRuntimePaths) {
    await access(path);
    assert.match(workflow, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
  }

  for (const path of forbiddenStalePaths) {
    assert.doesNotMatch(workflow, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
  }
});

test('workflow executes both the source-binding and durability tests', async () => {
  const workflow = await readFile(workflowPath, 'utf8');
  assert.match(workflow, /node --test tools\/frontier-research\/frontier-peer-runtime-workflow\.test\.mjs/);
  assert.match(workflow, /node --test tools\/frontier-research\/filesystem-peer-execution-runtime\.test\.mjs/);
});

test('workflow remains least privilege and immutable-action pinned', async () => {
  const workflow = await readFile(workflowPath, 'utf8');
  assert.match(workflow, /permissions:\s*\n\s+contents: read/);
  assert.doesNotMatch(workflow, /contents: write|id-token: write|deployments: write/);
  assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/);
  assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/);
});
