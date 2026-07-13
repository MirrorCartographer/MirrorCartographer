import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const workflow = fs.readFileSync(new URL('./cloudflare-research-publication-gate.yml', import.meta.url), 'utf8');

test('runs the policy tests before validating the committed HTML', () => {
  const testCommand = 'node --test cloudflare-static/validate-research-publication-boundary.test.mjs';
  const validateCommand = 'node cloudflare-static/validate-research-publication-boundary.mjs';
  assert.ok(workflow.includes(testCommand));
  assert.ok(workflow.includes(validateCommand));
  assert.ok(workflow.indexOf(testCommand) < workflow.indexOf(validateCommand));
});

test('is triggered for Cloudflare research source changes and main pushes', () => {
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /push:/);
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /cloudflare-static\/\*\*/);
});

test('has read-only repository permission and no deployment or payment action', () => {
  assert.match(workflow, /permissions:\s*\n\s+contents: read/);
  assert.doesNotMatch(workflow, /wrangler-action|pages deploy|stripe|paypal/i);
});

test('retains the exact boundary result as an artifact', () => {
  assert.match(workflow, /cloudflare-research-publication-boundary\.json/);
  assert.match(workflow, /actions\/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02/);
  assert.match(workflow, /if-no-files-found: error/);
});
