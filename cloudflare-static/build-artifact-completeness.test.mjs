import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildArtifactCompleteness } from './build-artifact-completeness.mjs';

function fixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-artifacts-'));
  for (const [name, value] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), typeof value === 'string' ? value : JSON.stringify(value));
  }
  return dir;
}

const always = [
  'cloudflare-deployment-readiness.json', 'cloudflare-access-probe.json',
  'cloudflare-deployment-blocker.json', 'cloudflare-deployment-decision.json',
  'cloudflare-deployment-proof.json', 'cloudflare-deployment-proof.intoto.json',
  'cloudflare-deployment-proof.signature-verification.json',
  'cloudflare-evidence-verification-input.json', 'cloudflare-deployment-acceptance.json'
];

function baseFiles(overrides = {}) {
  return Object.fromEntries(always.map((name) => [name, { ok: true }]).concat(Object.entries(overrides)));
}

test('blocked run permits deployment-only artifacts to be absent', () => {
  const dir = fixture(baseFiles({
    'cloudflare-access-probe.json': { ok: false },
    'cloudflare-deployment-decision.json': { deployStepOutcome: 'skipped' }
  }));
  const result = buildArtifactCompleteness({ directory: dir });
  assert.equal(result.complete, true);
  assert.equal(result.artifacts.find((x) => x.name === 'cloudflare-deployment-metadata.json').classification, 'missing_expected');
});

test('authorized access requires hostname authority', () => {
  const dir = fixture(baseFiles({
    'cloudflare-access-probe.json': { ok: true },
    'cloudflare-deployment-decision.json': { deployStepOutcome: 'skipped' }
  }));
  const result = buildArtifactCompleteness({ directory: dir });
  assert.equal(result.complete, false);
  assert.deepEqual(result.missing_required, ['cloudflare-pages-hostname-authority.json']);
});

test('successful deployment requires metadata and served proof stream', () => {
  const dir = fixture(baseFiles({
    'cloudflare-access-probe.json': { ok: true },
    'cloudflare-deployment-decision.json': { deployStepOutcome: 'success' },
    'cloudflare-pages-hostname-authority.json': { ok: true }
  }));
  const result = buildArtifactCompleteness({ directory: dir });
  assert.equal(result.complete, false);
  assert.deepEqual(result.missing_required, [
    'cloudflare-deployment-metadata.json',
    'cloudflare-deployment-proof.ndjson'
  ]);
});

test('successful deployment is complete when all state-required artifacts exist', () => {
  const dir = fixture(baseFiles({
    'cloudflare-access-probe.json': { ok: true },
    'cloudflare-deployment-decision.json': { deployStepOutcome: 'success' },
    'cloudflare-pages-hostname-authority.json': { ok: true },
    'cloudflare-deployment-metadata.json': { ok: true },
    'cloudflare-deployment-proof.ndjson': '{"ok":true}\n'
  }));
  const result = buildArtifactCompleteness({ directory: dir });
  assert.equal(result.complete, true);
  assert.deepEqual(result.missing_required, []);
});
