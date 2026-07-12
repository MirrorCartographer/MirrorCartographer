import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync(new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url), 'utf8');

test('workflow runs the Cloudflare access capability probe without exposing secrets', () => {
  assert.match(workflow, /id: access_probe/);
  assert.match(workflow, /node cloudflare-static\/probe-cloudflare-access\.mjs cloudflare-access-probe\.json/);
  assert.match(workflow, /continue-on-error: true/);
});

test('deployment is gated on a successful capability probe', () => {
  assert.match(workflow, /if: steps\.access_probe\.outcome == 'success'/);
});

test('access probe is preserved in proof and uploaded artifacts', () => {
  assert.match(workflow, /access_probe: fs\.existsSync\('cloudflare-access-probe\.json'\)/);
  assert.match(workflow, /cloudflare-access-probe\.json/);
});
