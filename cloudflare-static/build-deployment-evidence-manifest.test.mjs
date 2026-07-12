import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDeploymentEvidenceManifest } from './build-deployment-evidence-manifest.mjs';

function fixture(names=['a.json','b.json']) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-manifest-'));
  for (const name of names) fs.writeFileSync(path.join(directory, name), JSON.stringify({name}));
  return directory;
}

const base = { sourceCommit: 'a'.repeat(40), runId: '12345', generatedAt: '2026-07-12T15:56:05.000Z' };

test('binds exact bytes in deterministic path order', () => {
  const directory = fixture();
  const first = buildDeploymentEvidenceManifest({ directory, files:['b.json','a.json'], ...base });
  const second = buildDeploymentEvidenceManifest({ directory, files:['a.json','b.json'], ...base });
  assert.deepEqual(first, second);
  assert.deepEqual(first.evidence_files.map(x => x.path), ['a.json','b.json']);
  assert.match(first.manifest_sha256, /^[0-9a-f]{64}$/);
});

test('changes digest when evidence bytes change', () => {
  const directory = fixture();
  const before = buildDeploymentEvidenceManifest({ directory, files:['a.json','b.json'], ...base });
  fs.writeFileSync(path.join(directory, 'a.json'), '{"changed":true}');
  const after = buildDeploymentEvidenceManifest({ directory, files:['a.json','b.json'], ...base });
  assert.notEqual(before.manifest_sha256, after.manifest_sha256);
  assert.notEqual(before.evidence_files[0].sha256, after.evidence_files[0].sha256);
});

test('fails closed for missing, empty, duplicate, or unsafe paths', () => {
  const directory = fixture(['a.json']);
  fs.writeFileSync(path.join(directory, 'empty.json'), '');
  assert.throws(() => buildDeploymentEvidenceManifest({ directory, files:['missing.json'], ...base }), /missing-evidence-file/);
  assert.throws(() => buildDeploymentEvidenceManifest({ directory, files:['empty.json'], ...base }), /empty-evidence-file/);
  assert.throws(() => buildDeploymentEvidenceManifest({ directory, files:['a.json','a.json'], ...base }), /duplicate-evidence-path/);
  assert.throws(() => buildDeploymentEvidenceManifest({ directory, files:['..\/secret'], ...base }), /unsafe-evidence-path/);
});

test('rejects invalid immutable run provenance', () => {
  const directory = fixture(['a.json']);
  assert.throws(() => buildDeploymentEvidenceManifest({ directory, files:['a.json'], sourceCommit:'main', runId:'123' }), /invalid-source-commit/);
  assert.throws(() => buildDeploymentEvidenceManifest({ directory, files:['a.json'], sourceCommit:'a'.repeat(40), runId:'0' }), /invalid-run-id/);
});
