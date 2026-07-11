import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflowPath = new URL('../.github/workflows/independent-site-pages.yml', import.meta.url);
const identityPath = new URL('./identity.json', import.meta.url);
const htmlPath = new URL('./index.html', import.meta.url);

const workflow = await readFile(workflowPath, 'utf8');
const identity = JSON.parse(await readFile(identityPath, 'utf8'));
const html = await readFile(htmlPath, 'utf8');

test('deploys only the independent static surface', () => {
  assert.match(workflow, /path: \.pages-artifact/);
  assert.match(workflow, /cp independent-site\/index\.html/);
  assert.match(workflow, /cp independent-site\/identity\.json/);
  assert.doesNotMatch(workflow, /mirror-cartographer-ui|cloudflare-static|payment|checkout/i);
});

test('records immutable deployment identity', () => {
  for (const token of ['GITHUB_REPOSITORY', 'GITHUB_SHA', 'GITHUB_WORKFLOW', 'GITHUB_RUN_ID', 'GITHUB_RUN_ATTEMPT']) {
    assert.ok(workflow.includes(token), `missing ${token}`);
  }
  assert.match(workflow, /deployment-identity\.json/);
});

test('uses least-privilege Pages permissions and serialized deployment', () => {
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /group: independent-site-pages/);
  assert.match(workflow, /cancel-in-progress: true/);
});

test('preserves the declared independent identity', () => {
  assert.equal(identity.site_id, 'unreliable-observatory');
  assert.equal(identity.independence_boundary.forbidden.includes('product funnel'), true);
  assert.match(html, /The Unreliable Observatory/);
  assert.doesNotMatch(html, /Mirror Cartographer|pricing|subscribe|checkout/i);
});
