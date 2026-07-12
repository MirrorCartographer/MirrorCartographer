import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { materializeMissingDeploymentEvidence } from './materialize-missing-deployment-evidence.mjs';

const sha = 'a'.repeat(40);

test('writes explicit unavailable records for missing conditional evidence', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-evidence-'));
  const result = materializeMissingDeploymentEvidence({ directory, sourceCommit: sha, runId: '42', generatedAt: '2026-07-12T16:00:00.000Z' });
  assert.deepEqual(result.written.sort(), ['cloudflare-deployment-metadata.json', 'cloudflare-pages-hostname-authority.json']);
  for (const name of result.written) {
    const record = JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
    assert.equal(record.status, 'unavailable');
    assert.equal(record.acceptance_effect, 'must-not-support-deployment-acceptance');
    assert.equal(record.source_commit, sha);
  }
});

test('preserves real evidence and never overwrites it', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-evidence-'));
  const target = path.join(directory, 'cloudflare-deployment-metadata.json');
  fs.writeFileSync(target, '{"status":"verified"}\n');
  const result = materializeMissingDeploymentEvidence({ directory, sourceCommit: sha, runId: '42' });
  assert.ok(result.preserved.includes('cloudflare-deployment-metadata.json'));
  assert.equal(fs.readFileSync(target, 'utf8'), '{"status":"verified"}\n');
});
