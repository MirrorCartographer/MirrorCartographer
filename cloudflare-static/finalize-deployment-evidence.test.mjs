import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { finalizeDeploymentEvidence } from './finalize-deployment-evidence.mjs';
import { REQUIRED_EVIDENCE_FILES } from './build-deployment-evidence-manifest.mjs';

function fixture() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-evidence-finalize-'));
  for (const [index, file] of REQUIRED_EVIDENCE_FILES.entries()) {
    fs.writeFileSync(path.join(directory, file), `${JSON.stringify({ index, file })}\n`);
  }
  return directory;
}

const sourceCommit = 'a'.repeat(40);
const runId = '123456';
const generatedAt = '2026-07-12T16:12:00.000Z';

test('writes and verifies one exact manifest', () => {
  const directory = fixture();
  const result = finalizeDeploymentEvidence({ directory, sourceCommit, runId, generatedAt });
  assert.equal(result.verification.ok, true);
  assert.equal(result.verification.checked_files, REQUIRED_EVIDENCE_FILES.length);
  assert.equal(result.manifest.source_commit, sourceCommit);
  assert.equal(result.manifest.workflow_run_id, runId);
  assert.equal(fs.existsSync(path.join(directory, 'cloudflare-deployment-evidence-manifest.json')), true);
});

test('fails closed when required evidence is missing', () => {
  const directory = fixture();
  fs.rmSync(path.join(directory, REQUIRED_EVIDENCE_FILES[0]));
  assert.throws(
    () => finalizeDeploymentEvidence({ directory, sourceCommit, runId, generatedAt }),
    /missing-evidence-file/
  );
  assert.equal(fs.existsSync(path.join(directory, 'cloudflare-deployment-evidence-manifest.json')), false);
});

test('refuses to overwrite an existing manifest', () => {
  const directory = fixture();
  fs.writeFileSync(path.join(directory, 'cloudflare-deployment-evidence-manifest.json'), '{}\n');
  assert.throws(
    () => finalizeDeploymentEvidence({ directory, sourceCommit, runId, generatedAt }),
    /manifest-output-exists/
  );
});
