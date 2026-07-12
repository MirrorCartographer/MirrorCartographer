import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDeploymentEvidenceManifest } from './build-deployment-evidence-manifest.mjs';
import { verifyDeploymentEvidenceManifest } from './verify-deployment-evidence-manifest.mjs';

const files = ['a.json', 'b.json'];
const sourceCommit = 'a'.repeat(40);
const runId = '12345';

function fixture() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-manifest-verify-'));
  fs.writeFileSync(path.join(directory, 'a.json'), '{"a":1}\n');
  fs.writeFileSync(path.join(directory, 'b.json'), '{"b":2}\n');
  const manifest = buildDeploymentEvidenceManifest({ directory, files, sourceCommit, runId, generatedAt: '2026-07-12T16:05:57.000Z' });
  return { directory, manifest };
}

test('accepts an exact complete byte-bound manifest', () => {
  const { directory, manifest } = fixture();
  const result = verifyDeploymentEvidenceManifest({ manifest, directory, requiredFiles: files, expectedSourceCommit: sourceCommit, expectedRunId: runId });
  assert.equal(result.ok, true);
  assert.equal(result.checked_files, 2);
  assert.deepEqual(result.errors, []);
});

test('detects artifact byte tampering', () => {
  const { directory, manifest } = fixture();
  fs.writeFileSync(path.join(directory, 'a.json'), '{"a":9}\n');
  const result = verifyDeploymentEvidenceManifest({ manifest, directory, requiredFiles: files });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('digest-mismatch:a.json'));
});

test('detects source and workflow run substitution', () => {
  const { directory, manifest } = fixture();
  const result = verifyDeploymentEvidenceManifest({ manifest, directory, requiredFiles: files, expectedSourceCommit: 'b'.repeat(40), expectedRunId: '999' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('source-commit-mismatch'));
  assert.ok(result.errors.includes('run-id-mismatch'));
});

test('rejects missing, extra, or reordered evidence entries', () => {
  const { directory, manifest } = fixture();
  const altered = { ...manifest, evidence_files: [...manifest.evidence_files].reverse() };
  const result = verifyDeploymentEvidenceManifest({ manifest: altered, directory, requiredFiles: files });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('evidence-paths-not-sorted'));
  assert.ok(result.errors.includes('required-evidence-set-mismatch'));
  assert.ok(result.errors.includes('manifest-digest-mismatch'));
});
