import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { runEffectiveQueueDiscovery } from './discover-effective-queue.mjs';
import { selectOwnedActionableItem, verifyAndSelectOwnedItem } from './select-owned-effective-queue-item.mjs';

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'mc-eqs-'));
  git(cwd, 'init', '-q');
  git(cwd, 'config', 'user.email', 'continuity@example.invalid');
  git(cwd, 'config', 'user.name', 'Continuity Test');
  mkdirSync(join(cwd, 'operations', 'queue-updates'), { recursive: true });
  writeFileSync(join(cwd, 'operations', 'ACTIVE_QUEUE.json'), JSON.stringify({
    schema_version: '1.0.0',
    updated_at: '2026-07-12T00:00:00Z',
    items: [
      { id: 'M-001', owner: 'continuity_mining', priority: 0, status: 'completed', action: 'Build index', dependencies: [] },
      { id: 'M-014', owner: 'continuity_mining', priority: 0, status: 'active', action: 'Select verified work', dependencies: ['M-001'] },
      { id: 'M-015', owner: 'continuity_mining', priority: 1, status: 'queued', action: 'Later work', dependencies: ['M-014'] },
      { id: 'V-001', owner: 'vercel_studio', priority: 0, status: 'active', action: 'Audio work', dependencies: [] }
    ]
  }));
  git(cwd, 'add', '.');
  git(cwd, 'commit', '-qm', 'fixture');
  return cwd;
}

test('selects the highest-priority owned item whose dependencies are terminal', () => {
  const cwd = fixture();
  const artifact = runEffectiveQueueDiscovery({ cwd });
  const result = verifyAndSelectOwnedItem({ cwd, artifact, owner: 'continuity_mining' });
  assert.equal(result.accepted, true);
  assert.equal(result.selected, true);
  assert.equal(result.item.id, 'M-014');
});

test('does not return work owned by another team', () => {
  const artifact = {
    effective_items: [
      { id: 'V-001', owner: 'vercel_studio', priority: 0, status: 'active', dependencies: [] }
    ]
  };
  const result = selectOwnedActionableItem({ artifact, owner: 'continuity_mining' });
  assert.equal(result.selected, false);
  assert.equal(result.item, null);
  assert.ok(result.errors.some((error) => error.code === 'EQS-004'));
});

test('skips a higher-priority item with unresolved dependencies and selects the next actionable item', () => {
  const artifact = {
    effective_items: [
      { id: 'M-020', owner: 'continuity_mining', priority: 0, status: 'active', dependencies: ['R-999'] },
      { id: 'M-021', owner: 'continuity_mining', priority: 1, status: 'queued', dependencies: [] }
    ]
  };
  const result = selectOwnedActionableItem({ artifact, owner: 'continuity_mining' });
  assert.equal(result.selected, true);
  assert.equal(result.item.id, 'M-021');
});

test('fails closed before selection when artifact contents are tampered', () => {
  const cwd = fixture();
  const artifact = runEffectiveQueueDiscovery({ cwd });
  artifact.effective_items.find((item) => item.id === 'M-014').priority = -100;
  const result = verifyAndSelectOwnedItem({ cwd, artifact, owner: 'continuity_mining' });
  assert.equal(result.accepted, false);
  assert.equal(result.selected, false);
  assert.equal(result.item, null);
  assert.ok(result.verification.errors.some((error) => error.code === 'EQA-009'));
});

test('fails closed when every owned item is blocked by missing or non-terminal dependencies', () => {
  const artifact = {
    effective_items: [
      { id: 'M-030', owner: 'continuity_mining', priority: 0, status: 'active', dependencies: ['M-999'] },
      { id: 'M-031', owner: 'continuity_mining', priority: 1, status: 'queued', dependencies: ['M-030'] }
    ]
  };
  const result = selectOwnedActionableItem({ artifact, owner: 'continuity_mining' });
  assert.equal(result.selected, false);
  assert.equal(result.item, null);
  assert.equal(result.errors.length, 2);
  assert.ok(result.errors.every((error) => error.code === 'EQS-003'));
});
