import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { runEffectiveQueueDiscovery } from './discover-effective-queue.mjs';
import { verifyEffectiveQueueArtifact } from './verify-effective-queue-artifact.mjs';

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'mc-eqa-'));
  git(cwd, 'init', '-q');
  git(cwd, 'config', 'user.email', 'continuity@example.invalid');
  git(cwd, 'config', 'user.name', 'Continuity Test');
  mkdirSync(join(cwd, 'operations', 'queue-updates'), { recursive: true });
  writeFileSync(join(cwd, 'operations', 'ACTIVE_QUEUE.json'), JSON.stringify({
    schema_version: '1.0.0', updated_at: '2026-07-12T00:00:00Z', items: [{
      id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'active', action: 'Recover history', dependencies: []
    }]
  }));
  writeFileSync(join(cwd, 'operations', 'queue-updates', 'M-001.json'), JSON.stringify({
    schema_version: '1.0.0', item_id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed', action: 'Recover history', dependencies: [], updated_at: '2026-07-12T00:01:00Z'
  }));
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-qm', 'fixture');
  return cwd;
}

test('accepts an artifact regenerated from the exact checked-out commit', () => {
  const cwd = fixture();
  const artifact = runEffectiveQueueDiscovery({ cwd });
  const result = verifyEffectiveQueueArtifact({ cwd, artifact });
  assert.equal(result.accepted, true);
  assert.deepEqual(result.errors, []);
});

test('rejects a valid-looking artifact from a different commit', () => {
  const cwd = fixture();
  const artifact = runEffectiveQueueDiscovery({ cwd });
  writeFileSync(join(cwd, 'README.md'), 'later state\n');
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-qm', 'later');
  const result = verifyEffectiveQueueArtifact({ cwd, artifact });
  assert.equal(result.accepted, false);
  assert.ok(result.errors.some((error) => error.code === 'EQA-002'));
});

test('rejects tampered queue contents even when source_commit and gate_status remain plausible', () => {
  const cwd = fixture();
  const artifact = runEffectiveQueueDiscovery({ cwd });
  artifact.effective_items[0].status = 'active';
  const result = verifyEffectiveQueueArtifact({ cwd, artifact });
  assert.equal(result.accepted, false);
  assert.ok(result.errors.some((error) => error.code === 'EQA-009'));
});

test('rejects a tampered manifest or blob set', () => {
  const cwd = fixture();
  const artifact = runEffectiveQueueDiscovery({ cwd });
  artifact.input_manifest_sha256 = '0'.repeat(64);
  artifact.input_update_blob_shas = [];
  const result = verifyEffectiveQueueArtifact({ cwd, artifact });
  assert.equal(result.accepted, false);
  assert.ok(result.errors.some((error) => error.code === 'EQA-006'));
  assert.ok(result.errors.some((error) => error.code === 'EQA-008'));
});
