import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { generateEffectiveQueue } from './generate-effective-queue.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'effective-queue-'));
  const canonicalPath = path.join(root, 'ACTIVE_QUEUE.json');
  const updatesDir = path.join(root, 'queue-updates');
  const outputPath = path.join(root, 'generated', 'EFFECTIVE_QUEUE.json');
  fs.mkdirSync(updatesDir, { recursive: true });
  fs.writeFileSync(canonicalPath, JSON.stringify({ items: [{ id: 'M-001', owner: 'continuity_mining', status: 'active' }] }));
  return { root, canonicalPath, updatesDir, outputPath };
}

function writeUpdate(dir, name, update) {
  fs.writeFileSync(path.join(dir, name), JSON.stringify(update));
}

test('discovers sorted updates and writes a derived effective queue', () => {
  const paths = fixture();
  writeUpdate(paths.updatesDir, 'b.json', { item_id: 'M-002', owner: 'continuity_mining', status: 'queued', updated_at: '2026-07-12T01:01:00-04:00' });
  writeUpdate(paths.updatesDir, 'a.json', { item_id: 'M-001', owner: 'continuity_mining', status: 'completed', updated_at: '2026-07-12T01:00:00-04:00' });

  const result = generateEffectiveQueue(paths);
  assert.equal(result.update_file_count, 2);
  assert.equal(result.effective_items.find((item) => item.id === 'M-001').status, 'completed');
  assert.equal(result.effective_items.find((item) => item.id === 'M-002').status, 'queued');
  assert.equal(JSON.parse(fs.readFileSync(paths.outputPath, 'utf8')).generated_kind, 'derived_effective_queue');
});

test('writes conflict evidence and then fails closed', () => {
  const paths = fixture();
  const timestamp = '2026-07-12T01:00:00-04:00';
  writeUpdate(paths.updatesDir, 'a.json', { item_id: 'M-001', status: 'completed', updated_at: timestamp });
  writeUpdate(paths.updatesDir, 'b.json', { item_id: 'M-001', status: 'blocked', updated_at: timestamp });

  assert.throws(() => generateEffectiveQueue(paths), /unresolved conflicts/);
  const output = JSON.parse(fs.readFileSync(paths.outputPath, 'utf8'));
  assert.equal(output.conflicts.length, 1);
  assert.equal(output.conflicts[0].reason, 'concurrent_materially_different_updates');
});

test('fails closed on malformed update identity', () => {
  const paths = fixture();
  writeUpdate(paths.updatesDir, 'bad.json', { status: 'completed', updated_at: '2026-07-12T01:00:00-04:00' });
  assert.throws(() => generateEffectiveQueue(paths), /missing item_id/);
});

test('fails closed when the update ledger is empty', () => {
  const paths = fixture();
  assert.throws(() => generateEffectiveQueue(paths), /No queue update files found/);
});
