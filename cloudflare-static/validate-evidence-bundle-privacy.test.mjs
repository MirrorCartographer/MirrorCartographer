import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { inspectEvidenceArtifact, validateEvidenceFiles } from './validate-evidence-bundle-privacy.mjs';

test('accepts bounded provenance fields and HTTPS deployment URLs', () => {
  const result = inspectEvidenceArtifact({
    schemaVersion: '1.0.0',
    deploymentUrl: 'https://abc.pages.dev',
    sourceCommit: 'a'.repeat(40),
    diagnostics: [{ code: 10000, classification: 'authentication-failed' }]
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.violations, []);
});

test('rejects provider message fields even when the value appears harmless', () => {
  const result = inspectEvidenceArtifact({ errors: [{ code: 10000, message: 'authentication failed' }] });
  assert.equal(result.ok, false);
  assert.deepEqual(result.violations, [{ path: '$.errors[0].message', reason: 'forbidden-key' }]);
});

test('rejects secret-shaped bearer values under otherwise neutral keys', () => {
  const result = inspectEvidenceArtifact({ diagnostic: 'Bearer abcdefghijklmnopqrstuvwxyz123456' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.violations, [{ path: '$.diagnostic', reason: 'secret-shaped-value' }]);
});

test('fails closed for malformed or missing JSON files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-privacy-'));
  const malformed = path.join(dir, 'bad.json');
  fs.writeFileSync(malformed, '{');
  const result = validateEvidenceFiles([malformed, path.join(dir, 'missing.json')]);
  assert.equal(result.status, 'rejected');
  assert.equal(result.files.every((file) => file.ok === false), true);
});

test('accepts a complete sanitized bundle', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-privacy-'));
  const first = path.join(dir, 'readiness.json');
  const second = path.join(dir, 'proof.json');
  fs.writeFileSync(first, JSON.stringify({ status: 'ready', missing: [] }));
  fs.writeFileSync(second, JSON.stringify({ deploymentUrl: 'https://abc.pages.dev', commit: 'b'.repeat(40) }));
  const result = validateEvidenceFiles([first, second]);
  assert.equal(result.status, 'accepted');
  assert.equal(result.files.length, 2);
});
