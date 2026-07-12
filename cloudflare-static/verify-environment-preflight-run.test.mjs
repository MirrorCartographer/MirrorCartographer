import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { verifyEnvironmentPreflightRun } from './verify-environment-preflight-run.mjs';

const repository = 'MirrorCartographer/MirrorCartographer';
const commit = '1234567890abcdef1234567890abcdef12345678';

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-preflight-'));
  const files = {
    'cloudflare-preflight-checkout-sha.txt': `${commit}\n`,
    'cloudflare-workflow-environment-contract.json': `${JSON.stringify({ ok: true })}\n`,
    'cloudflare-environment-preflight.json': `${JSON.stringify({ ready_for_dispatch: true, source: { repository, commit_sha: commit } })}\n`
  };
  for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), body);
  const sums = Object.keys(files).map((name) => `${crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, name))).digest('hex')}  ${name}`).join('\n');
  fs.writeFileSync(path.join(dir, 'cloudflare-environment-preflight.sha256'), `${sums}\n`);
  fs.writeFileSync(path.join(dir, 'cloudflare-environment-preflight-run.json'), `${JSON.stringify({ repository, commit_sha: commit, workflow_ref: `${repository}/.github/workflows/cloudflare-environment-preflight.yml@refs/heads/main`, run_id: '42' })}\n`);
  return dir;
}

test('accepts intact exact-commit bounded evidence', () => {
  const dir = fixture();
  const result = verifyEnvironmentPreflightRun(dir, { repository, commit_sha: commit });
  assert.equal(result.ok, true);
  assert.equal(result.classification, 'repository_declarations_verified');
});

test('rejects changed evidence bytes', () => {
  const dir = fixture();
  fs.appendFileSync(path.join(dir, 'cloudflare-environment-preflight.json'), 'tampered');
  const result = verifyEnvironmentPreflightRun(dir, { repository, commit_sha: commit });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('digest-mismatch:cloudflare-environment-preflight.json'));
});

test('rejects a run bound to another commit', () => {
  const dir = fixture();
  const result = verifyEnvironmentPreflightRun(dir, { repository, commit_sha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('checkout-commit-mismatch'));
  assert.ok(result.errors.includes('manifest-commit-mismatch'));
});

test('rejects forbidden secret-value fields', () => {
  const dir = fixture();
  const evidencePath = path.join(dir, 'cloudflare-environment-preflight.json');
  fs.writeFileSync(evidencePath, `${JSON.stringify({ ready_for_dispatch: true, source: { repository, commit_sha: commit }, secret_value: 'redacted' })}\n`);
  const digestPath = path.join(dir, 'cloudflare-environment-preflight.sha256');
  const lines = fs.readFileSync(digestPath, 'utf8').trim().split(/\r?\n/).map((line) => line.endsWith('cloudflare-environment-preflight.json') ? `${crypto.createHash('sha256').update(fs.readFileSync(evidencePath)).digest('hex')}  cloudflare-environment-preflight.json` : line);
  fs.writeFileSync(digestPath, `${lines.join('\n')}\n`);
  const result = verifyEnvironmentPreflightRun(dir, { repository, commit_sha: commit });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes('forbidden-field:secret_value'));
});
